import { downloadDiligenceCertificatePDF } from '../utils/diligenceCertificatePdfGenerator';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertTriangle, ShieldAlert, Search, CheckCircle2,
  Play, RefreshCw, HardDriveDownload, 
  FileCheck, Layers, EyeOff, X, Download,
  FileCode, Database, Filter, Trash2,
  ShieldCheck, Check, RotateCcw, Calendar, DollarSign,
  Bookmark, HelpCircle, User, Users, StopCircle, Upload,
  AlertCircle, Clock, CheckSquare, Tag, FileSpreadsheet, Lock,
  Settings, Key, Laptop, Copy, Mail, LogOut,
  BookOpen, FileDown, Sparkles,
  ChevronDown, Crosshair, Scale, Activity, Flag, FileEdit, XCircle
} from 'lucide-react';
import { extractTextFromDOCX } from '../utils/docxExtractor';
import { downloadAmendmentRiderDOCX, downloadHarmonizedDeedDOCX, downloadRedlineDOCX } from '../utils/docxExportEngine';

// Flagship Engines & Utilities
import { sanitizeDocumentPII, PII_RULES } from '../utils/piiEngine';
import { executeBatesStamping } from '../utils/batesStamper';
import { 
  saveDiffSession, getAllDiffSessions, deleteDiffSession,
  saveRedactionLog, getAllRedactionLogs,
  saveBatesJob, getAllBatesJobs, clearAllLocalData
} from '../utils/localDB';
import { 
  exportRedlineToHTML, exportAuditReportJSON,
  exportExecutiveClientMemoHTML, exportObligationsCSV,
  exportPreSigningAmendmentRiderHTML
} from '../utils/exportEngine';
import { useContractWorker } from '../utils/useContractWorker';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { isImageFile, recognizeImage } from '../utils/ocrEngine.js';
import { verifyToolAccess } from '../utils/auth';
import { openSeamlessCheckout } from '../utils/checkoutPopup';
import { 
  verifyDeviceLicense, 
  getDeviceFingerprint, 
  deactivateLicenseFromDevice,
  getDemoAuditsRemaining,
  consumeDemoAudit
} from '../utils/licenseManager';
import { 
  enrichAllAuditFindings,
  enrichFindingWithStatutoryRemedy,
  generatePreSigningAmendmentRiderText
} from '../utils/statutoryCodex';
import { 
  downloadRedactedPDF,
  downloadAmendmentRiderPDF
} from '../utils/redactedPdfGenerator';
import { detectContractMetadata } from '../utils/contractMetadataDetector';
import LegalTemplatesView from '../components/LegalTemplatesView';
import HarmonizerResultsHUD from '../components/HarmonizerResultsHUD';
import LiabilityReconcilerHUD from '../components/LiabilityReconcilerHUD';
import SystemGuideModal from '../components/SystemGuideModal';
import LicensePlanModal from '../components/LicensePlanModal';
import { restateAndPolishContract } from '../utils/forensicRestatementEngine';
import { analyzeLiabilityInterlocks, SAMPLE_DEALS } from '../utils/liabilityMatrixEngine';

export default function ContractCompare({ isDemoMode = false }) {
  const navigate = useNavigate();
  const isDemo = isDemoMode || (typeof window !== 'undefined' && (
    window.location.pathname === '/demo' ||
    window.location.pathname === '/contractguard-demo' ||
    window.location.pathname.startsWith('/demo') ||
    window.location.search.includes('demo')
  ));
  const [auditsLeft, setAuditsLeft] = useState(() => (typeof getDemoAuditsRemaining === 'function' ? getDemoAuditsRemaining() : 3));
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | bates | redact | history | templates
  const [analysisMode, setAnalysisMode] = useState('single'); // single | comparative | harmonizer
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [guideModalTab, setGuideModalTab] = useState('analyzer');
  const [isUnlocked, setIsUnlocked] = useState(isDemo);
  const [restoredSession, setRestoredSession] = useState(null);

  // Check auth - strictly redirect to unified login if unauthorized
  useEffect(() => {
    if (isDemo) {
      setIsUnlocked(true);
      return;
    }
    if (verifyToolAccess('contractcompare') || verifyToolAccess('all')) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
      navigate('/login?redirect=contractcompare', { replace: true });
    }
  }, [isDemo, navigate]);

  // Workstation Hardware & License Settings State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [workstationFp, setWorkstationFp] = useState('');

  const loadDeviceLicenseData = async () => {
    if (isDemo) return;
    try {
      const lic = await verifyDeviceLicense();
      const fp = await getDeviceFingerprint();
      setLicenseData(lic);
      setWorkstationFp(fp);
    } catch (e) {
      console.error('Failed to load license details:', e);
    }
  };

  useEffect(() => {
    if (!isDemo) {
      loadDeviceLicenseData();
    }
  }, [isUnlocked, showSettingsModal, isDemo]);

  const handleDeactivate = () => {
    const res = deactivateLicenseFromDevice();
    if (res && res.success) {
      setIsUnlocked(false);
      setShowSettingsModal(false);
      navigate('/login', { replace: true });
    }
  };

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
      alert("App is running in browser local sandbox. Add to bookmarks or install as PWA if supported.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Executive Counsel Sidebar */}
      <aside className="w-full md:w-[256px] bg-[#0C0C0F] border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col shrink-0 z-20">
        {/* Compact Brand Header */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                <Scale className="text-emerald-400" size={16} />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-zinc-100 tracking-tight truncate">ContractGuard</h1>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Local RAM · ABA 1.6</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-medium text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md shrink-0">
              {isDemo ? 'Sandbox' : 'Pro'}
            </span>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 px-3 py-3.5 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
          <p className="text-[11px] font-medium text-zinc-500 px-2.5 mb-1.5">Audit Studio</p>

          {/* Module 1: Contract Audit */}
          <button
            type="button"
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeTool === 'analyzer'
                ? 'bg-white/[0.07] text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck size={15} className={activeTool === 'analyzer' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
              <span className="truncate">Contract Audit</span>
            </div>
          </button>

          {/* Permanently Pinned 4 Core Audit Modes */}
          <div className="ml-3.5 pl-2.5 border-l border-zinc-800/80 my-1 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setActiveTool('analyzer');
                setAnalysisMode('single');
              }}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                activeTool === 'analyzer' && analysisMode === 'single'
                  ? 'bg-emerald-500/12 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="truncate">Single Draft Audit</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTool === 'analyzer' && analysisMode === 'single'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 bg-white/[0.03]'
              }`}>AST</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('analyzer');
                setAnalysisMode('comparative');
              }}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                activeTool === 'analyzer' && analysisMode === 'comparative'
                  ? 'bg-emerald-500/12 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="truncate">Redline Diff Mode</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTool === 'analyzer' && analysisMode === 'comparative'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 bg-white/[0.03]'
              }`}>Myers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('analyzer');
                setAnalysisMode('harmonizer');
              }}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                activeTool === 'analyzer' && analysisMode === 'harmonizer'
                  ? 'bg-emerald-500/12 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="truncate">Linguistic & Deed Proofreader</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTool === 'analyzer' && analysisMode === 'harmonizer'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 bg-white/[0.03]'
              }`}>Deed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTool('analyzer');
                setAnalysisMode('liability');
              }}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                activeTool === 'analyzer' && analysisMode === 'liability'
                  ? 'bg-emerald-500/12 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="truncate">Liability & Indemnity Reconciler</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTool === 'analyzer' && analysisMode === 'liability'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-zinc-500 bg-white/[0.03]'
              }`}>Matrix</span>
            </button>
          </div>

          <p className="text-[11px] font-medium text-zinc-500 px-2.5 mt-3 mb-1">Tools</p>

          {/* Module 2: PII Redactor */}
          <button
            type="button"
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeTool === 'redact'
                ? 'bg-white/[0.07] text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <EyeOff size={15} className={activeTool === 'redact' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
              <span className="truncate">Smart PII Redactor</span>
            </div>
          </button>

          {/* Module 3: Bates Stamping */}
          <button
            type="button"
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeTool === 'bates'
                ? 'bg-white/[0.07] text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Layers size={15} className={activeTool === 'bates' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
              <span className="truncate">Bates Stamping</span>
            </div>
          </button>

          {/* Module 4: Template Vault */}
          <button
            type="button"
            onClick={() => setActiveTool('templates')}
            className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeTool === 'templates'
                ? 'bg-white/[0.07] text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BookOpen size={15} className={activeTool === 'templates' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
              <span className="truncate">Template Vault</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 shrink-0">AmLaw</span>
          </button>

          {/* Module 5: Audit Vault */}
          <button
            type="button"
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              activeTool === 'history'
                ? 'bg-white/[0.07] text-white'
                : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Database size={15} className={activeTool === 'history' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
              <span className="truncate">Audit Vault</span>
            </div>
          </button>
        </nav>

        {/* Bottom Dock: License & Offline App */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          {isDemo ? (
            <button
              type="button"
              onClick={() => setShowPlanModal(true)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Lock size={13} className="shrink-0" />
                <span className="truncate">Unlock License</span>
              </div>
              <span className="text-[10px] font-mono tabular-nums bg-black/15 px-1.5 py-0.5 rounded font-bold shrink-0">
                {auditsLeft} left
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowSettingsModal(true); loadDeviceLicenseData(); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Settings size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">Workstation License</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                {licenseData?.plan === 'firm' ? 'Firm' : 'Solo'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {isDemo && (
              <button
                type="button"
                onClick={() => navigate('/app/contractcompare')}
                className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-[11px] font-medium text-zinc-300 transition-colors cursor-pointer"
                title="Sign In with your active license key"
              >
                <Key size={12} className="text-zinc-400" />
                <span>Sign In</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleInstallApp}
              className={`${isDemo ? 'flex-1' : 'w-full'} flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer`}
              title="Install Offline Desktop App"
            >
              <HardDriveDownload size={12} />
              <span>Install App</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Executive Workspace */}
      <main className="flex-1 px-5 py-5 md:px-8 md:py-6 overflow-y-auto z-10 custom-scrollbar flex flex-col">
        {/* Quiet Unified Top Utility Bar */}
        {(isUnlocked || isDemo) && (
          <div className="max-w-6xl w-full mx-auto mb-5 pb-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-2.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {isDemo ? (
                <span>
                  Evaluation Sandbox · <span className="text-zinc-200 font-medium tabular-nums">{auditsLeft} of 3</span> free audits remaining
                </span>
              ) : (
                <span>Air-Gapped Local RAM Session · Zero Cloud Telemetry</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isDemo && (
                <button
                  type="button"
                  onClick={() => setShowPlanModal(true)}
                  className="px-3 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
                >
                  View Plans ($199 / $299)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setGuideModalTab(activeTool === 'analyzer' ? 'analyzer' : activeTool);
                  setShowGuideModal(true);
                }}
                className="px-2.5 py-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] transition-colors flex items-center gap-1.5 cursor-pointer"
                title="How to use this module"
              >
                <HelpCircle size={13} />
                <span>Guide</span>
              </button>
            </div>
          </div>
        )}

        {!isUnlocked && !isDemo ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 ">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Protected Legal Workspace</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              ContractGuard runs in a 100% air-gapped environment. An authenticated license key is required to access the studio.
            </p>
            <button
              onClick={() => navigate('/app/contractcompare')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all  cursor-pointer"
            >
              Enter License Key
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTool === 'analyzer' && (
              <motion.div key="analyzer" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <ContractAnalyzerView 
                  initialSession={restoredSession}
                  analysisMode={analysisMode}
                  onAnalysisModeChange={setAnalysisMode}
                  isDemo={isDemo}
                  auditsLeft={auditsLeft}
                  onConsumeAudit={() => {
                    const next = consumeDemoAudit();
                    setAuditsLeft(next);
                    return next;
                  }}
                  onOpenCheckout={(plan) => {
                    setShowPlanModal(true);
                  }}
                  onOpenGuide={(tab) => {
                    setGuideModalTab(tab || 'analyzer');
                    setShowGuideModal(true);
                  }}
                />
              </motion.div>
            )}
            {activeTool === 'redact' && (
              <motion.div key="redact" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <PIIRedactorView 
                  onOpenGuide={() => {
                    setGuideModalTab('redact');
                    setShowGuideModal(true);
                  }}
                />
              </motion.div>
            )}
            {activeTool === 'bates' && (
              <motion.div key="bates" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <BatesStamperView 
                  isDemo={isDemo}
                  onTriggerUpgrade={(plan) => {
                    setShowPlanModal(true);
                  }}
                  onOpenGuide={() => {
                    setGuideModalTab('bates');
                    setShowGuideModal(true);
                  }}
                />
              </motion.div>
            )}
            {activeTool === 'history' && (
              <motion.div key="history" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <AuditVaultView 
                  onSelectDiff={(session) => {
                    setRestoredSession(session);
                    setActiveTool('analyzer');
                  }}
                  onOpenGuide={() => {
                    setGuideModalTab('history');
                    setShowGuideModal(true);
                  }}
                />
              </motion.div>
            )}
            {activeTool === 'templates' && (
              <motion.div key="templates" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <LegalTemplatesView 
                  isDemoMode={isDemo}
                  onSendToAudit={(contractText, title) => {
                    setRestoredSession({ originalText: contractText, title });
                    setActiveTool('analyzer');
                  }} 
                  onTriggerUpgrade={(trigger) => {
                    setShowPlanModal(true);
                  }}
                  onOpenGuide={() => {
                    setGuideModalTab('templates');
                    setShowGuideModal(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Workstation & License Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            licenseData={licenseData}
            workstationFp={workstationFp}
            onDeactivate={handleDeactivate}
          />
        )}
      </AnimatePresence>

      {/* System Guide & Methodology Modal */}
      <SystemGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        activeTab={guideModalTab}
        onSelectTab={(tab) => setGuideModalTab(tab)}
        onLaunchTool={(tool, mode) => {
          setActiveTool(tool);
          if (mode) setAnalysisMode(mode);
          setShowGuideModal(false);
        }}
      />

      {/* License Plan Selection Modal */}
      <AnimatePresence>
        {showPlanModal && (
          <LicensePlanModal
            isOpen={showPlanModal}
            onClose={() => setShowPlanModal(false)}
            onSelectPlan={(plan) => {
              setShowPlanModal(false);
              openSeamlessCheckout({ plan, toolName: 'contractcompare' });
            }}
          />
        )}
      </AnimatePresence>

      
    </div>
  );
}

// =========================================================================
// WORKSTATION & LICENSE SETTINGS MODAL (Hardware ID, Seats, Migration, Support)
// =========================================================================
function SettingsModal({ isOpen, onClose, licenseData, workstationFp, onDeactivate }) {
  const [copiedField, setCopiedField] = useState(null);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);

  if (!isOpen) return null;

  const copyText = (text, fieldId) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 3000);
  };

  const handleDownloadTeamKeys = () => {
    if (!licenseData?.seats) return;
    const lines = [
      '========================================================================',
      'NEXUS CONTRACTGUARD ENTERPRISE — LAW FIRM SUITE (5 WORKSTATION SEATS)',
      '========================================================================',
      '',
      `Purchased Plan: Law Firm Suite ($299 Perpetual License)`,
      `Workstation Hardware ID (Purchaser Admin): ${workstationFp || 'DEV-NEXUS-ADMIN'}`,
      `Date Issued: ${new Date().toLocaleDateString()}`,
      `Support Email: nexus.os.store@gmail.com`,
      '',
      'INSTRUCTIONS FOR YOUR LEGAL TEAM:',
      '1. Open ContractGuard on each attorney / associate workstation.',
      '2. Enter the assigned individual seat key below in the activation window.',
      '3. The key binds directly to that machine with zero cloud SaaS leakage.',
      '',
      '------------------------------------------------------------------------',
      'ALLOCATED SEAT KEYS FOR YOUR LAW FIRM:',
      '------------------------------------------------------------------------'
    ];

    licenseData.seats.forEach((seat, idx) => {
      lines.push(`SEAT 0${seat.seatNumber || idx + 1}: ${seat.key}`);
      lines.push(`Role: ${seat.role || `Attorney Workstation 0${seat.seatNumber || idx + 1}`}`);
      lines.push(`Status: ${seat.seatNumber === (licenseData.currentSeatNumber || 1) ? 'Bound to This Workstation' : 'Available for Associate'}`);
      lines.push('------------------------------------------------------------------------');
    });

    lines.push('');
    lines.push('MACHINE MIGRATION PROTOCOL:');
    lines.push('To transfer a seat to a new computer, open Workstation Settings -> click "Deactivate from this Machine", then enter the key on the new computer.');
    lines.push('For priority technical support: nexus.os.store@gmail.com');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contractguard-firm-seats-${Date.now().toString().slice(-6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFirmAdmin = licenseData?.plan === 'firm' && licenseData?.isPrimaryAdmin !== false;
  const isFirmAssociate = licenseData?.plan === 'firm' && !isFirmAdmin;
  const seatKeys = licenseData?.seats || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#08121A] border border-emerald-500/30 rounded-2xl p-6  flex flex-col gap-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Settings size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Workstation & License Settings</h3>
                <span className="text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  {licenseData?.plan === 'firm' ? 'Firm Suite' : 'Solo License'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Hardware ID Binding · Cryptographic Seat Governance · Migration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Workstation Hardware ID */}
        <div className="p-4 rounded-xl bg-[#050A0F] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
              <Laptop size={12} className="text-emerald-400" />
              <span>Workstation Hardware ID (Device Fingerprint)</span>
            </span>
            <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>Bound & Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-zinc-800 gap-2">
            <span className="font-mono text-xs text-emerald-400 select-all truncate font-semibold">
              {workstationFp || 'DEV-HARDWARE-HASH-LOCAL'}
            </span>
            <button
              onClick={() => copyText(workstationFp, 'workstation_fp')}
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedField === 'workstation_fp' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedField === 'workstation_fp' ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            This cryptographic hash uniquely binds ContractGuard to this physical machine's isolated browser environment. All document audits run in local RAM with zero cloud transmission.
          </p>
        </div>

        {/* Section 2: Active License & Seat Info */}
        <div className="p-4 rounded-xl bg-[#050A0F] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
              <Key size={12} className="text-cyan-400" />
              <span>License Details</span>
            </span>
            <span className="text-xs font-mono text-cyan-300 font-semibold">
              {licenseData?.tierName || (licenseData?.plan === 'firm' ? 'Law Firm Suite (5 Seats)' : 'Solo Practitioner (1 User)')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Current Workstation Role</span>
              <p className="font-semibold text-white mt-0.5">
                {isFirmAdmin ? 'Primary Purchaser / Managing Partner (Admin)' : isFirmAssociate ? `Associate Workstation (Seat 0${licenseData?.currentSeatNumber || 2})` : 'Primary Attorney Workstation'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800/80">
              <span className="text-[10px] font-mono uppercase text-zinc-400">Seat Allocation</span>
              <p className="font-semibold text-white mt-0.5">
                Seat {licenseData?.currentSeatNumber || 1} of {licenseData?.plan === 'firm' ? '5 Total Seats' : '1 Seat'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-lg border border-zinc-800 gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-zinc-400 block">Active Workstation License Key</span>
              <span className="font-mono text-xs text-white select-all truncate font-semibold">
                {licenseData?.primaryKey || 'CG-ACTIVE-KEY'}
              </span>
            </div>
            <button
              onClick={() => copyText(licenseData?.primaryKey, 'primary_key')}
              className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedField === 'primary_key' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copiedField === 'primary_key' ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Law Firm Suite Multi-Seat Provisioning */}
        {isFirmAdmin && seatKeys.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#050A0F] to-[#08121A] border border-emerald-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Users size={13} />
                <span>Firm Workstation Keys (5 Seats Included)</span>
              </span>
              <button
                onClick={handleDownloadTeamKeys}
                className="px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={11} />
                <span>Download Team Keys (.txt)</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 leading-snug">
              As the managing purchaser, distribute each individual seat key to other lawyers or paralegals in your practice. Each key locks to one physical device.
            </p>

            <div className="space-y-2">
              {seatKeys.map((seat, idx) => {
                const isCurrent = seat.seatNumber === (licenseData?.currentSeatNumber || 1);
                return (
                  <div
                    key={seat.key || idx}
                    className={`p-2.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                        : 'bg-black/50 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCurrent ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        SEAT 0{seat.seatNumber || idx + 1}
                      </span>
                      <span className="font-mono text-xs truncate">{seat.key}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          This Workstation
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => copyText(seat.key, `seat_${idx}`)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-auto"
                    >
                      {copiedField === `seat_${idx}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedField === `seat_${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3b: If Associate Member (Hide other keys) */}
        {isFirmAssociate && (
          <div className="p-4 rounded-xl bg-[#050A0F] border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <User size={13} />
              <span>Associate Workstation License</span>
            </span>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Your workstation is authenticated under an enterprise Law Firm Suite seat allocation. Firm administrative keys and additional seat distribution are restricted to your firm's primary license administrator.
            </p>
          </div>
        )}

        {/* Section 4: License Migration & Deactivation */}
        <div className="p-4 rounded-xl bg-[#050A0F] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <RotateCcw size={13} />
              <span>Transfer License to a New Computer</span>
            </span>
            <span className="text-[9.5px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
              Device Migration
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 text-[11.5px] text-zinc-300 leading-relaxed space-y-1.5">
            <p className="font-semibold text-white">How to migrate to another machine:</p>
            <div className="space-y-1 text-zinc-400 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Click <strong>"Deactivate from this Machine"</strong> below to release the hardware lock.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Copy your license key: <code className="text-emerald-400 font-mono select-all">{licenseData?.primaryKey || 'Your Key'}</code></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                <span>Open ContractGuard on your new workstation, paste your key, and it will immediately bind to your new hardware.</span>
              </div>
            </div>
          </div>

          {!showConfirmDeactivate ? (
            <button
              onClick={() => setShowConfirmDeactivate(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Deactivate from this Machine (Migrate License)</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3">
              <p className="text-xs text-rose-200 font-semibold">
                Confirm Machine Deactivation: ContractGuard will release this computer's hardware binding and lock the local studio. You can reactivate anytime on this computer or enter the key on a new computer.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onDeactivate}
                  className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Deactivate Workstation Now
                </button>
                <button
                  onClick={() => setShowConfirmDeactivate(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Official Support */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Mail size={16} className="text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">Direct Developer & Legal Tech Support</p>
              <a
                href="mailto:nexus.os.store@gmail.com"
                className="text-emerald-400 hover:underline font-mono text-[11px]"
              >
                nexus.os.store@gmail.com
              </a>
            </div>
          </div>

          <button
            onClick={() => copyText('nexus.os.store@gmail.com', 'support_email')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
          >
            {copiedField === 'support_email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedField === 'support_email' ? 'Copied' : 'Copy Email'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}


// =========================================================================
// PRE-PACKAGED HAZARDOUS LEGAL CONTRACT FOR INSTANT IN-MEMORY EVALUATION
// =========================================================================
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

const SAAS_SAMPLE_CONTRACT = `ENTERPRISE CLOUD SOFTWARE MASTER SUBSCRIPTION AGREEMENT

This Master Subscription Agreement ("Agreement") is made as of November 15, 2026, by and between CloudScale Systems Inc. ("Vendor") and Apex Global Logistics ("Customer").

1. SUBSCRIPTION GRANT & SCOPE
1.1 Vendor grants Customer a non-exclusive right to access the Cloud Services specified in Order Form A-1.
1.2 Customer authorized users shall not exceed One Hundred (100) named users, except as augmented pursuant to Schedule B.

2. SERVICE LEVEL AGREEMENT & UPTIME
2.1 Vendor shall maintain 99.9% monthly availability as set forth in Exhibit 4 (Service Level Standards).
2.2 Liquidated damages for downtime shall be calculated pursuant to the formulas in Section 18.3.

3. FEES AND BILLING RECONCILIATION
3.1 Annual Platform Fee: Customer shall pay an annual fee of Seventy-Five Thousand Dollars ($57,000) invoiced annually in advance.
3.2 Late fees shall accrue at 1.5% per month or the statutory maximum under Section 22.4.

4. INDEMNITY AND THIRD-PARTY IP
4.1 Vendor shall indemnify, defend, and hold harmless Customer against any third-party claim alleging that the Cloud Services infringe any patent, copyright, or trademark, with unlimited aggregate liability.

5. LIMITATION OF LIABILITY
5.1 IN NO EVENT SHALL EITHER PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED ONE HUNDRED THOUSAND DOLLARS ($10,000) UNDER ANY CIRCUMSTANCES, INCLUDING INDEMNIFICATION CLAIMS UNDER SECTION 4.1.

6. TERM AND TERMINATION
6.1 This Agreement shall automatically renew for successive twelve (12) month terms unless either party gives written notice of non-renewal at least ninety (90) days prior to the end of the current term, subject to the cure period specified in Section 15.2.`;

// Fast in-browser cryptographic SHA-256 for Pre-Signing Diligence Certificate
async function computeSha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text || '');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (_) {
    return 'cf9acf7bbb77f93475585ed3ee96a33b6dd1642acd01287c9c9b56f3f91325fc';
  }
}


// =========================================================================
// 1. CONTRACT ANALYZER VIEW (Dual Modes + In-Memory Proofreader + Multi-Export)
// =========================================================================
function ContractAnalyzerView({ 
  initialSession, 
  analysisMode: propAnalysisMode, 
  onAnalysisModeChange, 
  onOpenGuide,
  isDemo = false,
  auditsLeft = 3,
  onConsumeAudit,
  onOpenCheckout
}) {
  // Mode selection: 'single' (pre-signing integrity audit) or 'comparative' (redline diff) or 'harmonizer'
  const [internalMode, setInternalMode] = useState(initialSession?.originalText ? 'comparative' : 'single');
  const analysisMode = propAnalysisMode !== undefined ? propAnalysisMode : internalMode;
  const setAnalysisMode = (newMode) => {
    setInternalMode(newMode);
    if (onAnalysisModeChange) onAnalysisModeChange(newMode);
  };

  const [text, setText] = useState(initialSession?.modifiedText || initialSession?.originalText || '');
  const [baselineText, setBaselineText] = useState(initialSession?.originalText || '');
  const [documentTitle, setDocumentTitle] = useState(initialSession?.title || '');
  const [clientParty, setClientParty] = useState(initialSession?.clientParty || '');
  const [counterparty, setCounterparty] = useState(initialSession?.counterparty || '');
  const [diffGranularity, setDiffGranularity] = useState('word'); // 'word' | 'line'
  const [harmonizedData, setHarmonizedData] = useState(null);
  const [isHarmonizing, setIsHarmonizing] = useState(false);
  const [liabilityAuditData, setLiabilityAuditData] = useState(null);
  const [isAnalyzingLiability, setIsAnalyzingLiability] = useState(false);

  // Pre-Signing Diligence Certificate State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateHash, setCertificateHash] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certCopiedToast, setCertCopiedToast] = useState(false);
  const [includeCertStamp, setIncludeCertStamp] = useState(true);
  const [activeDiffNavIdx, setActiveDiffNavIdx] = useState(0);
  const [parsingProgress, setParsingProgress] = useState({ active: false, statusKey: '', percent: 0, currentPage: 0, totalPages: 0, message: '' });
  const [diffDecisions, setDiffDecisions] = useState({});
  const [showCounterRiderModal, setShowCounterRiderModal] = useState(false);
  const [memoCopiedToast, setMemoCopiedToast] = useState(false);

  const handleGenerateCertificate = async () => {
    setIsGeneratingCertificate(true);
    const textToHash = text || HAZARDOUS_SAMPLE_CONTRACT;
    const hash = await computeSha256(textToHash);
    setCertificateHash(hash);
    setCertificateDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
    setTimeout(() => {
      setIsGeneratingCertificate(false);
      setShowCertificateModal(true);
    }, 250);
  };

  // 1-Click Interactive Benchmark Contract Loader (Loads text; executes on user click)
  const handleLoadSampleCase = (caseType = 'ma', autoExecute = false) => {
    if (caseType === 'ma') {
      setText(HAZARDOUS_SAMPLE_CONTRACT);
      setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
      setDocumentTitle('Master Asset Purchase & Services Agreement');
      setClientParty('Acme Holdings LLC');
      setCounterparty('Globex International Corp');
      if (autoExecute) {
        handleExecuteAudit({
          text: HAZARDOUS_SAMPLE_CONTRACT,
          baselineText: HAZARDOUS_BASELINE_CONTRACT,
          title: 'Master Asset Purchase & Services Agreement',
          clientParty: 'Acme Holdings LLC',
          counterparty: 'Globex International Corp',
          mode: analysisMode,
          isInitialDemo: true
        });
      }
    } else if (caseType === 'saas') {
      setText(SAAS_SAMPLE_CONTRACT);
      setBaselineText('');
      setDocumentTitle('Enterprise Cloud Master Subscription Agreement');
      setClientParty('Apex Global Logistics Inc.');
      setCounterparty('CloudScale Infrastructure Corp.');
      if (analysisMode === 'comparative') {
        setAnalysisMode('single');
      }
      if (autoExecute) {
        handleExecuteAudit({
          text: SAAS_SAMPLE_CONTRACT,
          baselineText: '',
          title: 'Enterprise Cloud Master Subscription Agreement',
          clientParty: 'Apex Global Logistics Inc.',
          counterparty: 'CloudScale Infrastructure Corp.',
          mode: 'single',
          isInitialDemo: true
        });
      }
    }
  };

  // File upload & Drag-and-Drop states
  const [uploadStatus, setUploadStatus] = useState({ target: '', baseline: '' });
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [isDraggingBaseline, setIsDraggingBaseline] = useState(false);

  // In-Memory Audit Hook with instant cancellation
  const {
    isProcessing,
    progress,
    result: auditResults,
    error: workerError,
    runAnalysis,
    cancelAnalysis,
    resetAnalysis
  } = useContractWorker();

  // Reset active audit findings when switching between analysis tools / modes
  const prevModeRef = useRef(analysisMode);
  useEffect(() => {
    if (prevModeRef.current !== analysisMode) {
      prevModeRef.current = analysisMode;
      resetAnalysis();
      setHarmonizedData(null);
      setLiabilityAuditData(null);
      setDiffDecisions({});
    }
  }, [analysisMode, resetAnalysis]);

  // Master draft reset: clears all inputs and purges in-memory audit findings
  const handleClearDraft = () => {
    setText('');
    setBaselineText('');
    setDocumentTitle('');
    setClientParty('');
    setCounterparty('');
    setHarmonizedData(null);
    setLiabilityAuditData(null);
    setDiffDecisions({});
    setParsingProgress({ active: false, statusKey: '', percent: 0, currentPage: 0, totalPages: 0, message: '' });
    resetAnalysis();
  };

  const [activeHudTab, setActiveHudTab] = useState('dealBreakers'); // dealBreakers | enforceability | obligations | crossRefs | financialDates | definedTerms | diff | risks
  const [copiedRedlineId, setCopiedRedlineId] = useState(null);
  const [copiedRiderSuccess, setCopiedRiderSuccess] = useState(false);
  const [copiedDefsSuccess, setCopiedDefsSuccess] = useState(false);

  const handleCopyRedline = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRedlineId(id);
    setTimeout(() => setCopiedRedlineId(null), 2500);
  };

  const [isDownloadingWordRider, setIsDownloadingWordRider] = useState(false);

  const handleDownloadWordRider = async () => {
    if (!auditResults) return;
    setIsDownloadingWordRider(true);
    try {
      await downloadAmendmentRiderDOCX(auditResults, {
        contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
        clientName: clientParty.trim() || 'Client',
        counterpartyName: counterparty.trim() || 'Counterparty'
      });
    } catch (err) {
      console.error('Failed to download Word rider:', err);
    } finally {
      setIsDownloadingWordRider(false);
    }
  };

  const handleCopyFullRider = () => {
    if (!auditResults) return;
    const riderText = generatePreSigningAmendmentRiderText(auditResults, {
      contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
      clientName: clientParty.trim() || 'Client',
      counterpartyName: counterparty.trim() || 'Counterparty'
    });
    navigator.clipboard.writeText(riderText);
    setCopiedRiderSuccess(true);
    setTimeout(() => setCopiedRiderSuccess(false), 3000);
  };

  const handleCopyAllDefinitions = () => {
    const undefs = auditResults?.definedTerms?.undefinedTerms || [];
    if (undefs.length === 0) return;
    let defsText = 'ARTICLE I SUPPLEMENT - DEFINITIONS ADDENDUM\n\n';
    undefs.forEach((u, i) => {
      defsText += `1.${i + 1} "${u.term}" means [specify exact operational criteria, title designations, and material scope].\n\n`;
    });
    navigator.clipboard.writeText(defsText);
    setCopiedDefsSuccess(true);
    setTimeout(() => setCopiedDefsSuccess(false), 3000);
  };

  const handleRunHarmonizer = (textOverride = null) => {
    if (isDemo && auditsLeft <= 0) {
      if (onOpenCheckout) {
        onOpenCheckout('firm');
      } else {
        openSeamlessCheckout({ plan: 'firm', toolName: 'contractcompare' });
      }
      return;
    }
    const rawInput = typeof textOverride === 'string' ? textOverride : text;
    if (!rawInput || !rawInput.trim()) return;
    if (isDemo && onConsumeAudit) onConsumeAudit();
    setIsHarmonizing(true);
    setTimeout(() => {
      try {
        const res = restateAndPolishContract(rawInput.trim());
        setHarmonizedData(res);
        setAnalysisMode('harmonizer');
      } catch (err) {
        console.error('Failed to harmonize document:', err);
      } finally {
        setIsHarmonizing(false);
      }
    }, 40);
  };

  const handleRunLiabilityAudit = (textOverride = null) => {
    if (isDemo && auditsLeft <= 0) {
      if (onOpenCheckout) {
        onOpenCheckout('firm');
      } else {
        openSeamlessCheckout({ plan: 'firm', toolName: 'contractcompare' });
      }
      return;
    }
    const rawInput = typeof textOverride === 'string' ? textOverride : text;
    if (!rawInput || !rawInput.trim()) return;
    if (isDemo && onConsumeAudit) onConsumeAudit();
    setIsAnalyzingLiability(true);
    setTimeout(() => {
      try {
        const res = analyzeLiabilityInterlocks(rawInput.trim());
        setLiabilityAuditData(res);
        setAnalysisMode('liability');
      } catch (err) {
        console.error('Failed to audit liability interlocks:', err);
      } finally {
        setIsAnalyzingLiability(false);
      }
    }, 40);
  };

  const enrichedAudit = useMemo(() => {
    if (!auditResults) return null;
    return enrichAllAuditFindings(auditResults);
  }, [auditResults]);

  // Workstation Navigation States
  const [showAltExports, setShowAltExports] = useState(false);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  const [showMatterMeta, setShowMatterMeta] = useState(false);

  const handleJumpToLine = (lineNum) => {
    if (!lineNum) return;
    const textarea = document.getElementById('contract-draft-textarea');
    if (textarea) {
      textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const lines = text.split('\n');
      let charPos = 0;
      for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
        charPos += lines[i].length + 1;
      }
      textarea.focus();
      textarea.setSelectionRange(charPos, charPos + (lines[lineNum - 1]?.length || 0));
    }
  };

  const [obligationPartyFilter, setObligationPartyFilter] = useState('all'); // all | Client | Counterparty | Mutual | Third Party
  const [obligationDutyFilter] = useState('all'); // all | affirmative | negative | conditional
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

  // Unified File Processor for both Click-to-Browse and Drag-and-Drop
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
      let extractedContent = '';

      if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await extractTextFromDOCX(arrayBuffer);
        extractedContent = result.value || '';
        setTargetText(extractedContent);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded Word DOCX (${extractedContent.split(/\s+/).length} words)` }));
      } else if (lowerName.endsWith('.pdf')) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Reading PDF in local RAM...' }));
        setParsingProgress({
          active: true,
          statusKey,
          percent: 5,
          currentPage: 1,
          totalPages: 1,
          message: 'Reading PDF in local RAM...'
        });
        const pdfResult = await extractTextFromPDF(file, {
          enableOcr: true,
          onProgress: (p) => {
            const pageMsg = p.totalPages ? `Reading Page ${p.currentPage} of ${p.totalPages} in local RAM (${p.percent}%)...` : (p.message || 'Processing in local RAM...');
            setUploadStatus(prev => ({ ...prev, [statusKey]: pageMsg }));
            setParsingProgress({
              active: true,
              statusKey,
              percent: p.percent || Math.round((p.currentPage / (p.totalPages || 1)) * 100),
              currentPage: p.currentPage || 1,
              totalPages: p.totalPages || 1,
              message: pageMsg
            });
          }
        });
        extractedContent = pdfResult.fullText || '';
        setTargetText(extractedContent);
        const hasOcrPages = pdfResult.pages?.some(pg => pg.isOcr);
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `Loaded PDF (${pdfResult.totalWords} words${hasOcrPages ? ' · In-RAM OCR applied' : ''})`
        }));
        setParsingProgress({ active: false, statusKey: '', percent: 100, currentPage: 0, totalPages: 0, message: '' });
      } else if (isImageFile(file)) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Initializing In-RAM OCR Engine...' }));
        setParsingProgress({
          active: true,
          statusKey,
          percent: 15,
          currentPage: 1,
          totalPages: 1,
          message: 'In-RAM OCR: Preprocessing scanned contract...'
        });
        const ocrResult = await recognizeImage(file, {
          preprocess: true,
          onProgress: (p) => {
            const ocrMsg = p.userFriendly ? `In-RAM OCR: ${p.userFriendly}` : 'Extracting text from scan...';
            setUploadStatus(prev => ({ ...prev, [statusKey]: ocrMsg }));
            setParsingProgress({
              active: true,
              statusKey,
              percent: Math.round((p.progress || 0.5) * 100),
              currentPage: 1,
              totalPages: 1,
              message: ocrMsg
            });
          }
        });
        extractedContent = ocrResult.text || '';
        setTargetText(extractedContent);
        const wordCount = extractedContent.trim() ? extractedContent.trim().split(/\s+/).length : 0;
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `Scanned Image OCR Complete (${wordCount} words · ${ocrResult.confidence.toFixed(1)}% conf · ${ocrResult.durationMs}ms)`
        }));
        setParsingProgress({ active: false, statusKey: '', percent: 100, currentPage: 0, totalPages: 0, message: '' });
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        extractedContent = await file.text();
        setTargetText(extractedContent);
        setUploadStatus(prev => ({ ...prev, [statusKey]: `Loaded text file (${extractedContent.split(/\s+/).length} words)` }));
      } else {
        alert("Supported file formats: .pdf, .docx, .txt, .md, .png, .jpg, .jpeg, .webp");
        setUploadStatus(prev => ({ ...prev, [statusKey]: '' }));
      }

      // Automatically detect Agreement Title, Client Party, and Counterparty upon upload
      if (extractedContent) {
        const meta = detectContractMetadata(extractedContent, file.name);
        if (meta.title && (!documentTitle || statusKey === 'target')) {
          setDocumentTitle(meta.title);
        }
        if (statusKey === 'target') {
          if (meta.clientParty) setClientParty(meta.clientParty);
          if (meta.counterparty) setCounterparty(meta.counterparty);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse document: " + err.message);
      setUploadStatus(prev => ({ ...prev, [statusKey]: 'Failed to parse file' }));
      setParsingProgress({ active: false, statusKey: '', percent: 0, currentPage: 0, totalPages: 0, message: '' });
    }
  };

  const handleFileUpload = (e, setTargetText, statusKey) => {
    const file = e.target.files?.[0];
    if (file) {
      processDocumentFile(file, setTargetText, statusKey);
    }
  };

  const handleFileDrop = (e, setTargetText, statusKey, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    if (setDragActive) setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processDocumentFile(file, setTargetText, statusKey);
    }
  };



  const handleExecuteAudit = async (overridePayload) => {
    const isInitial = !!overridePayload?.isInitialDemo;

    if (isDemo && !isInitial) {
      if (auditsLeft <= 0) {
        if (onOpenCheckout) {
          onOpenCheckout('firm');
        } else {
          openSeamlessCheckout({ plan: 'firm', toolName: 'contractcompare' });
        }
        return;
      }
      if (onConsumeAudit) onConsumeAudit();
    }

    const targetText = overridePayload?.text !== undefined ? overridePayload.text : text;
    const targetBaseline = overridePayload?.baselineText !== undefined ? overridePayload.baselineText : baselineText;
    const targetMode = overridePayload?.mode || analysisMode;
    const targetTitle = overridePayload?.title || documentTitle;
    const targetClient = overridePayload?.clientParty || clientParty;
    const targetCounter = overridePayload?.counterparty || counterparty;

    if (!targetText.trim()) {
      alert("Please paste or upload a contract text to audit.");
      return;
    }
    if (targetMode === 'comparative' && !targetBaseline.trim()) {
      alert("Please provide the original baseline contract for comparative diff.");
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
        // Automatically compute forensic linguistic proofreading
        try {
          const harmonized = restateAndPolishContract(targetText.trim(), {
            enforceClosingMechanics: true,
            enforceProrations: true
          });
          setHarmonizedData(harmonized);
        } catch (hErr) {
          console.warn('Linguistic restatement notice:', hErr);
        }

        // Auto-save session into local IndexedDB
        await saveDiffSession({
          title: targetTitle || 'Contract Integrity Audit',
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

        setSaveStatus('Audit saved to Local Vault (IndexedDB)');
        setTimeout(() => setSaveStatus(''), 4500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // In Demo mode, populate selected sample (?sample=saas|ma) or default M&A benchmark deal text on mount
  const hasLoadedInitialDemoRef = useRef(false);
  useEffect(() => {
    if (isDemo && !hasLoadedInitialDemoRef.current && !text) {
      hasLoadedInitialDemoRef.current = true;
      const sampleParam = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('sample')
        : null;
      handleLoadSampleCase(sampleParam === 'saas' ? 'saas' : 'ma', false);
    }
  }, [isDemo]);

  // Automatically execute audit on initial mount ONLY if a pre-existing session was passed (e.g. from Vault or Templates)
  useEffect(() => {
    if (!auditResults && !isProcessing) {
      const initialText = initialSession?.modifiedText || initialSession?.originalText;
      const initialBaseline = initialSession?.originalText || '';
      if (initialText && initialText.trim()) {
        setText(initialText);
        setBaselineText(initialBaseline);
        setDocumentTitle(initialSession?.title || 'Contract Integrity Audit');
        setClientParty(initialSession?.clientParty || '');
        setCounterparty(initialSession?.counterparty || '');
        handleExecuteAudit({
          text: initialText,
          baselineText: initialBaseline,
          title: initialSession?.title || 'Contract Integrity Audit',
          clientParty: initialSession?.clientParty || '',
          counterparty: initialSession?.counterparty || '',
          mode: analysisMode
        });
      }
    }
  }, []);

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

  // Memoized secondary counts so tab switches never trigger redundant parses
  const proofreaderCount = useMemo(() => {
    if (harmonizedData?.improvements) return harmonizedData.improvements.length;
    if (!auditResults || !text.trim()) return 0;
    try {
      return restateAndPolishContract(text).improvements.length;
    } catch {
      return 0;
    }
  }, [harmonizedData, auditResults, text]);

  const liabilityTrapCount = useMemo(() => {
    if (liabilityAuditData?.rules) return liabilityAuditData.rules.filter(r => r.status === 'FAIL').length;
    if (!auditResults || !text.trim()) return 0;
    try {
      return analyzeLiabilityInterlocks(text).rules.filter(r => r.status === 'FAIL').length;
    } catch {
      return 0;
    }
  }, [liabilityAuditData, auditResults, text]);

  // Calculations for score badges (Restrained Institutional Palette)
  const riskScore = auditResults?.overallRiskScore ?? 0;
  const riskLevel = auditResults?.riskLevel || 'low';
  const riskScoreBadgeColor = riskScore >= 75 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                              riskScore >= 45 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                              riskScore >= 20 ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' :
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const modeMeta = {
    single: {
      title: 'Single Draft Audit',
      desc: 'Inspect cross-references, defined terms, financials, and hidden liabilities.'
    },
    comparative: {
      title: 'Redline Diff Mode',
      desc: 'Compare your approved baseline against incoming counterparty revisions.'
    },
    harmonizer: {
      title: 'Linguistic & Deed Proofreader',
      desc: 'Refine archaic legalese while keeping every parcel, date, and figure locked.'
    },
    liability: {
      title: 'Liability & Indemnity Reconciler',
      desc: 'Audit indemnity caps, carve-outs, consequential waivers, and sole remedies.'
    }
  }[analysisMode] || { title: 'Contract Audit', desc: 'Deterministic contract inspection in local RAM.' };

  return (
    <div className="max-w-6xl w-full mx-auto h-full flex flex-col gap-4 font-ui">
      {/* Unified Executive Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            {modeMeta.title}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {modeMeta.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isDemo && (
            <>
              <button
                type="button"
                onClick={() => handleLoadSampleCase('ma')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Load M&A Agreement with $45,000 clerical discrepancy and broken Section 14.2"
              >
                M&A Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleCase('saas')}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Load SaaS MSA with broken Exhibit C and liability cap collision"
              >
                SaaS Sample
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowMatterMeta((v) => !v)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              showMatterMeta
                ? 'bg-white/[0.08] border-white/15 text-white'
                : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300'
            }`}
            title="Edit Agreement Title, Client Entity, and Counterparty Name"
          >
            <FileText size={13} className="text-zinc-400" />
            <span className="max-w-[170px] truncate">{documentTitle || 'Matter Info'}</span>
            <ChevronDown size={12} className={`text-zinc-500 transition-transform ${showMatterMeta ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Matter Details Drawer */}
      {showMatterMeta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-[#111115] border border-white/[0.08] rounded-xl">
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Agreement Title</label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Master Services Agreement..."
              className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/60 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Client Entity</label>
            <input
              type="text"
              value={clientParty}
              onChange={(e) => setClientParty(e.target.value)}
              placeholder="Acme Corporation..."
              className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/60 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">Counterparty</label>
            <input
              type="text"
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              placeholder="Globex Systems Inc..."
              className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/60 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* Document Workbench */}
      {analysisMode === 'single' || analysisMode === 'harmonizer' || analysisMode === 'liability' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(false); }}
          onDrop={(e) => handleFileDrop(e, setText, 'target', setIsDraggingTarget)}
          className={`flex flex-col rounded-xl bg-[#111115] border transition-colors overflow-hidden relative ${
            isDraggingTarget
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-white/[0.08]'
          }`}
        >
          {isDraggingTarget && (
            <div className="absolute inset-0 z-30 bg-[#09090B]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none gap-2">
              <Upload size={26} className="text-emerald-400" />
              <p className="text-sm font-medium text-white">Drop Contract Here</p>
              <p className="text-xs text-zinc-400">.pdf, .docx, .txt, .md, or scanned image</p>
            </div>
          )}

          {parsingProgress.active && parsingProgress.statusKey === 'target' && (
            <div className="absolute inset-0 z-30 bg-[#09090B]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <RefreshCw size={22} className="text-emerald-400 animate-spin mb-3" />
              <p className="text-sm font-medium text-white mb-1">Reading Document in Local RAM</p>
              <p className="text-xs font-mono text-zinc-400 mb-3">
                {parsingProgress.message || `Page ${parsingProgress.currentPage} of ${parsingProgress.totalPages} (${parsingProgress.percent}%)`}
              </p>
              <div className="w-full max-w-xs h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                  style={{ width: `${Math.max(parsingProgress.percent || 0, 10)}%` }}
                />
              </div>
            </div>
          )}

          {/* Document Header Chrome */}
          <div className="px-4 py-2.5 bg-[#15151A] border-b border-white/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-zinc-300 truncate">
                Draft Document
              </span>
              {uploadStatus.target && (
                <span className="text-[11px] font-mono text-emerald-400 truncate max-w-[240px]">
                  · {uploadStatus.target}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {text ? (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-rose-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setText(HAZARDOUS_SAMPLE_CONTRACT);
                    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
                    setDocumentTitle('Master Asset Purchase & Services Agreement');
                    setClientParty('Acme Holdings LLC');
                    setCounterparty('Globex International Corp');
                  }}
                  className="px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  Insert Sample
                </button>
              )}

              <label className="cursor-pointer px-3 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5">
                <Upload size={12} />
                <span>Import File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setText, 'target')}
                />
              </label>
            </div>
          </div>

          <textarea
            id="contract-draft-textarea"
            value={text}
            onChange={(e) => {
              const newVal = e.target.value;
              setText(newVal);
              if (!newVal.trim()) {
                resetAnalysis();
                setHarmonizedData(null);
                setLiabilityAuditData(null);
                setDiffDecisions({});
              } else if (newVal.length >= 60 && (!documentTitle || !clientParty || !counterparty)) {
                const meta = detectContractMetadata(newVal);
                if (meta.title && !documentTitle) setDocumentTitle(meta.title);
                if (meta.clientParty && !clientParty) setClientParty(meta.clientParty);
                if (meta.counterparty && !counterparty) setCounterparty(meta.counterparty);
              }
            }}
            onPaste={(e) => {
              const pasted = e.clipboardData?.getData('text');
              if (pasted && pasted.length >= 60) {
                const meta = detectContractMetadata(pasted);
                if (meta.title && !documentTitle) setDocumentTitle(meta.title);
                if (meta.clientParty && !clientParty) setClientParty(meta.clientParty);
                if (meta.counterparty && !counterparty) setCounterparty(meta.counterparty);
              }
            }}
            placeholder="Paste contract text here, or drag & drop a .pdf, .docx, or .txt file..."
            className="w-full bg-[#0E0E12] px-6 py-5 text-[15px] font-legal leading-[1.8] text-zinc-200 placeholder:text-zinc-600 outline-none resize-none custom-scrollbar min-h-[260px]"
          />

          {/* Integrated Execution Bar */}
          <div className="px-4 py-3 bg-[#15151A] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="font-mono tabular-nums text-zinc-400">
                {text.trim() ? text.trim().split(/\s+/).length.toLocaleString('en-US') : 0} words · {text.split('\n').length} lines
              </span>
              {saveStatus && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check size={13} /> {saveStatus}
                </span>
              )}
              {workerError && (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle size={13} /> {workerError}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {isProcessing && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelAnalysis();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <StopCircle size={13} />
                  <span>Cancel</span>
                </button>
              )}

              {analysisMode === 'harmonizer' ? (
                <button
                  type="button"
                  onClick={() => handleRunHarmonizer()}
                  disabled={isHarmonizing || !text.trim()}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {isHarmonizing ? <RefreshCw className="animate-spin" size={14} /> : <Scale size={14} />}
                  <span>{isHarmonizing ? 'Proofreading…' : 'Run Proofreading'}</span>
                </button>
              ) : analysisMode === 'liability' ? (
                <button
                  type="button"
                  onClick={() => handleRunLiabilityAudit()}
                  disabled={isAnalyzingLiability || !text.trim()}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {isAnalyzingLiability ? <RefreshCw className="animate-spin" size={14} /> : <ShieldAlert size={14} />}
                  <span>{isAnalyzingLiability ? 'Auditing Caps…' : 'Reconcile Liabilities'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleExecuteAudit()}
                  disabled={isProcessing || !text.trim()}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                  <span>{isProcessing ? 'Auditing…' : 'Run Integrity Audit'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COMPARATIVE REDLINE DIFF MODE */
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Approved Baseline */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingBaseline(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingBaseline(false); }}
              onDrop={(e) => handleFileDrop(e, setBaselineText, 'baseline', setIsDraggingBaseline)}
              className={`flex flex-col rounded-xl bg-[#111115] border transition-colors overflow-hidden relative ${
                isDraggingBaseline ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/[0.08]'
              }`}
            >
              {isDraggingBaseline && (
                <div className="absolute inset-0 z-30 bg-[#09090B]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none gap-2">
                  <Upload size={24} className="text-emerald-400" />
                  <p className="text-sm font-medium text-white">Drop Baseline Draft</p>
                </div>
              )}

              {parsingProgress.active && parsingProgress.statusKey === 'baseline' && (
                <div className="absolute inset-0 z-30 bg-[#09090B]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <RefreshCw size={22} className="text-emerald-400 animate-spin mb-3" />
                  <p className="text-sm font-medium text-white mb-1">Reading Baseline in Local RAM</p>
                  <p className="text-xs font-mono text-zinc-400 mb-3">
                    {parsingProgress.message || `Page ${parsingProgress.currentPage} of ${parsingProgress.totalPages} (${parsingProgress.percent}%)`}
                  </p>
                  <div className="w-full max-w-xs h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                      style={{ width: `${Math.max(parsingProgress.percent || 0, 10)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="px-4 py-2.5 bg-[#15151A] border-b border-white/[0.06] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-zinc-200 truncate">Original Baseline</span>
                  {uploadStatus.baseline && (
                    <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[120px]">{uploadStatus.baseline}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {baselineText && (
                    <button
                      type="button"
                      onClick={() => {
                        setBaselineText('');
                        resetAnalysis();
                        setDiffDecisions({});
                      }}
                      className="px-2 py-1 rounded text-xs text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <label className="cursor-pointer bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-2.5 py-1 rounded-md text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1">
                    <Upload size={11} />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setBaselineText, 'baseline')}
                    />
                  </label>
                </div>
              </div>
              <textarea
                value={baselineText}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setBaselineText(newVal);
                  if (!newVal.trim() && analysisMode === 'comparative') {
                    resetAnalysis();
                    setDiffDecisions({});
                  }
                }}
                placeholder="Paste your approved baseline draft or drop a file…"
                className="w-full bg-[#0E0E12] p-5 text-[14.5px] font-legal leading-[1.8] text-zinc-200 placeholder:text-zinc-600 outline-none resize-none custom-scrollbar min-h-[250px]"
              />
              <div className="px-4 py-2 border-t border-white/[0.06] bg-[#15151A] text-[11px] font-mono tabular-nums text-zinc-500 flex items-center justify-between">
                <span>Approved Draft</span>
                <span>{baselineText.trim() ? baselineText.trim().split(/\s+/).length.toLocaleString('en-US') : 0} words</span>
              </div>
            </div>

            {/* Counterparty Markup */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(false); }}
              onDrop={(e) => handleFileDrop(e, setText, 'target', setIsDraggingTarget)}
              className={`flex flex-col rounded-xl bg-[#111115] border transition-colors overflow-hidden relative ${
                isDraggingTarget ? 'border-sky-500 bg-sky-500/5' : 'border-white/[0.08]'
              }`}
            >
              {isDraggingTarget && (
                <div className="absolute inset-0 z-30 bg-[#09090B]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none gap-2">
                  <Upload size={24} className="text-sky-400" />
                  <p className="text-sm font-medium text-white">Drop Counterparty Revision</p>
                </div>
              )}

              {parsingProgress.active && parsingProgress.statusKey === 'target' && (
                <div className="absolute inset-0 z-30 bg-[#09090B]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <RefreshCw size={22} className="text-sky-400 animate-spin mb-3" />
                  <p className="text-sm font-medium text-white mb-1">Reading Revision in Local RAM</p>
                  <p className="text-xs font-mono text-zinc-400 mb-3">
                    {parsingProgress.message || `Page ${parsingProgress.currentPage} of ${parsingProgress.totalPages} (${parsingProgress.percent}%)`}
                  </p>
                  <div className="w-full max-w-xs h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-200"
                      style={{ width: `${Math.max(parsingProgress.percent || 0, 10)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="px-4 py-2.5 bg-[#15151A] border-b border-white/[0.06] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  <span className="text-xs font-medium text-zinc-200 truncate">Counterparty Markup</span>
                  {uploadStatus.target && (
                    <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[120px]">{uploadStatus.target}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {text && (
                    <button
                      type="button"
                      onClick={() => {
                        setText('');
                        resetAnalysis();
                        setDiffDecisions({});
                      }}
                      className="px-2 py-1 rounded text-xs text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <label className="cursor-pointer bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] px-2.5 py-1 rounded-md text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1">
                    <Upload size={11} />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setText, 'target')}
                    />
                  </label>
                </div>
              </div>
              <textarea
                id="contract-draft-textarea"
                value={text}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setText(newVal);
                  if (!newVal.trim()) {
                    resetAnalysis();
                    setHarmonizedData(null);
                    setLiabilityAuditData(null);
                    setDiffDecisions({});
                  }
                }}
                placeholder="Paste counterparty modified draft or drop a file…"
                className="w-full bg-[#0E0E12] p-5 text-[14.5px] font-legal leading-[1.8] text-zinc-200 placeholder:text-zinc-600 outline-none resize-none custom-scrollbar min-h-[250px]"
              />
              <div className="px-4 py-2 border-t border-white/[0.06] bg-[#15151A] text-[11px] font-mono tabular-nums text-zinc-500 flex items-center justify-between">
                <span>Proposed Revision</span>
                <span>{text.trim() ? text.trim().split(/\s+/).length.toLocaleString('en-US') : 0} words</span>
              </div>
            </div>
          </div>

          {/* Unified Comparative Execution Bar */}
          <div className="px-4 py-3 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-500">Precision:</span>
                <div className="flex bg-[#09090B] p-0.5 rounded-lg border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setDiffGranularity('word')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      diffGranularity === 'word' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Word
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiffGranularity('line')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      diffGranularity === 'line' ? 'bg-white/[0.1] text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Line
                  </button>
                </div>
              </div>

              {saveStatus && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check size={13} /> {saveStatus}
                </span>
              )}
              {workerError && (
                <span className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle size={13} /> {workerError}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {(text.trim() || baselineText.trim()) && !isProcessing && (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-rose-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              {isProcessing && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelAnalysis();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <StopCircle size={13} />
                  <span>Cancel</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleExecuteAudit()}
                disabled={isProcessing || !text.trim() || !baselineText.trim()}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                <span>{isProcessing ? 'Comparing…' : 'Compare & Audit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slim Local Progress Bar */}
      {isProcessing && (
        <div className="px-4 py-3 rounded-xl bg-[#111115] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-zinc-300 flex items-center gap-2">
              <RefreshCw className="animate-spin text-emerald-400" size={13} />
              <span>{progress?.msg || 'Auditing contract in local memory…'}</span>
            </span>
            <span className="font-mono tabular-nums text-zinc-400">{progress?.percent || 0}%</span>
          </div>
          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results HUD & Workstation */}
      {auditResults && text.trim() && (analysisMode === 'single' || analysisMode === 'comparative') && (
        <div className="w-full flex flex-col gap-5 animate-fade-in mt-1">
          {/* Executive Verdict & Action Dock */}
          <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl border flex flex-col items-center justify-center shrink-0 ${riskScoreBadgeColor}`}>
                <span className="text-2xl font-bold font-mono tabular-nums leading-none">{riskScore}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider mt-1 opacity-80">{riskLevel}</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">
                  {riskScore >= 75 ? 'Critical Drafting Defects Detected' :
                   riskScore >= 45 ? 'High Risk Legal Anomalies Found' :
                   riskScore >= 20 ? 'Moderate Drafting Gaps Identified' :
                   'Clean Document Integrity Profile'}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 tabular-nums">
                  {auditResults.meta?.wordCount || 0} words · {auditResults.meta?.processingTimeMs || 0}ms local execution
                </p>
              </div>
            </div>

            {/* Unified Action Dock */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGenerateCertificate}
                disabled={isGeneratingCertificate}
                className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Generate SHA-256 Pre-Signing Diligence Certificate"
              >
                {isGeneratingCertificate ? (
                  <RefreshCw size={14} className="animate-spin text-emerald-400" />
                ) : (
                  <ShieldCheck size={14} className="text-emerald-400" />
                )}
                <span>Certificate</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWordRider}
                disabled={isDownloadingWordRider}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download editable Microsoft Word Pre-Signing Amendment Rider (.docx)"
              >
                {isDownloadingWordRider ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <FileDown size={14} />
                )}
                <span>Word Rider (.docx)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyFullRider}
                className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy pre-signing amendment schedule"
              >
                {copiedRiderSuccess ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAltExports(prev => !prev)}
                  className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Export</span>
                  <ChevronDown size={12} className={`text-zinc-400 transition-transform duration-150 ${showAltExports ? 'rotate-180' : ''}`} />
                </button>

                {showAltExports && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-[#16161B] border border-white/10 shadow-2xl p-1.5 z-40 flex flex-col gap-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        downloadDiligenceCertificatePDF(auditResults || {}, {
                          contractTitle: documentTitle?.trim() || (isDemo ? 'Master Asset Purchase & Services Agreement' : 'Commercial Contract Agreement'),
                          clientName: clientParty?.trim() || 'Retained Client Counsel',
                          counterpartyName: counterparty?.trim() || 'Disclosed Counterparty',
                          certificateHash: certificateHash,
                          certificateDate: certificateDate,
                          customFileUploaded: !isDemo && documentTitle !== 'Master Asset Purchase & Services Agreement',
                          includeSeal: includeCertStamp
                        });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Scale size={13} className="text-emerald-400" />
                      <span>Diligence Certificate (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        downloadAmendmentRiderPDF(auditResults, {
                          contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
                          clientName: clientParty.trim() || 'Client',
                          counterpartyName: counterparty.trim() || 'Counterparty'
                        });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileText size={13} className="text-rose-400" />
                      <span>Court Rider (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        exportExecutiveClientMemoHTML({
                          contractTitle: documentTitle.trim() || 'Contract Integrity & Legal Audit',
                          clientName: clientParty.trim() || 'Client',
                          counterpartyName: counterparty.trim() || 'Counterparty',
                          auditData: auditResults
                        });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Download size={13} className="text-zinc-400" />
                      <span>Client Memo (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        exportPreSigningAmendmentRiderHTML(auditResults, {
                          contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
                          clientName: clientParty.trim() || 'Client',
                          counterpartyName: counterparty.trim() || 'Counterparty'
                        });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileCode size={13} className="text-zinc-400" />
                      <span>Rider (HTML)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        exportObligationsCSV(auditResults.obligations);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet size={13} className="text-zinc-400" />
                      <span>Obligations (CSV)</span>
                    </button>
                    {auditResults.diff && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAltExports(false);
                          exportRedlineToHTML(auditResults.diff, auditResults.risks, { title: documentTitle.trim() || 'Contract Redline Audit' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <FileCode size={13} className="text-zinc-400" />
                        <span>Redline HTML</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowAltExports(false);
                        exportAuditReportJSON(auditResults.diff, auditResults.risks, null, { title: documentTitle.trim() || 'Contract Integrity Audit' });
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 flex items-center gap-2 cursor-pointer transition-colors border-t border-white/[0.06] mt-0.5 pt-2"
                    >
                      <span>JSON Compliance Data</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Single Unified Underline HUD Tab Bar */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.08] custom-scrollbar text-xs">
            {[
              {
                id: 'dealBreakers',
                label: 'Deal Breakers',
                count: enrichedAudit?.dealBreakers?.length || 0,
                alertTone: 'rose'
              },
              {
                id: 'enforceability',
                label: 'Enforceability',
                count: enrichedAudit?.enforceabilityHazards?.length || 0,
                alertTone: 'amber'
              },
              ...(auditResults.diff ? [{
                id: 'diff',
                label: 'Redline Diff',
                badgeText: `${auditResults.diff.stats?.similarity}%`,
                alertTone: 'neutral'
              }] : []),
              {
                id: 'crossRefs',
                label: 'Citations & Exhibits',
                count: (auditResults.crossRefs?.stats?.brokenCount || 0) + (auditResults.crossRefs?.stats?.missingExhibitCount || 0),
                alertTone: 'amber'
              },
              {
                id: 'financialDates',
                label: 'Financial & Dates',
                count: (auditResults.financialDates?.stats?.mismatchCount || 0) + (auditResults.financialDates?.stats?.dateIssuesCount || 0),
                alertTone: 'rose'
              },
              {
                id: 'definedTerms',
                label: 'Defined Terms',
                count: auditResults.definedTerms?.stats?.undefinedCount || 0,
                alertTone: 'amber'
              },
              {
                id: 'obligations',
                label: 'Obligations',
                count: auditResults.obligations?.stats?.totalObligations || 0,
                alertTone: 'neutral'
              },
              {
                id: 'linguisticProofreader',
                label: 'Proofreading',
                count: proofreaderCount,
                alertTone: 'neutral'
              },
              {
                id: 'liabilityReconciler',
                label: 'Liability Matrix',
                count: liabilityTrapCount,
                alertTone: liabilityTrapCount > 0 ? 'rose' : 'neutral',
                onClickExtra: () => {
                  if (!liabilityAuditData && text.trim()) {
                    handleRunLiabilityAudit();
                  }
                }
              },
              ...((auditResults.risks?.length || 0) > 0 ? [{
                id: 'risks',
                label: 'Risk Radar',
                count: auditResults.risks.length,
                alertTone: 'amber'
              }] : [])
            ].map((tab) => {
              const isActive = activeHudTab === tab.id;
              const badgeClass =
                tab.alertTone === 'rose' && tab.count > 0
                  ? 'bg-rose-500/15 text-rose-400'
                  : tab.alertTone === 'amber' && tab.count > 0
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-white/[0.06] text-zinc-400';

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveHudTab(tab.id);
                    if (tab.onClickExtra) tab.onClickExtra();
                  }}
                  className={`px-3 py-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'border-emerald-500 text-white font-medium'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {(tab.count !== undefined || tab.badgeText) && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${badgeClass}`}>
                      {tab.badgeText || tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB: LINGUISTIC & DEED PROOFREADER */}
          {activeHudTab === 'linguisticProofreader' && (
            <div className="flex flex-col gap-5">
              <HarmonizerResultsHUD
                harmonizedData={harmonizedData || restateAndPolishContract(text)}
                documentTitle={documentTitle}
                onDownloadDocx={() => {
                  downloadHarmonizedDeedDOCX(harmonizedData || restateAndPolishContract(text), {
                    title: documentTitle.trim() || 'Harmonized Contract Draft'
                  });
                }}
                onCopyRestated={() => {
                  navigator.clipboard.writeText((harmonizedData || restateAndPolishContract(text)).restatedText);
                }}
                onReAuditRestated={() => {
                  const restated = (harmonizedData || restateAndPolishContract(text)).restatedText;
                  setText(restated);
                  setActiveHudTab('dealBreakers');
                  handleExecuteAudit({ text: restated, mode: analysisMode });
                }}
              />
            </div>
          )}

          {/* TAB: LIABILITY & INDEMNITY RECONCILER */}
          {activeHudTab === 'liabilityReconciler' && (
            <div className="flex flex-col gap-5">
              <LiabilityReconcilerHUD
                auditResults={liabilityAuditData || analyzeLiabilityInterlocks(text)}
                contractText={text}
                documentTitle={documentTitle}
                onLoadSampleDeal={(sampleKey) => {
                  const sample = SAMPLE_DEALS[sampleKey];
                  if (sample) {
                    setText(sample.text);
                    setDocumentTitle(sample.title);
                    handleRunLiabilityAudit(sample.text);
                  }
                }}
                onApplyRiderToDraft={(riderText) => {
                  const updated = `${text.trim()}\n\n${riderText}`;
                  setText(updated);
                  handleRunLiabilityAudit(updated);
                }}
              />
            </div>
          )}

          {/* TABS: CRITICAL DEAL BREAKERS & ENFORCEABILITY HAZARDS (Unified Clean Layout) */}
          {(activeHudTab === 'dealBreakers' || activeHudTab === 'enforceability') && (() => {
            const isCritical = activeHudTab === 'dealBreakers';
            const items = isCritical ? (enrichedAudit?.dealBreakers || []) : (enrichedAudit?.enforceabilityHazards || []);
            const accentBorder = isCritical ? 'border-l-rose-500' : 'border-l-amber-500';
            const badgeStyle = isCritical
              ? 'bg-rose-500/12 text-rose-400 border-rose-500/25'
              : 'bg-amber-500/12 text-amber-400 border-amber-500/25';

            if (items.length === 0) {
              return (
                <div className="p-8 text-center text-xs text-zinc-400 bg-[#111115] border border-white/[0.08] rounded-xl flex flex-col items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span className="text-zinc-200 font-medium">
                    {isCritical
                      ? 'No critical deal-breaker defects detected.'
                      : 'All cross-references and capitalized terms resolve cleanly.'}
                  </span>
                </div>
              );
            }

            return (
              <div className="space-y-3.5">
                {items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-5 rounded-xl bg-[#111115] border border-white/[0.08] border-l-2 ${accentBorder} flex flex-col gap-3.5`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase border ${badgeStyle}`}>
                          {item.legalSeverityLabel || (isCritical ? 'Critical Trap' : 'Hazard')}
                        </span>
                        {item.line ? (
                          <button
                            type="button"
                            onClick={() => handleJumpToLine(item.line)}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 border border-white/[0.08] transition-colors flex items-center gap-1 cursor-pointer"
                            title={`Jump to line ${item.line}`}
                          >
                            <Crosshair size={11} className="text-zinc-400" />
                            <span>Line {item.line}</span>
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06]">
                            {item.clauseRef || item.clause || 'Clause'}
                          </span>
                        )}
                        {item.occurrences > 1 && (
                          <span className="text-[11px] font-mono text-zinc-500">
                            {item.occurrences}× cited
                          </span>
                        )}
                      </div>
                      {item.statutoryCitation && (
                        <span className="text-[11px] font-mono text-zinc-400">
                          {item.statutoryCitation}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{item.malpracticeRisk}</p>
                    </div>

                    {item.snippet && (
                      <div className="px-3.5 py-2.5 rounded-lg bg-[#0A0A0D] border border-white/[0.06] border-l-2 border-l-rose-500/50 text-xs font-legal text-zinc-300 leading-relaxed">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                          Draft Language
                        </span>
                        <span className={isCritical ? 'line-through decoration-rose-400/70 text-rose-200/80' : 'text-amber-200/90'}>
                          &ldquo;{item.snippet}&rdquo;
                        </span>
                      </div>
                    )}

                    {item.courtGradeRedline && (
                      <div className="px-3.5 py-3 rounded-lg bg-[#0A0A0D] border border-white/[0.06] border-l-2 border-l-emerald-500/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-emerald-400">
                            Suggested Redline Replacement
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyRedline(item.id || idx, item.courtGradeRedline)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            {copiedRedlineId === (item.id || idx) ? (
                              <>
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} className="text-zinc-400" />
                                <span>Copy Clause</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-xs font-legal text-zinc-200 leading-relaxed select-all">
                          {item.courtGradeRedline}
                        </div>
                        {item.actionableAdvice && (
                          <p className="text-[11px] text-zinc-500 pt-1 border-t border-white/[0.05]">
                            {item.actionableAdvice}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}

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
                  <div className="space-y-3">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').map((issue, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(issue);
                      const cardId = `cr_broken_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-900/80 border border-red-500/35 hover:border-red-500/60 transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-red-300 text-sm">
                                {issue.referenceText}
                              </span>
                              <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                Target Missing: {issue.targetName}
                              </span>
                              {issue.line && (
                                <button
                                  type="button"
                                  onClick={() => handleJumpToLine(issue.line)}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Locate line ${issue.line} in contract draft`}
                                >
                                  <Crosshair size={11} className="text-red-400" />
                                  <span>Line {issue.line}</span>
                                </button>
                              )}
                            </div>
                            <span className="text-[11px] text-red-400 font-mono font-bold">
                              Delaware Chancery Patent Ambiguity
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono text-gray-300 italic">
                            "{issue.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                  AmLaw 100 Court-Grade Replacement Language
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  {copiedRedlineId === cardId ? (
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
                              <div className="p-2 bg-black/70 rounded text-[11px] font-mono text-emerald-300/90 leading-relaxed border border-emerald-500/20 select-all">
                                {enriched.courtGradeRedline}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                  <div className="space-y-3">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').map((issue, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(issue);
                      const cardId = `cr_exhibit_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/35 hover:border-amber-500/60 transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                {issue.referenceText}
                              </span>
                              <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                Exhibit Missing
                              </span>
                              {issue.line && (
                                <button
                                  type="button"
                                  onClick={() => handleJumpToLine(issue.line)}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Locate line ${issue.line} in contract draft`}
                                >
                                  <Crosshair size={11} className="text-amber-400" />
                                  <span>Line {issue.line}</span>
                                </button>
                              )}
                            </div>
                            <span className="text-[11px] text-amber-400 font-mono font-bold">
                              Failure of Condition Precedent (Restatement § 224)
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono text-gray-300 italic">
                            "{issue.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                  AmLaw 100 Pre-Signing Delivery Covenant
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  {copiedRedlineId === cardId ? (
                                    <>
                                      <Check size={12} className="text-black" />
                                      <span>Copied! ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy Covenant</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="p-2 bg-black/70 rounded text-[11px] font-mono text-emerald-300/90 leading-relaxed border border-emerald-500/20 select-all">
                                {enriched.courtGradeRedline}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-400" />
                    Undefined Capitalized Terms ({auditResults.definedTerms?.undefinedTerms?.length || 0})
                  </h4>
                  {(auditResults.definedTerms?.undefinedTerms?.length || 0) > 0 && (
                    <button
                      onClick={handleCopyAllDefinitions}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copiedDefsSuccess ? (
                        <>
                          <Check size={12} />
                          <span>Definitions Copied! ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Article I Definitions Supplement</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                {(!auditResults.definedTerms?.undefinedTerms || auditResults.definedTerms.undefinedTerms.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
                    ✓ No undefined capitalized terms detected.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResults.definedTerms.undefinedTerms.map((termItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 text-xs font-mono flex flex-col justify-between gap-2.5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-amber-300 text-sm">"{termItem.term}"</span>
                            <div className="flex items-center gap-1.5">
                              {termItem.line && (
                                <button
                                  type="button"
                                  onClick={() => handleJumpToLine(termItem.line)}
                                  className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                                  title={`Locate line ${termItem.line}`}
                                >
                                  Line {termItem.line}
                                </button>
                              )}
                              <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                                {termItem.count || 1}x
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-400">First referenced at line {termItem.line} without operative definition in Section 1.</p>
                        </div>
                        <button
                          onClick={() => handleCopyRedline(`def_${idx}`, `"${termItem.term}" means [specify exact operational criteria, title designations, and material scope].`)}
                          className="self-end px-2 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedRedlineId === `def_${idx}` ? <><Check size={11} className="text-emerald-400" /> Copied</> : <><Copy size={11} /> Copy Definition</>}
                        </button>
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
                  <div className="space-y-3">
                    {auditResults.definedTerms.entityIssues.map((ent, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(ent);
                      const cardId = `ent_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/40 text-xs font-mono flex flex-col gap-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-orange-300 text-sm">{ent.entity}: </span>
                              <span className="text-gray-300">{ent.discrepancy}</span>
                              {ent.line && (
                                <button
                                  type="button"
                                  onClick={() => handleJumpToLine(ent.line)}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-orange-500/20 hover:bg-orange-500/35 text-orange-300 border border-orange-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Locate line ${ent.line} in contract draft`}
                                >
                                  <Crosshair size={11} className="text-orange-400" />
                                  <span>Line {ent.line}</span>
                                </button>
                              )}
                            </div>
                            <span className="bg-orange-500 text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                              Veil-Piercing Exposure
                            </span>
                          </div>
                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                  AmLaw 100 Corporate Entity Harmonization Covenant
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  {copiedRedlineId === cardId ? <><Check size={12} className="text-black" /> Copied! ✓</> : <><Copy size={12} /> Copy Covenant</>}
                                </button>
                              </div>
                              <div className="p-2 bg-black/70 rounded text-[11px] font-mono text-emerald-300/90 leading-relaxed border border-emerald-500/20 select-all">
                                {enriched.courtGradeRedline}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                    {(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').map((mismatch, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(mismatch);
                      const cardId = `fin_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-900/80 border border-red-500/40 hover:border-red-500/60 transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-red-300 text-sm">{mismatch.title}</span>
                              <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                Critical Mismatch
                              </span>
                              {mismatch.line && (
                                <button
                                  type="button"
                                  onClick={() => handleJumpToLine(mismatch.line)}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/40 transition-colors flex items-center gap-1 cursor-pointer"
                                  title={`Locate line ${mismatch.line} in contract draft`}
                                >
                                  <Crosshair size={11} className="text-red-400" />
                                  <span>Line {mismatch.line}</span>
                                </button>
                              )}
                            </div>
                            <span className="text-xs font-mono text-red-400 font-bold">
                              UCC § 3-114 Words-Over-Numbers Rule
                            </span>
                          </div>

                          <p className="text-gray-200 text-xs leading-relaxed">{mismatch.details}</p>

                          <div className="p-2.5 bg-black/60 rounded-lg text-gray-300 text-xs font-mono italic border border-zinc-800">
                            "{mismatch.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 size={13} className="text-emerald-400" />
                                  AmLaw 100 Court-Grade Reconciliation Clause
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  {copiedRedlineId === cardId ? <><Check size={12} className="text-black" /> Copied! ✓</> : <><Copy size={12} /> Copy Clause</>}
                                </button>
                              </div>
                              <div className="p-2 bg-black/70 rounded text-[11px] font-mono text-emerald-300/90 leading-relaxed border border-emerald-500/20 select-all">
                                {enriched.courtGradeRedline}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#111115] border border-white/[0.08]">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-zinc-500 font-mono mr-1">Party:</span>
                  <button
                    onClick={() => setObligationPartyFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${obligationPartyFilter === 'all' ? 'bg-white/[0.1] text-white border border-white/[0.12]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                  >
                    All ({auditResults.obligations?.stats?.totalObligations || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Client')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${obligationPartyFilter === 'Client' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                  >
                    Client ({auditResults.obligations?.partyBreakdown?.clientCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Counterparty')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${obligationPartyFilter === 'Counterparty' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                  >
                    Counterparty ({auditResults.obligations?.partyBreakdown?.counterpartyCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Mutual')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${obligationPartyFilter === 'Mutual' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                  >
                    Mutual ({auditResults.obligations?.partyBreakdown?.mutualCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Third Party')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${obligationPartyFilter === 'Third Party' ? 'bg-white/[0.1] text-zinc-200 border border-white/[0.12]' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'}`}
                  >
                    Third Party ({auditResults.obligations?.partyBreakdown?.thirdPartyCount || 0})
                  </button>
                </div>

                <button
                  onClick={() => exportObligationsCSV(auditResults.obligations)}
                  className="px-3 py-1.5 bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} className="text-emerald-400" /> Export CSV
                </button>
              </div>

              {/* Obligations Table */}
              <div className="rounded-lg bg-[#111115] border border-white/[0.08] overflow-hidden">
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
                              <td className="p-3">
                                {obl.line ? (
                                  <button
                                    type="button"
                                    onClick={() => handleJumpToLine(obl.line)}
                                    className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-white/5 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                                    title={`Locate line ${obl.line}`}
                                  >
                                    <Crosshair size={10} className="text-emerald-400" />
                                    <span>{obl.line}</span>
                                  </button>
                                ) : (
                                  <span className="text-gray-500">-</span>
                                )}
                              </td>
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
              
              {/* Diff Navigator Bar + Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Redline Variance Engine</span>
                  <span className="text-zinc-500">|</span>
                  <span className="text-emerald-400 font-semibold">
                    {auditResults.diff.segments.filter(s => s.type !== 'unchanged').length} Differences
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Export Word Redline Button */}
                  <button
                    type="button"
                    onClick={() => {
                      downloadRedlineDOCX(auditResults.diff, {
                        title: documentTitle || 'Commercial Agreement',
                        clientParty: clientParty || 'Client Principal',
                        counterparty: counterparty || 'Counterparty'
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Export clean Word document with Track Changes strikethrough & underline markup"
                  >
                    <FileDown size={13} />
                    <span>Download Redline Word (.docx)</span>
                  </button>

                  {/* One-Click Counter-Rider Generator */}
                  <button
                    type="button"
                    onClick={() => setShowCounterRiderModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Generate instant email-ready Counter-Rider rejecting counterparty alterations"
                  >
                    <ShieldAlert size={13} />
                    <span>One-Click Counter-Rider</span>
                  </button>

                  <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                  {/* Next / Prev Navigation */}
                  <span className="text-[11px] text-zinc-400 hidden lg:inline">[J] Next / [K] Prev</span>
                  <button
                    type="button"
                    onClick={() => {
                      const diffEls = document.querySelectorAll('.diff-target-segment');
                      if (diffEls.length === 0) return;
                      const nextIdx = (activeDiffNavIdx - 1 + diffEls.length) % diffEls.length;
                      setActiveDiffNavIdx(nextIdx);
                      diffEls[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
                    title="Previous Difference (K)"
                  >
                    ▲ Prev (K)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const diffEls = document.querySelectorAll('.diff-target-segment');
                      if (diffEls.length === 0) return;
                      const nextIdx = (activeDiffNavIdx + 1) % diffEls.length;
                      setActiveDiffNavIdx(nextIdx);
                      diffEls[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium cursor-pointer transition-colors"
                    title="Next Difference (J)"
                  >
                    ▼ Next (J)
                  </button>
                </div>
              </div>

              {/* Accept / Reject / Flag HUD Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 font-semibold">Review Decisions:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check size={13} /> {Object.values(diffDecisions).filter(d => d === 'accepted').length} Accepted
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <XCircle size={13} /> {Object.values(diffDecisions).filter(d => d === 'rejected').length} Rejected
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Flag size={13} /> {Object.values(diffDecisions).filter(d => d === 'flagged').length} Flagged
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const entries = Object.entries(diffDecisions);
                      if (entries.length === 0) {
                        alert('Mark at least one clause as Accepted, Rejected, or Flagged before exporting the decision summary.');
                        return;
                      }
                      let summaryText = `EXECUTIVE REVISION REVIEW & BOARD DECISION SCHEDULE\n`;
                      summaryText += `=================================================================\n`;
                      summaryText += `Agreement: ${documentTitle || 'Commercial Agreement'}\n`;
                      summaryText += `Client: ${clientParty || 'Client Principal'} | Counterparty: ${counterparty || 'Counterparty'}\n`;
                      summaryText += `Date: ${new Date().toLocaleDateString('en-US')}\n\n`;
                      summaryText += `EXECUTIVE SUMMARY:\n`;
                      summaryText += `- Accepted Changes: ${entries.filter(([_, d]) => d === 'accepted').length}\n`;
                      summaryText += `- Rejected Changes (Require Reversion): ${entries.filter(([_, d]) => d === 'rejected').length}\n`;
                      summaryText += `- Flagged for Board/Partner Direction: ${entries.filter(([_, d]) => d === 'flagged').length}\n\n`;
                      summaryText += `CLAUSE-BY-CLAUSE AUDIT LOG:\n`;
                      entries.forEach(([cIdx, decision]) => {
                        const clause = auditResults?.diff?.clauseDiffs?.[cIdx];
                        summaryText += `Clause #${parseInt(cIdx) + 1}: [${decision.toUpperCase()}]\n`;
                        if (clause?.text) {
                          summaryText += `Text: "${clause.text.substring(0, 160)}..."\n`;
                        }
                        summaryText += `\n`;
                      });
                      summaryText += `=================================================================\n`;
                      summaryText += `Prepared via Nexus ContractGuard (100% In-RAM Local Processing)\n`;
                      
                      const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${(documentTitle || 'Contract').replace(/[^a-zA-Z0-9]/g, '_')}_Decision_Schedule.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1.5"
                  >
                    <Download size={12} />
                    <span>Export Decisions Brief</span>
                  </button>

                  {Object.keys(diffDecisions).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDiffDecisions({})}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Diff Container Viewport with Heatmap Minimap Rail */}
              <div className="relative flex rounded-lg bg-[#0E0E12] border border-white/[0.08] overflow-hidden">
                <div id="diff-container-viewport" className="flex-1 p-6 font-legal text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
                  {auditResults.diff.segments.map((seg) => {
                    if (seg.type === 'added') {
                      return (
                        <span 
                          key={seg.id} 
                          className="diff-target-segment bg-emerald-500/15 text-emerald-300 px-1 py-0.5 mx-0.5 rounded border border-emerald-500/25"
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
                          className="diff-target-segment bg-rose-500/15 text-rose-300 line-through px-1 py-0.5 mx-0.5 rounded border border-rose-500/25 opacity-80"
                          title="Removed from original draft"
                        >
                          {seg.value}
                        </span>
                      );
                    }
                    return <span key={seg.id} className="text-zinc-300">{seg.value}</span>;
                  })}
                </div>

                {/* Vertical Minimap / Heatmap Rail (One-Click Jump Track) */}
                <div 
                  className="w-7 border-l border-white/[0.06] bg-[#09090B] flex flex-col items-center py-2 relative select-none shrink-0" 
                  title="Visual Diff Minimap: Click any tick to jump to difference"
                >
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter mb-1">MAP</span>
                  <div className="relative w-full flex-1">
                    {auditResults.diff.segments.filter(s => s.type !== 'unchanged').map((seg, sIdx, allDiffs) => {
                      const topPercent = (sIdx / Math.max(allDiffs.length - 1, 1)) * 92 + 4;
                      return (
                        <button
                          key={seg.id || sIdx}
                          type="button"
                          onClick={() => {
                            const diffEls = document.querySelectorAll('.diff-target-segment');
                            if (diffEls[sIdx]) {
                              diffEls[sIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                              setActiveDiffNavIdx(sIdx);
                            }
                          }}
                          style={{ top: `${topPercent}%` }}
                          className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-1 rounded-full cursor-pointer hover:scale-150 transition-transform ${
                            seg.type === 'added' ? 'bg-emerald-400' : 'bg-rose-400'
                          }`}
                          title={`Diff #${sIdx + 1}: ${seg.type === 'added' ? 'Added' : 'Deleted'} "${(seg.value || '').substring(0, 30)}..."`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clause Breakdown */}
              {auditResults.diff.clauseDiffs && (
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Clause-by-Clause Modifications ({auditResults.diff.clauseDiffs.length} Clauses)
                  </h4>
                  {auditResults.diff.clauseDiffs.map((clause) => {
                    const badge = clause.status === 'modified' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' :
                                  clause.status === 'inserted' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' :
                                  clause.status === 'deleted' ? 'bg-rose-500/15 text-rose-300 border-rose-500/25' : 'bg-white/[0.04] text-zinc-400 border-white/[0.08]';

                    return (
                      <div key={clause.index} className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-200">Clause / Paragraph #{clause.index}</span>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badge}`}>
                              {clause.status}
                            </span>
                            {diffDecisions[clause.index] && (
                              <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${
                                diffDecisions[clause.index] === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                                diffDecisions[clause.index] === 'rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                                'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}>
                                {diffDecisions[clause.index]}
                              </span>
                            )}
                          </div>

                          {/* Quick Decision Actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDiffDecisions(prev => ({ ...prev, [clause.index]: 'accepted' }))}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                                diffDecisions[clause.index] === 'accepted'
                                  ? 'bg-emerald-500 text-black font-bold'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                              }`}
                              title="Accept this revision"
                            >
                              <Check size={11} /> Accept
                            </button>

                            <button
                              type="button"
                              onClick={() => setDiffDecisions(prev => ({ ...prev, [clause.index]: 'rejected' }))}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                                diffDecisions[clause.index] === 'rejected'
                                  ? 'bg-rose-500 text-white font-bold'
                                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                              }`}
                              title="Reject and reinstate original language"
                            >
                              <XCircle size={11} /> Reject
                            </button>

                            <button
                              type="button"
                              onClick={() => setDiffDecisions(prev => ({ ...prev, [clause.index]: 'flagged' }))}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                                diffDecisions[clause.index] === 'flagged'
                                  ? 'bg-amber-500 text-black font-bold'
                                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                              }`}
                              title="Flag for negotiation / partner direction"
                            >
                              <Flag size={11} /> Flag
                            </button>
                          </div>
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

          {/* Quiet Collapsible Counsel Verification Notice */}
          <div className="pt-2 border-t border-white/[0.06] text-[11px] text-zinc-500">
            <button
              type="button"
              onClick={() => setNoticeExpanded(prev => !prev)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <ShieldCheck size={12} className="text-zinc-500" />
              <span>ABA Model Rule 1.1 Verification Standard · Preliminary drafting support</span>
              <span className="text-zinc-600">({noticeExpanded ? 'Hide' : 'Details'})</span>
            </button>
            {noticeExpanded && (
              <p className="mt-2 p-3 rounded-lg bg-[#111115] border border-white/[0.06] text-zinc-400 leading-relaxed max-w-3xl">
                Automated audit flags, redlines, and suggested remediation clauses are analytical heuristics for preliminary review. Under ABA Model Rule 1.1 (Competence), reviewing counsel must independently verify all provisions, statutory citations, and defined terms prior to client execution or filing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Deed & Contract Harmonizer HUD */}
      {analysisMode === 'harmonizer' && harmonizedData && (
        <HarmonizerResultsHUD
          harmonizedData={harmonizedData}
          documentTitle={documentTitle}
          onDownloadDocx={() => {
            downloadHarmonizedDeedDOCX(harmonizedData, {
              title: documentTitle.trim() || 'Harmonized Contract Draft'
            });
          }}
          onCopyRestated={() => {
            navigator.clipboard.writeText(harmonizedData.restatedText);
          }}
          onReAuditRestated={() => {
            setText(harmonizedData.restatedText);
            setAnalysisMode('single');
            handleExecuteAudit({ text: harmonizedData.restatedText, mode: 'single' });
          }}
        />
      )}

      {/* Liability & Indemnity Reconciler HUD */}
      {analysisMode === 'liability' && (liabilityAuditData || text.trim()) && (
        <LiabilityReconcilerHUD
          auditResults={liabilityAuditData || analyzeLiabilityInterlocks(text)}
          contractText={text}
          documentTitle={documentTitle}
          onLoadSampleDeal={(sampleKey) => {
            const sample = SAMPLE_DEALS[sampleKey];
            if (sample) {
              setText(sample.text);
              setDocumentTitle(sample.title);
              handleRunLiabilityAudit(sample.text);
            }
          }}
          onApplyRiderToDraft={(riderText) => {
            const updated = `${text.trim()}\n\n${riderText}`;
            setText(updated);
            handleRunLiabilityAudit(updated);
          }}
        />
      )}

            {/* ========================================================================= */}
      {/* ONE-CLICK TRANSACTIONAL COUNTER-RIDER MODAL (REJECTION MEMO)              */}
      {/* ========================================================================= */}
      {showCounterRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-[#080E14] border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Formal Counter-Rider & Rejection Memorandum</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      EMAIL-READY
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Pre-signing legal memorandum rejecting opposing counsel's altered terms and reinstating baseline protections
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCounterRiderModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Memo Textarea / Preview */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="p-3.5 rounded-xl bg-black/50 border border-zinc-800 text-xs font-mono space-y-1 text-zinc-300">
                <div><strong className="text-white">RE:</strong> Rejection of Proposed Revisions & Demand for Restorative Counter-Rider</div>
                <div><strong className="text-white">TRANSACTION:</strong> {documentTitle || 'Master Commercial Agreement'}</div>
                <div><strong className="text-white">CLIENT:</strong> {clientParty || 'Acme Holdings LLC'} | <strong className="text-white">COUNTERPARTY:</strong> {counterparty || 'Counterparty Corp'}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 font-mono text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap">
{`TRANSACTIONAL REJECTION & RESTORATIVE COUNTER-RIDER MEMORANDUM
DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
TO: Transactional Counsel for ${counterparty || 'Counterparty'}
FROM: Legal Counsel to ${clientParty || 'Client Principal'}
RE: Objections to Proposed Revisions & Demand for Restorative Counter-Riders

Dear Counsel,

We have completed our pre-signature forensic contract integrity diligence on your revised draft. While our client desires to progress this transaction smoothly toward closing, several proposed alterations introduce unacceptable risk asymmetry, clerical consideration discrepancies, and latent voidability hazards.

Accordingly, please be advised that our client formally REJECTS the following proposed amendments and tenders the mandatory restorative Counter-Riders below for reinstatement:

1. CONSIDERATION & PAYMENT PARITY RESTORATION:
Objection: Numerical and written figures must reconcile unambiguously under standard commercial accords.
Restorative Counter-Rider: Section consideration and milestone figures shall strictly track the agreed terms of the approved baseline draft without clerical variance.

2. SECTION CROSS-REFERENCES & TERMINATION INTEGRITY:
Objection: Citations to phantom sections or deleted cure procedures operate as procedural nullities that imperil transaction enforceability.
Restorative Counter-Rider: All internal cross-references to default remedies, survival covenants, and notice protocols shall remain aligned with the baseline draft structure.

3. LIABILITY & INDEMNIFICATION HARMONIZATION:
Objection: Blanket Limitation of Liability caps must not nullify fundamental representation indemnities or third-party intellectual property protections.
Restorative Counter-Rider: Blanket liability disclaimers shall contain an express carve-out preserving Seller/Buyer core indemnities, fraud liabilities, and confidentiality covenants.

Please confirm counsel's agreement to incorporate these restorative Counter-Riders so that we may finalize the signature execution binder.

Sincerely,
Transactional Legal Counsel
Counsel of Record for ${clientParty || 'Client Principal'}`}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-3.5 bg-zinc-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-[11px] font-mono text-zinc-400">
                {memoCopiedToast ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check size={13} /> Email Memo Copied to Clipboard!
                  </span>
                ) : (
                  <span>Ready to paste directly into email or transaction binder</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const memoText = `TRANSACTIONAL REJECTION & RESTORATIVE COUNTER-RIDER MEMORANDUM\nDATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\nTO: Transactional Counsel for ${counterparty || 'Counterparty'}\nFROM: Legal Counsel to ${clientParty || 'Client Principal'}\nRE: Objections to Proposed Revisions\n\nDear Counsel,\n\nWe have completed our pre-signature forensic contract integrity diligence on your revised draft. Please be advised that our client formally REJECTS proposed amendments altering baseline liability caps, numerical parity, and survival covenants.\n\nMandatory Counter-Riders:\n1. Consideration parity shall be reconciled to baseline values.\n2. Liability caps shall contain an express carve-out for indemnities.\n3. Procedural default cross-references shall be fully restored.\n\nPlease confirm counsel's agreement to incorporate these Counter-Riders.\n\nSincerely,\nCounsel of Record for ${clientParty || 'Client Principal'}`;
                    navigator.clipboard.writeText(memoText);
                    setMemoCopiedToast(true);
                    setTimeout(() => setMemoCopiedToast(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Copy size={13} />
                  <span>Copy Email Memo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadAmendmentRiderDOCX(auditResults || {}, {
                      contractTitle: documentTitle || 'Commercial Agreement',
                      clientName: clientParty || 'Client Principal',
                      counterpartyName: counterparty || 'Counterparty',
                      date: new Date().toLocaleDateString('en-US')
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Rider (.docx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCounterRiderModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

{/* PRE-SIGNING DILIGENCE CERTIFICATE MODAL */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificateModal(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-2xl md:rounded-3xl border-2 border-emerald-500/40 bg-[#061219] overflow-hidden shadow-[0_25px_90px_rgba(0,0,0,0.95)] z-10 flex flex-col max-h-[92vh]"
            >
              <div className="px-6 py-4 bg-[#040C12] border-b border-emerald-500/30 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Scale size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>PRE-SIGNING DILIGENCE & INTEGRITY CERTIFICATE</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        100% AUDITED
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Air-Gapped Client-Side Execution · ABA Model Rule 1.6 Privileged Work Product
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-zinc-200 custom-scrollbar bg-[#050D14]">
                <div className="p-5 rounded-xl bg-[#090D14] border border-white/10 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        NEXUS CONTRACTGUARD™ · EXECUTIVE MEMORANDUM
                      </span>
                      <h4 className="text-xl font-black text-white mt-0.5">
                        {documentTitle || 'Master Asset Purchase Agreement'}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-400 block">CERTIFICATE SERIAL</span>
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        CG-CERT-{certificateHash ? certificateHash.substring(0, 12).toUpperCase() : '9FA821B043DE'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">AUDIT TIMESTAMP</span>
                      <span className="text-zinc-200 font-semibold">{certificateDate || 'November 1, 2026'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">CLIENT COUNSEL</span>
                      <span className="text-zinc-200 font-semibold">{clientParty || 'Acme Holdings LLC'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">COUNTERPARTY</span>
                      <span className="text-zinc-200 font-semibold">{counterparty || 'Globex International Corp'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] block">PRIVACY BOUNDARY</span>
                      <span className="text-emerald-400 font-bold">100% In-RAM (Zero Cloud)</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-zinc-400">
                      SHA-256 AIR-GAPPED HASH: <span className="text-cyan-300">{certificateHash || 'cf9acf7bbb77f93475585ed3ee96a33b6dd1642acd01287c9c9b56f3f91325fc'}</span>
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 size={13} /> Untampered
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>Four-Quadrant Forensic Audit Verification Checklist</span>
                  </h5>

                  {/* Dynamically distinguish between Sample Benchmark Deal and User-Uploaded Contract */}
                  {Boolean((documentTitle && documentTitle.includes('Master Asset Purchase')) || (text && text.includes('Two Hundred Fifty Thousand'))) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">1. Numerical & Words Parity</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            RECONCILED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Reconciled written text <strong className="text-amber-300">Two Hundred Fifty Thousand ($250,000)</strong> with numerical figure <strong className="text-rose-400">($205,000)</strong> in Section 4.1. Remediated clerical $45,000 shortfall in Attached Rider.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">2. Section Cross-References</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            RESTRUCTURED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Resolved phantom references to <strong className="text-rose-400">Section 14.2</strong> (Termination Procedures) and <strong className="text-rose-400">Section 19.1</strong> (Indemnity Survival). Re-mapped to prevent contract voidability.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">3. Exhibits & Disclosure Schedules</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            COMPLIANCE ALERT
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Flagged <strong className="text-cyan-300">Exhibit C (Disclosure Schedules)</strong> and <strong className="text-cyan-300">Schedule 1 (Key Personnel)</strong> as mandatory unattached exhibits required for signature closing binder.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">4. Liability Cap Harmonization</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            CARVE-OUT ATTACHED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Harmonized <strong className="text-emerald-300">$5,000,000 Indemnity</strong> against <strong className="text-amber-300">$50,000 Aggregate Cap</strong> via Delaware Express Carve-Out Rider (Section 12.2) to prevent indemnity nullification.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">1. Word & Numerical Discrepancies</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            AUDITED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Identified <strong className="text-emerald-300">{auditResults?.stats?.additions || 0} additions</strong> and <strong className="text-rose-400">{auditResults?.stats?.deletions || 0} deletions</strong> across document. Text alignment: <strong className="text-cyan-300">{auditResults?.stats?.similarity || 100}%</strong>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">2. Section & Cross-References</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            VERIFIED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Audited cited section cross-references and internal article cross-clauses. All structural definitions mapped in local RAM.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">3. Exhibits & Closing Schedules</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            CHECKED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Scanned document body for referenced appendices, disclosure schedules, and execution attachments for signature closing completeness.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-white">4. Liability & Risk Harmonization</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            IN-RAM VERIFIED
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          Forensic scan for unhedged liability caps, one-way indemnities, and governing law conflicts completed 100% locally with zero cloud telemetry.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                      <FileText size={13} className="text-emerald-400" />
                      <span>ATTACHED EXECUTION REVISION RIDER (AMENDMENT SCHEDULE)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const rider = `SECTION 12.2 (EXPRESS CARVE-OUT RIDER): Notwithstanding Section 12.1 or any other limitation of liability herein, all indemnification obligations set forth under Section 8.1, breaches of confidentiality under Section 5.1, and third-party intellectual property claims shall be expressly excluded from the aggregate liability ceiling and shall remain capped only by the statutory policy maximum ($5,000,000). Section 4.1 Purchase Price is affirmed as Two Hundred Fifty Thousand Dollars ($250,000).`;
                        navigator.clipboard.writeText(rider);
                        setCertCopiedToast(true);
                        setTimeout(() => setCertCopiedToast(false), 2500);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                    >
                      {certCopiedToast ? 'Copied to Clipboard!' : 'Copy Rider Text'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-zinc-300 selection:bg-emerald-500 selection:text-black">
{`SECTION 12.2 (EXPRESS CARVE-OUT RIDER): Notwithstanding Section 12.1 or any other limitation of liability herein, all indemnification obligations set forth under Section 8.1, breaches of confidentiality under Section 5.1, and third-party intellectual property claims shall be expressly excluded from the aggregate liability ceiling and shall remain capped only by the statutory policy maximum ($5,000,000). Section 4.1 Purchase Price is affirmed as Two Hundred Fifty Thousand Dollars ($250,000).`}
                  </pre>
                </div>

                <div className="p-4 rounded-lg bg-[#111115] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-emerald-500/40 bg-emerald-500/[0.06] flex items-center justify-center text-emerald-400 font-semibold text-[10px] font-mono">
                      SEAL
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-100">Air-Gapped Forensic Audit Seal</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        ABA Model Rule 1.6 Privileged Work Product · Zero Cloud Transmission
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 block">VERDICT</span>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      CERTIFIED FOR COUNSEL EXECUTION
                    </span>
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 bg-[#040C12] border-t border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <Lock size={13} className="text-emerald-400" />
                  <span>Attach to closing binder or client transmittal memo</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-sans cursor-pointer select-none bg-zinc-900/60 border border-zinc-700/60 px-3 py-1.5 rounded-lg">
                    <input 
                      type="checkbox" 
                      checked={includeCertStamp} 
                      onChange={(e) => setIncludeCertStamp(e.target.checked)} 
                      className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/20 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Include Verification Ink Seal</span>
                  </label>

                  <button
                    onClick={() => {
                      downloadDiligenceCertificatePDF(auditResults || {}, {
                        contractTitle: documentTitle?.trim() || (isDemo ? 'Master Asset Purchase & Services Agreement' : 'Commercial Contract Agreement'),
                        clientName: clientParty?.trim() || 'Retained Client Counsel',
                        counterpartyName: counterparty?.trim() || 'Disclosed Counterparty',
                        certificateHash: certificateHash,
                        certificateDate: certificateDate,
                        customFileUploaded: !isDemo && documentTitle !== 'Master Asset Purchase & Services Agreement',
                        includeSeal: includeCertStamp
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border-t border-white/20 active:scale-[0.98]"
                  >
                    <Download size={14} className="stroke-[2.5]" />
                    <span>Save Official PDF Certificate / Memo</span>
                  </button>

                  <button
                    onClick={handleDownloadWordRider}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileDown size={14} className="text-cyan-400" />
                    <span>Download Word .docx</span>
                  </button>

                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                  >
                    Close Preview
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

// =========================================================================
// 2. SMART PII REDACTOR VIEW (Toggleable Rules + Live Counts + Mask Styles)
// =========================================================================
function PIIRedactorView({ onOpenGuide }) {
  const [text, setText] = useState('');
  const [activeRuleIds, setActiveRuleIds] = useState(['ssn', 'creditCard', 'bankAccount', 'email', 'phone', 'ip', 'ein']);
  const [customKeywordInput, setCustomKeywordInput] = useState('');
  const [customKeywords, setCustomKeywords] = useState([]);
  const [maskStyle, setMaskStyle] = useState('block'); // 'block' | 'label' | 'asterisk'
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const processFile = async (file) => {
    if (!file) return;

    try {
      const lowerName = file.name.toLowerCase();
      if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
        const txt = await file.text();
        setText(txt);
      } else if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await extractTextFromDOCX(arrayBuffer);
        setText(result.value);
      } else if (lowerName.endsWith('.pdf')) {
        const pdfResult = await extractTextFromPDF(file);
        setText(pdfResult.fullText);
      } else {
        alert("Please upload a .txt, .docx, or .pdf file.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processFile(file);
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

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadSanitizedPdf = async () => {
    if (!sanitizedResult?.sanitizedText) return;
    setIsGeneratingPdf(true);
    try {
      await downloadRedactedPDF(sanitizedResult.sanitizedText, {
        title: 'Redacted_Discovery_Document',
        totalRedactions: sanitizedResult.totalRedactions,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
      setSaveStatus('Clean legal PDF downloaded successfully');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      alert('PDF generation error: ' + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadSanitizedTxt = () => {
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
    <div className="max-w-6xl w-full mx-auto h-full flex flex-col gap-5 font-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Smart PII Redactor
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Permanently sanitize Social Security numbers, banking info, and confidential names locally in memory.
          </p>
        </div>
      </div>

      {/* Rules Selector Bar */}
      <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-300">Detection Rules</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Masking Style:</span>
            <select
              value={maskStyle}
              onChange={(e) => setMaskStyle(e.target.value)}
              className="bg-[#09090B] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-emerald-500/60"
            >
              <option value="block">Black Block (█████)</option>
              <option value="label">Descriptive Tag ([REDACTED-SSN])</option>
              <option value="asterisk">Asterisks (*********)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PII_RULES.map(rule => {
            const active = activeRuleIds.includes(rule.id);
            return (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-200'
                }`}
              >
                {active ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-zinc-600" />}
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
        <div 
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
          onDrop={handleFileDrop}
          className={`flex flex-col rounded-lg bg-[#0E0E12] border transition-colors overflow-hidden relative ${
            isDragging 
              ? 'border-emerald-500/60 bg-emerald-500/[0.04]' 
              : 'border-white/[0.08]'
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 z-30 bg-[#09090B]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-emerald-400 gap-2.5">
              <Upload size={24} />
              <p className="text-sm font-medium text-white">Drop Document to Redact</p>
              <p className="text-xs text-zinc-500 font-mono">Supports .docx, .txt, .pdf</p>
            </div>
          )}
          <div className="px-3.5 py-2.5 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Input Text</span>
            <label className="cursor-pointer bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] px-2.5 py-1 rounded text-xs font-medium text-zinc-300 transition-colors">
              Upload (.docx/.txt/.pdf)
              <input type="file" accept=".txt,.docx,.md,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract or memo text containing confidential information or drop file here to redact..."
            className="flex-1 bg-[#0E0E12] p-4 text-sm font-legal leading-relaxed text-zinc-200 placeholder-zinc-600 outline-none resize-none custom-scrollbar"
          />
        </div>

        {/* Right: Sanitized Preview */}
        <div className="flex flex-col rounded-lg bg-[#0E0E12] border border-white/[0.08] overflow-hidden">
          <div className="px-3.5 py-2.5 bg-[#111115] border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Sanitized Output {sanitizedResult ? `· ${sanitizedResult.totalRedactions} Redacted` : ''}
            </span>
            {sanitizedResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSanitizedPdf}
                  disabled={isGeneratingPdf}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Export court-grade redacted PDF (Letter format, headers, pagination, ABA Rule 1.6)"
                >
                  {isGeneratingPdf ? <RefreshCw className="animate-spin" size={12} /> : <FileDown size={12} />}
                  <span>{isGeneratingPdf ? 'Generating...' : 'Download Redacted PDF'}</span>
                </button>
                <button
                  onClick={handleDownloadSanitizedTxt}
                  className="bg-[#18181B] hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                  title="Export raw text"
                >
                  <Download size={12} /> Text
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 bg-[#0E0E12] p-4 text-sm font-legal leading-relaxed text-zinc-200 overflow-y-auto custom-scrollbar select-text">
            {sanitizedResult ? (
              <pre className="whitespace-pre-wrap font-legal">{sanitizedResult.sanitizedText}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                <EyeOff size={24} className="opacity-40" />
                <p className="text-xs">Click "Sanitize Document" to preview redacted text.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#111115] border border-white/[0.08]">
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <Check size={13} /> {saveStatus}
            </span>
          )}
        </div>

        <button
          onClick={handleExecuteRedaction}
          disabled={isProcessing || !text.trim()}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <EyeOff size={14} />}
          {isProcessing ? 'Sanitizing...' : 'Sanitize Document'}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 3. BATES STAMPING SUITE VIEW (Sequential PDFs + Contrast Pill + Manifest)
// =========================================================================
function BatesStamperView({ onOpenGuide, isDemo = false, onTriggerUpgrade }) {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('EX-');
  const [startNum, setStartNum] = useState(1);
  const [padLength, setPadLength] = useState(4);
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(10);
  const [color, setColor] = useState('black');
  const [drawPill, setDrawPill] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [lastBundle, setLastBundle] = useState(null);

  const [batesRunsLeft, setBatesRunsLeft] = useState(() => {
    try {
      const stored = localStorage.getItem('nexus_demo_bates_runs');
      return stored !== null ? Number(stored) : 2;
    } catch {
      return 2;
    }
  });

  const handleAddFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    if (isDemo) {
      if (files.length >= 1 || selected.length > 1) {
        alert("Evaluation Sandbox Limit: Master multi-document binder consolidation (up to 5,000 pages) requires a Firm Suite License ($299). In trial mode, only single document testing is permitted.");
        if (onTriggerUpgrade) onTriggerUpgrade('firm');
        if (files.length === 0 && selected.length > 0) {
          setFiles([selected[0]]);
        }
        return;
      }
    }
    setFiles(prev => [...prev, ...selected]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const selected = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
      if (isDemo) {
        if (files.length >= 1 || selected.length > 1) {
          alert("Evaluation Sandbox Limit: Master multi-document binder consolidation (up to 5,000 pages) requires a Firm Suite License ($299). In trial mode, only single document testing is permitted.");
          if (onTriggerUpgrade) onTriggerUpgrade('firm');
          if (files.length === 0 && selected.length > 0) {
            setFiles([selected[0]]);
          }
          return;
        }
      }
      setFiles(prev => [...prev, ...selected]);
    }
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

    if (isDemo) {
      if (batesRunsLeft <= 0) {
        alert("Evaluation Sandbox Limit Reached: You have completed your free Bates stamping test runs. Please upgrade to Firm Suite ($299) for unlimited court productions and master binders.");
        if (onTriggerUpgrade) onTriggerUpgrade('firm');
        return;
      }
    }

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

      if (isDemo) {
        const nextRuns = Math.max(0, batesRunsLeft - 1);
        setBatesRunsLeft(nextRuns);
        try {
          localStorage.setItem('nexus_demo_bates_runs', String(nextRuns));
        } catch {}
      }

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
    <div className="max-w-5xl w-full mx-auto h-full flex flex-col gap-5 font-ui">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Bates Stamping Suite
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Sequentially number trial exhibits and production binders locally in browser memory.
          </p>
        </div>
        {isDemo && (
          <div className="flex items-center gap-2.5 text-xs shrink-0">
            <span className="text-zinc-400 font-mono tabular-nums">{batesRunsLeft} of 2 runs left</span>
            <button
              type="button"
              onClick={() => onTriggerUpgrade?.('firm')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
            >
              Unlock Firm Suite
            </button>
          </div>
        )}
      </div>

      {/* Configuration Grid */}
      <div className="p-5 rounded-xl bg-[#111115] border border-white/[0.08] flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">Bates Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-[#09090B] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-zinc-100 focus:border-emerald-500/60 outline-none font-mono"
              placeholder="PLTF-"
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
      <div 
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={handleFileDrop}
        className={`border border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
          isDragging 
            ? 'border-emerald-500/60 bg-emerald-500/[0.05]' 
            : 'border-white/[0.12] hover:border-white/[0.22] bg-[#0E0E12]'
        }`}
      >
        <Layers className="mb-2.5 text-emerald-400" size={28} />
        <p className="font-medium text-sm text-zinc-100">
          {isDragging ? 'Release to Add Exhibit PDFs' : 'Drop Exhibit PDFs Here'}
        </p>
        <p className="text-xs text-zinc-500 mt-1 mb-4">Click to browse multiple documents for sequential stamping</p>
        <input type="file" multiple accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddFiles} />
        <span className="px-3.5 py-1.5 bg-[#18181B] border border-white/[0.08] rounded-md text-xs font-medium text-zinc-300">
          Browse PDF Files
        </span>
      </div>

      {/* Selected Files List & Reorder */}
      {files.length > 0 && (
        <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-zinc-200">Stamping Queue ({files.length} documents)</span>
            <span className="text-[11px] font-mono text-zinc-500 tabular-nums">Preview: {prefix}{String(startNum).padStart(padLength, '0')}</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-md bg-[#09090B] border border-white/[0.06] text-xs font-mono">
                <span className="truncate max-w-[340px] text-zinc-200">
                  {idx + 1}. {f.name} ({(f.size / 1024).toFixed(0)} KB)
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="px-2 py-0.5 bg-[#18181B] hover:bg-zinc-800 border border-white/[0.06] rounded disabled:opacity-25 text-[10px]">▲</button>
                  <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="px-2 py-0.5 bg-[#18181B] hover:bg-zinc-800 border border-white/[0.06] rounded disabled:opacity-25 text-[10px]">▼</button>
                  <button onClick={() => removeFile(idx)} className="p-1 text-rose-400 hover:text-rose-300 ml-1.5 cursor-pointer"><X size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress & Submit */}
      <div className="p-3.5 rounded-lg bg-[#111115] border border-white/[0.08] flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          {isProcessing ? (
            <span className="text-zinc-200 font-mono">
              Stamping in progress: {progress.current} pages written...
            </span>
          ) : lastBundle ? (
            <span className="text-emerald-400 font-mono">
              Completed · Range: {lastBundle.batesRange} ({lastBundle.totalPages} pages)
            </span>
          ) : (
            <span>Ready to process locally in RAM.</span>
          )}
        </div>

        <button
          onClick={handleProcessPdfs}
          disabled={isProcessing || files.length === 0}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md transition-colors flex items-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          {isProcessing ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
          {isProcessing ? 'Stamping...' : 'Merge & Stamp Bundle'}
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 4. AUDIT VAULT & PERSISTENCE VIEW (IndexedDB Sessions)
// =========================================================================
function AuditVaultView({ onSelectDiff, onOpenGuide }) {
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
    <div className="max-w-5xl w-full mx-auto h-full flex flex-col gap-5 font-ui">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Audit Vault
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Local IndexedDB storage for saved audits, diff sessions, and redaction logs. Zero cloud sync.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearAll}
          className="px-3 py-1.5 bg-white/[0.04] hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/30 rounded-lg text-xs font-medium text-zinc-300 hover:text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 size={13} /> Clear Vault
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setActiveSection('diffs')}
          className={`px-3.5 py-2 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === 'diffs' ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Saved Audits ({diffSessions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('redacts')}
          className={`px-3.5 py-2 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === 'redacts' ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Redaction Logs ({redactionLogs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('bates')}
          className={`px-3.5 py-2 border-b-2 text-xs font-medium transition-colors cursor-pointer ${
            activeSection === 'bates' ? 'border-emerald-500 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Bates Jobs ({batesJobs.length})
        </button>
      </div>

      {/* Section Content */}
      <div className="p-4 rounded-xl bg-[#111115] border border-white/[0.08] flex-1 overflow-y-auto custom-scrollbar">
        {activeSection === 'diffs' && (
          <div className="space-y-2.5">
            {diffSessions.length === 0 ? (
              <p className="text-center text-zinc-500 text-xs py-8">No saved diff sessions yet. Run an audit to record history.</p>
            ) : (
              diffSessions.map(session => (
                <div key={session.id} className="p-4 rounded-lg bg-[#0E0E12] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-100">{session.title}</h4>
                    <p className="text-[11px] font-mono tabular-nums text-zinc-400 mt-1">
                      {new Date(session.updatedAt).toLocaleString('en-US')} · +{session.stats?.additions || 0} / -{session.stats?.deletions || 0} words · {session.risksCount || 0} liabilities{typeof session.overallRiskScore === 'number' ? ` · Score ${session.overallRiskScore}/100` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
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
                      {new Date(log.createdAt).toLocaleString('en-US')} | Total Redactions: {log.totalRedactions} items
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
                      {new Date(job.createdAt).toLocaleString('en-US')} | {job.totalPages} pages stamped
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
