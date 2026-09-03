import {
  useState,
  type FormEvent
} from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

import type { LoginRequest } from '../types/auth';

export default function Login() {

  const { login: saveToken } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] =
    useState<LoginRequest>({
      email: '',
      password: ''
    });

  const [error, setError] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError(null);
    setLoading(true);

    try {

      const data = await login(form);

      // ✅ CORREGIDO: Guardamos accessToken y refreshToken
      saveToken(data.accessToken, data.refreshToken);

      navigate('/dashboard');

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'Unexpected error'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <main>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm({
              ...form,
              password: event.target.value
            })
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Logging in...'
            : 'Login'
          }
        </button>

        {error && (
          <p>{error}</p>
        )}

        <p>
            Don't have an account?

            <Link to="/register">
                Register
            </Link>
        </p>

      </form>

    </main>
  );
}