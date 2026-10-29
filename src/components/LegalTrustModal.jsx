import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  HardDrive, 
  Scale, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Database
} from 'lucide-react';

export default function LegalTrustModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'privacy' | 'terms' | 'security' | 'refund'

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-zinc-800 bg-[#080d12] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col font-sans text-zinc-200"
        >
          {/* Header Bar */}
          <div className="px-6 py-4.5 bg-[#04080c] border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Nexus Legal Trust & Compliance Center</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    ABA Model Rule 1.6 Privileged
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Institutional Governance, Zero-Cloud Data Protections & Licensing Terms
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Lock size={13} />
              <span>Privacy Policy (Zero-Cloud)</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Scale size={13} />
              <span>Terms of Service & Licensing (EULA)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Database size={13} />
              <span>Data Storage & Security Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('refund')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'refund'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <CreditCard size={13} />
              <span>Payments & Refund Policy</span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-xs leading-relaxed space-y-6">
            
            {/* ================================================================= */}
            {/* TAB 1: PRIVACY POLICY (ZERO-CLOUD GUARANTEE)                     */}
            {/* ================================================================= */}
            {activeTab === 'privacy' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      The Absolute Zero-Cloud Legal Guarantee
                    </h4>
                    <p className="text-zinc-300 mt-1 leading-normal">
                      ContractGuard is engineered from the ground up to never collect, transmit, intercept, or upload your confidential contract documents. All computational linguistics, diff calculations, Bates numbering, and redactions execute entirely inside your local browser's volatile RAM.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    1. Information We Do NOT Collect
                  </h4>
                  <p className="text-zinc-400">
                    Unlike standard cloud SaaS platforms, we operate with a strict Zero-Knowledge architecture:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-300 pl-2">
                    <li><strong className="text-white">Zero Contract Data:</strong> Draft text, counterparties, purchase prices, indemnification caps, and exhibits are never transmitted to any server or LLM.</li>
                    <li><strong className="text-white">Zero Cloud Model Training:</strong> Your legal work product is never used to train machine learning models.</li>
                    <li><strong className="text-white">Zero Remote Telemetry:</strong> No document hashes, metadata, or PII are logged or stored remotely.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    2. ABA Model Rule 1.6 & Attorney-Client Privilege
                  </h4>
                  <p className="text-zinc-300">
                    Under <strong className="text-emerald-300">American Bar Association (ABA) Model Rule 1.6(c)</strong>, a lawyer shall make reasonable efforts to prevent the inadvertent or unauthorized disclosure of, or unauthorized access to, information relating to the representation of a client. Because ContractGuard operates completely air-gapped without cloud egress, attorney-client privilege and work-product doctrine protections remain uncompromised.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    3. Information Processed for Commercial Orders
                  </h4>
                  <p className="text-zinc-400">
                    When you purchase a license, billing details (credit card, name, address) are processed securely by our Merchant of Record, <strong className="text-white">Whop Inc.</strong>, under PCI-DSS Level 1 certification. Nexus does not store or process payment card numbers directly. We store only your email address and generated cryptographic license key to facilitate re-activation support.
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2: TERMS OF SERVICE & LICENSING (EULA)                       */}
            {/* ================================================================= */}
            {activeTab === 'terms' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/25">
                  <h4 className="font-bold text-white text-sm">
                    End User License Agreement (EULA) & Subscription Rejection
                  </h4>
                  <p className="text-zinc-300 mt-1">
                    Nexus operates on a perpetual lifetime licensing model. We reject predatory recurring subscriptions. You pay once for perpetual usage without recurring monthly seat taxes.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    1. License Grant & Seat Allocation
                  </h4>
                  <div className="space-y-2 text-zinc-300">
                    <p>
                      <strong className="text-white">Solo Practitioner ($199):</strong> Grants one (1) non-exclusive, perpetual, non-transferable license to execute ContractGuard on one (1) designated primary workstation. Includes single-click machine deactivation to migrate to a new computer at any time.
                    </p>
                    <p>
                      <strong className="text-white">Law Firm Suite ($299):</strong> Grants five (5) standalone perpetual license keys for multi-attorney practices, allowing concurrent operation across five (5) independent workstations without shared credentials.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    2. Legal Disclaimer & Practitioner Verification Mandate
                  </h4>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-zinc-300">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-amber-400 mb-1">
                      ⚠️ Mandatory Legal Practice Notice
                    </p>
                    <p>
                      ContractGuard is an institutional forensic contract intelligence and deterministic audit platform. It does not constitute a law firm, nor does it provide formal legal advice or attorney-client representation. Reviewing counsel maintains independent professional authority under applicable bar rules to calibrate statutory provisions, covenants, and remedies prior to execution.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    3. Anti-Piracy & Hardware Fingerprinting
                  </h4>
                  <p className="text-zinc-400">
                    Licenses are bound to your workstation hardware profile using an air-gapped SHA-256 hash calculated in memory. You may deactivate and migrate your license freely from the Workstation Settings console. Unauthorized distribution, key cracking, or reverse-engineering terminates the license grant immediately.
                  </p>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: DATA STORAGE & SECURITY ARCHITECTURE                       */}
            {/* ================================================================= */}
            {activeTab === 'security' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/25">
                  <h4 className="font-bold text-white text-sm">
                    Technical Data Storage Architecture & Zero-Cloud Topology
                  </h4>
                  <p className="text-zinc-300 mt-1">
                    Every document operation is sandboxed locally within browser boundaries. Here is exactly where and how data exists on your workstation:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-300">
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <h5 className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Volatile Browser RAM (Web Workers)
                    </h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      All DOCX extraction (Mammoth), PDF tokenization (pdfjs-dist), and Myers Redline diffing run in isolated web worker threads. Memory is automatically scrubbed by garbage collection upon document clearance or tab close.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <h5 className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Encrypted Local Vault (IndexedDB)
                    </h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Session history in Audit Vault is written strictly to your device's origin-isolated IndexedDB database. Only your local browser instance can read these records. They are never synced to any cloud.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <h5 className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Hardware License Token (localStorage)
                    </h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Your activated license key and machine hash are saved locally to allow offline air-gapped booting without re-entering your key. You can clear this anytime with "Deactivate from this Machine".
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <h5 className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Regulatory Compliance (GDPR / CCPA)
                    </h5>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Because zero contract data crosses geographical borders or enters third-party servers, ContractGuard natively complies with European GDPR, California CCPA, and HIPAA privacy rules by default.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 4: PAYMENTS & REFUND POLICY                                  */}
            {/* ================================================================= */}
            {activeTab === 'refund' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25">
                  <h4 className="font-bold text-white text-sm">
                    Whop Merchant of Record & Digital Fulfillment
                  </h4>
                  <p className="text-zinc-300 mt-1">
                    Payments are processed globally by Whop Inc., ensuring world-class security, instant digital key delivery, and transparent purchasing policies.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    1. Try Before You Buy: 3 Free Unrestricted Evaluations
                  </h4>
                  <p className="text-zinc-300">
                    We believe in complete transparency. We provide every prospective customer with <strong className="text-emerald-400">3 full, unrestricted audit passes</strong> in the interactive demo sandbox before asking for payment. You can test your actual real-world contracts, review the Myers diff, examine the statutory codex, and verify performance prior to completing checkout.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    2. Digital Delivery & Instant License Binding
                  </h4>
                  <p className="text-zinc-300">
                    Upon successful checkout via Whop, your cryptographic license key(s) are generated instantly and bound to your workstation in memory. Your license receipt and keys are immediately available on screen and sent to your purchase email.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    3. Refund Policy for Digital Goods
                  </h4>
                  <p className="text-zinc-400">
                    Due to the irrevocable digital nature of perpetual software license keys, purchases are generally final once keys have been bound and downloaded. However, if you experience a verified technical defect or hardware incompatibility that our engineering team cannot resolve, a full refund will be processed in accordance with Whop Buyer Protection standards. Contact our dedicated support desk at <strong className="text-white">nexus.os.store@gmail.com</strong>.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Contact Bar */}
          <div className="px-6 py-3.5 bg-[#030609] border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 shrink-0">
            <span className="font-mono text-[11px]">
              Direct Legal Support: <a href="mailto:nexus.os.store@gmail.com" className="text-emerald-400 hover:underline">nexus.os.store@gmail.com</a>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Compliance Center
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
