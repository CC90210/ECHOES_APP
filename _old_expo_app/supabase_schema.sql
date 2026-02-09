-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email varchar(255) unique not null,
  full_name varchar(255),
  birth_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Questions Table
create table public.questions (
  id serial primary key,
  category varchar(100), -- 'identity', 'legacy', etc.
  question_text text not null,
  follow_up_prompts text[],
  created_at timestamp with time zone default now()
);

-- Echoes Table
create table public.echoes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  question_id integer references public.questions(id),
  question_text text, -- Fallback if question deleted or custom
  audio_url text not null,
  duration_seconds integer,
  recorded_at timestamp with time zone default now(),
  context_notes text,
  unlock_type varchar(50) check (unlock_type in ('immediate', 'time', 'event', 'recipient')),
  unlock_date timestamp with time zone,
  unlock_event varchar(255),
  is_public boolean default false,
  is_locked boolean default true,
  transcription text,
  tags text[]
);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.echoes enable row level security;
alter table public.questions enable row level security;

-- Policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can view their own echoes"
  on public.echoes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own echoes"
  on public.echoes for insert
  with check (auth.uid() = user_id);

create policy "Questions are readable by everyone"
  on public.questions for select
  using (true);
