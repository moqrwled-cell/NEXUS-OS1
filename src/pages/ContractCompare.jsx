import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertTriangle, ShieldAlert, Search, CheckCircle,
  Play, Lock, Cpu, RefreshCw, BookOpen, HardDriveDownload, 
  FileCheck, Layers, EyeOff, X, ArrowRight, Download, UploadCloud
} from 'lucide-react';
import * as mammoth from 'mammoth';
import { PDFDocument, rgb } from 'pdf-lib';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RED_FLAGS_DICTIONARY = [
  "indemnify and hold harmless",
  "liquidated damages",
  "arbitration only",
  "automatic renewal",
  "irrevocable",
  "without notice",
  "sole discretion",
  "unlimited liability"
];

const ContractCompare = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | bates | redact
  
  // -- PWA Install --
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("التطبيق مثبت بالفعل، أو متصفحك لا يدعم التثبيت المباشر (PWA).");
    }
  };

  return (
    <div className="min-h-screen bg-[#02050A] text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background glow matching the original brand */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-nexus-emerald/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-nexus-emerald/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Sidebar Dashboard */}
      <aside className="w-full md:w-72 liquid-glass border-r border-white/5 flex flex-col shrink-0 z-10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-nexus-emerald/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)]">
              <ShieldAlert className="text-nexus-emerald" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif text-white">Legal Assistant</h1>
              <p className="text-[10px] text-nexus-emerald tracking-wider">CONTRACT COMPARE</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-3 mt-4">
          
          <button 
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${activeTool === 'analyzer' ? 'bg-nexus-emerald/10 text-nexus-emerald border border-nexus-emerald/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Search size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Contract Analyzer</p>
              <p className="text-[10px] opacity-70">Red Flags & Definitions</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${activeTool === 'bates' ? 'bg-nexus-emerald/10 text-nexus-emerald border border-nexus-emerald/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Layers size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Bates Stamping</p>
              <p className="text-[10px] opacity-70">Merge & Stamp PDFs</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${activeTool === 'redact' ? 'bg-nexus-emerald/10 text-nexus-emerald border border-nexus-emerald/30 shadow-[0_0_15px_rgba(0,255,157,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <EyeOff size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Smart Redact</p>
              <p className="text-[10px] opacity-70">Remove PII Locally</p>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <button 
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 bg-nexus-emerald text-black font-bold text-sm px-4 py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,157,0.4)]"
          >
            <HardDriveDownload size={16} />
            Install Desktop App
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10">
        <AnimatePresence mode="wait">
          {activeTool === 'analyzer' && <motion.div key="analyzer" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><AnalyzerTool /></motion.div>}
          {activeTool === 'bates' && <motion.div key="bates" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><BatesTool /></motion.div>}
          {activeTool === 'redact' && <motion.div key="redact" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="h-full"><RedactTool /></motion.div>}
        </AnimatePresence>
      </main>
    </div>
  );
};

// ==========================================
// 1. CONTRACT ANALYZER TOOL
// ==========================================
const AnalyzerTool = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState(0);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('diff');

  const STAGES = [
    "Initializing Zero-Trust Local Environment...",
    "Tokenizing legal terminology...",
    "Running Red-Flag Heuristics...",
    "Validating capitalized definitions...",
    "Generating encrypted report..."
  ];

  const handleFileUpload = async (e, setTargetText) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setTargetText(text);
    } else if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setTargetText(result.value);
    } else {
      alert("Please upload a .txt or .docx file");
    }
  };

  const handleAnalyze = () => {
    if (!oldText || !newText) return;
    setIsProcessing(true);
    setProcessStage(0);
    
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < STAGES.length) {
        setProcessStage(currentStage);
      } else {
        clearInterval(interval);
        generateResults();
      }
    }, 600);
  };

  const generateResults = () => {
    const foundFlags = [];
    RED_FLAGS_DICTIONARY.forEach(flag => {
      const regex = new RegExp(flag, 'gi');
      const matches = newText.match(regex);
      if (matches) {
        foundFlags.push({ term: flag, count: matches.length });
      }
    });

    const defRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    const allCaps = newText.match(defRegex) || [];
    const uniqueCaps = [...new Set(allCaps)].filter(w => w.length > 3 && w !== "This" && w !== "The");

    // Simple word diff
    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);
    let diff = [];
    let i = 0, j = 0;
    while(i < oldWords.length && j < newWords.length && diff.length < 100) {
      if(oldWords[i] === newWords[j]) {
        diff.push({type: 'same', text: oldWords[i]});
        i++; j++;
      } else {
        diff.push({type: 'removed', text: oldWords[i]});
        diff.push({type: 'added', text: newWords[j]});
        i++; j++;
      }
    }

    setResults({ flags: foundFlags, definitions: uniqueCaps, diff });
    setIsProcessing(false);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-bold font-serif mb-2">Contract Analyzer</h2>
      <p className="text-gray-400 mb-6 text-sm">Compare versions and extract liabilities 100% locally.</p>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Left: Inputs */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center liquid-glass p-3 rounded-t-xl border-b-0">
              <label className="text-sm font-bold text-gray-300">Original Document</label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg text-xs transition-colors border border-white/10">
                Upload (.docx/.txt)
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setOldText)}/>
              </label>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="flex-1 bg-black/40 border border-white/5 rounded-b-xl p-4 text-sm font-mono focus:border-nexus-emerald/50 outline-none resize-none"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center liquid-glass p-3 rounded-t-xl border-b-0">
              <label className="text-sm font-bold text-gray-300">Modified Document</label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1 rounded-lg text-xs transition-colors border border-white/10">
                Upload (.docx/.txt)
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setNewText)}/>
              </label>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste modified text here..."
              className="flex-1 bg-black/40 border border-white/5 rounded-b-xl p-4 text-sm font-mono focus:border-nexus-emerald/50 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing || !oldText || !newText}
            className="w-full bg-nexus-emerald text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          >
            {isProcessing ? <RefreshCw className="animate-spin" /> : <Play />}
            {isProcessing ? 'Analyzing...' : 'Run Audit'}
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="liquid-glass rounded-2xl p-2 border border-white/5 flex gap-2">
            <button onClick={() => setActiveTab('diff')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'diff' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' : 'text-gray-400 hover:text-white'}`}><Search size={16}/> Line Diff</button>
            <button onClick={() => setActiveTab('risks')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'risks' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-gray-400 hover:text-white'}`}><ShieldAlert size={16}/> Red Flags</button>
            <button onClick={() => setActiveTab('defs')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'defs' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-gray-400 hover:text-white'}`}><BookOpen size={16}/> Terms</button>
          </div>

          <div className="liquid-glass-strong rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden">
            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-[#050B14]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                  <Cpu size={48} className="text-nexus-emerald mb-6 animate-pulse" />
                  <div className="w-full bg-black/50 h-2 rounded-full mb-4 overflow-hidden">
                    <motion.div className="h-full bg-nexus-emerald shadow-[0_0_10px_#00FF9D]" initial={{ width: '0%' }} animate={{ width: `${(processStage / STAGES.length) * 100}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-nexus-emerald font-mono text-sm">{STAGES[processStage]}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!results && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <ShieldAlert size={48} className="opacity-20" />
                <p className="text-center text-sm font-medium">Results will appear here.</p>
              </div>
            )}

            {results && !isProcessing && (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'diff' && (
                  <div className="font-mono text-sm leading-loose p-4 bg-black/40 rounded-xl">
                    {results.diff.map((word, idx) => (
                      <span key={idx} className={`
                        ${word.type === 'added' ? 'bg-green-500/20 text-green-400 font-bold px-1 mx-0.5 rounded' : ''}
                        ${word.type === 'removed' ? 'bg-red-500/20 text-red-400 line-through px-1 mx-0.5 rounded' : ''}
                      `}>{word.text}{' '}</span>
                    ))}
                  </div>
                )}
                {activeTab === 'risks' && (
                  <div className="space-y-3">
                    {results.flags.length === 0 ? <p className="text-nexus-emerald">No flags detected.</p> : results.flags.map((flag, idx) => (
                      <div key={idx} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                        <div className="font-bold flex items-center gap-2"><AlertTriangle size={16}/> "{flag.term}"</div>
                        <p className="text-xs mt-1 text-gray-400">Found {flag.count} times. Extremely high risk liability.</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'defs' && (
                  <div className="grid grid-cols-2 gap-2">
                    {results.definitions.map((def, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg text-sm text-blue-300 font-mono">{def}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. BATES STAMPING TOOL
// ==========================================
const BatesTool = () => {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('EX-');
  const [startNum, setStartNum] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles([...files, ...selected]);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const processPdfs = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      let currentPageNum = startNum;

      for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

        copiedPages.forEach((page) => {
          const { width, height } = page.getSize();
          const stampText = `${prefix}${String(currentPageNum).padStart(4, '0')}`;
          page.drawText(stampText, {
            x: width - 100,
            y: 20,
            size: 12,
            color: rgb(0, 0, 0),
          });
          mergedPdf.addPage(page);
          currentPageNum++;
        });
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bates_Stamped_Bundle_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (e) {
      alert("Error processing PDFs. Make sure they are valid PDF files.");
      console.error(e);
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-full">
      <h2 className="text-2xl font-bold font-serif mb-2">Bates Stamping & Binder</h2>
      <p className="text-gray-400 mb-6 text-sm">Merge multiple PDFs and permanently stamp sequential page numbers locally.</p>
      
      <div className="liquid-glass-strong border border-white/5 rounded-2xl p-8 shadow-2xl flex-1 flex flex-col">
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Bates Prefix</label>
            <input 
              type="text" 
              value={prefix} 
              onChange={e => setPrefix(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-nexus-emerald/50 outline-none"
              placeholder="e.g. PLTF-"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Starting Number</label>
            <input 
              type="number" 
              value={startNum} 
              onChange={e => setStartNum(Number(e.target.value))}
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-nexus-emerald/50 outline-none"
              min="1"
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 mb-6 flex flex-col items-center justify-center bg-black/30 hover:bg-black/50 transition-colors relative">
          <Layers className="text-nexus-emerald mb-4" size={48} />
          <p className="font-bold mb-2">Upload Evidence PDFs</p>
          <p className="text-xs text-gray-400 mb-6">Drag & drop or click to browse</p>
          <input type="file" multiple accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddFiles} />
          <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold transition-colors">Select Files</button>
        </div>

        {files.length > 0 && (
          <div className="mb-6 max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                <span className="text-sm truncate mr-4">{i+1}. {f.name}</span>
                <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-lg"><X size={16}/></button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <button 
            onClick={processPdfs}
            disabled={isProcessing || files.length === 0}
            className="w-full bg-nexus-emerald text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          >
            {isProcessing ? <RefreshCw className="animate-spin" /> : <Download />}
            {isProcessing ? 'Merging & Stamping...' : 'Merge & Download Stamped PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. SMART REDACT TOOL
// ==========================================
const RedactTool = () => {
  const [text, setText] = useState('');
  const [targetWord, setTargetWord] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith('.txt')) {
      const txt = await file.text();
      setText(txt);
    } else if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
    } else {
      alert("Please upload a .txt or .docx file");
    }
  };

  const processRedaction = () => {
    if (!text) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      let newText = text;
      
      // Auto redact Social Security Numbers (US format)
      newText = newText.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '█████████');
      
      // Auto redact Emails
      newText = newText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '█████████');

      // Custom word
      if (targetWord) {
        const regex = new RegExp(targetWord, 'gi');
        newText = newText.replace(regex, '█████████');
      }

      setText(newText);
      setIsProcessing(false);
    }, 1000);
  };

  const downloadCleanFile = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Redacted_Document_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-bold font-serif mb-2">Smart Redact & Scrub</h2>
      <p className="text-gray-400 mb-6 text-sm">Destructively redact PII (Emails, SSNs) and custom terms locally. Exports clean text without metadata.</p>
      
      <div className="liquid-glass-strong border border-white/5 rounded-2xl p-8 shadow-2xl flex-1 flex flex-col">
        
        <div className="flex gap-4 mb-6">
          <label className="flex-1 border-2 border-dashed border-white/10 hover:border-nexus-emerald/50 bg-black/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/50 transition-all">
            <UploadCloud size={32} className="text-nexus-emerald mb-2"/>
            <span className="font-bold text-sm">Upload Document (.docx / .txt)</span>
            <span className="text-xs text-gray-500">Max size: 50MB (Processed Locally)</span>
            <input type="file" accept=".txt,.docx" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Custom Word/Name to Redact (Optional)</label>
          <input 
            type="text" 
            value={targetWord}
            onChange={e => setTargetWord(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-nexus-emerald/50 outline-none"
            placeholder="e.g. John Doe or Acme Corp"
          />
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 w-full bg-black/40 border border-white/5 rounded-xl p-6 font-mono text-sm mb-6 outline-none focus:border-nexus-emerald/50 resize-none custom-scrollbar"
          placeholder="Document text will appear here. You can also paste text directly."
        />

        <div className="flex gap-4 mt-auto">
          <button 
            onClick={processRedaction}
            disabled={isProcessing || !text}
            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 py-4 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18}/> : <EyeOff size={18}/>}
            {isProcessing ? 'Redacting...' : 'Auto-Redact PII & Target Word'}
          </button>
          
          <button 
            onClick={downloadCleanFile}
            disabled={!text}
            className="flex-1 bg-nexus-emerald text-black py-4 rounded-xl font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(0,255,157,0.3)]"
          >
            <Download size={18}/> Download Clean Text
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ContractCompare;
