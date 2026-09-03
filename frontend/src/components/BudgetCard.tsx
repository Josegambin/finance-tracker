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

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <div>
          <div className="budget-category">
            <span className="budget-icon">💰</span>
            <div>
              <h3>{budget.categoryName}</h3>
              <span className="budget-month">{budget.month}</span>
            </div>
          </div>
        </div>
        <button
          className="delete-button"
          onClick={() => onDelete(budget.id)}
          title={t('budgets.deleteBudget')}
        >
          🗑
        </button>
      </div>

      <div className="budget-values">
        <div>
          <span className="budget-label">{t('budgets.totalSpent')}</span>
          <strong>{formatCurrency(budget.spentAmount)}</strong>
        </div>
        <div>
          <span className="budget-label">{t('budgets.totalBudget')}</span>
          <strong>{formatCurrency(budget.budgetAmount)}</strong>
        </div>
      </div>

      <div className="budget-progress-container">
        <div className={`budget-progress ${status}`} style={{ width: `${percentage}%` }} />
      </div>

      <div className="budget-footer">
        <span className={`budget-percentage ${status}`}>
          {budget.percentageUsed.toFixed(1)}%
        </span>
        <span className={budget.remainingAmount < 0 ? 'remaining negative' : 'remaining'}>
          {budget.remainingAmount >= 0
            ? `${t('budgets.remaining')}: ${formatCurrency(budget.remainingAmount)}`
            : `${t('budgets.overBudget')}: ${formatCurrency(Math.abs(budget.remainingAmount))}`}
        </span>
      </div>
    </div>
  );
}