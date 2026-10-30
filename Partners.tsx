import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, BadgeCheck, Building2, Check, Copy, FileCheck2, Globe2, Handshake, Languages, Printer } from 'lucide-react';
import { hospitals } from '../lib/data';
import { useCare } from '../state/CareContext';

function proposal(hospital: string, date: string) {
  return `KACHHADIYA GROUP
Healthcare Facilitation Division
AuraCare Health Global

Date: ${date}

To,
The Head – International Patient Care (IPC)
${hospital}
India

Subject: Proposal for international patient facilitation empanelment

Dear Head of International Patient Care,

On behalf of Kachhadiya Group and its healthcare facilitation enterprise, AuraCare Health Global, we are pleased to submit this proposal for empanelment with ${hospital} as an international patient facilitation partner.

Our proposed focus markets are the United Kingdom, East Africa, the Middle East, Bangladesh and Central Asia. We seek to connect international patients requiring tertiary care with appropriately qualified specialists, transparent treatment estimates and a carefully coordinated patient experience in India.

PROPOSED SCOPE OF COLLABORATION

1. Clinical coordination: Securely coordinate consented clinical reports for specialist triage, a provisional treatment plan and an itemized hospital estimate. Our proposed initial opinion target is 24–48 hours after complete documentation, subject to clinical availability.

2. Medical visa support: Coordinate hospital-issued Visa Invitation Letters and guide patients on medical visa documentation. All visa decisions remain with the competent authorities.

3. Patient logistics: Coordinate airport transfers, suitable serviced accommodation with patient kitchen access, language assistance, SIM cards and local transit, with separately disclosed charges.

4. Continuity of care: Facilitate admission coordination, discharge documentation, recovery planning and scheduled post-operative teleconsultations, subject to treating-team advice and applicable licensing requirements.

COMMERCIAL FRAMEWORK

We propose a mutually agreed, legally permissible facilitation fee, indicatively 10%–15% of eligible hospital billing, subject to your empanelment policy, exclusions, written agreement and applicable law. Hospital billing and facilitation charges must be clearly disclosed. No fee is payable without an agreed contractual basis, supporting admission documentation and reconciliation.

GOVERNANCE AND PATIENT SAFEGUARDS

Patient welfare, informed choice and transparent communication remain central to this proposal. Clinical decisions rest exclusively with licensed clinicians. We do not guarantee outcomes, wait times, visa approvals or cost savings. Transplant-related referrals require lawful donor documentation and all required statutory approvals; we do not procure or match donors.

Before any live data exchange, both parties should complete due diligence covering accreditation, lawful referral arrangements, privacy and cross-border transfer obligations, patient consent, access controls, retention and incident procedures. No accreditation or active partnership is claimed by this proposal.

REQUESTED NEXT STEPS

We request your empanelment criteria, standard facilitator agreement, specialty roster, international patient tariff guidance, VIL process and nominated IPC relationship manager. We would welcome an introductory meeting to align service levels, documentation and commercial terms.

Thank you for considering a patient-first collaboration with AuraCare Health Global. We look forward to exploring a responsible and sustainable association.

Yours sincerely,

Healthcare Partnerships Team
Kachhadiya Group – Healthcare Facilitation Division
AuraCare Health Global

Proposal for discussion only. No binding partnership or commercial commitment is created until authorized agreements are executed.`;
}

export default function Partners() {
  const [hospital, setHospital] = useState(hospitals[1]);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const { toast } = useCare();
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const text = proposal(hospital, date);
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setCopyFailed(false); toast('Formal proposal copied with line breaks.'); }
    catch { setCopyFailed(true); toast('Clipboard unavailable. Select and copy the proposal text below.'); }
  }
  return <div className="bg-paper">
    <section className="border-b border-slate-200 bg-[#edf4f1]">
      <div className="page-shell grid items-center gap-9 py-12 md:grid-cols-[1.4fr_.6fr]"><div><p className="eyebrow">Hospital empanelment / Corporate partnerships</p><h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">Better together.<br /><span className="italic text-teal-600">For a world of patients.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">A considered partnership between your clinical expertise and our proposed international patient coordination. Built on clarity, continuity and patient choice.</p></div><div className="hidden justify-center md:flex"><div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-teal-600/10 bg-white/50"><div className="absolute inset-4 rounded-full border border-dashed border-teal-600/20" /><Handshake className="relative text-teal-600" size={62} strokeWidth={1.1} /><span className="absolute -bottom-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-[9px] font-semibold uppercase tracking-wider text-teal-700">Patient-first partnerships</span></div></div></div>
    </section>
    <div className="page-shell grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-5"><div className="rounded-xl border border-slate-200 bg-white p-5"><p className="eyebrow">Your partnership toolkit</p><h2 className="mt-3 text-lg font-semibold text-ink">Corporate pitch center</h2><p className="mt-3 text-xs leading-6 text-slate-500">Choose a prospective institution to personalize the executive empanelment proposal.</p><label className="field-label mt-5 block">Address proposal to<select className="input mt-2 text-xs" value={hospital} onChange={e => { setHospital(e.target.value); setCopied(false); setCopyFailed(false); }}>{hospitals.map(h => <option key={h}>{h}</option>)}</select></label><button className="btn-primary mt-5 w-full text-xs" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied to clipboard' : 'Copy formal proposal'}</button><button className="btn-secondary mt-3 w-full text-xs" onClick={() => window.print()}><Printer size={14} />Print proposal</button></div>
        <div className="rounded-xl border border-teal-100 bg-teal-50 p-5"><BadgeCheck size={22} className="mb-3 text-teal-600" /><h3 className="text-sm font-semibold text-ink">A thoughtful starting point</h3><p className="mt-3 text-xs leading-6 text-slate-500">This proposal is for discussion. No empanelment or accreditation is implied. Add authorized contact details and complete due diligence before sending.</p></div>
        <div className="space-y-4 p-2">{[{ icon: Globe2, text: 'Five international market regions' }, { icon: Languages, text: 'Multilingual coordination planning' }, { icon: FileCheck2, text: 'Transparent commercial framework' }].map(({ icon: Icon, text: label }) => <p className="flex items-center gap-3 text-[11px] text-slate-500" key={label}><Icon size={16} className="text-teal-600" />{label}</p>)}</div>
      </aside>
      <div>
        {copyFailed && <p role="alert" className="mb-4 text-xs text-amber-800">Clipboard permission was denied. The full selectable proposal below includes all line breaks; select the text to copy manually.</p>}
        <ProposalDocument text={text} date={date} />
      </div>
    </div>
    {createPortal(<div className="print-document"><ProposalDocument text={text} date={date} /></div>, document.body)}
  </div>;
}

function ProposalDocument({ text, date }: { text: string; date: string }) {
  return <article className="proposal-document rounded-xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
        <div className="mb-7 flex items-start justify-between gap-4 border-b-2 border-teal-600 pb-6"><div><p className="text-xl font-semibold tracking-tight text-ink">Kachhadiya Group</p><p className="mt-2 text-[9px] font-semibold uppercase tracking-[.16em] text-teal-600">Healthcare Facilitation Division</p><p className="mt-1 text-[10px] text-slate-400">AuraCare Health Global</p></div><Building2 size={32} className="text-teal-600" strokeWidth={1.2} /></div>
        <div className="no-print mb-6 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-[10px] text-slate-400"><FileCheck2 size={14} />Executive correspondence <ArrowRight size={12} />Hospital IPC head <span className="ml-auto hidden sm:block">Proposal · {date}</span></div>
        <div className="proposal-text whitespace-pre-wrap break-words text-[12px] leading-[1.9] text-slate-600" tabIndex={0} aria-label="Formal hospital empanelment proposal">{text}</div>
      </article>;
}
