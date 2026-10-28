import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Search,
  Lock,
  Briefcase,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  FileCode,
  Sliders,
  ExternalLink,
  ShieldAlert,
  Zap,
  Check
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 'liability',
    num: '01',
    tabTitle: 'Liability Reconciler',
    tabSubtitle: '$5M Carve-Out Gap',
    icon: Scale,
    badge: 'CRITICAL CONFLICT DETECTED',
    badgeType: 'danger',
    headline: 'Can a $50,000 Liability Cap Gut a $5,000,000 Indemnity?',
    summary: 'Under standard US commercial interpretation, a blanket Limitation of Liability caps third-party indemnity payouts unless an express carve-out is present.',
    metricVal: '$4.95M',
    metricLabel: 'Litigation Exposure Neutralized',
    speed: '240ms',
    statute: 'Delaware Chancery • UCC § 2-719'
  },
  {
    id: 'diff',
    num: '02',
    tabTitle: 'Forensic Redline Diff',
    tabSubtitle: 'Stealth Edits Detector',
    icon: Search,
    badge: 'UNTRACKED MODIFICATIONS FOUND',
    badgeType: 'warning',
    headline: 'Catch Stealth Alterations Slipped into Clean Copies',
    summary: 'Counterparties sometimes return unmarked Word drafts with subtle clause shifts. ContractGuard performs character-level forensic diffing client-side in RAM.',
    metricVal: '180ms',
    metricLabel: 'Granular Diff Execution Speed',
    speed: '180ms',
    statute: 'Character-Level RAM Comparator'
  },
  {
    id: 'audit',
    num: '03',
    tabTitle: 'Deterministic AST Audit',
    tabSubtitle: 'Zero-Hallucination Graph',
    icon: ShieldCheck,
    badge: '416/416 TESTS VERIFIED',
    badgeType: 'success',
    headline: 'Formal Syntactic Graph Verification Without AI Hallucinations',
    summary: 'General LLMs guess probabilistically. ContractGuard constructs a deterministic AST graph verifying every clause node, dangling reference, and missing schedule.',
    metricVal: '100%',
    metricLabel: 'Deterministic Proof (0 Hallucinations)',
    speed: '310ms',
    statute: 'Formal Syntactic Contract Parser'
  },
  {
    id: 'privacy',
    num: '04',
    tabTitle: '100% In-RAM Privilege',
    tabSubtitle: 'Zero-Leak Client Armor',
    icon: Lock,
    badge: '0 CLOUD PACKETS • LOCAL RAM',
    badgeType: 'emerald',
    headline: 'Privileged Deal Data Never Leaves Your Device Memory',
    summary: 'Complies with ABA Model Rule 1.6 (Client Confidentiality). Instant pattern detection redacts SSNs, corporate banking coordinates, and deal figures before external sharing.',
    metricVal: '0 Bytes',
    metricLabel: 'Transmitted to Remote Cloud',
    speed: '95ms',
    statute: 'ABA Model Rule 1.6 • GDPR Ready'
  },
  {
    id: 'vault',
    num: '05',
    tabTitle: '50-State Statutory Vault',
    tabSubtitle: 'Real-Time Judicial Accord',
    icon: Briefcase,
    badge: 'MULTI-STATE JUDICIAL MATRIX',
    badgeType: 'cyan',
    headline: 'Real-Time Statutory Compliance Across 50 US Jurisdictions',
    summary: 'Automatically evaluates restrictive covenants and indemnities against state-specific statutes, flagging California Business & Professions § 16600 void provisions instantly.',
    metricVal: '50 States',
    metricLabel: 'Statutory Coverage Matrix',
    speed: '150ms',
    statute: 'Cal. Bus. & Prof. § 16600 • Del. GCL'
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

  // Auto-advance loop with progress tracking
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
    <div className="w-full max-w-7xl mx-auto font-body select-none">
      
      {/* Category Navigation Pills with Filling Progress Bars (Apple / Linear Caliber) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeIdx;
          const Icon = ch.icon;

          return (
            <button
              key={ch.id}
              onClick={() => handleSelectTab(idx)}
              className={`relative text-left p-3.5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-white/[0.07] border-nexus-emerald/50 shadow-[0_0_25px_rgba(0,255,157,0.15)]'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
              }`}
            >
              {/* Active Progress Bar at the top of the pill */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                {isActive && (
                  <motion.div
                    className="h-full bg-gradient-to-r from-nexus-emerald to-nexus-cyan"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                )}
              </div>

              <div className="flex items-center justify-between mb-1.5 pt-0.5">
                <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-nexus-emerald' : 'text-zinc-500'}`}>
                  {ch.num}
                </span>
                <Icon size={14} className={isActive ? 'text-nexus-emerald' : 'text-zinc-500'} />
              </div>

              <div className={`text-xs font-bold leading-snug truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                {ch.tabTitle}
              </div>
              <div className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">
                {ch.tabSubtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Studio Hardware Chassis */}
      <div className="relative rounded-3xl border border-white/15 bg-[#030712] shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Subtle Ambient Radial Backlight */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-nexus-emerald/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Chassis Window Topbar */}
        <div className="relative z-10 px-5 py-3.5 bg-[#050B12]/90 backdrop-blur-xl border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-500/40" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500/40" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500/40" />
            
            <div className="ml-3 hidden sm:flex items-center gap-2 text-zinc-400">
              <FileCode size={13} className="text-nexus-emerald" />
              <span className="text-zinc-200 font-semibold font-mono text-[11px]">
                ContractGuard_Studio_v2.4_Audit.docx
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 text-zinc-400">
                100% IN-RAM
              </span>
            </div>
          </div>

          {/* Right Status & Playback Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-nexus-emerald font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-nexus-emerald animate-pulse" />
              <span>0 CLOUD PACKETS • LOCAL SANDBOX</span>
            </div>

            {/* Play/Pause & Arrow Nav */}
            <div className="flex items-center gap-1 bg-white/[0.05] border border-white/10 rounded-xl p-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} className="text-nexus-emerald" />}
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Chapter Slide Viewport with Smooth Animated Transitions */}
        <div className="relative z-10 p-6 md:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >

              {/* Left Column: Visual Interactive Simulation Screen (7 cols) */}
              <div className="lg:col-span-7 bg-[#050914] rounded-2xl border border-white/10 p-5 md:p-6 shadow-inner relative overflow-hidden">
                
                {/* Visual Header Tag */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      activeChapter.badgeType === 'danger'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : activeChapter.badgeType === 'warning'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : activeChapter.badgeType === 'cyan'
                        ? 'bg-nexus-cyan/15 text-nexus-cyan border border-nexus-cyan/30'
                        : 'bg-emerald-500/15 text-nexus-emerald border border-emerald-500/30'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {activeChapter.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Parsed in {activeChapter.speed}
                  </span>
                </div>

                {/* 1. Chapter Specific Interactive Previews */}

                {/* SLIDE 1: LIABILITY RECONCILER */}
                {activeChapter.id === 'liability' && (
                  <div className="space-y-3.5 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-zinc-200">SECTION 11.2 — AGGREGATE LIABILITY CAP</span>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          FEES CAPPED AT $50,000
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[13px] leading-relaxed font-sans">
                        "In no event shall either party's total aggregate liability arising out of or related to this Agreement exceed <span className="text-amber-300 bg-amber-500/20 px-1 py-0.5 rounded font-mono font-bold">the total fees paid in the preceding twelve (12) months</span>."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-zinc-200">SECTION 14.1 — IP & THIRD-PARTY INDEMNIFICATION</span>
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                          POTENTIAL $5,000,000 EXPOSURE
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[13px] leading-relaxed font-sans">
                        "Vendor shall defend, indemnify, and hold harmless Client against any claims, losses, or judgments <span className="text-rose-300 bg-rose-500/20 px-1 py-0.5 rounded font-mono font-bold">up to Five Million Dollars ($5,000,000)</span> arising from intellectual property infringement."
                      </p>
                    </div>

                    {/* Interactive Solution Accordion */}
                    <div className={`p-4 rounded-xl transition-all duration-300 border ${
                      reconciled 
                        ? 'bg-nexus-emerald/10 border-nexus-emerald/40 shadow-[0_0_20px_rgba(0,255,157,0.15)]' 
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {reconciled ? (
                            <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                          ) : (
                            <AlertTriangle size={16} className="text-rose-400 shrink-0" />
                          )}
                          <span className={`font-bold text-xs ${reconciled ? 'text-nexus-emerald' : 'text-rose-300'}`}>
                            {reconciled ? 'CARVE-OUT HARMONIZED & SECURED' : 'FATAL DRAFTING GAP: MISSING EXPRESS CARVE-OUT'}
                          </span>
                        </div>
                        <button
                          onClick={() => setReconciled(!reconciled)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                            reconciled
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-nexus-emerald text-black hover:bg-white font-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                          }`}
                        >
                          {reconciled ? 'Reset Demo' : '⚡ 1-Click Harmonize'}
                        </button>
                      </div>

                      <p className="text-[11px] text-zinc-300 mt-2 font-sans leading-relaxed">
                        {reconciled
                          ? 'Express Carve-Out Rider inserted: "Notwithstanding Section 11.2, indemnity obligations under Section 14.1 shall not be subject to any monetary liability ceiling."'
                          : 'Without an express carve-out, Delaware & New York courts routinely enforce the $50k cap on your $5M indemnity, gutting client recovery.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE 2: FORENSIC REDLINE DIFF */}
                {activeChapter.id === 'diff' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[10px] text-zinc-400 font-bold mb-1.5 flex items-center justify-between">
                          <span>ORIGINAL (DRAFT V3)</span>
                          <span className="text-zinc-500">11:42 AM</span>
                        </div>
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                          "Buyer may terminate this Agreement upon thirty (30) days notice in the event Seller commits a <span className="bg-white/10 px-1 py-0.5 rounded text-zinc-200">material breach</span> that remains uncured."
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <div className="text-[10px] text-rose-300 font-bold mb-1.5 flex items-center justify-between">
                          <span>COUNTERPARTY CLEAN COPY (V4)</span>
                          <span className="text-rose-400">UNMARKED</span>
                        </div>
                        <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                          "Buyer may terminate this Agreement upon <span className="bg-rose-500/20 text-rose-300 line-through px-1">thirty (30)</span> <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1">ninety (90)</span> days notice <span className="bg-rose-500/20 text-rose-300 line-through px-1">only in Seller's sole discretion</span>."
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-zinc-200 text-xs font-sans">
                          2 Stealth modifications detected (Cure period tripled + Unilateral discretion injected)
                        </span>
                      </div>
                      <span className="text-nexus-cyan font-bold font-mono text-[11px]">
                        0 Discrepancies Missed
                      </span>
                    </div>
                  </div>
                )}

                {/* SLIDE 3: DETERMINISTIC AST AUDIT */}
                {activeChapter.id === 'audit' && (
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white mb-0.5">Section 14.4 Cross-Reference</div>
                        <div className="text-zinc-400 text-[11px] font-sans">Section 8.2 points to Section 14.4 (Deleted during negotiation)</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        DANGLING CITATION
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white mb-0.5">Exhibit C (IP Escrow Protocol)</div>
                        <div className="text-zinc-400 text-[11px] font-sans">Referenced in Section 3.1 but missing from final document binder</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        MISSING ATTACHMENT
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white mb-0.5">Purchase Price Numerical Audit</div>
                        <div className="text-zinc-400 text-[11px] font-sans">Spelled: "Two Hundred Fifty Thousand" vs Digits: "($205,000)"</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        UCC § 3-114 CLASH
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-nexus-emerald">
                      <span>Deterministic Parser Status:</span>
                      <span className="font-bold font-mono">416 / 416 Algorithmic Checks Passed</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 4: 100% IN-RAM PRIVILEGE */}
                {activeChapter.id === 'privacy' && (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-bold text-zinc-300 block mb-2 text-[11px]">
                        CLIENT PRIVILEGED DOCUMENT (LOCAL IN-MEMORY PROCESSING)
                      </span>
                      <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                        "Acme Executive Officer <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/40">[REDACTED_ENTITY_01]</span> (SSN: <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/40">[REDACTED_SSN_8492]</span>) authorizes wiring of <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/40">[REDACTED_FIN_CONSIDERATION]</span> to escrow routing."
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[10px] text-zinc-500">HTTP Calls</div>
                        <div className="text-base font-black text-nexus-emerald font-mono">0</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[10px] text-zinc-500">Cloud Storage</div>
                        <div className="text-base font-black text-nexus-emerald font-mono">0 MB</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <div className="text-[10px] text-zinc-500">ABA Rule 1.6</div>
                        <div className="text-base font-black text-nexus-cyan font-mono">100% PASS</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 5: 50-STATE STATUTORY VAULT */}
                {activeChapter.id === 'vault' && (
                  <div className="space-y-3 font-mono text-xs">
                    {/* State Selector Buttons */}
                    <div className="flex gap-2">
                      {['CA', 'DE', 'NY', 'TX'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setSelectedState(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            selectedState === st
                              ? 'bg-nexus-cyan text-black font-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                          }`}
                        >
                          {st === 'CA' ? 'California (B&P § 16600)' : st === 'DE' ? 'Delaware (DGCL)' : st === 'NY' ? 'New York' : 'Texas'}
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-zinc-200">
                          {selectedState === 'CA' && 'CALIFORNIA RESTRICTIVE COVENANTS AUDIT'}
                          {selectedState === 'DE' && 'DELAWARE GENERAL CORPORATION LAW ACCORD'}
                          {selectedState === 'NY' && 'NEW YORK EMPLOYMENT STANDARDS'}
                          {selectedState === 'TX' && 'TEXAS COVENANTS NOT TO COMPETE ACT'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          selectedState === 'CA'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {selectedState === 'CA' ? 'VOID PER SE & PENALTY' : 'COMPLIANT WITH CARVE-OUTS'}
                        </span>
                      </div>

                      <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                        {selectedState === 'CA' && (
                          'California Business & Professions Code § 16600 & AB 1076 treat non-competes as unlawful per se, imposing statutory penalties. ContractGuard flags the clause and drafts a compliant confidentiality and trade secret substitute.'
                        )}
                        {selectedState === 'DE' && (
                          'Delaware Chancery Court strictly reviews scope reasonableness in sale-of-business covenants. Pre-signing reconciliation ensures geographical limitations are legally defensible.'
                        )}
                        {selectedState === 'NY' && (
                          'New York enforces non-competes only to protect legitimate business interests without imposing undue hardship on employees.'
                        )}
                        {selectedState === 'TX' && (
                          'Texas Business & Commerce Code § 15.50 requires covenant to be ancillary to an otherwise enforceable agreement.'
                        )}
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Editorial Value Proposition & Direct CTAs (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  
                  {/* Category Accent Number & Title */}
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-nexus-emerald">
                    <Sparkles size={14} />
                    <span>CHAPTER {activeChapter.num} • PRE-SIGNING DEFENSE</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-heading font-normal text-white leading-tight mb-3">
                    {activeChapter.headline}
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed font-body mb-6">
                    {activeChapter.summary}
                  </p>

                  {/* High-Impact Stat Highlight */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-zinc-400">Statutory Benchmark</div>
                      <div className="text-xs font-mono font-semibold text-zinc-200 mt-0.5">
                        {activeChapter.statute}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black font-mono text-nexus-emerald">
                        {activeChapter.metricVal}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                        {activeChapter.metricLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Action Suite */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => navigate('/demo')}
                    className="w-full bg-nexus-emerald text-black py-3.5 px-5 rounded-xl font-black text-xs md:text-sm hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(0,255,157,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap size={15} />
                    <span>Test This In Interactive Live Demo</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => navigate('/app/contractcompare')}
                    className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white py-3 px-5 rounded-xl font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <span>Launch Full Air-Gapped Studio</span>
                    <ExternalLink size={13} />
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
