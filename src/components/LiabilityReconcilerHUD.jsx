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

  // Severity styles
  const getSeverityBadge = (status, severity) => {
    if (status === 'PASS') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 size={11} className="text-emerald-400" />
          <span>PASS · COMPLIANT</span>
        </span>
      );
    }
    if (severity === 'CRITICAL') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)] flex items-center gap-1 animate-pulse">
          <ShieldAlert size={11} className="text-rose-400" />
          <span>FAIL · CRITICAL TRAP</span>
        </span>
      );
    }
    if (severity === 'HIGH') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 flex items-center gap-1">
          <AlertTriangle size={11} className="text-amber-400" />
          <span>FAIL · HIGH EXPOSURE</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
        <AlertTriangle size={11} className="text-cyan-400" />
        <span>WARNING · SUB-OPTIMAL</span>
      </span>
    );
  };

  const getScoreColor = () => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.25)]';
    if (score >= 70) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.25)]';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.25)]';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10 shadow-[0_0_25px_rgba(244,63,94,0.3)]';
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in mt-6 font-ui">
      {/* 1. Master Executive Scorecard & Diagnostic Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${getScoreColor()}`}>
              <span className="text-2xl font-extrabold font-mono leading-none">{score}</span>
              <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 mt-1">Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Interlocking Liability & Risk-Shifting Audit
                </h3>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                  score < 50 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : score < 80 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {statusBadge}
                </span>
                <span className="text-[10.5px] font-mono text-zinc-400">
                  {processingTimeMs}ms (In-Memory AST)
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                Deterministic audit of the 5 interdependent liability pillars: <strong className="text-white">Indemnification, Liability Caps, Consequential Waivers, Sole Remedies,</strong> and <strong className="text-white">Insurance Covenants</strong>. Pinpoints hidden traps where general caps gut third-party indemnities.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyRider}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copiedRider ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Rider Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Harmonized Rider</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
            >
              {isExportingDocx ? <RefreshCw className="animate-spin" size={14} /> : <FileDown size={14} />}
              <span>Export Word (.docx)</span>
            </button>
          </div>
        </div>

        {/* Test Drive Quick Sample Loader Bar */}
        {onLoadSampleDeal && (
          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <span className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              <span>One-Click Test Deals:</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onLoadSampleDeal('gutted_indemnity_msa')}
                className="px-3 py-1 rounded-lg text-[11px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                title="Loads SaaS MSA where $50k cap guts $5M IP indemnity"
              >
                1. Gutted Indemnity MSA ($5M Trap)
              </button>
              <button
                onClick={() => onLoadSampleDeal('asymmetric_sole_remedy')}
                className="px-3 py-1 rounded-lg text-[11px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                title="Loads contract with unilateral cap and sole remedy overreach"
              >
                2. Asymmetric Vendor Deal
              </button>
              <button
                onClick={() => onLoadSampleDeal('harmonized_amlaw100')}
                className="px-3 py-1 rounded-lg text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                title="Loads gold-standard reciprocal AmLaw 100 contract"
              >
                3. Balanced AmLaw 100 Deal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Apple Segmented Pill Mode Navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 flex-wrap gap-3">
        <div className="flex apple-segmented-pill bg-black/60">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix' ? 'apple-segmented-pill-active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>Interlocking Matrix ({rules.length} Vectors)</span>
          </button>

          <button
            onClick={() => setActiveTab('clauses')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'clauses' ? 'apple-segmented-pill-active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Extracted Clauses ({intel.indemnity?.matchCount + intel.liabilityCap?.matchCount || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('rider')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rider' ? 'apple-segmented-pill-active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-emerald-400" />
            <span>Harmonized AmLaw 100 Rider</span>
          </button>

          <button
            onClick={() => setActiveTab('doctrine')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'doctrine' ? 'apple-segmented-pill-active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scale size={13} />
            <span>Jurisprudential Codex</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>ABA Model Rule 1.6 Certified · 100% Client-Side In-RAM</span>
        </div>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB A: 7-Vector Interlocking Matrix Table */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule, idx) => (
            <div
              key={rule.id || idx}
              className={`p-5 rounded-2xl bg-zinc-900/60 border transition-all flex flex-col gap-3.5 relative overflow-hidden ${
                rule.status === 'FAIL' 
                  ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10' 
                  : rule.status === 'WARNING'
                  ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10'
                  : 'border-white/5 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <span>{rule.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400 font-normal">
                        ({rule.category})
                      </span>
                    </h4>
                  </div>
                </div>

                {getSeverityBadge(rule.status, rule.severity)}
              </div>

              {/* Finding & Consequence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Left: Finding & Legal Risk */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-zinc-800/60">
                  <div className="text-[11px] font-mono uppercase font-semibold text-zinc-400 flex items-center gap-1.5">
                    <FileText size={12} className="text-cyan-400" />
                    <span>Contract Finding:</span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{rule.finding}</p>

                  <div className="pt-2 text-[11px] text-zinc-400">
                    <strong className="text-zinc-300">Doctrine Risk: </strong>
                    {rule.legalRisk}
                  </div>
                </div>

                {/* Right: Real-World Liability Consequence & Fix */}
                <div className={`space-y-2 p-3.5 rounded-xl border ${
                  rule.status === 'FAIL'
                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
                    : rule.status === 'WARNING'
                    ? 'bg-amber-500/10 border-amber-500/25 text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                }`}>
                  <div className="text-[11px] font-mono uppercase font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    <span>Malpractice / Exposure Consequence:</span>
                  </div>
                  <p className="leading-relaxed text-[11.5px]">{rule.consequence}</p>

                  <div className="pt-2 border-t border-white/10 text-[11px]">
                    <strong className="text-white">Recommended Fix: </strong>
                    <span className="text-zinc-300 font-mono text-[10.5px] block mt-1 bg-black/60 p-2 rounded border border-white/10">
                      {rule.recommendation}
                    </span>
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
