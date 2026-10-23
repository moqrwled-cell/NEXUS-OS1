import React, { useState } from 'react';
import { KeyRound, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice } from '../utils/licenseManager';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

export default function PirateTrapModal({ isOpen, onSuccess, toolName = 'contractcompare' }) {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, activating, success

  if (!isOpen) return null;

  // Handle Enterprise License Key Verification & Device Binding
  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const raw = licenseKey.trim();
    if (!raw) {
      setErrorMessage('Please enter your cryptographic license key.');
      return;
    }

    const result = validateEnterpriseKey(raw);
    if (!result.valid) {
      setErrorMessage(result.reason || 'Invalid license key format. Expected: CG-SOLO-..., CG-FIRM-..., or NX-XXXX-XXXX-XXXX');
      return;
    }

    setStatus('activating');
    try {
      await bindKeyToCurrentDevice(result.key);
      grantToolAccess(result.key, toolName);

      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 700);
      }, 500);
    } catch (err) {
      setStatus('idle');
      setErrorMessage(err.message || 'Failed to activate license on this workstation.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-sans" dir="ltr">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-[#060D12] border border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.2)] relative overflow-hidden text-center">
        
        {/* Glow Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Heading */}
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-[0_0_30px_rgba(16,185,129,0.25)]">
          <ShieldCheck size={36} className="text-emerald-400" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold mb-3">
          <Lock size={12} />
          <span>PAID ENTERPRISE LICENSE REQUIRED</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Nexus ContractGuard Studio
        </h2>
        <p className="text-zinc-400 mb-6 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          This studio is protected under air-gapped cryptographic DRM. Enter your license key from your Whop receipt below, or purchase a lifetime license.
        </p>

        {/* Success Banner */}
        {status === 'success' ? (
          <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-2xl border border-emerald-500/40 font-bold animate-in fade-in zoom-in flex flex-col items-center gap-2">
            <CheckCircle2 size={32} />
            <span className="text-base text-white">License Authenticated!</span>
            <span className="text-xs text-zinc-300 font-normal">Unlocking air-gapped legal workspace...</span>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Clean Single Form: License Key */}
            <form onSubmit={handleLicenseSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="CG-SOLO-..., CG-FIRM-..., or NX-XXXX"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/70 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-white font-mono text-sm uppercase tracking-wider transition-colors placeholder:text-zinc-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'activating'}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] disabled:opacity-50 text-sm cursor-pointer"
              >
                {status === 'activating' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify & Unlock Studio <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Whop Purchase CTA */}
            <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col items-center gap-3">
              <span className="text-xs text-zinc-400 font-medium">Don't have an enterprise license yet?</span>
              <button
                type="button"
                onClick={() => {
                  openSeamlessCheckout({
                    plan: 'solo',
                    toolName: 'contractcompare',
                    onSuccess: () => {
                      setStatus('success');
                      setTimeout(() => {
                        onSuccess();
                      }, 1000);
                    }
                  });
                }}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <Lock size={14} />
                <span>Instant Checkout ($199 Solo / $299 Firm) — Apple Pay & Cards</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 font-mono py-1">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>14-Day Zero-Risk Guarantee • 100% Refund If Not Satisfied</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 mt-0.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Return to Overview</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
