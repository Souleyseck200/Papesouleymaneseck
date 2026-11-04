-- Portfolio only. No existing Maison table, policy, role or function is altered.
create table public.portfolio_inquiries (
  id uuid primary key,
  reference text generated always as ('PSS-' || upper(substr(replace(id::text, '-', ''), 1, 12))) stored,
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 30000),
  fingerprint text not null check (length(fingerprint) = 64),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent')),
  email_attempts integer not null default 0,
  email_error text,
  next_attempt_at timestamptz not null default now(),
  lease_until timestamptz,
  created_at timestamptz not null default now(),
  emailed_at timestamptz
);
create index portfolio_inquiries_pending_idx on public.portfolio_inquiries (next_attempt_at) where email_status = 'pending';
create table public.portfolio_intake_limits (
  ip_hash text not null check (length(ip_hash) = 64),
  window_start timestamptz not null,
  attempts integer not null check (attempts > 0),
  primary key (ip_hash, window_start)
);
create index portfolio_intake_limits_expiry_idx on public.portfolio_intake_limits (window_start);
alter table public.portfolio_inquiries enable row level security;
alter table public.portfolio_intake_limits enable row level security;
revoke all on public.portfolio_inquiries, public.portfolio_intake_limits from public, anon, authenticated;
grant select, insert, update, delete on public.portfolio_inquiries, public.portfolio_intake_limits to service_role;

create function public.portfolio_intake(p_id uuid, p_payload jsonb, p_fingerprint text, p_ip_hash text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  old_row public.portfolio_inquiries;
  new_row public.portfolio_inquiries;
  total integer;
  slot timestamptz := date_bin(interval '10 minutes', now(), timestamptz '2000-01-01');
begin
  select * into old_row from public.portfolio_inquiries where id = p_id;
  if found then
    if old_row.fingerprint <> p_fingerprint then return jsonb_build_object('outcome', 'conflict'); end if;
    return jsonb_build_object('outcome', 'duplicate', 'id', old_row.id, 'reference', old_row.reference, 'email_status', old_row.email_status);
  end if;
  delete from public.portfolio_intake_limits where window_start < now() - interval '1 day';
  insert into public.portfolio_intake_limits (ip_hash, window_start, attempts) values (p_ip_hash, slot, 1)
  on conflict (ip_hash, window_start) do update set attempts = public.portfolio_intake_limits.attempts + 1
  returning attempts into total;
  if total > 5 then return jsonb_build_object('outcome', 'limited'); end if;
  insert into public.portfolio_inquiries (id, payload, fingerprint) values (p_id, p_payload, p_fingerprint)
  on conflict (id) do nothing returning * into new_row;
  if not found then
    select * into new_row from public.portfolio_inquiries where id = p_id;
    if new_row.fingerprint <> p_fingerprint then return jsonb_build_object('outcome', 'conflict'); end if;
  end if;
  return jsonb_build_object('outcome', 'accepted', 'id', new_row.id, 'reference', new_row.reference, 'email_status', new_row.email_status);
end;
$$;

create function public.portfolio_claim_mail(p_id uuid default null, p_limit integer default 1)
returns setof jsonb language sql security invoker set search_path = '' as $$
  with picked as (
    select id from public.portfolio_inquiries
    where email_status = 'pending' and next_attempt_at <= now()
      and (lease_until is null or lease_until < now()) and (p_id is null or id = p_id)
    order by created_at for update skip locked limit greatest(1, least(p_limit, 10))
  ), claimed as (
    update public.portfolio_inquiries i set lease_until = now() + interval '90 seconds', email_attempts = email_attempts + 1
    from picked where i.id = picked.id returning i.*
  )
  select jsonb_build_object('id', id, 'reference', reference, 'payload', payload, 'created_at', created_at) from claimed;
$$;

create function public.portfolio_finish_mail(p_id uuid, p_sent boolean, p_error text default null)
returns void language sql security invoker set search_path = '' as $$
  update public.portfolio_inquiries set
    email_status = case when p_sent then 'sent' else 'pending' end,
    emailed_at = case when p_sent then now() else null end,
    lease_until = null,
    email_error = case when p_sent then null else left(p_error, 200) end,
    next_attempt_at = now() + make_interval(secs => least(3600, (60 * power(2, least(email_attempts, 6)))::integer))
  where id = p_id;
$$;

revoke execute on function public.portfolio_intake(uuid,jsonb,text,text) from public, anon, authenticated;
revoke execute on function public.portfolio_claim_mail(uuid,integer) from public, anon, authenticated;
revoke execute on function public.portfolio_finish_mail(uuid,boolean,text) from public, anon, authenticated;
grant execute on function public.portfolio_intake(uuid,jsonb,text,text), public.portfolio_claim_mail(uuid,integer), public.portfolio_finish_mail(uuid,boolean,text) to service_role;
comment on table public.portfolio_inquiries is 'Private project requests from the Pape Souleymane Seck portfolio. Independent of Maison application tables.';
