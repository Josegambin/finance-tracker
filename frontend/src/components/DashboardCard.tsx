interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  type: 'balance' | 'income' | 'expense';
}

export default function DashboardCard({
  title,
  value,
  icon,
  type
}: DashboardCardProps) {

  return (
    <div className="card card-hover stat-card h-100 border-0">
      <div className={`card-body d-flex flex-column gap-3`}>
        <div className="d-flex align-items-center justify-content-between">
          <span className={`stat-icon ${type}`}>
            {icon}
          </span>
          <span className="text-secondary fw-semibold small text-uppercase">
            {title}
          </span>
        </div>

        <strong className="stat-value">
          {value}
        </strong>
      </div>
    </div>
  );
}