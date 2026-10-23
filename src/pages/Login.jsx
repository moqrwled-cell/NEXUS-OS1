import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Key, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice, restoreLicenseFromWhopOrder } from '../utils/licenseManager';

export default function Login() {
  const [authMode, setAuthMode] = useState('key'); // 'key' | 'whop'
  const [licenseKey, setLicenseKey] = useState('');
  const [whopOrderInput, setWhopOrderInput] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('solo'); // 'solo' | 'firm'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    
    const input = (authMode === 'key' ? licenseKey : whopOrderInput).trim();
    if (!input) {
      setError(authMode === 'key' ? 'Please enter your license key' : 'Please enter your Whop order ID or purchase email');
      return;
    }

    setIsLoading(true);

    // Case 1: Check if input is a Whop Order ID or email, or authMode is whop
    const isWhopStyle = authMode === 'whop' || input.toLowerCase().startsWith('ord_') || input.toLowerCase().startsWith('whop') || input.includes('@');
    if (isWhopStyle) {
      try {
        const activated = await restoreLicenseFromWhopOrder(input, selectedPlan);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || 'contractcompare';
        
        grantToolAccess(activated.primaryKey, redirectPath === 'hub' ? 'all' : redirectPath);
        setIsLoading(false);
        
        if (redirectPath === 'hub') {
          navigate('/hub');
        } else {
          navigate(`/app/${redirectPath}`);
        }
        return;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Failed to restore license with this Whop order.');
        return;
      }
    }

    // Case 2: Standard cryptographic license validation
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
        navigate('/hub');
      } else {
        navigate(`/app/${redirectPath}`);
      }
      return;
    }

    // If key format didn't pass local validation
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

        {/* Tab Selector: License Key vs Whop Order */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-zinc-800 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMode('key'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'key' ? 'bg-emerald-500 text-black font-extrabold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key size={13} />
            <span>License Key</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('whop'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'whop' ? 'bg-emerald-500 text-black font-extrabold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Restore with Whop</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode 1: Enter License Key */}
        {authMode === 'key' && (
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
              <p className="text-[10px] text-zinc-500 mt-1">
                Tip: If you purchased on Whop, you can also paste your Whop order ID here.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-black font-extrabold py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs tracking-wide"
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
        )}

        {/* Mode 2: Restore via Whop Order / Email */}
        {authMode === 'whop' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setSelectedPlan('solo')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlan === 'solo'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                }`}
              >
                <span className="block text-xs font-bold">Solo Plan</span>
                <span className="block text-[10px] text-zinc-500 font-mono">1 Workstation</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan('firm')}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPlan === 'firm'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                }`}
              >
                <span className="block text-xs font-bold">Law Firm Suite</span>
                <span className="block text-[10px] text-zinc-500 font-mono">5 Seats</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                Whop Order ID or Checkout Email
              </label>
              <input
                type="text"
                value={whopOrderInput}
                onChange={(e) => setWhopOrderInput(e.target.value)}
                placeholder="ord_... or attorney@firm.com"
                className="w-full bg-black/70 border border-zinc-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-center font-mono text-xs text-white placeholder:text-zinc-600 outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-black font-extrabold py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs tracking-wide"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <span>Restore & Bind License</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-zinc-500 font-mono">
                Order confirmation and cryptographic keys are delivered instantly to your purchase email.
              </span>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Nexus Home</span>
          </button>

          <a
            href="mailto:nexus.os.store@gmail.com"
            className="hover:text-white transition-colors font-mono text-[11px]"
          >
            Support Desk
          </a>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Air-Gapped Multi-Store Hardware License Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
