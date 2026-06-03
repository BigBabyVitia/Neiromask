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
