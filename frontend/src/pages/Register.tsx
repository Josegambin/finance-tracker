import {
  useState,
  type FormEvent
} from 'react';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import { register } from '../api/authApi';

import type { RegisterRequest } from '../types/auth';

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState<RegisterRequest>({
      name: '',
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

      await register(form);

      navigate('/login');

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

      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(event) =>
            setForm({
              ...form,
              name: event.target.value
            })
          }
        />

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
            ? 'Creating account...'
            : 'Create account'
          }
        </button>

        {error && (
          <p>{error}</p>
        )}

        <p>
            Already have an account?

            <Link to="/login">
                Login
            </Link>
        </p>
      </form>

    </main>
  );
}