/**
 * Nexus ContractGuard Enterprise — Financial & Date Integrity Auditor (R3)
 * 100% In-Browser Deterministic Legal Document Integrity Engine (ABA Rule 1.6 compliant).
 * 
 * Extracts monetary amounts, performs words-to-number validation, detects discrepancies,
 * audits contract timeline chronology, and evaluates notice period windows.
 */

const UNIT_MAP = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19
};

const TENS_MAP = {
  twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

const SCALE_MAP = {
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000
};

/**
 * Parses spelled-out English monetary text into an exact numerical value.
 * Handles scales, hyphens, and legal cent fractions (e.g. "and 50/100", "and no/100", "Fifty Cents").
 * @param {string} text 
 * @returns {number | null}
 */
export function parseWordsToNumber(text) {
  if (!text || typeof text !== 'string') return null;

  let cleaned = text.toLowerCase().trim();
  const hasCentsWord = /\bcents?\b/.test(cleaned);
  const hasDollarsWord = /\b(dollars?|euros?|pounds?|sterling|usd)\b/.test(cleaned);

  // Strip currency terms
  cleaned = cleaned.replace(/\b(dollars?|cents?|euros?|pounds?|sterling|usd|pence)\b/g, ' ');
  cleaned = cleaned.replace(/-/g, ' ');

  // Extract legal cent fractions e.g. "and 50/100" or "and no/100"
  let fractionalCents = 0;
  const fractionMatch = cleaned.match(/(?:and\s+)?(\d{1,2})\/100/);
  if (fractionMatch) {
    fractionalCents = parseInt(fractionMatch[1], 10) / 100;
    cleaned = cleaned.replace(fractionMatch[0], ' ');
  } else if (cleaned.match(/(?:and\s+)?(?:no|xx)\/100/)) {
    cleaned = cleaned.replace(/(?:and\s+)?(?:no|xx)\/100/, ' ');
  }

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0 && fractionalCents === 0) return null;

  let total = 0;
  let current = 0;
  let hasValidWord = false;

  for (const token of tokens) {
    if (UNIT_MAP[token] !== undefined) {
      current += UNIT_MAP[token];
      hasValidWord = true;
    } else if (TENS_MAP[token] !== undefined) {
      current += TENS_MAP[token];
      hasValidWord = true;
    } else if (token === 'hundred') {
      if (current === 0) current = 1;
      current *= 100;
      hasValidWord = true;
    } else if (SCALE_MAP[token] !== undefined) {
      if (current === 0) current = 1;
      total += current * SCALE_MAP[token];
      current = 0;
      hasValidWord = true;
    } else if (token === 'and') {
      continue;
    }
  }

  if (!hasValidWord && fractionalCents === 0) return null;

  let computed = total + current + fractionalCents;

  // If text specifies "cents" without "dollars" (e.g. "Fifty Cents"), it represents fractions of a dollar
  if (hasCentsWord && !hasDollarsWord && computed >= 1) {
    computed = computed / 100;
  }

  return computed;
}

/**
 * Cleans and converts numeric currency string to float.
 * @param {string} str 
 * @returns {number}
 */
export function parseNumericAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Extracts raw date text and standardized ISO YYYY-MM-DD from any text chunk.
 * @param {string} text 
 * @returns {{ rawDate: string; parsedDate: string } | null}
 */
export function extractDateFromText(text) {
  if (!text || typeof text !== 'string') return null;

  const MONTHS = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
  };

  // 1. Formal English: "October 15, 2026" or "October 15 2026"
  const eng1 = text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/i);
  if (eng1) {
    const m = MONTHS[eng1[1].toLowerCase()];
    const d = eng1[2].padStart(2, '0');
    return { rawDate: eng1[0], parsedDate: `${eng1[3]}-${m}-${d}` };
  }

  // 2. Day-first English: "15th day of October, 2026" or "15 October 2026"
  const eng2 = text.match(/\b(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:day\s+of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december),?\s+(\d{4})\b/i);
  if (eng2) {
    const d = eng2[1].padStart(2, '0');
    const m = MONTHS[eng2[2].toLowerCase()];
    return { rawDate: eng2[0], parsedDate: `${eng2[3]}-${m}-${d}` };
  }

  // 3. ISO format: YYYY-MM-DD
  const isoMatch = text.match(/\b(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) {
    return { rawDate: isoMatch[0], parsedDate: isoMatch[0] };
  }

  // 4. US Slash/Dash format: MM/DD/YYYY
  const slashMatch = text.match(/\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4})\b/);
  if (slashMatch) {
    const m = slashMatch[1].padStart(2, '0');
    const d = slashMatch[2].padStart(2, '0');
    return { rawDate: slashMatch[0], parsedDate: `${slashMatch[3]}-${m}-${d}` };
  }

  return null;
}

/**
 * Standardizes raw date string into ISO YYYY-MM-DD.
 * @param {string} rawDateStr 
 * @returns {string | null}
 */
export function parseContractDate(rawDateStr) {
  const result = extractDateFromText(rawDateStr);
  return result ? result.parsedDate : null;
}

/**
 * Main Audit Function for Financial & Date Integrity
 * @param {string} text - Document raw text
 * @param {Date} [referenceDate=new Date()] - Reference audit date
 * @returns {{
 *   financialPairings: Array<{
 *     numeric: string;
 *     words: string;
 *     numericVal: number;
 *     wordsVal: number;
 *     currency: string;
 *     match: boolean;
 *     line: number;
 *     snippet: string;
 *   }>;
 *   timeline: Array<{
 *     event: string;
 *     date: string;
 *     parsedDate: string | null;
 *     line: number;
 *     isPast: boolean;
 *   }>;
 *   noticePeriods: Array<{
 *     periodDays: number;
 *     context: string;
 *     line: number;
 *   }>;
 *   issues: Array<{
 *     type: 'amount_mismatch' | 'expired_date' | 'timeline_contradiction' | 'ambiguous_currency';
 *     title: string;
 *     details: string;
 *     numericValue?: number;
 *     wordValue?: number;
 *     dateStr?: string;
 *     line: number;
 *     snippet: string;
 *     severity: 'critical' | 'warning';
 *   }>;
 *   stats: {
 *     totalAmounts: number;
 *     mismatchCount: number;
 *     totalDates: number;
 *     dateIssuesCount: number;
 *   };
 * }}
 */
export function auditFinancialAndDates(text = '', referenceDate = new Date()) {
  if (!text || typeof text !== 'string') {
    return {
      financialPairings: [],
      timeline: [],
      noticePeriods: [],
      issues: [],
      stats: { totalAmounts: 0, mismatchCount: 0, totalDates: 0, dateIssuesCount: 0 }
    };
  }

  const lines = text.split(/\r?\n/);
  const financialPairings = [];
  const timeline = [];
  const noticePeriods = [];
  const issues = [];

  const refDateObj = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const refDateStr = refDateObj.toISOString().slice(0, 10);

  // --------------------------------------------------------------------------
  // 1. EXTRACT ALL MONETARY AMOUNTS (FOR STATS & AUDIT)
  // --------------------------------------------------------------------------
  const RE_MONETARY_ALL = /(?:(\$|US\$|C\$|A\$|€|£|¥|₹|CHF|SAR|AED)\s*([\d,]+(?:\.\d{1,2})?)|([\d,]+(?:\.\d{1,2})?)\s*(USD|EUR|GBP|CAD|AUD|JPY|CHF|SAR|AED|dollars?|euros?|pounds?)|(USD|EUR|GBP|CAD|AUD|JPY|CHF|SAR|AED)\s*([\d,]+(?:\.\d{1,2})?))/gi;
  let totalExtractedAmounts = 0;
  lines.forEach(lineText => {
    const matches = lineText.match(RE_MONETARY_ALL);
    if (matches) totalExtractedAmounts += matches.length;
  });

  // --------------------------------------------------------------------------
  // 2. DETECT FINANCIAL PAIRINGS & NUMBER-WORD DISCREPANCIES
  // --------------------------------------------------------------------------
  lines.forEach((lineText, index) => {
    const lineNum = index + 1;

    // Pattern A: Words followed by ($Digits)
    // e.g. "Ten Thousand Dollars ($10,000)" or "Twenty Thousand ($10,000) Dollars"
    const patternA = /([A-Za-z\s-]+(?:dollars?|euros?|pounds?|cents?)?)\s*\(\s*([$€£¥₹A-Za-z]*\s*[\d,]+(?:\.\d{1,2})?\s*[A-Za-z]*)\s*\)/gi;
    let match;
    while ((match = patternA.exec(lineText)) !== null) {
      const wordsPart = match[1].trim();
      const numPart = match[2].trim();

      const wordsVal = parseWordsToNumber(wordsPart);
      const numVal = parseNumericAmount(numPart);

      if (wordsVal !== null && numVal > 0) {
        const isMatch = Math.abs(wordsVal - numVal) < 0.01;
        financialPairings.push({
          numeric: numPart,
          words: wordsPart,
          numericVal: numVal,
          wordsVal: wordsVal,
          currency: numPart.includes('€') ? 'EUR' : (numPart.includes('£') ? 'GBP' : 'USD'),
          match: isMatch,
          line: lineNum,
          snippet: lineText.trim()
        });

        if (!isMatch) {
          issues.push({
            type: 'amount_mismatch',
            title: 'Financial Amount Discrepancy',
            details: `Written words "${wordsPart}" ($${wordsVal.toLocaleString()}) conflict with numeric figure "${numPart}" ($${numVal.toLocaleString()}). Under legal drafting rules (UCC § 3-114), words govern over figures, posing immediate litigation risk.`,
            numericValue: numVal,
            wordValue: wordsVal,
            line: lineNum,
            snippet: lineText.trim(),
            severity: 'critical'
          });
        }
      }
    }

    // Pattern B: $Digits followed by (Words)
    // e.g. "$10,000 (Twenty Thousand Dollars)"
    const patternB = /([$€£¥₹A-Za-z]*\s*[\d,]+(?:\.\d{1,2})?\s*[A-Za-z]*)\s*\(\s*([A-Za-z\s-]+(?:dollars?|euros?|pounds?|cents?)?)\s*\)/gi;
    while ((match = patternB.exec(lineText)) !== null) {
      const numPart = match[1].trim();
      const wordsPart = match[2].trim();

      const numVal = parseNumericAmount(numPart);
      const wordsVal = parseWordsToNumber(wordsPart);

      if (numVal > 0 && wordsVal !== null) {
        // Avoid duplicate if already matched by Pattern A
        const existing = financialPairings.find(p => p.line === lineNum && p.numericVal === numVal);
        if (!existing) {
          const isMatch = Math.abs(wordsVal - numVal) < 0.01;
          financialPairings.push({
            numeric: numPart,
            words: wordsPart,
            numericVal: numVal,
            wordsVal: wordsVal,
            currency: numPart.includes('€') ? 'EUR' : (numPart.includes('£') ? 'GBP' : 'USD'),
            match: isMatch,
            line: lineNum,
            snippet: lineText.trim()
          });

          if (!isMatch) {
            issues.push({
              type: 'amount_mismatch',
              title: 'Financial Amount Discrepancy',
              details: `Numeric figure "${numPart}" ($${numVal.toLocaleString()}) conflicts with parenthetical written words "${wordsPart}" ($${wordsVal.toLocaleString()}).`,
              numericValue: numVal,
              wordValue: wordsVal,
              line: lineNum,
              snippet: lineText.trim(),
              severity: 'critical'
            });
          }
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  // 3. TIMELINE & CHRONOLOGY AUDIT
  // --------------------------------------------------------------------------
  let effectiveDateIso = null;
  let expirationDateIso = null;

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;

    // Notice Period Detection
    const noticeMatch = lineText.match(/\b(\d+|one|two|three|four|five|ten|fifteen|twenty|thirty|forty-five|sixty|ninety|180|365)\s*(?:\((\d+)\)\s*)?(?:calendar\s+|business\s+)?(?:days?|months?|weeks?|years?)\s*(?:prior\s+)?(?:written\s+)?notice\b/i);
    if (noticeMatch) {
      let days = noticeMatch[2] ? parseInt(noticeMatch[2], 10) : parseInt(noticeMatch[1], 10);
      if (isNaN(days)) {
        days = parseWordsToNumber(noticeMatch[1].toLowerCase()) || 30;
      }
      noticePeriods.push({
        periodDays: days,
        context: noticeMatch[0],
        line: lineNum
      });
    }

    // Effective Date
    const effMatch = lineText.match(/(?:Effective Date|commences on|commencing on|effective as of)/i);
    if (effMatch) {
      const dateInfo = extractDateFromText(lineText);
      if (dateInfo) {
        effectiveDateIso = dateInfo.parsedDate;
        timeline.push({
          event: 'Effective Date',
          date: dateInfo.rawDate,
          parsedDate: dateInfo.parsedDate,
          line: lineNum,
          isPast: dateInfo.parsedDate < refDateStr
        });
      }
    }

    // Expiration Date
    const expMatch = lineText.match(/(?:expiration date|shall terminate on|shall expire on|expires on|expire on|ending on|end on|term expires on)/i);
    if (expMatch) {
      const dateInfo = extractDateFromText(lineText);
      if (dateInfo) {
        expirationDateIso = dateInfo.parsedDate;
        const isPast = dateInfo.parsedDate < refDateStr;
        timeline.push({
          event: 'Expiration Date',
          date: dateInfo.rawDate,
          parsedDate: dateInfo.parsedDate,
          line: lineNum,
          isPast
        });

        if (isPast) {
          issues.push({
            type: 'expired_date',
            title: 'Contract Expiration Date Has Passed',
            details: `Contract expiration date "${dateInfo.rawDate}" (${dateInfo.parsedDate}) is earlier than reference date (${refDateStr}). Executing an expired agreement risks voidness or unintended month-to-month holdover status.`,
            dateStr: dateInfo.parsedDate,
            line: lineNum,
            snippet: lineText.trim(),
            severity: 'critical'
          });
        }
      }
    }

    // Execution Date
    const execMatch = lineText.match(/(?:executed on|signed on|made and entered into as of|execution date)/i);
    if (execMatch) {
      const dateInfo = extractDateFromText(lineText);
      if (dateInfo) {
        timeline.push({
          event: 'Execution Date',
          date: dateInfo.rawDate,
          parsedDate: dateInfo.parsedDate,
          line: lineNum,
          isPast: dateInfo.parsedDate < refDateStr
        });
      }
    }

    // General Milestone / Target Date (e.g. "completed by March 15, 2021")
    const milestoneMatch = lineText.match(/(?:completed by|deployed by|delivered on|due on|deadline is)/i);
    if (milestoneMatch) {
      const dateInfo = extractDateFromText(lineText);
      if (dateInfo) {
        const isPast = dateInfo.parsedDate < refDateStr;
        timeline.push({
          event: 'Milestone Deadline',
          date: dateInfo.rawDate,
          parsedDate: dateInfo.parsedDate,
          line: lineNum,
          isPast
        });

        if (isPast) {
          issues.push({
            type: 'expired_date',
            title: 'Milestone Deadline Has Passed',
            details: `Contract milestone date "${dateInfo.rawDate}" (${dateInfo.parsedDate}) is in the past relative to reference date (${refDateStr}).`,
            dateStr: dateInfo.parsedDate,
            line: lineNum,
            snippet: lineText.trim(),
            severity: 'critical'
          });
        }
      }
    }
  });

  // --------------------------------------------------------------------------
  // 4. CHRONOLOGY CONTRADICTION & NOTICE TRAP CHECKS
  // --------------------------------------------------------------------------
  if (effectiveDateIso && expirationDateIso) {
    if (effectiveDateIso > expirationDateIso) {
      issues.push({
        type: 'timeline_contradiction',
        title: 'Effective Date Post-Dates Expiration Date',
        details: `Chronological contradiction: Effective Date (${effectiveDateIso}) occurs after Expiration Date (${expirationDateIso}). Contract terminates before it begins.`,
        line: 1,
        snippet: `Effective: ${effectiveDateIso} vs Expiration: ${expirationDateIso}`,
        severity: 'critical'
      });
    }
  }

  // Notice Period Trap check (e.g. long cancellation notice vs immediate cancellation)
  if (noticePeriods.length > 0) {
    const longNotice = noticePeriods.find(p => p.periodDays >= 60);
    if (longNotice && text.toLowerCase().includes('immediate termination without cause')) {
      issues.push({
        type: 'timeline_contradiction',
        title: 'Conflicting Notice Provisions',
        details: `Document requires ${longNotice.periodDays}-day notice while also reserving the right to immediate termination without cause.`,
        line: longNotice.line,
        snippet: longNotice.context,
        severity: 'warning'
      });
    }
  }

  const mismatchCount = issues.filter(i => i.type === 'amount_mismatch').length;
  const dateIssuesCount = issues.filter(i => i.type === 'expired_date' || i.type === 'timeline_contradiction').length;

  return {
    financialPairings,
    timeline,
    noticePeriods,
    issues,
    stats: {
      totalAmounts: Math.max(totalExtractedAmounts, financialPairings.length),
      mismatchCount,
      totalDates: timeline.length,
      dateIssuesCount
    }
  };
}
