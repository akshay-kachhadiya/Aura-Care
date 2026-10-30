import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, ChevronRight, Clock3, FileHeart, Globe2, HeartHandshake, HeartPulse, Hospital, Languages, Plane, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { money, savings, treatments, type Market } from '../lib/data';
import { useCare } from '../state/CareContext';

const journey = [
  { icon: FileHeart, title: 'Clarity before commitment', description: 'Free clinical triage and a multi-specialist opinion. A 24–48 hour response target after complete reports.', tag: '01 / Expert opinion' },
  { icon: Globe2, title: 'Your paperwork, simplified', description: 'Guidance on e-Med Visa requirements and the hospital-issued Visa Invitation Letter (VIL).', tag: '02 / Medical visa' },
  { icon: Plane, title: 'Arrive with peace of mind', description: 'Coordinate VIP airport pickup, a serviced apartment with a patient kitchen, SIM and local transit.', tag: '03 / A warm welcome' },
  { icon: HeartHandshake, title: 'Care that stays with you', description: 'Surgery and recovery coordination, followed by planned post-op teleconsultations back home.', tag: '04 / Recovery & beyond' },
];

export default function PatientPortal({ onInquiry }: { onInquiry: () => void }) {
  const [treatmentId, setTreatmentId] = useState('knee');
  const [market, setMarket] = useState<Market>('UK');
  const { currency } = useCare();
  const treatment = treatments.find(t => t.id === treatmentId)!;
  const comparison = savings(treatment, market);
  return <>
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f2f7f5]">
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="page-shell relative grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-600/15 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.13em] text-teal-700"><span className="h-1.5 w-1.5 rounded-full bg-teal-600" />Exceptional care. Without the borders.</div>
          <h1 className="max-w-2xl font-display text-[44px] leading-[1.1] tracking-[-.04em] text-ink sm:text-[62px] xl:text-[72px]">A healthier tomorrow.<br /><span className="italic text-teal-600">Closer than you think.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">World-class tertiary care in India, with a dedicated human by your side. From the first opinion to the journey home, we connect every step.</p>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-teal-600/10 bg-white/70 p-4">
            <span className="rounded-lg bg-teal-100 p-2 text-teal-600"><Sparkles size={18} /></span>
            <div><p className="text-sm font-semibold text-ink">Save up to 70–85% on selected surgeries</p><p className="mt-1 text-xs leading-5 text-slate-500">Explore private care outside NHS or insurance waitlists. Estimates vary; availability and savings are not guaranteed.</p></div>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4"><button className="btn-primary px-6 py-3.5" onClick={onInquiry}>Get my free doctor opinion <ArrowUpRight size={17} /></button><a href="#savings" className="flex items-center gap-2 px-1 py-3 text-sm font-medium text-ink">Explore treatment costs <ArrowDown size={15} /></a></div>
          <div className="mt-7 flex items-center gap-3"><div className="flex -space-x-2">{['AM', 'DK', 'LH'].map((name, i) => <span key={name} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold ${['bg-teal-100 text-teal-700', 'bg-[#e9dfce] text-amber-900', 'bg-[#dce4ef] text-slate-600'][i]}`}>{name}</span>)}</div><p className="text-[11px] leading-5 text-slate-500"><span className="font-semibold text-ink">One dedicated concierge.</span><br />A familiar voice, from anywhere in the world.</p></div>
        </div>
        <div className="relative mx-auto w-full max-w-[500px] pb-7 pl-4 sm:pl-7">
          <div className="care-illustration relative overflow-hidden rounded-[24px] border border-white bg-[#d5e5dd] shadow-soft">
            <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-semibold text-ink"><span className="h-1.5 w-1.5 rounded-full bg-teal-600" />INDIA · A DESTINATION FOR HEALING</div>
            <svg viewBox="0 0 500 430" className="h-auto w-full" role="img" aria-label="Illustration of a modern Indian hospital with landscaped gardens">
              <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#d2e6df" /><stop offset="1" stopColor="#ecf1df" /></linearGradient><linearGradient id="glass" x2="1" y2="1"><stop stopColor="#7bada6" /><stop offset="1" stopColor="#bcd4cc" /></linearGradient><pattern id="windows" width="31" height="29" patternUnits="userSpaceOnUse"><rect width="23" height="20" x="4" y="4" fill="#7fa9a5" /><path d="M15 4v20" stroke="#bfd3cc" strokeWidth="2" /></pattern></defs>
              <rect width="500" height="430" fill="url(#sky)" /><circle cx="414" cy="84" r="44" fill="#faf7e3" opacity=".8" />
              <path d="M0 293Q120 235 220 285T500 265V430H0" fill="#b9cbb6" /><path d="M0 337Q150 276 300 328T500 310V430H0" fill="#8fae99" />
              <rect x="68" y="169" width="126" height="182" rx="3" fill="#eaf0e8" /><rect x="82" y="188" width="100" height="133" fill="url(#windows)" />
              <rect x="304" y="145" width="128" height="206" rx="3" fill="#e3eae3" /><rect x="316" y="166" width="104" height="158" fill="url(#windows)" />
              <path d="M181 118h135v236H181z" fill="#f7f7ed" /><path d="M199 166h99v156h-99z" fill="url(#glass)" /><path d="M224 166v156m25-156v156m25-156v156M199 197h99m-99 31h99m-99 31h99m-99 31h99" stroke="#d7e6dd" strokeWidth="3" />
              <rect x="241" y="132" width="15" height="27" rx="1" fill="#138375" /><rect x="235" y="138" width="27" height="15" rx="1" fill="#138375" />
              <path d="M177 326h145v13H177z" fill="#cfddd0" /><path d="M220 339h57v22h-57z" fill="#527e77" />
              <path d="M238 359h28l55 71H168z" fill="#e4e6d6" /><path d="M0 387q110-26 206-1m83 1q120-34 211-4" stroke="#779e82" strokeWidth="15" fill="none" />
              {[47, 110, 367, 454].map((x, i) => <g key={x}><path d={`M${x} 365v-${50 + i * 6}`} stroke="#6b8870" strokeWidth="5" /><ellipse cx={x} cy={310 - i * 4} rx="24" ry="38" fill={i % 2 ? '#6d9782' : '#477f70'} /></g>)}
              <path d="M0 411q100-26 174 0m153 0q83-32 173-12" stroke="#e2e8d4" strokeWidth="3" fill="none" /><circle cx="350" cy="369" r="4" fill="#fff4cc" /><circle cx="151" cy="370" r="4" fill="#fff4cc" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-6 pb-6 pt-16 text-white"><p className="text-[10px] uppercase tracking-[.18em] text-white/65">Advanced medicine. Personal attention.</p><p className="mt-2 font-display text-2xl">Big expertise. A little more heart.</p></div>
          </div>
          <div className="absolute -left-1 bottom-0 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-soft sm:-left-4"><span className="rounded-full bg-teal-50 p-2.5 text-teal-600"><Stethoscope size={22} /></span><div><p className="text-sm font-semibold text-ink">Expert opinions, thoughtfully coordinated</p><p className="mt-1 text-[10px] text-slate-500">24–48 hour target · No obligation</p></div><BadgeCheck className="hidden text-teal-600 sm:block" size={20} /></div>
        </div>
      </div>
    </section>
    <section className="border-b bg-white">
      <div className="page-shell grid grid-cols-2 gap-6 py-7 lg:grid-cols-4">
        {[{ icon: ShieldCheck, title: 'NABH MVT standards', sub: 'Facilitator accreditation to be verified' }, { icon: Hospital, title: 'JCI hospital network', sub: 'Accreditation checked per facility' }, { icon: Languages, title: 'Multilingual concierge', sub: 'Support for your journey' }, { icon: FileHeart, title: 'Privacy-conscious by design', sub: 'HIPAA-ready backend required for live use' }].map(({ icon: Icon, title, sub }) => <div key={title} className="flex gap-3"><Icon className="mt-1 shrink-0 text-teal-600" size={21} /><div><p className="text-xs font-semibold text-ink">{title}</p><p className="mt-1 text-[10px] leading-4 text-slate-400">{sub}</p></div></div>)}
      </div>
    </section>
    <section className="page-shell py-11">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">Exploring empanelment with India's leading care institutions</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-xl font-bold tracking-tight text-slate-400 sm:justify-between"><span className="font-display italic">Apollo<span className="text-xs not-italic"> HOSPITALS</span></span><span className="tracking-widest">FORTIS<span className="text-teal-600"> +</span></span><span className="font-display">Manipal Hospitals</span><span className="italic">Max<span className="ml-1 text-xs not-italic">Healthcare</span></span><span className="text-base">Narayana Health</span></div>
      <p className="mt-4 text-center text-[10px] text-slate-400">Prospective network shown for demonstration. Partnerships are not represented as confirmed.</p>
    </section>
    <section id="savings" className="scroll-mt-24 bg-[#f1f5f4] py-16">
      <div className="page-shell">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Exceptional care. Sensible costs.</p><h2 className="section-title">More possibilities. <span className="font-display italic text-teal-600">Less financial worry.</span></h2><p className="mt-3 text-sm text-slate-500">A clearer picture of your options, before you take the next step.</p></div><span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] text-slate-500"><Globe2 size={13} />Illustrative estimates in {currency}</span></div>
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[.8fr_1.2fr]">
          <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <label className="field-label" htmlFor="treatment">Which treatment are you exploring?</label>
            <select id="treatment" className="input mt-2" value={treatmentId} onChange={e => setTreatmentId(e.target.value)}>{treatments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
            <p className="field-label mt-6">Compare with care in</p>
            <div className="mt-2 flex rounded-lg bg-slate-100 p-1">{(['UK', 'US'] as Market[]).map(m => <button key={m} className={`flex-1 rounded-md py-2.5 text-xs font-semibold transition ${m === market ? 'bg-white text-ink shadow-sm' : 'text-slate-500'}`} aria-pressed={m === market} onClick={() => setMarket(m)}>{m === 'UK' ? 'United Kingdom · Private' : 'United States · Private'}</button>)}</div>
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Your coordination plan can include</p>{['Specialist opinion & treatment planning', 'Visa invitation letter assistance', 'Airport, stay, SIM & local transit coordination', 'Recovery planning & post-op teleconsultation'].map(text => <p key={text} className="flex items-start gap-2 text-xs text-slate-600"><Check size={14} className="shrink-0 text-teal-600" />{text}</p>)}</div>
            <p className="mt-4 text-[10px] leading-5 text-slate-400">Concierge services are coordinated separately. Inclusions and charges are confirmed in the hospital's written quote.</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-2"><div><p className="eyebrow">{treatment.specialty}</p><h3 className="mt-2 text-xl font-semibold text-ink">{treatment.name}</h3></div><span className="rounded-xl bg-teal-50 p-3 text-teal-600"><HeartPulse size={22} /></span></div>
            <div className="mb-5"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>{market === 'UK' ? 'UK private care' : 'US private care'}</span><span className="font-semibold text-slate-600">{money(comparison.origin, currency)}</span></div><div className="h-3 rounded-full bg-slate-200" /></div>
            <div><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Estimated India hospital package</span><span className="font-semibold text-teal-600">{money(treatment.india, currency)}</span></div><div className="h-3 rounded-full bg-teal-50"><div className="h-3 rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${treatment.india / comparison.origin * 100}%` }} /></div></div>
            <div className="mt-7 flex items-center justify-between gap-3 rounded-xl border border-teal-100 bg-teal-50 p-5"><div><p className="text-xs text-teal-700">Your potential savings</p><p className="mt-1 text-3xl font-semibold tracking-tight text-teal-700">{money(comparison.amount, currency)}</p></div><span className="rounded-lg bg-white px-3 py-2 text-lg font-bold text-teal-600">{comparison.percent}% <span className="text-xs font-normal">less</span></span></div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><Hospital size={14} />{treatment.nights === 0 ? 'Typically outpatient' : `~${treatment.nights} hospital nights`}</span><span className="flex items-center gap-1.5"><Clock3 size={14} />{treatment.recovery}</span></div>
            {treatment.id === 'kidney' && <p className="mt-3 text-xs leading-5 text-amber-800">Transplants require lawful donor documentation, clinical eligibility and authorization committee approval. No donor sourcing is provided.</p>}
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-teal-600/20 py-3 text-xs font-semibold text-teal-700 transition hover:bg-teal-50" onClick={onInquiry}>Get a personalized treatment estimate <ArrowRight size={15} /></button>
            <p className="mt-3 text-[10px] leading-5 text-slate-400">Not a clinical quote. Indicative USD base costs with fixed example FX: £0.79 / €0.92 / ₹83.50 per $1. Actual costs and outcomes vary.</p>
          </div>
        </div>
      </div>
    </section>
    <section id="journey" className="page-shell scroll-mt-24 py-16">
      <div className="text-center"><p className="eyebrow">A thoughtfully connected journey</p><h2 className="section-title">You focus on getting better.<br className="sm:hidden" /> <span className="font-display italic text-teal-600">We connect the rest.</span></h2><p className="mt-3 text-sm text-slate-500">Four clear steps. One team beside you.</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{journey.map(({ icon: Icon, title, description, tag }, i) => <article key={title} className="relative rounded-xl border border-slate-200 bg-white p-6"><div className="mb-6 flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Icon size={23} /></span><span className="font-display text-4xl text-slate-100">0{i + 1}</span></div><p className="mb-2 text-[9px] font-semibold uppercase tracking-[.12em] text-teal-600">{tag}</p><h3 className="text-sm font-semibold text-ink">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{description}</p>{i < 3 && <ChevronRight className="absolute -right-4 top-12 z-10 hidden rounded-full border bg-white p-1 text-slate-300 lg:block" size={28} />}</article>)}</div>
    </section>
    <section className="page-shell pb-16"><div className="relative overflow-hidden rounded-2xl bg-ink px-7 py-10 sm:px-12"><div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/[.025]" /><div className="relative flex flex-wrap items-center justify-between gap-7"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-teal-100/70">A conversation, not a commitment</p><h2 className="mt-3 font-display text-3xl text-white">Your next chapter starts with clarity.</h2><p className="mt-3 max-w-lg text-xs leading-6 text-slate-300">Tell us what you need. Explore a specialist opinion and a clear, personalized path forward.</p></div><button onClick={onInquiry} className="btn-primary bg-white text-ink hover:bg-teal-50">Let's plan your care <ArrowUpRight size={17} /></button></div></div></section>
  </>;
}
