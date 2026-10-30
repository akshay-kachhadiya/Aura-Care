export type Currency = 'USD' | 'GBP' | 'EUR' | 'INR';
export type Market = 'UK' | 'US';
export type Stage = 0 | 1 | 2 | 3 | 4 | 5;
export type View = 'patients' | 'operations' | 'partners';

export interface Treatment {
  id: string;
  name: string;
  specialty: string;
  india: number;
  uk: number;
  us: number;
  nights: number;
  recovery: string;
}

export const treatments: Treatment[] = [
  { id: 'knee', name: 'Total Knee Replacement', specialty: 'Orthopaedics', india: 6500, uk: 22000, us: 45000, nights: 5, recovery: '14–21 days in India' },
  { id: 'cabg', name: 'CABG Heart Bypass', specialty: 'Cardiac sciences', india: 8500, uk: 32000, us: 95000, nights: 8, recovery: '21–28 days in India' },
  { id: 'kidney', name: 'Kidney Transplant', specialty: 'Renal sciences', india: 16000, uk: 65000, us: 180000, nights: 14, recovery: '6–8 weeks in India' },
  { id: 'ivf', name: 'IVF Treatment', specialty: 'Reproductive medicine', india: 4200, uk: 12000, us: 22000, nights: 0, recovery: '21–28 days in India' },
  { id: 'spine', name: 'Spine Fusion', specialty: 'Neurosciences', india: 9500, uk: 35000, us: 110000, nights: 7, recovery: '21–28 days in India' },
  { id: 'bariatric', name: 'Bariatric Surgery', specialty: 'Metabolic care', india: 6000, uk: 18000, us: 30000, nights: 4, recovery: '10–14 days in India' },
];

export const stages = [
  'New inquiry / Reports received',
  'Doctor opinion sent',
  'Medical visa letter issued',
  'Landed / Hotel checked-in',
  'In hospital / Surgery scheduled',
  'Discharged / Commission invoiced',
] as const;

export const hospitals = [
  'Apollo Hospitals Bengaluru',
  'Manipal Hospital Bengaluru',
  'Fortis Memorial Research Institute',
  'Max Super Speciality Hospital',
  'Narayana Health City',
];

export const checklistLabels = ['Visa & VIL verified', 'Airport pickup arranged', 'Accommodation confirmed', 'SIM & local transit ready', 'Post-op consultation booked'];

export interface Lead {
  id: string;
  name: string;
  email: string;
  country: string;
  passportStatus: string;
  passportReference: string;
  treatmentId: string;
  notes: string;
  hospital: string;
  stage: Stage;
  bill: number;
  commission: number;
  checklist: boolean[];
  files: { name: string; size: number }[];
  consent: boolean;
  createdAt: string;
  ipd: string;
  demo: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  leadId: string;
  patient: string;
  hospital: string;
  ipd: string;
  bill: number;
  rate: number;
  bankName: string;
  account: string;
  swift: string;
  gstin: string;
  iec: string;
  issuerAddress: string;
  currency: 'USD';
}

export interface StoredData { version: 1; leads: Lead[]; invoices: Invoice[] }

// Fixed illustrative exchange rates, not a live financial feed.
export const exchange: Record<Currency, number> = { USD: 1, GBP: 0.79, EUR: 0.92, INR: 83.5 };
export function money(usd: number, currency: Currency = 'USD') {
  return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(usd * exchange[currency]);
}
export function savings(treatment: Treatment, market: Market) {
  const origin = market === 'UK' ? treatment.uk : treatment.us;
  return { origin, amount: origin - treatment.india, percent: Math.round((1 - treatment.india / origin) * 100) };
}
export function fee(bill: number, rate: number) {
  return Math.round(bill * rate) / 100;
}
export function nextStage(stage: Stage, direction: -1 | 1): Stage {
  return Math.min(5, Math.max(0, stage + direction)) as Stage;
}
export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export const demoLeads: Lead[] = [
  { name: 'Amelia Turner', country: 'United Kingdom', treatmentId: 'knee', stage: 0, hospital: hospitals[0], bill: 6500 },
  { name: 'David Mwangi', country: 'Kenya', treatmentId: 'cabg', stage: 1, hospital: hospitals[4], bill: 8500 },
  { name: 'Layla Hassan', country: 'United Arab Emirates', treatmentId: 'spine', stage: 2, hospital: hospitals[1], bill: 9500 },
  { name: 'Farhan Rahman', country: 'Bangladesh', treatmentId: 'bariatric', stage: 3, hospital: hospitals[2], bill: 6000 },
  { name: 'Amina Okello', country: 'Uganda', treatmentId: 'knee', stage: 4, hospital: hospitals[3], bill: 6500 },
  { name: 'Daniel Wilson', country: 'United Kingdom', treatmentId: 'cabg', stage: 5, hospital: hospitals[0], bill: 8500 },
  { name: 'Sofia Karimova', country: 'Uzbekistan', treatmentId: 'ivf', stage: 1, hospital: hospitals[1], bill: 4200 },
].map((item, index) => ({
  ...item,
  id: `demo-${index + 1}`,
  stage: item.stage as Stage,
  email: `patient${index + 1}@example.com`,
  passportStatus: 'Valid passport',
  passportReference: `DEMO-${1001 + index}`,
  notes: 'Fictional demonstration case. Specialist assessment and hospital confirmation are required before any treatment.',
  commission: 12,
  checklist: checklistLabels.map((_, i) => item.stage > 2 && i < item.stage),
  files: [],
  consent: true,
  createdAt: new Date(Date.UTC(2026, 9, 20 + index)).toISOString(),
  ipd: item.stage === 5 ? 'DEMO-IPD-2046' : '',
  demo: true,
}));

export function validateFile(file: { name: string; size: number }) {
  if (!/\.(pdf|dcm|dicom|jpg|jpeg|png)$/i.test(file.name)) return 'Use PDF, DICOM (.dcm/.dicom), JPG or PNG files.';
  if (file.size > 20 * 1024 * 1024) return 'Each file must be 20 MB or smaller.';
  if (file.size === 0) return 'Empty files cannot be added.';
  return '';
}

function isLead(value: unknown): value is Lead {
  if (!value || typeof value !== 'object') return false;
  const l = value as Record<string, unknown>;
  return ['id', 'name', 'email', 'country', 'passportStatus', 'passportReference', 'notes', 'hospital', 'createdAt', 'ipd'].every(k => typeof l[k] === 'string')
    && treatments.some(t => t.id === l.treatmentId)
    && Number.isInteger(l.stage) && Number(l.stage) >= 0 && Number(l.stage) <= 5
    && typeof l.bill === 'number' && Number.isFinite(l.bill) && l.bill >= 0
    && typeof l.commission === 'number' && l.commission >= 10 && l.commission <= 15
    && Array.isArray(l.checklist) && l.checklist.length === checklistLabels.length && l.checklist.every(x => typeof x === 'boolean')
    && Array.isArray(l.files) && l.files.every(f => f && typeof f.name === 'string' && typeof f.size === 'number')
    && typeof l.demo === 'boolean' && typeof l.consent === 'boolean';
}
function isInvoice(value: unknown): value is Invoice {
  if (!value || typeof value !== 'object') return false;
  const i = value as Record<string, unknown>;
  return ['id', 'number', 'date', 'leadId', 'patient', 'hospital', 'ipd', 'bankName', 'account', 'swift', 'gstin', 'iec', 'issuerAddress'].every(k => typeof i[k] === 'string')
    && typeof i.bill === 'number' && Number.isFinite(i.bill) && i.bill > 0
    && typeof i.rate === 'number' && i.rate >= 10 && i.rate <= 15 && i.currency === 'USD';
}
export function parseStorage(raw: string): StoredData | null {
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.leads) || !data.leads.every(isLead)
      || !Array.isArray(data.invoices) || !data.invoices.every(isInvoice)) return null;
    return data as StoredData;
  } catch { return null; }
}
