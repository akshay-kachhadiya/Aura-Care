import { useState } from 'react';
import { Activity, ArrowUpRight, Building2, ChevronDown, Globe2, HeartPulse, LayoutDashboard, Menu, ShieldCheck, X } from 'lucide-react';
import { useCare } from './state/CareContext';
import type { Currency, View } from './lib/data';
import PatientPortal from './components/PatientPortal';
import InquiryModal from './components/InquiryModal';
import Operations from './components/Operations';
import Partners from './components/Partners';
import Modal from './components/Modal';

const navigation: { id: View; label: string; icon: typeof HeartPulse }[] = [
  { id: 'patients', label: 'Patient portal', icon: HeartPulse },
  { id: 'operations', label: 'Operations hub', icon: LayoutDashboard },
  { id: 'partners', label: 'Hospital partners', icon: Building2 },
];

export default function App() {
  const [view, setView] = useState<View>('patients');
  const [menu, setMenu] = useState(false);
  const [inquiry, setInquiry] = useState(false);
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);
  const { currency, setCurrency, notification, storageError } = useCare();
  function navigate(next: View) { setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  return <>
    <a className="sr-only z-50 rounded bg-white p-3 text-teal-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4" href="#main-content">Skip to content</a>
    <div className="bg-ink px-5 py-2 text-center text-[11px] tracking-wide text-white/80">
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
      Care without borders. A world of possibility. <span className="ml-3 hidden text-white/45 sm:inline">A Kachhadiya Group enterprise</span>
    </div>
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-5">
        <button onClick={() => navigate('patients')} className="flex shrink-0 items-center gap-2.5 text-left" aria-label="AuraCare home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white"><Activity size={25} strokeWidth={2.5} /></span>
          <span><span className="block text-[23px] font-semibold leading-6 tracking-tight text-ink">Aura<span className="text-teal-600">Care</span></span><span className="text-[9px] font-semibold uppercase tracking-[.25em] text-slate-500">Health Global</span></span>
        </button>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map(({ id, label }) => <button key={id} onClick={() => navigate(id)} className={`nav-link ${view === id ? 'nav-active' : ''}`}>{label}{id === 'operations' && <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-500">CRM</span>}</button>)}
        </nav>
        <div className="flex items-center gap-3">
          <label className="relative flex items-center gap-1.5 text-xs font-semibold text-slate-600"><Globe2 size={15} /><span className="sr-only">Display currency</span>
            <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} className="cursor-pointer appearance-none bg-transparent py-2 pl-1 pr-5 outline-offset-2">{(['USD', 'GBP', 'EUR', 'INR'] as Currency[]).map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-0" />
          </label>
          <button className="btn-primary hidden sm:flex" onClick={() => setInquiry(true)}>Get a free opinion <ArrowUpRight size={16} /></button>
          <button className="icon-btn lg:hidden" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu}>{menu ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {menu && <nav className="border-t bg-white p-4 lg:hidden" aria-label="Mobile navigation">{navigation.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-link flex w-full items-center gap-3 ${view === id ? 'nav-active' : ''}`} onClick={() => navigate(id)}><Icon size={18} />{label}</button>)}<button className="btn-primary mt-3 w-full" onClick={() => { setMenu(false); setInquiry(true); }}>Get a free opinion <ArrowUpRight size={16} /></button></nav>}
    </header>
    {storageError && <div role="alert" className="bg-amber-50 px-6 py-3 text-center text-sm text-amber-900">{storageError}</div>}
    <main id="main-content">
      {view === 'patients' && <PatientPortal onInquiry={() => setInquiry(true)} />}
      {view === 'operations' && <Operations onInquiry={() => setInquiry(true)} />}
      {view === 'partners' && <Partners />}
    </main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div><p className="text-lg font-semibold text-ink">AuraCare Health Global<span className="text-teal-600">.</span></p><p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">Thoughtful coordination. Informed choices. Care beyond borders.<br />Owned and operated by Kachhadiya Group.</p></div>
        <div><p className="eyebrow mb-3">Your next chapter</p><button className="footer-link" onClick={() => navigate('patients')}>Explore treatment options</button><button className="footer-link" onClick={() => navigate('partners')}>Hospital empanelment</button><button className="footer-link" onClick={() => setInquiry(true)}>Start a care inquiry</button></div>
        <div><p className="eyebrow mb-3">Transparency first</p><button className="footer-link" onClick={() => setLegal('privacy')}>Privacy & local data</button><button className="footer-link" onClick={() => setLegal('terms')}>Medical & pricing disclaimer</button><span className="mt-2 flex items-center gap-2 text-xs text-teal-700"><ShieldCheck size={14} />Consent-led care coordination</span></div>
      </div>
      <div className="page-shell border-t py-5 text-[11px] leading-5 text-slate-400">© {new Date().getFullYear()} Kachhadiya Group. All rights reserved. This self-contained demonstration is not a medical provider or an emergency service. In an emergency, contact your local emergency services.</div>
    </footer>
    {inquiry && <InquiryModal onClose={() => setInquiry(false)} />}
    {legal && <Modal title={legal === 'privacy' ? 'Privacy & local data' : 'Medical & pricing information'} onClose={() => setLegal(null)}>
      <div className="space-y-4 text-sm leading-7 text-slate-600">{legal === 'privacy' ? <>
        <p>This demonstration stores case details, attachment names and invoices only in this browser's localStorage. It does not transmit inquiries, upload medical files, contact doctors or synchronize between devices.</p>
        <p>The operations hub is public and has no authentication. Do not enter real patient information, passport numbers, medical records or real bank account details. Use fictional information only. Anyone with access to this browser can view its stored workspace.</p>
        <p>Clear this site's data in your browser settings to delete locally stored records. Closing the page does not delete records. HIPAA compliance is not claimed; authenticated access, encryption, consent management, retention policies and a compliant backend are required before handling real patient data.</p>
      </> : <>
        <p>Costs, savings, timelines and currency conversions are illustrative planning estimates, not quotes or guaranteed outcomes. Exchange rates are fixed examples. Travel, visas, accommodation, complications, taxes and follow-up may cost extra.</p>
        <p>Clinical suitability, donor eligibility, lawful transplant authorization and IVF eligibility require specialist review and applicable legal approvals. No organ procurement or donor matching is offered. Visa approval rests solely with the relevant authorities.</p>
        <p>Hospital names identify prospective empanelment targets, not confirmed partnerships. NABH facilitator accreditation, individual hospital JCI accreditation, availability and response times must be verified before booking. No regulatory certification or zero-waitlist guarantee is claimed.</p>
      </>}</div>
    </Modal>}
    {notification && <div role="status" className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-ink px-5 py-4 text-sm text-white shadow-xl">{notification}</div>}
  </>;
}
