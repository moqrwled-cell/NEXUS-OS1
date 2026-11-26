import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check, ShieldCheck, ExternalLink, Send } from 'lucide-react';

const DEFAULT_SUPPORT_TOPICS = [
  'License Key & Workstation Activation',
  'Audit Accuracy & Document Parsing (.pdf / .docx / OCR)',
  'Pricing & Seat Upgrades (Solo $199 / Firm $299)',
  '30-Day Refund & Billing Request',
  'Technical Bug or Deployment Inquiry'
];

const SUPPORT_EMAIL = 'nexus.os.store@gmail.com';

export default function ContactModal({
  isOpen,
  onClose,
  services = [],
  workstationId = '',
  planTier = ''
}) {
  const normalizedOptions = Array.isArray(services) && services.length > 0
    ? services.map((s) => (typeof s === 'string' ? s : s?.label || s?.title || 'General Support'))
    : DEFAULT_SUPPORT_TOPICS;

  const [formData, setFormData] = useState({
    email: '',
    topic: normalizedOptions[0] || DEFAULT_SUPPORT_TOPICS[0],
    message: ''
  });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPacket, setCopiedPacket] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setSubmitted(false);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const buildTicketText = () => {
    const metaLines = [
      `Topic: ${formData.topic || 'General Support'}`,
      `Reply-To Email: ${formData.email || '(not provided)'}`
    ];
    if (planTier) metaLines.push(`License Tier: ${planTier}`);
    if (workstationId) metaLines.push(`Workstation ID: ${workstationId}`);
    metaLines.push('', 'Details:', formData.message || '');
    return metaLines.join('\n');
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyTicket = () => {
    const fullDraft = `To: ${SUPPORT_EMAIL}\nSubject: ContractGuard Support — ${formData.topic}\n\n${buildTicketText()}`;
    navigator.clipboard?.writeText(fullDraft);
    setCopiedPacket(true);
    setTimeout(() => setCopiedPacket(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`ContractGuard Support — ${formData.topic || 'General Inquiry'}`);
    const body = encodeURIComponent(buildTicketText());
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      // Clipboard fallback remains available on button below if OS has no default handler
    }

    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#09090B] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-10 my-auto font-ui"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#111115] border-b border-white/[0.06] flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
                  Contact Practitioner Support
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Direct licensing, technical workstation diagnostics, and billing desk
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close (Esc)"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Direct Support Address Strip */}
            <div className="px-3.5 py-2.5 rounded-lg bg-[#111115] border border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-zinc-500">Direct Desk:</span>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-mono text-zinc-200 hover:text-emerald-400 transition-colors truncate"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedEmail ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
            </div>

            {submitted ? (
              <div className="p-5 rounded-lg bg-[#111115] border border-emerald-500/25 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-100">
                    Mail Composer Launched Locally
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your default email client was opened via zero-cloud mailto protocol. Using webmail without a desktop handler? Copy the formatted message below directly.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedPacket ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedPacket ? 'Copied to Clipboard' : 'Copy Full Support Note'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#111115] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                    placeholder="counsel@lawfirm.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#111115] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                  >
                    {normalizedOptions.map((opt, idx) => (
                      <option key={idx} value={opt} className="bg-[#111115] text-zinc-100">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1.5">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#111115] border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60 transition-colors resize-none leading-relaxed"
                    placeholder="Describe your licensing, activation, or technical question..."
                  />
                </div>

                {(workstationId || planTier) && (
                  <div className="px-3 py-2 rounded-lg bg-[#111115] border border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                    <span>Diagnostics attached locally:</span>
                    <span className="text-zinc-300">
                      {planTier ? `Tier: ${planTier}` : ''}{planTier && workstationId ? ' · ' : ''}{workstationId ? `ID: ${workstationId.slice(0, 14)}...` : ''}
                    </span>
                  </div>
                )}

                <div className="px-3 py-2 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/15 flex items-start gap-2 text-[11px] text-zinc-400">
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Zero-Cloud Notice: Do not include confidential client contract text. ContractGuard has no backend inbox — this opens your own mail app or copies to clipboard.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Open in Mail App</span>
                    <ExternalLink size={11} className="opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="py-2.5 px-4 rounded-lg bg-[#18181B] hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedPacket ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedPacket ? 'Copied Draft' : 'Copy For Webmail'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
