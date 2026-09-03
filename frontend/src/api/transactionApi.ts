import type {
  Transaction,
  CreateTransactionRequest,
  TransactionPageResponse
} from '../types/transaction';
import { errorHandler } from '../services/errorHandler';
import { apiFetch } from '../services/apiClient';

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
    await apiFetch(
      `/transactions?page=${page}&size=${size}&sort=${sort}`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }

  return response.json();

}

export async function createTransaction(
  request: CreateTransactionRequest
): Promise<Transaction> {

  const response =
    await apiFetch(
      `/transactions`,
      {

        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(request)

      }
    );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }

  return response.json();

}

export async function deleteTransaction(
  id: number
): Promise<void> {

  const response =
    await apiFetch(
      `/transactions/${id}`,
      {

        method: 'DELETE',

        headers: getHeaders()

      }
    );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
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
      ? `/transactions/export/csv?${query}`
      : `/transactions/export/csv`;


  const response =
    await apiFetch(
      url,
      {
        headers: getHeaders()
      }
    );


  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }


  return response.blob();

}