import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User
} from '../types/auth';

const API_URL = 'http://localhost:8080/api';

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(request)
    }
  );

  if (!response.ok) {
    throw new Error(
      'Invalid email or password'
    );
  }

  return response.json();
}

export async function register(
  request: RegisterRequest
): Promise<User> {

  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(request)
    }
  );

  if (!response.ok) {

    const error = await response.text();

    throw new Error(
      error || 'Error creating user'
    );
  }

  return response.json();
}