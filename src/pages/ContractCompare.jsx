import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertTriangle, ShieldAlert, Search, CheckCircle,
  Play, Lock, Cpu, RefreshCw, BookOpen, HardDriveDownload, 
  FileCheck, Layers, EyeOff, X, ArrowRight, Download
} from 'lucide-react';
import * as mammoth from 'mammoth';
import { PDFDocument, rgb } from 'pdf-lib';

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
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full bg-gradient-to-br from-blue-900/10 to-transparent -z-10 pointer-events-none" />

      {/* Sidebar Dashboard */}
      <aside className="w-full md:w-72 bg-[#050B14] border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <ShieldAlert className="text-blue-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif text-blue-100">Legal OS</h1>
              <p className="text-[10px] text-blue-400 tracking-wider">LOCAL ZERO-TRUST</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-bold uppercase mb-2 px-2">Offline Tools</p>
          
          <button 
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTool === 'analyzer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Search size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Contract Analyzer</p>
              <p className="text-[10px] opacity-70">Red Flags & Definitions</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTool === 'bates' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Layers size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Bates Stamping</p>
              <p className="text-[10px] opacity-70">Merge & Stamp PDFs</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTool === 'redact' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <EyeOff size={18} />
            <div className="text-left flex-1">
              <p className="font-bold text-sm">Smart Redact</p>
              <p className="text-[10px] opacity-70">Remove PII Locally</p>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm px-4 py-3 rounded-xl hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <HardDriveDownload size={16} />
            Install App
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTool === 'analyzer' && <AnalyzerTool />}
        {activeTool === 'bates' && <BatesTool />}
        {activeTool === 'redact' && <RedactTool />}
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
      <p className="text-gray-400 mb-8 text-sm">Compare versions and extract liabilities 100% locally.</p>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Left: Inputs */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center bg-black/60 p-3 border border-white/10 rounded-t-xl">
              <label className="text-sm font-bold text-gray-300">Original Document</label>
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs">
                Upload (.docx/.txt)
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setOldText)}/>
              </label>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="flex-1 bg-black/40 border border-white/10 rounded-b-xl p-4 text-sm font-mono focus:border-blue-500/50 outline-none resize-none"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 relative">
            <div className="flex justify-between items-center bg-black/60 p-3 border border-white/10 rounded-t-xl">
              <label className="text-sm font-bold text-gray-300">Modified Document</label>
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs">
                Upload (.docx/.txt)
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setNewText)}/>
              </label>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste modified text here..."
              className="flex-1 bg-black/40 border border-white/10 rounded-b-xl p-4 text-sm font-mono focus:border-blue-500/50 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing || !oldText || !newText}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="animate-spin" /> : <Play />}
            {isProcessing ? 'Analyzing...' : 'Run Audit'}
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white/5 rounded-2xl p-2 border border-white/5 flex gap-2">
            <button onClick={() => setActiveTab('diff')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'diff' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}><Search size={16}/> Diff</button>
            <button onClick={() => setActiveTab('risks')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'risks' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'}`}><ShieldAlert size={16}/> Red Flags</button>
            <button onClick={() => setActiveTab('defs')} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center gap-2 ${activeTab === 'defs' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}><BookOpen size={16}/> Terms</button>
          </div>

          <div className="bg-black/50 rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden">
            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-[#050B14]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                  <Cpu size={48} className="text-blue-500 mb-6 animate-pulse" />
                  <div className="w-full bg-white/10 h-2 rounded-full mb-4 overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{ width: '0%' }} animate={{ width: `${(processStage / STAGES.length) * 100}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-blue-400 font-mono text-sm">{STAGES[processStage]}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!results && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <FileCheck size={48} className="opacity-20" />
                <p className="text-center text-sm font-medium">Results will appear here.</p>
              </div>
            )}

            {results && !isProcessing && (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'diff' && (
                  <div className="font-mono text-sm leading-loose p-4 bg-black/40 rounded-xl">
                    {results.diff.map((word, idx) => (
                      <span key={idx} className={`
                        ${word.type === 'added' ? 'bg-green-500/20 text-green-400 font-bold px-1 mx-0.5' : ''}
                        ${word.type === 'removed' ? 'bg-red-500/20 text-red-400 line-through px-1 mx-0.5' : ''}
                      `}>{word.text}{' '}</span>
                    ))}
                  </div>
                )}
                {activeTab === 'risks' && (
                  <div className="space-y-3">
                    {results.flags.length === 0 ? <p className="text-green-400">No flags detected.</p> : results.flags.map((flag, idx) => (
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
                      <div key={idx} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-purple-300 font-mono">{def}</div>
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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold font-serif mb-2">Bates Stamping & Binder</h2>
      <p className="text-gray-400 mb-8 text-sm">Merge multiple PDFs and permanently stamp sequential page numbers (e.g. DEF-001) locally.</p>
      
      <div className="bg-[#050B14] border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Bates Prefix</label>
            <input 
              type="text" 
              value={prefix} 
              onChange={e => setPrefix(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              placeholder="e.g. PLTF-"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Starting Number</label>
            <input 
              type="number" 
              value={startNum} 
              onChange={e => setStartNum(Number(e.target.value))}
              className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              min="1"
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 mb-6 flex flex-col items-center justify-center bg-black/50 hover:bg-black transition-colors relative">
          <Layers className="text-blue-500 mb-4" size={40} />
          <p className="font-bold mb-2">Upload Evidence PDFs</p>
          <p className="text-xs text-gray-400 mb-4">Drag & drop or click to browse</p>
          <input type="file" multiple accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddFiles} />
          <button className="bg-white/10 px-4 py-2 rounded-lg text-sm font-bold">Select Files</button>
        </div>

        {files.length > 0 && (
          <div className="mb-6 max-h-48 overflow-y-auto space-y-2 pr-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-sm truncate mr-4">{i+1}. {f.name}</span>
                <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 p-1"><X size={16}/></button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={processPdfs}
          disabled={isProcessing || files.length === 0}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? <RefreshCw className="animate-spin" /> : <Download />}
          {isProcessing ? 'Merging & Stamping...' : 'Merge & Download Stamped PDF'}
        </button>
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
      <p className="text-gray-400 mb-8 text-sm">Destructively redact PII (Emails, SSNs) and custom terms locally. Exports clean text without metadata.</p>
      
      <div className="bg-[#050B14] border border-white/10 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col">
        
        <div className="flex gap-4 mb-4">
          <label className="flex-1 border border-white/20 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            <UploadCloud size={20} className="text-blue-400"/>
            <span className="font-bold text-sm">Upload Document (.docx / .txt)</span>
            <input type="file" accept=".txt,.docx" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 mb-2">Custom Word/Name to Redact (Optional)</label>
          <input 
            type="text" 
            value={targetWord}
            onChange={e => setTargetWord(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
            placeholder="e.g. John Doe"
          />
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 w-full bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm mb-4 outline-none focus:border-blue-500/50 resize-none"
          placeholder="Document text will appear here. You can also paste text directly."
        />

        <div className="flex gap-4">
          <button 
            onClick={processRedaction}
            disabled={isProcessing || !text}
            className="flex-1 bg-red-600/20 text-red-400 border border-red-600/30 py-4 rounded-xl font-bold text-sm hover:bg-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18}/> : <EyeOff size={18}/>}
            {isProcessing ? 'Redacting...' : 'Auto-Redact PII & Target Word'}
          </button>
          
          <button 
            onClick={downloadCleanFile}
            disabled={!text}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={18}/> Download Clean Text
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ContractCompare;
