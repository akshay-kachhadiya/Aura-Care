import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Check, FileCheck2, FileText, Plus, Printer } from 'lucide-react';
import { fee, money, type Invoice, type Lead } from '../lib/data';
import { useCare } from '../state/CareContext';
import Modal from './Modal';

export default function InvoiceCenter() {
  const { leads, invoices } = useCare();
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<Invoice | null>(null);
  const completed = leads.filter(l => l.stage === 5);
  return <div className="py-7">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-ink">Facilitator fee invoices</h2><p className="mt-2 text-xs text-slate-500">Generate a local B2B statement for a discharged case. Invoice currency is USD.</p></div><button className="btn-primary" onClick={() => setCreating(true)} disabled={!completed.length}><Plus size={15} />Generate invoice</button></div>
    {!completed.length && <p className="mb-5 rounded-lg bg-amber-50 p-4 text-xs leading-6 text-amber-900">No discharged cases are available. Move a case to “Discharged / Commission invoiced” in the pipeline first.</p>}
    {invoices.length ? <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[680px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr>{['Invoice', 'Patient / Hospital', 'Date', 'Fee (USD)', 'Document'].map(h => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{invoices.map(invoice => <tr key={invoice.id}><td className="px-5 py-5 font-semibold text-ink">{invoice.number}</td><td className="px-5 py-5"><p className="font-medium text-slate-600">{invoice.patient}</p><p className="mt-1 text-[10px] text-slate-400">{invoice.hospital}</p></td><td className="px-5 py-5 text-slate-500">{invoice.date}</td><td className="px-5 py-5 font-semibold text-teal-600">{money(fee(invoice.bill, invoice.rate))}</td><td className="px-5 py-5"><button className="btn-secondary px-3 py-2" onClick={() => setPreview(invoice)}><FileText size={13} />View / Print</button></td></tr>)}</tbody></table></div> :
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><span className="mb-5 rounded-2xl bg-teal-50 p-4 text-teal-600"><FileCheck2 size={30} /></span><h3 className="font-semibold text-ink">A clear record of every referral.</h3><p className="mt-3 max-w-sm text-xs leading-6 text-slate-400">Create your first facilitator fee invoice with hospital billing, agreed referral rate and remittance instructions.</p><button className="mt-5 flex items-center gap-2 text-xs font-semibold text-teal-600" disabled={!completed.length} onClick={() => setCreating(true)}>Create a fee invoice <ArrowRight size={14} /></button></div>}
    <p className="mt-5 text-[10px] leading-5 text-slate-400">Invoices are saved as snapshots and do not change when a patient case is edited. This app does not process payments, email invoices, determine tax liability or provide a compliant GST tax-invoicing system.</p>
    {creating && <InvoiceForm completed={completed} onClose={() => setCreating(false)} onCreated={invoice => { setCreating(false); setPreview(invoice); }} />}
    {preview && <><Modal title="Invoice preview" onClose={() => setPreview(null)} wide><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Saved local document · USD · Not sent to hospital</p><button className="btn-primary" onClick={() => window.print()}><Printer size={15} />Print / Save as PDF</button></div><InvoiceDocument invoice={preview} /></Modal>{createPortal(<div className="print-document"><InvoiceDocument invoice={preview} /></div>, document.body)}</>}
  </div>;
}

function InvoiceForm({ completed, onClose, onCreated }: { completed: Lead[]; onClose: () => void; onCreated: (invoice: Invoice) => void }) {
  const { addInvoice, invoices } = useCare();
  const [leadId, setLeadId] = useState(completed[0]?.id ?? '');
  const lead = completed.find(l => l.id === leadId)!;
  const [form, setForm] = useState({
    number: `KG-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
    date: new Date().toISOString().slice(0, 10),
    ipd: lead.ipd,
    bill: lead.bill,
    rate: lead.commission,
    bankName: '', account: '', swift: '', gstin: '', iec: '',
    issuerAddress: '',
  });
  const [error, setError] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    if (lead.hospital === 'Unassigned') { setError('Assign a hospital in the patient case before generating an invoice.'); return; }
    if (!form.number.trim() || !form.ipd.trim() || !form.bankName.trim() || !form.account.trim() || !form.swift.trim() || !form.issuerAddress.trim()) { setError('Complete the invoice, admission and remittance fields.'); return; }
    const invoice: Invoice = { ...form, number: form.number.trim(), id: crypto.randomUUID(), leadId, patient: lead.name, hospital: lead.hospital, currency: 'USD' };
    if (addInvoice(invoice)) onCreated(invoice);
    else setError('Invoice was not saved. Use a unique number and check browser storage availability.');
  }
  return <Modal title="Generate facilitator fee invoice" onClose={onClose} wide>
    <p className="mb-5 rounded-lg bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">Local demonstration. Use fictional bank details. Review contractual fees, currency, tax and legal particulars before issuing a real commercial invoice.</p>
    <form onSubmit={submit}>
      <label className="field-label block">Completed patient<select className="input mt-2" value={leadId} onChange={e => { const selected = completed.find(l => l.id === e.target.value)!; setLeadId(selected.id); setForm({ ...form, ipd: selected.ipd, bill: selected.bill, rate: selected.commission }); }}>{completed.map(l => <option key={l.id} value={l.id}>{l.name} · {l.hospital}</option>)}</select></label>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="field-label">Invoice number<input className="input mt-2" required maxLength={60} value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} /></label>
        <label className="field-label">Issue date<input className="input mt-2" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
        <label className="field-label sm:col-span-2">Issuer address / legal particulars<input className="input mt-2" required maxLength={300} value={form.issuerAddress} placeholder="Enter a fictional business address for this demonstration" onChange={e => setForm({ ...form, issuerAddress: e.target.value })} /></label>
        <label className="field-label">IPD admission number<input className="input mt-2" required maxLength={60} value={form.ipd} onChange={e => setForm({ ...form, ipd: e.target.value })} placeholder="Hospital admission reference" /></label>
        <label className="field-label">Total hospital bill (USD)<input className="input mt-2" required type="number" min="0.01" max="10000000" step="0.01" value={form.bill} onChange={e => setForm({ ...form, bill: Number(e.target.value) })} /></label>
        <label className="field-label">Agreed referral fee (%)<input className="input mt-2" required type="number" min="10" max="15" step="0.1" value={form.rate} onChange={e => setForm({ ...form, rate: Number(e.target.value) })} /></label>
        <div className="rounded-lg bg-teal-50 p-4"><p className="text-[10px] text-teal-700">Facilitator fee · USD, exclusive of any applicable tax</p><p className="mt-2 text-2xl font-semibold text-teal-700">{money(fee(form.bill, form.rate))}</p></div>
      </div>
      <h3 className="mb-4 mt-6 border-t pt-5 text-sm font-semibold text-ink">Bank remittance details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="field-label">Bank / branch<input className="input mt-2" required maxLength={120} value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} placeholder="Fictional bank name" /></label>
        <label className="field-label">Current account number<input className="input mt-2" required maxLength={40} value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} placeholder="DEMO-ACCOUNT-001" /></label>
        <label className="field-label">SWIFT / BIC<input className="input mt-2" required maxLength={20} value={form.swift} onChange={e => setForm({ ...form, swift: e.target.value })} placeholder="Fictional SWIFT reference" /></label>
        <label className="field-label">GSTIN <span className="font-normal text-slate-400">(if applicable)</span><input className="input mt-2" maxLength={25} value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="Not supplied" /></label>
        <label className="field-label">IEC code <span className="font-normal text-slate-400">(if applicable)</span><input className="input mt-2" maxLength={25} value={form.iec} onChange={e => setForm({ ...form, iec: e.target.value })} placeholder="Not supplied" /></label>
      </div>
      {error && <p role="alert" className="mt-4 text-xs text-red-700">{error}</p>}
      <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5"><button className="btn-secondary" type="button" onClick={onClose}><ArrowLeft size={14} />Cancel</button><button className="btn-primary" type="submit">Save & preview invoice <Check size={15} /></button></div>
    </form>
  </Modal>;
}

function InvoiceDocument({ invoice: i }: { invoice: Invoice }) {
  const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  return <article className="invoice-document rounded-lg border border-slate-200 bg-white p-6 text-ink sm:p-10">
    <div className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-teal-600 pb-7"><div><p className="text-2xl font-semibold tracking-tight">Kachhadiya Group</p><p className="mt-2 text-[10px] font-semibold uppercase tracking-[.15em] text-teal-600">Healthcare Facilitation Division</p><p className="mt-3 max-w-sm whitespace-pre-wrap text-xs leading-5 text-slate-500">{i.issuerAddress}</p></div><div className="text-right"><p className="text-[10px] uppercase tracking-widest text-slate-400">Facilitator fee invoice</p><p className="mt-2 text-lg font-semibold">{i.number}</p><p className="mt-2 text-xs text-slate-500">Date: {i.date}</p></div></div>
    <div className="grid gap-6 py-7 sm:grid-cols-2"><div><p className="eyebrow">Bill to</p><p className="mt-2 text-sm font-semibold">{i.hospital}</p><p className="mt-2 text-xs text-slate-500">International Patient Care Department</p></div><div><p className="eyebrow">Patient reference</p><p className="mt-2 text-sm font-semibold">{i.patient}</p><p className="mt-2 break-all text-xs text-slate-500">IPD admission: {i.ipd}</p></div></div>
    <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-y border-slate-200 bg-slate-50"><tr><th className="p-3 font-medium">Description</th><th className="p-3 text-right font-medium">Rate</th><th className="p-3 text-right font-medium">Amount (USD)</th></tr></thead><tbody><tr className="border-b border-slate-200"><td className="p-3 leading-6">International patient facilitation fee<br /><span className="text-[10px] text-slate-400">Hospital billing base: {amount.format(i.bill)}</span></td><td className="p-3 text-right">{i.rate}%</td><td className="p-3 text-right font-semibold">{amount.format(fee(i.bill, i.rate))}</td></tr></tbody></table></div>
    <div className="ml-auto mt-6 flex max-w-xs items-center justify-between gap-4 rounded-lg bg-teal-50 p-4"><span className="text-xs font-medium text-teal-700">Facilitator fee due</span><span className="text-xl font-semibold text-teal-700">{amount.format(fee(i.bill, i.rate))}</span></div>
    <section className="mt-9 rounded-lg border border-slate-200 p-5"><h3 className="eyebrow mb-4">Remittance instructions</h3><dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-3 text-xs"><dt className="text-slate-400">Beneficiary</dt><dd>Kachhadiya Group</dd><dt className="text-slate-400">Bank / Branch</dt><dd className="break-all">{i.bankName}</dd><dt className="text-slate-400">Current A/C</dt><dd className="break-all">{i.account}</dd><dt className="text-slate-400">SWIFT / BIC</dt><dd className="break-all">{i.swift}</dd><dt className="text-slate-400">GSTIN</dt><dd>{i.gstin || 'Not supplied / applicability to be reviewed'}</dd><dt className="text-slate-400">IEC</dt><dd>{i.iec || 'Not supplied / applicability to be reviewed'}</dd></dl></section>
    <p className="mt-6 text-[10px] leading-5 text-slate-400">Reference {i.number} in remittance correspondence. Fee is based on the agreed hospital facilitation arrangement. Amounts exclude any applicable taxes, withholding, FX or bank charges; these require separate review. This demonstration statement is not a GST tax invoice and has not been transmitted.</p>
    <div className="mt-10 flex justify-between border-t pt-5 text-[10px] text-slate-400"><span>AuraCare Health Global · A Kachhadiya Group enterprise</span><span>Local demonstration document</span></div>
  </article>;
}
