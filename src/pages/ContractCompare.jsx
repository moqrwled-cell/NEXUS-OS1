import React, { useState, useEffect, useMemo } from 'react';
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
  BookOpen, FileDown, ArrowRight, Sparkles
} from 'lucide-react';
import * as mammoth from 'mammoth';

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
import { 
  verifyDeviceLicense, 
  getDeviceFingerprint, 
  deactivateLicenseFromDevice 
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
import LegalTemplatesView from '../components/LegalTemplatesView';
import PirateTrapModal from '../components/PirateTrapModal';

export default function ContractCompare() {
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | bates | redact | history | templates
  const [showDeviceModal, setShowDeviceModal] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [restoredSession, setRestoredSession] = useState(null);

  // Check auth
  useEffect(() => {
    if (verifyToolAccess('contractcompare') || verifyToolAccess('all')) {
      setIsUnlocked(true);
      setShowDeviceModal(false);
    } else {
      setIsUnlocked(false);
      setShowDeviceModal(true);
    }
  }, []);

  // Workstation Hardware & License Settings State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [workstationFp, setWorkstationFp] = useState('');

  const loadDeviceLicenseData = async () => {
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
    loadDeviceLicenseData();
  }, [isUnlocked, showSettingsModal]);

  const handleDeactivate = () => {
    const res = deactivateLicenseFromDevice();
    if (res && res.success) {
      setIsUnlocked(false);
      setShowSettingsModal(false);
      setShowDeviceModal(true);
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
    <div className="min-h-screen bg-[#F7F9FA] text-[#0F1B2A] font-ui flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[linear-gradient(to_right,#0F1B2A08_1px,transparent_1px),linear-gradient(to_bottom,#0F1B2A08_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Sidebar — Institutional AmLaw 100 Legal Studio */}
      <aside className="w-full md:w-[280px] bg-[#0C2A42] text-white border-r border-[#123B5C] flex flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-[#123B5C]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#123B5C] border border-[#0E6B52]/60 flex items-center justify-center shadow-sm">
                <ShieldAlert className="text-[#0E6B52]" size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight font-ui">ContractGuard</h1>
                <p className="text-[10px] text-[#A0B3C6] font-mono tracking-wider uppercase">Air-Gapped Legal Studio</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#D9E1E7] bg-[#123B5C] border border-[#1E4D74] px-2 py-0.5 rounded-md font-semibold">v2.4 Pro</span>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0E6B52]/20 border border-[#0E6B52]/40 text-[10px] text-[#A3E635] font-mono font-medium">
            <ShieldCheck size={12} className="shrink-0 text-[#4ADE80]" />
            <span className="text-[#E2E8F0]">Air-Gapped · In-RAM · Zero Cloud</span>
          </div>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] uppercase tracking-[0.15em] text-[#8EA3B7] font-semibold px-2 mb-1 font-ui">Workstation Modules</p>

          {/* Module 1: Deterministic Fact-Checking Engine */}
          <button
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-ui ${
              activeTool === 'analyzer'
                ? 'bg-[#123B5C] text-white border-l-4 border-l-[#0E6B52] shadow-sm'
                : 'text-[#D9E1E7] hover:bg-[#123B5C]/60 hover:text-white'
            }`}
          >
            <ShieldCheck size={16} className={activeTool === 'analyzer' ? 'text-[#4ADE80] shrink-0' : 'text-[#8EA3B7] shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Deterministic Fact-Checking Engine</p>
              <p className="text-[10px] text-[#A0B3C6] mt-0.5 truncate">0% Hallucination · Mathematical Audit</p>
            </div>
            {activeTool === 'analyzer' && <div className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] shrink-0" />}
          </button>
          {activeTool === 'analyzer' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-[#081F33] border border-[#1E4D74]">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#4ADE80] font-bold mb-2 flex items-center justify-between font-ui">
                <span>MATHEMATICAL FORENSICS</span>
                <span className="text-[8px] bg-[#0E6B52]/30 text-[#D9E1E7] px-1.5 py-0.5 rounded font-mono">100% RAM</span>
              </p>
              <div className="space-y-2 text-[11px] leading-relaxed font-ui">
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">①</span>
                  <span><span className="text-white font-semibold">Single Draft Forensic Audit — </span><span className="text-[#CBD5E1]">Deterministic AST verification of broken cross-references, missing exhibits, undefined terms, and financial discrepancies with zero AI hallucinations.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#60A5FA] font-bold shrink-0">②</span>
                  <span><span className="text-white font-semibold">Redline Diff Mode — </span><span className="text-[#CBD5E1]">Myers LCS comparative diff highlighting exact additions and deletions side-by-side.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FBBF24] font-bold shrink-0">③</span>
                  <span><span className="text-white font-semibold">Pre-Signing Court Rider — </span><span className="text-[#CBD5E1]">One-click generation of court-ready Pre-Signing Amendment Rider (PDF/HTML/Copy) and Client Memo.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 2: PII Redactor */}
          <button
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-ui ${
              activeTool === 'redact'
                ? 'bg-[#123B5C] text-white border-l-4 border-l-[#0E6B52] shadow-sm'
                : 'text-[#D9E1E7] hover:bg-[#123B5C]/60 hover:text-white'
            }`}
          >
            <EyeOff size={16} className={activeTool === 'redact' ? 'text-[#4ADE80] shrink-0' : 'text-[#8EA3B7] shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
              <p className="text-[10px] text-[#A0B3C6] mt-0.5 truncate">Identity & financial scrub</p>
            </div>
            {activeTool === 'redact' && <div className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] shrink-0" />}
          </button>
          {activeTool === 'redact' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-[#081F33] border border-[#1E4D74]">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#A0B3C6] font-bold mb-2 font-ui">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed font-ui">
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">①</span>
                  <span><span className="text-white font-semibold">Active Rules — </span><span className="text-[#CBD5E1]">Toggle detection filters for SSN, tax IDs, credit cards, banking info, emails, and phone numbers.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#60A5FA] font-bold shrink-0">②</span>
                  <span><span className="text-white font-semibold">Custom Keywords — </span><span className="text-[#CBD5E1]">Add proprietary client names, company tags, or project titles for automated scrubbing.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FBBF24] font-bold shrink-0">③</span>
                  <span><span className="text-white font-semibold">Masking Style — </span><span className="text-[#CBD5E1]">Choose redaction output: Solid Black Block (█████), Semantic Tag ([REDACTED]), or Asterisks.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: Bates Stamping */}
          <button
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-ui ${
              activeTool === 'bates'
                ? 'bg-[#123B5C] text-white border-l-4 border-l-[#0E6B52] shadow-sm'
                : 'text-[#D9E1E7] hover:bg-[#123B5C]/60 hover:text-white'
            }`}
          >
            <Layers size={16} className={activeTool === 'bates' ? 'text-[#4ADE80] shrink-0' : 'text-[#8EA3B7] shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
              <p className="text-[10px] text-[#A0B3C6] mt-0.5 truncate">Court evidence numbering</p>
            </div>
            {activeTool === 'bates' && <div className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] shrink-0" />}
          </button>
          {activeTool === 'bates' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-[#081F33] border border-[#1E4D74]">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#A0B3C6] font-bold mb-2 font-ui">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed font-ui">
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">①</span>
                  <span><span className="text-white font-semibold">Bates Standard — </span><span className="text-[#CBD5E1]">Official court discovery numbering sequence (e.g. PLTF-0001) applied directly to evidentiary PDFs.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#60A5FA] font-bold shrink-0">②</span>
                  <span><span className="text-white font-semibold">Prefix Attribution — </span><span className="text-[#CBD5E1]">Designate party filing: PLTF (Plaintiff), DEF (Defendant), or CONF (Confidential exhibit).</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FBBF24] font-bold shrink-0">③</span>
                  <span><span className="text-white font-semibold">Contrast Backing — </span><span className="text-[#CBD5E1]">Renders high-contrast white backing pill to ensure legibility across dark scanned exhibits.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Audit Vault */}
          <button
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-ui ${
              activeTool === 'history'
                ? 'bg-[#123B5C] text-white border-l-4 border-l-[#0E6B52] shadow-sm'
                : 'text-[#D9E1E7] hover:bg-[#123B5C]/60 hover:text-white'
            }`}
          >
            <Database size={16} className={activeTool === 'history' ? 'text-[#4ADE80] shrink-0' : 'text-[#8EA3B7] shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
              <p className="text-[10px] text-[#A0B3C6] mt-0.5 truncate">Encrypted local persistence</p>
            </div>
            {activeTool === 'history' && <div className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] shrink-0" />}
          </button>
          {activeTool === 'history' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-[#081F33] border border-[#1E4D74]">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#A0B3C6] font-bold mb-2 font-ui">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed font-ui">
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">①</span>
                  <span><span className="text-white font-semibold">Local Storage — </span><span className="text-[#CBD5E1]">Every audit and redline session is retained in client-side IndexedDB without cloud transmission.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#60A5FA] font-bold shrink-0">②</span>
                  <span><span className="text-white font-semibold">Restore Session — </span><span className="text-[#CBD5E1]">Reopen previous contract reviews, re-examine liabilities, or export updated client memos.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#F87171] font-bold shrink-0">③</span>
                  <span><span className="text-white font-semibold">Purge Vault — </span><span className="text-[#CBD5E1]">Permanently clears local database records to uphold strict client-attorney confidentiality.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 5: Legal Templates Vault */}
          <button
            onClick={() => setActiveTool('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-ui ${
              activeTool === 'templates'
                ? 'bg-[#123B5C] text-white border-l-4 border-l-[#0E6B52] shadow-sm'
                : 'text-[#D9E1E7] hover:bg-[#123B5C]/60 hover:text-white'
            }`}
          >
            <BookOpen size={16} className={activeTool === 'templates' ? 'text-[#4ADE80] shrink-0' : 'text-[#8EA3B7] shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold leading-tight truncate">Template Vault</p>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#081F33] text-[#93C5FD] border border-[#1E4D74] font-mono">AmLaw 100</span>
              </div>
              <p className="text-[10px] text-[#A0B3C6] mt-0.5 truncate">US commercial contract library</p>
            </div>
            {activeTool === 'templates' && <div className="w-1.5 h-1.5 rounded-full bg-[#0E6B52] shrink-0" />}
          </button>
          {activeTool === 'templates' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-[#081F33] border border-[#1E4D74]">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#A0B3C6] font-bold mb-2 font-ui">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed font-ui">
                <div className="flex gap-2">
                  <span className="text-[#4ADE80] font-bold shrink-0">①</span>
                  <span><span className="text-white font-semibold">Standard Library — </span><span className="text-[#CBD5E1]">Institutional Land Purchase, Commercial Lease, MSA, NDA, and APA contracts.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#60A5FA] font-bold shrink-0">②</span>
                  <span><span className="text-white font-semibold">Quick-Fill Form — </span><span className="text-[#CBD5E1]">Type client party names, purchase price, parcel ID, and closing dates to populate instantly.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#FBBF24] font-bold shrink-0">③</span>
                  <span><span className="text-white font-semibold">Audit Integration — </span><span className="text-[#CBD5E1]">Send compiled contract straight to ContractGuard audit engine with one click.</span></span>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Workstation & License Settings Button */}
        <div className="px-3.5 pt-2 pb-1.5 border-t border-[#123B5C]">
          <button
            onClick={() => { setShowSettingsModal(true); loadDeviceLicenseData(); }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#123B5C] hover:bg-[#081F33] border border-[#1E4D74] text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group font-ui"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Settings size={14} className="text-[#4ADE80] group-hover:rotate-45 transition-transform" />
              <span className="truncate">Workstation & License</span>
            </div>
            <span className="text-[9px] font-mono uppercase bg-[#0E6B52]/40 text-white border border-[#0E6B52] px-1.5 py-0.2 rounded font-bold shrink-0">
              {licenseData?.plan === 'firm' ? 'Firm' : 'Solo'}
            </span>
          </button>
        </div>

        {/* Bottom: PWA Install */}
        <div className="px-4 py-3 border-t border-[#123B5C]">
          <button
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 bg-[#123B5C] hover:bg-[#081F33] border border-[#0E6B52] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer font-ui"
          >
            <HardDriveDownload size={14} className="text-[#4ADE80]" />
            Install Offline App (PWA)
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-5 md:p-7 overflow-y-auto z-10 custom-scrollbar flex flex-col font-ui bg-[#F7F9FA]">
        {!isUnlocked ? (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Protected Legal Workspace</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              ContractGuard runs in a 100% air-gapped environment. An authenticated license key is required to access the studio.
            </p>
            <button
              onClick={() => setShowDeviceModal(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Enter License Key
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTool === 'analyzer' && (
              <motion.div key="analyzer" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <ContractAnalyzerView initialSession={restoredSession} />
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
            {activeTool === 'templates' && (
              <motion.div key="templates" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}} className="h-full">
                <LegalTemplatesView onSendToAudit={(contractText, title) => {
                  setRestoredSession({ originalText: contractText, title });
                  setActiveTool('analyzer');
                }} />
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

      <PirateTrapModal
        isOpen={showDeviceModal || !isUnlocked}
        onSuccess={() => {
          setIsUnlocked(true);
          setShowDeviceModal(false);
          loadDeviceLicenseData();
        }}
        toolName="contractcompare"
      />
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-ui"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D9E1E7] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar text-[#0F1B2A]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#D9E1E7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#123B5C]">
              <Settings size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F1B2A] tracking-tight">Workstation & License Settings</h3>
                <span className="text-[9px] font-mono uppercase bg-[#EFF6FF] text-[#123B5C] border border-[#BFDBFE] px-2 py-0.5 rounded font-bold">
                  {licenseData?.plan === 'firm' ? 'Firm Suite' : 'Solo License'}
                </span>
              </div>
              <p className="text-xs text-[#5A6B7A] mt-0.5 font-mono">
                Hardware ID Binding · Cryptographic Seat Governance · Migration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5A6B7A] hover:text-[#0F1B2A] hover:bg-[#F7F9FA] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Workstation Hardware ID */}
        <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold flex items-center gap-1.5">
              <Laptop size={12} className="text-[#123B5C]" />
              <span>Workstation Hardware ID (Device Fingerprint)</span>
            </span>
            <span className="text-[9.5px] font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <ShieldCheck size={11} />
              <span>Bound & Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#FFFFFF] p-2.5 rounded-lg border border-[#D9E1E7] gap-2">
            <span className="font-mono text-xs text-[#0F1B2A] select-all truncate font-semibold">
              {workstationFp || 'DEV-HARDWARE-HASH-LOCAL'}
            </span>
            <button
              onClick={() => copyText(workstationFp, 'workstation_fp')}
              className="px-2.5 py-1 rounded-md bg-[#F7F9FA] hover:bg-[#E5EAEF] text-[#123B5C] border border-[#D9E1E7] text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedField === 'workstation_fp' ? <Check size={12} className="text-[#0E6B52]" /> : <Copy size={12} />}
              <span>{copiedField === 'workstation_fp' ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          <p className="text-[11px] text-[#5A6B7A] leading-relaxed">
            This cryptographic hash uniquely binds ContractGuard to this physical machine's isolated browser environment. All document audits run in local RAM with zero cloud transmission.
          </p>
        </div>

        {/* Section 2: Active License & Seat Info */}
        <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A6B7A] font-bold flex items-center gap-1.5">
              <Key size={12} className="text-[#123B5C]" />
              <span>License Details</span>
            </span>
            <span className="text-xs font-mono text-[#123B5C] font-bold">
              {licenseData?.tierName || (licenseData?.plan === 'firm' ? 'Law Firm Suite (5 Seats)' : 'Solo Practitioner (1 User)')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9E1E7]">
              <span className="text-[10px] font-mono uppercase text-[#5A6B7A]">Current Workstation Role</span>
              <p className="font-semibold text-[#0F1B2A] mt-0.5">
                {isFirmAdmin ? 'Primary Purchaser / Managing Partner (Admin)' : isFirmAssociate ? `Associate Workstation (Seat 0${licenseData?.currentSeatNumber || 2})` : 'Primary Attorney Workstation'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9E1E7]">
              <span className="text-[10px] font-mono uppercase text-[#5A6B7A]">Seat Allocation</span>
              <p className="font-semibold text-[#0F1B2A] mt-0.5">
                Seat {licenseData?.currentSeatNumber || 1} of {licenseData?.plan === 'firm' ? '5 Total Seats' : '1 Seat'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#FFFFFF] p-2.5 rounded-lg border border-[#D9E1E7] gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-mono uppercase text-[#5A6B7A] block">Active Workstation License Key</span>
              <span className="font-mono text-xs text-[#0F1B2A] select-all truncate font-semibold">
                {licenseData?.primaryKey || 'CG-ACTIVE-KEY'}
              </span>
            </div>
            <button
              onClick={() => copyText(licenseData?.primaryKey, 'primary_key')}
              className="px-2.5 py-1 rounded-md bg-[#F7F9FA] hover:bg-[#E5EAEF] text-[#123B5C] border border-[#D9E1E7] text-xs font-mono flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedField === 'primary_key' ? <Check size={12} className="text-[#0E6B52]" /> : <Copy size={12} />}
              <span>{copiedField === 'primary_key' ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Law Firm Suite Multi-Seat Provisioning */}
        {isFirmAdmin && seatKeys.length > 0 && (
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#123B5C] font-bold flex items-center gap-1.5">
                <Users size={13} />
                <span>Firm Workstation Keys (5 Seats Included)</span>
              </span>
              <button
                onClick={handleDownloadTeamKeys}
                className="px-2.5 py-1 rounded-md bg-[#123B5C] text-white text-[11px] font-mono font-bold flex items-center gap-1.5 hover:bg-[#0C2A42] transition-colors cursor-pointer"
              >
                <Download size={11} />
                <span>Download Team Keys (.txt)</span>
              </button>
            </div>

            <p className="text-[11px] text-[#5A6B7A] leading-snug">
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
                        ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#0F1B2A]'
                        : 'bg-[#F7F9FA] border-[#D9E1E7] text-[#0F1B2A]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCurrent ? 'bg-[#0E6B52] text-white' : 'bg-[#D9E1E7] text-[#0F1B2A]'
                      }`}>
                        SEAT 0{seat.seatNumber || idx + 1}
                      </span>
                      <span className="font-mono text-xs truncate">{seat.key}</span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono text-[#0E6B52] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                          This Workstation
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => copyText(seat.key, `seat_${idx}`)}
                      className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#D9E1E7] hover:bg-[#F7F9FA] text-[#123B5C] text-[11px] font-mono flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-auto"
                    >
                      {copiedField === `seat_${idx}` ? <Check size={11} className="text-[#0E6B52]" /> : <Copy size={11} />}
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
          <div className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#123B5C] font-bold flex items-center gap-1.5">
              <User size={13} />
              <span>Associate Workstation License</span>
            </span>
            <p className="text-[11px] text-[#5A6B7A] leading-relaxed">
              Your workstation is authenticated under an enterprise Law Firm Suite seat allocation. Firm administrative keys and additional seat distribution are restricted to your firm's primary license administrator.
            </p>
          </div>
        )}

        {/* Section 4: License Migration & Deactivation */}
        <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92400E] font-bold flex items-center gap-1.5">
              <RotateCcw size={13} />
              <span>Transfer License to a New Computer</span>
            </span>
            <span className="text-[9.5px] font-mono text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded font-bold">
              Device Migration
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#FDE68A] text-[11.5px] text-[#0F1B2A] leading-relaxed space-y-1.5">
            <p className="font-semibold text-[#0F1B2A]">How to migrate to another machine:</p>
            <div className="space-y-1 text-[#5A6B7A] text-xs">
              <div className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">1.</span>
                <span>Click <strong>"Deactivate from this Machine"</strong> below to release the hardware lock.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">2.</span>
                <span>Copy your license key: <code className="text-[#123B5C] font-mono font-bold select-all">{licenseData?.primaryKey || 'Your Key'}</code></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#D97706] font-bold">3.</span>
                <span>Open ContractGuard on your new workstation, paste your key, and it will immediately bind to your new hardware.</span>
              </div>
            </div>
          </div>

          {!showConfirmDeactivate ? (
            <button
              onClick={() => setShowConfirmDeactivate(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FFFFFF] border border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-ui"
            >
              <LogOut size={14} />
              <span>Deactivate from this Machine (Migrate License)</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FCA5A5] space-y-3">
              <p className="text-xs text-[#991B1B] font-semibold">
                Confirm Machine Deactivation: ContractGuard will release this computer's hardware binding and lock the local studio. You can reactivate anytime on this computer or enter the key on a new computer.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onDeactivate}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#B3261E] hover:bg-[#8F1D17] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Yes, Deactivate Workstation Now
                </button>
                <button
                  onClick={() => setShowConfirmDeactivate(false)}
                  className="px-4 py-2 rounded-lg bg-[#FFFFFF] border border-[#D9E1E7] text-[#0F1B2A] text-xs font-semibold cursor-pointer hover:bg-[#F7F9FA]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Official Support */}
        <div className="p-3.5 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Mail size={16} className="text-[#123B5C] shrink-0" />
            <div>
              <p className="font-semibold text-[#0F1B2A]">Direct Developer & Legal Tech Support</p>
              <a
                href="mailto:nexus.os.store@gmail.com"
                className="text-[#123B5C] hover:underline font-mono text-[11px]"
              >
                nexus.os.store@gmail.com
              </a>
            </div>
          </div>

          <button
            onClick={() => copyText('nexus.os.store@gmail.com', 'support_email')}
            className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#D9E1E7] hover:bg-[#E5EAEF] text-[#123B5C] text-xs font-mono flex items-center gap-1.5 cursor-pointer self-end sm:self-auto font-ui"
          >
            {copiedField === 'support_email' ? <Check size={12} className="text-[#0E6B52]" /> : <Copy size={12} />}
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

// =========================================================================
// 1. CONTRACT ANALYZER VIEW (Dual Modes + In-Memory Proofreader + Multi-Export)
// =========================================================================
function ContractAnalyzerView({ initialSession }) {
  // Mode selection: 'single' (pre-signing integrity audit) or 'comparative' (redline diff)
  const [analysisMode, setAnalysisMode] = useState(initialSession?.originalText ? 'comparative' : 'single');

  const [text, setText] = useState(initialSession?.modifiedText || initialSession?.originalText || '');
  const [baselineText, setBaselineText] = useState(initialSession?.originalText || '');
  const [documentTitle, setDocumentTitle] = useState(initialSession?.title || '');
  const [clientParty, setClientParty] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [diffGranularity, setDiffGranularity] = useState('word'); // 'word' | 'line'

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
    cancelAnalysis
  } = useContractWorker();

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

  const enrichedAudit = useMemo(() => {
    if (!auditResults) return null;
    return enrichAllAuditFindings(auditResults);
  }, [auditResults]);

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

    setUploadStatus(prev => ({ ...prev, [statusKey]: `Reading ${file.name}...` }));

    try {
      const lowerName = file.name.toLowerCase();

      if (lowerName.endsWith('.pdf')) {
        setUploadStatus(prev => ({ ...prev, [statusKey]: 'Reading PDF document...' }));
        const pdfResult = await extractTextFromPDF(file, {
          enableOcr: true,
          onProgress: (p) => {
            setUploadStatus(prev => ({
              ...prev,
              [statusKey]: p.message || `Parsing PDF: page ${p.currentPage}/${p.totalPages} (${p.percent}%)...`
            }));
          }
        });
        setTargetText(pdfResult.fullText);
        const hasOcrPages = pdfResult.pages?.some(pg => pg.isOcr);
        setUploadStatus(prev => ({
          ...prev,
          [statusKey]: `Loaded PDF (${pdfResult.totalWords} words${hasOcrPages ? ' · In-RAM OCR applied' : ''})`
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
          [statusKey]: `Scanned Image OCR Complete (${wordCount} words · ${ocrResult.confidence.toFixed(1)}% conf · ${ocrResult.durationMs}ms)`
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
        alert("Supported file formats: .pdf, .docx, .txt, .md, .png, .jpg, .jpeg, .webp");
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

  const handleLoadSample = (modeToUse = analysisMode) => {
    setText(HAZARDOUS_SAMPLE_CONTRACT);
    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
    setDocumentTitle('Hazardous M&A Asset Purchase Agreement');
    setClientParty('Acme Holdings LLC');
    setCounterparty('Globex International Corp');
    handleExecuteAudit({
      text: HAZARDOUS_SAMPLE_CONTRACT,
      baselineText: HAZARDOUS_BASELINE_CONTRACT,
      mode: modeToUse,
      title: 'Hazardous M&A Asset Purchase Agreement',
      clientParty: 'Acme Holdings LLC',
      counterparty: 'Globex International Corp'
    });
  };

  const handleExecuteAudit = async (overridePayload) => {
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
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6 font-ui">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-black tracking-tight text-[#0C2A42] flex items-center gap-2.5 font-ui">
              <ShieldCheck className="text-[#0E6B52] shrink-0" size={24} />
              <span>Deterministic Fact-Checking Engine</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0E6B52]/10 text-[#0E6B52] border border-[#0E6B52]/30">
              100% IN-MEMORY RAM
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#123B5C]/10 text-[#123B5C] border border-[#123B5C]/30">
              0% AI PROBABILITY
            </span>
          </div>
          <p className="text-sm text-[#5A6B7A] mt-1 font-ui">
            Mathematical AST & regex verification across cross-references, missing exhibits, defined terms, and financial figures. ABA Model Rule 1.6 Privileged.
          </p>
        </div>

        {/* Mode Selector — Executive Tab Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#E5EAEF] border border-[#D9E1E7] p-1 rounded-xl">
            <button
              onClick={() => {
                setAnalysisMode('single');
                setActiveHudTab('dealBreakers');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-ui ${
                analysisMode === 'single'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
              }`}
            >
              <FileCheck size={14} />
              Single Draft Audit
            </button>
            <button
              onClick={() => {
                setAnalysisMode('comparative');
                setActiveHudTab('diff');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer font-ui ${
                analysisMode === 'comparative'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
              }`}
            >
              <Search size={14} />
              Redline Diff Mode
            </button>
          </div>
        </div>
      </div>

      {/* Zero-Cloud Privilege Shield Trust Bar */}
      <div className="px-5 py-3 rounded-xl bg-[#FFFFFF] border-l-4 border-l-[#0E6B52] border-y border-r border-[#D9E1E7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs font-ui">
        <div className="flex items-center gap-2.5 text-[#0F1B2A]">
          <ShieldCheck size={16} className="text-[#0E6B52] shrink-0" />
          <span><strong className="text-[#0C2A42]">ZERO-CLOUD PRIVILEGE SHIELD:</strong> 100% In-Memory RAM execution. Client contracts, confidential party covenants, and financial terms never touch an external cloud server or LLM API.</span>
        </div>
        <span className="text-[#0E6B52] bg-[#E6F4EA] border border-[#0E6B52]/30 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">ABA Model Rule 1.6 Certified</span>
      </div>

      {/* Clean Horizontal Matter Metadata Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs font-ui">
        <div>
          <label className="text-xs font-semibold text-[#5A6B7A] block mb-1">Matter / Agreement Title</label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="e.g. Master Services Agreement"
            className="w-full bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-3.5 py-2 text-sm text-[#0F1B2A] focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#5A6B7A] block mb-1 flex items-center gap-1.5">
            <User size={13} className="text-[#123B5C]" /> Client Entity (Your Side)
          </label>
          <input
            type="text"
            value={clientParty}
            onChange={(e) => setClientParty(e.target.value)}
            placeholder="e.g. Acme Corporation"
            className="w-full bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-3.5 py-2 text-sm text-[#0F1B2A] focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#5A6B7A] block mb-1 flex items-center gap-1.5">
            <Users size={13} className="text-[#0E6B52]" /> Counterparty Name
          </label>
          <input
            type="text"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            placeholder="e.g. Globex Systems Inc"
            className="w-full bg-[#F7F9FA] border border-[#D9E1E7] rounded-lg px-3.5 py-2 text-sm text-[#0F1B2A] focus:border-[#123B5C] focus:bg-[#FFFFFF] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Input Panes */}
      {analysisMode === 'single' ? (
        /* SINGLE DOCUMENT INTEGRITY AUDIT MODE */
        <div 
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(false); }}
          onDrop={(e) => handleFileDrop(e, setText, 'target', setIsDraggingTarget)}
          className={`flex flex-col rounded-xl bg-[#FFFFFF] border transition-all overflow-hidden shadow-xs relative ${
            isDraggingTarget 
              ? 'border-[#0E6B52] bg-[#F0FDF4] ring-2 ring-[#0E6B52]/30' 
              : 'border-[#D9E1E7]'
          }`}
        >
          {isDraggingTarget && (
            <div className="absolute inset-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-[#0E6B52] gap-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[#0E6B52]/10 border border-[#0E6B52]/30 flex items-center justify-center shadow-md">
                <Upload size={30} className="animate-bounce" />
              </div>
              <p className="text-sm font-bold text-[#0F1B2A] tracking-wide font-ui">Drop Contract Document Here</p>
              <p className="text-xs text-[#5A6B7A] font-ui">Supports .pdf, .docx, .txt, .md + Scanned Images</p>
            </div>
          )}

          <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between font-ui">
            <span className="text-xs font-bold text-[#123B5C] flex items-center gap-2">
              <FileCheck size={15} className="text-[#0E6B52]" />
              CONTRACT DRAFT TO PROOFREAD (Drag & Drop or Import)
            </span>
            <div className="flex items-center gap-2">
              {uploadStatus.target && (
                <span className="text-xs font-mono text-[#123B5C]">{uploadStatus.target}</span>
              )}
              <button
                type="button"
                onClick={() => handleLoadSample('single')}
                className="bg-[#FFFFFF] hover:bg-[#F0FDF4] text-[#0E6B52] border border-[#0E6B52] px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.01] active:scale-[0.98]"
              >
                <Sparkles size={13} className="text-[#0E6B52]" />
                ⚡ Load Sample Hazardous M&A Draft
              </button>
              <label className="cursor-pointer bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#123B5C] transition-colors flex items-center gap-1.5">
                <Upload size={13} /> Import (.pdf / .docx / .txt / Scanned Image)
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract text here or drag & drop .pdf / .docx / .txt file to audit for broken references, missing exhibits, undefined terms, and financial mismatches..."
            className="w-full bg-[#FFFFFF] p-6 text-[14.5px] font-serif leading-[1.8] text-[#0F1B2A] outline-none resize-none focus:bg-[#FFFFFF] custom-scrollbar min-h-[280px]"
          />
          {!text.trim() && (
            <div className="absolute inset-x-0 bottom-14 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto bg-[#FFFFFF] border border-[#D9E1E7] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <span className="text-xs text-[#5A6B7A] font-ui">Need an immediate test draft with real-world drafting defects?</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('single')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#123B5C] hover:bg-[#0C2A42] text-white text-xs font-bold font-ui transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#60A5FA]" />
                  ⚡ Load Sample Hazardous Draft
                </button>
              </div>
            </div>
          )}
          <div className="px-5 py-2.5 border-t border-[#D9E1E7] bg-[#F7F9FA] text-xs font-ui text-[#5A6B7A] flex items-center justify-between">
            <span>Air-gapped client RAM processing · Zero cloud leakage</span>
            <span className="font-semibold text-[#0F1B2A]">
              {text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : 0} words • {text.split('\n').length} lines
            </span>
          </div>
        </div>
      ) : (
        /* COMPARATIVE REDLINE DIFF MODE (DUAL PANES) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Baseline Contract */}
          <div 
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingBaseline(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingBaseline(false); }}
            onDrop={(e) => handleFileDrop(e, setBaselineText, 'baseline', setIsDraggingBaseline)}
            className={`flex flex-col rounded-xl bg-[#FFFFFF] border transition-all overflow-hidden shadow-xs relative ${
              isDraggingBaseline 
                ? 'border-[#123B5C] bg-[#F0F4F8] ring-2 ring-[#123B5C]/30' 
                : 'border-[#D9E1E7]'
            }`}
          >
            {isDraggingBaseline && (
              <div className="absolute inset-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-[#123B5C] gap-2 animate-in fade-in">
                <Upload size={26} className="animate-bounce" />
                <p className="text-xs font-bold text-[#0F1B2A] font-ui">Drop Baseline Document Here</p>
                <p className="text-[10px] text-[#5A6B7A] font-ui">.pdf, .docx, .txt</p>
              </div>
            )}

            <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between font-ui">
              <span className="text-xs font-bold text-[#123B5C] flex items-center gap-2">
                <FileText size={14} className="text-[#5A6B7A]" />
                ORIGINAL BASELINE (Drop file here)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.baseline && (
                  <span className="text-xs font-mono text-[#123B5C]">{uploadStatus.baseline}</span>
                )}
                <button
                  type="button"
                  onClick={() => handleLoadSample('comparative')}
                  className="bg-[#FFFFFF] hover:bg-[#F0F4F8] text-[#123B5C] border border-[#123B5C]/40 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Sparkles size={12} className="text-[#123B5C]" />
                  ⚡ Load Sample Pair
                </button>
                <label className="cursor-pointer bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] px-2.5 py-1 rounded-lg text-xs font-medium text-[#123B5C] transition-colors flex items-center gap-1">
                  <Upload size={12} /> Upload
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
              onChange={(e) => setBaselineText(e.target.value)}
              placeholder="Paste original baseline contract or drop file here..."
              className="w-full bg-[#FFFFFF] p-5 text-[14px] font-serif leading-[1.8] text-[#0F1B2A] outline-none resize-none focus:bg-[#FFFFFF] custom-scrollbar min-h-[260px]"
            />
            <div className="px-4 py-2 border-t border-[#D9E1E7] bg-[#F7F9FA] text-xs font-ui text-[#5A6B7A] text-right">
              {baselineText.trim() ? baselineText.trim().split(/\s+/).length.toLocaleString() : 0} words
            </div>
          </div>

          {/* Amended Contract */}
          <div 
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(false); }}
            onDrop={(e) => handleFileDrop(e, setText, 'target', setIsDraggingTarget)}
            className={`flex flex-col rounded-xl bg-[#FFFFFF] border transition-all overflow-hidden shadow-xs relative ${
              isDraggingTarget 
                ? 'border-[#0E6B52] bg-[#F0FDF4] ring-2 ring-[#0E6B52]/30' 
                : 'border-[#D9E1E7]'
            }`}
          >
            {isDraggingTarget && (
              <div className="absolute inset-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-[#0E6B52] gap-2 animate-in fade-in">
                <Upload size={26} className="animate-bounce" />
                <p className="text-xs font-bold text-[#0F1B2A] font-ui">Drop Amended Document Here</p>
                <p className="text-[10px] text-[#5A6B7A] font-ui">.pdf, .docx, .txt, .png, .jpg</p>
              </div>
            )}

            <div className="px-4 py-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between font-ui">
              <span className="text-xs font-bold text-[#123B5C] flex items-center gap-2">
                <FileCheck size={14} className="text-[#0E6B52]" />
                AMENDED DRAFT (Drop file here)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.target && (
                  <span className="text-xs font-mono text-[#0E6B52]">{uploadStatus.target}</span>
                )}
                <label className="cursor-pointer bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] px-2.5 py-1 rounded-lg text-xs font-medium text-[#123B5C] transition-colors flex items-center gap-1">
                  <Upload size={12} /> Upload
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste modified or redlined contract text here or drop file..."
              className="w-full bg-[#FFFFFF] p-5 text-[14px] font-serif leading-[1.8] text-[#0F1B2A] outline-none resize-none focus:bg-[#FFFFFF] custom-scrollbar min-h-[260px]"
            />
            <div className="px-4 py-2 border-t border-[#D9E1E7] bg-[#F7F9FA] text-xs font-ui text-[#5A6B7A] text-right">
              {text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : 0} words
            </div>
          </div>
        </div>
      )}

      {/* Control Bar & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs font-ui">
        <div className="flex items-center gap-4">
          {analysisMode === 'comparative' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5A6B7A]">Diff Precision:</span>
              <div className="flex bg-[#F7F9FA] p-1 rounded-lg border border-[#D9E1E7]">
                <button
                  onClick={() => setDiffGranularity('word')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    diffGranularity === 'word' ? 'bg-[#123B5C] text-white shadow-xs' : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
                  }`}
                >
                  Word
                </button>
                <button
                  onClick={() => setDiffGranularity('line')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    diffGranularity === 'line' ? 'bg-[#123B5C] text-white shadow-xs' : 'text-[#5A6B7A] hover:text-[#0F1B2A]'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
          )}

          {saveStatus && (
            <span className="text-xs font-mono text-[#0E6B52] flex items-center gap-1.5 animate-fade-in font-bold">
              <Check size={14} /> {saveStatus}
            </span>
          )}

          {workerError && (
            <span className="text-xs font-mono text-[#B3261E] flex items-center gap-1.5 font-bold">
              <AlertCircle size={14} /> {workerError}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isProcessing && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cancelAnalysis();
              }}
              className="px-5 py-2.5 bg-[#B3261E] hover:bg-[#8F1D17] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <StopCircle size={15} />
              <span>Cancel Audit</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleExecuteAudit()}
            disabled={isProcessing || !text.trim() || (analysisMode === 'comparative' && !baselineText.trim())}
            className="px-8 py-3 bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold text-sm rounded-xl transition-all flex items-center gap-2.5 disabled:opacity-40 shadow-xs active:scale-[0.98] cursor-pointer"
          >
            {isProcessing ? <RefreshCw className="animate-spin text-[#60A5FA]" size={16} /> : <Play size={16} className="text-[#60A5FA]" />}
            <span>
              {isProcessing
                ? 'Auditing in Local RAM...'
                : analysisMode === 'single'
                ? 'Run Integrity Audit'
                : 'Execute Redline Diff & Audit'}
            </span>
          </button>
        </div>
      </div>

      {/* Live In-Memory Progress Bar */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#123B5C]/30 shadow-xs font-ui">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#123B5C] flex items-center gap-2">
              <RefreshCw className="animate-spin text-[#123B5C]" size={14} />
              {progress?.msg || 'Auditing contract in local memory...'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#0F1B2A]">
                {progress?.percent || 0}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cancelAnalysis();
                }}
                className="px-2.5 py-1 bg-[#FDF2F2] border border-[#B3261E]/30 text-[#B3261E] hover:bg-[#B3261E] hover:text-white text-xs font-bold rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="w-full bg-[#E5EAEF] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#123B5C] h-2.5 rounded-full transition-all duration-150"
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results HUD */}
      {auditResults && (
        <div className="flex flex-col gap-6 animate-fade-in mt-2 font-ui">
          {/* Executive Risk Score & Metrics Banner */}
          <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs font-ui">
            <div className="flex items-center gap-6">
              <div className={`px-6 py-4 rounded-xl border text-center ${riskScoreBadgeColor} shadow-xs shrink-0`}>
                <span className="text-4xl font-black block font-mono tracking-tight">{riskScore}</span>
                <span className="text-xs font-extrabold uppercase tracking-wider block mt-0.5">
                  {riskLevel} RISK
                </span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#0C2A42] tracking-tight font-ui">
                  {riskScore >= 75 ? 'Critical Drafting Defects Detected' :
                   riskScore >= 45 ? 'High Risk Legal Anomalies Found' :
                   riskScore >= 20 ? 'Moderate Drafting Gaps Identified' :
                   'Clean Document Integrity Profile'}
                </h3>
                <p className="text-sm text-[#5A6B7A] mt-1 max-w-xl leading-relaxed font-ui">
                  {auditResults.meta?.wordCount || 0} words audited in {auditResults.meta?.processingTimeMs || 0}ms across 4 verification engines. 100% in-memory RAM processing.
                </p>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => downloadAmendmentRiderPDF(auditResults, {
                  contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
                  clientName: clientParty.trim() || 'Client',
                  counterpartyName: counterparty.trim() || 'Counterparty'
                })}
                className="px-4 py-2.5 bg-[#123B5C] hover:bg-[#0C2A42] text-white font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer font-ui"
                title="Download court-grade Pre-Signing Amendment Rider & Revisions Schedule (PDF)"
              >
                <FileText size={14} />
                Court Rider (PDF)
              </button>

              <button
                onClick={() => exportPreSigningAmendmentRiderHTML(auditResults, {
                  contractTitle: documentTitle.trim() || 'Contract Integrity Audit',
                  clientName: clientParty.trim() || 'Client',
                  counterpartyName: counterparty.trim() || 'Counterparty'
                })}
                className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-bold text-[#123B5C] transition-all flex items-center gap-2 cursor-pointer font-ui shadow-xs"
                title="Open print-ready Court Amendment Rider (HTML/Print)"
              >
                <FileCode size={14} className="text-[#0E6B52]" />
                Rider (HTML)
              </button>

              <button
                onClick={handleCopyFullRider}
                className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F0FDF4] border border-[#0E6B52] rounded-xl text-xs font-bold text-[#0E6B52] transition-all flex items-center gap-2 cursor-pointer font-ui shadow-xs"
                title="Copy full pre-signing court amendment schedule to clipboard"
              >
                {copiedRiderSuccess ? (
                  <>
                    <Check size={14} className="text-[#0E6B52]" />
                    <span className="text-[#0E6B52]">Rider Copied! ✓</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-[#0E6B52]" />
                    <span>Copy Rider</span>
                  </>
                )}
              </button>

              <button
                onClick={() => exportExecutiveClientMemoHTML({
                  contractTitle: documentTitle.trim() || 'Contract Integrity & Legal Audit',
                  clientName: clientParty.trim() || 'Client',
                  counterpartyName: counterparty.trim() || 'Counterparty',
                  auditData: auditResults
                })}
                className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-bold text-[#0F1B2A] transition-all flex items-center gap-2 cursor-pointer font-ui shadow-xs"
                title="Generate executive legal memorandum with print CSS for 1-click PDF"
              >
                <Download size={14} className="text-[#123B5C]" />
                Client Memo (PDF)
              </button>

              <button
                onClick={() => exportObligationsCSV(auditResults.obligations)}
                className="px-3.5 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-bold text-[#0F1B2A] transition-all flex items-center gap-2 cursor-pointer font-ui shadow-xs"
                title="Export contractual obligations schedule to CSV spreadsheet"
              >
                <FileSpreadsheet size={14} className="text-[#0E6B52]" />
                Obligations CSV
              </button>

              {auditResults.diff && (
                <button
                  onClick={() => exportRedlineToHTML(auditResults.diff, auditResults.risks, { title: documentTitle.trim() || 'Contract Redline Audit' })}
                  className="px-3 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-bold text-[#0F1B2A] transition-all flex items-center gap-2 cursor-pointer font-ui shadow-xs"
                  title="Export interactive HTML redline with insertions & deletions"
                >
                  <FileCode size={14} className="text-[#123B5C]" />
                  Redline HTML
                </button>
              )}

              <button
                onClick={() => exportAuditReportJSON(auditResults.diff, auditResults.risks, null, { title: documentTitle.trim() || 'Contract Integrity Audit' })}
                className="px-3 py-2.5 bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-bold text-[#5A6B7A] transition-all cursor-pointer font-ui shadow-xs"
                title="Export compliance JSON verification record"
              >
                JSON
              </button>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 font-ui">
            <div 
              onClick={() => setActiveHudTab('dealBreakers')}
              className={`p-4 rounded-xl bg-[#FFFFFF] border transition-all cursor-pointer ${
                activeHudTab === 'dealBreakers' ? 'border-[#B3261E] ring-2 ring-[#B3261E]/20 bg-[#FDF2F2]' : 'border-[#D9E1E7] hover:border-[#B3261E]/40'
              } text-center shadow-xs`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B3261E] font-ui">Deal Breakers</p>
              <p className="text-3xl font-black text-[#B3261E] mt-1 font-mono">
                {enrichedAudit?.dealBreakers?.length || 0}
              </p>
            </div>
            <div 
              onClick={() => setActiveHudTab('enforceability')}
              className={`p-4 rounded-xl bg-[#FFFFFF] border transition-all cursor-pointer ${
                activeHudTab === 'enforceability' ? 'border-[#B45309] ring-2 ring-[#B45309]/20 bg-[#FFFBEB]' : 'border-[#D9E1E7] hover:border-[#B45309]/40'
              } text-center shadow-xs`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B45309] font-ui">Enforceability Hazards</p>
              <p className="text-3xl font-black text-[#B45309] mt-1 font-mono">
                {enrichedAudit?.enforceabilityHazards?.length || 0}
              </p>
            </div>
            <div 
              onClick={() => setActiveHudTab('financialDates')}
              className={`p-4 rounded-xl bg-[#FFFFFF] border transition-all cursor-pointer ${
                activeHudTab === 'financialDates' ? 'border-[#B45309] ring-2 ring-[#B45309]/20 bg-[#FFFBEB]' : 'border-[#D9E1E7] hover:border-[#B45309]/40'
              } text-center shadow-xs`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B45309] font-ui">Financial Mismatches</p>
              <p className="text-3xl font-black text-[#B45309] mt-1 font-mono">
                {auditResults.financialDates?.stats?.mismatchCount || 0}
              </p>
            </div>
            <div 
              onClick={() => setActiveHudTab('crossRefs')}
              className={`p-4 rounded-xl bg-[#FFFFFF] border transition-all cursor-pointer ${
                activeHudTab === 'crossRefs' ? 'border-[#123B5C] ring-2 ring-[#123B5C]/20 bg-[#F0F4F8]' : 'border-[#D9E1E7] hover:border-[#123B5C]/40'
              } text-center shadow-xs`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#123B5C] font-ui">Broken Citations</p>
              <p className="text-3xl font-black text-[#123B5C] mt-1 font-mono">
                {(auditResults.crossRefs?.stats?.brokenCount || 0) + (auditResults.crossRefs?.stats?.missingExhibitCount || 0)}
              </p>
            </div>
            <div 
              onClick={() => setActiveHudTab('obligations')}
              className={`p-4 rounded-xl bg-[#FFFFFF] border transition-all cursor-pointer ${
                activeHudTab === 'obligations' ? 'border-[#0E6B52] ring-2 ring-[#0E6B52]/20 bg-[#F0FDF4]' : 'border-[#D9E1E7] hover:border-[#0E6B52]/40'
              } text-center shadow-xs`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0E6B52] font-ui">Contract Obligations</p>
              <p className="text-3xl font-black text-[#0E6B52] mt-1 font-mono">
                {auditResults.obligations?.stats?.totalObligations || 0}
              </p>
            </div>
          </div>

          {/* Complete HUD Sub-Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D9E1E7] custom-scrollbar font-ui">
            <button
              onClick={() => setActiveHudTab('dealBreakers')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'dealBreakers'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <ShieldAlert size={14} className={activeHudTab === 'dealBreakers' ? 'text-[#FCA5A5]' : 'text-[#B3261E]'} />
              <span>Deal Breakers</span>
              {(enrichedAudit?.dealBreakers?.length || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#B3261E] text-white font-mono font-bold">
                  {enrichedAudit.dealBreakers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('enforceability')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'enforceability'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <AlertTriangle size={14} className={activeHudTab === 'enforceability' ? 'text-[#FCD34D]' : 'text-[#B45309]'} />
              <span>Enforceability Hazards</span>
              {(enrichedAudit?.enforceabilityHazards?.length || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#B45309] text-white font-mono font-bold">
                  {enrichedAudit.enforceabilityHazards.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('crossRefs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'crossRefs'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <Bookmark size={14} className={activeHudTab === 'crossRefs' ? 'text-[#93C5FD]' : 'text-[#123B5C]'} />
              <span>Citations & Exhibits</span>
              {((auditResults.crossRefs?.stats?.brokenCount || 0) + (auditResults.crossRefs?.stats?.missingExhibitCount || 0)) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#123B5C] text-white font-mono font-bold">
                  {(auditResults.crossRefs?.stats?.brokenCount || 0) + (auditResults.crossRefs?.stats?.missingExhibitCount || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('financialDates')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'financialDates'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <DollarSign size={14} className={activeHudTab === 'financialDates' ? 'text-[#FCD34D]' : 'text-[#B45309]'} />
              <span>Financial & Dates</span>
              {((auditResults.financialDates?.stats?.mismatchCount || 0) + (auditResults.financialDates?.stats?.dateIssuesCount || 0)) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#B45309] text-white font-mono font-bold">
                  {(auditResults.financialDates?.stats?.mismatchCount || 0) + (auditResults.financialDates?.stats?.dateIssuesCount || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('definedTerms')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'definedTerms'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <Tag size={14} className={activeHudTab === 'definedTerms' ? 'text-[#C4B5FD]' : 'text-[#6D28D9]'} />
              <span>Defined Terms & Entities</span>
              {(auditResults.definedTerms?.stats?.undefinedCount || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#6D28D9] text-white font-mono font-bold">
                  {auditResults.definedTerms?.stats?.undefinedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('obligations')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'obligations'
                  ? 'bg-[#123B5C] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
              }`}
            >
              <CheckSquare size={14} className={activeHudTab === 'obligations' ? 'text-[#86EFAC]' : 'text-[#0E6B52]'} />
              <span>Obligations ({auditResults.obligations?.stats?.totalObligations || 0})</span>
            </button>

            {auditResults.diff && (
              <button
                onClick={() => setActiveHudTab('diff')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeHudTab === 'diff'
                    ? 'bg-[#123B5C] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
                }`}
              >
                <Search size={14} className={activeHudTab === 'diff' ? 'text-[#93C5FD]' : 'text-[#123B5C]'} />
                <span>Redline Diff ({auditResults.diff.stats?.similarity}% Sim)</span>
              </button>
            )}

            {(auditResults.risks?.length || 0) > 0 && (
              <button
                onClick={() => setActiveHudTab('risks')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeHudTab === 'risks'
                    ? 'bg-[#123B5C] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#5A6B7A] border border-[#D9E1E7] hover:text-[#0F1B2A] hover:bg-[#F7F9FA]'
                }`}
              >
                <ShieldAlert size={14} className={activeHudTab === 'risks' ? 'text-[#FCA5A5]' : 'text-[#B3261E]'} />
                <span>Risk Radar ({auditResults.risks.length})</span>
              </button>
            )}
          </div>

          {/* TAB: CRITICAL DEAL BREAKERS */}
          {activeHudTab === 'dealBreakers' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#FCA5A5] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#B3261E] flex items-center gap-2 font-ui">
                    <ShieldAlert size={18} className="text-[#B3261E] shrink-0" />
                    <span>Critical Deal Breakers & Malpractice Liabilities ({enrichedAudit?.dealBreakers?.length || 0})</span>
                  </h3>
                  <p className="text-xs text-[#5A6B7A] mt-1 font-ui">
                    Severe drafting defects that threaten transaction enforceability, expose counsel to malpractice liability, or establish unilateral walk-away rights under Delaware & UCC jurisprudence.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B3261E] text-white">
                    Mandatory Pre-Signing Redlines
                  </span>
                </div>
              </div>

              {(!enrichedAudit?.dealBreakers || enrichedAudit.dealBreakers.length === 0) ? (
                <div className="p-8 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex flex-col items-center gap-2">
                  <CheckCircle2 size={24} className="text-[#0E6B52]" />
                  <span>✓ Zero critical deal-breaker defects detected. All conditions precedent, consideration terms, and party entities are legally sound.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrichedAudit.dealBreakers.map((item, idx) => (
                    <div key={item.id || idx} className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col gap-4">
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9E1E7] pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase bg-[#B3261E] text-white shadow-xs">
                            {item.legalSeverityLabel || 'CRITICAL DEAL BREAKER'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#F7F9FA] text-[#0F1B2A] border border-[#D9E1E7]">
                            {item.clauseRef || item.clause || `Line ${item.line}`}
                          </span>
                          {item.occurrences > 1 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                              Cited {item.occurrences}x across document
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-[#B3261E] font-bold flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-[#B3261E]" />
                          <span>Pre-Execution Stop</span>
                        </span>
                      </div>

                      {/* Title & Malpractice Risk */}
                      <div>
                        <h4 className="text-sm font-bold text-[#0F1B2A] mb-1.5 font-ui">{item.title}</h4>
                        <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] leading-relaxed font-ui flex items-start gap-2.5">
                          <AlertCircle size={16} className="text-[#B3261E] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#7F1D1D]">Malpractice & Litigation Exposure: </span>
                            <span>{item.malpracticeRisk}</span>
                          </div>
                        </div>
                      </div>

                      {/* Statutory Authority */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="text-[#5A6B7A] font-semibold">Governing Doctrine:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] font-bold">
                          ⚖️ {item.statutoryCitation}
                        </span>
                        {item.precedent && (
                          <span className="text-[#5A6B7A] italic">
                            ({item.precedent})
                          </span>
                        )}
                      </div>

                      {/* Defective Snippet - Source Serif 4 / Georgia */}
                      {item.snippet && (
                        <div className="p-3 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] text-xs">
                          <span className="text-[#5A6B7A] text-[10px] uppercase font-bold block mb-1 font-ui">Defective Draft Language:</span>
                          <span className="italic text-[#0F1B2A] font-serif leading-relaxed">"{item.snippet}"</span>
                          {item.line && <span className="text-[#5A6B7A] ml-2 font-mono text-xs">(Line {item.line})</span>}
                        </div>
                      )}

                      {/* Court-Grade Redline Replacement */}
                      {item.courtGradeRedline && (
                        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                              <CheckCircle2 size={14} className="text-[#0E6B52]" />
                              AmLaw 100 Court-Grade Replacement Language
                            </span>
                            <button
                              onClick={() => handleCopyRedline(item.id || idx, item.courtGradeRedline)}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 font-ui"
                            >
                              {copiedRedlineId === (item.id || idx) ? (
                                <>
                                  <Check size={13} className="text-current" />
                                  <span>Copied! ✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy Redline Clause</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 bg-[#FFFFFF] rounded-lg text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
                            {item.courtGradeRedline}
                          </div>
                          {item.actionableAdvice && (
                            <p className="text-[11px] text-[#5A6B7A] font-ui italic">
                              <span className="text-[#0E6B52] font-bold">Counsel Guidance: </span>
                              {item.actionableAdvice}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ENFORCEABILITY HAZARDS */}
          {activeHudTab === 'enforceability' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#92400E] flex items-center gap-2 font-ui">
                    <AlertTriangle size={18} className="text-[#D97706] shrink-0" />
                    <span>Enforceability Hazards & Ambiguity Traps ({enrichedAudit?.enforceabilityHazards?.length || 0})</span>
                  </h3>
                  <p className="text-xs text-[#5A6B7A] mt-1 font-ui">
                    Citations to nonexistent sections, undefined operative capitalized terms, and procedural voids vulnerable to contra proferentem interpretation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#D97706] text-white">
                    Remedial Redlines Available
                  </span>
                </div>
              </div>

              {(!enrichedAudit?.enforceabilityHazards || enrichedAudit.enforceabilityHazards.length === 0) ? (
                <div className="p-8 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex flex-col items-center gap-2">
                  <CheckCircle2 size={24} className="text-[#0E6B52]" />
                  <span>✓ All internal cross-references resolve cleanly and all operative capitalized terms are formally defined.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrichedAudit.enforceabilityHazards.map((item, idx) => (
                    <div key={item.id || idx} className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col gap-4">
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9E1E7] pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-extrabold uppercase bg-[#D97706] text-white shadow-xs">
                            {item.legalSeverityLabel || 'ENFORCEABILITY HAZARD'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-[#F7F9FA] text-[#0F1B2A] border border-[#D9E1E7]">
                            {item.clauseRef || item.clause || `Line ${item.line}`}
                          </span>
                          {item.occurrences > 1 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                              Referenced {item.occurrences}x
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-[#D97706] font-bold flex items-center gap-1.5">
                          <Bookmark size={14} className="text-[#D97706]" />
                          <span>Procedural Hazard</span>
                        </span>
                      </div>

                      {/* Title & Malpractice Risk */}
                      <div>
                        <h4 className="text-sm font-bold text-[#0F1B2A] mb-1.5 font-ui">{item.title}</h4>
                        <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] leading-relaxed font-ui flex items-start gap-2.5">
                          <AlertCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#78350F]">Litigation & Interpretation Risk: </span>
                            <span>{item.malpracticeRisk}</span>
                          </div>
                        </div>
                      </div>

                      {/* Statutory Authority */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="text-[#5A6B7A] font-semibold">Governing Rule:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] font-bold">
                          ⚖️ {item.statutoryCitation}
                        </span>
                        {item.precedent && (
                          <span className="text-[#5A6B7A] italic">
                            ({item.precedent})
                          </span>
                        )}
                      </div>

                      {/* Defective Snippet - Source Serif 4 / Georgia */}
                      {item.snippet && (
                        <div className="p-3 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] text-xs">
                          <span className="text-[#5A6B7A] text-[10px] uppercase font-bold block mb-1 font-ui">Operative Draft Context:</span>
                          <span className="italic text-[#0F1B2A] font-serif leading-relaxed">"{item.snippet}"</span>
                          {item.line && <span className="text-[#5A6B7A] ml-2 font-mono text-xs">(Line {item.line})</span>}
                        </div>
                      )}

                      {/* Court-Grade Redline Replacement */}
                      {item.courtGradeRedline && (
                        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                              <CheckCircle2 size={14} className="text-[#0E6B52]" />
                              AmLaw 100 Court-Grade Replacement Language
                            </span>
                            <button
                              onClick={() => handleCopyRedline(item.id || idx, item.courtGradeRedline)}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 font-ui"
                            >
                              {copiedRedlineId === (item.id || idx) ? (
                                <>
                                  <Check size={13} className="text-current" />
                                  <span>Copied! ✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Copy Redline Clause</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 bg-[#FFFFFF] rounded-lg text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
                            {item.courtGradeRedline}
                          </div>
                          {item.actionableAdvice && (
                            <p className="text-[11px] text-[#5A6B7A] font-ui italic">
                              <span className="text-[#0E6B52] font-bold">Counsel Guidance: </span>
                              {item.actionableAdvice}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: CROSS-REFERENCES & EXHIBITS (R1) */}
          {activeHudTab === 'crossRefs' && (
            <div className="flex flex-col gap-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs">
                  <span className="text-[#5A6B7A] block text-[11px] font-ui">Indexed Sections</span>
                  <span className="text-xl font-bold text-[#0F1B2A]">{auditResults.crossRefs?.stats?.totalIndexed || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs">
                  <span className="text-[#5A6B7A] block text-[11px] font-ui">Citations Found</span>
                  <span className="text-xl font-bold text-[#123B5C]">{auditResults.crossRefs?.stats?.totalCitations || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FDF2F2] border border-[#FCA5A5] rounded-xl shadow-xs">
                  <span className="text-[#991B1B] block text-[11px] font-ui font-semibold">Broken References</span>
                  <span className="text-xl font-bold text-[#B3261E]">{auditResults.crossRefs?.stats?.brokenCount || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl shadow-xs">
                  <span className="text-[#92400E] block text-[11px] font-ui font-semibold">Missing Exhibits</span>
                  <span className="text-xl font-bold text-[#D97706]">{auditResults.crossRefs?.stats?.missingExhibitCount || 0}</span>
                </div>
              </div>

              {/* Broken References Schedule */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <AlertTriangle size={16} className="text-[#B3261E]" />
                  Broken References & Missing Sections ({(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').length})
                </h4>
                {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ All internal section citations ("Section X", "Clause Y") resolve to indexed sections in the agreement.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'broken_reference').map((issue, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(issue);
                      const cardId = `cr_broken_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9E1E7] pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-[#B3261E] text-sm">
                                {issue.referenceText}
                              </span>
                              <span className="bg-[#B3261E] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                Target Missing: {issue.targetName}
                              </span>
                              <span className="font-mono text-[#5A6B7A] text-[11px]">
                                Line {issue.line}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#B3261E] font-mono font-bold">
                              Delaware Chancery Patent Ambiguity
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-serif text-[#0F1B2A] italic leading-relaxed">
                            "{issue.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                                  <CheckCircle2 size={13} className="text-[#0E6B52]" />
                                  AmLaw 100 Court-Grade Replacement Language
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1 cursor-pointer shrink-0 font-ui"
                                >
                                  {copiedRedlineId === cardId ? (
                                    <>
                                      <Check size={12} className="text-current" />
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
                              <div className="p-2.5 bg-[#FFFFFF] rounded text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
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
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <Bookmark size={16} className="text-[#D97706]" />
                  Missing Exhibits, Schedules & Appendices ({(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').length})
                </h4>
                {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ All referenced Exhibits, Schedules, and Appendices are indexed in the agreement package.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(auditResults.crossRefs?.issues || []).filter(i => i.type === 'missing_exhibit').map((issue, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(issue);
                      const cardId = `cr_exhibit_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9E1E7] pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-[#92400E] text-sm">
                                {issue.referenceText}
                              </span>
                              <span className="bg-[#D97706] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                                Exhibit Missing
                              </span>
                              <span className="font-mono text-[#5A6B7A] text-[11px]">
                                Line {issue.line}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#92400E] font-mono font-bold">
                              Failure of Condition Precedent (Restatement § 224)
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-serif text-[#0F1B2A] italic leading-relaxed">
                            "{issue.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                                  <CheckCircle2 size={13} className="text-[#0E6B52]" />
                                  AmLaw 100 Pre-Signing Delivery Covenant
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1 cursor-pointer shrink-0 font-ui"
                                >
                                  {copiedRedlineId === cardId ? (
                                    <>
                                      <Check size={12} className="text-current" />
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
                              <div className="p-2.5 bg-[#FFFFFF] rounded text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
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
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                <h4 className="text-xs font-bold uppercase text-[#5A6B7A] font-ui mb-3">
                  Indexed Document Structure ({auditResults.crossRefs?.indexedSections?.length || 0} Sections, {auditResults.crossRefs?.indexedExhibits?.length || 0} Exhibits)
                </h4>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {(auditResults.crossRefs?.indexedSections || []).map((sec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-mono text-[#0F1B2A]" title={`Line ${sec.line}: ${sec.title}`}>
                      § {sec.id} {sec.title ? `— ${sec.title}` : ''}
                    </span>
                  ))}
                  {(auditResults.crossRefs?.indexedExhibits || []).map((ex, i) => (
                    <span key={'ex-' + i} className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#123B5C] font-semibold" title={`Line ${ex.line}`}>
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
                <div className="p-3.5 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs">
                  <span className="text-[#5A6B7A] block text-[11px] font-ui">Formal Defined Terms</span>
                  <span className="text-xl font-bold text-[#0E6B52]">{auditResults.definedTerms?.stats?.totalDefined || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl shadow-xs">
                  <span className="text-[#92400E] block text-[11px] font-ui font-semibold">Undefined Capitalized Terms</span>
                  <span className="text-xl font-bold text-[#D97706]">{auditResults.definedTerms?.stats?.undefinedCount || 0}</span>
                </div>
                <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl shadow-xs">
                  <span className="text-[#1E40AF] block text-[11px] font-ui font-semibold">Unused Defined Terms</span>
                  <span className="text-xl font-bold text-[#1E40AF]">{auditResults.definedTerms?.stats?.unusedCount || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FDF2F2] border border-[#FCA5A5] rounded-xl shadow-xs">
                  <span className="text-[#991B1B] block text-[11px] font-ui font-semibold">Template Artifacts</span>
                  <span className="text-xl font-bold text-[#B3261E]">{auditResults.definedTerms?.stats?.artifactCount || 0}</span>
                </div>
              </div>

              {/* Undefined Capitalized Terms */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                    <HelpCircle size={16} className="text-[#D97706]" />
                    Undefined Capitalized Terms ({auditResults.definedTerms?.undefinedTerms?.length || 0})
                  </h4>
                  {(auditResults.definedTerms?.undefinedTerms?.length || 0) > 0 && (
                    <button
                      onClick={handleCopyAllDefinitions}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#123B5C] hover:bg-[#0C2A42] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs font-ui"
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
                  <div className="p-5 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ No undefined capitalized terms detected.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResults.definedTerms.undefinedTerms.map((termItem, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs text-xs flex flex-col justify-between gap-2.5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#0F1B2A] font-serif text-sm">"{termItem.term}"</span>
                            <span className="text-[10px] font-mono text-[#5A6B7A] bg-[#F7F9FA] border border-[#D9E1E7] px-2 py-0.5 rounded">
                              {termItem.count || 1}x
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5A6B7A] font-ui">First referenced at line {termItem.line} without operative definition in Section 1.</p>
                        </div>
                        <button
                          onClick={() => handleCopyRedline(`def_${idx}`, `"${termItem.term}" means [specify exact operational criteria, title designations, and material scope].`)}
                          className="self-end px-2.5 py-1 bg-[#F7F9FA] hover:bg-[#E5EAEF] text-[#123B5C] border border-[#D9E1E7] rounded text-[10px] font-ui font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedRedlineId === `def_${idx}` ? <><Check size={11} className="text-[#0E6B52]" /> Copied</> : <><Copy size={11} /> Copy Definition</>}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unused Defined Terms */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <Tag size={16} className="text-[#1E40AF]" />
                  Unused Defined Terms ({auditResults.definedTerms?.unusedDefinedTerms?.length || 0})
                </h4>
                {(!auditResults.definedTerms?.unusedDefinedTerms || auditResults.definedTerms.unusedDefinedTerms.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ All defined terms are actively utilized in operative clauses.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResults.definedTerms.unusedDefinedTerms.map((unusedItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs text-xs">
                        <span className="font-bold text-[#1E40AF] font-serif block mb-1">"{unusedItem.term}"</span>
                        <p className="text-[11px] text-[#5A6B7A] font-ui">Defined at line {unusedItem.line} but never referenced in operative covenants.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Placeholders & Leftovers */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <AlertCircle size={16} className="text-[#B3261E]" />
                  Leftover Boilerplate & Unfilled Placeholders ({auditResults.definedTerms?.boilerplateArtifacts?.length || 0})
                </h4>
                {(!auditResults.definedTerms?.boilerplateArtifacts || auditResults.definedTerms.boilerplateArtifacts.length === 0) ? (
                  <div className="p-5 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ Zero unfilled template brackets (`[Company Name]`, `___`) detected.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditResults.definedTerms.boilerplateArtifacts.map((art, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FCA5A5] text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#B3261E] font-mono text-sm">{art.placeholder}</span>
                          <span className="text-[#5A6B7A] ml-2 font-mono">Line {art.line}</span>
                          <p className="text-[#0F1B2A] font-serif italic mt-0.5">"{art.snippet}"</p>
                        </div>
                        <span className="bg-[#B3261E] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase font-ui">
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
                  <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                    <Users size={16} className="text-[#D97706]" />
                    Entity Discrepancies & Alien Counterparties ({auditResults.definedTerms.entityIssues.length})
                  </h4>
                  <div className="space-y-3">
                    {auditResults.definedTerms.entityIssues.map((ent, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(ent);
                      const cardId = `ent_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs text-xs flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F1B2A] font-serif text-sm">{ent.entity}: </span>
                              <span className="text-[#5A6B7A] font-ui">{ent.discrepancy}</span>
                              <span className="text-[#5A6B7A] text-[11px] font-mono">(Line {ent.line})</span>
                            </div>
                            <span className="bg-[#D97706] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded font-ui">
                              Veil-Piercing Exposure
                            </span>
                          </div>
                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                                  <CheckCircle2 size={13} className="text-[#0E6B52]" />
                                  AmLaw 100 Corporate Entity Harmonization Covenant
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1 cursor-pointer shrink-0 font-ui"
                                >
                                  {copiedRedlineId === cardId ? <><Check size={12} className="text-current" /> Copied! ✓</> : <><Copy size={12} /> Copy Covenant</>}
                                </button>
                              </div>
                              <div className="p-2.5 bg-[#FFFFFF] rounded text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
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
                <div className="p-3.5 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs">
                  <span className="text-[#5A6B7A] block text-[11px] font-ui">Financial Pairings</span>
                  <span className="text-xl font-bold text-[#0F1B2A]">{auditResults.financialDates?.stats?.totalAmounts || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FDF2F2] border border-[#FCA5A5] rounded-xl shadow-xs">
                  <span className="text-[#991B1B] block text-[11px] font-ui font-semibold">Words vs Digits Mismatches</span>
                  <span className="text-xl font-bold text-[#B3261E]">{auditResults.financialDates?.stats?.mismatchCount || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl shadow-xs">
                  <span className="text-[#5A6B7A] block text-[11px] font-ui">Contract Dates Found</span>
                  <span className="text-xl font-bold text-[#123B5C]">{auditResults.financialDates?.stats?.totalDates || 0}</span>
                </div>
                <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl shadow-xs">
                  <span className="text-[#92400E] block text-[11px] font-ui font-semibold">Chronology Conflicts</span>
                  <span className="text-xl font-bold text-[#D97706]">{auditResults.financialDates?.stats?.dateIssuesCount || 0}</span>
                </div>
              </div>

              {/* Side-by-Side Financial Mismatches */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <DollarSign size={16} className="text-[#B3261E]" />
                  Words vs Numbers Financial Contradictions ({(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').length})
                </h4>
                {(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#0E6B52] bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl">
                    ✓ All numeric figures and written monetary values ("$10,000" vs "Ten Thousand Dollars") are in perfect alignment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(auditResults.financialDates?.issues || []).filter(i => i.type === 'amount_mismatch').map((mismatch, idx) => {
                      const enriched = enrichFindingWithStatutoryRemedy(mismatch);
                      const cardId = `fin_${idx}`;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] hover:border-[#123B5C]/40 shadow-xs transition-all flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9E1E7] pb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#B3261E] text-sm font-ui">{mismatch.title}</span>
                              <span className="bg-[#B3261E] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase font-ui">
                                Critical Mismatch
                              </span>
                              <span className="text-[#5A6B7A] text-xs font-mono">(Line {mismatch.line})</span>
                            </div>
                            <span className="text-xs font-mono text-[#B3261E] font-bold">
                              UCC § 3-114 Words-Over-Numbers Rule
                            </span>
                          </div>

                          <p className="text-[#0F1B2A] text-xs leading-relaxed font-ui">{mismatch.details}</p>

                          <div className="p-2.5 bg-[#F7F9FA] rounded-lg text-[#0F1B2A] text-xs font-serif italic border border-[#D9E1E7] leading-relaxed">
                            "{mismatch.snippet}"
                          </div>

                          {enriched.courtGradeRedline && (
                            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#0E6B52] flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#0E6B52] flex items-center gap-1.5 font-ui">
                                  <CheckCircle2 size={13} className="text-[#0E6B52]" />
                                  AmLaw 100 Court-Grade Reconciliation Clause
                                </span>
                                <button
                                  onClick={() => handleCopyRedline(cardId, enriched.courtGradeRedline)}
                                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFFFFF] border border-[#0E6B52] text-[#0E6B52] hover:bg-[#0E6B52] hover:text-white transition-all flex items-center gap-1 cursor-pointer shrink-0 font-ui"
                                >
                                  {copiedRedlineId === cardId ? <><Check size={12} className="text-current" /> Copied! ✓</> : <><Copy size={12} /> Copy Clause</>}
                                </button>
                              </div>
                              <div className="p-2.5 bg-[#FFFFFF] rounded text-xs font-serif text-[#0F1B2A] leading-relaxed border border-[#D9E1E7] select-all shadow-xs">
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
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <Calendar size={16} className="text-[#123B5C]" />
                  Contract Chronology & Vital Milestones ({auditResults.financialDates?.timeline?.length || 0} Events)
                </h4>
                {(!auditResults.financialDates?.timeline || auditResults.financialDates.timeline.length === 0) ? (
                  <div className="p-4 text-center text-xs text-[#5A6B7A] font-ui bg-[#F7F9FA] rounded-xl border border-[#D9E1E7]">
                    No explicit dates or milestones detected.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {auditResults.financialDates.timeline.map((item, idx) => (
                      <div key={idx} className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between shadow-xs ${item.isPast ? 'bg-[#FFFBEB] border-[#FDE68A]' : 'bg-[#FFFFFF] border-[#D9E1E7]'}`}>
                        <div>
                          <span className="font-bold text-[#0F1B2A]">{item.event}: </span>
                          <span className={item.isPast ? 'text-[#D97706] font-bold' : 'text-[#123B5C] font-bold'}>{item.date}</span>
                          <span className="text-[#5A6B7A] ml-2">(Line {item.line})</span>
                        </div>
                        {item.isPast && (
                          <span className="bg-[#D97706] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase font-ui">
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
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                  <h4 className="text-xs font-bold uppercase text-[#5A6B7A] font-ui mb-3 flex items-center gap-2">
                    <Clock size={14} className="text-[#0E6B52]" />
                    Notice Periods & Response Deadlines ({auditResults.financialDates.noticePeriods.length})
                  </h4>
                  <div className="space-y-2">
                    {auditResults.financialDates.noticePeriods.map((notice, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-xs flex items-center justify-between">
                        <span className="text-[#0E6B52] font-bold font-mono">{notice.periodDays} Days</span>
                        <span className="text-[#0F1B2A] truncate max-w-lg font-serif italic">"{notice.context}"</span>
                        <span className="text-[#5A6B7A] font-mono">Line {notice.line}</span>
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
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                <div className="flex flex-wrap items-center gap-2 text-xs font-ui">
                  <span className="text-[#5A6B7A] font-medium mr-1">Party:</span>
                  <button
                    onClick={() => setObligationPartyFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${obligationPartyFilter === 'all' ? 'bg-[#123B5C] text-white' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7]'}`}
                  >
                    All ({auditResults.obligations?.stats?.totalObligations || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Client')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${obligationPartyFilter === 'Client' ? 'bg-[#123B5C] text-white' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7]'}`}
                  >
                    Client ({auditResults.obligations?.partyBreakdown?.clientCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Counterparty')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${obligationPartyFilter === 'Counterparty' ? 'bg-[#123B5C] text-white' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7]'}`}
                  >
                    Counterparty ({auditResults.obligations?.partyBreakdown?.counterpartyCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Mutual')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${obligationPartyFilter === 'Mutual' ? 'bg-[#123B5C] text-white' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7]'}`}
                  >
                    Mutual ({auditResults.obligations?.partyBreakdown?.mutualCount || 0})
                  </button>
                  <button
                    onClick={() => setObligationPartyFilter('Third Party')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${obligationPartyFilter === 'Third Party' ? 'bg-[#123B5C] text-white' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#F7F9FA] border border-[#D9E1E7]'}`}
                  >
                    Third Party ({auditResults.obligations?.partyBreakdown?.thirdPartyCount || 0})
                  </button>
                </div>

                <button
                  onClick={() => exportObligationsCSV(auditResults.obligations)}
                  className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#123B5C] text-[#123B5C] hover:bg-[#123B5C] hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer font-ui"
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {/* Obligations Table */}
              <div className="rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F7F9FA] border-b border-[#D9E1E7] font-ui text-[#5A6B7A] uppercase text-[11px]">
                        <th className="p-3 w-12">#</th>
                        <th className="p-3 w-28">Party</th>
                        <th className="p-3 w-28">Duty Type</th>
                        <th className="p-3">Operative Obligation Sentence</th>
                        <th className="p-3 w-20">Line</th>
                        <th className="p-3 w-24">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9E1E7]">
                      {filteredObligations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#5A6B7A] font-ui">
                            No obligations found matching the current party filter.
                          </td>
                        </tr>
                      ) : (
                        filteredObligations.map((obl, idx) => {
                          const partyPill = obl.responsibleParty === 'Client' ? 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' :
                                            obl.responsibleParty === 'Counterparty' ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' :
                                            obl.responsibleParty === 'Mutual' ? 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]' :
                                            'bg-[#F7F9FA] text-[#5A6B7A] border-[#D9E1E7]';
                          const sevPill = obl.severity === 'high' ? 'bg-[#B3261E] text-white' :
                                          obl.severity === 'medium' ? 'bg-[#D97706] text-white' : 'bg-[#123B5C] text-white';

                          return (
                            <tr key={obl.id || idx} className="hover:bg-[#F7F9FA] transition-colors">
                              <td className="p-3 text-[#5A6B7A] font-mono">#{idx + 1}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase font-ui ${partyPill}`}>
                                  {obl.responsibleParty}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-[#123B5C] font-ui">{obl.modalVerb}</span>
                                <span className="text-[10px] text-[#5A6B7A] ml-1 font-mono">({obl.dutyType})</span>
                              </td>
                              <td className="p-3 font-serif text-[#0F1B2A] leading-relaxed text-xs">
                                {obl.sentence || obl.action}
                                {obl.sectionContext && (
                                  <span className="block text-[10px] font-mono text-[#5A6B7A] mt-0.5">
                                    Context: {obl.sectionContext}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-[#5A6B7A] font-mono">{obl.line}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-ui ${sevPill}`}>
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
              <div className="flex items-center justify-between border-b border-[#D9E1E7] pb-3">
                <h4 className="text-sm font-bold text-[#0F1B2A] flex items-center gap-2 font-ui">
                  <ShieldAlert size={16} className="text-[#B3261E]" />
                  Scanned Legal Liabilities & Red Flags ({auditResults.risks?.length || 0})
                </h4>
                <div className="flex items-center gap-1 text-xs font-ui">
                  <Filter size={13} className="text-[#5A6B7A] mr-1" />
                  <button
                    onClick={() => setRiskSeverityFilter('all')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${riskSeverityFilter === 'all' ? 'bg-[#123B5C] text-white font-bold' : 'text-[#5A6B7A] hover:text-[#0F1B2A]'}`}
                  >
                    All ({auditResults.risks?.length || 0})
                  </button>
                  <button
                    onClick={() => setRiskSeverityFilter('critical')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${riskSeverityFilter === 'critical' ? 'bg-[#B3261E] text-white font-bold' : 'text-[#5A6B7A] hover:text-[#0F1B2A]'}`}
                  >
                    Critical ({auditResults.risks?.filter(r => r.severity === 'critical').length || 0})
                  </button>
                  <button
                    onClick={() => setRiskSeverityFilter('warning')}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer ${riskSeverityFilter === 'warning' ? 'bg-[#D97706] text-white font-bold' : 'text-[#5A6B7A] hover:text-[#0F1B2A]'}`}
                  >
                    Warnings ({auditResults.risks?.filter(r => r.severity === 'warning').length || 0})
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {filteredRisks.length === 0 ? (
                  <div className="p-8 text-center text-[#5A6B7A] font-ui bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl">
                    No risk clauses matching the active filter.
                  </div>
                ) : (
                  filteredRisks.map((risk, index) => {
                    const isCrit = risk.severity === 'critical';
                    const isWarn = risk.severity === 'warning';
                    const borderLeft = isCrit ? 'border-l-4 border-l-[#B3261E]' : isWarn ? 'border-l-4 border-l-[#D97706]' : 'border-l-4 border-l-[#123B5C]';
                    const tagColor = isCrit ? 'bg-[#B3261E] text-white' : isWarn ? 'bg-[#D97706] text-white' : 'bg-[#123B5C] text-white';

                    return (
                      <div key={risk.id + index} className={`p-5 rounded-xl border border-[#D9E1E7] ${borderLeft} bg-[#FFFFFF] shadow-xs transition-all`}>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className={isCrit ? 'text-[#B3261E]' : isWarn ? 'text-[#D97706]' : 'text-[#123B5C]'} />
                            <h4 className="text-sm font-bold text-[#0F1B2A] font-serif">"{risk.phrase}"</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full font-ui ${tagColor}`}>
                              {risk.severity}
                            </span>
                            <span className="text-[11px] text-[#5A6B7A] font-mono">Found {risk.count}x</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#0F1B2A] mb-2 font-ui">
                          <strong className="text-[#5A6B7A]">Risk Assessment: </strong>{risk.description}
                        </p>

                        <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#0E6B52] font-ui">
                          <strong>Negotiation Guidance: </strong>{risk.recommendation}
                        </div>

                        {risk.occurrences && risk.occurrences.length > 0 && (
                          <div className="mt-2 text-xs font-serif text-[#5A6B7A] italic bg-[#F7F9FA] p-2 rounded border border-[#D9E1E7]">
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
              <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] font-serif text-sm leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar shadow-xs text-[#0F1B2A]">
                {auditResults.diff.segments.map((seg) => {
                  if (seg.type === 'added') {
                    return (
                      <span 
                        key={seg.id} 
                        className="bg-[#DCFCE7] text-[#14532D] font-medium px-1 py-0.5 mx-0.5 rounded border border-[#86EFAC]"
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
                        className="bg-[#FEE2E2] text-[#991B1B] line-through px-1 py-0.5 mx-0.5 rounded border border-[#FCA5A5] opacity-80"
                        title="Removed from original draft"
                      >
                        {seg.value}
                      </span>
                    );
                  }
                  return <span key={seg.id} className="text-[#0F1B2A]">{seg.value}</span>;
                })}
              </div>

              {/* Clause Breakdown */}
              {auditResults.diff.clauseDiffs && (
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-ui uppercase text-[#5A6B7A] font-bold mb-2">
                    Clause-by-Clause Modifications ({auditResults.diff.clauseDiffs.length} Clauses)
                  </h4>
                  {auditResults.diff.clauseDiffs.map((clause) => {
                    const badge = clause.status === 'modified' ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' :
                                  clause.status === 'inserted' ? 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]' :
                                  clause.status === 'deleted' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]' : 'bg-[#F7F9FA] text-[#5A6B7A] border-[#D9E1E7]';

                    return (
                      <div key={clause.index} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
                        <div className="flex items-center justify-between mb-1.5 font-ui">
                          <span className="text-xs font-bold text-[#0F1B2A]">Clause / Paragraph #{clause.index}</span>
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${badge}`}>
                            {clause.status}
                          </span>
                        </div>

                        <div className="font-serif text-xs leading-relaxed text-[#0F1B2A]">
                          {clause.diff ? clause.diff.map((d, dIdx) => (
                            <span key={dIdx} className={d.type === 'added' ? 'bg-[#DCFCE7] text-[#14532D] font-bold px-0.5 rounded' : d.type === 'removed' ? 'bg-[#FEE2E2] text-[#991B1B] line-through px-0.5 rounded' : ''}>
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

          {/* ========================================================================= */}
          {/* LEGAL PROTECTION SHIELD & MALPRACTICE VERIFICATION NOTICE                 */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] border-l-4 border-l-[#0E6B52] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#0E6B52] shrink-0 mt-0.5">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-[#0F1B2A] uppercase tracking-wider font-ui">
                    Legal Protection Shield · Malpractice & Quality Control Notice
                  </h4>
                  <span className="text-[9px] font-ui bg-[#F0FDF4] text-[#0E6B52] border border-[#BBF7D0] px-2 py-0.5 rounded font-bold">
                    VERIFICATION MANDATE
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6B7A] leading-relaxed max-w-3xl font-ui">
                  <strong>Mandatory Counsel Verification Notice:</strong> Automated audit flags, redlines, and suggested remediation clauses are AI-assisted decision heuristics designed for preliminary analytical support. Under ABA Model Rule 1.1 (Competence) and standard professional conduct codes, the reviewing attorney must independently review and verify all contract provisions, statutory citations, and defined terms prior to client execution or court filing.
                </p>
              </div>
            </div>
            <div className="shrink-0 self-end md:self-center">
              <span className="text-[10px] font-mono text-[#0E6B52] bg-[#F7F9FA] border border-[#D9E1E7] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <Lock size={11} />
                <span>Zero Cloud Liability</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. SMART PII REDACTOR VIEW (Toggleable Rules + Live Counts + Mask Styles)
// =========================================================================
function PIIRedactorView() {
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
        const result = await mammoth.extractRawText({ arrayBuffer });
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
    <div className="max-w-6xl mx-auto h-full flex flex-col gap-6 font-ui text-[#0F1B2A]">
      <div>
        <h2 className="text-2xl font-bold text-[#0F1B2A] flex items-center gap-3 tracking-tight">
          <span>Air-Gapped Smart PII Redactor</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#0E6B52] border border-[#BBF7D0] font-bold">
            Confidentiality Safe
          </span>
        </h2>
        <p className="text-[#5A6B7A] text-xs mt-1">
          Irreversibly sanitize Social Security numbers, payment cards, banking info, and confidential names in-memory before sharing documents.
        </p>
      </div>

      {/* Rules Selector Bar */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F1B2A] uppercase tracking-wider">Active Detection Rules:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A6B7A]">Masking Style:</span>
            <select
              value={maskStyle}
              onChange={(e) => setMaskStyle(e.target.value)}
              className="bg-[#FFFFFF] border border-[#D9E1E7] rounded-lg px-2.5 py-1 text-xs text-[#0F1B2A] outline-none focus:border-[#123B5C]"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  active 
                    ? 'bg-[#123B5C] text-white shadow-xs' 
                    : 'bg-[#F7F9FA] text-[#5A6B7A] border border-[#D9E1E7] hover:bg-[#E5EAEF]'
                }`}
              >
                {active ? <CheckCircle2 size={13} className="text-[#86EFAC]" /> : <div className="w-3 h-3 rounded-full border border-[#D9E1E7]" />}
                {rule.label}
              </button>
            );
          })}
        </div>

        {/* Custom Keywords Tag Field */}
        <div className="mt-2 pt-3 border-t border-[#D9E1E7] flex flex-col gap-2">
          <label className="text-xs text-[#5A6B7A] font-medium">Add Confidential Parties, Client Names, or Custom Keywords:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customKeywordInput}
              onChange={(e) => setCustomKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="e.g. Acme Corporation, John Doe, Project Falcon (Press Enter)"
              className="flex-1 bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-4 py-2 text-xs text-[#0F1B2A] outline-none focus:border-[#123B5C]"
            />
            <button
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-[#123B5C] hover:bg-[#0C2A42] text-xs font-bold text-white rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Add Tag
            </button>
          </div>

          {customKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {customKeywords.map(kw => (
                <span key={kw} className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#123B5C] text-xs font-mono flex items-center gap-1.5 font-bold">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="text-[#123B5C] hover:text-[#B3261E]"><X size={12} /></button>
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
          className={`flex flex-col rounded-xl bg-[#FFFFFF] border shadow-xs transition-all overflow-hidden relative ${
            isDragging 
              ? 'border-[#0E6B52] bg-[#F0FDF4] ring-2 ring-[#0E6B52]/30' 
              : 'border-[#D9E1E7]'
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none text-[#0E6B52] gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center">
                <Upload size={28} className="animate-bounce" />
              </div>
              <p className="text-sm font-bold text-[#0F1B2A] tracking-wide">Drop Document to Redact Here</p>
              <p className="text-xs text-[#5A6B7A] font-mono">Supports .docx, .txt, .pdf</p>
            </div>
          )}
          <div className="p-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A6B7A] font-ui">INPUT TEXT (Drag & Drop or Import)</span>
            <label className="cursor-pointer bg-[#FFFFFF] hover:bg-[#F7F9FA] border border-[#D9E1E7] px-2.5 py-1 rounded-lg text-xs font-medium text-[#0F1B2A] transition-colors">
              Upload (.docx/.txt/.pdf)
              <input type="file" accept=".txt,.docx,.md,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract or memo text containing confidential information or drop file here to redact..."
            className="flex-1 bg-[#FFFFFF] p-4 text-xs font-serif leading-relaxed text-[#0F1B2A] outline-none resize-none focus:bg-[#FAFAFA] custom-scrollbar min-h-[300px]"
          />
        </div>

        {/* Right: Sanitized Preview */}
        <div className="flex flex-col rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs overflow-hidden">
          <div className="p-3 bg-[#F7F9FA] border-b border-[#D9E1E7] flex items-center justify-between">
            <span className="text-xs font-bold text-[#0E6B52] font-ui flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#0E6B52]" />
              SANITIZED PREVIEW {sanitizedResult ? `(${sanitizedResult.totalRedactions} items redacted)` : ''}
            </span>
            {sanitizedResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadSanitizedPdf}
                  disabled={isGeneratingPdf}
                  className="bg-[#123B5C] hover:bg-[#0C2A42] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 font-ui"
                  title="Export court-grade redacted PDF (Letter format, headers, pagination, ABA Rule 1.6)"
                >
                  {isGeneratingPdf ? <RefreshCw className="animate-spin" size={13} /> : <FileDown size={13} />}
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Redacted PDF'}</span>
                </button>
                <button
                  onClick={handleDownloadSanitizedTxt}
                  className="bg-[#FFFFFF] hover:bg-[#F7F9FA] text-[#0F1B2A] border border-[#D9E1E7] px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-ui"
                  title="Export raw text"
                >
                  <Download size={13} /> Text
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 bg-[#FFFFFF] p-4 text-xs font-serif leading-relaxed text-[#0F1B2A] overflow-y-auto custom-scrollbar select-text min-h-[300px]">
            {sanitizedResult ? (
              <pre className="whitespace-pre-wrap font-serif text-[#0F1B2A]">{sanitizedResult.sanitizedText}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#5A6B7A] gap-2 py-16">
                <EyeOff size={32} className="opacity-40" />
                <p className="font-ui text-xs">Click "Sanitize Document" to preview redacted text.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs">
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-mono text-[#0E6B52] flex items-center gap-1 font-bold">
              <Check size={14} /> {saveStatus}
            </span>
          )}
        </div>

        <button
          onClick={handleExecuteRedaction}
          disabled={isProcessing || !text.trim()}
          className="px-8 py-3.5 bg-[#123B5C] hover:bg-[#0C2A42] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 shadow-xs cursor-pointer font-ui"
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
function BatesStamperView() {
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

  const handleAddFiles = (e) => {
    const selected = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
    setFiles(prev => [...prev, ...selected]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const selected = Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.pdf'));
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
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6 font-ui text-[#0F1B2A]">
      <div>
        <h2 className="text-2xl font-bold text-[#0F1B2A] flex items-center gap-3 tracking-tight">
          <span>Enterprise Bates Stamping & Binder</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#123B5C] border border-[#BFDBFE] font-bold">
            pdf-lib Native
          </span>
        </h2>
        <p className="text-[#5A6B7A] text-xs mt-1">
          Sequentially number trial exhibits and production binders locally. High-contrast backing pill ensures readability on dark scans.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="p-6 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Bates Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2.5 text-sm text-[#0F1B2A] focus:border-[#123B5C] outline-none font-mono"
              placeholder="e.g. PLTF-, CONF-"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Start Number</label>
            <input
              type="number"
              min="1"
              value={startNum}
              onChange={(e) => setStartNum(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2.5 text-sm text-[#0F1B2A] focus:border-[#123B5C] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Digit Padding</label>
            <select
              value={padLength}
              onChange={(e) => setPadLength(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2.5 text-sm text-[#0F1B2A] focus:border-[#123B5C] outline-none font-ui"
            >
              <option value={3}>3 Digits (e.g. 001)</option>
              <option value={4}>4 Digits (e.g. 0001)</option>
              <option value={5}>5 Digits (e.g. 00001)</option>
              <option value={6}>6 Digits (e.g. 000001)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Stamp Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2.5 text-sm text-[#0F1B2A] focus:border-[#123B5C] outline-none font-ui"
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-[#D9E1E7] items-center">
          <div>
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2 text-xs text-[#0F1B2A] focus:border-[#123B5C] outline-none font-ui"
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
            <label className="block text-[11px] font-bold text-[#5A6B7A] mb-1.5 uppercase tracking-wider font-ui">Ink Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D9E1E7] rounded-xl px-3.5 py-2 text-xs text-[#0F1B2A] focus:border-[#123B5C] outline-none font-ui"
            >
              <option value="black">Black Ink</option>
              <option value="red">Red Ink (Urgent/Confidential)</option>
              <option value="blue">Blue Ink (Official Seal)</option>
              <option value="white">White Ink</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <label className="cursor-pointer flex items-center gap-2 text-xs text-[#0F1B2A] select-none font-ui">
              <input
                type="checkbox"
                checked={drawPill}
                onChange={(e) => setDrawPill(e.target.checked)}
                className="w-4 h-4 accent-[#123B5C] rounded border-[#D9E1E7]"
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
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all relative cursor-pointer ${
          isDragging 
            ? 'border-[#123B5C] bg-[#EFF6FF] scale-[1.01]' 
            : 'border-[#D9E1E7] hover:border-[#123B5C] bg-[#FFFFFF] hover:bg-[#F7F9FA] shadow-xs'
        }`}
      >
        <Layers className={`mb-3 transition-transform duration-300 ${isDragging ? 'text-[#123B5C] scale-125' : 'text-[#123B5C]'}`} size={40} />
        <p className="font-bold text-sm text-[#0F1B2A] font-ui">
          {isDragging ? 'Release to Add Exhibit PDFs' : 'Drop Exhibit PDFs Here'}
        </p>
        <p className="text-xs text-[#5A6B7A] mb-4 font-ui">Click to browse multiple documents for sequential stamping</p>
        <input type="file" multiple accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAddFiles} />
        <span className="px-4 py-2 bg-[#F7F9FA] border border-[#D9E1E7] rounded-xl text-xs font-semibold text-[#0F1B2A] font-ui">
          Browse PDF Files
        </span>
      </div>

      {/* Selected Files List & Reorder */}
      {files.length > 0 && (
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2 font-ui">
            <span className="text-xs font-bold text-[#0F1B2A]">Stamping Queue ({files.length} documents)</span>
            <span className="text-[11px] font-mono text-[#5A6B7A]">Preview: {prefix}{String(startNum).padStart(padLength, '0')}</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#F7F9FA] border border-[#D9E1E7] text-xs font-mono">
                <span className="truncate max-w-[340px] text-[#0F1B2A]">
                  {idx + 1}. {f.name} ({(f.size / 1024).toFixed(0)} KB)
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(idx, -1)} disabled={idx === 0} className="px-2 py-1 bg-[#FFFFFF] border border-[#D9E1E7] hover:bg-[#E5EAEF] rounded disabled:opacity-20 text-[10px] cursor-pointer">▲</button>
                  <button onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1} className="px-2 py-1 bg-[#FFFFFF] border border-[#D9E1E7] hover:bg-[#E5EAEF] rounded disabled:opacity-20 text-[10px] cursor-pointer">▼</button>
                  <button onClick={() => removeFile(idx)} className="p-1 text-[#B3261E] hover:text-[#991B1B] ml-2 cursor-pointer"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress & Submit */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex items-center justify-between font-ui">
        <div className="text-xs text-[#5A6B7A]">
          {isProcessing ? (
            <span className="text-[#123B5C] font-mono font-bold animate-pulse">
              Stamping in progress: {progress.current} pages written...
            </span>
          ) : lastBundle ? (
            <span className="text-[#0E6B52] font-mono font-bold">
              Completed! Range: {lastBundle.batesRange} ({lastBundle.totalPages} pages)
            </span>
          ) : (
            <span>Ready to process. All stamping happens locally in RAM.</span>
          )}
        </div>

        <button
          onClick={handleProcessPdfs}
          disabled={isProcessing || files.length === 0}
          className="px-8 py-3.5 bg-[#123B5C] hover:bg-[#0C2A42] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 disabled:opacity-40 shadow-xs cursor-pointer font-ui"
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
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6 font-ui text-[#0F1B2A]">
      <div className="flex items-center justify-between border-b border-[#D9E1E7] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F1B2A] flex items-center gap-3 tracking-tight">
            <span>Air-Gapped Audit Vault</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F0FDF4] text-[#0E6B52] border border-[#BBF7D0] font-bold">
              IndexedDB Storage
            </span>
          </h2>
          <p className="text-[#5A6B7A] text-xs mt-1">
            All audits, diff sessions, and redaction records are retained 100% locally in your browser sandbox. Survives tab refresh without cloud syncing.
          </p>
        </div>

        <button
          onClick={handleClearAll}
          className="px-3.5 py-2 bg-[#FDF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-xs font-bold text-[#B3261E] transition-colors flex items-center gap-1.5 cursor-pointer font-ui"
        >
          <Trash2 size={14} /> Clear Local Vault
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSection('diffs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSection === 'diffs' ? 'bg-[#123B5C] text-white shadow-xs' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#FFFFFF] border border-[#D9E1E7]'}`}
        >
          Saved Audits ({diffSessions.length})
        </button>
        <button
          onClick={() => setActiveSection('redacts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSection === 'redacts' ? 'bg-[#123B5C] text-white shadow-xs' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#FFFFFF] border border-[#D9E1E7]'}`}
        >
          Redaction Logs ({redactionLogs.length})
        </button>
        <button
          onClick={() => setActiveSection('bates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSection === 'bates' ? 'bg-[#123B5C] text-white shadow-xs' : 'text-[#5A6B7A] hover:text-[#0F1B2A] bg-[#FFFFFF] border border-[#D9E1E7]'}`}
        >
          Bates Jobs ({batesJobs.length})
        </button>
      </div>

      {/* Section Content */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E7] shadow-xs flex-1 overflow-y-auto custom-scrollbar">
        {activeSection === 'diffs' && (
          <div className="space-y-3">
            {diffSessions.length === 0 ? (
              <p className="text-center text-[#5A6B7A] text-xs py-8">No saved diff sessions yet. Run an audit to record history.</p>
            ) : (
              diffSessions.map(session => (
                <div key={session.id} className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1B2A]">{session.title}</h4>
                    <p className="text-[11px] font-mono text-[#5A6B7A] mt-1">
                      {new Date(session.updatedAt).toLocaleString()} | +{session.stats?.additions || 0} / -{session.stats?.deletions || 0} words | {session.risksCount || 0} liabilities {typeof session.overallRiskScore === 'number' ? `| Score: ${session.overallRiskScore}/100` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDiff && onSelectDiff(session)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#123B5C] hover:bg-[#123B5C] hover:text-white bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Open / Restore Session"
                    >
                      <RotateCcw size={13} /> Open Session
                    </button>
                    <button
                      onClick={() => handleDeleteDiff(session.id)}
                      className="p-1.5 text-[#B3261E] hover:bg-[#FEE2E2] rounded bg-[#FDF2F2] border border-[#FCA5A5] cursor-pointer"
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
              <p className="text-center text-[#5A6B7A] text-xs py-8">No redaction logs recorded.</p>
            ) : (
              redactionLogs.map(log => (
                <div key={log.id} className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1B2A]">{log.title}</h4>
                    <p className="text-[11px] font-mono text-[#5A6B7A] mt-1">
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
              <p className="text-center text-[#5A6B7A] text-xs py-8">No Bates stamping jobs recorded.</p>
            ) : (
              batesJobs.map(job => (
                <div key={job.id} className="p-4 rounded-xl bg-[#F7F9FA] border border-[#D9E1E7] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0F1B2A]">Range: {job.batesRange}</h4>
                    <p className="text-[11px] font-mono text-[#5A6B7A] mt-1">
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
