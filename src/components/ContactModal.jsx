import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContactModal({ isOpen, onClose, services }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [formData, setFormData] = useState({
    email: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  // User provided Bot Token & Chat ID
  const BOT_TOKEN = '8804637925:AAHNIy9gLk-ckLJPO-dKLlA_qDyJOFFe1Ro';
  const CHAT_ID = '1034497360';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const text = `
🚀 *New Contact from NexusOS*
📧 *Email:* ${formData.email}
💼 *Service:* ${formData.service || 'Not specified'}
💬 *Message:* 
${formData.message}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ email: '', service: '', message: '' });
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Telegram Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
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
          className={`relative w-full max-w-lg liquid-glass-strong border border-nexus-emerald/40 rounded-3xl p-1 shadow-[0_0_50px_rgba(0,255,157,0.15)] overflow-hidden ${isRtl ? 'rtl text-right' : 'ltr text-left'}`}
        >
          <div className="bg-[#050c10] rounded-[1.4rem] p-6 md:p-8 relative">
            <button 
              onClick={onClose}
              className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-10`}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">
              {t('form_title')}
            </h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-10 text-nexus-emerald">
                <CheckCircle2 size={64} className="mb-4" />
                <p className="text-lg text-center font-semibold">{t('form_success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">{t('form_email')}</label>
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
                  <label className="block text-sm font-semibold text-gray-300 mb-1">{t('form_service')}</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all appearance-none"
                  >
                    <option value="" disabled>{t('form_service')}</option>
                    {services.map((srv, idx) => (
                      <option key={idx} value={t(srv.titleKey)} className="bg-[#050c10]">{t(srv.titleKey)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1">{t('form_msg')}</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-nexus-emerald focus:ring-1 focus:ring-nexus-emerald transition-all resize-none"
                    placeholder="..."
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle size={16} />
                    {t('form_error')}
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
                      {t('form_sending')}
                    </>
                  ) : (
                    <>
                      <Send size={20} className={isRtl ? 'rotate-180' : ''} />
                      {t('form_send')}
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
