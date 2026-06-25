export const SOCIAL_PLATFORMS = [
  "INSTAGRAM",
  "FACEBOOK",
  "LINKEDIN",
  "X",
  "TIKTOK",
  "YOUTUBE"
] as const;

export const CONNECTION_TYPES = ["MANUAL", "API_CONNECTED"] as const;
export const ACCOUNT_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export type ConnectionType = (typeof CONNECTION_TYPES)[number];
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(value as SocialPlatform);
}

export function isConnectionType(value: string): value is ConnectionType {
  return CONNECTION_TYPES.includes(value as ConnectionType);
}

export function isAccountStatus(value: string): value is AccountStatus {
  return ACCOUNT_STATUSES.includes(value as AccountStatus);
}
