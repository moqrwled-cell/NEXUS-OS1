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
        tpl.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.jurisdiction && tpl.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()));
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
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-4 font-ui text-[#0F1B2A]">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedTemplateId(null)}
              className="px-3.5 py-1.5 rounded-xl bg-[#F7F9FA] hover:bg-[#E5EAEF] border border-[#D9E1E7] text-xs font-bold text-[#0F1B2A] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Catalog
            </button>
            <div>
              <h3 className="text-base font-bold text-[#0F1B2A] flex items-center gap-2">
                <span>{selectedTemplate.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#123B5C] border border-[#BFDBFE] font-bold">
                  AmLaw 100 Standard
                </span>
              </h3>
              <p className="text-xs text-[#5A6B7A] mt-0.5">
                {selectedTemplate.jurisdiction}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFFFFF] hover:bg-[#F7F9FA] text-[#0F1B2A] border border-[#D9E1E7] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedContract ? <Check size={14} className="text-[#0E6B52]" /> : <Copy size={14} />}
              <span>{copiedContract ? 'Copied to Clipboard! ✓' : 'Copy Full Agreement'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#123B5C] hover:bg-[#0C2A42] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isGeneratingPdf ? <RefreshCw className="animate-spin" size={14} /> : <FileDown size={14} />}
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Legal PDF'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FFFFFF] hover:bg-[#F7F9FA] text-[#0F1B2A] border border-[#D9E1E7] transition-all cursor-pointer shadow-xs"
              title="Download Plain Text"
            >
              <Download size={14} />
            </button>

            <button
              onClick={() => onSendToAudit && onSendToAudit(compiledText, selectedTemplate.title)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E6B52] hover:bg-[#0A4D3B] text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Audit in ContractGuard →</span>
            </button>
          </div>
        </div>

        {/* Split Screen Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Column: Quick-Fill Variables Form */}
          <div className="lg:col-span-5 flex flex-col rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] p-4 overflow-y-auto custom-scrollbar shadow-xs">
            <div className="mb-4 pb-3 border-b border-[#D9E1E7]">
              <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center justify-between">
                <span>Contract Variables (Quick-Fill)</span>
                <span className="text-[11px] font-mono text-[#5A6B7A]">
                  {selectedTemplate.variables?.length || 0} Fields
                </span>
              </h4>
              <p className="text-xs text-[#5A6B7A] mt-1">
                Edit variables below to update the agreement in real-time.
              </p>
            </div>

            <div className="space-y-3.5 flex-1 pr-1">
              {(selectedTemplate.variables || []).map(v => (
                <div key={v.key} className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono uppercase font-semibold text-[#5A6B7A]">
                    {v.label}
                  </label>
                  <input
                    type={v.type === 'date' ? 'text' : 'text'}
                    value={templateValues[v.key] ?? ''}
                    onChange={(e) => handleVariableChange(v.key, e.target.value)}
                    placeholder={v.defaultVal}
                    className="w-full bg-[#F7F9FA] border border-[#D9E1E7] focus:border-[#123B5C] focus:bg-[#FFFFFF] rounded-xl px-3 py-2 text-xs font-mono text-[#0F1B2A] placeholder-[#5A6B7A] outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Compiled Legal Document Preview (Georgia/Source Serif 4 on white paper) */}
          <div className="lg:col-span-7 flex flex-col rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs overflow-hidden">
            <div className="p-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between">
              <span className="text-xs font-bold text-[#0E6B52] font-ui flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0E6B52]" />
                COMPILED CONTRACT PREVIEW (READY FOR EXECUTION)
              </span>
              <span className="text-[11px] font-mono text-[#5A6B7A]">
                {compiledText.split(/\s+/).filter(Boolean).length} Words
              </span>
            </div>

            <div className="flex-1 bg-[#FFFFFF] p-6 text-sm font-serif leading-relaxed text-[#0F1B2A] overflow-y-auto custom-scrollbar select-text">
              <pre className="whitespace-pre-wrap font-serif text-[13px] leading-relaxed text-[#0F1B2A]">
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
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-6 font-ui text-[#0F1B2A]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-[#0F1B2A] flex items-center gap-3 tracking-tight">
            <span>AmLaw 100 Legal Drafting Vault</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#123B5C] border border-[#BFDBFE] font-bold">
              U.S. Commercial Law
            </span>
          </h2>
          <p className="text-[#5A6B7A] text-xs mt-1 max-w-2xl">
            Pre-assembled, battle-tested contract templates complying with Delaware General Corporation Law, the Uniform Commercial Code (UCC), and American real estate jurisprudence. Select a template to customize and auto-populate variables.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EFF6FF] text-[#123B5C] border border-[#BFDBFE]">
            {LEGAL_TEMPLATES.length} Institutional Templates
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7] hover:bg-[#E5EAEF]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates (e.g. Land, NDA)..."
            className="w-full bg-[#FFFFFF] border border-[#D9E1E7] focus:border-[#123B5C] rounded-xl px-3 py-1.5 text-xs text-[#0F1B2A] placeholder-[#5A6B7A] outline-none transition-all"
          />
        </div>
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col justify-between gap-4 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0FDF4] text-[#0E6B52] border border-[#BBF7D0]">
                  {tpl.category.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-[#5A6B7A]">
                  {tpl.variables?.length || 0} Dynamic Fields
                </span>
              </div>

              <h3 className="text-base font-bold text-[#0F1B2A] group-hover:text-[#123B5C] transition-colors">
                {tpl.title}
              </h3>
              <p className="text-xs text-[#5A6B7A] mt-2 leading-relaxed line-clamp-3">
                {tpl.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#D9E1E7] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#5A6B7A]">
                {tpl.jurisdiction}
              </span>
              <button
                onClick={() => handleOpenTemplate(tpl)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#123B5C] hover:bg-[#0C2A42] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs font-ui"
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
