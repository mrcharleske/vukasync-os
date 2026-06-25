import { Card } from "@/components/ui/card";

export default function CommandCenterLoading() {
  return (
    <main className="app-page">
      <div className="app-page-inner">
        <Card>
          <div className="skeleton-block skeleton-block-lg" />
        </Card>
        <div className="kpi-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`kpi-loading-${index}`}>
              <div className="skeleton-block" />
              <div className="skeleton-block skeleton-block-lg" />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
