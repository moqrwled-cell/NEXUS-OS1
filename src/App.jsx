import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  AlertTriangle, 
  ChevronDown, 
  Sparkles, 
  Search, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck,
  Layers,
  FolderLock,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  FileCode,
  SlidersHorizontal,
  XCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import ContactModal from './components/ContactModal';
import { openSeamlessCheckout } from './utils/checkoutPopup';

// Brand Monogram: Authoritative, Architectural Security Monogram
function BrandShieldIcon({ className = "w-9 h-9" }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/25 via-emerald-500/15 to-cyan-500/10 border border-emerald-400/40 shadow-[0_0_25px_rgba(0,255,157,0.25)] shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-emerald-300" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'diff' | 'redact' | 'bates'
  const [simMode, setSimMode] = useState('defective'); // 'defective' | 'verified'

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020608] text-zinc-100 selection:bg-emerald-400 selection:text-black antialiased font-ui">
      
      {/* Background Architectural Grid & Subtle Cyber-Emerald Radiance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[550px] h-[450px] bg-cyan-500/6 blur-[180px] rounded-full pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION: High-Precision Executive Floating Bar                 */}
      {/* ========================================================================= */}
      <header className="fixed w-full z-50 top-0 pt-4 px-4 sm:px-8 max-w-7xl left-1/2 -translate-x-1/2">
        <nav className="w-full py-2.5 px-4 sm:px-6 flex items-center justify-between rounded-2xl bg-[#040A0F]/90 backdrop-blur-2xl backdrop-saturate-180 border border-emerald-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
          
          {/* Brand Logo & Authoritative Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BrandShieldIcon />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Nexus <span className="text-emerald-400">ContractGuard</span>
                </span>
                <span className="hidden md:inline-block font-mono text-[9px] font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                  Air-Gapped v2.4
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase -mt-0.5">
                Local-First Legal Forensics
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-300">
            <button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Forensic Engines
            </button>
            <button onClick={() => scrollToSection('security')} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5">
              <span>ABA Model Rule 1.6</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
            <button onClick={() => scrollToSection('templates')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              AmLaw 100 Vault
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Perpetual Licensing
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              FAQ
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Existing Buyer / Client Sign In */}
            <button 
              onClick={() => navigate('/app/contractcompare')}
              className="hidden sm:flex text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer items-center gap-1"
            >
              <span>Launch Studio</span>
            </button>

            {/* Try Interactive Live Demo */}
            <button 
              onClick={() => navigate('/demo')}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Sparkles size={13} className="text-cyan-400 shrink-0" />
              <span>Live Demo</span>
            </button>

            {/* Direct Purchase / License Trigger */}
            <button 
              onClick={() => scrollToSection('pricing')}
              className="bg-emerald-400 text-black px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,255,157,0.35)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get License</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: Distinctive, Powerful, High-Stakes Legal Authority       */}
      {/* ========================================================================= */}
      <main className="relative z-10 pt-32 sm:pt-40 pb-20">
        <section className="px-5 sm:px-8 max-w-6xl mx-auto text-center mb-16">
          
          {/* Trust Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono uppercase tracking-wider mb-8 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% IN-RAM FORENSIC ENGINE · 0 CLOUD TELEMETRY · ABA RULE 1.6 PRIVILEGED</span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.035em] text-white leading-[1.08] max-w-4xl mx-auto mb-6"
          >
            The $100,000 Typo Killer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-white">
              Pre-Signing Legal Defense in RAM.
            </span>
          </motion.h1>

          {/* Direct, Punchy Value Proposition */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
          >
            Catch fatal contract errors before signing: broken section cross-references, word-to-figure numerical mismatches ($10k vs $100k), and missing exhibits — computed 100% locally in your browser with zero cloud exposure.
          </motion.p>

          {/* Core Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-12"
          >
            {/* Primary Demo Button */}
            <button 
              onClick={() => navigate('/demo')}
              className="bg-emerald-400 text-black px-7 py-3.5 rounded-xl font-black text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,255,157,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>⚡ Try Live Interactive Demo</span>
              <ArrowRight size={16} />
            </button>

            {/* Direct Purchase Button */}
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-6 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Lock size={15} className="text-emerald-400" />
              <span>Get Lifetime License ($199)</span>
            </button>

            {/* Direct Studio Launcher */}
            <button 
              onClick={() => navigate('/app/contractcompare')}
              className="px-5 py-3.5 rounded-xl text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Launch Studio →
            </button>
          </motion.div>

          {/* Verified Micro-Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/[0.08] text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">0 KB</div>
              <div className="text-xs text-zinc-400 mt-1">Uploaded to External Servers</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">&lt; 200ms</div>
              <div className="text-xs text-zinc-400 mt-1">Audit Speed (15k Words)</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">12 Masters</div>
              <div className="text-xs text-zinc-400 mt-1">AmLaw 100 Legal Templates</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">$0 / mo</div>
              <div className="text-xs text-zinc-400 mt-1">Zero Monthly Subscriptions</div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE FORENSIC TERMINAL (Live Defective vs Verified Switcher)    */}
        {/* ========================================================================= */}
        <section className="px-5 sm:px-8 max-w-5xl mx-auto mb-28">
          <div className="rounded-2xl border-2 border-emerald-500/30 bg-[#040A0F] shadow-[0_20px_90px_rgba(0,0,0,0.85)] overflow-hidden">
            
            {/* macOS / Judicial Window Frame */}
            <div className="px-4 py-3 bg-[#03070A] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-zinc-200">
                  Apex_Acquisition_Agreement_Final_v4.docx
                </span>
              </div>

              {/* Interactive Simulation Switcher */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  onClick={() => setSimMode('defective')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simMode === 'defective'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🔴 Defective Counterparty Draft
                </button>
                <button
                  onClick={() => setSimMode('verified')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    simMode === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🟢 Verified with ContractGuard
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[10px] text-emerald-400 font-bold hidden sm:inline">
                  LOCAL RAM AUDIT ACTIVE
                </span>
              </div>
            </div>

            {/* Document Inspection Screen */}
            <div className="p-6 sm:p-8 space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <span className="text-zinc-400">FORENSIC RADAR TELEMETRY</span>
                <span className={`px-2.5 py-0.5 rounded font-bold ${
                  simMode === 'defective' 
                    ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                    : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                }`}>
                  {simMode === 'defective' ? 'RISK SCORE: 88/100 (FATAL DEFECTS)' : 'RISK SCORE: 0/100 (READY TO EXECUTE)'}
                </span>
              </div>

              {simMode === 'defective' ? (
                <>
                  {/* Finding 1: Numerical Mismatch */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs sm:text-sm">SECTION 4.1 — CONSIDERATION & PAYMENT OBLIGATION</span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded uppercase font-bold">
                        Numerical Trap ($45,000 Exposure)
                      </span>
                    </div>
                    <p className="text-zinc-200 font-legal text-sm leading-relaxed mb-2">
                      "Buyer shall pay Seller the purchase price of <span className="bg-amber-500/25 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/40">Two Hundred Fifty Thousand Dollars ($205,000)</span> in three quarterly installments."
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                      <AlertTriangle size={13} className="shrink-0" />
                      <span>Mathematical Contradiction: Written word says $250,000 while numerals state $205,000.</span>
                    </div>
                  </div>

                  {/* Finding 2: Broken Section Cross-Reference */}
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs sm:text-sm">SECTION 11.4 — INDEMNIFICATION SURVIVAL</span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded uppercase font-bold">
                        Broken Section Citation
                      </span>
                    </div>
                    <p className="text-zinc-200 font-legal text-sm leading-relaxed mb-2">
                      "The indemnification covenants in <span className="bg-rose-500/25 text-rose-300 px-1.5 py-0.5 rounded font-bold border border-rose-500/40">Section 19.1</span> shall survive termination of this Agreement for five (5) years."
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>Fatal Citation: Section 19 does not exist in the agreement (agreement ends at Section 14).</span>
                    </div>
                  </div>

                  {/* Finding 3: Missing Exhibit Schedule */}
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs sm:text-sm">SECTION 3.1 — CLOSING CONDITIONS & SCHEDULES</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded uppercase font-bold">
                        Missing Schedule
                      </span>
                    </div>
                    <p className="text-zinc-200 font-legal text-sm leading-relaxed mb-2">
                      "The obligations of Buyer are subject to delivery of all schedules set forth in <span className="bg-cyan-500/25 text-cyan-300 px-1.5 py-0.5 rounded font-bold border border-cyan-500/40">Exhibit C</span>."
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono">
                      <CheckCircle2 size={13} className="shrink-0" />
                      <span>Orphaned Attachment: Exhibit C is referenced as closing condition but omitted from draft.</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                    <CheckCircle size={18} />
                    <span>Automated Pre-Signing Amendment Rider Compiled in RAM</span>
                  </div>
                  <div className="p-4 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-zinc-300 space-y-2">
                    <div className="text-emerald-400 font-bold">AMENDMENT RIDER § 1: CONSIDERATION HARMONIZATION</div>
                    <p>Section 4.1 is hereby amended to clarify that consideration is fixed at Two Hundred Fifty Thousand Dollars ($250,000.00 USD).</p>
                    <div className="text-emerald-400 font-bold pt-2">AMENDMENT RIDER § 2: CITATION RECTIFICATION</div>
                    <p>Section 11.4 cross-reference to "Section 19.1" is hereby corrected to reference "Section 14.2 (Indemnification Procedures)".</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2">
                    <span>Export format: Microsoft Word (.docx) & Certified PDF</span>
                    <span className="text-emerald-400">Audit Status: Defect-Free ✓</span>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400 font-mono">
                  Test your own transaction agreements with zero cloud telemetry.
                </span>
                <button
                  onClick={() => navigate('/demo')}
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                >
                  <span>Open Full Workstation in Demo</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE 3 CORE PILLARS OF DEFENSE                                          */}
        {/* ========================================================================= */}
        <section id="features" className="px-5 sm:px-8 max-w-6xl mx-auto mb-28 scroll-mt-28">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              BUILT FOR AM-LAW 100 RIGOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
              Everything required to verify contracts with mathematical certainty.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-7 rounded-2xl bg-[#040A0F] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Search size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Forensic Cross-Reference & Math Hunter
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Scans thousands of clauses in under a second. Automatically reconciles spelled-out words with parenthetical digits, flags deleted clause citations, and highlights undefined capitalized terms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-emerald-400">
                ✓ Catches $10k vs $100k typo traps
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-2xl bg-[#040A0F] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <EyeOff size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  100% Air-Gapped Privilege Protection
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Complies strictly with ABA Model Rule 1.6(c). Unlike cloud AI tools that upload confidential M&A drafts to remote model servers, ContractGuard computes entirely in local browser RAM with zero network leakage.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-cyan-300">
                ✓ 0 bytes uploaded to external APIs
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-2xl bg-[#040A0F] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <FileCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  AmLaw 100 Templates & Word Export
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Includes 12 institutional transaction templates (Commercial Land PSA, Asset Purchase Agreements, Mutual NDAs, Settlement Releases) and exports 1-click court-grade Pre-Signing Amendment Riders in DOCX and PDF.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-purple-300">
                ✓ Native DOCX Word + PDF Compilation
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 5. THE 4 FLAGSHIP ENGINES (Interactive Tab Switcher)                      */}
        {/* ========================================================================= */}
        <section className="px-5 sm:px-8 max-w-5xl mx-auto mb-28">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Four specialized legal engines in one unified studio.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Select an engine below to inspect how it defends your practice.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[#040A0F] border border-white/10 max-w-2xl mx-auto mb-8">
            {[
              { id: 'audit', label: '1. Forensic Risk Audit', icon: Search },
              { id: 'diff', label: '2. Redline Diff Engine', icon: Layers },
              { id: 'redact', label: '3. Client PII Redactor', icon: EyeOff },
              { id: 'bates', label: '4. Court Bates Stamper', icon: FolderLock },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-400 text-black shadow-md' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#040A0F] border border-white/10 shadow-xl">
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Search size={16} className="text-emerald-400" />
                    Automated Pre-Signing Forensic Integrity Audit
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">100% In-RAM</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Evaluates every section reference, internal citation, exhibit schedule, and monetary figure. 
                  Flags missing schedules, detects conflicting termination periods (e.g. 60 days vs 10 days), and generates an executive client memorandum with actionable statutory remedies.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Cross-Ref Auditor</div>
                    <div className="text-zinc-400 text-[11px]">Catches deleted or orphan section numbers</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Words vs Numbers</div>
                    <div className="text-zinc-400 text-[11px]">Reconciles written sums with digits</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Duty Matrix</div>
                    <div className="text-zinc-400 text-[11px]">Extracts buyer vs seller obligations</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diff' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers size={16} className="text-cyan-400" />
                    Side-by-Side Comparative Redline Diff
                  </h4>
                  <span className="text-[11px] font-mono text-cyan-300">Word / Character Precision</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Compares any two versions of a contract (Original Baseline vs Counterparty Mark-Up).
                  Highlights sneaking indemnity shifts, quiet liability cap alterations, and sneaky additions in green and deletions in red without sending confidential revisions across the internet.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">DOCX & PDF Diffs</div>
                    <div className="text-zinc-400 text-[11px]">Upload Word or PDF drafts directly</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Redline Export</div>
                    <div className="text-zinc-400 text-[11px]">Export formal redline change lists</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Audit Trail</div>
                    <div className="text-zinc-400 text-[11px]">Uncover unauthorized counterparty edits</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'redact' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <EyeOff size={16} className="text-purple-400" />
                    Automated Confidential Client PII Redactor
                  </h4>
                  <span className="text-[11px] font-mono text-purple-300">Judicial Standard</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Sanitizes sensitive personal data prior to court filings or public discovery.
                  Instantly masks Social Security Numbers (SSN), Employer Identification Numbers (EIN), bank wire account details, telephone numbers, and email addresses with court-grade redaction blocks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Wire & Bank Data</div>
                    <div className="text-zinc-400 text-[11px]">Protects routing & account numbers</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Tax IDs (EIN/SSN)</div>
                    <div className="text-zinc-400 text-[11px]">Automatic federal format masking</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Court PDF Export</div>
                    <div className="text-zinc-400 text-[11px]">Compiles certified redacted PDF in RAM</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bates' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderLock size={16} className="text-emerald-400" />
                    High-Contrast Litigation Bates Stamping
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400">Federal Discovery Ready</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Stamp discovery document productions client-side with sequential Bates numbering (e.g., PLTF-000001).
                  Features white backing pills to prevent number obliteration over dark contract scans, multi-page batch stamping, and direct court-grade PDF download.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Custom Prefixes</div>
                    <div className="text-zinc-400 text-[11px]">DEF-, PLTF-, CONFID-, EX-</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Anti-Clutter Pill</div>
                    <div className="text-zinc-400 text-[11px]">High-contrast background badge</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-0.5">Batch Processing</div>
                    <div className="text-zinc-400 text-[11px]">Stamps 100+ pages in local RAM</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 6. ETHICS & PRIVACY: ABA MODEL RULE 1.6 ARCHITECTURE                      */}
        {/* ========================================================================= */}
        <section id="security" className="px-5 sm:px-8 max-w-6xl mx-auto mb-28 scroll-mt-28">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#050C10] to-[#020608] border border-emerald-500/30 shadow-[0_10px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full">
                LEGAL ETHICS & MALPRACTICE SHIELD
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-4 mb-3">
                Why Law Firms Choose ContractGuard Over Cloud AI.
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                Under ABA Model Rule 1.6(c), attorneys have a strict ethical duty to prevent disclosure of confidential client communications and deal drafts. Uploading client contracts to public cloud AI risks waiving attorney-client privilege.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-emerald-500/40 transition-all">
                <ShieldCheck size={22} className="text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">100% In-Browser Execution</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All grammatical, chronological, and citation algorithms execute in client memory via Web Workers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-all">
                <EyeOff size={22} className="text-cyan-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">Zero Server Telemetry</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero analytics, no remote logging, and no persistent server caching. Disconnect your Wi-Fi — it still audits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-purple-500/40 transition-all">
                <Lock size={22} className="text-purple-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">Zero AI Model Training</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your proprietary transaction structures and negotiation positions are never retained for model training.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. AMLAW 100 TEMPLATES VAULT SHOWCASE                                     */}
        {/* ========================================================================= */}
        <section id="templates" className="px-5 sm:px-8 max-w-6xl mx-auto mb-28 scroll-mt-28">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07131B] via-[#050C12] to-[#030712] border border-white/10 relative overflow-hidden">
            
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                PRE-DRAFTED AM-LAW 100 STANDARD
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
                12 Master AmLaw 100 Institutional Templates.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Pre-configured with Delaware governing law, UCC Article 9 compliance, DTSA whistleblower immunity notices, and statutory California Civil Code § 1542 waivers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { name: 'Commercial Land PSA', cat: 'Real Estate', note: 'FIRPTA & Title Contingency' },
                { name: 'Asset Purchase Agreement (APA)', cat: 'M&A & Corporate', note: 'SEC EDGAR Benchmark Standard' },
                { name: 'Mutual Commercial NDA', cat: 'Corporate & IP', note: 'DTSA 18 U.S.C. § 1833 Notice' },
                { name: 'Master Services Agreement (MSA)', cat: 'Commercial', note: 'Work-Made-For-Hire Assignment' },
                { name: 'Settlement & General Release', cat: 'Litigation', note: 'Cal. Civ. Code § 1542 Waiver' },
                { name: 'Secured Promissory Note', cat: 'Finance', note: 'UCC Article 9 Perfection Ready' },
                { name: 'Commercial Triple Net Lease (NNN)', cat: 'Real Estate', note: 'CAM & Operating Expense Caps' },
                { name: 'Executive Employment Agreement', cat: 'Corporate', note: 'Section 409A Tax Safe-Harbor' },
                { name: 'Statement of Work (SOW)', cat: 'Services', note: 'Milestone Acceptance Protocols' }
              ].map((tmpl, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/6 hover:border-cyan-400/30 transition-all">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">{tmpl.cat}</div>
                  <div className="font-bold text-white text-xs sm:text-sm mt-0.5">{tmpl.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{tmpl.note}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-zinc-400 font-mono">
                Full compile-to-DOCX and PDF generator built directly into the studio.
              </span>
              <button
                onClick={() => navigate('/demo')}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/25 transition-all cursor-pointer"
              >
                Inspect Templates in Demo →
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 8. TRANSPARENT B2B LICENSING (No Subscriptions, Lifetime Access)          */}
        {/* ========================================================================= */}
        <section id="pricing" className="px-5 sm:px-8 max-w-5xl mx-auto mb-28 scroll-mt-28">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              PERPETUAL B2B LICENSING
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4">
              One-time payment. Lifetime ownership.
            </h2>
            <p className="text-xs sm:text-base text-zinc-400 mt-2.5">
              Eliminate recurring $1,500/year cloud subscriptions with permanent, offline cryptographic keys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Plan 1: Solo Practitioner */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#040A0F] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">Solo Practitioner Tier</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">For independent attorneys, counsel, and solo dealmakers.</p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-white font-mono">$199</span>
                    <span className="text-sm text-zinc-500 line-through font-mono">$499</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                      Lifetime Key
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 font-mono">
                    1 Workstation Seat · Zero Monthly Fees
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>1 Lifetime Attorney Workstation Seat</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Unlimited Contract & Agreement Audits</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Broken Citation & Numerical Mismatch Engine</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Pre-Signing Amendment Rider (.docx & .pdf)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>100% In-RAM Local Execution (0 Network Telemetry)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'solo',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={15} className="text-emerald-400" />
                  <span>Purchase Solo License ($199)</span>
                </button>
              </div>
            </div>

            {/* Plan 2: Law Firm Suite (Most Popular) */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#05131A] border-2 border-emerald-400/80 relative shadow-[0_0_50px_rgba(0,255,157,0.2)] flex flex-col justify-between">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                Recommended for Practices
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white">Law Firm & Team Suite</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">For boutique law firms, corporate legal teams, and partners.</p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-emerald-400 font-mono">$299</span>
                    <span className="text-sm text-zinc-500 line-through font-mono">$799</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold">
                      Lifetime Firm Key
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 font-mono">
                    5 Distinct Attorney & Paralegal Workstation Seats
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-zinc-200">
                  <div className="flex items-center gap-2.5 font-semibold text-white">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Up to 5 Attorney & Paralegal Seats Included</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Full 4-in-1 Suite: Audit, Redline Diff, PII, Bates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>12 Master AmLaw 100 Transaction Templates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Court-Grade Bates Stamper & Sensitive PII Redactor</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>White-Label Executive Client Memorandums</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Priority Lifetime Engine Updates & Transfer Support</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'firm',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-emerald-400 text-black hover:bg-white font-black py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,255,157,0.4)] text-xs sm:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={15} />
                  <span>Purchase Law Firm Suite ($299)</span>
                </button>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-xs text-zinc-400 font-mono">
            30-Day Money-Back Guarantee · Instant Cryptographic License Key Delivery · Air-Gapped Verification
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 9. CLIENT FAQ ACCORDION (Clean, Scannable)                                */}
        {/* ========================================================================= */}
        <section id="faq" className="px-5 sm:px-8 max-w-3xl mx-auto mb-28 scroll-mt-28">
          
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Clear answers to practical questions.
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does ContractGuard guarantee client confidentiality under ABA Model Rule 1.6?',
                a: 'All algorithms run 100% in local browser memory via dedicated Web Workers. No text is sent to an external server or cloud AI model, preserving attorney-client privilege without exception.'
              },
              {
                q: 'Can I test my actual contract drafts in the demo before purchasing?',
                a: 'Yes. The interactive demo (/demo) allows you to upload DOCX Word files, PDFs, or paste raw text to experience the full detection engine with zero commitment.'
              },
              {
                q: 'How do the 5 workstation seats in the Law Firm Suite work?',
                a: 'Upon purchase, you immediately receive 5 cryptographic keys. One activates your workstation, and the remaining 4 can be shared with partners, associates, or paralegals.'
              },
              {
                q: 'Can I transfer my license if I upgrade my computer or laptop?',
                a: 'Yes. With a single click inside the settings panel, you can deactivate your workstation and re-activate on your new machine.'
              },
              {
                q: 'Are there any recurring monthly charges or subscription renewals?',
                a: 'No. Both plans are lifetime perpetual licenses with zero recurring fees.'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-[#040A0F] overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown size={16} className={`transform transition-transform text-zinc-400 ${activeFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 sm:px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 10. GRAND CLOSING CALL TO ACTION                                          */}
        {/* ========================================================================= */}
        <section className="px-5 sm:px-8 max-w-5xl mx-auto mb-20 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#06141A] to-[#020608] border border-emerald-500/40 shadow-[0_20px_80px_rgba(0,255,157,0.15)] relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Never sign an unverified contract again.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed mb-8">
              Join boutique law firms and attorneys who turn hours of tedious cross-reference checking into milliseconds of air-gapped certainty.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => navigate('/demo')}
                className="bg-emerald-400 text-black px-7 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,255,157,0.35)] flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Open Free Live Demo</span>
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/12 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                View Lifetime Plans ($199 / $299)
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. CLEAN EXECUTIVE FOOTER                                                */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/8 pt-10 pb-12 px-5 sm:px-8 max-w-6xl mx-auto text-xs text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <BrandShieldIcon className="w-6 h-6" />
              <span className="font-bold text-white text-sm">Nexus ContractGuard</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">Air-Gapped Legal Integrity Studio</span>
            </div>
            
            <div className="flex items-center gap-5 text-xs text-zinc-400">
              <button onClick={() => navigate('/demo')} className="hover:text-white transition-colors cursor-pointer">
                Live Demo
              </button>
              <button onClick={() => navigate('/app/contractcompare')} className="hover:text-white transition-colors cursor-pointer">
                Launch Studio
              </button>
              <button onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">
                Account Sign In
              </button>
              <button onClick={() => setIsContactModalOpen(true)} className="hover:text-emerald-400 transition-colors cursor-pointer">
                Support
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <p>© 2026 Nexus Systems Enterprise. Built with client-side cryptography.</p>
            <p className="font-mono">ABA Model Rule 1.6(c) Confidentiality Standard</p>
          </div>
        </footer>

      </main>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        services={["Nexus ContractGuard Enterprise"]}
      />

    </div>
  );
}
