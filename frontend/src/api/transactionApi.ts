import type {
  Transaction,
  CreateTransactionRequest,
  TransactionPageResponse,
  TransactionType
} from '../types/transaction';

export interface TransactionFilters {

  search?: string;

  type?: TransactionType | 'ALL';

  categoryId?: number | 'ALL';

  month?: string;

}

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

function buildFilterParams(
  filters: TransactionFilters
): URLSearchParams {

  const params =
    new URLSearchParams();


  if (
    filters.search &&
    filters.search.trim() !== ''
  ) {

    params.append(
      'search',
      filters.search.trim()
    );

  }


  if (
    filters.type &&
    filters.type !== 'ALL'
  ) {

    params.append(
      'type',
      filters.type
    );

  }


  if (
    filters.categoryId !== undefined &&
    filters.categoryId !== 'ALL'
  ) {

    params.append(
      'categoryId',
      filters.categoryId.toString()
    );

  }


  if (
    filters.month &&
    filters.month !== 'ALL'
  ) {

    params.append(
      'month',
      filters.month
    );

  }


  return params;

}

export async function getTransactions(
  page: number = 0,
  size: number = 5,
  sort: string = 'date,desc',
  filters: TransactionFilters = {}
): Promise<TransactionPageResponse> {

  const params =
    buildFilterParams(filters);

  params.append(
    'page',
    page.toString()
  );

  params.append(
    'size',
    size.toString()
  );

  params.append(
    'sort',
    sort
  );

  const response =
    await fetch(
      `${API_URL}/transactions?${params.toString()}`,
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
  filters: TransactionFilters = {}
): Promise<Blob> {

  const query =
    buildFilterParams(filters)
      .toString();


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