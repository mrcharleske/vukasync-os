import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { redirectIfAuthenticated } from "../../lib/auth/guards";
import { loginWithGoogle, loginWithPassword } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;
  const error = params?.error;
  const nextPath = params?.next ?? "/onboarding";

  return (
    <main className="auth-shell">
      <section className="auth-shell-panel">
        <p className="auth-shell-kicker">VukaSync OS</p>
        <h1>Secure workspace access for modern operators.</h1>
        <p>
          Continue where you left off with a premium command center built for service-driven
          businesses.
        </p>
        <ul>
          <li>
            <Sparkles size={16} />
            Unified business operations
          </li>
          <li>
            <LockKeyhole size={16} />
            Authenticated enterprise sessions
          </li>
        </ul>
      </section>

      <section className="auth-shell-form">
        <PageHeader
          title="Welcome back"
          subtitle="Sign in to access your workspace and business command center."
        />

        <Card className="auth-card">
          <form action={loginWithPassword}>
            <input type="hidden" name="next" value={nextPath} />
            <label>
              Email
              <Input name="email" type="email" required />
            </label>
            <label>
              Password
              <Input name="password" type="password" required />
            </label>
            <Button type="submit">Login</Button>
          </form>

          <form action={loginWithGoogle} className="auth-secondary-action">
            <Button type="submit" variant="secondary">
              Continue with Google
            </Button>
          </form>

          {error ? <p className="error">{error}</p> : null}
        </Card>

        <p className="auth-footer">
          No account yet? <Link href="/signup">Create one</Link>.
        </p>
      </section>
    </main>
  );
}
