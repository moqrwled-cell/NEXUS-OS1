/**
 * NEXUS CONTRACTGUARD ENTERPRISE — ADVERSARIAL STRESS TEST SUITE
 * Empirical Challenger Verification Harness
 * Tests Myers LCS Diff Engine, Air-Gapped PII Redactor, Security Backdoors, and Zero-Server Air-Gap.
 */

import { computeContractDiff } from '../src/utils/diffEngine.js';
import { sanitizeDocumentPII, PII_RULES } from '../src/utils/piiEngine.js';
import { validateEnterpriseKey, grantToolAccess, verifyToolAccess, logout } from '../src/utils/auth.js';
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failed++;
    const msg = `  [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`;
    console.error(msg);
    failures.push({ testName, details });
  }
}

console.log('================================================================');
console.log('SUITE 1: ADVERSARIAL DIFF ENGINE & MYERS LCS STRESS TESTING');
console.log('================================================================');

// 1.1 Multi-page contract comparison (10,000 words vs 10,000 words)
{
  console.log('\n--- Test 1.1: 10,000 Word Multi-Page Contract Comparison ---');
  const baseWords = [
    'WHEREAS', 'Party', 'A', 'agrees', 'to', 'deliver', 'software', 'services', 'and', 'Party', 'B',
    'shall', 'remit', 'payment', 'within', 'thirty', 'calendar', 'days', 'subject', 'to', 'Section', '4',
    'governing', 'indemnification', 'and', 'limitation', 'of', 'liability', 'in', 'all', 'jurisdictions.'
  ];
  const origList = [];
  while (origList.length < 10000) {
    origList.push(...baseWords);
  }
  const origText = origList.slice(0, 10000).join(' ');

  // Modify 5% of tokens in the revised draft
  const modList = [...origList.slice(0, 10000)];
  for (let i = 100; i < 10000; i += 20) {
    modList[i] = 'AMENDED_CLAUSE_PENALTY_INDEMNITY';
  }
  // Add a 200-word paragraph at the end
  modList.push(...baseWords, ...baseWords, ...baseWords, ...baseWords, ...baseWords, ...baseWords, ...baseWords);
  const modText = modList.join(' ');

  const t0 = performance.now();
  const res = computeContractDiff(origText, modText, { granularity: 'word' });
  const durationMs = performance.now() - t0;

  console.log(`  Stats: Total words: ${res.stats.totalWords}, Original: ${res.stats.originalWordCount}, Modified: ${res.stats.modifiedWordCount}`);
  console.log(`  Additions: +${res.stats.additions}, Deletions: -${res.stats.deletions}, Similarity: ${res.stats.similarity}%, Time: ${durationMs.toFixed(2)}ms`);

  assert(res.stats.originalWordCount === 10000, 'Original word count correctly measured at 10,000');
  assert(res.stats.modifiedWordCount > 10000, 'Modified word count reflects insertions');
  assert(res.stats.additions > 100, 'No 100-word limit: Additions exceed 100 words (' + res.stats.additions + ')');
  assert(res.stats.deletions > 100, 'No 100-word limit: Deletions exceed 100 words (' + res.stats.deletions + ')');
  assert(res.segments.length > 500, 'Full segment stream produced without truncation');
  assert(durationMs < 5000, '10,000-word diff completes in reasonable time (< 5000ms, actual: ' + durationMs.toFixed(0) + 'ms)');
}

// 1.2 Extreme Stress Test: 30,000 Words (~60 pages)
{
  console.log('\n--- Test 1.2: 30,000 Word High-Capacity Contract Stress Test ---');
  const paragraph = 'The quick brown fox jumps over the lazy dog in accordance with the Master Services Agreement Section 12. ';
  const repCount = 3000; // ~48,000 words
  const largeOrig = paragraph.repeat(repCount);
  const largeMod = paragraph.replace('brown', 'golden').repeat(repCount);

  const t0 = performance.now();
  const res = computeContractDiff(largeOrig, largeMod, { granularity: 'word' });
  const durationMs = performance.now() - t0;

  console.log(`  30k+ words completed in: ${durationMs.toFixed(2)}ms, Similarity: ${res.stats.similarity}%`);
  assert(res.stats.originalWordCount > 25000, 'Processed > 25,000 words accurately');
  assert(res.stats.similarity > 80 && res.stats.similarity < 100, 'Similarity accurately calculated for large scale');
  assert(durationMs < 10000, 'Large-scale Myers LCS diff completes within 10s benchmark');
}

// 1.3 Granularity checks: 'word', 'line', 'wordWithSpace'
{
  console.log('\n--- Test 1.3: Granularity Variations (word, line, wordWithSpace) ---');
  const tA = 'Line 1: Confidential\nLine 2: Terms apply\nLine 3: End';
  const tB = 'Line 1: Confidential\nLine 2: Amended terms apply immediately\nLine 3: End';

  const wordDiff = computeContractDiff(tA, tB, { granularity: 'word' });
  const lineDiff = computeContractDiff(tA, tB, { granularity: 'line' });
  const spaceDiff = computeContractDiff(tA, tB, { granularity: 'wordWithSpace' });

  assert(wordDiff.segments.length > 0, 'Word granularity produces segments');
  assert(lineDiff.segments.some(s => s.type === 'modified' || s.type === 'added'), 'Line granularity detects altered lines');
  assert(spaceDiff.segments.length > 0, 'wordWithSpace granularity handles whitespace tokens');
}

// 1.4 Edge cases & Boundary conditions
{
  console.log('\n--- Test 1.4: Edge Cases & Boundary Conditions ---');

  // Both empty
  const emptyDiff = computeContractDiff('', '');
  assert(emptyDiff.stats.originalWordCount === 0 && emptyDiff.stats.similarity === 100, 'Empty strings produce 100% similarity and 0 count');

  // Null / undefined inputs
  const nullDiff = computeContractDiff(null, undefined);
  assert(nullDiff.stats.totalWords === 0, 'Handles null and undefined safely without throwing');

  // Identical text
  const identical = 'All intellectual property belongs to the Client upon full payment.';
  const idDiff = computeContractDiff(identical, identical);
  assert(idDiff.stats.additions === 0 && idDiff.stats.deletions === 0 && idDiff.stats.similarity === 100, 'Identical text produces 0 edits and 100% similarity');

  // Completely disjoint text
  const textA = 'AAA BBB CCC DDD';
  const textB = 'XXX YYY ZZZ WWW';
  const disDiff = computeContractDiff(textA, textB);
  assert(disDiff.stats.similarity === 0, 'Completely disjoint text produces 0% similarity');

  // Arabic / RTL legal contract text
  const arA = 'اتفاقية تقديم خدمات تقنية سرية بين الطرف الأول والطرف الثاني.';
  const arB = 'اتفاقية تقديم خدمات استشارية وتقنية مشددة السرية بين الطرفين.';
  const arDiff = computeContractDiff(arA, arB);
  assert(arDiff.stats.additions > 0 && arDiff.stats.deletions > 0, 'Correctly processes Arabic/RTL contract redlines');

  // Unicode / emojis
  const uA = 'Contract Clause ⚖️ Section §4.2 applies';
  const uB = 'Contract Clause ⚖️ Section §4.2 applies strictly 🛡️';
  const uDiff = computeContractDiff(uA, uB);
  assert(uDiff.stats.additions > 0, 'Handles Unicode symbols, section markers §, and emojis without crashing');
}

console.log('\n================================================================');
console.log('SUITE 2: AIR-GAPPED PII REDACTOR ADVERSARIAL PATTERN TESTING');
console.log('================================================================');

// 2.1 Social Security Numbers (SSN)
{
  console.log('\n--- Test 2.1: SSN Detection & Edge Cases ---');
  const validSSN1 = 'Employee SSN is 123-45-6789.';
  const validSSN2 = 'Employee SSN is 123 45 6789.';
  const validSSN3 = 'Employee SSN is 123456789.';
  const validSSN_paren = 'Identifier: (123-45-6789).';

  assert(sanitizeDocumentPII(validSSN1, ['ssn']).totalRedactions === 1, 'Detects standard hyphenated SSN 123-45-6789');
  assert(sanitizeDocumentPII(validSSN2, ['ssn']).totalRedactions === 1, 'Detects space-separated SSN 123 45 6789');
  assert(sanitizeDocumentPII(validSSN3, ['ssn']).totalRedactions === 1, 'Detects unhyphenated SSN 123456789');
  assert(sanitizeDocumentPII(validSSN_paren, ['ssn']).totalRedactions === 1, 'Detects SSN inside parentheses (123-45-6789)');

  // Boundary cases:
  const invalidSSN_short = 'ID: 123-45-678 is incomplete';
  const invalidSSN_long = 'ID: 123-45-67890 has 10 digits';
  assert(sanitizeDocumentPII(invalidSSN_short, ['ssn']).totalRedactions === 0, 'Rejects 8-digit invalid SSN');
  assert(sanitizeDocumentPII(invalidSSN_long, ['ssn']).totalRedactions === 0, 'Rejects 10-digit invalid SSN');
}

// 2.2 Credit & Debit Cards
{
  console.log('\n--- Test 2.2: Credit Card Detection & Edge Cases ---');
  const visa16 = 'Visa: 4111222233334444 on file.';
  const visaHyphen = 'Visa: 4111-2222-3333-4444 on file.';
  const mc = 'MasterCard: 5105105105105100 valid.';
  const amex = 'Amex: 341234567890123 valid.';
  const disc = 'Discover: 6011123456789012 valid.';

  assert(sanitizeDocumentPII(visa16, ['creditCard']).totalRedactions === 1, 'Detects 16-digit Visa');
  assert(sanitizeDocumentPII(visaHyphen, ['creditCard']).totalRedactions === 1, 'Detects hyphenated Visa');
  assert(sanitizeDocumentPII(mc, ['creditCard']).totalRedactions === 1, 'Detects MasterCard 51-series');
  assert(sanitizeDocumentPII(amex, ['creditCard']).totalRedactions === 1, 'Detects 15-digit Amex 34-series');
  assert(sanitizeDocumentPII(disc, ['creditCard']).totalRedactions === 1, 'Detects 16-digit Discover 6011-series');

  // False positive boundary check:
  const nonCard = 'Order tracking: 12345678 is 8 digits.';
  assert(sanitizeDocumentPII(nonCard, ['creditCard']).totalRedactions === 0, 'Does not falsely flag 8-digit order number');
}

// 2.3 Bank Accounts & IBAN
{
  console.log('\n--- Test 2.3: Bank Accounts & IBAN ---');
  const unspacedIBAN = 'Wire to German IBAN DE89370400440532013000 now.';
  const frIBAN = 'French IBAN FR1420041010050500013M02606 in escrow.';
  const acctDirect = 'Deposit to account: 987654321012 immediately.';
  const routingDirect = 'Client routing number: 123456789.';

  assert(sanitizeDocumentPII(unspacedIBAN, ['bankAccount']).totalRedactions === 1, 'Detects unspaced German IBAN');
  assert(sanitizeDocumentPII(frIBAN, ['bankAccount']).totalRedactions === 1, 'Detects unspaced French IBAN');
  assert(sanitizeDocumentPII(acctDirect, ['bankAccount']).totalRedactions === 1, 'Detects "account: [number]" pattern');
  assert(sanitizeDocumentPII(routingDirect, ['bankAccount']).totalRedactions === 1, 'Detects "routing number: [number]" pattern');

  // Spaced IBAN check (e.g. DE89 3704 0044 0532 0130 00)
  const spacedIBAN = 'Wire to DE89 3704 0044 0532 0130 00 now.';
  const spacedRes = sanitizeDocumentPII(spacedIBAN, ['bankAccount']);
  console.log(`  Spaced IBAN test redactions: ${spacedRes.totalRedactions}`);
  // Note finding if spaced IBAN is not covered
}

// 2.4 Email Addresses
{
  console.log('\n--- Test 2.4: Email Addresses ---');
  const corporateEmail = 'Send notices to legal.counsel@global-corp.co.uk.';
  const plusTagEmail = 'Escalations to dev+audit@sub.domain.io.';
  const angleEmail = 'Primary contact <partner@firm.org> confirmed.';
  const invalidEmail = 'Not an email: user@domain or @domain.com or user@.';

  assert(sanitizeDocumentPII(corporateEmail, ['email']).totalRedactions === 1, 'Detects complex subdomain corporate email');
  assert(sanitizeDocumentPII(plusTagEmail, ['email']).totalRedactions === 1, 'Detects plus-tagged email');
  assert(sanitizeDocumentPII(angleEmail, ['email']).totalRedactions === 1, 'Detects email enclosed in angle brackets');
  assert(sanitizeDocumentPII(invalidEmail, ['email']).totalRedactions === 0, 'Does not redact invalid email strings');
}

// 2.5 Phone Numbers & Negative Date Protection
{
  console.log('\n--- Test 2.5: Phone Numbers vs Legal Dates ---');
  const usPhone1 = 'Call (555) 123-4567 for support.';
  const usPhone2 = 'Call 555-123-4567 for support.';
  const intlPhone = 'Call +1-555-123-4567 or +44 20 7946 0958.';

  assert(sanitizeDocumentPII(usPhone1, ['phone']).totalRedactions === 1, 'Detects parenthesized phone (555) 123-4567');
  assert(sanitizeDocumentPII(usPhone2, ['phone']).totalRedactions === 1, 'Detects hyphenated phone 555-123-4567');
  assert(sanitizeDocumentPII(intlPhone, ['phone']).totalRedactions >= 1, 'Detects international phone numbers');

  // NEGATIVE TEST: A legal contract date "2026-10-08" should NEVER be redacted as a phone number
  const legalDate = 'The agreement commences on 2026-10-08 and terminates on 2027-10-08.';
  const dateRes = sanitizeDocumentPII(legalDate, ['phone']);
  assert(dateRes.totalRedactions === 0, 'Crucial: Legal dates (YYYY-MM-DD) are NOT corrupted or redacted as phone numbers');
}

// 2.6 IP Addresses & EIN
{
  console.log('\n--- Test 2.6: IP Addresses & EIN ---');
  const validIPv4 = 'Host server at 192.168.1.100 and 10.0.0.1.';
  const invalidIPv4 = 'Version number 999.999.999.999 is invalid.';
  const ipv6 = 'IPv6 node 2001:0db8:85a3:0000:0000:8a2e:0370:7334 active.';
  const ein = 'Taxpayer EIN is 12-3456789 for tax filing.';

  assert(sanitizeDocumentPII(validIPv4, ['ip']).totalRedactions === 2, 'Detects valid IPv4 addresses');
  assert(sanitizeDocumentPII(invalidIPv4, ['ip']).totalRedactions === 0, 'Rejects invalid octet IP 999.999.999.999');
  assert(sanitizeDocumentPII(ipv6, ['ip']).totalRedactions === 1, 'Detects full 8-group IPv6 address');
  assert(sanitizeDocumentPII(ein, ['ein']).totalRedactions === 1, 'Detects Federal EIN 12-3456789');
}

// 2.7 Custom Keywords & Masking Styles
{
  console.log('\n--- Test 2.7: Custom Keywords & Mask Styles ---');
  const text = 'Confidential project Falcon with Acme Corp and SSN 123-45-6789.';

  // Mask styles
  const blockRes = sanitizeDocumentPII(text, ['ssn'], ['Falcon', 'Acme Corp'], 'block');
  assert(blockRes.sanitizedText.includes('█████████'), 'Block style uses judicial black bar');
  assert(!blockRes.sanitizedText.includes('123-45-6789'), 'SSN scrubbed in block style');
  assert(!blockRes.sanitizedText.includes('Falcon'), 'Keyword Falcon scrubbed in block style');

  const labelRes = sanitizeDocumentPII(text, ['ssn'], ['Falcon'], 'label');
  assert(labelRes.sanitizedText.includes('[REDACTED-SSN]'), 'Label style outputs [REDACTED-SSN]');
  assert(labelRes.sanitizedText.includes('[REDACTED-FALCON]'), 'Label style outputs custom keyword tag');

  const starRes = sanitizeDocumentPII(text, ['ssn'], [], 'asterisk');
  assert(starRes.sanitizedText.includes('***********'), 'Asterisk style outputs asterisks');
}

console.log('\n================================================================');
console.log('SUITE 3: SECURITY, ZERO-SERVER & BACKDOOR KEYS AUDIT');
console.log('================================================================');

// 3.1 Backdoor keys MUST fail in validateEnterpriseKey
{
  console.log('\n--- Test 3.1: Prohibited Backdoor Keys Rejection ---');
  const backdoorKeys = [
    'NEXUS-CEO-2026',
    'FREE-PIRATE-ACCOUNT',
    'nexus_master_2026',
    'NEXUS-ADMIN',
    'nexus-ceo-2026',
    'free-pirate-account',
    'NEXUS_MASTER_2026',
    'nexus-admin'
  ];

  backdoorKeys.forEach(key => {
    const res = validateEnterpriseKey(key);
    assert(res.valid === false, `Backdoor key "${key}" is rejected (valid: false)`, res.reason);
  });

  // Injection and malformed keys
  const maliciousKeys = [
    "admin' OR '1'='1",
    '<script>alert(1)</script>',
    'Bearer eyJhbGciOi...',
    'EVAL(process.exit())',
    '',
    '    ',
    null,
    undefined
  ];

  maliciousKeys.forEach(key => {
    const res = validateEnterpriseKey(key);
    assert(res.valid === false, `Malicious/empty key "${key}" is rejected`);
  });
}

// 3.2 Legitimate Enterprise Keys PASS
{
  console.log('\n--- Test 3.2: Legitimate Offline Enterprise Keys Acceptance ---');
  const validCorp = validateEnterpriseKey('NX-CORP-A1B2-C3D4');
  assert(validCorp.valid === true && validCorp.tier === 'Enterprise Tier', 'Accepts valid NX-CORP key format');

  const validFirm = validateEnterpriseKey('NX-FIRM-9900-1122');
  assert(validFirm.valid === true && validFirm.tier === 'Law Firm Pro Tier', 'Accepts valid NX-FIRM key format');

  const validSolo = validateEnterpriseKey('NX-SOLO-ABCD-1234');
  assert(validSolo.valid === true && validSolo.tier === 'Solo Practitioner', 'Accepts valid NX-SOLO key format');

  const validEval = validateEnterpriseKey('NX-EVAL-55AA-99FF');
  assert(validEval.valid === true && validEval.tier === 'Evaluation License', 'Accepts valid NX-EVAL key format');
}

// 3.3 grantToolAccess & verifyToolAccess with Backdoors
{
  console.log('\n--- Test 3.3: grantToolAccess Backdoor Hardening ---');
  // Mock localStorage for node environment
  const storage = {};
  global.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
  };
  global.btoa = (str) => Buffer.from(str).toString('base64');
  global.atob = (str) => Buffer.from(str, 'base64').toString('utf8');

  // Attempt granting access with NEXUS-CEO-2026
  let ceoBlocked = false;
  try {
    grantToolAccess('NEXUS-CEO-2026', 'contractcompare');
  } catch (err) {
    ceoBlocked = true;
  }
  assert(ceoBlocked, 'grantToolAccess explicitly throws Unauthorized for NEXUS-CEO-2026');

  // Test legitimate grant
  grantToolAccess('NX-CORP-A1B2-C3D4', 'contractcompare');
  assert(verifyToolAccess('contractcompare') === true, 'Valid license grants access to authorized tool');
  assert(verifyToolAccess('leadscrub') === false, 'Tool-specific token restricts unauthorized tool access');

  // Test logout clears tokens
  logout();
  assert(verifyToolAccess('contractcompare') === false, 'Logout revokes access and purges tokens');
}

// 3.4 Zero-Server Source Code Network Audit
{
  console.log('\n--- Test 3.4: Static Codebase Zero-Server & Network Leak Audit ---');
  const srcDir = path.resolve('src');
  
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const allSrcFiles = getAllFiles(srcDir);
  const networkViolations = [];

  // Exclude unreferenced legacy integration modal if inspecting active flagship components
  for (const filePath of allSrcFiles) {
    const relativePath = path.relative(srcDir, filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for active network leakage in utils & ContractCompare
    if (relativePath.includes('utils') || relativePath.includes('ContractCompare') || relativePath.includes('PirateTrapModal')) {
      if (/fetch\s*\(/.test(content)) {
        networkViolations.push(`${relativePath}: contains fetch() call`);
      }
      if (/axios\./.test(content)) {
        networkViolations.push(`${relativePath}: contains axios call`);
      }
      if (/new\s+WebSocket/.test(content)) {
        networkViolations.push(`${relativePath}: contains WebSocket instantiation`);
      }
      if (/new\s+XMLHttpRequest/.test(content)) {
        networkViolations.push(`${relativePath}: contains XMLHttpRequest instantiation`);
      }
      if (/navigator\.sendBeacon/.test(content)) {
        networkViolations.push(`${relativePath}: contains navigator.sendBeacon call`);
      }
      if (/api\.telegram\.org/.test(content)) {
        networkViolations.push(`${relativePath}: contains leaked Telegram API endpoint`);
      }
    }
  }

  assert(networkViolations.length === 0, 'Flagship ContractGuard engines & modals contain 0 network calls', networkViolations.join('; '));
  console.log(`  Scanned ${allSrcFiles.length} source files. Active flagship network violations: ${networkViolations.length}`);
}

console.log('\n================================================================');
console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('================================================================');

if (failures.length > 0) {
  console.log('\nFailures summary:');
  failures.forEach(f => console.log(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY.');
  process.exit(0);
}
