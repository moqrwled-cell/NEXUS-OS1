/**
 * Nexus ContractGuard Enterprise — Air-Gapped PII Redaction Engine
 * 100% Client-Side In-Memory Sanitization for Legal & Discovery Compliance.
 * Protects SSNs, Financial Accounts, Phone Numbers, Emails, and Confidential Entities.
 */

export const PII_RULES = [
  {
    id: 'ssn',
    label: 'Social Security Numbers (SSN)',
    category: 'Government Identifiers',
    regex: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    maskTag: '[REDACTED-SSN]',
    description: 'US Social Security Numbers (e.g., 000-00-0000, 000.00.0000)'
  },
  {
    id: 'creditCard',
    label: 'Credit & Debit Cards',
    category: 'Financial',
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11}|(?:\d{4}[-\s]?){3}\d{4})\b/g,
    maskTag: '[REDACTED-CARD]',
    description: 'Visa, MasterCard, Amex, Discover card numbers'
  },
  {
    id: 'bankAccount',
    label: 'Bank Accounts & IBAN',
    category: 'Financial',
    regex: /\b[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]{4}){2,7}(?:[ -]?[A-Z0-9]{1,4})?\b|\b(?:acct|account|acc|routing|aba)\s*(?:#|no|num|number)?[:\s]*(\d{6,17})\b/gi,
    maskTag: '[REDACTED-BANK]',
    description: 'International IBANs (including spaced groupings) and US routing/account numbers'
  },
  {
    id: 'email',
    label: 'Email Addresses',
    category: 'Communication',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    maskTag: '[REDACTED-EMAIL]',
    description: 'Corporate and personal email addresses'
  },
  {
    id: 'phone',
    label: 'Phone Numbers',
    category: 'Communication',
    regex: /(?<![\d.])(?:\+\d{1,3}[-.\s]?(?:\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})|(?:\(\d{3}\)[-.\s]?|\d{3}[-.\s])\d{3}[-.\s]\d{4})(?![\d.])/g,
    maskTag: '[REDACTED-PHONE]',
    description: 'International and US formatted telephone numbers'
  },
  {
    id: 'ip',
    label: 'IP Addresses (IPv4 / IPv6)',
    category: 'Technical',
    regex: /(?<![\d.])\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b(?!(?:\.\d|\d))|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/gi,
    maskTag: '[REDACTED-IP]',
    description: 'Public and private network IP addresses'
  },
  {
    id: 'ein',
    label: 'Tax ID / EIN',
    category: 'Government Identifiers',
    regex: /\b\d{2}-\d{7}\b/g,
    maskTag: '[REDACTED-EIN]',
    description: 'US Federal Employer Identification Numbers'
  }
];

function passesLuhn(digits) {
  let sum = 0;
  let doubleNext = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    if (doubleNext) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    doubleNext = !doubleNext;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

function shouldSkipPIIMatch(ruleId, match, offset, fullStr) {
  const before = fullStr.slice(Math.max(0, offset - 45), offset);
  const after = fullStr.slice(offset + match.length, offset + match.length + 12);

  if (ruleId === 'ssn') {
    // Reject if embedded inside hyphenated parcel/tracking IDs (e.g. 045-210-09-001 or 123-45-6789-00)
    if (/\d[-.]$/.test(before) || /^[-.]\d/.test(after)) return true;
    // Reject parcel APN, ZIP+4, docket, ABA/routing unless explicitly labeled SSN
    if (
      /\b(?:apn|assessor|parcel|zip|postal|routing|aba|account|acct|swift|iban|docket|case\s*no\.?|index\s*no\.?|matter|tracking|waybill|order|ref(?:erence)?|policy|claim|patent|serial)\b[^\n]{0,40}$/i.test(before) &&
      !/\b(?:ssn|social\s+security|tin|tax\s*id)\b[^\n]{0,25}$/i.test(before)
    ) {
      return true;
    }
  }

  if (ruleId === 'creditCard') {
    const digits = match.replace(/\D/g, '');
    if (/^(\d)\1+$/.test(digits)) return true; // all repeated digits
    const luhnValid = passesLuhn(digits);
    const hasMajorIIN = /^(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|6(?:011|5\d\d)\d{12}|35\d{14})$/.test(digits);
    const nonCardContext = /\b(?:tracking|waybill|awb|parcel|shipment|order|serial|ref(?:erence)?|sku|lot|batch|imei|confirmation)\b[^\n]{0,40}$/i.test(before) &&
      !/\b(?:card|visa|mastercard|amex|discover|payment|billing|cc)\b[^\n]{0,30}$/i.test(before);
    if (nonCardContext && !luhnValid) return true;
    if (!hasMajorIIN && !luhnValid) return true;
  }

  if (ruleId === 'ein') {
    if (
      /\b(?:docket|case|civil|criminal|matter|index|patent|trademark|serial|application|po\s*box|zip|postal|apn|parcel)\b[^\n]{0,40}$/i.test(before) &&
      !/\b(?:ein|fein|employer\s+id(?:entification)?|tax\s+id)\b[^\n]{0,25}$/i.test(before)
    ) {
      return true;
    }
  }

  if (ruleId === 'ip') {
    if (/\b(?:section|clause|article|paragraph|sec|exhibit|schedule|version|ver|release|build|sdk|api|app)\b\.?\s*$/i.test(before)) {
      return true;
    }
    if (/(?:^|[\s(])v\s*$/i.test(before)) {
      return true;
    }
  }

  return false;
}

/**
 * Executes multi-pattern PII sanitization.
 * 
 * @param {string} rawText - Input document text
 * @param {Array<string>} [activeRuleIds] - Array of enabled rule IDs
 * @param {Array<string>} [customKeywords] - Array of custom corporate names/terms to scrub
 * @param {'block' | 'label' | 'asterisk'} [maskStyle='block'] - Redaction visual representation
 * @returns {Object} Sanitized text and statistical detection breakdown
 */
export function sanitizeDocumentPII(
  rawText = '',
  activeRuleIds = ['ssn', 'creditCard', 'bankAccount', 'email', 'phone', 'ip', 'ein'],
  customKeywords = [],
  maskStyle = 'block'
) {
  if (!rawText) {
    return {
      sanitizedText: '',
      totalRedactions: 0,
      detectedEntities: [],
      ruleCounts: {}
    };
  }

  let sanitized = rawText;
  let totalRedactions = 0;
  const detectedEntities = [];
  const ruleCounts = {};

  const getMask = (ruleId, defaultTag, matchedLength) => {
    if (maskStyle === 'label') return defaultTag;
    if (maskStyle === 'asterisk') return '*'.repeat(Math.min(matchedLength, 12));
    return '█████████'; // standard judicial black block
  };

  // 1. Process active standard rules
  const activeRules = PII_RULES.filter(r => activeRuleIds.includes(r.id));

  activeRules.forEach((rule) => {
    let count = 0;
    const occurrences = [];

    // Clone regex with global flag
    const regex = new RegExp(rule.regex.source, rule.regex.flags || 'g');

    sanitized = sanitized.replace(regex, (match, ...args) => {
      const fullStr = args[args.length - 1];
      const offset = args[args.length - 2];
      if (shouldSkipPIIMatch(rule.id, match, offset, fullStr)) {
        return match;
      }
      count++;
      totalRedactions++;
      if (occurrences.length < 50) {
        occurrences.push(match);
      }
      return getMask(rule.id, rule.maskTag, match.length);
    });

    if (count > 0) {
      ruleCounts[rule.id] = count;
      detectedEntities.push({
        id: rule.id,
        label: rule.label,
        category: rule.category,
        count,
        sample: occurrences.slice(0, 5)
      });
    }
  });

  // 2. Process custom sensitive keywords/parties
  const cleanKeywords = (customKeywords || [])
    .map(k => (typeof k === 'string' ? k.trim() : ''))
    .filter(k => k.length > 1);

  if (cleanKeywords.length > 0) {
    let customCount = 0;
    const customOccurrences = [];

    cleanKeywords.forEach((word) => {
      // Escape regex special chars
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const customRegex = new RegExp(`\\b${escaped}\\b`, 'gi');

      sanitized = sanitized.replace(customRegex, (match) => {
        customCount++;
        totalRedactions++;
        if (customOccurrences.length < 50) {
          customOccurrences.push(match);
        }
        return getMask('custom', `[REDACTED-${word.toUpperCase()}]`, match.length);
      });
    });

    if (customCount > 0) {
      ruleCounts['custom'] = customCount;
      detectedEntities.push({
        id: 'custom',
        label: 'Custom Confidential Keywords',
        category: 'Custom Entity',
        count: customCount,
        sample: [...new Set(customOccurrences)].slice(0, 5)
      });
    }
  }

  return {
    sanitizedText: sanitized,
    totalRedactions,
    detectedEntities,
    ruleCounts
  };
}
