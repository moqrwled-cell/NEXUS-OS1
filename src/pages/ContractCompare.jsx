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
  Settings, Key, Laptop, Copy, Mail, LogOut
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
  exportExecutiveClientMemoHTML, exportObligationsCSV
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
import PirateTrapModal from '../components/PirateTrapModal';

export default function ContractCompare() {
  const [activeTool, setActiveTool] = useState('analyzer'); // analyzer | bates | redact | history
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
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/8 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00FF9D]/8 blur-[180px] rounded-full pointer-events-none" />

      {/* Sidebar — Professional Legal Dashboard */}
      <aside className="w-full md:w-[280px] bg-[#050A0F] border-r border-zinc-800/60 flex flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-zinc-800/60">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0A1A14] border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <ShieldAlert className="text-emerald-400" size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">ContractGuard</h1>
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
          <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-semibold px-2 mb-1">Modules</p>

          {/* Module 1: Analyzer */}
          <button
            onClick={() => setActiveTool('analyzer')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'analyzer'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Search size={16} className={activeTool === 'analyzer' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Integrity & Diff Audit</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Pre-signing review & redline</p>
            </div>
            {activeTool === 'analyzer' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          {activeTool === 'analyzer' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-2">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">①</span>
                  <span><span className="text-zinc-200 font-semibold">Single Draft Review — </span><span className="text-zinc-400">Paste unexecuted contract to flag broken cross-references, missing exhibits, undefined terms, and financial discrepancies.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">②</span>
                  <span><span className="text-zinc-200 font-semibold">Redline Diff Mode — </span><span className="text-zinc-400">Compare original draft vs counterparty redline with color-coded insertions and deletions.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-400 font-bold shrink-0">③</span>
                  <span><span className="text-zinc-200 font-semibold">Run Audit Engine — </span><span className="text-zinc-400">Generates comprehensive risk radar and exportable Client Legal Memo (PDF/CSV).</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 2: PII Redactor */}
          <button
            onClick={() => setActiveTool('redact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'redact'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <EyeOff size={16} className={activeTool === 'redact' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Identity & financial scrub</p>
            </div>
            {activeTool === 'redact' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          {activeTool === 'redact' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-2">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">①</span>
                  <span><span className="text-zinc-200 font-semibold">Active Rules — </span><span className="text-zinc-400">Toggle detection filters for SSN, tax IDs, credit cards, banking info, emails, and phone numbers.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">②</span>
                  <span><span className="text-zinc-200 font-semibold">Custom Keywords — </span><span className="text-zinc-400">Add proprietary client names, company tags, or project titles for automated scrubbing.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-400 font-bold shrink-0">③</span>
                  <span><span className="text-zinc-200 font-semibold">Masking Style — </span><span className="text-zinc-400">Choose redaction output: Solid Black Block (█████), Semantic Tag ([REDACTED]), or Asterisks.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: Bates Stamping */}
          <button
            onClick={() => setActiveTool('bates')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'bates'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Layers size={16} className={activeTool === 'bates' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Court evidence numbering</p>
            </div>
            {activeTool === 'bates' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          {activeTool === 'bates' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-2">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">①</span>
                  <span><span className="text-zinc-200 font-semibold">Bates Standard — </span><span className="text-zinc-400">Official court discovery numbering sequence (e.g. PLTF-0001) applied directly to evidentiary PDFs.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">②</span>
                  <span><span className="text-zinc-200 font-semibold">Prefix Attribution — </span><span className="text-zinc-400">Designate party filing: PLTF (Plaintiff), DEF (Defendant), or CONF (Confidential exhibit).</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-amber-400 font-bold shrink-0">③</span>
                  <span><span className="text-zinc-200 font-semibold">Contrast Backing — </span><span className="text-zinc-400">Renders high-contrast white backing pill to ensure legibility across dark scanned exhibits.</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Module 4: Audit Vault */}
          <button
            onClick={() => setActiveTool('history')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeTool === 'history'
                ? 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }`}
          >
            <Database size={16} className={activeTool === 'history' ? 'text-emerald-400 shrink-0' : 'text-zinc-500 shrink-0'} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
              <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Encrypted local persistence</p>
            </div>
            {activeTool === 'history' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
          </button>
          {activeTool === 'history' && (
            <div className="mx-1 mt-0.5 mb-1 px-3 py-3 rounded-lg bg-zinc-900/70 border border-zinc-800/70">
              <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-2">How To Use (For Counsel)</p>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">①</span>
                  <span><span className="text-zinc-200 font-semibold">Local Storage — </span><span className="text-zinc-400">Every audit and redline session is retained in client-side IndexedDB without cloud transmission.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">②</span>
                  <span><span className="text-zinc-200 font-semibold">Restore Session — </span><span className="text-zinc-400">Reopen previous contract reviews, re-examine liabilities, or export updated client memos.</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400 font-bold shrink-0">③</span>
                  <span><span className="text-zinc-200 font-semibold">Purge Vault — </span><span className="text-zinc-400">Permanently clears local database records to uphold strict client-attorney confidentiality.</span></span>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Workstation & License Settings Button */}
        <div className="px-3.5 pt-2 pb-1.5 border-t border-zinc-800/60">
          <button
            onClick={() => { setShowSettingsModal(true); loadDeviceLicenseData(); }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-semibold text-zinc-200 transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Settings size={14} className="text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span className="truncate">Workstation & License</span>
            </div>
            <span className="text-[9px] font-mono uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold shrink-0">
              {licenseData?.plan === 'firm' ? 'Firm' : 'Solo'}
            </span>
          </button>
        </div>

        {/* Bottom: PWA Install */}
        <div className="px-4 py-3 border-t border-zinc-800/40">
          <button
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <HardDriveDownload size={14} />
            Install Offline App (PWA)
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-5 md:p-7 overflow-y-auto z-10 custom-scrollbar flex flex-col">
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#08121A] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col gap-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
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
// 1. CONTRACT ANALYZER VIEW (Dual Modes + Web Worker HUD + Multi-Export)
// =========================================================================
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

  const [activeHudTab, setActiveHudTab] = useState('crossRefs'); // crossRefs | definedTerms | financialDates | obligations | risks | diff
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
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Contract Integrity & Risk Audit
            </h2>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Air-Gapped RAM
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Pre-signature legal proofreading for cross-references, missing exhibits, undefined terms, and financial contradictions.
          </p>
        </div>

        {/* Mode Selector only — Load Demo Contract removed */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-black/60 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                setAnalysisMode('single');
                setActiveHudTab('crossRefs');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                analysisMode === 'single'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white'
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                analysisMode === 'comparative'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Search size={14} />
              Redline Diff Mode
            </button>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Matter Metadata Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1">Matter / Agreement Title</label>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="e.g. Master Services Agreement"
            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1 flex items-center gap-1.5">
            <User size={13} className="text-cyan-400" /> Client Entity (Your Side)
          </label>
          <input
            type="text"
            value={clientParty}
            onChange={(e) => setClientParty(e.target.value)}
            placeholder="e.g. Acme Corporation"
            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-cyan-500 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1 flex items-center gap-1.5">
            <Users size={13} className="text-emerald-400" /> Counterparty Name
          </label>
          <input
            type="text"
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            placeholder="e.g. Globex Systems Inc"
            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
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
          className={`flex flex-col rounded-2xl bg-zinc-900/50 border transition-all overflow-hidden shadow-xl relative ${
            isDraggingTarget 
              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50' 
              : 'border-zinc-800'
          }`}
        >
          {isDraggingTarget && (
            <div className="absolute inset-0 z-30 bg-[#030712]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-emerald-400 gap-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <Upload size={30} className="animate-bounce" />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">Drop Contract Document Here</p>
              <p className="text-xs text-zinc-400 font-mono">Supports .pdf, .docx, .txt, .md + Scanned Images (.png, .jpg)</p>
            </div>
          )}

          <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 font-mono flex items-center gap-2">
              <FileCheck size={15} className="text-emerald-400" />
              CONTRACT DRAFT TO PROOFREAD (Drag & Drop or Import)
            </span>
            <div className="flex items-center gap-2">
              {uploadStatus.target && (
                <span className="text-xs font-mono text-cyan-400">{uploadStatus.target}</span>
              )}
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5">
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
            className="w-full bg-black/40 p-5 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[260px]"
          />
          <div className="px-5 py-2.5 border-t border-zinc-800/80 bg-zinc-950/60 text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span>Air-gapped client RAM processing · Drag & Drop enabled</span>
            <span className="font-semibold text-zinc-300">
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
            className={`flex flex-col rounded-2xl bg-zinc-900/50 border transition-all overflow-hidden shadow-xl relative ${
              isDraggingBaseline 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-2 ring-cyan-400/50' 
                : 'border-zinc-800'
            }`}
          >
            {isDraggingBaseline && (
              <div className="absolute inset-0 z-30 bg-[#030712]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-cyan-400 gap-2 animate-in fade-in">
                <Upload size={26} className="animate-bounce" />
                <p className="text-xs font-bold text-white">Drop Baseline Document Here</p>
                <p className="text-[10px] text-zinc-400 font-mono">.pdf, .docx, .txt</p>
              </div>
            )}

            <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 font-mono flex items-center gap-2">
                <FileText size={14} className="text-zinc-400" />
                ORIGINAL BASELINE (Drop file here)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.baseline && (
                  <span className="text-xs font-mono text-cyan-400">{uploadStatus.baseline}</span>
                )}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-zinc-700 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1">
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
              className="w-full bg-black/40 p-4 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[240px]"
            />
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/60 text-xs font-mono text-zinc-400 text-right">
              {baselineText.trim() ? baselineText.trim().split(/\s+/).length.toLocaleString() : 0} words
            </div>
          </div>

          {/* Amended Contract */}
          <div 
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingTarget(false); }}
            onDrop={(e) => handleFileDrop(e, setText, 'target', setIsDraggingTarget)}
            className={`flex flex-col rounded-2xl bg-zinc-900/50 border transition-all overflow-hidden shadow-xl relative ${
              isDraggingTarget 
                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-2 ring-emerald-400/50' 
                : 'border-zinc-800'
            }`}
          >
            {isDraggingTarget && (
              <div className="absolute inset-0 z-30 bg-[#030712]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-emerald-400 gap-2 animate-in fade-in">
                <Upload size={26} className="animate-bounce" />
                <p className="text-xs font-bold text-white">Drop Amended Document Here</p>
                <p className="text-[10px] text-zinc-400 font-mono">.pdf, .docx, .txt, .png, .jpg</p>
              </div>
            )}

            <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-2">
                <FileCheck size={14} className="text-cyan-400" />
                AMENDED DRAFT (Drop file here)
              </span>
              <div className="flex items-center gap-2">
                {uploadStatus.target && (
                  <span className="text-xs font-mono text-cyan-400">{uploadStatus.target}</span>
                )}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-zinc-700 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1">
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
              className="w-full bg-black/40 p-4 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[240px]"
            />
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/60 text-xs font-mono text-zinc-400 text-right">
              {text.trim() ? text.trim().split(/\s+/).length.toLocaleString() : 0} words
            </div>
          </div>
        </div>
      )}

      {/* Control Bar & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex items-center gap-4">
          {analysisMode === 'comparative' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">Diff Precision:</span>
              <div className="flex bg-black/60 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setDiffGranularity('word')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    diffGranularity === 'word' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Word
                </button>
                <button
                  onClick={() => setDiffGranularity('line')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    diffGranularity === 'line' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
          )}

          {saveStatus && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Check size={14} /> {saveStatus}
            </span>
          )}

          {workerError && (
            <span className="text-xs font-mono text-red-400 flex items-center gap-1.5">
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
              className="px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] cursor-pointer active:scale-95"
            >
              <StopCircle size={16} />
              <span>Cancel Audit</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleExecuteAudit()}
            disabled={isProcessing || !text.trim() || (analysisMode === 'comparative' && !baselineText.trim())}
            className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold text-sm rounded-xl hover:opacity-95 transition-all flex items-center gap-2.5 disabled:opacity-40 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98] cursor-pointer"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            <span>
              {isProcessing
                ? 'Auditing in Local Memory...'
                : analysisMode === 'single'
                ? 'Run Integrity Audit'
                : 'Execute Redline Diff & Audit'}
            </span>
          </button>
        </div>
      </div>

      {/* Live In-Memory Progress Bar */}
      {isProcessing && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-500/30 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
              <RefreshCw className="animate-spin text-cyan-400" size={14} />
              {progress?.msg || 'Auditing contract in local memory...'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-white">
                {progress?.percent || 0}%
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cancelAnalysis();
                }}
                className="px-2.5 py-1 bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2.5 rounded-full transition-all duration-150"
              style={{ width: `${progress?.percent || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results HUD */}
      {auditResults && (
        <div className="flex flex-col gap-6 animate-fade-in mt-2">
          {/* Executive Risk Score & Metrics Banner */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className={`px-6 py-4 rounded-2xl border text-center ${riskScoreBadgeColor} shadow-lg shrink-0`}>
                <span className="text-4xl font-black block font-mono tracking-tight">{riskScore}</span>
                <span className="text-xs font-extrabold uppercase tracking-wider block mt-0.5">
                  {riskLevel} RISK
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {riskScore >= 75 ? 'Critical Drafting Defects Detected' :
                   riskScore >= 45 ? 'High Risk Legal Anomalies Found' :
                   riskScore >= 20 ? 'Moderate Drafting Gaps Identified' :
                   'Clean Document Integrity Profile'}
                </h3>
                <p className="text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                  {auditResults.meta?.wordCount || 0} words audited in {auditResults.meta?.processingTimeMs || 0}ms across 4 verification engines. 100% in-memory RAM processing.
                </p>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => exportExecutiveClientMemoHTML({
                  contractTitle: documentTitle.trim() || 'Contract Integrity & Legal Audit',
                  clientName: clientParty.trim() || 'Client',
                  counterpartyName: counterparty.trim() || 'Counterparty',
                  auditData: auditResults
                })}
                className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                title="Generate executive legal memorandum with print CSS for 1-click PDF"
              >
                <Download size={14} />
                Client Memo (PDF)
              </button>

              <button
                onClick={() => exportObligationsCSV(auditResults.obligations)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-zinc-700 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
                title="Export contractual obligations schedule to CSV spreadsheet"
              >
                <FileSpreadsheet size={14} className="text-cyan-400" />
                Obligations CSV
              </button>

              {auditResults.diff && (
                <button
                  onClick={() => exportRedlineToHTML(auditResults.diff, auditResults.risks, { title: documentTitle.trim() || 'Contract Redline Audit' })}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
                  title="Export interactive HTML redline with insertions & deletions"
                >
                  <FileCode size={14} />
                  Redline HTML
                </button>
              )}

              <button
                onClick={() => exportAuditReportJSON(auditResults.diff, auditResults.risks, null, { title: documentTitle.trim() || 'Contract Integrity Audit' })}
                className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 transition-all cursor-pointer"
                title="Export compliance JSON verification record"
              >
                JSON
              </button>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-4.5 rounded-2xl bg-zinc-900/60 border border-red-500/20 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Broken Citations</p>
              <p className="text-3xl font-black text-red-400 mt-1 font-mono">
                {auditResults.crossRefs?.stats?.brokenCount || 0}
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-zinc-900/60 border border-amber-500/20 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Missing Exhibits</p>
              <p className="text-3xl font-black text-amber-400 mt-1 font-mono">
                {auditResults.crossRefs?.stats?.missingExhibitCount || 0}
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-zinc-900/60 border border-orange-500/20 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Financial Mismatches</p>
              <p className="text-3xl font-black text-orange-400 mt-1 font-mono">
                {auditResults.financialDates?.stats?.mismatchCount || 0}
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-zinc-900/60 border border-cyan-500/20 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Undefined Terms</p>
              <p className="text-3xl font-black text-cyan-400 mt-1 font-mono">
                {auditResults.definedTerms?.stats?.undefinedCount || 0}
              </p>
            </div>
            <div className="p-4.5 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Contract Obligations</p>
              <p className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                {auditResults.obligations?.stats?.totalObligations || 0}
              </p>
            </div>
          </div>

          {/* Complete HUD Sub-Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 custom-scrollbar">
            <button
              onClick={() => setActiveHudTab('crossRefs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'crossRefs'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark size={14} />
              <span>Cross-References (R1)</span>
              {(auditResults.crossRefs?.issues?.length || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white font-mono font-bold">
                  {auditResults.crossRefs.issues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('definedTerms')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'definedTerms'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tag size={14} />
              <span>Defined Terms & Boilerplate (R2)</span>
              {((auditResults.definedTerms?.stats?.undefinedCount || 0) + (auditResults.definedTerms?.stats?.artifactCount || 0)) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-black font-mono font-bold">
                  {(auditResults.definedTerms?.stats?.undefinedCount || 0) + (auditResults.definedTerms?.stats?.artifactCount || 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('financialDates')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'financialDates'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign size={14} />
              <span>Financial & Vital Dates (R3)</span>
              {(auditResults.financialDates?.issues?.length || 0) > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-600 text-white font-mono font-bold">
                  {auditResults.financialDates.issues.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveHudTab('obligations')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'obligations'
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckSquare size={14} />
              <span>Obligations Matrix ({auditResults.obligations?.stats?.totalObligations || 0})</span>
            </button>

            <button
              onClick={() => setActiveHudTab('risks')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeHudTab === 'risks'
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert size={14} />
              <span>Risk Radar ({auditResults.risks?.length || 0})</span>
            </button>

            {auditResults.diff && (
              <button
                onClick={() => setActiveHudTab('diff')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeHudTab === 'diff'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search size={14} />
                <span>Redline Diff ({auditResults.diff.stats?.similarity}% Sim)</span>
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

          {/* ========================================================================= */}
          {/* LEGAL PROTECTION SHIELD & MALPRACTICE VERIFICATION NOTICE                 */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-cyan-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
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
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
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
        <div 
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
          onDrop={handleFileDrop}
          className={`flex flex-col rounded-2xl liquid-glass-strong border transition-all overflow-hidden relative ${
            isDragging 
              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-2 ring-emerald-400/50' 
              : 'border-white/5'
          }`}
        >
          {isDragging && (
            <div className="absolute inset-0 z-30 bg-[#030712]/92 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none text-emerald-400 gap-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <Upload size={28} className="animate-bounce" />
              </div>
              <p className="text-sm font-bold text-white tracking-wide">Drop Document to Redact Here</p>
              <p className="text-xs text-zinc-400 font-mono">Supports .docx, .txt, .pdf</p>
            </div>
          )}
          <div className="p-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300 font-mono">INPUT TEXT (Drag & Drop or Import)</span>
            <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300 transition-colors">
              Upload (.docx/.txt/.pdf)
              <input type="file" accept=".txt,.docx,.md,.pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract or memo text containing confidential information or drop file here to redact..."
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
    <div className="max-w-5xl mx-auto h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
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
      <div 
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all relative cursor-pointer ${
          isDragging 
            ? 'border-nexus-emerald bg-nexus-emerald/15 shadow-[0_0_30px_rgba(0,255,157,0.3)] scale-[1.01]' 
            : 'border-white/10 hover:border-nexus-emerald/40 bg-black/20 hover:bg-black/40'
        }`}
      >
        <Layers className={`mb-3 transition-transform duration-300 ${isDragging ? 'text-nexus-emerald scale-125 animate-bounce' : 'text-nexus-emerald'}`} size={40} />
        <p className="font-bold text-sm text-white">
          {isDragging ? 'Release to Add Exhibit PDFs' : 'Drop Exhibit PDFs Here'}
        </p>
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
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
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
