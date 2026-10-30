import { describe, expect, it } from 'vitest';
import { demoLeads, fee, nextStage, parseStorage, savings, treatments, validateFile } from './data';

describe('treatment comparisons', () => {
  it('uses the selected origin market and computes savings', () => {
    expect(savings(treatments[0], 'UK')).toEqual({ origin: 22000, amount: 15500, percent: 70 });
    expect(savings(treatments[0], 'US')).toEqual({ origin: 45000, amount: 38500, percent: 86 });
  });
  it('rounds facilitator fees to cents', () => {
    expect(fee(8500, 12)).toBe(1020);
    expect(fee(1234.56, 12.5)).toBe(154.32);
  });
});
describe('pipeline movement', () => {
  it('moves forwards and backwards without leaving the pipeline', () => {
    expect(nextStage(0, -1)).toBe(0);
    expect(nextStage(0, 1)).toBe(1);
    expect(nextStage(3, -1)).toBe(2);
    expect(nextStage(5, 1)).toBe(5);
  });
});
describe('local workspace recovery', () => {
  it('restores persisted leads and their stage changes', () => {
    const leads = demoLeads.map((l, i) => i === 0 ? { ...l, stage: 3 } : l);
    const restored = parseStorage(JSON.stringify({ version: 1, leads, invoices: [] }));
    expect(restored?.leads[0].stage).toBe(3);
    expect(restored?.leads).toHaveLength(demoLeads.length);
  });
  it('rejects malformed, incompatible and unsafe workspace values', () => {
    expect(parseStorage('{')).toBeNull();
    expect(parseStorage('null')).toBeNull();
    expect(parseStorage(JSON.stringify({ version: 2, leads: demoLeads, invoices: [] }))).toBeNull();
    expect(parseStorage(JSON.stringify({ version: 1, leads: [{ ...demoLeads[0], stage: 9 }], invoices: [] }))).toBeNull();
    expect(parseStorage(JSON.stringify({ version: 1, leads: [{ ...demoLeads[0], bill: '100' }], invoices: [] }))).toBeNull();
    expect(parseStorage(JSON.stringify({ version: 1, leads: demoLeads, invoices: [{}] }))).toBeNull();
  });
});
describe('simulated report attachment validation', () => {
  it('accepts supported reports within the file size limit', () => {
    expect(validateFile({ name: 'scan.DCM', size: 20 * 1024 * 1024 })).toBe('');
    expect(validateFile({ name: 'discharge.pdf', size: 2048 })).toBe('');
  });
  it('rejects oversized, empty and unsupported files', () => {
    expect(validateFile({ name: 'scan.pdf', size: 20 * 1024 * 1024 + 1 })).not.toBe('');
    expect(validateFile({ name: 'scan.pdf', size: 0 })).not.toBe('');
    expect(validateFile({ name: 'scan.exe', size: 1024 })).not.toBe('');
    expect(validateFile({ name: 'scan.pdf.exe', size: 1024 })).not.toBe('');
  });
});
