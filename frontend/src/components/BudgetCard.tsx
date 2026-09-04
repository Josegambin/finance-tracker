import { useTranslation } from 'react-i18next';
import type { Budget } from '../types/budget';

interface BudgetCardProps {
  budget: Budget;
  onDelete: (id: number) => Promise<void>;
}

export default function BudgetCard({
  budget,
  onDelete
}: BudgetCardProps) {
  const { t } = useTranslation();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const percentage = Math.min(budget.percentageUsed, 100);

  let status = 'normal';
  if (budget.percentageUsed >= 100) {
    status = 'danger';
  } else if (budget.percentageUsed >= 80) {
    status = 'warning';
  }

  const progressClass =
    status === 'danger' ? 'bg-danger' : status === 'warning' ? 'bg-warning' : 'bg-success';

  const remainingClass = budget.remainingAmount < 0 ? 'text-danger' : 'text-muted';

  return (
    <div className="card card-hover h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">💰</span>
            <div>
              <h3 className="h6 mb-0">{budget.categoryName}</h3>
              <span className="text-muted small">{budget.month}</span>
            </div>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(budget.id)}
            title={t('budgets.deleteBudget')}
          >
            🗑
          </button>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <div>
            <span className="text-muted small text-uppercase">{t('budgets.totalSpent')}</span>
            <strong className="d-block">{formatCurrency(budget.spentAmount)}</strong>
          </div>
          <div className="text-end">
            <span className="text-muted small text-uppercase">{t('budgets.totalBudget')}</span>
            <strong className="d-block">{formatCurrency(budget.budgetAmount)}</strong>
          </div>
        </div>

        <div className="progress mb-1" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`progress-bar ${progressClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="d-flex justify-content-between">
          <span className={`fw-bold ${progressClass}`}>
            {budget.percentageUsed.toFixed(1)}%
          </span>
          <span className={remainingClass}>
            {budget.remainingAmount >= 0
              ? `${t('budgets.remaining')}: ${formatCurrency(budget.remainingAmount)}`
              : `${t('budgets.overBudget')}: ${formatCurrency(Math.abs(budget.remainingAmount))}`}
          </span>
        </div>
      </div>
    </div>
  );
}