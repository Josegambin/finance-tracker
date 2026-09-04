/**
 * API client functions for managing budgets.
 *
 * All functions use {@link apiFetch} so the authentication token is sent
 * automatically. Errors thrown follow the shape: `Error {status}: {message}`.
 */

import { apiFetch } from '../services/apiClient';
import type { Budget, CreateBudgetRequest } from '../types/budget';

/**
 * Fetches all budgets for the currently authenticated user.
 *
 * @returns A promise that resolves to the list of budgets.
 * @throws Throws an error if the request fails, including the HTTP status
 *         and a preview of the response body.
 */
export async function getBudgets(): Promise<Budget[]> {
  // Request all existing budgets so the month selector includes older months.
  const response = await apiFetch('/budgets?page=0&size=1000&sort=month,desc');

  if (!response.ok) {
    // If the backend returns JSON, read it. If it returns HTML, throw a generic error.
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text.slice(0, 100)}`);
  }

  const data: Budget[] | { content: Budget[] } = await response.json();
  return Array.isArray(data) ? data : data.content;
}

/**
 * Creates a new budget for the authenticated user.
 *
 * @param request - The data for the new budget (category, monthly amount, etc.).
 * @returns A promise that resolves to the created budget.
 * @throws Throws an error if the request fails, including the HTTP status
 *         and a preview of the response body.
 */
export async function createBudget(request: CreateBudgetRequest): Promise<Budget> {
  const response = await apiFetch('/budgets', {
    method: 'POST',
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text.slice(0, 100)}`);
  }

  return response.json();
}

/**
 * Deletes an existing budget by its id.
 *
 * @param id - The numeric id of the budget to delete.
 * @returns A promise that resolves once the budget has been deleted.
 * @throws Throws an error if the request fails, including the HTTP status
 *         and a preview of the response body.
 */
export async function deleteBudget(id: number): Promise<void> {
  const response = await apiFetch(`/budgets/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text.slice(0, 100)}`);
  }
}