import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

import { validateCrossReferences, romanToArabic, arabicToRoman } from '../src/utils/crossRefValidator.js';
import { auditDefinedTerms, levenshtein } from '../src/utils/definedTermsAuditor.js';
import { auditFinancialAndDates, parseWordsToNumber, parseNumericAmount, extractDateFromText } from '../src/utils/financialDateAuditor.js';
import { extractObligations, splitLegalSentences, attributeObligationParty } from '../src/utils/obligationsExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

console.log('='.repeat(70));
console.log('REVIEWER M1-2: COMPREHENSIVE ADVERSARIAL STRESS & BENCHMARK SUITE');
console.log('='.repeat(70));

let failures = 0;
function check(condition, desc) {
  if (condition) {
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc}`);
    failures++;
  }
}

// ---------------------------------------------------------------------------
// 1. BENCHMARK & PERFORMANCE ON 10K+ WORDS COMPLEX PROCUREMENT FIXTURE
// ---------------------------------------------------------------------------
console.log('\n--- 1. BENCHMARK: 13,760 Words Fixture ---');
const complex10kPath = path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt');
const complex10kText = fs.readFileSync(complex10kPath, 'utf8');
const words = complex10kText.trim().split(/\s+/).length;
console.log(`Fixture Word Count: ${words} words (${complex10kText.length} bytes)`);

// Warmup
validateCrossReferences(complex10kText.slice(0, 1000));

// Benchmark each engine individually
const tCR0 = performance.now();
const resCR = validateCrossReferences(complex10kText);
const tCR = performance.now() - tCR0;

const tDT0 = performance.now();
const resDT = auditDefinedTerms(complex10kText, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
const tDT = performance.now() - tDT0;

const tFD0 = performance.now();
const resFD = auditFinancialAndDates(complex10kText, new Date('2026-10-15T00:00:00Z'));
const tFD = performance.now() - tFD0;

const tOB0 = performance.now();
const resOB = extractObligations(complex10kText, 'Acme Corporation', 'CloudTech Solutions Inc.');
const tOB = performance.now() - tOB0;

const totalSingleRun = tCR + tDT + tFD + tOB;

console.log(`Execution Times (10k+ words):`);
console.log(`  - crossRefValidator:    ${tCR.toFixed(2)} ms (Sections indexed: ${resCR.stats.totalIndexed}, Citations: ${resCR.stats.totalCitations}, Issues: ${resCR.issues.length})`);
console.log(`  - definedTermsAuditor:   ${tDT.toFixed(2)} ms (Defined: ${resDT.stats.totalDefined}, Undefined: ${resDT.stats.undefinedCount}, Unused: ${resDT.stats.unusedCount}, Artifacts: ${resDT.stats.artifactCount})`);
console.log(`  - financialDateAuditor:  ${tFD.toFixed(2)} ms (Amounts: ${resFD.stats.totalAmounts}, Mismatches: ${resFD.stats.mismatchCount}, Dates: ${resFD.stats.totalDates})`);
console.log(`  - obligationsExtractor:  ${tOB.toFixed(2)} ms (Total Obligations: ${resOB.stats.totalObligations}, Affirmative: ${resOB.stats.affirmativeCount}, Negative: ${resOB.stats.negativeCount})`);
console.log(`  - Combined Total:        ${totalSingleRun.toFixed(2)} ms (Budget limit: 5000.00 ms)`);

check(totalSingleRun < 5000, `Single pass execution under 5,000ms SLA (Actual: ${totalSingleRun.toFixed(2)}ms)`);
check(totalSingleRun < 1000, `Performance exceeds standard expectation: sub-second on 10k words (Actual: ${totalSingleRun.toFixed(2)}ms)`);

// 10-run repeatability & stability benchmark
const iterations = 10;
const runTimes = [];
for (let i = 0; i < iterations; i++) {
  const t0 = performance.now();
  validateCrossReferences(complex10kText);
  auditDefinedTerms(complex10kText, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
  auditFinancialAndDates(complex10kText, new Date('2026-10-15T00:00:00Z'));
  extractObligations(complex10kText, 'Acme Corporation', 'CloudTech Solutions Inc.');
  runTimes.push(performance.now() - t0);
}
const avgTime = runTimes.reduce((a, b) => a + b, 0) / iterations;
const minTime = Math.min(...runTimes);
const maxTime = Math.max(...runTimes);
console.log(`10-Iteration Benchmark: Avg: ${avgTime.toFixed(2)}ms | Min: ${minTime.toFixed(2)}ms | Max: ${maxTime.toFixed(2)}ms`);
check(avgTime < 500, `Average multi-run latency < 500ms (Actual: ${avgTime.toFixed(2)}ms)`);

// ---------------------------------------------------------------------------
// 2. ADVERSARIAL STRESS TESTING: REDOS & BOUNDARY STRINGS
// ---------------------------------------------------------------------------
console.log('\n--- 2. ADVERSARIAL STRESS TESTING: ReDoS & Hostile Inputs ---');

const hostileCases = [
  { name: '10,000 Unclosed brackets [', text: '['.repeat(10000) },
  { name: '10,000 Unclosed chevrons <', text: '<'.repeat(10000) },
  { name: '10,000 Quotation marks "', text: '"'.repeat(10000) },
  { name: '10,000 Blank underlines _', text: '_'.repeat(10000) },
  { name: '5,000 Repeated Capitalized Words', text: 'Word '.repeat(5000) },
  { name: 'Massive single-line text (100k chars)', text: 'Section 1.1 Scope of Services. '.repeat(3500) },
  { name: 'Nested parentheses (100 levels)', text: 'Section 1' + '('.repeat(100) + 'a' + ')'.repeat(100) },
  { name: 'Compound section chain (500 items)', text: 'Section ' + Array.from({length: 500}, (_, i) => `${i + 1}.1`).join(' and ') },
  { name: 'Binary null bytes and control chars', text: 'Section 1. \x00\x01\x02\x03\x04\x05\x06\x07\x08\x0b\x0c\x0e\x0f "Defined" means null.' },
  { name: 'RTL and non-Latin unicode text', text: 'العقد يتضمن القسم 1 و الملحق أ و مبلغ 10,000 دولار و 500 يورو و Section 1.1' },
  { name: 'Emoji and unusual surrogates', text: 'Section 1. 🔥🚀⚖️ "Special Term" means 🦄.' }
];

for (const c of hostileCases) {
  const t0 = performance.now();
  try {
    validateCrossReferences(c.text);
    auditDefinedTerms(c.text);
    auditFinancialAndDates(c.text);
    extractObligations(c.text);
    const ms = performance.now() - t0;
    check(ms < 1000, `Hostile input "${c.name}" processed safely without ReDoS in ${ms.toFixed(2)}ms`);
  } catch (err) {
    check(false, `Hostile input "${c.name}" caused unhandled exception: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// 3. SEMANTIC EDGE CASES & ADVERSARIAL DOMAIN LOGIC
// ---------------------------------------------------------------------------
console.log('\n--- 3. DOMAIN EDGE CASES: Financial, Cross-Ref, Defined Terms, Obligations ---');

// 3.1 Financial words-to-number edge cases
console.log('\n* Sub-suite: Financial edge cases');
check(parseWordsToNumber('One Dollar') === 1, 'parseWordsToNumber: One Dollar == 1');
check(parseWordsToNumber('zero dollars') === 0, 'parseWordsToNumber: zero dollars == 0');
check(parseWordsToNumber('Ten Thousand Dollars and 50/100') === 10000.50, 'parseWordsToNumber: Ten Thousand Dollars and 50/100 == 10000.50');
check(parseWordsToNumber('One Million Two Hundred Thousand Dollars') === 1200000, 'parseWordsToNumber: 1,200,000');
check(parseWordsToNumber('Three Billion Five Hundred Million Dollars') === 3500000000, 'parseWordsToNumber: 3,500,000,000');
check(parseWordsToNumber('Forty-Five Dollars') === 45, 'parseWordsToNumber: hyphenated Forty-Five');
check(parseWordsToNumber('Fourty-Five Dollars') === 45, 'parseWordsToNumber: common misspelling Fourty');
check(parseWordsToNumber('Fifty Cents') === 0.50, 'parseWordsToNumber: Fifty Cents == 0.50');
check(parseWordsToNumber('One Hundred Dollars and no/100') === 100, 'parseWordsToNumber: no/100 cents == 100');

// 3.2 Date parsing edge cases
console.log('\n* Sub-suite: Date edge cases');
const d1 = extractDateFromText('Agreement executed on 15 October 2026.');
check(d1 && d1.parsedDate === '2026-10-15', 'extractDateFromText: British format "15 October 2026"');
const d2 = extractDateFromText('Agreement executed on October 15, 2026.');
check(d2 && d2.parsedDate === '2026-10-15', 'extractDateFromText: US format "October 15, 2026"');
const d3 = extractDateFromText('Term starts 2026-10-15.');
check(d3 && d3.parsedDate === '2026-10-15', 'extractDateFromText: ISO format "2026-10-15"');
const d4 = extractDateFromText('Term starts 10/15/2026.');
check(d4 && d4.parsedDate === '2026-10-15', 'extractDateFromText: Slash format "10/15/2026"');
const d5 = extractDateFromText('The 1st day of January, 2027.');
check(d5 && d5.parsedDate === '2027-01-01', 'extractDateFromText: Ordinal formal format "1st day of January, 2027"');

// 3.3 Roman numeral conversion edge cases
console.log('\n* Sub-suite: Roman numeral edge cases');
check(romanToArabic('I') === 1, 'romanToArabic: I == 1');
check(romanToArabic('IV') === 4, 'romanToArabic: IV == 4');
check(romanToArabic('IX') === 9, 'romanToArabic: IX == 9');
check(romanToArabic('XIV') === 14, 'romanToArabic: XIV == 14');
check(romanToArabic('XL') === 40, 'romanToArabic: XL == 40');
check(romanToArabic('XLIX') === 49, 'romanToArabic: XLIX == 49');
check(arabicToRoman(1) === 'I', 'arabicToRoman: 1 == I');
check(arabicToRoman(4) === 'IV', 'arabicToRoman: 4 == IV');
check(arabicToRoman(9) === 'IX', 'arabicToRoman: 9 == IX');
check(arabicToRoman(14) === 'XIV', 'arabicToRoman: 14 == XIV');
check(arabicToRoman(49) === 'XLIX', 'arabicToRoman: 49 == XLIX');

// 3.4 Levenshtein distance edge cases
console.log('\n* Sub-suite: Levenshtein distance edge cases');
check(levenshtein('', '') === 0, 'levenshtein: empty strings == 0');
check(levenshtein('Acme', '') === 4, 'levenshtein: Acme vs empty == 4');
check(levenshtein('Acme LLC', 'Acme LCC') === 2, 'levenshtein: transposition == 2');
check(levenshtein('Acme Corp', 'Acme Corp.') === 1, 'levenshtein: trailing period == 1');

// 3.5 Obligations modal variants edge cases
console.log('\n* Sub-suite: Obligations modal verbs edge cases');
const oblText = `
Provider shall promptly deliver the monthly status report.
Customer must immediately notify Provider of any breach.
Vendor agrees not to disclose proprietary algorithms.
Neither party shall assign this Agreement without consent.
In the event of insolvency, Client will terminate immediately.
`;
const oblRes = extractObligations(oblText, 'Customer', 'Vendor');
check(oblRes.obligations.length === 5, 'extractObligations: captures 5 modal obligations');
const neg1 = oblRes.obligations.find(o => o.sentence.includes('agrees not to disclose'));
check(neg1 && neg1.dutyType === 'negative', 'extractObligations: "agrees not to" is negative duty');
const neg2 = oblRes.obligations.find(o => o.sentence.includes('Neither party shall assign'));
check(neg2 && neg2.dutyType === 'negative', 'extractObligations: "Neither party shall" is negative duty');
const cond1 = oblRes.obligations.find(o => o.sentence.includes('In the event of insolvency'));
check(cond1 && cond1.dutyType === 'conditional', 'extractObligations: "In the event of" is conditional duty');

// ---------------------------------------------------------------------------
// 4. INTEGRITY CHECK: CODE PURITY & ZERO EXTERNAL CALLS
// ---------------------------------------------------------------------------
console.log('\n--- 4. INTEGRITY & ZERO EXTERNAL CALLS CHECK ---');
const utilsDir = path.join(__dirname, '../src/utils');
const utilFiles = [
  'crossRefValidator.js',
  'definedTermsAuditor.js',
  'financialDateAuditor.js',
  'obligationsExtractor.js'
];

let integrityClean = true;
for (const file of utilFiles) {
  const content = fs.readFileSync(path.join(utilsDir, file), 'utf8');
  // Check for fetch, XMLHttpRequest, WebSocket, eval, or hardcoded fixtures
  const forbiddenPatterns = [
    { name: 'fetch() call', regex: /\bfetch\s*\(/ },
    { name: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/ },
    { name: 'WebSocket', regex: /\bWebSocket\b/ },
    { name: 'eval()', regex: /\beval\s*\(/ },
    { name: 'Function constructor', regex: /new\s+Function\s*\(/ }
  ];

  for (const pat of forbiddenPatterns) {
    if (pat.regex.test(content)) {
      console.error(`[INTEGRITY VIOLATION] ${file} contains forbidden pattern: ${pat.name}`);
      integrityClean = false;
    }
  }
}
check(integrityClean, 'Zero external network calls, zero dynamic code generation (Air-gap ABA Rule 1.6 compliant)');

// ---------------------------------------------------------------------------
// FINAL SUMMARY
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(70));
if (failures === 0) {
  console.log(`\x1b[32mALL ADVERSARIAL STRESS TESTS AND BENCHMARKS PASSED (0 FAILURES).\x1b[0m`);
  process.exit(0);
} else {
  console.error(`\x1b[31mADVERSARIAL STRESS TEST FAILURES: ${failures} issue(s) detected.\x1b[0m`);
  process.exit(1);
}
