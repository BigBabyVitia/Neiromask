import { useStore } from '@nanostores/react';
import { $concept, conceptMeta } from '../../stores/concept';

export default function ConceptHeader() {
  const concept = useStore($concept);
  const meta = conceptMeta[concept];

  return (
    <div className="mb-[18px] flex items-center justify-center gap-3.5 text-center">
      <div className="grid gap-1.5">
        <div className="text-[12px] font-extrabold uppercase text-muted">
          Черновик визуального направления
        </div>
        <h3 className="text-[22px]">{meta.title}</h3>
      </div>
      <span className="pill">{meta.pill}</span>
    </div>
  );
}
