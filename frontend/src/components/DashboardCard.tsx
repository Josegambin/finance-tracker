import { useState } from "react";
import type { ExpenseByCategory } from "../api/dashboardApi";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: string;
  type: 'balance' | 'income' | 'expense';
}

export default function DashboardCard({
  title,
  value,
  icon,
  type
}: DashboardCardProps) {

  const formattedValue =
    new Intl.NumberFormat(
      'es-ES',
      {
        style: 'currency',
        currency: 'EUR'
      }
    ).format(value);

    const [expensesByCategory, setExpensesByCategory] =
      useState<ExpenseByCategory[]>([]);

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
        {formattedValue}
      </strong>

    </div>
  );
}