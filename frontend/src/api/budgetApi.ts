import type {
  Budget,
  CreateBudgetRequest
} from '../types/budget';

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

export async function getBudgets():
  Promise<Budget[]> {

  const response =
    await fetch(
      `${API_URL}/budgets`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error loading budgets'
    );
  }

  return response.json();
}

export async function createBudget(
  request: CreateBudgetRequest
): Promise<Budget> {

  const response =
    await fetch(
      `${API_URL}/budgets`,
      {
        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(request)
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error creating budget'
    );
  }

  return response.json();
}

export async function deleteBudget(
  id: number
): Promise<void> {

  const response =
    await fetch(
      `${API_URL}/budgets/${id}`,
      {
        method: 'DELETE',
        headers: getHeaders()
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error deleting budget'
    );
  }
}