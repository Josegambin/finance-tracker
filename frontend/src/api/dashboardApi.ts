// src/api/dashboardApi.ts
import { apiFetch } from '../services/apiClient';

// Define el tipo de retorno para los gastos por categoría
export interface ExpenseByCategory {
  categoryName: string;
  total: number;
}

// Define el tipo de retorno para los presupuestos mensuales
export interface BudgetByMonth {
  id: number;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
}

export async function getDashboard(month: string) {
  // Usa apiFetch para que envíe el token y obtenga datos reales
  // Si tu backend tiene la ruta /api/dashboard?month=..., usa esto:
  const response = await apiFetch(`/dashboard?month=${month}`);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status} al cargar dashboard`);
  }
  
  return response.json();
}

export async function getExpensesByCategory(month: string): Promise<ExpenseByCategory[]> {
  // Si en Postman probaste /api/dashboard/expenses-by-category?month=...
  const response = await apiFetch(`/dashboard/expenses-by-category?month=${month}`);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status} al cargar categorías`);
  }
  
  return response.json();
}

export async function getBudgetsByMonth(month: string): Promise<BudgetByMonth[]> {
  // Si en Postman probaste /api/budgets/by-month?month=...
  const response = await apiFetch(`/budgets/by-month?month=${month}`);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status} al cargar presupuestos`);
  }
  
  return response.json();
}