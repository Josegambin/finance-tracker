import type {
  Category,
  CreateCategoryRequest
} from '../types/category';
import { errorHandler } from '../services/errorHandler';

import { apiFetch } from '../services/apiClient'; // Ajusta la ruta relativa

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