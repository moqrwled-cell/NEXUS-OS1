import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Shield, ShieldAlert, ArrowLeft, Trash2, CheckCircle2, Lock, Filter, FileSpreadsheet, Users, Table, Mail, Phone, Globe, Star, HardDriveDownload, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Papa from 'papaparse';

import { verifyToolAccess } from '../utils/auth';
import PirateTrapModal from '../components/PirateTrapModal';

const ROLE_BASED_PREFIXES = ['info', 'sales', 'support', 'admin', 'contact', 'hello', 'marketing', 'press', 'help', 'billing', 'jobs', 'careers'];
const FREE_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com'];

export default function LeadScrub() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [emailColumn, setEmailColumn] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [results, setResults] = useState(null);
  const [showPirateTrap, setShowPirateTrap] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'data'
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Filter Toggles
  const [filters, setFilters] = useState({
    removeDuplicates: true,
    removeInvalid: true,
    removeRoleBased: true,
    removeFreeDomains: true,
    enrichData: true
  });

  useEffect(() => {
    if (verifyToolAccess('leadscrub') || verifyToolAccess('all') || localStorage.getItem('nexus_access_token')) {
      setIsUnlocked(true);
    } else {
      setShowPirateTrap(true);
    }

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
       alert("التطبيق مثبت بالفعل أو أن متصفحك لا يدعم هذه الميزة مؤقتاً.");
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          setData(results.data);
          const cols = Object.keys(results.data[0]);
          setColumns(cols);
          
          const detectedEmailCol = cols.find(c => c.toLowerCase().includes('email') || c.toLowerCase().includes('e-mail'));
          if (detectedEmailCol) {
            setEmailColumn(detectedEmailCol);
          } else {
            setEmailColumn(cols[0]); 
          }
          setResults(null);
        }
      }
    });
  };

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); 
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {}
  };

  const processLeads = () => {
    if (!data.length || !emailColumn) return;
    setIsProcessing(true);

    let stats = {
      total: data.length,
      valid: 0,
      duplicates: 0,
      invalidFormat: 0,
      roleBased: 0,
      freeDomain: 0
    };

      const cleanData = [];
      const seenEmails = new Set();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameCol = columns.find(c => c.toLowerCase() === 'name' || c.toLowerCase() === 'full name' || c.toLowerCase() === 'fullname');

      data.forEach(row => {
        let rawEmail = row[emailColumn];
        if (!rawEmail || typeof rawEmail !== 'string') rawEmail = '';
        const email = rawEmail.trim().toLowerCase();
        let isScrubbed = false;
        
        let prefix = '';
        let domain = '';
        if (email.includes('@')) {
          [prefix, domain] = email.split('@');
        }

        if (filters.removeInvalid && (!email || !emailRegex.test(email))) {
          stats.invalidFormat++;
          isScrubbed = true;
        }

        if (!isScrubbed) {
          if (filters.removeDuplicates && seenEmails.has(email)) {
            stats.duplicates++;
            isScrubbed = true;
          } else {
            seenEmails.add(email);
          }
        }

        if (!isScrubbed) {
          if (filters.removeRoleBased && ROLE_BASED_PREFIXES.includes(prefix)) {
            stats.roleBased++;
            isScrubbed = true;
          }
          else if (filters.removeFreeDomains && FREE_DOMAINS.includes(domain)) {
            stats.freeDomain++;
            isScrubbed = true;
          }
        }

        if (!isScrubbed) {
          stats.valid++;
          let processedRow = { ...row };

          if (filters.enrichData) {
            let score = 1; 

            let hasValidName = false;
            if (nameCol && row[nameCol]) {
              const nameParts = row[nameCol].trim().split(' ');
              const firstName = capitalize(nameParts[0]);
              const lastName = nameParts.length > 1 ? capitalize(nameParts.slice(1).join(' ')) : '';
              processedRow['First Name'] = firstName;
              processedRow['Last Name'] = lastName;
              if (firstName) {
                hasValidName = true;
                score += 1;
              }
            }

            if (domain) {
              processedRow['Website'] = domain;
              const companyRaw = domain.split('.')[0];
              processedRow['Company Name'] = capitalize(companyRaw);
              
              if (!FREE_DOMAINS.includes(domain)) {
                score += 2; 
              }
            }

            const phoneCol = columns.find(c => c.toLowerCase().includes('phone') || c.toLowerCase().includes('mobile'));
            if (phoneCol && row[phoneCol] && row[phoneCol].trim().length > 5) {
              score += 1;
            }

            processedRow['Lead Score'] = Math.min(score, 5);
          }

          cleanData.push(processedRow);
        }
      });

    setResults({ stats, cleanData });
    setIsProcessing(false);
    setProcessingStage('');
    setActiveTab('data'); 
    setCurrentPage(1);
    setSearchTerm('');
    playSuccessSound();
  };

  const downloadCleanCSV = () => {
    if (!results || !results.cleanData.length) return;
    
    const formattedData = results.cleanData.map(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        const val = String(newRow[key] || '');
        if (key.toLowerCase().includes('phone') || /^[+0]\d{5,15}$/.test(val)) {
          newRow[key] = `="${val}"`;
        }
      });
      return newRow;
    });

    const csv = Papa.unparse(formattedData);
    const excelFriendlyCSV = "sep=,\r\n" + csv;
    const blob = new Blob(["\ufeff" + excelFriendlyCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `nexus_cleaned_leads_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCRMExport = () => {
    if (!results || !results.cleanData.length) return;
    
    const crmData = results.cleanData.map(row => {
      return {
        firstName: row['First Name'] || '',
        lastName: row['Last Name'] || '',
        email: row[emailColumn] || '',
        companyName: row['Company Name'] || '',
        phone: row['Phone'] || row['phone'] || row['Mobile'] || '',
        website: row['Website'] || '',
        customLeadScore: row['Lead Score'] || ''
      };
    });

    const csv = Papa.unparse(crmData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `GHL_Instantly_Import_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderInteractiveCell = (key, value) => {
    if (value === null || value === undefined || value === '') return <span className="text-gray-500">-</span>;
    
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('email')) {
      return (
        <a href={`mailto:${value}`} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 hover:underline">
          <Mail size={14} /> {value}
        </a>
      );
    }
    
    if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
      const cleanPhone = String(value).replace(/[^\d+]/g, '');
      return (
        <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 hover:underline">
          <Phone size={14} /> {value}
        </a>
      );
    }
    
    if (lowerKey.includes('website') || lowerKey.includes('domain')) {
      return (
        <a href={`https://${value}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline">
          <Globe size={14} /> {value}
        </a>
      );
    }

    if (lowerKey === 'lead score') {
      return (
        <div className="flex gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < value ? 'fill-current' : 'text-gray-600'} />
          ))}
        </div>
      );
    }

    return <span>{value}</span>;
  };

  // Compute Filtered and Paginated Data
  let filteredData = [];
  let paginatedData = [];
  let totalPages = 1;

  if (results && results.cleanData) {
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      filteredData = results.cleanData.filter(row => {
        return Object.values(row).some(val => String(val).toLowerCase().includes(lowerSearch));
      });
    } else {
      filteredData = results.cleanData;
    }
    
    totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    
    // Ensure currentPage is valid after search filters change total pages
    const validCurrentPage = Math.min(currentPage, totalPages);
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
    
    paginatedData = filteredData.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/20 to-transparent -z-10 pointer-events-none" />
      
      {isUnlocked && (
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                <Shield className="text-teal-400" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  Nexus LeadScrub 2.0
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/30">PRO</span>
                </h1>
                <p className="text-gray-400 text-sm">B2B Data Sanitization & Enrichment Suite</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-teal-400 text-sm bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
                <Lock size={14} />
                <span>100% Local Browser Processing</span>
              </div>
              
              {/* Desktop Install Button */}
              <button 
                onClick={handleInstallApp}
                className="flex items-center gap-2 bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105"
                title="تثبيت التطبيق على سطح المكتب"
              >
                <HardDriveDownload size={16} />
                Install Desktop App
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
            
            {/* Left Column: Upload & Config */}
            <div className="flex flex-col gap-6">
              <div className="liquid-glass-strong border border-white/10 rounded-3xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileSpreadsheet className="text-teal-400" />
                  1. Upload Raw Leads
                </h2>
                
                {!file ? (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-teal-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-500/5 hover:border-teal-400 transition-all group"
                  >
                    <Upload className="text-teal-500/50 mb-4 group-hover:text-teal-400 transition-colors" size={40} />
                    <h3 className="font-bold text-md mb-2">Upload CSV File</h3>
                    <p className="text-gray-400 text-xs">Drop your raw leads list here to begin.</p>
                    <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="text-teal-400" size={20}/>
                        <div>
                          <p className="font-bold text-sm truncate max-w-[150px]">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • {data.length} Rows</p>
                        </div>
                      </div>
                      <button onClick={() => {setFile(null); setData([]); setResults(null);}} className="text-gray-400 hover:text-red-400 p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <label className="text-xs text-gray-400 font-medium">Select Email Column</label>
                      <select 
                        value={emailColumn} 
                        onChange={(e) => setEmailColumn(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                      >
                        {columns.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="liquid-glass-strong border border-white/10 rounded-3xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="text-teal-400" />
                  2. Processing Engine
                </h2>
                
                <div className="space-y-3">
                  {[
                    { key: 'removeInvalid', label: 'Drop Invalid Emails' },
                    { key: 'removeDuplicates', label: 'Drop Duplicates' },
                    { key: 'removeRoleBased', label: 'Drop Role-Based (info@)' },
                    { key: 'removeFreeDomains', label: 'Drop Free Emails (@gmail)' },
                    { key: 'enrichData', label: 'AI Data Enrichment', isPro: true }
                  ].map(filter => (
                    <label key={filter.key} className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${filters[filter.key] ? 'bg-teal-900/20 border-teal-500/30' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${filters[filter.key] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'}`}>
                          {filters[filter.key] && <CheckCircle2 size={12} className="text-black" />}
                        </div>
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                          {filter.label}
                          {filter.isPro && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30">PRO</span>}
                        </span>
                      </div>
                      <input type="checkbox" className="sr-only" checked={filters[filter.key]} onChange={() => toggleFilter(filter.key)}/>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={processLeads}
                  disabled={!file || isProcessing}
                  className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {processingStage || 'Processing...'}
                    </div>
                  ) : 'Run Processing Engine'}
                </button>
              </div>
            </div>

            {/* Right Column: Dynamic Dashboard */}
            <div className="w-full h-[800px]">
              {results ? (
                <div className="liquid-glass-strong border border-white/10 rounded-3xl h-full flex flex-col overflow-hidden animate-fade-in relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                  
                  {/* Dashboard Header / Tabs */}
                  <div className="flex border-b border-white/10 shrink-0">
                    <button 
                      onClick={() => setActiveTab('audit')}
                      className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'audit' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/10' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      <ShieldAlert size={16} /> Audit Report
                    </button>
                    <button 
                      onClick={() => setActiveTab('data')}
                      className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'data' ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-900/10' : 'text-gray-400 hover:bg-white/5'}`}
                    >
                      <Table size={16} /> Interactive Data View
                    </button>
                  </div>

                  {/* Tab Content: AUDIT REPORT */}
                  {activeTab === 'audit' && (
                    <div className="p-8 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                          <p className="text-gray-400 text-sm font-medium mb-2">Total Uploaded</p>
                          <p className="text-4xl font-bold text-white">{results.stats.total}</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-900/40 to-emerald-900/20 border border-teal-500/30 rounded-2xl p-6 relative overflow-hidden">
                          <p className="text-teal-400 text-sm font-medium mb-2">Pure Prospects Generated</p>
                          <p className="text-4xl font-bold text-teal-400">{results.stats.valid}</p>
                          <div className="absolute top-2 right-4 text-emerald-400 text-xs font-bold bg-emerald-500/20 px-2 py-1 rounded">
                            Bounces Prevented: {results.stats.duplicates + results.stats.invalidFormat + results.stats.roleBased + results.stats.freeDomain}
                          </div>
                          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                            <span>Estimated Savings:</span>
                            <strong className="text-sm">${((results.stats.duplicates + results.stats.invalidFormat + results.stats.roleBased + results.stats.freeDomain) * 0.05).toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-6 flex justify-between">
                          <span>Threats Scrubbed</span>
                          <span className="text-emerald-500 font-bold normal-case text-sm tracking-normal">Prevents Domain Burning</span>
                        </h3>
                        <div className="space-y-6">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-red-400 flex items-center gap-2"><Trash2 size={16}/> Duplicates Found</span>
                            <span className="font-bold text-lg">{results.stats.duplicates}</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-red-500 h-full" style={{width: `${(results.stats.duplicates / results.stats.total) * 100}%`}}></div></div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-orange-400 flex items-center gap-2"><ShieldAlert size={16}/> Role-Based Emails</span>
                            <span className="font-bold text-lg">{results.stats.roleBased}</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-orange-500 h-full" style={{width: `${(results.stats.roleBased / results.stats.total) * 100}%`}}></div></div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-yellow-400 flex items-center gap-2"><Users size={16}/> Free Domains</span>
                            <span className="font-bold text-lg">{results.stats.freeDomain}</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full" style={{width: `${(results.stats.freeDomain / results.stats.total) * 100}%`}}></div></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: DATA VIEW */}
                  {activeTab === 'data' && (
                    <div className="flex-1 overflow-hidden flex flex-col relative z-10">
                      
                      {/* Search Bar */}
                      <div className="p-4 border-b border-white/5 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="relative w-full md:w-96">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input 
                            type="text"
                            placeholder="Smart Search (Name, Domain, Email...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all"
                          />
                        </div>
                        <div className="text-sm text-gray-400 whitespace-nowrap">
                          Found <strong className="text-white">{filteredData.length}</strong> records
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="sticky top-0 bg-black/90 backdrop-blur-md z-20 shadow-sm">
                            <tr>
                              {results.cleanData.length > 0 && Object.keys(results.cleanData[0]).map(col => (
                                <th key={col} className="p-3 font-semibold text-teal-500 border-b border-white/10 uppercase text-xs tracking-wider">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 border-b border-white/5 transition-colors group">
                                {Object.entries(row).map(([key, val], colIdx) => (
                                  <td key={colIdx} className="p-3 text-gray-300">
                                    {renderInteractiveCell(key, val)}
                                  </td>
                                ))}
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={100} className="p-8 text-center text-gray-500">
                                  No records found matching "{searchTerm}"
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="p-4 border-t border-white/5 bg-black/60 flex justify-between items-center shrink-0">
                          <p className="text-xs text-gray-400">
                            Page <strong className="text-white">{Math.min(currentPage, totalPages)}</strong> of <strong className="text-white">{totalPages}</strong>
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button 
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Export Button (Always visible at bottom) */}
                  <div className="p-6 border-t border-white/10 bg-black/40 shrink-0 flex flex-col gap-3">
                    <button 
                      onClick={downloadCleanCSV}
                      className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      <Download size={20} /> Export Complete Dataset (CSV)
                    </button>
                    <button 
                      onClick={downloadCRMExport}
                      className="w-full bg-teal-900/40 text-teal-400 border border-teal-500/30 font-bold py-3 px-6 rounded-xl hover:bg-teal-900/60 transition-all flex justify-center items-center gap-2"
                    >
                      <Download size={18} /> Export for GoHighLevel / Instantly (Mapped Headers)
                    </button>
                  </div>

                </div>
              ) : (
                <div className="liquid-glass-strong border border-white/5 rounded-3xl h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Shield size={64} className="text-gray-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2">Awaiting Data</h3>
                  <p className="text-gray-400 max-w-sm">Upload a CSV and run the engine to see the detailed sanitization report here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <PirateTrapModal 
        isOpen={showPirateTrap} 
        onSuccess={() => {
          setShowPirateTrap(false);
          setIsUnlocked(true);
        }} 
      />
    </div>
  );
}
