import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, TrendingDown, Hexagon, LogOut, ArrowRight } from 'lucide-react';
import { logout } from '../utils/auth';

export default function Hub() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tools = [
    { id: 'leadscrub', icon: Shield, name: 'Nexus LeadScrub', desc: 'B2B Data Sanitization Engine', path: '/app/leadscrub' },
    { id: 'ecommatch', icon: Zap, name: 'Nexus EcomMatch', desc: 'Shopify & Stripe Reconciliation', path: '/app/ecommatch' },
    { id: 'contractcompare', icon: Hexagon, name: 'Nexus Legal-Audit', desc: 'Local Contract Audit & Diff', path: '/app/contractcompare' },
    { id: 'adspendaudit', icon: TrendingDown, name: 'Nexus AdSpend-Audit', desc: 'Wasted Budget Detector', path: '/app/adspendaudit' }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-nexus-emerald/30 overflow-x-hidden ltr">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-emerald blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nexus-mint blur-[150px] rounded-full mix-blend-screen" />
      </div>

      {/* Nav */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-white tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            Nexus<span className="text-nexus-emerald">OS</span> <span className="text-gray-500 text-sm ml-2 font-normal hidden md:inline">| Command Center</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-bold">
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-emerald-gradient bg-clip-text text-transparent">
            Welcome to the Command Center.
          </h1>
          <p className="text-gray-400 text-lg">
            License authenticated. Select a tool to initialize:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              onClick={() => navigate(tool.path)}
              className="group relative p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-nexus-emerald/40 transition-all duration-300 hover:shadow-glow cursor-pointer overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-nexus-emerald" size={24} />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-nexus-emerald/10 group-hover:text-nexus-emerald transition-colors">
                <tool.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-nexus-emerald transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
