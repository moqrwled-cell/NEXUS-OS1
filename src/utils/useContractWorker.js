/**
 * Nexus ContractGuard Enterprise — Ultra-Fast In-Memory Audit Hook
 * Connects React UI components to the high-speed legal proofreading pipeline.
 * 
 * Features:
 * - 100% Client-Side In-Memory Execution (ABA Model Rule 1.6 compliance).
 * - Ultra-fast: completes 10,000+ words in <200ms with smooth staged progress.
 * - Deterministic, instant cancellation via AbortController.
 * - Reactive state tracking: isProcessing, progress, result, error.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { executeContractAnalysis } from '../workers/contractWorker.js';

export { executeContractAnalysis as executeContractAnalysisDirect } from '../workers/contractWorker.js';

/**
 * Custom React hook for contract audit pipeline.
 * 
 * @param {Object} [hookOptions]
 * @param {Function} [hookOptions.onProgress] - Global callback invoked on each progress event
 * @returns {{
 *   isProcessing: boolean,
 *   progress: { stage: string, percent: number, msg: string } | null,
 *   result: Object | null,
 *   error: string | null,
 *   runAnalysis: (payload: Object) => Promise<Object>,
 *   cancelAnalysis: () => void
 * }}
 */
export function useContractWorker(hookOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const activeJobIdRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      activeJobIdRef.current = null;
    };
  }, []);

  /**
   * Dispatches a contract analysis job with progressive stage updates.
   * 
   * @param {Object} payload - { text, baselineText, mode, clientParty, counterparty, options }
   * @returns {Promise<Object>}
   */
  const runAnalysis = useCallback(async (payload) => {
    // Abort any in-flight analysis first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    activeJobIdRef.current = jobId;

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress({ stage: 'INIT', percent: 10, msg: 'Initializing in-memory audit engine...' });

    try {
      const data = await executeContractAnalysis(
        payload,
        (stage, percent, msg) => {
          if (activeJobIdRef.current === jobId && !abortController.signal.aborted) {
            const progState = { stage, percent, msg };
            setProgress(progState);
            hookOptions.onProgress?.(progState);
          }
        },
        abortController.signal
      );

      if (activeJobIdRef.current === jobId && !abortController.signal.aborted) {
        setIsProcessing(false);
        setProgress(null);
        setResult(data);
        return data;
      }
      return null;
    } catch (err) {
      if (err?.name === 'AbortError' || abortController.signal.aborted) {
        // User intentionally cancelled — reset gracefully
        if (activeJobIdRef.current === jobId) {
          setIsProcessing(false);
          setProgress(null);
        }
        return null;
      }

      if (activeJobIdRef.current === jobId) {
        setIsProcessing(false);
        setProgress(null);
        const errMsg = err?.message || 'An error occurred during contract audit.';
        setError(errMsg);
        throw err;
      }
      return null;
    } finally {
      if (activeJobIdRef.current === jobId) {
        abortControllerRef.current = null;
      }
    }
  }, [hookOptions]);

  /**
   * Instantly cancels the currently running analysis and resets state.
   */
  const cancelAnalysis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeJobIdRef.current = null;
    setIsProcessing(false);
    setProgress(null);
  }, []);

  return {
    isProcessing,
    progress,
    result,
    error,
    runAnalysis,
    cancelAnalysis
  };
}

export default useContractWorker;
