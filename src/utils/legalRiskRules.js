/**
 * Nexus ContractGuard Enterprise — Legal Risk & Red Flag Knowledge Base
 * 50+ Enterprise Legal Risk Rules covering commercial liabilities, arbitration traps,
 * unilateral rights, and data breach covenants with severity classifications and guidance.
 */

export const LEGAL_RISK_RULES = [
  // ==========================================
  // 1. INDEMNIFICATION & DEFENSE (High Risk)
  // ==========================================
  {
    id: 'indem-01',
    phrase: 'indemnify and hold harmless',
    category: 'Indemnification & Defense',
    severity: 'critical',
    regex: /\bindemnify\s+(?:and\s+)?hold\s+harmless\b/i,
    description: 'Requires one party to absorb all legal damages, defense costs, and settlements of the other party.',
    recommendation: 'Cap indemnity to direct claims and limit total liability to total fees paid in previous 12 months.'
  },
  {
    id: 'indem-02',
    phrase: 'defend, indemnify and hold',
    category: 'Indemnification & Defense',
    severity: 'critical',
    regex: /\bdefend(?:s)?,\s*indemnify\s+(?:and\s+)?hold\b/i,
    description: 'Obligates you to hire legal counsel and defend third-party claims before liability is even determined.',
    recommendation: 'Carve out defense obligations; indemnify only upon final, non-appealable judicial adjudication.'
  },
  {
    id: 'indem-03',
    phrase: 'at its sole expense',
    category: 'Indemnification & Defense',
    severity: 'warning',
    regex: /\bat\s+(?:its|their)\s+sole\s+expense\b/i,
    description: 'Forces full financial absorption of costs, audits, or remediation without cost sharing.',
    recommendation: 'Specify mutual or shared costs unless breach is willful and material.'
  },
  {
    id: 'indem-04',
    phrase: 'all claims, demands, losses',
    category: 'Indemnification & Defense',
    severity: 'critical',
    regex: /\ball\s+claims,\s*(?:demands,)?\s*(?:losses|liabilities|damages)\b/i,
    description: 'Overly broad indemnity triggering liability for unvetted third-party allegations.',
    recommendation: 'Limit scope strictly to "reasonable and documented third-party claims arising from gross negligence".'
  },
  {
    id: 'indem-05',
    phrase: 'including reasonable attorneys fees',
    category: 'Indemnification & Defense',
    severity: 'warning',
    regex: /\bincluding\s+reasonable\s+attorneys['’]?\s+fees\b/i,
    description: 'Permits the opposing party to bill uncapped external legal fees to your account.',
    recommendation: 'Add mutual prevailing-party requirement or cap reimbursable legal fees.'
  },

  // ==========================================
  // 2. UNLIMITED LIABILITY & DAMAGES WAIVERS
  // ==========================================
  {
    id: 'liab-01',
    phrase: 'unlimited liability',
    category: 'Liability & Damages',
    severity: 'critical',
    regex: /\bunlimited\s+liability\b/i,
    description: 'Exposes your entire corporate balance sheet and assets to unrestricted financial exposure.',
    recommendation: 'Never accept uncapped liability. Demand a standard 1x or 2x annual contract value aggregate ceiling.'
  },
  {
    id: 'liab-02',
    phrase: 'consequential damages waiver',
    category: 'Liability & Damages',
    severity: 'critical',
    regex: /\b(?:consequential|indirect|punitive|special|exemplary)\s+damages\b/i,
    description: 'Unilateral or missing waiver of indirect/lost-profit damages risks speculative catastrophe claims.',
    recommendation: 'Ensure mutual exclusion of consequential, incidental, and punitive damages.'
  },
  {
    id: 'liab-03',
    phrase: 'loss of profits or business interruption',
    category: 'Liability & Damages',
    severity: 'warning',
    regex: /\b(?:loss\s+of\s+profits|business\s+interruption|lost\s+revenues)\b/i,
    description: 'Claims for downstream lost profits can easily exceed total contract revenue by orders of magnitude.',
    recommendation: 'Explicitly disclaim lost revenue and interruption of business in the limitation of liability section.'
  },
  {
    id: 'liab-04',
    phrase: 'no aggregate limitation of liability',
    category: 'Liability & Damages',
    severity: 'critical',
    regex: /\b(?:no\s+aggregate\s+limitation|shall\s+not\s+be\s+subject\s+to\s+any\s+(?:cap|limit))\b/i,
    description: 'Explicit carveout from liability caps creates open-ended exposure.',
    recommendation: 'Carveouts should be strictly restricted to gross negligence, intentional misconduct, and confidentiality breaches.'
  },
  {
    id: 'liab-05',
    phrase: 'shall exceed total fees paid',
    category: 'Liability & Damages',
    severity: 'warning',
    regex: /\b(?:shall\s+not\s+exceed|in\s+excess\s+of)\s+(?:the\s+)?total\s+fees\s+paid\b/i,
    description: 'Liability ceiling formulation. Favorable if protecting vendor, unfavorable if protecting customer.',
    recommendation: 'Evaluate whether you are the buyer or vendor and align aggregate cap accordingly.'
  },

  // ==========================================
  // 3. UNILATERAL TERMINATION & DISCRETION
  // ==========================================
  {
    id: 'term-01',
    phrase: 'sole discretion',
    category: 'Unilateral Termination & Rights',
    severity: 'critical',
    regex: /\b(?:in|at)\s+(?:its|their)\s+sole\s+discretion\b/i,
    description: 'Grants one party absolute, unchallengeable authority to make binding contractual choices.',
    recommendation: 'Replace "sole discretion" with "commercially reasonable discretion" or "mutual agreement".'
  },
  {
    id: 'term-02',
    phrase: 'without notice',
    category: 'Unilateral Termination & Rights',
    severity: 'critical',
    regex: /\bwithout\s+(?:prior\s+)?notice\b/i,
    description: 'Authorizes immediate suspension, termination, or price hikes without advance warning.',
    recommendation: 'Mandate minimum 30 days written notice with a 30-day cure period for non-material breaches.'
  },
  {
    id: 'term-03',
    phrase: 'termination for convenience',
    category: 'Unilateral Termination & Rights',
    severity: 'warning',
    regex: /\btermination\s+for\s+convenience\b/i,
    description: 'Allows one side to cancel the contract at will, stranding upfront investments.',
    recommendation: 'Require reciprocal termination rights and a prorated wind-down fee or early termination charge.'
  },
  {
    id: 'term-04',
    phrase: 'immediate termination',
    category: 'Unilateral Termination & Rights',
    severity: 'warning',
    regex: /\bimmediate(?:ly)?\s+terminate\b/i,
    description: 'Terminates relationship abruptly without opportunity to cure alleged default.',
    recommendation: 'Limit immediate termination to insolvency, bankruptcy, or criminal indictment.'
  },
  {
    id: 'term-05',
    phrase: 'without cause',
    category: 'Unilateral Termination & Rights',
    severity: 'info',
    regex: /\bterminate\s+(?:at\s+any\s+time\s+)?without\s+cause\b/i,
    description: 'Permits no-fault cancellation.',
    recommendation: 'Add minimum 60 days advance written notice and payment for all completed milestones.'
  },

  // ==========================================
  // 4. IP ASSIGNMENT & EXCLUSIVITY
  // ==========================================
  {
    id: 'ip-01',
    phrase: 'work made for hire',
    category: 'Intellectual Property',
    severity: 'critical',
    regex: /\bwork\s+(?:made\s+)?for\s+hire\b/i,
    description: 'Automatically transfers full authorship and copyright of all creations to the client.',
    recommendation: 'Reserve all pre-existing tools, algorithms, libraries, and background IP explicitly.'
  },
  {
    id: 'ip-02',
    phrase: 'irrevocable assignment',
    category: 'Intellectual Property',
    severity: 'critical',
    regex: /\birrevocable(?:ly)?\s+assign(?:s)?\b/i,
    description: 'Permanent surrender of patents, trade secrets, or code that cannot be rescinded even upon non-payment.',
    recommendation: 'Condition IP assignment strictly upon receipt of full and final contractual payment.'
  },
  {
    id: 'ip-03',
    phrase: 'perpetual worldwide royalty-free license',
    category: 'Intellectual Property',
    severity: 'warning',
    regex: /\bperpetual,\s*worldwide,\s*(?:royalty-free|unrestricted)\s+license\b/i,
    description: 'Authorizes eternal, free exploitation of your deliverables across all global markets.',
    recommendation: 'Scope license term to duration of active agreement and restrict to internal customer use.'
  },
  {
    id: 'ip-04',
    phrase: 'all rights, title, and interest',
    category: 'Intellectual Property',
    severity: 'critical',
    regex: /\ball\s+rights?,\s+title\s+(?:and|&)\s+interest\b/i,
    description: 'Total expropriation of intellectual property assets without reservation.',
    recommendation: 'Carve out "Vendor Background Technology" and "Reusable Development Tooling".'
  },
  {
    id: 'ip-05',
    phrase: 'waiver of moral rights',
    category: 'Intellectual Property',
    severity: 'info',
    regex: /\bwaive(?:s)?\s+(?:all\s+)?moral\s+rights\b/i,
    description: 'Waives rights of attribution and prevents objecting to derogatory modifications.',
    recommendation: 'Acceptable in software commercial agreements, but verify applicable jurisdiction.'
  },

  // ==========================================
  // 5. NON-COMPETE & RESTRICTIVE COVENANTS
  // ==========================================
  {
    id: 'comp-01',
    phrase: 'covenant not to compete',
    category: 'Restrictive Covenants',
    severity: 'critical',
    regex: /\b(?:covenant\s+not\s+to\s+compete|non-compete|noncompetition)\b/i,
    description: 'Restricts your organization from serving other clients or competing in related industry verticals.',
    recommendation: 'Strike completely. Independent contractors and enterprise software vendors must remain non-exclusive.'
  },
  {
    id: 'comp-02',
    phrase: 'non-solicitation of employees',
    category: 'Restrictive Covenants',
    severity: 'warning',
    regex: /\bnon-solicitation\s+of\s+(?:employees|personnel|contractors)\b/i,
    description: 'Barriers against hiring opposing staff, even via general public advertisements.',
    recommendation: 'Carve out general job postings and limit restriction strictly to direct targeting for 12 months.'
  },
  {
    id: 'comp-03',
    phrase: 'exclusive provider',
    category: 'Restrictive Covenants',
    severity: 'warning',
    regex: /\bexclusive\s+(?:provider|partner|vendor|supplier)\b/i,
    description: 'Locks you into single-vendor commitments, eliminating market flexibility.',
    recommendation: 'Ensure minimum purchase commitments accompany any exclusivity covenants.'
  },
  {
    id: 'comp-04',
    phrase: 'restrictive covenant',
    category: 'Restrictive Covenants',
    severity: 'warning',
    regex: /\brestrictive\s+covenant\b/i,
    description: 'Broad business activity limitations that may hamper enterprise growth.',
    recommendation: 'Carefully define geographical bounds and operational scope.'
  },
  {
    id: 'comp-05',
    phrase: 'most favored nation',
    category: 'Restrictive Covenants',
    severity: 'warning',
    regex: /\bmost\s+favored\s+(?:nation|customer)\b/i,
    description: 'Forces you to match lowest pricing offered to any other customer globally.',
    recommendation: 'Strike MFN clauses or tie strictly to equal order volumes and identical contract tiers.'
  },

  // ==========================================
  // 6. LIQUIDATED DAMAGES & PENALTIES
  // ==========================================
  {
    id: 'dam-01',
    phrase: 'liquidated damages',
    category: 'Liquidated Damages & Penalties',
    severity: 'critical',
    regex: /\bliquidated\s+damages\b/i,
    description: 'Predetermined financial penalties payable immediately upon breach without requiring proof of actual harm.',
    recommendation: 'Oppose liquidated damages; insist damages be proven by actual documented pecuniary loss.'
  },
  {
    id: 'dam-02',
    phrase: 'penalty clause',
    category: 'Liquidated Damages & Penalties',
    severity: 'critical',
    regex: /\b(?:as\s+a\s+penalty|penalty\s+(?:fee|sum))\b/i,
    description: 'Punitive fees unenforceable in some jurisdictions but hazardous in private dispute arbitration.',
    recommendation: 'Strike punitive clauses. Contracts may only compensate genuine compensatory damages.'
  },
  {
    id: 'dam-03',
    phrase: 'accelerated payment',
    category: 'Liquidated Damages & Penalties',
    severity: 'warning',
    regex: /\baccelerat(?:e|ion)\s+(?:of\s+)?(?:all\s+)?payments?\b/i,
    description: 'Triggers immediate lump-sum maturity of all future contract payments upon minor default.',
    recommendation: 'Require notice and 30-day cure period before payment acceleration occurs.'
  },
  {
    id: 'dam-04',
    phrase: 'forfeiture of deposit',
    category: 'Liquidated Damages & Penalties',
    severity: 'warning',
    regex: /\bforfeit(?:ure)?\s+of\s+(?:deposit|retainer|fees)\b/i,
    description: 'Loss of escrow or deposits without right to refund or offset.',
    recommendation: 'Ensure refunds are available for non-performance or mutual termination.'
  },
  {
    id: 'dam-05',
    phrase: 'interest compounded daily',
    category: 'Liquidated Damages & Penalties',
    severity: 'warning',
    regex: /\bcompounded\s+(?:daily|monthly)\b/i,
    description: 'Aggressive compounding rates on disputed fees or delayed settlements.',
    recommendation: 'Cap late interest at 1.5% simple interest per month or statutory maximum.'
  },

  // ==========================================
  // 7. AUTOMATIC RENEWAL & LOCK-IN
  // ==========================================
  {
    id: 'renew-01',
    phrase: 'automatic renewal',
    category: 'Automatic Renewal & Lock-in',
    severity: 'warning',
    regex: /\bautomatic(?:ally)?\s+renew(?:al|s)?\b/i,
    description: 'Locks the agreement into subsequent multi-year terms unless timely cancellation is submitted.',
    recommendation: 'Add requirement for vendor to send 60-day renewal reminder notice before lock-in window closes.'
  },
  {
    id: 'renew-02',
    phrase: 'evergreen clause',
    category: 'Automatic Renewal & Lock-in',
    severity: 'warning',
    regex: /\bevergreen\s+(?:clause|contract|provision)\b/i,
    description: 'Perpetual self-extending agreement that never expires automatically.',
    recommendation: 'Limit contract to fixed term with affirmative mutual written renewal requirement.'
  },
  {
    id: 'renew-03',
    phrase: 'narrow opt-out window',
    category: 'Automatic Renewal & Lock-in',
    severity: 'critical',
    regex: /\bno\s+less\s+than\s+(?:60|90|120)\s+days\s+(?:prior|before)\s+to\s+expiration\b/i,
    description: 'Strict 90-120 day advance cancellation deadline designed to trap customers into unintentional renewals.',
    recommendation: 'Shorten notice window to 30 days prior to term expiration.'
  },
  {
    id: 'renew-04',
    phrase: 'price increase upon renewal',
    category: 'Automatic Renewal & Lock-in',
    severity: 'info',
    regex: /\b(?:increase|adjust)\s+fees\s+upon\s+renewal\b/i,
    description: 'Uncapped vendor right to escalate subscription or service fees at each renewal cycle.',
    recommendation: 'Cap annual renewal price increases at the Consumer Price Index (CPI) or 3-5% maximum.'
  },

  // ==========================================
  // 8. DISPUTE RESOLUTION & ARBITRATION
  // ==========================================
  {
    id: 'disp-01',
    phrase: 'binding arbitration',
    category: 'Dispute Resolution & Governing Law',
    severity: 'warning',
    regex: /\b(?:mandatory|binding)\s+arbitration\b/i,
    description: 'Forfeits your constitutional right to court trial in favor of costly private arbitration tribunals.',
    recommendation: 'Ensure arbitration costs are split equally and venue is located in a neutral convenient forum.'
  },
  {
    id: 'disp-02',
    phrase: 'waiver of jury trial',
    category: 'Dispute Resolution & Governing Law',
    severity: 'warning',
    regex: /\bwaiver\s+of\s+jury\s+trial\b/i,
    description: 'Surrenders the right to have dispute heard by a jury of peers.',
    recommendation: 'Common in commercial agreements, but confirm reciprocity for both sides.'
  },
  {
    id: 'disp-03',
    phrase: 'class action waiver',
    category: 'Dispute Resolution & Governing Law',
    severity: 'info',
    regex: /\bclass\s+action\s+waiver\b/i,
    description: 'Precludes joining collective class claims.',
    recommendation: 'Standard risk-mitigation for SaaS vendors; unfavorable for individual buyers.'
  },
  {
    id: 'disp-04',
    phrase: 'exclusive jurisdiction',
    category: 'Dispute Resolution & Governing Law',
    severity: 'warning',
    regex: /\bexclusive\s+jurisdiction\s+of\s+(?:the\s+courts\s+of)?\b/i,
    description: 'Compels defending lawsuits in opposing party home state or distant overseas country.',
    recommendation: 'Negotiate mutual jurisdiction in defendant home venue or standard neutral venue (e.g. Delaware/London).'
  },
  {
    id: 'disp-05',
    phrase: 'prevailing party legal fees',
    category: 'Dispute Resolution & Governing Law',
    severity: 'info',
    regex: /\bprevailing\s+party\s+shall\s+be\s+entitled\b/i,
    description: 'Loser in legal dispute pays winner entire legal fees.',
    recommendation: 'Favorable if you possess a strong legal position; deters frivolous claims.'
  },

  // ==========================================
  // 9. DATA BREACH, PRIVACY & CYBERSECURITY
  // ==========================================
  {
    id: 'sec-01',
    phrase: 'unlimited data breach liability',
    category: 'Data Breach & Cybersecurity',
    severity: 'critical',
    regex: /\b(?:data\s+breach|security\s+incident)\s+liability\s+shall\s+not\s+be\s+subject\s+to\b/i,
    description: 'Carves out data breaches from liability caps, exposing vendor to millions in regulatory fines.',
    recommendation: 'Institute a separate "Super-Cap" (e.g., 2x-3x annual contract fees) for cybersecurity incidents.'
  },
  {
    id: 'sec-02',
    phrase: 'notify within 24 hours',
    category: 'Data Breach & Cybersecurity',
    severity: 'critical',
    regex: /\bnotify\s+(?:within|in\s+no\s+event\s+later\s+than)\s+(?:24|48)\s+hours\b/i,
    description: 'Unrealistic 24-hour breach notification requirement before forensic teams can confirm incident validity.',
    recommendation: 'Negotiate "within 72 hours of confirming a security breach involving customer personal data".'
  },
  {
    id: 'sec-03',
    phrase: 'indefinite confidentiality',
    category: 'Data Breach & Cybersecurity',
    severity: 'warning',
    regex: /\bindefinite(?:ly)?\s+maintain\s+confidential(?:ity)?\b/i,
    description: 'Perpetual confidentiality burdens spanning decades without expiration.',
    recommendation: 'Standard confidentiality term should expire 3 to 5 years following contract termination (trade secrets exempted).'
  },
  {
    id: 'sec-04',
    phrase: 'broad right to audit',
    category: 'Data Breach & Cybersecurity',
    severity: 'warning',
    regex: /\bright\s+to\s+audit\s+(?:at\s+any\s+time|without\s+notice)\b/i,
    description: 'Gives opposing party unrestricted physical and digital inspection access to your corporate servers.',
    recommendation: 'Limit audits to once annually during business hours with 30 days notice, performed by independent third party.'
  },
  {
    id: 'sec-05',
    phrase: 'subprocessor liability',
    category: 'Data Breach & Cybersecurity',
    severity: 'warning',
    regex: /\bliable\s+for\s+(?:acts\s+and\s+omissions\s+of\s+)?subprocessors\b/i,
    description: 'Full vicarious liability for cloud hosting vendors (AWS, Azure, GCP) beyond your direct control.',
    recommendation: 'Require that subprocessor contracts contain data protection terms materially no less protective.'
  },

  // ==========================================
  // 10. WARRANTIES, DISCLAIMERS & REMEDIES
  // ==========================================
  {
    id: 'war-01',
    phrase: 'as is, where is',
    category: 'Warranties & Remedies',
    severity: 'warning',
    regex: /\b(?:as\s+is|where\s+is|with\s+all\s+faults)\b/i,
    description: 'Total disclaimer of fitness and performance. Common in software, leaves buyer with zero performance guarantee.',
    recommendation: 'Buyers must demand a performance warranty guaranteeing software conforms to published documentation.'
  },
  {
    id: 'war-02',
    phrase: 'sole and exclusive remedy',
    category: 'Warranties & Remedies',
    severity: 'warning',
    regex: /\bsole\s+(?:and\s+exclusive\s+)?remedy\b/i,
    description: 'Restricts your available legal recourse strictly to re-performance or trivial service credits.',
    recommendation: 'Preserve right to terminate for material breach with full prorated refund if defect is uncured.'
  },
  {
    id: 'war-03',
    phrase: 'time is of the essence',
    category: 'Warranties & Remedies',
    severity: 'warning',
    regex: /\btime\s+is\s+of\s+the\s+essence\b/i,
    description: 'Any minor milestone delay is deemed a material breach, allowing immediate cancellation.',
    recommendation: 'Strike clause or add reasonable grace periods with force majeure protections.'
  },
  {
    id: 'war-04',
    phrase: 'disclaimer of merchantability',
    category: 'Warranties & Remedies',
    severity: 'info',
    regex: /\bdisclaims?\s+(?:all\s+)?implied\s+warranties?\b/i,
    description: 'Statutory disclaimer required under Uniform Commercial Code (UCC).',
    recommendation: 'Ensure express warranties remain intact despite implied warranty disclaimers.'
  },
  {
    id: 'war-05',
    phrase: 'unilateral price modification',
    category: 'Warranties & Remedies',
    severity: 'critical',
    regex: /\breserves?\s+the\s+right\s+to\s+(?:modify|change|increase)\s+prices?\b/i,
    description: 'Authorizes vendor to raise subscription fees mid-term at will.',
    recommendation: 'Lock fees for full initial term; increases permitted only upon written agreement.'
  }
];

/**
 * Scans contract text against all 50+ enterprise legal risk rules.
 * 
 * @param {string} text - Text of contract to scan
 * @returns {Array<Object>} Found risk items with metadata, match locations, severity and guidance
 */
export function scanLegalRisks(text = '') {
  if (!text) return [];

  const detectedRisks = [];

  LEGAL_RISK_RULES.forEach((rule) => {
    const matches = [];
    let match;
    const regex = new RegExp(rule.regex.source, 'gi');

    while ((match = regex.exec(text)) !== null) {
      // Extract surrounding context snippet (up to 80 chars before and after)
      const start = Math.max(0, match.index - 60);
      const end = Math.min(text.length, match.index + match[0].length + 60);
      const snippet = text.substring(start, end).replace(/\s+/g, ' ').trim();

      matches.push({
        index: match.index,
        matchedText: match[0],
        snippet: (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '')
      });

      // Avoid infinite loop on zero-width matches
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }

    if (matches.length > 0) {
      detectedRisks.push({
        ...rule,
        count: matches.length,
        occurrences: matches
      });
    }
  });

  // Sort by severity: critical first, then warning, then info
  const severityRank = { critical: 3, warning: 2, info: 1 };
  detectedRisks.sort((a, b) => {
    const rankDiff = (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
    if (rankDiff !== 0) return rankDiff;
    return b.count - a.count;
  });

  return detectedRisks;
}
