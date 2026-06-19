type StatusBadgeTone = "neutral" | "success" | "warning";

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return <span className={`status-badge status-${tone}`}>{label}</span>;
}
