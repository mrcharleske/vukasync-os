-- Phase 3C: Database Backbone & Authentication Foundation
-- Enables extensions required by the initial schema.

create extension if not exists pgcrypto with schema extensions;
