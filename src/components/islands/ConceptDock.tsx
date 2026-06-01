import { useStore } from '@nanostores/react';
import { $concept, conceptOrder, conceptMeta } from '../../stores/concept';

export default function ConceptDock() {
  const concept = useStore($concept);

  return (
    <div className="concept-dock" id="concepts" aria-label="Переключатель дизайн-концепций">
      <div className="concept-dock-row" role="tablist" aria-label="Дизайн-концепции">
        {conceptOrder.map((c) => (
          <button
            key={c}
            type="button"
            className="concept-button"
            data-active={concept === c}
            aria-selected={concept === c}
            onClick={() => $concept.set(c)}
          >
            {conceptMeta[c].label}
          </button>
        ))}
      </div>
      <div className="concept-dock-note">{conceptMeta[concept].note}</div>
    </div>
  );
}
