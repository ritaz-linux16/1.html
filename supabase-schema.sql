create table public.posts (
    id bigint generated always as identity primary key,
    body text not null check (char_length(btrim(body)) between 1 and 5000),
    category text not null check (
        category in ('Thoughts', 'Love Story', 'Family', 'Friends Issue', 'Learn', 'Future Thinking')
    ),
    created_at timestamptz not null default now()
);

create table public.comments (
    id bigint generated always as identity primary key,
    post_id bigint not null references public.posts(id) on delete cascade,
    body text not null check (char_length(btrim(body)) between 1 and 1000),
    type text not null check (type in ('Advice', 'Complement', 'Comment')),
    created_at timestamptz not null default now()
);

create index comments_post_id_created_at_idx on public.comments (post_id, created_at);

alter table public.posts enable row level security;
alter table public.comments enable row level security;

create policy "Anyone can read posts"
    on public.posts for select to anon, authenticated
    using (true);

create policy "Anyone can create posts"
    on public.posts for insert to anon, authenticated
    with check (true);

create policy "Anyone can read comments"
    on public.comments for select to anon, authenticated
    using (true);

create policy "Anyone can create comments"
    on public.comments for insert to anon, authenticated
    with check (true);

grant select, insert on public.posts to anon, authenticated;
grant select, insert on public.comments to anon, authenticated;
grant usage, select on sequence public.posts_id_seq to anon, authenticated;
grant usage, select on sequence public.comments_id_seq to anon, authenticated;
