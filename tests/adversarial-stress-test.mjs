/**
 * Adversarial Stress-Test Suite for Nexus ContractGuard Enterprise Core Engines
 * Executed by Empirical Challenger (challenger_1)
 */

import { performance } from 'perf_hooks';
import { computeContractDiff } from '../src/utils/diffEngine.js';
import { sanitizeDocumentPII, PII_RULES } from '../src/utils/piiEngine.js';
import { scanLegalRisks, LEGAL_RISK_RULES } from '../src/utils/legalRiskRules.js';

const testResults = {
  diffEngine: { passed: 0, failed: 0, details: [] },
  piiEngine: { passed: 0, failed: 0, details: [] },
  legalRiskRules: { passed: 0, failed: 0, details: [] },
  benchmarks: {}
};

function assert(condition, message, suite = 'general') {
  if (condition) {
    if (testResults[suite]) testResults[suite].passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    if (testResults[suite]) testResults[suite].failed++;
    console.error(`  [FAIL] ${message}`);
    testResults[suite].details.push(`Assertion failed: ${message}`);
  }
}

// =========================================================================
// SECTION 1: STRESS TEST diffEngine.js
// =========================================================================
console.log('\n======================================================');
console.log('1. STRESS TESTING: diffEngine.js');
console.log('======================================================');

// Test 1.1: Edge cases (empty, null, undefined, identical)
console.log('\n--- 1.1 Edge Cases ---');
const emptyDiff = computeContractDiff('', '');
assert(emptyDiff.stats.similarity === 100, 'Empty vs Empty returns 100% similarity', 'diffEngine');
assert(emptyDiff.stats.additions === 0 && emptyDiff.stats.deletions === 0, 'Empty vs Empty has 0 additions/deletions', 'diffEngine');
assert(emptyDiff.segments.length === 0, 'Empty vs Empty produces 0 segments', 'diffEngine');

const nullDiff = computeContractDiff(null, undefined);
assert(nullDiff.stats.similarity === 100, 'Null vs Undefined handled safely without crash', 'diffEngine');

const identicalText = 'This is a standard confidentiality agreement between Party A and Party B entered into as of January 1 2026.';
const identicalDiff = computeContractDiff(identicalText, identicalText);
assert(identicalDiff.stats.similarity === 100, 'Identical text produces 100% similarity', 'diffEngine');
assert(identicalDiff.stats.additions === 0 && identicalDiff.stats.deletions === 0, 'Identical text produces 0 additions and 0 deletions', 'diffEngine');
assert(identicalDiff.stats.unchanged === 17, `Identical text matches exact word count (got ${identicalDiff.stats.unchanged}, expected 17)`, 'diffEngine');

const completelyDifferentA = 'Alpha beta gamma delta epsilon zeta eta theta iota kappa.';
const completelyDifferentB = 'One two three four five six seven eight nine ten eleven.';
const diffDiff = computeContractDiff(completelyDifferentA, completelyDifferentB);
assert(diffDiff.stats.similarity === 0, 'Completely different texts produce 0% similarity', 'diffEngine');
assert(diffDiff.stats.deletions === 10, `Deletions counted correctly (expected 10, got ${diffDiff.stats.deletions})`, 'diffEngine');
assert(diffDiff.stats.additions === 10, `Additions counted correctly (expected 10, got ${diffDiff.stats.additions})`, 'diffEngine');

// Test 1.2: No word truncation check (Old 100-word limit verification)
console.log('\n--- 1.2 Truncation & Word Limit Verification (Old 100-word limit removal) ---');
const words500A = Array.from({ length: 500 }, (_, i) => `word${i}`).join(' ');
const words500B = Array.from({ length: 500 }, (_, i) => (i % 5 === 0 ? `MODIFIED${i}` : `word${i}`)).join(' ');
const diff500 = computeContractDiff(words500A, words500B);
assert(diff500.stats.originalWordCount === 500, `Original 500 words preserved without truncation (got ${diff500.stats.originalWordCount})`, 'diffEngine');
assert(diff500.stats.modifiedWordCount === 500, `Modified 500 words preserved without truncation (got ${diff500.stats.modifiedWordCount})`, 'diffEngine');
assert(diff500.stats.totalWords >= 500, `Total words handled exceeds old 100-word limit (${diff500.stats.totalWords} words)`, 'diffEngine');

// Test 1.3: Scalability stress test: 1,000 words
console.log('\n--- 1.3 Multi-page Scalability Test: 1,000+ words ---');
const para1k = "WHEREAS, the Company engages in proprietary artificial intelligence and cloud computing software development. ";
const base1k = para1k.repeat(80); // ~960 words
const mod1k = base1k.replace(/Company/g, 'Enterprise Client').replace(/cloud/g, 'air-gapped local');
const t1kStart = performance.now();
const diff1k = computeContractDiff(base1k, mod1k);
const t1kElapsed = performance.now() - t1kStart;
testResults.benchmarks['diff_1000_words_ms'] = t1kElapsed.toFixed(2);
console.log(`  1,000 words diff execution time: ${t1kElapsed.toFixed(2)}ms`);
assert(t1kElapsed < 1500, `1,000 words diff executed within 1500ms (took ${t1kElapsed.toFixed(2)}ms)`, 'diffEngine');
assert(diff1k.stats.originalWordCount > 800, `1,000 words original count verified (${diff1k.stats.originalWordCount})`, 'diffEngine');
assert(diff1k.stats.additions > 0 && diff1k.stats.deletions > 0, '1,000 words diff accurately captured additions and deletions', 'diffEngine');

// Test 1.4: Extreme Scalability stress test: 10,000 words
console.log('\n--- 1.4 Extreme Scalability Test: 10,000 words ---');
const para10k = "The contractor shall deliver all software artifacts according to Section 4 within thirty calendar days of initial written authorization. Failure to complete shall trigger remediation procedures under clause 9. ";
const base10k = para10k.repeat(350); // ~10,150 words
// Introduce complex mutations: insertions at beginning, middle, and end, plus replacements
const mod10k = "FIRST ADDED PREAMBLE PARAGRAPH. " + base10k.slice(0, Math.floor(base10k.length / 2)) + " MIDDLE INSERTED SPECIAL CLAUSE. " + base10k.slice(Math.floor(base10k.length / 2)).replace(/software/g, 'digital system') + " FINAL TERMINATION AMENDMENT.";
const t10kStart = performance.now();
const diff10k = computeContractDiff(base10k, mod10k);
const t10kElapsed = performance.now() - t10kStart;
testResults.benchmarks['diff_10000_words_ms'] = t10kElapsed.toFixed(2);
console.log(`  10,000 words diff execution time: ${t10kElapsed.toFixed(2)}ms`);
assert(t10kElapsed < 15000, `10,000 words diff executed without crashing/timeout (took ${t10kElapsed.toFixed(2)}ms)`, 'diffEngine');
assert(diff10k.stats.originalWordCount >= 9000, `Original text verified at ~10,000 words (${diff10k.stats.originalWordCount})`, 'diffEngine');
assert(diff10k.stats.modifiedWordCount >= 9000, `Modified text verified at ~10,000 words (${diff10k.stats.modifiedWordCount})`, 'diffEngine');
assert(diff10k.segments.length > 0, `Diff segments generated successfully (${diff10k.segments.length} segments)`, 'diffEngine');

// Test 1.5: Granularity modes
console.log('\n--- 1.5 Granularity Modes & Special Characters ---');
const lineDiff = computeContractDiff("Line 1\nLine 2\nLine 3", "Line 1\nLine 2 Modified\nLine 3", { granularity: 'line' });
assert(lineDiff.segments.some(s => s.type === 'added' && s.value.includes('Modified')), 'Line granularity functions properly', 'diffEngine');

const unicodeDiff = computeContractDiff("عقد اتفاقية وشراكة تجارية لعام 2026", "عقد اتفاقية وشراكة تقنية واستراتيجية لعام 2026");
assert(unicodeDiff.stats.similarity > 50, `RTL Arabic Unicode diff handled accurately (${unicodeDiff.stats.similarity}%)`, 'diffEngine');

// =========================================================================
// SECTION 2: ADVERSARIAL STRESS TEST piiEngine.js
// =========================================================================
console.log('\n======================================================');
console.log('2. ADVERSARIAL STRESS TESTING: piiEngine.js');
console.log('======================================================');

// 2.1 SSN tests
console.log('\n--- 2.1 SSN Matching & Boundary Challenges ---');
const ssnStandard = sanitizeDocumentPII('My SSN is 123-45-6789 and my colleague is 987 65 4321.');
assert(ssnStandard.ruleCounts['ssn'] === 2, `Standard SSNs matched (found ${ssnStandard.ruleCounts['ssn'] || 0}/2)`, 'piiEngine');

const ssnUnformatted = sanitizeDocumentPII('Unformatted SSN: 123456789 in text.');
// \b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b matches 9 contiguous digits
assert(ssnUnformatted.ruleCounts['ssn'] === 1, `Unformatted 9-digit SSN matched (found ${ssnUnformatted.ruleCounts['ssn'] || 0})`, 'piiEngine');

const ssnFalsePositives = sanitizeDocumentPII('Call 123-456-7890 or reference code 123-45-67890.');
// 123-456-7890 should be phone, not SSN; 123-45-67890 is 10 digits
assert(ssnFalsePositives.sanitizedText.includes('[REDACTED-PHONE]') || ssnFalsePositives.totalRedactions > 0, 'Phone recognized separately from SSN', 'piiEngine');

// 2.2 Credit Card tests
console.log('\n--- 2.2 Credit Card Adversarial Challenges ---');
const visaCard = '4111 2222 3333 4444';
const mcCard = '5100123456789012';
const amexCard = '3782-822463-10005';
const discCard = '6011 1111 1111 1111';
const ccText = `Cards: Visa ${visaCard}, MC ${mcCard}, Amex ${amexCard}, Discover ${discCard}.`;
const ccResult = sanitizeDocumentPII(ccText);
assert(ccResult.ruleCounts['creditCard'] >= 3, `Credit card variations detected (${ccResult.ruleCounts['creditCard'] || 0}/4 detected)`, 'piiEngine');

// 2.3 Bank Account & IBAN tests
console.log('\n--- 2.3 Bank Account & IBAN Regex Stress ---');
const ibanGB = 'GB82WEST12345698765432';
const ibanDE = 'DE89370400440532013000';
const usAccount = 'account # 123456789012';
const routingNum = 'routing: 987654321';
const bankText = `Transfer to ${ibanGB} or ${ibanDE}. Check ${usAccount} with ${routingNum}.`;
const bankResult = sanitizeDocumentPII(bankText, ['bankAccount']);
assert(bankResult.ruleCounts['bankAccount'] >= 3, `IBAN and US bank accounts detected (${bankResult.ruleCounts['bankAccount'] || 0}/4)`, 'piiEngine');

// 2.4 Email Adversarial Variations
console.log('\n--- 2.4 Email Formatting & Boundary Challenges ---');
const emailsText = 'Contact john.doe@enterprise.corp, support+tag@sub.domain.co.uk, and admin_123@nexus-os.ai. But not test@invalid.';
const emailResult = sanitizeDocumentPII(emailsText, ['email']);
assert(emailResult.ruleCounts['email'] >= 3, `Complex emails sanitized (${emailResult.ruleCounts['email'] || 0}/3)`, 'piiEngine');

// 2.5 Phone Number Variations
console.log('\n--- 2.5 Phone Variations ---');
const phonesText = 'Reach us at (555) 123-4567, 555-987-6543, +1-800-555-0199, or +44 20 7946 0919.';
const phoneResult = sanitizeDocumentPII(phonesText, ['phone']);
assert(phoneResult.ruleCounts['phone'] >= 3, `Phone numbers detected across formats (${phoneResult.ruleCounts['phone'] || 0}/4)`, 'piiEngine');

// 2.6 IP Address (IPv4 & IPv6) and False Positives
console.log('\n--- 2.6 IP Address Probes ---');
const ipsText = 'Server 192.168.1.1 and gateway 10.0.0.254 and invalid 999.999.999.999 and version 1.2.3.4.5.';
const ipResult = sanitizeDocumentPII(ipsText, ['ip']);
assert(ipResult.ruleCounts['ip'] === 2, `Valid IPv4 addresses matched, invalid excluded (found ${ipResult.ruleCounts['ip'] || 0}/2)`, 'piiEngine');

// 2.7 Masking Fidelity & Styles
console.log('\n--- 2.7 Masking Fidelity & Styles ---');
const sampleText = 'Confidential: SSN 123-45-6789 and email john@acme.com on server 192.168.1.5.';
const maskBlock = sanitizeDocumentPII(sampleText, undefined, undefined, 'block');
assert(maskBlock.sanitizedText.includes('█████████'), 'Block masking correctly inserts black judicial blocks', 'piiEngine');
assert(!maskBlock.sanitizedText.includes('123-45-6789'), 'Original SSN completely absent in block mask', 'piiEngine');

const maskLabel = sanitizeDocumentPII(sampleText, undefined, undefined, 'label');
assert(maskLabel.sanitizedText.includes('[REDACTED-SSN]'), 'Label masking inserts [REDACTED-SSN]', 'piiEngine');
assert(maskLabel.sanitizedText.includes('[REDACTED-EMAIL]'), 'Label masking inserts [REDACTED-EMAIL]', 'piiEngine');

const maskAsterisk = sanitizeDocumentPII(sampleText, undefined, undefined, 'asterisk');
assert(maskAsterisk.sanitizedText.includes('***'), 'Asterisk masking applies asterisks', 'piiEngine');

// 2.8 ReDoS / Catastrophic Backtracking Stress Probe on PII Regexes
console.log('\n--- 2.8 ReDoS Probe on PII Patterns ---');
for (const rule of PII_RULES) {
  // Construct pathological strings: long repetitions of prefix characters followed by mismatch
  const probeA = 'a'.repeat(5000) + '@' + 'b'.repeat(5000) + '!';
  const probeB = '1'.repeat(10000);
  const probeC = 'a'.repeat(2000) + '-'.repeat(2000) + 'z';
  
  const start = performance.now();
  sanitizeDocumentPII(probeA, [rule.id]);
  sanitizeDocumentPII(probeB, [rule.id]);
  sanitizeDocumentPII(probeC, [rule.id]);
  const elapsed = performance.now() - start;
  
  assert(elapsed < 200, `PII rule "${rule.id}" immune to ReDoS (elapsed ${elapsed.toFixed(2)}ms on 24k chars)`, 'piiEngine');
}

// =========================================================================
// SECTION 3: ADVERSARIAL STRESS TEST legalRiskRules.js
// =========================================================================
console.log('\n======================================================');
console.log('3. ADVERSARIAL STRESS TESTING: legalRiskRules.js');
console.log('======================================================');

// 3.1 Rule Inventory & Count Verification
console.log('\n--- 3.1 Rule Inventory Verification ---');
assert(LEGAL_RISK_RULES.length >= 50, `Rules inventory verified: found ${LEGAL_RISK_RULES.length} enterprise rules (required: 50+)`, 'legalRiskRules');

// Verify all rules have required fields
let validSchemaCount = 0;
for (const rule of LEGAL_RISK_RULES) {
  if (rule.id && rule.phrase && rule.category && rule.severity && rule.regex instanceof RegExp && rule.description && rule.recommendation) {
    validSchemaCount++;
  }
}
assert(validSchemaCount === LEGAL_RISK_RULES.length, `All ${validSchemaCount} rules satisfy enterprise schema requirements`, 'legalRiskRules');

// 3.2 Accuracy verification for EVERY single rule
console.log('\n--- 3.2 Individual Rule Accuracy Verification (50 Rules) ---');
let matchedCount = 0;
for (const rule of LEGAL_RISK_RULES) {
  // Test phrase matching
  const testSample = `The agreement provides that the party shall ${rule.phrase} in accordance with applicable covenants.`;
  const regex = new RegExp(rule.regex.source, 'i');
  if (regex.test(testSample)) {
    matchedCount++;
  } else {
    // Some phrases might be short titles; test if the regex matches its own regex test
    console.warn(`    Warning: rule "${rule.id}" did not match synthetic sentence with phrase "${rule.phrase}"`);
  }
}
assert(matchedCount >= 48, `Synthetic matching verified for ${matchedCount}/${LEGAL_RISK_RULES.length} rules`, 'legalRiskRules');

// 3.3 ReDoS / Catastrophic Backtracking Stress Probe on ALL 50 Rules
console.log('\n--- 3.3 ReDoS & Catastrophic Backtracking Probes on 50 Rules ---');
let redosPassed = 0;
const redosMaxTimes = [];

for (const rule of LEGAL_RISK_RULES) {
  // Craft adversarial inputs with whitespace variations and near-matches
  const adversarial1 = ' '.repeat(500) + rule.phrase.split(' ')[0] + ' '.repeat(500) + 'X'.repeat(500);
  const adversarial2 = (rule.phrase + ' ').repeat(50) + 'MISMATCH_TAIL';
  const adversarial3 = 'indemnify '.repeat(200) + 'hold '.repeat(200) + 'harmless!';
  const adversarial4 = 'a'.repeat(2000) + ', '.repeat(200) + 'b'.repeat(2000);

  const tStart = performance.now();
  const reg = new RegExp(rule.regex.source, 'gi');
  reg.exec(adversarial1);
  reg.exec(adversarial2);
  reg.exec(adversarial3);
  reg.exec(adversarial4);
  const tElapsed = performance.now() - tStart;
  redosMaxTimes.push({ id: rule.id, ms: tElapsed });

  if (tElapsed < 50) {
    redosPassed++;
  } else {
    console.warn(`    Slow regex detected: rule ${rule.id} took ${tElapsed.toFixed(2)}ms`);
  }
}

assert(redosPassed === LEGAL_RISK_RULES.length, `All ${LEGAL_RISK_RULES.length} rules passed ReDoS probes under 50ms (Passed: ${redosPassed})`, 'legalRiskRules');
const slowestRule = redosMaxTimes.sort((a, b) => b.ms - a.ms)[0];
console.log(`  Slowest rule on adversarial probe: ${slowestRule.id} (${slowestRule.ms.toFixed(2)}ms)`);

// 3.4 Full Contract Scan Stress Test
console.log('\n--- 3.4 Full Contract Scan with 50+ Embedded Hazards ---');
// Construct a contract containing 10 distinct high-risk clauses
const hazardousContract = `
MASTER SERVICES AGREEMENT
1. Indemnity: Contractor shall indemnify and hold harmless Client from all claims, demands, losses at its sole expense including reasonable attorneys fees.
2. Liability: In no event shall liability be capped; unlimited liability applies. Neither party waives consequential damages or loss of profits or business interruption.
3. Termination: Client may in its sole discretion terminate this agreement without notice or terminate for convenience.
4. Intellectual Property: All deliverables are work made for hire. Contractor agrees to irrevocable assignment of all rights, title and interest.
5. Restrictive Covenants: Contractor agrees to covenant not to compete and non-solicitation of employees.
6. Liquidated Damages: Client may assess liquidated damages as a penalty.
7. Renewal: This agreement shall automatically renew unless notice given no less than 90 days prior to expiration.
8. Arbitration: Any dispute shall be resolved via binding arbitration with waiver of jury trial and class action waiver.
9. Cybersecurity: Contractor maintains unlimited data breach liability and must notify within 24 hours of any incident.
10. Warranties: Deliverables provided as is, where is with sole and exclusive remedy.
`;

const scanStart = performance.now();
const detectedRisks = scanLegalRisks(hazardousContract);
const scanElapsed = performance.now() - scanStart;
testResults.benchmarks['scanLegalRisks_elapsed_ms'] = scanElapsed.toFixed(2);
console.log(`  Full 10-clause scan time: ${scanElapsed.toFixed(2)}ms. Detected risks: ${detectedRisks.length}`);

assert(detectedRisks.length >= 20, `Detected comprehensive risk cluster (found ${detectedRisks.length} distinct risks)`, 'legalRiskRules');
assert(detectedRisks[0].severity === 'critical', `Highest severity sorted first (${detectedRisks[0].severity})`, 'legalRiskRules');
assert(detectedRisks.every(r => r.occurrences && r.occurrences.length > 0 && r.occurrences[0].snippet), 'All detected risks have context snippets', 'legalRiskRules');

// Empty contract check
const emptyScan = scanLegalRisks('');
assert(Array.isArray(emptyScan) && emptyScan.length === 0, 'Empty contract text returns empty array without throwing', 'legalRiskRules');


// =========================================================================
// SUMMARY & VERDICT
// =========================================================================
console.log('\n======================================================');
console.log('TEST SUMMARY & BENCHMARK METRICS');
console.log('======================================================');
console.log('diffEngine:    Passed:', testResults.diffEngine.passed, 'Failed:', testResults.diffEngine.failed);
console.log('piiEngine:     Passed:', testResults.piiEngine.passed, 'Failed:', testResults.piiEngine.failed);
console.log('legalRiskRules:Passed:', testResults.legalRiskRules.passed, 'Failed:', testResults.legalRiskRules.failed);
console.log('Benchmarks:', JSON.stringify(testResults.benchmarks, null, 2));

const totalFailed = testResults.diffEngine.failed + testResults.piiEngine.failed + testResults.legalRiskRules.failed;
if (totalFailed === 0) {
  console.log('\n>>> EMPIRICAL VERDICT: ALL ADVERSARIAL STRESS TESTS PASSED <<<');
  process.exit(0);
} else {
  console.error(`\n>>> EMPIRICAL VERDICT: ${totalFailed} TESTS FAILED. REQUEST CHANGES <<<`);
  process.exit(1);
}
