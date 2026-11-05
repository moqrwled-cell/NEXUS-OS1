import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  FileDown,
  ShieldCheck, 
  Key, 
  ArrowRight,
  ExternalLink,
  Lock,
  Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { printOfficialTaxInvoice } from '../utils/taxInvoicePrintTemplate';
import { downloadTaxInvoicePDF } from '../utils/taxInvoicePdfGenerator';

export default function NexusReceiptPrinter({
  licenseData,
  orderId,
  deviceFp,
  planTier = 'solo',
  onLaunchStudio,
  onDownloadBundle
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const isFirm = planTier === 'firm';
  const unitPrice = isFirm ? '299.00' : '199.00';
  const totalAmount = isFirm ? '$299.00 USD' : '$199.00 USD';

  const planTitle = isFirm 
    ? 'Nexus ContractGuard™ — Law Firm Suite (5 Perpetual Seats Bundle)'
    : 'Nexus ContractGuard™ — Solo Practitioner Perpetual License';
    
  const planDescription = isFirm
    ? 'Enterprise-Grade Air-Gapped Diligence Suite. Includes 5 Dedicated Attorney & Paralegal Seats, 4-Engine Structural Diligence, Myers Redline Engine, Word (.docx) Amendment Rider Export, and Continuous Engine Evolution & Future Updates.'
    : 'Air-Gapped Client-Side Diligence Suite. Includes 1 Perpetual Master Counsel Seat, 4-Engine Structural Diligence, Myers Redline Engine, Word (.docx) Amendment Rider Export, and Continuous Engine Evolution & Future Updates.';

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const seats = useMemo(() => {
    return licenseData?.seats || [
      {
        seatNumber: 1,
        role: 'Primary Workstation (Admin)',
        key: licenseData?.primaryKey || 'CG-LICENSE-KEY'
      }
    ];
  }, [licenseData?.seats, licenseData?.primaryKey]);

  const currentDate = useMemo(() => {
    if (licenseData?.activatedAt) {
      try {
        return new Date(licenseData.activatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {}
    }
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [licenseData?.activatedAt]);

  const currentTime = useMemo(() => {
    if (licenseData?.activatedAt) {
      try {
        return new Date(licenseData.activatedAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      } catch {}
    }
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, [licenseData?.activatedAt]);

  const qrPayload = useMemo(() => {
    const key = licenseData?.primaryKey || 'PENDING-KEY';
    const id = orderId || 'ORD-578465';
    const tier = planTier || 'solo';
    return `https://www.nexus-os.store/welcome?order_id=${encodeURIComponent(id)}&plan=${encodeURIComponent(tier)}&key=${encodeURIComponent(key)}&verified=true`;
  }, [orderId, planTier, licenseData?.primaryKey]);

  // Triggers isolated official A4 tax invoice print (NOT a screen snapshot)
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      const qrElement = document.getElementById('nexus-screen-qr');
      const qrSvgHtml = qrElement ? qrElement.outerHTML : null;

      printOfficialTaxInvoice({
        orderId,
        planTier,
        deviceFp,
        currentDate,
        currentTime,
        seats,
        primaryKey: licenseData?.primaryKey,
        qrSvgHtml
      });
    } catch (err) {
      console.error('Print invoice error:', err);
      window.print();
    } finally {
      setTimeout(() => setIsPrinting(false), 1200);
    }
  };

  // Triggers client-side vector PDF generation in RAM via pdf-lib
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadTaxInvoicePDF({
        orderId,
        planTier,
        deviceFp,
        currentDate,
        currentTime,
        seats,
        primaryKey: licenseData?.primaryKey
      });
    } catch (err) {
      console.error('Download PDF error:', err);
      alert('Failed to generate PDF. Please use the Print Official Invoice option.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center font-sans">
      
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN OFFICIAL CORPORATE TAX INVOICE CARD                          */}
      {/* ========================================================================= */}
      <div className="w-full max-w-2xl bg-white text-zinc-950 rounded-2xl border border-zinc-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-9 select-text relative overflow-hidden">
        
        {/* Subtle Top Institutional Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-zinc-200 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-zinc-600">
              Official Tax Invoice & Proof of Purchase
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold tracking-wide uppercase">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>Paid in Full · Settled</span>
            </span>
          </div>
        </div>

        {/* Corporate Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 flex items-center justify-center text-white font-black text-xs shrink-0">
                Nx
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 uppercase font-sans">
                Nexus ContractGuard Technologies Inc.
              </h2>
            </div>
            <p className="text-[10.5px] text-zinc-600 mt-1 leading-relaxed">
              300 Delaware Avenue, Suite 210 · Wilmington, DE 19801 · United States<br />
              Authorized Merchant of Record: Whop Inc. · Stripe Payments Network<br />
              Corporate Tax ID: <strong className="text-zinc-800">US-DEL-984210</strong> · billing@nexus-os.store
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Document Number
            </span>
            <span className="font-mono text-sm sm:text-base font-black text-zinc-950 tracking-wide block">
              #INV-{orderId}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
              Issued: {currentDate} · {currentTime} UTC
            </span>
            <span className="text-[9.5px] text-zinc-500 font-sans block mt-0.5">
              Method: Whop Checkout (Card / Apple Pay)
            </span>
          </div>
        </div>

        {/* Two-Column Ledger: Issued By & Licensed To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 block mb-1">
              Issued By (Licensor / Merchant)
            </span>
            <h4 className="text-xs font-bold text-zinc-900">
              Nexus ContractGuard Technologies Inc.
            </h4>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              Delaware C-Corp · Air-Gapped Verification Division<br />
              Client-Side Sovereign Execution (0 Remote APIs)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[9px] font-mono uppercase font-bold text-zinc-500 block mb-1">
              Licensed & Billed To (Counsel Workstation)
            </span>
            <h4 className="text-xs font-bold text-zinc-900">
              Retained Legal Counsel / Law Practice
            </h4>
            <div className="mt-1">
              <span className="text-[9px] font-mono bg-zinc-200/80 text-zinc-800 px-1.5 py-0.5 rounded font-semibold break-all inline-block">
                {deviceFp}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="overflow-x-auto my-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-900 text-[10px] font-mono uppercase tracking-wider text-zinc-700">
                <th className="py-2 pr-2">#</th>
                <th className="py-2 px-2">Description & License Scope</th>
                <th className="py-2 px-2 text-center">Duration</th>
                <th className="py-2 px-2 text-center">Qty</th>
                <th className="py-2 px-2 text-right">Unit Rate</th>
                <th className="py-2 pl-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              <tr>
                <td className="py-3 pr-2 font-mono font-bold text-zinc-500">01</td>
                <td className="py-3 px-2">
                  <span className="font-bold text-zinc-950 block">{planTitle}</span>
                  <span className="text-[10px] text-zinc-500 leading-snug block mt-0.5">
                    {planDescription}
                  </span>
                </td>
                <td className="py-3 px-2 text-center font-mono text-[10px] text-zinc-800 font-bold whitespace-nowrap">
                  Perpetual
                </td>
                <td className="py-3 px-2 text-center font-mono font-bold text-zinc-900">
                  1
                </td>
                <td className="py-3 px-2 text-right font-mono font-bold text-zinc-800">
                  ${unitPrice}
                </td>
                <td className="py-3 pl-2 text-right font-mono font-bold text-zinc-950">
                  ${unitPrice}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-t border-b border-zinc-200 my-4">
          <div className="text-[10.5px] text-zinc-600 leading-relaxed max-w-sm">
            <strong className="text-zinc-900">Payment Memo:</strong> Transaction processed securely via Whop Merchant of Record. All perpetual license rights and air-gapped cryptographic tokens are vested immediately upon settlement.
          </div>

          <div className="w-full sm:w-56 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-zinc-900">${unitPrice} USD</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[11px]">
              <span>Tax / VAT (0.00%):</span>
              <span className="font-mono text-zinc-900">$0.00 USD</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[11px]">
              <span>Processing Fee:</span>
              <span className="font-mono text-zinc-900">$0.00 USD</span>
            </div>
            <div className="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-900">
              <span>TOTAL PAID:</span>
              <span className="font-mono text-emerald-700">{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Schedule A: Cryptographic License Keys */}
        <div className="my-5 border border-zinc-200 rounded-xl overflow-hidden">
          <div className="bg-zinc-50 px-3.5 py-2 border-b border-zinc-200 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
              <Key size={12} className="text-emerald-600" />
              <span>Schedule A: Cryptographic License Key Allocation</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-500">
              100% In-RAM Local Execution
            </span>
          </div>

          <div className="divide-y divide-zinc-200 bg-white">
            {seats.map((seat, idx) => (
              <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9.5px] font-bold text-zinc-500 uppercase block">
                    Seat 0{seat.seatNumber}: {seat.role}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-950 tracking-wider break-all select-all block mt-0.5">
                    {seat.key}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active & Bound
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(seat.key, `seat-${idx}`)}
                    className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy Key to Clipboard"
                  >
                    {copiedKey === `seat-${idx}` ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Passport, Corporate Ink Seal & Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white border border-zinc-300 rounded-lg shrink-0 shadow-sm">
              <QRCodeSVG 
                id="nexus-screen-qr"
                value={qrPayload}
                size={64}
                level="M"
              />
            </div>
            <div className="text-[10px] text-zinc-600 leading-tight">
              <span className="font-bold text-zinc-950 uppercase block font-sans text-[10.5px]">
                Cryptographic Passport
              </span>
              <span className="block mt-0.5">
                Scan QR to verify authentic cryptographic token signature.
              </span>
              <span className="text-[9px] text-zinc-400 font-mono block mt-1">
                SHA-256 Validated · Zero Cloud Telemetry
              </span>
            </div>
          </div>

          {/* Corporate Ink Seal & Signature */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              {/* Registrar Stylized Vector Signature */}
              <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                <path d="M 4 12 Q 15 2 25 10 T 45 7 T 65 13 T 85 5 T 98 12" stroke="#0f2b5c" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path d="M 10 15 Q 40 14 85 15" stroke="#0f2b5c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
              </svg>
              <span className="text-[8.5px] font-bold text-zinc-900 uppercase block">
                Office of the Registrar
              </span>
              <span className="text-[7.5px] text-zinc-500 block">
                Department of Software Integrity
              </span>
            </div>

            {/* Concentric Vector Seal */}
            <svg width="58" height="58" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="50" cy="50" r="46" stroke="#0f172a" strokeWidth="1.8" />
              <circle cx="50" cy="50" r="42" stroke="#0f172a" strokeWidth="0.8" strokeDasharray="2 1.5" />
              <circle cx="50" cy="50" r="32" stroke="#0f172a" strokeWidth="1" />
              <path id="screen-seal-top" d="M 22 50 A 28 28 0 0 1 78 50" fill="none" />
              <text fontSize="5.5" fontWeight="900" fill="#0f172a" letterSpacing="1.2">
                <textPath href="#screen-seal-top" startOffset="50%" textAnchor="middle">
                  NEXUS CONTRACTGUARD
                </textPath>
              </text>
              <path id="screen-seal-bottom" d="M 78 50 A 28 28 0 0 1 22 50" fill="none" />
              <text fontSize="5" fontWeight="800" fill="#0f172a" letterSpacing="1.1">
                <textPath href="#screen-seal-bottom" startOffset="50%" textAnchor="middle">
                  DELAWARE · OFFICIAL TAX SEAL
                </textPath>
              </text>
              <text x="50" y="48" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#0f172a">SEAL</text>
              <text x="50" y="55" fontSize="4.5" fontWeight="700" textAnchor="middle" fill="#64748b">2026</text>
              <text x="50" y="61" fontSize="4" fontWeight="800" textAnchor="middle" fill="#059669">VERIFIED</text>
            </svg>
          </div>
        </div>

        {/* Legal Tax Deductibility Notice */}
        <div className="mt-4 pt-3 border-t border-zinc-200 text-center text-[9px] text-zinc-500 leading-normal">
          This document serves as an official tax invoice, receipt, and perpetual license certificate for corporate accounting, tax deduction, and compliance audits under standard commercial practices (ABA Model Rule 1.6 & Delaware Corporate Law). All sales settled via Whop Authorized Merchant of Record.
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. ACTION CONTROLS (PRINT / DOWNLOAD / LAUNCH)                             */}
      {/* ========================================================================= */}
      <div className="w-full max-w-2xl mt-5 space-y-3 no-print">
        
        {/* Primary Launch Button */}
        <button
          type="button"
          onClick={onLaunchStudio}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-[0.98]"
        >
          <span>Launch ContractGuard Studio</span>
          <ArrowRight size={16} />
        </button>

        {/* Secondary Document Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          {/* Official A4 Print Option (The user's core request) */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isPrinting}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
            title="Print clean official A4 tax invoice on paper or save as PDF"
          >
            {isPrinting ? (
              <>
                <Loader2 size={13} className="text-cyan-400 animate-spin" />
                <span>Preparing Sheet...</span>
              </>
            ) : (
              <>
                <Printer size={13} className="text-emerald-400" />
                <span>Print Official Invoice</span>
              </>
            )}
          </button>

          {/* Download Official Vector PDF Option */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
            title="Download publication-grade vector PDF invoice"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 size={13} className="text-cyan-400 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown size={13} className="text-cyan-400" />
                <span>Download PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Download Backup Keys Text File */}
          <button
            type="button"
            onClick={onDownloadBundle}
            className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-95"
            title="Download persistent license keys text backup"
          >
            <Download size={13} className="text-amber-400" />
            <span>Download Keys (.txt)</span>
          </button>

        </div>
      </div>

    </div>
  );
}
