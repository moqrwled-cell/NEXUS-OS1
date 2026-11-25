import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Download, Copy, Check,
  Layers, MapPin, DollarSign, Calendar, FileText, ArrowRight,
  ShieldAlert, RefreshCw, Eye
} from 'lucide-react';

export default function HarmonizerResultsHUD({
  harmonizedData,
  documentTitle = 'Commercial Conveyance',
  onDownloadDocx,
  onCopyRestated,
  onReAuditRestated
}) {
  const [activeTab, setActiveTab] = useState('redline'); // 'redline' | 'clean' | 'anchors' | 'improvements'
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!harmonizedData) return null;

  const {
    restatedText,
    originalAnchors = {},
    verification = {},
    improvements = [],
    diff = {},
    processingTimeMs = 0
  } = harmonizedData;

  const handleCopy = () => {
    if (onCopyRestated) {
      onCopyRestated();
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }
  };

  const handleDownload = async () => {
    if (onDownloadDocx) {
      setIsDownloading(true);
      try {
        await onDownloadDocx();
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in mt-2 font-ui">
      {/* 1. Executive Data Integrity Verdict Bar */}
      <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="text-emerald-400" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
              {verification.statusText || '100% Factual Anchors Preserved'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 tabular-nums">
              {verification.preservedCount || 0} / {verification.totalAnchors || 0} anchors locked · {improvements.length} improvements applied · {processingTimeMs}ms local
            </p>
          </div>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Download restated Word document (.docx)"
          >
            {isDownloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            <span>Word Draft (.docx)</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSuccess ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-zinc-400" />
                <span>Copy Draft</span>
              </>
            )}
          </button>

          {onReAuditRestated && (
            <button
              type="button"
              onClick={onReAuditRestated}
              className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Run Single Draft Audit on the restated text"
            >
              <Eye size={13} className="text-emerald-400" />
              <span>Re-Audit Draft</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Compact Immutable Anchors Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Tax Parcels (APN)',
            value: originalAnchors.parcels?.length > 0 ? originalAnchors.parcels.map(p => p.id).join(', ') : 'N/A'
          },
          {
            label: 'Acreage / Bounds',
            value: originalAnchors.acreages?.length > 0 ? `${originalAnchors.acreages[0].quantity} ${originalAnchors.acreages[0].unit}` : 'Described Tract'
          },
          {
            label: 'Consideration',
            value: originalAnchors.financials?.length > 0 ? originalAnchors.financials[0].raw : 'Mutual Covenants'
          },
          {
            label: 'Closing Date',
            value: originalAnchors.dates?.length > 0 ? originalAnchors.dates[0].raw : 'Per Stipulation'
          }
        ].map((anchor) => (
          <div key={anchor.label} className="px-3.5 py-2.5 rounded-xl bg-[#111115] border border-white/[0.08]">
            <span className="text-[11px] text-zinc-500 block">{anchor.label}</span>
            <span className="text-xs font-mono font-medium text-zinc-200 mt-0.5 block truncate tabular-nums">{anchor.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Studio Tabs Navigation */}
      <div className="flex border-b border-white/[0.08] gap-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('redline')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'redline'
              ? 'border-emerald-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers size={13} />
          <span>Track Changes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clean')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'clean'
              ? 'border-emerald-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText size={13} />
          <span>Clean Draft</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('improvements')}
          className={`px-3.5 py-2 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'improvements'
              ? 'border-emerald-500 text-white font-medium'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles size={13} />
          <span>Applied Polish</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums bg-white/[0.06] text-zinc-300">
            {improvements.length}
          </span>
        </button>
      </div>

      {/* 4. Tab Panels */}
      {activeTab === 'redline' && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Deleted / Replaced Legalese
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                AmLaw 100 Court Addition
              </span>
            </div>
            <span>Myers LCS Comparative Word Tokenization</span>
          </div>

          <div className="font-serif text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {diff?.segments?.map((seg, idx) => {
              if (seg.type === 'removed') {
                return (
                  <span
                    key={idx}
                    className="bg-rose-500/20 text-rose-300 line-through px-1 py-0.5 rounded mx-0.5"
                    title="Deleted archaic or defective drafting"
                  >
                    {seg.value}
                  </span>
                );
              }
              if (seg.type === 'added') {
                return (
                  <span
                    key={idx}
                    className="bg-emerald-500/20 text-emerald-300 underline underline-offset-4 decoration-emerald-400 px-1 py-0.5 rounded mx-0.5 font-medium"
                    title="Polished court-grade covenant"
                  >
                    {seg.value}
                  </span>
                );
              }
              return <span key={idx}>{seg.value}</span>;
            })}
          </div>
        </div>
      )}

      {activeTab === 'clean' && (
        <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-3 border-b border-white/[0.06]">
            <span className="text-zinc-200 font-medium">
              Restated Clean Document
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-zinc-200 text-xs rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedSuccess ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedSuccess ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-legal text-sm leading-[1.8] text-zinc-200 whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 custom-scrollbar bg-[#0E0E12] p-5 rounded-lg border border-white/[0.06]">
            {restatedText}
          </div>
        </div>
      )}

      {activeTab === 'improvements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {improvements.map((imp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {imp.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 uppercase">
                  {imp.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {imp.reason}
              </p>
              <div className="text-[11px] font-mono tabular-nums text-zinc-500 pt-2 border-t border-white/[0.05]">
                {imp.occurrences} instance(s) addressed
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiet Counsel Notice */}
      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
        <ShieldCheck size={13} className="text-zinc-500 shrink-0" />
        <span>All underlying parcel coordinates, acreages, and financial terms are locked. Verify statutory covenants prior to execution.</span>
      </p>
    </div>
  );
}
