import type {
  Transaction,
  CreateTransactionRequest,
  TransactionPageResponse,
  TransactionType
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

export interface TransactionQuery {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  type?: TransactionType | 'ALL';
  categoryId?: number | 'ALL';
  month?: string;
}

export async function getTransactions(
  query: TransactionQuery = {}
): Promise<TransactionPageResponse> {

  const {
    page = 0,
    size = 5,
    sort = 'date,desc',
    search,
    type,
    categoryId,
    month
  } = query;

  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sort', sort);

  if (search && search.trim() !== '') {
    params.append('search', search.trim());
  }

  if (type && type !== 'ALL') {
    params.append('type', type);
  }

  if (categoryId !== undefined && categoryId !== null && categoryId !== 'ALL') {
    params.append('categoryId', categoryId.toString());
  }

  if (month && month !== 'ALL') {
    params.append('month', month);
  }

  const response =
    await apiFetch(
      `/transactions?${params.toString()}`,
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