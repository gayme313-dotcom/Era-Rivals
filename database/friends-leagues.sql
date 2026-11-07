-- Private casual leagues. Guests hold a random player key; invite codes only grant entry to an unclaimed team.
-- No table is exposed through the public Data API. Every RPC verifies the player key and membership.
create schema if not exists era_private;
revoke all on schema era_private from public;
create table era_private.sessions(token_hash text primary key, player_id uuid not null unique, created_at timestamptz not null default now());
create table era_private.leagues(id uuid primary key default gen_random_uuid(),owner_id uuid not null,name text not null,invite_code text not null unique,sport text not null,state jsonb not null,created_at timestamptz not null default now());
create table era_private.members(league_id uuid references era_private.leagues(id) on delete cascade,player_id uuid not null,team text not null,nickname text not null,plan jsonb,primary key(league_id,player_id),unique(league_id,team));
create table era_private.trades(id uuid primary key default gen_random_uuid(),league_id uuid references era_private.leagues(id) on delete cascade,proposer uuid not null,target uuid not null,give_id text not null,take_id text not null,status text not null default 'pending',expires_week integer not null,season integer not null);
create index er_members_player on era_private.members(player_id,league_id);
create index er_trades_league on era_private.trades(league_id);
alter table era_private.sessions enable row level security;
alter table era_private.leagues enable row level security;
alter table era_private.members enable row level security;
alter table era_private.trades enable row level security;
revoke all on all tables in schema era_private from public,anon,authenticated;

create function era_private.league_action(p_action text,p_payload jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
<<league_action>>
declare
 u uuid; token text; room era_private.leagues%rowtype; member era_private.members%rowtype; target_member era_private.members%rowtype; offer era_private.trades%rowtype;
 state jsonb; clubs jsonb; club jsonb; player jsonb; mine jsonb; theirs jsonb; names text[]; rotation text[]; a text; b text; team text; mode text; star text;
 round integer; season integer; games integer; n integer; i integer; j integer; x integer; y integer; ra numeric; rb numeric; fa numeric; fb numeric; plan_a jsonb; plan_b jsonb; results jsonb:='[]'::jsonb; history jsonb; token_result jsonb:='{}'::jsonb;
begin
 if p_action not in ('create','join','list','load','plan','advance','next_season','propose','respond') then raise exception 'Unknown league action'; end if;
 if octet_length(p_payload::text)>250000 then raise exception 'Request is too large'; end if;
 token:=p_payload->>'token';
 if token is not null then select player_id into u from era_private.sessions where token_hash=encode(sha256(convert_to(token,'UTF8')),'hex'); end if;
 if p_action in ('create','join') and u is null then
  if (select count(*) from era_private.sessions where created_at>now()-interval '1 day')>=500 then raise exception 'Daily guest capacity reached. Try again later.'; end if;
  token:=replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-','');u:=gen_random_uuid();
  insert into era_private.sessions(token_hash,player_id) values(encode(sha256(convert_to(token,'UTF8')),'hex'),u);token_result:=jsonb_build_object('token',token);
 end if;
 if u is null then raise exception 'Create or join a league on this browser first.'; end if;
 if p_action='list' then
  return jsonb_build_object('leagues',coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'name',l.name,'sport',l.sport,'team',m.team)) from era_private.leagues l join era_private.members m on m.league_id=l.id where m.player_id=u),'[]'::jsonb));
 end if;
 if p_action='create' then
  if (select count(*) from era_private.leagues where owner_id=u)>=5 then raise exception 'You can own five leagues.'; end if;
  if char_length(coalesce(p_payload->>'name','')) not between 1 and 40 or char_length(coalesce(p_payload->>'nickname','')) not between 1 and 24 then raise exception 'Enter a league name and nickname.'; end if;
  if coalesce(p_payload->>'sport','') not in ('nba','nfl','soccer','mlb') then raise exception 'Choose a sport.'; end if;
  clubs:=p_payload->'clubs';if jsonb_typeof(clubs) is distinct from 'array' or jsonb_array_length(clubs)<>8 then raise exception 'A friends league needs eight clubs.'; end if;
  if (select count(distinct c->>'name') from jsonb_array_elements(clubs)c)<>8 then raise exception 'Team names must be unique.'; end if;
  for club in select value from jsonb_array_elements(clubs) loop
   if char_length(coalesce(club->>'name','')) not between 1 and 70 or jsonb_typeof(club->'players') is distinct from 'array' or jsonb_array_length(club->'players') not between 5 and 40 then raise exception 'Invalid club roster.'; end if;
   for player in select value from jsonb_array_elements(club->'players') loop
    if char_length(coalesce(player->>'id','')) not between 1 and 100 or char_length(coalesce(player->>'name','')) not between 1 and 100 or coalesce((player->>'overall')::numeric,0) not between 40 and 99 then raise exception 'Invalid player.'; end if;
   end loop;
  end loop;
  if (select count(distinct p->>'id') from jsonb_array_elements(clubs)c cross join lateral jsonb_array_elements(c->'players')p)<>(select count(*) from jsonb_array_elements(clubs)c cross join lateral jsonb_array_elements(c->'players')p) then raise exception 'Player identities must be unique.'; end if;
  team:=p_payload->>'team';if not exists(select 1 from jsonb_array_elements(clubs)c where c->>'name'=team) then raise exception 'Choose a club in the league.'; end if;
  select jsonb_agg(c||jsonb_build_object('w',0,'l',0,'d',0,'fatigue',0,'titles',0)) into clubs from jsonb_array_elements(clubs)c;
  state:=jsonb_build_object('season',1,'week',0,'games',7,'clubs',clubs,'results','[]'::jsonb,'history','[]'::jsonb);
  insert into era_private.leagues(owner_id,name,invite_code,sport,state) values(u,p_payload->>'name',substr(replace(gen_random_uuid()::text,'-',''),1,16),p_payload->>'sport',state) returning * into room;
  insert into era_private.members values(room.id,u,team,p_payload->>'nickname',null);
 elsif p_action='join' then
  select * into room from era_private.leagues where invite_code=lower(p_payload->>'code') for update;if not found then raise exception 'Invite code not found.'; end if;
  if (room.state->>'week')::integer<>0 then raise exception 'Join between seasons, before the first round.'; end if;
  if exists(select 1 from era_private.members where league_id=room.id and player_id=u) then raise exception 'You already manage a team in this league.'; end if;
  if char_length(coalesce(p_payload->>'nickname','')) not between 1 and 24 then raise exception 'Choose a nickname.'; end if;
  -- A visitor can request an unclaimed team by name or receive the first available club.
  select c->>'name' into team from jsonb_array_elements(room.state->'clubs')c where not exists(select 1 from era_private.members m where m.league_id=room.id and m.team=c->>'name') and (coalesce(p_payload->>'team','')='' or c->>'name'=p_payload->>'team') order by c->>'name' limit 1;
  if team is null then raise exception 'That team is unavailable, or the league is full.'; end if;
  insert into era_private.members values(room.id,u,team,p_payload->>'nickname',null);
 else
  select * into room from era_private.leagues where id=(p_payload->>'league_id')::uuid for update;
  if not found then raise exception 'League not found.'; end if;
 end if;
 select * into member from era_private.members where league_id=room.id and player_id=u;if not found then raise exception 'You are not a member of this league.'; end if;
 state:=room.state;round:=(state->>'week')::integer;season:=(state->>'season')::integer;games:=(state->>'games')::integer;
 if p_action='plan' then
  if round>=games then raise exception 'The season is complete.'; end if;
  mode:=p_payload->>'style';if coalesce(mode,'') not in ('attack','defense','rest') then raise exception 'Choose a gameplan.'; end if;
  star:=p_payload->>'featured';if star is not null and star<>'' and not exists(select 1 from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=member.team and p->>'id'=star) then raise exception 'Featured player is not on your team.'; end if;
  update era_private.members set plan=jsonb_build_object('style',mode,'featured',star) where league_id=room.id and player_id=u;
 elsif p_action='advance' then
  if room.owner_id<>u then raise exception 'Only the commissioner can advance the round.'; end if;
  if (p_payload->>'week')::integer is distinct from round or (p_payload->>'season')::integer is distinct from season then raise exception 'Another request already advanced the round. Refresh.'; end if;
  if round>=games then raise exception 'Start the next season first.'; end if;
  if exists(select 1 from era_private.members where league_id=room.id and plan is null) then raise exception 'Every human manager must submit a plan first.'; end if;
  select array_agg(c->>'name' order by c->>'name') into names from jsonb_array_elements(state->'clubs')c;rotation:=names;n:=array_length(rotation,1);
  for j in 1..(round%(n-1)) loop rotation:=array_prepend(rotation[1],array_prepend(rotation[n],rotation[2:n-1]));end loop;
  for i in 1..n/2 loop
   a:=rotation[i];b:=rotation[n+1-i];select c into mine from jsonb_array_elements(state->'clubs')c where c->>'name'=a;select c into theirs from jsonb_array_elements(state->'clubs')c where c->>'name'=b;
   select plan into plan_a from era_private.members where league_id=room.id and era_private.members.team=a;select plan into plan_b from era_private.members where league_id=room.id and era_private.members.team=b;
   plan_a:=coalesce(plan_a,'{"style":"defense"}'::jsonb);plan_b:=coalesce(plan_b,'{"style":"defense"}'::jsonb);
   select avg((p->>'overall')::numeric) into ra from jsonb_array_elements(mine->'players')p;select avg((p->>'overall')::numeric) into rb from jsonb_array_elements(theirs->'players')p;
   fa:=greatest(0,(mine->>'fatigue')::numeric+case plan_a->>'style' when 'rest' then -15 when 'attack' then 8 else 2 end);fb:=greatest(0,(theirs->>'fatigue')::numeric+case plan_b->>'style' when 'rest' then -15 when 'attack' then 8 else 2 end);
   ra:=ra-fa*.08+case plan_a->>'style' when 'attack' then 3 when 'defense' then 1 else 0 end;rb:=rb-fb*.08+case plan_b->>'style' when 'attack' then 3 when 'defense' then 1 else 0 end;
   if coalesce(plan_a->>'featured','')<>'' then ra:=ra+1;end if;if coalesce(plan_b->>'featured','')<>'' then rb:=rb+1;end if;
   if room.sport='nba' then x:=greatest(60,round(102+(ra-rb)*1.2+random()*22-11));y:=greatest(60,round(102+(rb-ra)*1.2+random()*22-11));
   elsif room.sport='nfl' then x:=greatest(0,round(2+(ra-rb)*.07+random()*2))*7+floor(random()*3)*3;y:=greatest(0,round(2+(rb-ra)*.07+random()*2))*7+floor(random()*3)*3;
   elsif room.sport='soccer' then x:=greatest(0,round(1+(ra-rb)*.09+random()*2-1));y:=greatest(0,round(1+(rb-ra)*.09+random()*2-1));
   else x:=greatest(0,round(4+(ra-rb)*.1+random()*5-2));y:=greatest(0,round(4+(rb-ra)*.1+random()*5-2));end if;
   if x=y and room.sport<>'soccer' then if random()<.5 then x:=x+case when room.sport='nfl' then 3 else 1 end;else y:=y+case when room.sport='nfl' then 3 else 1 end;end if;end if;
   mine:=mine||jsonb_build_object('w',(mine->>'w')::integer+case when x>y then 1 else 0 end,'l',(mine->>'l')::integer+case when x<y then 1 else 0 end,'d',(mine->>'d')::integer+case when x=y then 1 else 0 end,'fatigue',least(100,fa));
   theirs:=theirs||jsonb_build_object('w',(theirs->>'w')::integer+case when y>x then 1 else 0 end,'l',(theirs->>'l')::integer+case when y<x then 1 else 0 end,'d',(theirs->>'d')::integer+case when x=y then 1 else 0 end,'fatigue',least(100,fb));
   select jsonb_agg(case when c->>'name'=a then mine when c->>'name'=b then theirs else c end) into clubs from jsonb_array_elements(state->'clubs')c;state:=jsonb_set(state,'{clubs}',clubs);results:=results||jsonb_build_array(jsonb_build_object('a',a,'b',b,'x',x,'y',y));
  end loop;
  state:=state||jsonb_build_object('week',round+1,'results',results);
  if round+1>=games then
   select c->>'name' into team from jsonb_array_elements(state->'clubs')c order by ((c->>'w')::integer*3+(c->>'d')::integer) desc,(c->>'l')::integer,c->>'name' limit 1;
   state:=state||jsonb_build_object('champion',team);select jsonb_agg(case when c->>'name'=team then c||jsonb_build_object('titles',(c->>'titles')::integer+1) else c end) into clubs from jsonb_array_elements(state->'clubs')c;state:=jsonb_set(state,'{clubs}',clubs);
  end if;
  update era_private.leagues set state=league_action.state where id=room.id;update era_private.members set plan=null where league_id=room.id;update era_private.trades set status='expired' where league_id=room.id and status='pending' and expires_week<round+1;
 elsif p_action='next_season' then
  if room.owner_id<>u or round<games then raise exception 'Only the commissioner can start the next completed season.';end if;
  history:=jsonb_build_array(jsonb_build_object('season',season,'champion',state->>'champion'))||coalesce(state->'history','[]'::jsonb);
  select coalesce(jsonb_agg(h),'[]'::jsonb) into history from (select h from jsonb_array_elements(history)h limit 30)q;
  select jsonb_agg(c||jsonb_build_object('w',0,'l',0,'d',0,'fatigue',0,'players',(select jsonb_agg(p||jsonb_build_object('overall',greatest(45,least(99,(p->>'overall')::integer+(floor(random()*5)-2)::integer)))) from jsonb_array_elements(c->'players')p))) into clubs from jsonb_array_elements(state->'clubs')c;
  state:=state||jsonb_build_object('season',season+1,'week',0,'clubs',clubs,'results','[]'::jsonb,'history',history,'champion',null);update era_private.leagues set state=league_action.state where id=room.id;update era_private.members set plan=null where league_id=room.id;update era_private.trades set status='expired' where league_id=room.id and status='pending';
 elsif p_action='propose' then
  if round>4 and round<games then raise exception 'Trades reopen in the offseason.';end if;
  select * into target_member from era_private.members where league_id=room.id and era_private.members.team=p_payload->>'target_team';if not found or target_member.player_id=u then raise exception 'Choose another human-managed club.';end if;
  if not exists(select 1 from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=member.team and p->>'id'=p_payload->>'give') or not exists(select 1 from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=target_member.team and p->>'id'=p_payload->>'take') then raise exception 'A selected player is no longer on that roster.';end if;
  if (select count(*) from era_private.trades where league_id=room.id and proposer=u and status='pending')>=5 then raise exception 'You can have five pending offers.';end if;
  insert into era_private.trades(league_id,proposer,target,give_id,take_id,expires_week,season) values(room.id,u,target_member.player_id,p_payload->>'give',p_payload->>'take',round+2,season);
 elsif p_action='respond' then
  if round>4 and round<games then raise exception 'Trades reopen in the offseason.';end if;
  select * into offer from era_private.trades where id=(p_payload->>'trade_id')::uuid and league_id=room.id for update;
  if not found or offer.target<>u or offer.status<>'pending' or offer.expires_week<round or offer.season<>season then raise exception 'This offer is not available for you to answer.';end if;
  select * into target_member from era_private.members where league_id=room.id and player_id=offer.proposer;
  if p_payload->>'response'='reject' then update era_private.trades set status='rejected' where id=offer.id;
  elsif p_payload->>'response'='counter' then
   if not exists(select 1 from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=member.team and p->>'id'=p_payload->>'give') or not exists(select 1 from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=target_member.team and p->>'id'=p_payload->>'take') then raise exception 'Choose valid players for your counteroffer.';end if;
   update era_private.trades set proposer=u,target=offer.proposer,give_id=p_payload->>'give',take_id=p_payload->>'take',expires_week=round+2 where id=offer.id;
  elsif p_payload->>'response'='accept' then
   select p into mine from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=member.team and p->>'id'=offer.take_id;
   select p into theirs from jsonb_array_elements(state->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'=target_member.team and p->>'id'=offer.give_id;
   if mine is null or theirs is null then raise exception 'A player moved in another trade. Ask for a new offer.';end if;
   select jsonb_agg(case when c->>'name'=member.team then jsonb_set(c,'{players}',(select coalesce(jsonb_agg(p),'[]'::jsonb) from jsonb_array_elements(c->'players')p where p->>'id'<>offer.take_id)||jsonb_build_array(theirs)) when c->>'name'=target_member.team then jsonb_set(c,'{players}',(select coalesce(jsonb_agg(p),'[]'::jsonb) from jsonb_array_elements(c->'players')p where p->>'id'<>offer.give_id)||jsonb_build_array(mine)) else c end) into clubs from jsonb_array_elements(state->'clubs')c;
   state:=jsonb_set(state,'{clubs}',clubs);update era_private.leagues set state=league_action.state where id=room.id;update era_private.trades set status='accepted' where id=offer.id;update era_private.members set plan=null where league_id=room.id and player_id in(u,offer.proposer);
  else raise exception 'Choose accept, reject or counter.';end if;
 end if;
 select * into room from era_private.leagues where id=room.id;
 return token_result||jsonb_build_object('league',jsonb_build_object('id',room.id,'name',room.name,'sport',room.sport,'code',room.invite_code,'commissioner',room.owner_id=u,'myTeam',member.team,'state',room.state),
 'members',(select jsonb_agg(jsonb_build_object('team',m.team,'nickname',m.nickname,'ready',m.plan is not null)) from era_private.members m where m.league_id=room.id),
 'trades',coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'fromTeam',a.team,'toTeam',b.team,'give',t.give_id,'take',t.take_id,'status',t.status,'canRespond',t.target=u,'expires',t.expires_week)) from era_private.trades t join era_private.members a on a.league_id=t.league_id and a.player_id=t.proposer join era_private.members b on b.league_id=t.league_id and b.player_id=t.target where t.league_id=room.id and (t.proposer=u or t.target=u)),'[]'::jsonb));
end $$;
revoke all on function era_private.league_action(text,jsonb) from public;
grant usage on schema era_private to anon,authenticated;
grant execute on function era_private.league_action(text,jsonb) to anon,authenticated;
create function public.franchise_league(p_action text,p_payload jsonb default '{}'::jsonb) returns jsonb language sql security invoker set search_path='' as $$ select era_private.league_action(p_action,p_payload); $$;
revoke all on function public.franchise_league(text,jsonb) from public;
grant execute on function public.franchise_league(text,jsonb) to anon,authenticated;
