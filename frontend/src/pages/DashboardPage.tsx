import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { getBudgetsByMonth, getDashboard, getExpensesByCategory } from "../api/dashboardApi";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import RecentTransactions from "../components/RecentTransaction";
import type { Dashboard } from "../types/dashboard";
import type { ExpenseByCategory } from "../api/dashboardApi";
import ExpensesByCategoryChart from "../components/charts/ExpensesByCategoryChart";
import type { BudgetVsSpentData } from "../components/charts/BudgetVsSpentChart";
import BudgetVsSpentChart from "../components/charts/BudgetVsSpentChart";

export default function Dashboard() {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseByCategory[]>([]);
  const [budgetVsSpent, setBudgetVsSpent] = useState<BudgetVsSpentData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const months = [
    { value: "2026-09", label: "September 2026" },
    { value: "2026-08", label: "August 2026" },
    { value: "2026-07", label: "July 2026" },
    { value: "2026-06", label: "June 2026" },
    { value: "2026-05", label: "May 2026" },
    { value: "2026-04", label: "April 2026" },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardData, categoryData, budgetsData] = await Promise.all([
        getDashboard(selectedMonth),
        getExpensesByCategory(selectedMonth),
        getBudgetsByMonth(selectedMonth),
      ]);

      setDashboard(dashboardData);
      setExpensesByCategory(categoryData);
      setBudgetVsSpent(
        budgetsData.map((budget) => ({
          name: budget.categoryName,
          budget: budget.budgetAmount,
          spent: budget.spentAmount,
        }))
      );
    } catch (error) {
      console.error(error);
      setError(t('common.unableToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [selectedMonth]);

  if (loading && !dashboard) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="dashboard-error">
            <span>⚠️</span>
            <div>
              <strong>{t('common.unableToLoad')}</strong>
              <p>{t('common.tryAgain')}</p>
              <button type="button" onClick={loadDashboard}>{t('common.retry')}</button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!dashboard) return null;

  return (
    <>
      <Navbar />
      <main className="page-container">
        {loading && <div className="dashboard-refreshing">{t('common.updating')}</div>}

        <div className="page-header">
          <div>
            <p className="eyebrow">{t('dashboard.financeOverview')}</p>
            <h1>{t('dashboard.title')}</h1>
            <p className="page-description">{t('dashboard.description')}</p>
            <div className="month-selector">
              <label htmlFor="month">{t('transactions.month')}</label>
              <select id="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <section className="dashboard-grid">
          <DashboardCard
            title={t('dashboard.balance')}
            value={formatCurrency(dashboard.balance)}
            icon="💰"
            type="balance"
          />
          <DashboardCard
            title={t('dashboard.income')}
            value={formatCurrency(dashboard.totalIncome)}
            icon="↗"
            type="income"
          />
          <DashboardCard
            title={t('dashboard.expenses')}
            value={formatCurrency(dashboard.totalExpenses)}
            icon="↘"
            type="expense"
          />
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h2>{t('dashboard.expensesByCategory')}</h2>
            <p>{t('dashboard.whereMoneyGoing')}</p>
          </div>
          <ExpensesByCategoryChart data={expensesByCategory} />
        </section>

        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h2>{t('dashboard.budgetVsSpent')}</h2>
            <p>{t('dashboard.compareBudget')}</p>
          </div>
          <BudgetVsSpentChart data={budgetVsSpent} />
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>{t('dashboard.recentTransactions')}</h2>
              <p>{t('dashboard.latestActivity')}</p>
            </div>
          </div>
          <RecentTransactions transactions={dashboard.recentTransactions} />
        </section>
      </main>
    </>
  );
}