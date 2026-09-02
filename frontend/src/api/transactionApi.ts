import type {
  Transaction,
  CreateTransactionRequest,
  TransactionPageResponse
} from '../types/transaction';

const API_URL =
  'http://localhost:8080/api';

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

export async function getTransactions(
  page: number = 0,
  size: number = 5,
  sort: string = 'date,desc'
): Promise<TransactionPageResponse> {

  const response =
    await fetch(
      `${API_URL}/transactions?page=${page}&size=${size}&sort=${sort}`,
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

/*
 * ============================
 * EXPORT CSV
 * ============================
 */

export async function exportTransactionsCsv(
  search?: string,
  type?: string,
  categoryId?: number,
  month?: string
): Promise<Blob> {

  const params =
    new URLSearchParams();


  /*
   * Search
   */

  if (
    search &&
    search.trim() !== ''
  ) {

    params.append(
      'search',
      search
    );

  }


  /*
   * Type
   */

  if (
    type &&
    type !== 'ALL'
  ) {

    params.append(
      'type',
      type
    );

  }


  /*
   * Category
   */

  if (
    categoryId !== undefined &&
    categoryId !== null &&
    categoryId !== -1
  ) {

    params.append(
      'categoryId',
      categoryId.toString()
    );

  }


  /*
   * Month
   */

  if (
    month &&
    month !== 'ALL'
  ) {

    params.append(
      'month',
      month
    );

  }


  const query =
    params.toString();


  const url =
    query.length > 0
      ? `${API_URL}/transactions/export/csv?${query}`
      : `${API_URL}/transactions/export/csv`;


  const response =
    await fetch(
      url,
      {
        headers: getHeaders()
      }
    );


  if (!response.ok) {

    throw new Error(
      'Error exporting transactions'
    );

  }


  return response.blob();

}