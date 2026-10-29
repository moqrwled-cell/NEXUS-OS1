import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  Laptop, 
  ArrowRight,
  Sparkles,
  QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const easeOut = [0.23, 1, 0.32, 1];
const easeInOut = [0.77, 0, 0.175, 1];

// Realistic jagged tear-tooth geometry at the bottom of the receipt paper
const receiptToothCount = 38;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;
    return `${x}% ${y}`;
  }
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

// Stepped mechanical printer paper feed keyframes
const printingTransformKeyframes = [
  "translateY(calc(-100% + 4px))",
  "translateY(-90%)",
  "translateY(-90%)",
  "translateY(-78%)",
  "translateY(-78%)",
  "translateY(-65%)",
  "translateY(-65%)",
  "translateY(-50%)",
  "translateY(-50%)",
  "translateY(-35%)",
  "translateY(-35%)",
  "translateY(-20%)",
  "translateY(-20%)",
  "translateY(-8%)",
  "translateY(-8%)",
  "translateY(0%)",
];

const printingKeyframeTimes = [
  0, 0.08, 0.12, 0.20, 0.24, 0.32, 0.36, 0.44, 0.48, 0.56, 0.60, 0.68, 0.72, 0.82, 0.86, 1
];

export default function NexusReceiptPrinter({
  licenseData,
  orderId,
  deviceFp,
  planTier = 'solo',
  onLaunchStudio,
  onDownloadBundle
}) {
  const [stage, setStage] = useState('processing'); // 'processing' | 'printing' | 'complete'
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    // Stage 1: Processing verification (1000ms)
    const t1 = setTimeout(() => {
      setStage('printing');
    }, 1100);

    // Stage 2: Stepped mechanical printing (2200ms)
    const t2 = setTimeout(() => {
      setStage('complete');
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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
        role: 'Master Admin Seat',
        key: licenseData?.primaryKey || 'CG-LICENSE-KEY'
      }
    ];
  }, [licenseData?.seats, licenseData?.primaryKey]);

  // Static timestamp frozen to activation instant or initial receipt print
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

  // Memoized immutable QR barcode payload to prevent render flickering
  const qrPayload = useMemo(() => {
    const key = licenseData?.primaryKey || 'PENDING-KEY';
    const id = orderId || 'ORD-578465';
    const tier = planTier || 'solo';
    return `NEXUS-LICENSE:${id}:${tier}:${key}`;
  }, [orderId, planTier, licenseData?.primaryKey]);

  return (
    <div className="w-full flex flex-col items-center select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. THERMAL PRINTER MACHINE CHASSIS                                        */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#111922] via-[#0b1016] to-[#060a0e] p-4 pt-5 pb-7 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] z-20">
        
        {/* Top Control Panel: Indicator LEDs & Brand */}
        <div className="flex items-center justify-between mb-3.5 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-300 font-bold">
              Nexus PrintMatrix™ 400
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-400 bg-black/40 px-2 py-0.5 rounded-full border border-zinc-800">
            <span>Air-Gapped Local Dispenser</span>
          </div>
        </div>

        {/* Digital LCD Status Screen */}
        <div className="relative rounded-2xl border border-zinc-800/90 bg-[#04080c] p-3 text-white shadow-inner shadow-black/80 mb-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative grid size-5 place-items-center">
                {stage === 'complete' ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <Loader2 size={16} className="text-cyan-400 animate-spin" />
                )}
              </span>
              <div>
                <p className="font-mono text-xs font-bold text-white tracking-wide">
                  {stage === 'processing' && 'CRYPTOGRAPHIC HARDWARE HANDSHAKE...'}
                  {stage === 'printing' && 'DISPENSING AIR-GAPPED LICENSE...'}
                  {stage === 'complete' && 'LICENSE BOUND & WORKSTATION ACTIVATED'}
                </p>
                <p className="font-mono text-[10px] text-zinc-400">
                  {stage === 'processing' && 'Binding SHA-256 fingerprint to device RAM'}
                  {stage === 'printing' && 'Stepped thermal ejection in progress'}
                  {stage === 'complete' && `Verified Order: ${orderId}`}
                </p>
              </div>
            </div>

            <div className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/60 text-zinc-300">
              {stage === 'complete' ? 'READY' : 'BUSY'}
            </div>
          </div>
        </div>

        {/* Physical Paper Ejection Slot */}
        <div className="relative mx-3 h-3 rounded-full bg-black border border-zinc-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
          <div className="w-4/5 h-[1.5px] bg-zinc-700/40 rounded-full" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PHYSICAL RECEIPT PAPER (FEEDING OUT OF SLOT)                           */}
      {/* ========================================================================= */}
      <div className="relative z-10 -mt-2 w-full max-w-[390px] overflow-hidden px-2 pb-8">
        
        {/* Soft shadow cast by printer chassis onto the paper */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-x-4 top-0 z-30 h-3 bg-gradient-to-b from-black/60 to-transparent blur-[2px]" 
        />

        <motion.div
          animate={{
            transform:
              stage === 'printing'
                ? printingTransformKeyframes
                : stage === 'complete'
                ? 'translateY(0%)'
                : 'translateY(calc(-100% + 4px))',
            opacity: stage === 'processing' ? 0.3 : 1
          }}
          transition={{
            transform: {
              duration: 2.2,
              ease: 'linear',
              times: printingKeyframeTimes
            },
            opacity: { duration: 0.2 }
          }}
          className="origin-top"
        >
          <article
            style={{ clipPath: receiptClipPath }}
            className="relative bg-[#FAFAFA] text-zinc-900 font-mono p-5 pt-6 pb-9 shadow-[0_20px_40px_rgba(0,0,0,0.45)] border-x border-zinc-300/80 select-text"
          >
            {/* Thermal paper subtle noise & watermarks */}
            <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-400/80 uppercase tracking-widest pointer-events-none border border-zinc-300/80 px-1 rounded">
              ORIGINAL CUSTOMER COPY
            </div>

            {/* Receipt Header */}
            <div className="text-center pb-3 border-b border-dashed border-zinc-400">
              <h2 className="text-sm font-black tracking-tight text-zinc-950 uppercase font-sans">
                Nexus ContractGuard™
              </h2>
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                Air-Gapped Legal Studio · Version 2.4
              </p>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                Whop Merchant of Record · Tax & Settlement Confirmed
              </p>
            </div>

            {/* Transaction Metadata Table */}
            <div className="py-2.5 border-b border-dashed border-zinc-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-600">ORDER NO:</span>
                <span className="font-bold text-zinc-950">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">DATE & TIME:</span>
                <span className="text-zinc-900">{currentDate} {currentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">LICENSE TIER:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {planTier === 'firm' ? 'Law Firm Suite ($299)' : 'Solo Practitioner ($199)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">DURATION:</span>
                <span className="font-bold text-zinc-900">PERPETUAL LIFETIME ACCESS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">TOTAL PAID:</span>
                <span className="font-bold text-zinc-950">
                  {planTier === 'firm' ? '$299.00 USD' : '$199.00 USD'}
                </span>
              </div>
            </div>

            {/* Hardware Binding Section */}
            <div className="py-2.5 border-b border-dashed border-zinc-400 text-[10.5px]">
              <span className="text-zinc-600 block text-[10px] uppercase font-bold tracking-wider">
                Hardware Device Binding:
              </span>
              <p className="text-zinc-800 break-all font-mono text-[9.5px] mt-0.5 bg-zinc-200/70 p-1 rounded border border-zinc-300">
                {deviceFp || 'SHA256: HARDWARE-LOCKED-TERMINAL-01'}
              </p>
              <p className="text-[9px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck size={11} /> 100% Client-Side Cryptographic Lock Activated
              </p>
            </div>

            {/* Cryptographic License Key(s) Block */}
            <div className="py-3 border-b border-dashed border-zinc-400">
              <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
                Cryptographic Key Allocation:
              </span>

              <div className="space-y-2">
                {seats.map((seat, idx) => (
                  <div key={idx} className="p-2 rounded bg-zinc-100 border border-zinc-300 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">
                        Seat {seat.seatNumber}: {seat.role}
                      </p>
                      <p className="font-mono text-xs font-bold text-zinc-950 tracking-wider truncate select-all">
                        {seat.key}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(seat.key, `seat-${idx}`)}
                      className="px-2 py-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
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
                ))}
              </div>
            </div>

            {/* QR Code & Barcode Verification */}
            <div className="py-3 border-b border-dashed border-zinc-400 flex items-center justify-between gap-3">
              <div className="text-[9.5px] leading-tight text-zinc-600">
                <p className="font-bold text-zinc-900">VERIFICATION PASSPORT</p>
                <p className="mt-0.5">Scan to verify cryptographic license signature or transfer key.</p>
                <p className="text-[8.5px] text-zinc-400 mt-1 font-mono">ABA Model Rule 1.6 Certified</p>
              </div>

              <div className="p-1 bg-white border border-zinc-300 rounded shrink-0 shadow-sm">
                <QRCodeSVG 
                  value={qrPayload}
                  size={58}
                  level="M"
                />
              </div>
            </div>

            {/* Actions Directly On Receipt */}
            <div className="pt-3.5 flex flex-col gap-2">
              <button
                type="button"
                onClick={onLaunchStudio}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Launch ContractGuard Studio</span>
                <ArrowRight size={13} />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onDownloadBundle}
                  className="py-1.5 px-2 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Download size={11} />
                  <span>Download .txt</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-1.5 px-2 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer size={11} />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Thermal Print Tail */}
            <div className="mt-4 text-center text-[9px] text-zinc-400 font-mono tracking-widest">
              *** END OF DIGITAL RECEIPT ***
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
