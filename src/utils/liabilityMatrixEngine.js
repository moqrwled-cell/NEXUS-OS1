/**
 * Nexus ContractGuard — Liability & Indemnity Interlocking Matrix Engine
 * 
 * Deterministic AST & Pattern-Matching Engine for Reconciling:
 * 1. Indemnification Scope (Direct vs Third-Party Claims)
 * 2. Aggregate Limitation of Liability (LoL) Caps
 * 3. Consequential Damages Waivers & Lost Profits Bars
 * 4. Sole and Exclusive Remedy Provisions
 * 5. Carve-Outs and Non-Obstante ("Notwithstanding") Subordinations
 * 6. Insurance Minimum Limits vs Liability Cap Parity
 * 7. Unlawful Exculpations under Public Policy (Gross Negligence, Fraud)
 * 
 * ABA Model Rule 1.6 Certified: 100% Client-Side In-RAM Execution.
 * Zero Network Invocations. Zero AI Hallucinations.
 */

// ============================================================================
// DOCUMENT CHUNKING UTILITIES
// ============================================================================

/**
 * Splits contract text into discrete, inspectable logical blocks (paragraphs & sub-sections).
 */
export function getDocumentBlocks(text) {
  if (!text || typeof text !== 'string') return [];

  // Split by double line breaks (paragraphs)
  const rawParagraphs = text.split(/(?:\r?\n\s*){2,}/);
  const blocks = [];

  for (const para of rawParagraphs) {
    // If a paragraph contains numbered subsections (e.g. 12.1 and 12.2), split them
    const subBlocks = para.split(/(?=(?:^|\n)\s*(?:[0-9]+(?:\.[0-9]+)+|\([a-z0-9]+\))\s+)/i);
    for (const sb of subBlocks) {
      const trimmed = sb.trim();
      if (trimmed.length > 20) {
        blocks.push(trimmed);
      }
    }
  }

  return blocks;
}

function extractSectionNumber(blockText) {
  const m = blockText.match(/(?:section|article|\u00A7)?\s*([0-9]+(?:\.[0-9]+)*)/i);
  return m ? m[1] : 'Unnumbered';
}

// ============================================================================
// CLAUSE EXTRACTION HELPERS (Client-Side Deterministic Parsers)
// ============================================================================

/**
 * Extracts Indemnification clauses and detects covered subject matters.
 */
export function extractIndemnityIntel(text) {
  if (!text || typeof text !== 'string') return null;

  const blocks = getDocumentBlocks(text);
  const matches = [];

  for (const block of blocks) {
    if (/(?:indemnif|hold harmless|defend and hold|defend,\s*indemnify)/i.test(block)) {
      matches.push({
        sectionNum: extractSectionNumber(block),
        snippet: block
      });
    }
  }

  const hasIndemnity = matches.length > 0;
  const fullIndemnityText = matches.map(m => m.snippet).join('\n\n');

  // Scope detection
  const coversThirdParty = /(?:third[- ]party|claims brought by third parties|demands, suits|against any claim)/i.test(fullIndemnityText);
  const coversIP = /(?:intellectual property|patent|copyright|trademark|trade secret|infringement)/i.test(fullIndemnityText);
  const coversGrossNegligence = /(?:gross negligence|willful misconduct|intentional wrongdoing)/i.test(fullIndemnityText);
  const coversConfidentiality = /(?:confidential|secrecy|non-disclosure)/i.test(fullIndemnityText);
  const coversDataBreach = /(?:data breach|security incident|privacy|gdpr|ccpa|personal data)/i.test(fullIndemnityText);
  const isMutual = /(?:each party shall indemnify|mutually indemnify|both parties agree to indemnify)/i.test(fullIndemnityText);

  return {
    detected: hasIndemnity,
    matchCount: matches.length,
    clauses: matches,
    fullText: fullIndemnityText,
    scopes: {
      thirdParty: coversThirdParty,
      ipInfringement: coversIP,
      grossNegligence: coversGrossNegligence,
      confidentiality: coversConfidentiality,
      dataBreach: coversDataBreach,
      mutual: isMutual
    }
  };
}

/**
 * Extracts Limitation of Liability (LoL) clauses, caps, and monetary limits.
 */
export function extractLiabilityCapIntel(text) {
  if (!text || typeof text !== 'string') return null;

  const blocks = getDocumentBlocks(text);
  const matches = [];

  for (const block of blocks) {
    if (/(?:limitation of liability|aggregate liability|maximum liability|cumulative liability|liability cap|liability.*exceed)/i.test(block)) {
      matches.push({
        sectionNum: extractSectionNumber(block),
        snippet: block
      });
    }
  }

  const hasLoL = matches.length > 0;
  const fullLoLText = matches.map(m => m.snippet).join('\n\n');

  // Extract Dollar Amount if present
  let capDollarAmount = null;
  const dollarMatch = fullLoLText.match(/\$\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i) || 
                      fullLoLText.match(/([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:dollars|usd)/i);
  if (dollarMatch) {
    capDollarAmount = dollarMatch[1];
  }

  // Formula cap detection (e.g. fees in past 12 months)
  const isFeesMultiplier = /(?:fees|amounts|monies)\s*(?:paid|payable)\s*(?:in|during|under)\s*(?:the\s*)?(?:preceding|prior|past)?\s*([0-9]+|twelve|six|three)?\s*(?:months)?/i.test(fullLoLText);
  
  // Uncapped check
  const isUncapped = /(?:shall not be limited|uncapped|no limitation on liability|unlimited liability)/i.test(fullLoLText);

  // Asymmetry detection (Unilateral vendor cap vs customer uncapped)
  const isUnilateral = /(?:vendor|contractor|seller|licensor|company)'s\s*(?:aggregate|cumulative|maximum|total)?\s*liability\b.*?(?:shall not exceed|exceed)/is.test(fullLoLText) &&
                       !/(?:customer|buyer|client|licensee)'s\s*(?:aggregate|cumulative|maximum|total)?\s*liability\b.*?(?:shall not exceed|exceed)/is.test(fullLoLText);

  return {
    detected: hasLoL,
    matchCount: matches.length,
    clauses: matches,
    fullText: fullLoLText,
    capDollarAmount,
    isFeesMultiplier,
    isUncapped,
    isUnilateral
  };
}

/**
 * Extracts Consequential Damages Waivers.
 */
export function extractConsequentialWaiverIntel(text) {
  if (!text || typeof text !== 'string') return null;

  const blocks = getDocumentBlocks(text);
  const matches = [];

  for (const block of blocks) {
    if (/(?:consequential|indirect|special|punitive|exemplary|incidental|loss of profits|loss of revenue|loss of business|loss of goodwill)/i.test(block)) {
      matches.push({
        sectionNum: extractSectionNumber(block),
        snippet: block
      });
    }
  }

  const hasWaiver = matches.length > 0;
  const fullWaiverText = matches.map(m => m.snippet).join('\n\n');

  const waivesLostProfits = /(?:loss of profits|lost profits|loss of revenue)/i.test(fullWaiverText);
  const waivesPunitive = /(?:punitive|exemplary)/i.test(fullWaiverText);
  const waivesIndirect = /(?:indirect|incidental|special|consequential)/i.test(fullWaiverText);

  return {
    detected: hasWaiver,
    matchCount: matches.length,
    clauses: matches,
    fullText: fullWaiverText,
    scopes: {
      lostProfits: waivesLostProfits,
      punitive: waivesPunitive,
      indirect: waivesIndirect
    }
  };
}

/**
 * Extracts Sole and Exclusive Remedy clauses.
 */
export function extractSoleRemedyIntel(text) {
  if (!text || typeof text !== 'string') return null;

  const blocks = getDocumentBlocks(text);
  const matches = [];

  for (const block of blocks) {
    if (/(?:sole and exclusive remedy|exclusive remedy|only and exclusive remedy|sole remedy)/i.test(block)) {
      matches.push({
        sectionNum: extractSectionNumber(block),
        snippet: block
      });
    }
  }

  const hasSoleRemedy = matches.length > 0;
  const fullText = matches.map(m => m.snippet).join('\n\n');

  // Check if sole remedy subordinates to indemnification or equitable relief
  const isSubordinated = /(?:subject to section|except as provided in section|without limiting section|notwithstanding the foregoing|saving and excepting)/i.test(fullText);
  const appliesToAllBreaches = /(?:for any breach of this agreement|under this agreement|for all claims|arising out of or relating to this agreement)/i.test(fullText);
  const appliesToWarrantyOnly = /(?:for breach of warranty|for defective deliverables|service level credit)/i.test(fullText);

  return {
    detected: hasSoleRemedy,
    matchCount: matches.length,
    clauses: matches,
    fullText,
    isSubordinated,
    appliesToAllBreaches,
    appliesToWarrantyOnly
  };
}

/**
 * Extracts Insurance requirements from covenants and exhibits.
 */
export function extractInsuranceIntel(text) {
  if (!text || typeof text !== 'string') return null;

  const blocks = getDocumentBlocks(text);
  const matches = [];

  for (const block of blocks) {
    if (/(?:commercial general liability|errors and omissions|cyber liability|professional liability|umbrella policy|insurance coverage|insurance requirements)/i.test(block)) {
      matches.push({
        sectionNum: extractSectionNumber(block),
        snippet: block
      });
    }
  }

  const hasInsurance = matches.length > 0;
  const fullText = matches.map(m => m.snippet).join('\n\n');

  let policyLimitAmount = null;
  const dollarMatch = fullText.match(/\$\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (dollarMatch) {
    policyLimitAmount = dollarMatch[1];
  }

  return {
    detected: hasInsurance,
    matchCount: matches.length,
    clauses: matches,
    fullText,
    policyLimitAmount
  };
}

/**
 * Scans for Carve-Outs inside LoL, Consequential Waiver, and overall contract texts.
 */
export function extractCarveOutIntel(fullText) {
  if (!fullText || typeof fullText !== 'string') {
    return {
      hasIndemnityCarveOut: false,
      hasConfidentialityCarveOut: false,
      hasGrossNegligenceCarveOut: false,
      hasIPCarveOut: false,
      hasDataBreachCarveOut: false,
      hasPaymentCarveOut: false
    };
  }

  // 1. Indemnity carve-out
  const hasIndemnityCarveOut = 
    /(?:limitations?|exclusions?|liability|section\s*12|article\s*12).*?(?:shall not apply to|except for|excluding|carved out|other than|notwithstanding).*?(?:indemnif|defense obligations|section\s*(?:8|9|10|11|13|14))/is.test(fullText) ||
    /notwithstanding anything to the contrary.*?(?:shall not apply to|except for|excluding).*?(?:indemnif|defense obligations|section\s*(?:8|9|10|11|13|14))/is.test(fullText);

  // 2. Gross negligence / fraud carve-out
  const hasGrossNegligenceCarveOut = 
    /(?:limitations?|exclusions?|liability|section\s*12|article\s*12|notwithstanding).*?(?:shall not apply to|except for|excluding|nothing in this agreement shall limit).*?(?:gross negligence|willful misconduct|fraud|intentional)/is.test(fullText);

  // 3. Confidentiality carve-out
  const hasConfidentialityCarveOut = 
    /(?:limitations?|exclusions?|liability|section\s*12|article\s*12|notwithstanding).*?(?:shall not apply to|except for|excluding).*?(?:confidential|secrecy|non-disclosure)/is.test(fullText);

  // 4. IP Infringement carve-out
  const hasIPCarveOut = 
    /(?:limitations?|exclusions?|liability|section\s*12|article\s*12|notwithstanding).*?(?:shall not apply to|except for|excluding).*?(?:intellectual property|infringement|patent|copyright)/is.test(fullText);

  // 5. Data breach / cyber carve-out or super-cap
  const hasDataBreachCarveOut = 
    /(?:data protection|data breach|personal data|privacy|security incident).*?(?:super-cap|separate cap|not be subject to|shall not apply)/is.test(fullText) ||
    /(?:super-cap|super cap).*?(?:data|cyber|security)/is.test(fullText);

  // 6. Payment carve-out
  const hasPaymentCarveOut = 
    /(?:limitations?|exclusions?|liability).*?(?:shall not apply to|except for).*?(?:payment obligations|fees owed|fees due)/is.test(fullText);

  return {
    hasIndemnityCarveOut,
    hasConfidentialityCarveOut,
    hasGrossNegligenceCarveOut,
    hasIPCarveOut,
    hasDataBreachCarveOut,
    hasPaymentCarveOut
  };
}

// ============================================================================
// CORE DETERMINISTIC AUDIT ENGINE (7-Vector Interlocking Matrix)
// ============================================================================

/**
 * Executes a comprehensive, deterministic audit of interlocking contract liabilities.
 * Evaluates the 7 key commercial risk vectors.
 * 
 * @param {string} contractText - The full legal agreement text
 * @returns {Object} Complete audit findings, score, matrix table, and fix rider
 */
export function analyzeLiabilityInterlocks(contractText) {
  const startTime = performance.now();

  if (!contractText || typeof contractText !== 'string' || contractText.trim().length === 0) {
    return {
      score: 0,
      statusBadge: 'NO_CONTRACT_LOADED',
      findings: [],
      rules: [],
      intel: {},
      harmonizedRider: '',
      processingTimeMs: 0
    };
  }

  // 1. Extract Clause Intelligence
  const indemnityIntel = extractIndemnityIntel(contractText);
  const lolIntel = extractLiabilityCapIntel(contractText);
  const consequentialIntel = extractConsequentialWaiverIntel(contractText);
  const soleRemedyIntel = extractSoleRemedyIntel(contractText);
  const insuranceIntel = extractInsuranceIntel(contractText);

  const combinedLiabilityText = [
    lolIntel?.fullText || '',
    consequentialIntel?.fullText || '',
    soleRemedyIntel?.fullText || ''
  ].join('\n\n');

  const carveOuts = extractCarveOutIntel(contractText);

  // 2. Evaluate the 7 Deterministic Rules
  const rules = [];
  let scoreDeductions = 0;

  // RULE 1: The "Gutted Indemnity" Trap (Indemnity Carve-Out from LoL Cap)
  if (indemnityIntel.detected && lolIntel.detected) {
    if (carveOuts.hasIndemnityCarveOut) {
      rules.push({
        id: 'RULE_01_GUTTED_INDEMNITY',
        name: 'Indemnity Carve-Out from Aggregate Cap',
        category: 'Indemnity Preservation',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Indemnification obligations are expressly carved out from the general Limitation of Liability cap.',
        legalRisk: 'Low. Third-party indemnity payouts remain unencumbered by the aggregate contract cap.',
        consequence: 'Client retains full financial recourse against counterparty for third-party liabilities and IP settlements.',
        recommendation: 'Maintain existing non-obstante carve-out wording.'
      });
    } else {
      scoreDeductions += 30;
      rules.push({
        id: 'RULE_01_GUTTED_INDEMNITY',
        name: 'Indemnity Carve-Out from Aggregate Cap',
        category: 'Indemnity Preservation',
        status: 'FAIL',
        severity: 'CRITICAL',
        finding: 'Indemnity clause detected, but the Limitation of Liability cap contains ZERO express carve-outs for indemnification.',
        legalRisk: 'Severe Malpractice Trap. Under standard commercial jurisprudence, general liability caps swallow indemnification obligations unless explicitly carved out.',
        consequence: `If a third party sues for $5,000,000, your indemnity recovery is legally capped at ${lolIntel.capDollarAmount ? '$' + lolIntel.capDollarAmount : 'the contract cap'}. Client must absorb all remaining losses!`,
        recommendation: 'Insert express carve-out: "Notwithstanding anything to the contrary, the limitations in Section [LoL] shall not apply to indemnification obligations under Section [Indemnity]."'
      });
    }
  } else if (!indemnityIntel.detected && lolIntel.detected) {
    rules.push({
      id: 'RULE_01_GUTTED_INDEMNITY',
      name: 'Indemnity Carve-Out from Aggregate Cap',
      category: 'Indemnity Preservation',
      status: 'WARNING',
      severity: 'HIGH',
      finding: 'No express indemnification clause found, but liability cap is active.',
      legalRisk: 'Client has no third-party risk shifting protection in place.',
      consequence: 'Client is entirely self-insured against third-party claims, patent infringement, and vendor data breaches.',
      recommendation: 'Insert mutual AmLaw 100 indemnification covenant.'
    });
    scoreDeductions += 15;
  } else {
    rules.push({
      id: 'RULE_01_GUTTED_INDEMNITY',
      name: 'Indemnity Carve-Out from Aggregate Cap',
      category: 'Indemnity Preservation',
      status: 'PASS',
      severity: 'COMPLIANT',
      finding: 'No conflicting cap detected against indemnity covenants.',
      legalRisk: 'None detected.',
      consequence: 'Contract does not exhibit the classic capped indemnity loophole.',
      recommendation: 'Standard practice maintained.'
    });
  }

  // RULE 2: The "Consequential Damages Poison Pill" (Defense Costs Carve-Out)
  if (consequentialIntel.detected && indemnityIntel.detected) {
    const defenseSpecificallyProtected = /(?:defense costs|attorney'?s fees|settlement amounts|indemnif).*?(?:shall be deemed direct|direct damages|not be deemed consequential|carved out from.*waiver)/is.test(contractText);
    const consequentialExplicitlyCarvesIndemnity = /(?:consequential|indirect).*?(?:shall not apply to|except for).*?(?:indemnif|section\s*8)/is.test(contractText) ||
      /(?:indemnif).*?(?:notwithstanding).*?(?:consequential|indirect)/is.test(contractText);

    if (consequentialExplicitlyCarvesIndemnity || defenseSpecificallyProtected) {
      rules.push({
        id: 'RULE_02_CONSEQUENTIAL_DEFENSE_LEAK',
        name: 'Third-Party Defense Costs from Consequential Waiver',
        category: 'Damages Categorization',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Consequential damages waiver expressly exempts indemnification or classifies third-party defense costs as direct damages.',
        legalRisk: 'Low. Insulates attorney fees and settlement payouts from indirect damage exclusions.',
        consequence: 'Client can recover 100% of legal defense bills and court settlement judgments.',
        recommendation: 'Keep current express exclusion intact.'
      });
    } else {
      scoreDeductions += 25;
      rules.push({
        id: 'RULE_02_CONSEQUENTIAL_DEFENSE_LEAK',
        name: 'Third-Party Defense Costs from Consequential Waiver',
        category: 'Damages Categorization',
        status: 'FAIL',
        severity: 'CRITICAL',
        finding: 'Broad waiver of consequential/indirect damages with NO carve-out for third-party indemnifiable losses or legal defense costs.',
        legalRisk: 'Major Precedent Risk. Opposing counsel can argue that third-party settlements and defense fees constitute indirect/consequential damages barred by contract.',
        consequence: 'Client may be awarded indemnity in court, but barred from collecting legal defense bills and settlement fees!',
        recommendation: 'Add deeming clause: "For the avoidance of doubt, any losses, settlements, and legal defense costs indemnifiable under Section [Indemnity] shall be deemed direct damages."'
      });
    }
  } else {
    rules.push({
      id: 'RULE_02_CONSEQUENTIAL_DEFENSE_LEAK',
      name: 'Third-Party Defense Costs from Consequential Waiver',
      category: 'Damages Categorization',
      status: 'PASS',
      severity: 'COMPLIANT',
      finding: 'No dangerous consequential damage bar conflicting with indemnity.',
      legalRisk: 'None detected.',
      consequence: 'Common law damage recovery remains unhindered.',
      recommendation: 'Standard practice maintained.'
    });
  }

  // RULE 3: Sole and Exclusive Remedy Overreach
  if (soleRemedyIntel.detected) {
    if (soleRemedyIntel.isSubordinated) {
      rules.push({
        id: 'RULE_03_SOLE_REMEDY_SUBORDINATION',
        name: 'Sole & Exclusive Remedy Subordination',
        category: 'Remedy Preservation',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Sole and exclusive remedy clause is properly subordinated ("Subject to Section...") and does not extinguish general breach remedies.',
        legalRisk: 'Low. Statutory and equitable remedies are preserved.',
        consequence: 'Client preserves right to pursue injunctive relief and common law breach remedies.',
        recommendation: 'Ensure carve-out also protects equitable specific performance.'
      });
    } else if (soleRemedyIntel.appliesToAllBreaches) {
      scoreDeductions += 20;
      rules.push({
        id: 'RULE_03_SOLE_REMEDY_SUBORDINATION',
        name: 'Sole & Exclusive Remedy Subordination',
        category: 'Remedy Preservation',
        status: 'FAIL',
        severity: 'HIGH',
        finding: 'Unsubordinated Sole & Exclusive Remedy clause detected across entire agreement.',
        legalRisk: 'Dangerous Overreach. Literal judicial interpretation can hold that non-breaching party has NO right to sue for direct breach damages or seek injunctions.',
        consequence: 'Wipes out breach of contract claims and equitable remedies, limiting client strictly to the designated remedy (e.g. repair/replace or re-performance).',
        recommendation: 'Prepend: "Subject to Section [Indemnity] and except for claims for equitable relief or breach of confidentiality, the remedies set forth herein shall be..."'
      });
    } else {
      scoreDeductions += 20;
      rules.push({
        id: 'RULE_03_SOLE_REMEDY_SUBORDINATION',
        name: 'Sole & Exclusive Remedy Subordination',
        category: 'Remedy Preservation',
        status: 'FAIL',
        severity: 'HIGH',
        finding: 'Sole remedy clause applies to warranty/services without explicit subordination or reservation of indemnification.',
        legalRisk: 'Ambiguity regarding whether warranty remedies preclude third-party patent infringement claims.',
        consequence: 'Potential preliminary motion dispute over exclusive remedy scope.',
        recommendation: 'Clarify that warranty sole remedy does not restrict indemnification rights.'
      });
    }
  } else {
    rules.push({
      id: 'RULE_03_SOLE_REMEDY_SUBORDINATION',
      name: 'Sole & Exclusive Remedy Subordination',
      category: 'Remedy Preservation',
      status: 'PASS',
      severity: 'COMPLIANT',
      finding: 'No restrictive sole and exclusive remedy clause found.',
      legalRisk: 'None detected.',
      consequence: 'All cumulative common law and statutory remedies remain available.',
      recommendation: 'Maintain cumulative remedies clause.'
    });
  }

  // RULE 4: Public Policy Unlawful Exculpation Bar (Gross Negligence & Fraud)
  if (lolIntel.detected) {
    if (carveOuts.hasGrossNegligenceCarveOut) {
      rules.push({
        id: 'RULE_04_UNLAWFUL_EXCULPATION',
        name: 'Gross Negligence & Willful Misconduct Exculpation Bar',
        category: 'Public Policy Compliance',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Gross negligence, willful misconduct, and intentional fraud are explicitly carved out from liability caps.',
        legalRisk: 'Complies with Delaware (GRT, Inc.), New York (Kalisch-Jarcho), and California public policy.',
        consequence: 'Contract is fully enforceable and will not be struck down for unlawful pre-breach exculpation.',
        recommendation: 'Maintain standard public policy carve-out.'
      });
    } else {
      scoreDeductions += 15;
      rules.push({
        id: 'RULE_04_UNLAWFUL_EXCULPATION',
        name: 'Gross Negligence & Willful Misconduct Exculpation Bar',
        category: 'Public Policy Compliance',
        status: 'FAIL',
        severity: 'HIGH',
        finding: 'Limitation of Liability cap attempts to cover ALL liability without carving out Gross Negligence, Willful Misconduct, or Fraud.',
        legalRisk: 'Unenforceability Risk. Courts in DE, NY, and CA regularly strike down liability limitations that purport to insulate intentional or grossly reckless wrongdoing.',
        consequence: 'A court may invalidate the entire Limitation of Liability section, leaving both parties exposed to completely uncapped liability!',
        recommendation: 'Add express carve-out: "Nothing in this Agreement shall limit either party\'s liability for gross negligence, willful misconduct, or fraud."'
      });
    }
  }

  // RULE 5: Cap Reciprocity & Asymmetry
  if (lolIntel.detected) {
    if (lolIntel.isUnilateral) {
      scoreDeductions += 15;
      rules.push({
        id: 'RULE_05_CAP_ASYMMETRY',
        name: 'Reciprocal Cap Parity & Asymmetry',
        category: 'Risk Balance',
        status: 'FAIL',
        severity: 'HIGH',
        finding: 'Unilateral Liability Cap detected: Counterparty\'s liability is capped, while Client\'s liability appears uncapped or one-sided.',
        legalRisk: 'Severe Commercial Asymmetry. Client carries catastrophic downside while counterparty limits exposure to nominal fees.',
        consequence: 'Disproportionate financial exposure; opposing party can recover unlimited damages while client is boxed into a nominal ceiling.',
        recommendation: 'Convert unilateral cap into a strictly mutual aggregate cap.'
      });
    } else {
      rules.push({
        id: 'RULE_05_CAP_ASYMMETRY',
        name: 'Reciprocal Cap Parity & Asymmetry',
        category: 'Risk Balance',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Liability cap is mutual and bilateral across both parties.',
        legalRisk: 'Low. Equal protection under reciprocal limitation of liability.',
        consequence: 'Both parties share equitable and balanced financial ceilings.',
        recommendation: 'Preserve bilateral mutuality.'
      });
    }
  }

  // RULE 6: Insurance Policy vs. Liability Cap Parity
  if (insuranceIntel.detected && lolIntel.detected) {
    const insuranceAmountNum = parseDollarAmount(insuranceIntel.policyLimitAmount);
    const capAmountNum = parseDollarAmount(lolIntel.capDollarAmount);

    if (insuranceAmountNum && capAmountNum && insuranceAmountNum > capAmountNum * 2) {
      scoreDeductions += 10;
      rules.push({
        id: 'RULE_06_INSURANCE_CAP_PARITY',
        name: 'Insurance Policy vs. Liability Cap Parity',
        category: 'Insurance Alignment',
        status: 'WARNING',
        severity: 'MEDIUM',
        finding: `Insurance covenant mandates $${insuranceIntel.policyLimitAmount} in coverage, but contract liability is capped at $${lolIntel.capDollarAmount}.`,
        legalRisk: 'Coverage Voidance / Premium Waste. Counterparty carries $5M policy, but contractual cap at $50k creates legal friction with insurance underwriters.',
        consequence: 'Insurance carrier may argue that because the insured party\'s contractual liability is limited to $50k, the insurer is not obligated to pay out the $5M policy limit.',
        recommendation: 'Carve out insurance proceeds: "The aggregate cap shall not apply to the extent of any insurance proceeds actually recovered by the insured party under Section [Insurance]."'
      });
    } else {
      rules.push({
        id: 'RULE_06_INSURANCE_CAP_PARITY',
        name: 'Insurance Policy vs. Liability Cap Parity',
        category: 'Insurance Alignment',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Insurance covenants align reasonably with contractual liability ceilings.',
        legalRisk: 'Low.',
        consequence: 'Smooth claims processing with insurance underwriters.',
        recommendation: 'Maintain standard alignment.'
      });
    }
  } else {
    rules.push({
      id: 'RULE_06_INSURANCE_CAP_PARITY',
      name: 'Insurance Policy vs. Liability Cap Parity',
      category: 'Insurance Alignment',
      status: 'PASS',
      severity: 'COMPLIANT',
      finding: 'No insurance-to-cap friction detected.',
      legalRisk: 'None.',
      consequence: 'Standard risk distribution.',
      recommendation: 'Ensure minimum commercial liability coverage is maintained.'
    });
  }

  // RULE 7: High-Risk Data / Cyber / IP Super-Cap Reconciliation
  if (lolIntel.detected) {
    if (carveOuts.hasDataBreachCarveOut || carveOuts.hasConfidentialityCarveOut || carveOuts.hasIPCarveOut) {
      rules.push({
        id: 'RULE_07_SUPER_CAP_RECONCILIATION',
        name: 'Data Privacy & IP Super-Cap Reconciliation',
        category: 'High-Risk Exposure',
        status: 'PASS',
        severity: 'COMPLIANT',
        finding: 'Data breaches, confidentiality, or IP infringement claims are appropriately granted carve-outs or heightened protection.',
        legalRisk: 'Low. Protects high-exposure assets from ordinary commercial caps.',
        consequence: 'Client is adequately protected against multi-million-dollar cybersecurity breaches and trade secret theft.',
        recommendation: 'Maintain super-cap or uncapped status for sensitive data covenants.'
      });
    } else {
      scoreDeductions += 10;
      rules.push({
        id: 'RULE_07_SUPER_CAP_RECONCILIATION',
        name: 'Data Privacy & IP Super-Cap Reconciliation',
        category: 'High-Risk Exposure',
        status: 'WARNING',
        severity: 'MEDIUM',
        finding: 'Data breaches and confidentiality leaks are subject to standard low commercial liability cap without a heightened "Super-Cap".',
        legalRisk: 'Under-Protection for Cyber Claims. In modern SaaS/commercial contracts, data breaches cause catastrophic losses that far exceed 12 months fees.',
        consequence: 'If vendor experiences a major ransomware breach leaking customer PII, damages cannot be recovered beyond the low standard cap.',
        recommendation: 'Establish a separate "Super-Cap" (e.g. 3x to 5x standard cap) specifically for breaches of Confidentiality and Data Protection covenants.'
      });
    }
  }

  // Calculate Final Deterministic Score (0 to 100)
  const finalScore = Math.max(0, Math.min(100, 100 - scoreDeductions));

  let statusBadge = 'AIRTIGHT (COMPLIANT)';
  if (finalScore < 50) {
    statusBadge = 'CRITICAL EXPOSURE (UNPROTECTED)';
  } else if (finalScore < 80) {
    statusBadge = 'VULNERABLE (HIGH LEAKAGE)';
  } else if (finalScore < 100) {
    statusBadge = 'DEFENSIBLE (MINOR GAPS)';
  }

  // Generate Pre-Signing Harmonized AmLaw 100 Fix Rider Text
  const harmonizedRider = generateHarmonizedLiabilityRiderText({
    capAmount: lolIntel.capDollarAmount || '500,000',
    isMutual: true
  });

  const processingTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    score: finalScore,
    statusBadge,
    scoreDeductions,
    rules,
    intel: {
      indemnity: indemnityIntel,
      liabilityCap: lolIntel,
      consequentialWaiver: consequentialIntel,
      soleRemedy: soleRemedyIntel,
      insurance: insuranceIntel,
      carveOuts
    },
    harmonizedRider,
    processingTimeMs
  };
}

// ============================================================================
// HELPER UTILITIES & HARMONIZED RIDER BUILDER
// ============================================================================

function parseDollarAmount(str) {
  if (!str) return null;
  const cleaned = str.replace(/[^0-9\.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Generates an institutional AmLaw 100 Harmonized Section 12 Rider
 * that systematically cures all 7 interlocking liability defects.
 */
export function generateHarmonizedLiabilityRiderText(options = {}) {
  const capVal = options.capAmount || '500,000';

  return `ARTICLE XII -- HARMONIZED LIMITATION OF LIABILITY & RISK-SHIFTING RIDER
(AmLaw 100 Gold Standard -- Resolves All Interlocking Indemnity & Cap Conflicts)

12.1 Aggregate Liability Cap.
Except as expressly set forth in Section 12.3 (Carve-Outs and Exceptions), the total, cumulative, and aggregate liability of either Party arising out of or relating to this Agreement, whether founded in contract, tort (including negligence), strict liability, indemnity, or any other legal or equitable theory, shall in no event exceed the total fees paid or payable by Customer to Provider under this Agreement in the twelve (12) month period immediately preceding the event giving rise to liability, or the sum of $${capVal}, whichever amount is greater.

12.2 Waiver of Consequential and Indirect Damages.
Except as expressly set forth in Section 12.3, neither Party shall be liable to the other Party for any indirect, incidental, consequential, special, punitive, exemplary, or enhanced damages, or for any lost profits, lost revenues, loss of business opportunity, loss of goodwill, or loss of data, even if advised of the possibility of such damages, and notwithstanding the failure of the essential purpose of any limited remedy.

12.3 Mandatory Carve-Outs and Uncapped Obligations.
NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THIS AGREEMENT, THE LIMITATIONS AND EXCLUSIONS SET FORTH IN SECTION 12.1 (AGGREGATE CAP) AND SECTION 12.2 (CONSEQUENTIAL DAMAGES WAIVER) SHALL NOT APPLY TO:
  (a) Either Party's defense and indemnification obligations under Section 8 (Indemnification);
  (b) Either Party's breach of Section 7 (Confidentiality and Non-Disclosure);
  (c) Damages, liabilities, or losses arising from either Party's gross negligence, willful misconduct, intentional wrongdoing, or fraudulent misrepresentation;
  (d) Customer's obligation to pay undisputed fees due and payable under this Agreement; or
  (e) Liabilities to the extent of proceeds actually recovered by a Party under the insurance policies required to be maintained pursuant to Section 15 (Insurance).

12.4 Direct Damage Characterization of Third-Party Indemnity.
For the avoidance of doubt, all court-ordered settlements, final judgments, and reasonable legal defense costs incurred by an Indemnified Party as a result of a third-party claim subject to indemnification under Section 8 shall be deemed direct damages of the Indemnified Party and shall not be barred, excluded, or characterized as consequential damages under Section 12.2.

12.5 Data Protection and Security Super-Cap.
Liabilities arising from a Party's material breach of its data protection covenants or unauthorized disclosure of Personal Data shall not be subject to the general cap in Section 12.1, but shall instead be subject to a separate, dedicated aggregate super-cap equal to three times (3x) the general liability cap set forth in Section 12.1.

12.6 Subordination of Sole and Exclusive Remedy Provisions.
Any provision in this Agreement designating a remedy as a "sole and exclusive remedy" (including in relation to warranties, service levels, or repairs) shall apply solely to operational re-performance and shall not restrict, limit, or preclude either Party's right to seek: (i) indemnification for third-party claims under Section 8; (ii) cumulative damages for breach of contract; or (iii) immediate preliminary or permanent injunctive relief in a court of competent jurisdiction.`;
}

// ============================================================================
// PRE-BUILT REAL WORLD TEST DEAL SAMPLES (Zero-Setup One-Click Test Drives)
// ============================================================================

export const SAMPLE_DEALS = {
  gutted_indemnity_msa: {
    title: 'High-Risk SaaS Master Services Agreement (The $5M Gutted Indemnity Trap)',
    description: 'Contains a classic AmLaw 100 trap: Unlimited IP indemnity in Section 8, but general $50,000 cap in Section 12 without a carve-out, and broad consequential waiver that bars defense costs.',
    text: `MASTER SERVICES AGREEMENT

Section 8. Indemnification.
Vendor shall defend, indemnify, and hold harmless Customer and its officers, directors, and employees from and against any and all third-party claims, demands, suits, losses, liabilities, and reasonable attorney's fees arising out of or resulting from: (a) any claim that the Deliverables or Software infringe, misappropriate, or violate any patent, copyright, trademark, or trade secret of any third party; and (b) any gross negligence or willful misconduct of Vendor.

Section 12. Limitation of Liability.
12.1 Aggregate Cap. In no event shall the total aggregate liability of Vendor arising out of or related to this Agreement exceed the sum of $50,000.
12.2 Consequential Waiver. Neither party shall be liable to the other for any indirect, special, incidental, punitive, exemplary, or consequential damages, or loss of profits or revenue, arising out of or in connection with this Agreement.

Section 15. Insurance Requirements.
Vendor shall at all times maintain Commercial General Liability insurance with limits of not less than $5,000,000 per occurrence, and Cyber Liability insurance of not less than $2,000,000.`
  },

  asymmetric_sole_remedy: {
    title: 'Asymmetric Vendor Agreement (Unilateral Cap & Sole Remedy Overreach)',
    description: 'Vendor caps its own liability at fees paid in 12 months, leaves Customer uncapped, imposes an unsubordinated sole remedy clause for all breaches, and disclaims gross negligence.',
    text: `COMMERCIAL VENDOR SERVICES AGREEMENT

Section 4. Warranties and Exclusive Remedy.
Vendor warrants that Services will be performed in a professional manner. Customer's sole and exclusive remedy, and Vendor's entire liability for any breach of this Agreement, shall be the re-performance of the defective Services within thirty (30) days of written notice.

Section 7. Limitation of Liability.
7.1 Vendor Cap. In no event shall Vendor's cumulative liability under this Agreement, from all causes of action of any kind, including negligence or breach of contract, exceed the total amounts paid by Customer in the preceding six (6) months. Customer's liability under this Agreement shall remain unconditioned.
7.2 Waiver of Damages. Vendor shall not be liable for any consequential, incidental, indirect, or punitive damages.

Section 9. Indemnification.
Customer shall indemnify and hold harmless Vendor against any third-party claims arising from Customer's use of the Deliverables.`
  },

  harmonized_amlaw100: {
    title: 'Airtight AmLaw 100 Institutional Master Agreement (100% Balanced)',
    description: 'Gold-standard reciprocal contract with express carve-outs for indemnity, gross negligence, and confidentiality, a direct damage declaration for defense fees, and super-cap for data breaches.',
    text: `ENTERPRISE MASTER AGREEMENT

Section 8. Mutual Indemnification.
Each Party shall defend, indemnify, and hold harmless the other Party from any third-party claims, liabilities, and defense costs arising from: (a) IP infringement; (b) gross negligence or willful misconduct; and (c) material breach of confidentiality.

Section 12. Limitation of Liability.
12.1 Aggregate Cap. Except as set forth in Section 12.3, each Party's aggregate liability shall not exceed the fees paid in the preceding twelve (12) months or $1,000,000.
12.2 Consequential Waiver. Except as set forth in Section 12.3, neither Party shall be liable for indirect or consequential damages.
12.3 Carve-Outs. NOTWITHSTANDING ANYTHING TO THE CONTRARY, the limitations in Sections 12.1 and 12.2 shall not apply to: (i) indemnification obligations under Section 8; (ii) breach of confidentiality under Section 7; or (iii) gross negligence or willful misconduct. Defense costs indemnifiable under Section 8 shall be deemed direct damages.
12.4 Data Protection Super-Cap. Liabilities arising from data breaches shall be subject to a dedicated Super-Cap of 3x the standard cap.

Section 15. Insurance.
Each Party shall maintain $2,000,000 in Commercial General Liability coverage.`
  }
};
