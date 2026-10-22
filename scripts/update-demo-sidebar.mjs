import fs from 'fs';
import path from 'path';

const demoPath = path.resolve('src/pages/ContractGuardDemo.jsx');
let code = fs.readFileSync(demoPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Ensure root container has font-ui
code = code.replace(
  'min-h-screen bg-[#030712] text-white font-sans flex flex-col md:flex-row relative overflow-hidden',
  'min-h-screen bg-[#030712] text-white font-ui flex flex-col md:flex-row relative overflow-hidden'
);

// 2. Refined navigation modules block
const oldNavBlock = /\{\/\* Navigation Modules \*\/\}[\s\S]*?<\/nav>/;

const newNavBlock = `{/* Navigation Modules — Emil Kowalski Organized Hierarchy */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-3.5 overflow-y-auto custom-scrollbar font-ui">
          
          {/* Section 1: Forensic Auditing */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1.5">
              Forensic Auditing
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('analyzer')}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left \${
                  activeTool === 'analyzer'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }\`}
              >
                <div className={\`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 \${activeTool === 'analyzer' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400'}\`}>
                  <Search size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Integrity & Diff Audit</p>
                    {activeTool === 'analyzer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Pre-signing review & redline</p>
                </div>
              </button>

              {activeTool === 'analyzer' && (
                <div className="mx-1 mt-1 mb-1 px-3 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-500 font-bold mb-1.5">Interactive Evaluation Guide</p>
                  <div className="space-y-1.5 text-[10.5px] leading-relaxed text-zinc-400">
                    <p><span className="text-emerald-400 font-semibold">1. Unrestricted Sandbox:</span> Paste any client draft or import your transactional agreement.</p>
                    <p><span className="text-cyan-400 font-semibold">2. In-RAM Speed:</span> Executes 5 detection engines locally in &lt;100ms without cloud transmission.</p>
                    <p><span className="text-amber-400 font-semibold">3. Free Evaluation:</span> 3 full unblurred audits included. Test your matters before unlocking perpetual access.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Privacy & Remediation */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1.5">
              Client Privacy
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('redact')}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left \${
                  activeTool === 'redact'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }\`}
              >
                <div className={\`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 \${activeTool === 'redact' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800/60 text-zinc-400'}\`}>
                  <EyeOff size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Smart PII Redactor</p>
                    <span className="text-[8.5px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">Preview</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Identity & financial scrub</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Court Evidence Controls */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-2 mb-1.5">
              Court Controls
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool('bates')}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left \${
                  activeTool === 'bates'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }\`}
              >
                <div className={\`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 \${activeTool === 'bates' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800/60 text-zinc-400'}\`}>
                  <Layers size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Bates Stamping Suite</p>
                    <span className="text-[8.5px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">Firm Only</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Court evidence numbering</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTool('history')}
                className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer text-left \${
                  activeTool === 'history'
                    ? 'bg-white/[0.08] text-white border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)] font-semibold'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }\`}
              >
                <div className={\`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 \${activeTool === 'history' ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800/60 text-zinc-400'}\`}>
                  <Database size={15} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold leading-tight truncate">Audit Vault</p>
                    <span className="text-[8.5px] font-mono uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-bold">PWA Only</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 truncate">Encrypted local persistence</p>
                </div>
              </button>
            </div>
          </div>
        </nav>`;

if (oldNavBlock.test(code)) {
  code = code.replace(oldNavBlock, newNavBlock);
  console.log('ContractGuardDemo: sidebar navigation updated with Emil Kowalski groupings.');
} else {
  console.log('ContractGuardDemo: oldNavBlock did not match.');
}

// 3. Ensure contract clause textareas and readers use font-legal
code = code.replace(
  'className="w-full bg-black/40 p-4 text-xs font-mono leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"',
  'className="w-full bg-black/40 p-4 text-sm font-legal leading-relaxed text-zinc-200 outline-none resize-none custom-scrollbar min-h-[360px] focus:bg-black/60 transition-colors"'
);

fs.writeFileSync(demoPath, code, 'utf8');
console.log('ContractGuardDemo fully saved.');
