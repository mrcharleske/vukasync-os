-- Phase 3C: append-only audit logging foundation.

create table public.audit_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete set null,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  visibility text not null default 'internal',
  source text not null default 'system',
  ip_address inet,
  user_agent text,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_check
    check (action in (
      'WORKSPACE_CREATED',
      'INVITATION_SENT',
      'INVITATION_ACCEPTED',
      'SERVICE_ASSIGNED',
      'SUBSCRIPTION_CREATED',
      'SUBSCRIPTION_CHANGED',
      'ROLE_CHANGED'
    )),
  constraint audit_logs_entity_type_not_blank_check
    check (length(trim(entity_type)) > 0),
  constraint audit_logs_visibility_check
    check (visibility in ('platform', 'internal', 'workspace')),
  constraint audit_logs_source_check
    check (source in ('manual', 'automation', 'integration', 'system'))
);

create index audit_logs_workspace_created_at_idx
on public.audit_logs (workspace_id, created_at);

create index audit_logs_actor_id_idx
on public.audit_logs (actor_id);

create index audit_logs_action_idx
on public.audit_logs (action);

create index audit_logs_entity_idx
on public.audit_logs (entity_type, entity_id);

create index audit_logs_visibility_idx
on public.audit_logs (visibility);

create index audit_logs_source_idx
on public.audit_logs (source);
