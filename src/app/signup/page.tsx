import Link from "next/link";
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
    <main>
      <h1>Create your account</h1>
      <p>Email verification is required before workspace creation.</p>

      <div className="card">
        <form action={signUpWithPassword}>
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" minLength={8} required />
          </label>
          <button className="button" type="submit">
            Sign up
          </button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <p>
        Already have an account? <Link href="/login">Login</Link>.
      </p>
    </main>
  );
}
