// src/api/budgetApi.ts
import { apiFetch } from '../services/apiClient';
import type { Budget, CreateBudgetRequest } from '../types/budget';

export async function getBudgets(): Promise<Budget[]> {
  // ✅ Usa apiFetch. Asegúrate de que la URL sea correcta.
  const response = await apiFetch('/budgets');

  if (!response.ok) {
    // Si el backend devuelve un JSON, lo leemos. Si devuelve HTML, lanzamos error genérico.
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text.slice(0, 100)}`);
  }

  return response.json();
}

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

export async function deleteBudget(id: number): Promise<void> {
  const response = await apiFetch(`/budgets/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text.slice(0, 100)}`);
  }
}