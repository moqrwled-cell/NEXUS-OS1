import React, { useMemo, useState } from 'react';
import {
  ShieldAlert, ShieldCheck, Calendar, DollarSign, Copy, Check,
  Mail, Sparkles, PlusCircle, AlertTriangle, Clock, Briefcase
} from 'lucide-react';
import { analyzeDealIntelligence, downloadDealCalendarICS } from '../utils/dealIntelligenceEngine';
import { addOrUpdatePlaybookClause } from '../utils/clausePlaybookStorage';

const ROLE_OPTIONS = [
  { id: 'balanced', label: 'Balanced Review' },
  { id: 'buyer_client', label: 'Acting as Buyer / Client' },
  { id: 'vendor_contractor', label: 'Acting as Vendor / Contractor' }
];

const TYPE_LABELS = {
  services_msa: 'Services / SaaS / Consulting',
  real_estate: 'Real Estate & Leasing',
  nda: 'Confidentiality / NDA',
  employment_contractor: 'Employment / 1099 Contractor',
  corporate_ma: 'Corporate / M&A / LLC',
  lending: 'Promissory Note / Lending',
  settlement: 'Settlement & Release',
  general: 'Commercial Agreement'
};

export default function DealIntelligenceHUD({
  contractText = '',
  auditResults = {},
  contractTitle = '',
  clientParty = '',
  counterparty = '',
  partyRole = 'balanced',
  onPartyRoleChange,
  onInsertClause,
  isDemoMode = false
}) {
  const [copiedKey, setCopiedKey] = useState('');
  const [activeEmailTab, setActiveEmailTab] = useState('opposing'); // opposing | client
  const [insertedId, setInsertedId] = useState('');

  const intel = useMemo(() => {
    return analyzeDealIntelligence({
      text: contractText,
      financialDates: auditResults?.financialDates,
      obligations: auditResults?.obligations,
      risks: auditResults?.risks,
      contractTitle,
      clientParty,
      counterparty,
      partyRole
    });
  }, [contractText, auditResults, contractTitle, clientParty, counterparty, partyRole]);

  const handleCopy = (val, key) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleSaveToPlaybook = (shield) => {
    addOrUpdatePlaybookClause({
      title: shield.title.replace(/^Missing\s+/i, ''),
      category: 'Shield Fallback',
      stance: partyRole === 'buyer_client' ? 'Buyer Protection' : partyRole === 'vendor_contractor' ? 'Vendor Protection' : 'Balanced',
      clauseText: shield.fallbackClause,
      whenToUse: shield.negotiationRationale
    });
    setCopiedKey(`pb-${shield.id}`);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const { economics, missingShields, enrichedRisks, dailyEmails, contractType } = intel;

  return (
    <div className="space-y-4">
      {/* Top Perspective Switcher & Export Bar */}
      <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
              <Briefcase size={14} className="text-emerald-400" />
              Negotiation Perspective & Deal Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
              {TYPE_LABELS[contractType] || 'Commercial Agreement'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Recalibrates risk severity, missing shields, and counter-redlines for your negotiating side in local RAM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#09090B] border border-white/[0.08]">
            {ROLE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onPartyRoleChange && onPartyRoleChange(opt.id)}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  partyRole === opt.id
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              downloadDealCalendarICS({
                economics,
                title: contractTitle || 'Commercial Contract',
                clientParty: clientParty || 'Client',
                counterparty: counterparty || 'Counterparty'
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download standard .ics calendar reminders for Outlook, Apple Calendar, or Google Calendar"
          >
            <Calendar size={13} className="text-emerald-400" />
            <span>Export Deadlines (.ics)</span>
          </button>
        </div>
      </div>

      {/* Deal Economics & Deadlines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>MAX DOLLAR EXPOSURE</span>
            <DollarSign size={13} className="text-emerald-400" />
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 tabular-nums">
            {economics.maxExposure?.raw || 'None Found'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {economics.uniqueMonetaryCount} distinct monetary figures scanned
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>LIABILITY CAP STATUS</span>
            <ShieldAlert size={13} className="text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-zinc-100 mt-1.5 truncate" title={economics.liabilityCapSummary}>
            {economics.liabilityCapSummary}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Cap ceiling extracted from limitation section
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>MISSING SHIELDS</span>
            <AlertTriangle size={13} className={missingShields.length > 0 ? 'text-rose-400' : 'text-emerald-400'} />
          </div>
          <div className={`text-lg font-semibold mt-1 tabular-nums ${missingShields.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {missingShields.length} {missingShields.length === 1 ? 'Gap' : 'Gaps'}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Critical protective clauses omitted from draft
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>NOTICE & CURE WINDOWS</span>
            <Clock size={13} className="text-sky-400" />
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 tabular-nums">
            {economics.noticeWindows.length} Tracked
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {economics.dates.length} dated milestones ready for .ics export
          </p>
        </div>
      </div>

      {/* Notice & Renewal Deadlines Schedule */}
      {(economics.noticeWindows.length > 0 || economics.topAmounts.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <Clock size={13} className="text-sky-400" />
              <span>Extracted Notice, Cure & Renewal Windows</span>
            </h4>
            {economics.noticeWindows.length === 0 ? (
              <p className="text-xs text-zinc-500">No explicit notice/cure day windows found in draft.</p>
            ) : (
              <div className="space-y-2">
                {economics.noticeWindows.map((win, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06] text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-zinc-200">{win.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        win.urgency === 'high' ? 'bg-amber-500/15 text-amber-300' : 'bg-white/[0.05] text-zinc-400'
                      }`}>
                        {win.durationDisplay || win.durationText}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 font-mono truncate">{win.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <DollarSign size={13} className="text-emerald-400" />
              <span>Top Monetary Figures & Obligation Balance</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {economics.topAmounts.length === 0 ? (
                <span className="text-xs text-zinc-500">No explicit dollar amounts detected.</span>
              ) : (
                economics.topAmounts.map((amt, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-[#09090B] border border-white/[0.08] font-mono text-xs text-emerald-300 tabular-nums">
                    {amt.raw}
                  </span>
                ))
              )}
            </div>
            <div className="pt-2 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <div className="font-mono text-sm font-semibold text-zinc-100">{economics.obligationSplit.client}</div>
                <div className="text-[10px] text-zinc-500">Our Side Duties</div>
              </div>
              <div className="p-2 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <div className="font-mono text-sm font-semibold text-zinc-100">{economics.obligationSplit.counterparty}</div>
                <div className="text-[10px] text-zinc-500">Counterparty Duties</div>
              </div>
              <div className="p-2 rounded-lg bg-[#09090B] border border-white/[0.06]">
                <div className="font-mono text-sm font-semibold text-zinc-100">{economics.obligationSplit.mutual}</div>
                <div className="text-[10px] text-zinc-500">Mutual Duties</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missing Protective Shields Audit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
            <ShieldAlert size={14} className="text-rose-400" />
            Missing Protective Clauses Audit (What Was Dangerously Omitted)
          </h4>
        </div>

        {missingShields.length === 0 ? (
          <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck size={18} className="shrink-0" />
            <span>No baseline protective clause omissions detected for this agreement type.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {missingShields.map((shield) => (
              <div
                key={shield.id}
                className={`p-4 rounded-xl bg-[#111115] border border-white/[0.08] border-l-2 ${
                  shield.severity === 'critical' ? 'border-l-rose-500' : shield.severity === 'warning' ? 'border-l-amber-500' : 'border-l-sky-500'
                } space-y-2.5`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                      shield.severity === 'critical'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : shield.severity === 'warning'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    }`}>
                      {shield.severity} gap
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-100">{shield.title}</h5>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(shield.fallbackClause, `copy-${shield.id}`)}
                      className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-[11px] font-medium text-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `copy-${shield.id}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedKey === `copy-${shield.id}` ? 'Copied' : 'Copy Shield'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveToPlaybook(shield)}
                      className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-[11px] font-medium text-zinc-300 flex items-center gap-1 cursor-pointer"
                      title="Save this fallback clause into your personal Playbook"
                    >
                      {copiedKey === `pb-${shield.id}` ? <Check size={11} className="text-emerald-400" /> : <Sparkles size={11} className="text-amber-400" />}
                      <span>{copiedKey === `pb-${shield.id}` ? 'Saved' : '+ Playbook'}</span>
                    </button>

                    {onInsertClause && (
                      <button
                        type="button"
                        onClick={() => {
                          onInsertClause(shield.fallbackClause);
                          setInsertedId(shield.id);
                          setTimeout(() => setInsertedId(''), 2000);
                        }}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle size={11} />
                        <span>{insertedId === shield.id ? 'Inserted!' : 'Insert into Draft'}</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-zinc-100">Plain-English Impact: </strong>
                  {shield.plainEnglishImpact}
                </p>

                <div className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06] font-mono text-[11px] text-emerald-300/90 leading-relaxed">
                  {shield.fallbackClause}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flagged Risk Clauses with 1-Click Counter-Redline */}
      {enrichedRisks.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            Plain-English Risk Impact & Counter-Proposals ({enrichedRisks.length})
          </h4>
          <div className="space-y-2.5">
            {enrichedRisks.slice(0, 6).map((risk, idx) => (
              <div key={risk.id || idx} className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                      risk.adjustedSeverity === 'critical'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : risk.adjustedSeverity === 'warning'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-white/[0.05] text-zinc-400 border-white/[0.08]'
                    }`}>
                      {risk.adjustedSeverity}
                    </span>
                    <span className="text-xs font-semibold text-zinc-100">{risk.phrase}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{risk.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(risk.counterRedlineClause, `cr-${risk.id || idx}`)}
                    className="px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-[11px] text-zinc-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === `cr-${risk.id || idx}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copiedKey === `cr-${risk.id || idx}` ? 'Copied!' : 'Copy Counter-Clause'}</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200">What this costs you: </strong>
                  {risk.plainEnglishImpact}
                </p>
                <div className="p-2.5 rounded-lg bg-[#09090B] border border-white/[0.06] font-mono text-[11px] text-zinc-300 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">Counter-Proposal: </span>
                  {risk.counterRedlineClause}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Ready-to-Send Email Kit */}
      <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-emerald-400" />
            <h4 className="text-xs font-semibold text-zinc-100">Daily Ready-to-Send Negotiation Emails</h4>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveEmailTab('opposing')}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                activeEmailTab === 'opposing' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Opposing Counsel Redline Email
            </button>
            <button
              type="button"
              onClick={() => setActiveEmailTab('client')}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                activeEmailTab === 'client' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Client Executive Brief Email
            </button>
          </div>
        </div>

        <pre className="p-3.5 rounded-lg bg-[#09090B] border border-white/[0.06] text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar select-text">
          {activeEmailTab === 'opposing' ? dailyEmails.opposingCounselEmail : dailyEmails.clientBriefEmail}
        </pre>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              handleCopy(
                activeEmailTab === 'opposing' ? dailyEmails.opposingCounselEmail : dailyEmails.clientBriefEmail,
                `email-${activeEmailTab}`
              )
            }
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            {copiedKey === `email-${activeEmailTab}` ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedKey === `email-${activeEmailTab}` ? 'Copied Email!' : 'Copy Ready Email'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
