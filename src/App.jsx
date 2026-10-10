import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Search, 
  BarChart, 
  ArrowRight,
  Cpu,
  MessageSquare,
  Globe,
  X,
  Monitor,
  Wrench,
  Hexagon
, Shield, Zap, TrendingDown, Briefcase, CheckCircle2} from 'lucide-react';
import Nexus3DNode from './components/Nexus3DNode';
import ContactModal from './components/ContactModal';

// Language configuration
const languages = [
  { code: 'en', name: 'English', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'ar', name: 'العربية', fontBody: 'font-["Almarai"]', fontHeading: 'font-["Almarai"]', dir: 'rtl' },
  { code: 'es', name: 'Español', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'fr', name: 'Français', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'tr', name: 'Türkçe', fontBody: 'font-body', fontHeading: 'font-heading' },
  { code: 'ja', name: '日本語', fontBody: 'font-["Noto_Sans_JP"]', fontHeading: 'font-["Noto_Sans_JP"]' },
  { code: 'zh', name: '中文', fontBody: 'font-["Noto_Sans_SC"]', fontHeading: 'font-["Noto_Sans_SC"]' },
];

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      variants={{
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' }
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  /* Force Netlify Build Trigger */
  const { t, i18n } = useTranslation();
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
  const isRtl = currentLang.dir === 'rtl';
  const navigate = useNavigate();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Set direction on body
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [isRtl]);

  const scrollToProducts = () => {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

      const products = [
      { id: 'leadscrub', icon: Shield, titleKey: 'prod_leadscrub_title', priceKey: 'prod_leadscrub_price', descKey: 'prod_leadscrub_desc' },
      { id: 'ecommatch', icon: Zap, titleKey: 'prod_ecommatch_title', priceKey: 'prod_ecommatch_price', descKey: 'prod_ecommatch_desc' },
      { id: 'contractcompare', icon: Hexagon, titleKey: 'prod_contractcompare_title', priceKey: 'prod_contractcompare_price', descKey: 'prod_contractcompare_desc' },
      { id: 'adspendaudit', icon: TrendingDown, titleKey: 'prod_adspendaudit_title', priceKey: 'prod_adspendaudit_price', descKey: 'prod_adspendaudit_desc' }
    ];

  return (
    <div className={`bg-nexus-bg min-h-screen text-white overflow-x-hidden selection:bg-nexus-emerald selection:text-black ${currentLang.fontBody} ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-nexus-emerald rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-nexus-mint rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      <nav className="fixed w-full z-40 top-0 py-4 px-6 md:px-12 flex justify-between items-center bg-[#020608]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="NexusOS Logo" className="h-10" />
          <span className={`${currentLang.fontHeading} text-2xl md:text-3xl tracking-wider text-white font-bold`}>
            {t('nav_brand')}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setIsContactModalOpen(true)} className="hidden md:block text-gray-300 hover:text-white transition-colors text-sm font-semibold uppercase mx-2">
            {t('nav_contact')}
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 liquid-glass px-4 py-2 rounded-full text-nexus-mint hover:bg-white/5 transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm font-semibold uppercase">{i18n.language}</span>
            </button>
            
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 liquid-glass-strong border border-nexus-emerald/30 rounded-xl overflow-hidden flex flex-col z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`text-left px-4 py-2 text-sm text-gray-300 hover:bg-nexus-emerald/20 hover:text-white transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={scrollToProducts} className={`hidden md:block liquid-glass px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors uppercase tracking-widest text-nexus-mint border border-nexus-mint/30`}>
            {t('nav_btn')}
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-20">
        <section className="px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 w-full z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-1.5 mb-6 border border-nexus-emerald/30"
            >
              <span className="w-2 h-2 rounded-full bg-nexus-mint animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest text-nexus-mint uppercase">{t('hero_status')}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`${currentLang.fontHeading} text-5xl md:text-7xl lg:text-[6rem] leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500`}
              dangerouslySetInnerHTML={{ __html: t('hero_title') }}
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-8"
            >
              {t('hero_desc')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={scrollToProducts} className="bg-nexus-emerald text-black px-10 py-5 rounded-full font-extrabold text-xl hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,255,157,0.6)] animate-pulse">
                {t('btn_deploy')}
              </button>
            </motion.div>
          </div>

          <div className="flex-1 w-full relative z-0 flex items-center justify-center min-h-[40vh] lg:min-h-[60vh] drop-shadow-[0_0_50px_rgba(0,255,157,0.2)]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="w-full h-full absolute inset-0"
            >
              <Nexus3DNode />
            </motion.div>
          </div>
        </section>

        {/* Smart Marketing Separator */}
        <section className="px-6 md:px-12 lg:px-24 mt-12 mb-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="liquid-glass border border-nexus-emerald/20 p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-emerald to-transparent"></div>
              <h2 className={`${currentLang.fontHeading} text-2xl md:text-3xl mb-4 font-bold text-white leading-relaxed`}>
                {isRtl 
                  ? 'في هذه اللحظة، هناك شركة تدفع آلاف الدولارات شهرياً لأدوات سحابية تسرب بياناتها وتستنزف أرباحها.' 
                  : 'Right now, an agency is bleeding thousands of dollars on cloud APIs that secretly leak their data.'}
              </h2>
              <p className="text-nexus-emerald text-lg font-medium">
                {isRtl 
                  ? 'الإمبراطوريات الكبرى لا تُبنى على البرمجيات المستأجرة.. إما أن تمتلك بنيتك التحتية محلياً، أو تشاهد أرباحك تنهار ببطء.' 
                  : 'Empires are not built on rented software. Own your infrastructure locally, or watch your profit margins slowly collapse.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Flagship Spotlight: Nexus ContractGuard Enterprise 2.0 */}
        <section className="px-6 md:px-12 lg:px-24 mb-16 relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="liquid-glass-strong rounded-3xl p-8 md:p-12 border-2 border-nexus-emerald/50 shadow-[0_0_60px_rgba(0,255,157,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-nexus-emerald/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-nexus-emerald/15 text-nexus-emerald border border-nexus-emerald/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <Shield size={14} className="text-nexus-emerald" />
                  {isRtl ? 'المنتج الرئيسي الفائز • معزول هوائياً 100%' : 'Flagship B2B Suite • 100% Air-Gapped (ABA Rule 1.6)'}
                </div>
                
                <h2 className={`${currentLang.fontHeading} text-3xl md:text-5xl font-black text-white mb-4 leading-tight`}>
                  {isRtl 
                    ? 'Nexus ContractGuard Enterprise 2.0' 
                    : 'Nexus ContractGuard Enterprise 2.0'}
                </h2>
                
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                  {isRtl 
                    ? 'شبكة الأمان القانونية المتكاملة قبل التوقيع. تكشف المراجع المكسورة (Section 8.2)، تضارب المبالغ المكتوبة بالأرقام والكلمات، والمصطلحات المعرفة، وبقايا العقود السابقة محلياً بالكامل داخل متصفحك — بدون أن تغادر كلمة واحدة جهازك.' 
                    : 'The automated pre-signing defense system for attorneys and boutique law firms. Catches broken cross-references, word-to-number financial mismatches, undefined terms, and leftover boilerplate 100% in-browser with zero cloud exposure.'}
                </p>

                {/* Core Feature Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-2xl">
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200">
                    <Hexagon size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'كاشف المراجع والملاحق المفقودة (Cross-Refs)' : 'Broken Section & Missing Exhibit Hunter'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200">
                    <TrendingDown size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'مطابقة المبالغ والتواريخ المتعارضة' : 'Financial Figure-to-Word & Date Discrepancies'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200">
                    <Briefcase size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'مصفوفة التزامات كل طرف تعاقدي' : 'Contractual Obligations Matrix (Shall/Must)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200">
                    <Zap size={16} className="text-nexus-emerald shrink-0" />
                    <span>{isRtl ? 'توليد مذكرة العميل التنفيذية بضغطة زر' : '1-Click Executive Client Memorandum (PDF)'}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => navigate('/app/contractcompare')}
                    className="bg-nexus-emerald text-black px-8 py-4 rounded-2xl font-black text-base hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,157,0.4)] flex items-center gap-2"
                  >
                    <span>{isRtl ? 'فتح بيئة العمل القانونية والتجربة' : 'Launch ContractGuard Studio'}</span>
                    <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
                  </button>
                  <button
                    onClick={() => navigate('/product/contractcompare')}
                    className="liquid-glass border border-white/10 text-white px-6 py-4 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all"
                  >
                    {isRtl ? 'تفاصيل الرخصة والتسعير ($199 / $299)' : 'View Licensing & Pricing ($199 / $299)'}
                  </button>
                </div>
              </div>

              {/* Price / ROI Side Card */}
              <div className="w-full lg:w-72 bg-black/60 border border-nexus-emerald/30 rounded-2xl p-6 flex flex-col justify-between shrink-0">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    {isRtl ? 'ترخيص دائم لمدى الحياة' : 'Lifetime Enterprise License'}
                  </span>
                  <div className="text-3xl font-black text-white mt-2 mb-1 flex items-baseline gap-2">
                    <span className="text-nexus-mint">$199</span>
                    <span className="text-xs font-normal text-gray-400 line-through">$499</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                    {isRtl 
                      ? 'يوفر 6+ ساعات أسبوعياً من عمل المحامي ($1,500/شهر) بدون أي اشتراكات سحابية.' 
                      : 'Saves 6+ hours/week of paralegal review ($1,500/mo) with zero recurring cloud fees.'}
                  </p>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-nexus-emerald" />
                    <span>{isRtl ? 'معالجة محلية 100%' : '100% In-Browser Engine'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-nexus-emerald" />
                    <span>{isRtl ? 'صفر رسوم اشتراك شهرية' : 'Zero Monthly Subscriptions'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-nexus-emerald" />
                    <span>{isRtl ? 'ترقيم قضائي وطمس PII غير محدود' : 'Unlimited Bates & PII Redaction'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Instantly Visible Products Grid */}
        <section id="products-section" className="px-6 md:px-12 lg:px-24 mt-12 md:mt-20 scroll-mt-32">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-12"
          >
            <h2 className={`${currentLang.fontHeading} text-4xl md:text-5xl mb-4 bg-emerald-gradient bg-clip-text text-transparent`}>
              {t('section_modules_title')}
            </h2>
            <p className="text-xl text-gray-400">{t('section_modules_desc')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {products.map((prod, idx) => (
              <FadeInWhenVisible key={prod.id} delay={idx * 0.1}>
                <div 
                  onClick={() => navigate(`/product/${prod.id}`)}
                  className="liquid-glass-strong rounded-3xl p-8 h-full flex flex-col group cursor-pointer border border-white/5 hover:border-nexus-emerald/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,255,157,0.1)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-nexus-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl liquid-glass flex items-center justify-center text-nexus-mint group-hover:scale-110 group-hover:text-white transition-all duration-500">
                      <prod.icon size={28} />
                    </div>
                    <div className="bg-black/50 border border-nexus-emerald/30 px-4 py-1.5 rounded-full">
                      <span className={`${currentLang.fontHeading} text-xl text-nexus-mint font-bold`}>{t(prod.priceKey)}</span>
                    </div>
                  </div>
                  <h3 className={`${currentLang.fontHeading} text-2xl mb-3 text-white group-hover:text-nexus-emerald transition-colors duration-300 relative z-10`}>
                    {t(prod.titleKey)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed flex-1 relative z-10">
                    {t(prod.descKey)}
                  </p>
                  <div className="mt-6 flex items-center text-nexus-mint text-sm font-bold tracking-wide uppercase relative z-10">
                    <span className={`transition-all duration-300 ${isRtl ? 'group-hover:ml-2' : 'group-hover:mr-2'}`}>{t('btn_view')}</span>
                    <ArrowRight size={16} className={`transform ${isRtl ? 'rotate-180 mr-2 group-hover:-translate-x-2' : 'ml-2 group-hover:translate-x-2'} transition-transform duration-300`} />
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </section>



        <ContactModal 
          isOpen={isContactModalOpen} 
          onClose={() => setIsContactModalOpen(false)} 
          services={products.map(p => t(p.titleKey))}
        />

        <footer className="border-t border-white/5 py-8 px-6 md:px-12 lg:px-24 mt-20">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto opacity-60">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Cpu className="text-nexus-emerald" size={20} />
              <span className={`${currentLang.fontHeading} text-lg`}>{t('nav_brand')}</span>
            </div>
            <button onClick={() => setIsContactModalOpen(true)} className="text-sm hover:text-nexus-mint transition-colors">nexus.os.store@gmail.com</button>
            <p className="text-sm">© 2026 NexusOS Enterprise.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
