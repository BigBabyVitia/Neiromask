import { map } from 'nanostores';

/* ============================================================
   Block-variant switcher (dev / presentation tool).

   Каждый "блок" страницы может иметь несколько версий подачи
   одной и той же информации. Нижняя панель (BlockDock) позволяет
   на лету переключать версии, чтобы показать «как ещё можно
   подать этот блок».

   Как добавить версию блоку:
   1. Сверстай вторую версию секции отдельным .astro-компонентом
      (напр. ProblemB.astro) — та же копия из copy.ts, другая подача.
   2. В index.astro оберни каждую версию в <BlockVariant block="…"
      variant="…"> … </BlockVariant>.
   3. Добавь/расширь запись блока в `blocks` ниже. `defaultVariantId`
      или первый вариант в списке = дефолт (рендерится сервером, виден без JS).

   Архив:
   - `archived: true` оставляет вариант в коде и в index.astro, но прячет
     его из BlockDock и не восстанавливает из localStorage.
   - Сейчас в публичной версии оставлена только "Лента" для блока "Как работает";
     остальные версии сохранены как архив для будущих сравнений.
   ============================================================ */

export interface VariantDef {
  id: string;
  /** Подпись на кнопке в панели. */
  label: string;
  /** Подсказка (tooltip) — чем версия отличается. */
  note?: string;
  /** Архивный вариант: хранится в коде, но не показывается в панели. */
  archived?: boolean;
}

export interface BlockDef {
  id: string;
  /** Имя блока в панели. */
  label: string;
  /** Явный дефолт для продакшна. Если не задан, берётся первая версия. */
  defaultVariantId?: string;
  /** Версии. Архивные не показываются в BlockDock. */
  variants: VariantDef[];
}

/** Реестр переключаемых блоков. Порядок = порядок в панели. */
export const blocks: BlockDef[] = [
  {
    id: 'hero',
    label: 'Первый экран',
    variants: [
      { id: 'a', label: 'Текущий', note: 'Сторонние AI на реальных документах — без передачи ПДн', archived: true },
      { id: 'b', label: 'Уточнённый', note: 'Тот же H1, лид про обезличенный текст', archived: true },
      { id: 'c', label: 'Разрешающий', note: '«Используйте внешние нейросети» — outcome', archived: true },
      { id: 'd', label: 'Страх утечки', note: '«И ни одного ПДн наружу»', archived: true },
      { id: 'e', label: 'Механика', note: '«Маскируем до отправки» — как работает', archived: true },
      { id: 'f', label: 'Короткий', note: '«Сильный AI без утечки» — дерзко', archived: true },
      { id: 'g', label: 'Комплаенс', note: 'Акцент на 152-ФЗ', archived: true },
    ],
  },
  {
    id: 'how',
    label: 'Как работает',
    defaultVariantId: 'd',
    variants: [
      { id: 'a', label: 'Вертикальный', note: 'Текущий: шаги вертикалью + 3D-сцены', archived: true },
      { id: 'b', label: 'Короткий таймлайн', note: 'Горизонтальная лента шагов (компактно)', archived: true },
      { id: 'c', label: 'Компактный', note: 'Вертикальные карточки ниже и с меньшим шагом скролла', archived: true },
      { id: 'd', label: 'Лента', note: 'Aceternity-style: номер шага слева, текст и визуал справа' },
    ],
  },
];

export function visibleVariants(block: BlockDef): VariantDef[] {
  return block.variants.filter((v) => !v.archived);
}

/** Дефолтная версия блока. */
export function defaultVariant(blockId: string): string {
  const block = blocks.find((b) => b.id === blockId);
  return block?.defaultVariantId ?? block?.variants[0]?.id ?? '';
}

const defaults: Record<string, string> = Object.fromEntries(
  blocks.map((b) => [b.id, defaultVariant(b.id)]),
);

/** Текущая версия каждого блока: { [blockId]: variantId }. */
export const $variants = map<Record<string, string>>({ ...defaults });

const LS_KEY = 'nm-block-variants';

// Восстановление выбора + сохранение — только на клиенте.
if (typeof window !== 'undefined') {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}') as Record<string, string>;
    const merged = { ...defaults };
    for (const b of blocks) {
      const v = saved[b.id];
      if (v && visibleVariants(b).some((x) => x.id === v)) merged[b.id] = v;
    }
    $variants.set(merged);
  } catch {
    /* битый localStorage — игнор, остаёмся на дефолтах */
  }
  $variants.subscribe((s) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(s));
    } catch {
      /* приватный режим / квота — не критично */
    }
  });
}

export function setVariant(blockId: string, variantId: string): void {
  const block = blocks.find((b) => b.id === blockId);
  if (!block || !visibleVariants(block).some((v) => v.id === variantId)) return;
  $variants.setKey(blockId, variantId);
}

export function resetVariants(): void {
  $variants.set({ ...defaults });
}
