import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, LogOut, FileWarning, ArrowRightLeft, Shield, Download, RefreshCcw } from 'lucide-react';
import * as diffLib from 'diff';

export default function ContractCompare() {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [diffResults, setDiffResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareMode, setCompareMode] = useState('words'); // 'words' or 'lines'

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const goHome = () => {
    navigate('/');
  };

  const processComparison = () => {
    if (!originalText.trim() || !revisedText.trim()) return;
    setIsProcessing(true);
    
    // Simulate slight delay for effect, but diff is instant in browser
    setTimeout(() => {
      let results;
      if (compareMode === 'words') {
        results = diffLib.diffWords(originalText, revisedText);
      } else {
        results = diffLib.diffLines(originalText, revisedText);
      }
      setDiffResults(results);
      setIsProcessing(false);
    }, 400);
  };

  const clearAll = () => {
    setOriginalText('');
    setRevisedText('');
    setDiffResults(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-600/10 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <FileWarning className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus Contract-Compare</h1>
              <p className="text-gray-400 text-sm">Legal Document Diff Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-indigo-400 text-sm bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              <Lock size={14} />
              <span>100% In-Browser (Zero NDA Breaches)</span>
            </div>
            <button 
              onClick={goHome} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <ArrowLeft size={16} /> Back to Nexus
            </button>
          </div>
        </div>

        {!diffResults ? (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Never Miss a Hidden Clause.</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Paste your Original Contract and the Revised Contract below. We will instantly highlight every single addition, deletion, and modification. <strong className="text-indigo-400">Zero data leaves your browser. 100% NDA compliant.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Original Text */}
              <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5 flex flex-col group hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-gray-400" size={20} />
                  <h3 className="font-bold text-lg">Original Contract</h3>
                </div>
                <textarea 
                  className="w-full flex-1 min-h-[400px] bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm leading-relaxed resize-y"
                  placeholder="Paste the original document text here..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                ></textarea>
              </div>

              {/* Revised Text */}
              <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5 flex flex-col group hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-indigo-400" size={20} />
                  <h3 className="font-bold text-lg">Revised Contract</h3>
                </div>
                <textarea 
                  className="w-full flex-1 min-h-[400px] bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm leading-relaxed resize-y"
                  placeholder="Paste the modified document text here..."
                  value={revisedText}
                  onChange={(e) => setRevisedText(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <button 
                  onClick={() => setCompareMode('words')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode === 'words' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Word Level Diff
                </button>
                <button 
                  onClick={() => setCompareMode('lines')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${compareMode === 'lines' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Line Level Diff
                </button>
              </div>

              <button 
                onClick={processComparison}
                disabled={!originalText || !revisedText || isProcessing}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-3"
              >
                {isProcessing ? 'Analyzing...' : <><ArrowRightLeft size={20}/> Compare Contracts</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Shield className="text-indigo-400" />
                  Audit Results
                </h2>
                <div className="flex gap-4 text-sm mt-4">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div> Removed Text</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div> Added Text</span>
                </div>
              </div>
              <button onClick={clearAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <RefreshCcw size={16} /> New Comparison
              </button>
            </div>

            <div className="liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden p-8 shadow-2xl">
              <div className="whitespace-pre-wrap font-mono text-base leading-loose max-h-[70vh] overflow-y-auto custom-scrollbar">
                {diffResults.map((part, index) => {
                  let colorClass = 'text-gray-300'; // default neutral
                  let bgClass = '';
                  let textDecoration = '';

                  if (part.added) {
                    colorClass = 'text-green-300';
                    bgClass = 'bg-green-500/10 border-b-2 border-green-500/50';
                  } else if (part.removed) {
                    colorClass = 'text-red-400';
                    bgClass = 'bg-red-500/10';
                    textDecoration = 'line-through opacity-70';
                  }

                  return (
                    <span 
                      key={index} 
                      className={`${colorClass} ${bgClass} ${textDecoration} rounded-sm px-[2px] transition-colors`}
                    >
                      {part.value}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
