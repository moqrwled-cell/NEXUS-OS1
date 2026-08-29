import React, { useState } from 'react';
import Papa from 'papaparse';
import { Download, Upload, Shield, AlertTriangle, CheckCircle2, FileSpreadsheet, Lock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function LeadScrub() {
  const [leadsFile, setLeadsFile] = useState(null);
  const [dncFile, setDncFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="text-nexus-emerald" size={32} />
              LeadScrub Engine
            </h1>
            <p className="text-gray-400">Locally cross-reference millions of rows against your DNC lists.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-nexus-emerald text-sm bg-nexus-emerald/10 px-4 py-2 rounded-full border border-nexus-emerald/20">
            <Lock size={14} />
            <span>100% Local Processing</span>
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
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
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
          <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
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
          <div className="liquid-glass-strong p-8 rounded-3xl border border-nexus-emerald/30">
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
    </DashboardLayout>
  );
}
