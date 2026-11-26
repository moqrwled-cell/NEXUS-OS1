/**
 * Nexus ContractGuard — Deterministic Extracted Text & PDF Layout Normalizer
 * Eliminates score divergence across .txt, .docx, .pdf, and scanned OCR images
 * by restoring visual reading order and rejoining soft mid-sentence line wraps
 * without disturbing intentional clause numbers, headings, or signature blocks.
 */

const REAL_HYPHEN_PREFIX_RE = /(?:^|[\s(])(?:non|pre|post|co|sub|re|anti|self|multi|third|cross|counter|semi|mid|inter|intra|quasi|ultra|one|two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)-$/i;

const NEW_BLOCK_START_RE = /^(?:#{1,6}\s+)?(?:ARTICLE\b|SECTION\b|CLAUSE\b|PART\b|EXHIBIT\b|SCHEDULE\b|APPENDIX\b|ANNEX\b|ATTACHMENT\b|RECITALS\b|WITNESSETH\b|NOW,?\s+THEREFORE\b|WHEREAS\b|IN\s+WITNESS\s+WHEREOF\b|SIGNATORIES\b|FORMAL\s+NOTARY\b|\d+(?:\.\d+)*[.\):](?:\s|$)|\([a-z0-9]{1,4}\)\s|[IVXLCDM]+\.\s|[•▪●\*]\s|(?:By|Name|Title|Date|Address|Phone|Email|Effective\s+Date|Maturity\s+Date|Closing\s+Date|Principal\s+Amount|SELLER|BUYER|LANDLORD|TENANT|CUSTOMER|PROVIDER|COMPANY|CONTRACTOR|EXECUTIVE|BORROWER|LENDER|PARTY\s+[AB]|TO|FROM|RE|ATTN)\s*:)/i;

const SIGNATURE_OR_FORM_LINE_RE = /(?:_{3,}|^\s*(?:By|Name|Title|Date|Address|Phone|Email|Tax\s+ID|EIN|APN|Effective\s+Date|Maturity\s+Date|Principal\s+Amount|SELLER|BUYER|LANDLORD|TENANT|CUSTOMER|PROVIDER|MANAGER|MEMBERS|TO|FROM|RE|ATTN)\s*:)/i;

const ABBREV_ENDING_RE = /\b(?:Inc|Corp|Ltd|Co|L\.L\.C|L\.P|P\.C|P\.A|No|Sec|Art|Reg|Dr|Mr|Ms|Mrs|vs|v|al)\.$/i;

const PAGE_FOOTER_RE = /^(?:Page\s+\d+(?:\s+(?:of|\/)\s+\d+)?|-\s*\d+\s*-|\[\s*Page\s+\d+[^\]]*\]|\d+\s+of\s+\d+)$/i;

/**
 * Sorts raw PDF.js textContent.items into visual reading order (top-to-bottom, left-to-right)
 * and reconstructs clean lines preserving column spacing for signature blocks and schedules.
 *
 * @param {Array<Object>} items
 * @returns {string}
 */
export function normalizePdfPageItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const positioned = [];
  for (const item of items) {
    if (!item || typeof item.str !== 'string') continue;
    if (item.str.length === 0 && !item.hasEOL) continue;
    const x = Array.isArray(item.transform) ? (item.transform[4] ?? 0) : 0;
    const y = Array.isArray(item.transform) ? (item.transform[5] ?? 0) : 0;
    const width = typeof item.width === 'number' ? item.width : item.str.length * 4;
    positioned.push({ str: item.str, x, y, width, hasEOL: !!item.hasEOL });
  }

  if (positioned.length === 0) return '';

  // Sort top-to-bottom (higher PDF Y = higher on page) then left-to-right (lower X = left)
  positioned.sort((a, b) => {
    const dy = b.y - a.y;
    if (Math.abs(dy) > 3.8) return dy;
    return a.x - b.x;
  });

  // Cluster items into visual horizontal rows
  const rows = [];
  let currentRow = [positioned[0]];
  let currentRowY = positioned[0].y;

  for (let i = 1; i < positioned.length; i++) {
    const it = positioned[i];
    if (Math.abs(it.y - currentRowY) <= 3.8) {
      currentRow.push(it);
    } else {
      rows.push(currentRow);
      currentRow = [it];
      currentRowY = it.y;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  const rowStrings = [];
  for (const row of rows) {
    row.sort((a, b) => a.x - b.x);
    let line = '';
    let prevEndX = null;

    for (const seg of row) {
      const s = seg.str;
      if (!s) continue;
      if (prevEndX !== null) {
        const gap = seg.x - prevEndX;
        if (gap > 36 && !line.endsWith('   ')) {
          line += '    '; // preserve visual multi-column tabular/signature gaps
        } else if (gap > 1.5 && !line.endsWith(' ') && !s.startsWith(' ')) {
          line += ' ';
        }
      }
      line += s;
      prevEndX = seg.x + seg.width;
    }

    if (line.trim()) {
      rowStrings.push(line.replace(/[ \t]+$/g, ''));
    } else if (rowStrings.length > 0 && rowStrings[rowStrings.length - 1] !== '') {
      rowStrings.push('');
    }
  }

  return rowStrings.join('\n').trim();
}

/**
 * Normalizes PDF/OCR line wraps by rejoining mid-sentence wrapped lines while preserving
 * paragraphs, headings, numbered sections, lists, signature lines, and exhibits.
 *
 * @param {string} rawText
 * @param {{ mode?: 'pdf' | 'ocr' | 'docx' | 'plain' }} [options]
 * @returns {string}
 */
export function normalizeExtractedContractText(rawText = '', options = {}) {
  if (!rawText || typeof rawText !== 'string') return '';

  const mode = options.mode || 'pdf';

  let text = rawText
    .replace(/\r\n?/g, '\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ');

  if (mode === 'ocr') {
    // Normalize doubled ASCII single quotes sometimes emitted by OCR for quotation marks
    text = text
      .replace(/''/g, '"')
      .replace(/[ \t]*\|[ \t]*/g, '   ')
      .replace(/[ \t]{2,}/g, (m) => (m.length >= 4 ? '    ' : ' '));
  }

  // Filter out isolated repeating page footer lines while keeping empty lines for paragraph structure
  const rawLines = text.split('\n').map(l => l.replace(/[ \t]+$/g, ''));
  const filteredLines = rawLines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return true;
    return !PAGE_FOOTER_RE.test(trimmed);
  });

  if (mode === 'docx' || mode === 'plain') {
    return filteredLines.join('\n').trim();
  }

  const outLines = [];

  for (let i = 0; i < filteredLines.length; i++) {
    const curRaw = filteredLines[i];
    const cur = curRaw.trim();

    if (outLines.length === 0) {
      outLines.push(cur);
      continue;
    }

    const prev = outLines[outLines.length - 1];
    if (!cur || !prev) {
      // Collapse consecutive blank lines to at most one blank line
      if (!(cur === '' && prev === '')) {
        outLines.push(cur);
      }
      continue;
    }

    const prevTrim = prev.trim();

    // Decide whether `cur` is a continuation of a soft visual wrap from `prevTrim`
    const isNextNewBlock =
      NEW_BLOCK_START_RE.test(cur) ||
      SIGNATURE_OR_FORM_LINE_RE.test(cur) ||
      (cur.length <= 75 && cur === cur.toUpperCase() && /[A-Z]{2}/.test(cur));

    const isPrevStandaloneHeading =
      prevTrim.length <= 75 &&
      !/[.;:,]$/.test(prevTrim) &&
      (
        (prevTrim === prevTrim.toUpperCase() && /[A-Z]{2}/.test(prevTrim)) ||
        /^(?:ARTICLE|SECTION|CLAUSE|PART|EXHIBIT|SCHEDULE|APPENDIX|ANNEX|ATTACHMENT|\d+(?:\.\d+)*\.)\s+[A-Z0-9\s\-–—&:]+$/.test(prevTrim)
      ) &&
      !/\b(?:shall|must|may|agrees?|covenants?|means|between|and|of|to|for|by|in|on|with|under|that|which|from|as|the|a|an)$/i.test(prevTrim);

    const isPrevSignatureOrForm = SIGNATURE_OR_FORM_LINE_RE.test(prevTrim);

    const prevEndsSentence =
      /[.!?;:]$/.test(prevTrim) &&
      !(ABBREV_ENDING_RE.test(prevTrim) && /^(?:["“'‘(\[]|[a-z]|and\b|or\b|a\b|the\b|as\b|in\b|of\b|to\b|for\b|whose\b|with\b|under\b|located\b|organized\b|("))/i.test(cur));

    if (!isNextNewBlock && !isPrevStandaloneHeading && !isPrevSignatureOrForm && !prevEndsSentence) {
      // Rejoin soft-wrapped prose line
      if (/[A-Za-z]-$/.test(prevTrim) && /^[a-z]/.test(cur)) {
        if (REAL_HYPHEN_PREFIX_RE.test(prevTrim)) {
          outLines[outLines.length - 1] = `${prevTrim}${cur}`;
        } else {
          outLines[outLines.length - 1] = `${prevTrim.slice(0, -1)}${cur}`;
        }
      } else {
        outLines[outLines.length - 1] = `${prevTrim} ${cur}`;
      }
    } else {
      outLines.push(curRaw.trimStart());
    }
  }

  return outLines.join('\n').trim();
}
