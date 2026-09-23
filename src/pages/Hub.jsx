import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Hexagon, TrendingDown, ArrowRight, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Hub() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (license !== "NEXUS-CEO-2026") {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/');
  };

  const tools = [
    { id: 'leadscrub', icon: Shield, name: 'Nexus LeadScrub', desc: isRtl ? 'محرك تنظيف قوائم الإيميلات B2B' : 'B2B Data Sanitization Engine', path: '/app/leadscrub' },
    { id: 'ecommatch', icon: Zap, name: 'Nexus EcomMatch', desc: isRtl ? 'مطابقة بيانات متجرك وبوابة الدفع' : 'Shopify & Stripe Reconciliation', path: '/app/ecommatch' },
    { id: 'contractcompare', icon: Hexagon, name: 'Nexus Legal-Audit', desc: isRtl ? 'تدقيق ومقارنة العقود محلياً' : 'Local Contract Audit & Diff', path: '/app/contractcompare' },
    { id: 'adspendaudit', icon: TrendingDown, name: 'Nexus AdSpend-Audit', desc: isRtl ? 'كشف الميزانيات المهدرة للإعلانات' : 'Wasted Budget Detector', path: '/app/adspendaudit' }
  ];

  const fontHeading = isRtl ? 'font-arabic-heading' : 'font-display';

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-nexus-emerald/30 overflow-x-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-emerald blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nexus-mint blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Nav */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className={`${fontHeading} text-2xl font-bold text-white tracking-tighter cursor-pointer`} onClick={() => navigate('/')}>
            Nexus<span className="text-nexus-emerald">OS</span> <span className="text-gray-500 text-sm ml-2 font-normal hidden md:inline">| {isRtl ? 'مركز العمليات' : 'Command Center'}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-bold">
            <LogOut size={16} /> {isRtl ? 'تسجيل الخروج' : 'Disconnect'}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className={`${fontHeading} text-3xl md:text-5xl font-bold mb-4 bg-emerald-gradient bg-clip-text text-transparent`}>
            {isRtl ? 'مرحباً بك في مركز العمليات.' : 'Welcome to the Command Center.'}
          </h1>
          <p className="text-gray-400 text-lg">
            {isRtl ? 'تم التحقق من الرخصة بنجاح. اختر الأداة التي ترغب بتشغيلها:' : 'License authenticated. Select a tool to initialize:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="liquid-glass-strong border border-white/10 hover:border-nexus-emerald/50 rounded-3xl p-8 cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,157,0.1)] relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center text-nexus-mint group-hover:scale-110 group-hover:text-white transition-all duration-300">
                  <tool.icon size={24} />
                </div>
                <ArrowRight size={20} className={`text-gray-600 group-hover:text-nexus-emerald transform transition-all duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
              </div>
              <h2 className={`${fontHeading} text-2xl font-bold mb-2 text-white group-hover:text-nexus-emerald transition-colors relative z-10`}>{tool.name}</h2>
              <p className="text-gray-400 relative z-10">{tool.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
