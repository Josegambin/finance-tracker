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

export default function Dashboard() {
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

  const [selectedMonth, setSelectedMonth] = useState("2026-08");

  // =========================
  // CURRENCY FORMAT
  // =========================

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
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

      setError("Error loading dashboard");
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

  if (!dashboard) {
    return null;
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
            <p className="eyebrow">FINANCE OVERVIEW</p>

            <h1>Dashboard</h1>

            <p className="page-description">
              Here's an overview of your finances.
            </p>

            {/* MONTH SELECTOR */}

            <div className="month-selector">
              <label htmlFor="month">Month</label>

              <select
                id="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                <option value="2026-09">September 2026</option>

                <option value="2026-08">August 2026</option>

                <option value="2026-04">April 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* =========================
            DASHBOARD CARDS
        ========================= */}

        <section className="dashboard-grid">
          <DashboardCard
            title="Total balance"
            value={formatCurrency(dashboard.balance)}
            icon="💰"
            type="balance"
          />

          <DashboardCard
            title="Total income"
            value={formatCurrency(dashboard.totalIncome)}
            icon="↗"
            type="income"
          />

          <DashboardCard
            title="Total expenses"
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
            <h2>Expenses by category</h2>

            <p>Where your money is going.</p>
          </div>

          <ExpensesByCategoryChart data={expensesByCategory} />
        </section>

        {/* =========================
            BUDGET VS SPENT
        ========================= */}

        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h2>Budget vs spent</h2>

            <p>Compare your budget with your actual spending.</p>
          </div>

          <BudgetVsSpentChart data={budgetVsSpent} />
        </section>

        {/* =========================
            RECENT TRANSACTIONS
        ========================= */}

        <section className="content-card">
          <div className="section-header">
            <div>
              <h2>Recent transactions</h2>

              <p>Your latest financial activity.</p>
            </div>
          </div>

          <RecentTransactions transactions={dashboard.recentTransactions} />
        </section>
      </main>
    </>
  );
}
