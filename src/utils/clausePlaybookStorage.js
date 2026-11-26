/**
 * Nexus ContractGuard Enterprise — Personal Attorney Clause Playbook Storage
 * 100% Client-Side Local Persistence (localStorage, Zero Network Calls).
 * Allows attorneys and commercial contractors to maintain firm-approved fallback clauses
 * and copy or insert them daily during contract reviews.
 */

const PLAYBOOK_STORAGE_KEY = 'contractguard_clause_playbook_v1';

export const DEFAULT_PLAYBOOK_CLAUSES = [
  {
    id: 'pb-cap-carveout',
    category: 'Liability',
    title: 'Mutual 12-Month Fee Cap + Standard Carve-Outs',
    stance: 'Balanced / Protective',
    clauseText: `Limitation of Liability. EXCEPT FOR INDEMNIFICATION OBLIGATIONS FOR THIRD-PARTY CLAIMS, BREACHES OF CONFIDENTIALITY, GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR FRAUD (EACH OF WHICH SHALL REMAIN UNCAPPED AND EXEMPT FROM CONSEQUENTIAL EXCLUSIONS), NEITHER PARTY'S AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL EXCEED THE TOTAL FEES PAID OR PAYABLE DURING THE TWELVE (12) MONTHS PRECEDING THE CLAIM. Reasonable defense fees incurred under indemnification shall be deemed direct damages.`,
    whenToUse: 'Use whenever an opposing draft imposes a blanket cap without indemnity carve-outs or omits a cap completely.'
  },
  {
    id: 'pb-cure-period',
    category: 'Termination',
    title: '15-Day Written Notice & Cure Shield',
    stance: 'Vendor & Buyer Safe',
    clauseText: `Termination for Cause; Cure Period. Either Party may terminate this Agreement upon written notice if the other Party commits a material breach that remains uncured for fifteen (15) calendar days (or five (5) business days for undisputed payment defaults) following receipt of written notice detailing the breach.`,
    whenToUse: 'Prevents sudden hair-trigger termination for minor operational hiccups.'
  },
  {
    id: 'pb-ai-ban',
    category: 'Data & AI',
    title: 'Zero AI / ML Training Prohibition (ABA Rule 1.6)',
    stance: 'Buyer / Client Protection',
    clauseText: `AI & Data Restriction. Service Provider shall hold all Client Data in strict confidence and shall never use, disclose, or ingest Client Data, deliverables, or contract terms to train, fine-tune, or improve artificial intelligence or machine learning models.`,
    whenToUse: 'Mandatory for SaaS, consulting, or legal vendor contracts processing client or proprietary data.'
  },
  {
    id: 'pb-renewal-optout',
    category: 'Commercial',
    title: 'No Silent Auto-Renewal (Month-to-Month Conversion)',
    stance: 'Buyer Protection',
    clauseText: `Term & Renewal. Following the Initial Term, this Agreement shall not automatically renew for successive annual periods; any continuation shall proceed on a month-to-month basis at the same rates, terminable by either Party upon thirty (30) days written notice without penalty.`,
    whenToUse: 'Replaces rigid 60-90 day auto-renewal lock-in clauses in SaaS and service agreements.'
  },
  {
    id: 'pb-url-freeze',
    category: 'Boilerplate',
    title: 'Anti-Unilateral Online Terms Modification',
    stance: 'Buyer / Contractor Safe',
    clauseText: `Order of Precedence; No Unilateral Amendments. Any terms referenced via URL or posted online shall be subordinate to the executed text of this Agreement, and no modification to online policies shall reduce either Party's rights or increase fees without signed written consent.`,
    whenToUse: 'Neutralizes vendor hyperlinks that reserve the right to change pricing or privacy rules at any time.'
  },
  {
    id: 'pb-ip-present',
    category: 'Intellectual Property',
    title: 'Present IP Assignment + Pre-Existing IP Retention',
    stance: 'Client & Vendor Balanced',
    clauseText: `Intellectual Property Rights. Upon full payment of applicable fees, Provider hereby irrevocably assigns all right, title, and interest in custom Deliverables created exclusively for Client, excluding Provider's Pre-Existing IP (tools, libraries, and methodologies developed independently), for which Provider grants Client a perpetual, royalty-free license solely as embedded in the Deliverables.`,
    whenToUse: 'Fixes broken work-for-hire clauses while protecting contractor background tools.'
  }
];

export function loadPlaybookClauses() {
  if (typeof localStorage === 'undefined') return [...DEFAULT_PLAYBOOK_CLAUSES];
  try {
    const raw = localStorage.getItem(PLAYBOOK_STORAGE_KEY);
    if (!raw) return [...DEFAULT_PLAYBOOK_CLAUSES];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [...DEFAULT_PLAYBOOK_CLAUSES];
  } catch {
    return [...DEFAULT_PLAYBOOK_CLAUSES];
  }
}

export function savePlaybookClauses(clauses) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PLAYBOOK_STORAGE_KEY, JSON.stringify(clauses));
  }
  return clauses;
}

export function addOrUpdatePlaybookClause(clause) {
  const existing = loadPlaybookClauses();
  const entry = {
    id: clause.id || `pb-custom-${Date.now()}`,
    category: (clause.category || 'Custom').trim(),
    title: (clause.title || 'Untitled Fallback Clause').trim(),
    stance: (clause.stance || 'Firm Approved').trim(),
    clauseText: (clause.clauseText || '').trim(),
    whenToUse: (clause.whenToUse || 'Custom fallback clause').trim()
  };
  const idx = existing.findIndex(c => c.id === entry.id);
  const next = idx >= 0
    ? existing.map((c, i) => (i === idx ? entry : c))
    : [entry, ...existing];
  savePlaybookClauses(next);
  return next;
}

export function deletePlaybookClause(id) {
  const existing = loadPlaybookClauses();
  const next = existing.filter(c => c.id !== id);
  savePlaybookClauses(next);
  return next;
}

export function resetPlaybookDefaults() {
  return savePlaybookClauses([...DEFAULT_PLAYBOOK_CLAUSES]);
}
