import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { redirectIfAuthenticated } from "../../lib/auth/guards";
import { signUpWithPassword } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  await redirectIfAuthenticated();
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="auth-shell">
      <section className="auth-shell-panel">
        <p className="auth-shell-kicker">VukaSync OS</p>
        <h1>Launch a premium workspace in minutes.</h1>
        <p>
          Start with secure identity, then configure clients, services, and social operations in
          one integrated experience.
        </p>
        <ul>
          <li>
            <Sparkles size={16} />
            Fast onboarding with elegant workflows
          </li>
          <li>
            <ShieldCheck size={16} />
            Workspace-first access controls
          </li>
        </ul>
      </section>

      <section className="auth-shell-form">
        <PageHeader
          title="Create your account"
          subtitle="Email verification is required before workspace creation."
        />

        <Card className="auth-card">
          <form action={signUpWithPassword}>
            <label>
              Email
              <Input name="email" type="email" required />
            </label>
            <label>
              Password
              <Input name="password" type="password" minLength={8} required />
            </label>
            <Button type="submit">Sign up</Button>
          </form>
          {error ? <p className="error">{error}</p> : null}
        </Card>

        <p className="auth-footer">
          Already have an account? <Link href="/login">Login</Link>.
        </p>
      </section>
    </main>
  );
}
