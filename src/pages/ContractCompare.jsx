import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, AlertTriangle, ShieldAlert, Search, CheckCircle2,
  Play, RefreshCw, HardDriveDownload, 
  FileCheck, Layers, EyeOff, X, Download,
  FileCode, Database, Sparkles, Filter, Trash2,
  ShieldCheck, Check, RotateCcw, Calendar, DollarSign,
  Bookmark, HelpCircle, ArrowRight, ArrowLeft, Globe, User, Users, StopCircle, Upload,
  AlertCircle, Clock, CheckSquare, Tag, FileSpreadsheet
} from 'lucide-react';
import * as mammoth from 'mammoth';

// Flagship Engines & Utilities
import { computeContractDiff } from '../utils/diffEngine';
import { scanLegalRisks } from '../utils/legalRiskRules';
import { sanitizeDocumentPII, PII_RULES } from '../utils/piiEngine';
import { executeBatesStamping } from '../utils/batesStamper';
import { 
  saveDiffSession, getAllDiffSessions, deleteDiffSession,
  saveRedactionLog, getAllRedactionLogs,
  saveBatesJob, getAllBatesJobs, clearAllLocalData
} from '../utils/localDB';
import { 
  exportRedlineToHTML, exportAuditReportJSON, exportRedlineSummaryTXT,
  exportExecutiveClientMemoHTML, exportObligationsCSV, exportObligationsJSON
} from '../utils/exportEngine';
import { useContractWorker } from '../utils/useContractWorker';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { verifyToolAccess } from '../utils/auth';
import PirateTrapModal from '../components/PirateTrapModal';

// Sample Contracts for instant testing
const SAMPLE_SINGLE_DRAFT = `ENTERPRISE SOFTWARE LICENSE AND SERVICES AGREEMENT

This Agreement is made on March 15, 2026 ("Effective Date"), by and between Acme Corporation ("Client") and Globex Systems Inc. ("Vendor").

1. DEFINITIONS AND INTERPRETATION
"Agreement" shall mean this Enterprise Software License and Services Agreement.
"Confidential Information" shall mean all proprietary, non-public technical and commercial data disclosed by either party.
"Services" shall mean consulting and support services described in Exhibit A.
"Orphaned Term" shall mean a defined concept with no operative obligations in this contract.

2. LICENSED SERVICES AND COMPENSATION
2.1 Services. Vendor agrees to provide consulting services as described in Exhibit A and specifications in Exhibit B.
2.2 Compensation. Client shall pay Vendor a fixed fee of $15,000 (Fifty Thousand Dollars) within thirty (30) days of receiving an invoice.
2.3 Expenses. Reimbursable expenses must comply with guidelines set forth in Section 9.4.
2.4 Key Personnel. Vendor must assign qualified Key Personnel to lead implementation.

3. TERM AND TERMINATION
3.1 Term. This Agreement shall commence on the Effective Date and terminate on December 31, 2024.
3.2 Termination for Convenience. Either party may terminate upon sixty (60) days prior written notice.

4. CONFIDENTIALITY & DATA SECURITY
4.1 Duty. Each party agrees to maintain Confidential Information in strict confidence for three (3) years.
4.2 Exclusions. Vendor shall not disclose any client records to third parties without prior written consent.
4.3 Notice of Incident. In the event of a security breach, Vendor must notify Client within 24 hours.

5. INTELLECTUAL PROPERTY & REMEDIES
5.1 Pre-existing IP. Vendor retains pre-existing tools.
5.2 Work Product. Deliverables created for Client shall belong to Client upon payment.
5.3 Additional Schedules. Additional maintenance fees are specified in Exhibit D.

6. SIGNATURES & NOTICE
All notices must be sent to the principal office of [Company Name] located at 100 Enterprise Way.
Client Tax ID: [Insert Tax ID Here]`;

const SAMPLE_ORIGINAL = `MASTER SERVICES AGREEMENT

1. SERVICES AND COMPENSATION
Vendor agrees to provide software consulting services to Client. Client shall pay Vendor within 30 days of receiving a valid invoice.

2. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and continue for a period of one (1) year. Either party may terminate this Agreement upon thirty (30) days prior written notice for convenience.

3. CONFIDENTIALITY
Each party agrees to maintain in strict confidence all proprietary information disclosed by the other party for a period of three (3) years following termination.

4. LIMITATION OF LIABILITY
Neither party shall be liable for any indirect, incidental, or consequential damages. Total liability under this Agreement shall not exceed the total fees paid by Client in the preceding twelve (12) months.

5. INTELLECTUAL PROPERTY
Vendor retains all ownership and intellectual property rights in its pre-existing tools and software. Work product created specifically for Client shall be owned by Client upon full payment.`;

const SAMPLE_MODIFIED = `MASTER SERVICES AGREEMENT (AMENDED DRAFT)

1. SERVICES AND COMPENSATION
Vendor agrees to provide software consulting services to Client. Client shall pay Vendor within 60 days of receiving a valid invoice. All late fees are subject to interest compounded daily at 5%.

2. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and shall automatically renew for additional one-year terms without notice unless Client cancels in writing at least 90 days prior to expiration. Client reserves the right to immediate termination without cause at its sole discretion.

3. CONFIDENTIALITY & DATA BREACH
Vendor shall maintain indefinite confidentiality regarding all client records. In the event of a security incident, Vendor must notify within 24 hours. Unlimited data breach liability applies to Vendor.

4. LIMITATION OF LIABILITY & INDEMNIFICATION
Vendor agrees to defend, indemnify and hold harmless Client against all claims, demands, and losses at its sole expense, including reasonable attorneys fees. Vendor shall be subject to unlimited liability for any breach. Client disclaims all implied warranties as is, where is.

5. INTELLECTUAL PROPERTY & RESTRICTIONS
All deliverables shall be considered work made for hire with an irrevocable assignment of all rights, title, and interest to Client. Vendor agrees to a covenant not to compete in Client's industry for two (2) years.

6. DISPUTE RESOLUTION
Any controversy shall be submitted to mandatory binding arbitration under exclusive jurisdiction of Delaware courts, with waiver of jury trial.`;

export default function ContractCompare() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar');
  const isRtl = lang === 'ar';
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | bates | redact | history
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [restoredSession, setRestoredSession] = useState(null);

  // Check auth
  useEffect(() => {
    if (verifyToolAccess('contractcompare') || verifyToolAccess('all') || localStorage.getItem('nexus_access_token')) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
      setShowDeviceModal(true);
    }
  }, []);

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
      alert(isRtl ? "الأداة تعمل محلياً داخل عازل المتصفح. يمكنك إضافتها للمفضلة أو تثبيتها كتطبيق PWA." : "App is running in browser local sandbox. Add to bookmarks or install as PWA if supported.");
    }
  };

  return (
    <div className={`min-h-screen bg-[#02050A] text-white font-sans flex flex-col md:flex-row relative overflow-hidden ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00FF9D]/10 blur-[160px] rounded-full pointer-events-none" />

      {/* Sidebar Dashboard */}
      <aside className={`w-full md:w-80 liquid-glass ${isRtl ? 'border-l' : 'border-r'} border-white/5 flex flex-col shrink-0 z-20`}>
        {/* Top bar with Back button & Language Toggle */}
        <div className="px-6 pt-5 pb-3 border-b border-white/5 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            title={isRtl ? 'الرجوع للصفحة الرئيسية' : 'Back to Home'}
          >
            {isRtl ? <ArrowRight size={14} className="text-nexus-emerald" /> : <ArrowLeft size={14} className="text-nexus-emerald" />}
            <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-nexus-cyan bg-nexus-cyan/10 hover:bg-nexus-cyan/20 border border-nexus-cyan/30 transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            title={isRtl ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية'}
          >
            <Globe size={13} />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Branding header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black border border-nexus-emerald/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.25)]">
              <ShieldAlert className="text-nexus-emerald" size={22} />
            </div>
            <div>
              <h1 className="text-base font-bold font-serif text-white tracking-wide">Nexus ContractGuard</h1>
              <p className="text-[10px] text-nexus-cyan font-mono tracking-wider font-semibold">ENTERPRISE AIR-GAPPED</p>
            </div>
          </div>
        </div>

        {/* Air-gap security attestation pill */}
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400">
          <ShieldCheck size={16} className="shrink-0" />
          <span className="text-[11px] font-mono leading-tight">
            {isRtl ? '100% تدقيق في ذاكرة المتصفح | صفر سيرفر' : '100% In-Memory RAM | 0 Server Telemetry'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 flex-1 flex flex-col gap-2 mt-2">
          <button 
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTool === 'analyzer' ? 'bg-nexus-emerald/15 text-nexus-emerald border border-nexus-emerald/40 shadow-[0_0_15px_rgba(0,255,157,0.15)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Search size={18} />
            <div className={`${isRtl ? 'text-right' : 'text-left'} flex-1`}>
              <p className="text-sm font-semibold">{isRtl ? 'تدقيق النزاهة والمخاطر' : 'Integrity & Diff Audit'}</p>
              <p className="text-[10px] opacity-70">{isRtl ? 'فحص مسودة واحدة أو مقارنة مسودتين' : 'Single Draft or Dual Redline'}</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTool === 'redact' ? 'bg-nexus-emerald/15 text-nexus-emerald border border-nexus-emerald/40 shadow-[0_0_15px_rgba(0,255,157,0.15)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <EyeOff size={18} />
            <div className={`${isRtl ? 'text-right' : 'text-left'} flex-1`}>
              <p className="text-sm font-semibold">{isRtl ? 'طمس البيانات الحساسة (PII)' : 'Smart PII Redactor'}</p>
              <p className="text-[10px] opacity-70">{isRtl ? 'حجب الهويات، البطاقات، الحسابات البنكية' : 'SSN, CC, IBAN, Custom Scrub'}</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTool === 'bates' ? 'bg-nexus-emerald/15 text-nexus-emerald border border-nexus-emerald/40 shadow-[0_0_15px_rgba(0,255,157,0.15)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Layers size={18} />
            <div className={`${isRtl ? 'text-right' : 'text-left'} flex-1`}>
              <p className="text-sm font-semibold">{isRtl ? 'الترقيم القضائي (Bates)' : 'Bates Stamping Suite'}</p>
              <p className="text-[10px] opacity-70">{isRtl ? 'ترقيم الأدلة والمستندات للمحاكم' : 'Court Evidence Numbering'}</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${activeTool === 'history' ? 'bg-nexus-emerald/15 text-nexus-emerald border border-nexus-emerald/40 shadow-[0_0_15px_rgba(0,255,157,0.15)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Database size={18} />
            <div className={`${isRtl ? 'text-right' : 'text-left'} flex-1`}>
              <p className="text-sm font-semibold">{isRtl ? 'سجل الجلسات المحفوظة' : 'Audit Trail & Vault'}</p>
              <p className="text-[10px] opacity-70">{isRtl ? 'تخزين مشفر محلي IndexedDB' : 'IndexedDB Local Persistence'}</p>
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <button 
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 bg-nexus-emerald text-black font-bold text-xs px-4 py-3 rounded-xl hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,157,0.3)]"
          >
            <HardDriveDownload size={15} />
            {isRtl ? 'تثبيت الأداة أوفلاين (PWA)' : 'Desktop Air-Gap Mode'}
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTool === 'analyzer' && (
            <motion.div key="analyzer" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
              <ContractAnalyzerView initialSession={restoredSession} lang={lang} isRtl={isRtl} />
            </motion.div>
          )}
          {activeTool === 'redact' && (
            <motion.div key="redact" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
              <PIIRedactorView />
            </motion.div>
          )}
          {activeTool === 'bates' && (
            <motion.div key="bates" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
              <BatesStamperView />
            </motion.div>
          )}
          {activeTool === 'history' && (
            <motion.div key="history" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
              <AuditVaultView onSelectDiff={(session) => {
                setRestoredSession(session);
                setActiveTool('analyzer');
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <PirateTrapModal 
        isOpen={showDeviceModal || !isUnlocked} 
        onSuccess={() => {
          setIsUnlocked(true);
          setShowDeviceModal(false);
        }}
        toolName="contractcompare"
      />
    </div>
  );
}

// =========================================================================
// 1. CONTRACT ANALYZER VIEW (Dual Modes + Web Worker HUD + Multi-Export)
// =========================================================================
function ContractAnalyzerView({ initialSession, lang: _lang = 'ar', isRtl = true }) {
  // Mode selection: 'single' (pre-signing integrity audit) or 'comparative' (redline diff)
  const [analysisMode, setAnalysisMode] = useState(initialSession?.originalText ? 'comparative' : 'single');

  const [text, setText] = useState(initialSession?.modifiedText || initialSession?.originalText || '');
  const [baselineText, setBaselineText] = useState(initialSession?.originalText || '');
  const [documentTitle, setDocumentTitle] = useState(initialSession?.title || (isRtl ? 'اتفاقية ترخيص وخدمات برمجية' : 'Software License & Services Agreement'));
  const [clientParty, setClientParty] = useState('Acme Corporation');
  const [counterparty, setCounterparty] = useState('Globex Systems Inc');
  const [diffGranularity, setDiffGranularity] = useState('word'); // 'word' | 'line'
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(false);

  // File upload status messages
  const [uploadStatus, setUploadStatus] = useState({ target: '', baseline: '' });

  // Web Worker Management Hook
  const {
    isProcessing,
    progress,
    result: auditResults,
    error: workerError,
    runAnalysis,
    cancelAnalysis
  } = useContractWorker();

  const [activeHudTab, setActiveHudTab] = useState('crossRefs'); // crossRefs | definedTerms | financialDates | obligations | risks | diff
  const [obligationPartyFilter, setObligationPartyFilter] = useState('all'); // all | Client | Counterparty | Mutual | Third Party
  const [obligationDutyFilter, setObligationDutyFilter] = useState('all'); // all | affirmative | negative | conditional
  const [riskSeverityFilter, setRiskSeverityFilter] = useState('all'); // all | critical | warning | info
  const [saveStatus, setSaveStatus] = useState('');

  // Restore session if loaded from local DB
  useEffect(() => {
    if (initialSession) {
      if (initialSession.modifiedText) {
        setText(initialSession.modifiedText);
        setBaselineText(initialSession.originalText || '');
        setAnalysisMode('comparative');
      } else if (initialSession.originalText) {
        setText(initialSession.originalText);
        setAnalysisMode('single');
      }
      if (initialSession.title) setDocumentTitle(initialSession.title);
    }
  }, [initialSession]);

  const loadSampleContract = (autoAudit = false) => {
    if (analysisMode === 'single') {
      const sampleText = SAMPLE_SINGLE_DRAFT;
      const sampleTitle = isRtl ? 'اتفاقية ترخيص برمجيات نموذجية (مسودة تجريبية)' : 'Software License & Services Agreement (Sample Draft)';
      const client = 'Acme Corporation';
      const counter = 'Globex Systems Inc';
      setText(sampleText);
      setDocumentTitle(sampleTitle);
      setClientParty(client);
      setCounterparty(counter);
      if (autoAudit) {
        handleExecuteAudit({
          mode: 'single',
          text: sampleText,
          baselineText: '',
          title: sampleTitle,
          clientParty: client,
          counterparty: counter
        });
      }
    } else {
      const baseText = SAMPLE_ORIGINAL;
      const modText = SAMPLE_MODIFIED;
      const sampleTitle = isRtl ? 'اتفاقية خدمات عامة (مقارنة مسودتين)' : 'Master Services Agreement (Amended Redline)';
      const client = 'Acme Corporation';
      const counter = 'Vendor Systems Inc';
      setBaselineText(baseText);
      setText(modText);
      setDocumentTitle(sampleTitle);
      setClientParty(client);
      setCounterparty(counter);
      if (autoAudit) {
        handleExecuteAudit({
          mode: 'comparative',
          text: modText,
          baselineText: baseText,
          title: sampleTitle,
          clientParty: client,
          counterparty: counter
        });
      }
    }
  };

  const handleFileUpload = async (e, setTargetText, statusKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [statusKey]: `Reading ${file.name}...` }));

    try {
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Extracting text via local pdfjs-dist...' }));
        const pdfResult = await extractTextFromPDF(file, {
          onProgress: (p) => {
            setUploadStatus(prev => ({
              ...prev,
              [statusKey]: `Extracting PDF: page ${p.currentPage}/${p.totalPages} (${p.percent}%)...`
            }));
          }
        });
        setTargetText(pdfResult.fullText);
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `Loaded PDF: ${pdfResult.pageCount} pages, ${pdfResult.totalWords} words`
        }));
      } else if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTargetText(result.value);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded Word DOCX (${result.value.split(/\s+/).length} words)` }));
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        const fileContent = await file.text();
        setTargetText(fileContent);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded text file (${fileContent.split(/\s+/).length} words)` }));
      } else {
        alert("Supported formats: .pdf, .docx, .txt, .md");
        setUploadStatus(prev => ({ ...prev, [statusKey]: '' }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse document: " + err.message);
      setUploadStatus(prev => ({ ...prev, [statusKey]: 'Failed to parse file' }));
    }
  };

  const handleExecuteAudit = async (overridePayload) => {
    const targetText = overridePayload?.text !== undefined ? overridePayload.text : text;
    const targetBaseline = overridePayload?.baselineText !== undefined ? overridePayload.baselineText : baselineText;
    const targetMode = overridePayload?.mode || analysisMode;
    const targetTitle = overridePayload?.title || documentTitle;
    const targetClient = overridePayload?.clientParty || clientParty;
    const targetCounter = overridePayload?.counterparty || counterparty;

    if (!targetText.trim()) {
      alert(isRtl ? "يرجى كتابة أو لصق نص العقد للبدء بالتدقيق." : "Please provide contract text to audit.");
      return;
    }
    if (targetMode === 'comparative' && !targetBaseline.trim()) {
      alert(isRtl ? "يرجى توفير نص العقد الأساسي للمقارنة." : "Please provide the original baseline contract for comparative diff.");
      return;
    }

    try {
      const payload = {
        mode: targetMode,
        text: targetText.trim(),
        baselineText: targetMode === 'comparative' ? targetBaseline.trim() : '',
        clientParty: targetClient.trim(),
        counterparty: targetCounter.trim(),
        options: {
          diffOptions: { granularity: diffGranularity }
        }
      };

      const auditData = await runAnalysis(payload);

      if (auditData) {
        // Auto-save session into local IndexedDB
        await saveDiffSession({
          title: targetTitle || (isRtl ? 'تدقيق نزاهة العقد' : 'Contract Integrity Audit'),
          originalText: targetMode === 'comparative' ? targetBaseline : targetText,
          modifiedText: targetMode === 'comparative' ? targetText : '',
          stats: auditData.diff?.stats || {
            similarity: 100,
            additions: 0,
            deletions: 0,
            originalWordCount: auditData.meta?.wordCount || 0
          },
          risksCount: auditData.risks?.length || 0,
          overallRiskScore: auditData.overallRiskScore
        });

        setSaveStatus(isRtl ? 'تم حفظ التقرير في الخزينة المحلية (IndexedDB)' : 'Audit saved to Local Vault (IndexedDB)');
        setTimeout(() => setSaveStatus(''), 4500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Obligations filter logic
  const filteredObligations = useMemo(() => {
    if (!auditResults?.obligations?.obligations) return [];
    return auditResults.obligations.obligations.filter(obl => {
      const matchParty = obligationPartyFilter === 'all' || obl.responsibleParty === obligationPartyFilter;
      const matchDuty = obligationDutyFilter === 'all' || obl.dutyType === obligationDutyFilter;
      return matchParty && matchDuty;
    });
  }, [auditResults, obligationPartyFilter, obligationDutyFilter]);

  // Scanned risks filter logic
  const filteredRisks = useMemo(() => {
    if (!auditResults?.risks) return [];
    return auditResults.risks.filter(r => {
      if (riskSeverityFilter === 'all') return true;
      return r.severity === riskSeverityFilter;
    });
  }, [auditResults, riskSeverityFilter]);

  // Calculations for score badges
  const riskScore = auditResults?.overallRiskScore ?? 0;
  const riskLevel = auditResults?.riskLevel || 'low';
  const riskScoreBadgeColor = riskScore >= 75 ? 'bg-red-500 text-white border-red-400' :
                              riskScore >= 45 ? 'bg-orange-500 text-black border-orange-400' :
                              riskScore >= 20 ? 'bg-amber-500 text-black border-amber-400' :
                              'bg-emerald-500 text-black border-emerald-400';

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-white">
              {isRtl ? 'استوديو فحص ونزاهة العقود القانونية' : 'Contract Integrity & Risk Proofreader'}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30">
              ContractGuard 2.0
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            {isRtl 
              ? 'تدقيق آلي شامل للمراجع والمبالغ والتواريخ والالتزامات محلياً 100% داخل المتصفح (معيار ABA Rule 1.6).' 
              : 'Pre-signature document integrity audit (Cross-Refs, Defined Terms, Financial & Dates, Obligations) with air-gapped local processing.'
            }
          </p>
        </div>

        {/* Mode Selector and Quick Load */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setAnalysisMode('single');
                setActiveHudTab('crossRefs');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${analysisMode === 'single' ? 'bg-nexus-emerald text-black shadow-[0_0_12px_rgba(0,255,157,0.25)]' : 'text-zinc-400 hover:text-white'}`}
            >
              <FileCheck size={14} />
              {isRtl ? 'مسودة واحدة قبل التوقيع' : 'Single-Draft Audit'}
            </button>
            <button
              onClick={() => {
                setAnalysisMode('comparative');
                setActiveHudTab('diff');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${analysisMode === 'comparative' ? 'bg-nexus-cyan text-black shadow-[0_0_12px_rgba(0,240,255,0.25)]' : 'text-zinc-400 hover:text-white'}`}
            >
              <Search size={14} />
              {isRtl ? 'مقارنة نسختين وتعديلات' : 'Comparative Redline'}
            </button>
          </div>

          <button
            onClick={() => loadSampleContract(true)}
            className="px-3.5 py-2 bg-nexus-emerald/15 hover:bg-nexus-emerald/25 border border-nexus-emerald/40 rounded-xl text-xs font-bold text-nexus-emerald hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,157,0.2)] animate-pulse"
            title={isRtl ? "تحميل عينة عقد حقيقية بها أخطاء وفحصها فوراً" : "Load realistic contract test fixture with known drafting defects & audit immediately"}
          >
            <Sparkles size={14} className="text-nexus-emerald" />
            <span>{isRtl ? '🚀 تجربة عقد نموذجي وفحصه فوراً' : '🚀 Load & Auto-Audit Sample'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Document Metadata Drawer */}
      <div className="rounded-xl border border-white/10 bg-[#060D12] overflow-hidden text-xs">
        <button
          onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
          className="w-full p-2.5 px-3.5 flex items-center justify-between text-zinc-400 hover:text-white transition-colors"
        >
          <span className="font-mono text-[11px] flex items-center gap-2">
            <span>⚙️</span>
            <span>{isRtl ? 'بيانات أطراف العقد وعنوان المستند' : 'Contract Title & Parties Metadata'}</span>
            <span className="text-zinc-500 font-sans">({documentTitle} • {clientParty} vs {counterparty})</span>
          </span>
          <span className="text-[10px] text-nexus-cyan font-bold">
            {showMetadataDrawer ? (isRtl ? 'إخفاء ▲' : 'Collapse ▲') : (isRtl ? 'تعديل ▼' : 'Edit ▼')}
          </span>
        </button>

        {showMetadataDrawer && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 border-t border-white/5 bg-black/40">
            <div>
              <label className="text-zinc-400 font-mono text-[11px] block mb-1">
                {isRtl ? 'عنوان العقد / المستند' : 'Contract / Matter Title'}
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder={isRtl ? 'مثال: اتفاقية تقديم خدمات برمجية' : 'e.g. Master Services Agreement'}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:border-nexus-emerald outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono text-[11px] block mb-1 flex items-center gap-1">
                <User size={12} className="text-nexus-cyan" /> 
                {isRtl ? 'الطرف الأول (الموكل / شركتك)' : 'Client Party (Your Entity)'}
              </label>
              <input
                type="text"
                value={clientParty}
                onChange={(e) => setClientParty(e.target.value)}
                placeholder="e.g. Acme Corporation"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:border-nexus-cyan outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-mono text-[11px] block mb-1 flex items-center gap-1">
                <Users size={12} className="text-nexus-emerald" /> 
                {isRtl ? 'الطرف الثاني (الطرف المقابل)' : 'Counterparty Name'}
              </label>
              <input
                type="text"
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="e.g. Globex Systems Inc"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:border-nexus-emerald outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Panes */}
      {analysisMode === 'single' ? (
        /* SINGLE DOCUMENT INTEGRITY AUDIT MODE */
        <div className="flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden min-h-[340px]">
          <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-nexus-emerald font-mono flex items-center gap-2">
              <FileCheck size={15} className="text-nexus-emerald" />
              CONTRACT DRAFT TO PROOFREAD (Incoming Agreement Prior to Signature)
            </span>
            <div className="flex items-center gap-2">
              {uploadStatus.target && (
                <span className="text-[11px] font-mono text-nexus-cyan">{uploadStatus.target}</span>
              )}
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold text-gray-300 transition-colors flex items-center gap-1.5">
                <Upload size={13} /> Upload (.pdf / .docx / .txt)
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setText, 'target')}
                />
              </label>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract text to audit for broken references, missing exhibits, undefined terms, date contradictions, and financial mismatches..."
            className="flex-1 bg-black/40 p-4 text-xs font-mono leading-relaxed text-gray-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[220px]"
          />
          <div className="p-2 border-t border-white/5 text-[11px] font-mono text-gray-500 flex justify-between px-4">
            <span>Air-gapped client RAM processing (ABA Rule 1.6)</span>
            <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words | {text.split('\n').length} lines</span>
          </div>
        </div>
      ) : (
        /* COMPARATIVE REDLINE DIFF MODE (DUAL PANES) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[340px]">
          {/* Baseline Contract */}
          <div className="flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 font-mono flex items-center gap-2">
                <FileText size={14} className="text-gray-400" />
                ORIGINAL CONTRACT (Baseline)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.baseline && (
                  <span className="text-[11px] font-mono text-nexus-cyan">{uploadStatus.baseline}</span>
                )}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300 transition-colors flex items-center gap-1">
                  <Upload size={12} /> Upload (.pdf/.docx/.txt)
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setBaselineText, 'baseline')}
                  />
                </label>
              </div>
            </div>
            <textarea
              value={baselineText}
              onChange={(e) => setBaselineText(e.target.value)}
              placeholder="Paste original baseline contract..."
              className="flex-1 bg-black/40 p-4 text-xs font-mono leading-relaxed text-gray-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[200px]"
            />
            <div className="p-2 border-t border-white/5 text-[11px] font-mono text-gray-500 text-right pr-4">
              {baselineText.trim() ? baselineText.trim().split(/\s+/).length : 0} words
            </div>
          </div>

          {/* Amended Contract */}
          <div className="flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
            <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-nexus-cyan font-mono flex items-center gap-2">
                <FileCheck size={14} className="text-nexus-cyan" />
                MODIFIED CONTRACT (Amended Draft)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.target && (
                  <span className="text-[11px] font-mono text-nexus-cyan">{uploadStatus.target}</span>
                )}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300 transition-colors flex items-center gap-1">
                  <Upload size={12} /> Upload (.pdf/.docx/.txt)
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setText, 'target')}
                  />
                </label>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste modified or redlined contract text here..."
              className="flex-1 bg-black/40 p-4 text-xs font-mono leading-relaxed text-gray-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[200px]"
            />
            <div className="p-2 border-t border-white/5 text-[11px] font-mono text-gray-500 text-right pr-4">
              {text.trim() ? text.trim().split(/\s+/).length : 0} words
            </div>
          </div>
        </div>
      )}

      {/* Control Bar & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl liquid-glass border border-white/5">
        <div className="flex items-center gap-4">
          {analysisMode === 'comparative' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-400">Diff Granularity:</label>
              <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setDiffGranularity('word')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${diffGranularity === 'word' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Word
                </button>
                <button
                  onClick={() => setDiffGranularity('line')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${diffGranularity === 'line' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  Line
                </button>
              </div>
            </div>
          )}

          {saveStatus && (
            <span className="text-[11px] font-mono text-nexus-emerald flex items-center gap-1 animate-fade-in">
              <Check size={12} /> {saveStatus}
            </span>
          )}

          {workerError && (
            <span className="text-[11px] font-mono text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> {workerError}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isProcessing && (
            <button
              onClick={cancelAnalysis}
              className="px-4 py-3.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all flex items-center gap-1.5"
            >
              <StopCircle size={15} /> {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          )}

          <button
            onClick={() => handleExecuteAudit()}
            disabled={isProcessing || !text.trim() || (analysisMode === 'comparative' && !baselineText.trim())}
            className="px-8 py-3.5 bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-extrabold text-sm rounded-xl hover:opacity-95 transition-all flex items-center gap-2.5 disabled:opacity-40 shadow-[0_0_25px_rgba(0,255,157,0.3)] active:scale-[0.98]"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            <span>
              {isProcessing 
                ? (isRtl ? 'جاري الفحص السريع في الذاكرة...' : 'Auditing in Memory...') 
                : (analysisMode === 'single' 
                    ? (isRtl ? '⚡ بدء الفحص والتدقيق القانوني الفوري' : '⚡ Run Contract Integrity Audit') 
                    : (isRtl ? '⚡ تنفيذ مقارنة التعديلات والتدقيق' : '⚡ Execute Redline Diff & Audit')
                  )
              }
            </span>
          </button>
        </div>
      </div>

      {/* Live Web Worker Progress Bar */}
      {isProcessing && (
        <div className="p-4 rounded-2xl liquid-glass-strong border border-nexus-cyan/30 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-nexus-cyan flex items-center gap-2">
              <RefreshCw className="animate-spin text-nexus-cyan" size={14} />
              {progress?.msg || (isRtl ? 'جاري تدقيق الوثيقة في الذاكرة المحلية...' : 'Auditing legal document in background...')}
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {progress?.percent || 0}%
            </span>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-nexus-emerald to-nexus-cyan h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results HUD */}
      {auditResults && (
        <div className="flex flex-col gap-6 animate-fade-in mt-2">
          {/* Executive Risk Score & Metrics Banner */}
          <div className="p-6 rounded-2xl liquid-glass-strong border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`px-5 py-4 rounded-2xl border text-center ${riskScoreBadgeColor} shadow-[0_0_20px_rgba(0,0,0,0.4)]`}>
                <span className="text-3xl font-black block font-mono">{riskScore}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block font-sans">
                  {riskLevel} {isRtl ? 'المخاطر' : 'RISK'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {riskScore >= 75 ? (isRtl ? 'تم اكتشاف ثغرات صياغة ومخاطر حرجة' : 'Critical Drafting Defects Detected') :
                   riskScore >= 45 ? (isRtl ? 'تم رصد شذوذ قانوني عالي الخطورة' : 'High Risk Legal Anomalies Found') :
                   riskScore >= 20 ? (isRtl ? 'تم تحديد ثغرات صياغة متوسطة' : 'Moderate Drafting Gaps Identified') :
                   (isRtl ? 'سجل نزاهة العقد ممتاز ونظيف' : 'Clean Document Integrity Profile')}
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
                  {isRtl 
                    ? `تم تدقيق ${auditResults.meta?.wordCount || 0} كلمة خلال ${auditResults.meta?.processingTimeMs || 0}ms عبر 4 محركات تدقيق قانوني. صفر إرسال خارج الجهاز.`
                    : `${auditResults.meta?.wordCount || 0} words audited in ${auditResults.meta?.processingTimeMs || 0}ms across 4 legal integrity engines. 0 server transmission.`}
                </p>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportExecutiveClientMemoHTML({
                  contractTitle: documentTitle,
                  clientName: clientParty,
                  counterpartyName: counterparty,
                  auditData: auditResults
                })}
                className="px-4 py-2.5 bg-nexus-emerald text-black font-extrabold rounded-xl text-xs hover:bg-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                title={isRtl ? "توليد مذكرة رأي قانوني تنفيذية جاهزة للطباعة والـ PDF" : "Generate professional law firm client memorandum with print CSS for 1-click PDF"}
              >
                <Download size={14} />
                {isRtl ? 'تصدير مذكرة الموكل (HTML/PDF)' : 'Export Client Memo (HTML/PDF)'}
              </button>

              <button
                onClick={() => exportObligationsCSV(auditResults.obligations)}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
                title={isRtl ? "تصدير جدول الالتزامات التعاقدية كملف إكسل CSV" : "Export contractual obligations schedule to CSV spreadsheet"}
              >
                <FileSpreadsheet size={14} className="text-nexus-cyan" />
                {isRtl ? 'جدول الالتزامات CSV' : 'Obligations CSV'}
              </button>

              {auditResults.diff && (
                <button
                  onClick={() => exportRedlineToHTML(auditResults.diff, auditResults.risks, { title: documentTitle })}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5"
                  title={isRtl ? "تصدير مقارنة التعديلات التفاعلية بصيغة HTML" : "Export interactive HTML redline with insertions & deletions"}
                >
                  <FileCode size={14} />
                  {isRtl ? 'مقارنة التعديلات HTML' : 'Redline HTML'}
                </button>
              )}

              <button
                onClick={() => exportAuditReportJSON(auditResults.diff, auditResults.risks, null, { title: documentTitle })}
                className="px-2.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all"
                title={isRtl ? "سجل الامتثال بصيغة JSON" : "Export compliance JSON verification record"}
              >
                JSON
              </button>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl liquid-glass border border-red-500/20 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-red-400">
                {isRtl ? 'المراجع المكسورة' : 'Broken Cross-Refs'}
              </p>
              <p className="text-2xl font-black text-red-400 mt-1">
                {auditResults.crossRefs?.stats?.brokenCount || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-amber-500/20 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                {isRtl ? 'الملاحق المفقودة' : 'Missing Exhibits'}
              </p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {auditResults.crossRefs?.stats?.missingExhibitCount || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-orange-500/20 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-orange-400">
                {isRtl ? 'تضارب المبالغ' : 'Financial Mismatches'}
              </p>
              <p className="text-2xl font-black text-orange-400 mt-1">
                {auditResults.financialDates?.stats?.mismatchCount || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-nexus-cyan/20 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-nexus-cyan">
                {isRtl ? 'مصطلحات غير معرّفة' : 'Undefined Terms'}
              </p>
              <p className="text-2xl font-black text-nexus-cyan mt-1">
                {auditResults.definedTerms?.stats?.undefinedCount || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl liquid-glass border border-nexus-emerald/20 text-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-nexus-emerald">
                {isRtl ? 'الالتزامات' : 'Obligations'}
              </p>
              <p className="text-2xl font-black text-nexus-emerald mt-1">
                {auditResults.obligations?.stats?.totalObligations || 0}
              </p>
            </div>
          </div>

          {/* Complete HUD Sub-Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
            <button
              onClick={() => setActiveHudTab('crossRefs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'crossRefs' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Bookmark size={14} />
              <span>{isRtl ? 'المراجع والملاحق (R1)' : 'Cross-References (R1)'}</span>
              {(auditResults.crossRefs?.issues?.length || 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-mono">
                  {auditResults.crossRefs.issues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('definedTerms')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'definedTerms' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Tag size={14} />
              <span>{isRtl ? 'المصطلحات المعرفة (R2)' : 'Defined Terms & Boilerplate (R2)'}</span>
              {((auditResults.definedTerms?.stats?.undefinedCount || 0) + (auditResults.definedTerms?.stats?.artifactCount || 0)) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-black font-mono">
                  {(auditResults.definedTerms?.stats?.undefinedCount || 0) + (auditResults.definedTerms?.stats?.artifactCount || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('financialDates')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'financialDates' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <DollarSign size={14} />
              <span>{isRtl ? 'المبالغ والتواريخ الحساسة (R3)' : 'Financial & Vital Dates (R3)'}</span>
              {(auditResults.financialDates?.issues?.length || 0) > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-mono">
                  {auditResults.financialDates.issues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('obligations')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'obligations' ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <CheckSquare size={14} />
              <span>{isRtl ? `مصفوفة الالتزامات (R4) (${auditResults.obligations?.stats?.totalObligations || 0})` : `Obligations Matrix (R4) (${auditResults.obligations?.stats?.totalObligations || 0})`}</span>
            </button>

            <button
              onClick={() => setActiveHudTab('risks')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'risks' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <ShieldAlert size={14} />
              <span>{isRtl ? `رادار المخاطر (${auditResults.risks?.length || 0})` : `Risk Radar (${auditResults.risks?.length || 0})`}</span>
            </button>

            {auditResults.diff && (
              <button
                onClick={() => setActiveHudTab('diff')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeHudTab === 'diff' ? 'bg-nexus-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Search size={14} />
                <span>{isRtl ? `مقارنة التعديلات (${auditResults.diff.stats?.similarity}% تطابق)` : `Redline Diff (${auditResults.diff.stats?.similarity}% Sim)`}</span>
              </button>
            )}
          </div>

          {/* TAB 1: CROSS-REFERENCES & EXHIBITS (R1) */}
          {activeHudTab === 'crossRefs' && (
            <div className="flex flex-col gap-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Indexed Sections</span>
                  <span className="text-lg font-bold text-white">{auditResults.crossRefs?.stats?.totalIndexed || 0}</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Citations Found</span>
                  <span className="text-lg font-bold text-nexus-cyan">{auditResults.crossRefs?.stats?.totalCitations || 0}</span>
                </div>
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <span className="text-red-400 block text-[11px]">Broken References</span>
                  <span className="text-lg font-bold text-red-400">{auditResults.crossRefs?.stats?.brokenCount || 0}</span>
                </div>
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                  <span className="text-amber-400 block text-[11px]">Missing Exhibits</span>
                  <span className="text-lg font-bold text-amber-400">{auditResults.crossRefs?.stats?.missingExhibitCount || 0}</span>
                </div>
              </div>

              {/* Broken References Schedule */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  Broken References & Missing Sections ({(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').length})
                </h4>
                {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
                    ✓ All internal section citations ("Section X", "Clause Y") resolve to indexed sections in the agreement.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').map((issue, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-red-300 text-sm">
                              {issue.referenceText}
                            </span>
                            <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                              Target Missing: {issue.targetName}
                            </span>
                            <span className="font-mono text-gray-400 text-[11px]">
                              Line {issue.line}
                            </span>
                          </div>
                          <p className="text-gray-300 font-mono italic">
                            "{issue.snippet}"
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-red-400 font-mono">
                          Litigation Risk: Citation to nonexistent covenant
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Exhibits Schedule */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bookmark size={16} className="text-amber-400" />
                  Missing Exhibits, Schedules & Appendices ({(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').length})
                </h4>
                {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
                    ✓ All referenced Exhibits, Schedules, and Appendices are indexed in the agreement package.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').map((issue, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-amber-300 text-sm">
                              {issue.referenceText}
                            </span>
                            <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                              Exhibit Missing
                            </span>
                            <span className="font-mono text-gray-400 text-[11px]">
                              Line {issue.line}
                            </span>
                          </div>
                          <p className="text-gray-300 font-mono italic">
                            "{issue.snippet}"
                          </p>
                        </div>
                        <div className="text-right text-[11px] text-amber-400 font-mono">
                          Attachment missing from signing bundle
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Indexed Headings Directory */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <h4 className="text-xs font-bold uppercase text-gray-400 font-mono mb-3">
                  Indexed Document Structure ({auditResults.crossRefs?.indexedSections?.length || 0} Sections, {auditResults.crossRefs?.indexedExhibits?.length || 0} Exhibits)
                </h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {(auditResults.crossRefs?.indexedSections || []).map((sec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300" title={`Line ${sec.line}: ${sec.title}`}>
                      § {sec.id} {sec.title ? `— ${sec.title}` : ''}
                    </span>
                  ))}
                  {(auditResults.crossRefs?.indexedExhibits || []).map((ex, i) => (
                    <span key={'ex-' + i} className="px-2.5 py-1 rounded-lg bg-nexus-cyan/10 border border-nexus-cyan/30 text-xs font-mono text-nexus-cyan" title={`Line ${ex.line}`}>
                      📎 {ex.id} {ex.title ? `— ${ex.title}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEFINED TERMS & ENTITY CONSISTENCY (R2) */}
          {activeHudTab === 'definedTerms' && (
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Formal Defined Terms</span>
                  <span className="text-lg font-bold text-nexus-emerald">{auditResults.definedTerms?.stats?.totalDefined || 0}</span>
                </div>
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                  <span className="text-amber-400 block text-[11px]">Undefined Capitalized Terms</span>
                  <span className="text-lg font-bold text-amber-400">{auditResults.definedTerms?.stats?.undefinedCount || 0}</span>
                </div>
                <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                  <span className="text-blue-400 block text-[11px]">Unused Defined Terms</span>
                  <span className="text-lg font-bold text-blue-400">{auditResults.definedTerms?.stats?.unusedCount || 0}</span>
                </div>
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <span className="text-red-400 block text-[11px]">Template Artifacts</span>
                  <span className="text-lg font-bold text-red-400">{auditResults.definedTerms?.stats?.artifactCount || 0}</span>
                </div>
              </div>

              {/* Undefined Capitalized Terms */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle size={16} className="text-amber-400" />
                  Undefined Capitalized Terms ({auditResults.definedTerms?.undefinedTerms?.length || 0})
                </h4>
                {(!auditResults.definedTerms?.undefinedTerms || auditResults.definedTerms.undefinedTerms.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
                    ✓ No undefined capitalized terms detected.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResults.definedTerms.undefinedTerms.map((termItem, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs font-mono">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-300">"{termItem.term}"</span>
                          <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            Found {termItem.count || 1}x
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">First referenced at line {termItem.line} without explicit definition.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unused Defined Terms */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag size={16} className="text-blue-400" />
                  Unused Defined Terms ({auditResults.definedTerms?.unusedDefinedTerms?.length || 0})
                </h4>
                {(!auditResults.definedTerms?.unusedDefinedTerms || auditResults.definedTerms.unusedDefinedTerms.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
                    ✓ All defined terms are actively utilized in operative clauses.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResults.definedTerms.unusedDefinedTerms.map((unusedItem, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-blue-500/30 text-xs font-mono">
                        <span className="font-bold text-blue-300 block mb-1">"{unusedItem.term}"</span>
                        <p className="text-[11px] text-gray-400">Defined at line {unusedItem.line} but never referenced in operative covenants.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Placeholders & Leftovers */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400" />
                  Leftover Boilerplate & Unfilled Placeholders ({auditResults.definedTerms?.boilerplateArtifacts?.length || 0})
                </h4>
                {(!auditResults.definedTerms?.boilerplateArtifacts || auditResults.definedTerms.boilerplateArtifacts.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
                    ✓ Zero unfilled template brackets (`[Company Name]`, `___`) detected.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditResults.definedTerms.boilerplateArtifacts.map((art, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 text-xs font-mono flex items-center justify-between">
                        <div>
                          <span className="font-bold text-red-300 text-sm">{art.placeholder}</span>
                          <span className="text-gray-400 ml-2">Line {art.line}</span>
                          <p className="text-gray-300 italic mt-0.5">"{art.snippet}"</p>
                        </div>
                        <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                          Drafting Artifact
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Entity Inconsistencies */}
              {(auditResults.definedTerms?.entityIssues?.length || 0) > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={16} className="text-orange-400" />
                    Entity Discrepancies & Alien Counterparties ({auditResults.definedTerms.entityIssues.length})
                  </h4>
                  <div className="space-y-2">
                    {auditResults.definedTerms.entityIssues.map((ent, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/40 text-xs font-mono">
                        <span className="font-bold text-orange-300">{ent.entity}: </span>
                        <span className="text-gray-300">{ent.discrepancy}</span>
                        <span className="text-gray-500 ml-2">(Line {ent.line})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIAL & VITAL DATES INTEGRITY (R3) */}
          {activeHudTab === 'financialDates' && (
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Financial Pairings</span>
                  <span className="text-lg font-bold text-white">{auditResults.financialDates?.stats?.totalAmounts || 0}</span>
                </div>
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <span className="text-red-400 block text-[11px]">Words vs Digits Mismatches</span>
                  <span className="text-lg font-bold text-red-400">{auditResults.financialDates?.stats?.mismatchCount || 0}</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="text-gray-400 block text-[11px]">Contract Dates Found</span>
                  <span className="text-lg font-bold text-nexus-cyan">{auditResults.financialDates?.stats?.totalDates || 0}</span>
                </div>
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                  <span className="text-amber-400 block text-[11px]">Chronology Conflicts</span>
                  <span className="text-lg font-bold text-amber-400">{auditResults.financialDates?.stats?.dateIssuesCount || 0}</span>
                </div>
              </div>

              {/* Side-by-Side Financial Mismatches */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign size={16} className="text-red-400" />
                  Words vs Numbers Financial Contradictions ({(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').length})
                </h4>
                {(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
                    ✓ All numeric figures and written monetary values ("$10,000" vs "Ten Thousand Dollars") are in perfect alignment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').map((mismatch, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-red-950/25 border border-red-500/40 text-xs font-mono">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-red-300 text-sm">{mismatch.title}</span>
                          <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                            Critical Mismatch
                          </span>
                        </div>
                        <p className="text-gray-200 mb-2">{mismatch.details}</p>
                        <div className="p-2.5 bg-black/50 rounded-lg text-gray-400 italic">
                          "{mismatch.snippet}" <span className="text-nexus-cyan ml-2">(Line {mismatch.line})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timeline & Chronology Schedule */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar size={16} className="text-nexus-cyan" />
                  Contract Chronology & Vital Milestones ({auditResults.financialDates?.timeline?.length || 0} Events)
                </h4>
                {(!auditResults.financialDates?.timeline || auditResults.financialDates.timeline.length === 0) ? (
                  <div className="p-4 text-center text-xs text-gray-500 font-mono">
                    No explicit dates or milestones detected.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditResults.financialDates.timeline.map((item, idx) => (
                      <div key={idx} className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${item.isPast ? 'bg-amber-950/20 border-amber-500/30' : 'bg-black/40 border-white/5'}`}>
                        <div>
                          <span className="font-bold text-white">{item.event}: </span>
                          <span className={item.isPast ? 'text-amber-400 font-bold' : 'text-nexus-cyan'}>{item.date}</span>
                          <span className="text-gray-500 ml-2">(Line {item.line})</span>
                        </div>
                        {item.isPast && (
                          <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                            Date Expired / In Past
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notice Periods */}
              {(auditResults.financialDates?.noticePeriods?.length || 0) > 0 && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <h4 className="text-xs font-bold uppercase text-gray-400 font-mono mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-nexus-emerald" />
                    Notice Periods & Response Deadlines ({auditResults.financialDates.noticePeriods.length})
                  </h4>
                  <div className="space-y-2">
                    {auditResults.financialDates.noticePeriods.map((notice, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono flex items-center justify-between">
                        <span className="text-nexus-emerald font-bold">{notice.periodDays} Days</span>
                        <span className="text-gray-300 truncate max-w-lg">"{notice.context}"</span>
                        <span className="text-gray-500">Line {notice.line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OBLIGATIONS MATRIX (R4) */}
          {activeHudTab === 'obligations' && (
            <div className="flex flex-col gap-4">
              {/* Party Breakdown Filters & CSV Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl liquid-glass border border-white/5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-400 font-mono mr-1">Party:</span>
                  <button
                    onClick={() => setObligationPartyFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${obligationPartyFilter === 'all' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  >
                    All ({auditResults.obligations?.stats?.totalObligations || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Client')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${obligationPartyFilter === 'Client' ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  >
                    Client ({auditResults.obligations?.partyBreakdown?.clientCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Counterparty')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${obligationPartyFilter === 'Counterparty' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  >
                    Counterparty ({auditResults.obligations?.partyBreakdown?.counterpartyCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Mutual')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${obligationPartyFilter === 'Mutual' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  >
                    Mutual ({auditResults.obligations?.partyBreakdown?.mutualCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Third Party')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${obligationPartyFilter === 'Third Party' ? 'bg-gray-400 text-black' : 'text-gray-400 hover:text-white bg-white/5'}`}
                  >
                    Third Party ({auditResults.obligations?.partyBreakdown?.thirdPartyCount || 0})
                  </button>
                </div>

                <button
                  onClick={() => exportObligationsCSV(auditResults.obligations)}
                  className="px-3 py-1.5 bg-nexus-emerald text-black text-xs font-bold rounded-xl hover:bg-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,157,0.2)]"
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {/* Obligations Table */}
              <div className="rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/[0.04] border-b border-white/10 font-mono text-gray-400 uppercase text-[11px]">
                        <th className="p-3 w-12">#</th>
                        <th className="p-3 w-28">Party</th>
                        <th className="p-3 w-28">Duty Type</th>
                        <th className="p-3">Operative Obligation Sentence</th>
                        <th className="p-3 w-20">Line</th>
                        <th className="p-3 w-24">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {filteredObligations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            No obligations found matching the current party filter.
                          </td>
                        </tr>
                      ) : (
                        filteredObligations.map((obl, idx) => {
                          const partyPill = obl.responsibleParty === 'Client' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                                            obl.responsibleParty === 'Counterparty' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                            obl.responsibleParty === 'Mutual' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                                            'bg-gray-500/20 text-gray-400 border-gray-500/30';
                          const sevPill = obl.severity === 'high' ? 'bg-red-500 text-white' :
                                          obl.severity === 'medium' ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white';

                          return (
                            <tr key={obl.id || idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 text-gray-500">#{idx + 1}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${partyPill}`}>
                                  {obl.responsibleParty}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-white">{obl.modalVerb}</span>
                                <span className="text-[10px] text-gray-400 ml-1">({obl.dutyType})</span>
                              </td>
                              <td className="p-3 font-sans text-gray-200 leading-relaxed">
                                {obl.sentence || obl.action}
                                {obl.sectionContext && (
                                  <span className="block text-[10px] font-mono text-gray-500 mt-0.5">
                                    Context: {obl.sectionContext}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-gray-400">{obl.line}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${sevPill}`}>
                                  {obl.severity}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RISK RADAR (49 Liability Rules) */}
          {activeHudTab === 'risks' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-400" />
                  Scanned Legal Liabilities & Red Flags ({auditResults.risks?.length || 0})
                </h4>
                <div className="flex items-center gap-1 text-xs">
                  <Filter size={13} className="text-gray-400 mr-1" />
                  <button
                    onClick={() => setRiskSeverityFilter('all')}
                    className={`px-2.5 py-1 rounded-lg ${riskSeverityFilter === 'all' ? 'bg-white/20 text-white font-bold' : 'text-gray-400'}`}
                  >
                    All ({auditResults.risks?.length || 0})
                  </button>
                  <button
                    onClick={() => setRiskSeverityFilter('critical')}
                    className={`px-2.5 py-1 rounded-lg ${riskSeverityFilter === 'critical' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-gray-400'}`}
                  >
                    Critical ({auditResults.risks?.filter(r => r.severity === 'critical').length || 0})
                  </button>
                  <button
                    onClick={() => setRiskSeverityFilter('warning')}
                    className={`px-2.5 py-1 rounded-lg ${riskSeverityFilter === 'warning' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-gray-400'}`}
                  >
                    Warnings ({auditResults.risks?.filter(r => r.severity === 'warning').length || 0})
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {filteredRisks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 bg-black/30 rounded-2xl">
                    No risk clauses matching the active filter.
                  </div>
                ) : (
                  filteredRisks.map((risk, index) => {
                    const isCrit = risk.severity === 'critical';
                    const isWarn = risk.severity === 'warning';
                    const borderColor = isCrit ? 'border-red-500/40 bg-red-950/20' : isWarn ? 'border-amber-500/40 bg-amber-950/20' : 'border-blue-500/40 bg-blue-950/20';
                    const tagColor = isCrit ? 'bg-red-500 text-white' : isWarn ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white';

                    return (
                      <div key={risk.id + index} className={`p-5 rounded-2xl border ${borderColor} transition-all`}>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className={isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-blue-400'} />
                            <h4 className="text-sm font-bold text-white font-mono">"{risk.phrase}"</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${tagColor}`}>
                              {risk.severity}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">Found {risk.count}x</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 mb-2">
                          <strong className="text-gray-400">Risk Assessment: </strong>{risk.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-nexus-emerald font-mono">
                          <strong>Negotiation Guidance: </strong>{risk.recommendation}
                        </div>

                        {risk.occurrences && risk.occurrences.length > 0 && (
                          <div className="mt-2 text-[11px] font-mono text-gray-400 italic">
                            Context: "{risk.occurrences[0].snippet}"
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 6: REDLINE DIFF (Myers LCS) */}
          {activeHudTab === 'diff' && auditResults.diff && (
            <div className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl liquid-glass-strong border border-white/5 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar bg-black/50">
                {auditResults.diff.segments.map((seg) => {
                  if (seg.type === 'added') {
                    return (
                      <span 
                        key={seg.id} 
                        className="bg-emerald-500/25 text-emerald-300 font-semibold px-1 py-0.5 mx-0.5 rounded border border-emerald-500/30"
                        title="Added in modified draft"
                      >
                        {seg.value}
                      </span>
                    );
                  }
                  if (seg.type === 'removed') {
                    return (
                      <span 
                        key={seg.id} 
                        className="bg-red-500/25 text-red-300 line-through px-1 py-0.5 mx-0.5 rounded border border-red-500/30 opacity-75"
                        title="Removed from original draft"
                      >
                        {seg.value}
                      </span>
                    );
                  }
                  return <span key={seg.id} className="text-gray-300">{seg.value}</span>;
                })}
              </div>

              {/* Clause Breakdown */}
              {auditResults.diff.clauseDiffs && (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-mono uppercase text-gray-400 font-bold mb-2">
                    Clause-by-Clause Modifications ({auditResults.diff.clauseDiffs.length} Clauses)
                  </h4>
                  {auditResults.diff.clauseDiffs.map((clause) => {
                    const badge = clause.status === 'modified' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  clause.status === 'inserted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                  clause.status === 'deleted' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/5 text-gray-400 border-white/10';

                    return (
                      <div key={clause.index} className="p-3.5 rounded-xl liquid-glass border border-white/5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-300">Clause / Paragraph #{clause.index}</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badge}`}>
                            {clause.status}
                          </span>
                        </div>

                        <div className="font-mono text-xs leading-relaxed text-gray-300">
                          {clause.diff ? clause.diff.map((d, dIdx) => (
                            <span key={dIdx} className={d.type === 'added' ? 'bg-emerald-500/20 text-emerald-300 font-bold px-0.5' : d.type === 'removed' ? 'bg-red-500/20 text-red-300 line-through px-0.5' : ''}>
                              {d.value}
                            </span>
                          )) : (
                            <span>{clause.text}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. SMART PII REDACTOR VIEW (Toggleable Rules + Live Counts + Mask Styles)
// =========================================================================
function PIIRedactorView({ onOpenHistory }) {
  const [text, setText] = useState('');
  const [activeRuleIds, setActiveRuleIds] = useState(['ssn', 'creditCard', 'bankAccount', 'email', 'phone', 'ip', 'ein']);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [maskStyle, setMaskStyle] = useState('block'); // 'block' | 'label' | 'asterisk'
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [sanitizedResult, setSanitizedResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  const toggleRule = (id) => {
    setActiveRuleIds(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = customKeywordInput.trim();
      if (val && !customKeywords.includes(val)) {
        setCustomKeywords([...customKeywords, val]);
        setCustomKeywordInput('');
      }
    }
  };

  const removeKeyword = (kw) => {
    setCustomKeywords(customKeywords.filter(k => k !== kw));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const txt = await file.text();
        setText(txt);
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } else if (file.name.toLowerCase().endsWith('.pdf')) {
        const pdfResult = await extractTextFromPDF(file);
        setText(pdfResult.fullText);
      } else {
        alert("Please upload a .txt, .docx, or .pdf file.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };

  const handleExecuteRedaction = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);

    try {
      // Execute 100% in-memory PII sanitization
      const result = sanitizeDocumentPII(text, activeRuleIds, customKeywords, maskStyle);

      // Save audit log to local IndexedDB
      await saveRedactionLog({
        title: 'PII Sanitization Job',
        totalRedactions: result.totalRedactions,
        ruleCounts: result.ruleCounts,
        detectedEntities: result.detectedEntities
      });

      setSanitizedResult(result);
      setSaveStatus('Audit log saved in IndexedDB');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      alert("Redaction error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSanitized = () => {
    if (!sanitizedResult?.sanitizedText) return;
    const blob = new Blob([sanitizedResult.sanitizedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sanitized_Document_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-3">
          <span>Air-Gapped Smart PII Redactor</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Confidentiality Safe
          </span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          Irreversibly sanitize Social Security numbers, payment cards, banking info, and confidential names in-memory before sharing documents.
        </p>
      </div>

      {/* Rules Selector Bar */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Active Detection Rules:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Masking Style:</span>
            <select
              value={maskStyle}
              onChange={(e) => setMaskStyle(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-nexus-emerald"
            >
              <option value="block">Black Block (█████)</option>
              <option value="label">Descriptive Tag ([REDACTED-SSN])</option>
              <option value="asterisk">Asterisks (*********)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PII_RULES.map(rule => {
            const active = activeRuleIds.includes(rule.id);
            return (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${active ? 'bg-nexus-emerald/20 text-nexus-emerald border border-nexus-emerald/40 shadow-[0_0_10px_rgba(0,255,157,0.1)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}
              >
                {active ? <CheckCircle2 size={13} /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                {rule.label}
              </button>
            );
          })}
        </div>

        {/* Custom Keywords Tag Field */}
        <div className="mt-2 pt-3 border-t border-white/5 flex flex-col gap-2">
          <label className="text-xs text-gray-400 font-medium">Add Confidential Parties, Client Names, or Custom Keywords:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customKeywordInput}
              onChange={(e) => setCustomKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="e.g. Acme Corporation, John Doe, Project Falcon (Press Enter)"
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-nexus-cyan"
            />
            <button
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
            >
              Add Tag
            </button>
          </div>

          {customKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {customKeywords.map(kw => (
                <span key={kw} className="px-2.5 py-1 rounded-lg bg-nexus-cyan/15 border border-nexus-cyan/30 text-nexus-cyan text-xs font-mono flex items-center gap-1.5">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="text-nexus-cyan hover:text-white"><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[360px]">
        {/* Left: Input Text */}
        <div className="flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
          <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 font-mono">INPUT TEXT (Unredacted)</span>
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300 transition-colors">
              Upload (.docx/.txt/.pdf)
              <input type="file" accept=".txt,.docx,.md,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract or memo text containing confidential information to redact..."
            className="flex-1 bg-black/40 p-4 text-xs font-mono leading-relaxed text-gray-200 outline-none resize-none focus:bg-black/60 custom-scrollbar"
          />
        </div>

        {/* Right: Sanitized Preview */}
        <div className="flex flex-col rounded-2xl liquid-glass-strong border border-white/5 overflow-hidden">
          <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-nexus-emerald font-mono">
              SANITIZED PREVIEW {sanitizedResult ? `(${sanitizedResult.totalRedactions} items redacted)` : ''}
            </span>
            {sanitizedResult && (
              <button
                onClick={handleDownloadSanitized}
                className="bg-nexus-emerald text-black px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-white transition-colors flex items-center gap-1"
              >
                <Download size={12} /> Download
              </button>
            )}
          </div>
          <div className="flex-1 bg-black/40 p-4 text-xs font-mono leading-relaxed text-gray-200 overflow-y-auto custom-scrollbar select-text">
            {sanitizedResult ? (
              <pre className="whitespace-pre-wrap font-mono">{sanitizedResult.sanitizedText}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                <EyeOff size={32} className="opacity-40" />
                <p>Click "Sanitize Document" to preview redacted text.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-2xl liquid-glass border border-white/5">
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-mono text-nexus-emerald flex items-center gap-1">
              <Check size={14} /> {saveStatus}
            </span>
          )}
        </div>

        <button
          onClick={handleExecuteRedaction}
          disabled={isProcessing || !text.trim()}
          className="px-8 py-3.5 bg-nexus-emerald text-black font-extrabold text-sm rounded-xl hover:bg-white transition-all flex items-center gap-2 disabled:opacity-40 shadow-[0_0_20px_rgba(0,255,157,0.25)]"
        >
          {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <EyeOff size={16} />}
          {isProcessing ? 'Sanitizing...' : 'Sanitize Document (Zero-Latency)'}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 3. BATES STAMPING SUITE VIEW (Sequential PDFs + Contrast Pill + Manifest)
// =========================================================================
function BatesStamperView({ onOpenHistory }) {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('EX-');
  const [startNum, setStartNum] = useState(1);
  const [padLength, setPadLength] = useState(4);
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState('black');
  const [drawPill, setDrawPill] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lastBundle, setLastBundle] = useState(null);

  const handleAddFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const moveFile = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const copy = [...files];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setFiles(copy);
  };

  const handleProcessPdfs = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: 0 });

    try {
      const bundle = await executeBatesStamping(files, {
        prefix,
        startNumber: startNum,
        padLength,
        position,
        fontSize,
        color,
        drawPill,
        onProgress: (current, total) => setProgress({ current, total })
      });

      // Save job in IndexedDB
      await saveBatesJob({
        prefix,
        startNum,
        totalPages: bundle.totalPages,
        batesRange: bundle.batesRange,
        manifest: bundle.manifest
      });

      setLastBundle(bundle);
      bundle.download();
    } catch (err) {
      console.error(err);
      alert("Error during Bates Stamping: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-3">
          <span>Enterprise Bates Stamping & Binder</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/30">
            pdf-lib Native
          </span>
        </h2>
        <p className="text-gray-400 text-xs mt-1">
          Sequentially number trial exhibits and production binders locally. High-contrast backing pill ensures readability on dark scans.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="p-6 rounded-2xl liquid-glass-strong border border-white/5 flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Bates Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-nexus-emerald outline-none font-mono"
              placeholder="e.g. PLTF-, CONF-"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Start Number</label>
            <input
              type="number"
              min="1"
              value={startNum}
              onChange={(e) => setStartNum(Number(e.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-nexus-emerald outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Digit Padding</label>
            <select
              value={padLength}
              onChange={(e) => setPadLength(Number(e.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-nexus-emerald outline-none"
            >
              <option value={3}>3 Digits (e.g. 001)</option>
              <option value={4}>4 Digits (e.g. 0001)</option>
              <option value={5}>5 Digits (e.g. 00001)</option>
              <option value={6}>6 Digits (e.g. 000001)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Stamp Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-nexus-emerald outline-none"
            >
              <option value="bottom-right">Bottom Right (Standard)</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-center">Top Center</option>
              <option value="top-left">Top Left</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-white/5 items-center">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-nexus-emerald outline-none"
            >
              <option value={8}>8 pt (Compact)</option>
              <option value={9}>9 pt</option>
              <option value={10}>10 pt (Default)</option>
              <option value={11}>11 pt</option>
              <option value={12}>12 pt (Prominent)</option>
              <option value={14}>14 pt (Large)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Ink Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-nexus-emerald outline-none"
            >
              <option value="black">Black Ink</option>
              <option value="red">Red Ink (Urgent/Confidential)</option>
              <option value="blue">Blue Ink (Official Seal)</option>
              <option value="white">White Ink</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <label className="cursor-pointer flex items-center gap-2 text-xs text-gray-300 select-none">
              <input
                type="checkbox"
                checked={drawPill}
                onChange={(e) => setDrawPill(e.target.checked)}
                className="w-4 h-4 accent-nexus-emerald rounded bg-black/60 border-white/10"
              />
              <span className="font-medium">Draw High-Contrast Backing Pill</span>
            </label>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-white/10 hover:border-nexus-emerald/40 rounded-2xl p-8 flex flex-col items-center justify-center bg-black/20 hover:bg-black/40 transition-all relative cursor-pointer">
        <Layers className="text-nexus-emerald mb-3" size={40} />
        <p className="font-bold text-sm text-white">Drop Exhibit PDFs Here</p>
        <p className="text-xs text-gray-500 mb-4">Click to browse multiple documents for sequential stamping</p>
        <input type="file" multiple accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddFiles} />
        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-300">
          Browse PDF Files
        </span>
      </div>

      {/* Selected Files List & Reorder */}
      {files.length > 0 && (
        <div className="p-4 rounded-2xl liquid-glass border border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-300">Stamping Queue ({files.length} documents)</span>
            <span className="text-[11px] font-mono text-gray-500">Preview: {prefix}{String(startNum).padStart(padLength, '0')}</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                <span className="truncate max-w-[340px] text-gray-200">
                  {idx + 1}. {f.name} ({(f.size / 1024).toFixed(0)} KB)
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-20 text-[10px]">▲</button>
                  <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-20 text-[10px]">▼</button>
                  <button onClick={() => removeFile(idx)} className="p-1 text-red-400 hover:text-red-300 ml-2"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress & Submit */}
      <div className="p-4 rounded-2xl liquid-glass border border-white/5 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {isProcessing ? (
            <span className="text-nexus-cyan font-mono animate-pulse">
              Stamping in progress: {progress.current} pages written...
            </span>
          ) : lastBundle ? (
            <span className="text-nexus-emerald font-mono">
              Completed! Range: {lastBundle.batesRange} ({lastBundle.totalPages} pages)
            </span>
          ) : (
            <span>Ready to process. All stamping happens locally in RAM.</span>
          )}
        </div>

        <button
          onClick={handleProcessPdfs}
          disabled={isProcessing || files.length === 0}
          className="px-8 py-3.5 bg-nexus-emerald text-black font-extrabold text-sm rounded-xl hover:bg-white transition-all flex items-center gap-2 disabled:opacity-40 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
        >
          {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
          {isProcessing ? 'Stamping...' : 'Merge, Stamp & Download Bundle'}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 4. AUDIT VAULT & PERSISTENCE VIEW (IndexedDB Sessions)
// =========================================================================
function AuditVaultView({ onSelectDiff }) {
  const [diffSessions, setDiffSessions] = useState([]);
  const [redactionLogs, setRedactionLogs] = useState([]);
  const [batesJobs, setBatesJobs] = useState([]);
  const [activeSection, setActiveSection] = useState('diffs'); // 'diffs' | 'redacts' | 'bates'

  const refreshData = async () => {
    try {
      const [diffs, redacts, bates] = await Promise.all([
        getAllDiffSessions(),
        getAllRedactionLogs(),
        getAllBatesJobs()
      ]);
      setDiffSessions(diffs);
      setRedactionLogs(redacts);
      setBatesJobs(bates);
    } catch (err) {
      console.error('Error fetching IndexedDB records:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteDiff = async (id) => {
    await deleteDiffSession(id);
    refreshData();
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear all locally stored sessions and audit logs? This cannot be undone.")) {
      await clearAllLocalData();
      refreshData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif text-white flex items-center gap-3">
            <span>Air-Gapped Audit Vault</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-nexus-emerald/10 text-nexus-emerald border border-nexus-emerald/30">
              IndexedDB Storage
            </span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            All audits, diff sessions, and redaction records are retained 100% locally in your browser sandbox. Survives tab refresh without cloud syncing.
          </p>
        </div>

        <button
          onClick={handleClearAll}
          className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold text-red-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={14} /> Clear Local Vault
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('diffs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === 'diffs' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Saved Audits ({diffSessions.length})
        </button>
        <button
          onClick={() => setActiveSection('redacts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === 'redacts' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Redaction Logs ({redactionLogs.length})
        </button>
        <button
          onClick={() => setActiveSection('bates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === 'bates' ? 'bg-nexus-emerald text-black' : 'text-gray-400 hover:text-white'}`}
        >
          Bates Jobs ({batesJobs.length})
        </button>
      </div>

      {/* Section Content */}
      <div className="p-4 rounded-2xl liquid-glass-strong border border-white/5 flex-1 overflow-y-auto custom-scrollbar">
        {activeSection === 'diffs' && (
          <div className="space-y-3">
            {diffSessions.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-8">No saved diff sessions yet. Run an audit to record history.</p>
            ) : (
              diffSessions.map(session => (
                <div key={session.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{session.title}</h4>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">
                      {new Date(session.updatedAt).toLocaleString()} | +{session.stats?.additions || 0} / -{session.stats?.deletions || 0} words | {session.risksCount || 0} liabilities {typeof session.overallRiskScore === 'number' ? `| Score: ${session.overallRiskScore}/100` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDiff && onSelectDiff(session)}
                      className="px-3 py-1.5 text-xs font-semibold text-nexus-emerald hover:text-white bg-nexus-emerald/10 hover:bg-nexus-emerald/20 border border-nexus-emerald/30 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Open / Restore Session"
                    >
                      <RotateCcw size={13} /> Open Session
                    </button>
                    <button
                      onClick={() => handleDeleteDiff(session.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded bg-red-500/10"
                      title="Delete Session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'redacts' && (
          <div className="space-y-3">
            {redactionLogs.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-8">No redaction logs recorded.</p>
            ) : (
              redactionLogs.map(log => (
                <div key={log.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{log.title}</h4>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">
                      {new Date(log.createdAt).toLocaleString()} | Total Redactions: {log.totalRedactions} items
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === 'bates' && (
          <div className="space-y-3">
            {batesJobs.length === 0 ? (
              <p className="text-center text-gray-500 text-xs py-8">No Bates stamping jobs recorded.</p>
            ) : (
              batesJobs.map(job => (
                <div key={job.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Range: {job.batesRange}</h4>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">
                      {new Date(job.createdAt).toLocaleString()} | {job.totalPages} pages stamped
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
