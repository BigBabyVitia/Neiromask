import { useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="nav-pill grid h-[52px] w-[52px] place-items-center text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      {open && (
        <nav
          className="absolute inset-x-0 top-full mt-2 flex flex-col gap-0.5 rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] shadow-card"
          aria-label="Разделы"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 last:border-b-0"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
