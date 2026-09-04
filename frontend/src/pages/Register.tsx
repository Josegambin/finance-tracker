import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { useTranslation } from 'react-i18next';
import type { RegisterRequest } from '../types/auth';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100 p-3"
      style={{ background: 'var(--app-auth-bg)' }}
    >
      <div className="card border-0 p-4 p-md-5 w-100 rounded-4" style={{ maxWidth: '440px', boxShadow: 'var(--app-shadow-md)' }}>
        <div className="text-center mb-4">
          <span
            className="brand-logo d-inline-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
            style={{ width: 56, height: 56, fontSize: '1.6rem', fontWeight: 800 }}
          >
            €
          </span>
          <h1 className="h3 mb-1 fw-bold">{t('auth.register')}</h1>
          <p className="text-muted small mb-0">Finance Tracker</p>
        </div>
        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <div>
            <label htmlFor="register-name" className="form-label">{t('auth.username')}</label>
            <input
              id="register-name"
              type="text"
              className="form-control"
              placeholder={t('auth.username')}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="register-email" className="form-label">{t('auth.email')}</label>
            <input
              id="register-email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="register-password" className="form-label">{t('auth.password')}</label>
            <input
              id="register-password"
              type="password"
              className="form-control"
              placeholder="••"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {t('auth.creatingAccount')}
              </>
            ) : (
              t('auth.registerButton')
            )}
          </button>
          {error && <div className="alert alert-danger py-2 mb-0">{error}</div>}
          <p className="text-center text-muted small mb-0 mt-2">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="fw-semibold text-decoration-none">{t('auth.login')}</Link>
          </p>
        </form>
      </div>
    </main>
  );
}