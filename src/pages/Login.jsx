import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Key, Loader2, ArrowLeft, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice } from '../utils/licenseManager';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

export default function Login() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    const input = licenseKey.trim();
    if (!input) {
      setError('Please enter your cryptographic license key');
      return;
    }

    setIsLoading(true);

    const validation = validateEnterpriseKey(input);
    if (validation.valid) {
      try {
        await bindKeyToCurrentDevice(validation.key || input);
      } catch {
        // Fallback for non-hardware bound keys
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || 'contractcompare';
      
      grantToolAccess(input, redirectPath === 'hub' ? 'all' : redirectPath);
      setIsLoading(false);
      
      if (redirectPath === 'hub') {
        navigate('/app/contractcompare');
      } else {
        navigate(`/app/${redirectPath}`);
      }
      return;
    }

    // If key format didn't pass cryptographic validation
    setError(validation.reason || 'Invalid license key format. Expected: CG-SOLO-..., CG-FIRM-..., or NX-XXXX-XXXX-XXXX');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020608] p-4 font-sans text-zinc-100 antialiased" dir="ltr">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#060D12] border border-white/10 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
        
        {/* Chassis Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <Key size={30} />
          </div>
          <h1 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
            NEXUS <span className="text-nexus-emerald">CONTRACTGUARD</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            WORKSTATION LICENSE AUTHENTICATION
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Enter License Key Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Hardware-Bound License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="CG-SOLO-... or CG-FIRM-..."
              className="w-full bg-black/70 border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-center font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
              required
            />
            <p className="text-[10px] text-zinc-400 mt-1.5 text-center">
              Enter the cryptographic key from your Whop purchase receipt or email.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 text-black font-extrabold py-3.5 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs tracking-wide"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span>Authenticate Workstation</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Whop Purchase CTA */}
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col items-center gap-2.5">
          <span className="text-xs text-zinc-400">Don't have a license key yet?</span>
          <button
            type="button"
            onClick={() => {
              openSeamlessCheckout({
                plan: 'solo',
                toolName: 'contractcompare',
                onSuccess: () => navigate('/welcome?status=success')
              });
            }}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock size={13} />
            <span>Instant Checkout ($199 Solo / $299 Firm)</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Overview</span>
          </button>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>100% In-RAM Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
