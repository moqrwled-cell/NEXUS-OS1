import fs from 'fs';
import path from 'path';

// 1. LegalTemplatesView.jsx
const tplPath = path.resolve('src/components/LegalTemplatesView.jsx');
let tplCode = fs.readFileSync(tplPath, 'utf8').replace(/\r\n/g, '\n');

tplCode = tplCode.replace(
  '<div className="flex-1 bg-black/50 p-5 text-xs font-mono leading-relaxed text-zinc-200 overflow-y-auto custom-scrollbar select-text">\n              <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-zinc-300">\n                {compiledText}\n              </pre>\n            </div>',
  '<div className="flex-1 bg-black/50 p-6 text-sm font-legal leading-relaxed text-zinc-200 overflow-y-auto custom-scrollbar select-text">\n              <pre className="whitespace-pre-wrap font-legal text-[13.5px] leading-relaxed text-zinc-200">\n                {compiledText}\n              </pre>\n            </div>'
);

// Ensure the root container of LegalTemplatesView uses font-ui
tplCode = tplCode.replace(
  'className="max-w-6xl mx-auto h-full flex flex-col gap-6"',
  'className="max-w-6xl mx-auto h-full flex flex-col gap-6 font-ui"'
);

fs.writeFileSync(tplPath, tplCode, 'utf8');
console.log('LegalTemplatesView updated with font-legal & font-ui');

// 2. ContractCompare.jsx
const comparePath = path.resolve('src/pages/ContractCompare.jsx');
let compareCode = fs.readFileSync(comparePath, 'utf8').replace(/\r\n/g, '\n');

// Set root container font-ui
compareCode = compareCode.replace(
  'className="max-w-7xl mx-auto h-full flex flex-col gap-6"',
  'className="max-w-7xl mx-auto h-full flex flex-col gap-6 font-ui"'
);

// Set textarea to font-legal
compareCode = compareCode.replace(
  'className="w-full bg-black/40 p-5 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[260px]"',
  'className="w-full bg-black/40 p-5 text-[14.5px] font-legal leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[260px]"'
);

compareCode = compareCode.replace(
  'className="w-full bg-black/40 p-4 text-sm font-mono leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[240px]"',
  'className="w-full bg-black/40 p-4 text-[14.5px] font-legal leading-relaxed text-zinc-200 outline-none resize-none focus:bg-black/60 custom-scrollbar min-h-[240px]"'
);

fs.writeFileSync(comparePath, compareCode, 'utf8');
console.log('ContractCompare updated with font-legal for contract text & font-ui for controls');
