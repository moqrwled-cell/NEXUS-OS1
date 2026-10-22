import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  TrendingDown, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Lock, 
  FileText, 
  AlertTriangle, 
  ChevronDown,
  Sparkles,
  Scale,
  Search,
  EyeOff,
  AlertCircle,
  Download,
  CheckCircle,
  XCircle,
  Play
} from 'lucide-react';
import Nexus3DNode from './components/Nexus3DNode';
import ContactModal from './components/ContactModal';
import ProductLaunchFilm from './components/ProductLaunchFilm';
import { openSeamlessCheckout } from './utils/checkoutPopup';

export default function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const isRtl = lang === 'ar';

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    i18n.changeLanguage(lang);
  }, [lang, isRtl, i18n]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#020608] text-zinc-100 selection:bg-nexus-emerald selection:text-black antialiased ${isRtl ? 'font-cairo rtl' : 'font-heading ltr'}`}>
      
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-nexus-emerald/10 blur-[140px] rounded-full pointer-events-none"></div>
      </div>

      {/* Modern High-Precision Navigation (Apple Vibrancy & Materials) */}
      <nav className="fixed w-full z-50 top-0 py-3.5 px-6 md:px-12 flex justify-between items-center bg-[#020608]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-nexus-emerald/10 border border-nexus-emerald/30 flex items-center justify-center text-nexus-emerald shadow-[0_0_15px_rgba(0,255,157,0.15)]">
            <Scale size={20} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-white">
              Nexus <span className="text-nexus-emerald font-black">ContractGuard</span>
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] font-semibold tracking-wider bg-white/[0.06] text-zinc-300 border border-white/10 px-2 py-0.5 rounded-md">
              ENTERPRISE 2.0
            </span>
          </div>
        </div>
        
        {/* Nav Links (Desktop) — Ordered by Apple Product Storytelling Arc */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-400">
          <button onClick={() => scrollToSection('launch-film')} className="hover:text-nexus-emerald transition-colors flex items-center gap-1.5 text-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-nexus-emerald animate-pulse"></span>
            <span>{isRtl ? 'العرض الرسمي (48s)' : 'Launch Film (48s)'}</span>
          </button>
          <button onClick={() => scrollToSection('studio-preview')} className="hover:text-white transition-colors">
            {isRtl ? 'بيئة العمل الحية' : 'Live Studio'}
          </button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-white transition-colors">
            {isRtl ? 'مقارنة المخاطر' : 'Risk Comparison'}
          </button>
          <button onClick={() => scrollToSection('engines')} className="hover:text-white transition-colors">
            {isRtl ? 'المحركات الخماسية' : '5-in-1 Engines'}
          </button>
          <button onClick={() => scrollToSection('security')} className="hover:text-white transition-colors">
            {isRtl ? 'معيار السرية ABA 1.6' : 'ABA Rule 1.6'}
          </button>
          <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">
            {isRtl ? 'التراخيص والتسعير' : 'Licensing & Pricing'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/10 text-xs font-semibold text-zinc-300"
            >
              <Globe size={14} className="text-nexus-emerald" />
              <span>{lang === 'ar' ? 'العربية' : 'EN'}</span>
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-28 bg-[#091116] border border-white/15 rounded-xl overflow-hidden flex flex-col z-50 shadow-2xl"
                >
                  <button
                    onClick={() => { setLang('ar'); setIsLangMenuOpen(false); }}
                    className="text-right px-4 py-2 text-xs text-zinc-200 hover:bg-nexus-emerald/20 hover:text-white transition-colors"
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                    className="text-left px-4 py-2 text-xs text-zinc-200 hover:bg-nexus-emerald/20 hover:text-white transition-colors"
                  >
                    English
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Demo CTA */}
          <button 
            onClick={() => navigate('/demo')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} className="text-cyan-400" />
            <span>{isRtl ? 'تجربة الديمو التفاعلي' : 'Live Demo'}</span>
          </button>

          {/* Launch Studio CTA in Nav */}
          <button 
            onClick={() => navigate('/app/contractcompare')}
            className="bg-nexus-emerald text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isRtl ? 'فتح الاستوديو الكامل' : 'Launch Studio'}</span>
            <ArrowRight size={13} className={isRtl ? 'rotate-180' : ''} />
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-28 md:pt-36 pb-24">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Professional, Authoritative & Laser-Focused               */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            
            <div className="flex-1 max-w-2xl">
              
              {/* Trust & Air-Gapped Compliance Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nexus-emerald/10 border border-nexus-emerald/30 text-nexus-emerald text-[11px] font-mono uppercase tracking-wider mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-nexus-emerald animate-pulse"></span>
                <span>{isRtl ? 'معزول هوائياً 100% • متوافق مع معيار ABA Model Rule 1.6' : '100% AIR-GAPPED • ABA MODEL RULE 1.6 COMPLIANT'}</span>
              </motion.div>

              {/* Master Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] apple-display-heading text-white leading-[1.12] mb-6"
              >
                {isRtl ? (
                  <>
                    اكشف الأخطاء الكارثية في العقود <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-emerald via-[#00F0FF] to-white">
                      قبل التوقيع — محلياً في ثوانٍ.
                    </span>
                  </>
                ) : (
                  <>
                    Pre-Signing Legal Defense. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-emerald via-[#00F0FF] to-white">
                      Never Sign a Defective Contract.
                    </span>
                  </>
                )}
              </motion.h1>
              
              {/* Subheadline with Precise Legal Value Proposition */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg text-zinc-300 leading-relaxed mb-8"
              >
                {isRtl 
                  ? 'محرك التدقيق الآلي الأقوى للمحامين والمستشارين القانونيين. يكشف تلقائياً المراجع المكسورة (Section 8.2)، تضارب المبالغ المكتوبة بالأرقام والكلمات، المصطلحات العائمة غير المعرفة، وبقايا المسودات السابقة [TBD] في ذاكرة متصفحك مباشرة دون رفع كلمة واحدة لأي سيرفر خارجي.'
                  : 'Automated pre-signing contract integrity engine for attorneys, boutique firms, and corporate legal teams. Catches broken section cross-references, word-to-number financial mismatches, undefined capitalized terms, and leftover boilerplate 100% in-browser with zero cloud risk.'
                }
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 items-center mb-10"
              >
                <button 
                  onClick={() => navigate('/demo')}
                  className="bg-nexus-emerald text-black px-7 py-3.5 rounded-xl font-black text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(0,255,157,0.4)] flex items-center gap-2.5 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>{isRtl ? '⚡ تجربة الديمو التفاعلي الفوري (79ms Demo)' : '⚡ Try Interactive Live Demo'}</span>
                  <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
                </button>

                <button 
                  onClick={() => scrollToSection('launch-film')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-nexus-emerald/15 to-nexus-cyan/15 hover:from-nexus-emerald/25 hover:to-nexus-cyan/25 border border-nexus-emerald/40 text-white font-black text-sm transition-all flex items-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(0,255,157,0.15)] group"
                >
                  <div className="w-5 h-5 rounded-full bg-nexus-emerald/20 flex items-center justify-center text-nexus-emerald group-hover:scale-110 transition-transform">
                    <Play size={11} className="ml-0.5 fill-nexus-emerald" />
                  </div>
                  <span>{isRtl ? 'عرض الفيديو الترويجي (48s)' : 'Watch Launch Film (48s)'}</span>
                </button>
                
                <button 
                  onClick={() => navigate('/app/contractcompare')}
                  className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isRtl ? 'بيئة العمل الكاملة' : 'Full Studio'}</span>
                </button>

                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="px-6 py-3.5 rounded-xl bg-nexus-cyan/10 hover:bg-nexus-cyan/20 border border-nexus-cyan/30 text-nexus-cyan font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Lock size={15} />
                  <span>{isRtl ? 'التراخيص الدائمة ($199 / $299)' : 'Lifetime Licenses ($199 / $299)'}</span>
                </button>
              </motion.div>

              {/* Verified Metrics Row */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08]">
                <div>
                  <div className="text-2xl font-black text-white font-mono">0ms</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{isRtl ? 'زمن النقل (معالجة بالمتصفح)' : 'Network Latency (In-Browser)'}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-nexus-emerald font-mono">100%</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{isRtl ? 'عزل هوائي وسرية مهنية' : 'Air-Gapped Client Privilege'}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-nexus-cyan font-mono">5 in 1</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{isRtl ? 'محركات تدقيق شاملة' : 'Integrated Audit Engines'}</div>
                </div>
              </div>

            </div>

            {/* Visual Node Element */}
            <div className="w-full lg:w-[460px] h-[360px] lg:h-[460px] relative flex items-center justify-center">
              <div className="absolute inset-0 bg-radial-gradient from-nexus-emerald/15 to-transparent blur-2xl"></div>
              <Nexus3DNode />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. OFFICIAL PRODUCT LAUNCH FILM (High-Impact Keynote Reveal)              */}
        {/* ========================================================================= */}
        <ProductLaunchFilm isRtl={isRtl} />

        {/* ========================================================================= */}
        {/* 3. REAL HIGH-FIDELITY PRODUCT VIEWPORT (Interactive Studio Preview)        */}
        {/* ========================================================================= */}
        <section id="studio-preview" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="font-mono text-xs font-bold text-nexus-emerald uppercase tracking-wider bg-nexus-emerald/10 border border-nexus-emerald/20 px-3 py-1 rounded-full">
              {isRtl ? 'معاينة الواجهة الحقيقية' : 'LIVE STUDIO TELEMETRY'}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3">
              {isRtl ? 'شاهد كيف يبدو التدقيق الفعلي داخل جهازك' : 'What Modern Legal Integrity Looks Like in Action'}
            </h2>
          </div>

          {/* High-Fidelity App Chrome Frame */}
          <div className="rounded-2xl border border-white/15 bg-[#060D12] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden">
            
            {/* Title Bar */}
            <div className="px-4 py-3 bg-[#03070A] border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="ml-3 font-mono text-[11px] text-zinc-300">
                  Nexus ContractGuard Enterprise v2.4 — Master_Services_Agreement_Final_v4.docx
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nexus-emerald animate-ping"></span>
                <span className="font-mono text-[11px] text-nexus-emerald font-semibold">
                  LOCAL WORKER THREAD: ACTIVE (0 KB Transmitted)
                </span>
              </div>
            </div>

            {/* Split Screen Studio Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              
              {/* Document Text Editor Panel (Left 7 cols) */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050A0E] text-zinc-300 text-xs sm:text-sm font-ui leading-relaxed space-y-4">
                
                <div className="pb-3 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>DOCUMENT INSPECTOR • 12,450 WORDS</span>
                  <span className="text-nexus-cyan">ENCODING: UTF-8 (IN-MEMORY)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-white block mb-1">SECTION 3.2 — PAYMENT CONSIDERATION</span>
                  <p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">
                    Client shall pay the Contractor a fixed fee of <span className="text-amber-300 font-bold bg-amber-500/20 px-1 py-0.5 rounded border border-amber-500/40">Ten Thousand Dollars ($100,000)</span> payable in monthly increments upon deliverables submission.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    <AlertTriangle size={12} />
                    <span>CRITICAL MISMATCH: Spelled word 'Ten Thousand' ($10,000) differs from figure ($100,000)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-white block mb-1">SECTION 8.4 — LIMITATION OF LIABILITY</span>
                  <p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">
                    Except as expressly provided under <span className="text-rose-400 font-bold bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/40">Section 14.3(b)</span> and <span className="text-rose-400 font-bold bg-rose-500/20 px-1 py-0.5 rounded border border-rose-500/40">Exhibit D (Cyber Indemnity)</span>, neither party shall be liable for indirect damages.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                    <AlertCircle size={12} />
                    <span>BROKEN REFERENCE: Section 14.3 was deleted in draft v3; Exhibit D is not attached to this agreement</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="font-bold text-white block mb-1">SECTION 12.1 — GOVERNING LAW & SEVERABILITY</span>
                  <p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">
                    This Agreement shall be governed by the laws of <span className="text-purple-300 font-bold bg-purple-500/20 px-1 py-0.5 rounded border border-purple-500/40">[Insert Governing Jurisdiction Here]</span> without regard to conflict of laws principles.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    <Sparkles size={12} />
                    <span>BOILERPLATE RESIDUE: Unresolved draft bracket detected prior to execution</span>
                  </div>
                </div>

              </div>

              {/* Audit Findings Telemetry Panel (Right 5 cols) */}
              <div className="lg:col-span-5 p-6 bg-[#081218] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      {isRtl ? 'مؤشر النزاهة القانونية' : 'INTEGRITY AUDIT REPORT'}
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      HIGH RISK (62/100)
                    </span>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[11px] text-zinc-400">{isRtl ? 'المراجع المكسورة' : 'Broken Citations'}</div>
                      <div className="text-xl font-black text-rose-400 font-mono">2 Flagged</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[11px] text-zinc-400">{isRtl ? 'التضارب المالي' : 'Financial Mismatch'}</div>
                      <div className="text-xl font-black text-amber-400 font-mono">1 Contradiction</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[11px] text-zinc-400">{isRtl ? 'فراغات [TBD]' : 'Boilerplate Residue'}</div>
                      <div className="text-xl font-black text-purple-400 font-mono">3 Unresolved</div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <div className="text-[11px] text-zinc-400">{isRtl ? 'التزامات ملزمة' : 'Obligations Extracted'}</div>
                      <div className="text-xl font-black text-nexus-emerald font-mono">18 Covenants</div>
                    </div>
                  </div>

                  {/* Actionable Recommendations */}
                  <div className="space-y-2 text-xs text-zinc-300 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-nexus-emerald mt-0.5 shrink-0" />
                      <span>{isRtl ? 'تم عزل وحصر مصفوفة التزامات الطرفين (Client vs Contractor)' : 'Extracted distinct duty matrix for Client vs Contractor'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-nexus-emerald mt-0.5 shrink-0" />
                      <span>{isRtl ? 'مذكرة العميل التنفيذية جاهزة للتصدير والطباعة الرسمية' : 'Executive Client Memo ready for court/partner presentation'}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Studio Launcher Button */}
                <div className="pt-4 border-t border-white/10">
                  <button 
                    onClick={() => navigate('/app/contractcompare')}
                    className="w-full bg-nexus-emerald text-black py-3 px-4 rounded-xl font-black text-xs hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 cursor-pointer font-ui"
                  >
                    <span>{isRtl ? 'فتح بيئة العمل والبدء في فحص العقود' : 'Launch Air-Gapped Legal Studio Now'}</span>
                    <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. HIGH-STAKES COMPARISON: Manual Liability vs ContractGuard               */}
        {/* ========================================================================= */}
        <section id="comparison" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 px-3.5 py-1 rounded-full">
              {isRtl ? 'تحليل المخاطر المباشرة' : 'THE LIABILITY REALITY'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] apple-display-heading text-white mt-4">
              {isRtl ? 'التدقيق اليدوي المرهق مقابل الحصانة الآلية المحلية' : 'Manual Proofreading vs. Air-Gapped Precision'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* The Manual Flawed Way */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#090C0F] border border-red-500/20 border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
                  <XCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isRtl ? 'التدقيق اليدوي والسحابي التقليدي' : 'Traditional Manual & Cloud AI Proofreading'}
                  </h3>
                  <span className="text-xs text-red-400 font-mono">
                    {isRtl ? 'إجهاد بشري + خرق للسرية المهنية' : 'Human Fatigue + Malpractice & Privilege Breaches'}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-xs md:text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>{isRtl ? 'استغراق 4 إلى 8 ساعات من وقت المحامي لكل اتفاقية لمراجعة الإحالات يدوياً.' : '4 to 8 billable hours lost per contract searching for cross-references.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>{isRtl ? 'إغفال تضارب الأرقام ($10,000 مقابل $100,000) مما يؤدي لنزاعات تحكيم مكلفة.' : 'Overlooking numbers-to-words typos ($10k vs $100k) sparking litigation.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>{isRtl ? 'رفع مسودات صفقات الاستحواذ السرية لخوادم سحابية ينتهك قواعد السلوك المهني.' : 'Uploading sensitive client M&A drafts to cloud AI violates ABA Rule 1.6.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>{isRtl ? 'نسيان فراغات [TBD] في المسودة النهائية يمنح الخصم ثغرات تعاقدية.' : 'Leftover [TBD] brackets in executed versions create exploitable loopholes.'}</span>
                </li>
              </ul>
            </div>

            {/* The ContractGuard Enterprise Way */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#06141A] border-2 border-nexus-emerald border-t-white/30 relative shadow-[0_0_50px_rgba(0,255,157,0.15)]">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-nexus-emerald/15 text-nexus-emerald flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.2)]">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isRtl ? 'مع Nexus ContractGuard Enterprise' : 'With Nexus ContractGuard Enterprise 2.0'}
                  </h3>
                  <span className="text-xs text-nexus-emerald font-mono">
                    {isRtl ? 'تدقيق فوري في 400ms + عزل هوائي كامل' : '400ms Audit In-Memory + 100% Air-Gapped Confidentiality'}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 text-xs md:text-sm text-zinc-200">
                <li className="flex items-start gap-3">
                  <span className="text-nexus-emerald font-bold shrink-0">✓</span>
                  <span>{isRtl ? 'كشف حتمي وتلقائي بنسبة 100% لكافة المراجع المكسورة والملاحق المفقودة.' : '100% deterministic scan of all broken citations & missing exhibits.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-emerald font-bold shrink-0">✓</span>
                  <span>{isRtl ? 'مطابقة رياضية وفورية بين المبالغ المكتوبة بالأرقام وتلك المكتوبة بالكلمات.' : 'Instant mathematical verification between written words & parenthetical numbers.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-emerald font-bold shrink-0">✓</span>
                  <span>{isRtl ? 'أمان كامل طبقاً لـ ABA Model Rule 1.6: لا يغادر حرف واحد ذاكرة جهازك.' : 'Zero server telemetry: complete compliance with ABA Model Rule 1.6.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-nexus-emerald font-bold shrink-0">✓</span>
                  <span>{isRtl ? 'توليد مذكرة العميل التنفيذية بضغطة زر بصيغة PDF وطباعة معتمدة للمحكمة.' : '1-Click Executive Client Memorandum generated in court-ready PDF format.'}</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE 5 SPECIALIZED ENGINES (Structured Deep Dive)                       */}
        {/* ========================================================================= */}
        <section id="engines" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-nexus-cyan uppercase tracking-wider bg-nexus-cyan/10 border border-nexus-cyan/20 px-3.5 py-1 rounded-full">
              {isRtl ? 'المعمارية التقنية الخماسية' : 'THE 5-IN-1 INTEGRITY ENGINES'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] apple-display-heading text-white mt-4">
              {isRtl ? 'خمسة محركات فحص مستقلة تعمل في آن واحد' : 'Five Synchronous Engines Running Client-Side'}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2.5">
              {isRtl 
                ? 'مدعومة بتقنية Web Worker غير المعطلة لواجهة المستخدم لفحص العقود الطويلة دون أي تباطؤ.'
                : 'Powered by dedicated non-blocking Web Workers capable of parsing 15,000+ words in milliseconds.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Engine 1 */}
            <div className="p-7 md:p-8 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-nexus-emerald/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-nexus-emerald/10 text-nexus-emerald flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(0,255,157,0.15)]">
                  <Search size={22} />
                </div>
                <div className="text-[11px] font-mono text-nexus-emerald mb-1 font-bold">ENGINE 01</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'كاشف المراجع والملاحق المفقودة' : 'Cross-Reference & Exhibit Hunter'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {isRtl 
                    ? 'يمسح نصوص العقد لكشف كل إحالة لبند (Section 4.2 أو Exhibit B) ويتأكد من وجودها ومطابقتها داخل المستند.'
                    : 'Scans all internal section citations and schedules, flagging deleted clauses or orphaned attachments.'
                  }
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                {isRtl ? '✓ استخراج وفهرسة الملاحق A-Z' : '✓ Full A-Z Exhibit & Section index'}
              </div>
            </div>

            {/* Engine 2 */}
            <div className="p-7 md:p-8 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-nexus-emerald/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                  <TrendingDown size={22} />
                </div>
                <div className="text-[11px] font-mono text-amber-400 mb-1 font-bold">ENGINE 02</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'مدقق المبالغ والتواريخ المتعارضة' : 'Financial & Chronology Auditor'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {isRtl 
                    ? 'يطابق الكلمات بالأرقام ويكتشف المفارقات الزمنية مثل فترات الإشعار المتناقضة وتواريخ السريان المستحيلة.'
                    : 'Reconciles spelled-out currency with parenthetical numbers, and detects chronological timeline paradoxes.'
                  }
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                {isRtl ? '✓ مطابقة الكلمات والرموز المالية' : '✓ Word-to-numeral mathematical check'}
              </div>
            </div>

            {/* Engine 3 */}
            <div className="p-7 md:p-8 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-nexus-emerald/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-purple-400/10 text-purple-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(192,132,252,0.15)]">
                  <FileText size={22} />
                </div>
                <div className="text-[11px] font-mono text-purple-400 mb-1 font-bold">ENGINE 03</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'صياد المصطلحات وفراغات المسودات' : 'Defined Terms & Boilerplate Hunter'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {isRtl 
                    ? 'يصطاد المصطلحات المكتوبة بحرف كبير دون تعريف في المادة 1، ويكتشف علامات [TBD] وفراغات العقود السابقة.'
                    : 'Catches capitalized terms used without formal definition, alongside placeholder brackets like [TBD].'
                  }
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                {isRtl ? '✓ فحص ميثاق التعريفات والمسودات' : '✓ Full definitions registry audit'}
              </div>
            </div>

            {/* Engine 4 */}
            <div className="p-7 md:p-8 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-nexus-emerald/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-nexus-cyan/10 text-nexus-cyan flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                  <Briefcase size={22} />
                </div>
                <div className="text-[11px] font-mono text-nexus-cyan mb-1 font-bold">ENGINE 04</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'مصفوفة الالتزامات والحقوق التعاقدية' : 'Obligations & Rights Matrix'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {isRtl 
                    ? 'يصنف بنود العقد حسب الطرف الملزم ودرجة الإلزام (Shall / Must / Agrees to / May) لتسليم العميل خلاصة واضحة.'
                    : 'Extracts and classifies covenants by contracting party and legal weight (Shall / Must / May).'
                  }
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                {isRtl ? '✓ فرز التزامات الطرف الأول والثاني' : '✓ Party-by-party covenant sorting'}
              </div>
            </div>

            {/* Engine 5 */}
            <div className="p-7 md:p-8 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-nexus-emerald/40 transition-all flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-nexus-emerald/10 text-nexus-emerald flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(0,255,157,0.15)]">
                  <Download size={22} />
                </div>
                <div className="text-[11px] font-mono text-nexus-emerald mb-1 font-bold">ENGINE 05 • WHITE-LABEL</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isRtl ? 'توليد مذكرة العميل التنفيذية المعتمدة (1-Click Client Memo)' : '1-Click Executive Client Memorandum (PDF & HTML)'}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  {isRtl 
                    ? 'يحول نتائج التدقيق المعقدة إلى مذكرة قانونية تنفيذية فخمة جاهزة للتقديم للعميل أو الشركاء بصيغة PDF رسمية، تتضمن مؤشرات الخطورة وتفاصيل الملاحظات مع إمكانية وضع شعار واسم مكتبك.'
                    : 'Converts technical audit findings into an executive-ready legal memorandum for clients or senior partners, complete with risk matrices, findings breakdowns, and printable court-grade styling.'
                  }
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span>✓ HTML & Clean Print Layout</span>
                <span>✓ Color-Coded Risk Heatmap</span>
                <span>✓ Client-Facing Summary</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. ETHICS & PRIVACY: ABA MODEL RULE 1.6 ARCHITECTURE                      */}
        {/* ========================================================================= */}
        <section id="security" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#050C10] to-[#020608] border border-nexus-emerald/30 border-t-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Subtle Apple Ambient Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-nexus-emerald/10 blur-[130px] rounded-full pointer-events-none"></div>

            <div className="max-w-3xl mb-10 relative z-10">
              <span className="font-mono text-xs font-bold text-nexus-emerald uppercase tracking-wider bg-nexus-emerald/10 border border-nexus-emerald/20 px-3.5 py-1 rounded-full">
                {isRtl ? 'الامتثال وأخلاقيات المحاماة' : 'LEGAL ETHICS & PRIVILEGE'}
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-[-0.03em] apple-display-heading text-white mt-4 mb-3">
                {isRtl ? 'لماذا يرفض كبار المحامين أدوات الذكاء الاصطناعي السحابية؟' : 'Why Boutique Law Firms Trust Nexus ContractGuard'}
              </h2>
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                {isRtl 
                  ? 'بموجب القاعدة 1.6 من قواعد السلوك المهني لنقابة المحامين الأمريكية (ABA Model Rule 1.6)، يلتزم المحامي قانونياً باتخاذ تدابير صارمة لمنع الكشف غير المقصود عن بيانات الموكلين. إدخال بنود العقود في روبوتات الدردشة أو السيرفرات السحابية يعرضك لمخاطر شطب السرية المهنية ومسؤولية التقصير.'
                  : 'Under ABA Model Rule 1.6(c), attorneys have an affirmative duty to make reasonable efforts to prevent inadvertent disclosure of confidential client data. Feeding confidential transaction drafts into multi-tenant cloud APIs waives attorney-client privilege.'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 border-t-white/20 shadow-lg hover:border-nexus-emerald/40 transition-all">
                <Shield size={22} className="text-nexus-emerald mb-3.5" />
                <h4 className="text-sm font-bold text-white mb-2">
                  {isRtl ? 'معالجة محلية بنسبة 100%' : '100% In-Browser Execution'}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isRtl ? 'تتم كافة العمليات في ذاكرة المتصفح عبر Web Worker مشفر دون أي تواصل مع سيرفرات.' : 'All grammatical, chronological, and citation algorithms execute in client memory.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 border-t-white/20 shadow-lg hover:border-nexus-cyan/40 transition-all">
                <EyeOff size={22} className="text-nexus-cyan mb-3.5" />
                <h4 className="text-sm font-bold text-white mb-2">
                  {isRtl ? 'صفر تتبع وتخزين للبيانات' : 'Zero Telemetry & Storage'}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isRtl ? 'لا يتم تسجيل أو تخزين أو الاحتفاظ بأي كلمة من عقودك أو ملاحقك في أي مكان.' : 'Zero analytics, no remote logging, and no persistent cloud caching.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/60 border border-white/10 border-t-white/20 shadow-lg hover:border-purple-400/40 transition-all">
                <Lock size={22} className="text-purple-400 mb-3.5" />
                <h4 className="text-sm font-bold text-white mb-2">
                  {isRtl ? 'لا تدريب لنماذج الذكاء' : 'Zero AI Model Training'}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {isRtl ? 'أسرار صفقاتك ومفاوضاتك لن تتحول أبداً إلى بيانات تدريبية لأي نموذج لغوي خارجي.' : 'Your proprietary deal structures and negotiation redlines are never used for model training.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. TRANSPARENT B2B PRICING (Lifetime Ownership, Zero Subscriptions)        */}
        {/* ========================================================================= */}
        <section id="pricing" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold text-nexus-emerald uppercase tracking-wider bg-nexus-emerald/10 border border-nexus-emerald/20 px-3.5 py-1 rounded-full">
              {isRtl ? 'تسعير مباشر وشفاف' : 'PERPETUAL B2B LICENSING'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] apple-display-heading text-white mt-4">
              {isRtl ? 'رخصة دائمة لمدى الحياة. بدون اشتراكات شهرية.' : 'One-Time Investment. Lifetime Ownership.'}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2.5">
              {isRtl 
                ? 'تخلص من استنزاف الاشتراكات السحابية الشهرية ($1,500/شهر) وامتلك أداتك القانونية محلياً.'
                : 'Eliminate recurring SaaS subscription drains ($1,500/yr) with clean offline cryptographic ownership.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Solo Plan Card */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#060D12] border border-white/10 border-t-white/20 hover:border-nexus-emerald/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {isRtl ? 'رخصة المستشار الفردي (Solo Counsel)' : 'Solo Counsel License'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isRtl ? 'مثالية للمحامي المستقل والمستشارين القانونيين الداخليين.' : 'Ideal for solo attorneys, general counsels, and boutique dealmakers.'}
                    </p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-white font-mono tabular-nums">$199</span>
                    <span className="text-base text-zinc-500 line-through font-mono tabular-nums">$499</span>
                    <span className="text-xs text-nexus-emerald font-mono font-bold uppercase tracking-wider">
                      {isRtl ? 'دفعة واحدة للأبد' : 'LIFETIME ACCESS'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    {isRtl ? 'صفر رسوم دورية • مفتاح أوفلاين مشفر وفوري' : 'Zero monthly fees • Instant offline cryptographic activation'}
                  </p>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-zinc-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'مقعد محامي دائم لمدى الحياة (1 Seat)' : '1 Lifetime Attorney Seat'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'فحص غير محدود للعقود ومسودات الـ NDA' : 'Unlimited Contract & NDA Audits'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'كاشف المراجع المكسورة وتضارب المبالغ المكتوبة' : 'Broken Cross-Ref & Financial Words Reconciler'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'تصدير مذكرة العميل التنفيذية (HTML & PDF)' : 'Executive Client Memorandum Export (HTML & PDF)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'معالجة محلية 100% بدون خوادم خارجية' : '100% In-Browser Execution (Zero Telemetry)'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'solo',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-xs md:text-sm cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <Lock size={15} className="text-emerald-400" />
                  <span>{isRtl ? 'شراء رخصة المستشار الفردي ($199)' : 'Purchase Solo License ($199)'}</span>
                </button>
              </div>
            </div>

            {/* Law Firm Suite (Most Popular) */}
            <div className="p-8 md:p-10 rounded-3xl bg-[#06141A] border-2 border-nexus-emerald border-t-white/30 relative shadow-[0_0_50px_rgba(0,255,157,0.15)] flex flex-col justify-between">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-nexus-emerald text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                {isRtl ? 'الأكثر طلباً للشركات والمكاتب' : 'MOST POPULAR FOR FIRMS'}
              </div>

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {isRtl ? 'رخصة مكاتب المحاماة (Law Firm Suite)' : 'Law Firm & Team Suite'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {isRtl ? 'مصممة لمكاتب المحاماة والفرق القانونية متعددة المستشارين.' : 'Engineered for law firms, advisory departments, and multi-user teams.'}
                    </p>
                  </div>
                </div>

                <div className="my-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-nexus-emerald font-mono tabular-nums">$299</span>
                    <span className="text-base text-zinc-500 line-through font-mono tabular-nums">$799</span>
                    <span className="text-xs text-nexus-emerald font-mono font-bold uppercase tracking-wider">
                      {isRtl ? 'دفعة واحدة للأبد' : 'LIFETIME FIRM LICENSE'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    {isRtl ? 'ترخيص كامل لفريق العمل • يوفر أكثر من $1,800 سنوياً' : 'Replaces $1,800/yr per-seat cloud proofreading subscriptions'}
                  </p>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-zinc-200">
                  <div className="flex items-center gap-2.5 font-semibold">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'حتى 5 مقاعد للمحامين والمساعدين القانونيين' : 'Up to 5 Attorney & Paralegal Seats'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'كافة المحركات الخماسية المتقدمة بما فيها مصفوفة الالتزامات' : 'All 5 Advanced Integrity Engines + Obligations Matrix'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'تخصيص المذكرات القانونية بهوية وشعار مكتبك (White-Label)' : 'White-Label Branding on Executive Client Memorandums'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'ترقيم Bates القضائي وطمس البيانات الحساسة (PII Redaction)' : 'Court Bates Stamping & Sensitive PII Redactor'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'أولوية في الدعم الفني وتحديثات المحرك الدائمة' : 'Priority Enterprise Support & Engine Updates'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => openSeamlessCheckout({
                    plan: 'firm',
                    toolName: 'contractcompare',
                    onSuccess: () => navigate('/app/contractcompare')
                  })}
                  className="w-full bg-nexus-emerald text-black hover:bg-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,255,157,0.4)] text-xs md:text-sm cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={15} />
                  <span>{isRtl ? 'شراء رخصة مكاتب المحاماة ($299)' : 'Purchase Law Firm Suite ($299)'}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FREQUENTLY ASKED QUESTIONS (Accordion)                                 */}
        {/* ========================================================================= */}
        <section id="faq" className="px-6 md:px-12 lg:px-20 max-w-4xl mx-auto mb-28 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              FAQ
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3">
              {isRtl ? 'الأسئلة الشائعة حول الأداة والترخيص' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: isRtl ? 'كيف تضمن الأداة سرية العقود 100% وتوافقها مع معيار ABA Model Rule 1.6؟' : 'How does ContractGuard guarantee 100% privacy and ABA Model Rule 1.6 compliance?',
                a: isRtl ? 'الأداة مبنية بمعمارية In-RAM Local-First بالكامل؛ حيث تُعالج النصوص داخل خيوط الذاكرة المؤقتة (Web Worker) في متصفحك دون إرسال بايت واحد إلى أي خادم خارجي أو ذكاء اصطناعي سحابي، مما يحمي السرية المهنية وحصانة المحامي وموكله بشكل مطلق.' : 'The software executes 100% client-side inside non-blocking Web Workers in local browser RAM. Zero bytes are uploaded to external servers or cloud AI models, perfectly preserving attorney-client privilege under ABA Model Rule 1.6.'
              },
              {
                q: isRtl ? 'هل يمكنني فحص مسودات عقودي الحقيقية مجاناً قبل الشراء؟' : 'Can I audit my own active contract drafts for free before purchasing?',
                a: isRtl ? 'نعم! نمنح كل ممارس قانوني 3 محاولات تدقيق كاملة مجانية (3 Full Evaluation Passes) بدون أي حجب للنتائج. يمكنك لصق أو رفع عقودك الخاصة ومشاهدة كشف التضارب المالي والمراجع المكسورة بنفسك.' : 'Yes. We provide 3 full, unrestricted evaluation passes with zero paywalls. You can upload or paste your real transaction drafts and experience all 5 detection engines before deciding to buy.'
              },
              {
                q: isRtl ? 'كيف يعمل قفل الجهاز (Hardware Binding) وهل يمكنني نقل الترخيص لكمبيوتر جديد؟' : 'How does hardware-locked licensing work, and can I transfer my seat to a new computer?',
                a: isRtl ? 'يرتبط الترخيص ببصمة عتاد جهازك (Hardware Fingerprint) لمنع القرصنة. وإذا اشتريت حاسوباً جديداً، يمكنك بضغطة زر واحدة (Deactivate from this Device) تحرير المفتاح وإعادة تفعيله على جهازك الجديد بكل سهولة.' : 'Each license binds cryptographically to your device hardware fingerprint. If you upgrade laptops or switch workstations, a single click on "Deactivate from this Device" releases the key for immediate activation on your new machine.'
              },
              {
                q: isRtl ? 'كيف تعمل رخصة مكاتب المحاماة (Law Firm Suite - 5 مقاعد)؟' : 'How does the Law Firm Suite (5 Users) license distribute across our team?',
                a: isRtl ? 'تستلم فوراً حزمة تراخيص مشفرة تتضمن 5 مفاتيح مستقلة: مفتاح لمحطتك الرئيسية، و4 مفاتيح يمكنك نسخها أو إرسالها لزملائك المحامين والمساعدين، مع إمكانية تصدير الحزمة بملف نصي منظم.' : 'You instantly receive 5 unique cryptographic seat keys: one activates your primary workstation, and 4 standalone keys can be shared with associates and paralegals via 1-click copy or text bundle export.'
              },
              {
                q: isRtl ? 'ما هي صيغ الملفات المدعومة للتدقيق؟' : 'Which contract formats and document types are supported?',
                a: isRtl ? 'تدعم الأداة ملفات Microsoft Word (.docx)، ملفات PDF الرقمية، لصق النصوص المباشر، ومسح الصور والمستندات الورقية عبر محرك التعرف الضوئي المحلي (In-RAM OCR).' : 'ContractGuard natively audits Microsoft Word (.docx), digital PDF contracts, raw text paste, and scanned paper agreements via integrated client-side In-RAM OCR.'
              },
              {
                q: isRtl ? 'هل توجد أي رسوم أو اشتراكات شهرية متكررة مستقبلاً؟' : 'Are there any recurring monthly subscriptions or hidden renewal fees?',
                a: isRtl ? 'لا على الإطلاق. الشراء لمرة واحدة فقط بترخيص دائم مدى الحياة ($199 للمستشار الفردي / $299 لمكاتب المحاماة)، مما يوفر أكثر من 1,800 دولار سنوياً مقارنة باشتراكات البرامج السحابية التقليدية.' : 'Zero recurring fees. You pay a single one-time fee ($199 Solo / $299 Firm) for permanent perpetual access, saving $1,800+ annually over legacy recurring cloud tools.'
              }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-[#060D12] overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-5 text-left ${isRtl ? 'text-right' : 'text-left'} flex items-center justify-between text-sm md:text-base font-bold text-white hover:text-nexus-emerald transition-colors`}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className={`transform transition-transform text-zinc-400 ${activeFaq === idx ? 'rotate-180 text-nexus-emerald' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. GRAND CLOSING CALL TO ACTION (Apple Signature Closer)                  */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto mb-28">
          <div className="relative rounded-3xl p-10 md:p-16 overflow-hidden bg-gradient-to-b from-[#06141A] via-[#040B0E] to-[#020608] border border-nexus-emerald/30 border-t-white/20 shadow-[0_20px_80px_rgba(0,255,157,0.12)] text-center">
            {/* Ambient Apple Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-nexus-emerald/15 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="font-mono text-xs font-bold text-nexus-emerald uppercase tracking-wider bg-nexus-emerald/10 border border-nexus-emerald/20 px-3.5 py-1 rounded-full mb-6 inline-block">
                {isRtl ? 'حماية شاملة للمكتب والموكل' : 'PRE-SIGNING CONTRACT CERTAINTY'}
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[-0.03em] apple-display-heading leading-tight mb-5">
                {isRtl 
                  ? 'لا توقع عقداً يحتوي ثغرة كارثية بعد اليوم.' 
                  : 'Never Sign a Defective Contract Again.'}
              </h2>
              
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                {isRtl 
                  ? 'انضم للمحامين والمستشارين الذين حوّلوا مراجعة العقود من ساعات من الإجهاد إلى تدقيق آلي فوري في أقل من نصف ثانية وبسرية مطلقة 100% داخل المتصفح.' 
                  : 'Join modern boutique firms and counsel who transformed contract integrity audits from 6 hours of fatigue into 167 milliseconds of local in-RAM certainty.'}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/demo')}
                  className="bg-nexus-emerald text-black px-8 py-4 rounded-xl font-black text-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,255,157,0.4)] flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>{isRtl ? '⚡ تجربة الديمو التفاعلي مجاناً' : '⚡ Start Free Interactive Audit'}</span>
                  <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
                </button>
                
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Lock size={15} className="text-nexus-cyan" />
                  <span>{isRtl ? 'عرض باقات التراخيص ($199 / $299)' : 'View Perpetual Plans ($199 / $299)'}</span>
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-nexus-emerald" />
                  {isRtl ? 'معالجة محلية 100%' : '100% In-RAM Audit'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-nexus-emerald" />
                  {isRtl ? 'ترخيص دائم مدى الحياة' : 'Perpetual Lifetime Key'}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-nexus-emerald" />
                  {isRtl ? 'متوافق مع ABA Model Rule 1.6' : 'ABA Rule 1.6 Compliant'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. ENTERPRISE FOOTER WITH LEGAL PROTECTION NOTICE                         */}
        {/* ========================================================================= */}
        <footer className="border-t border-white/10 py-10 px-6 md:px-12 lg:px-20 text-xs text-zinc-400">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-nexus-emerald" />
              <span className="font-bold text-white">Nexus ContractGuard Enterprise 2.0</span>
            </div>
            <div>
              {isRtl ? '© 2026 NexusOS Enterprise. مرخصة ومحمية بأنظمة التشفير المحلية.' : '© 2026 NexusOS Enterprise. Air-gapped and protected by offline local cryptography.'}
            </div>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-zinc-400 hover:text-nexus-emerald transition-colors"
            >
              nexus.os.store@gmail.com
            </button>
          </div>

          {/* Legal Protection Shield / Malpractice Disclaimer Banner */}
          <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-zinc-400 leading-relaxed text-center max-w-4xl mx-auto font-mono">
            <p>
              <strong className="text-zinc-300">LEGAL NOTICE & DISCLAIMER:</strong> {isRtl 
                ? 'ContractGuard هو مساعد آلي لتدقيق ومراجعة المستندات، ولا يقدم تمثيلاً قانونياً ولا يُعد بديلاً عن المراجعة القانونية المهنية للمحامي. يتحمل المستخدم المسؤولية المهنية الكاملة عن اعتماد ومراجعة كافة بنود العقود قبل توقيعها رسمياً.'
                : 'ContractGuard is an automated document proofreading assistant. It does not provide legal representation or substitute professional attorney review. Users retain sole professional responsibility for verifying all contract terms prior to legal execution.'
              }
            </p>
          </div>
        </footer>

      </main>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        services={["Nexus ContractGuard Enterprise"]}
      />
    </div>
  );
}
