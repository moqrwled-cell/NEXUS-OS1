import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  FileText, 
  AlertTriangle, 
  ChevronDown, 
  Scale, 
  Search, 
  EyeOff, 
  AlertCircle, 
  Download, 
  CheckCircle, 
  XCircle,
  Key,
  Building2,
  Zap,
  FileCheck
} from 'lucide-react';
import ContactModal from './components/ContactModal';
import LegalTrustModal from './components/LegalTrustModal';
import Nexus3DNode from './components/Nexus3DNode';
import ContractGuardMasterShowcase from './components/ContractGuardMasterShowcase';
import { openSeamlessCheckout } from './utils/checkoutPopup';

// Institutional Shield Monogram (Clean, Authoritative, Non-generic)
function BrandMark({ className = "w-9 h-9" }) {
  return (
    <div className={`relative flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0 ${className}`}>
      <Scale size={18} className="text-emerald-400" />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-zinc-100 selection:bg-emerald-500 selection:text-black antialiased font-body">
      
      {/* Background Architectural Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION: Modern High-Precision Navigation                       */}
      {/* ========================================================================= */}
      <nav className="fixed w-full z-50 top-0 py-3 px-6 md:px-12 flex justify-between items-center bg-[#070A0F]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div 
          className="flex items-center gap-3 cursor-pointer group select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img 
            src="/brand/logo-horizontal.svg" 
            alt="Nexus ContractGuard™" 
            className="h-8 md:h-8.5 w-auto object-contain" 
          />
        </div>
        
        {/* Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-zinc-300 font-body">
          <button onClick={() => scrollToSection('studio-preview')} className="hover:text-white transition-colors cursor-pointer">
            Live Studio
          </button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-white transition-colors cursor-pointer">
            Risk Comparison
          </button>
          <button onClick={() => scrollToSection('engines')} className="hover:text-white transition-colors cursor-pointer">
            5-in-1 Engines
          </button>
          <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
            <span>ABA Rule 1.6</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors cursor-pointer">
            Licensing & Pricing
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">
            FAQ
          </button>
        </div>

        {/* High-Precision Navbar Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button 
            type="button"
            onClick={() => navigate('/app/contractcompare')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-colors cursor-pointer"
            title="Subscriber Sign In with License Key"
          >
            <Key size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">Subscriber Sign In</span>
            <span className="sm:hidden">Sign In</span>
          </button>

          <button 
            onClick={() => navigate('/demo')}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-lg text-xs font-semibold active:scale-[0.98] transition-colors flex items-center gap-1.5 cursor-pointer font-body border-t border-white/25"
          >
            <span>Audit Contract Free</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-28 md:pt-36 pb-24">
        
        {/* ========================================================================= */}
        {/* 2. HERO SECTION: Professional, Authoritative & Laser-Focused               */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            
            <div className="flex-1 max-w-2xl">
              
              {/* Trust & Air-Gapped Compliance Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-emerald-400 text-xs font-mono mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>100% in-RAM air-gapped · ABA Model Rule 1.6 privilege</span>
              </motion.div>

              {/* Master Headline (Instrument Serif - Magazine Editorial Font) */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-normal font-serif tracking-tight text-white leading-[1.08] mb-6"
              >
                Pre-Signing Legal Defense. <br />
                <span className="text-zinc-300 font-serif italic">
                  Never sign a defective contract.
                </span>
              </motion.h1>
              
              {/* Subheadline with Precise Legal Value Proposition */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-zinc-300 leading-relaxed mb-8 font-body max-w-xl"
              >
                A single drafting discrepancy ($250,000 vs $205,000) or missing condition precedent can cost a firm millions and spark malpractice liability. ContractGuard executes forensic pre-signing integrity audits on native Word (.docx) and PDF agreements 100% in-browser RAM in under 350ms. Zero cloud servers. Zero data leakage. Absolute client confidentiality.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3 items-center mb-10 font-body"
              >
                <button 
                  onClick={() => navigate('/demo')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer border-t border-white/20 active:scale-[0.98]"
                >
                  <FileText size={16} />
                  <span>Audit Your First Contract (Free Test)</span>
                  <ArrowRight size={15} />
                </button>

                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="px-5 py-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={14} className="text-zinc-400" />
                  <span>View Lifetime Pricing ($199)</span>
                </button>
                
                {/* Subscriber Portal Quick Entry */}
                <div className="w-full flex items-center gap-2 text-xs font-mono text-zinc-400 pt-1">
                  <Key size={13} className="text-emerald-400" />
                  <span>Already have a license?</span>
                  <button 
                    onClick={() => navigate('/app/contractcompare')}
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer font-medium"
                  >
                    Subscriber Sign In →
                  </button>
                </div>
              </motion.div>

              {/* Verified Metrics Row */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] font-body">
                <div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">0ms</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Network Latency (Zero Cloud)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">100%</div>
                  <div className="text-xs text-zinc-400 mt-0.5">ABA Model Rule 1.6 Privilege</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">350ms</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Forensic In-RAM AST Audit</div>
                </div>
              </div>

            </div>

            {/* Visual 3D Node Element */}
            <div className="w-full lg:w-[460px] h-[360px] lg:h-[460px] relative flex items-center justify-center">
              <Nexus3DNode />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. REAL HIGH-FIDELITY PRODUCT VIEWPORT (Interactive Master Showcase)       */}
        {/* ========================================================================= */}
        <section id="studio-preview" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-10 font-body">
            <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md">
              Forensic audit demonstration · Operative engines
            </span>
            <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-4 tracking-tight">
              Interactive Legal Integrity in Action
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Explore how ContractGuard detects $5M carve-out gaps, character-level stealth alterations, and state statutory conflicts 100% in-browser with zero cloud risk.
            </p>
          </div>

          <ContractGuardMasterShowcase />
        </section>

        {/* ========================================================================= */}
        {/* 4. HIGH-STAKES COMPARISON: Manual Liability vs ContractGuard               */}
        {/* ========================================================================= */}
        <section id="comparison" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-12 font-body">
            <span className="font-mono text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md">
              Litigation risk audit
            </span>
            <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-4">
              Manual Proofreading vs. Air-Gapped Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
            
            {/* The Manual Flawed Way */}
            <div className="p-8 rounded-2xl bg-[#0A0E15] border border-rose-500/20 shadow-md relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Traditional Manual & Cloud AI Proofreading
                  </h3>
                  <span className="text-xs text-rose-400/90 font-mono">
                    Human fatigue + malpractice and privilege risk
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs md:text-sm text-zinc-300">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>4 to 8 billable hours lost manually tracing citations, exhibits, and schedules.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Word-to-number clerical traps ($250,000 vs $205,000) trigger malpractice litigation under UCC § 3-114.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Sending unredacted deal drafts to multi-tenant cloud AI waives attorney-client privilege under ABA Model Rule 1.6.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Sneaky counterparty alterations in "clean" redlines slip past exhausted late-night review.</span>
                </li>
              </ul>
            </div>

            {/* The ContractGuard Enterprise Way */}
            <div className="p-8 rounded-2xl bg-[#0D131C] border border-emerald-500/30 relative shadow-md">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Nexus ContractGuard Enterprise
                  </h3>
                  <span className="text-xs text-emerald-400/90 font-mono">
                    350ms in-RAM audit · 100% air-gapped privilege
                  </span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs md:text-sm text-zinc-200">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>100% deterministic audit of broken citations, cross-references, and missing schedules in &lt; 350ms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Mathematical parity check between spelled-out sums and parenthetical figures prevents UCC drafting traps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>100% in-browser RAM execution ensures zero server uploads, preserving absolute client confidentiality.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Instant character-level redline diff surfaces unmarked counterparty revisions in seconds.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Institutional 3-Way Comparison Matrix Table */}
          <div className="mt-12 rounded-2xl bg-[#090D14] border border-white/10 p-6 md:p-8 overflow-x-auto shadow-xl font-body">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md">
                Delaware & AmLaw 100 benchmark
              </span>
              <h3 className="text-2xl md:text-3xl font-normal font-heading text-white mt-3">
                How ContractGuard Outperforms Traditional Alternatives
              </h3>
            </div>

            <table className="w-full text-left border-collapse min-w-[640px] text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Evaluation Dimension</th>
                  <th className="py-3 px-4">Manual Associate Review</th>
                  <th className="py-3 px-4 text-rose-400">Cloud Legal AI (ChatGPT/Harvey)</th>
                  <th className="py-3 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5 rounded-t-xl">Nexus ContractGuard Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Privilege & Ethics (ABA Rule 1.6)</td>
                  <td className="py-3.5 px-4 text-zinc-400">Maintained (Slow & Fatigued)</td>
                  <td className="py-3.5 px-4 text-rose-400">Severe Waiver & Subpoena Risk</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5">100% In-RAM Air-Gapped (0 Bytes Sent)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Numerical Traps ($250k vs $205k)</td>
                  <td className="py-3.5 px-4 text-zinc-400">Glazed Over at Late Hours</td>
                  <td className="py-3.5 px-4 text-amber-300">Probabilistic & Hallucination-Prone</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5">Deterministic UCC § 3-114 Matcher</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Cross-Reference & Missing Schedules</td>
                  <td className="py-3.5 px-4 text-zinc-400">4–8 Billable Hours Lost</td>
                  <td className="py-3.5 px-4 text-zinc-400">Partial Surface Check</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5">Exhaustive Graph Mapping (&lt; 200ms)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Native Word (.docx) & Track Changes</td>
                  <td className="py-3.5 px-4 text-zinc-400">Manual Track Changes</td>
                  <td className="py-3.5 px-4 text-zinc-400">Messy Plaintext Conversion</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5">Native DOCX Ingestion & Word Export</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Pre-Signing Amendment Rider</td>
                  <td className="py-3.5 px-4 text-zinc-400">Drafted from scratch in Word</td>
                  <td className="py-3.5 px-4 text-zinc-400">Unformatted chat outputs</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5">Auto-Compiled Court-Grade Word (.docx)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">Pricing & Overhead</td>
                  <td className="py-3.5 px-4 text-zinc-400">$350–$600/hr Billable Drain</td>
                  <td className="py-3.5 px-4 text-rose-400">$1,800–$3,000/yr Recurring SaaS</td>
                  <td className="py-3.5 px-4 text-nexus-emerald font-bold bg-nexus-emerald/5 rounded-b-xl">$199 / $299 Perpetual Lifetime License</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. THE 5 SPECIALIZED ENGINES                                              */}
        {/* ========================================================================= */}
        <section id="engines" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-16 font-body">
            <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md">
              Integrated architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-4">
              Five Forensic Engines in One Air-Gapped Studio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-body">
            
            {/* Engine 1 */}
            <div className="p-7 rounded-2xl bg-[#090D14] border border-white/10 shadow-sm hover:border-white/20 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5">
                  <Search size={20} />
                </div>
                <div className="text-xs font-mono text-rose-400 mb-1 font-semibold">Engine 01</div>
                <h3 className="text-base font-bold text-white mb-2">
                  Cross-Reference & Broken Section Validator
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Maps all internal citations, paragraph references, and schedule attachments. Automatically flags deleted clauses and orphaned exhibits.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                ✓ Catches missing Exhibit schedules
              </div>
            </div>

            {/* Engine 2 */}
            <div className="p-7 rounded-2xl bg-[#090D14] border border-white/10 shadow-sm hover:border-white/20 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5">
                  <FileText size={20} />
                </div>
                <div className="text-xs font-mono text-amber-400 mb-1 font-semibold">Engine 02</div>
                <h3 className="text-base font-bold text-white mb-2">
                  Word-to-Number Financial & Calendar Auditor
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Reconciles spelled-out financial sums with numerical digits. Flags backward chronology where delivery dates precede execution dates.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                ✓ Catches $10k vs $100k typo traps
              </div>
            </div>

            {/* Engine 3 */}
            <div className="p-7 rounded-2xl bg-[#090D14] border border-white/10 shadow-sm hover:border-white/20 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5">
                  <AlertTriangle size={20} />
                </div>
                <div className="text-xs font-mono text-violet-400 mb-1 font-semibold">Engine 03</div>
                <h3 className="text-base font-bold text-white mb-2">
                  Defined Terms & Boilerplate Residue Hunter
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Surfaces undefined capitalized terms, duplicate definitions, and incomplete bracketed drafting placeholders before signing.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                ✓ Eliminates [TBD] boilerplate residue
              </div>
            </div>

            {/* Engine 4 */}
            <div className="p-7 rounded-2xl bg-[#090D14] border border-white/10 shadow-sm hover:border-white/20 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                  <Briefcase size={20} />
                </div>
                <div className="text-xs font-mono text-cyan-400 mb-1 font-semibold">Engine 04</div>
                <h3 className="text-base font-bold text-white mb-2">
                  Obligations & Rights Matrix
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Extracts and classifies covenants by contracting party and legal weight (Shall / Must / May).
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                ✓ Party-by-party covenant sorting
              </div>
            </div>

            {/* Engine 5 */}
            <div className="p-7 rounded-2xl bg-[#090D14] border border-white/10 shadow-sm hover:border-white/20 transition-colors flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                  <Download size={20} />
                </div>
                <div className="text-xs font-mono text-emerald-400 mb-1 font-semibold">Engine 05 · White-Label</div>
                <h3 className="text-base font-bold text-white mb-2">
                  1-Click Executive Client Memorandum (PDF & HTML)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Converts technical audit findings into an executive-ready legal memorandum for clients or senior partners, complete with risk matrices, findings breakdowns, and printable court-grade styling.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/5">
                <span>✓ HTML & Clean Print Layout</span>
                <span>✓ Color-Coded Risk Heatmap</span>
                <span>✓ Client-Facing Summary</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. ETHICS & PRIVACY: ABA MODEL RULE 1.6 ARCHITECTURE                      */}
        {/* ========================================================================= */}
        <section id="security" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="p-8 md:p-12 rounded-2xl bg-[#0A0E15] border border-white/10 shadow-md relative overflow-hidden font-body">

            <div className="max-w-3xl mb-10 relative z-10">
              <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md">
                Legal ethics & privilege
              </span>
              <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-4 mb-3">
                Why Boutique Law Firms Trust Nexus ContractGuard
              </h2>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                Under ABA Model Rule 1.6(c), attorneys have an affirmative duty to make reasonable efforts to prevent inadvertent disclosure of confidential client data. Feeding confidential transaction drafts into multi-tenant cloud APIs waives attorney-client privilege.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                <Shield size={20} className="text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">
                  100% In-Browser Execution
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All grammatical, chronological, and citation algorithms execute in client memory.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                <EyeOff size={20} className="text-cyan-400 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Zero Telemetry & Storage
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero analytics, no remote logging, and no persistent cloud caching.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                <Lock size={20} className="text-zinc-300 mb-3" />
                <h4 className="text-sm font-bold text-white mb-1.5">
                  Zero AI Model Training
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your proprietary deal structures and negotiation redlines are never used for model training.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. TRANSPARENT B2B PRICING (Lifetime Ownership, Zero Subscriptions)        */}
        {/* ========================================================================= */}
        <section id="pricing" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-14 font-body">
            {/* Scarcity Allocation Note */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Founder cohort · 184 of 250 perpetual licenses issued</span>
            </div>

            <div className="block">
              <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md">
                Perpetual B2B licensing
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-4">
              One-Time Investment. Lifetime Ownership.
            </h2>
            <p className="text-zinc-300 text-sm md:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
              Why pay recurring $1,800/year cloud subscriptions that expose your client redlines to third-party servers? Own your forensic contract audit workstation outright with zero recurring fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch font-body">
            
            {/* Solo Plan Card - Individual Counsel */}
            <div className="p-8 rounded-2xl bg-[#090D14] border border-white/15 relative flex flex-col justify-between font-body transition-colors group">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-white/[0.08] text-zinc-200 border border-white/15 text-[10px] font-mono font-medium px-3 py-1 rounded-md">
                Individual counsel
              </div>

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white font-body">
                        Solo Counsel Workstation
                      </h3>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Full forensic suite
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Pre-signing contract integrity engine for solo attorneys, General Counsel, and boutique transactional dealmakers.
                    </p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-white font-mono tabular-nums">$199</span>
                    <span className="text-base text-zinc-500 line-through font-mono tabular-nums">$499</span>
                    <span className="text-xs text-zinc-400 font-mono font-medium">
                      Perpetual license
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Amortizes on first transactional review · Zero recurring fees</span>
                  </p>
                  <div className="mt-3 text-xs font-mono text-zinc-300 flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-cyan-400" />
                      <span>48 licenses activated this week</span>
                    </span>
                    <span className="text-zinc-500">Instant hardware binding</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-zinc-300 font-body">
                  <div className="flex items-center gap-2.5 font-medium text-white">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>1 Dedicated High-Performance Seat (Offline Hardware Key)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Unlimited Lifetime Contract, NDA & M&A Audits</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Instant Word-to-Number ($250k vs $205k) Reconciler</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Character-Level Redline Diff & Stealth Alterations Hunter</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Pre-Signing Delaware Express Carve-Out Rider Generator</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>Executive Client Memorandum Export (HTML & Word .docx)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                    <span>100% In-Browser RAM Security (Strict ABA Rule 1.6 Privilege)</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'solo',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs md:text-sm cursor-pointer active:scale-[0.98] font-body border-t border-white/20"
                >
                  <Lock size={14} />
                  <span>Claim Solo Lifetime License ($199)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Law Firm Suite */}
            <div className="p-8 rounded-2xl bg-[#0D131C] border border-emerald-500/30 relative flex flex-col justify-between font-body shadow-md">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-medium px-3 py-1 rounded-md">
                Multi-attorney firm suite
              </div>

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white font-body">
                      Law Firm & Team Suite
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Engineered for boutique transactional practices, corporate legal, and advisory teams.
                    </p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-emerald-400 font-mono tabular-nums">$299</span>
                    <span className="text-base text-zinc-500 line-through font-mono tabular-nums">$799</span>
                    <span className="text-xs text-emerald-400/90 font-mono font-medium">
                      5-Seat perpetual license
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400/90 font-mono mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Saves $1,500+ annually over recurring multi-user cloud subscriptions</span>
                  </p>
                  <div className="mt-3 text-xs font-mono text-zinc-300 flex items-center justify-between bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={12} className="text-emerald-400" />
                      <span>18 multi-seat allocations remaining</span>
                    </span>
                    <span className="text-zinc-500">5-Seat team floating key</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-zinc-200 font-body">
                  <div className="flex items-center gap-2.5 font-medium text-white">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Up to 5 Attorney & Paralegal Seats</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>All 5 Advanced Integrity Engines + Obligations Matrix</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>12 Master AmLaw 100 Transaction Templates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>White-Label Branding on Executive Client Memorandums</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Court Bates Stamping & Sensitive PII Redactor</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Priority Enterprise Support & Engine Updates</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'firm',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs md:text-sm cursor-pointer active:scale-[0.98] font-body border-t border-white/20"
                >
                  <Lock size={14} />
                  <span>Purchase Law Firm Suite ($299)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FREQUENTLY ASKED QUESTIONS (Accordion)                                 */}
        {/* ========================================================================= */}
        <section id="faq" className="px-6 md:px-12 lg:px-20 max-w-4xl mx-auto mb-28 scroll-mt-28 font-body">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-normal font-heading text-white mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 font-body">
            {[
              {
                q: 'How does ContractGuard resolve the catastrophic $5,000,000 Liability Cap vs. Indemnity trap?',
                a: 'In standard commercial agreements, a blanket Limitation of Liability (e.g., aggregate fees paid in the past 12 months = $50,000) routinely contradicts an express $5,000,000 indemnification covenant. Under established Delaware and New York precedent, courts apply the lower liability cap across all claims unless an express carve-out exists. ContractGuard scans cross-clause operative conflicts in 240ms and generates a Delaware-compliant Pre-Signing Express Carve-Out Rider with a single click, protecting client recovery.'
              },
              {
                q: 'Why is deterministic AST verification far safer for attorneys than ChatGPT or probabilistic LLMs?',
                a: 'Generic AI models operate probabilistically—they predict likely words, gloss over contractual contradictions, and hallucinate citations that do not exist. In transactional practice, probabilistic guessing is malpractice liability. ContractGuard constructs a formal Abstract Syntax Tree (AST) that deterministically verifies section cross-references, validates that every referenced Exhibit actually exists, and confirms that spelled-out words match parenthetical digits with 100% mathematical certainty (416/416 verified tests).'
              },
              {
                q: 'How does the Forensic Redline Diff catch sneaky changes slipped into unmarked drafts?',
                a: 'Counterparties sometimes return unmarked "clean" drafts with subtle, high-risk alterations—such as replacing "reasonable efforts" with "sole discretion" or quietly extending cure periods from 30 to 90 days. ContractGuard executes character-level in-RAM forensic diffing in under 180ms, visually mapping every added word in green and deleted term in red so you never execute an unvetted change.'
              },
              {
                q: 'How does the 50-State Statutory Vault protect multi-jurisdictional contracts?',
                a: 'Restrictive covenants and indemnities diverge sharply across state lines. For example, California Business & Professions Code § 16600 and AB 1076 treat employee non-competes as void per se and impose statutory civil penalties, whereas Delaware and Texas apply narrow-tailoring and ancillary restraint rules. ContractGuard cross-checks governing law clauses against state-specific judicial benchmarks in real time, alerting counsel to statutory voids before signing.'
              },
              {
                q: 'How does ContractGuard guarantee 100% privacy and ABA Model Rule 1.6 compliance?',
                a: 'The software executes 100% client-side inside non-blocking Web Workers in local browser RAM. Zero bytes are uploaded to remote servers, external APIs, or public LLMs. Your client’s privileged drafts, confidential consideration amounts, and trade secrets never leave your device memory, perfectly preserving attorney-client privilege under ABA Model Rule 1.6 and state bar cyber-ethics mandates.'
              },
              {
                q: 'Can I audit our active contract drafts for free before purchasing a license?',
                a: 'Yes. We provide 3 complete, unrestricted evaluation passes with zero paywalls. You can upload or paste your active deal drafts right now to experience all 5 audit engines and review real findings before deciding to buy.'
              },
              {
                q: 'How does lifetime licensing work, and can I transfer my seat to a new computer?',
                a: 'We reject predatory recurring subscriptions. You pay a single one-time fee ($199 Solo / $299 Law Firm Suite) for permanent perpetual access with no monthly fees, saving firms upwards of $1,800 annually over legacy recurring cloud tools. Each license binds cryptographically to your workstation and can be deactivated with a single click if you switch laptops. The Law Firm Suite includes 5 independent standalone seat keys for associates and paralegals.'
              },
              {
                q: 'Which file formats and exports are supported?',
                a: 'ContractGuard natively audits Microsoft Word (.docx), digital PDF contracts, and raw text paste. When rectifying contractual defects, it exports court-ready Pre-Signing Amendment Riders in clean Microsoft Word (.docx) format formatted according to AmLaw 100 institutional drafting standards.'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-[#060D12] overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm md:text-base font-bold text-white hover:text-nexus-emerald transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className={`transform transition-transform text-zinc-400 ${activeFaq === idx ? 'rotate-180 text-nexus-emerald' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3"
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
        {/* 9. GRAND CLOSING CALL TO ACTION                                           */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 font-body">
          <div className="relative rounded-2xl p-10 md:p-14 bg-[#090D14] border border-white/10 shadow-xl text-center">
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="font-mono text-xs font-medium text-emerald-400 bg-white/[0.04] border border-white/10 px-3 py-1 rounded-md mb-6 inline-block">
                Pre-signing contract certainty
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal font-heading text-white leading-tight mb-5">
                Never Sign a Defective Contract Again.
              </h2>
              
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto font-body">
                Join modern boutique firms and counsel who transformed contract integrity audits from 6 hours of fatigue into 350 milliseconds of local in-RAM certainty.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3.5 font-body">
                <button
                  onClick={() => navigate('/demo')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer border-t border-white/20 active:scale-[0.98]"
                >
                  <FileText size={16} />
                  <span>Start Free Interactive Audit</span>
                  <ArrowRight size={15} />
                </button>
                
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-6 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={14} className="text-zinc-400" />
                  <span>View Perpetual Plans ($199 / $299)</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>100% In-RAM Audit</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Perpetual Lifetime Key</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>ABA Rule 1.6 Compliant</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. ENTERPRISE FOOTER WITH LEGAL PROTECTION NOTICE                        */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/10 py-10 px-6 md:px-12 lg:px-20 text-xs text-zinc-400 font-body">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/brand/logo-horizontal.svg" 
                alt="Nexus ContractGuard™" 
                className="h-7 w-auto object-contain" 
              />
              <span className="font-mono text-[10px] text-zinc-400 border border-white/10 px-2 py-0.5 rounded bg-white/[0.03]">
                v2.0 AIR-GAPPED
              </span>
            </div>
            <div className="text-center md:text-left">
              © 2026 NexusOS Enterprise. Air-gapped and protected by offline local cryptography.
            </div>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-zinc-400 hover:text-nexus-emerald transition-colors cursor-pointer"
            >
              nexus.os.store@gmail.com
            </button>
          </div>

          {/* Compliance & Trust Verification Links (Privacy, Terms, Security, Refunds) */}
          <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-zinc-400 max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/app/contractcompare')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Key size={12} className="text-emerald-400" />
              <span>Subscriber Sign In</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">•</span>
            <button
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
              <span>Privacy Policy (Zero-Cloud)</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">•</span>

            <button
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
              <span>Terms of Service & Licensing (EULA)</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">•</span>

            <button
              onClick={() => setLegalModalTab('security')}
              className="hover:text-teal-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400/80" />
              <span>Data Storage & Security Architecture</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">•</span>

            <button
              onClick={() => setLegalModalTab('refund')}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              <span>Payments & Refund Policy</span>
            </button>
          </div>

          {/* Legal Protection Shield / Institutional Governance Disclaimer Banner */}
          <div className="mt-6 pt-5 border-t border-white/5 text-[11px] text-zinc-400 leading-relaxed text-center max-w-4xl mx-auto font-mono">
            <p>
              <strong className="text-zinc-300">REGULATORY NOTICE & INSTITUTIONAL DISCLAIMER:</strong> Nexus ContractGuard™ is an institutional forensic contract intelligence and deterministic audit platform engineered for corporate counsel, transactional attorneys, and enterprise dealmakers. ContractGuard delivers computational verification and risk analysis; it does not provide formal legal advice or substitute for reviewing counsel's independent professional judgment. Reviewing counsel retains full discretion in tailoring statutory provisions and executing final transaction terms.
            </p>
          </div>
        </footer>

      </main>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        services={["Nexus ContractGuard Enterprise"]}
      />

      <LegalTrustModal
        isOpen={Boolean(legalModalTab)}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'privacy'}
      />
    </div>
  );
}