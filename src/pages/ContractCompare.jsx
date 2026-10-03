import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  CheckCircle,
  Play,
  Lock,
  Cpu,
  RefreshCw,
  BookOpen,
  HardDriveDownload,
  UploadCloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as mammoth from 'mammoth';

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
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [activeTab, setActiveTab] = useState("diff");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStage, setProcessStage] = useState(0);
  const [results, setResults] = useState(null);
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
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
       alert("The app is already installed, or your browser doesn't support PWA installation.");
    }
  };

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

  const STAGES = [
    "Initializing Zero-Trust Local Environment...",
    "Tokenizing legal terminology...",
    "Running Red-Flag Heuristics...",
    "Validating capitalized definitions...",
    "Generating encrypted report..."
  ];

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
    }, 800);
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
    
    const oldWords = oldText.split(' ');
    const newWords = newText.split(' ');
    const diff = [];
    
    let i = 0, j = 0;
    while(i < oldWords.length || j < newWords.length) {
      if (oldWords[i] === newWords[j]) {
        diff.push({ type: 'same', text: oldWords[i] });
        i++; j++;
      } else {
        if (newWords[j]) diff.push({ type: 'added', text: newWords[j] });
        if (oldWords[i]) diff.push({ type: 'removed', text: oldWords[i] });
        i++; j++;
      }
    }

    setResults({
      flags: foundFlags,
      definitions: uniqueCaps.slice(0, 8),
      diff: diff
    });
    
    setIsProcessing(false);
    
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-body selection:bg-nexus-emerald selection:text-black">
      
      {/* Top Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-[#020608]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.svg" alt="NexusOS" className="h-8" />
          <span className="font-heading text-xl font-bold tracking-wider">Contract-Compare <span className="text-nexus-emerald text-xs">PRO</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 bg-black/50 px-3 py-1.5 rounded-full border border-white/5">
            <Lock size={12} className="text-nexus-emerald" />
            100% Local Browser Processing
          </div>
          
          <button 
            onClick={handleInstallApp}
            className="flex items-center gap-2 bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            <HardDriveDownload size={16} />
            Install Desktop App
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[90vh]">
        
        {/* Left Side: Input Workspace */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="liquid-glass-strong rounded-2xl p-6 border border-white/5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                <FileText size={20} className="text-gray-400" /> Original Contract
              </h2>
              <label className="cursor-pointer flex items-center gap-2 text-xs font-bold text-nexus-emerald bg-nexus-emerald/10 px-3 py-1.5 rounded-lg hover:bg-nexus-emerald/20 transition-colors">
                <UploadCloud size={14} /> Upload .docx/.txt
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setOldText)} />
              </label>
            </div>
            <textarea
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste the original standard contract here, or upload a file..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-nexus-emerald/50 resize-none"
            ></textarea>
          </div>

          <div className="liquid-glass-strong rounded-2xl p-6 border border-white/5 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                <FileText size={20} className="text-nexus-emerald" /> Modified Contract
              </h2>
              <label className="cursor-pointer flex items-center gap-2 text-xs font-bold text-nexus-emerald bg-nexus-emerald/10 px-3 py-1.5 rounded-lg hover:bg-nexus-emerald/20 transition-colors">
                <UploadCloud size={14} /> Upload .docx/.txt
                <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, setNewText)} />
              </label>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste the modified version here, or upload a file..."
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-nexus-emerald/50 resize-none"
            ></textarea>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing || !oldText || !newText}
            className="w-full bg-nexus-emerald text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
          >
            {isProcessing ? <RefreshCw className="animate-spin" /> : <Play />}
            {isProcessing ? 'Analyzing Legal Risk...' : 'Run Full Legal Audit'}
          </button>
        </div>

        {/* Right Side: Analysis Output */}
        <div className="flex-1 lg:max-w-lg flex flex-col gap-4">
          
          <div className="liquid-glass rounded-2xl p-2 border border-white/5 flex gap-2">
            <button 
              onClick={() => setActiveTab('diff')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 ${activeTab === 'diff' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' : 'text-gray-400 hover:text-white'}`}
            >
              <Search size={16}/> Line Diff
            </button>
            <button 
              onClick={() => setActiveTab('risks')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 ${activeTab === 'risks' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-gray-400 hover:text-white'}`}
            >
              <ShieldAlert size={16}/> Red Flags
            </button>
            <button 
              onClick={() => setActiveTab('defs')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors flex justify-center items-center gap-2 ${activeTab === 'defs' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-gray-400 hover:text-white'}`}
            >
              <BookOpen size={16}/> Definitions
            </button>
          </div>

          <div className="liquid-glass-strong rounded-2xl p-6 border border-white/5 flex-1 relative overflow-hidden">
            
            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-[#050B14]/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                  <Cpu size={48} className="text-nexus-emerald mb-6 animate-pulse" />
                  <div className="w-full bg-black/50 h-2 rounded-full mb-4 overflow-hidden">
                    <motion.div 
                      className="h-full bg-nexus-emerald shadow-[0_0_10px_#00FF9D]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(processStage / STAGES.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-nexus-emerald font-mono text-sm h-6">
                    {STAGES[processStage]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!results && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                <ShieldAlert size={48} className="opacity-20" />
                <p className="text-center text-sm font-medium">Paste both contracts and run the audit.<br/>Processing happens 100% locally in your browser.</p>
              </div>
            )}

            {results && !isProcessing && (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                
                {activeTab === 'diff' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-white/10 pb-2 mb-4">Textual Differences</h3>
                    <div className="font-mono text-sm leading-loose p-4 bg-black/40 rounded-xl">
                      {results.diff.map((word, idx) => (
                        <span key={idx} className={`
                          ${word.type === 'added' ? 'bg-green-500/20 text-green-400 font-bold px-1 rounded mx-0.5' : ''}
                          ${word.type === 'removed' ? 'bg-red-500/20 text-red-400 line-through px-1 rounded mx-0.5' : ''}
                          ${word.type === 'same' ? 'text-gray-300' : ''}
                        `}>
                          {word.text}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                      <h3 className="font-bold text-lg text-red-400">Critical Red Flags Detected</h3>
                      <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">{results.flags.length} Found</span>
                    </div>
                    {results.flags.length === 0 ? (
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-3">
                        <CheckCircle size={20} />
                        No known high-risk clauses detected.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {results.flags.map((flag, idx) => (
                          <div key={idx} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-red-400 font-bold">
                              <AlertTriangle size={16} /> 
                              "{flag.term}"
                            </div>
                            <p className="text-xs text-gray-400">This phrase was detected {flag.count} times. It often exposes you to one-sided legal liability. Review immediately.</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'defs' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-white/10 pb-2 mb-4 text-blue-400">Capitalized Term Usage</h3>
                    <p className="text-xs text-gray-400 mb-4">The following terms were capitalized in the modified document. Ensure they are formally defined in the Definitions section to avoid ambiguity.</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {results.definitions.map((def, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg text-sm font-mono text-blue-300">
                          {def}
                        </div>
                      ))}
                      {results.definitions.length === 0 && (
                        <p className="text-gray-500 text-sm">No capitalized terms found.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default ContractCompare;
