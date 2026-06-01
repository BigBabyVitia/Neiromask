import { atom } from 'nanostores';

export type Concept = 'contour' | 'pixel' | 'stream' | 'twin' | 'document' | 'chat';

export interface ConceptMeta {
  label: string;
  title: string;
  pill: string;
  note: string;
}

/** Order + copy for the design-concept switcher (dev tool). */
export const conceptOrder: Concept[] = ['contour', 'pixel', 'stream', 'twin', 'document', 'chat'];

export const conceptMeta: Record<Concept, ConceptMeta> = {
  contour: {
    label: 'Схема',
    title: 'Простая схема маскирования',
    pill: 'API flow',
    note: 'Главная схема: исходные ФИО, телефон и паспорт превращаются в плейсхолдеры до отправки во внешнюю API-модель.',
  },
  pixel: {
    label: 'Пиксели',
    title: 'Пиксельное шифрование',
    pill: 'visual hook',
    note: 'Креативный эффект: персональные данные визуально распадаются на пиксели и превращаются в безопасные плейсхолдеры.',
  },
  stream: {
    label: 'Поток',
    title: 'Шифровальный поток',
    pill: 'tech / API',
    note: 'Техническое направление для AI/product teams: запрос, RAG-контекст и маскирование выглядят как защищённый data pipeline.',
  },
  twin: {
    label: 'Двойник',
    title: 'Приватный двойник',
    pill: 'business simple',
    note: 'Бизнес-метафора: внешняя LLM работает с безопасным двойником данных, а реальные значения остаются внутри Нейроключа.',
  },
  document: {
    label: 'Документ',
    title: 'Документ под стеклом',
    pill: 'demo first',
    note: 'Прикладное направление: тикеты, договоры и клиентские документы показываются как рабочие материалы с подсветкой рисков.',
  },
  chat: {
    label: 'Чат-демо',
    title: 'Пошаговое чат-демо',
    pill: 'scenario',
    note: 'Живой сценарий: пользователь отправляет документ и промпт, НейроМаск маскирует данные, LLM отвечает, Нейроключ восстанавливает результат.',
  },
};

/** Shared cross-island state. */
export const $concept = atom<Concept>('contour');
export const $annotations = atom<boolean>(false);
