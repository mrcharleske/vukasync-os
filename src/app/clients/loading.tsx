import { Card } from "@/components/ui/card";

export default function ClientsLoading() {
  return (
    <main className="app-page">
      <div className="app-page-inner">
        <Card>
          <div className="skeleton-block skeleton-block-lg" />
        </Card>
        <Card>
          <div className="skeleton-block" />
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </Card>
      </div>
    </main>
  );
}
