import { sanitizeDocumentPII } from '../src/utils/piiEngine.js';

const tests = [
  { label: 'Dot SSN', text: 'SSN: 123.45.6789', rule: 'ssn' },
  { label: 'Spaced German IBAN', text: 'IBAN: DE89 3704 0044 0532 0130 00', rule: 'bankAccount' },
  { label: 'Spaced UK IBAN', text: 'Wire: GB29 NWBK 6016 1331 9268 19', rule: 'bankAccount' },
  { label: 'Gulf Phone', text: 'Mobile: +966 50 123 4567', rule: 'phone' },
  { label: '10-digit unhyphenated phone', text: 'Tel: 0501234567', rule: 'phone' },
  { label: 'Quoted email', text: 'Contact "ceo"@corp.com', rule: 'email' },
  { label: 'Invalid IP 256.1.1.1', text: 'Server 256.1.1.1', rule: 'ip' },
  { label: 'Contract section 1.2.3.4', text: 'See section 1.2.3.4 of MSA', rule: 'ip' },
  { label: 'Legal date 2026-10-08', text: 'Date: 2026-10-08', rule: 'phone' }
];

console.log('--- DETAILED PII PATTERN & BOUNDARY EDGE CASES ---');
for (const t of tests) {
  const res = sanitizeDocumentPII(t.text, [t.rule]);
  console.log(`${t.label.padEnd(30)} | Redactions: ${res.totalRedactions} | Output: ${res.sanitizedText}`);
}
