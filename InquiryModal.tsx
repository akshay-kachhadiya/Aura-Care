import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, LockKeyhole, UploadCloud, X } from 'lucide-react';
import Modal from './Modal';
import { checklistLabels, treatments, validateFile, type Lead } from '../lib/data';
import { useCare } from '../state/CareContext';

interface Attachment { id: string; name: string; size: number; progress: number }
const countries = ['United Kingdom', 'United States', 'Kenya', 'Tanzania', 'Uganda', 'Ethiopia', 'United Arab Emirates', 'Saudi Arabia', 'Oman', 'Bangladesh', 'Uzbekistan', 'Kazakhstan', 'India', 'Other'];

export default function InquiryModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useCare();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [details, setDetails] = useState({ name: '', email: '', country: 'United Kingdom', passportStatus: 'Valid passport', passportReference: '', treatmentId: 'knee', notes: '' });
  const fileInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const busy = files.some(f => f.progress < 100);
  useEffect(() => {
    if (!busy) return;
    const timer = setInterval(() => setFiles(current => current.map(f => ({ ...f, progress: Math.min(100, f.progress + 20) }))), 180);
    return () => clearInterval(timer);
  }, [busy]);
  useEffect(() => { heading.current?.focus(); }, [step, success]);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const selected = Array.from(incoming);
    const invalid = selected.map(file => validateFile(file)).find(Boolean);
    if (invalid) { setError(invalid); return; }
    if (files.length + selected.length > 8) { setError('You can add up to 8 files.'); return; }
    if ([...files, ...selected].reduce((total, f) => total + f.size, 0) > 100 * 1024 * 1024) { setError('The combined file limit is 100 MB.'); return; }
    setError('');
    setFiles(current => [...current, ...selected.filter(f => !current.some(existing => existing.name === f.name && existing.size === f.size)).map(file => ({ id: crypto.randomUUID(), name: file.name, size: file.size, progress: 0 }))]);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (step < 2) { setStep(step + 1); return; }
    if (!consent || busy) return;
    if (!details.name.trim() || !details.email.trim()) { setError('A patient name and email address are required.'); setStep(0); return; }
    const id = crypto.randomUUID();
    const lead: Lead = {
      ...details, name: details.name.trim(), email: details.email.trim(), notes: details.notes.trim(),
      id, hospital: 'Unassigned', stage: 0,
      bill: treatments.find(t => t.id === details.treatmentId)!.india,
      commission: 12, checklist: checklistLabels.map(() => false),
      files: files.map(({ name, size }) => ({ name, size })),
      consent: true, createdAt: new Date().toISOString(), ipd: '', demo: false,
    };
    if (addLead(lead)) setSuccess(id.slice(0, 8).toUpperCase());
    else setError('This inquiry could not be saved. Check the browser storage warning and try again.');
  }
  return <Modal title="Your first step to better care" onClose={onClose}>
    {success ? <div className="py-8 text-center">
      <CheckCircle2 className="mx-auto mb-5 text-teal-600" size={54} strokeWidth={1.5} />
      <h3 ref={heading} tabIndex={-1} className="text-2xl font-semibold text-ink">Your inquiry is saved locally.</h3>
      <p className="mt-4 text-sm leading-7 text-slate-500">Reference <strong className="text-ink">AC-{success}</strong><br />You'll find this case in the Operations hub under New inquiry.</p>
      <p className="mt-4 rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">No medical files were uploaded and no doctor or hospital was contacted. This demonstration does not provide an actual medical opinion or send confirmation emails.</p>
      <button className="btn-primary mx-auto mt-6" onClick={onClose}>Done <Check size={16} /></button>
    </div> : <>
      <div className="mb-6 flex items-center justify-between gap-2">{['Patient details', 'Care needs', 'Reports & consent'].map((label, index) => <div key={label} className={`flex items-center gap-2 text-[10px] sm:text-xs ${step >= index ? 'font-semibold text-teal-700' : 'text-slate-400'}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${step >= index ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>{step > index ? <Check size={13} /> : index + 1}</span>{label}</div>)}</div>
      <div className="mb-6 flex gap-2 rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-900"><LockKeyhole className="mt-0.5 shrink-0" size={15} />Local demonstration only. Use fictional details, not real medical records or passport numbers. Operations data is visible to anyone using this browser.</div>
      <form onSubmit={submit}>
        <h3 ref={heading} tabIndex={-1} className="mb-4 text-base font-semibold text-ink">{['A little about you', 'Help us understand your needs', 'Add report references'][step]}</h3>
        {step === 0 && <div className="grid gap-4 sm:grid-cols-2">
          <label className="field-label">Patient full name<input className="input mt-2" autoComplete="off" required maxLength={100} value={details.name} onChange={e => setDetails({ ...details, name: e.target.value })} placeholder="e.g. Alex Morgan (fictional)" /></label>
          <label className="field-label">Email address<input className="input mt-2" type="email" autoComplete="off" required maxLength={150} value={details.email} onChange={e => setDetails({ ...details, email: e.target.value })} placeholder="alex@example.com" /></label>
          <label className="field-label">Country of origin<select className="input mt-2" value={details.country} onChange={e => setDetails({ ...details, country: e.target.value })}>{countries.map(country => <option key={country}>{country}</option>)}</select></label>
          <label className="field-label">Passport status<select className="input mt-2" value={details.passportStatus} onChange={e => setDetails({ ...details, passportStatus: e.target.value })}>{['Valid passport', 'Renewal in progress', 'Application in progress', 'Need guidance'].map(s => <option key={s}>{s}</option>)}</select></label>
          <label className="field-label sm:col-span-2">Internal passport reference <span className="font-normal text-slate-400">(optional; no passport numbers)</span><input className="input mt-2" maxLength={40} value={details.passportReference} onChange={e => setDetails({ ...details, passportReference: e.target.value })} placeholder="e.g. DEMO-TRAVEL-001" /></label>
        </div>}
        {step === 1 && <div className="space-y-5">
          <label className="field-label block">Treatment needed<select className="input mt-2" value={details.treatmentId} onChange={e => setDetails({ ...details, treatmentId: e.target.value })}>{treatments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
          <label className="field-label block">Medical history & questions <span className="font-normal text-slate-400">(optional)</span><textarea rows={5} maxLength={4000} className="input mt-2 resize-y" value={details.notes} onChange={e => setDetails({ ...details, notes: e.target.value })} placeholder="Use a fictional case summary: symptoms, prior treatment and questions for a specialist." /></label>
          <p className="text-xs leading-6 text-slate-500">A 24–48 hour opinion is a service target after a clinician receives complete reports, not a guarantee. A remote assessment cannot replace an examination.</p>
        </div>}
        {step === 2 && <div>
          <input ref={fileInput} type="file" multiple accept=".pdf,.dcm,.dicom,.jpg,.jpeg,.png" className="hidden" onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
          <button type="button" className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed p-7 text-center transition ${dragging ? 'border-teal-600 bg-teal-100' : 'border-slate-200 bg-slate-50 hover:border-teal-600'}`} onClick={() => fileInput.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}>
            <UploadCloud size={30} className="mb-3 text-teal-600" /><span className="text-sm font-semibold text-ink">Drop sample files here or browse</span><span className="mt-2 text-[11px] leading-5 text-slate-400">MRI / CT DICOM, PDF, JPG, PNG · 20 MB each<br />Up to 8 files · 100 MB total · optional</span>
          </button>
          <p className="mt-2 text-[10px] leading-5 text-slate-400">Progress is simulated. File contents never leave your device and are not saved. Only filenames and sizes are stored in the case.</p>
          <div className="mt-4 space-y-3">{files.map(file => <div key={file.id} className="rounded-lg border border-slate-100 p-3"><div className="flex items-center gap-3"><FileText size={17} className="shrink-0 text-teal-600" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-ink">{file.name}</p><p className="mt-1 text-[10px] text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.progress === 100 ? 'Reference ready' : `Simulating ${file.progress}%`}</p></div><button type="button" onClick={() => setFiles(current => current.filter(f => f.id !== file.id))} className="icon-btn" aria-label={`Remove ${file.name}`}><X size={15} /></button></div><div role="progressbar" aria-label={`Simulated progress for ${file.name}`} aria-valuenow={file.progress} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-1 rounded bg-slate-100"><div className="h-1 rounded bg-teal-600 transition-all" style={{ width: `${file.progress}%` }} /></div></div>)}</div>
          <label className="mt-6 flex items-start gap-3 text-xs leading-6 text-slate-500"><input type="checkbox" className="mt-1 accent-teal-600" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>I agree to store these fictional details in this browser's public demonstration CRM. I understand this does not send records or request a real clinical consultation.</span></label>
        </div>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><button type="button" className="btn-secondary" onClick={() => step === 0 ? onClose() : setStep(step - 1)}><ArrowLeft size={15} />{step === 0 ? 'Cancel' : 'Back'}</button><button type="submit" className="btn-primary" disabled={busy || (step === 2 && !consent)}>{step < 2 ? 'Continue' : 'Save inquiry locally'}<ArrowRight size={15} /></button></div>
      </form>
    </>}
  </Modal>;
}
