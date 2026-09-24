import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, ArrowLeft, Trash2, TrendingDown, Target, FileSpreadsheet, Activity, AlertOctagon, TrendingUp } from 'lucide-react';
import Papa from 'papaparse';

import { verifyToolAccess } from '../utils/auth';

export default function AdSpendAudit() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  
  // Mapping columns
  const [mapping, setMapping] = useState({
    campaignName: '',
    spend: '',
    conversions: ''
  });
  
  const [targetCPA, setTargetCPA] = useState(25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!verifyToolAccess('adspendaudit')) navigate('/login');
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
          
          // Auto-detect columns
          let m = { campaignName: cols[0], spend: cols[0], conversions: cols[0] };
          cols.forEach(c => {
            const lower = c.toLowerCase();
            if (lower.includes('campaign') || lower.includes('name')) m.campaignName = c;
            if (lower.includes('spend') || lower.includes('amount') || lower.includes('cost')) m.spend = c;
            if (lower.includes('purchase') || lower.includes('conversion') || lower.includes('result') || lower.includes('lead')) m.conversions = c;
          });
          setMapping(m);
          setResults(null);
        }
      }
    });
  };

  const processAudit = () => {
    if (!data.length || !mapping.campaignName || !mapping.spend || !mapping.conversions) return;
    setIsProcessing(true);

    setTimeout(() => {
      let totalWasted = 0;
      let totalSpend = 0;
      let zombies = [];
      let highCpa = [];
      let scalable = [];

      data.forEach(row => {
        const name = row[mapping.campaignName] || 'Unnamed';
        // Parse numbers safely, removing currency symbols
        const spendStr = String(row[mapping.spend]).replace(/[^0-9.-]+/g,"");
        const convStr = String(row[mapping.conversions]).replace(/[^0-9.-]+/g,"");
        
        const spend = parseFloat(spendStr) || 0;
        const conversions = parseFloat(convStr) || 0;
        
        if (spend <= 0) return; // Skip zero spend rows
        totalSpend += spend;

        const actualCPA = conversions > 0 ? (spend / conversions) : Infinity;

        // Zombie: Spent over $30 but got 0 conversions
        if (conversions === 0 && spend > 30) {
          totalWasted += spend;
          zombies.push({ name, spend, conversions, cpa: actualCPA });
        } 
        // High CPA: Cost per acquisition is higher than Target CPA
        else if (conversions > 0 && actualCPA > targetCPA) {
          const wastedOnThis = spend - (targetCPA * conversions); // Mathematical waste
          totalWasted += wastedOnThis;
          highCpa.push({ name, spend, conversions, cpa: actualCPA, wasted: wastedOnThis });
        }
        // Scalable: Doing great!
        else if (conversions > 0 && actualCPA <= targetCPA) {
          scalable.push({ name, spend, conversions, cpa: actualCPA });
        }
      });

      // Sort by worst offenders
      zombies.sort((a, b) => b.spend - a.spend);
      highCpa.sort((a, b) => b.wasted - a.wasted);
      scalable.sort((a, b) => a.cpa - b.cpa);

      setResults({
        totalSpend,
        totalWasted,
        zombies,
        highCpa,
        scalable
      });
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-900/20 to-transparent -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Activity className="text-rose-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus AdSpend-Audit</h1>
              <p className="text-gray-400 text-sm">Financial Ad Account Analyzer</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('nexus_access_token'); localStorage.removeItem('nexus_license'); navigate('/login'); }} className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10">
            <ArrowLeft size={16} /> Logout
          </button>
        </div>

        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Config */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileSpreadsheet className="text-rose-400" />
                1. Upload Ad Data
              </h2>
              
              {!file ? (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-rose-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-rose-500/5 hover:border-rose-400 transition-all group"
                >
                  <Upload className="text-rose-500/50 mb-4 group-hover:text-rose-400" size={40} />
                  <h3 className="font-bold text-base mb-2">Upload Ads CSV</h3>
                  <p className="text-gray-400 text-xs">Export from Facebook/Google Ads.</p>
                  <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative">
                   <button onClick={() => {setFile(null); setData([]); setResults(null);}} className="absolute top-4 right-4 text-gray-400 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                    <p className="font-bold text-sm truncate pr-8">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{data.length} Campaigns Found</p>
                </div>
              )}
            </div>

            <div className={`liquid-glass-strong border border-white/10 rounded-3xl p-8 transition-all ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="text-rose-400" />
                2. Map & Configure
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Campaign Name Column</label>
                  <select value={mapping.campaignName} onChange={(e) => setMapping({...mapping, campaignName: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none">
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Amount Spent Column</label>
                  <select value={mapping.spend} onChange={(e) => setMapping({...mapping, spend: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none">
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Conversions/Purchases Column</label>
                  <select value={mapping.conversions} onChange={(e) => setMapping({...mapping, conversions: e.target.value})} className="w-full bg-black border border-white/20 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 outline-none">
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="text-sm text-white font-bold block mb-2">Target CPA ($)</label>
                  <p className="text-xs text-gray-400 mb-3">How much are you willing to pay per conversion?</p>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-500" size={16}/>
                    <input 
                      type="number" 
                      value={targetCPA} 
                      onChange={(e) => setTargetCPA(Number(e.target.value))}
                      className="w-full bg-black border border-white/20 rounded-lg pl-9 p-2.5 text-white font-bold focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={processAudit}
                disabled={isProcessing}
                className="w-full mt-8 bg-gradient-to-r from-rose-600 to-red-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:scale-105 transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Auditing Finances...' : 'Run Financial Audit'}
              </button>
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="w-full">
            {results ? (
              <div className="space-y-6 animate-fade-in">
                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="liquid-glass-strong border border-rose-500/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full"></div>
                    <p className="text-rose-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><TrendingDown size={16}/> Wasted Ad Spend</p>
                    <p className="text-5xl font-black text-rose-500 mb-2">${results.totalWasted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</p>
                    <p className="text-xs text-rose-200/70">Money mathematically thrown away on bad campaigns.</p>
                  </div>
                  
                  <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Analyzed Spend</p>
                    <p className="text-4xl font-bold text-white mb-2">${results.totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</p>
                    <p className="text-xs text-gray-500">{((results.totalWasted / results.totalSpend) * 100).toFixed(1)}% of your budget is being wasted.</p>
                  </div>
                </div>

                {/* Kill List (Zombies) */}
                <div className="liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden">
                  <div className="bg-rose-500/10 border-b border-rose-500/20 p-5 flex items-center gap-3">
                    <AlertOctagon className="text-rose-500" />
                    <div>
                      <h3 className="font-bold text-rose-100">The "Kill" List (Zombies)</h3>
                      <p className="text-xs text-rose-200/70">Campaigns that spent money but brought ZERO conversions.</p>
                    </div>
                  </div>
                  <div className="p-0 max-h-[250px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/50 text-gray-400 text-xs uppercase">
                        <tr>
                          <th className="p-4 font-medium">Campaign</th>
                          <th className="p-4 font-medium">Spent</th>
                          <th className="p-4 font-medium">Convs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {results.zombies.length > 0 ? results.zombies.map((c, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-rose-100 truncate max-w-[200px]">{c.name}</td>
                            <td className="p-4 text-rose-400 font-bold">${c.spend.toFixed(2)}</td>
                            <td className="p-4 text-gray-500">0</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="3" className="p-8 text-center text-gray-500">No zombie campaigns found!</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Scale List */}
                <div className="liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden">
                  <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-5 flex items-center gap-3">
                    <TrendingUp className="text-emerald-500" />
                    <div>
                      <h3 className="font-bold text-emerald-100">The "Scale" List (Winners)</h3>
                      <p className="text-xs text-emerald-200/70">Campaigns hitting your Target CPA. Increase budgets here.</p>
                    </div>
                  </div>
                  <div className="p-0 max-h-[250px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/50 text-gray-400 text-xs uppercase">
                        <tr>
                          <th className="p-4 font-medium">Campaign</th>
                          <th className="p-4 font-medium">Spent</th>
                          <th className="p-4 font-medium">Convs</th>
                          <th className="p-4 font-medium">Actual CPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {results.scalable.length > 0 ? results.scalable.map((c, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-emerald-100 truncate max-w-[200px]">{c.name}</td>
                            <td className="p-4 text-gray-300">${c.spend.toFixed(2)}</td>
                            <td className="p-4 text-gray-300">{c.conversions}</td>
                            <td className="p-4 text-emerald-400 font-bold">${c.cpa.toFixed(2)}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan="4" className="p-8 text-center text-gray-500">No campaigns hitting the target CPA.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
               <div className="liquid-glass-strong border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center opacity-50 min-h-[400px]">
                  <Activity size={64} className="text-gray-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2">Audit Dashboard</h3>
                  <p className="text-gray-400 max-w-sm">Map your columns and hit run to instantly calculate mathematically wasted ad spend.</p>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
