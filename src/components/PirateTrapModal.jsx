import React, { useState } from 'react';
import { KeyRound, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice, restoreLicenseFromWhopOrder } from '../utils/licenseManager';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

export default function PirateTrapModal({ isOpen, onSuccess, toolName = 'contractcompare' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('key'); // 'key' | 'whop'
  const [licenseKey, setLicenseKey] = useState('');
  const [whopInput, setWhopInput] = useState('');
  const [whopPlan, setWhopPlan] = useState('solo');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, activating, success

  if (!isOpen) return null;

  // Handle Enterprise License Key Verification & Device Binding
  const handleLicenseSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const raw = (activeTab === 'key' ? licenseKey : whopInput).trim();
    if (!raw) {
      setErrorMessage(activeTab === 'key' ? 'Please enter your license key.' : 'Please enter your Whop order ID or email.');
      return;
    }

    // Check if input is a Whop Order ID or email
    const isWhopOrder = activeTab === 'whop' || raw.toLowerCase().startsWith('ord_') || raw.toLowerCase().startsWith('whop') || raw.includes('@');
    if (isWhopOrder) {
      setStatus('activating');
      try {
        const activated = await restoreLicenseFromWhopOrder(raw, whopPlan);
        grantToolAccess(activated.primaryKey, toolName);
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => {
            onSuccess();
          }, 700);
        }, 500);
        return;
      } catch (err) {
        setStatus('idle');
        setErrorMessage(err.message || 'Failed to restore license with this Whop order.');
        return;
      }
    }

    const result = validateEnterpriseKey(raw);
    if (!result.valid) {
      setErrorMessage(result.reason || 'Invalid license format. Expected: CG-SOLO-..., CG-FIRM-..., or NX-XXXX-XXXX-XXXX');
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
        <p className="text-zinc-400 mb-5 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
          This studio is protected under air-gapped cryptographic DRM. Enter your license key or restore your Whop purchase below.
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
            {/* Tab Selector: Key vs Whop Order */}
            <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-zinc-800 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setActiveTab('key'); setErrorMessage(''); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'key' ? 'bg-emerald-500 text-black font-extrabold shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Key size={13} />
                <span>License Key</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('whop'); setErrorMessage(''); }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'whop' ? 'bg-emerald-500 text-black font-extrabold shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>Restore via Whop</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form for Key */}
            {activeTab === 'key' && (
              <form onSubmit={handleLicenseSubmit} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
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
            )}

            {/* Form for Whop Restore */}
            {activeTab === 'whop' && (
              <form onSubmit={handleLicenseSubmit} className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => setWhopPlan('solo')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      whopPlan === 'solo'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                    }`}
                  >
                    <span className="block text-xs font-bold">Solo Plan</span>
                    <span className="block text-[10px] text-zinc-500 font-mono">1 Workstation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhopPlan('firm')}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      whopPlan === 'firm'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                    }`}
                  >
                    <span className="block text-xs font-bold">Firm Suite</span>
                    <span className="block text-[10px] text-zinc-500 font-mono">5 Seats</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={whopInput}
                    onChange={(e) => setWhopInput(e.target.value)}
                    placeholder="Whop Order ID (ord_...) or Email"
                    className="w-full px-4 py-3 bg-black/70 border border-zinc-700 focus:border-emerald-500 rounded-xl outline-none text-white font-mono text-xs transition-colors placeholder:text-zinc-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'activating'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50 text-xs cursor-pointer"
                >
                  {status === 'activating' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Restore & Unlock Studio <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Check your purchase confirmation email for your Whop Order ID or License Key.
                  </span>
                </div>
              </form>
            )}

            {/* Whop Purchase CTA */}
            <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col items-center gap-2.5">
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
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
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
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 mt-0.5 cursor-pointer"
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
