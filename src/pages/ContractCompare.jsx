import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, ArrowRightLeft, Shield, RefreshCcw, ArrowLeft, AlertTriangle, CheckCircle, FileWarning, Upload } from 'lucide-react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { verifyToolAccess } from '../utils/auth';

// Configure the PDF.js worker using a public CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
const DANGEROUS_PATTERNS = [
  { term: "automatic renewal", category: "Financial", penalty: 15, advice: "Forces you into another billing cycle. Negotiate manual renewal." },
  { term: "auto-renew", category: "Financial", penalty: 15, advice: "Forces you into another billing cycle. Negotiate manual renewal." },
  { term: "perpetual", category: "IP / Rights", penalty: 20, advice: "Grants rights forever. Always negotiate a fixed term." },
  { term: "irrevocable", category: "IP / Rights", penalty: 20, advice: "Cannot be undone. Extremely high risk for your IP." },
  { term: "liquidated damages", category: "Liability", penalty: 25, advice: "Forces you to pay a preset high amount if you breach." },
  { term: "sole discretion", category: "Power imbalance", penalty: 10, advice: "Gives the other party absolute power over a decision." },
  { term: "indemnify", category: "Liability", penalty: 15, advice: "You pay for their legal losses. Ensure there is a liability cap!" },
  { term: "hold harmless", category: "Liability", penalty: 15, advice: "Prevents you from suing them for damages." },
  { term: "without notice", category: "Termination", penalty: 15, advice: "They can terminate or change terms instantly without warning you." },
  { term: "waiver of jury trial", category: "Legal", penalty: 10, advice: "Limits your legal rights in a dispute." },
  { term: "non-compete", category: "Restriction", penalty: 20, advice: "Restricts your future business operations or hiring." }
];

export default function ContractCompare() {
  const navigate = useNavigate();
  const [originalText, setOriginalText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [diffResults, setDiffResults] = useState(null);
  const [auditResults, setAuditResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareMode] = useState('words'); 

  useEffect(() => {
    if (!verifyToolAccess('contractcompare')) navigate('/login');
  }, [navigate]);

  const processComparison = () => {
    if (!originalText.trim() || !revisedText.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      // 1. Run Algorithmic Legal Audit on Revised Text
      let riskScore = 100;
      let foundRisks = [];
      const lowerRevised = revisedText.toLowerCase();
      
      DANGEROUS_PATTERNS.forEach(pattern => {
        if (lowerRevised.includes(pattern.term)) {
          riskScore -= pattern.penalty;
          foundRisks.push(pattern);
        }
      });
      
      if (riskScore < 0) riskScore = 0;
      
      setAuditResults({
        score: riskScore,
        risks: foundRisks
      });

      // 2. Run Advanced Diffing
      const originalArray = compareMode === 'words' ? originalText.split(/(\s+)/) : originalText.split('\n');
      const revisedArray = compareMode === 'words' ? revisedText.split(/(\s+)/) : revisedText.split('\n');
      
      let results = [];
      let i = 0, j = 0;
      
      while (i < originalArray.length || j < revisedArray.length) {
        if (i < originalArray.length && j < revisedArray.length && originalArray[i] === revisedArray[j]) {
          results.push({ value: originalArray[i] + (compareMode === 'lines' ? '\n' : '') });
          i++; j++;
        } else if (j < revisedArray.length && (i >= originalArray.length || !originalArray.includes(revisedArray[j]))) {
          results.push({ added: true, value: revisedArray[j] + (compareMode === 'lines' ? '\n' : '') });
          j++;
        } else if (i < originalArray.length) {
          results.push({ removed: true, value: originalArray[i] + (compareMode === 'lines' ? '\n' : '') });
          i++;
        }
      }
      
      setDiffResults(results);
      setIsProcessing(false);
    }, 600);
  };

  const handleFileUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setter(result.value);
      } else if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setter(fullText);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => setter(event.target.result);
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse the file. Ensure it is a valid .txt, .docx, or .pdf file.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Shield className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus Legal-Audit & Diff</h1>
              <p className="text-gray-400 text-sm">Algorithmic Risk Engine v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <Lock size={14} />
              <span>Zero-Cloud: 100% Local Execution</span>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10">
              <ArrowLeft size={16} /> Dashboard
            </button>
          </div>
        </div>

        {!diffResults ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Don't Get Trapped by Hidden Clauses.</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Paste your original and revised contracts. Our algorithmic engine will instantly <strong className="text-indigo-400">Diff the changes</strong> and run a <strong className="text-red-400">Deep Risk Audit</strong> to find dangerous liabilities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5 flex flex-col hover:border-indigo-500/30 transition-colors relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-gray-400" size={20} />
                    <h3 className="font-bold text-lg">Original Contract</h3>
                  </div>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-2 transition-colors">
                    <Upload size={14} /> Upload File
                    <input type="file" accept=".txt,.md,.docx,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, setOriginalText)} />
                  </label>
                </div>
                <textarea 
                  className="w-full flex-1 min-h-[350px] bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed"
                  placeholder="Paste the original document text here, or upload a .txt, .docx, or .pdf file..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />
              </div>

              <div className="liquid-glass-strong p-6 rounded-3xl border border-white/5 flex flex-col hover:border-indigo-500/30 transition-colors relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-indigo-400" size={20} />
                    <h3 className="font-bold text-lg">Revised Contract (To be signed)</h3>
                  </div>
                  <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-1.5 px-3 rounded-lg border border-white/10 flex items-center gap-2 transition-colors">
                    <Upload size={14} /> Upload File
                    <input type="file" accept=".txt,.md,.docx,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, setRevisedText)} />
                  </label>
                </div>
                <textarea 
                  className="w-full flex-1 min-h-[350px] bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm leading-relaxed"
                  placeholder="Paste the modified document text here to Audit, or upload a .txt, .docx, or .pdf file..."
                  value={revisedText}
                  onChange={(e) => setRevisedText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={processComparison}
                disabled={!originalText || !revisedText || isProcessing}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 px-12 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-3 text-lg"
              >
                {isProcessing ? 'Running Security Audit...' : <><Shield size={24}/> Run Legal Audit & Diff</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            
            {/* Risk Audit Dashboard */}
            <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-orange-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
                    <AlertTriangle className="text-red-400" size={28}/> 
                    Algorithmic Risk Report
                  </h2>
                  <p className="text-gray-400">We scanned the revised contract against our library of dangerous legal liabilities.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black mb-1">
                    <span className={auditResults.score < 50 ? 'text-red-500' : auditResults.score < 80 ? 'text-yellow-500' : 'text-emerald-500'}>
                      {auditResults.score}
                    </span>
                    <span className="text-gray-500 text-2xl">/100</span>
                  </div>
                  <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">Safety Score</div>
                </div>
              </div>

              {auditResults.risks.length > 0 ? (
                <div className="grid gap-4 mt-6">
                  {auditResults.risks.map((risk, idx) => (
                    <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-4 items-start">
                      <div className="bg-red-500/20 p-2 rounded-lg text-red-400 shrink-0">
                        <FileWarning size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-red-200">Critical Term Found: "{risk.term}"</h4>
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-md border border-red-500/30">{risk.category} Risk</span>
                        </div>
                        <p className="text-red-200/70 text-sm leading-relaxed">{risk.advice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex items-center gap-4 text-emerald-400 mt-6">
                  <CheckCircle size={32} />
                  <div>
                    <h4 className="font-bold text-lg">No Critical Traps Detected</h4>
                    <p className="text-emerald-400/70 text-sm">Our algorithm did not find any highly dangerous keywords in the revised contract.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Diff Results */}
            <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-3">
                    <ArrowRightLeft className="text-indigo-400" size={24}/> 
                    Document Diff Analysis
                  </h2>
                 <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div> Removed</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div> Added</span>
                 </div>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-2xl p-6 whitespace-pre-wrap font-mono text-sm leading-loose max-h-[500px] overflow-y-auto custom-scrollbar">
                {diffResults.map((part, index) => {
                  let colorClass = 'text-gray-300';
                  let bgClass = '';
                  let textDecoration = '';
                  if (part.added) {
                    colorClass = 'text-green-300';
                    bgClass = 'bg-green-500/10 border-b border-green-500/50';
                  } else if (part.removed) {
                    colorClass = 'text-red-400';
                    bgClass = 'bg-red-500/10';
                    textDecoration = 'line-through opacity-70';
                  }
                  return (
                    <span key={index} className={`${colorClass} ${bgClass} ${textDecoration} rounded-sm px-[2px]`}>
                      {part.value}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-4 pb-8">
              <button onClick={() => { setDiffResults(null); setAuditResults(null); }} className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <RefreshCcw size={18} /> New Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
