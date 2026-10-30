import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, ShieldCheck, Search, EyeOff, Layers, Database, BookOpen,
  FileText, Upload, RefreshCw, Zap, Lock, ArrowRight, CheckCircle2,
  AlertTriangle, AlertCircle, X, Download, HardDriveDownload,
  Users, User, Briefcase, FileCheck, Check, Sparkles, ExternalLink,
  ChevronRight, Clock, FileCode, FileSpreadsheet, Eye, Play,
  Copy, Key, FileDown, Scale
} from 'lucide-react';
import { extractTextFromDOCX } from '../utils/docxExtractor';
import { isImageFile, recognizeImage } from '../utils/ocrEngine';
import LegalTemplatesView from '../components/LegalTemplatesView';
import LiabilityReconcilerHUD from '../components/LiabilityReconcilerHUD';
import { analyzeLiabilityInterlocks, SAMPLE_DEALS } from '../utils/liabilityMatrixEngine';

import { useContractWorker } from '../utils/useContractWorker';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { openSeamlessCheckout } from '../utils/checkoutPopup';
import { sanitizeDocumentPII } from '../utils/piiEngine';
import { executeBatesStamping } from '../utils/batesStamper';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { 
  getDemoAuditsRemaining, 
  consumeDemoAudit, 
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

8. INDEMNIFICATION
8.1 Seller shall defend, indemnify, and hold harmless Buyer and its affiliates from and against any and all claims, liabilities, losses, and damages up to Five Million Dollars ($5,000,000) arising out of third-party IP infringement, confidentiality breaches, or gross negligence.

9. TERMINATION FOR CAUSE
9.2 Either party may terminate this Agreement immediately upon written notice in accordance with the procedures set forth in Section 14.2 of this Agreement.
9.3 Notice period shall be sixty (60) days, except as provided in Section 9.1 which specifies ten (10) days.

11. SURVIVAL
11.4 The indemnification covenants and confidentiality obligations in Section 19.1 shall survive termination of this Agreement for five (5) years.

12. LIMITATION OF LIABILITY
12.1 IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY UNDER OR RELATING TO THIS AGREEMENT EXCEED THE TOTAL FEES PAID HEREUNDER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM ($50,000), REGARDLESS OF THE LEGAL THEORY AND NOTWITHSTANDING ANY PROVISION TO THE CONTRARY.`;

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

  // Quick Sample Loader
  const handleLoadSample = () => {
    setContractText(HAZARDOUS_SAMPLE_CONTRACT);
    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
    setDocumentTitle('Master Asset Purchase Agreement');
    setClientParty('Acme Holdings LLC');
    setCounterparty('Globex International Corp');
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

  // Automatically load benchmark draft and execute audit on initial mount so results are instant
  useEffect(() => {
    if (!contractText && !auditResults && !isProcessing) {
      setContractText(HAZARDOUS_SAMPLE_CONTRACT);
      setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
      setDocumentTitle('Master Asset Purchase Agreement');
      setClientParty('Acme Holdings LLC');
      setCounterparty('Globex International Corp');
      handleRunAudit({
        text: HAZARDOUS_SAMPLE_CONTRACT,
        baselineText: HAZARDOUS_BASELINE_CONTRACT,
        title: 'Master Asset Purchase Agreement',
        clientParty: 'Acme Holdings LLC',
        counterparty: 'Globex International Corp',
        mode: 'single',
        isInitial: true
      });
    }
  }, []);



  // Unified File Processor (DOCX, PDF with In-RAM OCR, images, TXT)
  const processDocumentFile = async (file, setTargetText, statusKey) => {
    if (!file) return;

    // Defense-in-depth: Enforce 50MB institutional RAM file size ceiling to prevent memory exhaustion
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert(`File "${file.name}" exceeds the maximum institutional in-RAM limit of 50MB. Please select a standard contract draft.`);
      setUploadStatus(prev => ({ ...prev, [statusKey]: 'File size exceeded (max 50MB).' }));
      return;
    }

    setUploadStatus(prev => ({ ...prev, [statusKey]: `Reading ${file.name}...` }));

    try {
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await extractTextFromDOCX(arrayBuffer);
        setTargetText(result.value);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded Word DOCX (${result.value.split(/\s+/).length} words)` }));
      } else if (lowerName.endsWith('.pdf')) {
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
        }),
        enrichFindingWithStatutoryRemedy({
          id: 'def_5',
          category: 'LIABILITY CAP CONTRADICTION',
          severity: 'critical',
          clause: 'Clause 8.1 vs. Clause 12.1',
          title: 'Catastrophic $5,000,000 Indemnity vs. $50,000 Cap Contradiction',
          snippet: 'Section 12.1 blanket liability cap ($50,000) directly nullifies Section 8.1 indemnification covenant ($5,000,000) under Delaware & NY precedent.',
          line: 52,
          statutoryCitation: 'Del. Ch. & UCC § 2-719 / Express Carve-Out Doctrine',
          malpracticeRisk: 'Under established Delaware and New York precedent, courts apply the lower liability cap across all claims unless an express carve-out exists, leaving your client exposed to $4,950,000 in unrecoverable losses.',
          courtGradeRedline: 'Section 12.2 (Express Carve-Out Rider): Notwithstanding Section 12.1 or any other limitation herein, claims arising under Section 8.1 (Indemnification) shall be expressly excluded from the aggregate liability ceiling.',
          remedy: 'Attach Delaware-compliant Express Carve-Out Rider prior to execution.'
        })
      ];
    }

    return [];
  }, [enrichedAudit, auditResults, contractText]);

  const riskScore = auditResults?.overallRiskScore?.score ?? null;
  const riskLevel = auditResults?.overallRiskScore?.level || null;
  const processingMs = auditResults?.processingDurationMs ?? null;

  return (
    <div className="min-h-screen bg-[#030712] text-white font-ui flex flex-col md:flex-row relative overflow-hidden">
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
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity select-none group"
              title="Return to Main Overview"
            >
              <div className="w-9 h-9 rounded-lg bg-[#0A1A14] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:border-emerald-400/60 transition-colors">
                <ShieldAlert className="text-emerald-400" size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  ContractGuard
                  <span className="font-mono text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Demo
                  </span>
                </h1>
                <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase group-hover:text-emerald-400/80 transition-colors">Air-Gapped Legal Studio</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">v2.4 Pro</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-[10px] text-emerald-400/90 font-mono">
            <ShieldCheck size={12} className="shrink-0 text-emerald-400" />
            <span>Air-Gapped · RAM-Only · 0 Cloud</span>
          </div>
        </div>

        {/* Navigation Modules — Emil Kowalski Organized Hierarchy */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar font-ui">
          
          {/* Section 1: Forensic Auditing */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase px-2 mb-1.5">
              Forensic Auditing
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('analyzer')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'analyzer'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'analyzer' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <Search size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Integrity & Diff Audit</p>
                    {activeTool === 'analyzer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Pre-signing review & redline</p>
                </div>
              </button>

              {activeTool === 'analyzer' && (
                <div className="mx-1 mt-1 mb-1 px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-400 font-bold mb-1.5">Interactive Evaluation Guide</p>
                  <div className="space-y-1.5 text-[10.5px] leading-relaxed text-zinc-400">
                    <p><span className="text-emerald-400 font-semibold">1. Unrestricted Sandbox:</span> Paste any client draft or import your transactional agreement.</p>
                    <p><span className="text-cyan-400 font-semibold">2. In-RAM Speed:</span> Executes 5 detection engines locally in &lt;100ms without cloud transmission.</p>
                    <p><span className="text-amber-400 font-semibold">3. Free Evaluation:</span> 3 full unblurred audits included. Test your matters before unlocking perpetual access.</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveTool('reconciler')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'reconciler'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'reconciler' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <Scale size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Liability Reconciler</p>
                    <span className="text-[8.5px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">New · $5M Cap</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Delaware & NY cross-clause rider</p>
                </div>
                {activeTool === 'reconciler' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Section 2: Privacy & Remediation */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase px-2 mb-1.5">
              Client Privacy
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('redact')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'redact'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'redact' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <EyeOff size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
                    <span className="text-[8.5px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">Preview</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Identity & financial scrub</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Court Evidence Controls */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase px-2 mb-1.5">
              Court Controls
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('bates')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'bates'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'bates' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <Layers size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
                    <span className="text-[8.5px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">Firm Only</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Court evidence numbering</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTool('templates')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'templates'
                    ? 'bg-white/[0.08] text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'templates' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <BookOpen size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">AmLaw 100 Vault</p>
                    <span className="text-[8.5px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1 py-0.2 rounded font-bold">12 Models</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">US commercial contract library</p>
                </div>
                {activeTool === 'templates' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
              </button>

              <button
                onClick={() => setActiveTool('history')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left ${
                  activeTool === 'history'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeTool === 'history' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800/60 text-zinc-400'}`}>
                  <Database size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
                    <span className="text-[8.5px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold">PWA Only</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">Encrypted local persistence</p>
                </div>
              </button>
            </div>
          </div>
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
          <span className="font-mono text-[10px] text-zinc-400">Evaluation Mode</span>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN COCKPIT WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto z-10 custom-scrollbar flex flex-col">
        
        {/* Top Floating Evaluation Banner */}
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-[#08121A] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.08)]">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${auditsLeft > 0 || hasActiveLicense ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-zinc-200">
                {hasActiveLicense ? (
                  <span className="text-emerald-400 font-mono font-bold">🟢 Licensed Studio Active · Unlimited In-RAM Forensic Audits</span>
                ) : (
                  <span>
                    Evaluation Sandbox: <strong className="text-emerald-400 font-mono">{auditsLeft} of 3 Free Full Audits Remaining</strong>
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                100% Unblurred Forensic Findings
              </span>
            </div>
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

        {/* Ephemeral Sandbox / Incognito Mode Warning Banner */}
        {isIncognito && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1.5 text-amber-400">
                🔒 Ephemeral Sandbox (Private Browsing Detected):
              </span>
              <span>1 trial audit allocated. RAM state is volatile and clears upon window closure. Remediation for finding #4+ and official exports remain gated.</span>
            </div>
            <button
              onClick={() => openUpgrade('general')}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold cursor-pointer shrink-0 transition-colors"
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
              className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-[#08121A] border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-zinc-200">
                  <strong>Forensic Audit Complete in {auditToast.ms}ms:</strong> All latent liabilities flagged in isolated client-side RAM with zero cloud leakage.
                </span>
                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  {typeof auditToast.remaining === 'number' ? `${auditToast.remaining} of 3 Free Passes Left` : 'Perpetual Licensed'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openUpgrade('general')}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] transition-all cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <span>Unlock Unlimited Lifetime Access</span>
                  <ArrowRight size={11} />
                </button>
                <button 
                  onClick={() => setAuditToast(null)}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer"
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
            <motion.div key="analyzer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              
              {/* Studio Dual-Pane Workstation Banner */}
              <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-xs text-zinc-200 font-medium font-mono">
                    <strong className="text-emerald-400">AmLaw 100 Dual-Pane Split Workstation:</strong> Live interactive line gutter, visual redline diffs, and Word (.docx) export.
                  </span>
                </div>
                <button
                  onClick={() => navigate('/app/contractcompare')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <span>Open Split Workstation ◫</span>
                  <ArrowRight size={13} />
                </button>
              </div>

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

                {/* Single Draft vs Comparative Diff Mode Toggle (Apple macOS Segmented Pill) */}
                <div className="flex items-center apple-segmented-pill bg-black/60">
                  <button
                    onClick={() => { setAnalysisMode('single'); }}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                      analysisMode === 'single'
                        ? 'apple-segmented-pill-active'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Single Draft Integrity
                  </button>
                  <button
                    onClick={() => { setAnalysisMode('comparative'); }}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                      analysisMode === 'comparative'
                        ? 'bg-cyan-500/15 border border-cyan-400/35 border-t-white/30 text-cyan-300 shadow-[0_2px_10px_rgba(0,240,255,0.15)]'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Comparative Redline Diff
                  </button>
                  <button
                    onClick={() => { navigate('/app/contractcompare'); }}
                    className="px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 text-zinc-400 hover:text-emerald-300"
                    title="Open Full Linguistic & Deed Proofreader Studio"
                  >
                    <Sparkles size={12} className="text-emerald-400" />
                    <span>Linguistic & Deed Proofreader</span>
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
                        <label className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20 font-bold transition-colors">
                          <Upload size={11} />
                          <span>Browse Baseline File</span>
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

                    {!baselineText.trim() ? (
                      <div className="p-8 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl m-4 bg-cyan-950/[0.04] flex flex-col items-center justify-center text-center transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                          <Upload size={22} />
                        </div>
                        <h4 className="text-xs font-bold text-white tracking-tight">
                          Drop Baseline Agreement Here (.docx / .pdf)
                        </h4>
                        <p className="text-[11px] text-zinc-400 max-w-xs mt-1 mb-3">
                          Upload previous execution version or counterparty initial draft for redline diff comparison.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <label className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
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
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-zinc-700 text-zinc-300 text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download size={11} className="text-cyan-400" />
                            <span>Download Baseline .DOCX</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <textarea
                          value={baselineText}
                          onChange={(e) => setBaselineText(e.target.value)}
                          className="w-full bg-black/40 p-4 text-sm font-legal leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"
                          placeholder="Original baseline contract text..."
                        />
                        <button
                          onClick={() => setBaselineText('')}
                          className="absolute top-2 right-4 text-[10px] font-mono bg-zinc-900/90 hover:bg-rose-950/60 hover:text-rose-300 border border-zinc-700 px-2 py-0.5 rounded text-zinc-400 transition-colors"
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
                      <label className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold transition-colors">
                        <Upload size={11} />
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

                  {!contractText.trim() ? (
                    <div className="p-8 border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/60 rounded-xl m-4 bg-emerald-950/[0.04] flex flex-col items-center justify-center text-center transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <Upload size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        Drag & Drop Your Unexecuted Contract Here
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4 leading-relaxed">
                        Supports Word <strong className="text-emerald-300">.docx</strong>, <strong className="text-emerald-300">.pdf</strong> (native & scanned with In-RAM OCR), and text files. 100% processed locally in workstation RAM.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5">
                          <Upload size={13} className="fill-black" />
                          <span>Browse Contract File</span>
                          <input 
                            type="file" 
                            accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp" 
                            onChange={(e) => handleFileUpload(e, setContractText, 'target')} 
                            className="hidden" 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              if (text) setContractText(text);
                            } catch (_) {}
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 active:scale-[0.98] border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText size={12} className="text-emerald-400" />
                          <span>Paste from Clipboard</span>
                        </button>
                      </div>
                      <div className="mt-4 text-[10.5px] font-mono text-zinc-400">
                        Or paste raw contract clauses directly below:
                      </div>
                      <textarea
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                        className="w-full mt-2 bg-black/40 p-3 text-xs font-mono rounded-lg border border-zinc-800/80 outline-none resize-none min-h-[90px] focus:border-emerald-500/50"
                        placeholder="Paste contract clauses here..."
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <textarea
                        value={contractText}
                        onChange={(e) => setContractText(e.target.value)}
                        className="w-full bg-black/40 p-4 text-xs font-mono leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"
                        placeholder="Paste unexecuted contract draft here, type changes, or drop files..."
                      />
                      <button
                        onClick={() => setContractText('')}
                        className="absolute top-2 right-4 text-[10px] font-mono bg-zinc-900/90 hover:bg-rose-950/60 hover:text-rose-300 border border-zinc-700 px-2 py-0.5 rounded text-zinc-400 transition-colors"
                      >
                        Clear Buffer
                      </button>
                    </div>
                  )}
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
                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 border-t-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Execution Speed</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                      {processingMs !== null ? processingMs : '--'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">ms</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {processingMs !== null ? 'Single pass · 0 network latency' : 'Awaiting document buffer'}
                  </span>
                </div>

                <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${
                  riskScore !== null && riskScore > 50 
                    ? 'bg-rose-500/[0.05] border-rose-500/30 border-t-rose-400/30' 
                    : 'bg-[#050A0F] border-zinc-800 border-t-white/10'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Overall Risk Score</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black font-mono tabular-nums ${
                      riskScore !== null && riskScore > 50 ? 'text-rose-400' : 'text-zinc-300'
                    }`}>
                      {riskScore !== null ? riskScore : '--'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">/ 100</span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono uppercase ${
                    riskScore !== null && riskScore > 50 ? 'text-rose-400' : 'text-zinc-400'
                  }`}>
                    {auditResults ? `${(riskLevel || 'audited').toUpperCase()} · ${findingsList.length} Deficiencies Found` : 'Awaiting Audit Execution'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 border-t-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Cross-Clause References</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-cyan-400 font-mono tabular-nums">
                      {auditResults ? (auditResults?.crossRefs?.stats?.totalReferencesFound ?? 0) : '--'}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">targets</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {auditResults 
                      ? `${auditResults?.crossRefs?.issues?.length || 0} Broken Target${auditResults?.crossRefs?.issues?.length === 1 ? '' : 's'}` 
                      : 'Awaiting Audit'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#050A0F] border border-zinc-800 border-t-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Financial Consistency</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black font-mono tabular-nums ${
                      auditResults && auditResults.financialDates?.issues?.length ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {auditResults ? (auditResults.financialDates?.issues?.length ? 'MISMATCH' : 'SYNCHRONIZED') : '--'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    {auditResults 
                      ? `${auditResults.financialDates?.issues?.length || 0} Financial Discrepanc${auditResults.financialDates?.issues?.length === 1 ? 'y' : 'ies'}` 
                      : 'Awaiting Audit'}
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* FINDINGS LIST: 100% UNBLURRED (3 FREE EVALUATIONS) OR PAYWALL WHEN DEPLETED */}
              {/* ========================================================================= */}
              <div className="rounded-xl bg-[#050A0F] border border-zinc-800 overflow-hidden mt-2">
                <div className="px-4 py-3 bg-[#08121A] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Search size={15} className="text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-zinc-200">
                      LEGAL AUDIT FINDINGS & LIABILITIES ({findingsList.length} ISSUES)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasActiveLicense ? (
                      <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        Perpetual License Active
                      </span>
                    ) : auditsLeft > 0 ? (
                      <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{auditsLeft} of 3 Free Full Audits Left (Unblurred)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                        <Lock size={10} />
                        <span>Trial Limit Reached</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3 relative">
                  
                  {/* Frosted Glass Gate Overlay ONLY when user is out of audits and not licensed */}
                  {(!hasActiveLicense && auditsLeft <= 0) && (
                    <div className="absolute inset-0 bg-[#030712]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 rounded-xl">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Lock size={26} />
                      </div>
                      
                      <h4 className="text-lg font-extrabold text-white tracking-tight">
                        3 of 3 Free Forensic Audits Completed
                      </h4>
                      
                      <p className="text-xs text-zinc-300 max-w-lg mt-2 leading-relaxed">
                        You have tested ContractGuard's in-RAM forensic detection on real legal drafts. 
                        To audit unlimited contracts, export court-ready white-label memos (PDF/CSV), and protect client files offline with zero cloud risk, activate your perpetual license.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                        <button
                          onClick={() => { setSelectedPlan('solo'); openUpgrade('locked_finding'); }}
                          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Unlock Solo License ($199)</span>
                        </button>

                        <button
                          onClick={() => { setSelectedPlan('firm'); openUpgrade('locked_finding'); }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-2"
                        >
                          <Sparkles size={14} />
                          <span>Unlock Law Firm Suite — $299 (5 Seats)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Empty State Prompt: When user hasn't audited any text yet */}
                  {!auditResults && !isProcessing && (
                    <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <Zap size={26} />
                      </div>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        Forensic Audit Engine Standing By (In-Memory RAM)
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-md mt-1.5 leading-relaxed">
                        Paste your unexecuted contract draft into the buffer above or upload a document (.docx, .pdf, .txt) to execute instant in-RAM forensic detection.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                        
                        <button
                          onClick={() => handleRunAudit()}
                          disabled={!contractText.trim()}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                        >
                          <Play size={13} className="fill-black" />
                          <span>Run Air-Gapped Audit</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clean State: Audited and zero defects detected */}
                  {auditResults && findingsList.length === 0 && (
                    <div className="py-10 px-6 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        Zero Latent Deficiencies Detected
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-md mt-1">
                        All cross-references resolve, financial figures and words are synchronized, and all defined terms are verified.
                      </p>
                    </div>
                  )}

                  {/* Dynamic Findings List — 100% Fully Visible During 3 Free Audits */}
                  {findingsList.map((finding, idx) => {
                    const isCritical = finding.severity === 'critical';
                    const isHigh = finding.severity === 'high';
                    const badgeBg = isCritical 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                      : isHigh 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
                    const containerBg = isCritical
                      ? 'bg-rose-500/[0.07] border-rose-500/35'
                      : isHigh
                      ? 'bg-amber-500/[0.07] border-amber-500/35'
                      : 'bg-zinc-900/60 border-zinc-800';

                    return (
                      <div key={finding.id || idx} className={`p-4 rounded-xl border relative transition-all ${containerBg}`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg}`}>
                              {finding.severity?.toUpperCase()} · {finding.category}
                            </span>
                            {finding.clause && (
                              <span className="text-xs font-mono text-zinc-400 font-semibold">{finding.clause}</span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                            <CheckCircle2 size={11} />
                            Full Forensic Finding
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mt-1">
                          {finding.title}
                        </h4>
                        
                        {finding.explanation && (
                          <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed font-sans">
                            {finding.explanation}
                          </p>
                        )}

                        {/* Malpractice Exposure */}
                        {finding.malpracticeRisk && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-200/90 leading-relaxed font-sans flex items-start gap-2">
                            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-red-300">Litigation & Malpractice Risk: </span>
                              <span>{finding.malpracticeRisk}</span>
                            </div>
                          </div>
                        )}

                        {/* Statutory Authority */}
                        {finding.statutoryCitation && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span className="text-zinc-400 font-semibold text-[11px]">Governing Doctrine:</span>
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[11px] font-bold">
                              ⚖️ {finding.statutoryCitation}
                            </span>
                          </div>
                        )}

                        {/* Interactive Link to Liability Reconciler */}
                        {finding.category === 'LIABILITY CAP CONTRADICTION' && (
                          <div className="mt-2.5">
                            <button
                              onClick={() => setActiveTool('reconciler')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer w-fit transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                            >
                              <Scale size={13} className="text-emerald-400" />
                              <span>Open Delaware Express Carve-Out Rider Generator</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        )}

                        {/* Court-Grade Redline Replacement */}
                        {finding.courtGradeRedline ? (
                          !hasActiveLicense && idx >= 3 ? (
                            <div className="mt-3 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-amber-300">
                                <Lock size={13} className="shrink-0 text-amber-400" />
                                <span>AmLaw 100 Court-Grade Redline & UCC analysis gated in preview.</span>
                              </div>
                              <button
                                onClick={() => openUpgrade('locked_finding')}
                                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1"
                              >
                                <span>Unlock Full Remediation</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/35 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                  AmLaw 100 Court-Grade Replacement Language
                                </span>
                                <button
                                  onClick={() => handleCopyDemoRedline(finding.id || idx, finding.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                                >
                                  {copiedDemoId === (finding.id || idx) ? (
                                    <>
                                      <Check size={12} className="text-black" />
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
                              <div className="p-2.5 bg-black/70 rounded text-[11px] font-mono text-emerald-300/90 leading-relaxed border border-emerald-500/20 select-all">
                                {finding.courtGradeRedline}
                              </div>
                            </div>
                          )
                        ) : finding.remedy ? (
                          !hasActiveLicense && idx >= 3 ? (
                            <div className="mt-3 p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2 text-amber-300">
                                <Lock size={13} className="shrink-0 text-amber-400" />
                                <span>Actionable statutory remediation clause & UCC priority analysis gated in preview.</span>
                              </div>
                              <button
                                onClick={() => openUpgrade('locked_finding')}
                                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1"
                              >
                                <span>Unlock Full Remediation</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-emerald-400/90 flex items-center justify-between gap-2">
                              <span>Remediation: {finding.remedy}</span>
                              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            </div>
                          )
                        ) : null}
                      </div>
                    );
                  })}

                </div>

                {/* Export Client Memo & Word Rider Gate Bar */}
                <div className="px-4 py-3 bg-[#08121A] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <FileCheck size={15} className="text-emerald-400" />
                    <span>Court-Grade Pre-Signing Amendment Rider & Export Engine</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                    >
                      <FileDown size={14} className="stroke-[2.5]" />
                      <span>Download Editable Word Rider (.docx)</span>
                    </button>
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} className="text-cyan-400" />
                      <span>Client Memo (PDF)</span>
                    </button>
                    <button
                      onClick={() => openUpgrade('export')}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet size={13} className="text-emerald-400" />
                      <span>Obligations (CSV)</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* LEGAL PROTECTION SHIELD & MALPRACTICE NOTICE                             */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-cyan-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Legal Protection Shield · Malpractice & Quality Control Notice
                      </h4>
                      <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                        VERIFICATION MANDATE
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed max-w-3xl">
                      <strong>Mandatory Counsel Verification Notice:</strong> Automated audit flags, redlines, and suggested remediation clauses are AI-assisted decision heuristics designed for preliminary analytical support. Under ABA Model Rule 1.1 (Competence) and standard professional conduct codes, the reviewing attorney must independently review and verify all contract provisions, statutory citations, and defined terms prior to client execution or court filing.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 self-end md:self-center">
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-black/40 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Lock size={11} />
                    <span>Zero Cloud Liability</span>
                  </span>
                </div>
              </div>

            </motion.div>
          )}

          {/* VIEW 1.5: LIABILITY RECONCILER & DELAWARE CARVE-OUT RIDER */}
          {activeTool === 'reconciler' && (
            <motion.div key="reconciler" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <LiabilityReconcilerHUD
                auditResults={analyzeLiabilityInterlocks(contractText || HAZARDOUS_SAMPLE_CONTRACT)}
                contractText={contractText || HAZARDOUS_SAMPLE_CONTRACT}
                documentTitle={documentTitle || 'Master Asset Purchase & Services Agreement'}
                onLoadSampleDeal={(sampleKey) => {
                  const sample = SAMPLE_DEALS[sampleKey];
                  if (sample) {
                    setContractText(sample.text);
                    setDocumentTitle(sample.title);
                  }
                }}
                onApplyRiderToDraft={(riderText) => {
                  setContractText((prev) => `${(prev || HAZARDOUS_SAMPLE_CONTRACT).trim()}\n\n${riderText}`);
                }}
              />
            </motion.div>
          )}

          {/* VIEW 2: SMART PII REDACTOR (INTERACTIVE DEMO SANDBOX) */}
          {activeTool === 'redact' && (
            <motion.div key="redact" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <EyeOff size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Smart PII & Bank Identity Redactor (Interactive Sandbox)</h2>
                      <p className="text-xs text-zinc-400">Automated discovery and deterministic scrubbing of privileged data in client-side RAM (ABA Rule 1.6).</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
                      IN-RAM SANDBOX
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                  {/* Left: Input Textarea */}
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold">Unredacted Source Draft</h3>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold transition-colors">
                            <Upload size={10} />
                            <span>Upload File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.docx,.txt,.md" 
                              onChange={(e) => handleFileUpload(e, setRedactInputText, 'target')} 
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {redactInputText.trim().split(/\s+/).filter(Boolean).length} words
                          </span>
                        </div>
                      </div>
                      <textarea
                        value={redactInputText}
                        onChange={(e) => setRedactInputText(e.target.value)}
                        className="w-full bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-800/80 text-xs font-mono leading-relaxed text-zinc-200 outline-none resize-none min-h-[220px] focus:border-cyan-500/40"
                        placeholder="Paste draft with SSNs, emails, wire routing, bank accounts..."
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800/60">
                      <button
                        onClick={() => setRedactInputText('Wire settlement of $1,450,000 to escrow account of Johnathan Vance at J.P. Morgan Chase (Account No: 4421-8890-1234, Routing No: 021000021). Tax ID (EIN): 12-3456789. Client Social Security: 000-45-6789. Confidential primary contact: jvance@vancelawfirm.com, mobile: +1 (212) 555-0198. Do not disclose merger terms.')}
                        className="text-[11px] font-mono text-zinc-400 hover:text-cyan-400 transition-colors"
                      >
                        Reset Sample
                      </button>

                      <button
                        onClick={handleRunRedaction}
                        disabled={isRedacting || !redactInputText.trim()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-black font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)] disabled:opacity-40"
                      >
                        {isRedacting ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <Zap size={13} className="fill-black" />
                        )}
                        <span>Scrub Privileged Data In-RAM</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Sanitized Output */}
                  <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={13} />
                          <span>Sanitized Judicial Output</span>
                        </h3>
                        {redactResult && (
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                            {redactResult.totalRedactions} Entities Masked
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-zinc-950/80 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-mono leading-relaxed text-emerald-300 min-h-[220px] whitespace-pre-wrap select-all">
                        {redactResult ? redactResult.sanitizedText : (
                          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-12">
                            <EyeOff size={24} className="mb-2 text-zinc-500" />
                            <span>Click "Scrub Privileged Data In-RAM" to execute client-side masking.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {redactResult && (
                      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                          {redactResult.detectedEntities.map((ent) => (
                            <span key={ent.id} className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
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
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Copy size={12} />
                          <span>Copy Sanitized Text</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-emerald-950/30 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Air-Gapped Discovery & Deposition Scrubbing</span>
                      <span className="text-[9px] font-mono bg-cyan-500/15 text-cyan-300 px-1.5 py-0.2 rounded font-bold uppercase">Enterprise</span>
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Sandbox limited to 500-word excerpt. Bulk scrub 500+ page discovery bundles and deposition PDFs locally without cloud transmission.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('redact'); }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1.5 shrink-0"
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
            <motion.div key="bates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
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
                    LIVE SIMULATOR
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                  {/* Controls Column */}
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-4">
                    <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold">Stamping Parameters</h3>
                    
                    <div>
                      <label className="text-[11px] font-mono text-zinc-300 block mb-1">Prefix Designation:</label>
                      <input
                        type="text"
                        value={batesPrefix}
                        onChange={(e) => setBatesPrefix(e.target.value)}
                        placeholder="e.g. PLTF-, DEF-, CONF-"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-400 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-300 block mb-1">Starting Sequence Number:</label>
                      <input
                        type="text"
                        value={batesStartNum}
                        onChange={(e) => setBatesStartNum(e.target.value)}
                        placeholder="000001"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-300 block mb-1">Stamp Placement:</label>
                      <select
                        value={batesPosition}
                        onChange={(e) => setBatesPosition(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:border-amber-400 outline-none cursor-pointer"
                      >
                        <option value="bottom-right">Bottom Right (Judicial Standard)</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="top-right">Top Right (Docket Style)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-300 block mb-1">Upload Evidentiary PDF (Optional):</label>
                      <label className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-amber-400 text-xs text-zinc-300 cursor-pointer transition-colors">
                        <div className="flex items-center gap-1.5 truncate">
                          <Upload size={12} className="text-amber-400 shrink-0" />
                          <span className="truncate">{batesFile ? batesFile.name : 'Stamp Your Own PDF Document'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">Browse PDF</span>
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
                        <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span className="truncate">Loaded: {batesFile.name}</span>
                          <button onClick={() => setBatesFile(null)} className="text-rose-400 hover:underline cursor-pointer">Clear</button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-300 block mb-1">Font Color:</label>
                      <div className="flex gap-2">
                        {['black', 'navy', 'red'].map((col) => (
                          <button
                            key={col}
                            onClick={() => setBatesColor(col)}
                            className={`px-3 py-1 rounded text-xs capitalize font-mono border cursor-pointer ${
                              batesColor === col 
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' 
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                      <button
                        onClick={handleDownloadSampleBates}
                        disabled={isGeneratingBates}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                      >
                        {isGeneratingBates ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <Download size={13} />
                        )}
                        <span>Download 1-Page Stamped Sample</span>
                      </button>
                    </div>
                  </div>

                  {/* Right 2 Columns: Simulated Legal Document Canvas */}
                  <div className="lg:col-span-2 p-6 rounded-xl bg-[#03060a] border border-zinc-800 relative min-h-[340px] flex flex-col justify-between overflow-hidden shadow-inner">
                    {/* Simulated Legal Document Header */}
                    <div className="space-y-1.5 text-center border-b border-zinc-800/80 pb-4">
                      <p className="text-[11px] font-serif tracking-widest text-zinc-400 font-bold uppercase">
                        IN THE UNITED STATES DISTRICT COURT
                      </p>
                      <p className="text-[10px] font-serif text-zinc-400">SOUTHERN DISTRICT OF NEW YORK</p>
                      <p className="text-[10px] font-mono text-zinc-400">CIVIL DOCKET NO. 26-CV-04891 (RA)</p>
                    </div>

                    {/* Simulated Body Content */}
                    <div className="space-y-2 py-6 text-zinc-400 font-serif text-xs leading-relaxed max-w-lg mx-auto">
                      <p className="font-bold text-center text-zinc-200">EXHIBIT A: MASTER ACQUISITION AGREEMENT</p>
                      <p className="indent-6 text-justify text-[11px] text-zinc-400">
                        Plaintiff hereby submits Exhibit A in support of the preliminary injunction motion. Pursuant to Local Civil Rule 5.1, all confidential trade secrets and proprietary code matrices have been preserved in compliance with the protective order.
                      </p>
                    </div>

                    {/* Live Dynamic Bates Stamp Badge Pill */}
                    <div className={`flex ${
                      batesPosition === 'bottom-right' ? 'justify-end' :
                      batesPosition === 'bottom-center' ? 'justify-center' : 'justify-end'
                    }`}>
                      <div className="bg-white text-black font-mono font-bold text-xs px-2.5 py-0.5 rounded shadow-lg border border-black/20 tracking-wider">
                        {batesPrefix || 'EX-'}{batesStartNum || '000001'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-emerald-950/30 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Sequential Bates Numbering Across Thousands of Pages</span>
                      <span className="text-[9px] font-mono bg-amber-500/15 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">Firm Exclusive</span>
                    </h4>
                    <p className="text-xs text-zinc-300">
                      Single-page simulator active. Multi-file binder batch stamping, high-contrast backing pills, and custom protective order sequences included in Law Firm Suite.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('firm'); openUpgrade('bates'); }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Unlock Law Firm Suite ($299)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3.5: AMLAW 100 TEMPLATES VAULT (PLACED ABOVE AUDIT VAULT) */}
          {activeTool === 'templates' && (
            <motion.div key="templates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <LegalTemplatesView 
                isDemoMode={!hasActiveLicense}
                onTriggerUpgrade={(reason = 'export') => {
                  setModalReason(reason);
                  setShowUpgradeModal(true);
                }}
                onSendToAudit={(compiledText, templateTitle) => {
                  setContractText(compiledText);
                  setDocumentTitle(templateTitle);
                  setActiveTool('analyzer');
                }} 
              />
            </motion.div>
          )}

          {/* VIEW 4: LOCAL AUDIT VAULT & PWA (INTERACTIVE TELEMETRY) */}
          {activeTool === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#050A0F] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Local Audit Vault & Telemetry Inspector</h2>
                      <p className="text-xs text-zinc-400">All audit histories and redline diffs are retained strictly in client browser memory with zero cloud transmission.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-bold">
                    AIR-GAP TELEMETRY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">RAM Allocated</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">~4.8 MB</div>
                    <p className="text-[11px] text-zinc-400 mt-1">In-Memory Heap Space</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">Cloud Data Transmitted</span>
                    <div className="text-xl font-bold font-mono text-cyan-400 mt-1">0.00 KB</div>
                    <p className="text-[11px] text-zinc-400 mt-1">Zero External Telemetry</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">ABA Rule 1.6 Status</span>
                    <div className="text-xl font-bold font-mono text-purple-400 mt-1">100% Compliant</div>
                    <p className="text-[11px] text-zinc-400 mt-1">Strict Confidentiality Guard</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Cryptographic In-Memory Session Purge</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Wipe all extracted text, active buffers, and temporary cache upon closing matter review.</p>
                  </div>
                  <button
                    onClick={handlePurgeVault}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    <span>{vaultPurged ? '✓ Memory Purged' : 'Purge Active RAM Session'}</span>
                  </button>
                </div>

                {/* Non-intrusive value hook banner */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-emerald-950/30 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">Multi-Workstation Offline PWA Deployments</h4>
                    <p className="text-xs text-zinc-300">Install ContractGuard as a standalone desktop app on macOS, Windows, and Linux across your entire firm.</p>
                  </div>
                  <button
                    onClick={() => { setSelectedPlan('solo'); openUpgrade('general'); }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1.5 shrink-0"
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

                {/* Risk Reversal Guarantee Card */}
                <div className="p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-white text-[12px] flex items-center gap-2">
                        <span>The Zero-Risk Forensic Guarantee</span>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">14-DAY TRIAL</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Audit your actual contracts risk-free. 100% money-back refund if you are not completely satisfied.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono shrink-0">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck size={13} />
                      <span>ABA Rule 1.6 Safe</span>
                    </span>
                  </div>
                </div>

                {/* Already Purchased / Restore License */}
                <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
                  <span className="text-[11px] text-zinc-400 font-mono">Already purchased on Whop or cleared browser data?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpgradeModal(false);
                      navigate('/login?redirect=contractcompare');
                    }}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 cursor-pointer"
                  >
                    <Key size={12} />
                    <span>Restore Workstation License</span>
                  </button>
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
