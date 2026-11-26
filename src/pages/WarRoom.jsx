import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, ExternalLink, Copy, Check, Search, Filter, Shield, Star, 
  Download, Lock, Unlock, Send, Users, Building2, Sparkles, 
  RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, Flame,
  ChevronLeft, ChevronRight, Eye, HelpCircle, Loader2, Clock
} from 'lucide-react';

const MASTER_PIN = '2026';
const STORAGE_AUTH_KEY = 'nexus_war_room_auth_v1';
const STORAGE_PROGRESS_KEY = 'nexus_war_room_progress_v1';
const STORAGE_STARS_KEY = 'nexus_war_room_stars_v1';
const DAILY_TARGET = 25;

// US Time Zones and optimal sending windows (in Palestine Local Time)
const US_TIME_ZONES = {
  EST: {
    id: 'EST',
    name: 'Eastern (EST)',
    label: 'EST · 3:30 - 5:00 PM',
    window: '3:30 PM – 5:00 PM (Palestine)',
    states: ['NY', 'FL', 'DC', 'PA', 'GA', 'MA', 'VA', 'NC', 'OH', 'MI', 'NJ', 'MD', 'CT', 'SC', 'IN', 'KY']
  },
  CST: {
    id: 'CST',
    name: 'Central (CST)',
    label: 'CST · 4:30 - 6:00 PM',
    window: '4:30 PM – 6:00 PM (Palestine)',
    states: ['TX', 'IL', 'MN', 'MO', 'WI', 'TN', 'LA', 'AL', 'OK', 'IA', 'AR', 'MS', 'KS', 'NE']
  },
  MST: {
    id: 'MST',
    name: 'Mountain (MST)',
    label: 'MST · 5:30 - 7:00 PM',
    window: '5:30 PM – 7:00 PM (Palestine)',
    states: ['CO', 'AZ', 'UT', 'NM', 'MT', 'WY', 'ID']
  },
  PST: {
    id: 'PST',
    name: 'Pacific (PST)',
    label: 'PST · 6:30 - 8:00 PM',
    window: '6:30 PM – 8:00 PM (Palestine)',
    states: ['CA', 'WA', 'OR', 'NV']
  }
};

export default function WarRoom() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('attorneys'); // 'attorneys' | 'firms' | 'creators'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('ALL'); // 'ALL' | 'EST' | 'CST' | 'MST' | 'PST'
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'CONTACTED' | 'STARRED'
  
  // Selected Outreach Strategy Angle (Hormozi / Behavioral Psychology)
  const [selectedAngle, setSelectedAngle] = useState('15sec'); // '15sec' | 'aba' | 'roi' | 'followup'
  
  // Detect currently active Palestine sending window
  const activePalestineWindow = useMemo(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    if (mins >= 930 && mins < 1020) return 'EST'; // 15:30 - 17:00 (3:30 - 5:00 PM)
    if (mins >= 990 && mins < 1080) return 'CST'; // 16:30 - 18:00 (4:30 - 6:00 PM)
    if (mins >= 1050 && mins < 1140) return 'MST'; // 17:30 - 19:00 (5:30 - 7:00 PM)
    if (mins >= 1110 && mins < 1200) return 'PST'; // 18:30 - 20:00 (6:30 - 8:00 PM)
    return null;
  }, []);
  
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
  const [leadsData, setLeadsData] = useState({ attorneys: [], firms: [], creators: [] });
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

  // 1.1 Lazy-load leads datasets ONLY when authenticated
  useEffect(() => {
    if (isAuthenticated && leadsData.attorneys.length === 0) {
      setIsLeadsLoading(true);
      Promise.all([
        import('../data/warRoomLeads'),
        import('../data/warRoomCreators')
      ])
        .then(([leadsMod, creatorsMod]) => {
          setLeadsData({
            attorneys: leadsMod.ATTORNEYS_DATA || [],
            firms: leadsMod.FIRMS_DATA || [],
            creators: creatorsMod.CREATORS_DATA || []
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

  // Helper to extract clean first name (handles middle initials, titles, suffixes)
  const extractCleanFirstName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return 'Counsel';
    let clean = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Hon\.|Attorney)\s+/i, '').trim();
    const parts = clean.split(/[\s,]+/).filter(Boolean);
    if (!parts.length) return 'Counsel';
    let candidate = parts[0].replace(/[^a-zA-Z]/g, '');
    if (candidate.length <= 1 && parts.length > 1) {
      candidate = parts[1].replace(/[^a-zA-Z]/g, '');
    }
    if (!candidate || candidate.length < 2) return 'Counsel';
    return candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
  };

  // Generate Email Content with Strict Unicode LTR Markers & Nationwide B2B Legal Formatting
  const generateEmailData = (lead, type, overrideAngle) => {
    const isCreator = type === 'creators';
    const isAttorney = type === 'attorneys';
    const fullName = isCreator ? lead.name : (isAttorney ? lead.name : (lead.managingPartner || 'Counsel'));
    const firstName = extractCleanFirstName(fullName);
    const firmName = isCreator ? lead.firm : (isAttorney ? lead.firm : lead.name);
    const email = lead.email;
    const angle = overrideAngle || selectedAngle;

    // Unicode Left-to-Right Mark (LRM) guarantees LTR alignment in any email client
    const LRM = '\u200E';

    let subject = '';
    let body = '';

    if (isCreator) {
      if (angle === 'followup') {
        subject = `${LRM}quick follow-up — ${firmName} partnership`;
        body = `${LRM}Hi ${firstName},

${LRM}Just floating this back up — would you like me to send over a complimentary lifetime license of ContractGuard so you can test it on a sample agreement (zero cloud uploads)?

${LRM}If your audience finds it helpful, we offer a flat 40%–50% partner commission ($80–$150 per lifetime license). Happy to send a test key either way.

${LRM}Best,
${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard™
${LRM}nexus-os.store`;
      } else {
        subject = `${LRM}partnership idea for ${firmName} (100% offline contract checker · 40-50% rev share)`;
        body = `${LRM}Hi ${firstName},

${LRM}I follow your work at ${firmName} and wanted to share a quick partnership idea made specifically for solo lawyers and commercial creators who hate paying recurring SaaS fees or risking client data in cloud AI.

${LRM}We built Nexus ContractGuard™ — a browser-local contract audit and drafting tool (100% in-RAM, zero server uploads, ABA Model Rule 1.6 safe) with:
${LRM}• 15-second detection of broken cross-references, missing exhibits, financial mismatches, and liability-cap traps
${LRM}• 12 ready-to-customize AmLaw 100 U.S. templates (CA/TX/NY/FL riders) with Word (.docx) & PDF export
${LRM}• Simple one-time pricing ($199 Solo / $299 5-Seat Firm lifetime — no subscriptions)

${LRM}How we can partner cleanly:
${LRM}1. I will send you a free lifetime license today so you can verify everything yourself (check the Network Tab — 0 bytes leave the browser).
${LRM}2. If you like it enough to mention or review, we set up a 40%–50% affiliate link ($80–$150 payout per sale) for ${firmName}'s audience.

${LRM}You can test the instant sandbox with no signup here:
${LRM}nexus-os.store/demo

${LRM}Want me to send over your complimentary test key?

${LRM}Best regards,
${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard™
${LRM}nexus-os.store`;
      }
      return { name: fullName, firstName, firmName, email, subject, body };
    }

    if (isAttorney) {
      // SOLO PRACTITIONER & TRANSACTIONAL PARTNER OUTREACH
      if (angle === 'followup') {
        // ANGLE 4: QUICK FOLLOW-UP / BUMP
        subject = `${LRM}quick follow-up re: closing drafts`;
        body = `${LRM}Hi ${firstName},

${LRM}Quick follow-up on this — would you be open to a 30-second look at how it flags liability shifts before your next closing, or are you all set with your current review process?

${LRM}Best,
${LRM}Mohammed`;
      } else if (angle === 'aba') {
        // ANGLE 2: ABA MODEL RULE 1.6 & ETHICS ADVISORY SHIELD
        subject = `${LRM}state bar cloud AI warning & ${firmName}`;
        body = `${LRM}Hi ${firstName},

${LRM}With state bar ethics committees nationwide issuing formal warnings regarding client data leaks into public cloud AI, transactional counsel face an exhausting dilemma:

${LRM}Either spend late nights manually cross-referencing multi-version indemnification clauses and defined terms, or risk privileged client exposure on third-party cloud servers.

${LRM}We engineered ContractGuard to eliminate this ABA Model Rule 1.6 conflict entirely: an air-gapped forensic audit engine that runs 100% locally in your browser RAM with zero network transmission. No client data ever touches an external server, remote API, or LLM.

${LRM}It audits 40-page agreements in 15 seconds across 4 forensic engines, catches numerical mismatches and broken cross-references, and exports court-ready Word (.docx) amendment riders and signed Pre-Signing Diligence Certificates (.pdf).

${LRM}Instead of recurring $1,800/year subscriptions, we offer a single lifetime perpetual license ($199) with all upcoming feature releases included forever.

${LRM}Test a sample agreement in our zero-network sandbox (no signup or card needed):
${LRM}nexus-os.store/demo

${LRM}Would you be opposed to a 60-second test to see how it flags cross-clause shifts before your next closing?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | 100% Local In-RAM`;
      } else if (angle === 'roi') {
        // ANGLE 3: ANTI-SAAS $199 PERPETUAL LIFETIME ROI
        subject = `${LRM}eliminating $1,800/yr contract software fees for ${firmName}`;
        body = `${LRM}Hi ${firstName},

${LRM}Most legal tech vendors charge transactional solo attorneys $150 to $200 every single month ($1,800+/year)—only to route your confidential client drafts through third-party cloud servers with annual price hikes.

${LRM}We built ContractGuard with an anti-SaaS philosophy: a one-time perpetual lifetime license ($199) that runs 100% locally in your workstation RAM with zero cloud telemetry.

${LRM}What you get:
${LRM}• 15-Second Forensic Diligence: Audits 40-page agreements for broken cross-references, missing exhibits, and numerical discrepancies.
${LRM}• Court-Ready Deliverables: Instant 1-click Microsoft Word (.docx) amendment rider export + signed Pre-Signing Diligence Certificate (.pdf) for client closing binders.
${LRM}• Continuous Evolution Included: All future statutory rules, engine upgrades, and feature releases are included forever with zero monthly renewals.
${LRM}• 100% Air-Gapped Security: Fully compliant with ABA Model Rule 1.6 confidentiality standards nationwide.

${LRM}Take the 15-second test drive right now (zero friction, no account, no credit card):
${LRM}nexus-os.store/demo

${LRM}Worth a quick test to see if it can replace your recurring contract review tools?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | 100% Local In-RAM`;
      } else {
        // ANGLE 1 (DEFAULT / RECOMMENDED): THE 15-SECOND CLOSING AUDIT & HIDDEN LIABILITY SHIFTS
        subject = `${LRM}quick question re: hidden liability shifts in closing drafts`;
        body = `${LRM}Hi ${firstName},

${LRM}When an opposing counsel subtly slips a unilateral indemnity expansion or an uncarved consequential damages waiver into a 45-page closing revision at 11 PM, traditional redlines often bury it.

${LRM}We built ContractGuard to catch what human eyes miss under closing fatigue: an air-gapped forensic engine that flags cross-clause liability shifts, broken citations, and exhibit mismatches in 15 seconds.

${LRM}100% Local in your workstation RAM — zero cloud telemetry, strictly compliant with ABA Model Rule 1.6 confidentiality. No client data ever touches an external server or LLM.

${LRM}Instead of recurring $1,800/yr enterprise subscriptions, we offer a single lifetime perpetual license ($199).

${LRM}Test a sample agreement in our zero-network sandbox (no signup or card needed):
${LRM}nexus-os.store/demo

${LRM}Would you be opposed to a 30-second run before your next closing?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | 100% Local In-RAM`;
      }
    } else {
      // LAW FIRM & MANAGING PARTNER OUTREACH
      if (angle === 'followup') {
        // ANGLE 4: QUICK FOLLOW-UP / BUMP
        subject = `${LRM}quick follow-up re: ${firmName} closing drafts`;
        body = `${LRM}Hi ${firstName},

${LRM}Quick follow-up on this — would you be open to a 30-second look at how it flags liability shifts before your next closing, or are you all set with your current review process?

${LRM}Best,
${LRM}Mohammed`;
      } else if (angle === 'aba') {
        // ANGLE 2: FIRM-WIDE ABA 1.6 PRIVILEGE & SUBPOENA SHIELD
        subject = `${LRM}firm-wide ABA Model Rule 1.6 compliance & review efficiency at ${firmName}`;
        body = `${LRM}Hi ${firstName},

${LRM}As managing partner of ${firmName}, ensuring that associates review complex commercial agreements under strict ABA Model Rule 1.6 confidentiality has become a critical liability priority.

${LRM}With state bar advisories nationwide warning firms about third-party subpoena risks and cloud LLM data retention, associates who quietly paste client drafts into web tools create severe malpractice and privilege waiver exposure.

${LRM}We engineered ContractGuard specifically for boutique transactional practices: an on-premise, zero-network forensic audit engine. It empowers your transactional team to catch broken citations, missing exhibits, and hidden liability shifts in 15 seconds—running 100% locally in workstation RAM with zero external server connection.

${LRM}Unlike legacy enterprise platforms that charge $1,800/year per seat, we provide a 5-Attorney Law Firm Suite for a single one-time payment of $299, with all upcoming engine updates and statutory codex upgrades included forever.

${LRM}Every audit generates an AmLaw 100 Pre-Signing Diligence Certificate (.pdf) and an editable Word (.docx) amendment rider for partner sign-off.

${LRM}Your team can test our live offline sandbox with any redacted agreement (no signup or card required):
${LRM}nexus-os.store/demo

${LRM}Would you be open to seeing how our air-gapped forensic radar protects ${firmName}'s client privilege while accelerating review speed?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard Enterprise™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | Zero Network Transmission`;
      } else if (angle === 'roi') {
        // ANGLE 3: ELIMINATING RECURRING TRANSACTIONAL SEAT FEES
        subject = `${LRM}eliminating recurring transactional software seat costs at ${firmName}`;
        body = `${LRM}Hi ${firstName},

${LRM}Between Lexis, Thomson Reuters, and emerging cloud AI vendors charging $1,500–$2,500 per attorney annually, boutique firm transactional software budgets have gotten out of hand.

${LRM}ContractGuard provides an enterprise-grade alternative: a 5-Attorney Law Firm Suite for a single one-time payment of $299. No subscriptions, no per-seat annual renewals, and continuous engine evolution with all future feature releases included forever.

${LRM}How it protects ${firmName}:
${LRM}1. 100% Air-Gapped: Runs in local workstation RAM. Zero network transmission means absolute compliance with ABA Model Rule 1.6 and zero cloud discovery subpoena risk.
${LRM}2. 15-Second Forensic QC: Audits complex agreements for broken cross-references, undefined capitalized terms, and hidden cross-clause liability shifts before partner sign-off.
${LRM}3. Partner-Ready Deliverables: Instant 1-click Microsoft Word (.docx) amendment rider export + signed Pre-Signing Diligence Certificates (.pdf) for client closing binders.

${LRM}Your transactional team can run a live 15-second test drive right now (zero signup, zero card):
${LRM}nexus-os.store/demo

${LRM}Open to seeing how ${firmName} can eliminate recurring contract review fees while upgrading turnaround speed?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard Enterprise™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | Zero Network Transmission`;
      } else {
        // ANGLE 1 (DEFAULT / RECOMMENDED): SUBPOENA-PROOF AGREEMENT AUDITS & ASSOCIATE REDLINE RISKS
        subject = `${LRM}subpoena-proof agreement audits & associate redline risks at ${firmName}`;
        body = `${LRM}Hi ${firstName},

${LRM}State bar ethics panels nationwide are actively scrutinizing client confidentiality leaks caused by associates pasting sensitive draft agreements into cloud-hosted tools.

${LRM}At the same time, manual review of complex commercial indemnities and cross-default clauses remains one of the largest unbilled cost centers for transactional teams.

${LRM}We engineered ContractGuard Enterprise as an on-premise, air-gapped audit engine for boutique practices:
${LRM}• 15-Second Forensic Diligence: Scans 50-page agreements for hidden cross-clause liability transfers and missing schedules.
${LRM}• Absolute Privilege Shield: Executes 100% in browser RAM. Zero network traffic, zero third-party subpoena risk.
${LRM}• Court-Ready Deliverables: 1-click Word (.docx) amendment riders + partner diligence certificates.

${LRM}We replace $2,000/yr per-seat subscriptions with a 5-Attorney Firm Suite for a one-time $299 lifetime license.

${LRM}Run a test audit in our instant sandbox (no registration):
${LRM}nexus-os.store/demo

${LRM}Open to a 1-minute test to see how it shields ${firmName}'s deal velocity?

${LRM}Best regards,

${LRM}Mohammed Qaraman
${LRM}Founder, Nexus ContractGuard Enterprise™
${LRM}nexus-os.store
${LRM}ABA Model Rule 1.6 Compliant | Zero Network Transmission`;
      }
    }

    return { name: fullName, firstName, firmName, email, subject, body };
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

  // Locations Extract (Adaptive to selected Time Zone)
  const locationsList = useMemo(() => {
    const data = activeTab === 'attorneys'
      ? leadsData.attorneys
      : activeTab === 'creators'
        ? leadsData.creators
        : leadsData.firms;
    let states = Array.from(new Set(data.map(d => d.state || 'Other'))).sort();
    if (selectedTimeZone !== 'ALL' && US_TIME_ZONES[selectedTimeZone]) {
      const allowed = new Set(US_TIME_ZONES[selectedTimeZone].states);
      states = states.filter(s => allowed.has(s));
    }
    return ['ALL', ...states];
  }, [activeTab, leadsData, selectedTimeZone]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const dataset = activeTab === 'attorneys'
      ? leadsData.attorneys
      : activeTab === 'creators'
        ? leadsData.creators
        : leadsData.firms;
    const q = searchQuery.toLowerCase().trim();

    return dataset.filter(item => {
      // Search Match
      const matchesSearch = !q || (
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.firm && item.firm.toLowerCase().includes(q)) ||
        (item.platform && item.platform.toLowerCase().includes(q)) ||
        (item.managingPartner && item.managingPartner.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.specialty && item.specialty.toLowerCase().includes(q))
      );

      // Time Zone Match (Optimal Sending Window in Palestine Time)
      const matchesTimeZone = selectedTimeZone === 'ALL' || (
        Boolean(US_TIME_ZONES[selectedTimeZone]?.states.includes(item.state))
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

      return matchesSearch && matchesTimeZone && matchesLoc && matchesStatus;
    });
  }, [activeTab, searchQuery, selectedTimeZone, selectedLocation, statusFilter, contactedMap, starredSet, leadsData]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTimeZone, selectedLocation, statusFilter, activeTab]);

  // Export CSV
  const handleExportCSV = () => {
    const dataset = activeTab === 'attorneys'
      ? leadsData.attorneys
      : activeTab === 'creators'
        ? leadsData.creators
        : leadsData.firms;
    const headers = activeTab === 'attorneys'
      ? ['ID', 'Name', 'Title', 'Firm', 'Email', 'City', 'State', 'Specialty', 'Status', 'ContactedAt', 'Website']
      : activeTab === 'creators'
        ? ['ID', 'Creator Name', 'Role', 'Channel / Outlet', 'Platform', 'Email', 'City', 'State', 'Focus', 'Status', 'ContactedAt', 'Website']
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
      } else if (activeTab === 'creators') {
        return [
          item.id,
          `"${item.name || ''}"`,
          `"${item.title || ''}"`,
          `"${item.firm || ''}"`,
          `"${item.platform || ''}"`,
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
              <p className="text-xs text-slate-400">
                {leadsData.attorneys.length.toLocaleString()} Attorneys · {leadsData.firms.length.toLocaleString()} Firms · {leadsData.creators.length} US Legal Creators
              </p>
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
                Choose between 3 battle-tested psychological angles below: <strong className="text-emerald-300">🎯 Liability Traps</strong> (unilateral indemnity & fatigue), <strong className="text-cyan-300">🛡️ ABA 1.6 Ethics Shield</strong> (loss aversion & privilege), and <strong className="text-amber-300">💰 Anti-SaaS Lifetime ($199/$299)</strong>. All emails feature strict Unicode LTR protection, personalized firm tokens, and official corporate signatures.
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
            {activeTab === 'creators' ? (
              <button
                onClick={() => {
                  setSelectedAngle('15sec');
                  showToast('🤝 Switched to Creator Partnership Pitch (40-50% Affiliate Rev Share)');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedAngle !== 'followup'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Simple creator partnership pitch offering free test license + 40-50% revenue share"
              >
                <span>🤝 Creator Partnership (40-50% Rev Share)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedAngle('15sec');
                    showToast('🎯 Switched to Hidden Liability Traps Angle (Highest Reply Rate)');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedAngle === '15sec'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Focuses on 11 PM fatigue, unilateral indemnity expansion, uncarved waivers, and instant 15-second demo"
                >
                  <span>🎯 Liability Traps (Recommended)</span>
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
              </>
            )}

            <button
              onClick={() => {
                setSelectedAngle('followup');
                showToast('🔄 Switched to Quick Follow-Up Bump Angle (High Response Rate)');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedAngle === 'followup'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title="Ultra-short follow-up bump for previously contacted attorneys"
            >
              <span>🔄 Quick Follow-Up (Bump)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'creators'
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              US Legal Creators (Affiliate)
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === 'creators' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {leadsData.creators.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('attorneys')}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
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
                {leadsData.attorneys.length.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('firms')}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
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
                {leadsData.firms.length.toLocaleString()}
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

            {/* Time Zone / Sending Windows (Palestine Local Time) */}
            <select
              value={selectedTimeZone}
              onChange={(e) => {
                setSelectedTimeZone(e.target.value);
                setSelectedLocation('ALL');
              }}
              className="bg-[#0b1324] border border-white/15 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="ALL">🕒 All Time Zones / Windows</option>
              <option value="EST">
                ⚡ EST · 3:30 - 5:00 PM (NY, FL, PA...){activePalestineWindow === 'EST' ? ' 🟢 ACTIVE' : ''}
              </option>
              <option value="CST">
                🎯 CST · 4:30 - 6:00 PM (TX, IL, MN...){activePalestineWindow === 'CST' ? ' 🟢 ACTIVE' : ''}
              </option>
              <option value="MST">
                🏔️ MST · 5:30 - 7:00 PM (CO, AZ, UT...){activePalestineWindow === 'MST' ? ' 🟢 ACTIVE' : ''}
              </option>
              <option value="PST">
                🌊 PST · 6:30 - 8:00 PM (CA, WA, OR...){activePalestineWindow === 'PST' ? ' 🟢 ACTIVE' : ''}
              </option>
            </select>

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
              placeholder={`Search ${activeTab === 'attorneys' ? 'attorneys' : activeTab === 'creators' ? 'US legal creators' : 'law firms'} by name, channel, email, city...`}
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
                    {activeTab === 'attorneys' ? 'Attorney / Title' : activeTab === 'creators' ? 'Creator / Role' : 'Law Firm Name'}
                  </th>
                  <th className="py-3.5 px-4">
                    {activeTab === 'attorneys' ? 'Firm & Specialty' : activeTab === 'creators' ? 'Channel / Focus' : 'Managing Partner'}
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
                          {activeTab === 'attorneys' || activeTab === 'creators' ? (
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
                          {activeTab === 'creators' ? (
                            <div>
                              <span className="text-amber-300 block font-medium">{item.firm}</span>
                              <span className="text-[11px] text-slate-400 block">{item.platform} · {item.specialty}</span>
                            </div>
                          ) : activeTab === 'attorneys' ? (
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
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-white text-xs">{item.city || item.state}</span>
                            {item.state && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-emerald-400 font-semibold">
                                {item.state}
                              </span>
                            )}
                          </div>
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
                {previewModalLead.type === 'creators' ? (
                  <button
                    type="button"
                    onClick={() => setSelectedAngle('15sec')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      selectedAngle !== 'followup'
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    🤝 Creator Partnership (40-50%)
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedAngle('15sec')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                        selectedAngle === '15sec'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      🎯 Liability Traps
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
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAngle('followup')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    selectedAngle === 'followup'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🔄 Quick Follow-Up
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

                  {/* Official Corporate Signature Badge */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-serif font-black text-lg shadow-sm">
                        M
                      </div>
                      <div>
                        <div className="text-white font-bold text-xs flex items-center gap-2">
                          <span className="tracking-wide">Mohammed Qaraman</span>
                          <span className="text-[10px] text-emerald-400 font-mono">Founder</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                            100% AIR-GAPPED
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Nexus ContractGuard™ · Institutional Diligence Systems
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          nexus-os.store · ABA Model Rule 1.6 Compliant
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 whitespace-nowrap">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ABA Model Rule 1.6 Shield</span>
                    </div>
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
