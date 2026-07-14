create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  ai_generations_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

alter table profiles enable row level security;

create policy "Users can only access their own profile"
on profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function create_profile_on_signup()
returns trigger as $$
begin
  insert into public.profiles(id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function create_profile_on_signup();