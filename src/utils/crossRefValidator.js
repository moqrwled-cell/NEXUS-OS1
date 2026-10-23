/**
 * Nexus ContractGuard Enterprise — Cross-Reference & Exhibit Validator (R1)
 * 100% In-Browser Deterministic Legal Document Integrity Engine (ABA Rule 1.6 compliant).
 * 
 * Indexes sections, articles, clauses, exhibits, schedules, and appendices.
 * Scans internal citations, resolves compound references, filters statutory citations,
 * and detects broken cross-references, missing exhibits, and ambiguous references.
 */

// Roman numeral conversion map
const ROMAN_MAP = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/**
 * Converts Roman numerals (I through M) to integer.
 * @param {string} roman 
 * @returns {number | null}
 */
export function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') return null;
  const clean = roman.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(clean)) return null;
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const cur = ROMAN_MAP[clean[i]];
    const next = ROMAN_MAP[clean[i + 1]];
    if (next && next > cur) {
      total += (next - cur);
      i++;
    } else {
      total += cur;
    }
  }
  return total;
}

/**
 * Converts integer (1 through 50) to Roman numeral.
 * @param {number} num 
 * @returns {string}
 */
export function arabicToRoman(num) {
  if (!num || num < 1 || num > 50) return '';
  const lookup = [
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  let result = '';
  let n = num;
  for (const { value, symbol } of lookup) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

/**
 * Validates cross-references and exhibit citations in contract text.
 * @param {string} text - Raw document text
 * @returns {{
 *   indexedSections: Array<{ id: string; title: string; line: number }>;
 *   indexedExhibits: Array<{ id: string; title: string; line: number }>;
 *   citationsFound: Array<{ target: string; line: number; raw: string; type: string }>;
 *   issues: Array<{
 *     type: 'broken_reference' | 'missing_exhibit' | 'ambiguous_reference';
 *     referenceText: string;
 *     targetName: string;
 *     line: number;
 *     snippet: string;
 *     severity: 'critical' | 'warning';
 *   }>;
 *   stats: {
 *     totalIndexed: number;
 *     totalCitations: number;
 *     brokenCount: number;
 *     missingExhibitCount: number;
 *   };
 * }}
 */
export function validateCrossReferences(text = '') {
  if (!text || typeof text !== 'string') {
    return {
      indexedSections: [],
      indexedExhibits: [],
      citationsFound: [],
      issues: [],
      stats: { totalIndexed: 0, totalCitations: 0, brokenCount: 0, missingExhibitCount: 0 }
    };
  }

  const lines = text.split(/\r?\n/);
  const indexedSections = [];
  const indexedExhibits = [];
  const sectionIndex = new Map(); // normalized key -> { id, title, line }
  const exhibitIndex = new Map(); // normalized key -> { id, title, line }
  const headingLines = new Set();

  // Helper to index section under multiple lookup keys
  function registerSectionKey(key, entry) {
    if (!key) return;
    const cleanKey = key.trim().toLowerCase();
    if (!sectionIndex.has(cleanKey)) {
      sectionIndex.set(cleanKey, entry);
    }
  }

  // --------------------------------------------------------------------------
  // PASS 1: TARGET INDEXING (Headings, Articles, Sections, Exhibits, Schedules)
  // --------------------------------------------------------------------------
  // Regex 1: Exhibit / Schedule / Appendix / Annex / Attachment headings
  const RE_EXHIBIT_HEADING = /^(?:#{1,6}\s+)?(EXHIBIT|SCHEDULE|APPENDIX|ANNEX|ATTACHMENT)\s+([A-Z0-9]+(?:\.[0-9]+)*)(?:\s*[:—–-]\s*(.*)|\s+(.*))?$/i;

  // Regex 2: Explicit SECTION / ARTICLE / CLAUSE / PARAGRAPH / § headings
  const RE_EXPLICIT_SECTION = /^(?:#{1,6}\s+)?(?:SECTION|ARTICLE|CLAUSE|PARAGRAPH|§+)\s+([0-9]+(?:\.[0-9]+)*(?:\([a-z0-9]+\))*|[IVXLCDM]+)(?:[\.\:\s—–-]+(.*))?$/i;

  // Regex 3: Numbered decimal / roman headings at start of line: "1. SERVICES" or "1.1 Scope"
  const RE_NUMBERED_HEADING = /^(?:#{1,6}\s+)?([0-9]+(?:\.[0-9]+)*(?:\([a-z0-9]+\))*|[IVXLCDM]+)\.?(?:\s+([A-Z0-9\s—–\-_,;:'"()]{2,}))?$/;

  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (!trimmed) return;
    const lineNum = idx + 1;

    // 1. Check Exhibits / Schedules / Appendices (Line Heading & Inline Listings)
    const exhMatch = trimmed.match(RE_EXHIBIT_HEADING);
    if (exhMatch) {
      const type = exhMatch[1].toUpperCase();
      const rawId = exhMatch[2].trim();
      const title = (exhMatch[3] || exhMatch[4] || '').trim();
      const fullId = `${type} ${rawId}`;
      const entry = { id: fullId, title, line: lineNum };
      indexedExhibits.push(entry);

      // Register variations
      const normType = type.toLowerCase();
      const normRaw = rawId.toLowerCase();
      exhibitIndex.set(fullId.toUpperCase(), entry);
      exhibitIndex.set(`${normType} ${normRaw}`, entry);
      exhibitIndex.set(normRaw, entry);
      headingLines.add(lineNum);
      return;
    }

    // 1b. Support exhibits listed in schedules or signature exhibits summary
    const RE_INLINE_EXH = /\b(EXHIBIT|SCHEDULE|APPENDIX|ANNEX|ATTACHMENT)\s+([A-Z0-9]+(?:[\.\-_][A-Z0-9]+)*)(?:\s*[:—–-]\s*([^\n\r(]+?))?(?:\s*\((?:Attached|Incorporated|Appended|enclosed)\)|\s*\[|$)/gi;
    let inlineExhMatch;
    while ((inlineExhMatch = RE_INLINE_EXH.exec(trimmed)) !== null) {
      const type = inlineExhMatch[1].toUpperCase();
      const rawId = inlineExhMatch[2].trim();
      const title = (inlineExhMatch[3] || '').trim();
      const fullId = `${type} ${rawId}`;
      if (!exhibitIndex.has(fullId)) {
        const entry = { id: fullId, title, line: lineNum };
        indexedExhibits.push(entry);
        exhibitIndex.set(fullId, entry);
        exhibitIndex.set(`${type.toLowerCase()} ${rawId.toLowerCase()}`, entry);
        exhibitIndex.set(rawId.toLowerCase(), entry);
        headingLines.add(lineNum);
      }
    }

    // 2. Check Explicit Section / Article / Clause / §
    const secMatch = trimmed.match(RE_EXPLICIT_SECTION);
    if (secMatch) {
      const rawId = secMatch[1].trim();
      const title = (secMatch[2] || '').trim();
      const entry = { id: rawId, title, line: lineNum };
      indexedSections.push(entry);

      // Register multiple lookup aliases
      registerSectionKey(rawId, entry);
      registerSectionKey(`section ${rawId}`, entry);
      registerSectionKey(`article ${rawId}`, entry);
      registerSectionKey(`clause ${rawId}`, entry);
      registerSectionKey(`§ ${rawId}`, entry);

      const arabic = romanToArabic(rawId);
      if (arabic !== null) {
        registerSectionKey(String(arabic), entry);
        registerSectionKey(`section ${arabic}`, entry);
        registerSectionKey(`article ${arabic}`, entry);
      } else if (/^\d+$/.test(rawId)) {
        const numVal = parseInt(rawId, 10);
        const roman = arabicToRoman(numVal);
        if (roman) {
          registerSectionKey(roman, entry);
          registerSectionKey(`article ${roman}`, entry);
        }
      }

      headingLines.add(lineNum);
      return;
    }

    // 3. Check Decimal Subsection at start of line (e.g. "4.1 Initial Term. This Agreement..." or "1.1 Scope")
    const inlineDecMatch = trimmed.match(/^(?:#{1,6}\s+)?([0-9]+(?:\.[0-9]+)+(?:\([a-z0-9]+\))*)\.?\s+(?:([A-Za-z0-9\s—–\-_/]+?)\.\s+)?/);
    if (inlineDecMatch) {
      const rawId = inlineDecMatch[1].trim();
      const title = (inlineDecMatch[2] || '').trim();
      const entry = { id: rawId, title, line: lineNum };
      indexedSections.push(entry);

      registerSectionKey(rawId, entry);
      registerSectionKey(`section ${rawId}`, entry);
      registerSectionKey(`article ${rawId}`, entry);
      registerSectionKey(`clause ${rawId}`, entry);
      return;
    }

    // 4. Check Numbered / Decimal Headings (e.g. "1. DEFINITIONS", "SECTION 2")
    const numMatch = trimmed.match(RE_NUMBERED_HEADING);
    if (numMatch && numMatch[2] && numMatch[2].trim().length > 0) {
      const rawId = numMatch[1].trim();
      const title = numMatch[2].trim();
      if (title.length < 120 && !trimmed.endsWith('.')) {
        const entry = { id: rawId, title, line: lineNum };
        indexedSections.push(entry);

        registerSectionKey(rawId, entry);
        registerSectionKey(`section ${rawId}`, entry);
        registerSectionKey(`article ${rawId}`, entry);
        registerSectionKey(`clause ${rawId}`, entry);

        const arabic = romanToArabic(rawId);
        if (arabic !== null) {
          registerSectionKey(String(arabic), entry);
          registerSectionKey(`section ${arabic}`, entry);
        }
        headingLines.add(lineNum);
      }
    }
  });

  // --------------------------------------------------------------------------
  // PASS 2: CITATION SCANNING
  // --------------------------------------------------------------------------
  const citationsFound = [];
  const RE_SEC_CIT = /\b(Sections?|Articles?|Clauses?|Paragraphs?|§+|§§?)\s+([0-9]+(?:\.[0-9]+)*(?:\([a-z0-9]+\))*(?:\s*(?:,|and|or|through|to)\s*(?!(?:Sections?|Articles?|Clauses?|Paragraphs?|§+)\b)[0-9]+(?:\.[0-9]+)*(?:\([a-z0-9]+\))*)*|[IVXLCDM]+(?:\s*(?:,|and|or|through|to)\s*(?!(?:Sections?|Articles?|Clauses?|Paragraphs?|§+)\b)[IVXLCDM]+)*)\b/gi;
  const RE_EXH_CIT = /\b(Exhibits?|Schedules?|Appendix(?:es)?|Appendices|Annex(?:es)?|Attachments?)\s+([A-Za-z0-9]+(?:[\.\-_][A-Za-z0-9]+)*(?:\s*(?:,|\b(?:and|or|through|to)\b)\s*(?!(?:Exhibits?|Schedules?|Appendix|Annex|Attachment)\b)[A-Za-z0-9]+(?:[\.\-_][A-Za-z0-9]+)*)*)\b/gi;
  const RE_PRECEDING_STATUTE = /\b(?:IRC|I\.R\.C\.|U\.?S\.?C\.?|U\.?S\.?C\.?A\.?|Treasury\s+Regulations?|Treas\.?\s*Reg\.?|C\.?F\.?R\.?|U\.?C\.?C\.?|D\.?G\.?C\.?L\.?|Del\.?\s*C\.?|(?:California|Delaware|New\s+York|Texas|Ohio|Virginia|Illinois|Florida|Pennsylvania)\s+(?:Civil|Commercial|Corporations?|General\s+Corporation|Labor|Penal|Business\s+and\s+Professions)\s+Code|(?:Civil|Commercial|Corporations?|Labor|Penal)\s+Code|Rev\.?\s*Stat\.?|Statutes?|Public\s+Law|P\.?L\.?|FIRPTA|CERCLA|ERISA|DTSA|HIPAA)\s*$/i;
  const RE_FOLLOWING_STATUTE = /^\s*(?:\([a-z0-9]+\))*\s*(?:of\s+the\s+|under\s+(?:the\s+)?)(?:Internal\s+Revenue\s+Code|Code|Securities(?:\s+Exchange)?\s+Act|Uniform\s+Commercial\s+Code|UCC|Bankruptcy\s+Code|Delaware\s+General\s+Corporation\s+Law|DGCL|Act|Statutes?|Regulations?|Rules?|Treasury\s+Regulations?|California\s+Civil\s+Code|Civil\s+Code|DTSA|Defend\s+Trade\s+Secrets\s+Act|Copyright\s+Act|Patent\s+Act|Trademark\s+Act|Lanham\s+Act)\b/i;
  const RE_AMBIGUOUS_CIT = /\b(the\s+(?:preceding|following|prior|above|subsequent)\s+(?:Section|Article|Clause|Paragraph))\b/gi;

  const issues = [];

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();
    // Skip explicit heading lines or editorial notes to avoid false citations
    if (headingLines.has(lineNum) || /^\[Note:/i.test(trimmed) || /^SCHEDULE\s+OF\s+EXHIBITS/i.test(trimmed)) return;

    // 1. Scan Ambiguous Citations (e.g. "the preceding Section")
    let ambMatch;
    while ((ambMatch = RE_AMBIGUOUS_CIT.exec(lineText)) !== null) {
      const start = Math.max(0, ambMatch.index - 30);
      const end = Math.min(lineText.length, ambMatch.index + ambMatch[0].length + 30);
      const snippet = (start > 0 ? '...' : '') + lineText.substring(start, end).trim() + (end < lineText.length ? '...' : '');

      issues.push({
        type: 'ambiguous_reference',
        referenceText: ambMatch[0],
        targetName: ambMatch[0],
        line: lineNum,
        snippet,
        severity: 'warning'
      });
    }

    // 2. Scan Sections / Articles / Clauses / §
    let secMatch;
    while ((secMatch = RE_SEC_CIT.exec(lineText)) !== null) {
      const afterCitation = lineText.substring(secMatch.index + secMatch[0].length);
      const precedingText = lineText.substring(Math.max(0, secMatch.index - 60), secMatch.index).trim();
      // Disqualify statutory and regulatory citations (e.g. "Section 409A of the Code", "IRC Section 1445", "Treasury Regulation Section 1.1445-2(b)")
      if (RE_PRECEDING_STATUTE.test(precedingText) || RE_FOLLOWING_STATUTE.test(afterCitation)) continue;
      if (/^[0-9]+\.[0-9]+-[0-9]+/i.test(secMatch[2]) || /^[0-9]+\.[0-9]+-[0-9]+/i.test(afterCitation)) continue;

      const prefix = secMatch[1];
      const targetGroup = secMatch[2];
      const individualTargets = targetGroup.split(/\s*(?:,|and|or|through|to)\s*/i).filter(Boolean);

      for (let t of individualTargets) {
        t = t.replace(/^(?:Sections?|Articles?|Clauses?|Paragraphs?|§+)\s+/i, '').trim();
        if (!t) continue;
        citationsFound.push({
          target: t,
          prefix,
          type: 'section',
          line: lineNum,
          raw: `${prefix} ${t}`,
          charIndex: secMatch.index
        });
      }
    }

    // 3. Scan Exhibits / Schedules / Appendices
    let exhMatch;
    while ((exhMatch = RE_EXH_CIT.exec(lineText)) !== null) {
      const prefix = exhMatch[1];
      const targetGroup = exhMatch[2];
      const individualTargets = targetGroup.split(/\s*(?:,|and|or|through|to)\s*/i).filter(Boolean);

      for (let t of individualTargets) {
        t = t.replace(/^(?:Exhibits?|Schedules?|Appendices|Appendix|Annexes?|Attachments?)\s+/i, '').trim();
        if (!t) continue;
        // Target must start with alphanumeric character
        if (!/^[A-Za-z0-9]/i.test(t)) continue;
        // Exclude common transitional English words that are not exhibit/schedule identifiers
        if (/^(?:here|hereto|hereof|herein|hereunder|unless|referenced|attached|provided|constitutes|described|specified|such|all|any|each|both|neither|either)\b/i.test(t)) continue;
        citationsFound.push({
          target: t,
          prefix,
          type: 'exhibit',
          line: lineNum,
          raw: `${prefix} ${t}`,
          charIndex: exhMatch.index
        });
      }
    }
  });

  // --------------------------------------------------------------------------
  // PASS 3: RESOLUTION & ISSUE GENERATION (WITH DEDUPLICATION)
  // --------------------------------------------------------------------------
  let brokenCount = 0;
  let missingExhibitCount = 0;

  const brokenSectionsMap = new Map(); // targetLower -> consolidated issue
  const missingExhibitsMap = new Map(); // targetLower -> consolidated issue

  for (const cit of citationsFound) {
    const lineText = lines[cit.line - 1] || '';
    const start = Math.max(0, (cit.charIndex || 0) - 35);
    const end = Math.min(lineText.length, (cit.charIndex || 0) + cit.raw.length + 35);
    const snippet = (start > 0 ? '...' : '') + lineText.substring(start, end).trim() + (end < lineText.length ? '...' : '');

    if (cit.type === 'section') {
      const t = cit.target;
      const lower = t.toLowerCase();

      // Hierarchical Resolution Candidate Keys:
      const candidateKeys = [
        lower,
        `${cit.prefix.toLowerCase()} ${lower}`,
        // Strip innermost parentheses: "8.2(a)(i)" -> "8.2(a)"
        t.replace(/\([a-z0-9]+\)$/i, '').toLowerCase(),
        // Strip all parentheses: "8.2(a)" -> "8.2"
        t.replace(/\([a-z0-9]+\)/gi, '').toLowerCase()
      ];

      // Convert Roman to Arabic if applicable
      const arabic = romanToArabic(t);
      if (arabic !== null) {
        candidateKeys.push(String(arabic));
        candidateKeys.push(`article ${arabic}`);
        candidateKeys.push(`section ${arabic}`);
      } else if (/^\d+$/.test(t)) {
        const numVal = parseInt(t, 10);
        const roman = arabicToRoman(numVal);
        if (roman) {
          candidateKeys.push(roman.toLowerCase());
          candidateKeys.push(`article ${roman.toLowerCase()}`);
        }
      }

      const isResolved = candidateKeys.some(k => sectionIndex.has(k));
      if (!isResolved) {
        if (!brokenSectionsMap.has(lower)) {
          brokenSectionsMap.set(lower, {
            type: 'broken_reference',
            referenceText: cit.raw,
            targetName: cit.target,
            line: cit.line,
            lines: [cit.line],
            snippet,
            occurrenceCount: 1,
            severity: 'critical'
          });
        } else {
          const entry = brokenSectionsMap.get(lower);
          if (!entry.lines.includes(cit.line)) entry.lines.push(cit.line);
          entry.occurrenceCount++;
        }
      }
    } else if (cit.type === 'exhibit') {
      const fullExh = `${cit.prefix.toUpperCase()} ${cit.target.toUpperCase()}`;
      const isResolved = exhibitIndex.has(fullExh) ||
                         exhibitIndex.has(`${cit.prefix.toLowerCase()} ${cit.target.toLowerCase()}`) ||
                         exhibitIndex.has(cit.target.toUpperCase()) ||
                         exhibitIndex.has(cit.target.toLowerCase());

      if (!isResolved) {
        const key = `${cit.prefix.toLowerCase()}_${cit.target.toLowerCase()}`;
        if (!missingExhibitsMap.has(key)) {
          missingExhibitsMap.set(key, {
            type: 'missing_exhibit',
            referenceText: cit.raw,
            targetName: cit.raw,
            line: cit.line,
            lines: [cit.line],
            snippet,
            occurrenceCount: 1,
            severity: 'critical'
          });
        } else {
          const entry = missingExhibitsMap.get(key);
          if (!entry.lines.includes(cit.line)) entry.lines.push(cit.line);
          entry.occurrenceCount++;
        }
      }
    }
  }

  brokenSectionsMap.forEach(item => {
    brokenCount++;
    issues.push(item);
  });

  missingExhibitsMap.forEach(item => {
    missingExhibitCount++;
    issues.push(item);
  });

  return {
    indexedSections,
    indexedExhibits,
    citationsFound,
    issues,
    stats: {
      totalIndexed: indexedSections.length + indexedExhibits.length,
      totalCitations: citationsFound.length,
      brokenCount,
      missingExhibitCount
    }
  };
}
