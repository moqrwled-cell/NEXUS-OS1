import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AppContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    issue: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const options = ["Integration Issue (Webhook)", "Billing & Subscription", "Agent Not Replying", "Custom Development", "Other"];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // 100% Local Air-Gapped Action: Launch default mail client via mailto
    const subject = encodeURIComponent(`Nexus App Support: ${formData.issue || 'General Support'}`);
    const body = encodeURIComponent(`Contact Email: ${formData.email}\nIssue Type: ${formData.issue || 'Not specified'}\n\nDetails:\n${formData.message}`);
    const mailtoUrl = `mailto:nexus.os.store@gmail.com?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      // Fallback
    }

    setStatus('success');
    setFormData({ email: '', issue: '', message: '' });
    setTimeout(() => {
      onClose();
      setStatus('idle');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#050B0E] border border-nexus-emerald/30 rounded-3xl p-1 shadow-[0_0_30px_rgba(0,255,157,0.1)] overflow-hidden ltr text-left"
        >
          <div className="bg-[#050B0E] rounded-[1.4rem] p-6 md:p-8 relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-10"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">
              Contact Support
            </h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-nexus-emerald">
                <CheckCircle2 size={64} className="mb-4" />
                <p className="text-lg text-center font-semibold">Message sent successfully! We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Issue Type</label>
                  <select
                    value={formData.issue}
                    onChange={(e) => setFormData({...formData, issue: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select issue...</option>
                    {options.map((opt, idx) => (
                      <option key={idx} value={opt} className="bg-[#050c10]">{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">Message Details</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all resize-none"
                    placeholder="Write your issue details here..."
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle size={16} />
                    An error occurred. Please try again later.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full mt-6 bg-nexus-emerald text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-nexus-mint transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send to Support
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
