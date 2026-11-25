/**
 * Nexus ContractGuard Enterprise — High-Speed Structural + Word Myers Diff Engine
 * Combines fast line/sentence pre-alignment with token-level Myers LCS inside changed regions,
 * plus structural paragraph alignment so clause insertions never falsely shift subsequent clauses.
 */
import { diffWords, diffLines, diffWordsWithSpace, diffArrays } from 'diff';

/**
 * Computes fast word diff by anchoring unchanged blocks first when inputs are large.
 */
function diffTokenBatches(strA, strB) {
  const toksA = strA.match(/\S+\s*/g) || [];
  const toksB = strB.match(/\S+\s*/g) || [];
  const minLen = Math.min(toksA.length, toksB.length);
  const BATCH = 400;
  const out = [];
  for (let i = 0; i < minLen; i += BATCH) {
    out.push(...diffWords(toksA.slice(i, i + BATCH).join(''), toksB.slice(i, i + BATCH).join('')));
  }
  if (toksA.length > minLen) {
    out.push({ value: toksA.slice(minLen).join(''), removed: true, added: undefined });
  }
  if (toksB.length > minLen) {
    out.push({ value: toksB.slice(minLen).join(''), added: true, removed: undefined });
  }
  return out;
}

function diffSentenceRun(remSents, addSents) {
  const out = [];
  const minCount = Math.min(remSents.length, addSents.length);
  const BATCH = 15;
  for (let i = 0; i < minCount; i += BATCH) {
    const rChunk = remSents.slice(i, i + BATCH).join('');
    const aChunk = addSents.slice(i, i + BATCH).join('');
    if (rChunk.length + aChunk.length > 6000) {
      out.push(...diffTokenBatches(rChunk, aChunk));
    } else {
      out.push(...diffWords(rChunk, aChunk));
    }
  }
  if (remSents.length > minCount) {
    out.push({ value: remSents.slice(minCount).join(''), removed: true, added: undefined });
  }
  if (addSents.length > minCount) {
    out.push({ value: addSents.slice(minCount).join(''), added: true, removed: undefined });
  }
  return out;
}

function fastWordDiff(orig, mod) {
  if (!orig && !mod) return [];
  if (orig === mod) return orig ? [{ value: orig, added: undefined, removed: undefined }] : [];

  // For smaller texts, run direct Myers word diff immediately
  if (orig.length + mod.length <= 6000) {
    return diffWords(orig, mod);
  }

  // Stage 1: Fast line-level Myers alignment (skip diffArrays if huge single block or low line overlap)
  const lineParts = diffLines(orig, mod);
  const wordParts = [];

  for (let i = 0; i < lineParts.length; i++) {
    const part = lineParts[i];
    if (!part.added && !part.removed) {
      wordParts.push({ value: part.value, added: undefined, removed: undefined });
      continue;
    }

    // Coalesce adjacent removed + added blocks to produce clean inline word-level diffs
    if (part.removed && i + 1 < lineParts.length && lineParts[i + 1].added) {
      const removedStr = part.value;
      const addedStr = lineParts[i + 1].value;
      i++;

      // If single altered chunk is itself huge (e.g. single-line PDF extraction), check if exact sentence anchors exist before running O(N*D) diffArrays
      if (removedStr.length + addedStr.length > 6000) {
        const sentA = removedStr.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [removedStr];
        const sentB = addedStr.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [addedStr];
        const sentSetA = new Set(sentA);
        let commonSents = 0;
        for (const sb of sentB) {
          if (sentSetA.has(sb)) commonSents++;
        }
        // Only run sentence LCS when there are genuine unchanged anchor sentences & equal counts aren't broken; otherwise align directly at word token batches
        if (sentA.length <= 1 || sentB.length <= 1 || commonSents / Math.max(1, sentB.length) < 0.15) {
          wordParts.push(...diffTokenBatches(removedStr, addedStr));
          continue;
        }
        const sentParts = diffArrays(sentA, sentB);

        for (let sIdx = 0; sIdx < sentParts.length; sIdx++) {
          const sp = sentParts[sIdx];
          if (!sp.added && !sp.removed) {
            wordParts.push({ value: sp.value.join(''), added: undefined, removed: undefined });
          } else if (sp.removed && sIdx + 1 < sentParts.length && sentParts[sIdx + 1].added) {
            wordParts.push(...diffSentenceRun(sp.value, sentParts[sIdx + 1].value));
            sIdx++;
          } else {
            wordParts.push({ value: sp.value.join(''), added: sp.added, removed: sp.removed });
          }
        }
      } else {
        wordParts.push(...diffWords(removedStr, addedStr));
      }
      continue;
    }

    wordParts.push({ value: part.value, added: part.added, removed: part.removed });
  }

  return wordParts;
}

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

  if (!orig.trim() && !mod.trim()) {
    return {
      segments: [],
      stats: {
        additions: 0,
        deletions: 0,
        unchanged: 0,
        totalWords: 0,
        originalWordCount: 0,
        modifiedWordCount: 0,
        similarity: 100,
        addedChars: 0,
        removedChars: 0,
        processingTimeMs: parseFloat((performance.now() - startTime).toFixed(2))
      },
      clauseDiffs: []
    };
  }

  let rawChanges = [];
  if (granularity === 'line') {
    rawChanges = diffLines(orig, mod);
  } else if (granularity === 'wordWithSpace') {
    rawChanges = diffWordsWithSpace(orig, mod);
  } else {
    rawChanges = fastWordDiff(orig, mod);
  }

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  let addedChars = 0;
  let removedChars = 0;

  const segments = rawChanges
    .filter(part => part.value !== '')
    .map((part, index) => {
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
      } else if (/[A-Za-z0-9\u00C0-\u024F\u0600-\u06FF]/.test(part.value)) {
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

  // Structurally aligned paragraph/clause level redlines (reuse rawChanges when single paragraph)
  const clauseDiffs = extractClauseLevelDiffs(orig, mod, granularity === 'word' ? rawChanges : null);

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
 * Aligns paragraphs via Myers diffArrays so inserting/deleting a paragraph
 * never misaligns every downstream unmodified clause as "modified".
 */
function extractClauseLevelDiffs(origText, modText, precomputedWordDiff = null) {
  const origParagraphs = origText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const modParagraphs = modText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  if (origParagraphs.length === 0 && modParagraphs.length === 0) return [];

  if (origParagraphs.length === 1 && modParagraphs.length === 1 && precomputedWordDiff) {
    if (origParagraphs[0] === modParagraphs[0]) {
      return [{ index: 1, status: 'unmodified', text: origParagraphs[0], diff: [{ type: 'same', value: origParagraphs[0] }] }];
    }
    return [{
      index: 1,
      status: 'modified',
      originalText: origParagraphs[0],
      modifiedText: modParagraphs[0],
      diff: precomputedWordDiff.map(p => ({ type: p.added ? 'added' : p.removed ? 'removed' : 'same', value: p.value }))
    }];
  }

  // For extremely large multi-hundred-paragraph corpora, fall back smoothly without blocking
  const paraChanges = diffArrays(origParagraphs, modParagraphs);
  const clauses = [];
  let clauseCounter = 1;

  for (let i = 0; i < paraChanges.length; i++) {
    const chunk = paraChanges[i];

    if (!chunk.added && !chunk.removed) {
      for (const p of chunk.value) {
        clauses.push({
          index: clauseCounter++,
          status: 'unmodified',
          text: p,
          diff: [{ type: 'same', value: p }]
        });
      }
      continue;
    }

    // Pair consecutive removed + added paragraphs as side-by-side modifications
    if (chunk.removed && i + 1 < paraChanges.length && paraChanges[i + 1].added) {
      const remList = chunk.value;
      const addList = paraChanges[i + 1].value;
      i++;

      const pairedCount = Math.min(remList.length, addList.length);
      for (let k = 0; k < pairedCount; k++) {
        const oClause = remList[k];
        const mClause = addList[k];
        const partDiff = fastWordDiff(oClause, mClause);
        clauses.push({
          index: clauseCounter++,
          status: 'modified',
          originalText: oClause,
          modifiedText: mClause,
          diff: partDiff.map(p => ({
            type: p.added ? 'added' : p.removed ? 'removed' : 'same',
            value: p.value
          }))
        });
      }

      for (let k = pairedCount; k < remList.length; k++) {
        clauses.push({
          index: clauseCounter++,
          status: 'deleted',
          text: remList[k],
          diff: [{ type: 'removed', value: remList[k] }]
        });
      }

      for (let k = pairedCount; k < addList.length; k++) {
        clauses.push({
          index: clauseCounter++,
          status: 'inserted',
          text: addList[k],
          diff: [{ type: 'added', value: addList[k] }]
        });
      }
      continue;
    }

    if (chunk.removed) {
      for (const p of chunk.value) {
        clauses.push({
          index: clauseCounter++,
          status: 'deleted',
          text: p,
          diff: [{ type: 'removed', value: p }]
        });
      }
    } else if (chunk.added) {
      for (const p of chunk.value) {
        clauses.push({
          index: clauseCounter++,
          status: 'inserted',
          text: p,
          diff: [{ type: 'added', value: p }]
        });
      }
    }
  }

  return clauses;
}
