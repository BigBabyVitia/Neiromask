import { useEffect, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  // While the full-screen menu is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Unlock scroll synchronously here (not only via the effect cleanup) so the
  // browser's native anchor scroll on link clicks isn't swallowed by the lock.
  const close = () => {
    document.body.style.overflow = '';
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Открыть меню"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="nav-burger grid h-11 w-11 place-items-center"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="5" y1="7.5" x2="19" y2="7.5" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="5" y1="16.5" x2="19" y2="16.5" />
        </svg>
      </button>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Меню">
          <div className="mobile-menu__bar">
            <a className="nav-logo" href="#top" onClick={close}>
              <span className="logo-mark" aria-hidden="true">
                <img className="logo-shield" src="/logo-shield.svg" alt="" width="36" height="36" />
              </span>
              <span className="nav-logo-name">НейроМаск</span>
            </a>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={close}
              className="nav-burger grid h-11 w-11 place-items-center"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu__links" aria-label="Разделы">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="mobile-menu__link"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#request"
            onClick={close}
            className="btn btn--round mobile-menu__cta"
          >
            Разобрать сценарий
          </a>
        </div>
      )}
    </div>
  );
}
