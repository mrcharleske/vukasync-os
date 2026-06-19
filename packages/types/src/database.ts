export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type WorkspaceMembershipRole = "OWNER" | "ADMIN" | "MEMBER";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";
export type WorkspaceStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string;
          workspace_id: string | null;
          actor_profile_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id?: string | null;
          actor_profile_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          actor_profile_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      platform_roles: {
        Row: {
          code: string;
          description: string;
          created_at: string;
        };
        Insert: {
          code: string;
          description: string;
          created_at?: string;
        };
        Update: {
          code?: string;
          description?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          platform_role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          platform_role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          platform_role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      service_catalog: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          workspace_id: string;
          catalog_service_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          catalog_service_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          catalog_service_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          code: string;
          name: string;
          monthly_price_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          monthly_price_cents: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          monthly_price_cents?: number;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          workspace_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          starts_at: string;
          ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          plan_id: string;
          status?: SubscriptionStatus;
          starts_at?: string;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          plan_id?: string;
          status?: SubscriptionStatus;
          starts_at?: string;
          ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_invitations: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          role: WorkspaceMembershipRole;
          token: string;
          status: InvitationStatus;
          invited_by: string | null;
          accepted_by: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          email: string;
          role?: WorkspaceMembershipRole;
          token?: string;
          status?: InvitationStatus;
          invited_by?: string | null;
          accepted_by?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          email?: string;
          role?: WorkspaceMembershipRole;
          token?: string;
          status?: InvitationStatus;
          invited_by?: string | null;
          accepted_by?: string | null;
          expires_at?: string;
          created_at?: string;
        };
      };
      workspace_members: {
        Row: {
          id: number;
          workspace_id: string;
          profile_id: string;
          role: WorkspaceMembershipRole;
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          workspace_id: string;
          profile_id: string;
          role?: WorkspaceMembershipRole;
          invited_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          workspace_id?: string;
          profile_id?: string;
          role?: WorkspaceMembershipRole;
          invited_by?: string | null;
          created_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: WorkspaceStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: WorkspaceStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          status?: WorkspaceStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      invitation_status: InvitationStatus;
      subscription_status: SubscriptionStatus;
      workspace_membership_role: WorkspaceMembershipRole;
      workspace_status: WorkspaceStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
