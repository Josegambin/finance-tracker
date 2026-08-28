import type {
  Transaction,
  CreateTransactionRequest
} from '../types/transaction';

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

export async function getTransactions():
  Promise<Transaction[]> {

  const response =
    await fetch(
      `${API_URL}/transactions`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {

    throw new Error(
      'Error loading transactions'
    );
  }

  return response.json();
}

export async function createTransaction(
  request: CreateTransactionRequest
): Promise<Transaction> {

  const response =
    await fetch(
      `${API_URL}/transactions`,
      {
        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(request)
      }
    );

  if (!response.ok) {

    throw new Error(
      'Error creating transaction'
    );
  }

  return response.json();
}

export async function deleteTransaction(
  id: number
): Promise<void> {

  const response =
    await fetch(
      `${API_URL}/transactions/${id}`,
      {
        method: 'DELETE',

        headers: getHeaders()
      }
    );

  if (!response.ok) {

    throw new Error(
      'Error deleting transaction'
    );
  }
}