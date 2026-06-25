"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

function getOrigin(headerValue: string | null) {
  return headerValue ?? "http://localhost:3000";
}

function toErrorPath(message: string) {
  const params = new URLSearchParams({ error: message });
  return `/signup?${params.toString()}`;
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(toErrorPath("Email and password are required."));
  }

  const supabase = await createSupabaseServerClient();
  const origin = getOrigin((await headers()).get("origin"));
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(toErrorPath(error.message));
  }

  redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
}
