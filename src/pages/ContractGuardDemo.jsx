import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Search, EyeOff, Layers, Database,
  FileText, Upload, RefreshCw, Zap, Lock, ArrowRight, CheckCircle2,
  AlertTriangle, AlertCircle, X, Download, HardDriveDownload,
  Users, User, Briefcase, FileCheck, Check, Sparkles, ExternalLink,
  ChevronRight, Clock, FileCode, FileSpreadsheet, Eye, Play, Volume2, VolumeX,
  Copy
} from 'lucide-react';
import * as mammoth from 'mammoth';

import { useContractWorker } from '../utils/useContractWorker';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { openSeamlessCheckout } from '../utils/checkoutPopup';
import { sanitizeDocumentPII } from '../utils/piiEngine';
import { executeBatesStamping } from '../utils/batesStamper';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { 
  getDemoAuditsRemaining, 
  consumeDemoAudit, 
  resetDemoAuditsForTesting, 
  verifyDeviceLicense,
  initializeHardenedMeter,
  detectIncognitoMode
} from '../utils/licenseManager';
import { enrichFindingWithStatutoryRemedy, enrichAllAuditFindings } from '../utils/statutoryCodex';

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

  // Document contents (Empty buffer initially for user's own draft)
  const [contractText, setContractText] = useState('');
  const [baselineText, setBaselineText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [clientParty, setClientParty] = useState('');
  const [counterparty, setCounterparty] = useState('');

  // Upload & Drag-and-drop state
  const [uploadStatus, setUploadStatus] = useState({ target: '', baseline: '' });
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [isDraggingBaseline, setIsDraggingBaseline] = useState(false);

  // Upgrade Modal & Checkout
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalReason, setModalReason] = useState('general'); // 'general' | 'export' | 'locked_finding' | 'redact' | 'bates'
  const [selectedPlan, setSelectedPlan] = useState('firm'); // 'solo' | 'firm'
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  // Evaluation passes & Device License state
  const [auditsLeft, setAuditsLeft] = useState(() => getDemoAuditsRemaining());
  const [hasActiveLicense, setHasActiveLicense] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);
  const [auditToast, setAuditToast] = useState(null);

  // Interactive Smart PII Redactor Demo State
  const [redactInputText, setRedactInputText] = useState(
    'Wire settlement of $1,450,000 to escrow account of Johnathan Vance at J.P. Morgan Chase (Account No: 4421-8890-1234, Routing No: 021000021). Tax ID (EIN): 12-3456789. Client Social Security: 000-45-6789. Confidential primary contact: jvance@vancelawfirm.com, mobile: +1 (212) 555-0198. Do not disclose merger terms.'
  );
  const [redactResult, setRedactResult] = useState(null);
  const [isRedacting, setIsRedacting] = useState(false);

  const handleRunRedaction = () => {
    if (!redactInputText.trim()) return;
    setIsRedacting(true);
    setTimeout(() => {
      const res = sanitizeDocumentPII(redactInputText, ['ssn', 'creditCard', 'bankAccount', 'email', 'phone', 'ip', 'ein'], [], 'block');
      setRedactResult(res);
      setIsRedacting(false);
    }, 250);
  };

  // Interactive Bates Stamping Demo State
  const [batesPrefix, setBatesPrefix] = useState('PLTF-');
  const [batesStartNum, setBatesStartNum] = useState('000001');
  const [batesPosition, setBatesPosition] = useState('bottom-right');
  const [batesColor, setBatesColor] = useState('black');
  const [batesFile, setBatesFile] = useState(null);
  const [isGeneratingBates, setIsGeneratingBates] = useState(false);

  const handleDownloadSampleBates = async () => {
    setIsGeneratingBates(true);
    try {
      let pdfBytes;
      if (batesFile) {
        pdfBytes = await batesFile.arrayBuffer();
      } else {
        const sampleDoc = await PDFDocument.create();
        const page = sampleDoc.addPage([612, 792]);
        const font = await sampleDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await sampleDoc.embedFont(StandardFonts.HelveticaBold);
        
        page.drawText('UNITED STATES DISTRICT COURT', { x: 50, y: 740, size: 12, font: fontBold });
        page.drawText('SOUTHERN DISTRICT OF NEW YORK', { x: 50, y: 722, size: 10, font });
        page.drawText('CIVIL ACTION NO. 26-CV-04891', { x: 50, y: 704, size: 10, font });
        page.drawText('EXHIBIT A: MASTER TRANSACTION AGREEMENT', { x: 50, y: 660, size: 11, font: fontBold });
        page.drawText('This sample discovery exhibit was stamped client-side in RAM with Nexus ContractGuard.', { x: 50, y: 630, size: 10, font });
        page.drawText('Notice the high-contrast white backing pill ensuring 100% legibility on court filings.', { x: 50, y: 610, size: 10, font });
        
        if (!hasActiveLicense) {
          page.drawText('*** EVALUATION COPY — NOT FOR OFFICIAL COURT FILING — ACTIVATE LICENSE AT NEXUS-OS.STORE ***', {
            x: 50,
            y: 40,
            size: 8,
            font: fontBold,
            color: rgb(0.85, 0.2, 0.2)
          });
        }

        pdfBytes = await sampleDoc.save();
      }

      const result = await executeBatesStamping([pdfBytes], {
        prefix: batesPrefix || 'EX-',
        startNumber: parseInt(batesStartNum, 10) || 1,
        position: batesPosition,
        color: batesColor
      });
      result.download(batesFile ? `Stamped_${batesFile.name}` : `Sample_${batesPrefix || 'EX-'}${batesStartNum || '0001'}.pdf`);
    } catch (e) {
      console.error('Failed to generate sample Bates PDF', e);
      alert('Error generating Bates sample: ' + e.message);
    } finally {
      setIsGeneratingBates(false);
    }
  };

  // Local Vault Purge State
  const [vaultPurged, setVaultPurged] = useState(false);
  const handlePurgeVault = () => {
    setContractText('');
    setBaselineText('');
    setRedactResult(null);
    setVaultPurged(true);
    setTimeout(() => setVaultPurged(false), 3000);
  };

  // Dedicated In-Memory Audit Hook
  const {
    isProcessing,
    progress,
    result: auditResults,
    error: workerError,
    runAnalysis,
    cancelAnalysis
  } = useContractWorker();

  // Check device license & hardened anti-abuse meter on initial mount
  useEffect(() => {
    async function checkLicenseAndMeter() {
      try {
        const lic = await verifyDeviceLicense();
        if (lic && lic.isValid) {
          setHasActiveLicense(true);
        }
        // Deep multi-store audit count recovery (anti-tamper)
        const hardenedCount = await initializeHardenedMeter();
        setAuditsLeft(hardenedCount);

        // Detect Incognito / Ephemeral sandbox
        const incognito = await detectIncognitoMode();
        if (incognito) {
          setIsIncognito(true);
          // In incognito, enforce 1 single trial pass max
          setAuditsLeft((prev) => Math.min(prev, 1));
        }
      } catch (e) {
        console.error('License/Meter check error:', e);
      }
    }
    checkLicenseAndMeter();
  }, []);

  // Execute in-memory audit with evaluation pass tracking
  const handleRunAudit = async (override) => {
    const isInitial = !!override?.isInitial;

    // Check evaluation limit if user has no activated license
    if (!isInitial && !hasActiveLicense) {
      const remainingBefore = getDemoAuditsRemaining();
      if (remainingBefore <= 0) {
        openUpgrade('locked_finding');
        return;
      }
    }

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
      if (!isInitial && !hasActiveLicense) {
        const updated = isIncognito ? 0 : consumeDemoAudit();
        setAuditsLeft(updated);
      }

      const res = await runAnalysis({
        mode: targetMode,
        text: targetText.trim(),
        baselineText: targetMode === 'comparative' ? targetBaseline.trim() : '',
        clientParty: targetClient.trim(),
        counterparty: targetCounter.trim(),
        options: {
          diffOptions: { granularity: diffGranularity }
        }
      });

      if (!isInitial) {
        const currentRemaining = getDemoAuditsRemaining();
        setAuditToast({
          ms: res?.processingDurationMs || 79,
          remaining: hasActiveLicense ? 'Unlimited' : currentRemaining
        });
        setTimeout(() => setAuditToast(null), 8000);
      }
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
    const tier = planTier || selectedPlan || 'firm';
    openSeamlessCheckout({
      plan: tier,
      toolName: 'contractcompare',
      onSuccess: () => navigate('/app/contractcompare')
    });
  };

  const [copiedDemoId, setCopiedDemoId] = useState(null);

  const handleCopyDemoRedline = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedDemoId(id);
    setTimeout(() => setCopiedDemoId(null), 2500);
  };

  const enrichedAudit = useMemo(() => {
    if (!auditResults) return null;
    return enrichAllAuditFindings(auditResults);
  }, [auditResults]);

  // Consolidate findings from auditResults with statutory enrichment
  const findingsList = useMemo(() => {
    if (enrichedAudit && enrichedAudit.allEnriched?.length > 0) {
      return enrichedAudit.allEnriched.map((f, i) => ({
        id: f.id || `enriched_${i}`,
        category: f.category || 'CONTRACT INTEGRITY',
        severity: f.severityTier === 'critical_deal_breaker' ? 'critical' : 'high',
        clause: f.clauseRef || f.clause || `Line ${f.line}`,
        title: f.title,
        explanation: f.details || f.explanation || f.snippet || '',
        snippet: f.snippet || '',
        malpracticeRisk: f.malpracticeRisk,
        statutoryCitation: f.statutoryCitation,
        precedent: f.precedent,
        courtGradeRedline: f.courtGradeRedline,
        remedy: f.actionableAdvice || f.courtGradeRedline
      }));
    }

    // Fallback default hazardous findings ONLY if parsing the hazardous sample contract without worker result
    if (contractText === HAZARDOUS_SAMPLE_CONTRACT) {
      return [
        enrichFindingWithStatutoryRemedy({
          id: 'def_1',
          category: 'FINANCIAL CONTRADICTION',
          severity: 'critical',
          clause: 'Clause 4.1',
          writtenWords: 'Two Hundred Fifty Thousand Dollars',
          numericStr: '$205,000',
          correctedNum: '$250,000',
          title: 'Written Words Do Not Match Numeric Figure',
          snippet: 'Buyer shall pay Seller the total purchase price of Two Hundred Fifty Thousand Dollars ($205,000)...',
          line: 44
        }),
        enrichFindingWithStatutoryRemedy({
          id: 'def_2',
          category: 'CROSS-REFERENCE FAILURE',
          targetName: 'Section 14.2',
          severity: 'high',
          clause: 'Clause 2.1 & Clause 9.2',
          title: 'Broken Target: Section 14.2 Does Not Exist',
          snippet: '...unless terminated earlier in accordance with Section 14.2.',
          line: 37
        }),
        enrichFindingWithStatutoryRemedy({
          id: 'def_3',
          category: 'MISSING EXHIBIT SCHEDULE',
          targetName: 'Exhibit C',
          severity: 'critical',
          clause: 'Clause 3.1',
          title: 'Missing Exhibit C (Disclosure Schedules)',
          snippet: '...all disclosure schedules set forth in Exhibit C, which are incorporated herein by reference.',
          line: 40
        }),
        enrichFindingWithStatutoryRemedy({
          id: 'def_4',
          category: 'UNDEFINED CAPITALIZED TERM',
          term: 'Key Personnel',
          severity: 'medium',
          clause: 'Clause 3.2',
          title: 'Undefined Term: "Key Personnel"',
          snippet: 'Seller shall furnish key managerial services utilizing Key Personnel as designated in Schedule 1.',
          line: 41
        })
      ];
    }

    return [];
  }, [enrichedAudit, auditResults, contractText]);

  const riskScore = auditResults?.overallRiskScore?.score ?? null;
  const riskLevel = auditResults?.overallRiskScore?.level || null;
  const processingMs = auditResults?.processingDurationMs ?? null;

  return (
    <div className="min-h-screen bg-[#F7F9FA] text-[#0F1B2A] font-ui flex flex-col md:flex-row relative overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR — 1:1 REPLICA OF THE OFFICIAL AIR-GAPPED LEGAL STUDIO */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-[280px] bg-[#0C2A42] border-r border-[#123B5C] flex flex-col shrink-0 z-20 text-white">
        
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#123B5C]">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#123B5C] border border-[#1E5682] flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="text-[#86EFAC]" size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-ui">
                  ContractGuard
                  <span className="font-mono text-[9px] bg-[#0E6B52] text-white border border-[#0E6B52]/40 px-1.5 py-0.2 rounded font-bold uppercase">
                    Demo
                  </span>
                </h1>
                <p className="text-[10px] text-white/60 font-mono tracking-wider uppercase">Air-Gapped Legal Studio</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/70 bg-white/10 border border-white/15 px-2 py-0.5 rounded-md">v2.4 Pro</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/90 font-mono">
            <ShieldCheck size={12} className="shrink-0 text-[#86EFAC]" />
            <span>Air-Gapped · RAM-Only · 0 Cloud</span>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar font-ui">
          <p className="text-[9px] uppercase tracking-[0.15em] text-white/50 font-semibold px-2 mb-1">Studio Modules</p>

          {/* Module 1: Analyzer (Active Demo Engine) */}
          <button
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'analyzer'
                ? 'bg-[#123B5C] text-white font-bold border-l-4 border-l-[#0E6B52] shadow-xs'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Search size={16} className={activeTool === 'analyzer' ? 'text-[#86EFAC] shrink-0' : 'text-white/50 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold leading-tight truncate">Integrity & Diff Audit</p>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5 truncate">Pre-signing review & redline</p>
            </div>
            {activeTool === 'analyzer' && <div className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] shrink-0" />}
          </button>
          {activeTool === 'analyzer' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/60 font-bold mb-1.5">Interactive Evaluation Guide</p>
              <div className="space-y-1.5 text-[10.5px] leading-relaxed text-white/75">
                <p><span className="text-[#86EFAC] font-semibold">1. Unrestricted Sandbox:</span> Test our pre-loaded hazardous contract or paste any client draft.</p>
                <p><span className="text-[#93C5FD] font-semibold">2. In-RAM Speed:</span> Executes 5 detection engines locally in &lt;100ms without cloud transmission.</p>
                <p><span className="text-[#FDE68A] font-semibold">3. Free Evaluation:</span> 3 full unblurred audits included. Test your matters before unlocking perpetual access.</p>
              </div>
            </div>
          )}

          {/* Module 2: PII Redactor */}
          <button
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'redact'
                ? 'bg-[#123B5C] text-white font-bold border-l-4 border-l-[#0E6B52] shadow-xs'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <EyeOff size={16} className={activeTool === 'redact' ? 'text-[#86EFAC] shrink-0' : 'text-white/50 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
                <span className="text-[8.5px] font-mono uppercase bg-white/10 text-white/90 border border-white/20 px-1 py-0.2 rounded font-bold">
                  Preview
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5 truncate">Identity & financial scrub</p>
            </div>
            {activeTool === 'redact' && <div className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] shrink-0" />}
          </button>

          {/* Module 3: Bates Stamping */}
          <button
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'bates'
                ? 'bg-[#123B5C] text-white font-bold border-l-4 border-l-[#0E6B52] shadow-xs'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Layers size={16} className={activeTool === 'bates' ? 'text-[#86EFAC] shrink-0' : 'text-white/50 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
                <span className="text-[8.5px] font-mono uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-1 py-0.2 rounded font-bold">
                  Firm Only
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5 truncate">Court evidence numbering</p>
            </div>
            {activeTool === 'bates' && <div className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] shrink-0" />}
          </button>

          {/* Module 4: Audit Vault */}
          <button
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-left ${
              activeTool === 'history'
                ? 'bg-[#123B5C] text-white font-bold border-l-4 border-l-[#0E6B52] shadow-xs'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Database size={16} className={activeTool === 'history' ? 'text-[#86EFAC] shrink-0' : 'text-white/50 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
                <span className="text-[8.5px] font-mono uppercase bg-white/10 text-white/90 border border-white/20 px-1 py-0.2 rounded font-bold">
                  PWA Only
                </span>
              </div>
              <p className="text-[10px] text-white/50 mt-0.5 truncate">Encrypted local persistence</p>
            </div>
            {activeTool === 'history' && <div className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] shrink-0" />}
          </button>
        </nav>

        {/* Sidebar Upgrade CTA Card */}
        <div className="p-3.5 mx-3 mb-3 rounded-xl bg-white/5 border border-white/10 font-ui">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase font-bold text-[#86EFAC]">Perpetual License</span>
            <span className="text-[10px] font-bold text-white/60">Zero SaaS Fees</span>
          </div>
          <p className="text-[11px] text-white/80 leading-snug mb-3">
            Deploy on attorney workstations with zero cloud telemetry. Lifetime updates included.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => { setSelectedPlan('solo'); openUpgrade('general'); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-semibold text-white transition-colors cursor-pointer"
            >
              <span>Solo Practitioner (1 User)</span>
              <span className="font-mono text-[#86EFAC] font-bold">$199</span>
            </button>
            <button
              onClick={() => { setSelectedPlan('firm'); openUpgrade('general'); }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white text-[11px] font-extrabold transition-all border border-white/20 shadow-xs cursor-pointer"
            >
              <span>Law Firm Suite (5 Users)</span>
              <span className="font-mono">$299</span>
            </button>
          </div>
        </div>

        {/* Bottom Home Nav */}
        <div className="px-4 py-3 border-t border-[#123B5C] flex items-center justify-between text-[11px] text-white/60 font-ui">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Nexus OS Portal
          </button>
          <span className="font-mono text-[10px] text-white/50">Evaluation Mode</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN COCKPIT WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto z-10 custom-scrollbar flex flex-col font-ui">
        
        {/* Top Floating Evaluation Banner */}
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${auditsLeft > 0 || hasActiveLicense ? 'bg-[#0E6B52] animate-pulse' : 'bg-[#D97706]'}`} />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#0F1B2A]">
                {hasActiveLicense ? (
                  <span className="text-[#0E6B52] font-mono font-bold">🟢 Licensed Studio Active · Unlimited In-RAM Forensic Audits</span>
                ) : (
                  <span>
                    Evaluation Sandbox: <strong className="text-[#0E6B52] font-mono">{auditsLeft} of 3 Free Full Audits Remaining</strong>
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-[#123B5C] bg-[#123B5C]/10 border border-[#123B5C]/20 px-2 py-0.5 rounded font-bold">
                100% Unblurred Forensic Findings
              </span>
            </div>
            <span className="hidden lg:inline text-[11px] font-mono text-[#5A6B7A] bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#D9E1E7]">
              ABA Model Rule 1.6 Compliant
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilmModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#F7F9FA] hover:bg-[#E5EAEF] border border-[#D9E1E7] text-[#123B5C] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs group"
            >
              <div className="w-4 h-4 rounded-full bg-[#123B5C]/10 flex items-center justify-center text-[#123B5C] group-hover:scale-110 transition-transform">
                <Play size={9} className="ml-0.5 fill-[#123B5C]" />
              </div>
              <span>Watch Launch Film (48s)</span>
            </button>

            <button
              onClick={() => openUpgrade('general')}
              className="px-3.5 py-1.5 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Unlock Full License</span>
              <span className="font-mono text-white/80">($199 Solo / $299 Firm)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Ephemeral Sandbox / Incognito Mode Warning Banner */}
        {isIncognito && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 text-xs text-[#92400E]">
            <div className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1.5 text-[#B45309]">
                🔒 Ephemeral Sandbox (Private Browsing Detected):
              </span>
              <span>1 trial audit allocated. RAM state is volatile and clears upon window closure. Remediation for finding #4+ and official exports remain gated.</span>
            </div>
            <button
              onClick={() => openUpgrade('general')}
              className="px-2.5 py-1 rounded bg-[#B45309] hover:bg-[#92400E] text-white text-[11px] font-bold cursor-pointer shrink-0 transition-colors shadow-xs"
            >
              Unlock Full License ($199)
            </button>
          </div>
        )}

        {/* Value-Anchored Audit Toast Banner */}
        <AnimatePresence>
          {auditToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3.5 rounded-xl bg-[#FFFFFF] border-l-4 border-l-[#0E6B52] border-y border-r border-[#D9E1E7] shadow-md flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#0E6B52]/10 text-[#0E6B52] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-[#0F1B2A]">
                  <strong>Forensic Audit Complete in {auditToast.ms}ms:</strong> All latent liabilities flagged in isolated client-side RAM with zero cloud leakage.
                </span>
                <span className="font-mono text-[#0E6B52] bg-[#0E6B52]/10 px-2 py-0.5 rounded border border-[#0E6B52]/30 font-bold">
                  {typeof auditToast.remaining === 'number' ? `${auditToast.remaining} of 3 Free Passes Left` : 'Perpetual Licensed'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openUpgrade('general')}
                  className="px-3 py-1 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <span>Unlock Unlimited Lifetime Access</span>
                  <ArrowRight size={11} />
                </button>
                <button 
                  onClick={() => setAuditToast(null)}
                  className="p-1 text-[#5A6B7A] hover:text-[#0F1B2A] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOOL VIEWS SWITCHER */}
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: CONTRACT ANALYZER & DIFF AUDIT (FLAGSHIP DEMO) */}
          {activeTool === 'analyzer' && (
            <motion.div key="analyzer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4 font-ui">
              
              {/* Matter Metadata Bar */}
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">Matter Title:</span>
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      className="bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-2.5 py-1 text-xs text-[#0F1B2A] font-medium focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none w-56 md:w-64 transition-colors"
                      placeholder="Matter Title..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">Client:</span>
                    <input
                      type="text"
                      value={clientParty}
                      onChange={(e) => setClientParty(e.target.value)}
                      className="bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-2.5 py-1 text-xs text-[#0F1B2A] font-medium focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none w-36 transition-colors"
                      placeholder="Client Entity"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">Counterparty:</span>
                    <input
                      type="text"
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      className="bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-2.5 py-1 text-xs text-[#0F1B2A] font-medium focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none w-40 transition-colors"
                      placeholder="Counterparty Entity"
                    />
                  </div>
                </div>

                {/* Single Draft vs Comparative Diff Mode Toggle */}
                <div className="flex items-center bg-[#E5EAEF] border border-[#D9E1E7] p-1 rounded-xl">
                  <button
                    onClick={() => { setAnalysisMode('single'); }}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      analysisMode === 'single'
                        ? 'bg-[#123B5C] text-white shadow-xs'
                        : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
                    }`}
                  >
                    Single Draft Integrity
                  </button>
                  <button
                    onClick={() => { setAnalysisMode('comparative'); }}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      analysisMode === 'comparative'
                        ? 'bg-[#123B5C] text-white shadow-xs'
                        : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
                    }`}
                  >
                    Comparative Redline Diff
                  </button>
                </div>
              </div>

              {/* Workspace Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-xl border border-[#D9E1E7] shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#123B5C] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw size={13} className="text-[#0E6B52]" />
                    <span>Reset Sample M&A Contract</span>
                  </button>
                  <span className="text-[11px] text-[#5A6B7A] font-mono hidden md:inline">
                    · Or paste your own draft / drop files (.docx, .pdf, .png scan)
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleRunAudit()}
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw size={14} className="animate-spin text-[#60A5FA]" />
                        <span>Auditing in Local RAM...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} className="text-[#60A5FA]" />
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
                    className={`flex flex-col rounded-xl bg-[#FFFFFF] border transition-colors overflow-hidden shadow-xs ${
                      isDraggingBaseline ? 'border-[#0E6B52] bg-[#F0FDF4] ring-2 ring-[#0E6B52]/20' : 'border-[#D9E1E7]'
                    }`}
                  >
                    <div className="px-4 py-2.5 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between text-xs">
                      <span className="font-ui text-[#123B5C] font-bold flex items-center gap-1.5">
                        <FileCode size={14} className="text-[#123B5C]" />
                        <span>ORIGINAL BASELINE CONTRACT</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-ui text-[#123B5C] hover:text-[#0C2A42] cursor-pointer flex items-center gap-1 bg-[#FFFFFF] hover:bg-[#F7F9FA] px-2.5 py-1 rounded-lg border border-[#D9E1E7] font-bold transition-colors shadow-xs">
                          <Upload size={11} />
                          <span>Browse Baseline File</span>
                          <input 
                            type="file" 
                            accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                            onChange={(e) => handleFileUpload(e, setBaselineText, 'baseline')} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-[10px] font-mono text-[#5A6B7A]">
                          {baselineText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    </div>

                    {uploadStatus.baseline && (
                      <div className="px-3 py-1 bg-[#F0FDF4] text-[#0E6B52] text-[10px] font-mono border-b border-[#D9E1E7]">
                        {uploadStatus.baseline}
                      </div>
                    )}

                    {!baselineText.trim() ? (
                      <div className="p-8 border-2 border-dashed border-[#D9E1E7] hover:border-[#123B5C]/50 rounded-xl m-4 bg-[#F7F9FA] flex flex-col items-center justify-center text-center transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] mb-2 shadow-xs">
                          <Upload size={22} />
                        </div>
                        <h4 className="text-xs font-bold text-[#0F1B2A] tracking-tight font-ui">
                          Drop Baseline Agreement Here (.docx / .pdf)
                        </h4>
                        <p className="text-[11px] text-[#5A6B7A] max-w-xs mt-1 mb-3 font-ui">
                          Upload previous execution version or counterparty initial draft for redline diff comparison.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 font-ui">
                          <label className="px-3.5 py-1.5 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs">
                            <Upload size={11} />
                            <span>Select Baseline File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                              onChange={(e) => handleFileUpload(e, setBaselineText, 'baseline')} 
                              className="hidden" 
                            />
                          </label>
                          <a
                            href="/samples/02_Apex_Acquisition_Agreement_BASELINE.docx"
                            download
                            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-[#123B5C] text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Download size={11} className="text-[#123B5C]" />
                            <span>Download Baseline .DOCX</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <textarea
                          value={baselineText}
                          onChange={(e) => setBaselineText(e.target.value)}
                          className="w-full bg-[#FFFFFF] p-5 text-[14px] font-serif leading-[1.8] text-[#0F1B2A] outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-[#FFFFFF] transition-colors"
                          placeholder="Original baseline contract text..."
                        />
                        <button
                          onClick={() => setBaselineText('')}
                          className="absolute top-2 right-4 text-[10px] font-mono bg-[#FFFFFF] hover:bg-[#FDF2F2] hover:text-[#B3261E] border border-[#D9E1E7] px-2 py-0.5 rounded text-[#5A6B7A] transition-colors shadow-xs cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Target Unexecuted Draft Pane */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingTarget(true); }}
                  onDragLeave={() => setIsDraggingTarget(false)}
                  onDrop={(e) => handleFileDrop(e, setContractText, 'target', setIsDraggingTarget)}
                  className={`flex flex-col rounded-xl bg-[#FFFFFF] border transition-colors overflow-hidden shadow-xs ${
                    isDraggingTarget ? 'border-[#0E6B52] bg-[#F0FDF4] ring-2 ring-[#0E6B52]/20' : 'border-[#D9E1E7]'
                  }`}
                >
                  <div className="px-4 py-2.5 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between text-xs">
                    <span className="font-ui text-[#123B5C] font-bold flex items-center gap-1.5">
                      <FileText size={14} className="text-[#0E6B52]" />
                      <span>{analysisMode === 'comparative' ? 'COUNTERPARTY REDLINE / AMENDED DRAFT' : 'UNEXECUTED CONTRACT DRAFT (Interactive Buffer)'}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-ui text-[#123B5C] hover:text-[#0C2A42] cursor-pointer flex items-center gap-1 bg-[#FFFFFF] hover:bg-[#F7F9FA] px-2.5 py-1 rounded-lg border border-[#D9E1E7] font-bold transition-colors shadow-xs">
                        <Upload size={11} />
                        <span>Upload Contract (.pdf, .docx, scan)</span>
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                          onChange={(e) => handleFileUpload(e, setContractText, 'target')} 
                          className="hidden" 
                        />
                      </label>
                      <span className="text-[10px] font-mono text-[#5A6B7A]">
                        {contractText.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                  </div>

                  {uploadStatus.target && (
                    <div className="px-3 py-1 bg-[#F0FDF4] text-[#0E6B52] text-[10px] font-mono border-b border-[#D9E1E7]">
                      {uploadStatus.target}
                    </div>
                  )}

                  {!contractText.trim() ? (
                    <div className="p-8 border-2 border-dashed border-[#D9E1E7] hover:border-[#123B5C]/50 rounded-xl m-4 bg-[#F7F9FA] flex flex-col items-center justify-center text-center transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] mb-3 shadow-xs">
                        <Upload size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-[#0F1B2A] tracking-tight font-ui">
                        Drag & Drop Your Unexecuted Contract Here
                      </h3>
                      <p className="text-xs text-[#5A6B7A] max-w-sm mt-1 mb-4 leading-relaxed font-ui">
                        Supports Word <strong className="text-[#123B5C]">.docx</strong>, <strong className="text-[#123B5C]">.pdf</strong> (native & scanned with In-RAM OCR), and text files. 100% processed locally in workstation RAM.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2.5 font-ui">
                        <label className="px-4 py-2 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5">
                          <Upload size={13} />
                          <span>Browse Contract File</span>
                          <input 
                            type="file" 
                            accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                            onChange={(e) => handleFileUpload(e, setContractText, 'target')} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          onClick={handleLoadSample}
                          className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#123B5C] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <RefreshCw size={12} className="text-[#0E6B52]" />
                          <span>Load Sample Hazardous M&A Draft</span>
                        </button>
                        <a
                          href="/samples/01_Apex_Acquisition_Agreement_DEFECTIVE.docx"
                          download
                          className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#5A6B7A] hover:text-[#0F1B2A] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download size={12} className="text-[#123B5C]" />
                          <span>Download Sample .DOCX</span>
                        </a>
                      </div>
                      <div className="mt-4 text-[10.5px] font-mono text-[#5A6B7A]">
                        Or paste raw contract clauses directly below:
                      </div>
                      <textarea
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                        className="w-full mt-2 bg-[#FFFFFF] p-3 text-xs font-serif rounded-lg border border-[#D9E1E7] outline-none resize-none min-h-[90px] focus:border-[#123B5C]"
                        placeholder="Paste contract clauses here..."
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <textarea
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                        className="w-full bg-[#FFFFFF] p-5 text-[14px] font-serif leading-[1.8] text-[#0F1B2A] outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-[#FFFFFF] transition-colors"
                        placeholder="Paste unexecuted contract draft here, type changes, or drop files..."
                      />
                      <button
                        onClick={() => setContractText('')}
                        className="absolute top-2 right-4 text-[10px] font-mono bg-[#FFFFFF] hover:bg-[#FDF2F2] hover:text-[#B3261E] border border-[#D9E1E7] px-2 py-0.5 rounded text-[#5A6B7A] transition-colors shadow-xs cursor-pointer"
                      >
                        Clear Buffer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* In-RAM Processing Status Indicator */}
              {isProcessing && (
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#123B5C]/30 flex items-center justify-between shadow-xs font-ui">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#123B5C]/10 flex items-center justify-center animate-spin">
                      <RefreshCw size={16} className="text-[#123B5C]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F1B2A] font-mono">
                        {progress?.stage || 'AUDITING CONTRACT IN ISOLATED RAM'}
                      </p>
                      <p className="text-[11px] text-[#0E6B52] font-mono font-semibold">
                        {progress?.msg || 'Validating cross-references, defined terms, and financial amounts...'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#123B5C] font-bold">
                    {progress?.percent || 60}%
                  </span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* RESULTS & AUDIT RADAR HUD */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2 font-ui">
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold">Execution Speed</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#0E6B52] font-mono tabular-nums">
                      {processingMs !== null ? processingMs : '--'}
                    </span>
                    <span className="text-xs font-mono text-[#5A6B7A]">ms</span>
                  </div>
                  <span className="text-[10px] text-[#5A6B7A] font-mono">
                    {processingMs !== null ? 'Single pass · 0 network latency' : 'Awaiting document buffer'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors shadow-xs ${
                  riskScore !== null && riskScore > 50 
                    ? 'bg-[#FDF2F2] border-[#FCA5A5]' 
                    : 'bg-[#FFFFFF] border-[#D9E1E7]'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold">Overall Risk Score</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black font-mono tabular-nums ${
                      riskScore !== null && riskScore > 50 ? 'text-[#B3261E]' : 'text-[#0E6B52]'
                    }`}>
                      {riskScore !== null ? riskScore : '--'}
                    </span>
                    <span className="text-xs font-mono text-[#5A6B7A]">/ 100</span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono uppercase ${
                    riskScore !== null && riskScore > 50 ? 'text-[#B3261E]' : 'text-[#5A6B7A]'
                  }`}>
                    {auditResults ? `${(riskLevel || 'audited').toUpperCase()} · ${findingsList.length} Deficiencies Found` : 'Awaiting Audit Execution'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold">Cross-Clause References</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-[#123B5C] font-mono tabular-nums">
                      {auditResults ? (auditResults?.crossRefs?.stats?.totalReferencesFound ?? 0) : '--'}
                    </span>
                    <span className="text-xs font-mono text-[#5A6B7A]">targets</span>
                  </div>
                  <span className="text-[10px] text-[#5A6B7A] font-mono">
                    {auditResults 
                      ? `${auditResults?.crossRefs?.issues?.length || 0} Broken Target${auditResults?.crossRefs?.issues?.length === 1 ? '' : 's'}` 
                      : 'Awaiting Audit'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold">Financial Consistency</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black font-mono tabular-nums ${
                      auditResults && auditResults.financialDates?.issues?.length ? 'text-[#B3261E]' : 'text-[#0E6B52]'
                    }`}>
                      {auditResults ? (auditResults.financialDates?.issues?.length ? 'MISMATCH' : 'SYNCHRONIZED') : '--'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#5A6B7A]">
                    {auditResults 
                      ? `${auditResults.financialDates?.issues?.length || 0} Financial Discrepanc${auditResults.financialDates?.issues?.length === 1 ? 'y' : 'ies'}` 
                      : 'Awaiting Audit'}
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* FINDINGS LIST: 100% UNBLURRED (3 FREE EVALUATIONS) OR PAYWALL WHEN DEPLETED */}
              {/* ========================================================================= */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] overflow-hidden mt-2 shadow-xs font-ui">
                <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Search size={15} className="text-[#123B5C]" />
                    <span className="font-ui text-xs font-bold text-[#0F1B2A]">
                      LEGAL AUDIT FINDINGS & LIABILITIES ({findingsList.length} ISSUES)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasActiveLicense ? (
                      <span className="text-[10px] font-mono bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30 px-2 py-0.5 rounded-full font-bold">
                        Perpetual License Active
                      </span>
                    ) : auditsLeft > 0 ? (
                      <span className="text-[10px] font-mono bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] animate-pulse" />
                        <span>{auditsLeft} of 3 Free Full Audits Left (Unblurred)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                        <Lock size={10} />
                        <span>Trial Limit Reached</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 relative">
                  
                  {/* Frosted Glass Gate Overlay ONLY when user is out of audits and not licensed */}
                  {(!hasActiveLicense && auditsLeft <= 0) && (
                    <div className="absolute inset-0 bg-[#FFFFFF]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 rounded-xl border border-[#D9E1E7] shadow-xl">
                      <div className="w-14 h-14 rounded-2xl bg-[#D97706]/10 border border-[#D97706]/20 flex items-center justify-center text-[#D97706] mb-3 shadow-xs">
                        <Lock size={26} />
                      </div>
                      
                      <h4 className="text-lg font-extrabold text-[#0F1B2A] tracking-tight font-ui">
                        3 of 3 Free Forensic Audits Completed
                      </h4>
                      
                      <p className="text-xs text-[#5A6B7A] max-w-lg mt-2 leading-relaxed font-ui">
                        You have tested ContractGuard's in-RAM forensic detection on real legal drafts. 
                        To audit unlimited contracts, export court-ready white-label memos (PDF/CSV), and protect client files offline with zero cloud risk, activate your perpetual license.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 mt-5 font-ui">
                        <button
                          onClick={() => { setSelectedPlan('solo'); openUpgrade('locked_finding'); }}
                          className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-bold text-[#123B5C] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Unlock Solo License ($199)</span>
                        </button>

                        <button
                          onClick={() => { setSelectedPlan('firm'); openUpgrade('locked_finding'); }}
                          className="px-6 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                        >
                          <Sparkles size={14} className="text-[#60A5FA]" />
                          <span>Unlock Law Firm Suite — $299 (5 Seats)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Empty State Prompt: When user hasn't audited any text yet */}
                  {!auditResults && !isProcessing && (
                    <div className="py-12 px-6 text-center flex flex-col items-center justify-center font-ui">
                      <div className="w-14 h-14 rounded-2xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] mb-3.5 shadow-xs">
                        <Zap size={26} />
                      </div>
                      <h4 className="text-base font-bold text-[#0F1B2A] tracking-tight">
                        Forensic Audit Engine Standing By (In-Memory RAM)
                      </h4>
                      <p className="text-xs text-[#5A6B7A] max-w-md mt-1.5 leading-relaxed">
                        Paste your unexecuted contract draft into the buffer above, upload a document (.docx, .pdf), or load our pre-packaged hazardous contract to test instant in-RAM forensic detection.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                        <button
                          onClick={handleLoadSample}
                          className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#123B5C] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <RefreshCw size={13} className="text-[#0E6B52]" />
                          <span>Load Sample Hazardous M&A Contract</span>
                        </button>
                        <button
                          onClick={() => handleRunAudit()}
                          disabled={!contractText.trim()}
                          className="px-6 py-2 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white text-xs font-extrabold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                        >
                          <Play size={13} className="text-[#60A5FA]" />
                          <span>Run Air-Gapped Audit</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean State: Audited and zero defects detected */}
                  {auditResults && findingsList.length === 0 && (
                    <div className="py-10 px-6 text-center flex flex-col items-center justify-center font-ui">
                      <div className="w-12 h-12 rounded-2xl bg-[#0E6B52]/10 border border-[#0E6B52]/30 flex items-center justify-center text-[#0E6B52] mb-3 shadow-xs">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-[#0F1B2A]">
                        Zero Latent Deficiencies Detected
                      </h4>
                      <p className="text-xs text-[#5A6B7A] max-w-md mt-1">
                        All cross-references resolve, financial figures and words are synchronized, and all defined terms are verified.
                      </p>
                    </div>
                  )}

                  {/* Dynamic Findings List — 100% Fully Visible During 3 Free Audits */}
                  {findingsList.map((finding, idx) => {
                    const isCritical = finding.severity === 'critical';
                    const isHigh = finding.severity === 'high';
                    const badgeBg = isCritical 
                      ? 'bg-[#FEE2E2] text-[#991B1B] border-[#F87171]' 
                      : isHigh 
                      ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]' 
                      : 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]';
                    const containerBg = isCritical
                      ? 'bg-[#FDF2F2] border-[#FCA5A5]'
                      : isHigh
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#FFFFFF] border-[#D9E1E7]';

                    return (
                      <div key={finding.id || idx} className={`p-4 rounded-xl border relative transition-all shadow-xs ${containerBg} font-ui`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg}`}>
                              {finding.severity?.toUpperCase()} · {finding.category}
                            </span>
                            {finding.clause && (
                              <span className="text-xs font-mono text-[#5A6B7A] font-semibold">{finding.clause}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#0E6B52] bg-[#0E6B52]/10 border border-[#0E6B52]/20 px-2 py-0.5 rounded flex items-center gap-1 shrink-0 font-bold">
                            <CheckCircle2 size={11} />
                            Full Forensic Finding
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#0F1B2A] mt-1">
                          {finding.title}
                        </h4>
                        
                        {finding.explanation && (
                          <p className="text-xs text-[#0F1B2A] mt-1.5 leading-relaxed font-ui">
                            {finding.explanation}
                          </p>
                        )}

                        {/* Malpractice Exposure */}
                        {finding.malpracticeRisk && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#F87171] text-xs text-[#991B1B] leading-relaxed font-ui flex items-start gap-2">
                            <AlertCircle size={14} className="text-[#B3261E] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[#991B1B]">Litigation & Malpractice Risk: </span>
                              <span>{finding.malpracticeRisk}</span>
                            </div>
                          </div>
                        )}

                        {/* Statutory Authority */}
                        {finding.statutoryCitation && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span className="text-[#5A6B7A] font-semibold text-[11px]">Governing Doctrine:</span>
                            <span className="px-2 py-0.5 rounded bg-[#123B5C]/10 border border-[#123B5C]/20 text-[#123B5C] text-[11px] font-bold">
                              ⚖️ {finding.statutoryCitation}
                            </span>
                          </div>
                        )}

                        {/* Court-Grade Redline Replacement */}
                        {finding.courtGradeRedline ? (
                          !hasActiveLicense && idx >= 3 ? (
                            <div className="mt-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-[#92400E]">
                                <Lock size={13} className="shrink-0 text-[#D97706]" />
                                <span>AmLaw 100 Court-Grade Redline & UCC analysis gated in preview.</span>
                              </div>
                              <button
                                onClick={() => openUpgrade('locked_finding')}
                                className="px-3 py-1 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <span>Unlock Full Remediation</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-[#0E6B52] flex items-center gap-1">
                                  <CheckCircle2 size={13} className="text-[#0E6B52]" />
                                  AmLaw 100 Court-Grade Replacement Language
                                </span>
                                <button
                                  onClick={() => handleCopyDemoRedline(finding.id || idx, finding.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#123B5C] hover:bg-[#0C2A42] text-white transition-all flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                                >
                                  {copiedDemoId === (finding.id || idx) ? (
                                    <>
                                      <Check size={12} className="text-[#86EFAC]" />
                                      <span>Copied! ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy Redline</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="p-3 bg-white rounded-lg text-[13px] font-serif text-[#0F1B2A] leading-relaxed border border-[#86EFAC] select-all shadow-xs">
                                {finding.courtGradeRedline}
                              </div>
                            </div>
                          )
                        ) : finding.remedy ? (
                          !hasActiveLicense && idx >= 3 ? (
                            <div className="mt-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-[#92400E]">
                                <Lock size={13} className="shrink-0 text-[#D97706]" />
                                <span>Actionable statutory remediation clause & UCC priority analysis gated in preview.</span>
                              </div>
                              <button
                                onClick={() => openUpgrade('locked_finding')}
                                className="px-3 py-1 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <span>Unlock Full Remediation</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-[11px] font-mono text-[#0E6B52] flex items-center justify-between gap-2 font-semibold">
                              <span>Remediation: {finding.remedy}</span>
                              <CheckCircle2 size={14} className="text-[#0E6B52] shrink-0" />
                            </div>
                          )
                        ) : null}
                      </div>
                    );
                  })}

                </div>

                {/* Export Client Memo Gate Bar */}
                <div className="px-4 py-3 bg-[#F7F9FA] border-t border-[#D9E1E7] flex flex-wrap items-center justify-between gap-3 font-ui">
                  <div className="flex items-center gap-2 text-xs text-[#5A6B7A]">
                    <FileCheck size={15} className="text-[#0E6B52]" />
                    <span className="font-semibold text-[#0F1B2A]">Client Memo Generation & White-Label Exports</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#123B5C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download size={13} className="text-[#123B5C]" />
                      <span>Export Executive Client Memo (PDF)</span>
                    </button>
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-semibold text-[#123B5C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileSpreadsheet size={13} className="text-[#0E6B52]" />
                      <span>Export Obligations Matrix (CSV)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* LEGAL PROTECTION SHIELD & MALPRACTICE NOTICE                             */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-xl bg-[#FFFFFF] border-l-4 border-l-[#0E6B52] border-y border-r border-[#D9E1E7] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2 font-ui">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0E6B52]/10 border border-[#0E6B52]/20 flex items-center justify-center text-[#0E6B52] shrink-0 mt-0.5 shadow-xs">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-[#0F1B2A] uppercase tracking-wider font-ui">
                        Legal Protection Shield · Malpractice & Quality Control Notice
                      </h4>
                      <span className="text-[9px] font-mono bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30 px-2 py-0.5 rounded font-bold">
                        VERIFICATION MANDATE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5A6B7A] leading-relaxed max-w-3xl">
                      <strong className="text-[#0F1B2A]">Mandatory Counsel Verification Notice:</strong> Automated audit flags, redlines, and suggested remediation clauses are AI-assisted decision heuristics designed for preliminary analytical support. Under ABA Model Rule 1.1 (Competence) and standard professional conduct codes, the reviewing attorney must independently review and verify all contract provisions, statutory citations, and defined terms prior to client execution or court filing.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 self-end md:self-center">
                  <span className="text-[10px] font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#86EFAC] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold">
                    <Lock size={11} />
                    <span>Zero Cloud Liability</span>
                  </span>
                </div>
              </div>

            </motion.div>
          )}

          {/* VIEW 2: SMART PII REDACTOR (INTERACTIVE DEMO SANDBOX) */}
          {activeTool === 'redact' && (
            <motion.div key="redact" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4 font-ui">
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9E1E7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] shadow-xs">
                      <EyeOff size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#0F1B2A]">Smart PII & Bank Identity Redactor (Interactive Sandbox)</h2>
                      <p className="text-xs text-[#5A6B7A]">Automated discovery and deterministic scrubbing of privileged data in client-side RAM (ABA Rule 1.6).</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-[#123B5C]/10 text-[#123B5C] border border-[#123B5C]/20 px-2.5 py-1 rounded-full font-bold">
                      IN-RAM SANDBOX
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                  {/* Left: Input Textarea */}
                  <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-ui uppercase text-[#5A6B7A] font-bold">Unredacted Source Draft</h3>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-ui text-[#123B5C] hover:text-[#0C2A42] cursor-pointer flex items-center gap-1 bg-[#FFFFFF] hover:bg-[#F7F9FA] px-2 py-0.5 rounded border border-[#D9E1E7] font-bold transition-colors shadow-xs">
                            <Upload size={10} />
                            <span>Upload File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.docx,.txt,.md" 
                              onChange={(e) => handleFileUpload(e, setRedactInputText, 'target')} 
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] font-mono text-[#5A6B7A]">
                            {redactInputText.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </div>
                      <textarea
                        value={redactInputText}
                        onChange={(e) => setRedactInputText(e.target.value)}
                        className="w-full bg-[#FFFFFF] p-3.5 rounded-xl border border-[#D9E1E7] text-xs font-serif leading-relaxed text-[#0F1B2A] outline-none resize-none min-h-[220px] focus:border-[#123B5C]"
                        placeholder="Paste draft with SSNs, emails, wire routing, bank accounts..."
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#D9E1E7]">
                      <button
                        onClick={() => setRedactInputText('Wire settlement of $1,450,000 to escrow account of Johnathan Vance at J.P. Morgan Chase (Account No: 4421-8890-1234, Routing No: 021000021). Tax ID (EIN): 12-3456789. Client Social Security: 000-45-6789. Confidential primary contact: jvance@vancelawfirm.com, mobile: +1 (212) 555-0198. Do not disclose merger terms.')}
                        className="text-[11px] font-ui font-semibold text-[#5A6B7A] hover:text-[#123B5C] transition-colors cursor-pointer"
                      >
                        Reset Sample
                      </button>

                      <button
                        onClick={handleRunRedaction}
                        disabled={isRedacting || !redactInputText.trim()}
                        className="px-5 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-40"
                      >
                        {isRedacting ? (
                          <RefreshCw size={13} className="animate-spin text-[#60A5FA]" />
                        ) : (
                          <Zap size={13} className="text-[#60A5FA]" />
                        )}
                        <span>Scrub Privileged Data In-RAM</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Sanitized Output */}
                  <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-ui uppercase text-[#0E6B52] font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          <span>Sanitized Judicial Output</span>
                        </h3>
                        {redactResult && (
                          <span className="text-[10px] font-mono bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30 px-2 py-0.5 rounded font-bold">
                            {redactResult.totalRedactions} Entities Masked
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-[#FFFFFF] p-3.5 rounded-xl border border-[#86EFAC] text-xs font-serif leading-relaxed text-[#0E6B52] min-h-[220px] whitespace-pre-wrap select-all shadow-xs">
                        {redactResult ? redactResult.sanitizedText : (
                          <div className="h-full flex flex-col items-center justify-center text-center text-[#5A6B7A] py-12 font-ui">
                            <EyeOff size={24} className="mb-2 text-[#5A6B7A]" />
                            <span>Click "Scrub Privileged Data In-RAM" to execute client-side masking.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {redactResult && (
                      <div className="mt-4 pt-3 border-t border-[#86EFAC]/40 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                          {redactResult.detectedEntities.map((ent) => (
                            <span key={ent.id} className="bg-[#FFFFFF] border border-[#86EFAC] text-[#0E6B52] px-2 py-0.5 rounded font-bold">
                              {ent.label}: {ent.count}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(redactResult.sanitizedText);
                            setAuditToast({ ms: 8, remaining: 'Copied' });
                            setTimeout(() => setAuditToast(null), 3000);
                          }}
                          className="text-[11px] font-ui font-bold text-[#0E6B52] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} />
                          <span>Copy Sanitized Text</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex flex-wrap items-center justify-between gap-4 font-ui">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-1.5">
                      <span>Air-Gapped Discovery & Deposition Scrubbing</span>
                      <span className="text-[9px] font-mono bg-[#123B5C]/10 text-[#123B5C] px-1.5 py-0.2 rounded font-bold uppercase">Enterprise</span>
                    </h4>
                    <p className="text-xs text-[#5A6B7A]">
                      Sandbox limited to 500-word excerpt. Bulk scrub 500+ page discovery bundles and deposition PDFs locally without cloud transmission.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('redact'); }}
                    className="px-5 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Unlock Law Firm Suite ($299)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: COURT BATES STAMPER (INTERACTIVE SIMULATOR) */}
          {activeTool === 'bates' && (
            <motion.div key="bates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4 font-ui">
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9E1E7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] shadow-xs">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#0F1B2A]">Court Bates Stamping & Evidence Numbering Suite</h2>
                      <p className="text-xs text-[#5A6B7A]">Automated sequential pagination for litigation discovery (PLTF, DEF, CONF) rendered directly into PDFs.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-[#123B5C]/10 text-[#123B5C] border border-[#123B5C]/20 px-2.5 py-1 rounded-full font-bold">
                    LIVE SIMULATOR
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                  {/* Controls Column */}
                  <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] space-y-4">
                    <h3 className="text-xs font-ui uppercase text-[#5A6B7A] font-bold">Stamping Parameters</h3>
                    
                    <div>
                      <label className="text-[11px] font-semibold text-[#5A6B7A] block mb-1">Prefix Designation:</label>
                      <input
                        type="text"
                        value={batesPrefix}
                        onChange={(e) => setBatesPrefix(e.target.value)}
                        placeholder="e.g. PLTF-, DEF-, CONF-"
                        className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-lg px-3 py-1.5 text-xs font-mono text-[#0F1B2A] focus:border-[#123B5C] outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#5A6B7A] block mb-1">Starting Sequence Number:</label>
                      <input
                        type="text"
                        value={batesStartNum}
                        onChange={(e) => setBatesStartNum(e.target.value)}
                        placeholder="000001"
                        className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-lg px-3 py-1.5 text-xs font-mono text-[#0F1B2A] focus:border-[#123B5C] outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#5A6B7A] block mb-1">Stamp Placement:</label>
                      <select
                        value={batesPosition}
                        onChange={(e) => setBatesPosition(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-lg px-3 py-1.5 text-xs text-[#0F1B2A] focus:border-[#123B5C] outline-none cursor-pointer shadow-xs"
                      >
                        <option value="bottom-right">Bottom Right (Judicial Standard)</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="top-right">Top Right (Docket Style)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#5A6B7A] block mb-1">Upload Evidentiary PDF (Optional):</label>
                      <label className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C] text-xs text-[#0F1B2A] cursor-pointer transition-colors shadow-xs">
                        <div className="flex items-center gap-1.5 truncate">
                          <Upload size={12} className="text-[#123B5C] shrink-0" />
                          <span className="truncate">{batesFile ? batesFile.name : 'Stamp Your Own PDF Document'}</span>
                        </div>
                        <span className="text-[10px] font-ui text-[#123B5C] font-bold shrink-0">Browse PDF</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setBatesFile(e.target.files[0]);
                          }}
                          className="hidden"
                        />
                      </label>
                      {batesFile && (
                        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#5A6B7A]">
                          <span className="truncate">Loaded: {batesFile.name}</span>
                          <button onClick={() => setBatesFile(null)} className="text-[#B3261E] hover:underline cursor-pointer">Clear</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#5A6B7A] block mb-1">Font Color:</label>
                      <div className="flex gap-2">
                        {['black', 'navy', 'red'].map((col) => (
                          <button
                            key={col}
                            onClick={() => setBatesColor(col)}
                            className={`px-3 py-1 rounded text-xs capitalize font-ui border cursor-pointer transition-colors ${
                              batesColor === col 
                                ? 'bg-[#123B5C] text-white border-[#123B5C] font-bold shadow-xs' 
                                : 'bg-[#FFFFFF] text-[#5A6B7A] border-[#D9E1E7] hover:bg-[#F7F9FA]'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D9E1E7]">
                      <button
                        onClick={handleDownloadSampleBates}
                        disabled={isGeneratingBates}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isGeneratingBates ? (
                          <RefreshCw size={13} className="animate-spin text-[#60A5FA]" />
                        ) : (
                          <Download size={13} />
                        )}
                        <span>Download 1-Page Stamped Sample</span>
                      </button>
                    </div>
                  </div>

                  {/* Right 2 Columns: Simulated Legal Document Canvas */}
                  <div className="lg:col-span-2 p-6 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-xs">
                    {/* Simulated Legal Document Header */}
                    <div className="space-y-1.5 text-center border-b border-[#D9E1E7] pb-4">
                      <p className="text-[11px] font-serif tracking-widest text-[#0C2A42] font-bold uppercase">
                        IN THE UNITED STATES DISTRICT COURT
                      </p>
                      <p className="text-[10px] font-serif text-[#5A6B7A]">SOUTHERN DISTRICT OF NEW YORK</p>
                      <p className="text-[10px] font-mono text-[#5A6B7A]">CIVIL DOCKET NO. 26-CV-04891 (RA)</p>
                    </div>

                    {/* Simulated Body Content */}
                    <div className="space-y-2 py-6 text-[#0F1B2A] font-serif text-xs leading-relaxed max-w-lg mx-auto">
                      <p className="font-bold text-center text-[#0F1B2A]">EXHIBIT A: MASTER ACQUISITION AGREEMENT</p>
                      <p className="indent-6 text-justify text-[12px] text-[#0F1B2A] leading-relaxed">
                        Plaintiff hereby submits Exhibit A in support of the preliminary injunction motion. Pursuant to Local Civil Rule 5.1, all confidential trade secrets and proprietary code matrices have been preserved in compliance with the protective order.
                      </p>
                    </div>

                    {/* Live Dynamic Bates Stamp Badge Pill */}
                    <div className={`flex ${
                      batesPosition === 'bottom-right' ? 'justify-end' :
                      batesPosition === 'bottom-center' ? 'justify-center' : 'justify-end'
                    }`}>
                      <div className="bg-[#0C2A42] text-white font-mono font-bold text-xs px-3 py-1 rounded shadow-md border border-[#123B5C] tracking-wider">
                        {batesPrefix || 'EX-'}{batesStartNum || '000001'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex flex-wrap items-center justify-between gap-4 font-ui">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-1.5">
                      <span>Sequential Bates Numbering Across Thousands of Pages</span>
                      <span className="text-[9px] font-mono bg-[#123B5C]/10 text-[#123B5C] px-1.5 py-0.2 rounded font-bold uppercase">Firm Exclusive</span>
                    </h4>
                    <p className="text-xs text-[#5A6B7A]">
                      Single-page simulator active. Multi-file binder batch stamping, high-contrast backing pills, and custom protective order sequences included in Law Firm Suite.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('bates'); }}
                    className="px-5 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Unlock Law Firm Suite ($299)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 4: LOCAL AUDIT VAULT & PWA (INTERACTIVE TELEMETRY) */}
          {activeTool === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4 font-ui">
              <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D9E1E7]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#123B5C]/10 border border-[#123B5C]/20 flex items-center justify-center text-[#123B5C] shadow-xs">
                      <Database size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#0F1B2A]">Local Audit Vault & Telemetry Inspector</h2>
                      <p className="text-xs text-[#5A6B7A]">All audit histories and redline diffs are retained strictly in client browser memory with zero cloud transmission.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30 px-2.5 py-1 rounded-full font-bold">
                    AIR-GAP TELEMETRY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7]">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">RAM Allocated</span>
                    <div className="text-xl font-bold font-mono text-[#0E6B52] mt-1">~4.8 MB</div>
                    <p className="text-[11px] text-[#5A6B7A] mt-1">In-Memory Heap Space</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7]">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">Cloud Data Transmitted</span>
                    <div className="text-xl font-bold font-mono text-[#123B5C] mt-1">0.00 KB</div>
                    <p className="text-[11px] text-[#5A6B7A] mt-1">Zero External Telemetry</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7]">
                    <span className="text-[10px] font-mono uppercase text-[#5A6B7A] font-bold">ABA Rule 1.6 Status</span>
                    <div className="text-xl font-bold font-mono text-[#0E6B52] mt-1">100% Compliant</div>
                    <p className="text-[11px] text-[#5A6B7A] mt-1">Strict Confidentiality Guard</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1B2A]">Cryptographic In-Memory Session Purge</h4>
                    <p className="text-xs text-[#5A6B7A] mt-0.5">Wipe all extracted text, active buffers, and temporary cache upon closing matter review.</p>
                  </div>
                  <button
                    onClick={handlePurgeVault}
                    className="px-4 py-2 rounded-xl bg-[#FDF2F2] hover:bg-[#FEE2E2] text-[#B3261E] border border-[#FCA5A5] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw size={12} />
                    <span>{vaultPurged ? '✓ Memory Purged' : 'Purge Active RAM Session'}</span>
                  </button>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex flex-wrap items-center justify-between gap-4 font-ui">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[#0F1B2A]">Multi-Workstation Offline PWA Deployments</h4>
                    <p className="text-xs text-[#5A6B7A]">Install ContractGuard as a standalone desktop app on macOS, Windows, and Linux across your entire firm.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('solo'); openUpgrade('general'); }}
                    className="px-5 py-2.5 rounded-xl bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Get Lifetime Offline License ($199 / $299)</span>
                    <ArrowRight size={13} />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D9E1E7] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative font-ui text-[#0F1B2A]"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-[#0C2A42] border-b border-[#123B5C] flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#123B5C] border border-[#1E5682] flex items-center justify-center text-white shadow-xs">
                    <ShieldCheck size={20} className="text-[#86EFAC]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Unlock Full ContractGuard Studio</h3>
                    <p className="text-xs text-white/70 font-mono">
                      Air-Gapped Perpetual License · 0 Cloud Latency · Zero Subscriptions
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-5">
                {modalReason === 'export' && (
                  <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#86EFAC] text-xs text-[#0E6B52] flex items-center gap-2 font-semibold">
                    <Download size={14} className="shrink-0" />
                    <span>White-label PDF Client Memos and CSV exports are unlocked with an active license.</span>
                  </div>
                )}

                {modalReason === 'locked_finding' && (
                  <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-center gap-2 font-semibold">
                    <Lock size={14} className="shrink-0 text-[#D97706]" />
                    <span>Deep clause remediations and all 6 contract liabilities are unlocked in the full studio.</span>
                  </div>
                )}

                {/* Plan Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Option 1: Solo Practitioner ($199) */}
                  <div
                    onClick={() => setSelectedPlan('solo')}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPlan === 'solo'
                        ? 'bg-[#FFFFFF] border-[#123B5C] shadow-md ring-2 ring-[#123B5C]/15'
                        : 'bg-[#F7F9FA] border-[#D9E1E7] hover:border-[#123B5C]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#5A6B7A] uppercase">Individual Counsel</span>
                        {selectedPlan === 'solo' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#123B5C]" />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[#0F1B2A]">Solo Practitioner</h4>
                      <p className="text-xs text-[#5A6B7A] mt-1">For independent transactional lawyers and corporate counsel.</p>
                      
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#0F1B2A] font-mono">$199</span>
                        <span className="text-xs text-[#5A6B7A] font-mono">one-time</span>
                      </div>
                      <span className="text-[10px] text-[#0E6B52] font-mono font-bold block mt-0.5">Lifetime License · 1 Seat</span>

                      <ul className="mt-4 space-y-2 text-xs text-[#0F1B2A]">
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>100% Air-Gapped In-RAM Engine</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>Unlimited Audits & Redline Diffs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>In-RAM OCR for Scans & Images</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>Offline PWA Desktop App</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handlePurchase('solo'); }}
                      className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                        selectedPlan === 'solo'
                          ? 'bg-[#123B5C] hover:bg-[#0C2A42] text-white'
                          : 'bg-[#FFFFFF] hover:bg-[#F7F9FA] text-[#123B5C] border border-[#D9E1E7]'
                      }`}
                    >
                      Purchase Solo License ($199)
                    </button>
                  </div>

                  {/* Option 2: Law Firm Suite ($299) */}
                  <div
                    onClick={() => setSelectedPlan('firm')}
                    className={`p-5 rounded-xl border-2 relative transition-all cursor-pointer flex flex-col justify-between ${
                      selectedPlan === 'firm'
                        ? 'bg-[#FFFFFF] border-[#0E6B52] shadow-md ring-2 ring-[#0E6B52]/15'
                        : 'bg-[#F7F9FA] border-[#D9E1E7] hover:border-[#0E6B52]/40'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-4 bg-[#0E6B52] text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                      Best Value for Practices
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#0E6B52] uppercase">Law Firm Practice</span>
                        {selectedPlan === 'firm' && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0E6B52]" />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[#0F1B2A]">Law Firm Suite</h4>
                      <p className="text-xs text-[#5A6B7A] mt-1">Multi-user deployment for partners, associates, and paralegals.</p>
                      
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#0F1B2A] font-mono">$299</span>
                        <span className="text-xs text-[#5A6B7A] font-mono">one-time</span>
                      </div>
                      <span className="text-[10px] text-[#0E6B52] font-mono font-bold block mt-0.5">Up to 5 Users Lifetime License</span>

                      <ul className="mt-4 space-y-2 text-xs text-[#0F1B2A]">
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>Includes All Solo Practitioner Features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#123B5C] shrink-0" />
                          <strong className="text-[#0F1B2A]">Up to 5 Attorney & Team Seats</strong>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#D97706] shrink-0" />
                          <span>Court Bates Stamping Suite (PLTF/DEF)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#123B5C] shrink-0" />
                          <span>Smart Discovery PII Redactor</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={14} className="text-[#0E6B52] shrink-0" />
                          <span>White-Label Executive Client Memos</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handlePurchase('firm'); }}
                      className="mt-6 w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer shadow-xs bg-[#123B5C] hover:bg-[#0C2A42] text-white"
                    >
                      Purchase Law Firm Suite ($299)
                    </button>
                  </div>

                </div>

                {/* Risk Reversal Guarantee Card */}
                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0E6B52]/10 border border-[#0E6B52]/20 flex items-center justify-center text-[#0E6B52] shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-[#0F1B2A] text-[12px] flex items-center gap-2">
                        <span>The Zero-Risk Forensic Guarantee</span>
                        <span className="text-[10px] text-[#0E6B52] font-mono bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#BBF7D0]">14-DAY TRIAL</span>
                      </div>
                      <div className="text-[11px] text-[#5A6B7A]">
                        Audit your actual contracts risk-free. 100% money-back refund if you are not completely satisfied.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#5A6B7A] font-mono shrink-0">
                    <span className="flex items-center gap-1 text-[#0E6B52] font-bold">
                      <ShieldCheck size={13} />
                      <span>ABA Rule 1.6 Safe</span>
                    </span>
                  </div>
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
              className="relative w-full max-w-4xl rounded-2xl md:rounded-3xl border border-[#123B5C] bg-[#0C2A42] overflow-hidden shadow-2xl z-10 font-ui"
            >
              {/* Modal Top Chrome */}
              <div className="px-5 py-3 bg-[#0C2A42] border-b border-[#123B5C] flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="ml-2 font-mono text-[11px] text-white/90">
                    ContractGuard™ Launch Film • 48s Keynote Reveal
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block font-mono text-[10px] text-[#86EFAC] bg-white/10 border border-white/20 px-2 py-0.5 rounded font-bold">
                    4K 60FPS • AIR-GAPPED STUDIO
                  </span>
                  <button
                    onClick={() => setIsFilmModalOpen(false)}
                    className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              <div className="px-6 py-4 bg-[#0C2A42] border-t border-[#123B5C] flex flex-wrap items-center justify-between gap-3 font-ui text-white">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <Sparkles size={14} className="text-[#86EFAC]" />
                  <span>Catch catastrophic pre-signing liabilities in &lt;100ms with zero cloud risk.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsFilmModalOpen(false); openUpgrade('general'); }}
                    className="px-4 py-2 rounded-xl bg-[#123B5C] hover:bg-[#1E5682] text-white font-extrabold text-xs transition-all border border-white/20 shadow-xs flex items-center gap-1.5 cursor-pointer"
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
