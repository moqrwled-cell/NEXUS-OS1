import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Key, ShieldCheck, Loader2 } from 'lucide-react';
import { grantToolAccess, validateEnterpriseKey } from '../utils/auth';
import { bindKeyToCurrentDevice } from '../utils/licenseManager';

export default function Login() {
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!licenseKey.trim()) {
      setError("Please enter your license key");
      return;
    }

    setIsLoading(true);

    // 100% Local / Air-Gapped License Validation
    const validation = validateEnterpriseKey(licenseKey);
    if (validation.valid) {
      try {
        await bindKeyToCurrentDevice(validation.key || licenseKey);
      } catch {
        // Fallback for non-hardware bound keys
      }

      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || 'contractcompare';
      
      grantToolAccess(licenseKey, redirectPath === 'hub' ? 'all' : redirectPath);
      setIsLoading(false);
      
      if (redirectPath === 'hub') {
        navigate('/hub');
      } else {
        navigate(`/app/${redirectPath}`);
      }
      return;
    }

    // If key format didn't pass local validation
    setError(validation.reason || "Invalid license key format. Expected: NX-XXXX-XXXX-XXXX");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 ltr" dir="ltr">
      <div className="w-full max-w-md p-8 rounded-2xl liquid-glass-strong border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center mb-4 border border-nexus-emerald/30 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
            <Key className="text-nexus-emerald" size={36} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
            NEXUS <span className="text-nexus-emerald">ENTERPRISE</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-mono">
            AIR-GAPPED LICENSE ACTIVATION
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              Hardware-Bound License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
              placeholder="NX-XXXX-XXXX-XXXX"
              className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3.5 text-center font-mono text-lg text-white placeholder-gray-600 focus:outline-none focus:border-nexus-emerald transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-nexus-emerald text-black font-extrabold py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Authenticate Workstation</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs font-mono text-gray-500">
          <ShieldCheck size={14} className="text-nexus-emerald" />
          <span>100% In-RAM Local Cryptographic Verification</span>
        </div>
      </div>
    </div>
  );
}
