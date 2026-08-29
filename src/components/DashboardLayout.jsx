import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Zap, Hexagon, LogOut, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout({ children, activeTool }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    const license = localStorage.getItem('nexus_license');
    if (!license) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('nexus_license');
    navigate('/login');
  };

  const tools = [
    { id: 'leadscrub', name: 'Nexus LeadScrub', icon: Shield, path: '/app/leadscrub', color: 'text-nexus-emerald' },
    { id: 'ecommatch', name: 'Nexus EcomMatch', icon: Zap, path: '/app/ecommatch', color: 'text-purple-400' },
    { id: 'paydiff', name: 'Nexus PayDiff', icon: Hexagon, path: '/app/paydiff', color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans" dir="ltr">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black border-r border-white/10 flex flex-col liquid-glass-strong z-20 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-nexus-emerald/20 rounded flex items-center justify-center border border-nexus-emerald/50">
            <LayoutDashboard className="text-nexus-emerald" size={18} />
          </div>
          <span className="text-white font-bold tracking-widest">NEXUS.OS</span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 px-2">Zero-Cost Tools</div>
          
          {tools.map((tool) => {
            const isActive = location.pathname === tool.path;
            return (
              <Link 
                key={tool.id} 
                to={tool.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <tool.icon size={18} className={isActive ? tool.color : 'text-gray-500'} />
                <span className="font-medium text-sm">{tool.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Disconnect
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-nexus-emerald/5 to-transparent -z-10 pointer-events-none" />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
