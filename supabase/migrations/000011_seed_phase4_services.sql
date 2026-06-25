insert into public.service_catalog (code, name, description)
values
  (
    'SOCIAL_MEDIA_MANAGEMENT',
    'Social Media Management',
    'Social media analytics, activity tracking, community engagement logs, content calendars, and reporting.'
  ),
  (
    'WEBSITES_MOBILE_APPS',
    'Websites & Mobile Apps',
    'Project progress tracking, milestones, requirements, file sharing, and launch tracking.'
  ),
  (
    'BUSINESS_SYSTEMS_AUTOMATION',
    'Business Systems & Automation',
    'CRM projects, internal systems, AI chatbot implementations, and workflow automation projects.'
  ),
  (
    'GROWTH_SERVICES',
    'Growth Services',
    'Branding, graphic design, SEO, consulting, and future growth service lines.'
  )
on conflict (code) do update
set
  name = excluded.name,
  description = excluded.description;
