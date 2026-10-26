import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, FileCheck, Search, Sparkles,
  EyeOff, Layers, BookOpen, Database, ArrowRight,
  CheckCircle2, Scale, Lock, Download, AlertTriangle,
  FileCode, Terminal, Cpu
} from 'lucide-react';

export default function SystemGuideModal({
  isOpen,
  onClose,
  activeTab = 'analyzer',
  onSelectTab,
  onLaunchTool
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'analyzer', label: 'Fact-Checking Engine', icon: ShieldCheck, badge: '4 Engines' },
    { id: 'redact', label: 'Smart PII Redactor', icon: EyeOff, badge: 'Zero-Cloud' },
    { id: 'bates', label: 'Bates Stamping Suite', icon: Layers, badge: 'Discovery' },
    { id: 'templates', label: 'Legal Templates Vault', icon: BookOpen, badge: 'AmLaw 100' },
    { id: 'history', label: 'Audit Vault & Storage', icon: Database, badge: 'Encrypted' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#070B12] border border-zinc-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">ContractGuard Operator Guide</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    v2.4 Institutional
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Deterministic legal verification, zero-cloud confidentiality, and AmLaw 100 practitioner workflows
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 flex items-center justify-center transition-colors cursor-pointer"
              title="Close guide (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Module Selector Navigation Tabs */}
          <div className="px-6 py-2.5 bg-zinc-950/70 border-b border-zinc-800/60 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab && onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                  <span>{tab.label}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {/* TAB 1: Fact-Checking Engine */}
            {activeTab === 'analyzer' && (
              <div className="space-y-6">
                {/* Executive Summary Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/50 to-cyan-950/20 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Cpu size={14} /> Deterministic Mathematical Forensics
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      ABA Model Rule 1.6 Privileged
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    ContractGuard replaces unpredictable LLM hallucinations with deterministic Abstract Syntax Tree (AST) parsing, formal cross-reference graphing, and strict regex verification. Audits execute 100% in local memory across 4 verification engines in under 100 milliseconds.
                  </p>
                </div>

                {/* 3 Sub-Tools Breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Available Verification Modes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Tool 1 */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <FileCheck size={14} />
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">AST Engine</span>
                        </div>
                        <h5 className="text-xs font-bold text-white">Single Draft Audit</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Audits standalone contracts for broken cross-references, missing exhibits, undefined terms, and financial/date contradictions.
                        </p>
                      </div>
                      <button
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'single')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Launch Single Audit <ArrowRight size={11} />
                      </button>
                    </div>

                    {/* Tool 2 */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Search size={14} />
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">Myers LCS</span>
                        </div>
                        <h5 className="text-xs font-bold text-white">Redline Diff Mode</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Performs dual-pane comparative diffing between baseline and counterparty drafts, exposing stealth edits and altered covenants.
                        </p>
                      </div>
                      <button
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'comparative')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Launch Redline Diff <ArrowRight size={11} />
                      </button>
                    </div>

                    {/* Tool 3 */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Sparkles size={14} />
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">Deed Harmonizer</span>
                        </div>
                        <h5 className="text-xs font-bold text-white">Linguistic Proofreader</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Forensic deed polishing, correcting archaic legalisms and punctuation while strictly preserving 100% of underlying covenants.
                        </p>
                      </div>
                      <button
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'harmonizer')}
                        className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Launch Proofreader <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3-Step Guided Workflow */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Standard Practitioner Workflow
                  </h4>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">Import Contract Draft</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Upload a .docx or .pdf file, or paste draft text. Contract title and client/counterparty legal entities are detected automatically.</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">Execute Deterministic Audit</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Click "Audit Contract Integrity". The 4 engines parse structural trees, cross-references, and financial terms, displaying flagged issues in the interactive HUD.</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">Export Pre-Signing Court Rider & Redlines</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Download a complete Pre-Signing Amendment Rider in Microsoft Word (.docx), export an executive client memo, or copy specific strikeout/insertion clauses directly into counsel redlines.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statutory Reference Callout */}
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                  <Scale size={15} className="text-emerald-400 shrink-0" />
                  <span>Governing Doctrines: Delaware General Corporation Law (DGCL § 106), Uniform Commercial Code (UCC § 2-201), Restatement (Second) of Contracts § 33.</span>
                </div>
              </div>
            )}

            {/* TAB 2: Smart PII Redactor */}
            {activeTab === 'redact' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/50 to-blue-950/20 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <EyeOff size={14} /> Client-Side Identity & Financial Sanitizer
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Fed. R. Civ. P. 5.2 Safe
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Compliant with Federal Rule of Civil Procedure 5.2 privacy mandates. Masks Social Security Numbers, Bank Routing codes, Credit Cards, Tax IDs, and proprietary transaction codenames entirely within browser memory before court filing or disclosure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Automated Detection Filters
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Toggle standard filters for Social Security Numbers (SSN), Employer Identification Numbers (EIN), Bank Accounts, Credit Cards, Phone Numbers, and IP addresses.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-cyan-400" /> Custom Keyword Scrubbing
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Add specific client names, confidential project code words, or subsidiary corporate identities to batch-scrub proprietary information instantly.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Redaction Output Styles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70">
                      <p className="font-bold text-zinc-200">Solid Black Block</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">John Doe (██████████)</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Recommended for official court discovery exhibits</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70">
                      <p className="font-bold text-zinc-200">Semantic Tag</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">[REDACTED: SSN]</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Preserves context for internal review</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70">
                      <p className="font-bold text-zinc-200">Asterisk Mask</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">***-**-1234</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Standard banking verification format</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Bates Stamping */}
            {activeTab === 'bates' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-zinc-900/50 to-blue-950/20 border border-cyan-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Layers size={14} /> Native pdf-lib Trial Stamping Suite
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      Evidentiary Standard
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Sequentially stamps and binds multi-document discovery productions directly in your browser. Generates court-ready PDF exhibits without uploading unfiled evidence to third-party cloud converters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                    <h5 className="text-xs font-bold text-white">Party Attribution</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Set custom prefixes: PLTF- (Plaintiff), DEF- (Defendant), CONF- (Confidential exhibit), or custom docket numbers.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                    <h5 className="text-xs font-bold text-white">Zero Padding</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Customizable 4-digit (0001) through 8-digit padding ensures consistent filing indices across large discovery binders.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                    <h5 className="text-xs font-bold text-white">Contrast Backing</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Renders an opaque white backing pill to ensure serial stamp readability across dark or degraded historical scans.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Legal Templates Vault */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/50 to-cyan-950/20 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <BookOpen size={14} /> AmLaw 100 Institutional Drafting Library
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Delaware & UCC Compliant
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Pre-assembled, battle-tested commercial contract models adhering to Delaware corporate law, the Uniform Commercial Code (UCC), FIRPTA real estate withholding (IRC § 1445), and American commercial jurisprudence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                    <h5 className="text-xs font-bold text-white">Commercial Real Estate & Leases</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Includes Land Purchase and Sale Agreements with FIRPTA certifications and Phase I Environmental contingencies, plus Triple Net (NNN) commercial leases with CAM prorations.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
                    <h5 className="text-xs font-bold text-white">Corporate M&A & Technology</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Delaware Asset Purchase Agreements (SEC EDGAR model APA), Delaware LLC Operating Agreements (IRC § 704(b)), and Tech MSAs with present IP assignment (17 U.S.C. § 101).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 text-xs text-zinc-300 flex items-start gap-2.5">
                  <Download size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Direct Audit Integration: </span>
                    <span>Fill variables in real-time, export to Word (.docx) for custom covenant authoring, or click "Send to Audit" to run forensic verification directly in ContractGuard.</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Audit Vault */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-zinc-900/50 to-zinc-950 border border-blue-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Database size={14} /> Encrypted In-Browser Sandbox Persistence
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      Zero Server Retention
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    All audit results, redline comparisons, and Bates stamping jobs are stored inside your browser's private IndexedDB database. Records survive tab refreshes and system restarts without transmitting a single byte to external cloud servers.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-zinc-200">Session Restoration</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Reopen any prior contract review session to inspect liability redlines, re-verify defined terms, or download fresh Word riders.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/70 flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-zinc-200">One-Click Client Purge</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Immediately purge all cached drafts, client memos, and Bates stamping jobs from your machine to comply with strict confidentiality and record-destruction protocols.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Lock size={13} className="text-emerald-400" />
              <span>100% In-Memory Sandbox · Privileged & Confidential</span>
            </div>

            <button
              onClick={() => {
                if (onLaunchTool) {
                  onLaunchTool(activeTab);
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <span>Launch {tabs.find(t => t.id === activeTab)?.label || 'Tool'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
