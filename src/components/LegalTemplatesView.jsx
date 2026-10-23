import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Copy, Check, FileDown, 
  Sparkles, ArrowRight, RefreshCw, CheckCircle2,
  ShieldCheck, Scale, FileText,
  ChevronDown, ChevronUp, SlidersHorizontal, Lock
} from 'lucide-react';
import { LEGAL_TEMPLATES, TEMPLATE_CATEGORIES, compileTemplateText } from '../utils/legalTemplatesVault';
import { downloadRedactedPDF } from '../utils/redactedPdfGenerator';
import { downloadContractDOCX } from '../utils/docxExportEngine';

const STATUTORY_GUIDANCE_MAP = {
  commercial_land_psa: {
    badge: 'FIRPTA (IRC § 1445) & ALTA',
    statuteName: 'FIRPTA IRC § 1445 Withholding & Phase I Environmental',
    summary: 'Foreign Investment in Real Property Tax Act requires 15% gross withholding unless Seller signs a Non-Foreign Certification under penalty of perjury. Environmental due diligence (Phase I/II ESA) and ALTA Title review are fully integrated.',
    counselAdvisory: 'Calibrate closing timelines, earnest money escrow release terms, and state title search periods to suit your deal.',
  },
  residential_purchase: {
    badge: 'Lead Paint (42 U.S.C. § 4852d)',
    statuteName: 'Residential Lead-Based Paint Hazard Reduction Act',
    summary: 'Federally required for residential housing constructed before 1978. Incorporates mandatory EPA booklet disclosure, property condition disclosures, and a 10-day risk assessment window.',
    counselAdvisory: 'Attach local state real estate disclosure forms and customize radon/home inspection contingency periods as negotiated.',
  },
  commercial_loi: {
    badge: 'Binding Exclusivity Covenant',
    statuteName: 'Binding No-Shop Exclusivity vs. Non-Binding Commercial Intent',
    summary: 'Delineates non-binding economic terms from strictly binding exclusivity (no-shop) and confidentiality covenants enforceable during the diligence period.',
    counselAdvisory: 'Adjust exclusivity duration (typically 30–60 days) and diligence parameters prior to circulation.',
  },
  nnn_lease: {
    badge: 'Absolute Net & CAM Prorations',
    statuteName: 'Commercial Triple Net (NNN) Real Property Principles',
    summary: 'Tenant covenants to bear Base Rent plus 100% of Property Taxes, Hazard Insurance, and Common Area Maintenance (CAM). Express CAM exclusions protect against Landlord capital improvements.',
    counselAdvisory: 'Review CAM reconciliation caps, initial base year expenses, and tenant alteration thresholds before execution.',
  },
  asset_purchase_apa: {
    badge: 'SEC EDGAR Model APA',
    statuteName: 'Delaware Corporate Asset Purchase & Working Capital Escrow',
    summary: 'Strict delineation of Acquired Assets vs. Excluded Liabilities, Indemnification Escrow Holdback, Non-Compete covenants, and post-closing Working Capital reconciliation.',
    counselAdvisory: 'Tailor disclosure schedules, basket thresholds, indemnity caps, and reps & warranties survival periods to transaction specifics.',
  },
  llc_operating: {
    badge: 'Delaware LLC Act & IRC § 704(b)',
    statuteName: 'Delaware Limited Liability Company Act (6 Del. C. § 18)',
    summary: 'Comprehensive capital account maintenance under IRC § 704(b), pass-through tax treatment, Manager-Managed fiduciary authority, and Right of First Refusal (ROFR) transfer restrictions.',
    counselAdvisory: 'Customize membership units, voting majorities, tax distribution cadences, and buy-sell triggers with corporate counsel.',
  },
  msa_tech: {
    badge: 'Work Made for Hire + Present IP Assignment',
    statuteName: 'U.S. Copyright Act (17 U.S.C. § 101) & Assignment Rule',
    summary: 'Features SOW framework, mutual confidentiality, service level commitments, and explicit present assignment ("hereby unconditionally assigns") to guarantee undivided IP title.',
    counselAdvisory: 'Adjust liability caps, warranty periods, and acceptance testing windows to align with specific delivery scopes.',
  },
  mutual_nda: {
    badge: '18 U.S.C. § 1833 DTSA Safe Harbor',
    statuteName: 'Defend Trade Secrets Act Whistleblower Immunity',
    summary: 'Mandatory statutory immunity disclosure under 18 U.S.C. § 1833 for confidential government reports, preserving federal punitive damages and attorney fee recoveries.',
    counselAdvisory: 'Select 2-year or 5-year confidentiality duration based on the proprietary sensitivity of technical data.',
  },
  independent_contractor: {
    badge: '1099 Classification & IP Assignment',
    statuteName: 'IRS Independent Contractor Guidelines & 17 U.S.C. § 101',
    summary: 'Affirms non-employee status, complete lack of benefits entitlement, and an unconditional assignment of all inventions, code, and deliverables with power-of-attorney execution.',
    counselAdvisory: 'Calibrate state-specific independent contractor tests (e.g., California AB 5 ABC test) if operating in regulated jurisdictions.',
  },
  executive_employment: {
    badge: 'IRC § 409A Compliance',
    statuteName: 'Internal Revenue Code Section 409A Deferred Compensation',
    summary: 'Severance triggers, bonus plans, and post-termination payments are structured to prevent the 20% federal excise tax penalty under IRC § 409A, with clear Cause vs. Good Reason definitions.',
    counselAdvisory: 'Refine executive equity grants, non-solicitation durations, and golden parachute thresholds with compensation counsel.',
  },
  promissory_note_secured: {
    badge: 'UCC Article 9 & UCC-1 Perfection',
    statuteName: 'Uniform Commercial Code Article 9 Security Agreement',
    summary: 'Secures commercial debt with an explicit security interest grant under UCC § 9-203, authorization to file Form UCC-1 with the Secretary of State, and default acceleration.',
    counselAdvisory: 'Verify collateral descriptions with lender counsel and coordinate UCC-1 financing statement filing in debtor state of formation.',
  },
  settlement_release: {
    badge: 'Cal. Civ. Code § 1542 Waiver',
    statuteName: 'California Civil Code § 1542 Statutory Waiver & Dismissal',
    summary: 'Capitalized statutory waiver of unknown claims under Cal. Civ. Code § 1542, dismissal of pending litigation with prejudice, and mutual non-disparagement covenants.',
    counselAdvisory: 'Ensure mutual release language covers all intended parties and coordinate filing of joint stipulation for dismissal with the court.',
  },
};

export default function LegalTemplatesView({ 
  onSendToAudit,
  isDemoMode = false,
  onTriggerUpgrade
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateValues, setTemplateValues] = useState({});
  const [copiedContract, setCopiedContract] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [showStatutoryGuide, setShowStatutoryGuide] = useState(false);

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
    const initialVals = {};
    (tpl.variables || []).forEach(v => {
      initialVals[v.key] = v.defaultVal || '';
    });
    setTemplateValues(initialVals);
  };

  const handleVariableChange = (key, val) => {
    setTemplateValues(prev => ({ ...prev, [key]: val }));
  };

  // Live compiled text
  const compiledText = useMemo(() => {
    if (!selectedTemplate) return '';
    return compileTemplateText(selectedTemplate, templateValues);
  }, [selectedTemplate, templateValues]);

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
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTemplateId(null)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Catalog
            </button>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{selectedTemplate.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AmLaw 100 Standard
                </span>
                {currentStatute?.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {currentStatute.badge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {selectedTemplate.jurisdiction}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Word DOCX Download Button */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Template Word DOCX export requires an active license.')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                title="Unlock Word (.docx) export with lifetime license"
              >
                <Lock size={13} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Unlock Word (.docx)</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadDocx}
                disabled={isGeneratingDocx}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600/90 hover:bg-blue-500 text-white border border-blue-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.25)] disabled:opacity-50"
                title="Download fully editable Microsoft Word document (.docx)"
              >
                {isGeneratingDocx ? <RefreshCw className="animate-spin" size={14} /> : <FileText size={14} />}
                <span>{isGeneratingDocx ? 'Exporting Word...' : 'Download Word (.docx)'}</span>
              </button>
            )}

            {/* Legal PDF Download Button */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Legal PDF download requires an active license.')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group"
                title="Unlock PDF export with lifetime license"
              >
                <Lock size={13} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Unlock PDF</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isGeneratingPdf ? <RefreshCw className="animate-spin" size={14} /> : <FileDown size={14} />}
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Legal PDF'}</span>
              </button>
            )}

            {/* Copy Full Agreement */}
            {isDemoMode ? (
              <button
                onClick={() => onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Full template clipboard copying requires an active license.')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-400 border border-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Unlock copying with lifetime license"
              >
                <Lock size={13} className="text-amber-400" />
                <span>Copy (Locked)</span>
              </button>
            ) : (
              <button
                onClick={handleCopyText}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedContract ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedContract ? 'Copied to Clipboard! ✓' : 'Copy Text'}</span>
              </button>
            )}

            {/* Audit in ContractGuard */}
            <button
              onClick={() => onSendToAudit && onSendToAudit(compiledText, selectedTemplate.title)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{isDemoMode ? 'Audit Preview in Studio →' : 'Audit in ContractGuard →'}</span>
            </button>
          </div>
        </div>

        {/* Statutory Context Alert Banner */}
        {currentStatute && (
          <div className="px-4 py-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3 text-xs leading-relaxed">
            <Scale size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 font-bold text-cyan-200">
                <span>Statutory Enforceability Baseline: {currentStatute.statuteName}</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                  AmLaw 100 Calibrated
                </span>
              </div>
              <p className="text-zinc-300 text-[11.5px] mt-0.5">{currentStatute.summary}</p>
            </div>
          </div>
        )}

        {/* Split Screen Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Column: Quick-Fill Variables Form */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl liquid-glass-strong border border-white/5 p-4 overflow-y-auto custom-scrollbar">
            <div className="mb-4 pb-3 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Dynamic Deal Parameters</span>
                <span className={`text-[11px] font-mono ${isDemoMode ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {isDemoMode ? '🔒 Locked (Preview Mode)' : `${selectedTemplate.variables?.length || 0} Configurable Fields`}
                </span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {isDemoMode 
                  ? 'Variable customization is locked in demo mode. You can inspect all structural parameters below.'
                  : 'Customize party names, purchase considerations, dates, and governing jurisdiction below. Changes compile into the agreement in real-time.'}
              </p>
            </div>

            {isDemoMode && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs">
                <Lock size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">Template Customization Locked</div>
                  <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                    You can view the full agreement structure and clauses. To edit variables and download editable Word DOCX files, activate your lifetime license.
                  </p>
                  <button
                    onClick={() => onTriggerUpgrade && onTriggerUpgrade('export')}
                    className="mt-2 px-3 py-1 rounded-lg bg-amber-400 text-black text-[11px] font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    Unlock Full Templates ($199 / $299) →
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3.5 flex-1 pr-1">
              {(selectedTemplate.variables || []).map(v => (
                <div key={v.key} className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase font-semibold text-zinc-400 flex items-center justify-between">
                    <span>{v.label}</span>
                    {isDemoMode && <Lock size={10} className="text-amber-400/80" />}
                  </label>
                  <input
                    type="text"
                    value={templateValues[v.key] ?? ''}
                    readOnly={isDemoMode}
                    disabled={isDemoMode}
                    onChange={(e) => !isDemoMode && handleVariableChange(v.key, e.target.value)}
                    placeholder={v.defaultVal}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none transition-all ${
                      isDemoMode 
                        ? 'bg-black/40 border-zinc-800/80 text-zinc-400 cursor-not-allowed opacity-80' 
                        : 'bg-black/60 border-zinc-800 focus:border-cyan-500 text-white placeholder-zinc-600'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Empowering Guidance Callout */}
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11.5px] text-zinc-300 flex items-start gap-2.5 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-700/60">
              <SlidersHorizontal size={15} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-semibold">Institutional Standard: </span>
                <span>{isDemoMode 
                  ? 'This master draft adheres to Delaware corporate law and standard AmLaw 100 practice.'
                  : 'You can edit all variables above, download the agreement in Word (.docx) to insert bespoke transaction covenants, or send directly to ContractGuard to audit for hidden liability gaps.'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Compiled Legal Document Preview */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                {isDemoMode ? <Lock size={13} className="text-amber-400" /> : <CheckCircle2 size={13} className="text-emerald-400" />}
                {isDemoMode ? 'PREVIEW MODE · FULL CONTRACT TEXT (READ-ONLY)' : 'COMPILED CONTRACT PREVIEW (READY FOR EXECUTION & REDLINING)'}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {compiledText.split(/\s+/).filter(Boolean).length} Words
              </span>
            </div>

            <div className="flex-1 bg-black/50 p-6 text-sm font-legal leading-relaxed text-zinc-200 overflow-y-auto custom-scrollbar select-text">
              <pre className="whitespace-pre-wrap font-legal text-[13.5px] leading-relaxed text-zinc-200">
                {compiledText}
              </pre>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between gap-3 leading-relaxed">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Standard AmLaw 100 model. Download as Word (.docx) to customize freely with counsel before execution.</span>
              </div>
              <button
                onClick={() => isDemoMode ? (onTriggerUpgrade ? onTriggerUpgrade('export') : alert('Template Word DOCX export requires an active license.')) : handleDownloadDocx()}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {isDemoMode && <Lock size={12} className="text-amber-400" />}
                <span>{isDemoMode ? 'Unlock .docx' : 'Export .docx'}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise: render Template Catalog & Selection Gallery
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-5 font-ui">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <BookOpen className="text-emerald-400" size={24} />
            <span>AmLaw 100 Legal Drafting Vault</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              U.S. Commercial Law
            </span>
          </h2>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            Pre-assembled, battle-tested institutional contract models complying with Delaware General Corporation Law, the Uniform Commercial Code (UCC), FIRPTA, and American commercial jurisprudence.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowStatutoryGuide(!showStatutoryGuide)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Scale size={14} />
            <span>{showStatutoryGuide ? 'Hide Statutory Guide' : 'Statutory & Compliance Guide'}</span>
            {showStatutoryGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {LEGAL_TEMPLATES.length} Institutional Models
          </span>
        </div>
      </div>

      {/* Authoritative Drafting & Customization Workbench Banner (Empowering tone, zero diminishing language) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-cyan-950/30 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldCheck size={19} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cyan-200 uppercase tracking-wide text-[11.5px]">
                Institutional Drafting Workbench & Transaction Controls
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                Word (.docx) + PDF Export
              </span>
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed">
              Customize dynamic deal variables, insert bespoke covenants, and tailor every agreement to your exact transaction structure. Download directly in <strong className="text-white">Microsoft Word (.docx)</strong> format for collaborative team redlining, or execute an instant in-RAM forensic audit in ContractGuard to catch broken targets and financial discrepancies prior to execution.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Statutory Compliance Guide (FIRPTA, Lead Paint, DTSA, 409A, UCC, § 1542) */}
      {showStatutoryGuide && (
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Scale size={18} />
              <span>Core U.S. Statutory Mandates & Drafting Rules (Counsel Reference)</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">AmLaw 100 Standards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase">
                FIRPTA (IRC § 1445)
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Applies to purchasers of U.S. real property interests from foreign sellers. Contractual notice alone is insufficient; buyer must obtain an executed Non-Foreign Affidavit or withhold 15% of gross sales price via IRS Form 8288.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
                Lead Paint (42 U.S.C. § 4852d)
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Mandatory for residential purchase or lease of target housing built before 1978. Requires EPA pamphlet disclosure, known lead report handover, and a 10-day risk assessment window before contract execution.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                DTSA Whistleblower (18 U.S.C. § 1833)
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Every trade secret confidentiality agreement must provide statutory whistleblower immunity notice for confidential disclosures to government officials. Omission eliminates federal punitive damages and attorney fee recoveries.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-purple-400 uppercase">
                Work-Made-for-Hire Assignment
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Labeling contractor deliverables "Work Made for Hire" under 17 U.S.C. § 101 is legally inadequate for most technology consultants. An express present assignment ("hereby unconditionally assigns all right, title, and interest") is mandatory.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-mono font-bold text-rose-400 uppercase">
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl liquid-glass border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
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
            className="w-full bg-black/60 border border-zinc-700 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 outline-none transition-all"
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
              className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tpl.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 rounded font-bold">
                      .DOCX + PDF
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {tpl.variables?.length || 0} Dynamic Fields
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                  {tpl.summary}
                </p>

                {statute?.badge && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-mono text-cyan-400">
                    <Scale size={12} className="shrink-0" />
                    <span className="truncate">{statute.badge}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  {tpl.jurisdiction}
                </span>
                <button
                  onClick={() => handleOpenTemplate(tpl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    isDemoMode
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  }`}
                >
                  {isDemoMode && <Lock size={12} className="text-amber-400" />}
                  <span>{isDemoMode ? 'Preview Agreement' : 'Customize & Generate'}</span>
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
