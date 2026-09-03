// src/services/apiClient.ts
const API_URL = 'http://localhost:8080/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('finance_tracker_token');

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    // Lanza un error genérico si el servidor responde con error
    // (Puedes integrar tu errorHandler aquí si lo prefieres)
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response;
}