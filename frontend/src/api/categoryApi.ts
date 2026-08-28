import type {
  Category,
  CreateCategoryRequest
} from '../types/category';

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

export async function getCategories():
  Promise<Category[]> {

  const response =
    await fetch(
      `${API_URL}/categories`,
      {
        headers: getHeaders()
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error loading categories'
    );
  }

  return response.json();
}

export async function createCategory(
  request: CreateCategoryRequest
): Promise<Category> {

  const response =
    await fetch(
      `${API_URL}/categories`,
      {
        method: 'POST',

        headers: getHeaders(),

        body: JSON.stringify(request)
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error creating category'
    );
  }

  return response.json();
}

export async function deleteCategory(
  id: number
): Promise<void> {

  const response =
    await fetch(
      `${API_URL}/categories/${id}`,
      {
        method: 'DELETE',

        headers: getHeaders()
      }
    );

  if (!response.ok) {
    throw new Error(
      'Error deleting category'
    );
  }
}