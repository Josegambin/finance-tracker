import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User
} from '../types/auth';
import { errorHandler } from '../services/errorHandler';
import { apiFetch } from '../services/apiClient';


export async function login(
  request: LoginRequest
): Promise<LoginResponse> {

  const response = await apiFetch(
    `/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(request)
    }
  );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }

  return response.json();
}

export async function register(
  request: RegisterRequest
): Promise<User> {

  const response = await apiFetch(
    `/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(request)
    }
  );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }

  return response.json();
}

export async function refreshToken(
  refreshToken: string
): Promise<LoginResponse> {

  const response = await apiFetch(
    `/auth/refresh`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ refreshToken })
    }
  );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }

  return response.json();
}

export async function logout(
  refreshToken: string
): Promise<void> {

  const response = await apiFetch(
    `/auth/logout`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ refreshToken })
    }
  );

  if (!response.ok) {
    const error = await errorHandler.parseApiError(response);
    throw errorHandler.handle(error);
  }
}