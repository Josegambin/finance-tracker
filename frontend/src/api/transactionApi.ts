/**
 * API client functions for managing transactions, including list/filter
 * queries and CSV export.
 *
 * All functions use {@link apiFetch} and attach the authentication token via
 * {@link getHeaders}. Errors are normalized with {@link errorHandler}.
 */

import type {
  Transaction,
  CreateTransactionRequest,
  TransactionPageResponse,
  TransactionType
} from '../types/transaction';
import { errorHandler } from '../services/errorHandler';
import { apiFetch } from '../services/apiClient';

/**
 * Builds the headers for transaction requests, including the `Bearer` token
 * read from `localStorage`.
 *
 * @returns The headers object with `Content-Type` and `Authorization`.
 */
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

/**
 * Query parameters used to filter, paginate and sort transactions.
 */
export interface TransactionQuery {
  /** Zero-based page number to fetch. */
  page?: number;
  /** Number of items per page. */
  size?: number;
  /** Sort directive, e.g. `date,desc`. */
  sort?: string;
  /** Free-text search term applied to transaction descriptions. */
  search?: string;
  /** Filter by transaction type, or `'ALL'` to include both types. */
  type?: TransactionType | 'ALL';
  /** Filter by category id, or `'ALL'` to include all categories. */
  categoryId?: number | 'ALL';
  /** Filter by the ISO month (`yyyy-MM`) the transaction belongs to. */
  month?: string;
}

/**
 * Fetches a paginated, filtered list of transactions for the authenticated user.
 *
 * @param query - Optional query parameters for pagination, filtering and sorting.
 * @returns A promise that resolves to a page response with transactions and metadata.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
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

/**
 * Creates a new transaction for the authenticated user.
 *
 * @param request - The data of the transaction to create.
 * @returns A promise that resolves to the created transaction.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
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

/**
 * Deletes an existing transaction by its id.
 *
 * @param id - The numeric id of the transaction to delete.
 * @returns A promise that resolves once the transaction has been deleted.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
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

/**
 * Exports transactions matching the given filters as a CSV file.
 *
 * @param search - Optional free-text search term.
 * @param type - Optional transaction type filter (`'INCOME'`, `'EXPENSE'` or `'ALL'`).
 * @param categoryId - Optional category id filter.
 * @param month - Optional ISO month (`yyyy-MM`) filter.
 * @returns A promise that resolves to the CSV file contents as a `Blob`.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
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