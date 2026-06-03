import { useEffect, useId, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $requestModalOpen, closeRequestModal } from '../../stores/request';
import { t } from '../../copy';
import RequestForm from './RequestForm';

export default function RequestModal() {
  const open = useStore($requestModalOpen);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Пока модалка открыта: блокируем скролл страницы, закрываем по Escape,
  // переносим фокус внутрь и возвращаем его на триггер при закрытии.
  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRequestModal();
    };
    window.addEventListener('keydown', onKey);

    // Фокус на первое поле формы.
    panelRef.current?.querySelector<HTMLElement>('input, button')?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="request-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        // Закрытие только по клику в подложку, не по перетаскиванию из панели.
        if (e.target === e.currentTarget) closeRequestModal();
      }}
    >
      <div className="request-modal__panel" ref={panelRef}>
        <button
          type="button"
          className="request-modal__close"
          aria-label="Закрыть"
          onClick={closeRequestModal}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="request-modal__head">
          <h2 id={titleId}>{t('rf.h2')}</h2>
          <p>{t('rf.lead')}</p>
        </div>

        <RequestForm />
      </div>
    </div>
  );
}
