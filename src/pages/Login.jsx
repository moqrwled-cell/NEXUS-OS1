import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Key, Loader2, ArrowLeft, ShieldAlert, Lock, ShieldCheck, FileText } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-[#070A0F] p-4 font-sans text-zinc-100 antialiased" dir="ltr">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#090D14] border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500"></div>
        
        {/* Chassis Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400">
            <Key size={26} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Subscriber & Licensee Portal
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Nexus ContractGuard™ Workstation Authentication
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Enter License Key Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="CG-SOLO-... or CG-FIRM-..."
              className="w-full bg-black/60 border border-white/10 focus:border-emerald-500 rounded-lg px-4 py-3 text-center font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors"
              required
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 text-center">
              Enter the license key from your Whop receipt or purchase email.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 rounded-lg transition-colors border-t border-white/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs tracking-wide active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span>Authenticate & Unlock Workstation</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Whop Purchase CTA */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-2.5">
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
            className="w-full py-2.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Lock size={13} className="text-emerald-400" />
            <span>Instant Checkout ($199 Solo / $299 Firm)</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-zinc-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/demo')}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FileText size={13} />
            <span>Try Free Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
