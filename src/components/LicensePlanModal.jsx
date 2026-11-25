import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Lock, ShieldCheck, User, Building, ArrowRight } from 'lucide-react';

export default function LicensePlanModal({ isOpen, onClose, onSelectPlan }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-[#09090B] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-10 my-auto"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#111115] border-b border-white/[0.06] flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-500 block mb-1">
              Institutional Perpetual Licensing
            </span>
            <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Choose Your Workstation Tier
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
              One-time lifetime key with air-gapped local RAM execution. No recurring SaaS subscriptions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close (Esc)"
          >
            <X size={15} />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solo Practitioner ($199) */}
          <div className="flex flex-col justify-between p-5 rounded-lg bg-[#111115] border border-white/[0.08] hover:border-white/[0.15] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-8 h-8 rounded-md bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-zinc-300">
                  <User size={15} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                  1 Workstation Seat
                </span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-100">Solo Practitioner</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Individual attorneys & boutique transactional counsel
              </p>

              <div className="flex items-baseline gap-1.5 mt-3.5 mb-4">
                <span className="text-2xl font-semibold text-zinc-100 font-mono tabular-nums tracking-tight">$199</span>
                <span className="text-[11px] text-zinc-500">lifetime</span>
              </div>

              <div className="space-y-2 pt-3.5 border-t border-white/[0.06] text-xs">
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited AST Deterministic Audits</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Liability & Indemnity Matrix</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Myers Redline Diff & Counter-Clauses</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Linguistic & Deed Proofreader</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>ABA Model Rule 1.6 Confidentiality</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('solo')}
              className="w-full mt-5 py-2 px-4 rounded-md bg-[#18181B] hover:bg-zinc-800 text-zinc-100 font-medium text-xs border border-white/[0.1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Unlock Solo ($199)</span>
              <ArrowRight size={13} className="text-zinc-400" />
            </button>
          </div>

          {/* Law Firm Suite ($299) */}
          <div className="flex flex-col justify-between p-5 rounded-lg bg-[#111115] border border-emerald-500/35 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Building size={15} />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  Recommended · 5 Seats
                </span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-100">Law Firm Suite</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Partnerships, deal teams & corporate legal departments
              </p>

              <div className="flex items-baseline gap-1.5 mt-3.5 mb-4">
                <span className="text-2xl font-semibold text-zinc-100 font-mono tabular-nums tracking-tight">$299</span>
                <span className="text-[11px] text-emerald-400">5 seats · lifetime</span>
              </div>

              <div className="space-y-2 pt-3.5 border-t border-white/[0.06] text-xs">
                <div className="flex items-start gap-2 text-zinc-200 font-medium">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Everything in Solo Plan included</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>5 Multi-Device Workstation Seats</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Smart PII Scrubber & Redactor</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Court Bates Stamping Suite</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>AmLaw 100 Template Vault + Word Export</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority Institutional Support</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('firm')}
              className="w-full mt-5 py-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Unlock Firm Suite ($299)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0C0C0F] border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span>Zero Data Retention · 30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-zinc-500 shrink-0" />
            <span>Encrypted 256-Bit Whop Checkout</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
