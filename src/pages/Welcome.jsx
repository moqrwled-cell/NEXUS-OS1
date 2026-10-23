import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Monitor, 
  Copy, 
  Check, 
  Download, 
  ArrowRight, 
  Key, 
  ShieldAlert,
  Mail
} from 'lucide-react';
import { 
  getDeviceFingerprint, 
  generateLicenseKeys, 
  activateLicenseOnDevice, 
  deactivateLicenseFromDevice,
  verifyDeviceLicense,
  bindKeyToCurrentDevice
} from '../utils/licenseManager';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planParam = searchParams.get('plan') || 'solo'; // 'solo' | 'firm'
  const sessionId = searchParams.get('session_id') || searchParams.get('order_id') || '';
  const orderId = searchParams.get('order_id') || searchParams.get('order') || `ORD-${Date.now().toString().slice(-6)}`;

  const [deviceFp, setDeviceFp] = useState('Detecting hardware...');
  const [isActivating, setIsActivating] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [licenseData, setLicenseData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isDeactivated, setIsDeactivated] = useState(false);
  
  // Manual key entry state for existing key holders
  const [manualKey, setManualKey] = useState('');
  const [manualError, setManualError] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  useEffect(() => {
    async function initActivation() {
      try {
        const fp = await getDeviceFingerprint();
        setDeviceFp(fp);

        // Case 1: Device is already activated with a valid license
        const existing = await verifyDeviceLicense();
        if (existing.isValid) {
          setLicenseData(existing);
          setIsActivating(false);
          setIsUnauthorized(false);
          return;
        }

        // Case 2: Multi-signal verification for Whop checkout completion:
        let validPurchase = false;
        let detectedPlan = planParam || 'solo';
        let detectedOrderId = orderId;

        // Signal A: Stored pending ticket in sessionStorage or localStorage
        const storedTicketRaw = sessionStorage.getItem('nexus_pending_checkout') || localStorage.getItem('nexus_pending_checkout');
        if (storedTicketRaw) {
          try {
            const ticket = JSON.parse(storedTicketRaw);
            // Accept ticket if fresh within 24 hours
            const isFresh = ticket.createdAt && (Date.now() - ticket.createdAt < 24 * 60 * 60 * 1000);
            if (isFresh) {
              validPurchase = true;
              if (ticket.plan) detectedPlan = ticket.plan;
              if (ticket.sessionId) detectedOrderId = ticket.sessionId;
              // Clean up once consumed
              try {
                sessionStorage.removeItem('nexus_pending_checkout');
                localStorage.removeItem('nexus_pending_checkout');
              } catch {
                // Ignore storage removal errors
              }
            }
          } catch {
            // Ignore corrupted JSON errors
          }
        }

        // Signal B: Whop URL indicators or status=success
        const hasWhopUrlParam = 
          searchParams.get('status') === 'success' ||
          searchParams.has('order_id') ||
          searchParams.has('order') ||
          searchParams.has('receipt_id') ||
          searchParams.has('checkout_id') ||
          searchParams.has('membership_id') ||
          searchParams.has('whop') ||
          (sessionId && sessionId.startsWith('whop_'));

        if (hasWhopUrlParam) {
          validPurchase = true;
          if (searchParams.get('plan')) detectedPlan = searchParams.get('plan');
          if (searchParams.get('order_id')) detectedOrderId = searchParams.get('order_id');
          else if (searchParams.get('receipt_id')) detectedOrderId = searchParams.get('receipt_id');
        }

        // Signal C: Whop Referrer check
        const isWhopReferrer = typeof document !== 'undefined' && 
          document.referrer && 
          document.referrer.toLowerCase().includes('whop.com');

        if (isWhopReferrer) {
          validPurchase = true;
        }

        // Signal D: Already verified flag in localStorage
        const isAlreadyVerified = localStorage.getItem('nexus_whop_verified') === 'true';
        if (isAlreadyVerified) {
          validPurchase = true;
        }

        // If no purchase detected and no active license, show verification options
        if (!validPurchase) {
          setIsUnauthorized(true);
          setIsActivating(false);
          return;
        }

        // Case 3: Legitimate verified purchase — generate keys and bind to this workstation
        const newKeys = generateLicenseKeys(detectedPlan, detectedOrderId);
        const activated = await activateLicenseOnDevice(newKeys);
        setLicenseData(activated);
        setIsActivating(false);
        setIsUnauthorized(false);

        // Notify opener window if running in popup checkout
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'NEXUS_LICENSE_ACTIVATED', plan: detectedPlan, orderId: detectedOrderId }, '*');
          } catch {
            // Ignore cross-origin popup errors
          }
        }
      } catch (err) {
        console.error('Activation failed:', err);
        setIsActivating(false);
        setIsUnauthorized(true);
      }
    }

    initActivation();
  }, [planParam, orderId, sessionId, searchParams]);

  // Handle manual license activation for users with a key
  const handleManualActivation = async (e) => {
    e.preventDefault();
    setManualError('');
    if (!manualKey.trim()) {
      setManualError('Please enter your license key.');
      return;
    }

    setManualLoading(true);
    try {
      const activated = await bindKeyToCurrentDevice(manualKey.trim());
      setLicenseData(activated);
      setIsUnauthorized(false);
      setManualLoading(false);
    } catch (err) {
      setManualLoading(false);
      setManualError(err.message || 'Invalid license key format.');
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadBundle = () => {
    if (!licenseData) return;
    let content = `========================================================\n`;
    content += `NEXUS CONTRACTGUARD™ ENTERPRISE - OFFICIAL LICENSE BUNDLE\n`;
    content += `========================================================\n\n`;
    content += `Order ID: ${orderId}\n`;
    content += `Plan: ${licenseData.tierName}\n`;
    content += `Activated Workstation Hardware ID: ${deviceFp}\n`;
    content += `Activation Date: ${new Date().toISOString()}\n\n`;
    content += `LICENSED WORKSTATION KEYS:\n`;
    content += `--------------------------------------------------------\n`;
    
    (licenseData.seats || []).forEach(seat => {
      content += `Seat ${seat.seatNumber}: ${seat.role}\n`;
      content += `Key: ${seat.key}\n`;
      content += `Status: ${seat.seatNumber === 1 ? 'BOUND TO THIS COMPUTER (Admin Workstation)' : 'AVAILABLE FOR TEAM ASSOCIATE'}\n\n`;
    });

    content += `HOW TO TRANSFER OR MIGRATE TO A NEW PC:\n`;
    content += `1. In ContractGuard Settings, click "Deactivate from this Machine".\n`;
    content += `2. Open ContractGuard on your new machine and paste your key.\n`;
    content += `3. The key will bind automatically to the new workstation hardware ID.\n\n`;
    content += `Enterprise Support Desk: nexus.os.store@gmail.com\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ContractGuard_License_${planParam.toUpperCase()}_${orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to release the license from this computer? You can then reactivate it on another computer.")) {
      const res = deactivateLicenseFromDevice();
      if (res && res.success) {
        setIsDeactivated(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020608] text-zinc-100 flex items-center justify-center p-4 md:p-8 font-sans antialiased selection:bg-nexus-emerald selection:text-black" dir="ltr">
      
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[130px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-2xl md:rounded-3xl border border-white/15 bg-[#060D12] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Top Chassis Bar */}
        <div className="px-5 py-3 bg-[#03070A] border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            <span className="ml-2 font-mono text-[11px] text-zinc-300">
              ContractGuard™ Hardware-Locked Licensing Engine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isUnauthorized ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`}></span>
            <span className={`font-mono text-[10px] font-semibold uppercase ${isUnauthorized ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isUnauthorized ? 'Verification Required' : 'Hardware Bound & Verified'}
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {isActivating && (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <h3 className="text-base font-bold text-white">Verifying Workstation Hardware...</h3>
            <p className="text-xs text-zinc-400 font-mono">Generating SHA-256 machine fingerprint and checking purchase status...</p>
          </div>
        )}

        {/* SECURITY GATE: UNAUTHORIZED / NO ACTIVE PURCHASE TICKET */}
        {!isActivating && isUnauthorized && (
          <div className="p-8 md:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <ShieldAlert size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold mb-3">
              <span>WORKSTATION ACTIVATION PORTAL</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              Workstation Activation Portal
            </h2>
            <p className="text-zinc-300 text-xs md:text-sm max-w-lg mb-6 leading-relaxed">
              To bind and authenticate this workstation, enter the cryptographic License Key sent to your purchase email below.
            </p>

            <div className="w-full max-w-md p-6 rounded-2xl bg-black/60 border border-zinc-800 text-left mb-6">
              <h4 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Key size={14} className="text-emerald-400" />
                <span>Enter Enterprise License Key</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mb-3">
                Enter your assigned license key (from your Whop purchase receipt or email):
              </p>

              {manualError && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {manualError}
                </div>
              )}

              <form onSubmit={handleManualActivation} className="space-y-3">
                <input
                  type="text"
                  required
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value.toUpperCase())}
                  placeholder="CG-SOLO-... or CG-FIRM-..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-white font-mono text-xs uppercase tracking-wider placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={manualLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {manualLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  <span>Activate Workstation</span>
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-all cursor-pointer"
              >
                ← Return to Nexus Home
              </button>
              <a
                href="mailto:nexus.os.store@gmail.com"
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Mail size={13} className="text-cyan-400" />
                <span>Contact Support (nexus.os.store@gmail.com)</span>
              </a>
            </div>
          </div>
        )}

        {/* ACTIVATED DASHBOARD: VERIFIED BUYER */}
        {!isActivating && !isUnauthorized && licenseData && (
          <div className="p-6 md:p-10">

            {/* Success Banner */}
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                Workstation Successfully Activated & Hardware-Bound!
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm max-w-lg leading-relaxed">
                Your license has been cryptographically bound to this physical workstation. All air-gapped forensic audit modules are unlocked.
              </p>
            </div>

            {/* Hardware Binding Spec Card */}
            <div className="p-4 md:p-5 rounded-2xl bg-black/50 border border-zinc-800 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                  <Monitor size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Workstation Hardware ID
                  </span>
                  <span className="text-xs md:text-sm font-mono font-bold text-white tracking-wide">
                    {deviceFp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                  {licenseData.tierName || 'ContractGuard License'}
                </span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
                  Perpetual · 0 Cloud
                </span>
              </div>
            </div>

            {/* SEAT KEYS SCHEDULE */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Key size={14} className="text-emerald-400" />
                  <span>Your Licensed Seat Key(s)</span>
                </h3>
                {licenseData.plan === 'firm' && (
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    5 Seats Allocated for Law Practice
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {(licenseData.seats || []).map((seat) => {
                  const isCurrentBound = seat.seatNumber === (licenseData.currentSeatNumber || 1);
                  return (
                    <div 
                      key={seat.seatNumber}
                      className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-all ${
                        isCurrentBound
                          ? 'bg-emerald-500/[0.08] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isCurrentBound ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          0{seat.seatNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{seat.role}</span>
                            {isCurrentBound && (
                              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                                Bound to This PC
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-zinc-300 text-xs block mt-0.5 tracking-wider select-all font-semibold">
                            {seat.key}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleCopy(seat.key, seat.seatNumber)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedKey === seat.seatNumber ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} className="text-zinc-400" />
                              <span>Copy Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backup & Persistence Notice */}
            <div className="p-3.5 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 text-xs text-zinc-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-white">Multi-Store Persistent Protection:</strong> Your license is preserved across deep browser storage. Save your backup text file to restore anytime if you ever clear browser history.
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadBundle}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <Download size={12} />
                <span>Save Backup (.txt)</span>
              </button>
            </div>

            {/* SEAMLESS 1-CLICK LAUNCH BUTTON (Requirement 5) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-[#08121A] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Ready to Begin Forensic Contract Review</span>
                </h4>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Your workstation token has been automatically synced. Click below to enter your fully unlocked studio.
                </p>
              </div>

              <button
                onClick={() => navigate('/app/contractcompare')}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Launch ContractGuard Studio</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* ACTION & MIGRATION CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadBundle}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} className="text-emerald-400" />
                  <span>Download License Bundle (.txt)</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeactivate}
                  className="text-xs text-amber-400/80 hover:text-amber-300 font-mono underline transition-colors cursor-pointer"
                  title="Unbind license from this computer so you can reactivate on another PC"
                >
                  Deactivate from this Machine (Migrate License)
                </button>
                <a
                  href="mailto:nexus.os.store@gmail.com"
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  nexus.os.store@gmail.com
                </a>
              </div>
            </div>

            {/* Migration Feedback */}
            {isDeactivated && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed">
                ✓ License successfully released from this workstation. You can now open ContractGuard on your new PC and paste your key to bind it to the new hardware.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
