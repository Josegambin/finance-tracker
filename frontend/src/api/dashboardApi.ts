/**
 * API client functions for dashboard summary data.
 *
 * All functions use {@link apiFetch} so the authentication token is sent
 * automatically.
 */

import { apiFetch } from '../services/apiClient';

/** Represents the total expenses grouped by category. */
export interface ExpenseByCategory {
  /** Name of the expense category. */
  categoryName: string;
  /** Total amount spent in the category for the selected month. */
  total: number;
}

/** Represents the budget vs. spent amounts for a category in a month. */
export interface BudgetByMonth {
  /** Unique id of the budget record. */
  id: number;
  /** Name of the category the budget belongs to. */
  categoryName: string;
  /** Monthly budget amount configured for the category. */
  budgetAmount: number;
  /** Amount actually spent in the category during the month. */
  spentAmount: number;
}

/**
 * Fetches the dashboard summary for the given month.
 *
 * @param month - The month to load data for, in `yyyy-MM` format.
 * @returns A promise that resolves to the dashboard summary object.
 * @throws Throws an error if the request fails.
 */
export async function getDashboard(month: string) {
  // Uses apiFetch so the auth token is attached and data comes from the user's session.
  // The backend exposes the route /api/dashboard?month=...
  const response = await apiFetch(`/dashboard?month=${month}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} loading dashboard`);
  }

  return response.json();
}

/**
 * Fetches the total expenses grouped by category for the given month.
 *
 * @param month - The month to load data for, in `yyyy-MM` format.
 * @returns A promise that resolves to the list of expenses grouped by category.
 * @throws Throws an error if the request fails.
 */
export async function getExpensesByCategory(month: string): Promise<ExpenseByCategory[]> {
  // Route exposed by the backend: /api/dashboard/expenses-by-category?month=...
  const response = await apiFetch(`/dashboard/expenses-by-category?month=${month}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} loading expense categories`);
  }

  return response.json();
}

/**
 * Fetches the budget vs. spent summary for each category for the given month.
 *
 * @param month - The month to load data for, in `yyyy-MM` format.
 * @returns A promise that resolves to the list of budget summaries.
 * @throws Throws an error if the request fails.
 */
export async function getBudgetsByMonth(month: string): Promise<BudgetByMonth[]> {
  // Route exposed by the backend: /api/budgets/by-month?month=...
  const response = await apiFetch(`/budgets/by-month?month=${month}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} loading budget summaries`);
  }

  return response.json();
}