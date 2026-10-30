import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { demoLeads, parseStorage, type Currency, type Invoice, type Lead, type StoredData } from '../lib/data';

interface CareState {
  leads: Lead[];
  invoices: Invoice[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  addLead: (lead: Lead) => boolean;
  updateLead: (id: string, patch: Partial<Lead>) => boolean;
  addInvoice: (invoice: Invoice) => boolean;
  storageError: string;
  toast: (message: string) => void;
  notification: string;
}
const Context = createContext<CareState | null>(null);
const KEY = 'auracare-workspace-v1';

function initialState(): { data: StoredData; error: string } {
  const fallback: StoredData = { version: 1, leads: demoLeads, invoices: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { data: fallback, error: '' };
    const data = parseStorage(raw);
    return data ? { data, error: '' } : { data: fallback, error: 'Saved workspace is unreadable. Demonstration data is shown; the original storage has not been overwritten.' };
  } catch {
    return { data: fallback, error: 'Browser storage is unavailable. Changes cannot be saved on this browser.' };
  }
}

export function CareProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(initialState);
  const [data, setData] = useState(initial.data);
  const current = useRef(data);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [storageError, setStorageError] = useState(initial.error);
  const [notification, setNotification] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const toast = useCallback((message: string) => {
    setNotification(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotification(''), 5000);
  }, []);
  const commit = useCallback((next: StoredData) => {
    if (initial.error) { toast(initial.error); return false; }
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      current.current = next;
      setData(next);
      setStorageError('');
      return true;
    } catch {
      setStorageError('Storage is full or unavailable. Your latest change was not saved.');
      toast('Unable to save. Free browser storage and try again.');
      return false;
    }
  }, [initial.error, toast]);
  const addLead = (lead: Lead) => commit({ ...current.current, leads: [lead, ...current.current.leads] });
  const updateLead = (id: string, patch: Partial<Lead>) => {
    return commit({ ...current.current, leads: current.current.leads.map(l => l.id === id ? { ...l, ...patch } : l) });
  };
  const addInvoice = (invoice: Invoice) => {
    if (current.current.invoices.some(i => i.number.toLowerCase() === invoice.number.toLowerCase())) {
      toast('That invoice number already exists. Choose a unique number.');
      return false;
    }
    return commit({ ...current.current, invoices: [invoice, ...current.current.invoices] });
  };
  return <Context.Provider value={{ ...data, currency, setCurrency, addLead, updateLead, addInvoice, storageError, toast, notification }}>{children}</Context.Provider>;
}

// Kept beside the provider so consumers share a single typed context.
// eslint-disable-next-line react-refresh/only-export-components
export function useCare() {
  const value = useContext(Context);
  if (!value) throw new Error('CareProvider is required.');
  return value;
}
