import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <h1>VukaSync OS</h1>
      <p>
        A workspace-based client portal and business services platform for global
        teams.
      </p>

      <div className="card">
        <h2>Get started</h2>
        <p>Authenticate first, then create or join your workspace.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/signup" className="button">
            Sign up
          </Link>
          <Link href="/login" className="button secondary">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
