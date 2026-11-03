import React, { useState, useRef } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, ArrowRight, Sparkles, Scale, Lock, Eye, ChevronRight } from 'lucide-react';

const AUDIT_CLAUSES = [
  {
    id: 'liability',
    label: 'Liability Cap',
    clauseRef: 'Section 12.1 · Limitation of Liability',
    riskLevel: 'CRITICAL',
    riskScore: '$4,500,000 Unhedged Exposure',
    original: 'Aggregate liability of either party under this Master Agreement shall not exceed the total fees paid or payable in the prior twelve (12) months ($5,000,000 USD).',
    counterparty: 'Aggregate liability of Provider shall not exceed the fees paid in the prior one (1) month ($41,600 USD), excluding gross negligence.',
    finding: 'Stealth 99.1% liability reduction slipped into draft without redline markup.',
    remedy: 'Restored mutual 12-month cap with standard gross negligence carve-outs.'
  },
  {
    id: 'indemnity',
    label: 'IP Indemnity',
    clauseRef: 'Section 15.3 · Third-Party Claims',
    riskLevel: 'HIGH',
    riskScore: 'Unilateral Risk Shift',
    original: 'Provider shall defend, indemnify, and hold harmless Customer against any third-party claims alleging infringement of intellectual property rights.',
    counterparty: 'Customer agrees to indemnify Provider for any patent infringement claims arising from integration or use of the deliverables.',
    finding: 'Reverse indemnity clause inserted—makes buyer liable for vendor IP violations.',
    remedy: 'Reverted to unilateral vendor defense with uncapped defense indemnity.'
  },
  {
    id: 'survival',
    label: 'Survival Cliff',
    clauseRef: 'Section 22.4 · Term & Survival',
    riskLevel: 'MODERATE',
    riskScore: 'Extinguishes Warranty',
    original: 'Representations, warranties, and indemnities set forth herein shall survive termination of this Agreement for a period of three (3) years.',
    counterparty: 'Representations and warranties shall expire immediately upon delivery and acceptance of deliverables.',
    finding: '30-day survival cliff extinguishes all breach-of-contract recourse prematurely.',
    remedy: 'Re-instated statutory 36-month survival term aligned with Delaware law.'
  }
];

export default function Nexus3DNode() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const cardRef = useRef(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const active = AUDIT_CLAUSES[selectedIdx];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Very subtle, prestigious tilt (max 4.5 degrees)
    const tiltX = -((y - centerY) / centerY) * 4.5;
    const tiltY = ((x - centerX) / centerX) * 5.5;

    setRotX(tiltX);
    setRotY(tiltY);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center p-2">
      {/* Luminous Diffuse Ambient Backlight (Warm Emerald/Cyan Glow) */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-emerald-500/12 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none -z-10" />

      {/* Main Interactive High-Caliber Legal Inspector Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="w-full max-w-[460px] rounded-2xl bg-[#0B1017]/95 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl overflow-hidden text-left font-sans select-none"
      >
        {/* Luminous Accent Top Hairline */}
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/30 via-emerald-400 to-cyan-400/40" />

        {/* Header Bar */}
        <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-zinc-500 text-xs">|</span>
            <span className="text-[11px] font-mono font-medium text-zinc-300 tracking-wider">
              FORENSIC CLAUSE INSPECTOR
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>350ms In-RAM AST</span>
          </div>
        </div>

        {/* Interactive Clause Tabs */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 border-b border-white/5 bg-[#080D13]">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mr-1">
            Detect:
          </span>
          {AUDIT_CLAUSES.map((clause, idx) => (
            <button
              key={clause.id}
              onClick={() => setSelectedIdx(idx)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {clause.label}
            </button>
          ))}
        </div>

        {/* Clause Audit Content Body */}
        <div className="p-4 space-y-3">
          {/* Clause Title & Risk Tag */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 font-medium">
              {active.clauseRef}
            </span>
            <span className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-[10px] font-mono font-bold text-red-400 flex items-center gap-1">
              <AlertTriangle size={11} />
              <span>{active.riskLevel} GAP</span>
            </span>
          </div>

          {/* Original Baseline */}
          <div className="rounded-lg p-2.5 bg-black/40 border border-white/5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
              <span className="flex items-center gap-1">
                <FileText size={11} className="text-cyan-400" />
                <span>Firm Master Draft (Baseline)</span>
              </span>
              <span className="text-cyan-400/80 font-semibold">Protected</span>
            </div>
            <p className="text-xs font-sans text-zinc-300 leading-relaxed font-light">
              "{active.original}"
            </p>
          </div>

          {/* Counterparty Stealth Revision with Highlighting */}
          <div className="rounded-lg p-2.5 bg-red-950/20 border border-red-500/25 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-center justify-between text-[10px] font-mono text-red-400 mb-1 pl-1.5">
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle size={11} />
                <span>Counterparty Injected Alteration</span>
              </span>
              <span className="text-amber-400 font-bold">{active.riskScore}</span>
            </div>
            <p className="text-xs font-sans text-zinc-200 leading-relaxed pl-1.5">
              "{active.counterparty}"
            </p>
          </div>

          {/* Forensic Finding & Auto-Remedy */}
          <div className="rounded-lg p-2.5 bg-emerald-950/25 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-400 mb-0.5">
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              <span>ContractGuard Forensic Defense:</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-snug">
              {active.finding}
            </p>
          </div>
        </div>

        {/* Footer Audit Metadata Bar */}
        <div className="px-4 py-2.5 bg-black/50 border-t border-white/10 flex items-center justify-between text-[10.5px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>ABA Rule 1.6 Privileged</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-semibold">0 Cloud Telemetry</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">50-State & Global Common Law</span>
          </div>
        </div>
      </div>
    </div>
  );
}
