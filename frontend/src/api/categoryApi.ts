/**
 * API client functions for managing categories.
 *
 * All functions use {@link apiFetch} and attach the authentication token via
 * {@link getHeaders}. Errors are normalized with {@link errorHandler}.
 */

import type {
  Category,
  CreateCategoryRequest
} from '../types/category';
import { errorHandler } from '../services/errorHandler';

import { apiFetch } from '../services/apiClient';

/**
 * Builds the headers for category requests, including the `Bearer` token
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
 * Fetches all categories for the currently authenticated user.
 *
 * @returns A promise that resolves to the list of categories.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
export async function getCategories():
  Promise<Category[]> {

  const response =
    await apiFetch(
      `/categories`,
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
 * Creates a new category for the authenticated user.
 *
 * @param request - The name and type of the new category.
 * @returns A promise that resolves to the created category.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
export async function createCategory(
  request: CreateCategoryRequest
): Promise<Category> {

  const response =
    await apiFetch(
      `/categories`,
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
 * Deletes an existing category by its id.
 *
 * @param id - The numeric id of the category to delete.
 * @returns A promise that resolves once the category has been deleted.
 * @throws Throws the error normalized by {@link errorHandler} if the request fails.
 */
export async function deleteCategory(
  id: number
): Promise<void> {

  const response =
    await apiFetch(
      `/categories/${id}`,
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