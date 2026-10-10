/**
 * Nexus ContractGuard Enterprise — Dedicated Legal Integrity Web Worker
 * Off-main-thread processing engine importing M1 proofreading modules (R1–R4),
 * Myers LCS redline diff, and 50+ enterprise legal risk rules.
 * 
 * Protocol:
 * Incoming: { id, type: 'ANALYZE_CONTRACT', payload: { text, baselineText, mode, clientParty, counterparty, options } }
 * Outgoing:
 *   - Progress: { id, type: 'PROGRESS', stage: 'CROSS_REFS'|'DEFINED_TERMS'|'FINANCIAL_DATES'|'OBLIGATIONS'|'DIFF', percent: number, msg: string }
 *   - Complete: { id, type: 'COMPLETE', data: { crossRefs, definedTerms, financialDates, obligations, diff, risks, overallRiskScore, riskLevel, ... } }
 *   - Error:    { id, type: 'ERROR', error: string }
 */

import { validateCrossReferences } from '../utils/crossRefValidator.js';
import { auditDefinedTerms } from '../utils/definedTermsAuditor.js';
import { auditFinancialAndDates } from '../utils/financialDateAuditor.js';
import { extractObligations } from '../utils/obligationsExtractor.js';
import { computeContractDiff } from '../utils/diffEngine.js';
import { scanLegalRisks } from '../utils/legalRiskRules.js';

/**
 * Calculates a holistic risk score (0-100) based on detected issues across all proofreading engines.
 * 
 * @param {Object} results
 * @returns {{ score: number, level: 'low' | 'medium' | 'high' | 'critical', breakdown: Object }}
 */
export function calculateOverallRiskScore({ crossRefs, definedTerms, financialDates, obligations, risks }) {
  const criticalCrossRefs = crossRefs?.issues?.filter(i => i.severity === 'critical').length || 0;
  const warningCrossRefs = crossRefs?.issues?.filter(i => i.severity === 'warning').length || 0;

  const criticalDefined = definedTerms?.issues?.filter(i => i.severity === 'critical').length || 0;
  const warningDefined = definedTerms?.issues?.filter(i => i.severity === 'warning').length || 0;

  const criticalFinancial = financialDates?.issues?.filter(i => i.severity === 'critical').length || 0;
  const warningFinancial = financialDates?.issues?.filter(i => i.severity === 'warning').length || 0;

  const criticalRisks = risks?.filter(r => r.severity === 'critical').length || 0;
  const warningRisks = risks?.filter(r => r.severity === 'warning').length || 0;

  const highObligations = obligations?.obligations?.filter(o => o.severity === 'high').length || 0;

  const criticalTotal = criticalCrossRefs + criticalDefined + criticalFinancial + criticalRisks;
  const warningTotal = warningCrossRefs + warningDefined + warningFinancial + warningRisks;

  const pointsFromCritical = criticalTotal * 15;
  const pointsFromWarning = warningTotal * 4;
  const pointsFromObligations = Math.min(10, highObligations * 2);

  const rawScore = pointsFromCritical + pointsFromWarning + pointsFromObligations;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let level = 'low';
  if (score >= 75) {
    level = 'critical';
  } else if (score >= 45) {
    level = 'high';
  } else if (score >= 20) {
    level = 'medium';
  }

  return {
    score,
    level,
    breakdown: {
      criticalTotal,
      warningTotal,
      highObligations,
      criticalCrossRefs,
      criticalDefined,
      criticalFinancial,
      criticalRisks,
      warningCrossRefs,
      warningDefined,
      warningFinancial,
      warningRisks,
      pointsFromCritical,
      pointsFromWarning,
      pointsFromObligations,
      rawScore
    }
  };
}

/**
 * Executes full contract audit pipeline asynchronously with progressive stage notifications.
 * Can be called inside Web Worker or as direct asynchronous fallback.
 * 
 * @param {Object} payload - Analysis parameters
 * @param {Function} [onProgress] - Callback for staged progress events (stage, percent, msg)
 * @returns {Promise<Object>} Full analysis result data
 */
export async function executeContractAnalysis(payload = {}, onProgress = () => {}, abortSignal = null) {
  const startTime = performance.now();
  const text = typeof payload.text === 'string' ? payload.text : '';
  const baselineText = typeof payload.baselineText === 'string' ? payload.baselineText : '';
  const mode = payload.mode || (baselineText.trim() ? 'comparative' : 'single');
  const clientParty = payload.clientParty || '';
  const counterparty = payload.counterparty || '';
  const options = payload.options || {};

  const yieldTick = () => new Promise(resolve => setTimeout(resolve, 10));

  const checkAbort = () => {
    if (abortSignal && abortSignal.aborted) {
      const abortErr = new Error('Analysis aborted by user.');
      abortErr.name = 'AbortError';
      throw abortErr;
    }
  };

  checkAbort();

  // Stage 1: Cross-References & Exhibits (20%)
  onProgress('CROSS_REFS', 20, 'Indexing sections & cross-references...');
  await yieldTick();
  checkAbort();
  const crossRefs = validateCrossReferences(text);

  // Stage 2: Defined Terms & Boilerplate (40%)
  onProgress('DEFINED_TERMS', 40, 'Auditing defined terms & boilerplate...');
  await yieldTick();
  checkAbort();
  const definedTermsOptions = {
    parties: [clientParty, counterparty].filter(Boolean)
  };
  const definedTerms = auditDefinedTerms(text, definedTermsOptions);

  // Stage 3: Financial & Vital Dates (60%)
  onProgress('FINANCIAL_DATES', 60, 'Auditing financial figures & dates...');
  await yieldTick();
  checkAbort();
  const referenceDate = options.referenceDate ? new Date(options.referenceDate) : undefined;
  const financialDates = auditFinancialAndDates(text, referenceDate);

  // Stage 4: Obligations Extraction (80%)
  onProgress('OBLIGATIONS', 80, 'Extracting contractual obligations...');
  await yieldTick();
  checkAbort();
  const obligations = extractObligations(text, clientParty, counterparty);

  // Stage 5: Diff & Legal Risks (90%)
  onProgress('DIFF', 90, 'Computing Myers LCS redline diff & scanning risks...');
  await yieldTick();
  checkAbort();
  const risks = scanLegalRisks(text);

  let diff = null;
  if (mode === 'comparative' && baselineText.trim()) {
    diff = computeContractDiff(baselineText, text, options.diffOptions || {});
  }
  checkAbort();

  // Calculate holistic risk score
  const riskAssessment = calculateOverallRiskScore({
    crossRefs,
    definedTerms,
    financialDates,
    obligations,
    risks
  });

  const processingTimeMs = parseFloat((performance.now() - startTime).toFixed(2));
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split('\n').length;

  onProgress('COMPLETE', 100, 'Analysis complete.');

  return {
    mode,
    crossRefs,
    definedTerms,
    financialDates,
    obligations,
    diff,
    risks,
    overallRiskScore: riskAssessment.score,
    riskLevel: riskAssessment.level,
    riskBreakdown: riskAssessment.breakdown,
    meta: {
      wordCount,
      lineCount,
      processingTimeMs,
      timestamp: new Date().toISOString(),
      clientParty,
      counterparty
    }
  };
}

// ============================================================================
// Dedicated Web Worker Environment Listener (isolated from window)
// ============================================================================
if (typeof self !== 'undefined' && typeof window === 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = async (event) => {
    const { id, type, payload } = event.data || {};

    if (type === 'ANALYZE_CONTRACT') {
      try {
        const data = await executeContractAnalysis(payload, (stage, percent, msg) => {
          self.postMessage({
            id,
            type: 'PROGRESS',
            stage,
            percent,
            msg
          });
        });

        self.postMessage({
          id,
          type: 'COMPLETE',
          data
        });
      } catch (err) {
        self.postMessage({
          id,
          type: 'ERROR',
          error: err?.message || String(err)
        });
      }
    }
  };
}
