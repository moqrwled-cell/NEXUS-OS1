import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Key, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!licenseKey.trim()) {
      setError(isRtl ? "الرجاء إدخال كود التفعيل الخاص بك" : "Please enter your license key");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/validate-key', {
        method: 'POST',
        body: JSON.stringify({ licenseKey })
      });
      
      const data = await response.json();

      if (response.ok && data.valid) {
        localStorage.setItem("nexus_license", licenseKey);
        navigate("/app/leadscrub");
      } else {
        setError(data.error || (isRtl ? "كود التفعيل غير صحيح أو منتهي الصلاحية." : "Invalid or expired license key."));
      }
    } catch (err) {
      setError(isRtl ? "حدث خطأ في الاتصال بخادم التحقق." : "Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md p-8 rounded-2xl liquid-glass-strong border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center mb-4 border border-nexus-emerald/30 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
            <ShieldCheck size={40} className="text-nexus-emerald" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRtl ? 'بوابة الدخول (Nexus.OS)' : 'Nexus.OS Gateway'}
          </h1>
          <p className="text-gray-400">
            {isRtl ? 'أدخل كود التفعيل الخاص بك للدخول إلى الأدوات' : 'Enter your license key to access the tools'}
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isRtl ? 'كود التفعيل (License Key)' : 'License Key'}
            </label>
            <div className="relative">
              <Key className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-500`} size={20} />
              <input 
                type="text" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-nexus-cyan text-white transition-all duration-300 placeholder-gray-600 text-left`}
                placeholder="WHOP-XXXX-XXXX" 
                dir="ltr"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isRtl ? 'تحقق ودخول' : 'Verify & Enter'} <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
