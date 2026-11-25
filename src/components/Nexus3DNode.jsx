import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

const AUDIT_CLAUSES = [
  {
    id: 'liability',
    label: 'Liability Cap',
    clauseRef: 'Section 12.1 · Limitation of Liability',
    riskLevel: 'Critical',
    riskScore: '$4,500,000 Exposure',
    original: 'Aggregate liability of either party under this Master Agreement shall not exceed the total fees paid or payable in the prior twelve (12) months ($5,000,000 USD).',
    counterparty: 'Aggregate liability of Provider shall not exceed the fees paid in the prior one (1) month ($41,600 USD), excluding gross negligence.',
    finding: 'Stealth 99.1% liability reduction slipped into draft without redline markup.',
    remedy: 'Restore mutual 12-month cap with standard gross negligence carve-outs.'
  },
  {
    id: 'indemnity',
    label: 'IP Indemnity',
    clauseRef: 'Section 15.3 · Third-Party Claims',
    riskLevel: 'High Risk',
    riskScore: 'Unilateral Shift',
    original: 'Provider shall defend, indemnify, and hold harmless Customer against any third-party claims alleging infringement of intellectual property rights.',
    counterparty: 'Customer agrees to indemnify Provider for any patent infringement claims arising from integration or use of the deliverables.',
    finding: 'Reverse indemnity inserted—shifts vendor IP liability onto buyer.',
    remedy: 'Revert to unilateral vendor defense with uncapped IP indemnification.'
  },
  {
    id: 'survival',
    label: 'Survival Cliff',
    clauseRef: 'Section 22.4 · Term & Survival',
    riskLevel: 'Moderate',
    riskScore: 'Extinguishes Warranty',
    original: 'Representations, warranties, and indemnities set forth herein shall survive termination of this Agreement for a period of three (3) years.',
    counterparty: 'Representations and warranties shall expire immediately upon delivery and acceptance of deliverables.',
    finding: 'Immediate termination cliff eliminates post-closing breach recourse.',
    remedy: 'Reinstate statutory 36-month survival term under Delaware practice.'
  }
];

export default function Nexus3DNode() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = AUDIT_CLAUSES[selectedIdx];

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="w-full rounded-xl bg-[#111115] border border-white/[0.08] shadow-2xl overflow-hidden text-left font-sans">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-[#15151A] border-b border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText size={13} className="text-zinc-400" />
            <span className="text-xs font-medium text-zinc-200 tracking-tight">
              Pre-Signing Clause Diagnostic
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>350ms · In-RAM</span>
          </div>
        </div>

        {/* Interactive Clause Selector */}
        <div className="px-4 bg-[#0C0C0F] border-b border-white/[0.06] flex items-center gap-4 overflow-x-auto">
          {AUDIT_CLAUSES.map((clause, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={clause.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 text-zinc-100'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {clause.label}
              </button>
            );
          })}
        </div>

        {/* Clause Diagnostic Body */}
        <div className="p-4 space-y-3 bg-[#09090B]">
          {/* Section & Severity */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-zinc-400">
              {active.clauseRef}
            </span>
            <span className="text-[11px] font-mono font-medium text-rose-400 flex items-center gap-1 tabular-nums">
              <AlertTriangle size={11} />
              <span>{active.riskLevel} · {active.riskScore}</span>
            </span>
          </div>

          {/* Master Draft */}
          <div className="rounded-lg p-3 bg-[#111115] border border-white/[0.06]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>Master Draft (Baseline)</span>
              <span className="text-zinc-400">Standard</span>
            </div>
            <p className="text-[13px] font-legal text-zinc-300 leading-relaxed">
              “{active.original}”
            </p>
          </div>

          {/* Counterparty Alteration */}
          <div className="rounded-lg p-3 bg-[#111115] border border-white/[0.08] border-l-2 border-l-rose-500/80">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-rose-400 mb-1.5">
              <span>Counterparty Revision</span>
              <span>Unmarked Change</span>
            </div>
            <p className="text-[13px] font-legal text-zinc-100 leading-relaxed">
              “{active.counterparty}”
            </p>
          </div>

          {/* Forensic Verdict & Remedy */}
          <div className="rounded-lg p-3 bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 size={12} className="shrink-0" />
              <span>Audit Finding & Recommended Fix</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {active.finding} <span className="text-zinc-400">{active.remedy}</span>
            </p>
          </div>
        </div>

        {/* Footer Audit Metadata Bar */}
        <div className="px-4 py-2.5 bg-[#0C0C0F] border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck size={12} className="text-emerald-500" />
            ABA Model Rule 1.6 Privileged
          </span>
          <span>0 Bytes Transmitted</span>
        </div>
      </div>
    </div>
  );
}
