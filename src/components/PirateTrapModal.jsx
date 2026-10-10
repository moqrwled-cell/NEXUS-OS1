import React, { useState } from 'react';
import { Mail, KeyRound, ExternalLink, ArrowRight, Loader2, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';

export default function PirateTrapModal({ isOpen, onSuccess, toolName = 'contractcompare' }) {
  const [activeTab, setActiveTab] = useState('eval'); // 'eval' | 'license'
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, activating, success

  if (!isOpen) return null;

  const WHOP_CHECKOUT_URL = "https://whop.com/nexus-os-85c8/nexus-contract-compare-nda-legal-diff-engine";

  // Handle Free Evaluation Activation
  const handleEvalSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid organization email address.');
      return;
    }

    setStatus('activating');

    const trialKey = `NX-EVAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    localStorage.setItem('nexus_offline_eval_session', JSON.stringify({
      email: email.trim(),
      activatedAt: new Date().toISOString(),
      evalKey: trialKey
    }));

    grantToolAccess(trialKey, toolName);

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 400);
  };

  // Handle Enterprise License Key Verification
  const handleLicenseSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!licenseKey) return;

    const result = validateEnterpriseKey(licenseKey);
    if (!result.valid) {
      setErrorMessage(result.reason || 'Invalid license key. Format: NX-XXXX-XXXX-XXXX');
      return;
    }

    setStatus('activating');
    grantToolAccess(result.key, toolName);

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" dir="ltr">
      <div className="w-full max-w-lg p-8 rounded-3xl liquid-glass-strong border border-nexus-emerald/40 shadow-[0_0_80px_rgba(0,255,157,0.15)] relative overflow-hidden text-center">
        
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-nexus-emerald/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-nexus-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Heading */}
        <div className="w-16 h-16 bg-nexus-emerald/10 border border-nexus-emerald/40 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-[0_0_30px_rgba(0,255,157,0.2)]">
          <ShieldCheck size={36} className="text-nexus-emerald" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
          Nexus ContractGuard Enterprise
        </h2>
        <p className="text-gray-400 mb-6 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
          Air-Gapped Confidentiality Mode (ABA Model Rule 1.6 Compliant). 100% Client-Side. Zero Cloud Uploads.
        </p>

        {/* Tabs: Evaluation vs Paid License */}
        <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('eval'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'eval' 
                ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            Free Evaluation Mode
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('license'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'license' 
                ? 'bg-nexus-emerald text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound size={14} />
            Enter License Key
          </button>
        </div>

        {/* Success Banner */}
        {status === 'success' ? (
          <div className="bg-nexus-emerald/10 text-nexus-emerald p-6 rounded-2xl border border-nexus-emerald/40 font-bold animate-in fade-in zoom-in flex flex-col items-center gap-2">
            <CheckCircle2 size={32} />
            <span className="text-base text-white">License Verified Successfully!</span>
            <span className="text-xs text-nexus-mint font-normal">Unlocking air-gapped legal workspace...</span>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* TAB 1: Evaluation Mode */}
            {activeTab === 'eval' && (
              <form onSubmit={handleEvalSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@lawfirm.com"
                    className="w-full pl-11 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:border-nexus-emerald text-white transition-all placeholder-gray-600 text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'activating'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-nexus-emerald to-nexus-mint text-black font-extrabold rounded-xl hover:opacity-95 transition-all shadow-[0_0_25px_rgba(0,255,157,0.3)] disabled:opacity-50 text-sm"
                >
                  {status === 'activating' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Initialize Private Workspace <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: Paid Enterprise License */}
            {activeTab === 'license' && (
              <form onSubmit={handleLicenseSubmit} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    placeholder="NX-SOLO-XXXX-XXXX"
                    className="w-full pl-11 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl focus:outline-none focus:border-nexus-emerald text-white font-mono transition-all placeholder-gray-600 text-sm uppercase tracking-wider"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'activating'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-nexus-emerald to-nexus-mint text-black font-extrabold rounded-xl hover:opacity-95 transition-all shadow-[0_0_25px_rgba(0,255,157,0.3)] disabled:opacity-50 text-sm"
                >
                  {status === 'activating' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Unlock Lifetime Access <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Direct Whop Checkout Link */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Don't have a lifetime license yet?</span>
              <a
                href={WHOP_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-nexus-mint hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-white/5 border border-nexus-mint/20"
              >
                <Lock size={12} className="text-nexus-emerald" />
                <span>Get Lifetime License on Whop ($199 Solo / $299 Firm)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
