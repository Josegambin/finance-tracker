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
        <main className="container py-4">
          <p>{t('common.loading')}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <div className="mb-4">
          <p className="text-muted small text-uppercase mb-0">{t('budgets.budgetManagement')}</p>
          <h1 className="h2 mb-1">{t('budgets.title')}</h1>
          <p className="text-muted mb-0">{t('budgets.description')}</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <section className="card mb-4 p-3">
          <h2 className="h5">{t('budgets.createBudget')}</h2>
          <BudgetForm categories={categories} onCreate={handleCreate} />
        </section>

        <section className="card p-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h2 className="h5 mb-0">{t('budgets.yourBudgets')}</h2>
              <p className="text-muted small mb-0">{t('budgets.trackSpending')}</p>
            </div>
            <span className="badge text-bg-secondary">{t('budgets.count', { count: filteredBudgets.length })}</span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <label className="form-label mb-0 fw-semibold">{t('transactions.month')}</label>
            <select className="form-select w-auto" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value)}>
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <span className="d-block text-muted small mb-1">{t('budgets.totalBudget')}</span>
                  <strong className="fs-4">{formatCurrency(totalBudget)}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  <span className="d-block text-muted small mb-1">{t('budgets.totalSpent')}</span>
                  <strong className="fs-4">{formatCurrency(totalSpent)}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className={`card-body text-center ${totalRemaining < 0 ? 'text-danger' : ''}`}>
                  <span className="d-block text-muted small mb-1">{t('budgets.remaining')}</span>
                  <strong className={`fs-4 ${totalRemaining < 0 ? 'text-danger' : ''}`}>
                    {formatCurrency(totalRemaining)}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {budgets.length === 0 ? (
            <div className="text-center py-4">
              <span className="fs-1 d-block">💰</span>
              <h3 className="h5 mt-2">{t('budgets.noBudgets')}</h3>
              <p className="text-muted mb-0">{t('budgets.noBudgetsDescription')}</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredBudgets.length === 0 ? (
                <div className="col-12 text-center py-4">
                  <span className="fs-1 d-block">📊</span>
                  <h3 className="h5 mt-2">{t('budgets.noBudgetsForMonth')}</h3>
                  <p className="text-muted mb-0">{t('budgets.noBudgetsForMonthDescription')}</p>
                </div>
              ) : (
                filteredBudgets.map(budget => (
                  <div className="col-md-6" key={budget.id}>
                    <BudgetCard budget={budget} onDelete={handleDelete} />
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}