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
  Users, 
  Key, 
  RefreshCw, 
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';
import { 
  getDeviceFingerprint, 
  generateLicenseKeys, 
  activateLicenseOnDevice, 
  deactivateLicenseFromDevice,
  verifyDeviceLicense
} from '../utils/licenseManager';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planParam = searchParams.get('plan') || 'solo'; // 'solo' | 'firm'
  const orderId = searchParams.get('order_id') || searchParams.get('order') || `ORD-${Date.now().toString().slice(-6)}`;

  const [deviceFp, setDeviceFp] = useState('Detecting hardware...');
  const [isActivating, setIsActivating] = useState(true);
  const [licenseData, setLicenseData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    async function initActivation() {
      try {
        const fp = await getDeviceFingerprint();
        setDeviceFp(fp);

        // Check if device already has a valid license or generate from checkout
        const existing = await verifyDeviceLicense();
        if (existing.isValid) {
          setLicenseData(existing);
          setIsActivating(false);
          return;
        }

        // Generate and activate new license
        const newKeys = generateLicenseKeys(planParam, orderId);
        const activated = await activateLicenseOnDevice(newKeys);
        setLicenseData(activated);
        setIsActivating(false);

        // Notify opener window if running in popup checkout
        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'NEXUS_LICENSE_ACTIVATED', plan: planParam, orderId }, '*');
          } catch (e) {
            // Ignore cross-origin popup errors
          }
        }
      } catch (err) {
        console.error('Activation failed:', err);
        setIsActivating(false);
      }
    }

    initActivation();
  }, [planParam, orderId]);

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
    content += `Activated Device: ${deviceFp}\n`;
    content += `Activation Date: ${new Date().toISOString()}\n\n`;
    content += `LICENSED WORKSTATION KEYS:\n`;
    content += `--------------------------------------------------------\n`;
    
    (licenseData.seats || []).forEach(seat => {
      content += `Seat ${seat.seatNumber}: ${seat.role}\n`;
      content += `Key: ${seat.key}\n`;
      content += `Status: ${seat.seatNumber === 1 ? 'BOUND TO THIS COMPUTER' : 'AVAILABLE FOR TEAM MEMBER'}\n\n`;
    });

    content += `HOW TO TRANSFER OR MIGRATE TO A NEW PC:\n`;
    content += `1. In ContractGuard settings, click "Deactivate from this Device".\n`;
    content += `2. Open ContractGuard on your new machine and paste the key.\n`;
    content += `3. The key will bind automatically to the new device hardware.\n`;

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
    <div className="min-h-screen bg-[#020608] text-zinc-100 flex items-center justify-center p-4 md:p-8 font-sans antialiased selection:bg-nexus-emerald selection:text-black">
      
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-nexus-emerald/15 blur-[130px] rounded-full pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl rounded-2xl md:rounded-3xl border border-white/15 bg-[#060D12] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Top Chassis Bar */}
        <div className="px-5 py-3 bg-[#03070A] border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            <span className="ml-2 font-mono text-[11px] text-zinc-300">
              ContractGuard™ Hardware License Provisioning
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nexus-emerald animate-ping"></span>
            <span className="font-mono text-[10px] text-nexus-emerald font-semibold uppercase">
              Cryptographic Binding Active
            </span>
          </div>
        </div>

        <div className="p-6 md:p-10">

          {/* Success Banner */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-nexus-emerald/10 border border-nexus-emerald/30 flex items-center justify-center text-nexus-emerald shadow-[0_0_30px_rgba(0,255,157,0.3)] mb-4">
              <CheckCircle2 size={36} />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {isDeactivated ? 'License Unbound Successfully' : 'License Verified & Bound to Hardware'}
            </h1>
            <p className="text-sm text-zinc-300 mt-2 max-w-lg leading-relaxed">
              {isDeactivated 
                ? 'This computer is no longer bound. You may now activate this license key on another device.'
                : `Your payment was processed successfully. ContractGuard Enterprise is now permanently activated on this machine.`
              }
            </p>
          </div>

          {/* Device & Plan Information Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              <Monitor size={18} className="text-nexus-cyan shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Workstation Hardware ID</span>
                <span className="text-zinc-200 font-bold">{deviceFp}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              <ShieldCheck size={18} className="text-nexus-emerald shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">Active License Tier</span>
                <span className="text-nexus-emerald font-bold">
                  {licenseData?.tierName || (planParam === 'firm' ? 'Law Firm Suite (5 Users)' : 'Solo Practitioner (1 User)')}
                </span>
              </div>
            </div>
          </div>

          {/* License Keys Presentation */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Key size={14} className="text-amber-400" />
                <span>Your Official Activation Key{licenseData?.seats?.length > 1 ? 's' : ''}</span>
              </span>

              {licenseData?.seats?.length > 1 && (
                <button
                  onClick={handleDownloadBundle}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={13} className="text-nexus-cyan" />
                  <span>Download License Bundle (.txt)</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {(licenseData?.seats || []).map((seat) => {
                const isPrimary = seat.seatNumber === 1;
                return (
                  <div 
                    key={seat.seatNumber}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isPrimary 
                        ? 'bg-nexus-emerald/5 border-nexus-emerald/30 shadow-[0_0_20px_rgba(0,255,157,0.05)]' 
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          isPrimary ? 'bg-nexus-emerald/20 text-nexus-emerald' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          Seat 0{seat.seatNumber}
                        </span>
                        <span className="text-xs font-bold text-white">{seat.role}</span>
                        {isPrimary && !isDeactivated && (
                          <span className="text-[10px] font-mono text-nexus-emerald bg-nexus-emerald/10 border border-nexus-emerald/20 px-1.5 py-0.2 rounded">
                            ● Active on this PC
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-sm font-bold text-zinc-200 mt-1 select-all tracking-wide">
                        {seat.key}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(seat.key, `seat_${seat.seatNumber}`)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedKey === `seat_${seat.seatNumber}` ? (
                        <>
                          <Check size={13} className="text-nexus-emerald" />
                          <span className="text-nexus-emerald font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hardware Lock & Transfer Instructions */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 mb-8 text-xs text-zinc-400 space-y-2">
            <div className="flex items-start gap-2.5">
              <Lock size={15} className="text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-zinc-200 block mb-0.5">Single-Device Binding Protection:</strong>
                <span>
                  Each key is locked to one computer to safeguard intellectual property. 
                  If you purchase a new laptop or need to transfer your seat, click below to release the key.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              {!isDeactivated ? (
                <button
                  onClick={handleDeactivate}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw size={11} />
                  <span>Deactivate License from this PC (Transfer to New Device)</span>
                </button>
              ) : (
                <span className="text-[11px] font-mono text-amber-400">
                  Key released. Re-launch ContractGuard on your new PC to bind it.
                </span>
              )}
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Return to Nexus Home
            </button>

            <button
              onClick={() => navigate('/app/contractcompare')}
              className="w-full sm:w-auto bg-nexus-emerald text-black px-7 py-3 rounded-xl font-black text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,255,157,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch ContractGuard Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
