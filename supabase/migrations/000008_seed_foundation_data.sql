-- Phase 3C: idempotent foundation seed data.

insert into public.platform_roles (key, name, description, is_system)
values
  (
    'SUPER_ADMIN',
    'Super Admin',
    'Full platform-wide access for trusted operators.',
    true
  ),
  (
    'PLATFORM_ADMIN',
    'Platform Admin',
    'Platform-wide operational oversight without ownership of every workspace.',
    true
  )
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  is_system = excluded.is_system,
  updated_at = now(),
  deleted_at = null;

insert into public.services (key, name, description, category, sort_order)
values
  (
    'SOCIAL_MEDIA_MANAGEMENT',
    'Social Media Management',
    'Social media analytics, activity tracking, community engagement logs, content calendars, and reporting.',
    'social_media_management',
    10
  ),
  (
    'WEBSITES_MOBILE_APPS',
    'Websites & Mobile Apps',
    'Project progress tracking, milestones, requirements, file sharing, and launch tracking.',
    'websites_mobile_apps',
    20
  ),
  (
    'BUSINESS_SYSTEMS_AUTOMATION',
    'Business Systems & Automation',
    'CRM projects, internal systems, AI chatbot implementations, and workflow automation projects.',
    'business_systems_automation',
    30
  ),
  (
    'GROWTH_SERVICES',
    'Growth Services',
    'Branding, graphic design, SEO, consulting, and future growth service lines.',
    'growth_services',
    40
  )
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  sort_order = excluded.sort_order,
  status = 'active',
  updated_at = now(),
  deleted_at = null;

insert into public.plans (key, name, description, status, billing_interval, metadata)
values
  (
    'STARTER',
    'Starter',
    'Entry-level package.',
    'active',
    null,
    '{"tier": "starter"}'::jsonb
  ),
  (
    'GROWTH',
    'Growth',
    'Mid-tier package.',
    'active',
    null,
    '{"tier": "growth"}'::jsonb
  ),
  (
    'AUTHORITY',
    'Authority',
    'Premium package.',
    'active',
    null,
    '{"tier": "authority"}'::jsonb
  )
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  billing_interval = excluded.billing_interval,
  metadata = excluded.metadata,
  updated_at = now(),
  deleted_at = null;
