/**
 * NEXUS CONTRACTGUARD ENTERPRISE — MILESTONE 1 UNIT TEST SUITE
 * Test Runner: tests/test-m1-proofreading.mjs
 * Validates F1–F13 across the 4 Core Proofreading Engines:
 *   1. crossRefValidator.js (R1)
 *   2. definedTermsAuditor.js (R2)
 *   3. financialDateAuditor.js (R3)
 *   4. obligationsExtractor.js (R4)
 *
 * Invocation: node tests/test-m1-proofreading.mjs
 * Exit Code: 0 on 100% pass, 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import M1 Engine Modules
import { validateCrossReferences } from '../src/utils/crossRefValidator.js';
import { auditDefinedTerms } from '../src/utils/definedTermsAuditor.js';
import { auditFinancialAndDates } from '../src/utils/financialDateAuditor.js';
import { extractObligations } from '../src/utils/obligationsExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m[PASS]\x1b[0m ${testName}`);
  } else {
    failedTests++;
    const msg = `  \x1b[31m[FAIL]\x1b[0m ${testName} ${details ? '— ' + details : ''}`;
    console.error(msg);
    failures.push({ testName, details });
  }
}

function suiteHeader(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`SUITE: ${title}`);
  console.log('='.repeat(70));
}

const startTime = performance.now();

// ============================================================================
// SUITE 1: CROSS-REFERENCE & EXHIBIT VALIDATOR (crossRefValidator.js - F1, F2, F3)
// ============================================================================
suiteHeader('1. Cross-Reference & Exhibit Validator (crossRefValidator.js)');

// 1.1 Indexing Standard Headings (F1)
{
  const text = `
SECTION 1. DEFINITIONS
Section 1.1 Scope
Section 1.2 Fees
SECTION 2. TERMINATION
Article III - REPRESENTATIONS
Clause 4.1 Warranties
EXHIBIT A - SPECIFICATIONS
Schedule 1 - Pricing
Appendix B - Security
`;
  const res = validateCrossReferences(text);
  assert(res.indexedSections.length >= 5, 'F1: Indexes standard sections, articles, and clauses');
  assert(res.indexedSections.some(s => s.id === '1' || s.id === '1.0'), 'F1: Indexes Section 1');
  assert(res.indexedSections.some(s => s.id === '1.1'), 'F1: Indexes Section 1.1');
  assert(res.indexedSections.some(s => s.id === '1.2'), 'F1: Indexes Section 1.2');
  assert(res.indexedSections.some(s => s.id === '2'), 'F1: Indexes Section 2');
  assert(res.indexedExhibits.length >= 3, 'F1: Indexes Exhibits, Schedules, and Appendices');
  assert(res.indexedExhibits.some(e => e.id.toLowerCase().includes('exhibit a')), 'F1: Indexes Exhibit A');
  assert(res.indexedExhibits.some(e => e.id.toLowerCase().includes('schedule 1')), 'F1: Indexes Schedule 1');
  assert(res.indexedExhibits.some(e => e.id.toLowerCase().includes('appendix b')), 'F1: Indexes Appendix B');
}

// 1.2 Detecting Valid Internal References (F2)
{
  const text = `
Section 1. Services
Pursuant to Section 2.1, fees shall apply.
Section 2. Fees
Section 2.1 Payment Terms
As specified in Section 1, services are described above.
`;
  const res = validateCrossReferences(text);
  assert(res.citationsFound.length >= 2, 'F2: Captures internal citations');
  assert(res.issues.filter(i => i.type === 'broken_reference').length === 0, 'F2: Valid forward and backward references produce 0 broken issues');
}

// 1.3 Detecting Broken Section References (F2)
{
  const text = `
Section 1. Scope
Customer shall pay in accordance with Section 8.3 of this Agreement.
Section 8. Fees
Section 8.1 Rates
Section 8.2 Invoices
`;
  const res = validateCrossReferences(text);
  const broken = res.issues.filter(i => i.type === 'broken_reference');
  assert(broken.length === 1, 'F2: Identifies broken reference to non-existent Section 8.3');
  assert(broken[0].targetName.includes('8.3'), 'F2: Broken issue targetName contains 8.3');
  assert(broken[0].severity === 'critical', 'F2: Broken reference severity is critical');
  assert(broken[0].line > 0, 'F2: Broken reference has valid line number');
}

// 1.4 Detecting Missing Exhibits & Schedules (F3)
{
  const text = `
Section 1. Deliverables
All deliverables are set forth in Exhibit A attached hereto.
The pricing model is detailed in Exhibit C (Pricing Schedule).
Section 2. Maintenance
Maintenance standards are set forth in Schedule 2.
EXHIBIT A - DELIVERABLES
Description of deliverables.
`;
  const res = validateCrossReferences(text);
  const missingEx = res.issues.filter(i => i.type === 'missing_exhibit');
  assert(missingEx.length === 2, 'F3: Detects missing Exhibit C and Schedule 2');
  assert(missingEx.some(e => e.targetName.toLowerCase().includes('exhibit c')), 'F3: Flags missing Exhibit C');
  assert(missingEx.some(e => e.targetName.toLowerCase().includes('schedule 2')), 'F3: Flags missing Schedule 2');
  assert(res.stats.missingExhibitCount === 2, 'F3: stats.missingExhibitCount matches issues count');
}

// 1.5 Stats Object Verification
{
  const text = `
Section 1. Overview
See Section 9.9 for details.
Exhibit A - Overview
`;
  const res = validateCrossReferences(text);
  assert(typeof res.stats.totalIndexed === 'number', 'F1-F3: stats.totalIndexed is number');
  assert(typeof res.stats.totalCitations === 'number', 'F1-F3: stats.totalCitations is number');
  assert(typeof res.stats.brokenCount === 'number', 'F1-F3: stats.brokenCount is number');
  assert(typeof res.stats.missingExhibitCount === 'number', 'F1-F3: stats.missingExhibitCount is number');
}

// ============================================================================
// SUITE 2: DEFINED TERMS AUDITOR (definedTermsAuditor.js - F4, F5, F6, F7, F8)
// ============================================================================
suiteHeader('2. Defined Terms Auditor (definedTermsAuditor.js)');

// 2.1 Extraction of Defined Terms from Definitions Section (F4)
{
  const text = `
SECTION 1. DEFINITIONS
1.1 "Agreement" means this Master Services Agreement.
1.2 "Confidential Information" shall mean all proprietary code and data.
1.3 "Services" has the meaning set forth in Exhibit A.
1.4 Acme Corp (the "Company") agrees to terms.
`;
  const res = auditDefinedTerms(text);
  assert(res.definedTerms.length >= 3, 'F4: Extracts defined terms from explicit definitions');
  assert(res.definedTerms.some(d => d.term === 'Agreement'), 'F4: Extracts "Agreement"');
  assert(res.definedTerms.some(d => d.term === 'Confidential Information'), 'F4: Extracts "Confidential Information"');
  assert(res.definedTerms.some(d => d.term === 'Services'), 'F4: Extracts "Services"');
  assert(res.stats.totalDefined >= 3, 'F4: stats.totalDefined reflects extracted definitions');
}

// 2.2 Undefined Capitalized Terms Detection with Filtering (F5)
{
  const text = `
SECTION 1. DEFINITIONS
"Services" means consulting.

SECTION 2. OPERATIVE PROVISIONS
Provider shall assign Key Personnel to perform the Services.
All Proprietary Software shall remain the property of Provider.
Notwithstanding the foregoing, the Client shall pay on Monday in Delaware.
`;
  const res = auditDefinedTerms(text);
  const undefTerms = res.undefinedTerms.map(u => u.term);
  assert(undefTerms.includes('Key Personnel'), 'F5: Flags undefined capitalized term "Key Personnel"');
  assert(undefTerms.includes('Proprietary Software'), 'F5: Flags undefined capitalized term "Proprietary Software"');
  assert(!undefTerms.includes('Notwithstanding'), 'F5: Filters out sentence-starter "Notwithstanding"');
  assert(!undefTerms.includes('Monday'), 'F5: Filters out days of week "Monday"');
  assert(!undefTerms.includes('Delaware'), 'F5: Filters out common geographic/jurisdiction names');
  assert(!undefTerms.includes('Services'), 'F5: Does not flag defined term "Services"');
}

// 2.3 Unused Defined Terms Detection (F6)
{
  const text = `
SECTION 1. DEFINITIONS
"Active Term" means the duration.
"Orphaned Term" means a concept never discussed again.
"Force Majeure Event" means an act of war or earthquake.

SECTION 2. CLAUSES
The Active Term shall be three years.
`;
  const res = auditDefinedTerms(text);
  const unused = res.unusedDefinedTerms.map(u => u.term);
  assert(unused.includes('Orphaned Term'), 'F6: Flags "Orphaned Term" as unused defined term');
  assert(unused.includes('Force Majeure Event'), 'F6: Flags "Force Majeure Event" as unused defined term');
  assert(!unused.includes('Active Term'), 'F6: Does not flag used defined term "Active Term"');
}

// 2.4 Entity Name Inconsistency & Remnants (F7)
{
  const text = `
This Agreement is between Acme Corporation ("Client") and Globex Inc. ("Provider").
Acme Corp shall provide access to facilities.
In no event shall Acme LLC be liable.
OldVendor Inc. shall maintain warranty.
`;
  const res = auditDefinedTerms(text, { parties: ['Acme Corporation', 'Globex Inc.'] });
  assert(res.entityIssues.length >= 2, 'F7: Flags entity discrepancies and alien counterparties');
  assert(res.entityIssues.some(e => e.discrepancy.includes('Acme Corp') || e.entity.includes('Acme Corp')), 'F7: Flags Acme Corp inconsistency');
  assert(res.entityIssues.some(e => e.discrepancy.includes('OldVendor Inc') || e.entity.includes('OldVendor Inc')), 'F7: Flags leftover OldVendor Inc');
}

// 2.5 Leftover Boilerplate Placeholders Sniffer (F8)
{
  const text = `
Party A: [Company Name]
Effective as of [Insert Effective Date].
Signatures:
By: ___
Date: [ • ]
Customer: <<CLIENT_NAME>>
`;
  const res = auditDefinedTerms(text);
  assert(res.boilerplateArtifacts.length >= 4, 'F8: Detects bracket, underscore, chevron, and bullet placeholders');
  assert(res.boilerplateArtifacts.some(b => b.placeholder.includes('[Company Name]')), 'F8: Finds [Company Name]');
  assert(res.boilerplateArtifacts.some(b => b.placeholder.includes('[Insert Effective Date]')), 'F8: Finds [Insert Effective Date]');
  assert(res.boilerplateArtifacts.some(b => b.placeholder.includes('___')), 'F8: Finds underscore line');
  assert(res.boilerplateArtifacts.some(b => b.placeholder.includes('<<CLIENT_NAME>>')), 'F8: Finds <<CLIENT_NAME>>');
  assert(res.stats.artifactCount >= 4, 'F8: stats.artifactCount matches artifacts found');
}

// ============================================================================
// SUITE 3: FINANCIAL & DATE INTEGRITY AUDITOR (financialDateAuditor.js - F9, F10, F11)
// ============================================================================
suiteHeader('3. Financial & Date Integrity Auditor (financialDateAuditor.js)');

// 3.1 Currency Extraction (F9)
{
  const text = `
Fees include $150,000 upfront, €45,000 upon delivery, and £10,000 retainer.
Additional USD 25,000 for licensing.
`;
  const res = auditFinancialAndDates(text);
  assert(res.stats.totalAmounts >= 4, 'F9: Extracts multiple currency amounts');
}

// 3.2 Words-to-Numbers Matching & Discrepancies (F10)
{
  const text = `
Client shall pay $10,000 (Ten Thousand Dollars) for Phase 1.
Client shall pay $15,000 (Fifty Thousand Dollars) for Phase 2.
Client shall pay One Hundred Thousand Dollars ($1,000,000) for Phase 3.
Client shall pay $250,000 (Two Hundred Fifty Thousand Dollars) for Phase 4.
`;
  const res = auditFinancialAndDates(text);
  const pairings = res.financialPairings;
  assert(pairings.length >= 4, 'F10: Pairs numeric and written monetary values');
  
  const match1 = pairings.find(p => p.numeric.includes('10,000'));
  assert(match1 && match1.match === true, 'F10: Correctly matches $10,000 with Ten Thousand Dollars');

  const match2 = pairings.find(p => p.numeric.includes('15,000'));
  assert(match2 && match2.match === false, 'F10: Flags mismatch between $15,000 and Fifty Thousand Dollars');

  const match3 = pairings.find(p => p.numeric.includes('1,000,000'));
  assert(match3 && match3.match === false, 'F10: Flags mismatch between $1,000,000 and One Hundred Thousand Dollars');

  const mismatches = res.issues.filter(i => i.type === 'amount_mismatch');
  assert(mismatches.length === 2, 'F10: Exactly 2 amount_mismatch issues recorded');
  assert(mismatches[0].severity === 'critical', 'F10: Amount mismatch severity is critical');
}

// 3.3 Large Numbers & Complex Words Conversion (F10)
{
  const text = `
Liability limit: $2,500,000 (Two Million Five Hundred Thousand Dollars).
Insurance minimum: $75,420 (Seventy-Five Thousand Four Hundred Twenty Dollars).
`;
  const res = auditFinancialAndDates(text);
  assert(res.issues.filter(i => i.type === 'amount_mismatch').length === 0, 'F10: Successfully converts complex millions and tens without false positives');
}

// 3.4 Timeline & Chronology Auditor (F11)
{
  const refDate = new Date('2026-10-15T00:00:00Z');
  const text = `
Executed on October 15, 2026.
Effective as of November 1, 2026.
Term expires on October 31, 2027.
Deliverable completed by March 15, 2021.
`;
  const res = auditFinancialAndDates(text, refDate);
  assert(res.timeline.length >= 4, 'F11: Extracts timeline events and dates');
  
  const expiredIssues = res.issues.filter(i => i.type === 'expired_date');
  assert(expiredIssues.length >= 1, 'F11: Flags past date March 15, 2021 as expired');
  assert(expiredIssues[0].snippet.includes('2021'), 'F11: Expired issue identifies correct past year');
}

// 3.5 Timeline Contradictions & Notice Windows (F11)
{
  const refDate = new Date('2026-10-15T00:00:00Z');
  const text = `
Effective Date: December 1, 2026.
Expiration Date: August 1, 2026.
Section 3. Either party may terminate with sixty (60) days prior written notice.
Section 4. Agreement renews unless thirty (30) days notice given.
`;
  const res = auditFinancialAndDates(text, refDate);
  const contradictions = res.issues.filter(i => i.type === 'timeline_contradiction');
  assert(contradictions.length >= 1, 'F11: Flags contradiction where Expiration Date is earlier than Effective Date');
  assert(res.noticePeriods.length >= 2, 'F11: Extracts notice periods (60 days and 30 days)');
}

// ============================================================================
// SUITE 4: OBLIGATIONS EXTRACTOR (obligationsExtractor.js - F12, F13)
// ============================================================================
suiteHeader('4. Obligations Extractor (obligationsExtractor.js)');

// 4.1 Modal Verb Extraction & Duty Types (F12)
{
  const text = `
Provider shall deliver the source code within ten days.
Client must remit invoice payment upon receipt.
Licensee agrees to maintain audit logs.
Provider will provide maintenance support.
Neither party shall disclose confidential materials.
If Client fails to pay, Provider shall suspend services.
`;
  const res = extractObligations(text, 'Client', 'Provider');
  assert(res.obligations.length >= 6, 'F12: Extracts obligations across modal verbs');
  
  const shallNot = res.obligations.find(o => o.modalVerb === 'shall not' || o.sentence.includes('shall not disclose'));
  assert(shallNot && shallNot.dutyType === 'negative', 'F12: Classifies negative obligation ("shall not disclose")');

  const conditional = res.obligations.find(o => o.sentence.includes('If Client fails to pay'));
  assert(conditional && conditional.dutyType === 'conditional', 'F12: Classifies conditional obligation');

  assert(res.stats.affirmativeCount >= 4, 'F12: stats.affirmativeCount tracks positive duties');
  assert(res.stats.negativeCount >= 1, 'F12: stats.negativeCount tracks prohibitions');
}

// 4.2 Party Attribution Matrix (F13)
{
  const text = `
Provider shall provide continuous system monitoring.
Client shall provide administrative credentials.
Both parties agree to conduct quarterly business reviews.
Escrow Agent must release deposit upon notice.
`;
  const res = extractObligations(text, 'Client', 'Provider');
  assert(res.partyBreakdown.counterpartyCount >= 1, 'F13: Attributes Provider obligation to Counterparty');
  assert(res.partyBreakdown.clientCount >= 1, 'F13: Attributes Client obligation to Client');
  assert(res.partyBreakdown.mutualCount >= 1, 'F13: Attributes "Both parties agree" to Mutual');
  assert(res.partyBreakdown.thirdPartyCount >= 1, 'F13: Attributes Escrow Agent obligation to Third Party');
}

// ============================================================================
// SUITE 5: ADVERSARIAL BOUNDARY & CORNER CASES (Tier 2 Coverage)
// ============================================================================
suiteHeader('5. Adversarial Boundary & Edge Cases');

// 5.1 Empty and Minimal Inputs
{
  const emptyRes1 = validateCrossReferences('');
  assert(emptyRes1.issues.length === 0 && emptyRes1.stats.totalIndexed === 0, 'Tier 2: validateCrossReferences handles empty string safely');

  const emptyRes2 = auditDefinedTerms('');
  assert(emptyRes2.issues.length === 0 && emptyRes2.stats.totalDefined === 0, 'Tier 2: auditDefinedTerms handles empty string safely');

  const emptyRes3 = auditFinancialAndDates('');
  assert(emptyRes3.issues.length === 0 && emptyRes3.stats.totalAmounts === 0, 'Tier 2: auditFinancialAndDates handles empty string safely');

  const emptyRes4 = extractObligations('');
  assert(emptyRes4.obligations.length === 0 && emptyRes4.stats.totalObligations === 0, 'Tier 2: extractObligations handles empty string safely');
}

// 5.2 Unicode Smart Quotes & Legal Symbols
{
  const text = `
SECTION 1. DEFINITIONS
“Smart Quote Term” means defined with curly quotes.
‘Single Curly Term’ means defined with single curly quotes.
SECTION 2. OPERATIVE CLAUSES
Under § 1, Provider shall honor “Smart Quote Term”.
`;
  const resDT = auditDefinedTerms(text);
  assert(resDT.definedTerms.some(d => d.term === 'Smart Quote Term'), 'Tier 2: Handles unicode double curly quotes in definitions');

  const resCR = validateCrossReferences(text);
  assert(resCR.indexedSections.some(s => s.id === '1'), 'Tier 2: Handles legal section symbol (§ 1)');
}

// 5.3 Roman Numerals and Markdown Headings
{
  const text = `
# ARTICLE I. RECITALS
Pursuant to Article II below, services begin.
## ARTICLE II. PERFORMANCE
Services performed here.
### Article III. INDEMNITY
Refer to Article IV.
`;
  const res = validateCrossReferences(text);
  assert(res.indexedSections.some(s => s.id.toLowerCase() === 'article i' || s.id === 'I'), 'Tier 2: Indexes Roman numeral Article I with markdown #');
  assert(res.indexedSections.some(s => s.id.toLowerCase() === 'article ii' || s.id === 'II'), 'Tier 2: Indexes Roman numeral Article II with markdown ##');
  const broken = res.issues.filter(i => i.type === 'broken_reference');
  assert(broken.some(b => b.targetName.toLowerCase().includes('iv')), 'Tier 2: Detects broken reference to non-existent Article IV');
}

// 5.4 Zero Cents and Fractional Monetary Amounts
{
  const text = `
Client shall pay $10,000.00 (Ten Thousand Dollars) and $0.50 (Fifty Cents).
`;
  const res = auditFinancialAndDates(text);
  assert(res.issues.filter(i => i.type === 'amount_mismatch').length === 0, 'Tier 2: Handles .00 zero-cents without falsely reporting mismatch');
}

// ============================================================================
// SUITE 6: REALISTIC CONTRACT FIXTURES VERIFICATION (Tier 4 Coverage)
// ============================================================================
suiteHeader('6. Realistic Contract Fixtures Verification (tests/fixtures/)');

const fixtureFiles = [
  'master-services-agreement-clean.txt',
  'msa-broken-crossrefs.txt',
  'msa-defined-terms-defects.txt',
  'msa-financial-date-mismatches.txt',
  'msa-boilerplate-leftovers.txt',
  'complex-procurement-10k-words.txt'
];

// Check fixture files exist
for (const f of fixtureFiles) {
  const fPath = path.join(FIXTURES_DIR, f);
  const exists = fs.existsSync(fPath);
  assert(exists, `Fixture exists: ${f}`);
}

// 6.1 Clean Fixture Verification (Golden Baseline)
if (fs.existsSync(path.join(FIXTURES_DIR, 'master-services-agreement-clean.txt'))) {
  const cleanText = fs.readFileSync(path.join(FIXTURES_DIR, 'master-services-agreement-clean.txt'), 'utf8');
  const cr = validateCrossReferences(cleanText);
  const dt = auditDefinedTerms(cleanText, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
  const fd = auditFinancialAndDates(cleanText, new Date('2026-10-15T00:00:00Z'));
  const ob = extractObligations(cleanText, 'Acme Corporation', 'CloudTech Solutions Inc.');

  assert(cr.issues.filter(i => i.severity === 'critical').length === 0, 'Clean Fixture: 0 critical cross-reference issues');
  assert(dt.issues.filter(i => i.type === 'undefined_capitalized_term').length === 0, 'Clean Fixture: 0 undefined capitalized terms');
  assert(dt.issues.filter(i => i.type === 'boilerplate_artifact').length === 0, 'Clean Fixture: 0 boilerplate placeholders');
  assert(fd.issues.filter(i => i.type === 'amount_mismatch').length === 0, 'Clean Fixture: 0 financial amount mismatches');
  assert(ob.obligations.length > 5, 'Clean Fixture: Successfully extracts multiple obligations');
}

// 6.2 Broken Cross-References Fixture Verification
if (fs.existsSync(path.join(FIXTURES_DIR, 'msa-broken-crossrefs.txt'))) {
  const text = fs.readFileSync(path.join(FIXTURES_DIR, 'msa-broken-crossrefs.txt'), 'utf8');
  const cr = validateCrossReferences(text);
  assert(cr.issues.some(i => i.targetName.includes('8.3')), 'Broken Cross-Ref Fixture: Catches broken Section 8.3');
  assert(cr.issues.some(i => i.targetName.toLowerCase().includes('exhibit c')), 'Broken Cross-Ref Fixture: Catches missing Exhibit C');
  assert(cr.issues.some(i => i.targetName.toLowerCase().includes('schedule 3')), 'Broken Cross-Ref Fixture: Catches missing Schedule 3');
}

// 6.3 Defined Terms Defects Fixture Verification
if (fs.existsSync(path.join(FIXTURES_DIR, 'msa-defined-terms-defects.txt'))) {
  const text = fs.readFileSync(path.join(FIXTURES_DIR, 'msa-defined-terms-defects.txt'), 'utf8');
  const dt = auditDefinedTerms(text);
  const undef = dt.undefinedTerms.map(u => u.term);
  assert(undef.includes('Key Personnel'), 'Defined Terms Fixture: Catches undefined "Key Personnel"');
  assert(undef.includes('Proprietary Software'), 'Defined Terms Fixture: Catches undefined "Proprietary Software"');
  assert(dt.unusedDefinedTerms.some(u => u.term === 'Force Majeure Event'), 'Defined Terms Fixture: Catches unused "Force Majeure Event"');
  assert(dt.unusedDefinedTerms.some(u => u.term === 'Subcontractor'), 'Defined Terms Fixture: Catches unused "Subcontractor"');
}

// 6.4 Financial & Date Mismatches Fixture Verification
if (fs.existsSync(path.join(FIXTURES_DIR, 'msa-financial-date-mismatches.txt'))) {
  const text = fs.readFileSync(path.join(FIXTURES_DIR, 'msa-financial-date-mismatches.txt'), 'utf8');
  const fd = auditFinancialAndDates(text, new Date('2026-10-15T00:00:00Z'));
  const mismatches = fd.issues.filter(i => i.type === 'amount_mismatch');
  assert(mismatches.length >= 2, 'Financial Fixture: Catches amount mismatches ($10k vs Twenty Thousand, $15k vs Fifty Thousand)');
  assert(fd.issues.some(i => i.type === 'expired_date'), 'Financial Fixture: Catches expired past date 2022');
  assert(fd.issues.some(i => i.type === 'timeline_contradiction'), 'Financial Fixture: Catches timeline expiration before effective date');
}

// 6.5 Boilerplate Leftovers Fixture Verification
if (fs.existsSync(path.join(FIXTURES_DIR, 'msa-boilerplate-leftovers.txt'))) {
  const text = fs.readFileSync(path.join(FIXTURES_DIR, 'msa-boilerplate-leftovers.txt'), 'utf8');
  const dt = auditDefinedTerms(text, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
  assert(dt.boilerplateArtifacts.some(b => b.placeholder.includes('[Company Name]')), 'Boilerplate Fixture: Catches [Company Name]');
  assert(dt.boilerplateArtifacts.some(b => b.placeholder.includes('[Insert Effective Date]')), 'Boilerplate Fixture: Catches [Insert Effective Date]');
  assert(dt.boilerplateArtifacts.some(b => b.placeholder.includes('<<CLIENT_NAME>>')), 'Boilerplate Fixture: Catches <<CLIENT_NAME>>');
  assert(dt.entityIssues.some(e => e.entity.includes('OldVendor Inc') || e.discrepancy.includes('OldVendor Inc')), 'Boilerplate Fixture: Catches foreign entity OldVendor Inc.');
}

// 6.6 Complex Procurement 10k Words Fixture Verification
if (fs.existsSync(path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt'))) {
  const text10k = fs.readFileSync(path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt'), 'utf8');
  const wordCount = text10k.trim().split(/\s+/).length;
  assert(wordCount >= 10000, `Complex 10k Fixture: Word count exceeds 10,000 words (actual: ${wordCount})`);

  const t0 = performance.now();
  const cr = validateCrossReferences(text10k);
  const dt = auditDefinedTerms(text10k, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
  const fd = auditFinancialAndDates(text10k, new Date('2026-10-15T00:00:00Z'));
  const ob = extractObligations(text10k, 'Acme Corporation', 'CloudTech Solutions Inc.');
  const totalAuditTime = performance.now() - t0;

  assert(totalAuditTime < 5000, `Complex 10k Fixture: Audited in < 5000ms (actual: ${totalAuditTime.toFixed(2)}ms)`);
  assert(cr.issues.some(i => i.targetName.includes('19.4')), 'Complex 10k Fixture: Catches broken reference to Section 19.4');
  assert(cr.issues.some(i => i.targetName.toLowerCase().includes('exhibit e')), 'Complex 10k Fixture: Catches missing Exhibit E');
  assert(dt.unusedDefinedTerms.some(u => u.term === 'Authorized Subcontractor'), 'Complex 10k Fixture: Catches unused defined term "Authorized Subcontractor"');
  assert(fd.issues.some(i => i.type === 'amount_mismatch'), 'Complex 10k Fixture: Catches financial mismatch ($705,000 vs Seven Hundred Fifty Thousand Dollars)');
  assert(dt.boilerplateArtifacts.some(b => b.placeholder.includes('Performance Bond Issuer')), 'Complex 10k Fixture: Catches placeholder [Insert Performance Bond Issuer]');
  assert(ob.partyBreakdown.thirdPartyCount >= 1, 'Complex 10k Fixture: Correctly attributes Escrow Agent obligation to Third Party');
}

// ============================================================================
// SUITE SUMMARY & EXIT STATUS
// ============================================================================
const duration = (performance.now() - startTime).toFixed(2);
console.log('\n' + '='.repeat(70));
console.log(`TEST EXECUTION COMPLETE in ${duration}ms`);
console.log(`Total: ${totalTests} | Passed: \x1b[32m${passedTests}\x1b[0m | Failed: ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : '0'}`);
console.log('='.repeat(70));

if (failures.length > 0) {
  console.error('\nFAILURES SUMMARY:');
  failures.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\n\x1b[32mALL UNIT TESTS AND FIXTURE AUDITS PASSED SUCCESSFULLY (100% PASS RATE).\x1b[0m');
  process.exit(0);
}
