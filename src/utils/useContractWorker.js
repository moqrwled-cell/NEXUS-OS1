/**
 * Nexus ContractGuard Enterprise — Web Worker Management Hook
 * Connects React UI components to the background contractWorker thread with
 * real-time stage progress reporting and seamless direct asynchronous fallback.
 * 
 * Features:
 * - Air-gapped off-thread execution via dedicated Web Worker (ES Module).
 * - Automatic graceful fallback to direct asynchronous execution in non-worker environments.
 * - Reactive state tracking: isProcessing, progress, result, error.
 * - Cancellable analysis jobs.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { executeContractAnalysis } from '../workers/contractWorker.js';

export { executeContractAnalysis as executeContractAnalysisDirect } from '../workers/contractWorker.js';

/**
 * Custom React hook for contract audit worker communication.
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

  const workerRef = useRef(null);
  const activeJobIdRef = useRef(null);
  const pendingPromiseRef = useRef(null);

  // Helper to construct a fresh Worker instance
  const initWorker = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.Worker === 'undefined') {
      return null;
    }

    try {
      const worker = new Worker(new URL('../workers/contractWorker.js', import.meta.url), {
        type: 'module'
      });

      worker.onmessage = (event) => {
        const { id, type, stage, percent, msg, data, error: errMsg } = event.data || {};

        // Ignore messages from cancelled or obsolete jobs
        if (id && id !== activeJobIdRef.current) return;

        if (type === 'PROGRESS') {
          const progState = { stage, percent, msg };
          setProgress(progState);
          hookOptions.onProgress?.(progState);
        } else if (type === 'COMPLETE') {
          setIsProcessing(false);
          setProgress({ stage: 'COMPLETE', percent: 100, msg: 'Analysis complete.' });
          setResult(data);
          if (pendingPromiseRef.current) {
            pendingPromiseRef.current.resolve(data);
            pendingPromiseRef.current = null;
          }
        } else if (type === 'ERROR') {
          setIsProcessing(false);
          setError(errMsg || 'An error occurred during contract audit.');
          if (pendingPromiseRef.current) {
            pendingPromiseRef.current.reject(new Error(errMsg));
            pendingPromiseRef.current = null;
          }
        }
      };

      worker.onerror = (errEvent) => {
        setIsProcessing(false);
        const errText = errEvent?.message || 'Worker thread execution error';
        setError(errText);
        if (pendingPromiseRef.current) {
          pendingPromiseRef.current.reject(new Error(errText));
          pendingPromiseRef.current = null;
        }
      };

      return worker;
    } catch (err) {
      console.warn('Web Worker creation failed; falling back to direct async mode:', err);
      return null;
    }
  }, [hookOptions]);

  // Mount/unmount lifecycle for Web Worker
  useEffect(() => {
    workerRef.current = initWorker();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      activeJobIdRef.current = null;
      pendingPromiseRef.current = null;
    };
  }, [initWorker]);

  /**
   * Dispatches a contract analysis job.
   * Runs inside the Web Worker thread if available, or seamlessly via direct async fallback.
   * 
   * @param {Object} payload - { text, baselineText, mode, clientParty, counterparty, options }
   * @returns {Promise<Object>}
   */
  const runAnalysis = useCallback(async (payload) => {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    activeJobIdRef.current = jobId;

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress({ stage: 'INIT', percent: 0, msg: 'Preparing contract audit engine...' });

    // Mode A: Web Worker execution (browser environment)
    if (workerRef.current) {
      return new Promise((resolve, reject) => {
        pendingPromiseRef.current = { resolve, reject };
        workerRef.current.postMessage({
          id: jobId,
          type: 'ANALYZE_CONTRACT',
          payload
        });
      });
    }

    // Mode B: Direct asynchronous execution fallback (Node.js / unsupported worker)
    try {
      const data = await executeContractAnalysis(payload, (stage, percent, msg) => {
        if (activeJobIdRef.current === jobId) {
          const progState = { stage, percent, msg };
          setProgress(progState);
          hookOptions.onProgress?.(progState);
        }
      });

      if (activeJobIdRef.current === jobId) {
        setIsProcessing(false);
        setProgress({ stage: 'COMPLETE', percent: 100, msg: 'Analysis complete.' });
        setResult(data);
        return data;
      }
      return null;
    } catch (err) {
      if (activeJobIdRef.current === jobId) {
        setIsProcessing(false);
        const errMsg = err?.message || String(err);
        setError(errMsg);
        throw err;
      }
      return null;
    }
  }, [hookOptions]);

  /**
   * Cancels the currently running analysis and resets worker thread.
   */
  const cancelAnalysis = useCallback(() => {
    if (activeJobIdRef.current) {
      activeJobIdRef.current = null;

      if (pendingPromiseRef.current) {
        pendingPromiseRef.current.reject(new Error('Contract audit canceled by user.'));
        pendingPromiseRef.current = null;
      }

      setIsProcessing(false);
      setProgress(null);

      // Reset and respawn the worker thread to purge any long-running tasks
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = initWorker();
      }
    }
  }, [initWorker]);

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
