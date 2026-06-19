create table if not exists public.platform_roles (
  code text primary key,
  description text not null,
  created_at timestamptz not null default timezone('utc', now())
);

insert into public.platform_roles (code, description)
values
  ('SUPER_ADMIN', 'Global platform administrator'),
  ('FOUNDER', 'Founder account with bootstrap rights'),
  ('WORKSPACE_MEMBER', 'Default authenticated user role')
on conflict (code) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  platform_role text not null references public.platform_roles (code) default 'WORKSPACE_MEMBER',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists auth_user_created_profile on auth.users;
create trigger auth_user_created_profile
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();
