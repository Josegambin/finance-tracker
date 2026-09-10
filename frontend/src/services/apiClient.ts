import { AppApiError } from './errorHandler';

const API_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'finance_tracker_token';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers ?? {});

  headers.set('Accept', 'application/json');

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    const message = payload?.message || payload?.error || `Error ${response.status}`;
    const errors = payload?.errors ?? undefined;

    throw new AppApiError(message, response.status, errors);
  }

  return response;
}