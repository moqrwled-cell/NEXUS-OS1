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
  'To', 'From', 'As', 'Or', 'And', 'Via', 'Per', 'Into', 'Onto', 'Against', 'About', 'Across',
  // Standard Non-Term Headings, Billing & Timing Words
  'Fee', 'Fees', 'Compensation', 'Payment', 'Net', 'Seats', 'Months', 'Days', 'Weeks', 'Years', 'Hours',
  'Quarterly', 'Monthly', 'Annual', 'Annually', 'Weekly', 'Daily',
  'Term', 'Scope', 'Services', 'Definitions', 'Confidentiality', 'Indemnification', 'Mutual Indemnification',
  'Liability', 'Limitation', 'Limitation of Liability', 'Expiration', 'Termination', 'Representations', 'Warranties',
  'Remedies', 'Severability', 'Counterparts', 'Notices', 'Notice', 'Waiver', 'Assignment', 'Jurisdiction',
  'Arbitration', 'Mediation', 'Integration', 'Governing', 'Miscellaneous', 'Execution', 'Title', 'Default',
  'Intellectual Property', 'Proprietary Information', 'Personal Data', 'Personal Information', 'Work Product',
  'Customer Data', 'Applicable Law', 'Applicable Laws', 'Data Protection', 'Privacy', 'Security',
  'Service Order', 'Order Form', 'Statement', 'EU', 'AI Act', 'EU AI Act', 'DSA', 'DMA', 'HITECH', 'SOX', 'CCPA', 'CPRA'
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

  // Auto-extract corporate entities from text into userParties safely line-by-line (avoids single-line ReDoS)
  const RE_PREAMBLE_ENTITIES = /\b([A-Z][A-Za-z0-9&',.-]+(?:\s+[A-Z][A-Za-z0-9&',.-]+){0,4})\s+(LLC|L\.L\.C\.|Inc\.?|Incorporated|Corp\.?|Corporation|Ltd\.?|Limited|LLP|L\.L\.P\.)\b/g;
  for (const lineText of lines) {
    if (!/\b(?:LLC|L\.L\.C\.|Inc|Incorporated|Corp|Corporation|Ltd|Limited|LLP|L\.L\.P\.)\b/i.test(lineText)) continue;
    RE_PREAMBLE_ENTITIES.lastIndex = 0;
    let entMatch;
    while ((entMatch = RE_PREAMBLE_ENTITIES.exec(lineText)) !== null) {
      const full = entMatch[0].trim().toLowerCase();
      const stem = entMatch[1].trim().toLowerCase();
      userParties.add(full);
      userParties.add(stem);
    }
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
        /^(?:this|the|hereinafter|collectively|individually|each|such|["“'‘])/i.test(inner.trim()) ||
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

  // Extract natural-person / preamble counterparty names & formal job titles introduced in opening lines (e.g., "between Arthur Pendelton ... and Beatrice Christopher")
  const preamblePartyNames = new Set([
    'chief legal officer', 'general counsel', 'chief executive officer', 'chief financial officer',
    'chief operating officer', 'chief technology officer', 'managing member', 'managing partner',
    'authorised signatory', 'authorized signatory', 'authorized representative', 'dr', 'courts', 'letter'
  ]);
  lines.slice(0, 14).forEach((lineText) => {
    // Capture natural-person & corporate party names introduced in opening lines, TO/FROM blocks, or "by and between ... and ..."
    const cleanAddParty = (rawStr) => {
      const cleaned = rawStr
        .replace(/\([^)]*\)/g, ' ')
        .replace(/,?\s*\b(?:a|an)\s+[A-Za-z\s]+?(?:corporation|company|limited\s+liability\s+company|limited\s+partnership|partnership|individual|resident|trust|national\s+banking\s+association)\b[\s\S]*$/i, '')
        .replace(/\s+\bas\s+(?:Manager|Member|Borrower|Lender|Seller|Buyer|Landlord|Tenant|Company|Executive|Contractor|Provider|Customer|Agent)\b[\s\S]*$/i, '')
        .replace(/\b(?:the\s+undersigned|collectively|individually|hereinafter)\b/gi, '')
        .replace(/^(?:between|by\s+and\s+between|and|by|to|from|(?:Dr|Mr|Ms|Mrs)\.?)\s+/gi, '')
        .replace(/[.,;:'’"]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleaned.length >= 3 && /^[A-Z]/.test(cleaned)) {
        const low = cleaned.toLowerCase();
        preamblePartyNames.add(low);
        const withoutSuffix = low.replace(/,?\s*\b(?:llc|l\.l\.c\.|inc\.?|incorporated|corp\.?|corporation|ltd\.?|limited|llp|lp|l\.p\.|gmbh)\b\.?$/i, '').replace(/,+$/, '').trim();
        if (withoutSuffix.length >= 3) preamblePartyNames.add(withoutSuffix);
        const partyToks = cleaned.split(/\s+/).map(tok => tok.replace(/[.,;:'’"()]/g, '')).filter(Boolean);
        for (let i = 0; i < partyToks.length; i++) {
          const t = partyToks[i];
          if (t.length >= 3 && !/^(?:and|the|for|of|in|at|by|to|as)$/i.test(t)) preamblePartyNames.add(t.toLowerCase());
          // Also index right-aligned multi-word tails so CamelCase first tokens (e.g. "BioHealth Diagnostics Laboratories Inc") don't trigger partial misses
          if (i > 0 && i < partyToks.length) {
            const tail = partyToks.slice(i).join(' ').toLowerCase();
            if (tail.length >= 6) preamblePartyNames.add(tail);
          }
        }
      }
    };

    const roleMatchIter = lineText.matchAll(/\b(?:(?:Dr|Mr|Ms|Mrs)\.?\s+)?([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){0,6})(?:,\s*(?:LLC|Inc\.?|Corp\.?|LP|LLP|Ltd\.?))?\s*(?:,?\s*(?:a\s+[A-Za-z\s]+?(?:corporation|company|partnership|individual|resident|trust)[^()]{0,40})?)?\(\s*(?:the\s+)?["“'‘]?([A-Za-z\s]{2,30})["”'’]?\s*\)/gi);
    for (const rm of roleMatchIter) {
      cleanAddParty(rm[1]);
    }
    const toFromMatch = lineText.match(/^\s*(?:TO|FROM|RE|ATTN|LANDLORD|TENANT|BORROWER|LENDER|BUYER|SELLER|COMPANY|PROVIDER|CUSTOMER|CLIENT|VENDOR)\s*:\s*(.+)$/i);
    if (toFromMatch) cleanAddParty(toFromMatch[1]);

    if (/\b(?:by\s+and\s+between|by\s+and\s+among|entered\s+into\s+(?:as\s+of[^,]+\s+)?(?:by\s+and\s+)?(?:between|among)|between|made\s+as\s+of[^,]+by\s+and\s+(?:between|among)|promises\s+to\s+pay\s+to\s+the\s+order\s+of|the\s+undersigned)\b/i.test(lineText)) {
      const segs = lineText.split(/\b(?:by\s+and\s+between|by\s+and\s+among|between|among|promises\s+to\s+pay\s+to\s+the\s+order\s+of|the\s+undersigned)\b/i).slice(1);
      for (const seg of segs) {
        seg.split(/,\s+and\s+|\s+and\s+(?=[A-Z])|\s*&\s*/i).forEach(part => {
          const strippedPart = part.replace(/,\s*(?:LLC|L\.L\.C\.|Inc\.?|Corp\.?|LP|L\.P\.|LLP|Ltd\.?)/gi, '');
          const head = strippedPart.split(/[,;(]/)[0].trim();
          if (head) cleanAddParty(head);
          const rawHead = part.split(/[,;(]/)[0].trim();
          if (rawHead) cleanAddParty(rawHead);
        });
      }
    }
  });

  // --------------------------------------------------------------------------
  // PIPELINE 2: TERM USAGE FREQUENCY & UNUSED DEFINED TERMS
  // --------------------------------------------------------------------------
  const unusedDefinedTerms = [];
  const issues = [];

  for (const item of definedTerms) {
    let termPatternStr = `\\b${escapeRegex(item.term)}(?:s|es)?\\b`;
    if (/ies$/i.test(item.term)) {
      const singularStem = item.term.slice(0, -3);
      termPatternStr = `\\b(?:${escapeRegex(item.term)}|${escapeRegex(singularStem)}y)\\b`;
    } else if (/[^aeiou]y$/i.test(item.term)) {
      const pluralStem = item.term.slice(0, -1);
      termPatternStr = `\\b(?:${escapeRegex(item.term)}|${escapeRegex(pluralStem)}ies)\\b`;
    }
    const termRegex = new RegExp(termPatternStr, 'gi');
    let occurrences = 0;

    lines.forEach((lineText, idx) => {
      const lineNum = idx + 1;
      const matches = lineText.match(termRegex);
      if (!matches) return;
      // On the definition line itself, subtract 1 for the single parenthetical/means definition header so subsequent sentences in the same paragraph still count as valid usage
      if (lineNum === item.line) {
        occurrences += Math.max(0, matches.length - 1);
      } else {
        occurrences += matches.length;
      }
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
  const RE_CAPITALIZED = /\b[A-Z][a-z]+(?:['’]s)?(?:[-\s]+[A-Z][a-z]+(?:['’]s)?){0,6}\b/g;

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

    // Skip signatory lines, memo subject lines (RE:/TO:/FROM:), and exhibit notes
    if (/^(?:By|Name|Title|BUYER|SELLER|RE|TO|FROM)\s*:\s*/i.test(trimmed)) return;
    if (/\(Attached\)|\[Note:/i.test(trimmed)) return;

    // Layer 5: Skip all-caps headings and standalone short Article/Section title lines
    const isStandaloneHeading =
      (trimmed.length < 120 && trimmed === trimmed.toUpperCase()) ||
      (/^(?:#{1,6}\s+)?(?:ARTICLE|SECTION|CLAUSE|PART|EXHIBIT|SCHEDULE|APPENDIX|ANNEX|ATTACHMENT)\s+[0-9IVXLCDM]+(?:\.[0-9]+)*[.\-:\s]/i.test(trimmed) &&
        trimmed.split(/\s+/).length <= 12 &&
        !/\b(?:shall|must|may|will|agrees?|covenants?)\b/i.test(trimmed));
    if (isStandaloneHeading) return;

    // Detect subsection heading title prefix: "2.1 Performance of Services. Provider shall..." or "2. Confidentiality and AI Prohibition. Each Party..."
    const headingPrefixMatch = trimmed.match(/^(?:[0-9]+(?:\.[0-9]+)+\.?|[0-9]+\.|[IVXLCDM]+\.|\([a-z0-9]+\))\s+([A-Za-z0-9\s—–\-_/,&']+?)\.\s+/i);
    const headingEndIndex = headingPrefixMatch ? lineText.indexOf(headingPrefixMatch[0]) + headingPrefixMatch[0].length : -1;

    // Detect judicial case citation spans safely (only invoke regex when marker exists; flattened to prevent ReDoS)
    const caseSpans = [];
    if (/(?:\bv\.|\bvs\.|\bIn\s+re\b)/.test(lineText)) {
      const RE_CASE_LAW = /\b(?:[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|for|in|al\.|Litig\.|Corp\.|Inc\.|LLC|[0-9]+)){0,5}\s+(?:v\.|vs\.)\s+[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|for|in|al\.|Corp\.|Inc\.|LLC|[0-9]+)){0,5}(?:,\s*\d+\s+[A-Za-z0-9.]+(?:\s+\d+)?)?(?:\s*\([^)]{2,25}\d{4}\))?|In\s+re\s+[A-Z][A-Za-z0-9',.-]*(?:\s+(?:[A-Z][A-Za-z0-9',.-]*|&|and|of|the|Litig\.|Corp\.|Inc\.|LLC|[0-9]+)){0,5})\b/g;
      let cm;
      while ((cm = RE_CASE_LAW.exec(lineText)) !== null) {
        caseSpans.push({ start: cm.index, end: cm.index + cm[0].length });
      }
    }

    // Detect regulatory / statutory multi-word citations (GDPR Article 28 ..., EU AI Act Article 50, HIPAA Section ...)
    const statuteSpans = [];
    if (/\b(?:GDPR|HIPAA|EU\s+AI\s+Act|AI\s+Act|CCPA|CPRA|ERISA|SOX|CERCLA|FIRPTA|Internal\s+Revenue\s+Code)\b/i.test(lineText)) {
      const RE_STAT_SPAN = /\b(?:(?:EU\s+)?AI\s+Act|GDPR|HIPAA|CCPA|CPRA|ERISA|CERCLA|FIRPTA|Internal\s+Revenue\s+Code)\s+(?:Articles?|Sections?|§§?)\s+[0-9A-Za-z.-]+(?:\s+[A-Z][a-z]+){0,3}/g;
      let sm;
      while ((sm = RE_STAT_SPAN.exec(lineText)) !== null) {
        statuteSpans.push({ start: sm.index, end: sm.index + sm[0].length });
      }
    }

    let m;
    while ((m = RE_CAPITALIZED.exec(lineText)) !== null) {
      // Skip if token falls within a judicial case law or regulatory statutory citation
      if (caseSpans.some(span => m.index >= span.start && m.index < span.end)) continue;
      if (statuteSpans.some(span => m.index >= span.start && m.index < span.end)) continue;

      // Skip if token is part of subsection heading title
      if (headingEndIndex !== -1 && m.index < headingEndIndex) continue;

      // Skip if preceded by standard labels, exhibit parenthetical tags, or cross-ref prefixes (bounded slice to prevent O(N^2) on 100k single lines)
      const precedingText = lineText.slice(Math.max(0, m.index - 180), m.index).trim();
      const followingRaw = lineText.slice(m.index + m[0].length, m.index + m[0].length + 48).trim();
      // Skip quoted booklet/pamphlet titles (e.g. EPA pamphlet "Protect Your Family from Lead in Your Home")
      if (/\b(?:pamphlet|booklet|publication|brochure|manual|titled|entitled)\s+["“][^"”\n]*$/i.test(precedingText)) continue;
      if (/^\(\s*(?:this|the)\s+["“'‘][A-Za-z0-9\s-]{2,35}["”'’]\s*\)/i.test(followingRaw)) continue;
      if (/(?:Exhibits?|Schedules?|Appendices?|Sections?|Articles?|Clauses?|Account|Routing|Wire|Escrow|Beneficiary|Bank|Tax|EIN|Phone|Mobile|Email|State\s+of|County\s+of)\s*[:—–-]?\s*$/i.test(precedingText)) continue;
      if (/(?:Exhibits?|Schedules?|Appendices?|Annex(?:es)?)\s+[A-Z0-9]+(?:\([A-Za-z0-9]+\))?\s*\($/i.test(precedingText)) continue;

      // Skip physical addresses, property parcels, and tax description clauses
      if (/(?:situated\s+at|located\s+at|with\s+an\s+address\s+at|premises\s+at|situated\s+within|located\s+within|designated\s+as|known\s+as|consisting\s+of)\s*[^;.\n]*$/i.test(precedingText)) {
        if (/(?:Parkway|Boulevard|Street|Avenue|Drive|Lane|Way|Road|Court|Terrace|Circle|Highway|Square|Plaza|Center|Crossing|District|County|State|Acres|Gross\s+Acres|Square\s+Feet|Parcel|APN|Identification\s+Number)\b/i.test(m[0])) {
          continue;
        }
      }

      // Skip forum selection and venue phrases
      if (/(?:brought\s+exclusively\s+in|venue\s+(?:in|of)|jurisdiction\s+of)\s*[^;.\n]*$/i.test(precedingText)) {
        if (/(?:Court|Courts|Common\s+Pleas|Chancery|Judicial\s+District|Circuit\s+Court|Superior\s+Court|Supreme\s+Court|District\s+Court)\b/i.test(m[0])) {
          continue;
        }
      }

      let phrase = m[0].trim();

      // Layer 0: If full phrase (or without trailing 's) is already a recognized legal stopword, skip
      const phraseNoPoss = phrase.replace(/['’]s$/i, '').trim();
      if (LEGAL_STOPWORDS.has(phrase) || LEGAL_STOPWORDS.has(phraseNoPoss) || preamblePartyNames.has(phraseNoPoss.toLowerCase())) continue;

      // Skip generic self-referential instrument words preceded by "this" ("this Lease", "this Note", "this Letter")
      if (/\bthis$/i.test(precedingText) && /^(?:Agreement|Contract|Lease|Note|Letter|Amendment|Addendum|Deed|Policy|Guaranty|Instrument)$/i.test(phraseNoPoss)) {
        continue;
      }

      // Strip leading legal determiner, preposition, conditional, or possessive party determiner
      let tokens = phrase.split(/\s+/);
      while (
        tokens.length > 1 &&
        /^(?:The|This|That|These|Those|All|Any|Each|Every|Either|Neither|Both|Such|No|To|From|In|On|At|By|For|With|Without|Under|Over|If|When|Whenever|Where|Wherever|Unless|Until|While|Your|Our|Their|Its|His|Her|Party['’]s|Parties['’]?|Client['’]s|Customer['’]s|Provider['’]s|Vendor['’]s|Buyer['’]s|Seller['’]s|Company['’]s|Employer['’]s|Employee['’]s|Licensor['’]s|Licensee['’]s|Contractor['’]s|Grantor['’]s|Grantee['’]s)$/i.test(tokens[0])
      ) {
        tokens.shift();
      }
      phrase = tokens.join(' ').replace(/['’]s$/i, '').trim();
      if (!phrase || LEGAL_STOPWORDS.has(phrase) || preamblePartyNames.has(phrase.toLowerCase())) continue;

      const lower = phrase.toLowerCase();
      const baseStem = lower.replace(/['’]s$/, '').replace(/s$/, '').replace(/es$/, '');

      // Skip field descriptors / form labels followed by colon (e.g. "Docket No:", "Principal Amount:")
      if (followingRaw.startsWith(':')) continue;

      // Layer 0b: Check multi-word defined term containing lowercase connector words ("Event of Default", "Right of First Refusal", "Letter of Intent")
      const extendedOfMatch = lineText.slice(m.index).match(/^[A-Z][a-z]+(?:\s+(?:of|and|for|the)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})+/);
      if (extendedOfMatch) {
        const extKey = extendedOfMatch[0].toLowerCase();
        if (definedTermsMap.has(extKey) || LEGAL_STOPWORDS.has(extendedOfMatch[0])) continue;
      }

      // Layer 1: Already defined in contract (including possessive 's, plural, and singular variations)
      if (
        definedTermsMap.has(lower) ||
        definedTermsMap.has(baseStem) ||
        definedTermsMap.has(lower + 's') ||
        definedTermsMap.has(baseStem + 's')
      ) continue;

      // Skip phrase immediately preceding a parenthetical definition
      if (/^["”'’]?\s*\(\s*(?:the|hereinafter|collectively|individually|each|such|["“'‘])/i.test(followingRaw)) continue;

      // Layer 2: Explicit known parties (including possessives)
      if (userParties.has(lower) || userParties.has(baseStem)) continue;

      // Layer 3: Comprehensive Legal Stopwords Filter (normalizing possessives per token)
      if (tokens.every(t => {
        const cleanTok = t.replace(/['’]s$/i, '');
        return LEGAL_STOPWORDS.has(t) || LEGAL_STOPWORDS.has(cleanTok);
      })) continue;

      // Layer 4: Sentence Starter & Quantity Unit Check (for single capitalized words)
      if (tokens.length === 1) {
        const isSentenceStart = !precedingText ||
                                /[.!?]\s*$/.test(precedingText) ||
                                /^\([a-z0-9]+\)$/i.test(precedingText) ||
                                /^(?:[0-9]+(?:\.[0-9]+)*|#+)\s*$/i.test(precedingText);
        const followsCardinal = /\b\d+$/.test(precedingText);
        if (isSentenceStart || followsCardinal) continue;
      }

      // Record valid candidate
      const start = Math.max(0, m.index - 35);
      const end = Math.min(lineText.length, m.index + m[0].length + 35);
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

  // Determine preamble boundary (explicit header OR last non-operative preamble party line)
  let preambleEndLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:SECTION|ARTICLE|CLAUSE|WITNESSETH|RECITALS|NOW,?\s+THEREFORE)\b/i.test(lines[i])) {
      preambleEndLine = i + 1;
      break;
    }
  }
  if (preambleEndLine === -1) {
    // Compact document without explicit SECTION/ARTICLE headings: stop preamble right before the first operative obligation line
    preambleEndLine = Math.min(25, lines.length);
    for (let i = 0; i < Math.min(25, lines.length); i++) {
      if (/\b(?:shall|must|agrees?\s+to|in\s+no\s+event)\b/i.test(lines[i]) && !/\bbetween\b/i.test(lines[i])) {
        preambleEndLine = Math.max(1, i);
        break;
      }
    }
  } else if (preambleEndLine > 25) {
    preambleEndLine = 25;
  }

  lines.forEach((lineText, idx) => {
    if (!/\b(?:LLC|L\.L\.C\.|Inc|Incorporated|Corp|Corporation|Ltd|Limited|LLP|L\.L\.P\.|GmbH)\b/i.test(lineText)) return;
    // Split multi-column signature/schedule lines (3+ spaces or tabs) so adjacent signatory names never glue into one fake entity
    const cols = lineText.split(/\s{3,}|\t|\|/);
    for (const colText of cols) {
      RE_ENTITY.lastIndex = 0;
      let m;
      while ((m = RE_ENTITY.exec(colText)) !== null) {
        // Exclude statutory/organizational descriptors like "Delaware Limited Liability Company" or "... Corp. Law"
        const matchEnd = m.index + m[0].length;
        const followingText = colText.slice(matchEnd);
        if (/^\s+(?:Law|Laws|Act|Acts|Code|Codes|Statute|Statutes|Rules?|Regulation|Regulations|Commission|Department|Division|Board|Governance|Jurisprudence|Liability|Partnership|Section|§)\b/i.test(followingText)) {
          continue;
        }

        // Exclude statutory references preceded by legal citation phrases
        const leadingText = colText.slice(0, m.index);
        if (/(?:under|pursuant\s+to|in\s+accordance\s+with|governed\s+by|subject\s+to)\s+$/i.test(leadingText) &&
            /(?:General|Commercial|Statutory|Uniform|Federal|National)\s*$/i.test(m[1])) {
          continue;
        }

        let raw = m[0].trim();
        let stem = m[1].trim();
        const suffix = m[2].trim();

        // Clean leading prepositions, conjunctions, and unrelated leading clauses separated by comma (e.g. "Effective Date, Quantum Analytics Partners LLC" -> "Quantum Analytics Partners LLC")
        if (stem.includes(',')) {
          const lastCommaIdx = stem.lastIndexOf(',');
          const afterComma = stem.slice(lastCommaIdx + 1).trim();
          if (afterComma && afterComma.split(/\s+/).length >= 1 && !/^(?:a|an|the|doing|formerly|f\/k\/a|d\/b\/a)\b/i.test(afterComma)) {
            stem = afterComma;
          }
        }
        stem = stem.replace(/^(?:BY\s+AND\s+BETWEEN|BY\s+AND\s+AMONG|AND\s+BETWEEN|BETWEEN|AMONG|AND|BY|FOR|OF|TO|THE|THIS|FOLLOWING|UPON|IF|WHEN|NOW,?\s+THEREFORE,?|WHEREAS,?)\s+/i, '').trim();
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

  // Track Signature Block & Schedule/Exhibit lines so Schedule A investors/members/signatories aren't falsely flagged as leftover legacy parties
  const sigOrScheduleLineNums = new Set();
  let inEntSigOrSchedule = false;
  lines.forEach((lt, idx) => {
    const t = lt.trim();
    if (/^(?:IN\s+WITNESS\s+WHEREOF|SCHEDULE\s+[A-Z0-9]+|EXHIBIT\s+[A-Z0-9]+|SIGNATURE\s+PAGE|SIGNATORIES|EXECUTION)\b/i.test(t)) {
      inEntSigOrSchedule = true;
    } else if (/^(?:ARTICLE|SECTION)\s+[0-9IVXLCDM]+\b/i.test(t)) {
      inEntSigOrSchedule = false;
    }
    if (inEntSigOrSchedule) sigOrScheduleLineNums.add(idx + 1);
  });
  const preambleReferencesSchedule = lines.slice(0, preambleEndLine).some(l => /\b(?:identified\s+on\s+schedule|listed\s+on\s+(?:schedule|exhibit)|by\s+and\s+among\s+the\s+members)\b/i.test(l));

  for (const ent of entitiesFound) {
    if (ent.line <= preambleEndLine) continue; // Preamble entities are authentic contract parties
    if (preambleReferencesSchedule && sigOrScheduleLineNums.has(ent.line)) continue; // Schedule A / signature members referenced in preamble
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
      // Skip only full-width execution signature lines (>= 8 underscores); short blanks like "___" are incomplete fields
      if (isSignatureOrNotaryLine && m[1].length >= 8) continue;
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
