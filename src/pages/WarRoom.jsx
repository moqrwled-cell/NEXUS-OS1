import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, ExternalLink, Copy, Check, Search, Filter, Shield, Star, 
  Download, Lock, Unlock, Send, Users, Building2, Sparkles, 
  RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, Flame,
  ChevronLeft, ChevronRight, Eye, HelpCircle, Loader2
} from 'lucide-react';

const MASTER_PIN = '2026';
const STORAGE_AUTH_KEY = 'nexus_war_room_auth_v1';
const STORAGE_PROGRESS_KEY = 'nexus_war_room_progress_v1';
const STORAGE_STARS_KEY = 'nexus_war_room_stars_v1';
const DAILY_TARGET = 25;

export default function WarRoom() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('attorneys'); // 'attorneys' | 'firms'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'CONTACTED' | 'STARRED'
  
  // Selected Outreach Strategy Angle (Hormozi / Behavioral Psychology)
  const [selectedAngle, setSelectedAngle] = useState('15sec'); // '15sec' | 'aba' | 'roi'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Contacted & Starred Local Storage Records
  const [contactedMap, setContactedMap] = useState({});
  const [starredSet, setStarredSet] = useState(new Set());
  
  // UI Toasts
  const [toastMessage, setToastMessage] = useState(null);
  const [previewModalLead, setPreviewModalLead] = useState(null);

  // Dynamic Leads Intelligence Database (Loaded in-memory ONLY after clearance)
  const [leadsData, setLeadsData] = useState({ attorneys: [], firms: [] });
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);

  // 1. Initial Load & URL Key Check
  useEffect(() => {
    // Force LTR text direction for the War Room interface
    document.documentElement.dir = 'ltr';

    // Check local storage for persistent session
    const savedAuth = localStorage.getItem(STORAGE_AUTH_KEY);
    const searchParams = new URLSearchParams(window.location.search);
    const urlKey = searchParams.get('key');

    if (savedAuth === 'authorized' || urlKey === 'nexus2026' || urlKey === '2026') {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_AUTH_KEY, 'authorized');
    }

    // Load Contacted Map
    try {
      const savedProgress = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (savedProgress) {
        setContactedMap(JSON.parse(savedProgress));
      }
    } catch (e) {
      console.error('Failed to parse progress', e);
    }

    // Load Starred Set
    try {
      const savedStars = localStorage.getItem(STORAGE_STARS_KEY);
      if (savedStars) {
        setStarredSet(new Set(JSON.parse(savedStars)));
      }
    } catch (e) {
      console.error('Failed to parse stars', e);
    }
  }, []);

  // 1.1 Lazy-load 20,012 leads dataset ONLY when authenticated
  useEffect(() => {
    if (isAuthenticated && leadsData.attorneys.length === 0) {
      setIsLeadsLoading(true);
      import('../data/warRoomLeads')
        .then((mod) => {
          setLeadsData({
            attorneys: mod.ATTORNEYS_DATA || [],
            firms: mod.FIRMS_DATA || []
          });
          setIsLeadsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load War Room leads:', err);
          setIsLeadsLoading(false);
        });
    }
  }, [isAuthenticated, leadsData.attorneys.length]);

  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth Submit
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === MASTER_PIN || pinInput.trim().toLowerCase() === 'nexus') {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_AUTH_KEY, 'authorized');
      setAuthError('');
      showToast('🛡️ Clearance Granted. Welcome Chief.');
    } else {
      setAuthError('Access Denied: Invalid Security Clearance PIN.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Toggle Contacted
  const toggleContacted = (leadId, autoMark = true) => {
    setContactedMap((prev) => {
      const next = { ...prev };
      if (next[leadId]) {
        if (!autoMark) delete next[leadId];
      } else {
        next[leadId] = {
          contactedAt: new Date().toISOString(),
          dateFormatted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Toggle Star
  const toggleStar = (leadId) => {
    setStarredSet((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      localStorage.setItem(STORAGE_STARS_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Generate Email Content with Strict Unicode LTR Markers & Psychological Hormozi Framing
  const generateEmailData = (lead, type, overrideAngle) => {
    const isAttorney = type === 'attorneys';
    const name = isAttorney ? lead.name : (lead.managingPartner || 'Counsel');
    const firmName = isAttorney ? lead.firm : lead.name;
    const email = lead.email;
    const angle = overrideAngle || selectedAngle;

    // Unicode Left-to-Right Mark (LRM) guarantees LTR alignment in any email client
    const LRM = '\u200E';

    let subject = '';
    let body = '';

    if (isAttorney) {
      // SOLO PRACTITIONER & TRANSACTIONAL PARTNER OUTREACH
      if (angle === 'aba') {
        // ANGLE 2: ABA MODEL RULE 1.6 & ETHICS ADVISORY SHIELD
        subject = `${LRM}state bar cloud AI warning & ${firmName}`;
        body = `${LRM}Hi ${name},

${LRM}With state bar ethics committees issuing formal warnings regarding client data leaks into public cloud AI, transactional counsel face an exhausting dilemma:

${LRM}Either spend late nights manually cross-referencing multi-version indemnification clauses and defined terms, or risk privileged client exposure on third-party cloud servers.

${LRM}We engineered ContractGuard to eliminate this ABA Model Rule 1.6 conflict entirely: an air-gapped forensic audit engine that runs 100% locally in your browser RAM with zero network transmission. No client data ever touches an external server, remote API, or LLM.

${LRM}It audits 40-page agreements in 15 seconds across 4 forensic engines, catches numerical mismatches and broken cross-references, and exports court-ready Word (.docx) amendment riders and signed Pre-Signing Diligence Certificates (.pdf).

${LRM}Instead of recurring $1,800/year subscriptions, we offer a single lifetime perpetual license ($199) with all upcoming feature releases and continuous engine evolution included.

${LRM}You can stress-test a sample agreement directly in our zero-network sandbox (no signup or payment required):
${LRM}https://www.nexus-os.store/demo

${LRM}Would you be opposed to a 60-second test to see how it flags cross-clause shifts before your next closing?

${LRM}Best regards,
${LRM}Nexus ContractGuard | Legal Forensic Systems
${LRM}office@nexus-os.store`;
      } else if (angle === 'roi') {
        // ANGLE 3: ANTI-SAAS $199 PERPETUAL LIFETIME ROI
        subject = `${LRM}eliminating $1,800/yr contract software fees for ${firmName}`;
        body = `${LRM}Hi ${name},

${LRM}Most legal tech vendors charge transactional solo attorneys $150 to $200 every single month ($1,800+/year)—only to route your confidential client drafts through third-party cloud servers with annual price hikes.

${LRM}We built ContractGuard with an anti-SaaS philosophy: a one-time perpetual lifetime license ($199) that runs 100% locally in your workstation RAM with zero cloud telemetry.

${LRM}What you get:
${LRM}• 15-Second Forensic Diligence: Audits 40-page agreements for broken cross-references, missing exhibits, and numerical discrepancies ($57,000 vs Fifty-Seven Thousand Dollars).
${LRM}• Court-Ready Deliverables: Instant 1-click Microsoft Word (.docx) amendment rider export + signed Pre-Signing Diligence Certificate (.pdf) for client closing binders.
${LRM}• Continuous Evolution Included: All future statutory rules, engine upgrades, and feature releases are included forever with zero monthly renewals.
${LRM}• 100% Air-Gapped Security: Fully compliant with ABA Model Rule 1.6 and NY State Bar Ethics Opinion 1240.

${LRM}Take the 15-second test drive right now (zero friction, no account, no credit card):
${LRM}https://www.nexus-os.store/demo

${LRM}Worth a quick test to see if it can replace your recurring contract review tools?

${LRM}Best regards,
${LRM}Nexus ContractGuard | Legal Forensic Systems
${LRM}office@nexus-os.store`;
      } else {
        // ANGLE 1 (DEFAULT / RECOMMENDED): THE 15-SECOND CLOSING AUDIT
        subject = `${LRM}quick question re: closing drafts at ${firmName}`;
        body = `${LRM}Hi ${name},

${LRM}If you've ever spent until 2:00 AM manually cross-referencing defined terms and Section citations before a closing call, you know how easy it is for an opponent to catch an embarrassing clerical mismatch like "$57,000" vs "Seventy-Five Thousand Dollars".

${LRM}We built an air-gapped forensic audit engine that scans 40-page agreements in 15 seconds locally in your browser RAM. It instantly flags broken cross-references, missing exhibits, and uncarved indemnification caps—then exports a court-ready Microsoft Word (.docx) amendment rider and formal diligence certificate with 1 click.

${LRM}Crucially: zero cloud transmission. It executes 100% inside your local workstation memory, fully compliant with ABA Model Rule 1.6 confidentiality standards. No client data ever touches a remote server or LLM.

${LRM}Instead of enterprise SaaS tools charging $1,800/yr, we offer a single lifetime perpetual license ($199) with all upcoming feature releases and continuous engine evolution included.

${LRM}You can stress-test a sample agreement in 15 seconds without creating an account or entering card details:
${LRM}https://www.nexus-os.store/demo

${LRM}Would you be opposed to testing a 1-page sample to see how it flags cross-clause shifts before your next closing?

${LRM}Best regards,
${LRM}Nexus ContractGuard | Legal Forensic Systems
${LRM}office@nexus-os.store`;
      }
    } else {
      // LAW FIRM & MANAGING PARTNER OUTREACH
      if (angle === 'aba') {
        // ANGLE 2: FIRM-WIDE ABA 1.6 PRIVILEGE & SUBPOENA SHIELD
        subject = `${LRM}firm-wide ABA Model Rule 1.6 compliance & review efficiency at ${firmName}`;
        body = `${LRM}Dear ${name},

${LRM}As managing partner of ${firmName}, ensuring that associates review complex commercial agreements under strict ABA Model Rule 1.6 confidentiality has become a critical liability priority.

${LRM}With state bar advisories warning firms about third-party subpoena risks and cloud LLM data retention, associates who quietly paste client drafts into web tools create severe malpractice and privilege waiver exposure.

${LRM}We engineered ContractGuard specifically for boutique transactional practices: an on-premise, zero-network forensic audit engine. It empowers your transactional team to catch broken citations, missing exhibits, and hidden liability shifts in 15 seconds—running 100% locally in workstation RAM with zero external server connection.

${LRM}Unlike legacy enterprise platforms that charge $1,800/year per seat, we provide a 5-Attorney Law Firm Suite for a single one-time payment of $299, with all upcoming engine updates and statutory codex upgrades included forever.

${LRM}Every audit generates an AmLaw 100 Pre-Signing Diligence Certificate (.pdf) and an editable Word (.docx) amendment rider for partner sign-off.

${LRM}Your team can test our live offline sandbox with any redacted agreement (no signup or card required):
${LRM}https://www.nexus-os.store/demo

${LRM}Would you be open to seeing how our air-gapped forensic radar protects ${firmName}'s client privilege while accelerating review speed?

${LRM}Sincerely,
${LRM}Nexus ContractGuard Enterprise | Corporate Systems
${LRM}office@nexus-os.store`;
      } else if (angle === 'roi') {
        // ANGLE 3: ELIMINATING RECURRING TRANSACTIONAL SEAT FEES
        subject = `${LRM}eliminating recurring transactional software seat costs at ${firmName}`;
        body = `${LRM}Dear ${name},

${LRM}Between Lexis, Thomson Reuters, and emerging cloud AI vendors charging $1,500–$2,500 per attorney annually, boutique firm transactional software budgets have gotten out of hand.

${LRM}ContractGuard provides an enterprise-grade alternative: a 5-Attorney Law Firm Suite for a single one-time payment of $299. No subscriptions, no per-seat annual renewals, and continuous engine evolution with all future feature releases included forever.

${LRM}How it protects ${firmName}:
${LRM}1. 100% Air-Gapped: Runs in local workstation RAM. Zero network transmission means absolute compliance with ABA Model Rule 1.6 and zero cloud discovery subpoena risk.
${LRM}2. 15-Second Forensic QC: Audits complex agreements for broken cross-references, undefined capitalized terms, and numerical parity mismatches before partner sign-off.
${LRM}3. Partner-Ready Deliverables: Instant 1-click Microsoft Word (.docx) amendment rider export + signed Pre-Signing Diligence Certificates (.pdf) for client closing binders.

${LRM}Your transactional team can run a live 15-second test drive right now (zero signup, zero card):
${LRM}https://www.nexus-os.store/demo

${LRM}Open to seeing how ${firmName} can eliminate recurring contract review fees while upgrading turnaround speed?

${LRM}Sincerely,
${LRM}Nexus ContractGuard Enterprise | Corporate Systems
${LRM}office@nexus-os.store`;
      } else {
        // ANGLE 1 (DEFAULT / RECOMMENDED): THE 15-SECOND ASSOCIATE QC SHIELD
        subject = `${LRM}associate redlines & ABA 1.6 risk at ${firmName}`;
        body = `${LRM}Dear ${name},

${LRM}As managing partner of ${firmName}, you probably worry about two things before a major commercial transaction closes: (1) an associate missing an uncarved liability clause or broken Section reference, and (2) associates quietly pasting confidential client drafts into cloud AI to meet tight deadlines.

${LRM}We engineered ContractGuard for commercial law firms: an air-gapped forensic diligence engine that audits complex 50-page agreements in 15 seconds directly in local workstation RAM. It catches broken citations, numerical mismatches, and undefined capitalized terms before partner sign-off—with zero cloud exposure.

${LRM}Crucially: 100% client-side memory execution. Zero network calls, zero third-party subpoena risk, and absolute compliance with ABA Model Rule 1.6 confidentiality standards.

${LRM}Instead of enterprise legal tech platforms charging $1,800/year per seat with recurring lock-in, we provide a 5-Attorney Law Firm Suite for a one-time perpetual license ($299) with all upcoming engine updates and statutory codex upgrades included forever.

${LRM}Your transactional group can run a live 15-second audit test with any redacted agreement right now (no signup or card required):
${LRM}https://www.nexus-os.store/demo

${LRM}Would you be open to a 60-second test to see how it standardizes quality control across ${firmName}'s transactional team?

${LRM}Sincerely,
${LRM}Nexus ContractGuard Enterprise | Corporate Systems
${LRM}office@nexus-os.store`;
      }
    }

    return { name, firmName, email, subject, body };
  };

  // 1-Click Gmail Action (Forced English LTR mode)
  const handleOpenGmail = (lead, type, overrideAngle) => {
    const activeAngle = overrideAngle || selectedAngle;
    const { name, email, subject, body } = generateEmailData(lead, type, activeAngle);
    // hl=en forces English interface & default LTR text flow in Gmail
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&hl=en&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open Gmail Tab
    window.open(gmailUrl, '_blank');
    
    // Auto-mark as Contacted
    toggleContacted(lead.id, true);
    showToast(`⚡ Opened Gmail for ${name} (${activeAngle.toUpperCase()} angle) & marked Contacted!`);
  };

  // Default Mailto Fallback
  const handleOpenMailto = (lead, type, overrideAngle) => {
    const activeAngle = overrideAngle || selectedAngle;
    const { name, email, subject, body } = generateEmailData(lead, type, activeAngle);
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    toggleContacted(lead.id, true);
    showToast(`📬 Opened mail client for ${name}`);
  };

  // Copy Template
  const handleCopyTemplate = (lead, type, overrideAngle) => {
    const activeAngle = overrideAngle || selectedAngle;
    const { body } = generateEmailData(lead, type, activeAngle);
    navigator.clipboard.writeText(body);
    showToast(`📋 Copied ${activeAngle.toUpperCase()} template for ${lead.name || lead.managingPartner}`);
  };

  // Locations Extract
  const locationsList = useMemo(() => {
    const data = activeTab === 'attorneys' ? leadsData.attorneys : leadsData.firms;
    const states = new Set(data.map(d => d.state || 'Other'));
    return ['ALL', ...Array.from(states).sort()];
  }, [activeTab, leadsData]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const dataset = activeTab === 'attorneys' ? leadsData.attorneys : leadsData.firms;
    const q = searchQuery.toLowerCase().trim();

    return dataset.filter(item => {
      // Search Match
      const matchesSearch = !q || (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.firm && item.firm.toLowerCase().includes(q)) ||
        (item.managingPartner && item.managingPartner.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.specialty && item.specialty.toLowerCase().includes(q))
      );

      // Location Match
      const matchesLoc = selectedLocation === 'ALL' || item.state === selectedLocation;

      // Status Match
      const isContacted = Boolean(contactedMap[item.id]);
      const isStarred = starredSet.has(item.id);

      let matchesStatus = true;
      if (statusFilter === 'CONTACTED') matchesStatus = isContacted;
      if (statusFilter === 'PENDING') matchesStatus = !isContacted;
      if (statusFilter === 'STARRED') matchesStatus = isStarred;

      return matchesSearch && matchesLoc && matchesStatus;
    });
  }, [activeTab, searchQuery, selectedLocation, statusFilter, contactedMap, starredSet, leadsData]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, statusFilter, activeTab]);

  // Export CSV
  const handleExportCSV = () => {
    const dataset = activeTab === 'attorneys' ? leadsData.attorneys : leadsData.firms;
    const headers = activeTab === 'attorneys' 
      ? ['ID', 'Name', 'Title', 'Firm', 'Email', 'City', 'State', 'Specialty', 'Status', 'ContactedAt', 'Website']
      : ['ID', 'Firm Name', 'Managing Partner', 'Email', 'City', 'State', 'Specialty', 'Status', 'ContactedAt', 'Website'];

    const rows = dataset.map(item => {
      const isContacted = contactedMap[item.id];
      const status = isContacted ? 'Contacted' : 'Pending';
      const contactedAt = isContacted ? isContacted.contactedAt : '';

      if (activeTab === 'attorneys') {
        return [
          item.id,
          `"${item.name || ''}"`,
          `"${item.title || ''}"`,
          `"${item.firm || ''}"`,
          item.email,
          `"${item.city || ''}"`,
          item.state,
          `"${item.specialty || ''}"`,
          status,
          contactedAt,
          item.website
        ].join(',');
      } else {
        return [
          item.id,
          `"${item.name || ''}"`,
          `"${item.managingPartner || ''}"`,
          item.email,
          `"${item.city || ''}"`,
          item.state,
          `"${item.specialty || ''}"`,
          status,
          contactedAt,
          item.website
        ].join(',');
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_outreach_${activeTab}_progress.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Exported CSV with your current progress!');
  };

  // Stats
  const totalContactsCount = Object.keys(contactedMap).length;
  const todayCount = Object.values(contactedMap).filter(c => {
    const d = new Date(c.contactedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  // ----------------------------------------------------
  // LOCK SCREEN IF NOT AUTHENTICATED
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div dir="ltr" className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full bg-[#0a0f1d]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Confidential Directive
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Nexus Executive War Room
          </h1>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            Direct High-Velocity Outreach Terminal for ContractGuard Enterprise. Enter clearance PIN to proceed.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Clearance PIN (Hint: 2026)"
                className="w-full bg-[#030712]/80 border border-white/15 focus:border-emerald-400 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-emerald-300 placeholder:text-slate-600 focus:outline-none transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 flex items-center justify-center gap-1.5 animate-pulse">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Unlock War Room
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-[11px] text-slate-500 font-mono">
            OPERATOR CLEARANCE ID: MOHAMMED-CHIEF-EXEC
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOADING STATE WHILE PARSING LEADS IN RAM
  // ----------------------------------------------------
  if (isLeadsLoading) {
    return (
      <div dir="ltr" className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">Decrypting War Room Intelligence</h2>
        <p className="text-sm text-slate-400 font-mono">Loading 20,012 Law Firm Contacts into Local Memory...</p>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED WAR ROOM INTERFACE
  // ----------------------------------------------------
  return (
    <div dir="ltr" className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c1322] border border-emerald-500/40 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Mission Control Bar */}
      <header className="border-b border-white/10 bg-[#060a14]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-white">
                  Nexus Outreach War Room
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Private Directive
                </span>
              </div>
              <p className="text-xs text-slate-400">1,000 Verified Attorneys + 500 Boutique Law Firms</p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
            {/* Daily Streak / Progress */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-slate-400 text-[10px] block">TODAY'S TARGET</span>
                <span className="font-bold text-emerald-300">{todayCount} / {DAILY_TARGET}</span>
              </div>
            </div>

            {/* Total Contacted */}
            <div className="bg-[#0b1324] border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">TOTAL CONTACTED</span>
                <span className="font-bold text-white">{totalContactsCount} / 1,500</span>
              </div>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download CSV with updated contact history"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
              title="Lock Session"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Hero Announcement & Direct Gmail Tip */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#0a1220] to-cyan-950/30 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                The 1-Click High Velocity Advantage
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Psychological Outreach & 1-Click Execution Activated
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Choose between 3 battle-tested psychological angles below: <strong className="text-emerald-300">⚡ 15-Sec Closing Audit</strong> (curiosity & test drive), <strong className="text-cyan-300">🛡️ ABA 1.6 Ethics Shield</strong> (loss aversion & privilege), and <strong className="text-amber-300">💰 Anti-SaaS Lifetime ($199/$299)</strong>. All emails feature strict Unicode LTR protection and personalized firm tokens.
              </p>
            </div>

            {/* Quick Progress Bar */}
            <div className="bg-[#030712]/70 border border-white/10 rounded-2xl p-4 min-w-[240px] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Total Outreach</span>
                <span className="text-emerald-400 font-bold">
                  {((totalContactsCount / 1500) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalContactsCount / 1500) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{totalContactsCount} Sent</span>
                <span>{1500 - totalContactsCount} Remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outreach Strategy Angle Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#081224] border border-emerald-500/30 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Active Outreach Angle:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedAngle('15sec');
                showToast('⚡ Switched to 15-Sec Closing Audit Angle (Highest Reply Rate)');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedAngle === '15sec'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title="Focuses on 2 AM fatigue, clerical mismatches ($57,000 vs Seventy-Five Thousand), and instant 15-second test drive"
            >
              <span>⚡ 15-Sec Audit (Recommended)</span>
            </button>

            <button
              onClick={() => {
                setSelectedAngle('aba');
                showToast('🛡️ Switched to ABA Model Rule 1.6 Ethics Shield Angle');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedAngle === 'aba'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title="Focuses on state bar ethics warnings, subpoena risks, and 100% in-RAM air-gapped compliance"
            >
              <span>🛡️ ABA 1.6 Ethics Shield</span>
            </button>

            <button
              onClick={() => {
                setSelectedAngle('roi');
                showToast('💰 Switched to Anti-SaaS Lifetime ROI Angle ($199 / $299)');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedAngle === 'roi'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title="Focuses on eliminating $1,800/yr per-seat subscriptions with perpetual lifetime license + continuous evolution"
            >
              <span>💰 Anti-SaaS Lifetime ($199 / $299)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab('attorneys')}
              className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'attorneys'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Attorneys Directory
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'attorneys' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}>
                1,000
              </span>
            </button>

            <button
              onClick={() => setActiveTab('firms')}
              className={`px-5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'firms'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Law Firms Directory
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'firms' ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
              }`}>
                500
              </span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  statusFilter === 'ALL' ? 'bg-white/15 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  statusFilter === 'PENDING' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⏳ Pending
              </button>
              <button
                onClick={() => setStatusFilter('CONTACTED')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  statusFilter === 'CONTACTED' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✅ Contacted
              </button>
              <button
                onClick={() => setStatusFilter('STARRED')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  statusFilter === 'STARRED' ? 'bg-yellow-500/20 text-yellow-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⭐ Starred
              </button>
            </div>

            {/* Location Select */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#0b1324] border border-white/15 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="ALL">All Jurisdictions ({locationsList.length - 1})</option>
              {locationsList.filter(l => l !== 'ALL').map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar & Result Summary */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'attorneys' ? '1,000 attorneys' : '500 firms'} by name, firm, email, city...`}
              className="w-full bg-[#0a0f1d] border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono w-full sm:w-auto text-right">
            Showing <span className="text-white font-bold">{paginatedLeads.length}</span> of{' '}
            <span className="text-white font-bold">{filteredLeads.length}</span> matches
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* LEADS TABLE                                          */}
        {/* ---------------------------------------------------- */}
        <div className="border border-white/10 rounded-2xl bg-[#080d1a]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4">
                    {activeTab === 'attorneys' ? 'Attorney / Title' : 'Law Firm Name'}
                  </th>
                  <th className="py-3.5 px-4">
                    {activeTab === 'attorneys' ? 'Firm & Specialty' : 'Managing Partner'}
                  </th>
                  <th className="py-3.5 px-4">Direct Email</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No matching records found. Try adjusting your search query or filters.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((item) => {
                    const isContacted = Boolean(contactedMap[item.id]);
                    const isStarred = starredSet.has(item.id);
                    const contactRecord = contactedMap[item.id];

                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-white/[0.03] transition-colors ${
                          isContacted ? 'bg-emerald-950/[0.08]' : ''
                        }`}
                      >
                        {/* Status / Star / Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => toggleStar(item.id)}
                              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                                isStarred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              }`}
                              title={isStarred ? 'Unstar' : 'Star high priority'}
                            >
                              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                            </button>

                            <button
                              onClick={() => toggleContacted(item.id, false)}
                              className="cursor-pointer"
                              title={isContacted ? `Contacted on ${contactRecord?.dateFormatted || ''} - Click to toggle` : 'Mark as contacted'}
                            >
                              {isContacted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-600 hover:border-emerald-400 transition-colors" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Name / Title or Firm Name */}
                        <td className="py-3.5 px-4">
                          {activeTab === 'attorneys' ? (
                            <div>
                              <div className="font-medium text-white flex items-center gap-1.5">
                                {item.name}
                                <a 
                                  href={item.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-slate-500 hover:text-emerald-400"
                                  title="Open profile"
                                >
                                  <ExternalLink className="w-3 h-3 inline" />
                                </a>
                              </div>
                              <span className="text-[11px] text-slate-400 block">{item.title}</span>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium text-white flex items-center gap-1.5">
                                {item.name}
                                <a 
                                  href={item.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-slate-500 hover:text-emerald-400"
                                  title="Open website"
                                >
                                  <ExternalLink className="w-3 h-3 inline" />
                                </a>
                              </div>
                              <span className="text-[11px] text-emerald-400/80 block">{item.specialty}</span>
                            </div>
                          )}
                        </td>

                        {/* Firm & Specialty or Managing Partner */}
                        <td className="py-3.5 px-4">
                          {activeTab === 'attorneys' ? (
                            <div>
                              <span className="text-slate-300 block">{item.firm}</span>
                              <span className="text-[11px] text-slate-400 block">{item.specialty}</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-white block font-medium">{item.managingPartner || 'Managing Partner'}</span>
                              <span className="text-[11px] text-slate-400 block">Chair & Lead Counsel</span>
                            </div>
                          )}
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <span className="select-all">{item.email}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.email);
                                showToast(`Copied ${item.email}`);
                              }}
                              className="text-slate-500 hover:text-white p-0.5 rounded"
                              title="Copy email address"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 text-slate-400">
                          {item.city}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Primary Gmail 1-Click Button */}
                            <button
                              onClick={() => handleOpenGmail(item, activeTab)}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Open Gmail compose tab with pre-filled message"
                            >
                              <Send className="w-3 h-3" />
                              <span>Gmail</span>
                            </button>

                            {/* Mailto fallback */}
                            <button
                              onClick={() => handleOpenMailto(item, activeTab)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="Open in default mail client (Outlook/Apple Mail)"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            {/* Copy Template */}
                            <button
                              onClick={() => handleCopyTemplate(item, activeTab)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="Copy personalized outreach text to clipboard"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* View Preview Modal */}
                            <button
                              onClick={() => setPreviewModalLead({ lead: item, type: activeTab })}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                              title="Preview personalized email draft"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between text-xs text-slate-400 bg-white/[0.01]">
            <div>
              Page <span className="text-white font-medium">{currentPage}</span> of{' '}
              <span className="text-white font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* ---------------------------------------------------- */}
      {/* EMAIL PREVIEW MODAL                                  */}
      {/* ---------------------------------------------------- */}
      {previewModalLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  Email Preview Inspector
                </span>
                <h3 className="text-lg font-bold text-white">
                  {previewModalLead.lead.name} ({previewModalLead.lead.firm || 'Law Firm'})
                </h3>
              </div>
              <button 
                onClick={() => setPreviewModalLead(null)}
                className="text-slate-400 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Angle Switcher inside Modal */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-black/40 border border-white/10 mb-4 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-1">
                Strategy Angle:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedAngle('15sec')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedAngle === '15sec'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  ⚡ 15-Sec Audit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAngle('aba')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedAngle === 'aba'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🛡️ ABA 1.6 Ethics
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAngle('roi')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedAngle === 'roi'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  💰 Anti-SaaS Lifetime
                </button>
              </div>
            </div>

            {/* Subject */}
            {(() => {
              const { email, subject, body } = generateEmailData(previewModalLead.lead, previewModalLead.type);
              return (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-mono text-[11px] mb-1">TO:</span>
                    <div className="p-2.5 rounded-xl bg-[#030712] border border-white/10 font-mono text-emerald-300">
                      {email}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono text-[11px] mb-1">SUBJECT:</span>
                    <div className="p-2.5 rounded-xl bg-[#030712] border border-white/10 font-medium text-white">
                      {subject}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-mono text-[11px] mb-1">BODY:</span>
                    <pre className="p-4 rounded-xl bg-[#030712] border border-white/10 font-sans text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {body}
                    </pre>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        handleCopyTemplate(previewModalLead.lead, previewModalLead.type);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium flex items-center gap-1.5 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Text
                    </button>

                    <button
                      onClick={() => {
                        handleOpenGmail(previewModalLead.lead, previewModalLead.type);
                        setPreviewModalLead(null);
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Launch in Gmail Now
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
}
