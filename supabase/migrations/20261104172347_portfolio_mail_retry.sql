create table public.portfolio_worker_config (
  id boolean primary key default true check(id),
  token_hash text not null
);
alter table public.portfolio_worker_config enable row level security;
revoke all on public.portfolio_worker_config from public, anon, authenticated;
grant select on public.portfolio_worker_config to service_role;
do $setup$
declare token text := gen_random_uuid()::text || gen_random_uuid()::text;
begin
  if exists(select 1 from vault.secrets where name='portfolio_mail_retry_token') then
    raise exception 'Portfolio retry secret already exists; no existing secret will be overwritten';
  end if;
  perform vault.create_secret(token, 'portfolio_mail_retry_token', 'Portfolio-only email retry worker');
  insert into public.portfolio_worker_config(token_hash) values(encode(extensions.digest(token, 'sha256'), 'hex'));
end;
$setup$;
create function public.portfolio_retry_authorized(p_token_hash text)
returns boolean language sql security invoker set search_path='' as $check$
  select exists(select 1 from public.portfolio_worker_config where token_hash=p_token_hash);
$check$;
revoke execute on function public.portfolio_retry_authorized(text) from public, anon, authenticated;
grant execute on function public.portfolio_retry_authorized(text) to service_role;
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule(
  'portfolio-mail-retry',
  '*/5 * * * *',
  $job$
    select net.http_post(
      url := 'https://dgdxvdercbfikmystyob.supabase.co/functions/v1/portfolio-inquiry',
      headers := jsonb_build_object('Content-Type', 'application/json', 'apikey', 'sb_publishable_UnXcqjKLWjn-fCU5E-U8pA_U5297oXS', 'x-portfolio-retry-token', (select decrypted_secret from vault.decrypted_secrets where name='portfolio_mail_retry_token')),
      body := '{"operation":"retry"}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$
);
