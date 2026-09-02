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
    <div
      className={`dashboard-card ${type}`}
    >

      <div className="dashboard-card-header">

        <span className="dashboard-card-icon">
          {icon}
        </span>

        <span className="dashboard-card-title">
          {title}
        </span>

      </div>

      <strong className="dashboard-card-value">
        {value}
      </strong>

    </div>
  );
}