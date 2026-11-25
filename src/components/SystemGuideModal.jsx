import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, FileCheck, Search, Sparkles,
  EyeOff, Layers, BookOpen, Database, ArrowRight,
  CheckCircle2, Scale, Lock, Download, ShieldAlert
} from 'lucide-react';

export default function SystemGuideModal({
  isOpen,
  onClose,
  activeTab = 'analyzer',
  onSelectTab,
  onLaunchTool
}) {
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
    { id: 'redact', label: 'PII Redactor', icon: EyeOff, badge: 'Zero-Cloud' },
    { id: 'bates', label: 'Bates Stamping', icon: Layers, badge: 'Discovery' },
    { id: 'templates', label: 'Template Vault', icon: BookOpen, badge: 'AmLaw 100' },
    { id: 'history', label: 'Audit Vault', icon: Database, badge: 'Local DB' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[88vh] bg-[#09090B] border border-white/[0.08] rounded-xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                    ContractGuard Operator Guide
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    v2.4
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Deterministic legal verification, zero-cloud confidentiality, and practitioner workflows
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
              title="Close guide (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Minimalist Underline Navigation Tabs */}
          <div className="px-6 bg-[#0C0C0F] border-b border-white/[0.06] flex items-center gap-5 overflow-x-auto custom-scrollbar shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab && onSelectTab(tab.id)}
                  className={`flex items-center gap-2 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 bg-[#09090B]">
            {/* TAB 1: Fact-Checking Engine */}
            {activeTab === 'analyzer' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      Deterministic Mathematical Forensics
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ABA Model Rule 1.6 Privileged
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Executes Abstract Syntax Tree (AST) parsing, cross-reference graphing, and deterministic statutory rule validation across 4 verification modes in local browser RAM — zero cloud calls and zero AI hallucinations.
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-3">
                    Verification Modes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] hover:border-white/[0.15] flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FileCheck size={14} className="text-emerald-400" />
                          <span className="text-[10px] font-mono text-zinc-500">AST</span>
                        </div>
                        <h5 className="text-xs font-semibold text-zinc-100">Single Draft Audit</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Flags broken cross-references, missing exhibits, undefined capitalized terms, and numerical contradictions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'single')}
                        className="mt-3 w-full py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Open Single Audit <ArrowRight size={11} className="text-zinc-400" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] hover:border-white/[0.15] flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Search size={14} className="text-sky-400" />
                          <span className="text-[10px] font-mono text-zinc-500">Myers</span>
                        </div>
                        <h5 className="text-xs font-semibold text-zinc-100">Redline Diff Mode</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Compares baseline vs. counterparty drafts word-by-word, isolating stealth edits and shifted covenants.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'comparative')}
                        className="mt-3 w-full py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Open Redline Diff <ArrowRight size={11} className="text-zinc-400" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] hover:border-white/[0.15] flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Sparkles size={14} className="text-emerald-400" />
                          <span className="text-[10px] font-mono text-zinc-500">Deed</span>
                        </div>
                        <h5 className="text-xs font-semibold text-zinc-100">Linguistic Proofreader</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Resolves archaic legalisms, inconsistent numbering, and drafting ambiguities without altering substantive rights.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'harmonizer')}
                        className="mt-3 w-full py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Open Proofreader <ArrowRight size={11} className="text-zinc-400" />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] hover:border-white/[0.15] flex flex-col justify-between transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <ShieldAlert size={14} className="text-amber-400" />
                          <span className="text-[10px] font-mono text-zinc-500">Matrix</span>
                        </div>
                        <h5 className="text-xs font-semibold text-zinc-100">Liability Reconciler</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Audits 7 interlocking liability vectors for gutted indemnities, super-cap omissions, and sole-remedy traps.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchTool && onLaunchTool('analyzer', 'liability')}
                        className="mt-3 w-full py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Open Reconciler <ArrowRight size={11} className="text-zinc-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                    Practitioner Workflow
                  </h4>
                  <div className="divide-y divide-white/[0.06] rounded-lg bg-[#111115] border border-white/[0.08]">
                    <div className="p-3 flex items-start gap-3">
                      <span className="text-[11px] font-mono text-zinc-500 tabular-nums mt-0.5">01</span>
                      <div>
                        <p className="text-xs font-medium text-zinc-200">Load or Paste Draft</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Upload .docx, .pdf, or .txt directly into browser RAM, or load an institutional benchmark case.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 flex items-start gap-3">
                      <span className="text-[11px] font-mono text-zinc-500 tabular-nums mt-0.5">02</span>
                      <div>
                        <p className="text-xs font-medium text-zinc-200">Run Deterministic Audit</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Review structural errors, undefined terms, financial mismatches, and liability interlocks across unified tabs.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 flex items-start gap-3">
                      <span className="text-[11px] font-mono text-zinc-500 tabular-nums mt-0.5">03</span>
                      <div>
                        <p className="text-xs font-medium text-zinc-200">Export Amendment Rider or Redline</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Generate a court-ready Pre-Signing Rider (.docx), Forensic Certificate, or copy counter-language directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-2.5 rounded-lg bg-[#111115] border border-white/[0.06] text-[11px] text-zinc-500 flex items-center gap-2">
                  <Scale size={14} className="text-emerald-400 shrink-0" />
                  <span>Governing Doctrines: DGCL § 106 · Uniform Commercial Code § 2-201 · Restatement (Second) of Contracts § 33.</span>
                </div>
              </div>
            )}

            {/* TAB 2: Smart PII Redactor */}
            {activeTab === 'redact' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      Client-Side Identity & Financial Sanitizer
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Fed. R. Civ. P. 5.2</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Compliant with Federal Rule of Civil Procedure 5.2 privacy mandates. Masks SSNs, EINs, routing numbers, credit cards, and custom codenames in local browser RAM prior to court filing or disclosure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Pattern Detectors
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Toggle structural matchers for Social Security Numbers, Employer IDs, bank accounts, card numbers, phone lines, and IP addresses.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-sky-400" /> Custom Entity Scrubbing
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Define client names, transaction codenames, or subsidiary entities to scrub proprietary strings across entire exhibits.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                    Masking Styles
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.08]">
                      <p className="font-medium text-zinc-200">Solid Block</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">John Doe (██████████)</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Court discovery filings</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.08]">
                      <p className="font-medium text-zinc-200">Semantic Tag</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">[REDACTED: SSN]</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Internal counsel review</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.08]">
                      <p className="font-medium text-zinc-200">Asterisk Mask</p>
                      <p className="text-[11px] text-zinc-400 mt-1 font-mono">***-**-1234</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Partial verification display</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Bates Stamping */}
            {activeTab === 'bates' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-sky-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                      Native pdf-lib Production Stamping
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Evidentiary Standard</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Sequentially stamps and binds multi-PDF discovery productions inside local browser memory. Unfiled client evidence never touches third-party cloud converters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100">Party Prefixes</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Set custom docket prefixes such as PLTF-, DEF-, EX-, or confidential designations.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100">Zero Padding</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Configure 4-digit (0001) through 8-digit sequence padding for structured trial binders.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100">Contrast Backing</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Draws an opaque white backing pill beneath every stamp so numbers remain legible on dark scans.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Legal Templates Vault */}
            {activeTab === 'templates' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      AmLaw 100 Institutional Drafting Library
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Delaware & UCC</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Structured transaction agreements aligned with Delaware corporate law, Uniform Commercial Code (UCC), and IRC § 1445 FIRPTA commercial standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100">Real Estate & Commercial Leases</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Land Purchase & Sale Agreements with FIRPTA & environmental contingencies, plus Triple Net (NNN) leases with 50-state statutory riders.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <h5 className="text-xs font-semibold text-zinc-100">Corporate M&A & Technology</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Delaware Asset Purchase Agreements (APA), Delaware LLC Operating Agreements (IRC § 704(b)), and Enterprise MSAs with present IP assignment (17 U.S.C. § 101).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.06] text-xs text-zinc-400 flex items-start gap-2.5">
                  <Download size={14} className="text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-zinc-200">Direct Audit Handoff: </span>
                    <span>Compile deal parameters live, export to Word (.docx), or send directly into ContractGuard for forensic audit.</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Audit Vault */}
            {activeTab === 'history' && (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-sky-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                      Encrypted Local Sandbox Persistence
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Zero Server Retention</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Every audit report, redline comparison, and Bates production job persists inside your browser's local IndexedDB vault with zero cloud transmission.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.06] rounded-lg bg-[#111115] border border-white/[0.08]">
                  <div className="p-3 flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-zinc-200">Instant Session Restoration</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Reopen past contract reviews to inspect redlines, review undefined terms, or export fresh counter-riders.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 flex items-start gap-3">
                    <CheckCircle2 size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-zinc-200">One-Click Client Data Purge</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Clear cached drafts and production logs from your machine immediately to satisfy matter-closing destruction policies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-6 py-3.5 border-t border-white/[0.06] bg-[#0C0C0F] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              <Lock size={12} className="text-emerald-500" />
              <span>100% In-Memory Sandbox · ABA Rule 1.6 Compliant</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onLaunchTool) {
                  onLaunchTool(activeTab);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open {tabs.find(t => t.id === activeTab)?.label || 'Workspace'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
