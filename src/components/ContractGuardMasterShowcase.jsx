import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Search,
  Lock,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 'liability',
    num: '01',
    tabTitle: 'Liability Reconciler',
    tabSubtitle: '$5M Carve-Out Gap',
    icon: Scale,
    badge: 'Conflict Detected',
    badgeType: 'danger',
    headline: 'Can a $50,000 Cap Gut a $5,000,000 Indemnity?',
    summary: 'Under standard commercial law, a blanket Limitation of Liability caps third-party indemnity payouts unless an express carve-out is present.',
    metricVal: '$4.95M',
    metricLabel: 'Unhedged Exposure Flagged',
    speed: '240ms',
    statute: 'Delaware Chancery · UCC § 2-719'
  },
  {
    id: 'diff',
    num: '02',
    tabTitle: 'Forensic Redline Diff',
    tabSubtitle: 'Stealth Edits Detector',
    icon: Search,
    badge: 'Unmarked Edits',
    badgeType: 'warning',
    headline: 'Catch Stealth Alterations in Clean Drafts',
    summary: 'Counterparties frequently return unmarked Word files with subtle clause shifts. ContractGuard isolates every word change locally in RAM.',
    metricVal: '180ms',
    metricLabel: 'Character-Level Diff Pass',
    speed: '180ms',
    statute: 'Myers LCS Engine'
  },
  {
    id: 'audit',
    num: '03',
    tabTitle: 'Deterministic AST Audit',
    tabSubtitle: 'Zero Hallucinations',
    icon: ShieldCheck,
    badge: 'Structural Graph',
    badgeType: 'success',
    headline: 'Formal Syntactic Verification Without Probabilistic Guessing',
    summary: 'Public LLMs predict text and miss dangling references. ContractGuard builds an Abstract Syntax Tree verifying sections, exhibits, and figures.',
    metricVal: '100%',
    metricLabel: 'Deterministic Parity Check',
    speed: '310ms',
    statute: 'UCC § 3-114 · AST Graph'
  },
  {
    id: 'privacy',
    num: '04',
    tabTitle: 'In-RAM Privilege',
    tabSubtitle: 'Zero-Cloud Sanitizer',
    icon: Lock,
    badge: 'Zero Cloud Packets',
    badgeType: 'emerald',
    headline: 'Client Drafts Never Leave Local Browser Memory',
    summary: 'Preserves attorney-client privilege under ABA Model Rule 1.6. Pattern detectors scrub SSNs, routing codes, and sensitive figures locally.',
    metricVal: '0 Bytes',
    metricLabel: 'Sent to External Servers',
    speed: '95ms',
    statute: 'ABA Model Rule 1.6 · Fed. R. Civ. P. 5.2'
  },
  {
    id: 'vault',
    num: '05',
    tabTitle: '50-State Statutory Vault',
    tabSubtitle: 'Jurisdictional Rules',
    icon: Briefcase,
    badge: 'Statutory Benchmark',
    badgeType: 'info',
    headline: 'Real-Time Compliance Across 50 US Jurisdictions',
    summary: 'Cross-checks non-competes, indemnities, and survival limits against state statutes—flagging California § 16600 void provisions prior to signing.',
    metricVal: '50 States',
    metricLabel: 'Statutory Riders Covered',
    speed: '150ms',
    statute: 'Cal. B&P § 16600 · DGCL'
  }
];

export default function ContractGuardMasterShowcase() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reconciled, setReconciled] = useState(false);
  const [selectedState, setSelectedState] = useState('CA');

  const DURATION_MS = 6500;
  const INTERVAL_TICK = 50;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIdx((curr) => (curr + 1) % CHAPTERS.length);
          setReconciled(false);
          return 0;
        }
        return prev + (INTERVAL_TICK / DURATION_MS) * 100;
      });
    }, INTERVAL_TICK);

    return () => clearInterval(timer);
  }, [isPlaying, activeIdx]);

  const handleSelectTab = (idx) => {
    setActiveIdx(idx);
    setProgress(0);
    setReconciled(false);
  };

  const handlePrev = () => {
    setActiveIdx((curr) => (curr - 1 + CHAPTERS.length) % CHAPTERS.length);
    setProgress(0);
    setReconciled(false);
  };

  const handleNext = () => {
    setActiveIdx((curr) => (curr + 1) % CHAPTERS.length);
    setProgress(0);
    setReconciled(false);
  };

  const activeChapter = CHAPTERS[activeIdx];

  return (
    <div className="w-full max-w-6xl mx-auto font-sans">
      {/* Chapter Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeIdx;
          const Icon = ch.icon;

          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleSelectTab(idx)}
              className={`relative text-left p-3 rounded-lg border transition-colors overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-[#111115] border-white/[0.16] text-zinc-100'
                  : 'bg-[#0C0C0F] border-white/[0.06] hover:bg-[#111115] text-zinc-400'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/[0.04]">
                {isActive && (
                  <div
                    className="h-full bg-emerald-500 transition-[width] duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between mb-1 pt-0.5">
                <span className={`font-mono text-[10px] tabular-nums ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {ch.num}
                </span>
                <Icon size={13} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
              </div>

              <div className={`text-xs font-medium leading-snug truncate ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}>
                {ch.tabTitle}
              </div>
              <div className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">
                {ch.tabSubtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workstation Viewport */}
      <div className="rounded-xl border border-white/[0.08] bg-[#111115] overflow-hidden shadow-2xl">
        {/* Topbar */}
        <div className="px-5 py-2.5 bg-[#15151A] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText size={13} className="text-emerald-400" />
            <span className="text-zinc-200 font-medium text-[11px]">
              ContractGuard Studio · Interactive Walkthrough
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Local Browser RAM
            </span>

            <div className="flex items-center gap-0.5 bg-[#09090B] border border-white/[0.08] rounded-md p-0.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous engine"
                className="p-1 hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-100 rounded transition-colors cursor-pointer"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause showcase' : 'Play showcase'}
                className="p-1 hover:bg-white/[0.06] text-zinc-300 hover:text-white rounded transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} className="text-emerald-400" />}
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next engine"
                className="p-1 hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-100 rounded transition-colors cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-6 md:p-8 bg-[#09090B]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
            >
              {/* Left Column: Interactive Evidence Pane (7 cols) */}
              <div className="lg:col-span-7 bg-[#111115] rounded-lg border border-white/[0.08] p-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 text-xs font-mono">
                  <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${
                    activeChapter.badgeType === 'danger'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                      : activeChapter.badgeType === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                      : activeChapter.badgeType === 'info'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  }`}>
                    {activeChapter.badge}
                  </span>
                  <span className="text-[11px] text-zinc-500 tabular-nums">
                    Parsed in {activeChapter.speed}
                  </span>
                </div>

                {/* SLIDE 1: LIABILITY RECONCILER */}
                {activeChapter.id === 'liability' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-1.5 font-mono">
                        <span className="text-[11px] text-zinc-300">Section 11.2 · Aggregate Cap</span>
                        <span className="text-[10px] text-amber-400">Capped at $50,000</span>
                      </div>
                      <p className="text-zinc-300 text-[13px] leading-relaxed font-legal">
                        “In no event shall either party’s total aggregate liability exceed{' '}
                        <span className="text-amber-300 bg-amber-500/10 px-1 rounded">
                          total fees paid in the preceding twelve (12) months
                        </span>.”
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-1.5 font-mono">
                        <span className="text-[11px] text-zinc-300">Section 14.1 · IP Indemnity</span>
                        <span className="text-[10px] text-rose-400">$5,000,000 Exposure</span>
                      </div>
                      <p className="text-zinc-300 text-[13px] leading-relaxed font-legal">
                        “Vendor shall indemnify and hold harmless Client{' '}
                        <span className="text-rose-300 bg-rose-500/10 px-1 rounded">
                          up to Five Million Dollars ($5,000,000)
                        </span>{' '}
                        against third-party IP claims.”
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-lg border transition-colors ${
                      reconciled
                        ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                        : 'bg-rose-500/[0.05] border-rose-500/25'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {reconciled ? (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                          )}
                          <span className={`font-medium text-xs ${reconciled ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {reconciled ? 'Express Carve-Out Harmonized' : 'Missing Carve-Out Subordinates $5M Indemnity'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReconciled(!reconciled)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors shrink-0 ${
                            reconciled
                              ? 'bg-[#18181B] text-zinc-200 border border-white/[0.1] hover:bg-zinc-800'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {reconciled ? 'Reset' : 'Apply Rider Fix'}
                        </button>
                      </div>

                      <p className="text-[11.5px] text-zinc-400 mt-1.5 leading-relaxed">
                        {reconciled
                          ? 'Rider inserted: “Notwithstanding Section 11.2, indemnification under Section 14.1 is excluded from the aggregate liability cap.”'
                          : 'Without an express carve-out, courts enforce the $50k fee cap across indemnity claims.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE 2: FORENSIC REDLINE DIFF */}
                {activeChapter.id === 'diff' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                        <div className="text-[10px] font-mono text-zinc-500 mb-1.5 flex items-center justify-between">
                          <span>BASELINE (DRAFT V3)</span>
                          <span>11:42 AM</span>
                        </div>
                        <p className="text-zinc-300 font-legal text-[13px] leading-relaxed">
                          “Buyer may terminate upon thirty (30) days notice if Seller commits an uncured{' '}
                          <span className="bg-white/[0.08] px-1 rounded text-zinc-100">material breach</span>.”
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] border-l-2 border-l-rose-500/70">
                        <div className="text-[10px] font-mono text-rose-400 mb-1.5 flex items-center justify-between">
                          <span>RETURNED CLEAN COPY (V4)</span>
                          <span>UNMARKED</span>
                        </div>
                        <p className="text-zinc-300 font-legal text-[13px] leading-relaxed">
                          “Buyer may terminate upon{' '}
                          <span className="bg-rose-500/15 text-rose-300 line-through px-1">thirty (30)</span>{' '}
                          <span className="bg-emerald-500/15 text-emerald-300 px-1">ninety (90)</span> days notice{' '}
                          <span className="bg-emerald-500/15 text-emerald-300 px-1">in Seller’s sole discretion</span>.”
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#09090B] border border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                      <span className="text-zinc-300">
                        2 silent alterations detected: cure period tripled + unilateral discretion added.
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px] shrink-0">0 Missed</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 3: DETERMINISTIC AST AUDIT */}
                {activeChapter.id === 'audit' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-[#09090B] border border-white/[0.06] flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-zinc-100">Section 14.4 Cross-Reference</div>
                        <div className="text-zinc-400 text-[11.5px] mt-0.5">Section 8.2 cites Section 14.4, which was deleted during redlining.</div>
                      </div>
                      <span className="text-[10px] font-mono text-rose-400 shrink-0">Broken Ref</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#09090B] border border-white/[0.06] flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-zinc-100">Exhibit C (IP Escrow Protocol)</div>
                        <div className="text-zinc-400 text-[11.5px] mt-0.5">Referenced in Section 3.1 but omitted from closing binder.</div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 shrink-0">Missing Exhibit</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#09090B] border border-white/[0.06] flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-zinc-100">Purchase Price Parity</div>
                        <div className="text-zinc-400 text-[11.5px] mt-0.5">Prose reads “Two Hundred Fifty Thousand” while figures read “($205,000)”.</div>
                      </div>
                      <span className="text-[10px] font-mono text-rose-400 shrink-0">UCC § 3-114</span>
                    </div>

                    <div className="px-3 py-2 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                      <span>Deterministic Rule Verification</span>
                      <span>100% Parity Validated</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 4: IN-RAM PRIVILEGE */}
                {activeChapter.id === 'privacy' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block mb-2">
                        Client Document · Sanitized Locally in Browser RAM
                      </span>
                      <p className="text-zinc-300 font-legal text-[13px] leading-relaxed">
                        “Acme Executive Officer{' '}
                        <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[REDACTED_ENTITY]</span>{' '}
                        (SSN:{' '}
                        <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[REDACTED_SSN]</span>) authorizes wire of{' '}
                        <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-[11px]">[REDACTED_SUM]</span>.”
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                        <div className="text-[10px] text-zinc-500 font-mono">Network Calls</div>
                        <div className="text-base font-semibold text-emerald-400 font-mono tabular-nums mt-0.5">0</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                        <div className="text-[10px] text-zinc-500 font-mono">Cloud Storage</div>
                        <div className="text-base font-semibold text-zinc-200 font-mono tabular-nums mt-0.5">0 MB</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                        <div className="text-[10px] text-zinc-500 font-mono">ABA Rule 1.6</div>
                        <div className="text-base font-semibold text-emerald-400 font-mono mt-0.5">Preserved</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 5: 50-STATE STATUTORY VAULT */}
                {activeChapter.id === 'vault' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {['CA', 'DE', 'NY', 'TX'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSelectedState(st)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                            selectedState === st
                              ? 'bg-white/[0.1] text-white border border-white/[0.14]'
                              : 'bg-[#09090B] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                          }`}
                        >
                          {st === 'CA' ? 'California (§ 16600)' : st === 'DE' ? 'Delaware (DGCL)' : st === 'NY' ? 'New York' : 'Texas'}
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-1.5 font-mono gap-2">
                        <span className="text-[11px] text-zinc-200">
                          {selectedState === 'CA' && 'California Restrictive Covenants'}
                          {selectedState === 'DE' && 'Delaware General Corporation Law'}
                          {selectedState === 'NY' && 'New York Restraint Standards'}
                          {selectedState === 'TX' && 'Texas Covenants Not to Compete Act'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          selectedState === 'CA'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        }`}>
                          {selectedState === 'CA' ? 'Void Per Se' : 'Valid With Carve-Outs'}
                        </span>
                      </div>

                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {selectedState === 'CA' &&
                          'Cal. Bus. & Prof. Code § 16600 and AB 1076 render employment non-competes void and trigger statutory penalties. Flags invalid language for replacement with compliant confidentiality protection.'}
                        {selectedState === 'DE' &&
                          'Delaware Chancery scrutinizes sale-of-business scope reasonableness. Validates geographic boundaries and survival covenants prior to closing.'}
                        {selectedState === 'NY' &&
                          'New York enforces restrictive covenants only when narrowly tailored to legitimate business interests without imposing undue hardship.'}
                        {selectedState === 'TX' &&
                          'Tex. Bus. & Com. Code § 15.50 requires covenants to be ancillary to an otherwise enforceable agreement at the time made.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Concise Context & Action (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                    Module {activeChapter.num} · Pre-Signing Review
                  </div>

                  <h3 className="text-xl md:text-2xl font-serif font-normal text-white leading-snug mb-2.5">
                    {activeChapter.headline}
                  </h3>

                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed mb-5">
                    {activeChapter.summary}
                  </p>

                  <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Benchmark</div>
                      <div className="text-xs font-mono text-zinc-300 mt-0.5">
                        {activeChapter.statute}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-semibold font-mono text-emerald-400 tabular-nums">
                        {activeChapter.metricVal}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {activeChapter.metricLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('/demo')}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Try This in Live Studio</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('pricing');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[#18181B] hover:bg-zinc-800 text-zinc-200 py-2.5 px-4 rounded-md font-medium text-xs border border-white/[0.08] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>See Perpetual Plans ($199 / $299)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
