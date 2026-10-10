import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { grantToolAccess } from '../utils/auth';

export default function PirateTrapModal({ isOpen, onSuccess, toolName = 'contractcompare' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, activating, success

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Strict Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid business email address.');
      return;
    }

    setStatus('activating');

    // 100% Local Air-Gapped Device Activation: Zero network requests
    const trialKey = `NX-EVAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // Store local evaluation record
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
      }, 800);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" dir="ltr">
      <div className="w-full max-w-md p-8 rounded-2xl liquid-glass-strong border border-nexus-emerald/30 shadow-[0_0_50px_rgba(0,255,157,0.1)] relative overflow-hidden text-center">
        <div className="w-20 h-20 bg-nexus-emerald/10 border border-nexus-emerald/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <ShieldCheck size={40} className="text-nexus-emerald absolute" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Offline Workspace Activation</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Air-gapped security mode active. Enter your organization email to initialize your private local workspace. No data leaves your machine.
        </p>

        {status === 'success' ? (
          <div className="bg-nexus-emerald/10 text-nexus-emerald p-4 rounded-xl border border-nexus-emerald/30 font-bold animate-in fade-in zoom-in">
            Workspace Initialized! Unlocking tool...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-nexus-cyan text-white transition-all placeholder-gray-600 text-sm"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'activating'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm"
            >
              {status === 'activating' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Activate Local Workspace <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
