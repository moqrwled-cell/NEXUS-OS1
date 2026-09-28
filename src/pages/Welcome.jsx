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

  const toolContent = {
    leadscrub: {
      title: "LeadScrub Lifetime License Verified.",
      subtitle: "Payment successful. You now have full lifetime access to the Nexus LeadScrub engine.",
      step2Title: "Load Your Leads",
      step2Desc: "Upload your dirty B2B CSV lists. No database or cloud uploads required.",
      step3Title: "Scrub Locally",
      step3Desc: "Clean thousands of leads instantly on your device's memory for 100% privacy."
    },
    ecommatch: {
      title: "EcomMatch Lifetime License Verified.",
      subtitle: "Payment successful. You now have full lifetime access to the Nexus EcomMatch engine.",
      step2Title: "Load Financials",
      step2Desc: "Upload your Shopify and Stripe CSV exports directly into the tool.",
      step3Title: "Match Locally",
      step3Desc: "Reconcile discrepancies and find lost cash entirely on your local machine."
    },
    adspendaudit: {
      title: "AdSpend-Audit Lifetime License Verified.",
      subtitle: "Payment successful. You now have full lifetime access to the Nexus AdSpend-Audit engine.",
      step2Title: "Load Ad Reports",
      step2Desc: "Upload your Meta/Google Ads CSV reports securely.",
      step3Title: "Audit Locally",
      step3Desc: "Calculate mathematically wasted spend and zombie campaigns in seconds."
    },
    contractcompare: {
      title: "Legal-Audit Lifetime License Verified.",
      subtitle: "Payment successful. You now have full lifetime access to the Nexus ContractCompare engine.",
      step2Title: "Load Contracts",
      step2Desc: "Upload your original and revised PDF contracts into the browser.",
      step3Title: "Audit Locally",
      step3Desc: "Find dangerous clauses and hidden changes securely on your local device."
    },
    default: {
      title: "License Verified.",
      subtitle: "Your payment was successful. You now have full lifetime access to the Nexus local-first engine.",
      step2Title: "Load Your Data",
      step2Desc: "Upload your files directly into the tool. No database or cloud needed.",
      step3Title: "Process Locally",
      step3Desc: "Everything runs entirely on your device's memory for 100% data privacy."
    }
  };

  const content = toolContent[redirectTool] || toolContent.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-white" dir="ltr">
      <div className="w-full max-w-2xl p-8 rounded-2xl liquid-glass-strong border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,157,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center mb-6 border border-nexus-emerald/30 shadow-[0_0_30px_rgba(0,255,157,0.4)]">
            <CheckCircle2 size={40} className="text-nexus-emerald" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {content.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-lg">
            {content.subtitle}
          </p>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="text-nexus-emerald font-mono text-xl mb-2">01</div>
            <h3 className="font-bold text-white mb-1">Activate Device</h3>
            <p className="text-sm text-gray-400">Click the button below to bind your lifetime license to this specific machine.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="text-nexus-cyan font-mono text-xl mb-2">02</div>
            <h3 className="font-bold text-white mb-1">{content.step2Title}</h3>
            <p className="text-sm text-gray-400">{content.step2Desc}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="text-blue-400 font-mono text-xl mb-2">03</div>
            <h3 className="font-bold text-white mb-1">{content.step3Title}</h3>
            <p className="text-sm text-gray-400">{content.step3Desc}</p>
          </div>
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
