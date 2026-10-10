/**
 * Nexus ContractGuard Enterprise — Obligations Extractor (R4)
 * 100% In-Browser Deterministic Legal Document Integrity Engine (ABA Rule 1.6 compliant).
 * 
 * Tokenizes legal sentences, extracts modal verbs ("shall", "must", "agrees to", "will", "shall not"),
 * classifies duty types (affirmative, negative, conditional), attributes duties to responsible parties
 * (Client, Counterparty, Mutual, Third Party), and scores risk severity.
 */

const PROTECTED_ABBREVIATIONS = [
  'e.g.', 'i.e.', 'etc.', 'et al.', 'v.', 'vs.', 'cf.', 'viz.',
  'Inc.', 'Corp.', 'Ltd.', 'Co.', 'LLC.', 'L.L.C.', 'P.C.',
  'Sec.', 'Secs.', 'Art.', 'Arts.', 'Para.', 'Paras.', 'Cl.', 'No.', 'Nos.',
  'U.S.', 'U.S.A.', 'U.K.', 'D.C.',
  'Jan.', 'Feb.', 'Mar.', 'Apr.', 'Aug.', 'Sept.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
];

/**
 * Splits legal document into sentences without corrupting abbreviations,
 * decimal numbers, or section identifiers.
 * @param {string} text 
 * @returns {Array<{ sentence: string; line: number }>}
 */
export function splitLegalSentences(text) {
  if (!text) return [];

  // Protect abbreviations with unique sentinel token
  let protectedText = text;
  const SENTINEL = '\uE000DOT\uE000';

  PROTECTED_ABBREVIATIONS.forEach(abbr => {
    const escaped = abbr.replace(/\./g, '\\.');
    const regex = new RegExp(`\\b${escaped}`, 'gi');
    protectedText = protectedText.replace(regex, match => match.replace(/\./g, SENTINEL));
  });

  // Protect decimal numbers like 10.5 or $10,000.00
  protectedText = protectedText.replace(/(\d+)\.(\d+)/g, `$1${SENTINEL}$2`);

  // Protect numbered lists at start of line: "1. Scope"
  protectedText = protectedText.replace(/(^|\n)(\s*\d+)\.(\s+)/g, `$1$2${SENTINEL}$3`);

  const rawSentences = protectedText.split(/(?:[\r\n]{2,}|(?<=[.!?])\s+(?=[A-Z0-9"“'‘\(\[]))/g);
  const sentenceResults = [];
  let currentOffset = 0;

  rawSentences.forEach(raw => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Restore shielded dots
    const restored = trimmed.replace(new RegExp(SENTINEL, 'g'), '.');

    // Calculate line number
    const charIndex = text.indexOf(restored, currentOffset);
    let lineNum = 1;
    if (charIndex !== -1) {
      currentOffset = charIndex + restored.length;
      const textUpToChar = text.slice(0, charIndex);
      lineNum = (textUpToChar.match(/\n/g) || []).length + 1;
    }

    sentenceResults.push({
      sentence: restored,
      line: lineNum
    });
  });

  return sentenceResults;
}

/**
 * Attributes responsible party from sentence subject chunk.
 * @param {string} subjectChunk 
 * @param {string} [clientPartyName=''] 
 * @param {string} [counterpartyName=''] 
 * @returns {'Client' | 'Counterparty' | 'Mutual' | 'Third Party'}
 */
export function attributeObligationParty(subjectChunk, clientPartyName = '', counterpartyName = '') {
  const norm = (subjectChunk || '').toLowerCase();

  // 1. Mutual obligations
  if (/\b(?:both parties|each party|either party|neither party|the parties|all parties)\b/i.test(norm)) {
    return 'Mutual';
  }

  // 2. Explicit party name matching
  if (clientPartyName && norm.includes(clientPartyName.toLowerCase())) {
    return 'Client';
  }
  if (counterpartyName && norm.includes(counterpartyName.toLowerCase())) {
    return 'Counterparty';
  }

  // 3. Generic commercial role aliases
  // Client aliases
  if (/\b(?:client|customer|buyer|purchaser|licensee|company|employer|disclosing party)\b/i.test(norm)) {
    return 'Client';
  }
  // Counterparty aliases
  if (/\b(?:provider|vendor|supplier|contractor|service provider|seller|licensor|consultant|employee|receiving party)\b/i.test(norm)) {
    return 'Counterparty';
  }

  // 4. Third-party entities
  if (/\b(?:escrow agent|bank|auditor|arbitrator|subcontractor|affiliate|governmental authority|court|third party)\b/i.test(norm)) {
    return 'Third Party';
  }

  return 'Third Party';
}

/**
 * Extracts obligations from legal document.
 * @param {string} text - Raw document text
 * @param {string} [clientPartyName=''] - Optional client entity name
 * @param {string} [counterpartyName=''] - Optional counterparty entity name
 * @returns {{
 *   obligations: Array<{
 *     id: string;
 *     modalVerb: 'shall' | 'must' | 'agrees to' | 'will' | 'shall not';
 *     dutyType: 'affirmative' | 'negative' | 'conditional';
 *     responsibleParty: 'Client' | 'Counterparty' | 'Mutual' | 'Third Party';
 *     action: string;
 *     sentence: string;
 *     sectionContext: string;
 *     line: number;
 *     severity: 'high' | 'medium' | 'low';
 *   }>;
 *   partyBreakdown: {
 *     clientCount: number;
 *     counterpartyCount: number;
 *     mutualCount: number;
 *     thirdPartyCount: number;
 *   };
 *   stats: {
 *     totalObligations: number;
 *     affirmativeCount: number;
 *     negativeCount: number;
 *     conditionalCount: number;
 *   };
 * }}
 */
export function extractObligations(text = '', clientPartyName = '', counterpartyName = '') {
  if (!text || typeof text !== 'string') {
    return {
      obligations: [],
      partyBreakdown: { clientCount: 0, counterpartyCount: 0, mutualCount: 0, thirdPartyCount: 0 },
      stats: { totalObligations: 0, affirmativeCount: 0, negativeCount: 0, conditionalCount: 0 }
    };
  }

  const sentencesWithLines = splitLegalSentences(text);
  const lines = text.split(/\r?\n/);
  const obligations = [];

  // Pre-index section headings to supply section context
  const sectionHeadings = [];
  lines.forEach((lineText, idx) => {
    const trimmed = lineText.trim();
    if (/^(?:SECTION|ARTICLE|CLAUSE|\d+[\.\)]|[A-Z\d]+[\.\)])\s*([^\n\r]+)/i.test(trimmed)) {
      sectionHeadings.push({ line: idx + 1, title: trimmed });
    }
  });

  function getSectionContext(targetLine) {
    let active = 'Preamble / General';
    for (const h of sectionHeadings) {
      if (h.line <= targetLine) {
        active = h.title;
      } else {
        break;
      }
    }
    return active;
  }

  // Modal extraction patterns ordered from most specific to least specific
  const MODAL_PATTERNS = [
    { regex: /\bshall\s+not\b/i, modal: 'shall not', negative: true },
    { regex: /\bmust\s+not\b/i, modal: 'must', negative: true },
    { regex: /\bagrees?\s+not\s+to\b/i, modal: 'agrees to', negative: true },
    { regex: /\bwill\s+not\b/i, modal: 'will', negative: true },
    { regex: /\bshall\b/i, modal: 'shall', negative: false },
    { regex: /\bmust\b/i, modal: 'must', negative: false },
    { regex: /\bagrees?\s+to\b/i, modal: 'agrees to', negative: false },
    { regex: /\bwill\b/i, modal: 'will', negative: false }
  ];

  const CONDITIONAL_REGEX = /\b(?:if|in the event (?:that|of)|provided that|subject to\s+(?:Section|Article|Clause)|unless|to the extent that)\b/i;

  let oblCounter = 1;

  sentencesWithLines.forEach(({ sentence, line }) => {
    // Avoid false positives for "will" as a noun ("free will", "last will")
    if (/\b(?:free\s+will|last\s+will)\b/i.test(sentence)) return;

    for (const pattern of MODAL_PATTERNS) {
      const match = pattern.regex.exec(sentence);
      if (match) {
        const modalIndex = match.index;
        let modalVerb = pattern.modal;

        // Subject is text preceding the modal verb
        const subjectChunk = sentence.slice(0, modalIndex).trim();

        // Operative action follows the modal
        let action = sentence.slice(modalIndex + match[0].length).trim();
        action = action.replace(/^[,\s]+/, '').replace(/[\.;]+$/, '');

        // Duty Classification
        let dutyType = 'affirmative';
        if (pattern.negative || /\bneither party\b/i.test(subjectChunk) || /\bneither party shall\b/i.test(sentence)) {
          dutyType = 'negative';
          modalVerb = 'shall not';
        } else if (CONDITIONAL_REGEX.test(sentence)) {
          dutyType = 'conditional';
        }

        // Party Attribution
        const responsibleParty = attributeObligationParty(subjectChunk, clientPartyName, counterpartyName);

        // Severity Scoring
        let severity = 'medium';
        const actionLower = action.toLowerCase();
        if (
          /\b(?:pay|payment|fees?|invoice|reimburse|indemnif(?:y|ication)|defend|hold harmless|unlimited liability|data breach|security incident|confidential|non-compete|terminate)\b/.test(actionLower) ||
          /\bwithin 24 hours\b/.test(actionLower)
        ) {
          severity = 'high';
        } else if (/\b(?:notify of change|reasonable efforts|general cooperation)\b/.test(actionLower)) {
          severity = 'low';
        }

        obligations.push({
          id: `obl-${oblCounter++}`,
          modalVerb,
          dutyType,
          responsibleParty,
          action,
          sentence,
          sectionContext: getSectionContext(line),
          line,
          severity
        });

        break; // Matched first prominent modal verb for this sentence
      }
    }
  });

  const partyBreakdown = {
    clientCount: obligations.filter(o => o.responsibleParty === 'Client').length,
    counterpartyCount: obligations.filter(o => o.responsibleParty === 'Counterparty').length,
    mutualCount: obligations.filter(o => o.responsibleParty === 'Mutual').length,
    thirdPartyCount: obligations.filter(o => o.responsibleParty === 'Third Party').length
  };

  const stats = {
    totalObligations: obligations.length,
    affirmativeCount: obligations.filter(o => o.dutyType === 'affirmative').length,
    negativeCount: obligations.filter(o => o.dutyType === 'negative').length,
    conditionalCount: obligations.filter(o => o.dutyType === 'conditional').length
  };

  return {
    obligations,
    partyBreakdown,
    stats
  };
}
