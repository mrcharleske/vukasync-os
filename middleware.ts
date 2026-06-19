import type { NextRequest } from "next/server";
import { updateAuthSession } from "./src/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateAuthSession(request);
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/command-center/:path*"
  ]
};
