import { useState, type FormEvent } from 'react';
import { t } from '../../copy';

const ERROR_STATUS = 'Не получилось отправить заявку. Проверьте контакты или напишите нам напрямую.';

export default function RequestForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setSent(true);
      form.reset();
    } catch {
      setError(ERROR_STATUS);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="request-flow" aria-label="Форма заявки на разбор сценария">
      {sent ? (
        <div className="form-done">
          <span className="form-done-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h3>{t('rf.doneTitle')}</h3>
          <p>{t('rf.doneText')}</p>
        </div>
      ) : (
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="rf-name">Имя и компания</label>
            <input
              id="rf-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Анна, юридический отдел"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="rf-email">Рабочий email</label>
            <input
              id="rf-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="anna@company.ru"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="rf-phone">Телефон</label>
            <input
              id="rf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7 999 000-00-00"
            />
          </div>
          <div className="field deploy-field" role="radiogroup" aria-labelledby="rf-deployment-label">
            <span className="field-label" id="rf-deployment-label">
              Формат развёртывания
            </span>
            <div className="deploy-options">
              <label>
                <input type="radio" name="deployment" value="on-premise" defaultChecked />
                <span>On-premise</span>
              </label>
              <label>
                <input type="radio" name="deployment" value="cloud" />
                <span>Облако</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="form-status" role="alert" aria-live="polite">
              {error}
            </p>
          )}
          <button className="form-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправляем...' : t('rf.submit')}
          </button>
        </form>
      )}
    </div>
  );
}
