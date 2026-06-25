insert into public.service_catalog (code, name, description)
values
  ('BOOKKEEPING', 'Bookkeeping', 'Baseline bookkeeping service'),
  ('PAYROLL', 'Payroll', 'Payroll operations service'),
  ('TAX_PREP', 'Tax Preparation', 'Tax prep and filing service')
on conflict (code) do update
set name = excluded.name,
    description = excluded.description;

insert into public.subscription_plans (code, name, monthly_price_cents)
values
  ('FREE', 'Free', 0),
  ('STARTER', 'Starter', 9900),
  ('GROWTH', 'Growth', 24900)
on conflict (code) do update
set name = excluded.name,
    monthly_price_cents = excluded.monthly_price_cents;
