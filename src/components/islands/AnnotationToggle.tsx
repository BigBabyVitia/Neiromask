import { useStore } from '@nanostores/react';
import { $annotations } from '../../stores/concept';

export default function AnnotationToggle() {
  const on = useStore($annotations);

  return (
    <button
      type="button"
      className="annotation-toggle"
      aria-pressed={on}
      onClick={() => $annotations.set(!on)}
    >
      <span className="annotation-toggle-indicator" data-on={on} aria-hidden="true" />
      <span>{on ? 'Разметка включена' : 'Разметка скрыта'}</span>
    </button>
  );
}
