import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, ShieldCheck, Zap, AlertTriangle, FileText, 
  Lock, CheckCircle2, ArrowRight, Download, Upload, 
  RefreshCw, Search, Eye, Sparkles, X, ChevronRight,
  TrendingDown, Briefcase, Layers, Users
} from 'lucide-react';
import { openSeamlessCheckout } from '../utils/checkoutPopup';

// Pre-packaged Hazardous Legal Contract for instant testing
const HAZARDOUS_SAMPLE_CONTRACT = `MASTER ASSET PURCHASE & SERVICES AGREEMENT

This Agreement is entered into on this 12th day of October, 2026, by and between Acme Holdings LLC ("Buyer") and Globex International Corp ("Seller").

1. PURCHASE AND SALE OF ASSETS
1.1 Subject to the terms and conditions hereof, Seller hereby agrees to transfer, assign, and convey to Buyer all of Seller's right, title, and interest in and to the Assets.

2. COMMENCEMENT & TERM
2.1 This Agreement shall commence on the Effective Date and shall continue in full force for a term of thirty-six (36) months unless terminated earlier in accordance with Section 14.2.

3. CLOSING CONDITIONS & EXHIBITS
3.1 The obligations of Buyer are subject to the delivery of all disclosure schedules set forth in Exhibit C, which are incorporated herein by reference.
3.2 Seller shall furnish key managerial services utilizing Key Personnel as designated in Schedule 1.

4. CONSIDERATION AND PAYMENT TERMS
4.1 In consideration of the Assets and ongoing services, Buyer shall pay Seller the total purchase price of Two Hundred Fifty Thousand Dollars ($205,000) payable in three equal quarterly installments.
4.2 Any disputed invoices shall be resolved within thirty (30) business days following receipt of notice.

5. CONFIDENTIALITY AND PRIVILEGED DATA
5.1 Each party shall hold in strict confidence all proprietary data, client lists, and technical specifications disclosed by the counterparty.

9. TERMINATION FOR CAUSE
9.2 Either party may terminate this Agreement immediately upon written notice in accordance with the procedures set forth in Section 14.2 of this Agreement.
9.3 Notice period shall be sixty (60) days, except as provided in Section 9.1 which specifies ten (10) days.

11. SURVIVAL
11.4 The indemnification covenants and confidentiality obligations in Section 19.1 shall survive termination of this Agreement for five (5) years.`;

export default function ContractGuardDemo() {
  const navigate = useNavigate();
  const [contractText, setContractText] = useState(HAZARDOUS_SAMPLE_CONTRACT);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(true);
  const [auditDuration, setAuditDuration] = useState(79);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('firm'); // 'solo' | 'firm'

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    
    // Simulate instantaneous in-RAM processing (79ms - 120ms)
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
      setAuditDuration(Math.floor(Math.random() * 40) + 75);
    }, 450);
  };

  const handleLoadSample = () => {
    setContractText(HAZARDOUS_SAMPLE_CONTRACT);
    handleRunAudit();
  };

  const handleCheckout = (planTier) => {
    openSeamlessCheckout({
      productId: 'prod_ETdsHhJlU1fMM',
      toolName: 'contractcompare',
      onSuccess: () => navigate('/app/contractcompare')
    });
  };

  return (
    <div className="min-h-screen bg-[#020608] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#020608]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Scale size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg tracking-tight">ContractGuard™</span>
                <span className="font-mono text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Live Interactive Demo
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>100% In-RAM Sandbox · 0 Cloud Latency</span>
            </div>
            
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>احصل على الترخيص الكامل ($199)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Briefing */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider mb-2">
              <Zap size={14} />
              <span>Zero-Leak Legal Proofreading Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              تجربة التدقيق الفوري في الذاكرة المعزولة (79ms Audit Sandbox)
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 max-w-3xl leading-relaxed">
              شاهد كيف يصطاد المحرك الخماسي التناقضات المالية الفادحة والإحالات المحذوفة والمصطلحات غير المعرفة فورياً، 
              دون إرسال بايت واحد إلى خوادم خارجية أو تعريض سرية الموكلين للخطر.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} className="text-emerald-400" />
              <span>إعادة تحميل عقد الاختبار</span>
            </button>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:opacity-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap size={14} />
              <span>{isAuditing ? 'جاري الفحص في الذاكرة...' : 'تشغيل التدقيق المعزول'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Audit Workspace */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Interactive Contract Document Pane (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#060D12] border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-[#08121A] border-b border-white/[0.08] flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-300 font-semibold flex items-center gap-2">
                <FileText size={15} className="text-emerald-400" />
                <span>UNEXECUTED CONTRACT DRAFT (Interactive Text)</span>
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {contractText.trim().split(/\s+/).length} words · RAM Buffer
              </span>
            </div>

            <div className="relative">
              <textarea
                value={contractText}
                onChange={(e) => {
                  setContractText(e.target.value);
                  setAuditComplete(false);
                }}
                className="w-full bg-black/50 p-5 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[580px] focus:bg-black/70 transition-colors"
                placeholder="الصق نص العقد هنا أو عدل على المسودة الحالية..."
              />

              {/* In-Memory Scanning Scanner Animation Bar */}
              {isAuditing && (
                <div className="absolute inset-0 bg-emerald-500/[0.03] backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-spin">
                    <RefreshCw size={24} className="text-emerald-400" />
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider">
                    PARSING 4 ENGINES IN LOCAL RAM...
                  </span>
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-[#03080C] border-t border-white/[0.08] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>ABA Model Rule 1.6 Compliant · Zero Cloud Transmission</span>
              <span className="text-emerald-400 font-semibold">100% In-Browser Isolation</span>
            </div>
          </div>

          {/* Right: Live Risk Radar & Findings HUD (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Top HUD Metrics Bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#060D12] border border-white/[0.08] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Processing Speed</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-emerald-400 font-mono">{auditDuration}</span>
                  <span className="text-xs font-mono text-zinc-500">ms</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">Single pass · In-RAM</span>
              </div>

              <div className="p-4 rounded-xl bg-[#060D12] border border-rose-500/30 bg-rose-500/[0.04] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">Overall Risk Score</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-rose-400 font-mono">88</span>
                  <span className="text-xs font-mono text-rose-300/80">/ 100</span>
                </div>
                <span className="text-[10px] text-rose-400 font-bold font-mono mt-1">CRITICAL RISK · 6 Defects</span>
              </div>
            </div>

            {/* Findings Container */}
            <div className="rounded-2xl bg-[#060D12] border border-white/[0.08] overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-[#08121A] border-b border-white/[0.08] flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-200 flex items-center gap-2">
                  <Search size={14} className="text-cyan-400" />
                  <span>AUDIT FINDINGS & LIABILITIES</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  DO NOT EXECUTE
                </span>
              </div>

              {/* Unlocked Findings (Proof of Power) */}
              <div className="p-4 flex flex-col gap-3">
                
                {/* Defect 1: Critical Financial Contradiction */}
                <div className="p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/30 relative">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      CRITICAL · FINANCIAL CONTRADICTION
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">Clause 4.1</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">
                    Written Amount ≠ Numeric Figure
                  </h4>
                  <div className="mt-1 font-mono text-xs bg-black/60 p-2 rounded border border-rose-500/20 text-rose-200">
                    Two Hundred Fifty Thousand ($250,000) ≠ <span className="text-rose-400 font-bold">$205,000</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    مخاطرة قضائية عالية: تفاوت بمقدار $45,000 دولار بين المبلغ بالحروف والمبلغ بالأرقام.
                  </p>
                </div>

                {/* Defect 2: Broken Section Cross-Reference */}
                <div className="p-3.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/30 relative">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      HIGH · BROKEN CROSS-REFERENCE
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold">Clause 2.1 & 9.2</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">
                    Citation to Non-Existent Clause: Section 14.2
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    يشير العقد إلى إجراءات إنهاء بموجب المادة 14.2، ولكن تم حذف هذه المادة تماماً من المسودة النهائية!
                  </p>
                </div>

                {/* ============================================================== */}
                {/* SMART MARKETING TEASER / BLURRED LOCKED FINDINGS               */}
                {/* ============================================================== */}
                <div className="relative rounded-xl border border-white/10 p-4 bg-black/40 overflow-hidden">
                  
                  {/* Blurred Background items */}
                  <div className="filter blur-[5px] select-none pointer-events-none opacity-40 space-y-2">
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">MISSING EXHIBIT DETECTED</span>
                      <p className="text-xs text-zinc-300 mt-1">Exhibit C (Disclosure Schedules) cited in §3.1 but never attached</p>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-purple-400 font-bold">UNDEFINED CAPITALIZED TERMS</span>
                      <p className="text-xs text-zinc-300 mt-1">Terms "Effective Date" & "Key Personnel" used without definition</p>
                    </div>
                    <div className="p-2.5 rounded bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">SURVIVAL CLAUSE DEFECT</span>
                      <p className="text-xs text-zinc-300 mt-1">Survival obligation §19.1 points to non-existent section</p>
                    </div>
                  </div>

                  {/* Overlaid Lock & Conversion Pitch */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center bg-black/70 backdrop-blur-[3px]">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      <Lock size={18} />
                    </div>
                    <h5 className="text-xs font-extrabold text-white">
                      تم اكتشاف 4 بنود حرجة وملاحق مفقودة إضافية
                    </h5>
                    <p className="text-[11px] text-zinc-300 max-w-xs mt-1 leading-snug">
                      النسخة التجريبية تعرض أول عيبين فقط. افتح التقرير الكامل ومسح العقود الضخمة غير المحدودة.
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      فتح التقرير الكامل والتراخيص
                    </button>
                  </div>
                </div>

              </div>

              {/* Export Trigger Bar */}
              <div className="p-4 bg-[#03080C] border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-lg"
                >
                  <Download size={15} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>تصدير مذكرة العميل التنفيذية (Export Client Memo PDF)</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* HIGH-CONVERTING UPGRADE & LICENSING MODAL                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl rounded-3xl bg-[#061017] border border-emerald-500/30 p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.25)] relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-5 left-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  امتلك الاستوديو القانوني المعزول للأبد
                </h3>
                <p className="text-xs md:text-sm text-zinc-300 mt-1 leading-relaxed">
                  احمِ ممارستك القانونية وسرية عملائك (ABA Rule 1.6). تفعيل فوري مع رخصة استخدام دائمة بدون اشتراكات شهرية.
                </p>
              </div>

              {/* Pricing Cards Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                
                {/* TIER 1: Solo Practitioner ($199) */}
                <div 
                  onClick={() => setSelectedPlan('solo')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'solo'
                      ? 'bg-emerald-500/[0.08] border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                      المحامي المستقل · Solo Counsel
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white font-mono">$199</span>
                      <span className="text-xs text-zinc-400 line-through font-mono">$499</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">دفعة واحدة للأبد</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                      ترخيص دائم لمستشار قانوني واحد. فحص غير محدود للعقود في الذاكرة RAM.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>فحص محلي 100% في الذاكرة (0 سحابة)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>4 محركات تدقيق فورية (&lt;180ms)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>طمس الهويات الحساسة PII Redaction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>تصدير مذكرات العميل التنفيذية PDF</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleCheckout('solo'); }}
                    className="w-full mt-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    شراء رخصة الفرد ($199)
                  </button>
                </div>

                {/* TIER 2: Boutique Law Firm ($299) - FEATURED */}
                <div 
                  onClick={() => setSelectedPlan('firm')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    selectedPlan === 'firm'
                      ? 'bg-[#061820] border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                      : 'bg-black/40 border-white/10 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg">
                    ★ الأكثر طلباً للمكاتب
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                      مكاتب المحاماة · Law Firm Suite
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-emerald-400 font-mono">$299</span>
                      <span className="text-xs text-zinc-400 line-through font-mono">$799</span>
                      <span className="text-[10px] font-mono text-emerald-300 font-bold">5 مستخدمين للأبد</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                      الترخيص المتكامل لمكاتب المحاماة والفرق القانونية. يوفر آلاف الدولارات سنوياً.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-zinc-200">
                      <div className="flex items-center gap-2 font-semibold">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>ترخيص كامل يشمل حتى 5 مستخدمين للمكتب</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>نظام ترقيم وختم بيتس للمحاكم (Bates Stamping)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>وسم المذكرات بشعار مكتبك (White-Label)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        <span>قراءة العقود الممسوحة ضوئياً (In-RAM OCR)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleCheckout('firm'); }}
                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 cursor-pointer"
                  >
                    شراء رخصة مكاتب المحاماة ($299)
                  </button>
                </div>

              </div>

              {/* Guarantee Bar */}
              <div className="text-center text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-4 border-t border-white/10 pt-4">
                <span>🛡️ ضمان استرجاع 30 يوماً بدون مخاطرة</span>
                <span>•</span>
                <span>⚡ تفعيل فوري مع مفتاح Offline PWA</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
