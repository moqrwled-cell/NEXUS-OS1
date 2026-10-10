/**
 * NEXUS CONTRACTGUARD ENTERPRISE — MILESTONE 3 TEST SUITE
 * Test Runner: tests/test-m3-ui-export.mjs
 * 
 * Validates F17–F19 across Enterprise UI integration, Executive Client Memo HTML,
 * and Obligations CSV/JSON exports:
 *   1. exportExecutiveClientMemoHTML — Letterhead, risk score badge, defect tables, @media print CSS
 *   2. Zero-Network Air-Gap Audit — 0 external URLs / fonts / scripts in memo HTML
 *   3. exportObligationsCSV — RFC-compliant CSV headers, quoting, and party breakdowns
 *   4. exportObligationsJSON — Structured JSON export
 *   5. End-to-End Fixtures Audit — Realistic test fixtures feeding exportEngine
 * 
 * Invocation: node tests/test-m3-ui-export.mjs
 * Exit Code: 0 on 100% pass, 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Export Engine under test
import {
  exportExecutiveClientMemoHTML,
  exportObligationsCSV,
  exportObligationsJSON,
  escapeHtml
} from '../src/utils/exportEngine.js';

// Import M1 & M2 worker analysis engines for end-to-end fixture testing
import { executeContractAnalysis } from '../src/workers/contractWorker.js';

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

const suiteStartTime = performance.now();

// ============================================================================
// SUITE 1: EXECUTIVE CLIENT MEMO HTML GENERATOR (F18)
// ============================================================================
suiteHeader('1. Executive Client Memo HTML Generator (exportExecutiveClientMemoHTML - F18)');

{
  const mockAuditData = {
    mode: 'single',
    overallRiskScore: 82,
    riskLevel: 'critical',
    crossRefs: {
      stats: { totalIndexed: 8, totalCitations: 5, brokenCount: 1, missingExhibitCount: 1 },
      issues: [
        {
          type: 'broken_reference',
          referenceText: 'Section 9.4',
          targetName: '9.4',
          line: 42,
          snippet: 'subject to Section 9.4 requirements',
          severity: 'critical'
        },
        {
          type: 'missing_exhibit',
          referenceText: 'Exhibit D',
          targetName: 'Exhibit D',
          line: 58,
          snippet: 'as detailed in Exhibit D',
          severity: 'critical'
        }
      ]
    },
    definedTerms: {
      stats: { totalDefined: 4, undefinedCount: 2, unusedCount: 1, artifactCount: 1 },
      undefinedTerms: [
        { term: 'Key Personnel', line: 25, count: 2 },
        { term: 'Deliverables', line: 30, count: 1 }
      ],
      unusedDefinedTerms: [
        { term: 'Orphaned Term', line: 12 }
      ],
      boilerplateArtifacts: [
        { placeholder: '[Company Name]', line: 65, snippet: 'offices of [Company Name] located at' }
      ],
      entityIssues: []
    },
    financialDates: {
      stats: { totalAmounts: 3, mismatchCount: 1, totalDates: 2, dateIssuesCount: 1 },
      issues: [
        {
          type: 'amount_mismatch',
          title: 'Amount Contradiction: $15,000 vs Fifty Thousand Dollars',
          details: 'Numeric ($15,000) does not match written text (Fifty Thousand Dollars).',
          line: 22,
          snippet: 'fixed fee of $15,000 (Fifty Thousand Dollars)',
          severity: 'critical'
        },
        {
          type: 'expired_date',
          title: 'Expired Date in Contract: December 31, 2024',
          details: 'Date is in the past.',
          line: 35,
          snippet: 'terminate on December 31, 2024',
          severity: 'warning'
        }
      ]
    },
    obligations: {
      stats: { totalObligations: 3, affirmativeCount: 2, negativeCount: 1 },
      partyBreakdown: { clientCount: 1, counterpartyCount: 1, mutualCount: 1, thirdPartyCount: 0 },
      obligations: [
        {
          id: 'OBL-1',
          responsibleParty: 'Client',
          modalVerb: 'shall',
          dutyType: 'affirmative',
          action: 'pay Vendor within thirty (30) days',
          sentence: 'Client shall pay Vendor within thirty (30) days of receiving an invoice.',
          sectionContext: 'Section 2.2',
          line: 22,
          severity: 'high'
        },
        {
          id: 'OBL-2',
          responsibleParty: 'Counterparty',
          modalVerb: 'shall not',
          dutyType: 'negative',
          action: 'disclose any client records to third parties',
          sentence: 'Vendor shall not disclose any client records to third parties without prior written consent.',
          sectionContext: 'Section 4.2',
          line: 45,
          severity: 'high'
        },
        {
          id: 'OBL-3',
          responsibleParty: 'Mutual',
          modalVerb: 'agrees to',
          dutyType: 'affirmative',
          action: 'maintain Confidential Information in strict confidence',
          sentence: 'Each party agrees to maintain Confidential Information in strict confidence.',
          sectionContext: 'Section 4.1',
          line: 41,
          severity: 'medium'
        }
      ]
    },
    meta: {
      wordCount: 1250,
      lineCount: 85,
      processingTimeMs: 14.2
    }
  };

  const html = exportExecutiveClientMemoHTML({
    contractTitle: 'Master Cloud Consulting Agreement',
    clientName: 'Acme Corporation',
    counterpartyName: 'Globex Systems Inc',
    auditData: mockAuditData,
    date: 'March 15, 2026',
    options: { download: false }
  });

  // 1.1 Structural Validity
  assert(typeof html === 'string', 'F18: Returns HTML string');
  assert(html.includes('<!DOCTYPE html>'), 'F18: Contains valid DOCTYPE declaration');
  assert(html.includes('<html') && html.includes('</html>'), 'F18: Has standard html root tags');
  assert(html.includes('<head>') && html.includes('</head>'), 'F18: Has head element');
  assert(html.includes('<body') && html.includes('</body>'), 'F18: Has body element');

  // 1.2 Executive Letterhead & Meta
  assert(html.includes('Nexus ContractGuard Enterprise'), 'F18: Contains law firm / system banner');
  assert(html.includes('Acme Corporation'), 'F18: Features client party name');
  assert(html.includes('Globex Systems Inc'), 'F18: Features counterparty name');
  assert(html.includes('Master Cloud Consulting Agreement'), 'F18: Displays matter / contract title');
  assert(html.includes('March 15, 2026'), 'F18: Displays formatted memo date');
  assert(html.includes('Privileged &amp; Confidential') || html.includes('Privileged & Confidential'), 'F18: Includes attorney work product privilege confidentiality stamp');

  // 1.3 Executive Risk Assessment Badge
  assert(html.includes('82 / 100'), 'F18: Renders numeric risk score badge (82 / 100)');
  assert(html.includes('CRITICAL RISK') || html.includes('critical'), 'F18: Displays critical risk severity level');
  assert(html.includes('Executive Risk Assessment'), 'F18: Includes executive risk summary section');

  // 1.4 Critical Defect Tables
  assert(html.includes('Section 9.4'), 'F18: Reports broken Section 9.4 reference');
  assert(html.includes('Exhibit D'), 'F18: Reports missing Exhibit D');
  assert(html.includes('$15,000') && html.includes('Fifty Thousand Dollars'), 'F18: Reports financial mismatch ($15,000 vs Fifty Thousand Dollars)');
  assert(html.includes('December 31, 2024'), 'F18: Reports past/expired date December 31, 2024');

  // 1.5 Defined Terms & Template Artifacts
  assert(html.includes('Key Personnel'), 'F18: Reports undefined capitalized term Key Personnel');
  assert(html.includes('[Company Name]'), 'F18: Reports unfilled boilerplate placeholder [Company Name]');

  // 1.6 Obligations Matrix Schedule
  assert(html.includes('OBL-1') || html.includes('#1'), 'F18: Includes obligations schedule rows');
  assert(html.includes('shall not disclose any client records'), 'F18: Captures negative obligation');
  assert(html.includes('Client') && html.includes('Counterparty') && html.includes('Mutual'), 'F18: Displays responsible party tags');

  // 1.7 Embedded Print CSS (@media print)
  assert(html.includes('@media print'), 'F18: Contains embedded @media print CSS');
  assert(html.includes('@page'), 'F18: Defines @page margins for clean PDF printing');
  assert(html.includes('no-print'), 'F18: Uses no-print class for screen-only controls');
  assert(html.includes('window.print()'), 'F18: Includes 1-click browser print invocation');

  // 1.8 Alternative Calling Signature
  const htmlSig2 = exportExecutiveClientMemoHTML(mockAuditData, {
    contractTitle: 'Alternative Signature Title',
    clientName: 'Alternative Client',
    options: { download: false }
  });
  assert(htmlSig2.includes('Alternative Signature Title'), 'F18: Supports (auditData, meta) calling signature');
  assert(htmlSig2.includes('Alternative Client'), 'F18: Correctly parses meta in 2-argument signature');
}

// ============================================================================
// SUITE 2: ZERO-NETWORK AIR-GAP VERIFICATION ON MEMO (F18 / ABA Rule 1.6)
// ============================================================================
suiteHeader('2. Zero-Network Air-Gap Verification on Memo HTML (F18 / ABA Rule 1.6)');

{
  const cleanAuditData = {
    overallRiskScore: 0,
    riskLevel: 'low',
    crossRefs: { stats: { totalIndexed: 2, brokenCount: 0, missingExhibitCount: 0 }, issues: [] },
    definedTerms: { stats: { totalDefined: 1, undefinedCount: 0, unusedCount: 0, artifactCount: 0 }, issues: [] },
    financialDates: { stats: { totalAmounts: 1, mismatchCount: 0, totalDates: 1, dateIssuesCount: 0 }, issues: [] },
    obligations: { stats: { totalObligations: 1 }, obligations: [] }
  };

  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'Pristine Agreement',
    auditData: cleanAuditData,
    options: { download: false }
  });

  // Verify complete absence of external network links in memo output
  assert(!memoHtml.includes('http://'), 'Air-Gap: Memo HTML contains ZERO http:// links');
  assert(!memoHtml.includes('https://'), 'Air-Gap: Memo HTML contains ZERO https:// links');
  assert(!memoHtml.includes('src="http'), 'Air-Gap: Memo HTML contains ZERO remote script/img src tags');
  assert(!memoHtml.includes('href="http'), 'Air-Gap: Memo HTML contains ZERO remote stylesheet/link href tags');
  assert(!memoHtml.includes('fonts.googleapis.com'), 'Air-Gap: Memo HTML does NOT load Google Fonts');
  assert(!memoHtml.includes('cdn.'), 'Air-Gap: Memo HTML does NOT load external CDNs');
  assert(memoHtml.includes('ABA Model Rule 1.6'), 'Air-Gap: Memo HTML includes ABA Model Rule 1.6 air-gapped security footnote');
  assert(memoHtml.includes('✓ All internal section citations successfully resolved'), 'Clean Contract: Shows clean cross-reference resolution message');
}

// ============================================================================
// SUITE 3: OBLIGATIONS CSV & JSON EXPORTERS (F19)
// ============================================================================
suiteHeader('3. Obligations CSV & JSON Exporters (exportObligationsCSV, exportObligationsJSON - F19)');

{
  const testObligations = [
    {
      id: 'OBL-101',
      responsibleParty: 'Counterparty',
      modalVerb: 'shall',
      dutyType: 'affirmative',
      severity: 'high',
      line: 15,
      sectionContext: 'Section 1.3',
      action: 'deliver software source code, documentation, and keys',
      sentence: 'Vendor shall deliver software source code, documentation, and keys within 5 business days.'
    },
    {
      id: 'OBL-102',
      responsibleParty: 'Client',
      modalVerb: 'must',
      dutyType: 'affirmative',
      severity: 'medium',
      line: 28,
      sectionContext: 'Section 2.1',
      action: 'review and approve "Milestone Deliverables"',
      sentence: 'Client must review and approve "Milestone Deliverables" within ten (10) days.'
    },
    {
      id: 'OBL-103',
      responsibleParty: 'Mutual',
      modalVerb: 'shall not',
      dutyType: 'negative',
      severity: 'high',
      line: 50,
      sectionContext: 'Section 4.1',
      action: 'solicit employees of the other party',
      sentence: 'Neither party shall solicit employees of the other party for two (2) years.'
    }
  ];

  // 3.1 CSV Export from Array
  const csvFromArray = exportObligationsCSV(testObligations, { download: false });
  assert(typeof csvFromArray === 'string', 'F19: exportObligationsCSV returns string');

  const lines = csvFromArray.split(/\r?\n/).filter(Boolean);
  assert(lines.length === 4, 'F19: CSV contains header + 3 data rows');

  // Verify headers
  const header = lines[0];
  assert(header.includes('ID') && header.includes('Responsible Party') && header.includes('Modal Verb') && header.includes('Duty Type'), 'F19: CSV header contains expected columns');
  assert(header.includes('Operative Action') && header.includes('Full Sentence'), 'F19: CSV header contains action and sentence fields');

  // Verify row contents and quote escaping
  assert(lines[1].includes('"OBL-101"') && lines[1].includes('"Counterparty"'), 'F19: Row 1 contains OBL-101 and Counterparty');
  assert(lines[1].includes('"deliver software source code, documentation, and keys"'), 'F19: Row 1 preserves commas inside quoted field');
  assert(lines[2].includes('""Milestone Deliverables""'), 'F19: Row 2 correctly escapes internal double quotes as double double-quotes');
  assert(lines[3].includes('"shall not"') && lines[3].includes('"Mutual"'), 'F19: Row 3 preserves modal verb and party');

  // 3.2 CSV Export from obligations extractor result object
  const csvFromObj = exportObligationsCSV({ obligations: testObligations }, { download: false });
  assert(csvFromObj.includes('OBL-101'), 'F19: exportObligationsCSV accepts object with .obligations property');

  // 3.3 CSV Export with empty array
  const emptyCsv = exportObligationsCSV([], { download: false });
  assert(emptyCsv.split(/\r?\n/).filter(Boolean).length === 1, 'F19: Handles empty array returning header row safely');

  // 3.4 JSON Export
  const jsonOutput = exportObligationsJSON(testObligations, { download: false });
  assert(typeof jsonOutput === 'string', 'F19: exportObligationsJSON returns string');
  const parsedBack = JSON.parse(jsonOutput);
  assert(Array.isArray(parsedBack.obligations), 'F19: JSON output parses back to valid object');
  assert(parsedBack.obligations.length === 3, 'F19: JSON output preserves all 3 items');
  assert(parsedBack.obligations[0].id === 'OBL-101', 'F19: JSON preserves obligation attributes');
}

// ============================================================================
// SUITE 4: END-TO-END FIXTURES AUDIT & MEMO COMPILATION (F17–F19)
// ============================================================================
suiteHeader('4. End-to-End Fixtures Audit & Memo Compilation (F17–F19)');

// 4.1 Master Services Agreement (Clean)
{
  const fixturePath = path.join(FIXTURES_DIR, 'master-services-agreement-clean.txt');
  const text = fs.readFileSync(fixturePath, 'utf8');

  const auditData = await executeContractAnalysis({
    mode: 'single',
    text,
    clientParty: 'Acme Corporation',
    counterparty: 'TechSolutions Inc'
  });

  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'Master Services Agreement (Clean Baseline)',
    clientName: 'Acme Corporation',
    counterpartyName: 'TechSolutions Inc',
    auditData,
    options: { download: false }
  });

  assert(auditData.crossRefs.issues.length === 0, 'Clean Fixture: 0 cross-reference defects');
  assert(auditData.financialDates.issues.filter(i => i.type === 'amount_mismatch').length === 0, 'Clean Fixture: 0 financial amount mismatches');
  assert(memoHtml.includes(`${auditData.overallRiskScore} / 100`), 'Clean Fixture: Memo displays overall score badge');

  const csv = exportObligationsCSV(auditData.obligations, { download: false });
  assert(csv.includes('Client') && csv.includes('Counterparty'), 'Clean Fixture: CSV extracts obligations for both parties');
}

// 4.2 MSA Broken Cross-References & Missing Exhibits
{
  const fixturePath = path.join(FIXTURES_DIR, 'msa-broken-crossrefs.txt');
  const text = fs.readFileSync(fixturePath, 'utf8');

  const auditData = await executeContractAnalysis({
    mode: 'single',
    text,
    clientParty: 'Acme Corporation',
    counterparty: 'Vendor Systems Inc'
  });

  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'MSA with Known Broken References',
    clientName: 'Acme Corporation',
    counterpartyName: 'Vendor Systems Inc',
    auditData,
    options: { download: false }
  });

  assert(auditData.crossRefs.stats.brokenCount >= 1, 'Broken Cross-Ref Fixture: Detects broken reference');
  assert(auditData.crossRefs.stats.missingExhibitCount >= 1, 'Broken Cross-Ref Fixture: Detects missing exhibits');
  assert(memoHtml.includes('Section 8.3') || memoHtml.includes('8.3'), 'Broken Cross-Ref Fixture: Memo notes broken Section 8.3');
  assert(memoHtml.includes('Exhibit C') || memoHtml.includes('Schedule 3'), 'Broken Cross-Ref Fixture: Memo notes missing exhibits');
  assert(auditData.overallRiskScore >= 45, 'Broken Cross-Ref Fixture: Drives high/critical risk score');
}

// 4.3 MSA Financial & Date Mismatches
{
  const fixturePath = path.join(FIXTURES_DIR, 'msa-financial-date-mismatches.txt');
  const text = fs.readFileSync(fixturePath, 'utf8');

  const auditData = await executeContractAnalysis({
    mode: 'single',
    text,
    clientParty: 'Acme Corporation',
    counterparty: 'Consulting Partners LLC'
  });

  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'MSA with Financial & Date Contradictions',
    auditData,
    options: { download: false }
  });

  assert(auditData.financialDates.stats.mismatchCount >= 2, 'Financial Fixture: Detects amount mismatches');
  assert(memoHtml.includes('Twenty Thousand') || memoHtml.includes('$10,000'), 'Financial Fixture: Memo records $10k vs $20k contradiction');
  assert(memoHtml.includes('Fifty Thousand') || memoHtml.includes('$15,000'), 'Financial Fixture: Memo records $15k vs $50k contradiction');
}

// 4.4 MSA Leftover Boilerplate & Placeholders
{
  const fixturePath = path.join(FIXTURES_DIR, 'msa-boilerplate-leftovers.txt');
  const text = fs.readFileSync(fixturePath, 'utf8');

  const auditData = await executeContractAnalysis({
    mode: 'single',
    text,
    clientParty: 'Acme Corp',
    counterparty: 'NewVendor Corp'
  });

  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'MSA with Boilerplate Placeholders',
    auditData,
    options: { download: false }
  });

  assert(auditData.definedTerms.stats.artifactCount >= 2, 'Boilerplate Fixture: Catches template artifacts');
  assert(memoHtml.includes('[Company Name]'), 'Boilerplate Fixture: Memo includes [Company Name]');
  assert(memoHtml.includes('[Insert Effective Date]'), 'Boilerplate Fixture: Memo includes [Insert Effective Date]');
}

// 4.5 Complex Procurement 10,000+ Words Stress Test Memo Compilation
{
  const fixturePath = path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt');
  const text = fs.readFileSync(fixturePath, 'utf8');

  const startAnalysis = performance.now();
  const auditData = await executeContractAnalysis({
    mode: 'single',
    text,
    clientParty: 'Apex Logistics Corp',
    counterparty: 'Titan Supply Chain Systems Inc'
  });
  const analysisTimeMs = performance.now() - startAnalysis;

  const startExport = performance.now();
  const memoHtml = exportExecutiveClientMemoHTML({
    contractTitle: 'Mega Enterprise Procurement & Master Logistics Agreement',
    clientName: 'Apex Logistics Corp',
    counterpartyName: 'Titan Supply Chain Systems Inc',
    auditData,
    options: { download: false }
  });
  const exportTimeMs = performance.now() - startExport;

  const csv = exportObligationsCSV(auditData.obligations, { download: false });

  assert(auditData.meta.wordCount >= 10000, 'Complex 10k: Word count >= 10,000 words');
  assert(exportTimeMs < 1000, `Complex 10k: Memo compiled in < 1,000ms (actual: ${exportTimeMs.toFixed(2)}ms)`);
  assert(memoHtml.length > 5000, 'Complex 10k: Generated comprehensive client memo');
  assert(memoHtml.includes('Section 19.4'), 'Complex 10k: Memo captures deep broken Section 19.4');
  assert(memoHtml.includes('Exhibit E'), 'Complex 10k: Memo captures missing Exhibit E');
  assert(csv.split(/\r?\n/).length >= 20, 'Complex 10k: CSV exports 20+ contractual obligations');
}

// ============================================================================
// SUITE 5: HTML ESCAPING AND SECURITY SANITIZATION
// ============================================================================
suiteHeader('5. HTML Escaping and Injection Protection');

{
  assert(escapeHtml('<script>alert("xss")</script>') === '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;', 'Security: Escapes <script> tags and quotes');
  assert(escapeHtml("John's Company & Co.") === "John&#039;s Company &amp; Co.", 'Security: Escapes apostrophe and ampersand');
  assert(escapeHtml(null) === '', 'Security: Handles null safely');
  assert(escapeHtml(undefined) === '', 'Security: Handles undefined safely');
}

// ============================================================================
// TEST SUMMARY & EXIT
// ============================================================================
const suiteElapsed = (performance.now() - suiteStartTime).toFixed(2);
console.log('\n' + '='.repeat(70));
console.log(`TEST EXECUTION COMPLETE in ${suiteElapsed}ms`);
console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('='.repeat(70) + '\n');

if (failedTests > 0) {
  console.error(`\x1b[31m[FAILED]\x1b[0m ${failedTests} test(s) failed:`);
  failures.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\x1b[32m[SUCCESS]\x1b[0m ALL MILESTONE 3 UI INTEGRATION & EXPORT TESTS PASSED (100% PASS RATE).\n');
  process.exit(0);
}
