import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type VerifyPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const email = params?.email;

  return (
    <main className="auth-page">
      <div className="auth-page-inner">
        <PageHeader
          title="Verify your email"
          subtitle="Confirm your inbox first, then continue onboarding."
        />
        <Card className="auth-card">
          <p>
            We sent a verification link to <strong>{email ?? "your email"}</strong>.
          </p>
          <p>After verification, login to continue your workspace setup.</p>
        </Card>
        <p className="auth-footer">
          Already verified? <Link href="/login">Go to login</Link>.
        </p>
      </div>
    </main>
  );
}
