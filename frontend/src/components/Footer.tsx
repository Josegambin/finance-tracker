import { useTranslation } from 'react-i18next';

const APP_VERSION = '1.1.0';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-top bg-body-tertiary">
      <div className="container d-flex flex-wrap justify-content-center gap-2 text-muted small">
        <span>{t('footer.developedBy', 'Desarrollado por Josegambin')}</span>
        <span aria-hidden="true">·</span>
        <span>{t('footer.version', { version: APP_VERSION, defaultValue: `Versión ${APP_VERSION}` })}</span>
      </div>
    </footer>
  );
}
