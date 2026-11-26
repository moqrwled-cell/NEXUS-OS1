/**
 * Nexus ContractGuard Enterprise — Daily Deal Intelligence, Missing-Shield & Negotiation Engine
 * 100% Client-Side In-RAM Execution (Zero Network Calls · ABA Model Rule 1.6 Compliant).
 *
 * Provides daily contractor & attorney superpowers:
 * 1. Contract archetype detection & Missing Protective Shield audit (flags what is dangerously OMITTED)
 * 2. Deal Economics & Notice/Renewal Deadline Radar + RFC-5545 .ics Calendar export
 * 3. Party-Perspective risk calibration (Balanced / Buyer-Client / Vendor-Contractor)
 * 4. Plain-English impact translator & 1-click counter-proposal redline clauses
 * 5. Daily ready-to-send Opposing Counsel & Client Risk Brief emails
 */

const ARCHETYPE_SIGNATURES = [
  { id: 'nda', pattern: /\b(?:non-disclosure|confidentiality\s+agreement|mutual\s+nda|proprietary\s+information)\b/i },
  { id: 'real_estate', pattern: /\b(?:earnest\s+money|escrow\s+agent|parcel|title\s+commitment|warranty\s+deed|lease\s+agreement|triple\s+net|landlord|tenant|premises)\b/i },
  { id: 'corporate_ma', pattern: /\b(?:asset\s+purchase|excluded\s+liabilities|operating\s+agreement|membership\s+interest|capital\s+account|section\s+1060)\b/i },
  { id: 'employment_contractor', pattern: /\b(?:independent\s+contractor|executive\s+employment|severance|good\s+reason|1099|base\s+salary|work\s+made\s+for\s+hire)\b/i },
  { id: 'lending', pattern: /\b(?:promissory\s+note|principal\s+sum|principal\s+amount|usury|ucc-1|maturity\s+date|collateral)\b/i },
  { id: 'settlement', pattern: /\b(?:settlement\s+and\s+(?:mutual\s+)?release|civil\s+code\s+(?:§|section)\s*1542|no\s+admission\s+of\s+liability)\b/i },
  { id: 'services_msa', pattern: /\b(?:master\s+(?:commercial\s+)?services|statement\s+of\s+work|deliverables|subscription|saas|software\s+license|sow)\b/i }
];

export function detectContractArchetype(text = '', title = '') {
  const combined = `${title || ''}\n${(text || '').slice(0, 4500)}`;
  for (const sig of ARCHETYPE_SIGNATURES) {
    if (sig.pattern.test(combined)) return sig.id;
  }
  return 'general';
}

const MISSING_SHIELD_RULES = [
  {
    id: 'missing-cap',
    title: 'Missing Aggregate Limitation of Liability Cap',
    appliesTo: ['services_msa', 'employment_contractor', 'corporate_ma', 'general'],
    testPresence: (t) => /\b(?:aggregate\s+liability|liability\s+shall\s+not\s+exceed|limitation\s+of\s+liability|maximum\s+liability|total\s+liability\s+(?:is|shall\s+be)\s+capped)\b/i.test(t),
    severityByRole: { balanced: 'critical', vendor_contractor: 'critical', buyer_client: 'warning' },
    plainEnglish: {
      vendor_contractor: 'Without an aggregate liability cap, your entire company bank account and personal assets could be exposed beyond what the contract is worth.',
      buyer_client: 'While uncapped vendor liability sounds favorable to you, ambiguous silence often invites litigation over statutory caps or void disclaimers.',
      balanced: 'This draft contains no express monetary cap on aggregate contract liability, creating unpredictable litigation exposure.'
    },
    rationale: 'Standard U.S. commercial agreements cap aggregate direct damages at 12 months of fees paid or contract value, paired with express carve-outs for fraud and willful misconduct.',
    fallbackClause: `Limitation of Liability. EXCEPT FOR INDEMNIFICATION OBLIGATIONS, BREACHES OF CONFIDENTIALITY, GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR FRAUD, NEITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL EXCEED THE TOTAL FEES PAID OR PAYABLE UNDER THE APPLICABLE STATEMENT OF WORK DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.`
  },
  {
    id: 'missing-conseq',
    title: 'Missing Mutual Consequential & Lost-Profits Waiver',
    appliesTo: ['services_msa', 'employment_contractor', 'corporate_ma', 'nda', 'general'],
    testPresence: (t) => /\b(?:consequential|indirect|special|incidental|punitive|lost\s+profits?)\s+damages\b/i.test(t),
    severityByRole: { balanced: 'critical', vendor_contractor: 'critical', buyer_client: 'warning' },
    plainEnglish: {
      vendor_contractor: 'Without excluding indirect or lost-profit damages, a missed deadline could trigger claims 10x–50x larger than your contract fee.',
      buyer_client: 'Both sides benefit from predictable direct-damage boundaries while carving out confidentiality, IP infringement, and defense fees.',
      balanced: 'The draft lacks an exclusion of speculative indirect, consequential, special, or lost-profit damages.'
    },
    rationale: 'Excluding consequential damages protects cash flow while preserving direct damages and third-party defense fee recovery.',
    fallbackClause: `Exclusion of Consequential Damages. EXCEPT FOR BREACHES OF CONFIDENTIALITY, INDEMNIFICATION FOR THIRD-PARTY CLAIMS, GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR FRAUD, NEITHER PARTY SHALL BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS OR REVENUE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. Reasonable attorneys' fees incurred in defending covered third-party claims shall be deemed direct damages.`
  },
  {
    id: 'missing-cure',
    title: 'Missing Material Breach Notice & Cure Period',
    appliesTo: ['services_msa', 'real_estate', 'employment_contractor', 'corporate_ma', 'general'],
    testPresence: (t) => /\b(?:opportunity\s+to\s+cure|cure\s+(?:such|the|any)\s+(?:breach|default)|uncured\s+(?:for|within)|written\s+notice\s+(?:and|of)\s+(?:ten|fifteen|thirty|\d+)\s+(?:\(\d+\)\s+)?(?:business\s+)?days)\b/i.test(t),
    severityByRole: { balanced: 'warning', vendor_contractor: 'critical', buyer_client: 'warning' },
    plainEnglish: {
      vendor_contractor: 'The counterparty may claim instant default and withhold payment or cancel the contract over any minor error without giving you time to fix it.',
      buyer_client: 'Clear written notice and a defined cure period prevent disputes over whether termination was wrongful or premature.',
      balanced: 'No explicit notice-and-cure period protects either Party against immediate termination for minor or inadvertent breaches.'
    },
    rationale: 'Standard U.S. commercial practice grants 15–30 calendar days after written notice to cure non-monetary breaches.',
    fallbackClause: `Notice and Opportunity to Cure. Neither Party may terminate this Agreement for cause or declare a default unless the non-breaching Party delivers written notice specifying the breach in reasonable detail and the breaching Party fails to cure such breach within fifteen (15) calendar days (or five (5) business days for undisputed payment defaults) following receipt of such notice.`
  },
  {
    id: 'missing-conf-exclusions',
    title: 'Missing Standard Confidentiality Carve-Outs (Public Domain / Legal Compulsion)',
    appliesTo: ['nda', 'services_msa', 'employment_contractor', 'corporate_ma'],
    testPresence: (t) => /\bconfidential\b/i.test(t) && /\b(?:generally\s+available\s+to\s+the\s+public|public\s+domain|independently\s+developed|subpoena|court\s+order|18\s+u\.s\.c\.\s*(?:§|section)\s*1833)\b/i.test(t),
    severityByRole: { balanced: 'critical', vendor_contractor: 'critical', buyer_client: 'warning' },
    plainEnglish: {
      vendor_contractor: 'Without standard NDA exclusions, you can become liable for mentioning publicly known industry facts or obeying a lawful court subpoena.',
      buyer_client: 'Ambiguous confidentiality obligations without statutory carve-outs and DTSA notice weaken enforceability in federal court.',
      balanced: 'Confidentiality language appears without standard carve-outs for public information, prior knowledge, independent development, or 18 U.S.C. Section 1833(b).'
    },
    rationale: 'Enforceable U.S. NDAs require standard public-domain exclusions, compelled-disclosure notice, and federal DTSA whistleblower immunity language.',
    fallbackClause: `Confidentiality Exclusions & Compelled Disclosure. Confidentiality obligations shall not apply to information that: (a) becomes publicly available without breach hereof; (b) was lawfully possessed prior to disclosure; (c) is received from an independent third party without restriction; or (d) is independently developed without reference to Confidential Information. Disclosure required by law or court order is permitted upon prompt prior written notice where lawful. Pursuant to 18 U.S.C. Section 1833(b), statutory whistleblower immunity applies to confidential disclosures to government officials or counsel solely to report suspected violations of law.`
  },
  {
    id: 'missing-ai-ban',
    title: 'Missing AI / LLM Training & Data Resale Prohibition',
    appliesTo: ['services_msa', 'nda', 'employment_contractor', 'general'],
    testPresence: (t) => !/\b(?:customer\s+data|personal\s+data|confidential\s+information|client\s+data)\b/i.test(t) || /\b(?:train(?:ing)?\s+(?:any\s+)?(?:ai|artificial\s+intelligence|machine\s+learning|llm|models?)|not\s+use\s+customer\s+data\s+for\s+(?:ai|model)\s+training)\b/i.test(t),
    severityByRole: { balanced: 'warning', buyer_client: 'critical', vendor_contractor: 'info' },
    plainEnglish: {
      buyer_client: 'The draft handles client/confidential data without banning the vendor from feeding your files or contract metadata into AI model training.',
      vendor_contractor: 'Clarifying non-training commitments closes enterprise procurement reviews much faster.',
      balanced: 'Confidential or customer data is referenced without an explicit restriction prohibiting third-party AI/ML model training.'
    },
    rationale: 'Under ABA Model Rule 1.6 and modern enterprise security questionnaires, vendors must expressly covenant not to train generative AI models on client data.',
    fallbackClause: `AI Training & Zero-Retention Covenant. Service Provider shall process all Client Data and Confidential Information strictly to perform the Services and shall not use, ingest, or retain any Client Data to train, fine-tune, or improve artificial intelligence, machine learning, or large language models.`
  },
  {
    id: 'missing-force-majeure',
    title: 'Missing Force Majeure Excuse Clause',
    appliesTo: ['services_msa', 'real_estate', 'employment_contractor'],
    testPresence: (t) => /\b(?:force\s+majeure|acts\s+of\s+god|events?\s+beyond\s+(?:reasonable\s+)?control)\b/i.test(t),
    severityByRole: { balanced: 'info', vendor_contractor: 'warning', buyer_client: 'info' },
    plainEnglish: {
      vendor_contractor: 'If power grids, cloud providers, hurricanes, or government shutdowns halt delivery, you have no contractual shield against delay penalties.',
      buyer_client: 'A clean Force Majeure clause paired with a 30-day termination walk-away protects both continuity and vendor fairness.',
      balanced: 'No Force Majeure provision addresses performance delays caused by events outside reasonable control.'
    },
    rationale: 'Modern commercial drafts include Force Majeure with mandatory prompt notice and an exit right if disruption exceeds 30 days.',
    fallbackClause: `Force Majeure. Neither Party shall be liable for delay or nonperformance (excluding payment obligations) caused by acts of God, war, terrorism, civil unrest, natural disasters, utility or telecommunications failures, or governmental orders beyond its reasonable control, provided the affected Party gives prompt written notice and uses commercially reasonable efforts to resume performance. If such event persists beyond thirty (30) consecutive days, either Party may terminate the affected obligation upon written notice.`
  },
  {
    id: 'missing-governing-law',
    title: 'Missing Governing Law & Exclusive Venue Clause',
    appliesTo: ['services_msa', 'nda', 'real_estate', 'employment_contractor', 'corporate_ma', 'lending', 'settlement', 'general'],
    testPresence: (t) => /\b(?:governed\s+by\s+(?:and\s+construed\s+in\s+accordance\s+with\s+)?the\s+laws\s+of|governing\s+law|choice\s+of\s+law|exclusive\s+venue|exclusive\s+jurisdiction)\b/i.test(t),
    severityByRole: { balanced: 'warning', buyer_client: 'warning', vendor_contractor: 'warning' },
    plainEnglish: {
      buyer_client: 'Without a stated governing law and forum, you could be forced into expensive multi-state jurisdictional battles before any dispute starts.',
      vendor_contractor: 'Without home-state governing law, a client can sue you in any distant state court.',
      balanced: 'The draft omits a governing law and venue clause, creating threshold litigation uncertainty.'
    },
    rationale: 'Specifying state law (excluding conflict-of-laws rules) and forum eliminates expensive pre-trial venue disputes.',
    fallbackClause: `Governing Law and Venue. This Agreement shall be governed by and construed in accordance with the internal laws of the State of Delaware, without regard to conflict-of-laws principles, and exclusive venue for any action arising hereunder shall lie in the state or federal courts located therein.`
  }
];

export function detectMissingShields(text = '', contractType = 'general', partyRole = 'balanced') {
  if (!text || text.trim().length < 80) return [];
  const roleKey = ['buyer_client', 'vendor_contractor'].includes(partyRole) ? partyRole : 'balanced';
  const missing = [];

  for (const rule of MISSING_SHIELD_RULES) {
    if (!rule.appliesTo.includes(contractType) && !rule.appliesTo.includes('general')) continue;
    const isPresent = rule.testPresence(text);
    if (!isPresent) {
      missing.push({
        id: rule.id,
        title: rule.title,
        severity: rule.severityByRole[roleKey] || 'warning',
        plainEnglishImpact: rule.plainEnglish[roleKey] || rule.plainEnglish.balanced,
        negotiationRationale: rule.rationale,
        fallbackClause: rule.fallbackClause
      });
    }
  }

  const rank = { critical: 3, warning: 2, info: 1 };
  return missing.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
}

export function extractDealEconomicsAndDeadlines(text = '', financialDates = {}, obligations = {}) {
  const safeText = typeof text === 'string' ? text : '';
  const amounts = financialDates?.amounts || [];

  const parsedDollars = amounts
    .map(a => ({ raw: a.raw, value: typeof a.value === 'number' ? a.value : parseFloat(String(a.raw).replace(/[^0-9.]/g, '')) }))
    .filter(a => !Number.isNaN(a.value) && a.value > 0);

  const uniqueAmountsMap = new Map();
  for (const item of parsedDollars) {
    if (!uniqueAmountsMap.has(item.value)) uniqueAmountsMap.set(item.value, item);
  }
  const uniqueAmounts = Array.from(uniqueAmountsMap.values()).sort((a, b) => b.value - a.value);

  const maxExposure = uniqueAmounts[0] || null;

  // Detect liability cap dollar figure or months-of-fees cap
  let liabilityCapSummary = 'Not Specified (Potential Uncapped Exposure)';
  const capDollarMatch = safeText.match(/(?:aggregate\s+liability|shall\s+not\s+exceed|capped\s+at)[^.;\n]{0,120}(\$[0-9,]+(?:\.[0-9]{2})?(?:\s*(?:million|thousand))?)/i);
  const capMonthsMatch = safeText.match(/(?:aggregate\s+liability|shall\s+not\s+exceed)[^.;\n]{0,140}\b(?:total\s+)?fees\s+paid(?:\s+or\s+payable)?[^.;\n]{0,60}(\d+\s*\(\d+\)\s*months?|\d+\s+months?|twelve\s+\(12\)\s+months)/i);
  if (capDollarMatch) {
    liabilityCapSummary = capDollarMatch[1];
  } else if (capMonthsMatch) {
    liabilityCapSummary = `Fees Paid (${capMonthsMatch[1]})`;
  } else if (/\bunlimited\s+liability\b/i.test(safeText)) {
    liabilityCapSummary = 'Explicitly Unlimited Liability';
  }

  // Extract commercial notice & renewal windows
  const noticeWindows = [];
  const seenLabels = new Set();

  const windowPatterns = [
    {
      label: 'Auto-Renewal Cancellation Window',
      regex: /(?:auto[- ]?renew|automatically\s+renew)[^.;\n]{0,160}?\b(\d{1,3}|thirty|sixty|ninety)\s*(?:\(\d+\)\s*)?(?:calendar\s+|business\s+)?days?\b/gi,
      urgency: 'high'
    },
    {
      label: 'Invoice / Payment Terms',
      regex: /\b(?:payable\s+(?:net\s+)?|due\s+within\s+|net\s+)(\d{1,3}|thirty|fifteen|forty[- ]five)\s*(?:\(\d+\)\s*)?(?:calendar\s+|business\s+)?days?\b/gi,
      urgency: 'medium'
    },
    {
      label: 'Breach Cure Period',
      regex: /\bcure\s+(?:such\s+)?(?:breach|default)[^.;\n]{0,80}?\b(\d{1,3}|ten|fifteen|thirty)\s*(?:\(\d+\)\s*)?(?:calendar\s+|business\s+)?days?\b/gi,
      urgency: 'high'
    },
    {
      label: 'Due Diligence / Inspection Period',
      regex: /(?:inspection|due\s+diligence|feasibility)\s+period[^.;\n]{0,80}?\b(\d{1,3}|ten|fifteen|thirty|forty[- ]five)\s*(?:\(\d+\)\s*)?(?:calendar\s+|business\s+)?days?\b/gi,
      urgency: 'high'
    },
    {
      label: 'Termination Notice Window',
      regex: /terminat(?:e|ion)[^.;\n]{0,100}?\b(\d{1,3}|fourteen|thirty|sixty|ninety)\s*(?:\(\d+\)\s*)?(?:calendar\s+|business\s+)?days?['’]?\s+(?:prior\s+)?written\s+notice\b/gi,
      urgency: 'medium'
    },
    {
      label: 'Post-Termination Survival',
      regex: /\bsurvive[^.;\n]{0,80}?\b(\d{1,2}|two|three|five)\s*(?:\(\d+\)\s*)?years?\b/gi,
      urgency: 'low'
    }
  ];

  for (const wp of windowPatterns) {
    const m = wp.regex.exec(safeText);
    if (m && !seenLabels.has(wp.label)) {
      seenLabels.add(wp.label);
      const snippet = m[0].replace(/\s+/g, ' ').trim();
      noticeWindows.push({
        label: wp.label,
        durationText: m[1],
        urgency: wp.urgency,
        snippet: snippet.length > 130 ? `${snippet.slice(0, 127)}...` : snippet
      });
    }
  }

  const dates = (financialDates?.dates || []).slice(0, 10).map(d => ({
    label: d.contextLabel || 'Contract Milestone',
    rawDate: d.raw,
    isoDate: d.parsed ? new Date(d.parsed).toISOString().slice(0, 10) : null
  }));

  const stats = obligations?.stats || {};

  return {
    uniqueMonetaryCount: uniqueAmounts.length,
    topAmounts: uniqueAmounts.slice(0, 5),
    maxExposure,
    liabilityCapSummary,
    noticeWindows,
    dates,
    obligationSplit: {
      total: stats.totalObligations || 0,
      client: stats.clientCount || 0,
      counterparty: stats.counterpartyCount || 0,
      mutual: stats.mutualCount || 0
    }
  };
}

const COUNTER_CLAUSE_CATALOG = {
  'indem-01': {
    plainImpact: 'You could be forced to absorb legal bills, judgments, and settlements arising from someone else’s mistake without limit.',
    counterClause: 'Each Party shall indemnify the other solely against direct, finally adjudicated third-party claims arising from the indemnifying Party’s gross negligence, willful misconduct, or material breach, subject to the aggregate liability cap.'
  },
  'indem-02': {
    plainImpact: 'Triggers an immediate out-of-pocket duty to hire lawyers and fund litigation BEFORE any court decides who is at fault.',
    counterClause: 'Indemnification obligations shall apply exclusively to final, non-appealable judgments or approved settlements arising from covered third-party claims, excluding pre-adjudication defense advances.'
  },
  'liab-01': {
    plainImpact: 'Exposes 100% of company equity and cash reserves instead of capping risk to the value of the contract.',
    counterClause: 'Except for fraud or willful misconduct, each Party’s maximum aggregate liability under this Agreement shall not exceed the total fees paid hereunder during the preceding twelve (12) months.'
  },
  'liab-02': {
    plainImpact: 'Leaves open-ended exposure for lost profits, downtime claims, and speculative ripple-effect damages.',
    counterClause: 'Neither Party shall be liable for indirect, incidental, consequential, special, or lost-profit damages, except for breaches of confidentiality or fraud.'
  },
  'liab-06': {
    plainImpact: 'Hidden "Notwithstanding..." language may silently erase your indemnity protections and force all claims under a tiny cap.',
    counterClause: 'Notwithstanding any general limitation of liability, each Party’s indemnification obligations, confidentiality breaches, gross negligence, and willful misconduct shall remain carved out from the general cap.'
  },
  'sec-02': {
    plainImpact: 'Forces notification within 24–48 hours before IT security teams can even verify whether an alert is real.',
    counterClause: 'Provider shall notify Client without undue delay, and within seventy-two (72) hours following confirmation of any unauthorized security incident affecting Client personal data.'
  },
  'war-01': {
    plainImpact: 'Eliminates performance guarantees—if deliverables fail to work as advertised, you still owe full payment.',
    counterClause: 'Provider warrants for ninety (90) days following delivery that Services and deliverables shall materially conform to written specifications and industry standards.'
  },
  'war-02': {
    plainImpact: 'Traps you into accepting endless retries or trivial credits instead of getting your money back.',
    counterClause: 'If Provider fails to cure a material non-conformity within thirty (30) days after written notice, Client may terminate and receive a pro-rata refund of prepaid unused fees.'
  },
  'war-05': {
    plainImpact: 'Allows unilateral price hikes mid-contract with zero approval or exit protection.',
    counterClause: 'Fees shall remain fixed throughout the Initial Term; any renewal adjustment shall require sixty (60) days prior written notice and shall not exceed three percent (3%) annually.'
  },
  'ip-06': {
    plainImpact: 'Grants the counterparty rights to feed your confidential contracts or customer data into AI training datasets.',
    counterClause: 'Provider acquires no right to ingest, share, or utilize Client Data or Deliverables for artificial intelligence or machine learning model training.'
  },
  'liab-07': {
    plainImpact: 'Exposes personal home, savings, and non-business assets outside LLC/corporate limited liability protection.',
    counterClause: 'All obligations hereunder are strictly corporate obligations of the contracting entity, and no officer, member, or owner assumes personal guaranty liability.'
  },
  'term-06': {
    plainImpact: 'Lets the other side quietly rewrite rules or pricing anytime on their webpage without telling you.',
    counterClause: 'No online policy, URL modification, or unilateral posting shall amend or supersede the executed terms of this Agreement unless signed in writing by both Parties.'
  },
  'term-07': {
    plainImpact: 'Locks you into another full contract year unless you remember to send cancellation notice months early.',
    counterClause: 'Upon expiration of the Initial Term, this Agreement shall renew only upon mutual written execution or on a month-to-month basis terminable upon thirty (30) days notice.'
  },
  'misc-06': {
    plainImpact: 'Hyperlinked terms can change overnight without your signature or approval.',
    counterClause: 'External online URLs are excluded unless incorporated as static dated exhibits; executed text shall govern over any web updates.'
  },
  'disp-06': {
    plainImpact: 'Eliminates jury rights and forces costly private arbitration while waiving collective claims.',
    counterClause: 'Disputes not resolved within thirty (30) days of good-faith executive negotiation may be adjudicated in state or federal courts of competent jurisdiction.'
  }
};

export function enrichRisksForParty(risks = [], partyRole = 'balanced') {
  const role = ['buyer_client', 'vendor_contractor'].includes(partyRole) ? partyRole : 'balanced';
  return (risks || []).map((r) => {
    const meta = COUNTER_CLAUSE_CATALOG[r.id];
    let adjustedSeverity = r.severity;

    if (role === 'vendor_contractor' && (r.id === 'war-01' || r.id === 'war-04')) {
      adjustedSeverity = 'info'; // Vendors normally retain As-Is / implied warranty disclaimers
    } else if (role === 'buyer_client' && (r.id === 'war-01' || r.id === 'war-05' || r.id === 'ip-06' || r.id === 'term-06' || r.id === 'term-07')) {
      adjustedSeverity = 'critical'; // Buyers suffer directly from As-Is, price hikes, AI ingestion, auto-renew
    } else if (role === 'vendor_contractor' && (r.id === 'indem-01' || r.id === 'indem-02' || r.id === 'liab-01' || r.id === 'liab-07')) {
      adjustedSeverity = 'critical';
    }

    return {
      ...r,
      adjustedSeverity,
      plainEnglishImpact: meta?.plainImpact || r.description,
      counterRedlineClause: meta?.counterClause || r.recommendation
    };
  });
}

export function buildDailyOutreachEmails({ title, clientParty, counterparty, partyRole, economics, missingShields, enrichedRisks }) {
  const docTitle = title || 'Commercial Agreement';
  const ourSide = clientParty || 'Our Team';
  const otherSide = counterparty || 'Counterparty Counsel';
  const topRisks = (enrichedRisks || []).filter(r => r.adjustedSeverity === 'critical' || r.severity === 'critical').slice(0, 4);
  const topMissing = (missingShields || []).slice(0, 3);

  const opposingPoints = [];
  topMissing.forEach((m, i) => {
    opposingPoints.push(`${opposingPoints.length + 1}. Add ${m.title}: ${m.negotiationRationale}\n   Proposed Clause: "${m.fallbackClause}"`);
  });
  topRisks.forEach((r) => {
    opposingPoints.push(`${opposingPoints.length + 1}. Clarify "${r.phrase}" (${r.category}):\n   Proposed Revision: "${r.counterRedlineClause}"`);
  });

  if (opposingPoints.length === 0) {
    opposingPoints.push('1. All structural protections appear balanced; please confirm signature block execution details and target closing date.');
  }

  const opposingCounselEmail = `Subject: Proposed Commercial Redlines — ${docTitle}

Dear ${otherSide} Team,

Thank you for forwarding the draft ${docTitle}. We have completed our initial commercial and risk review on behalf of ${ourSide}.

To bring the draft in line with standard market reciprocity, we request the following targeted updates prior to execution:

${opposingPoints.join('\n\n')}

Please let us know if these revisions are acceptable or share a clean redline for final sign-off.

Best regards,
${ourSide}`;

  const missingBulletText = topMissing.length > 0
    ? topMissing.map(m => `- MISSING SHIELD: ${m.title} — ${m.plainEnglishImpact}`).join('\n')
    : '- All standard protective clauses are present.';

  const riskBulletText = topRisks.length > 0
    ? topRisks.map(r => `- RISK FLAG (${r.phrase}): ${r.plainEnglishImpact}`).join('\n')
    : '- No critical red-flag clauses detected.';

  const deadlinesSummary = (economics?.noticeWindows || []).length > 0
    ? economics.noticeWindows.map(w => `- ${w.label}: ${w.snippet}`).join('\n')
    : '- No critical notice windows extracted.';

  const clientBriefEmail = `Subject: Executive Contract Brief & Action Items — ${docTitle}

Hello ${ourSide},

We audited the ${docTitle} locally (zero external cloud upload). Below is your plain-English summary before signing:

1. DEAL FINANCIAL SNAPSHOT
- Highest Dollar Exposure Identified: ${economics?.maxExposure?.raw || 'None Detected'}
- Liability Cap Status: ${economics?.liabilityCapSummary || 'Unverified'}
- Role Perspective Used: ${partyRole === 'buyer_client' ? 'Buyer / Client Protection' : partyRole === 'vendor_contractor' ? 'Vendor / Contractor Protection' : 'Balanced Commercial'}

2. KEY MISSING PROTECTIONS
${missingBulletText}

3. TOP CLAUSE RISKS IN PLAIN ENGLISH
${riskBulletText}

4. KEY DEADLINES & NOTICE WINDOWS
${deadlinesSummary}

Next Step: We have prepared proposed redline wording and calendar reminders—please confirm if you approve sending our counter-proposal to ${otherSide}.`;

  return {
    opposingCounselEmail,
    clientBriefEmail
  };
}

export function generateDealCalendarICS({ economics, title = 'Commercial Contract', clientParty = 'Client', counterparty = 'Counterparty' }) {
  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const events = [];
  const cleanTitle = (title || 'Contract').replace(/[\r\n,;]/g, ' ').trim();

  const dates = economics?.dates || [];
  dates.forEach((d, idx) => {
    const dt = d.isoDate ? d.isoDate.replace(/-/g, '') : null;
    if (!dt) return;
    events.push([
      'BEGIN:VEVENT',
      `UID:nexus-cg-${idx}-${dt}@nexus-os.store`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;VALUE=DATE:${dt}`,
      `SUMMARY:[ContractGuard] ${d.label} — ${cleanTitle}`,
      `DESCRIPTION:Contract milestone between ${clientParty} and ${counterparty}. Source date: ${d.rawDate}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Contract Deadline Reminder',
      'TRIGGER:-P3D',
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n'));
  });

  // Always add an actionable follow-up deadline reminder if no explicit future ISO date was extracted
  if (events.length === 0) {
    const target = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    const noticeNotes = (economics?.noticeWindows || []).map(w => `${w.label}: ${w.durationText} days`).join(' | ') || 'Confirm notice & renewal deadlines';
    events.push([
      'BEGIN:VEVENT',
      `UID:nexus-cg-review-${target}@nexus-os.store`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART;VALUE=DATE:${target}`,
      `SUMMARY:[ContractGuard] Review Notice Deadlines — ${cleanTitle}`,
      `DESCRIPTION:${noticeNotes} (${clientParty} / ${counterparty})`,
      'END:VEVENT'
    ].join('\r\n'));
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nexus ContractGuard//Local Legal Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadDealCalendarICS(params) {
  const icsBody = generateDealCalendarICS(params);
  const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (params.title || 'Contract_Deadlines').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  a.href = url;
  a.download = `${safeName}_Deadlines.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return true;
}

export function analyzeDealIntelligence({
  text = '',
  financialDates = {},
  obligations = {},
  risks = [],
  contractTitle = '',
  clientParty = '',
  counterparty = '',
  partyRole = 'balanced'
}) {
  const contractType = detectContractArchetype(text, contractTitle);
  const economics = extractDealEconomicsAndDeadlines(text, financialDates, obligations);
  const missingShields = detectMissingShields(text, contractType, partyRole);
  const enrichedRisks = enrichRisksForParty(risks, partyRole);
  const dailyEmails = buildDailyOutreachEmails({
    title: contractTitle,
    clientParty,
    counterparty,
    partyRole,
    economics,
    missingShields,
    enrichedRisks
  });

  return {
    contractType,
    partyRole,
    economics,
    missingShields,
    enrichedRisks,
    dailyEmails
  };
}
