import Link from "next/link";
import { MailCheck } from "lucide-react";
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
    <main className="auth-shell">
      <section className="auth-shell-panel">
        <p className="auth-shell-kicker">Verification Required</p>
        <h1>One final step before entering your workspace.</h1>
        <p>Confirm your email to unlock secure onboarding and workspace creation.</p>
        <ul>
          <li>
            <MailCheck size={16} />
            Verification keeps your workspace protected
          </li>
        </ul>
      </section>

      <section className="auth-shell-form">
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
      </section>
    </main>
  );
}
