import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { $variants, blocks, setVariant, resetVariants } from '../../stores/variants';

/** Нижняя панель: переключатель версий блоков (dev/презентация). */
export default function BlockDock() {
  const state = useStore($variants);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" className="blockdock-tab" onClick={() => setOpen(true)}>
        <span className="blockdock-tab-dot" />
        Версии блоков
      </button>
    );
  }

  return (
    <div className="blockdock" role="region" aria-label="Версии блоков">
      <div className="blockdock-head">
        <strong>Версии блоков</strong>
        <span className="blockdock-sub">переключай подачу</span>
        <div className="blockdock-head-actions">
          <button type="button" className="blockdock-reset" onClick={resetVariants}>
            Сброс
          </button>
          <button
            type="button"
            className="blockdock-close"
            aria-label="Свернуть"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="blockdock-list">
        {blocks.length === 0 && (
          <p className="blockdock-empty">Пока нет блоков с версиями. Добавь их в stores/variants.ts.</p>
        )}
        {blocks.map((b) => {
          const active = state[b.id] ?? b.variants[0]?.id;
          return (
            <div className="blockdock-row" key={b.id}>
              <div className="blockdock-row-label">{b.label}</div>
              <div className="blockdock-seg" role="tablist" aria-label={b.label}>
                {b.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className="blockdock-seg-btn"
                    data-active={active === v.id}
                    role="tab"
                    aria-selected={active === v.id}
                    title={v.note}
                    onClick={() => setVariant(b.id, v.id)}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
