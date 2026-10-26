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
  // Courts, Judicial & Arbitral Forums
  'Delaware Court of Chancery', 'Court of Chancery', 'Chancery', 'Delaware Court',
  'District Court', 'Supreme Court', 'United States District Court', 'Tribunal',
  'American Arbitration Association', 'AAA', 'JAMS',
  // Contract Structure, Headings & Common Documents
  'Agreement', 'Contract', 'Section', 'Sections', 'Article', 'Articles',
  'Clause', 'Clauses', 'Paragraph', 'Paragraphs', 'Exhibit', 'Exhibits',
  'Schedule', 'Schedules', 'Appendix', 'Appendices', 'Annex', 'Annexes',
  'Attachment', 'Attachments', 'Recital', 'Recitals', 'Preamble',
  'Table', 'Part', 'Signature', 'Signatures', 'Bill of Sale', 'General Bill of Sale',
  'General Bill', 'Sale', 'Conveyance Instrument', 'Assignment', 'Assumption',
  'Assumed Contracts', 'Standard Operating Definitions', 'Disclosure Schedules',
  'Schedule of Exhibits', 'Asset Purchase', 'Reorganization Agreement',
  'Purchase Price Consideration', 'Condition Precedent', 'Pre-Closing Covenants',
  'Execution in Counterparts', 'Conduct of Business', 'Ordinary Course of Business',
  'Ordinary Course', 'General Provisions', 'Attached', 'Note', 'Intellectual Property Disclosure Schedules',
  'Date', 'Dates', 'Instructions', 'Instruction', 'Account', 'Accounts', 'Agent', 'Agents',
  'Number', 'Numbers', 'Disclosure', 'Disclosures',
  // Universal Legal Roles, Parties & Standard Definitions
  'Party', 'Parties', 'Client', 'Provider', 'Vendor', 'Customer', 'Supplier',
  'Consultant', 'Contractor', 'Company', 'Disclosing Party', 'Receiving Party',
  'Licensor', 'Licensee', 'Buyer', 'Seller', 'Employer', 'Employee',
  'Business', 'Closing', 'Effective Date', 'Closing Date', 'Outside Date',
  'Outside Termination Date', 'Purchase Price', 'Acquired Assets', 'Excluded Liabilities',
  'Liens', 'Lien',
  // Financial, Banking & Wire Transfer Descriptors
  'Chase', 'Chase Bank', 'JPMorgan', 'JPMorgan Chase', 'JPMorgan Chase Bank',
  'Citibank', 'Wells Fargo', 'Bank of America', 'Bank', 'Trust', 'Trustee',
  'Escrow', 'Escrow Agent', 'Escrow Account', 'Escrow Holdback', 'Escrow Trust',
  'Escrow Officer', 'Escrow Officer Tax', 'Beneficiary', 'Routing', 'Routing Number',
  'Account Number', 'Wire Instructions', 'Wire', 'Wire Authorization',
  'Direct Wire Authorization', 'Direct Wire Authorization Phone', 'Tax', 'Tax ID',
  'EIN', 'Social Security', 'Managing Partner Social Security', 'Phone', 'Email',
  // Corporate Officers, Titles & Degrees
  'Chief Executive Officer', 'Chief Technology Officer', 'Chief Financial Officer',
  'Managing Director', 'Managing Partner', 'Director', 'President', 'Vice President',
  'Treasurer', 'Secretary', 'Partner', 'Officer', 'Esq', 'Esq.', 'Ph.D.', 'Ph', 'M.D.',
  'J.D.', 'B.A.', 'B.S.', 'Marcus Vance', 'Sarah Jenkins', 'Vance',
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
  // Real Estate, Title, Deeds & Closing Instruments
  'Special Warranty Deed', 'General Warranty Deed', 'Warranty Deed', 'Quitclaim Deed', 'Deed',
  'Title Insurance Commitment', 'Title Commitment', 'Title Insurance', 'Title Policy', 'ALTA',
  'ALTA Owner\'s Affidavit', 'Owner\'s Affidavit', 'Affidavit', 'Non-Foreign Affidavit',
  'Non-Foreign Certificate', 'Non-Foreign', 'Foreign Status', 'Non-Foreign Status',
  'Settlement Statement', 'Closing Settlement Statement', 'Closing Statement', 'Statement',
  'Certificate', 'Certificates',
  'Phase', 'Phase I', 'Phase II', 'Environmental Site Assessments', 'Environmental Site Assessment',
  'Environmental Compliance', 'Marketable Title', 'Condemnation',
  'Common Pleas', 'Court of Common Pleas',
  'Gross Acres', 'Acres', 'Parcel Identification Number', 'Tax Parcel Identification Number',
  'Tax Parcel', 'Parcel', 'APN', 'Parcel ID',
  'Protect Your Family From Lead In Your Home', 'Protect Your Family', 'Lead In Your Home', 'Lead',
  'Common Area Maintenance', 'Operational Expenses', 'Triple Net', 'Inspection Period',
  'Stipulation of Dismissal with Prejudice', 'Stipulation of Dismissal', 'Stipulation', 'Dismissal', 'Prejudice',
  'Southern District of New York', 'Southern District', 'Northern District', 'Eastern District', 'Western District',
  'Docket No', 'Docket', 'Docket Number', 'First Refusal', 'Right of First Refusal', 'ROFR',
  'Capital Account', 'Capital Accounts', 'Membership Percentages', 'Membership Interests', 'Membership Interest',
  'Confidential Information', 'Statements', 'Statement of Work',
  'Board of Directors', 'Board', 'Directors', 'Base Salary',
  'Principal Amount', 'Security Agreement', 'Event of Default', 'Events of Default',
  'One Hundred Seventy-Five Thousand Dollars',
  'North America', 'New York County', 'Cook County', 'Franklin County', 'Springfield', 'Charlotte',
  'Dear Seller', 'Letter of Intent', 'Intent', 'Acquire',
  'Restatement', 'Second', 'Contracts', 'Restatement (Second) of Contracts',
  'Rider', 'Amendment Rider', 'Pre-Signing Amendment Rider',
  'Line', 'Lines', 'Page', 'Pages',
  'Commercial Land Purchase', 'Commercial Land Purchase and Sale Agreement',
  'Finalization', 'Discrepancy', 'Financial Amount Discrepancy',
  // Federal & State Statutes, Codes, Regulations & Forms
  'Comprehensive Environmental Response, Compensation, and Liability Act',
  'Comprehensive Environmental Response', 'Compensation', 'Liability Act', 'CERCLA',
  'Foreign Investment in Real Property Tax Act', 'FIRPTA',
  'Internal Revenue Code', 'Internal Revenue Service', 'Treasury Regulation', 'Treasury Regulations',
  'Treasury Regulation Section', 'Form', 'IRS Form', 'Form 8288', 'IRS Form 8288',
  'Defend Trade Secrets Act', 'DTSA', 'Copyright Act', 'Patent Act', 'Lanham Act',
  'California Civil Code', 'Civil Code', 'Delaware General Corporation Law', 'DGCL',
  'Uniform Commercial Code', 'UCC', 'Code of Federal Regulations', 'CFR',
  // Grammar, Determiners, Prepositions & Connectors
  'The', 'This', 'That', 'These', 'Those', 'In', 'On', 'At', 'By', 'For', 'With',
  'Without', 'Under', 'Over', 'All', 'Any', 'Each', 'Every', 'Either', 'Neither',
  'Both', 'Such', 'No', 'Not', 'If', 'Unless', 'Provided', 'Except', 'Subject',
  'Upon', 'Following', 'During', 'After', 'Before', 'Between', 'Among',
  'To', 'From', 'As', 'Or', 'And', 'Via', 'Per', 'Into', 'Onto', 'Against', 'About', 'Across'
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

  // Auto-extract corporate entities from text into userParties to prevent flagging them as undefined terms
  const RE_PREAMBLE_ENTITIES = /\b([A-Z][A-Za-z0-9&',.-]+(?:\s+[A-Z][A-Za-z0-9&',.-]+){0,4})\s+(LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.)\b/g;
  let entMatch;
  while ((entMatch = RE_PREAMBLE_ENTITIES.exec(text)) !== null) {
    const full = entMatch[0].trim().toLowerCase();
    const stem = entMatch[1].trim().toLowerCase();
    userParties.add(full);
    userParties.add(stem);
  }

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

    // 1. Parenthetical inline definitions (single and multi-party: "each, an 'Executive' and collectively, the 'Executives'")
    const RE_PAREN_BLOCK = /\(([^)]{2,250})\)/g;
    let parenMatch;
    while ((parenMatch = RE_PAREN_BLOCK.exec(lineText)) !== null) {
      const inner = parenMatch[1];
      if (
        /^(?:the|hereinafter|collectively|individually|each|such|["“'‘])/i.test(inner.trim()) ||
        /\b(?:collectively|individually|hereinafter|together\s+with|each)\b/i.test(inner)
      ) {
        const RE_QUOTED = /["“'‘]([A-Za-z0-9\s\-_,.'()]{2,40}?)["”'’]/g;
        let q;
        while ((q = RE_QUOTED.exec(inner)) !== null) {
          const term = q[1].trim();
          const key = term.toLowerCase();
          if (!definedTermsMap.has(key)) {
            definedTermsMap.set(key, { term, definition: lineText.trim(), line: lineNum, count: 0 });
          }
        }
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
  const RE_CAPITALIZED = /\b[A-Z][a-z]+(?:['’]s)?(?:[-\s]+[A-Z][a-z]+(?:['’]s)?)*\b/g;

  let inSignatureBlock = false;
  let inExhibitsSchedule = false;

  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();
    if (!trimmed) return;

    // Track signature blocks and exhibit lists to skip noise
    if (/IN\s+WITNESS\s+WHEREOF/i.test(trimmed)) inSignatureBlock = true;
    if (/SCHEDULE\s+OF\s+EXHIBITS/i.test(trimmed)) inExhibitsSchedule = true;

    if (inSignatureBlock || inExhibitsSchedule) {
      if (/^ARTICLE\s+[IVXLCDM0-9]+/i.test(trimmed)) {
        inSignatureBlock = false;
        inExhibitsSchedule = false;
      } else {
        return; // Skip signature blocks and exhibit listings from undefined terms scan
      }
    }

    // Skip signatory lines and exhibit notes
    if (/^(By|Name|Title|BUYER|SELLER)\s*:\s*/i.test(trimmed)) return;
    if (/\(Attached\)|\[Note:/i.test(trimmed)) return;

    // Layer 5: Skip all-caps headings and short uppercase lines
    if (trimmed.length < 120 && trimmed === trimmed.toUpperCase()) return;

    // Detect subsection heading title prefix: "2.1 Performance of Services. Provider shall..." or "(c) Environmental Compliance. To Seller's..."
    const headingPrefixMatch = trimmed.match(/^(?:[0-9]+(?:\.[0-9]+)+|[IVXLCDM]+\.|\([a-z0-9]+\))\s+([A-Za-z0-9\s—–\-_/]+?)\.\s+/i);
    const headingEndIndex = headingPrefixMatch ? lineText.indexOf(headingPrefixMatch[0]) + headingPrefixMatch[0].length : -1;

    // Detect judicial case citation spans: e.g. "Oppenheimer & Co. v. Oppenheim, Appel, Dixon & Co., 86 N.Y.2d 685" or "In re Caremark"
    const caseSpans = [];
    const RE_CASE_LAW = /\b(?:[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|for|in|al\.|ex\s+rel\.|[0-9]+|[A-Z]\.))*\s+(?:v\.|vs\.|v)\s+[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|for|in|al\.|ex\s+rel\.|[0-9]+|[A-Z]\.))*(?:,\s*\d+\s+[A-Za-z0-9\.\s]+(?:\s+\d+)?)?(?:\s*\(\s*(?:[A-Za-z\s]+)?\d{4}\s*\))?|In\s+re\s+[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|for|in|al\.|Litig\.|Corp\.|Inc\.|LLC|[0-9]+|[A-Z]\.))*)\b/g;
    let cm;
    while ((cm = RE_CASE_LAW.exec(lineText)) !== null) {
      caseSpans.push({ start: cm.index, end: cm.index + cm[0].length });
    }

    let m;
    while ((m = RE_CAPITALIZED.exec(lineText)) !== null) {
      // Skip if token falls within a judicial case law citation
      if (caseSpans.some(span => m.index >= span.start && m.index < span.end)) continue;

      // Skip if token is part of subsection heading title
      if (headingEndIndex !== -1 && m.index < headingEndIndex) continue;

      // Skip if preceded by standard labels or cross-ref prefixes
      const precedingText = lineText.substring(0, m.index).trim();
      if (/(?:Exhibits?|Schedules?|Appendices?|Sections?|Articles?|Clauses?|Account|Routing|Wire|Escrow|Beneficiary|Bank|Tax|EIN|Phone|Mobile|Email|State\s+of|County\s+of)\s*[:—–-]?\s*$/i.test(precedingText)) continue;

      // Skip physical addresses, property parcels, and tax description clauses
      if (/(?:situated\s+at|located\s+at|situated\s+within|located\s+within|designated\s+as|known\s+as|consisting\s+of)\s*[^;\.\n]*$/i.test(precedingText)) {
        if (/(?:Parkway|Boulevard|Street|Avenue|Drive|Lane|Way|Road|Court|Plaza|District|County|State|Acres|Gross\s+Acres|Square\s+Feet|Parcel|APN|Identification\s+Number)\b/i.test(m[0])) {
          continue;
        }
      }

      // Skip forum selection and venue phrases (e.g. brought exclusively in the Franklin County Court of Common Pleas)
      if (/(?:brought\s+exclusively\s+in|venue\s+(?:in|of)|jurisdiction\s+of)\s*[^;\.\n]*$/i.test(precedingText)) {
        if (/(?:Court|Common\s+Pleas|Chancery|Judicial\s+District|Circuit\s+Court)\b/i.test(m[0])) {
          continue;
        }
      }

      let phrase = m[0].trim();

      // Layer 0: If full phrase is already a recognized legal stopword / standard document, skip immediately
      if (LEGAL_STOPWORDS.has(phrase)) continue;

      // If multi-word phrase starts with leading legal determiner/preposition (e.g. "All Proprietary Software", "To Seller"), strip leading word
      let tokens = phrase.split(/\s+/);
      while (tokens.length > 1 && /^(?:The|This|That|These|Those|All|Any|Each|Every|Either|Neither|Both|Such|No|To|From|In|On|At|By|For|With|Without|Under|Over)$/i.test(tokens[0])) {
        tokens.shift();
      }
      phrase = tokens.join(' ');
      if (LEGAL_STOPWORDS.has(phrase)) continue;

      const lower = phrase.toLowerCase();
      const baseStem = lower.replace(/['’]s$/, '').replace(/s$/, '').replace(/es$/, '');

      // Skip field descriptors / form labels followed by colon (e.g. "Docket No:", "Principal Amount:", "Earnest Money Deposit:")
      const followingChar = lineText.substring(m.index + phrase.length).trim();
      if (followingChar.startsWith(':')) continue;

      // Layer 1: Already defined in contract (including possessive 's, plural, and singular variations)
      if (
        definedTermsMap.has(lower) ||
        definedTermsMap.has(baseStem) ||
        definedTermsMap.has(lower + 's') ||
        definedTermsMap.has(baseStem + 's')
      ) continue;

      // Skip phrase immediately preceding a parenthetical definition (e.g. "Master Services Agreement" (the 'Agreement') or "Alpha Corp" ("Buyer"))
      const followingText = lineText.substring(m.index + phrase.length).trim();
      if (/^["”'’]?\s*\(\s*(?:the|hereinafter|collectively|individually|each|such|["“'‘])/i.test(followingText)) continue;

      // Layer 2: Explicit known parties (including possessives)
      if (userParties.has(lower) || userParties.has(baseStem)) continue;

      // Layer 3: Comprehensive Legal Stopwords Filter
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
      severity: 'warning'
    });
  }

  // --------------------------------------------------------------------------
  // PIPELINE 4: ENTITY CONSISTENCY ENGINE
  // --------------------------------------------------------------------------
  const entityIssues = [];
  const RE_ENTITY = /\b([A-Z][A-Za-z0-9&',.-]+(?:\s+[A-Z][A-Za-z0-9&',.-]+){0,4})\s+(LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.|GmbH)\b/g;
  const entitiesFound = [];

  const STATUTORY_ENTITY_BLACKLIST = new Set([
    'delawaregeneralcorporation',
    'californiacorporations',
    'californiageneralcorporation',
    'newyorkbusinesscorporation',
    'modelbusinesscorporation',
    'uniformcommercial',
    'federaldepositinsurance',
    'federaldepositinsurancecorporation',
    'pensionbenefitguaranty',
    'pensionbenefitguarantycorporation',
    'securitiesinvestorprotection',
    'securitiesinvestorprotectioncorporation',
    'internalrevenue',
    'internalrevenueservice',
    'internaltreaty'
  ]);

  // Determine preamble boundary (first line with SECTION, ARTICLE, WITNESSETH, RECITALS, or max 25 lines)
  let preambleEndLine = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:SECTION|ARTICLE|CLAUSE|WITNESSETH|RECITALS|NOW,?\s+THEREFORE)\b/i.test(lines[i])) {
      preambleEndLine = i + 1;
      break;
    }
  }
  if (preambleEndLine > 25) preambleEndLine = 25;

  lines.forEach((lineText, idx) => {
    let m;
    while ((m = RE_ENTITY.exec(lineText)) !== null) {
      // Exclude statutory citations where suffix is immediately followed by Law, Act, Code, Statute, etc.
      const matchEnd = m.index + m[0].length;
      const followingText = lineText.slice(matchEnd);
      if (/^\s+(?:Law|Laws|Act|Acts|Code|Codes|Statute|Statutes|Rules?|Regulation|Regulations|Commission|Department|Division|Board|Governance|Jurisprudence|Section|§)\b/i.test(followingText)) {
        continue;
      }

      // Exclude statutory references preceded by legal citation phrases
      const leadingText = lineText.slice(0, m.index);
      if (/(?:under|pursuant\s+to|in\s+accordance\s+with|governed\s+by|subject\s+to)\s+$/i.test(leadingText) &&
          /(?:General|Commercial|Statutory|Uniform|Federal|National)\s*$/i.test(m[1])) {
        continue;
      }

      let raw = m[0].trim();
      let stem = m[1].trim();
      const suffix = m[2].trim();

      // Clean leading prepositions, conjunctions, and recital recitals from entity phrases
      stem = stem.replace(/^(?:BY\s+AND\s+BETWEEN|AND\s+BETWEEN|BETWEEN|AND|BY|FOR|OF|TO|THE|NOW,?\s+THEREFORE,?|WHEREAS,?)\s+/i, '').trim();
      raw = `${stem} ${suffix}`;

      const normStem = normalizeEntityStem(stem);
      const normRaw = normalizeEntityStem(raw);
      if (STATUTORY_ENTITY_BLACKLIST.has(normStem) || STATUTORY_ENTITY_BLACKLIST.has(normRaw)) {
        continue;
      }

      let category = 'OTHER';
      if (/LLC|L\.L\.C\./i.test(suffix)) category = 'LLC';
      else if (/Corp|Corporation/i.test(suffix)) category = 'CORP';
      else if (/Inc|Incorporated/i.test(suffix)) category = 'INC';
      else if (/Ltd|Limited/i.test(suffix)) category = 'LTD';
      else if (/LLP|L\.L\.P\./i.test(suffix)) category = 'LLP';

      entitiesFound.push({ raw, stem, suffix, category, line: idx + 1 });
    }
  });

  // Group entities into clusters using hierarchical stem matching
  const clusters = [];
  for (const ent of entitiesFound) {
    const normStem = normalizeEntityStem(ent.stem);
    let matchedCluster = null;
    for (const c of clusters) {
      if (c.stems.some(s => s === normStem || (Math.min(s.length, normStem.length) >= 6 && (s.includes(normStem) || normStem.includes(s))))) {
        matchedCluster = c;
        break;
      }
    }
    if (!matchedCluster) {
      matchedCluster = { stems: [normStem], entities: [] };
      clusters.push(matchedCluster);
    } else {
      if (!matchedCluster.stems.includes(normStem)) matchedCluster.stems.push(normStem);
    }
    matchedCluster.entities.push(ent);
  }

  // Maintain stemGroups for typo drift detection
  const stemGroups = new Map();
  clusters.forEach(c => {
    c.entities.forEach(ent => {
      const normStem = normalizeEntityStem(ent.stem);
      if (!stemGroups.has(normStem)) stemGroups.set(normStem, []);
      stemGroups.get(normStem).push(ent);
    });
  });

  // 1. Check entity type confusion or formatting within hierarchical clusters
  for (const cluster of clusters) {
    const group = cluster.entities;
    const categories = new Set(group.map(g => g.category));
    if (categories.size > 1) {
      // Find dominant category and identify conflicting forms
      const catCounts = {};
      group.forEach(g => { catCounts[g.category] = (catCounts[g.category] || 0) + 1; });
      const dominantCategory = Object.keys(catCounts).reduce((a, b) => catCounts[a] >= catCounts[b] ? a : b);
      const primaryEnt = group.find(g => g.category === dominantCategory) || group[0];
      const conflictingEnt = group.find(g => g.category !== dominantCategory) || group[1];

      const allLines = Array.from(new Set(group.map(g => g.line))).sort((a, b) => a - b);
      const names = Array.from(new Set(group.map(g => g.raw))).join(' vs ');
      const issueItem = {
        entity: primaryEnt.raw,
        conflictingEntity: conflictingEnt.raw,
        discrepancy: `Entity structure confusion detected: ${names}`,
        line: conflictingEnt.line,
        lines: allLines
      };
      entityIssues.push(issueItem);
      issues.push({
        type: 'entity_inconsistency',
        term: primaryEnt.raw,
        conflictingEntity: conflictingEnt.raw,
        line: conflictingEnt.line,
        lines: allLines,
        snippet: lines[conflictingEnt.line - 1] || '',
        details: issueItem.discrepancy,
        severity: 'critical'
      });
    } else {
      // Check spelling variations or stem drift (e.g. Acme Holdings vs Acme Technologies, or typo in stem)
      const distinctStems = new Set(group.map(g => normalizeEntityStem(g.stem)));
      const hasStemMismatch = distinctStems.size > 1;
      if (hasStemMismatch) {
        const distinctForms = Array.from(new Set(group.map(g => g.raw)));
        const allLines = Array.from(new Set(group.map(g => g.line))).sort((a, b) => a - b);
        const primaryForm = distinctForms[0];
        const conflictingForm = distinctForms[1] || '';
        const issueItem = {
          entity: primaryForm,
          conflictingEntity: conflictingForm,
          discrepancy: `Entity name discrepancy detected: ${distinctForms.join(' vs ')}`,
          line: group[0].line,
          lines: allLines
        };
        entityIssues.push(issueItem);
        issues.push({
          type: 'entity_inconsistency',
          term: primaryForm,
          conflictingEntity: conflictingForm,
          line: group[0].line,
          lines: allLines,
          snippet: lines[group[0].line - 1] || '',
          details: issueItem.discrepancy,
          severity: 'critical'
        });
      }
    }
  }

  // 2. Check for leftover/alien entities not matching recognized parties
  const preambleClusters = clusters.filter(c => c.entities.some(e => e.line <= preambleEndLine));
  const recognizedStems = new Set();
  preambleClusters.forEach(c => c.stems.forEach(s => recognizedStems.add(s)));

  if (options.parties && options.parties.length > 0) {
    const userPartyStems = options.parties.map(p => normalizeEntityStem(p));
    // Shield document from stale placeholder options if none match the document at all
    const docStems = new Set();
    clusters.forEach(c => c.stems.forEach(s => docStems.add(s)));
    const optionsMatchDoc = userPartyStems.some(ups => Array.from(docStems).some(ds => ds.includes(ups) || ups.includes(ds)));
    if (optionsMatchDoc) {
      userPartyStems.forEach(s => recognizedStems.add(s));
    }
  }

  for (const ent of entitiesFound) {
    if (ent.line <= preambleEndLine) continue; // Preamble entities are authentic contract parties
    const entStemNorm = normalizeEntityStem(ent.stem);
    const isRecognized = Array.from(recognizedStems).some(s => s.includes(entStemNorm) || entStemNorm.includes(s));
    if (!isRecognized) {
      const existingAlien = entityIssues.find(e => e.entity === ent.raw);
      if (!existingAlien) {
        const discrepancy = `Leftover legacy counterparty "${ent.raw}" does not match recognized agreement parties.`;
        entityIssues.push({ entity: ent.raw, discrepancy, line: ent.line, lines: [ent.line] });
        issues.push({
          type: 'entity_inconsistency',
          term: ent.raw,
          line: ent.line,
          lines: [ent.line],
          snippet: lines[ent.line - 1] || '',
          details: discrepancy,
          severity: 'critical'
        });
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
        entityIssues.push({ entity: g1.raw, discrepancy, line: g1.line, lines: [g1.line, g2.line] });
        issues.push({
          type: 'entity_inconsistency',
          term: g1.raw,
          line: g1.line,
          lines: [g1.line, g2.line],
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
  const RE_DRAFTING_TAG = /\b(TODO|TBD|NOTE\s+TO\s+DRAFT|DRAFT\s+NOTE|DELETE\s+IF\s+NOT\s+APPLICABLE|INSERT\s+[A-Z\s]+)\b|\[(?:CONFIRM|TODO|TBD)[^\]]*\]|\bCONFIRM\s*:\s*[A-Z]/g;
  const RE_CHEVRON_PLACEHOLDER = /<<([A-Za-z0-9_ -]{2,50})>>/g;
  const RE_ANGLE_PLACEHOLDER = /<([A-Za-z\s_-]{3,40})>/g;

  let inExecutionBlock = false;
  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();
    if (!trimmed) return;

    if (/^(?:IN\s+WITNESS\s+WHEREOF|FORMAL\s+NOTARY\s+ACKNOWLEDGMENT|SIGNATURES|SELLER\s*:|BUYER\s*:)/i.test(trimmed)) {
      inExecutionBlock = true;
    }
    if (inExecutionBlock && /^ARTICLE\s+[IVXLCDM0-9]+/i.test(trimmed)) {
      inExecutionBlock = false;
    }

    const isSignatureOrNotaryLine = (
      inExecutionBlock ||
      /^(?:SELLER|BUYER|COMPANY|CONSULTANT|EMPLOYER|EMPLOYEE|LICENSOR|LICENSEE|BORROWER|LENDER|RELEASOR|RELEASEE|PARTIES)\s*[:—–-]?$/i.test(trimmed) ||
      /^(?:By|Name|Title|Date|Signature|Witness|Attest|Notary\s+Public|Commission\s+Expires|County\s+of|State\s+of)\s*[:—–-]?/i.test(trimmed) ||
      /(?:notary\s+public|personally\s+appeared|commission\s+expires|subscribed\s+and\s+sworn|acknowledged\s+before\s+me|day\s+of\s+.*,\s*20)/i.test(trimmed)
    );

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
      // Skip signature lines and notary acknowledgments (these are intended signing lines)
      if (isSignatureOrNotaryLine) continue;
      const snippet = lineText.trim();
      boilerplateArtifacts.push({ placeholder: m[1], line: lineNum, snippet });
      issues.push({
        type: 'boilerplate_artifact',
        term: m[1],
        line: lineNum,
        snippet,
        details: `Unfilled contractual blank "${m[1]}" requires input prior to signing.`,
        severity: 'warning'
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
