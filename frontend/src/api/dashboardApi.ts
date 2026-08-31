import type { Dashboard } from '../types/dashboard';

const API_URL = 'http://localhost:8080/api';

function getHeaders(): HeadersInit {

  const token =
    localStorage.getItem(
      'finance_tracker_token'
    );

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function getDashboard():
  Promise<Dashboard> {

  const response =
    await fetch(
      `${API_URL}/dashboard`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {

    throw new Error(
      'Error loading dashboard'
    );
  }

  return response.json();
}

export interface ExpenseByCategory {
  name: string;
  amount: number;
}

export async function
getExpensesByCategory():
  Promise<ExpenseByCategory[]> {

  const response =
    await fetch(
      `${API_URL}/dashboard/expenses-by-category`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {

    throw new Error(
      'Error loading expenses by category'
    );
  }

  return response.json();
}