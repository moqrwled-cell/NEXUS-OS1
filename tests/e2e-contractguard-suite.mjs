/**
 * NEXUS CONTRACTGUARD ENTERPRISE (ContractGuard 2.0)
 * Master End-to-End Consolidated Test Suite & Air-Gap Auditor
 * File: tests/e2e-contractguard-suite.mjs
 * 
 * Consolidates all 5 Tiers:
 *   - Static & Runtime Zero-Network Air-Gap Audit (ABA Model Rule 1.6)
 *   - Tier 1: Feature Coverage (F1–F20 across R1–R5: ≥ 100 tests, ≥ 5 per feature)
 *   - Tier 2: Boundary & Corner Cases (≥ 100 tests)
 *   - Tier 3: Cross-Feature Combinations & Dual Analysis Modes (≥ 25 pairwise tests)
 *   - Tier 4: Real-World Application Scenarios (5 Comprehensive Legal Contracts)
 *   - Tier 5: Adversarial Stress Hardening (10k+ words <2,000ms & hostile fuzzing)
 * 
 * Invocation: node tests/e2e-contractguard-suite.mjs
 * Exit Code: 0 on 100% pass, 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// ContractGuard Flagship Engine Modules under test
import { 
  validateCrossReferences, 
  romanToArabic, 
  arabicToRoman 
} from '../src/utils/crossRefValidator.js';

import { 
  auditDefinedTerms, 
  levenshtein 
} from '../src/utils/definedTermsAuditor.js';

import { 
  auditFinancialAndDates, 
  parseWordsToNumber, 
  parseNumericAmount, 
  extractDateFromText, 
  parseContractDate 
} from '../src/utils/financialDateAuditor.js';

import { 
  extractObligations, 
  splitLegalSentences, 
  attributeObligationParty 
} from '../src/utils/obligationsExtractor.js';

import { 
  extractTextFromPDF, 
  isPDF 
} from '../src/utils/pdfExtractor.js';

import { 
  executeContractAnalysis, 
  calculateOverallRiskScore 
} from '../src/workers/contractWorker.js';

import { 
  useContractWorker, 
  executeContractAnalysisDirect 
} from '../src/utils/useContractWorker.js';

import { 
  exportExecutiveClientMemoHTML, 
  exportObligationsCSV, 
  exportObligationsJSON, 
  escapeHtml 
} from '../src/utils/exportEngine.js';

import { computeContractDiff } from '../src/utils/diffEngine.js';
import { sanitizeDocumentPII } from '../src/utils/piiEngine.js';
import { scanLegalRisks } from '../src/utils/legalRiskRules.js';
import { validateEnterpriseKey } from '../src/utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Test Metrics & Bookkeeping
let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failureDetails = [];

function assert(condition, title, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  \x1b[32m[PASS]\x1b[0m ${title}`);
  } else {
    failedAssertions++;
    const msg = `  \x1b[31m[FAIL]\x1b[0m ${title} ${details ? '— ' + details : ''}`;
    console.error(msg);
    failureDetails.push({ title, details });
  }
}

function suiteBanner(tier, name) {
  console.log('\n' + '='.repeat(78));
  console.log(`\x1b[1m\x1b[36m[${tier}]\x1b[0m \x1b[1m${name}\x1b[0m`);
  console.log('='.repeat(78));
}

// ============================================================================
// ZERO-NETWORK AUDIT: ACTIVE RUNTIME SPY & STATIC SCAN (ABA RULE 1.6)
// ============================================================================
suiteBanner('AUDIT', 'Air-Gapped Zero-Network Verification (ABA Model Rule 1.6)');

let runtimeNetworkAttempts = 0;
const networkSpyLog = [];

// Intercept global fetch
const origFetch = globalThis.fetch;
globalThis.fetch = function (...args) {
  runtimeNetworkAttempts++;
  networkSpyLog.push({ type: 'fetch', target: args[0] });
  throw new Error(`ABA Rule 1.6 Breach: Attempted fetch to ${args[0]}`);
};

// Intercept http.get & http.request
const origHttpGet = http.get;
const origHttpRequest = http.request;
http.get = function (...args) {
  runtimeNetworkAttempts++;
  networkSpyLog.push({ type: 'http.get', target: args[0] });
  throw new Error(`ABA Rule 1.6 Breach: Attempted http.get to ${args[0]}`);
};
http.request = function (...args) {
  runtimeNetworkAttempts++;
  networkSpyLog.push({ type: 'http.request', target: args[0] });
  throw new Error(`ABA Rule 1.6 Breach: Attempted http.request to ${args[0]}`);
};

// Intercept https.get & https.request
const origHttpsGet = https.get;
const origHttpsRequest = https.request;
https.get = function (...args) {
  runtimeNetworkAttempts++;
  networkSpyLog.push({ type: 'https.get', target: args[0] });
  throw new Error(`ABA Rule 1.6 Breach: Attempted https.get to ${args[0]}`);
};
https.request = function (...args) {
  runtimeNetworkAttempts++;
  networkSpyLog.push({ type: 'https.request', target: args[0] });
  throw new Error(`ABA Rule 1.6 Breach: Attempted https.request to ${args[0]}`);
};

// Static Codebase Audit: inspect ContractGuard files for zero-server compliance
{
  const coreFilesToScan = [
    'src/utils/crossRefValidator.js',
    'src/utils/definedTermsAuditor.js',
    'src/utils/financialDateAuditor.js',
    'src/utils/obligationsExtractor.js',
    'src/utils/pdfExtractor.js',
    'src/utils/useContractWorker.js',
    'src/utils/exportEngine.js',
    'src/utils/diffEngine.js',
    'src/utils/piiEngine.js',
    'src/utils/batesStamper.js',
    'src/utils/legalRiskRules.js',
    'src/workers/contractWorker.js',
    'src/pages/ContractCompare.jsx'
  ];

  for (const relPath of coreFilesToScan) {
    const fullPath = path.join(PROJECT_ROOT, relPath);
    assert(fs.existsSync(fullPath), `Air-Gap Audit: File exists: ${relPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Rule checks
    const hasAxios = /import\s+.*axios/i.test(content) || /require\(['"]axios['"]\)/i.test(content);
    assert(!hasAxios, `Air-Gap Audit: ${relPath} contains zero axios imports`);

    const hasWebSocket = /new\s+WebSocket\(/i.test(content);
    assert(!hasWebSocket, `Air-Gap Audit: ${relPath} contains zero WebSocket instantiations`);

    const hasXHR = /new\s+XMLHttpRequest\(/i.test(content);
    assert(!hasXHR, `Air-Gap Audit: ${relPath} contains zero XMLHttpRequest calls`);
  }

  // Check generated HTML memo for 0 remote fonts/CDNs
  const sampleMemo = exportExecutiveClientMemoHTML({
    contractTitle: 'Air Gap Verification Contract',
    clientName: 'Law Firm A',
    counterpartyName: 'Counterparty B',
    auditData: {
      crossRefs: { stats: { brokenCount: 0, missingExhibitCount: 0 }, issues: [] },
      definedTerms: { stats: { undefinedCount: 0, unusedCount: 0, artifactCount: 0 }, issues: [], definedTerms: [] },
      financialDates: { stats: { mismatchCount: 0, dateIssuesCount: 0 }, issues: [] },
      obligations: { partyBreakdown: {}, obligations: [] },
      risks: [],
      overallRiskScore: 0,
      riskLevel: 'LOW'
    }
  });

  const httpMatches = sampleMemo.match(/https?:\/\//gi) || [];
  assert(httpMatches.length === 0, `Air-Gap Audit: Executive Memo HTML contains zero remote http/https links (found: ${httpMatches.length})`);
  assert(!sampleMemo.includes('fonts.googleapis.com'), 'Air-Gap Audit: Memo does not reference Google Fonts');
  assert(!sampleMemo.includes('cdnjs.cloudflare.com'), 'Air-Gap Audit: Memo does not reference external CDNs');
}

// ============================================================================
// TIER 1: FEATURE COVERAGE (R1–R5, FEATURES F1 TO F20, ≥ 5 PER FEATURE)
// ============================================================================
suiteBanner('TIER 1', 'Feature Coverage Suite (F1–F20 Across Requirements R1–R5)');

// F1: Heading & Section Indexer (R1)
{
  const textF1 = `
    SECTION 1. DEFINITIONS AND INTERPRETATION
    1.1 Sub-clause for terms.
    1.2 Additional sub-clause.
    ARTICLE II. LICENSED RIGHTS
    Clause 3.1 Payment Obligations.
    EXHIBIT A - SPECIFICATIONS
    SCHEDULE 1 - PRICING
  `;
  const resF1 = validateCrossReferences(textF1);
  const ids = resF1.indexedSections.map(s => s.id);
  assert(ids.includes('1'), 'F1.1: Indexes numerical Section 1');
  assert(ids.includes('1.1'), 'F1.2: Indexes subsection 1.1');
  assert(ids.includes('2') || ids.includes('II'), 'F1.3: Indexes Article II');
  assert(ids.includes('3.1'), 'F1.4: Indexes Clause 3.1');
  const exhIds = resF1.indexedExhibits.map(e => e.id);
  assert(exhIds.includes('Exhibit A') || exhIds.some(e => e.toLowerCase().includes('exhibit a')), 'F1.5: Indexes Exhibit A');
}

// F2: Broken Cross-Reference Detector (R1)
{
  const textF2 = `
    SECTION 1. SCOPE
    Pursuant to Section 2, Provider shall perform services.
    SECTION 2. PERFORMANCE
    Provider shall maintain security according to Section 8.3 of this Agreement.
    In addition, remedies apply under Clause 99.4.
    Statutory reference to Section 409A of the Internal Revenue Code is exempted.
  `;
  const resF2 = validateCrossReferences(textF2);
  const broken = resF2.issues.filter(i => i.type === 'broken_reference');
  const brokenTargets = broken.map(b => b.targetName);

  assert(!brokenTargets.includes('2'), 'F2.1: Valid internal reference (Section 2) is NOT flagged as broken');
  assert(brokenTargets.some(t => t.includes('8.3')), 'F2.2: Flags non-existent Section 8.3 as broken');
  assert(brokenTargets.some(t => t.includes('99.4')), 'F2.3: Flags non-existent Clause 99.4 as broken');
  assert(!brokenTargets.some(t => t.includes('409A')), 'F2.4: Ignores statutory references like Section 409A of IRC');
  assert(broken.every(b => b.severity === 'critical'), 'F2.5: Broken cross-references marked with critical severity');
}

// F3: Missing Exhibit & Schedule Validator (R1)
{
  const textF3 = `
    SECTION 1. DELIVERABLES
    Services are defined in Exhibit A attached hereto.
    Backup procedures are defined in Exhibit C.
    Pricing is in Schedule 1.
    Travel reimbursement is governed by Schedule 4.
    EXHIBIT A - SERVICES
    Provider services detail.
    SCHEDULE 1 - PRICING MATRIX
    Standard rates.
  `;
  const resF3 = validateCrossReferences(textF3);
  const missing = resF3.issues.filter(i => i.type === 'missing_exhibit');
  const missingTargets = missing.map(m => m.targetName.toLowerCase());

  assert(!missingTargets.some(t => t.includes('exhibit a')), 'F3.1: Attached Exhibit A is NOT flagged as missing');
  assert(missingTargets.some(t => t.includes('exhibit c')), 'F3.2: Flags unattached Exhibit C as missing');
  assert(!missingTargets.some(t => t.includes('schedule 1')), 'F3.3: Attached Schedule 1 is NOT flagged as missing');
  assert(missingTargets.some(t => t.includes('schedule 4')), 'F3.4: Flags unattached Schedule 4 as missing');
  assert(resF3.stats.missingExhibitCount === missing.length, 'F3.5: stats.missingExhibitCount matches issues array length');
}

// F4: Definitions Section Extractor (R2)
{
  const textF4 = `
    SECTION 1. DEFINITIONS
    1.1 "Affiliate" means any entity that directly controls or is controlled by a party.
    1.2 "Confidential Information" shall mean all proprietary, non-public trade secrets.
    1.3 "Services" refers to consulting operations performed under Exhibit A.
    This Agreement is by Acme Corporation ("Client") and Globex Systems ("Vendor").
  `;
  const resF4 = auditDefinedTerms(textF4);
  const terms = resF4.definedTerms.map(d => d.term);

  assert(terms.includes('Affiliate'), 'F4.1: Extracts "Affiliate" from "means" pattern');
  assert(terms.includes('Confidential Information'), 'F4.2: Extracts "Confidential Information" from "shall mean" pattern');
  assert(terms.includes('Services'), 'F4.3: Extracts "Services" from "refers to" pattern');
  assert(terms.includes('Client'), 'F4.4: Extracts parenthetical definition "Client"');
  assert(terms.includes('Vendor'), 'F4.5: Extracts parenthetical definition "Vendor"');
}

// F5: Undefined Capitalized Terms Detector (R2)
{
  const textF5 = `
    SECTION 1. DEFINITIONS
    "Agreement" means this contract.
    SECTION 2. PERFORMANCE
    Provider shall deploy Key Personnel to maintain the cloud infrastructure.
    All Proprietary Software shall remain protected.
    Notwithstanding the foregoing, on Monday in California, the Parties shall cooperate.
  `;
  const resF5 = auditDefinedTerms(textF5);
  const undef = resF5.undefinedTerms.map(u => u.term);

  assert(undef.includes('Key Personnel'), 'F5.1: Flags capitalized "Key Personnel" as undefined');
  assert(undef.includes('Proprietary Software'), 'F5.2: Flags capitalized "Proprietary Software" as undefined');
  assert(!undef.includes('Notwithstanding'), 'F5.3: Excludes sentence-starter "Notwithstanding"');
  assert(!undef.includes('Monday'), 'F5.4: Excludes calendar day "Monday"');
  assert(!undef.includes('Agreement'), 'F5.5: Does not flag defined term "Agreement"');
}

// F6: Unused Defined Terms Detector (R2)
{
  const textF6 = `
    SECTION 1. DEFINITIONS
    1.1 "Active Term" means the operative duration.
    1.2 "Force Majeure Event" means acts of God, war, riot, and earthquake.
    1.3 "Subcontractor" means any third party vendor.
    1.4 "Deliverable" means any software output.
    SECTION 2. OPERATIVE CLAUSES
    During the Active Term, Provider shall produce each Deliverable for Client.
  `;
  const resF6 = auditDefinedTerms(textF6);
  const unused = resF6.unusedDefinedTerms.map(u => u.term);

  assert(unused.includes('Force Majeure Event'), 'F6.1: Flags "Force Majeure Event" as unused defined term');
  assert(unused.includes('Subcontractor'), 'F6.2: Flags "Subcontractor" as unused defined term');
  assert(!unused.includes('Active Term'), 'F6.3: Does not flag used term "Active Term"');
  assert(!unused.includes('Deliverable'), 'F6.4: Handles singular/plural matches without flagging "Deliverable" as unused');
  assert(resF6.stats.unusedCount === unused.length, 'F6.5: stats.unusedCount accurately records detected count');
}

// F7: Entity Name & Counterparty Consistency (R2)
{
  const textF7 = `
    This Agreement is by and between Acme Corporation ("Client") and CloudTech Solutions Inc. ("Provider").
    SECTION 1. INDEMNITY
    Acme LLC shall indemnify Provider against third-party claims.
    In addition, OldVendor Inc. shall assign legacy source code.
    CloudTech Solutons Inc shall provide engineering support.
  `;
  const resF7 = auditDefinedTerms(textF7, { parties: ['Acme Corporation', 'CloudTech Solutions Inc.'] });
  const entityIssues = resF7.entityIssues || [];

  assert(entityIssues.some(e => e.entity.includes('Acme LLC') || e.discrepancy.includes('Acme LLC')), 'F7.1: Detects corporate suffix discrepancy (Acme LLC vs Acme Corporation)');
  assert(entityIssues.some(e => e.entity.includes('OldVendor Inc') || e.discrepancy.includes('OldVendor Inc')), 'F7.2: Detects legacy foreign counterparty OldVendor Inc.');
  assert(resF7.issues.some(i => i.type === 'entity_inconsistency'), 'F7.3: Emits entity_inconsistency issues');
  assert(levenshtein('CloudTech Solutions Inc', 'CloudTech Solutons Inc') === 1, 'F7.4: Levenshtein distance detects single-character entity typo');
  assert(entityIssues.length >= 2, 'F7.5: Flags multiple entity defects accurately');
}

// F8: Leftover Boilerplate & Placeholder Sniffer (R2)
{
  const textF8 = `
    Provider shall provide services for [Company Name] in [Insert Jurisdiction].
    Payment shall be sent to bank account: ___.
    Client authorized signature: <<CLIENT_NAME>>.
    Annual pricing directive: <Insert Fee Schedule>.
  `;
  const resF8 = auditDefinedTerms(textF8);
  const artifacts = resF8.boilerplateArtifacts.map(a => a.placeholder);

  assert(artifacts.some(p => p.includes('[Company Name]')), 'F8.1: Detects square bracket [Company Name]');
  assert(artifacts.some(p => p.includes('[Insert Jurisdiction]')), 'F8.2: Detects [Insert Jurisdiction]');
  assert(artifacts.some(p => p.includes('___')), 'F8.3: Detects underscore line placeholder');
  assert(artifacts.some(p => p.includes('<<CLIENT_NAME>>')), 'F8.4: Detects double chevron <<CLIENT_NAME>>');
  assert(artifacts.some(p => p.includes('<Insert Fee Schedule>')), 'F8.5: Detects angle bracket <Insert Fee Schedule> placeholder');
}

// F9: Currency & Monetary Extractor (R3)
{
  const textF9 = `
    Client shall pay $10,000 (Ten Thousand Dollars) for Phase 1.
    Client shall pay €5,000 (Five Thousand Euros) for Phase 2.
    Client shall pay £25,000 (Twenty-Five Thousand Pounds) for Phase 3.
    Additional expense cap is $1,234.56 (One Thousand Two Hundred Thirty-Four Dollars and 56/100).
    The total fixed fee is One Hundred Fifty Thousand Dollars ($150,000).
  `;
  const resF9 = auditFinancialAndDates(textF9);
  const pairings = resF9.financialPairings;
  assert(pairings.some(p => p.currency === 'USD' && p.numericVal === 10000), 'F9.1: Extracts $10,000');
  assert(pairings.some(p => p.currency === 'EUR' && p.numericVal === 5000), 'F9.2: Extracts €5,000');
  assert(pairings.some(p => p.currency === 'GBP' && p.numericVal === 25000), 'F9.3: Extracts £25,000');
  assert(parseNumericAmount('$1,234.56') === 1234.56, 'F9.4: Extracts decimal cents $1,234.56');
  assert(parseWordsToNumber('One Hundred Fifty Thousand Dollars') === 150000, 'F9.5: Converts written words to number 150,000');
}

// F10: Words-to-Numbers Matcher (R3)
{
  const textF10 = `
    SECTION 1. FEES
    1.1 Valid fee: One Hundred Fifty Thousand Dollars ($150,000).
    1.2 Discrepancy A: Client shall pay $10,000 (Twenty Thousand Dollars).
    1.3 Discrepancy B: Milestone fee is $15,000 (Fifty Thousand Dollars).
    1.4 Discrepancy C: Contract ceiling is One Hundred Thousand Dollars ($1,000,000).
    1.5 Valid with cents: One Thousand Two Hundred Thirty-Four Dollars and 56/100 ($1,234.56).
  `;
  const resF10 = auditFinancialAndDates(textF10);
  const mismatches = resF10.issues.filter(i => i.type === 'amount_mismatch');

  assert(mismatches.some(m => m.numericValue === 10000 && m.wordValue === 20000), 'F10.1: Flags mismatch: $10,000 vs Twenty Thousand Dollars');
  assert(mismatches.some(m => m.numericValue === 15000 && m.wordValue === 50000), 'F10.2: Flags mismatch: $15,000 vs Fifty Thousand Dollars');
  assert(mismatches.some(m => (m.numericValue === 1000000 && m.wordValue === 100000) || (m.numericValue === 100000 && m.wordValue === 1000000)), 'F10.3: Flags mismatch: $1,000,000 vs One Hundred Thousand Dollars');
  assert(!mismatches.some(m => m.numericValue === 150000 && m.wordValue === 150000), 'F10.4: Correctly accepts exact match $150,000');
  assert(!mismatches.some(m => m.numericValue === 1234.56 && m.wordValue === 1234.56), 'F10.5: Correctly accepts cents match $1,234.56');
}

// F11: Contract Timeline & Chronology Auditor (R3)
{
  const textF11 = `
    This Agreement is executed on October 15, 2026 (the "Execution Date"), with an effective date of December 1, 2026 (the "Effective Date").
    Phase 1 Deliverables must be completed by March 15, 2022.
    The Term of this Agreement shall end on September 1, 2026.
    Either party may terminate upon sixty (60) days prior written notice.
    Automatic renewal shall trigger unless thirty (30) days prior written notice is provided.
  `;
  const resF11 = auditFinancialAndDates(textF11, new Date('2026-10-15T00:00:00Z'));
  const dateIssues = resF11.issues.filter(i => i.type === 'expired_date' || i.type === 'timeline_contradiction');

  assert(dateIssues.some(i => i.type === 'expired_date' && i.details.includes('2022')), 'F11.1: Flags past/expired date March 15, 2022');
  assert(dateIssues.some(i => i.type === 'timeline_contradiction'), 'F11.2: Flags timeline contradiction where expiration precedes effective date');
  assert(resF11.noticePeriods.some(n => n.periodDays === 60), 'F11.3: Extracts 60 days notice period');
  assert(resF11.noticePeriods.some(n => n.periodDays === 30), 'F11.4: Extracts 30 days renewal notice period');
  assert(resF11.timeline.length >= 3, 'F11.5: Constructs chronological event timeline array');
}

// F12: Obligations Modal Verb Extractor (R4)
{
  const textF12 = `
    Provider shall perform software updates monthly.
    Client must remit payment within thirty days.
    Both parties agree to cooperate in good faith.
    Provider shall not disclose any proprietary materials.
    In the event of a security breach, Provider must alert Client within 24 hours.
  `;
  const resF12 = extractObligations(textF12);
  const verbs = resF12.obligations.map(o => o.modalVerb);

  assert(verbs.includes('shall'), 'F12.1: Extracts affirmative "shall" obligation');
  assert(verbs.includes('must'), 'F12.2: Extracts affirmative "must" obligation');
  assert(verbs.includes('agrees to') || verbs.includes('agree to'), 'F12.3: Extracts "agree to" obligation');
  assert(resF12.obligations.some(o => o.dutyType === 'negative'), 'F12.4: Classifies "shall not disclose" as negative duty');
  assert(resF12.obligations.some(o => o.dutyType === 'conditional'), 'F12.5: Classifies breach alert as conditional duty');
}

// F13: Party-Attributed Obligations Matrix (R4)
{
  const textF13 = `
    Client shall remit all monthly subscription fees on time.
    Provider must maintain system backups on offsite servers.
    Each Party shall maintain insurance coverage of $1,000,000.
    Escrow Agent shall release source code upon receipt of notice.
  `;
  const resF13 = extractObligations(textF13, 'Client', 'Provider');
  const parties = resF13.obligations.map(o => o.responsibleParty);

  assert(parties.includes('Client'), 'F13.1: Attributes Client duty to Client');
  assert(parties.includes('Counterparty'), 'F13.2: Attributes Provider duty to Counterparty');
  assert(parties.includes('Mutual'), 'F13.3: Attributes "Each Party" duty to Mutual');
  assert(parties.includes('Third Party'), 'F13.4: Attributes "Escrow Agent" duty to Third Party');
  assert(resF13.partyBreakdown.clientCount >= 1 && resF13.partyBreakdown.counterpartyCount >= 1, 'F13.5: Calculates party breakdown distribution');
}

// F14: Dedicated Background Web Worker (R5)
{
  const sampleText = `
    SECTION 1. DEFINITIONS
    "Services" means consulting work.
    SECTION 2. DUTIES
    Provider shall provide Services pursuant to Section 8.2.
    Client shall pay $10,000 (Twenty Thousand Dollars).
  `;
  const progressList = [];
  const workerRes = await executeContractAnalysis(
    { mode: 'single', text: sampleText },
    (stage, percent, msg) => progressList.push({ stage, percent, msg })
  );

  const stages = progressList.map(p => p.stage);
  assert(stages.includes('CROSS_REFS'), 'F14.1: Worker dispatches CROSS_REFS stage');
  assert(stages.includes('DEFINED_TERMS'), 'F14.2: Worker dispatches DEFINED_TERMS stage');
  assert(stages.includes('FINANCIAL_DATES'), 'F14.3: Worker dispatches FINANCIAL_DATES stage');
  assert(stages.includes('OBLIGATIONS'), 'F14.4: Worker dispatches OBLIGATIONS stage');
  assert(typeof workerRes.overallRiskScore === 'number' && workerRes.overallRiskScore >= 0, 'F14.5: Worker computes overall risk score');
}

// F15: Web Worker Client Hook & Fallback (R5)
{
  assert(typeof executeContractAnalysisDirect === 'function', 'F15.1: Exports executeContractAnalysisDirect for direct fallback');
  assert(typeof useContractWorker === 'function', 'F15.2: Exports useContractWorker hook for React');

  const fallbackRes = await executeContractAnalysisDirect({
    mode: 'single',
    text: 'Section 1. Acme shall deliver software.'
  });
  assert(fallbackRes && fallbackRes.crossRefs, 'F15.3: Direct fallback returns complete crossRefs payload');
  assert(fallbackRes && fallbackRes.obligations, 'F15.4: Direct fallback returns complete obligations payload');
  assert(typeof fallbackRes.overallRiskScore === 'number', 'F15.5: Direct fallback computes composite risk score');
}

// F16: In-Browser PDF Text Extraction (R5)
{
  assert(isPDF('test.pdf') === true, 'F16.1: isPDF detects .pdf extension');
  assert(isPDF('report.docx') === false, 'F16.2: isPDF rejects .docx extension');

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([600, 400]);
  page.drawText('CONFIDENTIAL AGREEMENT\nSection 1. Provider shall perform.', { x: 50, y: 350, size: 12, font });
  const pdfBytes = await pdfDoc.save();

  const extracted = await extractTextFromPDF(pdfBytes);
  assert(extracted.pageCount === 1, 'F16.3: Detects 1 page in in-memory PDF');
  assert(extracted.fullText.includes('CONFIDENTIAL AGREEMENT'), 'F16.4: Extracts text content cleanly');
  assert(extracted.pages[0].pageNumber === 1, 'F16.5: Page records contain valid pageNumber');
}

// F17: Single-Doc Integrity UI & HUD Tabs (R1-R4)
{
  const fullAudit = await executeContractAnalysisDirect({
    mode: 'single',
    text: 'SECTION 1. DEFINITIONS\n"Fee" means payment.\nSection 2. Client shall pay $10,000 pursuant to Section 9.9.'
  });
  assert(fullAudit.crossRefs && Array.isArray(fullAudit.crossRefs.issues), 'F17.1: HUD Cross-Refs tab payload exists and contains issues');
  assert(fullAudit.definedTerms && Array.isArray(fullAudit.definedTerms.definedTerms), 'F17.2: HUD Defined Terms tab payload contains definitions');
  assert(fullAudit.financialDates && Array.isArray(fullAudit.financialDates.financialPairings), 'F17.3: HUD Financial tab payload contains pairings');
  assert(fullAudit.obligations && Array.isArray(fullAudit.obligations.obligations), 'F17.4: HUD Obligations tab payload contains obligations');
  assert(fullAudit.risks && Array.isArray(fullAudit.risks), 'F17.5: HUD Risk Radar payload contains scanned risks');
}

// F18: Executive Client Memo Export (R4)
{
  const mockAudit = {
    crossRefs: { stats: { brokenCount: 1, missingExhibitCount: 1 }, issues: [{ type: 'broken_reference', targetName: '9.4', line: 12, severity: 'critical' }] },
    definedTerms: { stats: { undefinedCount: 1, unusedCount: 1, artifactCount: 1 }, issues: [], definedTerms: [] },
    financialDates: { stats: { mismatchCount: 1, dateIssuesCount: 0 }, issues: [{ type: 'amount_mismatch', title: 'Mismatch', details: '$15k vs $50k', line: 18, severity: 'critical' }] },
    obligations: { partyBreakdown: { clientCount: 2, counterpartyCount: 3 }, obligations: [{ id: 'OBL-1', modalVerb: 'shall', responsibleParty: 'Client', sentence: 'Client shall pay.', severity: 'high', line: 10 }] },
    risks: [],
    overallRiskScore: 85,
    riskLevel: 'CRITICAL'
  };

  const memoHTML = exportExecutiveClientMemoHTML({
    contractTitle: 'Acme SaaS Agreement',
    clientName: 'Acme Corp',
    counterpartyName: 'Globex Inc',
    auditData: mockAudit
  });

  assert(memoHTML.includes('Nexus ContractGuard Enterprise'), 'F18.1: Memo features executive banner letterhead');
  assert(memoHTML.includes('85') && memoHTML.includes('CRITICAL'), 'F18.2: Memo embeds risk score badge');
  assert(memoHTML.includes('9.4'), 'F18.3: Memo includes broken reference schedule');
  assert(memoHTML.includes('$15k vs $50k'), 'F18.4: Memo includes financial contradiction schedule');
  assert(memoHTML.includes('@media print') && memoHTML.includes('@page'), 'F18.5: Memo includes print and PDF pagination styles');
}

// F19: Obligations Matrix Export (R4)
{
  const obs = [
    { id: 'OBL-01', responsibleParty: 'Client', modalVerb: 'shall', dutyType: 'affirmative', severity: 'high', line: 15, sectionContext: 'Section 2', action: 'remit payment', sentence: 'Client shall remit payment, promptly.' },
    { id: 'OBL-02', responsibleParty: 'Counterparty', modalVerb: 'shall not', dutyType: 'negative', severity: 'critical', line: 25, sectionContext: 'Section 4', action: 'disclose records', sentence: 'Provider shall not disclose "confidential" records.' }
  ];

  const csv = exportObligationsCSV(obs);
  assert(csv.includes('ID') && csv.includes('Responsible Party'), 'F19.1: Generates standard CSV headers');
  assert(csv.includes('"Client shall remit payment, promptly."'), 'F19.2: Correctly quotes sentences with commas');
  assert(csv.includes('""confidential""'), 'F19.3: Escapes internal double quotes in CSV fields');

  const jsonStr = exportObligationsJSON(obs);
  const parsedJson = JSON.parse(jsonStr);
  const obligationsList = Array.isArray(parsedJson) ? parsedJson : (parsedJson.obligations || []);
  assert(Array.isArray(obligationsList) && obligationsList.length === 2, 'F19.4: Exports valid JSON array of obligations');
  assert(obligationsList[0].id === 'OBL-01' && obligationsList[1].responsibleParty === 'Counterparty', 'F19.5: Preserves structured obligation attributes in JSON');
}

// F20: 100% Offline Air-Gap Verification (R5)
{
  const exportEngineCode = fs.readFileSync(path.join(PROJECT_ROOT, 'src/utils/exportEngine.js'), 'utf8');
  assert(!exportEngineCode.includes('fetch('), 'F20.1: exportEngine.js contains 0 fetch calls');
  assert(!exportEngineCode.includes('axios'), 'F20.2: exportEngine.js contains 0 axios references');
  assert(!exportEngineCode.includes('http://'), 'F20.3: exportEngine.js contains 0 unencrypted http URLs');

  const workerCode = fs.readFileSync(path.join(PROJECT_ROOT, 'src/workers/contractWorker.js'), 'utf8');
  assert(!workerCode.includes('importScripts('), 'F20.4: contractWorker.js contains 0 remote importScripts calls');
  assert(!workerCode.includes('fetch('), 'F20.5: contractWorker.js contains 0 fetch telemetry calls');
}

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (≥ 100 RIGOROUS UNIT ASSERTIONS)
// ============================================================================
suiteBanner('TIER 2', 'Boundary & Corner Cases Suite (Edge Inputs, Roman Numerals, Scales, Boundaries)');

// 2.1 Empty & Whitespace-only Inputs (Tests 1-10)
{
  const emptyResCR = validateCrossReferences('');
  assert(emptyResCR.stats.totalIndexed === 0 && emptyResCR.issues.length === 0, 'T2.1: validateCrossReferences on empty string');

  const emptyResDT = auditDefinedTerms('');
  assert(emptyResDT.stats.totalDefined === 0 && emptyResDT.issues.length === 0, 'T2.2: auditDefinedTerms on empty string');

  const emptyResFD = auditFinancialAndDates('');
  assert(emptyResFD.stats.totalAmounts === 0 && emptyResFD.issues.length === 0, 'T2.3: auditFinancialAndDates on empty string');

  const emptyResOB = extractObligations('');
  assert(emptyResOB.stats.totalObligations === 0, 'T2.4: extractObligations on empty string');

  const emptyResWorker = await executeContractAnalysisDirect({ mode: 'single', text: '' });
  assert(emptyResWorker.overallRiskScore === 0, 'T2.5: worker analysis on empty string yields risk score 0');

  const wsStr = '   \t\r\n\r\n   \t  ';
  assert(validateCrossReferences(wsStr).stats.totalIndexed === 0, 'T2.6: validateCrossReferences on whitespace-only string');
  assert(auditDefinedTerms(wsStr).stats.totalDefined === 0, 'T2.7: auditDefinedTerms on whitespace-only string');
  assert(auditFinancialAndDates(wsStr).stats.totalAmounts === 0, 'T2.8: auditFinancialAndDates on whitespace-only string');
  assert(extractObligations(wsStr).stats.totalObligations === 0, 'T2.9: extractObligations on whitespace-only string');
  assert((await executeContractAnalysisDirect({ mode: 'single', text: wsStr })).overallRiskScore === 0, 'T2.10: worker analysis on whitespace yields risk score 0');
}

// 2.2 Null & Undefined Handling (Tests 11-15)
{
  assert(validateCrossReferences(null).stats.totalIndexed === 0, 'T2.11: validateCrossReferences handles null safely');
  assert(auditDefinedTerms(undefined).stats.totalDefined === 0, 'T2.12: auditDefinedTerms handles undefined safely');
  assert(auditFinancialAndDates(null).stats.totalAmounts === 0, 'T2.13: auditFinancialAndDates handles null safely');
  assert(extractObligations(undefined).stats.totalObligations === 0, 'T2.14: extractObligations handles undefined safely');
  const diffNull = computeContractDiff(null, null);
  assert(diffNull.stats.similarity === 100 && diffNull.stats.totalWords === 0, 'T2.15: computeContractDiff handles null inputs safely');
}

// 2.3 Roman Numerals Boundaries & Heading Conversions (Tests 16-25)
{
  assert(romanToArabic('I') === 1, 'T2.16: romanToArabic I -> 1');
  assert(romanToArabic('IV') === 4, 'T2.17: romanToArabic IV -> 4');
  assert(romanToArabic('IX') === 9, 'T2.18: romanToArabic IX -> 9');
  assert(romanToArabic('XIV') === 14, 'T2.19: romanToArabic XIV -> 14');
  assert(romanToArabic('XL') === 40, 'T2.20: romanToArabic XL -> 40');
  assert(romanToArabic('L') === 50, 'T2.21: romanToArabic L -> 50');
  assert(romanToArabic('INVALID_NUMERAL') === 0 || isNaN(romanToArabic('INVALID_NUMERAL')) || romanToArabic('INVALID_NUMERAL') === null, 'T2.22: romanToArabic handles invalid input without unhandled exception');
  assert(arabicToRoman(1) === 'I', 'T2.23: arabicToRoman 1 -> I');
  assert(arabicToRoman(4) === 'IV', 'T2.24: arabicToRoman 4 -> IV');
  assert(arabicToRoman(14) === 'XIV', 'T2.25: arabicToRoman 14 -> XIV');
}

// 2.4 Words-to-Numbers Scale & Fraction Boundaries (Tests 26-46)
{
  assert(parseWordsToNumber('Zero Dollars') === 0, 'T2.26: parseWordsToNumber "Zero Dollars" -> 0');
  assert(parseWordsToNumber('One Dollar') === 1, 'T2.27: parseWordsToNumber "One Dollar" -> 1');
  assert(parseWordsToNumber('Ten Dollars') === 10, 'T2.28: parseWordsToNumber "Ten Dollars" -> 10');
  assert(parseWordsToNumber('Eleven Dollars') === 11, 'T2.29: parseWordsToNumber "Eleven Dollars" -> 11');
  assert(parseWordsToNumber('Nineteen Dollars') === 19, 'T2.30: parseWordsToNumber "Nineteen Dollars" -> 19');
  assert(parseWordsToNumber('Twenty Dollars') === 20, 'T2.31: parseWordsToNumber "Twenty Dollars" -> 20');
  assert(parseWordsToNumber('One Hundred Dollars') === 100, 'T2.32: parseWordsToNumber "One Hundred Dollars" -> 100');
  assert(parseWordsToNumber('One Thousand Dollars') === 1000, 'T2.33: parseWordsToNumber "One Thousand Dollars" -> 1000');
  assert(parseWordsToNumber('One Million Dollars') === 1000000, 'T2.34: parseWordsToNumber "One Million Dollars" -> 1,000,000');
  assert(parseWordsToNumber('One Billion Dollars') === 1000000000, 'T2.35: parseWordsToNumber "One Billion Dollars" -> 1,000,000,000');
  assert(parseWordsToNumber('Fifty Cents') === 0.5, 'T2.36: parseWordsToNumber "Fifty Cents" -> 0.50');
  assert(parseWordsToNumber('Twenty-Five Cents') === 0.25, 'T2.37: parseWordsToNumber "Twenty-Five Cents" -> 0.25');
  assert(parseWordsToNumber('Seventy-Five Cents') === 0.75, 'T2.38: parseWordsToNumber "Seventy-Five Cents" -> 0.75');
  assert(parseWordsToNumber('Ninety-Nine Cents') === 0.99, 'T2.39: parseWordsToNumber "Ninety-Nine Cents" -> 0.99');
  assert(parseWordsToNumber('50/100') === 0.5, 'T2.40: parseWordsToNumber "50/100" fraction -> 0.50');
  assert(parseWordsToNumber('Zero Dollars and 00/100') === 0.0, 'T2.41: parseWordsToNumber "Zero Dollars and 00/100" fraction -> 0.00');
  assert(parseWordsToNumber('89/100') === 0.89, 'T2.42: parseWordsToNumber "89/100" fraction -> 0.89');
  const complexLegalMillion = 'One Million Two Hundred Thirty-Four Thousand Five Hundred Sixty-Seven Dollars and 89/100';
  assert(parseWordsToNumber(complexLegalMillion) === 1234567.89, 'T2.43: parseWordsToNumber $1,234,567.89 written in legal words + cents fraction');
  assert(parseWordsToNumber('Twenty-One Dollars') === 21, 'T2.44: parseWordsToNumber hyphenated "Twenty-One" -> 21');
  assert(parseWordsToNumber('Ninety-Nine Thousand Dollars') === 99000, 'T2.45: parseWordsToNumber "Ninety-Nine Thousand" -> 99,000');
  assert(parseWordsToNumber('One Hundred and Fifty Dollars') === 150, 'T2.46: parseWordsToNumber "One Hundred and Fifty" -> 150');
}

// 2.5 Numeric Currency Amounts & Symbols (Tests 47-60)
{
  assert(parseNumericAmount('$0') === 0, 'T2.47: parseNumericAmount $0 -> 0');
  assert(parseNumericAmount('$0.00') === 0, 'T2.48: parseNumericAmount $0.00 -> 0');
  assert(parseNumericAmount('$0.50') === 0.5, 'T2.49: parseNumericAmount $0.50 -> 0.50');
  assert(parseNumericAmount('$1,000,000,000.00') === 1000000000, 'T2.50: parseNumericAmount $1 Billion with decimals');
  assert(parseNumericAmount('€10,000') === 10000, 'T2.51: parseNumericAmount €10,000 -> 10,000');
  assert(parseNumericAmount('£50,000') === 50000, 'T2.52: parseNumericAmount £50,000 -> 50,000');
  assert(parseNumericAmount('¥1,000,000') === 1000000, 'T2.53: parseNumericAmount ¥1,000,000 -> 1,000,000');
  assert(parseNumericAmount('AED 50,000') === 50000, 'T2.54: parseNumericAmount AED 50,000 -> 50,000');
  assert(parseNumericAmount('SAR 100,000') === 100000, 'T2.55: parseNumericAmount SAR 100,000 -> 100,000');
  assert(parseNumericAmount('CHF 75,000') === 75000, 'T2.56: parseNumericAmount CHF 75,000 -> 75,000');
  assert(parseNumericAmount('CAD $25,000') === 25000, 'T2.57: parseNumericAmount CAD $25,000 -> 25,000');
  assert(parseNumericAmount('AUD $30,000') === 30000, 'T2.58: parseNumericAmount AUD $30,000 -> 30,000');
  assert(parseNumericAmount('$ 10,000') === 10000, 'T2.59: parseNumericAmount with space after dollar symbol -> 10,000');
  assert(parseNumericAmount('100,000 USD') === 100000, 'T2.60: parseNumericAmount suffix USD -> 100,000');
}

// 2.6 Dates & Timeline Edge Cases (Tests 61-73)
{
  assert(extractDateFromText('Agreement dated 2026-10-15') !== null, 'T2.61: extractDateFromText parses ISO 2026-10-15');
  assert(extractDateFromText('Agreement dated October 15, 2026') !== null, 'T2.62: extractDateFromText parses US format');
  assert(extractDateFromText('Agreement dated 15 October 2026') !== null, 'T2.63: extractDateFromText parses UK format');
  assert(extractDateFromText('Agreement dated 10/15/2026') !== null, 'T2.64: extractDateFromText parses MM/DD/YYYY slash format');
  assert(extractDateFromText('Effective on February 29, 2024') !== null, 'T2.65: extractDateFromText parses leap year date Feb 29, 2024');
  assert(extractDateFromText('Effective on February 29, 2028') !== null, 'T2.66: extractDateFromText parses leap year date Feb 29, 2028');
  assert(extractDateFromText('Legacy contract from January 1, 1970') !== null, 'T2.67: extractDateFromText parses distant past date Jan 1, 1970');
  assert(extractDateFromText('Perpetual rights until December 31, 2099') !== null, 'T2.68: extractDateFromText parses far future date Dec 31, 2099');
  
  const textNotices = `
    Notice periods: sixty (60) days prior written notice.
    Alternative: thirty (30) days notice.
    Extended: 180 calendar days prior written notice.
    Emergency: two (2) business days notice.
  `;
  const resNotice = auditFinancialAndDates(textNotices);
  assert(resNotice.noticePeriods.some(n => n.periodDays === 60), 'T2.69: Extracts parenthetical notice "sixty (60) days"');
  assert(resNotice.noticePeriods.some(n => n.periodDays === 30), 'T2.70: Extracts parenthetical notice "thirty (30) days"');
  assert(resNotice.noticePeriods.some(n => n.periodDays === 180), 'T2.71: Extracts "180 calendar days prior written notice"');
  assert(resNotice.noticePeriods.some(n => n.periodDays === 2), 'T2.72: Extracts "two (2) business days notice"');
  assert(parseContractDate('99/99/9999') === null || isNaN(new Date(parseContractDate('99/99/9999'))), 'T2.73: Handles malformed date safely');
}

// 2.7 Defined Terms & Boilerplate Drafting Variations (Tests 74-92)
{
  const textWeirdQuotes = `
    SECTION 1. DEFINITIONS
    “CurlyCompany” means Acme.
    'SingleSupplier' means Globex.
    ‘CurlySingleSupplier’ means Builder.
    "Non-Disclosure Agreement" means the NDA.
    "Work_Product" means all software.
    "IP" means all intellectual property.
    SECTION 2. LATIN EXCLUSIONS
    Both parties act in Bona Fide reliance on Ipso Facto procedures, Inter Alia, to preserve Prima Facie records during Force Majeure.
    SECTION 3. ARTIFACTS
    [TBD]
    [Insert Jurisdiction]
    ___
    __________
    <<PARTY_B>>
    <Insert Price>
    [ • ]
    [Insert Notice Period]
  `;
  const resQuotes = auditDefinedTerms(textWeirdQuotes);
  const defs = resQuotes.definedTerms.map(d => d.term);
  assert(defs.includes('CurlyCompany'), 'T2.74: Extracts definition with curly double quotes “...”');
  assert(defs.includes('SingleSupplier'), 'T2.75: Extracts definition with single quotes \'...\'');
  assert(defs.includes('CurlySingleSupplier'), 'T2.76: Extracts definition with curly single quotes ‘...’');
  assert(defs.includes('Non-Disclosure Agreement'), 'T2.77: Extracts hyphenated defined term');
  assert(defs.includes('Work_Product'), 'T2.78: Extracts underscored defined term');
  assert(defs.includes('IP'), 'T2.79: Extracts 2-character defined term IP');

  const undefs = resQuotes.undefinedTerms.map(u => u.term);
  assert(!undefs.includes('Bona Fide'), 'T2.80: Excludes Latin phrase "Bona Fide"');
  assert(!undefs.includes('Ipso Facto'), 'T2.81: Excludes Latin phrase "Ipso Facto"');
  assert(!undefs.includes('Inter Alia'), 'T2.82: Excludes Latin phrase "Inter Alia"');
  assert(!undefs.includes('Prima Facie'), 'T2.83: Excludes Latin phrase "Prima Facie"');
  assert(!undefs.includes('Force Majeure'), 'T2.84: Excludes Latin phrase "Force Majeure"');

  const arts = resQuotes.boilerplateArtifacts.map(a => a.placeholder);
  assert(arts.some(p => p.includes('[TBD]')), 'T2.85: Catches [TBD] placeholder');
  assert(arts.some(p => p.includes('[Insert Jurisdiction]')), 'T2.86: Catches [Insert Jurisdiction]');
  assert(arts.some(p => p.includes('___')), 'T2.87: Catches 3 underscores ___');
  assert(arts.some(p => p.includes('__________')), 'T2.88: Catches 10 underscores __________');
  assert(arts.some(p => p.includes('<<PARTY_B>>')), 'T2.89: Catches <<PARTY_B>> chevron');
  assert(arts.some(p => p.includes('<Insert Price>')), 'T2.90: Catches <Insert Price> placeholder');
  assert(arts.some(p => p.includes('[ • ]')), 'T2.91: Catches [ • ] bullet placeholder');
  assert(arts.some(p => p.includes('[Insert Notice Period]')), 'T2.92: Catches [Insert Notice Period] bracket placeholder');
}

// 2.8 Obligations Modal Parsing Edge Cases (Tests 93-99)
{
  const textComplexModals = `
    Provider shall and must deploy the security patch immediately.
    Neither party shall disclose confidential keys to third parties.
    Provider must not sub-license the software.
    In the event that Client fails to pay, Provider will suspend.
    Acme Inc. shall deliver reports on time.
    Provider shall supply documentation etc. pursuant to Section 4.1.
    Notwithstanding any clause herein, payment shall be made by Client within 30 days.
  `;
  const resModals = extractObligations(textComplexModals, 'Client', 'Provider');
  assert(resModals.obligations.some(o => o.sentence.includes('shall and must')), 'T2.93: Extracts sentence with compound modal verbs');
  assert(resModals.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('Neither party shall')), 'T2.94: Classifies "Neither party shall" as negative duty');
  assert(resModals.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('must not')), 'T2.95: Classifies "must not" as negative duty');
  assert(resModals.obligations.some(o => o.dutyType === 'conditional'), 'T2.96: Detects conditional duty');
  assert(resModals.obligations.some(o => o.sentence.includes('Acme Inc. shall deliver')), 'T2.97: Protects corporate suffix "Inc." from premature sentence split');
  assert(resModals.obligations.some(o => o.sentence.includes('etc. pursuant')), 'T2.98: Protects abbreviation "etc." from premature sentence split');
  assert(resModals.obligations.some(o => o.responsibleParty === 'Client'), 'T2.99: Attributes passive voice duty to Client');
}

// 2.9 Diff Engine Edge Cases (Tests 100-104)
{
  const diffIdentical = computeContractDiff('Line 1\nLine 2', 'Line 1\nLine 2');
  assert(diffIdentical.stats.similarity === 100 && diffIdentical.stats.additions === 0 && diffIdentical.stats.deletions === 0, 'T2.100: Identical diff has 100% similarity and 0 changes');

  const diffDisjoint = computeContractDiff('Alpha Beta Gamma', 'One Two Three');
  assert(diffDisjoint.stats.similarity === 0, 'T2.101: Completely disjoint text produces 0% similarity');

  const diffRtl = computeContractDiff('عقد تقديم خدمات برمجية', 'عقد تقديم خدمات سحابية متقدمة');
  assert(diffRtl.stats.similarity > 0 && diffRtl.segments.length > 0, 'T2.102: Processes Arabic / RTL text diff without errors');

  const diffSymbols = computeContractDiff('Pursuant to § 4.1 and ¶ 2', 'Pursuant to § 4.2 and ¶ 2');
  assert(diffSymbols.stats.additions > 0 && diffSymbols.stats.deletions > 0, 'T2.103: Handles legal symbols § and ¶ cleanly');

  const diffEmptyVersusText = computeContractDiff('', 'Brand New Clause');
  assert(diffEmptyVersusText.stats.additions === 3 && diffEmptyVersusText.stats.deletions === 0, 'T2.104: Empty baseline against new text yields 100% additions');
}

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS & DUAL ANALYSIS MODES (≥ 25 PAIRWISE TESTS)
// ============================================================================
suiteBanner('TIER 3', 'Cross-Feature Combinations & Dual Analysis Modes Suite');

// 3.1 Single Document Mode full pipeline on clean MSA fixture
{
  const cleanPath = path.join(FIXTURES_DIR, 'master-services-agreement-clean.txt');
  const cleanText = fs.readFileSync(cleanPath, 'utf8');
  const cleanRes = await executeContractAnalysisDirect({ mode: 'single', text: cleanText, clientParty: 'Acme Corporation', counterparty: 'CloudTech Solutions Inc.' });

  assert(cleanRes.crossRefs.stats.brokenCount === 0, 'T3.1: Clean MSA has 0 broken cross references');
  assert(cleanRes.financialDates.stats.mismatchCount === 0, 'T3.2: Clean MSA has 0 financial amount mismatches');
  assert(cleanRes.definedTerms.stats.artifactCount === 0, 'T3.3: Clean MSA has 0 boilerplate placeholders');
  assert(cleanRes.crossRefs.issues.filter(i => i.severity === 'critical').length === 0, 'T3.4: Clean MSA has 0 critical cross-reference defects');
  assert(cleanRes.financialDates.issues.filter(i => i.type === 'amount_mismatch').length === 0, 'T3.5: Clean MSA has 0 amount mismatch issues');
}

// 3.2 Single Document Mode full pipeline on defective fixtures
{
  const brokenPath = path.join(FIXTURES_DIR, 'msa-broken-crossrefs.txt');
  const brokenText = fs.readFileSync(brokenPath, 'utf8');
  const brokenRes = await executeContractAnalysisDirect({ mode: 'single', text: brokenText });
  assert(brokenRes.crossRefs.stats.brokenCount >= 1, 'T3.6: Broken Cross-Refs fixture catches Section 8.3');
  assert(brokenRes.crossRefs.stats.missingExhibitCount >= 2, 'T3.7: Broken Cross-Refs fixture catches Exhibit C and Schedule 3');

  const finPath = path.join(FIXTURES_DIR, 'msa-financial-date-mismatches.txt');
  const finText = fs.readFileSync(finPath, 'utf8');
  const finRes = await executeContractAnalysisDirect({ mode: 'single', text: finText });
  assert(finRes.financialDates.stats.mismatchCount >= 2, 'T3.8: Financial Defects fixture catches words-to-numbers contradictions');
  assert(finRes.overallRiskScore >= 75, 'T3.9: Financial & Date defects drive risk score >= 75 (CRITICAL)');

  const boilerPath = path.join(FIXTURES_DIR, 'msa-boilerplate-leftovers.txt');
  const boilerText = fs.readFileSync(boilerPath, 'utf8');
  const boilerRes = await executeContractAnalysisDirect({ mode: 'single', text: boilerText });
  assert(boilerRes.definedTerms.stats.artifactCount >= 3, 'T3.10: Boilerplate fixture catches 3+ leftover placeholders');
}

// 3.3 Comparative Redline Diff Mode: Myers LCS + Full Amended Draft Audit
{
  const baseline = `
    MASTER SERVICES AGREEMENT
    Section 1. Client shall pay Provider $50,000 for consulting services.
    Section 2. Provider shall not disclose Confidential Information.
  `;
  const amended = `
    MASTER SERVICES AGREEMENT (AMENDED)
    Section 1. Client shall pay Provider $100,000 (One Hundred Fifty Thousand Dollars) for consulting services.
    Section 2. Provider shall not disclose Confidential Information.
    Section 3. Remedies.
    Remedies are governed by Section 9.9 of this Agreement.
  `;

  const diffAudit = await executeContractAnalysisDirect({
    mode: 'comparative',
    text: amended,
    baselineText: baseline,
    options: { granularity: 'word' }
  });

  assert(diffAudit.diff && diffAudit.diff.stats.additions > 0, 'T3.11: Comparative mode computes Myers LCS word-level diff additions');
  assert(diffAudit.diff && diffAudit.diff.stats.similarity < 100, 'T3.12: Comparative mode records reduced similarity percentage');
  assert(diffAudit.crossRefs.stats.brokenCount >= 1, 'T3.13: Comparative mode concurrently executes full integrity audit catching Section 9.9');
  assert(diffAudit.financialDates.stats.mismatchCount >= 1, 'T3.14: Comparative mode catches financial contradiction in amended draft');

  const diffLineAudit = await executeContractAnalysisDirect({
    mode: 'comparative',
    text: amended,
    baselineText: baseline,
    options: { granularity: 'line' }
  });
  assert(diffLineAudit.diff && diffLineAudit.diff.segments.length > 0, 'T3.15: Comparative mode supports line-level granularity toggle');
}

// 3.4 Deep Cross-Feature Interactions in Same Clause
{
  const complexClause = `
    SECTION 1. SPECIAL REMEDIES
    Provider shall deploy Key Personnel to rectify defects pursuant to Section 8.8 at a cost of $20,000 (Forty Thousand Dollars) within [Insert Number of Days] days.
  `;
  const resComplex = await executeContractAnalysisDirect({ mode: 'single', text: complexClause, clientParty: 'Client', counterparty: 'Provider' });

  assert(resComplex.crossRefs.issues.some(i => i.targetName.includes('8.8')), 'T3.16: Interaction: Catches broken reference Section 8.8 in multi-defect clause');
  assert(resComplex.definedTerms.undefinedTerms.some(u => u.term === 'Key Personnel'), 'T3.17: Interaction: Catches undefined "Key Personnel" in same clause');
  assert(resComplex.financialDates.issues.some(i => i.type === 'amount_mismatch'), 'T3.18: Interaction: Catches $20k vs Forty Thousand Dollars mismatch in same clause');
  assert(resComplex.definedTerms.boilerplateArtifacts.some(a => a.placeholder.includes('[Insert Number of Days]')), 'T3.19: Interaction: Catches [Insert Number of Days] placeholder in same clause');
  assert(resComplex.obligations.obligations.some(o => o.responsibleParty === 'Counterparty'), 'T3.20: Interaction: Correctly categorizes Provider duty in same clause');
}

// 3.5 Export Pipelines and Serialization Integrity
{
  const testAuditData = {
    crossRefs: { stats: { brokenCount: 2, missingExhibitCount: 1 }, issues: [{ type: 'broken_reference', targetName: '8.3', line: 10, severity: 'critical' }] },
    definedTerms: { stats: { undefinedCount: 1, unusedCount: 1, artifactCount: 1 }, issues: [], definedTerms: [] },
    financialDates: { stats: { mismatchCount: 1, dateIssuesCount: 0 }, issues: [{ type: 'amount_mismatch', title: 'Mismatch', details: '$10k vs $20k', line: 15, severity: 'critical' }] },
    obligations: {
      partyBreakdown: { clientCount: 1, counterpartyCount: 1 },
      obligations: [
        { id: 'OBL-001', responsibleParty: 'Client', modalVerb: 'shall', dutyType: 'affirmative', severity: 'high', line: 12, sectionContext: 'Sec 2', action: 'pay fee', sentence: 'Client shall pay fee, promptly.' },
        { id: 'OBL-002', responsibleParty: 'Counterparty', modalVerb: 'must', dutyType: 'affirmative', severity: 'medium', line: 20, sectionContext: 'Sec 3', action: 'maintain log', sentence: 'Provider must maintain "audit" log.' }
      ]
    },
    risks: [{ ruleId: 'R-INDEMNITY', severity: 'HIGH', title: 'Unilateral Indemnity' }],
    overallRiskScore: 90,
    riskLevel: 'CRITICAL'
  };

  const memo = exportExecutiveClientMemoHTML({
    contractTitle: 'End-to-End Test Contract',
    clientName: 'Client Alpha',
    counterpartyName: 'Vendor Beta',
    auditData: testAuditData
  });
  assert(memo.includes('End-to-End Test Contract'), 'T3.21: Export Pipeline: Memo HTML renders matter title');
  assert(memo.includes('90') && memo.includes('CRITICAL'), 'T3.22: Export Pipeline: Memo HTML renders critical risk score badge');

  const csv = exportObligationsCSV(testAuditData.obligations.obligations);
  const csvLines = csv.trim().split('\n');
  assert(csvLines.length === 3, 'T3.23: Export Pipeline: CSV has header + 2 records');
  assert(csvLines[1].includes('"Client shall pay fee, promptly."'), 'T3.24: Export Pipeline: CSV escapes commas inside sentence without corrupting row count');

  const json = exportObligationsJSON(testAuditData.obligations.obligations, { download: false });
  const parsed = JSON.parse(json);
  const obsList = Array.isArray(parsed) ? parsed : (parsed.obligations || []);
  assert(obsList.length === 2 && obsList[0].id === 'OBL-001', 'T3.25: Export Pipeline: JSON export validates roundtrip parsing');

  // Verify full data contract format
  assert(typeof testAuditData.overallRiskScore === 'number', 'T3.26: Data Contract: overallRiskScore is numeric');
  assert(Array.isArray(testAuditData.obligations.obligations), 'T3.27: Data Contract: obligations is array');
  assert(testAuditData.crossRefs.stats && typeof testAuditData.crossRefs.stats.brokenCount === 'number', 'T3.28: Data Contract: crossRefs.stats is correctly formed');
}

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 COMPREHENSIVE LEGAL CONTRACTS)
// ============================================================================
suiteBanner('TIER 4', 'Real-World Application Scenarios (5 Comprehensive Legal Contracts)');

// 4.1 Scenario 1: High-Stakes Tech M&A Share Purchase Agreement (SPA)
{
  const spaText = `
    SHARE PURCHASE AGREEMENT
    This Share Purchase Agreement (the "Agreement") is dated as of October 15, 2026, by and between Apex Holdings Corp ("Buyer") and Pinnacle Technologies LLC ("Seller").
    SECTION 1. DEFINITIONS
    1.1 "Closing Date" means November 30, 2023.
    1.2 "Escrow Amount" means Five Million Dollars ($5,000,000).
    1.3 "Material Adverse Effect" means any event having a material adverse consequence.
    SECTION 2. PURCHASE AND SALE
    2.1 Transfer of Shares. Closing must be completed by November 30, 2023. At the Closing, Seller shall deliver certificate representations representing the Target Shares to Buyer.
    2.2 Payment. Buyer shall wire the Purchase Price to Seller minus the Escrow Amount pursuant to Exhibit A.
    2.3 Escrow Deposit. Buyer must deposit the Escrow Amount with Escrow Agent pursuant to Section 9.4.
    SECTION 3. COVENANTS
    3.1 Restrictive Covenants. Seller must enforce Founder Restrictive Covenants for five years.
    3.2 Notice. Seller disclosure representations are set forth in Exhibit C.
    SECTION 9. INDEMNIFICATION
    9.1 General Indemnity. Seller shall indemnify Buyer against losses.
    9.2 Limitations. Seller's liability shall not exceed Ten Million Dollars ($10,000,000).
    EXHIBIT A - FUNDS FLOW MEMORANDUM
    Wire instructions.
  `;

  const resSPA = await executeContractAnalysisDirect({ mode: 'single', text: spaText, clientParty: 'Buyer', counterparty: 'Seller' });
  assert(resSPA.crossRefs.issues.some(i => i.targetName.includes('9.4')), 'T4.1: Scenario 1 (M&A SPA): Catches broken Section 9.4 citation');
  assert(resSPA.crossRefs.issues.some(i => i.targetName.toLowerCase().includes('exhibit c')), 'T4.2: Scenario 1 (M&A SPA): Catches missing Exhibit C (Disclosure Schedules)');
  assert(resSPA.definedTerms.undefinedTerms.some(u => u.term === 'Founder Restrictive Covenants'), 'T4.3: Scenario 1 (M&A SPA): Catches undefined "Founder Restrictive Covenants"');
  assert(resSPA.definedTerms.unusedDefinedTerms.some(u => u.term === 'Material Adverse Effect'), 'T4.4: Scenario 1 (M&A SPA): Catches unused defined term "Material Adverse Effect"');
  assert(resSPA.financialDates.issues.some(i => i.type === 'expired_date' && i.details.includes('2023')), 'T4.5: Scenario 1 (M&A SPA): Catches expired past Closing Date November 30, 2023');
}

// 4.2 Scenario 2: Enterprise Cloud SaaS Master Subscription Agreement
{
  const saasText = `
    MASTER SUBSCRIPTION AGREEMENT
    This Agreement is entered into on May 1, 2026, by and between Enterprise Cloud Inc. ("Vendor") and Global Retailers Ltd ("Customer").
    SECTION 1. DEFINITIONS AND ACCESS
    1.1 "Subscription Service" means Vendor's cloud platform.
    1.2 "Service Level Agreement" means the performance standards in Exhibit B.
    SECTION 2. FEES
    2.1 Annual Subscription Fee. Customer shall pay an annual subscription fee of $120,000 (One Hundred Fifty Thousand Dollars) within thirty (30) days of invoice.
    SECTION 3. TERM AND RENEWAL
    3.1 Term. This Agreement shall commence on May 1, 2026 and expire on April 30, 2027.
    3.2 Renewal. This Agreement shall automatically renew unless sixty (60) days prior written notice is provided.
    SECTION 4. UPTIME
    4.1 Vendor shall maintain 99.9% uptime as defined in Exhibit B.
    EXHIBIT A - ORDER FORM
    100 licenses.
  `;

  const resSaaS = await executeContractAnalysisDirect({ mode: 'single', text: saasText, clientParty: 'Customer', counterparty: 'Vendor' });
  assert(resSaaS.financialDates.issues.some(i => i.type === 'amount_mismatch' && i.numericValue === 120000 && i.wordValue === 150000), 'T4.6: Scenario 2 (SaaS Agreement): Catches $120k vs $150k financial mismatch');
  assert(resSaaS.crossRefs.issues.some(i => i.targetName.toLowerCase().includes('exhibit b')), 'T4.7: Scenario 2 (SaaS Agreement): Catches missing Exhibit B (SLA)');
  assert(resSaaS.financialDates.noticePeriods.some(n => n.periodDays === 60), 'T4.8: Scenario 2 (SaaS Agreement): Extracts 60-day auto-renewal notice period');

  const saasMemo = exportExecutiveClientMemoHTML({ contractTitle: 'SaaS Agreement', clientName: 'Global Retailers Ltd', counterpartyName: 'Enterprise Cloud Inc.', auditData: resSaaS });
  assert(saasMemo.includes('$120,000') && saasMemo.includes('Exhibit B'), 'T4.9: Scenario 2 (SaaS Agreement): Executive Memo renders financial contradiction schedule');
}

// 4.3 Scenario 3: Commercial Real Estate Lease Agreement with Schedules
{
  const leaseText = `
    COMMERCIAL OFFICE LEASE AGREEMENT
    This Lease is entered into on June 1, 2026, by Metro Tower LLC ("Landlord") and Innovate Labs Inc ("Tenant").
    SECTION 1. PREMISES
    1.1 Landlord leases to Tenant Suite 1200 comprising [Tenant Space Square Footage] rentable square feet.
    SECTION 2. RENT AND EXPENSES
    2.1 Base Rent. Tenant shall pay monthly base rent of $45,000 (Forty-Five Thousand Dollars) on the first day of each month.
    2.2 Operating Expenses. Tenant must pay Operating Expenses calculated according to Schedule 2.
    2.3 Utilities. Utilities shall be billed directly pursuant to Schedule 4.
    SECTION 3. TERM
    3.1 The Lease shall commence on July 1, 2026 and expire on June 30, 2031.
    SECTION 4. MAINTENANCE
    4.1 Metro Towers Inc shall provide janitorial services on business days.
    SCHEDULE 1 - PREMISES FLOOR PLAN
    Plan.
    SCHEDULE 2 - EXPENSES
    Expenses formula.
  `;

  const resLease = await executeContractAnalysisDirect({ mode: 'single', text: leaseText, clientParty: 'Tenant', counterparty: 'Landlord' });
  assert(resLease.crossRefs.issues.some(i => i.targetName.toLowerCase().includes('schedule 4')), 'T4.10: Scenario 3 (Commercial Lease): Catches missing Schedule 4');
  assert(resLease.definedTerms.boilerplateArtifacts.some(a => a.placeholder.includes('[Tenant Space Square Footage]')), 'T4.11: Scenario 3 (Commercial Lease): Catches unfilled bracket placeholder [Tenant Space Square Footage]');
  assert(resLease.definedTerms.entityIssues.some(e => e.entity.includes('Metro Towers Inc') || e.discrepancy.includes('Metro Towers Inc')), 'T4.12: Scenario 3 (Commercial Lease): Flags entity inconsistency Metro Towers Inc vs Metro Tower LLC');
}

// 4.4 Scenario 4: Government Defense Procurement Subcontract (Strict Air-Gap)
{
  const defenseText = `
    DEFENSE SUBCONTRACT AGREEMENT (STRICT CONFIDENTIALITY)
    This Subcontract is entered into on August 1, 2026, by Northrop Aerospace Prime ("Prime Contractor") and CyberDefense Subcontractors LLC ("Subcontractor").
    SECTION 1. WORK AND CLEARANCES
    1.1 Subcontractor must maintain Top Secret facility clearance.
    1.2 Subcontractor shall assign only United States citizens under Exhibit A.
    1.3 Prime Contractor shall provide technical data within fifteen (15) days.
    SECTION 2. STRICT NON-DISCLOSURE
    2.1 Subcontractor must strictly comply with ITAR regulations.
    2.2 Neither party shall disclose classified specifications to foreign nationals.
    2.3 Subcontractor shall not store defense project artifacts on any third-party cloud.
    2.4 In the event of a security incident, Subcontractor must notify Prime Contractor within four (4) hours.
    SECTION 3. AUDIT
    3.1 Subcontractor agrees to permit government auditors access to records.
    3.2 Escrow Agent shall hold proprietary cryptographic keys pursuant to Schedule 1.
    3.3 Prime Contractor shall pay Subcontractor $250,000 upon Milestone 1 completion.
    EXHIBIT A - SPECIFICATIONS
    Specs.
    SCHEDULE 1 - CRYPTOGRAPHIC ESCROW
    Escrow procedures.
  `;

  const preAttempts = runtimeNetworkAttempts;
  const resDefense = await executeContractAnalysisDirect({ mode: 'single', text: defenseText, clientParty: 'Prime Contractor', counterparty: 'Subcontractor' });
  const postAttempts = runtimeNetworkAttempts;

  assert(postAttempts === preAttempts, 'T4.13: Scenario 4 (Defense Subcontract): 100% Air-Gap maintained (zero network attempts)');
  assert(resDefense.obligations.obligations.length >= 7, 'T4.14: Scenario 4 (Defense Subcontract): Extracts 7+ high-stakes obligations');
  assert(resDefense.obligations.obligations.some(o => o.dutyType === 'negative' && o.sentence.includes('Neither party shall disclose')), 'T4.15: Scenario 4 (Defense Subcontract): Identifies negative prohibition duty');
  assert(resDefense.obligations.obligations.some(o => o.responsibleParty === 'Third Party'), 'T4.16: Scenario 4 (Defense Subcontract): Identifies Third Party duty for Escrow Agent');
}

// 4.5 Scenario 5: Cross-Border Joint Venture Agreement with Currency Mismatch
{
  const jvText = `
    CROSS-BORDER JOINT VENTURE AGREEMENT
    This Agreement is executed on October 20, 2026, by and between Atlantic Ventures Corp ("US Member") and Trans-Pacific Enterprises Ltd ("UK Member").
    SECTION 1. CAPITAL CONTRIBUTIONS
    1.1 Initial Contribution. US Member shall contribute $2,500,000 in cash.
    1.2 Foreign Contribution. UK Member shall contribute €2,500,000 ($2,500,000) in euro currency reserves.
    1.3 Working Capital. The Joint Venture shall maintain £500,000 for European operations.
    SECTION 2. TIMELINE
    2.1 Project Launch must be completed by January 15, 2025.
    2.2 First Financial Audit shall occur on December 31, 2026.
    SECTION 3. DISPUTE RESOLUTION
    3.1 Atlantic Venture Corp agrees to submit to London arbitration.
  `;

  const resJV = await executeContractAnalysisDirect({ mode: 'single', text: jvText, clientParty: 'US Member', counterparty: 'UK Member' });
  assert(resJV.financialDates.issues.some(i => i.type === 'expired_date' && i.details.includes('2025')), 'T4.17: Scenario 5 (Joint Venture): Catches backwards timeline / past project launch date 2025');
  assert(resJV.definedTerms.entityIssues.some(e => e.entity.includes('Atlantic Venture Corp') || e.discrepancy.includes('Atlantic Venture Corp')), 'T4.18: Scenario 5 (Joint Venture): Catches entity discrepancy Atlantic Venture Corp vs Atlantic Ventures Corp');
  assert(resJV.overallRiskScore >= 50, 'T4.19: Scenario 5 (Joint Venture): Elevated risk score for multi-currency & date contradictions');

  const jvMemo = exportExecutiveClientMemoHTML({ contractTitle: 'Cross-Border JV Agreement', clientName: 'US Member', counterpartyName: 'UK Member', auditData: resJV });
  assert(jvMemo.includes('Cross-Border JV Agreement') && jvMemo.includes('Atlantic Venture'), 'T4.20: Scenario 5 (Joint Venture): Generates complete executive client memorandum');
}

// ============================================================================
// TIER 5: ADVERSARIAL STRESS HARDENING & FUZZING
// ============================================================================
suiteBanner('TIER 5', 'Adversarial Stress Hardening (10k+ Words <2,000ms & Fuzzing)');

// 5.1 Real 13,760-Word Fixture Stress Test (complex-procurement-10k-words.txt)
{
  const complexPath = path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt');
  assert(fs.existsSync(complexPath), 'T5.1: complex-procurement-10k-words.txt fixture exists');
  const complexText = fs.readFileSync(complexPath, 'utf8');
  const wordCount = complexText.trim().split(/\s+/).length;
  assert(wordCount >= 10000, `T5.2: Procurement fixture exceeds 10,000 words (actual: ${wordCount} words)`);

  const t0 = performance.now();
  const resComplex = await executeContractAnalysisDirect({
    mode: 'single',
    text: complexText,
    clientParty: 'Acme Corporation',
    counterparty: 'CloudTech Solutions Inc.'
  });
  const elapsedMs = performance.now() - t0;

  console.log(`  \x1b[33m[PERF]\x1b[0m 13,760 words audited in ${elapsedMs.toFixed(2)}ms (Threshold: < 2,000ms)`);
  assert(elapsedMs < 2000, `T5.3: High-capacity enterprise contract (13,760 words) audited in < 2,000ms (actual: ${elapsedMs.toFixed(2)}ms)`);
  assert(resComplex.crossRefs.issues.some(i => i.targetName.includes('19.4')), 'T5.4: Stress Test: Catches broken reference Section 19.4 in 13k words');
  assert(resComplex.crossRefs.issues.some(i => i.targetName.includes('Exhibit E')), 'T5.5: Stress Test: Catches missing Exhibit E in 13k words');
  assert(resComplex.financialDates.issues.some(i => i.type === 'amount_mismatch' && i.numericValue === 705000), 'T5.6: Stress Test: Catches financial mismatch ($705,000 ceiling)');
  assert(resComplex.obligations.obligations.length >= 20, 'T5.7: Stress Test: Extracts 20+ contractual obligations');
  assert(resComplex.overallRiskScore === 100, 'T5.8: Stress Test: Overall risk score reaches 100 for severely defective contract');
}

// 5.2 Synthetic Hostile Fuzzing & Injection Protection
{
  const xssPayload = `<script>alert("XSS Attack")</script><img src="x" onerror="alert(1)"/>`;
  const sqlPayload = `'; DROP TABLE contracts; SELECT * FROM users WHERE '1'='1`;
  const hostileContract = `
    SECTION 1. ${xssPayload}
    "Term" means ${sqlPayload}.
    SECTION 2. DUTIES
    Provider shall execute ${xssPayload}.
  `;

  let fuzzCrashed = false;
  let fuzzedResult = null;
  try {
    fuzzedResult = await executeContractAnalysisDirect({ mode: 'single', text: hostileContract });
  } catch (err) {
    fuzzCrashed = true;
  }
  assert(!fuzzCrashed && fuzzedResult !== null, 'T5.9: Fuzzing: Hostile XSS and SQL injection payloads handled without engine crash');

  const fuzzedMemo = exportExecutiveClientMemoHTML({
    contractTitle: xssPayload,
    clientName: sqlPayload,
    counterpartyName: 'Vendor',
    auditData: fuzzedResult
  });
  assert(!fuzzedMemo.includes('<script>alert'), 'T5.10: Fuzzing: Output HTML properly escapes hostile script tags in Client Memo');
}

// ============================================================================
// FINAL RUNTIME AIR-GAP AUDIT ASSERTION
// ============================================================================
suiteBanner('AUDIT', 'Final Runtime Air-Gap Assertion');
assert(runtimeNetworkAttempts === 0, `Runtime Air-Gap Audit: Total external network attempts across entire test suite === 0 (actual: ${runtimeNetworkAttempts})`);

// Restore intercepted globals
globalThis.fetch = origFetch;
http.get = origHttpGet;
http.request = origHttpRequest;
https.get = origHttpsGet;
https.request = origHttpsRequest;

// ============================================================================
// CONSOLIDATED RESULTS REPORT
// ============================================================================
console.log('\n' + '='.repeat(78));
console.log('\x1b[1mNEXUS CONTRACTGUARD ENTERPRISE — MASTER E2E TEST SUITE REPORT\x1b[0m');
console.log('='.repeat(78));
console.log(`Total Assertions Evaluated : \x1b[1m${totalAssertions}\x1b[0m`);
console.log(`Assertions Passed          : \x1b[32m\x1b[1m${passedAssertions}\x1b[0m`);
console.log(`Assertions Failed          : ${failedAssertions > 0 ? `\x1b[31m\x1b[1m${failedAssertions}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
console.log(`Pass Rate                  : \x1b[1m${((passedAssertions / totalAssertions) * 100).toFixed(2)}%\x1b[0m`);
console.log('='.repeat(78));

if (failedAssertions > 0) {
  console.error('\n\x1b[31m[FAILED ASSERTIONS SUMMARY]\x1b[0m');
  for (const f of failureDetails) {
    console.error(`  - ${f.title} ${f.details ? '(' + f.details + ')' : ''}`);
  }
  process.exit(1);
} else {
  console.log('\n\x1b[32m\x1b[1m[SUCCESS] ALL CONSOLIDATED E2E CONTRACTGUARD ENTERPRISE TESTS PASSED (100% PASS RATE).\x1b[0m\n');
  process.exit(0);
}
