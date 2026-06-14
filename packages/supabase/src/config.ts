export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseServerConfig = SupabasePublicConfig & {
  serviceRoleKey: string;
};

type Environment = Record<string, string | undefined>;

function requireValue(env: Environment, key: string): string {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getWebSupabaseConfig(env: Environment): SupabasePublicConfig {
  return {
    url: requireValue(env, "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireValue(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY")
  };
}

export function getMobileSupabaseConfig(env: Environment): SupabasePublicConfig {
  return {
    url: requireValue(env, "EXPO_PUBLIC_SUPABASE_URL"),
    anonKey: requireValue(env, "EXPO_PUBLIC_SUPABASE_ANON_KEY")
  };
}

export function getServerSupabaseConfig(env: Environment): SupabaseServerConfig {
  return {
    ...getWebSupabaseConfig(env),
    serviceRoleKey: requireValue(env, "SUPABASE_SERVICE_ROLE_KEY")
  };
}
