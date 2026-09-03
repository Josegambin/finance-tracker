import { useEffect, useState } from "react";

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

  // =========================
  // DASHBOARD
  // =========================

  const [
    dashboard,
    setDashboard
  ] = useState<Dashboard | null>(null);

  // =========================
  // LOADING
  // =========================

  const [
    loading,
    setLoading
  ] = useState(true);

  // =========================
  // ERROR
  // =========================

  const [
    error,
    setError
  ] = useState<string | null>(null);

  // =========================
  // EXPENSES BY CATEGORY
  // =========================

  const [
    expensesByCategory,
    setExpensesByCategory
  ] = useState<ExpenseByCategory[]>([]);

  // =========================
  // BUDGET VS SPENT
  // =========================

  const [
    budgetVsSpent,
    setBudgetVsSpent
  ] = useState<BudgetVsSpentData[]>([]);

  // =========================
  // SELECTED MONTH
  // =========================

  const [
    selectedMonth,
    setSelectedMonth
  ] = useState("2026-09");

  // =========================
  // MONTHS
  // =========================

  const months = [
    {
      value: "2026-09",
      label: "September 2026",
    },
    {
      value: "2026-08",
      label: "August 2026",
    },
    {
      value: "2026-07",
      label: "July 2026",
    },
    {
      value: "2026-06",
      label: "June 2026",
    },
    {
      value: "2026-05",
      label: "May 2026",
    },
    {
      value: "2026-04",
      label: "April 2026",
    },
  ];

  // =========================
  // CURRENCY FORMAT
  // =========================

  const formatCurrency = (
    value: number
  ) => {

    return new Intl.NumberFormat(
      "es-ES",
      {
        style: "currency",
        currency: "EUR",
      }
    ).format(value);
  };

  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      setError(null);

      const [
        dashboardData,
        categoryData,
        budgetsData
      ] = await Promise.all([

        getDashboard(
          selectedMonth
        ),

        getExpensesByCategory(
          selectedMonth
        ),

        getBudgetsByMonth(
          selectedMonth
        ),

      ]);

      // =========================
      // DASHBOARD
      // =========================

      setDashboard(
        dashboardData
      );

      // =========================
      // EXPENSES BY CATEGORY
      // =========================

      setExpensesByCategory(
        categoryData
      );

      // =========================
      // BUDGET VS SPENT
      // =========================

      setBudgetVsSpent(

        budgetsData.map(
          (budget) => ({

            name:
              budget.categoryName,

            budget:
              budget.budgetAmount,

            spent:
              budget.spentAmount,

          })
        )

      );

    } catch (error) {

      console.error(error);

      setError(
        "Error loading dashboard"
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // LOAD WHEN MONTH CHANGES
  // =========================

  useEffect(() => {

    loadDashboard();

  }, [selectedMonth]);

  // =========================
  // LOADING VIEW
  // =========================

  if (
    loading &&
    !dashboard
  ) {

    return (
      <>
        <Navbar />

        <main className="page-container">

          <div className="dashboard-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading dashboard...
            </p>

          </div>

        </main>
      </>
    );
  }

  // =========================
  // ERROR VIEW
  // =========================

  if (error) {

    return (
      <>
        <Navbar />

        <main className="page-container">

          <div className="dashboard-error">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                Unable to load dashboard
              </strong>

              <p>
                Please try again.
              </p>

              <button
                type="button"
                onClick={loadDashboard}
              >
                Retry
              </button>

            </div>

          </div>

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
            REFRESHING
        ========================= */}

        {loading && (

          <div className="dashboard-refreshing">

            Updating dashboard...

          </div>

        )}

        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <p className="eyebrow">
              FINANCE OVERVIEW
            </p>

            <h1>
              Dashboard
            </h1>

            <p className="page-description">
              Here's an overview of your finances.
            </p>

            {/* =========================
                MONTH SELECTOR
            ========================= */}

            <div className="month-selector">

              <label htmlFor="month">
                Month
              </label>

              <select
                id="month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(
                    event.target.value
                  )
                }
              >

                {months.map(
                  (month) => (

                    <option
                      key={month.value}
                      value={month.value}
                    >
                      {month.label}
                    </option>

                  )
                )}

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
            value={formatCurrency(
              dashboard.balance
            )}
            icon="💰"
            type="balance"
          />

          <DashboardCard
            title="Total income"
            value={formatCurrency(
              dashboard.totalIncome
            )}
            icon="↗"
            type="income"
          />

          <DashboardCard
            title="Total expenses"
            value={formatCurrency(
              dashboard.totalExpenses
            )}
            icon="↘"
            type="expense"
          />

        </section>

        {/* =========================
            EXPENSES BY CATEGORY
        ========================= */}

        <section className="dashboard-chart-card">

          <div className="chart-header">

            <h2>
              Expenses by category
            </h2>

            <p>
              Where your money is going.
            </p>

          </div>

          <ExpensesByCategoryChart
            data={expensesByCategory}
          />

        </section>

        {/* =========================
            BUDGET VS SPENT
        ========================= */}

        <section className="dashboard-chart-card">

          <div className="chart-header">

            <h2>
              Budget vs spent
            </h2>

            <p>
              Compare your budget with your actual spending.
            </p>

          </div>

          <BudgetVsSpentChart
            data={budgetVsSpent}
          />

        </section>

        {/* =========================
            RECENT TRANSACTIONS
        ========================= */}

        <section className="content-card">

          <div className="section-header">

            <div>

              <h2>
                Recent transactions
              </h2>

              <p>
                Your latest financial activity.
              </p>

            </div>

          </div>

          <RecentTransactions
            transactions={
              dashboard.recentTransactions
            }
          />

        </section>

      </main>
    </>
  );
}