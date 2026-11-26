import React, { useState, useMemo } from 'react';
import {
  Bookmark, Plus, Copy, Check, Trash2, RotateCcw,
  ShieldCheck, Search, ArrowRight
} from 'lucide-react';
import {
  loadPlaybookClauses,
  addOrUpdatePlaybookClause,
  deletePlaybookClause,
  resetPlaybookDefaults
} from '../utils/clausePlaybookStorage';

export default function ClausePlaybookView({ onSendClauseToAudit }) {
  const [clauses, setClauses] = useState(() => loadPlaybookClauses());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Liability');
  const [newStance, setNewStance] = useState('Firm Standard');
  const [newWhenToUse, setNewWhenToUse] = useState('');
  const [newClauseText, setNewClauseText] = useState('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(clauses.map(c => c.category || 'Custom')));
    return ['All', ...cats];
  }, [clauses]);

  const filteredClauses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return clauses.filter(c => {
      const catOk = selectedCategory === 'All' || c.category === selectedCategory;
      const qOk =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.clauseText.toLowerCase().includes(q) ||
        (c.whenToUse || '').toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [clauses, searchQuery, selectedCategory]);

  const handleCopy = (clause) => {
    navigator.clipboard.writeText(clause.clauseText);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleCreateClause = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClauseText.trim()) return;
    const updated = addOrUpdatePlaybookClause({
      title: newTitle,
      category: newCategory,
      stance: newStance,
      whenToUse: newWhenToUse,
      clauseText: newClauseText
    });
    setClauses(updated);
    setNewTitle('');
    setNewWhenToUse('');
    setNewClauseText('');
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setClauses(deletePlaybookClause(id));
  };

  const handleReset = () => {
    setClauses(resetPlaybookDefaults());
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2.5">
            <Bookmark size={18} className="text-emerald-400" />
            <span>Personal Clause Playbook</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Local Storage · 0 Cloud
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Store your firm-approved fallback language, liability carve-outs, and protective riders privately on this device for daily 1-click insertion during negotiations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Restore Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(v => !v)}
            className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={13} />
            <span>{showAddForm ? 'Cancel' : 'Add Custom Clause'}</span>
          </button>
        </div>
      </div>

      {/* Add Custom Clause Form */}
      {showAddForm && (
        <form onSubmit={handleCreateClause} className="p-5 rounded-xl bg-[#111115] border border-emerald-500/30 space-y-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            Save New Firm Fallback Clause (Stored Locally)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Clause Title (e.g. Texas Choice of Venue)"
              required
              className="bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/50 rounded-md px-3 py-2 text-xs text-zinc-100 outline-none"
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (e.g. Liability, Venue, IP)"
              className="bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/50 rounded-md px-3 py-2 text-xs text-zinc-100 outline-none"
            />
            <input
              type="text"
              value={newStance}
              onChange={(e) => setNewStance(e.target.value)}
              placeholder="Stance (e.g. Client Protection)"
              className="bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/50 rounded-md px-3 py-2 text-xs text-zinc-100 outline-none"
            />
          </div>
          <input
            type="text"
            value={newWhenToUse}
            onChange={(e) => setNewWhenToUse(e.target.value)}
            placeholder="When to use (e.g. Replace vendor unilateral indemnity clause)"
            className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/50 rounded-md px-3 py-2 text-xs text-zinc-100 outline-none"
          />
          <textarea
            value={newClauseText}
            onChange={(e) => setNewClauseText(e.target.value)}
            rows={4}
            required
            placeholder="Paste exact approved legal clause wording..."
            className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/50 rounded-md p-3 text-xs font-legal text-zinc-100 outline-none resize-y"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
            >
              Save to Local Playbook
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <div className="p-3 rounded-lg bg-[#111115] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-white/[0.1] text-white border border-white/[0.12]'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={13} className="text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved clauses..."
            className="w-full bg-[#09090B] border border-white/[0.08] rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
          />
        </div>
      </div>

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
        {filteredClauses.map(clause => (
          <div key={clause.id} className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {clause.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{clause.stance}</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">{clause.title}</h3>
              {clause.whenToUse && (
                <p className="text-[11px] text-zinc-400 leading-relaxed">{clause.whenToUse}</p>
              )}
              <div className="p-3 rounded-lg bg-[#09090B] border border-white/[0.06] font-legal text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
                {clause.clauseText}
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDelete(clause.id)}
                className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                title="Delete clause from local Playbook"
              >
                <Trash2 size={13} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(clause)}
                  className="px-3 py-1.5 rounded-md bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === clause.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedId === clause.id ? 'Copied' : 'Copy Clause'}</span>
                </button>
                {onSendClauseToAudit && (
                  <button
                    type="button"
                    onClick={() => onSendClauseToAudit(clause.clauseText, clause.title)}
                    className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>Test Clause</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
