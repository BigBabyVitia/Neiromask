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
   3. Добавь/расширь запись блока в `blocks` ниже. Первый вариант
      в списке = дефолт (рендерится сервером, виден без JS).
   ============================================================ */

export interface VariantDef {
  id: string;
  /** Подпись на кнопке в панели. */
  label: string;
  /** Подсказка (tooltip) — чем версия отличается. */
  note?: string;
}

export interface BlockDef {
  id: string;
  /** Имя блока в панели. */
  label: string;
  /** Версии. Первая = дефолт. */
  variants: VariantDef[];
}

/** Реестр переключаемых блоков. Порядок = порядок в панели. */
export const blocks: BlockDef[] = [
  {
    id: 'hero',
    label: 'Первый экран',
    variants: [
      { id: 'a', label: 'Текущий', note: 'Сторонние AI на реальных документах — без передачи ПДн' },
      { id: 'b', label: 'Уточнённый', note: 'Тот же H1, лид про обезличенный текст' },
      { id: 'c', label: 'Разрешающий', note: '«Используйте внешние нейросети» — outcome' },
      { id: 'd', label: 'Страх утечки', note: '«И ни одного ПДн наружу»' },
      { id: 'e', label: 'Механика', note: '«Маскируем до отправки» — как работает' },
      { id: 'f', label: 'Короткий', note: '«Сильный AI без утечки» — дерзко' },
      { id: 'g', label: 'Комплаенс', note: 'Акцент на 152-ФЗ' },
    ],
  },
  {
    id: 'how',
    label: 'Как работает',
    variants: [
      { id: 'a', label: 'Вертикальный', note: 'Текущий: шаги вертикалью + 3D-сцены' },
      { id: 'b', label: 'Короткий таймлайн', note: 'Горизонтальная лента шагов (компактно)' },
    ],
  },
];

/** Дефолтная (первая) версия блока. */
export function defaultVariant(blockId: string): string {
  return blocks.find((b) => b.id === blockId)?.variants[0]?.id ?? '';
}

const defaults: Record<string, string> = Object.fromEntries(
  blocks.map((b) => [b.id, b.variants[0]?.id ?? '']),
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
      if (v && b.variants.some((x) => x.id === v)) merged[b.id] = v;
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
  $variants.setKey(blockId, variantId);
}

export function resetVariants(): void {
  $variants.set({ ...defaults });
}
