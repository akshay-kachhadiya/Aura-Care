import { useState } from 'react';
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseMedical, Check, ChevronRight, CircleDollarSign, FileText, Filter, LayoutGrid, PlaneLanding, Plus, Search, Users } from 'lucide-react';
import { useCare } from '../state/CareContext';
import { checklistLabels, fee, hospitals, initials, money, nextStage, stages, treatments, type Lead, type Stage } from '../lib/data';
import Modal from './Modal';
import InvoiceCenter from './InvoiceCenter';

export default function Operations({ onInquiry }: { onInquiry: () => void }) {
  const { leads, currency, updateLead, toast } = useCare();
  const [tab, setTab] = useState<'pipeline' | 'invoices'>('pipeline');
  const [query, setQuery] = useState('');
  const [hospital, setHospital] = useState('all');
  const [stage, setStage] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = leads.find(l => l.id === selectedId);
  const active = leads.filter(l => l.stage < 5);
  const pipeline = active.reduce((sum, l) => sum + l.bill, 0);
  const commission = active.reduce((sum, l) => sum + fee(l.bill, l.commission), 0);
  const landed = leads.filter(l => l.stage === 3 || l.stage === 4).length;
  const filtered = leads.filter(l => `${l.name} ${l.country} ${l.id} ${l.email}`.toLowerCase().includes(query.toLowerCase().trim()) && (hospital === 'all' || l.hospital === hospital) && (stage === 'all' || l.stage === Number(stage)));
  const metrics = [
    { label: 'Active inbound cases', value: String(active.length).padStart(2, '0'), icon: Users, sub: `${leads.length} total cases in workspace`, color: 'bg-teal-50 text-teal-600' },
    { label: 'Gross billing pipeline', value: money(pipeline, currency), icon: BriefcaseMedical, sub: 'Estimated open hospital billing', color: 'bg-blue-50 text-blue-600' },
    { label: 'Projected commission', value: money(commission, currency), icon: CircleDollarSign, sub: 'Based on per-case 10–15% fees', color: 'bg-violet-50 text-violet-600' },
    { label: 'In-country patients', value: String(landed).padStart(2, '0'), icon: PlaneLanding, sub: 'Landed or currently in hospital', color: 'bg-amber-50 text-amber-600' },
  ];
  return <div className="bg-paper pb-14">
    <div className="page-shell py-9">
      <div className="mb-7 rounded-lg border border-amber-200/70 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-900"><strong>Local demo workspace · not an authenticated staff portal.</strong> Seed cases are fictional. All records stay on this browser. Do not enter real patient information; no emails, visas, hospital bookings or invoices are sent.</div>
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">Kachhadiya Group / Healthcare facilitation</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Care operations, <span className="font-display italic text-teal-600">connected.</span></h1><p className="mt-3 text-sm text-slate-500">The complete picture. Every patient. Every step.</p></div><button onClick={onInquiry} className="btn-primary"><Plus size={16} />New inquiry</button></div>
      <div className="my-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, sub, color }) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-500">{label}</p><span className={`rounded-lg p-2 ${color}`}><Icon size={17} /></span></div><p className="mt-3 text-[30px] font-semibold tracking-tight text-ink">{value}</p><p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400"><span className="h-1 w-1 rounded-full bg-teal-600" />{sub}</p></article>)}</div>
      <div className="flex gap-6 border-b border-slate-200"><button className={`tab ${tab === 'pipeline' ? 'tab-active' : ''}`} onClick={() => setTab('pipeline')}><LayoutGrid size={15} />Patient pipeline<span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">{leads.length}</span></button><button className={`tab ${tab === 'invoices' ? 'tab-active' : ''}`} onClick={() => setTab('invoices')}><FileText size={15} />Commission invoices</button></div>
      {tab === 'pipeline' ? <>
        <div className="my-5 flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={15} /><span className="sr-only">Search patient cases</span><input className="input pl-9" placeholder="Search patient, country or reference…" value={query} onChange={e => setQuery(e.target.value)} /></label>
          <label className="relative"><span className="sr-only">Filter by hospital</span><select className="input max-w-[250px] pl-8" value={hospital} onChange={e => setHospital(e.target.value)}><option value="all">All hospitals</option><option>Unassigned</option>{hospitals.map(h => <option key={h}>{h}</option>)}</select><Filter size={13} className="pointer-events-none absolute left-3 top-3.5 text-slate-400" /></label>
          <label><span className="sr-only">Filter by stage</span><select className="input max-w-[235px]" value={stage} onChange={e => setStage(e.target.value)}><option value="all">All stages</option>{stages.map((s, i) => <option key={s} value={i}>{s}</option>)}</select></label>
          {(query || hospital !== 'all' || stage !== 'all') && <button className="text-xs font-semibold text-teal-600" onClick={() => { setQuery(''); setHospital('all'); setStage('all'); }}>Clear filters</button>}
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400"><span>{filtered.length} of {leads.length} cases · KPI totals include all cases, not just filtered results</span><span className="flex items-center gap-1">Use card arrows to move stages <ArrowRight size={12} /></span></div>
        <div className="kanban-scroll overflow-x-auto pb-5" tabIndex={0} role="region" aria-label="Patient pipeline, horizontally scrollable">
          <div className="grid min-w-[1610px] grid-cols-6 items-start gap-3">
            {stages.map((label, index) => {
              const cards = filtered.filter(l => l.stage === index);
              return <section key={label} className="min-h-[320px] rounded-xl border border-slate-200/70 bg-[#eef2f1] p-3">
                <div className="mb-4 flex min-h-10 items-center gap-2"><span className={`h-2 w-2 shrink-0 rounded-full ${['bg-blue-400', 'bg-violet-400', 'bg-amber-400', 'bg-cyan-500', 'bg-teal-600', 'bg-emerald-500'][index]}`} /><h2 className="flex-1 text-[11px] font-semibold leading-5 text-ink">{label}</h2><span className="rounded bg-white px-2 py-0.5 text-[10px] text-slate-500">{cards.length}</span></div>
                <div className="space-y-3">{cards.map(lead => <article key={lead.id} className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-600/30">
                  <button className="w-full p-4 text-left" onClick={() => setSelectedId(lead.id)} aria-label={`Open ${lead.name}'s case`}>
                    <div className="flex items-center gap-2.5"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${lead.stage % 2 ? 'bg-[#e9e9f4] text-violet-600' : 'bg-teal-50 text-teal-700'}`}>{initials(lead.name)}</span><div className="min-w-0"><h3 className="truncate text-xs font-semibold text-ink">{lead.name}</h3><p className="mt-1 text-[10px] text-slate-400">{lead.country}</p></div></div>
                    <p className="mt-4 text-[11px] font-medium text-slate-600">{treatments.find(t => t.id === lead.treatmentId)?.name}</p>
                    <p className="mt-2 truncate text-[10px] text-slate-400">{lead.hospital}</p>
                    <div className="mt-4 flex items-center justify-between"><span className="text-sm font-semibold text-ink">{money(lead.bill, currency)}</span><span className="rounded bg-slate-50 px-1.5 py-1 text-[9px] text-slate-400">{lead.demo ? 'SAMPLE' : 'LOCAL INQUIRY'}</span></div>
                  </button>
                  <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2"><button className="icon-btn h-7 w-7" disabled={index === 0} onClick={() => updateLead(lead.id, { stage: nextStage(lead.stage, -1) })} aria-label={`Move ${lead.name} to previous stage`}><ArrowLeft size={14} /></button><button className="text-[10px] font-medium text-teal-600" onClick={() => setSelectedId(lead.id)}>View case</button><button className="icon-btn h-7 w-7" disabled={index === 5} onClick={() => updateLead(lead.id, { stage: nextStage(lead.stage, 1) })} aria-label={`Move ${lead.name} to next stage`}><ArrowRight size={14} /></button></div>
                </article>)}</div>
                {!cards.length && <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/70 p-5 text-center"><span className="mb-2 rounded-full bg-white p-2 text-slate-300"><ArrowDownLeft size={16} /></span><p className="text-[10px] leading-5 text-slate-400">No cases in this stage<br />Matching cases will appear here</p></div>}
              </section>;
            })}
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-teal-100 bg-teal-50 p-4 text-[11px] leading-5 text-teal-700"><Check size={15} className="mt-0.5 shrink-0" /><span>Case movements save automatically. Stage labels are workflow markers only: moving a card does not issue a visa, schedule surgery or create an invoice. Generate fee invoices separately after discharge.</span></div>
      </> : <InvoiceCenter />}
      {selected && <CaseDrawer key={selected.id} lead={selected} onClose={() => setSelectedId(null)} onSave={patch => { if (updateLead(selected.id, patch)) toast('Case changes saved on this browser.'); }} />}
    </div>
  </div>;
}

function CaseDrawer({ lead, onClose, onSave }: { lead: Lead; onClose: () => void; onSave: (patch: Partial<Lead>) => void }) {
  const [draft, setDraft] = useState({ hospital: lead.hospital, notes: lead.notes, passportStatus: lead.passportStatus, passportReference: lead.passportReference, checklist: [...lead.checklist], bill: lead.bill, commission: lead.commission, ipd: lead.ipd, stage: lead.stage });
  const { currency } = useCare();
  return <Modal title="Patient case details" onClose={onClose} wide>
    <div className="mb-6 flex flex-wrap items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-lg font-semibold text-teal-700">{initials(lead.name)}</span><div><h3 className="text-xl font-semibold text-ink">{lead.name}</h3><p className="mt-1 text-xs text-slate-400">{lead.country} <ChevronRight className="inline" size={11} /> {lead.email}</p></div><span className="ml-auto rounded-full bg-teal-50 px-3 py-1.5 text-[10px] text-teal-700">AC-{lead.id.slice(0, 8).toUpperCase()}</span></div>
    <form onSubmit={e => { e.preventDefault(); onSave(draft); }}>
      <div className="grid gap-6 md:grid-cols-2"><div className="space-y-4">
        <label className="field-label block">Pipeline stage<select className="input mt-2" value={draft.stage} onChange={e => setDraft({ ...draft, stage: Number(e.target.value) as Stage })}>{stages.map((s, i) => <option value={i} key={s}>{s}</option>)}</select></label>
        <label className="field-label block">Assigned partner hospital<select className="input mt-2" value={draft.hospital} onChange={e => setDraft({ ...draft, hospital: e.target.value })}><option>Unassigned</option>{hospitals.map(h => <option key={h}>{h}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="field-label">Passport status<select className="input mt-2" value={draft.passportStatus} onChange={e => setDraft({ ...draft, passportStatus: e.target.value })}>{['Valid passport', 'Renewal in progress', 'Application in progress', 'Need guidance'].map(s => <option key={s}>{s}</option>)}</select></label><label className="field-label">Internal travel reference<input className="input mt-2" maxLength={40} value={draft.passportReference} onChange={e => setDraft({ ...draft, passportReference: e.target.value })} placeholder="No passport numbers" /></label></div>
        <label className="field-label block">IPD admission reference<input className="input mt-2" maxLength={60} value={draft.ipd} onChange={e => setDraft({ ...draft, ipd: e.target.value })} placeholder="e.g. DEMO-IPD-1001" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="field-label">Hospital bill (USD base)<input required type="number" min="0" max="10000000" step="0.01" className="input mt-2" value={draft.bill} onChange={e => setDraft({ ...draft, bill: Number(e.target.value) })} /></label><label className="field-label">Referral fee (%)<input required type="number" min="10" max="15" step="0.1" className="input mt-2" value={draft.commission} onChange={e => setDraft({ ...draft, commission: Number(e.target.value) })} /></label></div>
        <p className="text-xs text-teal-700">Projected fee: <strong>{money(fee(draft.bill, draft.commission), currency)}</strong> · {draft.commission}% of hospital billing</p>
      </div><div className="space-y-5">
        <label className="field-label block">Medical notes · fictional information only<textarea className="input mt-2 resize-y" rows={5} maxLength={4000} value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} /></label>
        <fieldset><legend className="field-label mb-3">Logistics checklist</legend><div className="space-y-3">{checklistLabels.map((label, i) => <label key={label} className="flex items-center gap-3 text-xs text-slate-500"><input type="checkbox" className="h-4 w-4 accent-teal-600" checked={draft.checklist[i]} onChange={e => setDraft({ ...draft, checklist: draft.checklist.map((value, j) => i === j ? e.target.checked : value) })} />{label}</label>)}</div></fieldset>
        <div><p className="field-label mb-2">Report references ({lead.files.length})</p>{lead.files.length ? lead.files.map((file, i) => <p key={`${file.name}-${i}`} className="mb-1 flex items-center gap-2 break-all text-[11px] text-slate-500"><FileText size={12} className="shrink-0" />{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>) : <p className="text-xs text-slate-400">No report references attached.</p>}<p className="mt-2 text-[10px] text-slate-400">Metadata only. No file contents are stored or downloadable.</p></div>
      </div></div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5"><p className="text-[10px] text-slate-400">Created {new Date(lead.createdAt).toLocaleDateString()} · Consent {lead.consent ? 'recorded' : 'not recorded'}</p><div className="flex gap-3"><button type="button" className="btn-secondary" onClick={onClose}>Close</button><button className="btn-primary" type="submit">Save case changes <ArrowUpRight size={15} /></button></div></div>
    </form>
  </Modal>;
}
