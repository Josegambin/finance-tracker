import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import BudgetCard from '../components/BudgetCard';
import BudgetForm from '../components/BudgetForm';
import type { Budget, CreateBudgetRequest } from '../types/budget';
import type { Category } from '../types/category';
import { getBudgets, createBudget, deleteBudget } from '../api/budgetApi';
import { getCategories } from '../api/categoryApi';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const availableMonths = [...new Set(
    (Array.isArray(budgets) ? budgets : []).map(budget => budget.month)
  )].sort().reverse();

  const filteredBudgets = (Array.isArray(budgets) ? budgets : []).filter(
    budget => budget.month === selectedMonth
  );

  const totalBudget = filteredBudgets.reduce((total, budget) => total + budget.budgetAmount, 0);
  const totalSpent = filteredBudgets.reduce((total, budget) => total + budget.spentAmount, 0);
  const totalRemaining = filteredBudgets.reduce((total, budget) => total + budget.remainingAmount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([getBudgets(), getCategories()]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (request: CreateBudgetRequest) => {
    try {
      const newBudget = await createBudget(request);
      setBudgets(previous => [newBudget, ...previous]);
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorCreating'));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBudget(id);
      setBudgets(previous => previous.filter(budget => budget.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.errorDeleting'));
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p>{t('common.loading')}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="page-header">
          <p className="eyebrow">{t('budgets.budgetManagement')}</p>
          <h1>{t('budgets.title')}</h1>
          <p className="page-description">{t('budgets.description')}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="content-card">
          <h2>{t('budgets.createBudget')}</h2>
          <BudgetForm categories={categories} onCreate={handleCreate} />
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>{t('budgets.yourBudgets')}</h2>
              <p>{t('budgets.trackSpending')}</p>
            </div>
            <span>{t('budgets.count', { count: filteredBudgets.length })}</span>
          </div>
          <div className="budget-filter">
            <label>{t('transactions.month')}</label>
            <select value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)}>
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="budget-summary">
            <div className="summary-card">
              <span>{t('budgets.totalBudget')}</span>
              <strong>{formatCurrency(totalBudget)}</strong>
            </div>
            <div className="summary-card">
              <span>{t('budgets.totalSpent')}</span>
              <strong>{formatCurrency(totalSpent)}</strong>
            </div>
            <div className="summary-card">
              <span>{t('budgets.remaining')}</span>
              <strong className={totalRemaining < 0 ? 'negative' : ''}>
                {formatCurrency(totalRemaining)}
              </strong>
            </div>
          </div>

          {budgets.length === 0 ? (
            <div className="empty-state">
              <span>💰</span>
              <h3>{t('budgets.noBudgets')}</h3>
              <p>{t('budgets.noBudgetsDescription')}</p>
            </div>
          ) : (
            <div className="budgets-list">
              {filteredBudgets.length === 0 ? (
                <div className="empty-state">
                  <span>📊</span>
                  <h3>{t('budgets.noBudgetsForMonth')}</h3>
                  <p>{t('budgets.noBudgetsForMonthDescription')}</p>
                </div>
              ) : (
                <div className="budgets-list">
                  {filteredBudgets.map(budget => (
                    <BudgetCard key={budget.id} budget={budget} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}