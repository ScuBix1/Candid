-- Enums
do $$ begin
  create type application_status as enum (
    'sent',
    'in_progress',
    'interview',
    'offer',
    'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type interview_type as enum (
    'rh',
    'technical',
    'culture_fit',
    'case_study',
    'other'
  );
exception when duplicate_object then null;
end $$;

-- =========================================
-- Table applications
-- =========================================
create table if not exists applications (
  id               uuid               primary key default gen_random_uuid(),
  user_id          uuid               not null references auth.users(id) on delete cascade,
  company          text               not null,
  role             text               not null,
  location         text,
  status           application_status not null default 'sent',
  source           text,
  notes            text,
  salary           text,
  applied_at       date               not null default current_date,
  last_activity_at timestamptz        not null default now(),
  created_at       timestamptz        not null default now(),
  updated_at       timestamptz        not null default now()
);

-- =========================================
-- Table interviews
-- =========================================
create table if not exists interviews (
  id             uuid           primary key default gen_random_uuid(),
  application_id uuid           not null references applications(id) on delete cascade,
  user_id        uuid           not null references auth.users(id) on delete cascade,
  scheduled_at   timestamptz    not null,
  type           interview_type not null default 'other',
  notes          text,
  created_at     timestamptz    not null default now(),
  updated_at     timestamptz    not null default now()
);

-- =========================================
-- Trigger updated_at
-- =========================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger applications_updated_at
  before update on applications
  for each row execute function update_updated_at();

create or replace trigger interviews_updated_at
  before update on interviews
  for each row execute function update_updated_at();

-- =========================================
-- Index
-- =========================================
create index if not exists applications_user_id_idx on applications(user_id);
create index if not exists applications_status_idx on applications(status);
create index if not exists applications_last_activity_idx on applications(last_activity_at);
create index if not exists interviews_application_id_idx on interviews(application_id);
create index if not exists interviews_scheduled_at_idx on interviews(scheduled_at);

-- =========================================
-- RLS applications
-- =========================================
alter table applications enable row level security;

do $$ begin
  create policy "Users can only access their own applications"
  on applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

-- =========================================
-- RLS interviews
-- =========================================
alter table interviews enable row level security;

do $$ begin
  create policy "Users can only access their own interviews"
  on interviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;