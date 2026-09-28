import React, { useState, useEffect } from 'react';
import { ShieldAlert, Mail, ArrowRight, Loader2, Lock } from 'lucide-react';

export default function PirateTrapModal({ isOpen, onSuccess }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success
  
  const BOT_TOKEN = '8804637925:AAHNIy9gLk-ckLJPO-dKLlA_qDyJOFFe1Ro';
  const CHAT_ID = '1034497360';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('sending');
    
    const text = `
🏴‍☠️ *PIRATE CAUGHT! (Free Lead)*
📧 *Email:* ${email}
🔧 *Tool:* Nexus.OS
🕒 *Time:* ${new Date().toLocaleString()}
    `;

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' })
      });
      
      setStatus('success');
      
      // Let them in after 2 seconds
      setTimeout(() => {
        // We grant them dummy access so they can use it
        localStorage.setItem('nexus_license', 'FREE-PIRATE-ACCOUNT');
        onSuccess();
      }, 2000);
      
    } catch (err) {
      console.error(err);
      // Still let them in so they don't complain, we assume it's our network error
      setStatus('success');
      setTimeout(onSuccess, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" dir="ltr">
      <div className="w-full max-w-md p-8 rounded-2xl liquid-glass-strong border border-nexus-emerald/30 shadow-[0_0_50px_rgba(0,255,157,0.1)] relative overflow-hidden text-center">
        <div className="w-20 h-20 bg-nexus-emerald/10 border border-nexus-emerald/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
          <Lock size={40} className="text-nexus-emerald absolute" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Device Not Registered</h2>
        <p className="text-gray-400 mb-6">
          This license link was registered to another device. Enter your email below to activate a free limited account and unlock the tool.
        </p>

        {status === 'success' ? (
          <div className="bg-nexus-emerald/10 text-nexus-emerald p-4 rounded-xl border border-nexus-emerald/30 font-bold animate-in fade-in zoom-in">
            Account Activated! Unlocking tool...
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
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-nexus-cyan text-white transition-all placeholder-gray-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-nexus-emerald to-nexus-cyan text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {status === 'sending' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Unlock Free Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
