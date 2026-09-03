import { useEffect, useState } from "react";

import { getDashboard, getExpensesByCategory } from "../api/dashboardApi";

import Navbar from "../components/Navbar";

import DashboardCard from "../components/DashboardCard";

import RecentTransactions from "../components/RecentTransaction";

import type { Dashboard } from "../types/dashboard";

import type { ExpenseByCategory } from "../api/dashboardApi";

import ExpensesByCategoryChart from "../components/charts/ExpensesByCategoryChart";

import type { BudgetVsSpentData } from "../components/charts/BudgetVsSpentChart";

import BudgetVsSpentChart from "../components/charts/BudgetVsSpentChart";

import { getBudgetsByMonth } from "../api/budgetApi";

import { useTranslation } from "react-i18next";

import { formatMonth, getCurrentMonth, getRecentMonths } from "../utils/months";

export default function Dashboard() {
  const { t, i18n } = useTranslation();

  // =========================
  // DASHBOARD
  // =========================

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] = useState(true);

  // =========================
  // ERROR
  // =========================

  const [error, setError] = useState<string | null>(null);

  // =========================
  // EXPENSES BY CATEGORY
  // =========================

  const [expensesByCategory, setExpensesByCategory] = useState<
    ExpenseByCategory[]
  >([]);

  // =========================
  // BUDGET VS SPENT
  // =========================

  const [budgetVsSpent, setBudgetVsSpent] = useState<BudgetVsSpentData[]>([]);

  // =========================
  // SELECTED MONTH
  // =========================

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // =========================
  // AVAILABLE MONTHS
  // =========================

  const availableMonths = getRecentMonths();

  // =========================
  // CURRENCY FORMAT
  // =========================

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      setError(null);

      const [dashboardData, categoryData, budgetsData] = await Promise.all([
        getDashboard(selectedMonth),

        getExpensesByCategory(selectedMonth),

        getBudgetsByMonth(selectedMonth),
      ]);

      // Dashboard

      setDashboard(dashboardData);

      // Expenses by category

      setExpensesByCategory(categoryData);

      // Budgets

      setBudgetVsSpent(
        budgetsData.map((budget) => ({
          name: budget.categoryName,

          budget: budget.budgetAmount,

          spent: budget.spentAmount,
        })),
      );
    } catch (error) {
      console.error(error);

      setError(t("dashboard.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadDashboard();
  }, [selectedMonth]);

  // =========================
  // ERROR VIEW
  // =========================

  if (error) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <div className="error-message">{error}</div>
        </main>
      </>
    );
  }

  // =========================
  // NO DASHBOARD
  // =========================

  if (loading || !dashboard) {
    return (
      <>
        <Navbar />

        <main className="page-container">
          <p>{t("common.loading")}</p>
        </main>
      </>
    );
  }

  // =========================
  // VIEW
  // =========================

  return (
    <>
      <Navbar />

      <main className="page-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">
          <div>
            <p className="eyebrow">{t("dashboard.eyebrow")}</p>

            <h1>{t("dashboard.title")}</h1>

            <p className="page-description">{t("dashboard.description")}</p>

            {/* MONTH SELECTOR */}

            <div className="month-selector">
              <label htmlFor="month">{t("dashboard.month")}</label>

              <select
                id="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonth(month, i18n.language)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* =========================
            DASHBOARD CARDS
        ========================= */}

        <section className="dashboard-grid">
          <DashboardCard
            title={t("dashboard.balance")}
            value={formatCurrency(dashboard.balance)}
            icon="💰"
            type="balance"
          />

          <DashboardCard
            title={t("dashboard.income")}
            value={formatCurrency(dashboard.totalIncome)}
            icon="↗"
            type="income"
          />

          <DashboardCard
            title={t("dashboard.expenses")}
            value={formatCurrency(dashboard.totalExpenses)}
            icon="↘"
            type="expense"
          />
        </section>

        {/* =========================
            EXPENSES BY CATEGORY
        ========================= */}

        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h2>{t("dashboard.expensesByCategory")}</h2>

            <p>{t("dashboard.expensesByCategoryDescription")}</p>
          </div>

          <ExpensesByCategoryChart data={expensesByCategory} />
        </section>

        {/* =========================
            BUDGET VS SPENT
        ========================= */}

        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h2>{t("dashboard.budgetVsSpent")}</h2>

            <p>{t("dashboard.budgetVsSpentDescription")}</p>
          </div>

          <BudgetVsSpentChart data={budgetVsSpent} />
        </section>

        {/* =========================
            RECENT TRANSACTIONS
        ========================= */}

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>{t("dashboard.recentTransactions")}</h2>

              <p>{t("dashboard.recentTransactionsDescription")}</p>
            </div>
          </div>

          <RecentTransactions transactions={dashboard.recentTransactions} />
        </section>
      </main>
    </>
  );
}
