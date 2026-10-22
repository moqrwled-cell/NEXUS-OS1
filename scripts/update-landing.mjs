import fs from 'fs';
import path from 'path';

const appPath = path.resolve('src/App.jsx');
let appCode = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update line 421 button text and add tactile scale
appCode = appCode.replace(
  "<span>{isRtl ? 'تجربة بيئة العمل وفحص عقدك الآن' : 'Test Studio with Sample Contract Now'}</span>",
  "<span>{isRtl ? 'فتح بيئة العمل والبدء في فحص العقود' : 'Launch Air-Gapped Legal Studio Now'}</span>"
);

appCode = appCode.replace(
  'className="w-full bg-nexus-emerald text-black py-3 px-4 rounded-xl font-black text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2"',
  'className="w-full bg-nexus-emerald text-black py-3 px-4 rounded-xl font-black text-xs hover:bg-white active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 cursor-pointer font-ui"'
);

// 2. Set font-legal on the Document Inspector clause snippets in the hero preview
appCode = appCode.replace(
  '<div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050A0E] text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed space-y-4">',
  '<div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050A0E] text-zinc-300 text-xs sm:text-sm font-ui leading-relaxed space-y-4">'
);

appCode = appCode.replace(
  '<p className="text-zinc-300">\n                    Client shall pay the Contractor a fixed fee of',
  '<p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">\n                    Client shall pay the Contractor a fixed fee of'
);

appCode = appCode.replace(
  '<p className="text-zinc-300">\n                    Except as expressly provided under',
  '<p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">\n                    Except as expressly provided under'
);

appCode = appCode.replace(
  '<p className="text-zinc-300">\n                    This Agreement shall be governed by the laws of',
  '<p className="text-zinc-200 font-legal text-[13.5px] leading-relaxed">\n                    This Agreement shall be governed by the laws of'
);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('App.jsx updated with font-legal snippets and tactile button states.');
