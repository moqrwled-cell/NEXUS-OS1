import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Lock, Shield, ShieldCheck, User, Building, ArrowRight, Sparkles } from 'lucide-react';

export default function LicensePlanModal({ isOpen, onClose, onSelectPlan }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-[#0B0F19] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 z-10 my-auto"
      >
        {/* Top subtle highlight gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium mb-2.5">
              <Shield size={12} className="text-emerald-400" />
              <span>Institutional Licensing</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Choose Your License Tier
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
              Select the plan that fits your practice. Instant cryptographic key issuance with 100% air-gapped offline & web workstation activation.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Plan 1: Solo Practitioner */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all group">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                  <User size={18} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                  1 Seat
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-3">Solo Practitioner</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                For solo attorneys & boutique transactional counsel
              </p>

              <div className="flex items-baseline gap-1 mt-3 mb-4">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">$199</span>
                <span className="text-xs text-zinc-400">/ workstation</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs">
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited AST Deterministic Audits</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Liability & Indemnity Matrix</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Myers Redline Diff & Counter-Clauses</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Linguistic & Deed Proofreader</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>ABA Model Rule 1.6 Confidentiality</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('solo')}
              className="w-full mt-5 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-semibold text-xs border border-zinc-700 hover:border-zinc-500 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Get Solo License ($199)</span>
              <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Plan 2: Law Firm Suite (Recommended) */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-gradient-to-b from-emerald-950/20 to-zinc-900/80 border border-emerald-500/40 relative shadow-lg shadow-emerald-500/5 group">
            {/* Top Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-extrabold tracking-wider uppercase font-mono shadow-md">
              Most Popular · Full Suite
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building size={18} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  5 Team Seats
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-3 flex items-center gap-1.5">
                <span>Law Firm Suite</span>
                <Sparkles size={14} className="text-emerald-400" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                For partnerships, legal departments & law firms
              </p>

              <div className="flex items-baseline gap-1 mt-3 mb-4">
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">$299</span>
                <span className="text-xs text-emerald-400/90 font-medium">/ 5 workstation bundle</span>
              </div>

              <div className="space-y-2 pt-3 border-t border-zinc-800/80 text-xs">
                <div className="flex items-start gap-2 text-zinc-200 font-medium">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Everything in Solo Plan included</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>5 Multi-Device Workstation Seats</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Smart PII Scrubber & Redactor</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Court Bates Stamping Suite</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>AmLaw 100 Template Vault</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-200">
                  <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dedicated Priority Firm Support</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('firm')}
              className="w-full mt-5 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-[0.98]"
            >
              <span>Unlock Firm Suite ($299)</span>
              <ArrowRight size={14} className="text-zinc-950 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Zero Data Retention · 30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-zinc-400 shrink-0" />
            <span>Encrypted 256-Bit Whop Checkout</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
