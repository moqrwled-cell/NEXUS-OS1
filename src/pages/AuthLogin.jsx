import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuthLogin() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
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
      // SECRET MASTER PASSWORD FOR THE OWNER (Bypasses all checks)
      if (licenseKey === 'nexus_master_2026') {
        localStorage.setItem('nexus_access_token', licenseKey);
        localStorage.setItem('nexus_whop_verified', 'true');
        navigate('/app/ai-agent');
        return;
      }

      const isDevelopment = import.meta.env.DEV;
      
      if (isDevelopment) {
        // Local simulation to avoid CORS and backend requirement during dev
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Accept any key longer than 5 chars for testing
        if (licenseKey.length > 5) {
          localStorage.setItem('nexus_access_token', licenseKey);
          localStorage.setItem('nexus_whop_verified', 'true');
          navigate('/app/ai-agent');
        } else {
          setError(isRtl ? 'الكود غير صالح أو منتهي الصلاحية' : 'Invalid or expired license key');
        }
      } else {
        // Production: Call the Netlify Serverless Function
        const response = await fetch('/.netlify/functions/verify-whop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ licenseKey })
        });
        
        const data = await response.json();
        
        if (data.valid) {
          localStorage.setItem('nexus_access_token', licenseKey);
          localStorage.setItem('nexus_whop_verified', 'true');
          navigate('/app/ai-agent');
        } else {
          setError(data.error || (isRtl ? 'الكود غير صالح' : 'Invalid license key'));
        }
      }
    } catch (err) {
      setError(isRtl ? 'حدث خطأ في الاتصال بسيرفرات Whop' : 'Connection error to Whop servers');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020608] flex items-center justify-center p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      
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
          <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
          <span>{isRtl ? 'العودة للصفحة الرئيسية' : 'Back to Home'}</span>
        </Link>

        <div className="liquid-glass-strong border border-nexus-emerald/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,255,157,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-mint to-blue-500"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-nexus-emerald/10 border border-nexus-emerald/30 rounded-full flex items-center justify-center mx-auto mb-4 text-nexus-mint">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading tracking-wide mb-2">
              {isRtl ? 'بوابة التحقق' : 'License Verification'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isRtl ? 'الرجاء إدخال كود الشراء الخاص بك من منصة Whop' : 'Please enter your Whop License Key'}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <div className="relative">
                <KeyRound size={20} className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. pass_abc123..."
                  value={licenseKey}
                  onChange={e => setLicenseKey(e.target.value)}
                  className={`w-full bg-black/50 border border-white/10 rounded-xl py-4 text-white focus:outline-none focus:border-nexus-mint/50 transition-colors ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-2 font-semibold">{error}</p>}
            </div>

            <button 
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-nexus-emerald text-black rounded-xl font-bold text-lg hover:bg-nexus-mint hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isVerifying ? (
                <><Loader2 size={20} className="animate-spin" /> {isRtl ? 'جاري التحقق...' : 'Verifying...'}</>
              ) : (
                <>{isRtl ? 'تفعيل الدخول' : 'Unlock Access'}</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-2">{isRtl ? 'ليس لديك كود؟' : "Don't have a license?"}</p>
            <a href="https://whop.com/nexus-os-85c8" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-nexus-mint hover:underline font-bold text-sm">
              {isRtl ? 'اشترِ النظام الآن من Whop' : 'Purchase from Whop'} <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
