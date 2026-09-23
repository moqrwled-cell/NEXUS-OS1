import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Shield, ShieldAlert, ArrowLeft, Trash2, CheckCircle2, Lock, Filter, FileSpreadsheet, Users } from 'lucide-react';
import Papa from 'papaparse';

import { verifyToolAccess } from '../utils/auth';

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
  const [results, setResults] = useState(null);

  // Filter Toggles
  const [filters, setFilters] = useState({
    removeDuplicates: true,
    removeInvalid: true,
    removeRoleBased: true,
    removeFreeDomains: true
  });

  useEffect(() => {
    if (!verifyToolAccess('leadscrub')) navigate('/login');
  }, [navigate]);

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
          
          // Auto-detect email column
          const detectedEmailCol = cols.find(c => c.toLowerCase().includes('email') || c.toLowerCase().includes('e-mail'));
          if (detectedEmailCol) {
            setEmailColumn(detectedEmailCol);
          } else {
            setEmailColumn(cols[0]); // Default to first col
          }
          setResults(null);
        }
      }
    });
  };

  const processLeads = () => {
    if (!data.length || !emailColumn) return;
    setIsProcessing(true);

    setTimeout(() => {
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

      data.forEach(row => {
        let rawEmail = row[emailColumn];
        if (!rawEmail || typeof rawEmail !== 'string') rawEmail = '';
        const email = rawEmail.trim().toLowerCase();
        let isScrubbed = false;

        // 1. Invalid Format
        if (filters.removeInvalid && (!email || !emailRegex.test(email))) {
          stats.invalidFormat++;
          isScrubbed = true;
        }

        if (!isScrubbed) {
          // 2. Duplicates
          if (filters.removeDuplicates && seenEmails.has(email)) {
            stats.duplicates++;
            isScrubbed = true;
          } else {
            seenEmails.add(email);
          }
        }

        if (!isScrubbed) {
          const [prefix, domain] = email.split('@');
          
          // 3. Role-Based
          if (filters.removeRoleBased && ROLE_BASED_PREFIXES.includes(prefix)) {
            stats.roleBased++;
            isScrubbed = true;
          }
          
          // 4. Free Domains
          else if (filters.removeFreeDomains && FREE_DOMAINS.includes(domain)) {
            stats.freeDomain++;
            isScrubbed = true;
          }
        }

        if (!isScrubbed) {
          stats.valid++;
          cleanData.push(row);
        }
      });

      setResults({ stats, cleanData });
      setIsProcessing(false);
    }, 800); // Artificial delay for UX
  };

  const downloadCleanCSV = () => {
    if (!results || !results.cleanData.length) return;
    
    // Add BOM (\uFEFF) so Excel opens UTF-8 properly and splits columns
    const csv = Papa.unparse(results.cleanData);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `nexus_cleaned_leads_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/20 to-transparent -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
              <Shield className="text-teal-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus LeadScrub</h1>
              <p className="text-gray-400 text-sm">B2B Data Sanitization Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-teal-400 text-sm bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
              <Lock size={14} />
              <span>100% Local Browser Processing (Zero Uploads)</span>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10">
              <ArrowLeft size={16} /> Dashboard
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Config */}
          <div className="lg:col-span-5 space-y-6">
            <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileSpreadsheet className="text-teal-400" />
                1. Upload Raw Leads
              </h2>
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-teal-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-teal-500/5 hover:border-teal-400 transition-all group"
                >
                  <Upload className="text-teal-500/50 mb-4 group-hover:text-teal-400 transition-colors" size={48} />
                  <h3 className="font-bold text-lg mb-2">Upload CSV File</h3>
                  <p className="text-gray-400 text-sm">Drop your raw leads list here to begin.</p>
                  <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-teal-400" size={24}/>
                      <div>
                        <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • {data.length} Rows</p>
                      </div>
                    </div>
                    <button onClick={() => {setFile(null); setData([]); setResults(null);}} className="text-gray-400 hover:text-red-400 p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mt-6">
                    <label className="text-sm text-gray-400 font-medium">Select Email Column</label>
                    <select 
                      value={emailColumn} 
                      onChange={(e) => setEmailColumn(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
                    >
                      {columns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 opacity-100 transition-all">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Filter className="text-teal-400" />
                2. Sanitization Rules
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'removeInvalid', label: 'Remove Invalid Emails', desc: 'Drops malformed addresses' },
                  { key: 'removeDuplicates', label: 'Remove Duplicates', desc: 'Keeps only unique emails' },
                  { key: 'removeRoleBased', label: 'Remove Role-Based Emails', desc: 'Drops info@, admin@, etc.' },
                  { key: 'removeFreeDomains', label: 'Remove Free Domains', desc: 'Drops @gmail, @yahoo for strict B2B' }
                ].map(filter => (
                  <label key={filter.key} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-black/40 cursor-pointer hover:border-teal-500/30 transition-colors">
                    <div className="relative flex items-center pt-1">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={filters[filter.key]} 
                        onChange={() => toggleFilter(filter.key)}
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters[filter.key] ? 'bg-teal-500 border-teal-500' : 'border-gray-500'}`}>
                        {filters[filter.key] && <CheckCircle2 size={14} className="text-black" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{filter.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{filter.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button 
                onClick={processLeads}
                disabled={!file || isProcessing}
                className="w-full mt-8 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Scrubbing Leads...' : 'Run LeadScrub Engine'}
              </button>
            </div>
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-7">
            {results ? (
              <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 h-full animate-fade-in flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <ShieldAlert className="text-teal-400" />
                  Audit & Sanitization Report
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm font-medium mb-2">Total Uploaded</p>
                    <p className="text-3xl font-bold text-white">{results.stats.total}</p>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                    <p className="text-teal-400 text-sm font-medium mb-2">Valid B2B Leads</p>
                    <p className="text-3xl font-bold text-teal-400">{results.stats.valid}</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 flex-1">
                  <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-6">Threats Scrubbed</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-red-400 flex items-center gap-2"><Trash2 size={16}/> Duplicates Found</span>
                      <span className="font-bold text-lg">{results.stats.duplicates}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="bg-red-500 h-full" style={{width: `${(results.stats.duplicates / results.stats.total) * 100}%`}}></div></div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-orange-400 flex items-center gap-2"><ShieldAlert size={16}/> Role-Based (info@, etc.)</span>
                      <span className="font-bold text-lg">{results.stats.roleBased}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="bg-orange-500 h-full" style={{width: `${(results.stats.roleBased / results.stats.total) * 100}%`}}></div></div>

                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 flex items-center gap-2"><Users size={16}/> Free Domains (gmail, etc.)</span>
                      <span className="font-bold text-lg">{results.stats.freeDomain}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full" style={{width: `${(results.stats.freeDomain / results.stats.total) * 100}%`}}></div></div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center gap-2"><Filter size={16}/> Invalid Format</span>
                      <span className="font-bold text-lg">{results.stats.invalidFormat}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={downloadCleanCSV}
                  className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2"
                >
                  <Download size={20} /> Export Cleaned List (CSV)
                </button>
              </div>
            ) : (
               <div className="liquid-glass-strong border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Shield size={64} className="text-gray-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2">Awaiting Data</h3>
                  <p className="text-gray-400 max-w-sm">Upload a CSV and run the engine to see the detailed sanitization report here.</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
