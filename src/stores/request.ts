import { atom } from 'nanostores';

/** Открыта ли модалка с формой заявки (CTA со всей страницы открывают её). */
export const $requestModalOpen = atom<boolean>(false);

export function openRequestModal() {
  $requestModalOpen.set(true);
}

export function closeRequestModal() {
  $requestModalOpen.set(false);
}
