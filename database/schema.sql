-- ERA RIVALS: private saves and opt-in casual leaderboards.
create table public.dynasty_saves (
 user_id uuid not null references auth.users(id) on delete cascade,
 slot_id text not null check (char_length(slot_id) between 1 and 100),
 sport text not null check (sport in ('nba','nfl','mlb','soccer')),
 team text not null check (char_length(team) between 1 and 100),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) < 1500000),
 updated_at timestamptz not null default now(),
 primary key (user_id, slot_id)
);
alter table public.dynasty_saves enable row level security;
create policy save_read on public.dynasty_saves for select to authenticated using ((select auth.uid()) = user_id);
create policy save_insert on public.dynasty_saves for insert to authenticated with check ((select auth.uid()) = user_id);
create policy save_update on public.dynasty_saves for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy save_delete on public.dynasty_saves for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.dynasty_saves from anon;
grant select, insert, update, delete on public.dynasty_saves to authenticated;
create table public.dynasty_scores (
 user_id uuid not null references auth.users(id) on delete cascade,
 sport text not null check (sport in ('nba','nfl','mlb','soccer')),
 era text not null check (era in ('current','alltime')),
 nickname text not null check (char_length(nickname) between 1 and 24),
 team text not null check (char_length(team) between 1 and 100),
 score integer not null check (score between 0 and 100000000),
 titles integer not null check (titles between 0 and 10000),
 updated_at timestamptz not null default now(),
 primary key (user_id,sport,era)
);
alter table public.dynasty_scores enable row level security;
create policy scores_read on public.dynasty_scores for select to anon, authenticated using (true);
create policy scores_insert on public.dynasty_scores for insert to authenticated with check ((select auth.uid()) = user_id);
create policy scores_update on public.dynasty_scores for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy scores_delete on public.dynasty_scores for delete to authenticated using ((select auth.uid()) = user_id);
revoke all on public.dynasty_scores from anon, authenticated;
grant select (sport,era,nickname,team,score,titles,updated_at) on public.dynasty_scores to anon, authenticated;
grant insert, update, delete on public.dynasty_scores to authenticated;
create index scores_ranking on public.dynasty_scores(sport,era,score desc);
