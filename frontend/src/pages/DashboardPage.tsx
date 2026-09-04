import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getBudgetsByMonth,
  getDashboard,
  getExpensesByCategory,
} from "../api/dashboardApi";
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
  const [expensesByCategory, setExpensesByCategory] = useState<
    ExpenseByCategory[]
  >([]);
  const [budgetVsSpent, setBudgetVsSpent] = useState<BudgetVsSpentData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();

    date.setMonth(date.getMonth() - index);

    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    const label = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);

    return {
      value,
      label,
    };
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value);
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
        })),
      );
    } catch (error) {
      console.error(error);
      setError(t("common.unableToLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedMonth]);

  if (loading && !dashboard) {
    return (
      <>
        <Navbar />
        <main className="container py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">{t("common.loading")}</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="container py-4">
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <span>⚠️</span>
            <div className="flex-grow-1">
              <strong>{t("common.unableToLoad")}</strong>
              <p className="mb-2">{t("common.tryAgain")}</p>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={loadDashboard}>
                {t("common.retry")}
              </button>
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
      <main className="container py-4">
        {loading && (
          <div className="alert alert-primary py-1 small">{t("common.updating")}</div>
        )}

        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
          <div>
            <p className="text-muted small text-uppercase mb-0">{t("dashboard.financeOverview")}</p>
            <h1 className="h2 mb-1">{t("dashboard.title")}</h1>
            <p className="text-muted mb-0">{t("dashboard.description")}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="month" className="form-label mb-0 fw-semibold">{t("transactions.month")}</label>
            <select
              id="month"
              className="form-select w-auto"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <DashboardCard
              title={t("dashboard.balance")}
              value={formatCurrency(dashboard.balance)}
              icon="💰"
              type="balance"
            />
          </div>
          <div className="col-md-4">
            <DashboardCard
              title={t("dashboard.income")}
              value={formatCurrency(dashboard.totalIncome)}
              icon="↗"
              type="income"
            />
          </div>
          <div className="col-md-4">
            <DashboardCard
              title={t("dashboard.expenses")}
              value={formatCurrency(dashboard.totalExpenses)}
              icon="↘"
              type="expense"
            />
          </div>
        </div>

        <section className="card mb-4 p-3">
          <div className="card-header bg-transparent border-0">
            <h2 className="h5 mb-0">{t("dashboard.expensesByCategory")}</h2>
            <p className="text-muted small mb-0">{t("dashboard.whereMoneyGoing")}</p>
          </div>
          <div className="card-body">
            <ExpensesByCategoryChart data={expensesByCategory} />
          </div>
        </section>

        <section className="card mb-4 p-3">
          <div className="card-header bg-transparent border-0">
            <h2 className="h5 mb-0">{t("dashboard.budgetVsSpent")}</h2>
            <p className="text-muted small mb-0">{t("dashboard.compareBudget")}</p>
          </div>
          <div className="card-body">
            <BudgetVsSpentChart data={budgetVsSpent} />
          </div>
        </section>

        <section className="card p-3">
          <div className="card-header bg-transparent border-0">
            <div>
              <h2 className="h5 mb-0">{t("dashboard.recentTransactions")}</h2>
              <p className="text-muted small mb-0">{t("dashboard.latestActivity")}</p>
            </div>
          </div>
          <div className="card-body">
            <RecentTransactions transactions={dashboard.recentTransactions} />
          </div>
        </section>
      </main>
    </>
  );
}
