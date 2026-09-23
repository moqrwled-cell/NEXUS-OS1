import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Trash2, CheckCircle, AlertTriangle, FileSpreadsheet, Layers, DollarSign } from 'lucide-react';
import Papa from 'papaparse';

import { verifyToolAccess } from '../utils/auth';

export default function EcomMatch() {
  const navigate = useNavigate();
  const shopifyInputRef = useRef(null);
  const stripeInputRef = useRef(null);
  
  const [shopifyFile, setShopifyFile] = useState(null);
  const [stripeFile, setStripeFile] = useState(null);
  
  const [shopifyData, setShopifyData] = useState([]);
  const [stripeData, setStripeData] = useState([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!verifyToolAccess('ecommatch')) navigate('/login');
  }, [navigate]);

  const handleShopifyUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShopifyFile(file);
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: (res) => setShopifyData(res.data) });
  };

  const handleStripeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStripeFile(file);
    Papa.parse(file, { header: true, skipEmptyLines: true, complete: (res) => setStripeData(res.data) });
  };

  const processReconciliation = () => {
    if (!shopifyData.length || !stripeData.length) return;
    setIsProcessing(true);

    setTimeout(() => {
      // Very basic mock algorithm to find missing orders for the MVP
      // Assuming Shopify has 'Name' (Order ID like #1001) and 'Total'
      // Assuming Stripe has 'Description' (containing Order ID) and 'Amount'
      
      let missingInStripe = [];
      let amountMismatches = [];
      let totalRecoverable = 0;
      let matchedCount = 0;

      // Find the best columns
      const sCols = Object.keys(shopifyData[0] || {});
      const stCols = Object.keys(stripeData[0] || {});
      
      const sOrderCol = sCols.find(c => c.toLowerCase().includes('name') || c.toLowerCase().includes('order')) || sCols[0];
      const sTotalCol = sCols.find(c => c.toLowerCase().includes('total') || c.toLowerCase().includes('amount')) || sCols[1];
      
      const stDescCol = stCols.find(c => c.toLowerCase().includes('description') || c.toLowerCase().includes('memo')) || stCols[0];
      const stAmountCol = stCols.find(c => c.toLowerCase().includes('amount') || c.toLowerCase().includes('net')) || stCols[1];

      shopifyData.forEach(sRow => {
        const orderId = String(sRow[sOrderCol]).trim();
        const sAmount = parseFloat(String(sRow[sTotalCol]).replace(/[^0-9.-]+/g,"")) || 0;
        
        if (!orderId || sAmount <= 0) return;

        // Try to find in Stripe
        const stripeMatch = stripeData.find(stRow => {
          const desc = String(stRow[stDescCol]).toLowerCase();
          return desc.includes(orderId.toLowerCase().replace('#', ''));
        });

        if (!stripeMatch) {
          missingInStripe.push({ orderId, amount: sAmount });
          totalRecoverable += sAmount;
        } else {
          const stAmount = parseFloat(String(stripeMatch[stAmountCol]).replace(/[^0-9.-]+/g,"")) || 0;
          // Stripe amount is often slightly different due to fees, let's flag > 5% difference
          const diff = Math.abs(sAmount - stAmount);
          if (diff > (sAmount * 0.05)) {
            amountMismatches.push({ orderId, sAmount, stAmount, diff });
            totalRecoverable += diff;
          } else {
            matchedCount++;
          }
        }
      });

      setResults({
        totalRecoverable,
        matchedCount,
        missing: missingInStripe,
        mismatches: amountMismatches
      });
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Layers className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus EcomMatch</h1>
              <p className="text-gray-400 text-sm">Shopify vs Stripe Reconciliation</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all text-sm border border-white/10">
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>

        {!results ? (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Find Your Missing Money.</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Upload your Shopify Orders CSV and your Stripe Payouts CSV. Our algorithm will match every order to its payout and highlight the <strong className="text-blue-400">Missing Revenue</strong> instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Shopify Upload */}
              <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-[#95BF47]/20 p-2 rounded-lg text-[#95BF47]">
                    <FileSpreadsheet size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Shopify Export</h3>
                </div>
                {!shopifyFile ? (
                  <div onClick={() => shopifyInputRef.current.click()} className="border-2 border-dashed border-[#95BF47]/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-[#95BF47]/5 transition-all">
                    <Upload className="text-[#95BF47]/50 mx-auto mb-2" size={32} />
                    <p className="font-bold text-sm">Upload Shopify CSV</p>
                    <input type="file" accept=".csv" className="hidden" ref={shopifyInputRef} onChange={handleShopifyUpload} />
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{shopifyFile.name}</p>
                      <p className="text-xs text-gray-400">{shopifyData.length} Orders</p>
                    </div>
                    <button onClick={() => setShopifyFile(null)} className="text-gray-500 hover:text-red-400"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>

              {/* Stripe Upload */}
              <div className="liquid-glass-strong border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-[#635BFF]/20 p-2 rounded-lg text-[#635BFF]">
                    <FileSpreadsheet size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Stripe Export</h3>
                </div>
                {!stripeFile ? (
                  <div onClick={() => stripeInputRef.current.click()} className="border-2 border-dashed border-[#635BFF]/30 rounded-2xl p-8 text-center cursor-pointer hover:bg-[#635BFF]/5 transition-all">
                    <Upload className="text-[#635BFF]/50 mx-auto mb-2" size={32} />
                    <p className="font-bold text-sm">Upload Stripe CSV</p>
                    <input type="file" accept=".csv" className="hidden" ref={stripeInputRef} onChange={handleStripeUpload} />
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{stripeFile.name}</p>
                      <p className="text-xs text-gray-400">{stripeData.length} Transactions</p>
                    </div>
                    <button onClick={() => setStripeFile(null)} className="text-gray-500 hover:text-red-400"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={processReconciliation}
              disabled={!shopifyFile || !stripeFile || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2 text-lg"
            >
              {isProcessing ? 'Reconciling Data...' : 'Run EcomMatch Engine'}
            </button>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="liquid-glass-strong border border-blue-500/30 rounded-3xl p-8 col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><DollarSign size={16}/> Total Recoverable Revenue</p>
                <p className="text-5xl font-black text-blue-500 mb-2">${results.totalRecoverable.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</p>
                <p className="text-xs text-blue-200/70">Missing payouts and fee discrepancies found.</p>
              </div>
              
              <div className="liquid-glass-strong border border-emerald-500/30 rounded-3xl p-8 flex flex-col justify-center">
                <p className="text-emerald-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle size={16}/> Perfectly Matched</p>
                <p className="text-4xl font-black text-emerald-500 mb-2">{results.matchedCount}</p>
                <p className="text-xs text-emerald-200/70">Orders successfully deposited to Stripe.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Missing Payouts */}
              <div className="liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden">
                <div className="bg-red-500/10 border-b border-red-500/20 p-5 flex items-center gap-3">
                  <AlertTriangle className="text-red-500" />
                  <div>
                    <h3 className="font-bold text-red-100">Missing Payouts</h3>
                    <p className="text-xs text-red-200/70">Orders in Shopify not found in Stripe.</p>
                  </div>
                </div>
                <div className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/50 text-gray-400 text-xs uppercase">
                      <tr><th className="p-4">Order ID</th><th className="p-4">Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {results.missing.length > 0 ? results.missing.map((m, i) => (
                        <tr key={i} className="hover:bg-white/5"><td className="p-4 text-gray-300 font-mono">{m.orderId}</td><td className="p-4 text-red-400 font-bold">${m.amount.toFixed(2)}</td></tr>
                      )) : <tr><td colSpan="2" className="p-8 text-center text-gray-500">No missing payouts!</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amount Mismatches */}
              <div className="liquid-glass-strong border border-white/10 rounded-3xl overflow-hidden">
                <div className="bg-orange-500/10 border-b border-orange-500/20 p-5 flex items-center gap-3">
                  <AlertTriangle className="text-orange-500" />
                  <div>
                    <h3 className="font-bold text-orange-100">Fee Discrepancies (&gt;5%)</h3>
                    <p className="text-xs text-orange-200/70">Payout amount is unusually lower than order amount.</p>
                  </div>
                </div>
                <div className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/50 text-gray-400 text-xs uppercase">
                      <tr><th className="p-4">Order ID</th><th className="p-4">Difference</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {results.mismatches.length > 0 ? results.mismatches.map((m, i) => (
                        <tr key={i} className="hover:bg-white/5"><td className="p-4 text-gray-300 font-mono">{m.orderId}</td><td className="p-4 text-orange-400 font-bold">-${m.diff.toFixed(2)}</td></tr>
                      )) : <tr><td colSpan="2" className="p-8 text-center text-gray-500">No extreme discrepancies!</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4 pb-8">
              <button onClick={() => { setResults(null); }} className="text-gray-400 hover:text-white transition-colors">Start New Audit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
