import Link from "next/link";

type VerifyPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const email = params?.email;

  return (
    <main>
      <h1>Verify your email</h1>
      <div className="card">
        <p>
          We sent a verification link to <strong>{email ?? "your email"}</strong>.
        </p>
        <p>Verify your email first, then login to continue onboarding.</p>
      </div>
      <p>
        Already verified? <Link href="/login">Go to login</Link>.
      </p>
    </main>
  );
}
