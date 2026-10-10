/**
 * NEXUS CONTRACTGUARD ENTERPRISE — MILESTONE 2 TEST SUITE
 * Test Runner: tests/test-m2-worker.mjs
 * 
 * Validates F14–F16 across the Web Worker concurrency & document ingestion engine:
 *   1. pdfExtractor.js (F16) — In-browser air-gapped PDF text extraction via pdfjs-dist
 *   2. contractWorker.js (F14) — Background Web Worker protocol & staged pipeline (R1–R4 + diff + risks)
 *   3. useContractWorker.js (F15) — React hook interface & direct asynchronous fallback
 *   4. complex-procurement-10k-words.txt stress test — High-performance execution on 10k+ words
 *   5. Zero-network ABA Rule 1.6 offline verification
 * 
 * Invocation: node tests/test-m2-worker.mjs
 * Exit Code: 0 on 100% pass, 1 on any failure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts } from 'pdf-lib';

// Import Milestone 2 Modules under test
import { extractTextFromPDF, isPDF } from '../src/utils/pdfExtractor.js';
import {
  executeContractAnalysis,
  calculateOverallRiskScore
} from '../src/workers/contractWorker.js';
import {
  useContractWorker,
  executeContractAnalysisDirect
} from '../src/utils/useContractWorker.js';

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
// SUITE 1: AIR-GAPPED PDF TEXT EXTRACTOR (pdfExtractor.js - F16)
// ============================================================================
suiteHeader('1. Air-Gapped PDF Text Extractor (pdfExtractor.js - F16)');

// 1.1 PDF Detection Utility (isPDF)
{
  assert(isPDF('contract.pdf') === true, 'isPDF: Identifies filename ending with .pdf');
  assert(isPDF('AGREEMENT.PDF') === true, 'isPDF: Identifies uppercase .PDF');
  assert(isPDF('application/pdf') === true, 'isPDF: Identifies application/pdf mime type');
  assert(isPDF('document.docx') === false, 'isPDF: Rejects .docx file');
  assert(isPDF('contract.txt') === false, 'isPDF: Rejects .txt file');
  assert(isPDF(null) === false, 'isPDF: Rejects null input');
  assert(isPDF(undefined) === false, 'isPDF: Rejects undefined input');

  const pdfHeaderBuffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]); // %PDF-1.7
  assert(isPDF(pdfHeaderBuffer) === true, 'isPDF: Identifies magic byte sequence for PDF');

  const nonPdfBuffer = new Uint8Array([0x50, 0x4b, 0x03, 0x04]); // PK (zip)
  assert(isPDF(nonPdfBuffer) === false, 'isPDF: Rejects non-PDF magic bytes');
}

// 1.2 Synthetic Multi-Page PDF Extraction
{
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Page 1
  const page1 = pdfDoc.addPage([600, 400]);
  page1.drawText('MASTER SERVICES AGREEMENT', { x: 50, y: 350, size: 14, font });
  page1.drawText('Section 1. Definitions and Interpretation', { x: 50, y: 320, size: 11, font });
  page1.drawText('Vendor shall deliver consulting services as agreed in Exhibit A.', { x: 50, y: 290, size: 10, font });

  // Page 2
  const page2 = pdfDoc.addPage([600, 400]);
  page2.drawText('Section 2. Fees and Invoicing', { x: 50, y: 350, size: 12, font });
  page2.drawText('Client shall pay USD 50000 within thirty days of invoice.', { x: 50, y: 320, size: 10, font });

  const pdfBytes = await pdfDoc.save();

  const progressEvents = [];
  const result = await extractTextFromPDF(pdfBytes, {
    onProgress: (p) => progressEvents.push(p)
  });

  assert(result.pageCount === 2, 'F16: Correctly detects 2 total pages');
  assert(result.pages.length === 2, 'F16: Returns array of 2 page records');
  assert(result.pages[0].pageNumber === 1, 'F16: First page is numbered 1');
  assert(result.pages[1].pageNumber === 2, 'F16: Second page is numbered 2');
  assert(result.fullText.includes('MASTER SERVICES AGREEMENT'), 'F16: Extracts title from page 1');
  assert(result.fullText.includes('Section 1. Definitions and Interpretation'), 'F16: Extracts Section 1 heading');
  assert(result.fullText.includes('Section 2. Fees and Invoicing'), 'F16: Extracts Section 2 heading from page 2');
  assert(result.totalWords > 15, 'F16: Computes positive word count across pages');
  assert(progressEvents.length === 2, 'F16: Dispatches progress events for all pages');
  assert(progressEvents[progressEvents.length - 1].percent === 100, 'F16: Final progress reaches 100%');
}

// 1.3 Error Handling on Corrupted/Empty PDF
{
  let emptyErrorThrown = false;
  try {
    await extractTextFromPDF(new Uint8Array([]));
  } catch (err) {
    emptyErrorThrown = true;
    assert(err.message.includes('Empty PDF data buffer'), 'F16: Rejects empty byte array');
  }
  assert(emptyErrorThrown, 'F16: Throws error when passed empty buffer');

  let invalidErrorThrown = false;
  try {
    await extractTextFromPDF(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
  } catch (err) {
    invalidErrorThrown = true;
    assert(err.message.includes('Invalid PDF header'), 'F16: Rejects corrupted non-PDF buffer');
  }
  assert(invalidErrorThrown, 'F16: Throws error when passed invalid header');
}

// ============================================================================
// SUITE 2: WEB WORKER AUDIT LOGIC & PROGRESS PROTOCOL (contractWorker.js - F14)
// ============================================================================
suiteHeader('2. Web Worker Audit Pipeline & Progress Protocol (contractWorker.js - F14)');

// 2.1 Staged Progress Dispatch & Result Assembly (Single Mode)
{
  const contractText = `
SECTION 1. DEFINITIONS
"Confidential Information" means all proprietary data.

SECTION 2. PAYMENT TERMS
Client shall pay $10,000 (Ten Thousand Dollars) within 30 days.

SECTION 3. TERMINATION
Pursuant to Section 8.2, either party may terminate this Agreement.
`;

  const stages = [];
  const percents = [];

  const analysisResult = await executeContractAnalysis({
    mode: 'single',
    text: contractText,
    clientParty: 'Client',
    counterparty: 'Vendor'
  }, (stage, percent, msg) => {
    stages.push(stage);
    percents.push(percent);
  });

  assert(stages.includes('CROSS_REFS'), 'F14: Progress dispatches CROSS_REFS stage');
  assert(stages.includes('DEFINED_TERMS'), 'F14: Progress dispatches DEFINED_TERMS stage');
  assert(stages.includes('FINANCIAL_DATES'), 'F14: Progress dispatches FINANCIAL_DATES stage');
  assert(stages.includes('OBLIGATIONS'), 'F14: Progress dispatches OBLIGATIONS stage');
  assert(stages.includes('DIFF'), 'F14: Progress dispatches DIFF/Risks stage');
  assert(stages.includes('COMPLETE'), 'F14: Progress dispatches COMPLETE stage');

  assert(percents.includes(20), 'F14: CROSS_REFS is staged at 20%');
  assert(percents.includes(40), 'F14: DEFINED_TERMS is staged at 40%');
  assert(percents.includes(60), 'F14: FINANCIAL_DATES is staged at 60%');
  assert(percents.includes(80), 'F14: OBLIGATIONS is staged at 80%');
  assert(percents.includes(90), 'F14: DIFF is staged at 90%');
  assert(percents.includes(100), 'F14: COMPLETE is staged at 100%');

  // Verify result payload structure
  assert(analysisResult.crossRefs !== undefined, 'F14: Returns crossRefs result');
  assert(analysisResult.definedTerms !== undefined, 'F14: Returns definedTerms result');
  assert(analysisResult.financialDates !== undefined, 'F14: Returns financialDates result');
  assert(analysisResult.obligations !== undefined, 'F14: Returns obligations result');
  assert(analysisResult.risks !== undefined, 'F14: Returns risks result');
  assert(typeof analysisResult.overallRiskScore === 'number', 'F14: Returns numeric overallRiskScore');
  assert(['low', 'medium', 'high', 'critical'].includes(analysisResult.riskLevel), 'F14: Returns valid riskLevel classification');

  // Verify actual engine detection through worker pipeline
  assert(analysisResult.crossRefs.issues.some(i => i.targetName.includes('8.2')), 'F14: Worker pipeline caught broken Section 8.2');
  assert(analysisResult.financialDates.financialPairings.length >= 1, 'F14: Worker pipeline paired $10,000 with Ten Thousand Dollars');
  assert(analysisResult.obligations.obligations.length >= 1, 'F14: Worker pipeline extracted Client payment obligation');
}

// 2.2 Comparative Redline Diff Mode
{
  const baseline = `Section 1. Fees\nClient shall pay $5,000 upon completion.`;
  const modified = `Section 1. Fees and Penalties\nClient shall pay $15,000 upon completion plus late interest.`;

  const diffResult = await executeContractAnalysis({
    mode: 'comparative',
    baselineText: baseline,
    text: modified,
    clientParty: 'Client'
  });

  assert(diffResult.diff !== null, 'F14: Comparative mode populates diff object');
  assert(diffResult.diff.segments.length > 0, 'F14: Diff contains Myers LCS segments');
  assert(diffResult.diff.stats.additions > 0, 'F14: Diff records additions');
  assert(diffResult.diff.clauseDiffs.length > 0, 'F14: Diff extracts clause-level redlines');
}

// 2.3 Holistic Risk Score Algorithm (calculateOverallRiskScore)
{
  // Test 1: Pristine result
  const cleanScore = calculateOverallRiskScore({
    crossRefs: { issues: [] },
    definedTerms: { issues: [] },
    financialDates: { issues: [] },
    obligations: { obligations: [] },
    risks: []
  });
  assert(cleanScore.score === 0, 'F14: Pristine document has risk score 0');
  assert(cleanScore.level === 'low', 'F14: Pristine document has level "low"');

  // Test 2: Severe defects (Broken crossref + amount mismatch + critical risk)
  const defectiveScore = calculateOverallRiskScore({
    crossRefs: { issues: [{ severity: 'critical' }] },
    definedTerms: { issues: [{ severity: 'critical' }, { severity: 'warning' }] },
    financialDates: { issues: [{ severity: 'critical' }] },
    obligations: { obligations: [{ severity: 'high' }, { severity: 'high' }] },
    risks: [{ severity: 'critical' }, { severity: 'critical' }]
  });
  assert(defectiveScore.score >= 75, 'F14: Multiple critical defects drive risk score >= 75');
  assert(defectiveScore.level === 'critical', 'F14: Severe defects classified as "critical"');
  assert(defectiveScore.breakdown.criticalTotal === 5, 'F14: Accurately tallies 5 critical defects');
}

// ============================================================================
// SUITE 3: CLIENT HOOK & DIRECT FALLBACK ENGINE (useContractWorker.js - F15)
// ============================================================================
suiteHeader('3. Client Hook & Direct Asynchronous Fallback (useContractWorker.js - F15)');

// 3.1 Direct Fallback Execution (executeContractAnalysisDirect)
{
  assert(typeof executeContractAnalysisDirect === 'function', 'F15: Exports executeContractAnalysisDirect');

  const doc = `
Section 1. Warranties
Vendor agrees to defend, indemnify and hold harmless Client at its sole expense.
`;

  const fallbackResult = await executeContractAnalysisDirect({
    text: doc,
    clientParty: 'Client'
  });

  assert(fallbackResult !== null && typeof fallbackResult === 'object', 'F15: Direct fallback returns valid audit result');
  assert(fallbackResult.risks.some(r => r.category.includes('Indemnification')), 'F15: Direct fallback catches indemnification trap');
  assert(fallbackResult.meta.wordCount > 0, 'F15: Direct fallback returns metadata');
}

// 3.2 Hook Interface Verification
{
  assert(typeof useContractWorker === 'function', 'F15: Exports useContractWorker function');
}

// ============================================================================
// SUITE 4: REALISTIC 10,000+ WORD STRESS TEST (complex-procurement-10k-words.txt)
// ============================================================================
suiteHeader('4. Realistic 10k-Word Fixture Stress Test (F14 / F15 Scalability)');

{
  const fixturePath = path.join(FIXTURES_DIR, 'complex-procurement-10k-words.txt');
  assert(fs.existsSync(fixturePath), 'Stress: complex-procurement-10k-words.txt exists');

  const fixtureContent = fs.readFileSync(fixturePath, 'utf8');
  const wordCount = fixtureContent.trim().split(/\s+/).length;
  assert(wordCount >= 10000, `Stress: Fixture contains ${wordCount} words (>= 10,000 words requirement)`);

  const startTime = performance.now();
  const stagesEncountered = [];

  const auditResult = await executeContractAnalysis({
    mode: 'single',
    text: fixtureContent,
    clientParty: 'Metro Transit Authority',
    counterparty: 'Apex Rail Systems LLC'
  }, (stage) => {
    stagesEncountered.push(stage);
  });

  const duration = performance.now() - startTime;
  console.log(`  \x1b[36m[PERF]\x1b[0m 10k+ words audit finished in ${duration.toFixed(2)}ms`);

  assert(duration < 4000, `Stress: 10,000+ words analyzed in < 4,000ms (actual: ${duration.toFixed(2)}ms)`);
  assert(stagesEncountered.includes('DIFF'), 'Stress: Reached all pipeline stages');
  assert(auditResult.crossRefs.issues.some(i => i.targetName.includes('19.4')), 'Stress: Catches Section 19.4 broken reference');
  assert(auditResult.crossRefs.issues.some(i => i.targetName.toLowerCase().includes('exhibit e')), 'Stress: Catches missing Exhibit E');
  assert(auditResult.financialDates.issues.some(i => i.type === 'amount_mismatch'), 'Stress: Catches financial mismatch ($705,000 vs Seven Hundred Fifty Thousand)');
  assert(auditResult.definedTerms.boilerplateArtifacts.some(b => b.placeholder.includes('Performance Bond Issuer')), 'Stress: Catches placeholder [Insert Performance Bond Issuer]');
  assert(auditResult.obligations.obligations.length > 20, 'Stress: Extracts 20+ contractual obligations');
  assert(auditResult.overallRiskScore >= 70, `Stress: Overall risk score reflects critical issues (score: ${auditResult.overallRiskScore})`);
}

// ============================================================================
// SUITE 5: ZERO-CLOUD & ABA RULE 1.6 AIR-GAP VERIFICATION
// ============================================================================
suiteHeader('5. Zero-Cloud & ABA Rule 1.6 Offline Security Inspection');

{
  const filesToScan = [
    path.join(__dirname, '../src/workers/contractWorker.js'),
    path.join(__dirname, '../src/utils/useContractWorker.js'),
    path.join(__dirname, '../src/utils/pdfExtractor.js')
  ];

  const forbiddenPatterns = [
    { name: 'External HTTP url', regex: /http:\/\/(?!localhost|127\.0\.0\.1)/i },
    { name: 'External HTTPS url', regex: /https:\/\//i },
    { name: 'fetch API call', regex: /\bfetch\s*\(/ },
    { name: 'axios library', regex: /\baxios\b/i },
    { name: 'WebSocket call', regex: /\bnew\s+WebSocket\b/ },
    { name: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/ }
  ];

  for (const filePath of filesToScan) {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');

    for (const forbidden of forbiddenPatterns) {
      const match = forbidden.regex.test(content);
      assert(!match, `Air-Gap: ${filename} contains NO ${forbidden.name}`);
    }
  }
}

// ============================================================================
// SUMMARY REPORT
// ============================================================================
const totalElapsed = (performance.now() - suiteStartTime).toFixed(2);
console.log('\n' + '='.repeat(70));
console.log(`TEST EXECUTION COMPLETE in ${totalElapsed}ms`);
console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('='.repeat(70));

if (failedTests > 0) {
  console.error('\nFAILURES:');
  failures.forEach(f => console.error(`  - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\n\x1b[32mALL MILESTONE 2 WORKER & DOCUMENT INGESTION TESTS PASSED (100% PASS RATE).\x1b[0m\n');
  process.exit(0);
}
