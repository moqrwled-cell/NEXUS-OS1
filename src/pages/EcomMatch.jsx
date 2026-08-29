import React from 'react';
import { Zap, Construction } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function EcomMatch() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
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
    </DashboardLayout>
  );
}
