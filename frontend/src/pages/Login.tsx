import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import type { LoginRequest } from '../types/auth';

export default function Login() {
  const { t } = useTranslation();
  const { login: saveToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(form);
      saveToken(data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>{t('auth.login')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('auth.email')}
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.loginButton')}
        </button>
        {error && <p>{error}</p>}
        <p>
          {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
        </p>
      </form>
    </main>
  );
}