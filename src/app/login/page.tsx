import Link from "next/link";
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
    <main>
      <h1>Login</h1>
      <p>Access your workspace and business command center.</p>

      <div className="card">
        <form action={loginWithPassword}>
          <input type="hidden" name="next" value={nextPath} />
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" required />
          </label>
          <button className="button" type="submit">
            Login
          </button>
        </form>

        <form action={loginWithGoogle} style={{ marginTop: "0.75rem" }}>
          <button className="button secondary" type="submit">
            Continue with Google
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}
      </div>

      <p>
        No account yet? <Link href="/signup">Create one</Link>.
      </p>
    </main>
  );
}
