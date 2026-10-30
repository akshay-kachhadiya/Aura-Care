import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'max-w-4xl' : 'max-w-xl'}`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <button className="icon-btn" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
    </div>
    <div className="p-6">{children}</div>
  </dialog>;
}
