interface StatCardProps {
  label: string;
  value: number | string;
  accent?: "blue" | "green" | "purple" | "orange";
}

export function StatCard({ label, value, accent = "blue" }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  );
}
