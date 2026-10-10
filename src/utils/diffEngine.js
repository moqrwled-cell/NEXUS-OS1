/**
 * Nexus ContractGuard Enterprise — Authentic Myers LCS Diff Engine
 * High-performance, unlimited token comparison using industry-standard Myers LCS.
 * Zero main-thread blocking, zero word limits.
 */
import { diffWords, diffLines, diffWordsWithSpace } from 'diff';

/**
 * Computes comprehensive text diff between original and modified documents.
 * 
 * @param {string} originalText - The baseline document text
 * @param {string} modifiedText - The revised/amended document text
 * @param {Object} options - Configuration options
 * @param {'word' | 'line' | 'wordWithSpace'} [options.granularity='word'] - Diff granularity
 * @returns {Object} Comprehensive diff result including segments, statistics, and audit metrics
 */
export function computeContractDiff(originalText = '', modifiedText = '', options = {}) {
  const startTime = performance.now();
  const granularity = options.granularity || 'word';

  const orig = originalText || '';
  const mod = modifiedText || '';

  let rawChanges = [];
  if (granularity === 'line') {
    rawChanges = diffLines(orig, mod);
  } else if (granularity === 'wordWithSpace') {
    rawChanges = diffWordsWithSpace(orig, mod);
  } else {
    // Default: token-level word diff
    rawChanges = diffWords(orig, mod);
  }

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  let addedChars = 0;
  let removedChars = 0;

  const segments = rawChanges.map((part, index) => {
    const wordCount = part.value.trim() ? part.value.trim().split(/\s+/).length : 0;
    
    let type = 'same';
    if (part.added) {
      type = 'added';
      additions += wordCount;
      addedChars += part.value.length;
    } else if (part.removed) {
      type = 'removed';
      deletions += wordCount;
      removedChars += part.value.length;
    } else {
      unchanged += wordCount;
    }

    return {
      id: index,
      type,
      value: part.value,
      wordCount
    };
  });

  const totalWords = unchanged + additions + deletions;
  const originalWordCount = orig.trim() ? orig.trim().split(/\s+/).length : 0;
  const modifiedWordCount = mod.trim() ? mod.trim().split(/\s+/).length : 0;

  // Dice/Sørensen similarity coefficient
  const denominator = originalWordCount + modifiedWordCount;
  const similarity = denominator > 0
    ? Math.min(100, Math.max(0, parseFloat(((2 * unchanged / denominator) * 100).toFixed(1))))
    : 100;

  const processingTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  // Extract structured paragraph/clause level redlines
  const clauseDiffs = extractClauseLevelDiffs(orig, mod);

  return {
    segments,
    stats: {
      additions,
      deletions,
      unchanged,
      totalWords,
      originalWordCount,
      modifiedWordCount,
      similarity,
      addedChars,
      removedChars,
      processingTimeMs
    },
    clauseDiffs
  };
}

/**
 * Breaks documents down into paragraph/clause units for legal redline overview.
 */
function extractClauseLevelDiffs(origText, modText) {
  const origParagraphs = origText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const modParagraphs = modText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const clauses = [];
  const maxLen = Math.max(origParagraphs.length, modParagraphs.length);

  for (let i = 0; i < maxLen; i++) {
    const oClause = origParagraphs[i] || '';
    const mClause = modParagraphs[i] || '';

    if (!oClause && mClause) {
      clauses.push({ index: i + 1, status: 'inserted', text: mClause, diff: [{ type: 'added', value: mClause }] });
    } else if (oClause && !mClause) {
      clauses.push({ index: i + 1, status: 'deleted', text: oClause, diff: [{ type: 'removed', value: oClause }] });
    } else if (oClause === mClause) {
      clauses.push({ index: i + 1, status: 'unmodified', text: mClause, diff: [{ type: 'same', value: mClause }] });
    } else {
      const partDiff = diffWords(oClause, mClause);
      clauses.push({
        index: i + 1,
        status: 'modified',
        originalText: oClause,
        modifiedText: mClause,
        diff: partDiff.map(p => ({
          type: p.added ? 'added' : p.removed ? 'removed' : 'same',
          value: p.value
        }))
      });
    }
  }

  return clauses;
}
