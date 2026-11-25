import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2,
  Copy, Check, FileDown, RefreshCw, ArrowRight,
  Scale, FileText, Layers, Lock, Eye, Sparkles, Building2, HelpCircle
} from 'lucide-react';
import { downloadContractDOCX } from '../utils/docxExportEngine';

export default function LiabilityReconcilerHUD({
  auditResults,
  contractText,
  documentTitle = 'Commercial Agreement',
  onLoadSampleDeal,
  onApplyRiderToDraft
}) {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'clauses' | 'rider' | 'doctrine'
  const [copiedRider, setCopiedRider] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  if (!auditResults) return null;

  const {
    score = 0,
    statusBadge = '',
    rules = [],
    intel = {},
    harmonizedRider = '',
    processingTimeMs = 0
  } = auditResults;

  const handleCopyRider = () => {
    if (!harmonizedRider) return;
    navigator.clipboard.writeText(harmonizedRider);
    setCopiedRider(true);
    setTimeout(() => setCopiedRider(false), 2200);
  };

  const handleDownloadDocx = async () => {
    if (!harmonizedRider) return;
    setIsExportingDocx(true);
    try {
      await downloadContractDOCX(harmonizedRider, {
        title: 'Harmonized Limitation of Liability and Interlocking Risk Rider',
        jurisdiction: 'AmLaw 100 Institutional Standard',
        category: 'contract'
      });
    } catch (err) {
      console.error('Failed to export DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Severity styles (Restrained Institutional Palette)
  const getSeverityBadge = (status, severity) => {
    if (status === 'PASS') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/12 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
          <CheckCircle2 size={11} />
          <span>PASS</span>
        </span>
      );
    }
    if (severity === 'CRITICAL') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-500/12 text-rose-400 border border-rose-500/25 flex items-center gap-1">
          <ShieldAlert size={11} />
          <span>CRITICAL TRAP</span>
        </span>
      );
    }
    if (severity === 'HIGH') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/12 text-amber-400 border border-amber-500/25 flex items-center gap-1">
          <AlertTriangle size={11} />
          <span>HIGH EXPOSURE</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-white/10 flex items-center gap-1">
        <AlertTriangle size={11} />
        <span>WARNING</span>
      </span>
    );
  };

  const getScoreColor = () => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in mt-2 font-ui">
      {/* 1. Executive Scorecard & Actions */}
      <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center shrink-0 ${getScoreColor()}`}>
              <span className="text-2xl font-bold font-mono tabular-nums leading-none">{score}</span>
              <span className="text-[9px] uppercase font-mono tracking-wider opacity-80 mt-1">Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
                  Interlocking Liability Audit
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                  score < 50
                    ? 'bg-rose-500/12 text-rose-400 border-rose-500/25'
                    : score < 80
                    ? 'bg-amber-500/12 text-amber-400 border-amber-500/25'
                    : 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25'
                }`}>
                  {statusBadge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 tabular-nums">
                {rules.length} liability vectors analyzed in {processingTimeMs}ms locally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleCopyRider}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedRider ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-zinc-400" />
                  <span>Copy Rider</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExportingDocx ? <RefreshCw className="animate-spin" size={14} /> : <FileDown size={14} />}
              <span>Word Rider (.docx)</span>
            </button>
          </div>
        </div>

        {/* Quiet Sample Presets */}
        {onLoadSampleDeal && (
          <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-zinc-500">Test Presets:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onLoadSampleDeal('gutted_indemnity_msa')}
                className="px-2.5 py-1 rounded-md text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.07] transition-colors cursor-pointer"
              >
                Gutted Indemnity ($5M Trap)
              </button>
              <button
                type="button"
                onClick={() => onLoadSampleDeal('asymmetric_sole_remedy')}
                className="px-2.5 py-1 rounded-md text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.07] transition-colors cursor-pointer"
              >
                Asymmetric Vendor Deal
              </button>
              <button
                type="button"
                onClick={() => onLoadSampleDeal('harmonized_amlaw100')}
                className="px-2.5 py-1 rounded-md text-xs bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.07] transition-colors cursor-pointer"
              >
                Balanced AmLaw 100
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Clean Underline Tab Navigation */}
      <div className="flex items-center border-b border-white/[0.08] gap-1 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'matrix' ? 'border-emerald-500 text-white font-medium' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers size={13} />
          <span>Matrix</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums bg-white/[0.06] text-zinc-300">
            {rules.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clauses')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'clauses' ? 'border-emerald-500 text-white font-medium' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText size={13} />
          <span>Extracted Clauses</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums bg-white/[0.06] text-zinc-300">
            {(intel.indemnity?.matchCount || 0) + (intel.liabilityCap?.matchCount || 0)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rider')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'rider' ? 'border-emerald-500 text-white font-medium' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={13} />
          <span>Harmonized Rider</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctrine')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'doctrine' ? 'border-emerald-500 text-white font-medium' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Scale size={13} />
          <span>Jurisprudence</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB A: 7-Vector Interlocking Matrix Table */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 gap-3.5">
          {rules.map((rule, idx) => (
            <div
              key={rule.id || idx}
              className={`p-5 rounded-xl bg-[#111115] border border-white/[0.08] border-l-2 flex flex-col gap-3.5 ${
                rule.status === 'FAIL'
                  ? 'border-l-rose-500'
                  : rule.status === 'WARNING'
                  ? 'border-l-amber-500'
                  : 'border-l-emerald-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-white/[0.05] text-zinc-300 font-mono text-[11px] font-medium flex items-center justify-center shrink-0 tabular-nums">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
                    <span>{rule.name}</span>
                    <span className="text-[11px] text-zinc-500 font-normal">
                      · {rule.category}
                    </span>
                  </h4>
                </div>

                {getSeverityBadge(rule.status, rule.severity)}
              </div>

              {/* Finding & Exposure Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1.5 p-3.5 rounded-lg bg-[#0A0A0D] border border-white/[0.06]">
                  <span className="text-[11px] font-medium text-zinc-400 block">Finding</span>
                  <p className="text-zinc-200 leading-relaxed">{rule.finding}</p>
                  <p className="pt-1.5 text-[11px] text-zinc-500">
                    <strong className="text-zinc-400">Doctrine: </strong>
                    {rule.legalRisk}
                  </p>
                </div>

                <div className="space-y-2 p-3.5 rounded-lg bg-[#0A0A0D] border border-white/[0.06]">
                  <span className={`text-[11px] font-medium block ${
                    rule.status === 'FAIL' ? 'text-rose-400' : rule.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    Exposure & Remediation
                  </span>
                  <p className="leading-relaxed text-zinc-300">{rule.consequence}</p>
                  <div className="pt-2 border-t border-white/[0.05] text-[11px] text-zinc-400">
                    <strong className="text-zinc-200">Fix: </strong>
                    <span className="font-mono text-[11px] text-zinc-300 block mt-1">{rule.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB B: Extracted Clause Intelligence */}
      {activeTab === 'clauses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          {/* Indemnity Clause Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Extracted Indemnification Provision</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {intel.indemnity?.clauses?.length || 0} Matches Found
              </span>
            </div>
            {intel.indemnity?.clauses?.length > 0 ? (
              <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                {intel.indemnity.clauses.map(c => `[Section ${c.sectionNum}]\n${c.snippet}`).join('\n\n')}
              </pre>
            ) : (
              <p className="text-zinc-400 italic p-3">No indemnification provisions detected in document text.</p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${intel.indemnity?.scopes?.thirdParty ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                Third-Party Claims: {intel.indemnity?.scopes?.thirdParty ? 'YES' : 'NO'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${intel.indemnity?.scopes?.ipInfringement ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                IP Infringement: {intel.indemnity?.scopes?.ipInfringement ? 'YES' : 'NO'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${intel.indemnity?.scopes?.grossNegligence ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                Gross Negligence: {intel.indemnity?.scopes?.grossNegligence ? 'YES' : 'NO'}
              </span>
            </div>
          </div>

          {/* Limitation of Liability Cap Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <ShieldAlert size={14} className="text-cyan-400" />
                <span>Extracted Limitation of Liability Cap</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                {intel.liabilityCap?.capDollarAmount ? `$${intel.liabilityCap.capDollarAmount}` : intel.liabilityCap?.isFeesMultiplier ? 'Fees Multiplier' : 'Unspecified Cap'}
              </span>
            </div>
            {intel.liabilityCap?.clauses?.length > 0 ? (
              <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                {intel.liabilityCap.clauses.map(c => `[Section ${c.sectionNum}]\n${c.snippet}`).join('\n\n')}
              </pre>
            ) : (
              <p className="text-zinc-400 italic p-3">No limitation of liability provisions detected in document text.</p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${intel.carveOuts?.hasIndemnityCarveOut ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                Indemnity Carve-Out: {intel.carveOuts?.hasIndemnityCarveOut ? 'YES (PROTECTED)' : 'NO (GUTTED)'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${intel.carveOuts?.hasGrossNegligenceCarveOut ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'}`}>
                Gross Negligence Carve-Out: {intel.carveOuts?.hasGrossNegligenceCarveOut ? 'YES' : 'NO'}
              </span>
            </div>
          </div>

          {/* Consequential Damages Waiver Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <span>Extracted Consequential Damages Waiver</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {intel.consequentialWaiver?.clauses?.length || 0} Matches
              </span>
            </div>
            {intel.consequentialWaiver?.clauses?.length > 0 ? (
              <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                {intel.consequentialWaiver.clauses.map(c => `[Section ${c.sectionNum}]\n${c.snippet}`).join('\n\n')}
              </pre>
            ) : (
              <p className="text-zinc-400 italic p-3">No consequential damages waivers detected in document text.</p>
            )}
          </div>

          {/* Sole and Exclusive Remedy Box */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="font-bold text-white font-mono flex items-center gap-2">
                <Lock size={14} className="text-purple-400" />
                <span>Sole and Exclusive Remedy Declarations</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {intel.soleRemedy?.clauses?.length || 0} Declarations
              </span>
            </div>
            {intel.soleRemedy?.clauses?.length > 0 ? (
              <pre className="p-3 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap max-h-56 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                {intel.soleRemedy.clauses.map(c => `[Section ${c.sectionNum}]\n${c.snippet}`).join('\n\n')}
              </pre>
            ) : (
              <p className="text-zinc-400 italic p-3">No sole and exclusive remedy restrictions detected.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB C: Harmonized AmLaw 100 Fix Rider */}
      {activeTab === 'rider' && (
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  Harmonized Section 12 Master Amendment Rider
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  AmLaw 100 Calibrated
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Systematically solves all 7 interlocking traps: establishes reciprocal caps, inserts unconditional indemnity carve-outs, classifies defense fees as direct damages, and subordinates sole remedies.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyRider}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copiedRider ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={isExportingDocx}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileDown size={13} />
                <span>Export Word (.docx)</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-black/80 border border-zinc-800 font-legal text-[13px] leading-relaxed text-zinc-200 whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar select-text">
            {harmonizedRider}
          </pre>

          {onApplyRiderToDraft && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onApplyRiderToDraft(harmonizedRider)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles size={14} />
                <span>Append Rider to Active Contract Draft</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB D: Jurisprudential Codex */}
      {activeTab === 'doctrine' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-bold text-white text-xs font-mono uppercase text-emerald-400">
              1. The Consequential Damages Defense Trap
            </span>
            <p className="text-zinc-300 leading-relaxed text-[11.5px]">
              In multiple commercial jurisdictions, if a contract waives indirect/consequential damages without an express carve-out for indemnification, defense counsel for the indemnifying party can argue that settlements paid to third parties and legal defense invoices are consequential rather than direct damages. Standard AmLaw 100 drafting mandates a "deeming clause" establishing that all indemnifiable losses and defense fees constitute direct damages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-bold text-white text-xs font-mono uppercase text-cyan-400">
              2. Public Policy Exculpation Bar (Kalisch-Jarcho)
            </span>
            <p className="text-zinc-300 leading-relaxed text-[11.5px]">
              Under established New York Court of Appeals doctrine (<em>Kalisch-Jarcho, Inc. v. City of New York</em>, 58 N.Y.2d 377) and Delaware Chancery practice, contractual clauses that purport to exculpate a party from liability for gross negligence, willful misconduct, or intentional fraud are void as against public policy. Attempting to cap all liability without a gross negligence carve-out risks judicial voidance of the entire limitation section.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-bold text-white text-xs font-mono uppercase text-purple-400">
              3. Sole Remedy Overreach & Remedy Extinction
            </span>
            <p className="text-zinc-300 leading-relaxed text-[11.5px]">
              Designating a remedy as "sole and exclusive" without qualifying language ("Subject to Section X...") can inadvertently eliminate the non-breaching party's right to pursue general breach of contract damages, indemnification, or equitable injunctive relief. Courts enforce the literal plain meaning of "sole and exclusive" against sophisticated commercial parties.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <span className="font-bold text-white text-xs font-mono uppercase text-amber-400">
              4. Insurance Covenant vs. Liability Cap Friction
            </span>
            <p className="text-zinc-300 leading-relaxed text-[11.5px]">
              When an agreement requires a $5,000,000 commercial insurance policy but simultaneously caps aggregate liability at $100,000, insurance carriers can argue that the insured's legal liability is capped at $100,000, limiting policy payouts. The contract should expressly provide that the liability cap does not apply to the extent of proceeds actually recovered from required insurance policies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
