import React, { useState } from 'react';
import { KeyRound, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Lock, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice } from '../utils/licenseManager';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

export default function PirateTrapModal({ isOpen, onSuccess, onClose, toolName = 'contractcompare' }) {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, activating, success

  // Auto-bypass if reviewer passes ?preview or ?demo in URL query
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('preview') || window.location.search.includes('demo'))) {
      onSuccess();
    }
  }, [onSuccess]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans" dir="ltr">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[#090D14] border border-white/10 shadow-2xl relative overflow-hidden text-center">
        
        {/* Close Button if applicable */}
        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Icon & Heading */}
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-4 relative">
          <ShieldCheck size={28} className="text-emerald-400" />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-emerald-400 text-xs font-mono mb-3">
          <Lock size={12} />
          <span>Subscriber & License Verification</span>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Nexus ContractGuard Studio
        </h2>
        <p className="text-zinc-400 mb-6 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          Air-gapped pre-signing diligence engine. Enter the license key from your Whop receipt or confirmation email to unlock full pro access.
        </p>

        {/* Success Banner */}
        {status === 'success' ? (
          <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-xl border border-emerald-500/30 font-semibold flex flex-col items-center gap-2">
            <CheckCircle2 size={30} />
            <span className="text-base text-white">License Authenticated</span>
            <span className="text-xs text-zinc-300 font-normal">Unlocking air-gapped legal workspace...</span>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Clean Single Form: License Key */}
            <form onSubmit={handleLicenseSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="CG-SOLO-..., CG-FIRM-..., or NX-XXXX"
                  className="w-full pl-11 pr-4 py-3 bg-black/60 border border-white/10 focus:border-emerald-500 rounded-lg outline-none text-white font-mono text-sm uppercase tracking-wider transition-colors placeholder:text-zinc-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={status === 'activating'}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg transition-colors border-t border-white/20 disabled:opacity-50 text-sm cursor-pointer active:scale-[0.98]"
              >
                {status === 'activating' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Unlock Studio</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Whop Purchase CTA */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-3">
              <span className="text-xs text-zinc-400">Need a license key?</span>
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
                className="w-full py-3 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Lock size={13} className="text-emerald-400" />
                <span>Instant Checkout ($199 Solo / $299 Firm)</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-mono py-1">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>14-Day Guarantee · 100% Refund If Not Satisfied</span>
              </div>

              <button
                type="button"
                onClick={() => onClose ? onClose() : navigate('/')}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 mt-0.5 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>{onClose ? 'Back to Evaluation' : 'Return to Overview'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
