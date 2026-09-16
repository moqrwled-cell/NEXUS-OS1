import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, AlertCircle, CheckCircle, Download, Upload, Lock, LogOut, DollarSign, Activity , ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';

export default function AdSpendAudit() {
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const goHome = () => {
    navigate('/');
  };

  const processAudit = () => {
    if (!csvFile) {
      setError('Please upload an Ads report (CSV).');
      return;
    }
    setError('');
    setIsProcessing(true);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        let totalSpend = 0;
        let wastedSpend = 0;
        let badAds = [];
        let goodAds = 0;

        data.forEach(row => {
          // Normalize column names for Meta/Google Ads
          const name = row['Campaign name'] || row['Ad Set Name'] || row['Ad name'] || row['Campaign'] || row['Ad'] || 'Unknown Ad';
          const spendStr = row['Amount spent (USD)'] || row['Spend'] || row['Cost'] || row['Amount spent'] || '0';
          const convStr = row['Results'] || row['Conversions'] || row['Purchases'] || '0';
          
          const spend = parseFloat(spendStr.replace(/[^0-9.-]+/g,"")) || 0;
          const conversions = parseFloat(convStr.replace(/[^0-9.-]+/g,"")) || 0;

          if (spend > 0) {
            totalSpend += spend;
            
            // The Logic: If we spent more than $30 and got 0 conversions, it's wasted.
            // Or if Cost Per Result is extremely high.
            if (spend > 30 && conversions === 0) {
              wastedSpend += spend;
              badAds.push({ name, spend, conversions, status: 'Killing Budget (Zero ROI)' });
            } else if (spend > 100 && conversions < 2) {
              wastedSpend += (spend / 2); // Count half as wasted for bad ROI
              badAds.push({ name, spend, conversions, status: 'High CPA (Review immediately)' });
            } else {
              goodAds++;
            }
          }
        });

        // Sort by biggest waste
        badAds.sort((a, b) => b.spend - a.spend);

        setResults({
          totalAds: data.length,
          totalSpend,
          wastedSpend,
          goodAds,
          badAds
        });
        setIsProcessing(false);
      },
      error: (err) => {
        setError('Failed to parse CSV. Make sure it is a valid Google/Meta Ads export.');
        setIsProcessing(false);
      }
    });
  };

  const downloadResults = () => {
    if (!results) return;
    const csv = Papa.unparse(results.badAds);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nexus_wasted_ad_spend_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-600/10 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <TrendingDown className="text-red-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus AdSpend Audit</h1>
              <p className="text-gray-400 text-sm">Automated Wasted Budget Detector</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
              <Lock size={14} />
              <span>100% In-Browser (Data Never Leaves)</span>
            </div>
            <button 
              onClick={goHome} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <ArrowLeft size={16} /> Back to Nexus
            </button>
          </div>
        </div>

        {!results ? (
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Stop Burning Cash on Bad Ads.</h2>
            <p className="text-gray-400 text-lg mb-10">
              Upload your Meta (Facebook) or Google Ads CSV export. Our local engine instantly identifies campaigns that are draining your budget with zero return.
            </p>

            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-left">{error}</div>}

            <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative group hover:border-red-500/50 transition-all mb-8 text-center">
              <Upload className="mx-auto text-red-400 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Upload Ads CSV Export</h3>
              <p className="text-sm text-gray-500 mb-6">Must contain "Spend" and "Results/Conversions" columns.</p>
              
              <label className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-xl cursor-pointer transition-colors border border-white/10">
                {csvFile ? csvFile.name : 'Choose CSV File'}
                <input type="file" className="hidden" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} />
              </label>
            </div>

            <button 
              onClick={processAudit}
              disabled={isProcessing || !csvFile}
              className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-3"
            >
              {isProcessing ? 'Auditing Ads Locally...' : <><Activity /> Run AdSpend Audit</>}
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-gray-500">
                <div className="flex items-center gap-3 mb-2 text-gray-400"><DollarSign size={20}/> Total Spend Analyzed</div>
                <div className="text-3xl font-bold">${results.totalSpend.toFixed(2)}</div>
              </div>
              
              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-red-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/10 z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2 text-red-400"><AlertCircle size={20}/> Wasted Budget Identified</div>
                  <div className="text-4xl font-bold text-red-400">${results.wastedSpend.toFixed(2)}</div>
                </div>
              </div>

              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-2 text-green-400"><CheckCircle size={20}/> Healthy Campaigns</div>
                <div className="text-3xl font-bold">{results.goodAds}</div>
              </div>
            </div>

            <div className="liquid-glass-strong rounded-3xl overflow-hidden border border-white/5">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-lg text-red-400 flex items-center gap-2"><TrendingDown /> Campaigns to Kill Immediately</h3>
                <div className="flex gap-4">
                  <button onClick={() => setResults(null)} className="text-sm text-gray-400 hover:text-white transition-colors">Start New Audit</button>
                  <button onClick={downloadResults} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                    <Download size={16} /> Export Kill List (CSV)
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/30 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="p-4">Campaign / Ad Name</th>
                      <th className="p-4">Spend</th>
                      <th className="p-4">Conversions</th>
                      <th className="p-4">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {results.badAds.map((ad, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 font-medium text-gray-200">{ad.name}</td>
                        <td className="p-4 text-red-400 font-mono">${ad.spend.toFixed(2)}</td>
                        <td className="p-4 text-gray-400">{ad.conversions}</td>
                        <td className="p-4">
                          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                            {ad.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {results.badAds.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-green-400">No wasted spend detected! Your ads are highly optimized.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
