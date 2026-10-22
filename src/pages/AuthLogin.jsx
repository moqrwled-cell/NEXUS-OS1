import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEnterpriseKey, grantToolAccess } from '../utils/auth';
import { bindKeyToCurrentDevice } from '../utils/licenseManager';

export default function AuthLogin() {
  const navigate = useNavigate();

  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setIsVerifying(true);
    setError('');

    try {
      const validation = validateEnterpriseKey(licenseKey);
      if (validation.valid) {
        try {
          await bindKeyToCurrentDevice(validation.key || licenseKey);
        } catch {
          // Continue for non-hardware bound keys
        }
        grantToolAccess(licenseKey, 'all');
        navigate('/hub');
        return;
      }
      setError(validation.reason || 'Invalid or expired license key');
    } catch {
      setError('Error validating license key');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020608] flex items-center justify-center p-6 ltr">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-nexus-emerald rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-[#050B0E]/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-nexus-emerald/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="w-12 h-12 rounded-xl bg-nexus-emerald/10 border border-nexus-emerald/30 flex items-center justify-center text-nexus-emerald mb-6">
            <KeyRound size={24} />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">License Authentication</h1>
          <p className="text-gray-400 text-sm mb-8">
            Enter your 16-character license key to access your local tools.
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-2">
                License Key (Format: NX-XXXX-XXXX-XXXX)
              </label>
              <input 
                type="text" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="NX-XXXX-XXXX-XXXX"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all text-center tracking-widest text-lg"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 rounded-xl bg-nexus-emerald hover:bg-nexus-mint text-black font-bold transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_25px_rgba(0,255,157,0.5)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <span>Activate License</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-nexus-emerald" />
              <span>100% In-RAM Local Cryptographic Verification</span>
            </div>
            
            <a 
              href="https://whop.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Don't have a license? Buy one on Whop</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
