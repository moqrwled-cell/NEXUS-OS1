import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Lock,
  FileText,
  ChevronDown,
  Scale,
  Search,
  EyeOff,
  Download,
  Key,
  Layers,
  User,
  Building
} from 'lucide-react';
import ContactModal from './components/ContactModal';
import LegalTrustModal from './components/LegalTrustModal';
import Nexus3DNode from './components/Nexus3DNode';
import ContractGuardMasterShowcase from './components/ContractGuardMasterShowcase';
import { openSeamlessCheckout } from './utils/checkoutPopup';

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

  const faqs = [
    {
      q: 'How does ContractGuard protect attorney-client privilege under ABA Model Rule 1.6?',
      a: 'All contract parsing, diffing, PII scrubbing, and PDF generation execute locally inside your browser’s volatile memory (RAM). Zero contract text or metadata leaves your device, preserving confidentiality without third-party cloud BAAs.'
    },
    {
      q: 'Why use a deterministic AST engine instead of ChatGPT or public LLMs?',
      a: 'Probabilistic chatbots predict likely phrasing and can hallucinate citations or overlook subtle numeric typos ($250,000 vs. $205,000). ContractGuard builds an exact structural syntax tree verifying every cross-reference, defined term, exhibit, and dollar parity deterministically.'
    },
    {
      q: 'How does it detect the Liability Cap vs. Indemnity conflict?',
      a: 'When a broad Limitation of Liability clause (e.g., 12 months of fees paid) appears alongside a higher express indemnification obligation ($5,000,000), courts routinely enforce the lower aggregate ceiling unless an express carve-out exists. ContractGuard flags this conflict and generates a Delaware-compliant Amendment Rider.'
    },
    {
      q: 'Can I audit an active agreement free before buying a license?',
      a: 'Yes. The Live Studio gives you 3 unrestricted contract audits right in your browser with no email wall or credit card required—so you can validate findings on your own Word (.docx) or PDF agreements first.'
    },
    {
      q: 'How does lifetime licensing work ($199 vs. $299), and can I move seats?',
      a: 'Both plans are one-time perpetual purchases with zero recurring subscriptions. Solo ($199) binds cryptographically to 1 workstation (transferable with one click when upgrading hardware). Law Firm Suite ($299) unlocks 5 team seats plus PII Redaction, Bates Stamping, and the AmLaw 100 Template Vault.'
    }
  ];

  const capabilities = [
    {
      icon: Search,
      title: 'Cross-Reference & Exhibit Audit',
      desc: 'Traces internal section numbers, sub-clauses, and schedule attachments to catch broken links and missing exhibits before closing.'
    },
    {
      icon: FileText,
      title: 'Numerical & Date Parity',
      desc: 'Reconciles spelled-out consideration against figures under UCC § 3-114 ($250k vs. $205k) and flags backward performance timelines.'
    },
    {
      icon: Scale,
      title: 'Liability & Indemnity Matrix',
      desc: 'Audits interlocking caps, consequential damages waivers, and exclusive remedies to prevent gutted indemnities.'
    },
    {
      icon: Layers,
      title: 'Forensic Redline Diff',
      desc: 'Compares counterparty “clean” drafts word-by-word against your baseline, surfacing unmarked edits and altered cure periods.'
    },
    {
      icon: EyeOff,
      title: 'Client-Side PII Redactor',
      desc: 'Detects SSNs, EINs, bank routing codes, and custom party codenames in local RAM and exports court-grade redacted PDFs.'
    },
    {
      icon: Download,
      title: 'Word Riders & Template Vault',
      desc: 'Exports Pre-Signing Amendment Riders in Microsoft Word (.docx) plus 12 institutional models calibrated with 50-state statutory riders.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 selection:bg-emerald-500 selection:text-black antialiased font-body">
      {/* Unified Quiet Top Navigation */}
      <nav className="fixed w-full z-50 top-0 py-3 px-6 md:px-12 flex justify-between items-center bg-[#09090B]/92 backdrop-blur-md border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
        >
          <img
            src="/brand/logo-horizontal.svg"
            alt="Nexus ContractGuard"
            className="h-7 md:h-8 w-auto object-contain"
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => scrollToSection('studio-preview')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Walkthrough
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('capabilities')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Capabilities
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('comparison')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Comparison
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('security')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Privilege
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pricing')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('faq')}
            className="hover:text-zinc-100 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/app/contractcompare')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-[#111115] hover:bg-zinc-800 border border-white/[0.08] rounded-md transition-colors cursor-pointer"
            title="Sign in with license key"
          >
            <Key size={12} className="text-emerald-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/demo')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Try Free Audit</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-28 md:pt-36 pb-20">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                           */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Value Proposition */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111115] border border-white/[0.08] text-zinc-300 text-[11px] font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero-Cloud Legal Verification · ABA Model Rule 1.6 Compliant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-normal font-serif tracking-tight text-white leading-[1.08] mb-5">
                Pre-Signing Contract Defense.
                <br />
                <span className="text-emerald-400">Verified Locally in Browser RAM.</span>
              </h1>

              <p className="text-base text-zinc-400 leading-relaxed mb-7 max-w-xl">
                Upload or paste any counterparty agreement before closing to catch numerical clerical discrepancies ($250k vs. $205k), dangling cross-references, silent redline edits, and liability cap traps—without transmitting a single byte to external servers.
              </p>

              {/* Direct Try or Buy Actions */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => navigate('/demo')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Try Live Studio Free</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('pricing')}
                  className="px-5 py-3 rounded-lg bg-[#111115] hover:bg-zinc-800/90 border border-white/[0.08] text-zinc-200 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Lock size={14} className="text-zinc-400" />
                  <span>Lifetime Plans ($199 / $299)</span>
                </button>
              </div>

              {/* Quiet Assurance & Functional Sample Deep-Links */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400 mb-8">
                <span className="font-mono text-[11px] text-zinc-400">
                  3 free audits · No credit card or email required
                </span>
                <span className="text-zinc-700 hidden sm:inline">|</span>
                <span className="text-[11px] font-mono text-zinc-500">Test sample:</span>
                <button
                  type="button"
                  onClick={() => navigate('/demo?sample=ma')}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
                >
                  M&amp;A Purchase Agreement
                </button>
                <span className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={() => navigate('/demo?sample=saas')}
                  className="text-[11px] font-mono text-zinc-300 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Enterprise SaaS MSA
                </button>
              </div>

              {/* Crisp Proof Anchors */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]">
                <div>
                  <div className="text-xl sm:text-2xl font-semibold text-white font-mono tabular-nums">0 Bytes</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Uploaded to Cloud</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-semibold text-emerald-400 font-mono tabular-nums">&lt; 350ms</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Deterministic AST Pass</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-semibold text-zinc-200 font-mono">ABA 1.6</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Privilege Preserved</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Clause Proof */}
            <div className="lg:col-span-5">
              <Nexus3DNode />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE WALKTHROUGH SHOWCASE                                       */}
        {/* ========================================================================= */}
        <section id="studio-preview" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
              Live Studio Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-normal font-serif text-white mt-2 tracking-tight">
              Five Verification Engines Under One Roof
            </h2>
            <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
              See how ContractGuard flags liability carve-out conflicts, silent counterparty edits, and state statutory violations directly in local RAM.
            </p>
          </div>

          <ContractGuardMasterShowcase />
        </section>

        {/* ========================================================================= */}
        {/* 3. CORE PRACTITIONER CAPABILITIES (Symmetrical 2x3 Grid)                  */}
        {/* ========================================================================= */}
        <section id="capabilities" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24 scroll-mt-20">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
              Practitioner Suite
            </span>
            <h2 className="text-3xl md:text-4xl font-normal font-serif text-white mt-2 tracking-tight">
              Built for Fast, High-Stakes Transactional Review
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-[#111115] border border-white/[0.08] hover:border-white/[0.14] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-emerald-400 mb-4">
                      <Icon size={17} />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BENCHMARK COMPARISON MATRIX                                            */}
        {/* ========================================================================= */}
        <section id="comparison" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24 scroll-mt-20">
          <div className="rounded-xl bg-[#111115] border border-white/[0.08] p-6 md:p-8 overflow-x-auto">
            <div className="max-w-2xl mb-7">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
                Architectural Comparison
              </span>
              <h2 className="text-2xl md:text-3xl font-normal font-serif text-white mt-1.5">
                How ContractGuard Compares to Existing Workflows
              </h2>
            </div>

            <table className="w-full text-left border-collapse min-w-[640px] text-xs md:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 pr-4">Dimension</th>
                  <th className="py-3 px-4">Manual Review</th>
                  <th className="py-3 px-4">Public Cloud LLMs &amp; Multi-Tenant AI</th>
                  <th className="py-3 pl-4 text-emerald-400 font-semibold">Nexus ContractGuard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-zinc-300">
                <tr>
                  <td className="py-3.5 pr-4 font-medium text-zinc-100">Client Privilege (ABA Rule 1.6)</td>
                  <td className="py-3.5 px-4 text-zinc-400">Maintained locally</td>
                  <td className="py-3.5 px-4 text-zinc-400">External API transmission</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-medium">100% Air-Gapped In-RAM</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium text-zinc-100">Numerical Parity ($250k vs. $205k)</td>
                  <td className="py-3.5 px-4 text-zinc-400">Fatigue-prone</td>
                  <td className="py-3.5 px-4 text-zinc-400">Probabilistic guessing</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-medium">Deterministic UCC § 3-114 Engine</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium text-zinc-100">Cross-References &amp; Schedules</td>
                  <td className="py-3.5 px-4 text-zinc-400">4–8 hours manual check</td>
                  <td className="py-3.5 px-4 text-zinc-400">Surface-level sampling</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-medium">Full AST Graph (&lt; 350ms)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium text-zinc-100">Word (.docx) &amp; Amendment Riders</td>
                  <td className="py-3.5 px-4 text-zinc-400">Drafted manually</td>
                  <td className="py-3.5 px-4 text-zinc-400">Unformatted chat output</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-medium">Native DOCX Ingestion &amp; Export</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-medium text-zinc-100">Cost Model</td>
                  <td className="py-3.5 px-4 text-zinc-400">$350–$600/hr billable time</td>
                  <td className="py-3.5 px-4 text-zinc-400">$1,800+/yr per seat</td>
                  <td className="py-3.5 pl-4 text-emerald-400 font-medium tabular-nums">$199 / $299 One-Time Ownership</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. ETHICS & SECURITY ARCHITECTURE                                         */}
        {/* ========================================================================= */}
        <section id="security" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24 scroll-mt-20">
          <div className="p-8 md:p-10 rounded-xl bg-[#111115] border border-white/[0.08]">
            <div className="max-w-2xl mb-8">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-emerald-400">
                Confidentiality Guarantee
              </span>
              <h2 className="text-2xl md:text-4xl font-normal font-serif text-white mt-2 mb-3">
                Engineered Around ABA Model Rule 1.6
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Attorneys carry an affirmative ethical duty to prevent unauthorized disclosure of client matters. ContractGuard eliminates third-party server risk by running entirely inside local browser RAM.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <Shield size={17} className="text-emerald-400 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">100% Client-Side RAM</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All structural analysis, diffing, and redaction execute locally inside non-blocking Web Workers.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <EyeOff size={17} className="text-zinc-300 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Zero Document Telemetry</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No deal text, party names, or dollar considerations are uploaded, logged, or cached externally.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <Lock size={17} className="text-zinc-300 mb-3" />
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Zero AI Model Training</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Proprietary M&amp;A clauses and settlement terms remain exclusively on your workstation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. STRAIGHTFORWARD PERPETUAL PRICING                                      */}
        {/* ========================================================================= */}
        <section id="pricing" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-24 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
              Institutional Licensing
            </span>
            <h2 className="text-3xl md:text-4xl font-normal font-serif text-white mt-2 tracking-tight">
              One-Time Investment. Perpetual Ownership.
            </h2>
            <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed">
              No recurring annual fees or per-document SaaS surcharges. Purchase once and activate locally across your practice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            {/* Solo Plan Card ($199) */}
            <div className="p-7 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-md bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                    <User size={15} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    1 Workstation Seat
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-zinc-100">Solo Counsel</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  For solo practitioners, General Counsel, and independent transactional advisors.
                </p>

                <div className="my-5 pb-5 border-b border-white/[0.06]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-white font-mono tabular-nums">$199</span>
                    <span className="text-xs text-zinc-500 font-mono">one-time lifetime key</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>1 Dedicated Seat (Instant hardware transfer)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Unlimited AST Integrity, NDA &amp; M&amp;A Audits</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Liability &amp; Indemnity Reconciler + Carve-Out Riders</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Myers Character-Level Redline Diff &amp; Deed Proofreader</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Word (.docx) Rider &amp; Executive Client Memo Export</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'solo',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-[#18181B] hover:bg-zinc-800 border border-white/[0.1] text-zinc-100 font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs cursor-pointer"
                >
                  <Lock size={13} className="text-zinc-400" />
                  <span>Get Solo License ($199)</span>
                  <ArrowRight size={13} className="text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Law Firm Suite ($299) */}
            <div className="p-7 rounded-xl bg-[#111115] border border-emerald-500/35 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <Building size={15} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    Recommended · 5 Team Seats
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-zinc-100">Law Firm Suite</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Complete practice workstation for boutique partnerships and corporate legal teams.
                </p>

                <div className="my-5 pb-5 border-b border-white/[0.06]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-white font-mono tabular-nums">$299</span>
                    <span className="text-xs text-emerald-400 font-mono">5 seats · one-time lifetime</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-300">
                  <div className="flex items-start gap-2.5 text-zinc-100 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Everything in Solo Counsel included</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Up to 5 Attorney &amp; Paralegal Seats</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Smart PII Scrubber &amp; Court-Grade Redacted PDFs</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Court Bates Stamping &amp; Exhibit Binding Suite</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>12 Master AmLaw 100 Templates + Word (.docx) Export</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'firm',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs cursor-pointer"
                >
                  <Lock size={13} />
                  <span>Unlock Law Firm Suite ($299)</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-xs font-mono text-zinc-500">
            Includes future engine updates · 30-day money-back guarantee ·{' '}
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
            >
              Or run 3 free audits first
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CONCISE PRACTITIONER FAQ                                               */}
        {/* ========================================================================= */}
        <section id="faq" className="px-6 md:px-12 lg:px-20 max-w-3xl mx-auto mb-24 scroll-mt-20">
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-zinc-500">
              Questions &amp; Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-normal font-serif text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-white/[0.08] bg-[#111115] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={activeFaq === idx}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-medium text-zinc-100 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform text-zinc-500 ${activeFaq === idx ? 'rotate-180 text-emerald-400' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-4 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.06] pt-3"
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
        {/* 8. QUIET CLOSING CTA                                                      */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-5xl mx-auto mb-20">
          <div className="rounded-xl p-8 md:p-12 bg-[#111115] border border-white/[0.08] text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal font-serif text-white leading-tight mb-3">
              Verify Your Next Agreement Before Signature.
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto mb-7 leading-relaxed">
              Run 3 complete audits free in local browser RAM, or activate a perpetual workstation license in under two minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/demo')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Start Free Interactive Audit</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('pricing')}
                className="px-5 py-2.5 rounded-lg bg-[#09090B] hover:bg-zinc-900 border border-white/[0.08] text-zinc-200 font-medium text-xs md:text-sm transition-colors cursor-pointer"
              >
                View Perpetual Plans ($199 / $299)
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. INSTITUTIONAL FOOTER                                                   */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/[0.06] py-10 px-6 md:px-12 lg:px-20 text-xs text-zinc-500">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-5">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo-horizontal.svg"
                alt="Nexus ContractGuard"
                className="h-6 w-auto object-contain"
              />
              <span className="font-mono text-[10px] text-zinc-500 border border-white/[0.08] px-2 py-0.5 rounded bg-[#111115]">
                v2.4 AIR-GAPPED
              </span>
            </div>

            <div className="text-center md:text-left">
              © 2026 NexusOS Enterprise. Local RAM execution architecture.
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/app/contractcompare')}
                className="text-zinc-300 hover:text-white transition-colors cursor-pointer font-medium"
              >
                Subscriber Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Governance Links */}
          <div className="mt-6 pt-5 border-t border-white/[0.05] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-zinc-500 max-w-5xl mx-auto">
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Privacy Policy (Zero-Cloud)
            </button>
            <span className="text-zinc-800 hidden sm:inline">·</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Terms of Service (EULA)
            </button>
            <span className="text-zinc-800 hidden sm:inline">·</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('security')}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Security Architecture
            </button>
            <span className="text-zinc-800 hidden sm:inline">·</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('refund')}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.05] text-[11px] text-zinc-500 leading-relaxed text-center max-w-4xl mx-auto font-mono">
            Nexus ContractGuard is a deterministic computational verification workstation engineered for transactional counsel. It does not render formal legal advice or replace independent attorney review.
          </div>
        </footer>
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        services={[
          'License Key & Workstation Activation',
          'Pricing & Tier Upgrades (Solo $199 / Firm $299)',
          'Audit Accuracy & Document Support',
          '30-Day Refund & Billing Request',
          'General Inquiry'
        ]}
      />

      <LegalTrustModal
        isOpen={Boolean(legalModalTab)}
        onClose={() => setLegalModalTab(null)}
        initialTab={legalModalTab || 'privacy'}
        onOpenSupport={() => {
          setLegalModalTab(null);
          setIsContactModalOpen(true);
        }}
      />
    </div>
  );
}
