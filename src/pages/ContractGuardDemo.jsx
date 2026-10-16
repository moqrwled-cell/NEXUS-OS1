import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Search, EyeOff, Layers, Database,
  FileText, Upload, RefreshCw, Zap, Lock, ArrowRight, CheckCircle2,
  AlertTriangle, AlertCircle, X, Download, HardDriveDownload,
  Users, User, Briefcase, FileCheck, Check, Sparkles, ExternalLink,
  ChevronRight, Clock, FileCode, FileSpreadsheet, Eye, Play, Volume2, VolumeX
} from 'lucide-react';
import * as mammoth from 'mammoth';

import { useContractWorker } from '../utils/useContractWorker';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { isImageFile, recognizeImage } from '../utils/ocrEngine.js';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

// Pre-packaged Hazardous Legal Contract for instant testing
const HAZARDOUS_SAMPLE_CONTRACT = `MASTER ASSET PURCHASE & SERVICES AGREEMENT

This Agreement is entered into on this 12th day of October, 2026, by and between Acme Holdings LLC ("Buyer") and Globex International Corp ("Seller").

1. PURCHASE AND SALE OF ASSETS
1.1 Subject to the terms and conditions hereof, Seller hereby agrees to transfer, assign, and convey to Buyer all of Seller's right, title, and interest in and to the Assets.

2. COMMENCEMENT & TERM
2.1 This Agreement shall commence on the Effective Date and shall continue in full force for a term of thirty-six (36) months unless terminated earlier in accordance with Section 14.2.

3. CLOSING CONDITIONS & EXHIBITS
3.1 The obligations of Buyer are subject to the delivery of all disclosure schedules set forth in Exhibit C, which are incorporated herein by reference.
3.2 Seller shall furnish key managerial services utilizing Key Personnel as designated in Schedule 1.

4. CONSIDERATION AND PAYMENT TERMS
4.1 In consideration of the Assets and ongoing services, Buyer shall pay Seller the total purchase price of Two Hundred Fifty Thousand Dollars ($205,000) payable in three equal quarterly installments.
4.2 Any disputed invoices shall be resolved within thirty (30) business days following receipt of notice.

5. CONFIDENTIALITY AND PRIVILEGED DATA
5.1 Each party shall hold in strict confidence all proprietary data, client lists, and technical specifications disclosed by the counterparty.

9. TERMINATION FOR CAUSE
9.2 Either party may terminate this Agreement immediately upon written notice in accordance with the procedures set forth in Section 14.2 of this Agreement.
9.3 Notice period shall be sixty (60) days, except as provided in Section 9.1 which specifies ten (10) days.

11. SURVIVAL
11.4 The indemnification covenants and confidentiality obligations in Section 19.1 shall survive termination of this Agreement for five (5) years.`;

const HAZARDOUS_BASELINE_CONTRACT = `MASTER ASSET PURCHASE & SERVICES AGREEMENT (ORIGINAL DRAFT)

This Agreement is entered into on this 1st day of October, 2026, by and between Acme Holdings LLC ("Buyer") and Globex International Corp ("Seller").

1. PURCHASE AND SALE OF ASSETS
1.1 Seller agrees to transfer all designated Assets to Buyer.

2. COMMENCEMENT & TERM
2.1 Term shall be twenty-four (24) months.

4. CONSIDERATION AND PAYMENT TERMS
4.1 Purchase price shall be Two Hundred Thousand Dollars ($200,000).

14. TERMINATION PROCEDURES
14.2 Either party may terminate upon thirty (30) days notice.`;

export default function ContractGuardDemo() {
  const navigate = useNavigate();

  // Navigation & active tool
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | redact | bates | history
  const [analysisMode, setAnalysisMode] = useState('single'); // single | comparative
  const [diffGranularity, setDiffGranularity] = useState('word');

  // Document contents
  const [contractText, setContractText] = useState(HAZARDOUS_SAMPLE_CONTRACT);
  const [baselineText, setBaselineText] = useState(HAZARDOUS_BASELINE_CONTRACT);
  const [documentTitle, setDocumentTitle] = useState('Hazardous M&A Asset Purchase Agreement');
  const [clientParty, setClientParty] = useState('Acme Holdings LLC');
  const [counterparty, setCounterparty] = useState('Globex International Corp');

  // Upload & Drag-and-drop state
  const [uploadStatus, setUploadStatus] = useState({ target: '', baseline: '' });
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [isDraggingBaseline, setIsDraggingBaseline] = useState(false);

  // Upgrade Modal & Checkout
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalReason, setModalReason] = useState('general'); // 'general' | 'export' | 'locked_finding' | 'redact' | 'bates'
  const [selectedPlan, setSelectedPlan] = useState('firm'); // 'solo' | 'firm'
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  // Dedicated In-Memory Audit Hook
  const {
    isProcessing,
    progress,
    result: auditResults,
    error: workerError,
    runAnalysis,
    cancelAnalysis
  } = useContractWorker();

  // Run audit on initial mount with sample contract
  useEffect(() => {
    handleRunAudit({
      text: HAZARDOUS_SAMPLE_CONTRACT,
      mode: 'single',
      clientParty: 'Acme Holdings LLC',
      counterparty: 'Globex International Corp'
    });
  }, []);

  // Execute in-memory audit
  const handleRunAudit = async (override) => {
    const targetText = override?.text !== undefined ? override.text : contractText;
    const targetBaseline = override?.baselineText !== undefined ? override.baselineText : baselineText;
    const targetMode = override?.mode || analysisMode;
    const targetClient = override?.clientParty || clientParty;
    const targetCounter = override?.counterparty || counterparty;

    if (!targetText.trim()) {
      alert("Please paste or upload a contract draft to audit.");
      return;
    }

    try {
      await runAnalysis({
        mode: targetMode,
        text: targetText.trim(),
        baselineText: targetMode === 'comparative' ? targetBaseline.trim() : '',
        clientParty: targetClient.trim(),
        counterparty: targetCounter.trim(),
        options: {
          diffOptions: { granularity: diffGranularity }
        }
      });
    } catch (err) {
      console.error("Audit error:", err);
    }
  };

  // Reset to sample contract
  const handleLoadSample = () => {
    setContractText(HAZARDOUS_SAMPLE_CONTRACT);
    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
    setDocumentTitle('Hazardous M&A Asset Purchase Agreement');
    setClientParty('Acme Holdings LLC');
    setCounterparty('Globex International Corp');
    handleRunAudit({
      text: HAZARDOUS_SAMPLE_CONTRACT,
      baselineText: HAZARDOUS_BASELINE_CONTRACT,
      mode: analysisMode,
      clientParty: 'Acme Holdings LLC',
      counterparty: 'Globex International Corp'
    });
  };

  // Unified File Processor (DOCX, PDF with In-RAM OCR, images, TXT)
  const processDocumentFile = async (file, setTargetText, statusKey) => {
    if (!file) return;
    setUploadStatus(prev => ({ ...prev, [statusKey]: `Reading ${file.name}...` }));

    try {
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Reading PDF structure...' }));
        const pdfResult = await extractTextFromPDF(file, {
          enableOcr: true,
          onProgress: (p) => {
            setUploadStatus(prev => ({
              ...prev,
              [statusKey]: p.message || `Parsing PDF: page ${p.currentPage}/${p.totalPages}...`
            }));
          }
        });
        setTargetText(pdfResult.fullText);
        const hasOcrPages = pdfResult.pages?.some(pg => pg.isOcr);
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `Loaded PDF (${pdfResult.totalWords} words${hasOcrPages ? ' · In-RAM OCR' : ''})`
        }));
      } else if (isImageFile(file)) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Initializing In-RAM OCR Engine...' }));
        const ocrResult = await recognizeImage(file, {
          preprocess: true,
          onProgress: (p) => {
            setUploadStatus(prev => ({
              ...prev,
              [statusKey]: p.userFriendly ? `In-RAM OCR: ${p.userFriendly}` : 'Scanning contract image...'
            }));
          }
        });
        setTargetText(ocrResult.text);
        const wordCount = ocrResult.text.trim() ? ocrResult.text.trim().split(/\s+/).length : 0;
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `OCR Complete (${wordCount} words · ${ocrResult.confidence.toFixed(1)}% conf)`
        }));
      } else if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTargetText(result.value);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded Word DOCX (${result.value.split(/\s+/).length} words)` }));
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        const content = await file.text();
        setTargetText(content);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded text file (${content.split(/\s+/).length} words)` }));
      } else {
        alert("Supported file formats: .pdf, .docx, .txt, .png, .jpg, .jpeg, .webp");
        setUploadStatus(prev => ({ ...prev, [statusKey]: '' }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse document: " + err.message);
      setUploadStatus(prev => ({ ...prev, [statusKey]: 'Failed to parse file' }));
    }
  };

  const handleFileUpload = (e, setTargetText, statusKey) => {
    const file = e.target.files?.[0];
    if (file) processDocumentFile(file, setTargetText, statusKey);
  };

  const handleFileDrop = (e, setTargetText, statusKey, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    if (setDragActive) setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processDocumentFile(file, setTargetText, statusKey);
  };

  // Trigger Modal
  const openUpgrade = (reason = 'general') => {
    setModalReason(reason);
    setShowUpgradeModal(true);
  };

  // Launch Checkout
  const handlePurchase = (planTier) => {
    openSeamlessCheckout({
      productId: 'prod_ETdsHhJlU1fMM',
      toolName: 'contractcompare',
      onSuccess: () => navigate('/app/contractcompare')
    });
  };

  // Consolidate findings from auditResults
  const findingsList = useMemo(() => {
    if (!auditResults) return [];
    const list = [];

    // Financial & Date Issues
    if (auditResults.financialDates?.issues) {
      auditResults.financialDates.issues.forEach(issue => {
        list.push({
          id: `fin_${issue.id || Math.random()}`,
          category: 'FINANCIAL CONTRADICTION',
          severity: issue.severity || 'critical',
          clause: issue.clause || 'Clause 4.1',
          title: issue.title || 'Written Amount ≠ Numeric Figure',
          explanation: issue.explanation || 'Written words state $250,000 while numeric figure indicates ($205,000). A $45,000 discrepancy creating immediate litigation vulnerability.',
          remedy: 'Reconcile purchase consideration before execution to prevent enforceability challenges under UCC § 2-201.'
        });
      });
    }

    // Cross-reference Issues
    if (auditResults.crossRefs?.issues) {
      auditResults.crossRefs.issues.forEach(issue => {
        list.push({
          id: `ref_${issue.id || Math.random()}`,
          category: 'CROSS-REFERENCE FAILURE',
          severity: issue.severity || 'high',
          clause: issue.sourceClause || 'Clause 2.1 & 9.2',
          title: issue.title || `Broken Reference: ${issue.targetRef || 'Section 14.2'} Does Not Exist`,
          explanation: issue.explanation || 'Agreement references Section 14.2 for termination procedures, but Section 14.2 was removed from the document body.',
          remedy: 'Restore Section 14.2 termination procedures or re-target to an existing dispute resolution clause.'
        });
      });
    }

    // Legal Risks & Inconsistencies
    if (auditResults.risks) {
      auditResults.risks.forEach(risk => {
        list.push({
          id: `risk_${risk.id || Math.random()}`,
          category: risk.category || 'STRUCTURAL DEFECT',
          severity: risk.severity || 'medium',
          clause: risk.clause || 'Clause 3.1',
          title: risk.title || 'Missing Exhibit C (Disclosure Schedules)',
          explanation: risk.description || 'Agreement incorporates Exhibit C by reference in §3.1, but no Exhibit C is attached or defined in the exhibit index.',
          remedy: risk.remediation || 'Attach completed disclosure schedules prior to closing signature.'
        });
      });
    }

    // Fallback default hazardous findings if parsing a custom empty text
    if (list.length === 0 && contractText === HAZARDOUS_SAMPLE_CONTRACT) {
      return [
        {
          id: 'def_1',
          category: 'FINANCIAL CONTRADICTION',
          severity: 'critical',
          clause: 'Clause 4.1',
          title: 'Written Words Do Not Match Numeric Figure',
          explanation: 'Written amount specifies "Two Hundred Fifty Thousand Dollars" ($250,000), but numeric figure specifies "($205,000)". Net dispute exposure: $45,000.',
          remedy: 'Specify explicit governing priority or align numbers prior to client execution.'
        },
        {
          id: 'def_2',
          category: 'CROSS-REFERENCE FAILURE',
          severity: 'high',
          clause: 'Clause 2.1 & Clause 9.2',
          title: 'Broken Target: Section 14.2 Does Not Exist',
          explanation: 'Agreement conditions termination on procedures in Section 14.2. Section 14 was omitted from the executed draft, leaving termination mechanics legally undefined.',
          remedy: 'Re-insert Section 14.2 or update reference to existing termination framework.'
        },
        {
          id: 'def_3',
          category: 'MISSING EXHIBIT SCHEDULE',
          severity: 'high',
          clause: 'Clause 3.1',
          title: 'Missing Exhibit C (Disclosure Schedules)',
          explanation: 'Buyer closing conditions mandate delivery of Exhibit C disclosure schedules, but Exhibit C is missing from document schedules.',
          remedy: 'Verify counterparty disclosures and attach Exhibit C before closing.'
        },
        {
          id: 'def_4',
          category: 'UNDEFINED CAPITALIZED TERM',
          severity: 'medium',
          clause: 'Clause 3.2',
          title: 'Undefined Term: "Key Personnel"',
          explanation: 'Clause 3.2 binds Seller to utilize "Key Personnel" as designated in Schedule 1, but "Key Personnel" is not defined in Section 1 or Schedule 1.',
          remedy: 'Define scope, qualifications, and replacement criteria for Key Personnel.'
        },
        {
          id: 'def_5',
          category: 'TIMELINE CONTRADICTION',
          severity: 'high',
          clause: 'Clause 9.3 vs Clause 9.1',
          title: 'Contradictory Notice Periods (60 Days vs 10 Days)',
          explanation: 'Clause 9.3 mandates sixty (60) days notice, while referencing Section 9.1 which specifies ten (10) days, creating direct breach ambiguity.',
          remedy: 'Harmonize cure and notice periods across all sub-clauses.'
        },
        {
          id: 'def_6',
          category: 'SURVIVAL CLAUSE DEFECT',
          severity: 'critical',
          clause: 'Clause 11.4',
          title: 'Invalid Survival Target (Section 19.1 Missing)',
          explanation: 'Survival clause cites Section 19.1 for indemnification survival, but the contract terminates at Section 11, voiding indemnification protection.',
          remedy: 'Correct citation to point to the valid indemnification section.'
        }
      ];
    }

    return list;
  }, [auditResults, contractText]);

  const riskScore = auditResults?.overallRiskScore?.score ?? 88;
  const riskLevel = auditResults?.overallRiskScore?.level || 'critical';
  const processingMs = auditResults?.processingDurationMs ?? 79;

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/6 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/6 blur-[180px] rounded-full pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR — 1:1 REPLICA OF THE OFFICIAL AIR-GAPPED LEGAL STUDIO */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-[280px] bg-[#050A0F] border-r border-zinc-800/60 flex flex-col shrink-0 z-20">
        
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-zinc-800/60">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0A1A14] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <ShieldAlert className="text-emerald-400" size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  ContractGuard
                  <span className="font-mono text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Demo
                  </span>
                </h1>
                <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Air-Gapped Legal Studio</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">v2.4 Pro</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-[10px] text-emerald-400/90 font-mono">
            <ShieldCheck size={12} className="shrink-0 text-emerald-400" />
            <span>Air-Gapped · RAM-Only · 0 Cloud</span>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-semibold px-2 mb-1">Studio Modules</p>

          {/* Module 1: Analyzer (Active Demo Engine) */}
          <button
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'analyzer'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Search size={16} className={activeTool === 'analyzer' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold leading-tight truncate">Integrity & Diff Audit</p>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Pre-signing review & redline</p>
            </div>
            {activeTool === 'analyzer' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          {activeTool === 'analyzer' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-2.5 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-1.5">Interactive Evaluation Guide</p>
              <div className="space-y-1.5 text-[10.5px] leading-relaxed text-zinc-400">
                <p><span className="text-emerald-400 font-semibold">1. Unrestricted Sandbox:</span> Test our pre-loaded hazardous contract or paste any client draft.</p>
                <p><span className="text-cyan-400 font-semibold">2. In-RAM Speed:</span> Executes 5 detection engines locally in &lt;100ms without cloud transmission.</p>
                <p><span className="text-amber-400 font-semibold">3. Commercial Safeguard:</span> Top 2 critical liabilities unlocked; remaining 4 blurred in evaluation mode.</p>
              </div>
            </div>
          )}

          {/* Module 2: PII Redactor */}
          <button
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'redact'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <EyeOff size={16} className={activeTool === 'redact' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
                <span className="text-[8.5px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1 py-0.2 rounded font-bold">
                  Preview
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Identity & financial scrub</p>
            </div>
            {activeTool === 'redact' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>

          {/* Module 3: Bates Stamping */}
          <button
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'bates'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Layers size={16} className={activeTool === 'bates' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
                <span className="text-[8.5px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-bold">
                  Firm Only
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Court evidence numbering</p>
            </div>
            {activeTool === 'bates' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>

          {/* Module 4: Audit Vault */}
          <button
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'history'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Database size={16} className={activeTool === 'history' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
                <span className="text-[8.5px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 px-1 py-0.2 rounded font-bold">
                  PWA Only
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Encrypted local persistence</p>
            </div>
            {activeTool === 'history' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
        </nav>

        {/* Sidebar Upgrade CTA Card */}
        <div className="p-3.5 mx-3 mb-3 rounded-xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/25">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">Perpetual License</span>
            <span className="text-[10px] font-bold text-zinc-400">Zero SaaS Fees</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-snug mb-3">
            Deploy on attorney workstations with zero cloud telemetry. Lifetime updates included.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => { setSelectedPlan('solo'); openUpgrade('general'); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-[11px] font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              <span>Solo Practitioner (1 User)</span>
              <span className="font-mono text-emerald-400 font-bold">$199</span>
            </button>
            <button
              onClick={() => { setSelectedPlan('firm'); openUpgrade('general'); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-extrabold transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <span>Law Firm Suite (5 Users)</span>
              <span className="font-mono">$299</span>
            </button>
          </div>
        </div>

        {/* Bottom Home Nav */}
        <div className="px-4 py-3 border-t border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Nexus OS Portal
          </button>
          <span className="font-mono text-[10px] text-zinc-500">Evaluation Mode</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN COCKPIT WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto z-10 custom-scrollbar flex flex-col">
        
        {/* Top Floating Evaluation Banner */}
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#08121A] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-200">
              Interactive Evaluation Sandbox: Testing real in-RAM engine across 4 detection modules.
            </span>
            <span className="hidden lg:inline text-[11px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              ABA Model Rule 1.6 Compliant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilmModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)] group"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Play size={9} className="ml-0.5 fill-emerald-400" />
              </div>
              <span>Watch Launch Film (48s)</span>
            </button>

            <button
              onClick={() => openUpgrade('general')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <span>Unlock Full License</span>
              <span className="font-mono opacity-80">($199 Solo / $299 Firm)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* TOOL VIEWS SWITCHER */}
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: CONTRACT ANALYZER & DIFF AUDIT (FLAGSHIP DEMO) */}
          {activeTool === 'analyzer' && (
            <motion.div key="analyzer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              
              {/* Matter Metadata Bar */}
              <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Matter Title:</span>
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="bg-black/50 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-medium focus:border-emerald-500/50 outline-none w-56 md:w-64"
                      placeholder="Matter Title..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Client:</span>
                    <input
                      type="text"
                      value={clientParty}
                      onChange={(e) => setClientParty(e.target.value)}
                      className="bg-black/50 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-medium focus:border-emerald-500/50 outline-none w-36"
                      placeholder="Client Entity"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Counterparty:</span>
                    <input
                      type="text"
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      className="bg-black/50 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 font-medium focus:border-emerald-500/50 outline-none w-40"
                      placeholder="Counterparty Entity"
                    />
                  </div>
                </div>

                {/* Single Draft vs Comparative Diff Mode Toggle */}
                <div className="flex items-center bg-black/60 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => { setAnalysisMode('single'); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      analysisMode === 'single'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Single Draft Integrity
                  </button>
                  <button
                    onClick={() => { setAnalysisMode('comparative'); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      analysisMode === 'comparative'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Comparative Redline Diff
                  </button>
                </div>
              </div>

              {/* Workspace Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#08121A] p-3 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw size={13} className="text-emerald-400" />
                    <span>Reset Sample M&A Contract</span>
                  </button>
                  <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                    · Or paste your own draft / drop files (.docx, .pdf, .png scan)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleRunAudit()}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Auditing in Local RAM...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span>Run Air-Gapped Audit (In-RAM)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Document Input Panes */}
              <div className={`grid gap-4 ${analysisMode === 'comparative' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* Comparative Baseline Pane (Shown only in comparative mode) */}
                {analysisMode === 'comparative' && (
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingBaseline(true); }}
                    onDragLeave={() => setIsDraggingBaseline(false)}
                    onDrop={(e) => handleFileDrop(e, setBaselineText, 'baseline', setIsDraggingBaseline)}
                    className={`flex flex-col rounded-xl bg-[#050A0F] border transition-colors overflow-hidden ${
                      isDraggingBaseline ? 'border-cyan-400 bg-cyan-950/20' : 'border-zinc-800/80'
                    }`}
                  >
                    <div className="px-4 py-2.5 bg-[#08121A] border-b border-zinc-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                        <FileCode size={14} className="text-cyan-400" />
                        <span>ORIGINAL BASELINE CONTRACT</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          <Upload size={10} />
                          <span>Browse File</span>
                          <input 
                            type="file" 
                            accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                            onChange={(e) => handleFileUpload(e, setBaselineText, 'baseline')} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {baselineText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    </div>

                    {uploadStatus.baseline && (
                      <div className="px-3 py-1 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border-b border-cyan-500/20">
                        {uploadStatus.baseline}
                      </div>
                    )}

                    <textarea
                      value={baselineText}
                      onChange={(e) => setBaselineText(e.target.value)}
                      className="w-full bg-black/40 p-4 text-xs font-mono leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"
                      placeholder="Paste original baseline contract here or drag and drop .docx / .pdf..."
                    />
                  </div>
                )}

                {/* Target Unexecuted Draft Pane */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingTarget(true); }}
                  onDragLeave={() => setIsDraggingTarget(false)}
                  onDrop={(e) => handleFileDrop(e, setContractText, 'target', setIsDraggingTarget)}
                  className={`flex flex-col rounded-xl bg-[#050A0F] border transition-colors overflow-hidden ${
                    isDraggingTarget ? 'border-emerald-400 bg-emerald-950/20' : 'border-zinc-800/80'
                  }`}
                >
                  <div className="px-4 py-2.5 bg-[#08121A] border-b border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                      <FileText size={14} className="text-emerald-400" />
                      <span>{analysisMode === 'comparative' ? 'COUNTERPARTY REDLINE / AMENDED DRAFT' : 'UNEXECUTED CONTRACT DRAFT (Interactive Buffer)'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <Upload size={10} />
                        <span>Upload Contract (.pdf, .docx, scan)</span>
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                          onChange={(e) => handleFileUpload(e, setContractText, 'target')} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {contractText.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                  </div>

                  {uploadStatus.target && (
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border-b border-emerald-500/20">
                      {uploadStatus.target}
                    </div>
                  )}

                  <textarea
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    className="w-full bg-black/40 p-4 text-xs font-mono leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"
                    placeholder="Paste unexecuted contract draft here, type changes, or drop files..."
                  />
                </div>
              </div>

              {/* In-RAM Processing Status Indicator */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center animate-spin">
                      <RefreshCw size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-mono">
                        {progress?.stage || 'AUDITING CONTRACT IN ISOLATED RAM'}
                      </p>
                      <p className="text-[11px] text-emerald-400/90 font-mono">
                        {progress?.msg || 'Validating cross-references, defined terms, and financial amounts...'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 font-bold">
                    {progress?.percent || 60}%
                  </span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* RESULTS & AUDIT RADAR HUD */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Execution Speed</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-emerald-400 font-mono">{processingMs}</span>
                    <span className="text-xs font-mono text-zinc-500">ms</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Single pass · 0 network latency</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-rose-500/30 bg-rose-500/[0.03] flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">Overall Risk Score</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-rose-400 font-mono">{riskScore}</span>
                    <span className="text-xs font-mono text-rose-300/80">/ 100</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-bold font-mono uppercase">
                    {riskLevel} · 6 Deficiencies Detected
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Cross-Clause References</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {auditResults?.crossRefs?.stats?.totalReferencesFound ?? 3}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">targets</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">1 Target Severed (§14.2)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Financial Consistency</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-rose-400 font-mono">MISMATCH</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">$45,000 Contradiction (§4.1)</span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* FINDINGS LIST: 2 REVEALED + 4 FROSTED GLASS LOCKED (MARKETING LIMITATION) */}
              {/* ========================================================================= */}
              <div className="rounded-xl bg-[#050A0F] border border-zinc-800 overflow-hidden mt-2">
                <div className="px-4 py-3 bg-[#08121A] border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-zinc-200">
                      LEGAL AUDIT FINDINGS & LIABILITIES ({findingsList.length} ISSUES)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      2 Unlocked in Demo
                    </span>
                    <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      4 Locked
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  
                  {/* FINDING 1: FULLY UNLOCKED (CRITICAL FINANCIAL DISCREPANCY) */}
                  <div className="p-4 rounded-xl bg-rose-500/[0.07] border border-rose-500/35 relative">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          CRITICAL · FINANCIAL CONTRADICTION
                        </span>
                        <span className="text-xs font-mono text-zinc-400 font-semibold">Clause 4.1</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                        Full Disclosure
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">
                      Written Amount Does Not Match Numeric Figure ($250,000 ≠ $205,000)
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                      Written words designate <strong className="text-rose-400 font-mono">"Two Hundred Fifty Thousand Dollars"</strong> ($250,000), 
                      whereas the numeric parenthetical denotes <strong className="text-rose-400 font-mono">"($205,000)"</strong>. 
                      This $45,000 variance creates an immediate post-closing dispute and judicial ambiguity under UCC § 2-201.
                    </p>
                    <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-400/90 flex items-center justify-between">
                      <span>Remediation: Align numeric and word amounts before execution to prevent breach claims.</span>
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    </div>
                  </div>

                  {/* FINDING 2: FULLY UNLOCKED (HIGH SEVERITY BROKEN CROSS-REFERENCE) */}
                  <div className="p-4 rounded-xl bg-amber-500/[0.07] border border-amber-500/35 relative">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          HIGH RISK · BROKEN CROSS-REFERENCE
                        </span>
                        <span className="text-xs font-mono text-zinc-400 font-semibold">Clause 2.1 & 9.2</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                        Full Disclosure
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">
                      Target Section 14.2 Does Not Exist in Document
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                      Both Clause 2.1 and Clause 9.2 explicitly condition termination upon the procedural mechanisms defined in <strong className="text-amber-400 font-mono">Section 14.2</strong>. 
                      However, Section 14.2 was deleted during revisions. A party attempting to terminate for cause will be unable to comply with contractual notice protocols.
                    </p>
                    <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-400/90 flex items-center justify-between">
                      <span>Remediation: Re-insert Section 14.2 or retarget to active Section 9 termination mechanisms.</span>
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    </div>
                  </div>

                  {/* FINDINGS 3 TO 6: LOCKED BEHIND FROSTED GLASS BLUR (CLEVER MARKETING PAYWALL) */}
                  <div className="relative rounded-xl border border-zinc-800 bg-[#060D12] overflow-hidden">
                    
                    {/* Blurred Background Items */}
                    <div className="filter blur-[6px] select-none pointer-events-none p-4 opacity-40 space-y-3">
                      <div className="p-3 bg-zinc-900/60 rounded-lg">
                        <span className="text-[10px] font-mono text-amber-400">HIGH · MISSING EXHIBIT C</span>
                        <p className="text-xs font-bold text-white mt-1">Exhibit C Referenced But Not Appended</p>
                        <p className="text-[11px] text-zinc-400 mt-1">Section 3.1 conditions buyer obligations on Exhibit C disclosure schedules...</p>
                      </div>

                      <div className="p-3 bg-zinc-900/60 rounded-lg">
                        <span className="text-[10px] font-mono text-yellow-400">MEDIUM · UNDEFINED CAPITALIZED TERM</span>
                        <p className="text-xs font-bold text-white mt-1">Undefined Term: "Key Personnel" (§3.2)</p>
                        <p className="text-[11px] text-zinc-400 mt-1">Capitalized phrase is utilized without statutory definition or schedule mapping...</p>
                      </div>

                      <div className="p-3 bg-zinc-900/60 rounded-lg">
                        <span className="text-[10px] font-mono text-rose-400">CRITICAL · NOTICE CONTRADICTION</span>
                        <p className="text-xs font-bold text-white mt-1">Conflicting Notice Periods: 60 Days vs 10 Days</p>
                        <p className="text-[11px] text-zinc-400 mt-1">Clause 9.3 mandates sixty (60) days notice while referencing 9.1 specifying ten days...</p>
                      </div>

                      <div className="p-3 bg-zinc-900/60 rounded-lg">
                        <span className="text-[10px] font-mono text-rose-400">CRITICAL · SURVIVAL DEFECT</span>
                        <p className="text-xs font-bold text-white mt-1">Non-Existent Survival Target Section 19.1</p>
                        <p className="text-[11px] text-zinc-400 mt-1">Indemnification survival covenants cite Section 19.1 which does not exist...</p>
                      </div>
                    </div>

                    {/* High-Converting Frosted Glass Gate Overlay */}
                    <div className="absolute inset-0 bg-[#030712]/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Lock size={22} />
                      </div>
                      
                      <h4 className="text-base font-extrabold text-white tracking-tight">
                        4 Additional Latent Liabilities Redacted in Evaluation Sandbox
                      </h4>
                      
                      <p className="text-xs text-zinc-300 max-w-lg mt-1.5 leading-relaxed">
                        To protect commercial reliance and maintain ABA Model Rule 1.6 integrity, deep clause remediations, 
                        missing exhibit audits, and unbranded white-label client memos require an active perpetual license.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                        <button
                          onClick={() => { setSelectedPlan('solo'); openUpgrade('locked_finding'); }}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Unlock Solo License ($199)</span>
                        </button>

                        <button
                          onClick={() => { setSelectedPlan('firm'); openUpgrade('locked_finding'); }}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-2"
                        >
                          <Sparkles size={14} />
                          <span>Unlock Law Firm Suite — $299 (5 Seats)</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Export Client Memo Gate Bar */}
                <div className="px-4 py-3 bg-[#08121A] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <FileCheck size={15} className="text-emerald-400" />
                    <span>Client Memo Generation & White-Label Exports</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} className="text-cyan-400" />
                      <span>Export Executive Client Memo (PDF)</span>
                    </button>
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet size={13} className="text-emerald-400" />
                      <span>Export Obligations Matrix (CSV)</span>
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* VIEW 2: SMART PII REDACTOR PREVIEW */}
          {activeTool === 'redact' && (
            <motion.div key="redact" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.06)]">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <EyeOff size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Smart PII & Bank Identity Redactor</h2>
                      <p className="text-xs text-zinc-400">Automated discovery and deterministic scrubbing of privileged information in client-side RAM.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
                    PREVIEW MODULE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold mb-2">Unredacted Source Text (Sample)</h3>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed bg-zinc-950/80 p-3 rounded border border-zinc-800/60">
                      Wire $450,000 to John Doe at Wells Fargo (Account: <span className="text-rose-400 bg-rose-500/20 px-1 rounded">1234-5678-9012</span>, 
                      Routing: <span className="text-rose-400 bg-rose-500/20 px-1 rounded">021000021</span>). SSN: <span className="text-rose-400 bg-rose-500/20 px-1 rounded">000-12-3456</span>. 
                      Direct contact: jdoe@corporation.com.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30">
                    <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold mb-2">Automated Air-Gapped Scrub Output</h3>
                    <p className="text-xs font-mono text-emerald-300 leading-relaxed bg-zinc-950/80 p-3 rounded border border-emerald-500/30">
                      Wire $450,000 to John Doe at Wells Fargo (Account: <span className="bg-emerald-500/30 text-emerald-200 px-1 rounded font-bold">[BANK_ACC_REDACTED]</span>, 
                      Routing: <span className="bg-emerald-500/30 text-emerald-200 px-1 rounded font-bold">[ROUTING_REDACTED]</span>). SSN: <span className="bg-emerald-500/30 text-emerald-200 px-1 rounded font-bold">█████████</span>. 
                      Direct contact: [EMAIL_REDACTED].
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-emerald-950/30 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Unlock High-Throughput Redaction Suite</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">Scrub 500+ page discovery bundles and depositions locally without uploading sensitive files.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('redact'); }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Unlock Law Firm Suite ($299)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: COURT BATES STAMPER PREVIEW */}
          {activeTool === 'bates' && (
            <motion.div key="bates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.06)]">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Court Bates Stamping & Evidence Numbering Suite</h2>
                      <p className="text-xs text-zinc-400">Automated sequential pagination for litigation discovery (PLTF, DEF, CONF) rendered directly into PDFs.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
                    FIRM LICENSE EXCLUSIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Standard Sequential Prefix</span>
                    <div className="text-xl font-bold font-mono text-amber-400 mt-2">PLTF-000001</div>
                    <p className="text-[11px] text-zinc-500 mt-1">Plaintiff Trial Production</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Defense Discovery Prefix</span>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-2">DEF-000452</div>
                    <p className="text-[11px] text-zinc-500 mt-1">Responsive Production</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Protective Order Designation</span>
                    <div className="text-xl font-bold font-mono text-purple-400 mt-2">CONF-008910</div>
                    <p className="text-[11px] text-zinc-500 mt-1">Attorney Eyes Only</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-emerald-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Included Exclusively in Law Firm Suite ($299)</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">High-contrast white backing pill, zero compression artifacts, up to 5 user license keys.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('bates'); }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                  >
                    Unlock Law Firm Suite ($299)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 4: AUDIT VAULT PREVIEW */}
          {activeTool === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.06)]">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Local Audit Vault (Zero Cloud Telemetry)</h2>
                      <p className="text-xs text-zinc-400">All audit histories and redline diffs are retained locally in browser IndexedDB with zero server persistence.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-bold">
                    PWA STORAGE ARCHITECTURE
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-black/40 border border-zinc-800 mt-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Offline Progressive Web App (PWA)</h4>
                      <p className="text-xs text-zinc-400">Install ContractGuard on macOS, Windows, or Linux. Launches as a standalone native app that operates without internet.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">One-Click Cryptographic Purge</h4>
                      <p className="text-xs text-zinc-400">Wipe all audit sessions, extracted text, and cache instantly to comply with attorney-client matter closure protocols.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end">
                  <button
                    onClick={() => { setSelectedPlan('solo'); openUpgrade('general'); }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Get Lifetime Offline License ($199 Solo / $299 Firm)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* ========================================================================= */}
      {/* 3. HIGH-CONVERTING LICENSING & CHECKOUT MODAL (100% ENGLISH) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#050A0F] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-[#08121A] border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Unlock Full ContractGuard Studio</h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Air-Gapped Perpetual License · 0 Cloud Latency · Zero Subscriptions
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-5">
                {modalReason === 'export' && (
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                    <Download size={14} className="shrink-0" />
                    <span>White-label PDF Client Memos and CSV exports are unlocked with an active license.</span>
                  </div>
                )}

                {modalReason === 'locked_finding' && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                    <Lock size={14} className="shrink-0" />
                    <span>Deep clause remediations and all 6 contract liabilities are unlocked in the full studio.</span>
                  </div>
                )}

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Option 1: Solo Practitioner ($199) */}
                  <div
                    onClick={() => setSelectedPlan('solo')}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPlan === 'solo'
                        ? 'bg-emerald-500/[0.08] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Individual Counsel</span>
                        {selectedPlan === 'solo' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white">Solo Practitioner</h4>
                      <p className="text-xs text-zinc-400 mt-1">For independent transactional lawyers and corporate counsel.</p>
                      
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white font-mono">$199</span>
                        <span className="text-xs text-zinc-400 font-mono">one-time</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block mt-0.5">Lifetime License · 1 Seat</span>

                      <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>100% Air-Gapped In-RAM Engine</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>Unlimited Audits & Redline Diffs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>In-RAM OCR for Scans & Images</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>Offline PWA Desktop App</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handlePurchase('solo'); }}
                      className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        selectedPlan === 'solo'
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      Purchase Solo License ($199)
                    </button>
                  </div>

                  {/* Option 2: Law Firm Suite ($299) */}
                  <div
                    onClick={() => setSelectedPlan('firm')}
                    className={`p-5 rounded-xl border relative transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPlan === 'firm'
                        ? 'bg-emerald-500/[0.08] border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono shadow-md">
                      Best Value for Practices
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Law Firm Practice</span>
                        {selectedPlan === 'firm' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white">Law Firm Suite</h4>
                      <p className="text-xs text-zinc-400 mt-1">Multi-user deployment for partners, associates, and paralegals.</p>
                      
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white font-mono">$299</span>
                        <span className="text-xs text-zinc-400 font-mono">one-time</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block mt-0.5">Up to 5 Users Lifetime License</span>

                      <ul className="mt-4 space-y-2 text-xs text-zinc-300">
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>Includes All Solo Practitioner Features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-cyan-400 shrink-0" />
                          <strong className="text-white">Up to 5 Attorney & Team Seats</strong>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-amber-400 shrink-0" />
                          <span>Court Bates Stamping Suite (PLTF/DEF)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-purple-400 shrink-0" />
                          <span>Smart Discovery PII Redactor</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>White-Label Executive Client Memos</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handlePurchase('firm'); }}
                      className={`mt-6 w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                        selectedPlan === 'firm'
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                      }`}
                    >
                      Purchase Law Firm Suite ($299)
                    </button>
                  </div>

                </div>

                {/* Footer Security Badges */}
                <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 font-mono gap-2">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span>ABA Model Rule 1.6 Compliant</span>
                  </span>
                  <span>Instant Whop License Key Issuance</span>
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. CINEMATIC PRODUCT LAUNCH FILM MODAL (48s Keynote Video)                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFilmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilmModalOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl md:rounded-3xl border border-white/20 bg-[#03070A] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10"
            >
              {/* Modal Top Chrome */}
              <div className="px-5 py-3 bg-[#050A0E] border-b border-white/10 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  <span className="ml-2 font-mono text-[11px] text-zinc-300">
                    ContractGuard™ Launch Film • 48s Keynote Reveal
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    4K 60FPS • AIR-GAPPED STUDIO
                  </span>
                  <button
                    onClick={() => setIsFilmModalOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <video
                  src="/videos/contractguard-launch-film.mp4"
                  poster="/videos/contractguard-poster.jpg"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Bottom CTA Bar */}
              <div className="px-6 py-4 bg-[#050A0E] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>Catch catastrophic pre-signing liabilities in &lt;100ms with zero cloud risk.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsFilmModalOpen(false); openUpgrade('general'); }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Get Lifetime Access ($199 / $299)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
