import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Scale,
  X,
  CreditCard,
  Database,
  AlertCircle
} from 'lucide-react';

const TABS = [
  { id: 'privacy', label: 'Privacy Policy (Zero-Cloud)', icon: Lock },
  { id: 'terms', label: 'Terms of Service (EULA)', icon: Scale },
  { id: 'security', label: 'Security Architecture', icon: Database },
  { id: 'refund', label: 'Refund Policy', icon: CreditCard }
];

export default function LegalTrustModal({ isOpen, onClose, initialTab = 'privacy', onOpenSupport }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync active tab whenever caller opens modal for a specific footer link
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[88vh] rounded-xl border border-white/[0.08] bg-[#09090B] shadow-2xl overflow-hidden flex flex-col font-sans text-zinc-200 z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                    Legal Trust &amp; Compliance Center
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    ABA Model Rule 1.6
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Zero-cloud confidentiality, perpetual EULA licensing, and local storage topology
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close legal compliance modal"
              className="w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          {/* Underline Navigation Tabs */}
          <div className="px-6 bg-[#0C0C0F] border-b border-white/[0.06] flex items-center gap-5 overflow-x-auto custom-scrollbar shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={13} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-xs leading-relaxed space-y-5 bg-[#09090B]">
            {/* TAB 1: PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      Zero-Cloud Confidentiality Guarantee
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Local RAM Only</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    ContractGuard never uploads, collects, intercepts, or transmits your agreements. All AST parsing, redline diffing, Bates stamping, and PII redaction execute inside your browser’s local volatile RAM.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.06] rounded-lg bg-[#111115] border border-white/[0.08]">
                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      1. Information We Do Not Collect
                    </h4>
                    <ul className="space-y-1.5 text-zinc-400">
                      <li>
                        <span className="text-zinc-200 font-medium">Zero Document Content:</span> Draft text, party names, financial figures, and attached schedules never touch external servers or LLM APIs.
                      </li>
                      <li>
                        <span className="text-zinc-200 font-medium">Zero AI Training:</span> Proprietary client structures and negotiation redlines are never used for model training.
                      </li>
                      <li>
                        <span className="text-zinc-200 font-medium">Zero Remote Document Telemetry:</span> Document hashes, file names, and PII stay strictly on your workstation.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      2. ABA Model Rule 1.6 &amp; Work-Product Privilege
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Under <span className="text-zinc-200 font-medium">ABA Model Rule 1.6(c)</span>, counsel must make reasonable efforts to prevent inadvertent disclosure of client representation records. Because execution is strictly client-side with zero cloud egress, attorney-client privilege and work-product doctrines remain intact without third-party BAAs.
                    </p>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      3. Commercial Checkout Records
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Billing credentials are processed exclusively by our PCI-DSS Level 1 Merchant of Record (<span className="text-zinc-200 font-medium">Whop Inc.</span>). Nexus receives only the purchaser email and generated cryptographic license record required for seat activation and recovery.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TERMS OF SERVICE (EULA) */}
            {activeTab === 'terms' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-sky-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                      End User License Agreement (EULA)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Perpetual Grant</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Licenses are granted on a one-time perpetual basis—no recurring annual SaaS seat charges or per-document usage surcharges.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.06] rounded-lg bg-[#111115] border border-white/[0.08]">
                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      1. Seat Scope &amp; Portability
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      <span className="text-zinc-200 font-medium">Solo Counsel ($199):</span> Grants one (1) perpetual workstation seat with single-click hardware deactivation when migrating devices.
                    </p>
                    <p className="text-zinc-400 leading-relaxed">
                      <span className="text-zinc-200 font-medium">Law Firm Suite ($299):</span> Grants five (5) independent perpetual workstation seats for attorneys and paralegals within a firm or legal department, unlocking the PII Redactor, Bates Stamping Suite, and AmLaw 100 Template Vault.
                    </p>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                      <AlertCircle size={13} className="text-amber-400 shrink-0" />
                      <span>2. Independent Counsel Responsibility</span>
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      ContractGuard provides deterministic computational analysis and statutory pattern checks. It does not constitute a law firm or formal legal advice. Reviewing counsel retains sole professional responsibility for final legal judgment and execution terms.
                    </p>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      3. Cryptographic Seat Binding
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Seats bind locally via an in-memory SHA-256 device profile. Seats may be deactivated anytime from Workstation Settings to re-bind to replacement hardware. Unauthorized redistribution or key tampering voids the license grant.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY ARCHITECTURE */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-emerald-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                      Zero-Cloud Storage Topology
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Sandboxed Execution</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Every document ingestion, AST graph build, and export operation executes within browser-enforced memory boundaries on your workstation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-zinc-100 text-xs">Volatile Browser RAM</h5>
                      <span className="text-[10px] font-mono text-emerald-400">Web Workers</span>
                    </div>
                    <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                      DOCX extraction, PDF tokenization, OCR, and Myers diffing run in isolated local threads and clear automatically upon reset or tab closure.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-zinc-100 text-xs">Local Audit Vault</h5>
                      <span className="text-[10px] font-mono text-sky-400">IndexedDB</span>
                    </div>
                    <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                      Saved sessions persist exclusively in origin-isolated IndexedDB on your own disk—never synced to external databases—and support 1-click purge.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-zinc-100 text-xs">Offline Activation Token</h5>
                      <span className="text-[10px] font-mono text-zinc-400">localStorage</span>
                    </div>
                    <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                      Stores your signed hardware token locally so authenticated workstations launch smoothly even in restricted network environments.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-zinc-100 text-xs">Cross-Border Alignment</h5>
                      <span className="text-[10px] font-mono text-zinc-400">GDPR · CCPA</span>
                    </div>
                    <p className="text-zinc-400 text-[11.5px] leading-relaxed">
                      Because client contracts never cross networks or leave local control, data-residency compliance under GDPR and CCPA is maintained by design.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PAYMENTS & REFUND POLICY */}
            {activeTab === 'refund' && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] border-l-2 border-l-amber-500/70 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                      Payments &amp; 30-Day Guarantee
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">Whop Checkout</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Checkout is fulfilled via Whop Inc. with instant cryptographic key issuance and transparent evaluation prior to purchase.
                  </p>
                </div>

                <div className="divide-y divide-white/[0.06] rounded-lg bg-[#111115] border border-white/[0.08]">
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      1. Evaluate Free Before Purchasing
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Every visitor receives <span className="text-emerald-400 font-medium">3 unrestricted evaluations</span> in the live demo sandbox before purchasing—allowing full inspection on real Word (.docx) or PDF agreements with no card required.
                    </p>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      2. Instant Key Delivery &amp; Activation
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Immediately after Whop confirmation, your license key(s) display on screen and arrive at your checkout email for immediate workstation binding.
                    </p>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-xs font-semibold text-zinc-100">
                      3. 30-Day Refund &amp; Defect Protection
                    </h4>
                    <p className="text-zinc-400 leading-relaxed">
                      Perpetual licenses are backed by a <span className="text-zinc-200 font-medium">30-day money-back guarantee</span>. If the workstation exhibits an unresolved compatibility issue or fails to deliver expected functionality within 30 days of purchase, contact support for a full refund through Whop Buyer Protection.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-[#0C0C0F] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 shrink-0">
            <span className="flex items-center gap-2">
              Support Desk:{' '}
              {onOpenSupport ? (
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="text-zinc-300 hover:text-emerald-400 underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Contact Support (nexus.os.store@gmail.com)
                </button>
              ) : (
                <a
                  href="mailto:nexus.os.store@gmail.com"
                  className="text-zinc-300 hover:text-emerald-400 transition-colors"
                >
                  nexus.os.store@gmail.com
                </a>
              )}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
