import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Construction, LogOut, Lock } from 'lucide-react';

export default function EcomMatch() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-500/5 to-transparent -z-10 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Standalone */}
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <Zap className="text-purple-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nexus EcomMatch</h1>
              <p className="text-gray-400 text-sm">Shopify vs Stripe Reconciliation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-purple-400 text-sm bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
              <Lock size={14} />
              <span>100% Local Processing</span>
            </div>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium border border-white/10 hover:border-red-500/30"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>

        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-3xl liquid-glass-strong flex items-center justify-center mb-8 border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors" />
            <Zap className="text-purple-400 w-12 h-12 relative z-10" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Nexus EcomMatch</h1>
          <p className="text-gray-400 text-lg max-w-lg mb-8">
            The ultimate Shopify vs. Stripe reconciliation engine for zero-cost accountants.
          </p>

          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-gray-300">
            <Construction className="text-purple-400" size={20} />
            <span>Currently in Alpha. Launching Q4 2026.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
