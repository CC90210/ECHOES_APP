-- Trigger to create a public user record when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Buckets Setup (Run this in SQL Editor)
insert into storage.buckets (id, name, public) 
values ('echoes-audio', 'echoes-audio', false)
on conflict do nothing;

-- Storage Policies
create policy "Authenticated users can upload audio"
on storage.objects for insert
with check ( bucket_id = 'echoes-audio' and auth.role() = 'authenticated' );

create policy "Users can view their own audio"
on storage.objects for select
using ( bucket_id = 'echoes-audio' and auth.uid() = owner );
