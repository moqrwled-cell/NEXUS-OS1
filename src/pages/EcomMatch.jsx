import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, Activity, Lock, ShieldCheck, TrendingUp, TrendingDown, Percent, Box, HardDriveDownload, AlertTriangle, RefreshCcw } from 'lucide-react';
import Papa from 'papaparse';

import { verifyToolAccess } from '../utils/auth';
import PirateTrapModal from '../components/PirateTrapModal';

export default function EcomMatch() {
  const navigate = useNavigate();
  
  // File References
  const shopifyRef = useRef(null);
  const adsRef = useRef(null);
  const supplierRef = useRef(null);
  
  // States
  const [files, setFiles] = useState({ shopify: null, ads: null, supplier: null });
  const [data, setData] = useState({ shopify: [], ads: [], supplier: [] });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  
  const [results, setResults] = useState(null);
  const [showPirateTrap, setShowPirateTrap] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('nexus_license') === 'FREE-PIRATE-ACCOUNT' || verifyToolAccess('ecommatch')) {
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
    }
  };

  const handleFileUpload = (type, e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFiles(prev => ({ ...prev, [type]: uploadedFile }));
    
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setData(prev => ({ ...prev, [type]: res.data }));
      }
    });
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); 
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  };

  // Helper to safely parse currency strings like "$1,234.50" to float
  const parseCurrency = (val) => {
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.-]+/g, "");
    return parseFloat(clean) || 0;
  };

  const processGodMode = () => {
    if (!data.shopify.length) {
      alert("Shopify data is required at minimum to calculate profit.");
      return;
    }
    
    setIsProcessing(true);
    
    // AI Theater Sequence
    const stages = [
      { msg: 'Air-gapping local workspace...', time: 500 },
      { msg: 'Ingesting Shopify Revenue Streams...', time: 1200 },
      { msg: 'Cross-referencing Ad Spends...', time: 2000 },
      { msg: 'Calculating Supplier COGS...', time: 2800 },
      { msg: 'Isolating Hidden Fees & Margins...', time: 3600 },
      { msg: 'Compiling God Mode Terminal...', time: 4200 }
    ];

    stages.forEach(({msg, time}) => {
      setTimeout(() => setProcessingStage(msg), time);
    });

    setTimeout(() => {
      // 1. Calculate Shopify Total Revenue
      let totalRevenue = 0;
      let totalOrders = 0;
      let totalRefunds = 0;
      
      // Auto-detect columns
      const shopifyCols = data.shopify.length > 0 ? Object.keys(data.shopify[0]).map(c => c.toLowerCase()) : [];
      const totalCol = shopifyCols.find(c => c.includes('total') && !c.includes('tax')) || Object.keys(data.shopify[0] || {})[0];
      
      data.shopify.forEach(row => {
        const rowKeys = Object.keys(row);
        const actualTotalCol = rowKeys.find(k => k.toLowerCase() === totalCol);
        if (actualTotalCol && row[actualTotalCol]) {
          const val = parseCurrency(row[actualTotalCol]);
          if (val > 0) {
            totalRevenue += val;
            totalOrders++;
          } else if (val < 0) {
            totalRefunds += Math.abs(val);
          }
        }
      });

      // 2. Calculate Ad Spend
      let totalAdSpend = 0;
      if (data.ads.length > 0) {
        const adsCols = Object.keys(data.ads[0]).map(c => c.toLowerCase());
        const spendCol = adsCols.find(c => c.includes('spend') || c.includes('amount')) || Object.keys(data.ads[0])[0];
        
        data.ads.forEach(row => {
          const actualSpendCol = Object.keys(row).find(k => k.toLowerCase() === spendCol);
          if (actualSpendCol && row[actualSpendCol]) {
            totalAdSpend += parseCurrency(row[actualSpendCol]);
          }
        });
      }

      // 3. Calculate COGS
      let totalCOGS = 0;
      if (data.supplier.length > 0) {
        const supCols = Object.keys(data.supplier[0]).map(c => c.toLowerCase());
        const costCol = supCols.find(c => c.includes('cost') || c.includes('amount') || c.includes('total')) || Object.keys(data.supplier[0])[0];
        
        data.supplier.forEach(row => {
          const actualCostCol = Object.keys(row).find(k => k.toLowerCase() === costCol);
          if (actualCostCol && row[actualCostCol]) {
            totalCOGS += parseCurrency(row[actualCostCol]);
          }
        });
      } else {
        // Fallback: estimate COGS as 30% of revenue if no file provided
        totalCOGS = totalRevenue * 0.30;
      }

      // 4. Calculate Hidden Fees (Stripe/Shopify Payments usually ~2.9% + $0.30 per transaction)
      const gatewayFees = (totalRevenue * 0.029) + (totalOrders * 0.30);
      
      // 5. Final Metrics
      const trueNetProfit = totalRevenue - totalRefunds - totalAdSpend - totalCOGS - gatewayFees;
      const marginPercent = totalRevenue > 0 ? (trueNetProfit / totalRevenue) * 100 : 0;
      const trueROAS = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;

      setResults({
        totalRevenue,
        totalOrders,
        totalRefunds,
        totalAdSpend,
        totalCOGS,
        gatewayFees,
        trueNetProfit,
        marginPercent,
        trueROAS
      });

      setIsProcessing(false);
      setProcessingStage('');
      playSuccessSound();
    }, 4500);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-teal-900/10 to-transparent -z-10 pointer-events-none" />
      
      {isUnlocked && (
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                <Activity className="text-teal-400" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3 font-sans">
                  Nexus EcomMatch 2.0
                  <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-md border border-teal-500/30">GOD MODE</span>
                </h1>
                <p className="text-teal-500/70 text-sm font-sans tracking-wide">Financial Terminal & True Profit Arbitrage</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-teal-400 text-sm bg-black px-4 py-2 rounded-full border border-teal-500/30">
                <ShieldCheck size={14} />
                <span>The Vault: Air-Gapped Local Processing</span>
              </div>
              
              <button 
                onClick={handleInstallApp}
                className="flex items-center gap-2 bg-teal-500 text-black font-bold text-sm px-4 py-2 rounded-full hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:scale-105"
                title="Install Desktop Terminal"
              >
                <HardDriveDownload size={16} />
                Install Terminal
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_2.5fr] gap-6">
            
            {/* Left Column: Input Forge */}
            <div className="flex flex-col gap-4">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-teal-500/30 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50"></div>
                <h2 className="text-sm text-teal-400 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                  <DollarSign size={16} /> 1. Shopify Revenue
                </h2>
                {!files.shopify ? (
                  <button onClick={() => shopifyRef.current.click()} className="w-full py-6 border-2 border-dashed border-white/10 hover:border-teal-500/50 rounded-xl text-gray-500 hover:text-teal-400 transition-all flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-teal-500/5">
                    <Upload size={20} /> <span className="text-xs">Upload Orders CSV</span>
                  </button>
                ) : (
                  <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-teal-300 truncate max-w-[150px]">{files.shopify.name}</span>
                    <span className="text-[10px] text-teal-500 bg-teal-950 px-2 py-1 rounded">{data.shopify.length} rows</span>
                  </div>
                )}
                <input type="file" accept=".csv" className="hidden" ref={shopifyRef} onChange={(e) => handleFileUpload('shopify', e)} />
              </div>

              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                <h2 className="text-sm text-blue-400 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Activity size={16} /> 2. Ad Spend (Meta/TikTok)
                </h2>
                {!files.ads ? (
                  <button onClick={() => adsRef.current.click()} className="w-full py-6 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-xl text-gray-500 hover:text-blue-400 transition-all flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-blue-500/5">
                    <Upload size={20} /> <span className="text-xs">Upload Ad Reports CSV</span>
                  </button>
                ) : (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-blue-300 truncate max-w-[150px]">{files.ads.name}</span>
                    <span className="text-[10px] text-blue-500 bg-blue-950 px-2 py-1 rounded">{data.ads.length} rows</span>
                  </div>
                )}
                <input type="file" accept=".csv" className="hidden" ref={adsRef} onChange={(e) => handleFileUpload('ads', e)} />
              </div>

              <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>
                <h2 className="text-sm text-orange-400 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Box size={16} /> 3. Supplier COGS
                </h2>
                {!files.supplier ? (
                  <button onClick={() => supplierRef.current.click()} className="w-full py-6 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-xl text-gray-500 hover:text-orange-400 transition-all flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-orange-500/5">
                    <Upload size={20} /> <span className="text-xs">Upload Supplier CSV (Opt)</span>
                  </button>
                ) : (
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-xs text-orange-300 truncate max-w-[150px]">{files.supplier.name}</span>
                    <span className="text-[10px] text-orange-500 bg-orange-950 px-2 py-1 rounded">{data.supplier.length} rows</span>
                  </div>
                )}
                <input type="file" accept=".csv" className="hidden" ref={supplierRef} onChange={(e) => handleFileUpload('supplier', e)} />
              </div>

              <button 
                onClick={processGodMode}
                disabled={!files.shopify || isProcessing}
                className="w-full mt-4 bg-teal-500 hover:bg-teal-400 text-black font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all disabled:opacity-30 flex justify-center items-center gap-2 uppercase tracking-widest text-sm"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <RefreshCcw size={16} className="animate-spin" />
                    {processingStage}
                  </div>
                ) : 'Engage God Mode'}
              </button>
            </div>

            {/* Right Column: Terminal HUD */}
            <div className="w-full h-[700px]">
              {results ? (
                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl h-full p-6 flex flex-col relative overflow-hidden shadow-2xl">
                  {/* Decorative Terminal elements */}
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                  <div className="absolute bottom-4 right-6 text-[10px] text-white/10 font-mono select-none pointer-events-none">SYS.TERMINAL.v2.4.1 // ONLINE</div>
                  
                  <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h3 className="text-lg text-white font-bold flex items-center gap-2 uppercase tracking-widest">
                      <Activity className="text-teal-500" size={18}/> Financial Overview
                    </h3>
                    <div className="text-xs text-teal-500/70 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                      Real-time Local Processing
                    </div>
                  </div>

                  {/* Top KPIs */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Gross Revenue</p>
                      <p className="text-2xl text-white font-bold tracking-tight">{formatMoney(results.totalRevenue)}</p>
                      <p className="text-[10px] text-gray-500 mt-2">{results.totalOrders} Orders Detected</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Ad Spend</p>
                      <p className="text-2xl text-blue-400 font-bold tracking-tight">{formatMoney(results.totalAdSpend)}</p>
                      <p className="text-[10px] text-gray-500 mt-2">Marketing Drain</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Supplier COGS</p>
                      <p className="text-2xl text-orange-400 font-bold tracking-tight">{formatMoney(results.totalCOGS)}</p>
                      <p className="text-[10px] text-gray-500 mt-2">{files.supplier ? 'Exact Match' : 'Estimated at 30%'}</p>
                    </div>
                  </div>

                  {/* The God Mode Result */}
                  <div className={`rounded-2xl p-8 relative overflow-hidden border ${results.trueNetProfit >= 0 ? 'bg-gradient-to-br from-teal-900/40 to-black border-teal-500/50' : 'bg-gradient-to-br from-red-900/40 to-black border-red-500/50'}`}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${results.trueNetProfit >= 0 ? 'text-teal-400' : 'text-red-400'}`}>True Net Profit</p>
                        <p className="text-6xl font-bold text-white tracking-tighter shadow-black drop-shadow-lg">
                          {formatMoney(results.trueNetProfit)}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">True ROAS</p>
                          <p className={`text-xl font-bold ${results.trueROAS > 2 ? 'text-teal-400' : 'text-red-400'}`}>{results.trueROAS.toFixed(2)}x</p>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Net Margin</p>
                          <p className={`text-xl font-bold ${results.marginPercent > 20 ? 'text-teal-400' : 'text-yellow-400'}`}>{results.marginPercent.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Margin Killers Section */}
                  <div className="mt-8 flex-1">
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-yellow-500"/> Hidden Margin Killers Detected
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-black border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center">
                            <Percent size={14} className="text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Payment Gateway Fees</p>
                            <p className="text-[10px] text-gray-500">Stripe/Shopify Payments (2.9% + 30¢)</p>
                          </div>
                        </div>
                        <p className="text-red-400 font-bold">-{formatMoney(results.gatewayFees)}</p>
                      </div>
                      
                      <div className="bg-black border border-white/5 rounded-lg p-4 flex justify-between items-center group hover:border-red-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center">
                            <TrendingDown size={14} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Refunds & Chargebacks</p>
                            <p className="text-[10px] text-gray-500">Detected in Shopify export</p>
                          </div>
                        </div>
                        <p className="text-red-400 font-bold">-{formatMoney(results.totalRefunds)}</p>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-black/40 border border-white/5 rounded-3xl h-full flex flex-col items-center justify-center text-center opacity-30">
                  <Box size={64} className="text-teal-900 mb-6" />
                  <h3 className="text-xl font-mono uppercase tracking-widest mb-2">Terminal Standby</h3>
                  <p className="text-gray-500 max-w-sm font-sans text-sm">Upload your operational CSVs on the left and engage God Mode to reveal true profitability.</p>
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
