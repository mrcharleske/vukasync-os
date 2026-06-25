"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

function toErrorPath(path: string, message: string) {
  const params = new URLSearchParams({ error: message });
  return `${path}?${params.toString()}`;
}

function getOrigin(headerValue: string | null) {
  return headerValue ?? "http://localhost:3000";
}

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/onboarding");

  if (!email || !password) {
    redirect(toErrorPath("/login", "Email and password are required."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(toErrorPath("/login", error.message));
  }

  redirect(nextPath);
}

export async function loginWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const origin = getOrigin((await headers()).get("origin"));
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`
    }
  });

  if (error || !data.url) {
    redirect(toErrorPath("/login", error?.message ?? "Failed to start Google sign-in."));
  }

  redirect(data.url);
}
