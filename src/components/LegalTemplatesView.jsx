import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Copy, Check, FileDown, 
  Sparkles, ArrowRight, RefreshCw, CheckCircle2,
  ShieldCheck, Scale, FileText,
  ChevronDown, ChevronUp, SlidersHorizontal, Lock, HelpCircle,
  MapPin, X, Info, Building2, AlertTriangle
} from 'lucide-react';
import { LEGAL_TEMPLATES, TEMPLATE_CATEGORIES, compileTemplateText, STATE_SPECIFIC_RIDERS } from '../utils/legalTemplatesVault';
import { downloadRedactedPDF } from '../utils/redactedPdfGenerator';
import { downloadContractDOCX } from '../utils/docxExportEngine';

const STATUTORY_GUIDANCE_MAP = {
  commercial_land_psa: {
    badge: 'FIRPTA (IRC § 1445) & ALTA',
    statuteName: 'FIRPTA IRC § 1445 Withholding & Phase I Environmental',
    summary: 'Foreign Investment in Real Property Tax Act requires 15% gross withholding unless Seller signs a Non-Foreign Affidavit under penalty of perjury. Environmental due diligence (Phase I/II) and ALTA Title review are fully integrated.',
    counselAdvisory: 'Calibrate closing timelines, earnest money escrow release terms, and state title search periods to suit your deal.',
  },
  residential_real_estate_contract: {
    badge: 'Lead Paint (42 U.S.C. § 4852d)',
    statuteName: 'Residential Lead-Based Paint Hazard Reduction Act',
    summary: 'Federally mandated for residential housing constructed prior to 1978. Incorporates federal lead-based paint disclosure under 42 U.S.C. § 4852d, financing contingency, and physical inspection rights.',
    counselAdvisory: 'Attach local state real estate disclosure forms and customize radon/home inspection contingency periods as negotiated.',
  },
  commercial_real_estate_loi: {
    badge: 'Binding Exclusivity Covenant',
    statuteName: 'Binding No-Shop Exclusivity vs. Non-Binding Commercial Intent',
    summary: 'Delineates non-binding economic terms from strictly binding exclusivity (no-shop) and confidentiality covenants enforceable during the diligence period.',
    counselAdvisory: 'Adjust exclusivity duration (typically 30–60 days) and diligence parameters prior to circulation.',
  },
  commercial_triple_net_lease: {
    badge: 'Absolute Net & CAM Prorations',
    statuteName: 'Commercial Triple Net (NNN) Real Property Principles',
    summary: 'Tenant covenants to bear Base Rent plus 100% of real property taxes, casualty insurance, and Common Area Maintenance (CAM), while Landlord retains structural roof/foundation duties.',
    counselAdvisory: 'Review CAM reconciliation caps, initial base year expenses, and tenant alteration thresholds before execution.',
  },
  commercial_asset_purchase_agreement: {
    badge: 'SEC EDGAR Model APA',
    statuteName: 'Delaware Corporate Asset Purchase & IRC § 1060 Allocation',
    summary: 'Strict delineation of Purchased Assets vs. Excluded Liabilities, indemnity escrow holdback, IRS Form 8594 tax allocation, and fraud/willful misconduct carve-outs.',
    counselAdvisory: 'Tailor disclosure schedules, basket thresholds, indemnity caps, and reps & warranties survival periods to transaction specifics.',
  },
  llc_operating_agreement: {
    badge: 'Delaware LLC Act & IRC § 704(b)',
    statuteName: 'Delaware Limited Liability Company Act (6 Del. C. § 18-101)',
    summary: 'Maintains Capital Accounts under Treasury Reg. 26 C.F.R. § 1.704-1(b)(2)(iv), designates Bipartisan Budget Act partnership representative under IRC § 6223, and enforces ROFR transfer restrictions.',
    counselAdvisory: 'Customize membership percentage interests, unanimous voting thresholds, and tax distribution cadences with corporate counsel.',
  },
  master_services_agreement: {
    badge: 'Work Made for Hire + Present IP Assignment',
    statuteName: 'U.S. Copyright Act (17 U.S.C. § 101) & Assignment Rule',
    summary: 'Features SOW framework, Pre-Existing IP licensing, mutual indemnification, defense-fee direct damages deeming, and explicit present assignment of Work Product.',
    counselAdvisory: 'Adjust liability caps, warranty periods, and acceptance testing windows to align with specific delivery scopes.',
  },
  mutual_nda_trade_secrets: {
    badge: '18 U.S.C. § 1833 DTSA Safe Harbor',
    statuteName: 'Defend Trade Secrets Act Whistleblower Immunity',
    summary: 'Incorporates mandatory statutory immunity notice under 18 U.S.C. § 1833(b) for confidential disclosures to government officials or counsel, preserving federal exemplary damages and attorneys’ fees.',
    counselAdvisory: 'Select 2-year or 5-year confidentiality survival based on sensitivity of proprietary technical disclosures.',
  },
  independent_contractor_agreement: {
    badge: '1099 Classification & IP Assignment',
    statuteName: 'IRS 1099-NEC Guidelines & 17 U.S.C. § 101 Assignment',
    summary: 'Establishes independent contractor tax status, present assignment ("hereby irrevocably assigns") of Work Product, moral-rights waiver, and DTSA whistleblower compliance.',
    counselAdvisory: 'Verify state-specific independent contractor classification standards (e.g., California ABC test) before execution.',
  },
  executive_employment_agreement: {
    badge: 'IRC § 409A Compliance',
    statuteName: 'Internal Revenue Code § 409A Deferred Compensation',
    summary: 'Severance triggers, bonus eligibility, and 6-month specified-employee delay rules comply with 26 U.S.C. § 409A, alongside clear Cause vs. Good Reason separation definitions.',
    counselAdvisory: 'Refine executive equity awards, non-solicitation duration, and release execution timelines with compensation counsel.',
  },
  commercial_promissory_note: {
    badge: 'UCC Article 9 & UCC-1 Perfection',
    statuteName: 'Uniform Commercial Code Article 9 Security Agreement',
    summary: 'Secures commercial debt with a first-priority UCC Article 9 security interest grant, UCC-1 financing statement authorization, default acceleration, and usury savings clause.',
    counselAdvisory: 'Verify collateral descriptions with lender counsel and file Form UCC-1 in the debtor’s jurisdiction of formation.',
  },
  settlement_and_release_agreement: {
    badge: 'Cal. Civ. Code § 1542 Waiver',
    statuteName: 'California Civil Code § 1542 Statutory Unknown-Claims Waiver',
    summary: 'Includes statutory unknown-claims waiver under Cal. Civ. Code § 1542, strict no-admission clause, W-9 wire mechanics, mutual general release, and confidentiality.',
    counselAdvisory: 'Confirm release scope covers all affiliates/claims and attach court dismissal stipulation if litigation is pending.',
  },
};

/**
 * Formats plain legal contract text into an authentic U.S. institutional law-firm document sheet.
 * Renders centered bold captions, justified subsections with bold-only lead-ins, and 2-column signature blocks.
 */
function LegalDocumentPaper({ compiledText, title, jurisdiction }) {
  const blocks = useMemo(() => {
    const rawLines = (compiledText || '').split(/\r?\n/);
    const rendered = [];
    let inExec = false;
    let sigRows = [];

    const flushSig = (keyPrefix) => {
      if (sigRows.length === 0) return;
      const hasRight = sigRows.some(r => r[1]);
      if (hasRight) {
        rendered.push(
          <div key={`${keyPrefix}-siggrid`} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1.5 mt-5 pt-2 text-[12.5px] leading-snug text-stone-900">
            <div className="space-y-1.5">
              {sigRows.map(([left], idx) => {
                if (!left) return null;
                const isRole = /^[A-Z][A-Z0-9\s/().:-]+:$/.test(left);
                return (
                  <p key={idx} className={`${isRole ? 'font-bold tracking-wide uppercase text-[11.5px] mt-2' : ''} ${/^(By:|Name:|Title:|Date:)/i.test(left) ? 'pt-2 font-mono text-[11.5px] text-stone-800' : ''}`}>
                    {left}
                  </p>
                );
              })}
            </div>
            <div className="space-y-1.5">
              {sigRows.map(([, right], idx) => {
                if (!right) return null;
                const isRole = /^[A-Z][A-Z0-9\s/().:-]+:$/.test(right);
                return (
                  <p key={idx} className={`${isRole ? 'font-bold tracking-wide uppercase text-[11.5px] mt-2' : ''} ${/^(By:|Name:|Title:|Date:)/i.test(right) ? 'pt-2 font-mono text-[11.5px] text-stone-800' : ''}`}>
                    {right}
                  </p>
                );
              })}
            </div>
          </div>
        );
      } else {
        rendered.push(
          <div key={`${keyPrefix}-sigsingle`} className="mt-4 space-y-1.5 text-[12.5px] leading-snug text-stone-900">
            {sigRows.map(([left], idx) => {
              const isRole = /^[A-Z][A-Z0-9\s/().:-]+:$/.test(left);
              return (
                <p key={idx} className={`${isRole ? 'font-bold tracking-wide uppercase text-[11.5px] mt-3' : ''} ${/^(By:|Name:|Title:|Date:)/i.test(left) ? 'pt-1.5 font-mono text-[11.5px] text-stone-800' : ''}`}>
                  {left}
                </p>
              );
            })}
          </div>
        );
      }
      sigRows = [];
    };

    rawLines.forEach((rawLine, idx) => {
      const trimmed = rawLine.trim();
      if (!trimmed) {
        if (inExec && sigRows.length > 0 && sigRows.every(r => !r[1])) {
          const next = rawLines.slice(idx + 1).find(l => l.trim() !== '');
          if (next && /^(ACKNOWLEDGED AND AGREED|SELLER:|HOLDER:)/i.test(next.trim())) {
            flushSig(`empty-${idx}`);
          }
        }
        return;
      }

      if (/^(IN WITNESS WHEREOF|ACKNOWLEDGED AND AGREED)/i.test(trimmed)) {
        flushSig(`witness-${idx}`);
        inExec = true;
        const isAck = /^ACKNOWLEDGED AND AGREED/i.test(trimmed);
        rendered.push(
          <p key={idx} className={`mt-7 mb-2 text-[13px] leading-[1.68] text-justify ${isAck ? 'font-bold uppercase tracking-wide text-[11.5px] text-stone-900' : 'text-stone-900'}`}>
            {trimmed}
          </p>
        );
        return;
      }

      if (/^(Sincerely,|PURCHASER:|SELLER:|LANDLORD:|TENANT:|CLIENT:|FIRST PARTY:|PARTY A:|COMPANY:|EMPLOYER:|MAKER:|MEMBER 1:)/i.test(trimmed) || inExec) {
        if (!inExec && /^(Sincerely,|PURCHASER:|SELLER:)/i.test(trimmed)) {
          inExec = true;
        }
        if (/^Sincerely,/i.test(trimmed)) {
          flushSig(`sincerely-${idx}`);
          rendered.push(
            <p key={idx} className="mt-5 mb-2 text-[13px] text-stone-900">
              {trimmed}
            </p>
          );
          return;
        }
        const pairMatch = rawLine.match(/^(.+?)\s{3,}(.+)$/);
        if (pairMatch) {
          sigRows.push([pairMatch[1].trim(), pairMatch[2].trim()]);
        } else {
          sigRows.push([trimmed, '']);
        }
        return;
      }

      const isCenteredHeading = /^(RECITALS|WITNESSETH|AGREEMENT|EXHIBIT\s+[A-Z0-9]+|SCHEDULE\s+[A-Z0-9]+)$/i.test(trimmed)
        || /^(ARTICLE\s+[0-9IVXLCDM]+|ADDENDUM\s+[A-Z0-9]+)\b/i.test(trimmed);
      const isMetaHeader = /^(VIA\s+ELECTRONIC|Date:|TO:|FROM:|RE:|PRINCIPAL\s+(?:SUM|AMOUNT):|INTEREST\s+RATE:)/i.test(trimmed);
      const subsectionMatch = trimmed.match(/^([0-9]+\.[0-9]+|[A-Z]\.[0-9]+)\s+([^.]+?\.)\s*(.*)$/);
      const recitalMatch = trimmed.match(/^(WHEREAS,|NOW,\s*THEREFORE,)\s*(.*)$/);

      if (isCenteredHeading) {
        rendered.push(
          <h4 key={idx} className="text-center font-bold uppercase tracking-[0.04em] text-[12.5px] text-stone-950 mt-6 mb-2.5 border-b border-stone-300/70 pb-1">
            {trimmed}
          </h4>
        );
      } else if (recitalMatch) {
        rendered.push(
          <p key={idx} className="text-[13px] leading-[1.68] text-justify indent-7 mb-3 text-stone-900">
            <strong className="font-bold text-stone-950">{recitalMatch[1]}</strong>{' '}
            {recitalMatch[2]}
          </p>
        );
      } else if (subsectionMatch) {
        rendered.push(
          <p key={idx} className="text-[13px] leading-[1.68] text-justify indent-7 mb-3 text-stone-900">
            <strong className="font-bold text-stone-950">
              {subsectionMatch[1]} {subsectionMatch[2]}
            </strong>{' '}
            {subsectionMatch[3]}
          </p>
        );
      } else if (isMetaHeader) {
        rendered.push(
          <p key={idx} className={`text-[12.5px] leading-relaxed text-left ${/^(VIA\s+ELECTRONIC)/i.test(trimmed) ? 'font-bold tracking-wider uppercase text-[11px] mb-1' : 'font-medium text-stone-900 mb-0.5'}`}>
            {trimmed}
          </p>
        );
      } else {
        rendered.push(
          <p key={idx} className="text-[13px] leading-[1.68] text-justify mb-3 text-stone-900">
            {trimmed}
          </p>
        );
      }
    });

    flushSig('end');
    return rendered;
  }, [compiledText]);

  return (
    <div className="max-w-[760px] mx-auto bg-[#FAF9F5] text-[#141414] shadow-[0_14px_42px_rgba(0,0,0,0.55)] border border-stone-300/80 px-7 sm:px-12 py-10 font-legal selection:bg-emerald-200 selection:text-black rounded-sm">
      {/* Formal US BigLaw Header & Caption */}
      <div className="text-center pb-4 mb-6 border-b-2 border-stone-900">
        <h3 className="text-[15px] sm:text-[16px] font-bold uppercase tracking-[0.05em] text-stone-950 leading-snug">
          {title}
        </h3>
        <p className="text-[11.5px] italic text-stone-600 mt-1.5">
          Governing Jurisdiction: {jurisdiction}
        </p>
      </div>

      <div>{blocks}</div>
    </div>
  );
}

export default function LegalTemplatesView({ 
  onSendToAudit,
  isDemoMode = false,
  onTriggerUpgrade,
  onOpenGuide
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateValues, setTemplateValues] = useState({});
  const [copiedContract, setCopiedContract] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [showStatutoryGuide, setShowStatutoryGuide] = useState(false);
  const [selectedStateRider, setSelectedStateRider] = useState('general');
  const [showStateDossierModal, setShowStateDossierModal] = useState(false);

  const selectedTemplate = useMemo(() => {
    return LEGAL_TEMPLATES.find(t => t.id === selectedTemplateId) || null;
  }, [selectedTemplateId]);

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    return LEGAL_TEMPLATES.filter(tpl => {
      const matchCat = selectedCategory === 'all' || tpl.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.jurisdiction && tpl.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // When opening a template, seed default values
  const handleOpenTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setSelectedStateRider('general');
    const initialVals = {};
    (tpl.variables || []).forEach(v => {
      initialVals[v.key] = v.defaultVal || '';
    });
    setTemplateValues(initialVals);
  };

  const handleSelectStateRider = (riderId) => {
    setSelectedStateRider(riderId);
    const rider = STATE_SPECIFIC_RIDERS[riderId];
    if (rider && rider.defaults) {
      setTemplateValues(prev => ({
        ...prev,
        GOVERNING_STATE: rider.defaults.GOVERNING_STATE || prev.GOVERNING_STATE,
        COUNTY_STATE: rider.defaults.COUNTY_STATE || prev.COUNTY_STATE,
        VENUE_COUNTY: rider.defaults.VENUE_COUNTY || prev.VENUE_COUNTY,
      }));
    }
  };

  const handleVariableChange = (key, val) => {
    setTemplateValues(prev => ({ ...prev, [key]: val }));
  };

  // Live compiled text with dynamic state statutory rider
  const compiledText = useMemo(() => {
    if (!selectedTemplate) return '';
    return compileTemplateText(selectedTemplate, templateValues, selectedStateRider);
  }, [selectedTemplate, templateValues, selectedStateRider]);

  const handleCopyText = () => {
    if (!compiledText) return;
    navigator.clipboard.writeText(compiledText);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2500);
  };

  const handleDownloadPdf = async () => {
    if (!compiledText || !selectedTemplate) return;
    setIsGeneratingPdf(true);
    try {
      await downloadRedactedPDF(compiledText, {
        title: selectedTemplate.title,
        jurisdiction: selectedTemplate.jurisdiction || 'United States Commercial Law',
        isDraft: true,
        totalRedactions: 0,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    } catch (err) {
      alert('PDF generation error: ' + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!compiledText || !selectedTemplate) return;
    setIsGeneratingDocx(true);
    try {
      await downloadContractDOCX(compiledText, {
        title: selectedTemplate.title,
        jurisdiction: selectedTemplate.jurisdiction || 'United States Commercial Law',
        category: selectedTemplate.category
      });
    } catch (err) {
      alert('Word DOCX generation error: ' + err.message);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const currentStatute = selectedTemplate ? STATUTORY_GUIDANCE_MAP[selectedTemplate.id] : null;

  // If a template is actively selected: render Split-Screen Quick-Fill Editor
  if (selectedTemplate) {
    return (
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTemplateId(null)}
              className="px-2.5 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>{selectedTemplate.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AmLaw 100
                </span>
                {currentStatute?.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    {currentStatute.badge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">
                {selectedTemplate.jurisdiction}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Word DOCX Download Button */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Template Word DOCX export requires an active license.')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unlock Word (.docx) export with lifetime license"
              >
                <Lock size={13} className="text-zinc-400" />
                <span>Unlock Word (.docx)</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadDocx}
                disabled={isGeneratingDocx}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.1] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download fully editable Microsoft Word document (.docx)"
              >
                {isGeneratingDocx ? <RefreshCw className="animate-spin" size={13} /> : <FileText size={13} />}
                <span>{isGeneratingDocx ? 'Exporting Word...' : 'Download Word (.docx)'}</span>
              </button>
            )}

            {/* Legal PDF Download Button */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Legal PDF download requires an active license.')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unlock PDF export with lifetime license"
              >
                <Lock size={13} className="text-amber-400" />
                <span>Unlock PDF</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.1] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPdf ? <RefreshCw className="animate-spin" size={13} /> : <FileDown size={13} />}
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Legal PDF'}</span>
              </button>
            )}

            {/* Copy Full Agreement */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Full template clipboard copying requires an active license.')}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-400 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unlock copying with lifetime license"
              >
                <Lock size={13} className="text-amber-400" />
                <span>Copy (Locked)</span>
              </button>
            ) : (
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedContract ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedContract ? 'Copied' : 'Copy Text'}</span>
              </button>
            )}

            {/* Audit in ContractGuard */}
            <button
              onClick={() => onSendToAudit && onSendToAudit(compiledText, selectedTemplate.title)}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>{isDemoMode ? 'Audit Preview in Studio →' : 'Audit in ContractGuard →'}</span>
            </button>
          </div>
        </div>

        {/* Statutory Context Alert Banner */}
        {currentStatute && (
          <div className="px-3.5 py-2.5 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-sky-500/60 flex items-start gap-2.5 text-xs leading-relaxed">
            <Scale size={15} className="text-sky-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 font-medium text-zinc-200">
                <span>Statutory Baseline: {currentStatute.statuteName}</span>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  AmLaw 100
                </span>
              </div>
              <p className="text-zinc-400 text-[11.5px] mt-0.5">{currentStatute.summary}</p>
            </div>
          </div>
        )}

        {/* State Statutory Compliance Bar (California, Texas, New York, Florida, and 50-State Multi-Jurisdiction) */}
        {selectedTemplate.category === 'real_estate' && (
          <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono">
                  <MapPin size={12} className="text-emerald-400" />
                  <span>State Rider:</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {Object.values(STATE_SPECIFIC_RIDERS).map(rider => (
                    <button
                      key={rider.id}
                      onClick={() => handleSelectStateRider(rider.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                        selectedStateRider === rider.id
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'text-zinc-400 hover:text-zinc-200 bg-[#09090B] border border-white/[0.06]'
                      }`}
                    >
                      <span>{rider.shortName}</span>
                      {selectedStateRider === rider.id && <CheckCircle2 size={11} className="text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowStateDossierModal(true)}
                className="self-start md:self-auto px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Scale size={12} className="text-sky-400" />
                <span>50-State Statutory Dossier</span>
              </button>
            </div>

            {/* Active State Statutory Rationale Card */}
            <div className="px-3 py-2 rounded-md bg-[#09090B] border border-white/[0.06] flex items-start gap-2 text-xs">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-zinc-200 text-xs">{STATE_SPECIFIC_RIDERS[selectedStateRider]?.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {STATE_SPECIFIC_RIDERS[selectedStateRider]?.badge}
                  </span>
                </div>
                <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">
                  {STATE_SPECIFIC_RIDERS[selectedStateRider]?.legalReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Split Screen Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Column: Quick-Fill Variables Form */}
          <div className="lg:col-span-5 flex flex-col rounded-lg bg-[#111115] border border-white/[0.08] p-4 overflow-y-auto custom-scrollbar">
            <div className="mb-4 pb-3 border-b border-white/[0.06]">
              <h4 className="text-sm font-semibold text-zinc-100 flex items-center justify-between">
                <span>Deal Parameters</span>
                <span className={`text-[11px] font-mono ${isDemoMode ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {isDemoMode ? 'Preview Locked' : `${selectedTemplate.variables?.length || 0} Fields`}
                </span>
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                {isDemoMode 
                  ? 'Inspect structural parameters below. Export and editing unlock with a license.'
                  : 'Update parties, considerations, and dates below for live compilation.'}
              </p>
            </div>

            {isDemoMode && (
              <div className="mb-4 p-3 rounded-md bg-amber-500/[0.06] border border-amber-500/20 flex items-start gap-2.5 text-xs">
                <Lock size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-300">Customization Locked in Sandbox</div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    Full clause preview is active. Editing and Word (.docx) export require a license.
                  </p>
                  <button
                    onClick={() => onTriggerUpgrade && onTriggerUpgrade('export')}
                    className="mt-2 px-2.5 py-1 rounded bg-[#18181B] hover:bg-zinc-800 border border-white/[0.1] text-amber-300 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Unlock Templates ($199 / $299) →
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3 flex-1 pr-1">
              {(selectedTemplate.variables || []).map(v => (
                <div key={v.key} className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 flex items-center justify-between">
                    <span>{v.label}</span>
                    {isDemoMode && <Lock size={10} className="text-amber-400/70" />}
                  </label>
                  <input
                    type="text"
                    value={templateValues[v.key] ?? ''}
                    readOnly={isDemoMode}
                    disabled={isDemoMode}
                    onChange={(e) => !isDemoMode && handleVariableChange(v.key, e.target.value)}
                    placeholder={v.defaultVal}
                    className={`w-full border rounded-md px-3 py-1.5 text-xs font-mono outline-none transition-colors ${
                      isDemoMode 
                        ? 'bg-[#09090B] border-white/[0.06] text-zinc-500 cursor-not-allowed' 
                        : 'bg-[#09090B] border-white/[0.08] focus:border-white/[0.2] text-zinc-100 placeholder-zinc-600'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Institutional Guidance Callout */}
            <div className="mt-4 p-3 rounded-md bg-[#09090B] border border-white/[0.06] text-[11px] text-zinc-400 flex items-start gap-2 leading-relaxed">
              <SlidersHorizontal size={14} className="text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-200 font-medium">Institutional Standard: </span>
                <span>{isDemoMode 
                  ? 'Master draft aligned with Delaware corporate law and AmLaw 100 practice.'
                  : 'Edit parameters above, export to Word (.docx), or send directly into ContractGuard.'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Compiled Legal Document Paper Preview */}
          <div className="lg:col-span-7 flex flex-col rounded-lg bg-[#111115] border border-white/[0.08] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                {isDemoMode ? <Lock size={12} className="text-amber-400" /> : <CheckCircle2 size={12} className="text-emerald-400" />}
                {isDemoMode ? 'U.S. EXECUTION PREVIEW · READ-ONLY' : 'U.S. EXECUTION DRAFT · READY FOR EXPORT'}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                {compiledText.split(/\s+/).filter(Boolean).length} Words · Times Roman
              </span>
            </div>

            <div className="flex-1 bg-[#16161B] p-4 sm:p-6 overflow-y-auto custom-scrollbar select-text max-h-[680px]">
              <LegalDocumentPaper
                compiledText={compiledText}
                title={selectedTemplate.title}
                jurisdiction={selectedTemplate.jurisdiction}
              />
            </div>

            {/* Bottom Action Footer */}
            <div className="px-4 py-2.5 bg-[#09090B] border-t border-white/[0.06] text-[11px] text-zinc-400 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Standard U.S. commercial layout. Export editable Word (.docx) or Court PDF for counsel review.</span>
              </div>
              <button
                onClick={() => isDemoMode ? (onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Template Word DOCX export requires an active license.')) : handleDownloadDocx()}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-mono font-medium flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {isDemoMode && <Lock size={12} className="text-amber-400" />}
                <span>{isDemoMode ? 'Unlock .docx' : 'Export .docx'}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* State Statutory Jurisprudence & Mandatory Contract Riders Dossier Modal */}
        <StateDossierModal
          isOpen={showStateDossierModal}
          onClose={() => setShowStateDossierModal(false)}
          selectedStateRider={selectedStateRider}
          onSelectStateRider={handleSelectStateRider}
          isEditorActive={true}
        />
      </div>
    );
  }

  // Otherwise: render Template Catalog & Selection Gallery
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-5 font-ui">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#111115] border border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2.5 tracking-tight">
            <BookOpen className="text-emerald-400" size={18} />
            <span>AmLaw 100 U.S. Contract Vault</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              50-State Precedents
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5 max-w-2xl leading-relaxed">
            Pre-assembled U.S. institutional contract models calibrated for Delaware corporate law, the Uniform Commercial Code (UCC), FIRPTA, DTSA, and IRC Section 409A compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onOpenGuide && (
            <button
              onClick={() => onOpenGuide('templates')}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="How to Use Template Vault"
            >
              <HelpCircle size={13} className="text-emerald-400" />
              <span>How to Use</span>
            </button>
          )}
          <button
            onClick={() => setShowStatutoryGuide(!showStatutoryGuide)}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Scale size={13} className="text-sky-400" />
            <span>{showStatutoryGuide ? 'Hide Statutory Guide' : 'Statutory Guide'}</span>
            {showStatutoryGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            {LEGAL_TEMPLATES.length} Models
          </span>
        </div>
      </div>

      {/* Institutional Drafting Summary */}
      <div className="px-4 py-3 rounded-lg bg-[#111115] border border-white/[0.08] flex items-center gap-3 text-xs">
        <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
        <p className="text-zinc-400 leading-relaxed">
          <span className="font-medium text-zinc-200">Institutional Template Vault:</span> Customize deal parameters, export editable Word (.docx), or send directly to ContractGuard for forensic audit.
        </p>
      </div>

      {/* Expandable Statutory Compliance Guide (FIRPTA, Lead Paint, DTSA, 409A, UCC, § 1542) */}
      {showStatutoryGuide && (
        <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-zinc-100 font-semibold">
              <Scale size={15} className="text-sky-400" />
              <span>Core U.S. Statutory Mandates & Drafting Rules (Counsel Reference)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">AmLaw 100 Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono font-medium text-emerald-400 uppercase">
                FIRPTA (IRC § 1445)
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Applies to purchasers of U.S. real property interests from foreign sellers. Contractual notice alone is insufficient; buyer must obtain an executed Non-Foreign Affidavit or withhold 15% of gross sales price via IRS Form 8288.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono font-medium text-amber-400 uppercase">
                Lead Paint (42 U.S.C. § 4852d)
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Mandatory for residential purchase or lease of target housing built before 1978. Requires EPA pamphlet disclosure, known lead report handover, and a 10-day risk assessment window before contract execution.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono font-medium text-sky-400 uppercase">
                DTSA Whistleblower (18 U.S.C. § 1833)
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Every trade secret confidentiality agreement must provide statutory whistleblower immunity notice for confidential disclosures to government officials. Omission eliminates federal punitive damages and attorney fee recoveries.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono font-medium text-zinc-200 uppercase">
                Work-Made-for-Hire Assignment
              </span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Labeling contractor deliverables "Work Made for Hire" under 17 U.S.C. § 101 is legally inadequate for most technology consultants. An express present assignment ("hereby unconditionally assigns all right, title, and interest") is mandatory.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] space-y-1">
              <span className="text-[11px] font-mono font-medium text-rose-400 uppercase">
                IRC Section 409A Compliance
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Executive compensation, deferred bonuses, and termination severances must be structured with strict fixed payment timing rules to avoid catastrophic 20% federal excise tax penalties levied directly on the executive.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-blue-400 uppercase">
                UCC Article 9 & Form UCC-1
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Securing a commercial promissory note requires an explicit security interest grant under UCC § 9-203 with precise collateral descriptions, plus authorization to file Form UCC-1 with the Secretary of State for perfection.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
            <div>
              <span className="text-white font-semibold">Jurisdiction & Venue Calibration: </span>
              Templates provide standard Delaware, New York, or California choice of law. Adjust governing law dynamically to reflect actual property location and party headquarters.
            </div>
            <div className="text-emerald-400 font-mono text-[10.5px]">
              100% CC0 / SEC EDGAR Clean Precedent Architecture
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#111115] border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-1.5">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models (e.g. Land, APA, NDA)..."
            className="w-full bg-[#09090B] border border-white/[0.08] focus:border-white/[0.2] rounded-md px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {filteredTemplates.map(tpl => {
          const statute = STATUTORY_GUIDANCE_MAP[tpl.id];
          return (
            <div
              key={tpl.id}
              className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#141419] transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tpl.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded">
                      .DOCX + PDF
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {tpl.variables?.length || 0} Fields
                    </span>
                  </div>
                </div>

                <h3 className="text-[15px] font-semibold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                  {tpl.description || tpl.summary}
                </p>

                {statute?.badge && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-mono text-sky-400">
                    <Scale size={12} className="shrink-0" />
                    <span className="truncate">{statute.badge}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-500 truncate">
                  {tpl.jurisdiction}
                </span>
                <button
                  onClick={() => handleOpenTemplate(tpl)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isDemoMode
                      ? 'bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08]'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isDemoMode && <Lock size={12} className="text-amber-400" />}
                  <span>{isDemoMode ? 'Preview' : 'Customize & Draft'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * State Statutory Jurisprudence & Mandatory Contract Riders Dossier Modal
 * Explains lex loci rei sitae statutory overrides (CA, TX, NY, FL) vs 50-State multi-jurisdiction baseline.
 */
function StateDossierModal({ isOpen, onClose, selectedStateRider, onSelectStateRider, isEditorActive }) {
  const [activeTab, setActiveTab] = useState(selectedStateRider || 'california');
  const [copiedClause, setCopiedClause] = useState(false);

  if (!isOpen) return null;

  const activeRider = STATE_SPECIFIC_RIDERS[activeTab] || STATE_SPECIFIC_RIDERS.general;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2200);
  };

  const statutoryRisks = {
    california: {
      headline: 'Void Liquidated Damages & NHD Mandatory Disclosures',
      riskAnalysis: 'Under Cal. Civ. Code § 1677, a liquidated damages clause in a real property contract is legally void unless printed in at least 10-point bold type or contrasting red 8-point bold, and separately initialed by each party. Additionally, Cal. Civ. Code § 1103 mandates disclosure of seismic, wildfire, and flood hazard zones via a statutory NHD report.',
      keyStatutes: ['Cal. Civ. Code § 1671 & § 1677', 'Cal. Civ. Code § 1103 (NHD Act)', 'Cal. Civ. Code § 2079.10a (Megan’s Law)'],
      omissionPenalty: 'Liquidated damages clause declared void ab initio; Seller forfeits deposit retention and is forced to litigate actual damages before a jury.'
    },
    texas: {
      headline: 'Unilateral Statutory Rescission Right (MUD) & DTPA Treble Damages',
      riskAnalysis: 'Texas Water Code § 49.452 requires sellers of real property in a Municipal Utility District (MUD) or Water Control District to deliver statutory disclosure notices prior to contract execution. Failure to furnish this notice grants the purchaser an unconditional statutory right to terminate and rescind the contract prior to closing. Furthermore, Texas Business & Commerce Code § 17.42 requires express, conspicuous waivers signed by counsel to bar treble damages under the Deceptive Trade Practices Act.',
      keyStatutes: ['Tex. Water Code § 49.452 (MUD Notice)', 'Tex. Bus. & Com. Code § 17.42 (DTPA Waiver)', 'Tex. Prop. Code § 5.008'],
      omissionPenalty: 'Buyer holds unilateral statutory right of rescission up to closing; potential exposure to treble damages under the Texas DTPA.'
    },
    new_york: {
      headline: 'Closing Date Not Strict Deadline (Zev v. Merman) & Transfer Tax Allocation',
      riskAnalysis: 'Under established New York Court of Appeals doctrine (Zev v. Merman, 73 N.Y.2d 781), closing dates specified in contracts of sale are mere target dates. Time is NOT of the essence unless expressly designated as such or established through formal post-default written notice providing a reasonable "law day" (typically 30 days). In addition, New York State Transfer Tax (Tax Law Art. 31, Form TP-584) and NYC Real Property Transfer Tax (NYC Admin. Code § 11-2102) must be contractually apportioned to prevent closing escrow impounds.',
      keyStatutes: ['Zev v. Merman, 73 N.Y.2d 781 (TOE Doctrine)', 'NY Tax Law § 1402 (NYS TP-584 Transfer Tax)', 'NYC Admin. Code § 11-2102 (NYC-RPT)'],
      omissionPenalty: 'Non-breaching party cannot terminate contract on default date without issuing a 30-day formal TOE conversion notice; transfer tax disputes stall title closing.'
    },
    florida: {
      headline: 'Mandatory Radon Gas Notice & Ad Valorem Tax Reassessment Protection',
      riskAnalysis: 'Florida Statutes § 404.056(5) mandates that specific statutory notification language regarding radon gas be included in every contract for the sale or lease of real property. Failure to include this exact wording constitutes a violation of state administrative law. Additionally, Florida Statutes § 689.261 requires a conspicuous statutory property tax disclosure summary advising buyers that post-closing ad valorem reassessments may significantly increase property tax obligations, barring misrepresentation claims against sellers.',
      keyStatutes: ['Fla. Stat. § 404.056(5) (Radon Warning)', 'Fla. Stat. § 689.261 (Property Tax Summary)', 'Fla. Stat. § 689.25 (Psychologically Impacted Real Estate)'],
      omissionPenalty: 'Statutory non-compliance under Fla. Stat. § 404.056; exposure to buyer misrepresentation actions regarding post-sale ad valorem property tax spikes.'
    },
    general: {
      headline: 'Uniform Commercial Baseline (Restatement (Second) of Contracts § 234)',
      riskAnalysis: 'The 50-State multi-jurisdiction baseline applies the Restatement (Second) of Contracts § 234 doctrine of concurrent conditions precedent. Closing performance (conveying the deed and tendering purchase funds) are mutually dependent obligations. Neither party can place the counterparty in default without making a formal tender of its own performance. Provides AmLaw 100 corporate governance covenants, foreign entity qualification (MBCA § 15.01), ALTA title objection mechanisms, and FIRPTA compliance for Delaware, Ohio, Illinois, Georgia, North Carolina, and remaining states.',
      keyStatutes: ['Restatement (Second) of Contracts § 234', 'Model Business Corporation Act § 15.01', 'IRC § 1445 (FIRPTA Non-Foreign Affidavit)'],
      omissionPenalty: 'Premature declaration of default without tender constitutes an anticipatory repudiation breach under common law jurisprudence.'
    }
  };

  const riskInfo = statutoryRisks[activeTab] || statutoryRisks.general;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#09090B] border border-white/[0.1] rounded-xl shadow-2xl flex flex-col overflow-hidden text-zinc-200 font-ui">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#111115] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-sky-400 shrink-0">
              <Scale size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                  50-State Statutory Jurisprudence & Mandatory Contract Riders
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Lex Loci Rei Sitae
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Mandatory state statutory overrides vs. 50-State commercial baseline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Close Dossier"
          >
            <X size={16} />
          </button>
        </div>

        {/* State Tabs Selector */}
        <div className="px-5 py-2.5 bg-[#09090B] border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {Object.values(STATE_SPECIFIC_RIDERS).map(rider => (
            <button
              key={rider.id}
              onClick={() => setActiveTab(rider.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === rider.id
                  ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <MapPin size={12} className={activeTab === rider.id ? 'text-sky-400' : 'text-zinc-500'} />
              <span>{rider.shortName}</span>
              {selectedStateRider === rider.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active Draft Rider" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {/* Top State Badge & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg bg-[#111115] border border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-zinc-100">{activeRider.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                  {activeRider.statute}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{activeRider.summary}</p>
            </div>

            {isEditorActive && (
              <button
                onClick={() => {
                  onSelectStateRider(activeTab);
                  onClose();
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  selectedStateRider === activeTab
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedStateRider === activeTab ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>Active in Draft</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Apply Rider to Draft</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Grid: Legal Risk Analysis & Consequences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Why this state requires statutory calibration */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck size={15} />
                <span>Statutory Mandate & Jurisprudential Rule</span>
              </div>
              <h5 className="text-xs font-bold text-white">{riskInfo.headline}</h5>
              <p className="text-xs text-zinc-300 leading-relaxed">{riskInfo.riskAnalysis}</p>
              
              <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Primary Governing Authorities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {riskInfo.keyStatutes.map((s, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Omission Consequence & Forum Presets */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle size={15} />
                  <span>Legal Exposure if Rider is Omitted</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200 leading-relaxed">
                  {riskInfo.omissionPenalty}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs">
                <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Default Judicial Venue:</span>
                <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 font-mono text-[11px] text-zinc-300 flex items-center gap-2">
                  <Building2 size={13} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{activeRider.defaults?.VENUE_COUNTY || 'Delaware Court of Chancery'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contractual Rider Language Injected as Addendum A */}
          <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-200 font-mono">
                <FileText size={14} className="text-emerald-400" />
                <span>Addendum A Statutory Contract Clause (Live Injected Rider)</span>
              </div>
              {activeRider.riderClause && (
                <button
                  onClick={() => handleCopy(activeRider.riderClause)}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedClause ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Clause</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <pre className="p-3.5 rounded-md bg-[#09090B] border border-white/[0.06] text-[11.5px] font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar select-text">
              {activeRider.riderClause || 'No additional state-specific statutory rider is injected in the 50-State Baseline mode.'}
            </pre>
          </div>

          {/* Lex Loci Rei Sitae Jurisprudential Context Note */}
          <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/60 flex items-start gap-3 text-xs">
            <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-zinc-400 leading-relaxed text-[11.5px]">
              <span className="text-zinc-200 font-semibold">Lex Loci Rei Sitae Doctrine (Law of the Situs): </span>
              Under American commercial law, real property transfers are invariably adjudicated under the law of the state where the physical real estate is situated. While 85%–90% of contract covenants (purchase consideration, escrow mechanics, ALTA title review, CERCLA environmental review, and FIRPTA withholdings) remain identical nationwide, these 4 jurisdictions impose strict statutory wording rules that, if omitted, can invalidate remedies or grant statutory cancellation rights. For the remaining 46 states, the <strong className="text-zinc-200">50-State Multi-Jurisdiction Baseline</strong> delivers seamless enforceability under the Restatement (Second) of Contracts.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#111115] border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Calibrated to AmLaw 100 Real Estate Practice Standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 font-medium cursor-pointer transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
