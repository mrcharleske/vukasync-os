import { FOUNDATION_STAGE } from "@vukasync/types";
import { foundationBadgeClassName, getFoundationLabel } from "@vukasync/ui";
import { formatFoundationStatus } from "@vukasync/utils";

const architectureItems = [
  "Documentation-first technical foundation",
  "Next.js App Router",
  "Shared TypeScript packages",
  "Tailwind CSS web styling"
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-[1.5rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <span className={foundationBadgeClassName}>{FOUNDATION_STAGE}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">
          VukaSync OS web foundation
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          {formatFoundationStatus("web")} This scaffold exists to validate the
          workspace architecture before product features are implemented.
        </p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {getFoundationLabel("web")}
          </h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            {architectureItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="text-blue-600">
                  -
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
