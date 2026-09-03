import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { Download, Upload, Shield, AlertTriangle, CheckCircle2, FileSpreadsheet, Lock, LogOut } from 'lucide-react';

export default function LeadScrub() {
  const navigate = useNavigate();
  const [leadsFile, setLeadsFile] = useState(null);
  const [dncFile, setDncFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // 100% Protected Route Logic
  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }
      setFile(file);
      setError('');
    }
  };

  const processFiles = () => {
    if (!leadsFile || !dncFile) {
      setError('Please upload both files to begin.');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Parse DNC File First
    Papa.parse(dncFile, {
      header: true,
      skipEmptyLines: true,
      complete: (dncResults) => {
        const dncEmails = new Set();
        dncResults.data.forEach(row => {
          const email = Object.values(row).find(val => 
            typeof val === 'string' && val.includes('@')
          );
          if (email) dncEmails.add(email.toLowerCase().trim());
        });

        // Parse Leads File Second
        Papa.parse(leadsFile, {
          header: true,
          skipEmptyLines: true,
          complete: (leadsResults) => {
            const cleanLeads = [];
            let removedCount = 0;

            leadsResults.data.forEach(row => {
              const email = Object.values(row).find(val => 
                typeof val === 'string' && val.includes('@')
              );
              
              if (email && dncEmails.has(email.toLowerCase().trim())) {
                removedCount++;
              } else {
                cleanLeads.push(row);
              }
            });

            setResults({
              totalOriginal: leadsResults.data.length,
              totalRemoved: removedCount,
              totalClean: cleanLeads.length,
              cleanData: cleanLeads,
              dncParsed: dncEmails.size
            });
            setIsProcessing(false);
          }
        });
      }
    });
  };

  const downloadCleanList = () => {
    if (!results?.cleanData) return;
    
    const csv = Papa.unparse(results.cleanData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'nexus_clean_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-nexus-emerald/5 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Standalone */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-nexus-emerald/30 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              <Shield className="text-nexus-emerald" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus LeadScrub</h1>
              <p className="text-gray-400 text-sm">Enterprise DNC Local Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-nexus-emerald text-sm bg-nexus-emerald/10 px-4 py-2 rounded-full border border-nexus-emerald/20">
              <Lock size={14} />
              <span>100% Local Processing</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-center gap-3">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Box 1: DNC */}
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="text-red-400" />
              1. Do Not Contact List (DNC)
            </h2>
            <p className="text-gray-400 text-sm mb-6">Upload the list of emails you MUST NOT contact.</p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-nexus-emerald hover:bg-nexus-emerald/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">
                  {dncFile ? <span className="text-nexus-emerald font-bold">{dncFile.name}</span> : 'Click to upload DNC CSV'}
                </p>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={(e) => handleFileUpload(e, setDncFile)} />
            </label>
          </div>

          {/* Box 2: Leads */}
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-cyan/5 rounded-full blur-3xl group-hover:bg-nexus-cyan/10 transition-colors"></div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="text-nexus-cyan" />
              2. New Leads List
            </h2>
            <p className="text-gray-400 text-sm mb-6">Upload your fresh leads to be scrubbed.</p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-nexus-cyan hover:bg-nexus-cyan/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-400">
                  {leadsFile ? <span className="text-nexus-cyan font-bold">{leadsFile.name}</span> : 'Click to upload Leads CSV'}
                </p>
              </div>
              <input type="file" className="hidden" accept=".csv" onChange={(e) => handleFileUpload(e, setLeadsFile)} />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-12">
          <button 
            onClick={processFiles}
            disabled={isProcessing || !leadsFile || !dncFile}
            className="bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_30px_rgba(0,255,157,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2"
          >
            {isProcessing ? 'Scrubbing...' : 'Scrub Data Locally'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="liquid-glass-strong p-8 rounded-3xl border border-nexus-emerald/30 shadow-[0_0_50px_rgba(0,255,157,0.1)]">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-nexus-emerald" />
              Scrubbing Complete
            </h2>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-black/50 p-6 rounded-2xl border border-white/5 text-center">
                <div className="text-4xl font-bold text-gray-300 mb-2">{results.totalOriginal.toLocaleString()}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">Total Leads</div>
              </div>
              <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{results.totalRemoved.toLocaleString()}</div>
                <div className="text-sm text-red-400/70 uppercase tracking-wider">DNC Removed</div>
              </div>
              <div className="bg-nexus-emerald/10 p-6 rounded-2xl border border-nexus-emerald/20 text-center">
                <div className="text-4xl font-bold text-nexus-emerald mb-2">{results.totalClean.toLocaleString()}</div>
                <div className="text-sm text-nexus-emerald/70 uppercase tracking-wider">Clean Leads</div>
              </div>
            </div>

            <button 
              onClick={downloadCleanList}
              className="w-full bg-white text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download />
              Download Clean CSV
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
