import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Monitor, 
  TrendingUp, 
  Globe, 
  Briefcase, 
  X, 
  Search, 
  BarChart, 
  TrendingDown, 
  ArrowRight,
  Hexagon 
} from 'lucide-react';

export default function App() {
  const navigate = useNavigate();

  const scrollToProducts = () => {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyNow = () => {
    window.open("https://whop.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Shield className="text-emerald-400" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Nexus OS
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block">
              Client Login
            </button>
            <button onClick={handleBuyNow} className="bg-emerald-500 text-black font-bold px-6 py-2.5 rounded-full hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 text-sm">
              Get Access
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 2. The Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20 pb-32">
          {/* Background Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black -z-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center z-10 w-full max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm mb-8 font-medium tracking-wide">
              <Zap size={14} className="animate-pulse" /> The Ultimate OS for Agency Owners & Dropshippers
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
              Stop renting your infrastructure.<br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Own the vault.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Nexus OS is the definitive, local-first software suite. Three high-leverage tools. Zero cloud processing. One lifetime price.
            </p>

            <button onClick={scrollToProducts} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all transform hover:scale-105 flex items-center gap-3 group">
              Claim Lifetime Access - $199
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Dashboard Mockup (The Proof) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden w-full max-w-6xl mx-auto h-[400px] md:h-[600px] bg-black/50 backdrop-blur-md"
          >
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <div className="ml-4 text-xs font-mono text-zinc-600">Nexus_OS_Terminal_v2.1</div>
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 h-full opacity-60">
              <div className="col-span-2 border border-white/5 rounded-xl bg-white/[0.01]"></div>
              <div className="col-span-1 border border-white/5 rounded-xl bg-white/[0.01]"></div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </motion.div>
        </section>

        {/* 3. Trust Section */}
        <section className="py-12 border-y border-white/5 bg-white/[0.01] relative z-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-8">Trusted by 2,000+ top-rated Whop sellers and agency owners</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 text-xl font-bold"><Monitor size={24}/> SMMA Scales</div>
              <div className="flex items-center gap-2 text-xl font-bold"><TrendingUp size={24}/> DropVault</div>
              <div className="flex items-center gap-2 text-xl font-bold"><Globe size={24}/> Ecom Kings</div>
              <div className="flex items-center gap-2 text-xl font-bold"><Briefcase size={24}/> Agency Flow</div>
            </div>
          </div>
        </section>

        {/* 4. The Problem */}
        <section className="py-32 bg-black relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-6">
              The SaaS model is <span className="text-red-500">bleeding you dry.</span>
            </h2>
            <p className="text-zinc-400 text-center max-w-3xl mx-auto mb-20 text-lg">
              Every month, you pay $99/mo to rent tools that eat your margins and silently stockpile your proprietary data. You upload your leads, your ad metrics, and your COGS to third-party servers you don’t control—exposing your winning strategies to their backends.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-red-950/20 border border-red-500/20 p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                <h3 className="text-red-400 font-bold text-xl mb-8 flex items-center gap-3">
                  <X size={24} /> The Cloud Trap
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between text-zinc-500 line-through"><span>Email Cleaner SaaS</span> <span>$49/mo</span></li>
                  <li className="flex justify-between text-zinc-500 line-through"><span>Profit Tracker App</span> <span>$79/mo</span></li>
                  <li className="flex justify-between text-zinc-500 line-through"><span>Ad Spy & Audit Tool</span> <span>$99/mo</span></li>
                  <li className="flex justify-between text-zinc-500 line-through"><span>Data Privacy Leak Risk</span> <span>Priceless</span></li>
                </ul>
                <div className="mt-8 pt-8 border-t border-red-500/10 flex justify-between items-center">
                  <span className="text-red-400 font-bold">Total Bleed</span>
                  <span className="text-3xl font-black text-red-500">$227/mo</span>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-emerald-950/20 border border-emerald-500/30 p-10 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full"></div>
                <h3 className="text-emerald-400 font-bold text-xl mb-8 flex items-center gap-3">
                  <Shield size={24} /> The Nexus Vault
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between text-white font-medium"><span>LeadScrub 2.0</span> <span className="text-emerald-400">Included</span></li>
                  <li className="flex justify-between text-white font-medium"><span>EcomMatch Terminal</span> <span className="text-emerald-400">Included</span></li>
                  <li className="flex justify-between text-white font-medium"><span>AdSpend-Audit</span> <span className="text-emerald-400">Included</span></li>
                  <li className="flex justify-between text-white font-medium"><span>100% Local Privacy</span> <span className="text-emerald-400">Secured</span></li>
                </ul>
                <div className="mt-8 pt-8 border-t border-emerald-500/20 flex justify-between items-center">
                  <span className="text-white font-bold">One-Time Lifetime</span>
                  <span className="text-4xl font-black text-emerald-400">$199</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. The 3 Tools (Bento Box Grid) */}
        <section id="products-section" className="py-24 bg-zinc-950 relative z-10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Three surgical tools.<br/>Zero subscriptions.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div onClick={() => navigate('/app/leadscrub')} className="md:col-span-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 hover:border-teal-500/50 transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-black border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
                      <Search size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">LeadScrub</h3>
                    <p className="text-teal-400 font-medium mb-4">Pristine list sanitation, offline.</p>
                    <p className="text-zinc-400 leading-relaxed max-w-lg">Scrub your B2B email lists securely on your own device. Instantly filter dead leads, bypass honeypots, and export the pristine data perfectly formatted for GoHighLevel or Instantly.</p>
                  </div>
                  <div className="mt-8 flex items-center text-teal-400 text-sm font-bold tracking-widest uppercase">
                    Launch App <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              <div onClick={() => navigate('/app/adspendaudit')} className="md:col-span-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 hover:border-rose-500/50 transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-black border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                      <TrendingDown size={28} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">AdSpend-Audit</h3>
                    <p className="text-rose-400 font-medium mb-4">Surgical campaign optimization.</p>
                    <p className="text-zinc-400 leading-relaxed">Process raw ad CSVs instantly in-browser. Automatically identify and terminate bleeding "zombie" campaigns.</p>
                  </div>
                  <div className="mt-8 flex items-center text-rose-400 text-sm font-bold tracking-widest uppercase">
                    Launch App <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              <div onClick={() => navigate('/app/ecommatch')} className="md:col-span-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-[2rem] p-10 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    <BarChart size={28} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">EcomMatch</h3>
                  <p className="text-blue-400 font-medium mb-4">The Bloomberg Terminal for your margins.</p>
                  <p className="text-zinc-400 leading-relaxed max-w-2xl">Stop guessing your profit. Cross-reference your Shopify revenue, Meta Ad spend, and AliExpress COGS locally to reveal your absolute true net margin and expose hidden gateway fees.</p>
                  <div className="mt-8 flex items-center text-blue-400 text-sm font-bold tracking-widest uppercase">
                    Launch App <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
                <div className="hidden md:flex flex-1 justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="w-32 h-20 border border-blue-500/30 rounded-xl bg-blue-500/10"></div>
                    <div className="w-32 h-20 border border-emerald-500/30 rounded-xl bg-emerald-500/10"></div>
                    <div className="col-span-2 w-full h-32 border border-white/20 rounded-xl bg-white/5"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. Local First Advantage */}
        <section className="py-32 bg-black relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Zero Loading Screens.<br/>Total Data Ownership.</h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-10">
                Nexus OS flips the paradigm. Our suite runs 100% locally in your browser. No cloud API scraping. No server latency. Just raw, unthrottled performance where your data never leaves your machine.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Zap size={24}/></div>
                  <div className="text-lg font-medium text-white">Lightning Fast Parsing (PapaParse)</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Hexagon size={24}/></div>
                  <div className="text-lg font-medium text-white">100% Offline Capable (PWA)</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Shield size={24}/></div>
                  <div className="text-lg font-medium text-white">Military-Grade Data Privacy</div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center relative mt-16 md:mt-0">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
              <Monitor size={300} className="text-white/10 relative z-10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <Shield className="text-emerald-400 animate-pulse drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]" size={100} />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section className="py-40 bg-black relative z-10 flex justify-center px-4 overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black -z-10"></div>
          
          <div className="backdrop-blur-2xl bg-black/60 border border-emerald-500/50 p-12 md:p-16 rounded-[3rem] max-w-3xl w-full text-center shadow-[0_0_100px_rgba(16,185,129,0.15)] relative z-10">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] -z-10 rounded-full pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Stop Renting Your Tools.<br/>Own Them.</h2>
            
            <div className="flex justify-center items-end gap-4 mb-10">
              <span className="line-through text-zinc-500 text-3xl font-medium">$49/mo</span> 
              <span className="text-6xl md:text-7xl font-black text-white">$199</span> 
              <span className="text-emerald-400 text-xl font-bold mb-2 uppercase tracking-widest">Lifetime</span>
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto mb-12 text-left">
              <div className="flex items-center gap-3 text-zinc-300"><Shield className="text-emerald-400" size={20}/> All 3 Master Tools Included</div>
              <div className="flex items-center gap-3 text-zinc-300"><Shield className="text-emerald-400" size={20}/> Local-First Privacy Guarantee</div>
              <div className="flex items-center gap-3 text-zinc-300"><Shield className="text-emerald-400" size={20}/> Zero Recurring Subscriptions</div>
              <div className="flex items-center gap-3 text-zinc-300"><Shield className="text-emerald-400" size={20}/> Installable PWA App</div>
            </div>
            
            <button onClick={handleBuyNow} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xl px-12 py-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] transition-all transform hover:scale-105">
              Get Instant Access Now
            </button>
            
            <p className="text-zinc-500 text-sm mt-8 font-medium">
              14-day money-back guarantee. No questions asked.
            </p>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 py-12 px-6 bg-black relative z-10 text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-60">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <Shield className="text-emerald-500" size={24} />
            <span className="text-xl font-bold text-white">Nexus OS</span>
          </div>
          <div className="text-sm font-medium text-zinc-400 space-x-6 flex flex-wrap justify-center gap-4">
            <button className="hover:text-emerald-400 transition-colors">Terms</button>
            <button className="hover:text-emerald-400 transition-colors">Privacy</button>
            <button className="hover:text-emerald-400 transition-colors">Contact: nexus.os.store@gmail.com</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
