import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Copy, Check, Download, FileDown, 
  Sparkles, ArrowRight, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { LEGAL_TEMPLATES, TEMPLATE_CATEGORIES, compileTemplateText } from '../utils/legalTemplatesVault';
import { downloadRedactedPDF } from '../utils/redactedPdfGenerator';

export default function LegalTemplatesView({ onSendToAudit }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateValues, setTemplateValues] = useState({});
  const [copiedContract, setCopiedContract] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const selectedTemplate = useMemo(() => {
    return LEGAL_TEMPLATES.find(t => t.id === selectedTemplateId) || null;
  }, [selectedTemplateId]);

  // Filter templates by category and search
  const filteredTemplates = useMemo(() => {
    return LEGAL_TEMPLATES.filter(tpl => {
      const matchCat = selectedCategory === 'all' || tpl.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // When opening a template, seed default values
  const handleOpenTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    const initialVals = {};
    (tpl.variables || []).forEach(v => {
      initialVals[v.key] = v.defaultVal || '';
    });
    setTemplateValues(initialVals);
  };

  const handleVariableChange = (key, val) => {
    setTemplateValues(prev => ({ ...prev, [key]: val }));
  };

  // Live compiled text
  const compiledText = useMemo(() => {
    if (!selectedTemplate) return '';
    return compileTemplateText(selectedTemplate, templateValues);
  }, [selectedTemplate, templateValues]);

  const handleCopyText = () => {
    if (!compiledText) return;
    navigator.clipboard.writeText(compiledText);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2500);
  };

  const handleDownloadPdf = async () => {
    if (!compiledText || !selectedTemplate) return;
    setIsGeneratingPdf(true);
    try {
      await downloadRedactedPDF(compiledText, {
        title: selectedTemplate.title,
        jurisdiction: selectedTemplate.jurisdiction || 'United States Commercial Law',
        isDraft: true,
        totalRedactions: 0,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    } catch (err) {
      alert('PDF generation error: ' + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!compiledText || !selectedTemplate) return;
    const blob = new Blob([compiledText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.id}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // If a template is actively selected: render Split-Screen Quick-Fill Editor
  if (selectedTemplate) {
    return (
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl liquid-glass border border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTemplateId(null)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Catalog
            </button>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{selectedTemplate.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AmLaw 100 Standard
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                {selectedTemplate.titleAr} · {selectedTemplate.jurisdiction}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedContract ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedContract ? 'Copied to Clipboard! ✓' : 'Copy Full Agreement'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGeneratingPdf ? <RefreshCw className="animate-spin" size={14} /> : <FileDown size={14} />}
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Legal PDF'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-300 border border-zinc-700 transition-all cursor-pointer"
            >
              <Download size={14} />
            </button>

            <button
              onClick={() => onSendToAudit && onSendToAudit(compiledText, selectedTemplate.title)}
              className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Audit in ContractGuard →</span>
            </button>
          </div>
        </div>

        {/* Split Screen Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Column: Quick-Fill Variables Form */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl liquid-glass-strong border border-white/5 p-4 overflow-y-auto custom-scrollbar">
            <div className="mb-4 pb-3 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Contract Variables (Quick-Fill)</span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {selectedTemplate.variables?.length || 0} Fields
                </span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Enter party names, purchase price, property parcel ID, and closing dates to auto-populate the agreement.
              </p>
            </div>

            <div className="space-y-3.5">
              {(selectedTemplate.variables || []).map((v) => (
                <div key={v.key} className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                    {v.label}
                  </label>
                  <input
                    type={v.type === 'date' ? 'date' : 'text'}
                    value={templateValues[v.key] ?? ''}
                    onChange={(e) => handleVariableChange(v.key, e.target.value)}
                    placeholder={v.defaultVal}
                    className="w-full bg-black/60 border border-zinc-700/80 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => {
                  const resetVals = {};
                  (selectedTemplate.variables || []).forEach(v => {
                    resetVals[v.key] = v.defaultVal || '';
                  });
                  setTemplateValues(resetVals);
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Reset to Standard Defaults
              </button>
            </div>
          </div>

          {/* Right Column: Live Compiled Legal Document Preview */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                COMPILED CONTRACT PREVIEW (READY FOR EXECUTION)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {compiledText.split(/\s+/).filter(Boolean).length} Words
              </span>
            </div>

            <div className="flex-1 bg-black/50 p-5 text-xs font-mono leading-relaxed text-zinc-200 overflow-y-auto custom-scrollbar select-text">
              <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-zinc-300">
                {compiledText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise: render Template Catalog & Selection Gallery
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <span>AmLaw 100 Legal Drafting Vault</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              U.S. Commercial Law
            </span>
          </h2>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            Pre-assembled, battle-tested contract templates complying with Delaware General Corporation Law, the Uniform Commercial Code (UCC), and American real estate jurisprudence. Select a template to customize and auto-populate variables.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {LEGAL_TEMPLATES.length} Institutional Templates
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl liquid-glass border border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] ml-1.5 opacity-70">({cat.labelAr})</span>
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. Land, NDA)..."
            className="w-full bg-black/60 border border-zinc-700 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-emerald-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {tpl.category.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {tpl.variables?.length || 0} Dynamic Fields
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {tpl.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-400/90 font-sans mt-0.5">
                {tpl.titleAr}
              </p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-3">
                {tpl.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-500">
                {tpl.jurisdiction}
              </span>
              <button
                onClick={() => handleOpenTemplate(tpl)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Customize & Generate</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
