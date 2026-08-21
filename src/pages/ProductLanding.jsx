import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Play, CheckCircle2, Shield, Zap, ArrowLeft, Bot, MessageSquare, Search, Monitor, Wrench, Hexagon } from 'lucide-react';

const productsData = {
  'lead': { icon: Search, titleKey: 'prod_lead_title', priceKey: 'prod_lead_price', painKey: 'modal_lead_pain', agitateKey: 'modal_lead_agitate', solveKey: 'modal_lead_solve', link: 'http://localhost:3000/login' },
  'wa': { icon: MessageSquare, titleKey: 'prod_wa_title', priceKey: 'prod_wa_price', painKey: 'modal_wa_pain', agitateKey: 'modal_wa_agitate', solveKey: 'modal_wa_solve', link: 'http://localhost:3000/login' },
  'ai-agent': { icon: Bot, titleKey: 'prod_ai_title', priceKey: 'prod_ai_price', painKey: 'modal_ai_pain', agitateKey: 'modal_ai_agitate', solveKey: 'modal_ai_solve', link: 'http://localhost:3000/login' }
};

export default function ProductLanding() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  
  const product = productsData[productId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h2>Product not found.</h2>
        <button onClick={() => navigate('/')} className="ml-4 text-nexus-emerald">Go Back</button>
      </div>
    );
  }

  const fontBody = isRtl ? 'font-arabic' : 'font-sans';
  const fontHeading = isRtl ? 'font-arabic-heading' : 'font-display';

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-nexus-emerald/30 overflow-x-hidden ${fontBody} ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-emerald blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nexus-mint blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
          <div className={`${fontHeading} text-2xl font-bold text-white tracking-tighter`}>
            Nexus<span className="text-nexus-emerald">OS</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl liquid-glass text-nexus-emerald mb-6">
            <product.icon size={40} />
          </div>
          <h1 className={`${fontHeading} text-4xl md:text-6xl font-bold mb-6 bg-emerald-gradient bg-clip-text text-transparent`}>
            {t(product.titleKey)}
          </h1>
        </motion.div>

        {/* Video Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full aspect-video liquid-glass-strong rounded-3xl border border-nexus-emerald/30 flex flex-col items-center justify-center relative overflow-hidden mb-16 group cursor-pointer shadow-[0_0_50px_rgba(0,255,157,0.1)] hover:shadow-[0_0_80px_rgba(0,255,157,0.2)] transition-shadow duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent z-10" />
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-nexus-emerald/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-nexus-emerald/40 transition-all duration-300 backdrop-blur-md border border-nexus-emerald/50">
              <Play className="text-nexus-mint ml-1" size={32} fill="currentColor" />
            </div>
            <p className="text-gray-300 font-medium text-lg">
              {isRtl ? 'اضغط لتشغيل فيديو الشرح والنتائج الحية' : 'Click to play Demo & Results Video'}
            </p>
            <p className="text-nexus-emerald/60 text-sm mt-2">
              (Video Placeholder - Upload your video here)
            </p>
          </div>
        </motion.div>

        {/* Psychological Copywriting Section (PAS Formula) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`border-l-4 border-red-500/80 bg-red-500/5 py-4 ${isRtl ? 'border-r-4 border-l-0 pr-6' : 'pl-6'} rounded-r-2xl`}
            >
              <h3 className="text-red-400 font-bold mb-2 uppercase tracking-wider text-sm">
                {isRtl ? 'المشكلة (The Pain)' : 'The Pain'}
              </h3>
              <p className="text-white text-xl leading-relaxed font-medium">
                {t(product.painKey)}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`${isRtl ? 'pr-6' : 'pl-6'}`}
            >
              <h3 className="text-gray-500 font-bold mb-2 uppercase tracking-wider text-sm">
                {isRtl ? 'التصعيد (The Agitation)' : 'The Agitation'}
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {t(product.agitateKey)}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="liquid-glass border border-nexus-emerald/40 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(0,255,157,0.1)]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-mint to-nexus-emerald"></div>
              <h3 className="text-nexus-emerald font-bold mb-3 uppercase tracking-wider text-sm flex items-center gap-2">
                <Zap size={16} />
                {isRtl ? 'الحل الجذري (The Solution)' : 'The Solution'}
              </h3>
              <p className="text-white text-xl leading-relaxed font-semibold">
                {t(product.solveKey)}
              </p>
            </motion.div>
          </div>

          {/* Pricing & CTA Sticky Sidebar */}
          <div className="md:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="sticky top-32 liquid-glass-strong border border-nexus-emerald/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="mb-8 border-b border-white/10 pb-8">
                <h2 className="text-gray-400 mb-2 uppercase text-sm font-bold tracking-widest">
                  {isRtl ? 'استثمارك لمرة واحدة' : 'One-Time Investment'}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className={`${fontHeading} text-5xl font-bold text-white`}>
                    {t(product.priceKey)}
                  </span>
                  {!product.isCustom && <span className="text-gray-500 line-through text-xl">$997</span>}
                </div>
                {!product.isCustom && (
                  <div className="mt-4 bg-nexus-emerald/10 text-nexus-emerald px-4 py-2 rounded-lg text-sm font-medium border border-nexus-emerald/20 inline-block">
                    {isRtl ? '🔥 خصم خاص متاح اليوم فقط' : '🔥 Special Discount Available Today'}
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  isRtl ? 'رخصة استخدام غير محدودة' : 'Unlimited Lifetime License',
                  isRtl ? 'وصول فوري للنظام' : 'Instant System Access',
                  isRtl ? 'دعم فني مخصص للعملاء' : 'Priority VIP Support',
                  isRtl ? 'تحديثات مجانية مستمرة' : 'Free Continuous Updates'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="text-nexus-emerald shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full flex items-center justify-center gap-3 bg-nexus-emerald text-black py-4 rounded-2xl font-bold text-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(0,255,157,0.4)] mb-4"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10">{product.isCustom ? t('modal_btn_email') : t('modal_btn')}</span>
                <ArrowRight size={20} className={`relative z-10 transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`} />
              </a>

              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Shield size={16} />
                <span>{isRtl ? 'دفع آمن ومشفر 100%' : '100% Secure & Encrypted Checkout'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
