export const PHASE4_SERVICE_CODES = [
  "SOCIAL_MEDIA_MANAGEMENT",
  "WEBSITES_MOBILE_APPS",
  "BUSINESS_SYSTEMS_AUTOMATION",
  "GROWTH_SERVICES"
] as const;

const SERVICE_ORDER = new Map(
  PHASE4_SERVICE_CODES.map((code, index) => [code, index])
);

export function sortPhase4ServicesByOrder<T extends { code: string }>(services: T[]) {
  return [...services].sort((a, b) => {
    const aOrder = SERVICE_ORDER.get(a.code) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = SERVICE_ORDER.get(b.code) ?? Number.MAX_SAFE_INTEGER;
    return aOrder - bOrder;
  });
}
