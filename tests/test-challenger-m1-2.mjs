/**
 * NEXUS CONTRACTGUARD ENTERPRISE — ADVERSARIAL CHALLENGE HARNESS (CHALLENGER M1-2)
 * Target Modules:
 *   1. financialDateAuditor.js (R3)
 *   2. obligationsExtractor.js (R4)
 * 
 * Invocation: node tests/test-challenger-m1-2.mjs
 */

import { performance } from 'perf_hooks';
import {
  parseWordsToNumber,
  parseNumericAmount,
  extractDateFromText,
  parseContractDate,
  auditFinancialAndDates
} from '../src/utils/financialDateAuditor.js';

import {
  splitLegalSentences,
  attributeObligationParty,
  extractObligations
} from '../src/utils/obligationsExtractor.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

function check(title, condition, diagnostic = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    testResults.push({ title, status: 'PASS', diagnostic });
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${title}`);
  } else {
    failedTests++;
    testResults.push({ title, status: 'FAIL', diagnostic });
    console.log(`  \x1b[31m✗ FAIL\x1b[0m ${title} ${diagnostic ? '--> ' + diagnostic : ''}`);
  }
}

function suite(name) {
  console.log(`\n======================================================================`);
  console.log(`CHALLENGE SUITE: ${name}`);
  console.log(`======================================================================`);
}

const suiteStartTime = performance.now();

// ============================================================================
// SUITE 1: ADVERSARIAL FINANCIAL WORDS-TO-NUMBERS & HUGE SCALES
// ============================================================================
suite('1. Words-to-Numbers: Huge Numbers, Legal Fractions & Scales');

{
  // 1.1 High-value millions with cents fraction (from dispatch prompt)
  const text1 = 'One Million Two Hundred Thirty-Four Thousand Five Hundred Sixty-Seven Dollars and 89/100';
  const val1 = parseWordsToNumber(text1);
  check('1.1 Parses $1,234,567.89 written in legal words + fractional cents', 
    val1 !== null && Math.abs(val1 - 1234567.89) < 0.001,
    `Expected: 1234567.89, Got: ${val1}`);

  // 1.2 Billions scale
  const text2 = 'One Billion Five Hundred Million Dollars';
  const val2 = parseWordsToNumber(text2);
  check('1.2 Parses billions scale ($1,500,000,000)',
    val2 === 1500000000,
    `Expected: 1500000000, Got: ${val2}`);

  // 1.3 Trillions scale
  const text3 = 'Two Trillion Dollars';
  const val3 = parseWordsToNumber(text3);
  check('1.3 Parses trillions scale ($2,000,000,000,000)',
    val3 === 2000000000000,
    `Expected: 2000000000000, Got: ${val3}`);

  // 1.4 Standalone legal cents (Fifty Cents -> 0.50)
  const text4 = 'Fifty Cents';
  const val4 = parseWordsToNumber(text4);
  check('1.4 Parses standalone cents without dollar word (Fifty Cents -> 0.50)',
    val4 !== null && Math.abs(val4 - 0.50) < 0.001,
    `Expected: 0.50, Got: ${val4}`);

  // 1.5 Legal "no/100" and "xx/100"
  const text5 = 'Five Hundred Dollars and no/100';
  const val5 = parseWordsToNumber(text5);
  check('1.5 Handles "and no/100" legal zero fraction',
    val5 === 500,
    `Expected: 500, Got: ${val5}`);

  const text5b = 'Five Hundred Dollars and xx/100';
  const val5b = parseWordsToNumber(text5b);
  check('1.5b Handles "and xx/100" legal zero fraction',
    val5b === 500,
    `Expected: 500, Got: ${val5b}`);

  // 1.6 Hyphenated compound numbers
  const text6 = 'Seventy-Five Thousand Four Hundred Twenty-Two Dollars and 45/100';
  const val6 = parseWordsToNumber(text6);
  check('1.6 Handles hyphenated numbers with cents (75,422.45)',
    val6 !== null && Math.abs(val6 - 75422.45) < 0.001,
    `Expected: 75422.45, Got: ${val6}`);

  // 1.7 Non-numeric garbage handling
  const text7 = 'Random legal boilerplate without amounts';
  const val7 = parseWordsToNumber(text7);
  check('1.7 Returns null gracefully on non-monetary text',
    val7 === null,
    `Expected null, Got: ${val7}`);

  // 1.8 Null, undefined, empty string handling
  check('1.8a Handles null safely', parseWordsToNumber(null) === null);
  check('1.8b Handles undefined safely', parseWordsToNumber(undefined) === null);
  check('1.8c Handles empty string safely', parseWordsToNumber('') === null);
}

// ============================================================================
// SUITE 2: MULTI-CURRENCY EXTRACTION & PAIRING STRESS
// ============================================================================
suite('2. Multi-Currency Extraction & Complex Pairings (GBP, JPY, EUR, AED, SAR)');

{
  // 2.1 Major Currencies Pairing
  const multiText = `
Section 1. Global Licensing Fees:
(a) UK Operations: £150,000 (One Hundred Fifty Thousand Pounds) per annum.
(b) European Union: €250,000 (Two Hundred Fifty Thousand Euros) setup fee.
(c) Japan Operations: ¥5,000,000 (Five Million Yen) maintenance.
(d) UAE Subsidiary: AED 75,000 (Seventy-Five Thousand Dirhams) local tax.
(e) Saudi Arabia Branch: SAR 1,000,000 (One Million Riyals) escrow deposit.
(f) Swiss Francs: CHF 50,000 (Fifty Thousand Francs) security fee.
`;

  const res = auditFinancialAndDates(multiText);

  check('2.1 Pairs British Pounds (£150,000)',
    res.financialPairings.some(p => p.numeric.includes('150,000') && p.match === true),
    `Pairings: ${JSON.stringify(res.financialPairings.map(p => ({ n: p.numeric, m: p.match })))}`);

  check('2.2 Pairs Euros (€250,000)',
    res.financialPairings.some(p => p.numeric.includes('250,000') && p.match === true));

  check('2.3 Pairs Japanese Yen (¥5,000,000)',
    res.financialPairings.some(p => p.numeric.includes('5,000,000') && p.match === true));

  check('2.4 Pairs UAE Dirhams (AED 75,000)',
    res.financialPairings.some(p => p.numeric.includes('75,000') && p.match === true));

  check('2.5 Pairs Saudi Riyals (SAR 1,000,000)',
    res.financialPairings.some(p => p.numeric.includes('1,000,000') && p.match === true));

  check('2.6 Zero false-positive amount_mismatch issues across valid international currencies',
    res.issues.filter(i => i.type === 'amount_mismatch').length === 0,
    `Mismatches found: ${res.issues.filter(i => i.type === 'amount_mismatch').length}`);

  check('2.7 Total extracted amounts count captures all 6 monetary entries',
    res.stats.totalAmounts >= 6,
    `Total amounts extracted: ${res.stats.totalAmounts}`);
}

// ============================================================================
// SUITE 3: TRICKY WORDS-TO-NUMBERS MISMATCH EDGE CASES
// ============================================================================
suite('3. Adversarial Words-to-Numbers Mismatches & Sentence Preambles');

{
  // 3.1 Format: Digits followed by parenthetical words: "$10,000 (Twenty Thousand Dollars)"
  const textMismatch1 = `Customer shall pay $10,000 (Twenty Thousand Dollars) upon milestone completion.`;
  const res1 = auditFinancialAndDates(textMismatch1);
  const mm1 = res1.issues.filter(i => i.type === 'amount_mismatch');
  check('3.1 Detects mismatch: $10,000 vs (Twenty Thousand Dollars)',
    mm1.length === 1 && mm1[0].numericValue === 10000 && mm1[0].wordValue === 20000,
    `Found mismatches: ${JSON.stringify(mm1)}`);

  // 3.2 Format: Words followed by parenthetical digits: "Twenty Thousand Dollars ($10,000)"
  const textMismatch2 = `Licensor shall receive Twenty Thousand Dollars ($10,000) for software rights.`;
  const res2 = auditFinancialAndDates(textMismatch2);
  const mm2 = res2.issues.filter(i => i.type === 'amount_mismatch');
  check('3.2 Detects mismatch: Twenty Thousand Dollars ($10,000)',
    mm2.length === 1 && mm2[0].numericValue === 10000 && mm2[0].wordValue === 20000,
    `Found mismatches: ${JSON.stringify(mm2)}`);

  // 3.3 Subtle Cents Mismatch: $500,000.50 vs ... and 40/100
  const textMismatch3 = `Total compensation is $500,000.50 (Five Hundred Thousand Dollars and 40/100).`;
  const res3 = auditFinancialAndDates(textMismatch3);
  const mm3 = res3.issues.filter(i => i.type === 'amount_mismatch');
  check('3.3 Detects subtle fractional cent mismatch: .50 vs 40/100',
    mm3.length === 1,
    `Mismatches found: ${mm3.length}`);

  // 3.4 Scale Discrepancy: $1,000,000 vs One Hundred Thousand Dollars
  const textMismatch4 = `Total fee is $1,000,000 (One Hundred Thousand Dollars).`;
  const res4 = auditFinancialAndDates(textMismatch4);
  const mm4 = res4.issues.filter(i => i.type === 'amount_mismatch');
  check('3.4 Detects 10x scale mismatch: $1,000,000 vs $100,000',
    mm4.length === 1 && mm4[0].numericValue === 1000000 && mm4[0].wordValue === 100000);

  // 3.5 Sentence with number word in preamble:
  // "In Phase two, the fee is Ten Thousand Dollars ($10,000)."
  // We stress-test whether "two" corrupts "Ten Thousand" into 12,000!
  const textPreamble = `In Phase two, the fee is $10,000 (Ten Thousand Dollars).`;
  const resPreamble = auditFinancialAndDates(textPreamble);
  const pPairing = resPreamble.financialPairings.find(p => p.numericVal === 10000);
  check('3.5 Preamble number word does NOT corrupt Pattern B ($10,000 followed by (Ten Thousand Dollars))',
    pPairing && pPairing.match === true && pPairing.wordsVal === 10000,
    `Pairing: ${JSON.stringify(pPairing)}`);
}

// ============================================================================
// SUITE 4: DATE FORMATS, LEAP YEARS, EXPIRATION & CHRONOLOGY
// ============================================================================
suite('4. Date Parsing, Leap Years & Chronological Logic');

{
  // 4.1 Leap year date: February 29, 2024
  const leapText = 'The audit occurred on February 29, 2024.';
  const d1 = extractDateFromText(leapText);
  check('4.1 Parses valid leap day: February 29, 2024 -> 2024-02-29',
    d1 !== null && d1.parsedDate === '2024-02-29',
    `Result: ${JSON.stringify(d1)}`);

  // 4.2 European day-first format: 15 March 2026 and 15th day of March, 2026
  const euroText1 = 'Signed on 15 March 2026.';
  const d2 = extractDateFromText(euroText1);
  check('4.2 Parses European day-first: 15 March 2026 -> 2026-03-15',
    d2 !== null && d2.parsedDate === '2026-03-15',
    `Result: ${JSON.stringify(d2)}`);

  const euroText2 = 'Signed on the 15th day of March, 2026.';
  const d3 = extractDateFromText(euroText2);
  check('4.3 Parses formal English: the 15th day of March, 2026 -> 2026-03-15',
    d3 !== null && d3.parsedDate === '2026-03-15',
    `Result: ${JSON.stringify(d3)}`);

  // 4.4 ISO format: 2026-03-15
  const isoText = 'Effective date is 2026-03-15.';
  const d4 = extractDateFromText(isoText);
  check('4.4 Parses ISO date: 2026-03-15 -> 2026-03-15',
    d4 !== null && d4.parsedDate === '2026-03-15',
    `Result: ${JSON.stringify(d4)}`);

  // 4.5 US slash format: 03/15/2026
  const usSlashText = 'Effective as of 03/15/2026.';
  const d5 = extractDateFromText(usSlashText);
  check('4.5 Parses US slash date: 03/15/2026 -> 2026-03-15',
    d5 !== null && d5.parsedDate === '2026-03-15',
    `Result: ${JSON.stringify(d5)}`);

  // 4.6 Effective Date post-dating Expiration Date (Chronological Contradiction)
  const refDate = new Date('2026-01-01T00:00:00Z');
  const contraText = `
Effective Date: December 31, 2026.
Expiration Date: January 1, 2026.
`;
  const resContra = auditFinancialAndDates(contraText, refDate);
  const contraIssues = resContra.issues.filter(i => i.type === 'timeline_contradiction');
  check('4.6 Flags critical timeline contradiction when Effective Date > Expiration Date',
    contraIssues.length >= 1 && contraIssues[0].severity === 'critical',
    `Issues: ${JSON.stringify(contraIssues)}`);

  // 4.7 Past Expired Date Detection
  const expiredText = `
Term expires on January 1, 2022.
`;
  const resExpired = auditFinancialAndDates(expiredText, new Date('2026-10-15T00:00:00Z'));
  const expIssues = resExpired.issues.filter(i => i.type === 'expired_date');
  check('4.7 Flags expired date when Expiration Date precedes reference audit date',
    expIssues.length >= 1 && expIssues[0].dateStr === '2022-01-01',
    `Issues: ${JSON.stringify(expIssues)}`);

  // 4.8 Contradictory Notice Trap (60+ days notice vs immediate termination)
  const noticeTrapText = `
Section 5. Termination. Either party may terminate upon ninety (90) days prior written notice.
Section 6. Immediate Exit. Either party may exercise immediate termination without cause.
`;
  const resTrap = auditFinancialAndDates(noticeTrapText, refDate);
  const trapIssues = resTrap.issues.filter(i => i.type === 'timeline_contradiction');
  check('4.8 Flags notice trap warning (long notice period vs immediate termination without cause)',
    trapIssues.length >= 1 && trapIssues[0].severity === 'warning',
    `Issues: ${JSON.stringify(trapIssues)}`);

  // 4.9 Notice period parsing: spelled words ("thirty (30) days", "sixty days", "180 days")
  const noticeMulti = `
Clause 1: sixty (60) calendar days prior written notice.
Clause 2: thirty (30) business days written notice.
Clause 3: 180 days notice.
Clause 4: ninety days notice.
`;
  const resNotice = auditFinancialAndDates(noticeMulti, refDate);
  check('4.9 Extracts multiple notice periods with correct day counts',
    resNotice.noticePeriods.length >= 4 &&
    resNotice.noticePeriods.some(p => p.periodDays === 60) &&
    resNotice.noticePeriods.some(p => p.periodDays === 30) &&
    resNotice.noticePeriods.some(p => p.periodDays === 180) &&
    resNotice.noticePeriods.some(p => p.periodDays === 90),
    `Found periods: ${JSON.stringify(resNotice.noticePeriods)}`);
}

// ============================================================================
// SUITE 5: OBLIGATIONS EXTRACTOR ADVERSARIAL DEONTIC & PARTY ATTRIBUTION
// ============================================================================
suite('5. Obligations Extractor: Modal Verbs, Deontic Duty & Attribution');

{
  // 5.1 All supported modal verbs
  const modalText = `
Client shall submit work orders.
Vendor must deliver milestones on schedule.
Customer agrees to reimburse travel expenses.
Provider will maintain backups.
Neither party shall disclose confidential data.
Consultant agrees not to solicit employees.
Client will not reverse engineer the software.
Vendor must not assign rights without consent.
`;
  const resModal = extractObligations(modalText, 'Client', 'Vendor');

  check('5.1a Extracts affirmative "shall" obligation',
    resModal.obligations.some(o => o.modalVerb === 'shall' && o.dutyType === 'affirmative'));

  check('5.1b Extracts affirmative "must" obligation',
    resModal.obligations.some(o => o.modalVerb === 'must' && o.dutyType === 'affirmative'));

  check('5.1c Extracts affirmative "agrees to" obligation',
    resModal.obligations.some(o => o.modalVerb === 'agrees to' && o.dutyType === 'affirmative'));

  check('5.1d Extracts affirmative "will" obligation',
    resModal.obligations.some(o => o.modalVerb === 'will' && o.dutyType === 'affirmative'));

  check('5.1e Extracts negative "shall not" obligation via "Neither party shall"',
    resModal.obligations.some(o => o.modalVerb === 'shall not' && o.dutyType === 'negative'));

  check('5.1f Extracts negative "agrees not to" obligation',
    resModal.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('agrees not to')));

  check('5.1g Extracts negative "will not" obligation',
    resModal.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('will not')));

  check('5.1h Extracts negative "must not" obligation',
    resModal.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('must not')));

  // 5.2 Party Attribution Matrix
  check('5.2a Attributes "Client" obligations to Client',
    resModal.partyBreakdown.clientCount >= 2,
    `Client count: ${resModal.partyBreakdown.clientCount}`);

  check('5.2b Attributes "Vendor" obligations to Counterparty',
    resModal.partyBreakdown.counterpartyCount >= 2,
    `Counterparty count: ${resModal.partyBreakdown.counterpartyCount}`);

  check('5.2c Attributes "Neither party shall" to Mutual',
    resModal.partyBreakdown.mutualCount >= 1,
    `Mutual count: ${resModal.partyBreakdown.mutualCount}`);

  // 5.3 Third Party Entities
  const thirdPartyText = `
The Escrow Agent shall hold the source code in deposit.
The independent Arbitrator must issue a binding ruling within thirty days.
A qualified Auditor shall conduct annual security reviews.
`;
  const resTP = extractObligations(thirdPartyText, 'Client', 'Vendor');
  check('5.3 Attributes Escrow Agent, Arbitrator, and Auditor to Third Party',
    resTP.partyBreakdown.thirdPartyCount === 3,
    `Third party count: ${resTP.partyBreakdown.thirdPartyCount}`);

  // 5.4 Conditionals Precedent
  const condText = `
If Client fails to pay within thirty days, Provider shall suspend access.
Unless otherwise agreed in writing, Contractor shall bear all travel costs.
Provided that Customer provides notice, Vendor will issue a refund.
`;
  const resCond = extractObligations(condText, 'Client', 'Vendor');
  check('5.4 Identifies conditional obligations ("if", "unless", "provided that")',
    resCond.stats.conditionalCount === 3,
    `Conditional count: ${resCond.stats.conditionalCount}`);

  // 5.5 Severity Classification
  const sevText = `
Client shall pay all undisputed invoices within thirty days.
Provider shall indemnify and hold harmless Client against patent claims.
Vendor shall notify Client within 24 hours of any security incident or data breach.
Client shall use reasonable efforts to cooperate.
`;
  const resSev = extractObligations(sevText, 'Client', 'Vendor');
  const highSev = resSev.obligations.filter(o => o.severity === 'high');
  const lowSev = resSev.obligations.filter(o => o.severity === 'low');
  check('5.5a High severity triggered for payment, indemnification, and data breach within 24 hours',
    highSev.length >= 3,
    `High severity count: ${highSev.length}`);

  check('5.5b Low severity triggered for "reasonable efforts to cooperate"',
    lowSev.length >= 1,
    `Low severity count: ${lowSev.length}`);

  // 5.6 Protection against Abbreviation Sentence Slicing
  const abbrText = `
Vendor shall provide services to Acme Corp. within ten days.
Client shall pay $1,500.50 upon receipt of invoice.
Customer shall adhere to Section 4.2 of this Agreement.
`;
  const sentences = splitLegalSentences(abbrText);
  check('5.6 Sentence splitter does NOT break on "Corp.", decimals "$1,500.50", or section numbers "4.2"',
    sentences.length === 3,
    `Sentence count: ${sentences.length}`);
}

// ============================================================================
// SUITE 6: PASSIVE VOICE & ADVERSARIAL PHRASING ANALYSIS
// ============================================================================
suite('6. Passive Voice & Tricky Phrasing Boundary Tests');

{
  // 6.1 Passive Voice: "Payment shall be made by Client"
  // Let's inspect how the current engine attributes passive constructions
  const passiveText = `
Payment shall be made by Customer within thirty days.
Written notice must be provided by Vendor prior to renewal.
`;
  const resPassive = extractObligations(passiveText, 'Customer', 'Vendor');
  
  check('6.1 Passive voice sentences extract the obligation modal verb',
    resPassive.obligations.length === 2,
    `Obligations extracted: ${resPassive.obligations.length}`);

  // Log diagnostic of passive voice party attribution
  console.log(`    [DIAGNOSTIC] Passive sentence 1 attribution: "${resPassive.obligations[0]?.sentence}" -> Party: ${resPassive.obligations[0]?.responsibleParty}`);
  console.log(`    [DIAGNOSTIC] Passive sentence 2 attribution: "${resPassive.obligations[1]?.sentence}" -> Party: ${resPassive.obligations[1]?.responsibleParty}`);

  // 6.2 "free will" and "last will" false-positive filtering
  const willText = `
Party executes this contract of its own free will.
Nothing herein shall constitute a last will and testament.
Vendor will deliver the final build.
`;
  const resWill = extractObligations(willText, 'Customer', 'Vendor');
  check('6.2 "free will" and "last will" are not falsely extracted as modal obligations',
    resWill.obligations.length === 1 && resWill.obligations[0].action.includes('deliver the final build'),
    `Obligations count: ${resWill.obligations.length}`);

  // 6.3 Empty and Pathological Inputs
  check('6.3a Empty input returns empty obligations gracefully',
    extractObligations('').obligations.length === 0);

  check('6.3b Null input returns empty obligations gracefully',
    extractObligations(null).obligations.length === 0);

  check('6.3c Undefined input returns empty obligations gracefully',
    extractObligations(undefined).obligations.length === 0);
}

// ============================================================================
// SUITE 7: SCALE & PERFORMANCE STRESS (30,000 WORDS SYNTHETIC CONTRACT)
// ============================================================================
suite('7. Scale & Performance Stress (30,000+ Words)');

{
  // Generate a large synthetic contract with repeating complex sections
  const paragraph = `
Section 10. Financial Obligations and Milestones.
Customer shall pay the sum of $250,000 (Two Hundred Fifty Thousand Dollars) upon completion of Milestone A.
Vendor shall deliver all specifications within thirty (30) days prior written notice.
In the event of delay, Provider shall indemnify Customer against all direct damages.
Neither party shall disclose Proprietary Software or confidential trade secrets.
Effective Date: October 15, 2026.
Expiration Date: October 15, 2029.
`;

  // Repeat 1,000 times -> ~65,000 words!
  const hugeText = paragraph.repeat(600);
  const wordCount = hugeText.trim().split(/\s+/).length;

  console.log(`    Generated stress corpus: ${wordCount.toLocaleString()} words`);

  const t0 = performance.now();
  const finRes = auditFinancialAndDates(hugeText);
  const tFin = performance.now() - t0;

  const t1 = performance.now();
  const oblRes = extractObligations(hugeText, 'Customer', 'Vendor');
  const tObl = performance.now() - t1;

  console.log(`    financialDateAuditor processing time: ${tFin.toFixed(2)}ms`);
  console.log(`    obligationsExtractor processing time: ${tObl.toFixed(2)}ms`);

  check('7.1 Financial & Date Auditor handles 35,000+ words in < 1500ms',
    tFin < 1500,
    `Execution time: ${tFin.toFixed(2)}ms`);

  check('7.2 Obligations Extractor handles 35,000+ words in < 1500ms',
    tObl < 1500,
    `Execution time: ${tObl.toFixed(2)}ms`);

  check('7.3 Combined audit time remains well within real-time responsiveness (< 2500ms)',
    (tFin + tObl) < 2500,
    `Combined time: ${(tFin + tObl).toFixed(2)}ms`);
}

// ============================================================================
// SUMMARY REPORT
// ============================================================================
const suiteDuration = performance.now() - suiteStartTime;

console.log(`\n======================================================================`);
console.log(`CHALLENGE HARNESS EXECUTION COMPLETE in ${suiteDuration.toFixed(2)}ms`);
console.log(`Total Assertions: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log(`Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log(`======================================================================\n`);

if (failedTests > 0) {
  console.error(`\x1b[31mCHALLENGE VERDICT: REJECT (${failedTests} tests failed)\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32mCHALLENGE VERDICT: APPROVE (100% assertions passed)\x1b[0m`);
  process.exit(0);
}
