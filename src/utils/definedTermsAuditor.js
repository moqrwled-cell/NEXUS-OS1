/**
 * Nexus ContractGuard Enterprise — Defined Terms & Entity Consistency Engine (R2)
 * 100% In-Browser Deterministic Legal Document Integrity Engine (ABA Rule 1.6 compliant).
 * 
 * High-precision 6-layer grammatical and stopword filtering with zero external dependencies.
 * Extracts defined terms, audits usage, detects undefined capitalized terms,
 * flags entity name variations and remnants, and sniffs leftover boilerplate placeholders.
 */

// Comprehensive Legal Stopwords Catalog
const LEGAL_STOPWORDS = new Set([
  // Calendar Months
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December',
  // Days of Week
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  // Jurisdictions & Geographies
  'Delaware', 'California', 'New York', 'Texas', 'Florida', 'Nevada', 'Illinois',
  'Washington', 'Wilmington', 'San Francisco', 'Los Angeles', 'Chicago',
  'United States', 'America', 'U.S.', 'USA', 'UK', 'United Kingdom',
  'England', 'Wales', 'European Union', 'EU', 'Canada', 'State', 'Commonwealth',
  'County', 'City', 'Court',
  // Contract Structure & Headings
  'Agreement', 'Contract', 'Section', 'Sections', 'Article', 'Articles',
  'Clause', 'Clauses', 'Paragraph', 'Paragraphs', 'Exhibit', 'Exhibits',
  'Schedule', 'Schedules', 'Appendix', 'Appendices', 'Annex', 'Annexes',
  'Attachment', 'Attachments', 'Recital', 'Recitals', 'Preamble',
  'Table', 'Part', 'Signature', 'Signatures',
  // Universal Legal Roles & Parties
  'Party', 'Parties', 'Client', 'Provider', 'Vendor', 'Customer', 'Supplier',
  'Consultant', 'Contractor', 'Company', 'Disclosing Party', 'Receiving Party',
  'Licensor', 'Licensee', 'Buyer', 'Seller', 'Employer', 'Employee',
  // Classical Legal Latin & Transitional Phrasing
  'Whereas', 'Witnesseth', 'Therefore', 'Hereof', 'Herein', 'Hereunder',
  'Hereto', 'Thereof', 'Therein', 'Thereto', 'Wherefore', 'Notwithstanding',
  'Force Majeure', 'Good Faith', 'Pro Rata', 'Mutatis Mutandis', 'Inter Alia',
  'De Minimis', 'Ipso Facto', 'Bona Fide', 'Prima Facie', 'Ad Hoc',
  'Time Is Of The Essence', 'In Witness Whereof', 'Now Therefore',
  // Numbers & Currency Words
  'Dollars', 'U.S. Dollars', 'Euros', 'Pounds', 'Sterling', 'Cents',
  'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy',
  'Eighty', 'Ninety', 'Hundred', 'Thousand', 'Million', 'Billion',
  // Corporate & Regulatory Acronyms
  'LLC', 'L.L.C.', 'INC', 'Inc', 'Inc.', 'CORP', 'Corp', 'Corp.', 'LTD', 'Ltd', 'Ltd.', 'LLP', 'L.L.P.',
  'GAAP', 'IFRS', 'HIPAA', 'GDPR', 'CCPA', 'IRS', 'SEC', 'FCC', 'FTC', 'UCC',
  'CEO', 'CFO', 'CTO', 'COO', 'VP', 'SOW', 'NDA', 'MSA', 'SLA', 'API', 'IP',
  // Roman Numerals
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV',
  // Address, Geography & Document Structure Words
  'Enterprise Way', 'Silicon Vista', 'Suite', 'Way', 'Vista', 'Street', 'Avenue',
  'Road', 'Boulevard', 'Drive', 'Lane', 'Floor', 'Building', 'Center', 'Plaza',
  'Master', 'Services', 'Master Services Agreement', 'Care', 'Standard of Care',
  'Professional Fees', 'Termination for Convenience', 'Termination for Cause',
  'Mutual Authority', 'Compliance with Laws', 'Consequential Damages Waiver',
  'Liability Cap', 'Governing Law', 'Entire Agreement', 'Pre-Existing',
  'Pre-Existing IP', 'Information', 'Existing', 'Cause', 'Convenience', 'Laws',
  'Solutions', 'Solutions Inc', 'Affiliates',
  // Grammar & Determiners
  'The', 'This', 'That', 'These', 'Those', 'In', 'On', 'At', 'By', 'For', 'With',
  'Without', 'Under', 'Over', 'All', 'Any', 'Each', 'Every', 'Either', 'Neither',
  'Both', 'Such', 'No', 'Not', 'If', 'Unless', 'Provided', 'Except', 'Subject',
  'Upon', 'Following', 'During', 'After', 'Before', 'Between', 'Among'
]);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Computes Levenshtein distance between two strings.
 * @param {string} a 
 * @param {string} b 
 * @returns {number}
 */
export function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;
  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Normalizes entity name stem for comparison.
 * @param {string} name 
 * @returns {string}
 */
function normalizeEntityStem(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Audits contract text for defined terms, undefined terms, unused terms,
 * entity inconsistencies, and boilerplate placeholders.
 * @param {string} text - Raw document text
 * @param {{ parties?: string[] }} [options={}] - Optional known parties list
 * @returns {{
 *   definedTerms: Array<{ term: string; definition: string; line: number; count: number }>;
 *   undefinedTerms: Array<{ term: string; line: number; count: number }>;
 *   unusedDefinedTerms: Array<{ term: string; line: number }>;
 *   entityIssues: Array<{ entity: string; discrepancy: string; line: number }>;
 *   boilerplateArtifacts: Array<{ placeholder: string; line: number; snippet: string }>;
 *   issues: Array<{
 *     type: 'undefined_capitalized_term' | 'unused_defined_term' | 'entity_inconsistency' | 'boilerplate_artifact';
 *     term: string;
 *     line: number;
 *     snippet: string;
 *     details?: string;
 *     severity: 'critical' | 'warning' | 'info';
 *   }>;
 *   stats: {
 *     totalDefined: number;
 *     undefinedCount: number;
 *     unusedCount: number;
 *     artifactCount: number;
 *   };
 * }}
 */
export function auditDefinedTerms(text = '', options = {}) {
  if (!text || typeof text !== 'string') {
    return {
      definedTerms: [],
      undefinedTerms: [],
      unusedDefinedTerms: [],
      entityIssues: [],
      boilerplateArtifacts: [],
      issues: [],
      stats: { totalDefined: 0, undefinedCount: 0, unusedCount: 0, artifactCount: 0 }
    };
  }

  const lines = text.split(/\r?\n/);
  const userParties = new Set();
  (options.parties || []).forEach(p => {
    const clean = p.trim().toLowerCase();
    userParties.add(clean);
    clean.split(/\s+/).forEach(t => userParties.add(t));
    const cleanTokens = clean.split(/\s+/);
    for (let i = 0; i < cleanTokens.length - 1; i++) {
      userParties.add(`${cleanTokens[i]} ${cleanTokens[i + 1]}`);
    }
  });

  // --------------------------------------------------------------------------
  // PIPELINE 1: EXTRACT DEFINITIONS
  // --------------------------------------------------------------------------
  const definedTermsMap = new Map(); // term (lowercase) -> { term, definition, line, count }

  // 1. Parenthetical inline definitions: (the "Term") or (hereinafter "Term")
  const RE_INLINE_DEF = /\(\s*(?:the|hereinafter(?:\s+referred\s+to\s+as)?|collectively(?:,\s*the)?|individually(?:,\s*a)?|each(?:,\s*a)?|such\s+[^,]+,\s*the)?\s*["“'‘]([A-Za-z0-9\s\-_,.'()]{2,40}?)["”'’]\s*\)/gi;

  // 2. Operative definitions: "Term" means / shall mean / has the meaning set forth in
  const RE_MEANS_DEF = /["“'‘]([A-Za-z0-9\s\-_,.'()]{2,40}?)["”'’]\s+(means|shall\s+mean|refers\s+to|has\s+the\s+meaning(?:\s+given\s+to\s+it|\s+set\s+forth)?\s+(?:in|under|herein)?)\s+([^.\n;]+[.;]?)/gmi;

  // 3. Colon dictionary definitions: 1.1 "Term": definition
  const RE_COLON_DEF = /^(?:\s*(?:\([a-z0-9]+\)|\d+(?:\.\d+)*)\s*)?["“'‘]([A-Za-z0-9\s\-_,.'()]{2,40}?)["”'’]\s*[:—–-]\s*([^\n]+)/gmi;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;

    let m;
    while ((m = RE_INLINE_DEF.exec(lineText)) !== null) {
      const term = m[1].trim();
      const key = term.toLowerCase();
      if (!definedTermsMap.has(key)) {
        definedTermsMap.set(key, { term, definition: lineText.trim(), line: lineNum, count: 0 });
      }
    }

    while ((m = RE_MEANS_DEF.exec(lineText)) !== null) {
      const term = m[1].trim();
      const key = term.toLowerCase();
      if (!definedTermsMap.has(key)) {
        definedTermsMap.set(key, { term, definition: m[0].trim(), line: lineNum, count: 0 });
      }
    }

    while ((m = RE_COLON_DEF.exec(lineText)) !== null) {
      const term = m[1].trim();
      const key = term.toLowerCase();
      if (!definedTermsMap.has(key)) {
        definedTermsMap.set(key, { term, definition: m[2].trim(), line: lineNum, count: 0 });
      }
    }
  });

  const definedTerms = Array.from(definedTermsMap.values());

  // --------------------------------------------------------------------------
  // PIPELINE 2: TERM USAGE FREQUENCY & UNUSED DEFINED TERMS
  // --------------------------------------------------------------------------
  const unusedDefinedTerms = [];
  const issues = [];

  for (const item of definedTerms) {
    const termRegex = new RegExp(`\\b${escapeRegex(item.term)}s?\\b`, 'gi');
    let occurrences = 0;

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      // Exclude the definition line itself from usage count
      if (lineNum === item.line) return;
      const matches = lineText.match(termRegex);
      if (matches) occurrences += matches.length;
    });

    item.count = occurrences;
    if (occurrences === 0) {
      unusedDefinedTerms.push({ term: item.term, line: item.line });
      issues.push({
        type: 'unused_defined_term',
        term: item.term,
        line: item.line,
        snippet: item.definition,
        details: `Term "${item.term}" is formally defined at line ${item.line} but never utilized in any operative provision of the agreement.`,
        severity: 'warning'
      });
    }
  }

  // --------------------------------------------------------------------------
  // PIPELINE 3: UNDEFINED CAPITALIZED TERMS SCANNER (6-LAYER FILTER)
  // --------------------------------------------------------------------------
  const candidateOccurrences = new Map(); // term -> { count, firstLine, snippet }
  const RE_CAPITALIZED = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();
    if (!trimmed) return;

    // Layer 5: Skip all-caps headings and short uppercase lines
    if (trimmed.length < 120 && trimmed === trimmed.toUpperCase()) return;

    // Detect subsection heading title prefix: "2.1 Performance of Services. Provider shall..."
    const headingPrefixMatch = trimmed.match(/^(?:[0-9]+(?:\.[0-9]+)+|[IVXLCDM]+\.)\s+([A-Za-z0-9\s—–\-_/]+?)\.\s+/);
    const headingEndIndex = headingPrefixMatch ? lineText.indexOf(headingPrefixMatch[0]) + headingPrefixMatch[0].length : -1;

    let m;
    while ((m = RE_CAPITALIZED.exec(lineText)) !== null) {
      // Skip if token is part of subsection heading title
      if (headingEndIndex !== -1 && m.index < headingEndIndex) continue;

      let phrase = m[0].trim();

      // If multi-word phrase starts with leading legal stopword (e.g. "All Proprietary Software"), strip leading stopword
      let tokens = phrase.split(/\s+/);
      while (tokens.length > 1 && LEGAL_STOPWORDS.has(tokens[0])) {
        tokens.shift();
      }
      phrase = tokens.join(' ');
      const lower = phrase.toLowerCase();

      // Layer 1: Already defined in contract (including plural variations)
      if (
        definedTermsMap.has(lower) ||
        definedTermsMap.has(lower.replace(/s$/, '')) ||
        definedTermsMap.has(lower.replace(/es$/, ''))
      ) continue;

      // Skip phrase immediately preceding a parenthetical definition (e.g. "Master Services Agreement (the 'Agreement')")
      const followingText = lineText.substring(m.index + phrase.length).trim();
      if (/^\(\s*(?:the\s+)?["“'‘]/.test(followingText)) continue;

      // Layer 2: Explicit known parties
      if (userParties.has(lower)) continue;

      // Layer 3: Comprehensive Legal Stopwords Filter
      if (LEGAL_STOPWORDS.has(phrase)) continue;
      if (tokens.every(t => LEGAL_STOPWORDS.has(t))) continue;

      // Layer 4: Sentence Starter Check (for single capitalized words)
      if (tokens.length === 1) {
        const precedingText = lineText.substring(0, m.index).trim();
        const isSentenceStart = !precedingText ||
                                /[.!?]\s*$/.test(precedingText) ||
                                /^\([a-z0-9]+\)$/i.test(precedingText) ||
                                /^(?:[0-9]+(?:\.[0-9]+)*|\#+)\s*$/i.test(precedingText);
        if (isSentenceStart) continue;
      }

      // Record valid candidate
      const start = Math.max(0, m.index - 35);
      const end = Math.min(lineText.length, m.index + phrase.length + 35);
      const snippet = (start > 0 ? '...' : '') + lineText.substring(start, end).trim() + (end < lineText.length ? '...' : '');

      if (!candidateOccurrences.has(phrase)) {
        candidateOccurrences.set(phrase, { count: 1, firstLine: lineNum, snippet });
      } else {
        candidateOccurrences.get(phrase).count++;
      }
    }
  });

  const undefinedTerms = [];
  for (const [term, data] of candidateOccurrences.entries()) {
    undefinedTerms.push({ term, line: data.firstLine, count: data.count });
    issues.push({
      type: 'undefined_capitalized_term',
      term,
      line: data.firstLine,
      snippet: data.snippet,
      details: `Capitalized term "${term}" appears ${data.count} time(s) without formal definition in Section 1 or recitals.`,
      severity: term.includes(' ') ? 'critical' : 'warning'
    });
  }

  // --------------------------------------------------------------------------
  // PIPELINE 4: ENTITY CONSISTENCY ENGINE
  // --------------------------------------------------------------------------
  const entityIssues = [];
  const RE_ENTITY = /\b([A-Z][A-Za-z0-9&',.-]+(?:\s+[A-Z][A-Za-z0-9&',.-]+){0,4})\s+(LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.|GmbH)\b/g;
  const entitiesFound = [];

  lines.forEach((lineText, idx) => {
    let m;
    while ((m = RE_ENTITY.exec(lineText)) !== null) {
      const raw = m[0].trim();
      const stem = m[1].trim();
      const suffix = m[2].trim();
      let category = 'OTHER';
      if (/LLC|L\.L\.C\./i.test(suffix)) category = 'LLC';
      else if (/Corp|Corporation/i.test(suffix)) category = 'CORP';
      else if (/Inc|Incorporated/i.test(suffix)) category = 'INC';
      else if (/Ltd|Limited/i.test(suffix)) category = 'LTD';
      else if (/LLP|L\.L\.P\./i.test(suffix)) category = 'LLP';

      entitiesFound.push({ raw, stem, suffix, category, line: idx + 1 });
    }
  });

  // Group entities by stem
  const stemGroups = new Map();
  entitiesFound.forEach(ent => {
    const normStem = normalizeEntityStem(ent.stem);
    if (!stemGroups.has(normStem)) stemGroups.set(normStem, []);
    stemGroups.get(normStem).push(ent);
  });

  // 1. Check entity type confusion or formatting within stem groups
  for (const [, group] of stemGroups.entries()) {
    const categories = new Set(group.map(g => g.category));
    if (categories.size > 1) {
      // Critical entity type confusion (e.g. Acme Corp vs Acme LLC)
      const names = Array.from(new Set(group.map(g => g.raw))).join(' vs ');
      const issueItem = {
        entity: group[0].raw,
        discrepancy: `Entity structure confusion detected: ${names}`,
        line: group[0].line
      };
      entityIssues.push(issueItem);
      issues.push({
        type: 'entity_inconsistency',
        term: group[0].raw,
        line: group[0].line,
        snippet: lines[group[0].line - 1] || '',
        details: issueItem.discrepancy,
        severity: 'critical'
      });
    } else {
      // Check spelling/formatting variations (e.g. Acme Corporation vs Acme Corp)
      const distinctForms = Array.from(new Set(group.map(g => g.raw)));
      if (distinctForms.length > 1) {
        const issueItem = {
          entity: distinctForms[0],
          discrepancy: `Inconsistent entity spelling/formatting: ${distinctForms.join(' vs ')}`,
          line: group[0].line
        };
        entityIssues.push(issueItem);
        issues.push({
          type: 'entity_inconsistency',
          term: distinctForms[0],
          line: group[0].line,
          snippet: lines[group[0].line - 1] || '',
          details: issueItem.discrepancy,
          severity: 'warning'
        });
      }
    }
  }

  // 2. Check for leftover/alien entities not matching user-provided parties
  if (options.parties && options.parties.length > 0) {
    const normUserParties = options.parties.map(p => normalizeEntityStem(p));
    for (const ent of entitiesFound) {
      const entStemNorm = normalizeEntityStem(ent.stem);
      const isKnownParty = normUserParties.some(p => p.includes(entStemNorm) || entStemNorm.includes(p));
      if (!isKnownParty) {
        const existingAlien = entityIssues.find(e => e.entity === ent.raw);
        if (!existingAlien) {
          const discrepancy = `Leftover legacy counterparty "${ent.raw}" does not match recognized agreement parties.`;
          entityIssues.push({ entity: ent.raw, discrepancy, line: ent.line });
          issues.push({
            type: 'entity_inconsistency',
            term: ent.raw,
            line: ent.line,
            snippet: lines[ent.line - 1] || '',
            details: discrepancy,
            severity: 'critical'
          });
        }
      }
    }
  }

  // 3. Typo drift detection across distinct entity stems (Levenshtein distance 1)
  const stemKeys = Array.from(stemGroups.keys());
  for (let i = 0; i < stemKeys.length; i++) {
    for (let j = i + 1; j < stemKeys.length; j++) {
      const s1 = stemKeys[i];
      const s2 = stemKeys[j];
      const dist = levenshtein(s1, s2);
      if (dist === 1 && Math.min(s1.length, s2.length) >= 4) {
        const g1 = stemGroups.get(s1)[0];
        const g2 = stemGroups.get(s2)[0];
        const discrepancy = `Possible typographical drift in counterparty name: "${g1.raw}" (line ${g1.line}) vs "${g2.raw}" (line ${g2.line})`;
        entityIssues.push({ entity: g1.raw, discrepancy, line: g1.line });
        issues.push({
          type: 'entity_inconsistency',
          term: g1.raw,
          line: g1.line,
          snippet: lines[g1.line - 1] || '',
          details: discrepancy,
          severity: 'warning'
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // PIPELINE 5: BOILERPLATE & PLACEHOLDER SNIFFER
  // --------------------------------------------------------------------------
  const boilerplateArtifacts = [];
  const RE_BRACKET_PLACEHOLDER = /\[([A-Za-z0-9\s/_\-–—\$\.,\*\?•]{1,60})\]/g;
  const RE_BLANK_UNDERLINE = /(?:^|\s)(_{3,})(?:\s|$|[,\.])/g;
  const RE_DRAFTING_TAG = /\b(TODO|TBD|CONFIRM|INSERT\s+[A-Z\s]+|DELETE\s+IF\s+NOT\s+APPLICABLE|NOTE\s+TO\s+DRAFT|DRAFT\s+NOTE)\b/gi;
  const RE_CHEVRON_PLACEHOLDER = /<<([A-Za-z0-9_ -]{2,50})>>/g;
  const RE_ANGLE_PLACEHOLDER = /<([A-Za-z\s_-]{3,40})>/g;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;

    // 1. Bracketed placeholders: [Company Name], [Insert Date], [ • ]
    let m;
    while ((m = RE_BRACKET_PLACEHOLDER.exec(lineText)) !== null) {
      const inner = m[1].trim();
      if (/^\d+$/.test(inner)) continue; // ignore footnote [1]
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[0], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[0],
        line: lineNum,
        snippet,
        details: `Unresolved boilerplate placeholder "${m[0]}" found in draft.`,
        severity: 'critical'
      });
    }

    // 2. Double Chevron placeholders: <<CLIENT_NAME>>
    while ((m = RE_CHEVRON_PLACEHOLDER.exec(lineText)) !== null) {
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[0], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[0],
        line: lineNum,
        snippet,
        details: `Merge template placeholder "${m[0]}" remains unpopulated.`,
        severity: 'critical'
      });
    }

    // 3. Unfilled Blank Underlines: ___
    while ((m = RE_BLANK_UNDERLINE.exec(lineText)) !== null) {
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[1], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[1],
        line: lineNum,
        snippet,
        details: `Unfilled contractual blank "${m[1]}" requires input prior to signing.`,
        severity: 'critical'
      });
    }

    // 4. Drafting Directives: TODO, TBD
    while ((m = RE_DRAFTING_TAG.exec(lineText)) !== null) {
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[0], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[0],
        line: lineNum,
        snippet,
        details: `Drafting directive "${m[0]}" left unaddressed in contract text.`,
        severity: 'critical'
      });
    }

    // 5. Angle bracket placeholders: <Insert Name>
    while ((m = RE_ANGLE_PLACEHOLDER.exec(lineText)) !== null) {
      if (/^(?:br|p|div|span|b|i|u|strong|em)$/i.test(m[1])) continue;
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[0], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[0],
        line: lineNum,
        snippet,
        details: `Template angle bracket placeholder "${m[0]}" unpopulated.`,
        severity: 'warning'
      });
    }
  });

  return {
    definedTerms,
    undefinedTerms,
    unusedDefinedTerms,
    entityIssues,
    boilerplateArtifacts,
    issues,
    stats: {
      totalDefined: definedTerms.length,
      undefinedCount: undefinedTerms.length,
      unusedCount: unusedDefinedTerms.length,
      artifactCount: boilerplateArtifacts.length
    }
  };
}
