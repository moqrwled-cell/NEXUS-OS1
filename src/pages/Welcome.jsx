import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Loader2, ArrowRight, Monitor, PlayCircle } from 'lucide-react';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('order') || 'UNKNOWN_ORDER';
  const redirectTool = searchParams.get('redirect') || 'hub';
  
  const [isActivating, setIsActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const navigate = useNavigate();

  const handleActivate = () => {
    setIsActivating(true);
    
    // Simulate fingerprint generation and locking process
    setTimeout(() => {
      // Store the activation securely in localStorage
      localStorage.setItem('nexus_license', orderId);
      localStorage.setItem('nexus_device_fingerprint', btoa(navigator.userAgent + Date.now()));
      
      setActivated(true);
      
      // Redirect to the tool after success
      setTimeout(() => {
        if (redirectTool === 'hub') {
          navigate('/hub');
        } else {
          navigate(`/app/${redirectTool}`);
        }
      }, 1500);
      
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-white" dir="ltr">
      <div className="w-full max-w-2xl p-8 rounded-2xl liquid-glass-strong border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
        
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center mb-6 border border-nexus-emerald/30 shadow-[0_0_30px_rgba(0,255,157,0.2)]">
            <CheckCircle2 size={40} className="text-nexus-emerald" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-400 text-lg">
            Welcome to Nexus.OS. Your tools are ready to be deployed.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="w-full aspect-video bg-black/50 border border-white/10 rounded-xl mb-10 flex flex-col items-center justify-center group cursor-pointer hover:border-nexus-cyan/50 transition-all">
          <PlayCircle size={60} className="text-gray-500 group-hover:text-nexus-cyan transition-colors mb-4" />
          <p className="text-gray-400 font-medium">Watch 2-Min Setup Guide</p>
        </div>
        
        {/* Activation Section */}
        {!activated ? (
          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
              <Monitor className="text-nexus-cyan" size={24} />
              <div>
                <h3 className="font-bold text-white">Device Lock Required</h3>
                <p className="text-sm text-gray-400">To prevent piracy, this license will be permanently locked to your current device and browser.</p>
              </div>
            </div>

            <button 
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full flex items-center justify-center gap-2 py-5 bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-bold text-lg rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,157,0.4)] disabled:opacity-50"
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Device Fingerprint...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  Activate My License on this Device
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-nexus-emerald/10 border border-nexus-emerald/30 p-6 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <ShieldCheck size={48} className="text-nexus-emerald mb-4" />
            <h3 className="text-2xl font-bold text-nexus-emerald mb-2">Device Locked Successfully!</h3>
            <p className="text-gray-300">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
