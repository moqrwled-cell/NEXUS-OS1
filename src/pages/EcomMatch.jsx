import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, CheckCircle, AlertTriangle, XCircle, Download, Shield, Lock, LogOut, Upload, ArrowRightLeft } from 'lucide-react';
import Papa from 'papaparse';

export default function EcomMatch() {
  const navigate = useNavigate();
  const [storeFile, setStoreFile] = useState(null);
  const [gatewayFile, setGatewayFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/login');
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err)
      });
    });
  };

  const processReconciliation = async () => {
    if (!storeFile || !gatewayFile) {
      setError("Please upload both CSV files.");
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      const storeData = await parseCSV(storeFile);
      const gatewayData = await parseCSV(gatewayFile);

      let matched = [];
      let mismatched = [];
      let missing = [];

      // A simple but powerful real algorithm:
      // Loop through store data (e.g., Shopify), look for the Order ID (Name) in the gateway data (Description or ID)
      storeData.forEach(storeRow => {
        // Find possible ID columns in Store (Shopify usually uses "Name" for order like #1001)
        const orderId = storeRow['Name'] || storeRow['Order ID'] || storeRow['Order'] || storeRow['id'] || Object.values(storeRow)[0];
        const storeAmount = parseFloat(storeRow['Total'] || storeRow['Total Price'] || storeRow['Amount'] || 0);

        if (!orderId) return;

        // Search in Gateway data (Stripe uses "Description" to hold the order ID)
        const matchedGatewayRow = gatewayData.find(gRow => {
          const gValues = Object.values(gRow).join(' ').toLowerCase();
          return gValues.includes(String(orderId).toLowerCase().replace('#', ''));
        });

        if (matchedGatewayRow) {
          const gatewayAmount = parseFloat(matchedGatewayRow['Amount'] || matchedGatewayRow['Net'] || matchedGatewayRow['Total'] || 0);
          
          if (Math.abs(storeAmount - gatewayAmount) > 0.5) { // 50 cents tolerance
            mismatched.push({
              orderId,
              storeAmount,
              gatewayAmount,
              difference: Math.abs(storeAmount - gatewayAmount).toFixed(2),
              status: 'Mismatched Amount'
            });
          } else {
            matched.push({
              orderId,
              storeAmount,
              gatewayAmount,
              status: 'Perfect Match'
            });
          }
        } else {
          missing.push({
            orderId,
            storeAmount,
            status: 'Missing in Gateway (Not Paid)'
          });
        }
      });

      setResults({
        totalAnalyzed: storeData.length,
        matched,
        mismatched,
        missing
      });

    } catch (err) {
      setError("Error parsing CSV files. Please ensure they are valid.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;
    const combined = [
      ...results.missing.map(i => ({ "Order ID": i.orderId, "Store Amount": i.storeAmount, "Gateway Amount": "0.00", "Status": i.status })),
      ...results.mismatched.map(i => ({ "Order ID": i.orderId, "Store Amount": i.storeAmount, "Gateway Amount": i.gatewayAmount, "Status": i.status })),
    ];
    
    if (combined.length === 0) {
      alert("No missing or mismatched orders to export! Everything is perfect.");
      return;
    }

    const csv = Papa.unparse(combined);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nexus_financial_audit_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-600/10 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <FileSpreadsheet className="text-emerald-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus EcomMatch</h1>
              <p className="text-gray-400 text-sm">Real-Time Financial Reconciliation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <Lock size={14} />
              <span>100% In-Browser (Zero Data Uploads)</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {!results && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Stop Bleeding Money.</h2>
              <p className="text-gray-400">Match your Store Orders (Shopify/Woo) against your Payment Gateway (Stripe/PayPal) instantly. We find missing payouts and mismatched amounts.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl text-center">{error}</div>}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Store CSV */}
              <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative group hover:border-emerald-500/50 transition-all">
                <h3 className="text-xl font-bold mb-2">1. Store Orders CSV</h3>
                <p className="text-sm text-gray-400 mb-6">Export from Shopify/WooCommerce</p>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                  {storeFile ? (
                    <div className="text-center"><CheckCircle className="text-emerald-400 mx-auto mb-2" /><span className="text-sm">{storeFile.name}</span></div>
                  ) : (
                    <div className="text-center text-gray-500"><Upload className="mx-auto mb-2" /><span className="text-sm">Click to upload</span></div>
                  )}
                  <input type="file" className="hidden" accept=".csv" onChange={(e) => setStoreFile(e.target.files[0])} />
                </label>
              </div>

              {/* Gateway CSV */}
              <div className="liquid-glass-strong p-8 rounded-3xl border border-white/5 relative group hover:border-emerald-500/50 transition-all">
                <h3 className="text-xl font-bold mb-2">2. Payment Gateway CSV</h3>
                <p className="text-sm text-gray-400 mb-6">Export from Stripe/PayPal</p>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                  {gatewayFile ? (
                    <div className="text-center"><CheckCircle className="text-emerald-400 mx-auto mb-2" /><span className="text-sm">{gatewayFile.name}</span></div>
                  ) : (
                    <div className="text-center text-gray-500"><Upload className="mx-auto mb-2" /><span className="text-sm">Click to upload</span></div>
                  )}
                  <input type="file" className="hidden" accept=".csv" onChange={(e) => setGatewayFile(e.target.files[0])} />
                </label>
              </div>
            </div>

            <button 
              onClick={processReconciliation}
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 flex justify-center items-center gap-3"
            >
              {isProcessing ? 'Analyzing Data Locally...' : <><ArrowRightLeft /> Run Financial Audit</>}
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {results && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Audit Complete</h2>
                <p className="text-gray-400">Analyzed {results.totalAnalyzed} store orders.</p>
              </div>
              <button onClick={() => setResults(null)} className="text-sm text-emerald-400 hover:underline">Start New Audit</button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-emerald-500">
                <div className="flex items-center gap-3 mb-2 text-emerald-400"><CheckCircle size={20}/> Perfect Matches</div>
                <div className="text-3xl font-bold">{results.matched.length}</div>
              </div>
              
              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-2 text-yellow-400"><AlertTriangle size={20}/> Amount Mismatches</div>
                <div className="text-3xl font-bold">{results.mismatched.length}</div>
              </div>

              <div className="liquid-glass-strong p-6 rounded-2xl border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-2 text-red-400"><XCircle size={20}/> Missing Payouts</div>
                <div className="text-3xl font-bold">{results.missing.length}</div>
              </div>
            </div>

            <div className="liquid-glass-strong rounded-3xl overflow-hidden border border-white/5 mb-8">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-lg">Discrepancy Report</h3>
                <button onClick={downloadResults} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                  <Download size={16} /> Export Discrepancies (CSV)
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black/30 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Store Amount</th>
                      <th className="p-4">Gateway Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {results.missing.map((item, i) => (
                      <tr key={`miss-${i}`} className="bg-red-500/5">
                        <td className="p-4 font-mono">{item.orderId}</td>
                        <td className="p-4">${item.storeAmount}</td>
                        <td className="p-4 text-gray-500">-</td>
                        <td className="p-4 text-red-400">{item.status}</td>
                      </tr>
                    ))}
                    {results.mismatched.map((item, i) => (
                      <tr key={`mism-${i}`} className="bg-yellow-500/5">
                        <td className="p-4 font-mono">{item.orderId}</td>
                        <td className="p-4">${item.storeAmount}</td>
                        <td className="p-4">${item.gatewayAmount}</td>
                        <td className="p-4 text-yellow-400">{item.status}</td>
                      </tr>
                    ))}
                    {results.missing.length === 0 && results.mismatched.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-emerald-400">100% Match! No discrepancies found.</td>
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
