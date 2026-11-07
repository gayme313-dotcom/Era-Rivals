begin;
do $$
declare clubs jsonb; a jsonb; b jsonb; tok_a text; tok_b text; lid text; tid text; i int;
begin
 select jsonb_agg(jsonb_build_object('name','Club '||t,'players',(select jsonb_agg(jsonb_build_object('id',t||'-'||p,'name','Player '||t||'-'||p,'pos','PG','overall',75)) from generate_series(1,5)p))) into clubs from generate_series(1,8)t;
 a:=public.franchise_league('create',jsonb_build_object('name','Rollback test','nickname','Coach A','sport','nba','team','Club 1','clubs',clubs));tok_a:=a->>'token';lid:=a->'league'->>'id';
 b:=public.franchise_league('join',jsonb_build_object('code',a->'league'->>'code','nickname','Coach B','team','Club 2'));tok_b:=b->>'token';
 if tok_a is null or tok_b is null then raise exception 'FAIL tokens';end if;
 begin perform public.franchise_league('load',jsonb_build_object('token','bad-token','league_id',lid));raise exception 'FAIL unauthorized load';exception when others then if SQLERRM like 'FAIL%' then raise;end if;end;
 begin perform public.franchise_league('advance',jsonb_build_object('token',tok_b,'league_id',lid,'week',0,'season',1));raise exception 'FAIL non-owner advances';exception when others then if SQLERRM like 'FAIL%' then raise;end if;end;
 a:=public.franchise_league('propose',jsonb_build_object('token',tok_a,'league_id',lid,'target_team','Club 2','give','1-1','take','2-1'));tid:=a->'trades'->0->>'id';
 begin perform public.franchise_league('respond',jsonb_build_object('token',tok_a,'league_id',lid,'trade_id',tid,'response','accept'));raise exception 'FAIL proposer accepts own trade';exception when others then if SQLERRM like 'FAIL%' then raise;end if;end;
 b:=public.franchise_league('respond',jsonb_build_object('token',tok_b,'league_id',lid,'trade_id',tid,'response','counter','give','2-2','take','1-2'));
 a:=public.franchise_league('respond',jsonb_build_object('token',tok_a,'league_id',lid,'trade_id',tid,'response','accept'));
 if not exists(select 1 from jsonb_array_elements(a->'league'->'state'->'clubs')c cross join lateral jsonb_array_elements(c->'players')p where c->>'name'='Club 1' and p->>'id'='2-2') then raise exception 'FAIL trade ownership';end if;
 begin perform public.franchise_league('advance',jsonb_build_object('token',tok_a,'league_id',lid,'week',0,'season',1));raise exception 'FAIL missing plans';exception when others then if SQLERRM like 'FAIL%' then raise;end if;end;
 for i in 0..6 loop
  perform public.franchise_league('plan',jsonb_build_object('token',tok_a,'league_id',lid,'style','attack'));
  perform public.franchise_league('plan',jsonb_build_object('token',tok_b,'league_id',lid,'style','rest'));
  a:=public.franchise_league('advance',jsonb_build_object('token',tok_a,'league_id',lid,'week',i,'season',1));
  if (a->'league'->'state'->>'week')::int<>i+1 then raise exception 'FAIL advancing';end if;
  if exists(select 1 from jsonb_array_elements(a->'league'->'state'->'clubs')c where (c->>'w')::int+(c->>'l')::int+(c->>'d')::int<>i+1) then raise exception 'FAIL fixtures';end if;
  begin perform public.franchise_league('advance',jsonb_build_object('token',tok_a,'league_id',lid,'week',i,'season',1));raise exception 'FAIL duplicate round';exception when others then if SQLERRM like 'FAIL%' then raise;end if;end;
 end loop;
 a:=public.franchise_league('next_season',jsonb_build_object('token',tok_a,'league_id',lid));
 if (a->'league'->'state'->>'season')::int<>2 or (a->'league'->'state'->>'week')::int<>0 then raise exception 'FAIL next season';end if;
 if has_table_privilege('anon','era_private.sessions','SELECT') or has_table_privilege('authenticated','era_private.leagues','UPDATE') then raise exception 'FAIL table grants';end if;
end $$;
select 'PASS guest permissions, invitations, counteroffers, ownership transfer, ready checks, duplicate-round protection, seven-round season and next season' as result;
rollback;
