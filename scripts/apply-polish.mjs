import fs from 'fs';
import path from 'path';

const demoPath = path.resolve('src/pages/ContractGuardDemo.jsx');
let demoCode = fs.readFileSync(demoPath, 'utf8');

// 1. Sandbox guide text
demoCode = demoCode.replace(
  'Test our pre-loaded hazardous contract or paste any client draft.',
  'Paste any client draft or import your transactional agreement.'
);

// 2. Dropzone sample buttons in ContractGuardDemo:
const dropzoneTarget = `<button
                          onClick={handleLoadSample}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={12} className="text-emerald-400" />
                          <span>Load Sample Hazardous M&A Draft</span>
                        </button>
                        <a
                          href="/samples/01_Apex_Acquisition_Agreement_DEFECTIVE.docx"
                          download
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-zinc-700 text-xs font-semibold text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download size={12} className="text-cyan-400" />
                          <span>Download Sample .DOCX</span>
                        </a>`;

// Normalize CRLF to LF for matching
const normDemo = demoCode.replace(/\r\n/g, '\n');
const normDropzoneTarget = dropzoneTarget.replace(/\r\n/g, '\n');

if (normDemo.includes(normDropzoneTarget)) {
  const replacementDropzone = `<button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              if (text) setContractText(text);
                            } catch (_) {}
                          }}
                          className="px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 active:scale-[0.98] border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText size={12} className="text-emerald-400" />
                          <span>Paste from Clipboard</span>
                        </button>`;
  demoCode = normDemo.replace(normDropzoneTarget, replacementDropzone);
  console.log('ContractGuardDemo: dropzone sample buttons replaced successfully.');
} else {
  console.log('ContractGuardDemo: dropzoneTarget not found directly.');
}

// 3. Empty state sample button in ContractGuardDemo:
const emptyStateSampleBtn = `<button
                          onClick={handleLoadSample}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <RefreshCw size={13} className="text-emerald-400" />
                          <span>Load Sample Hazardous M&A Contract</span>
                        </button>`;

const normEmptyStateSampleBtn = emptyStateSampleBtn.replace(/\r\n/g, '\n');
if (demoCode.includes(normEmptyStateSampleBtn)) {
  demoCode = demoCode.replace(normEmptyStateSampleBtn, '');
  console.log('ContractGuardDemo: empty state sample button removed.');
} else {
  console.log('ContractGuardDemo: emptyStateSampleBtn not found directly.');
}

demoCode = demoCode.replace(
  'Paste your unexecuted contract draft into the buffer above, upload a document (.docx, .pdf), or load our pre-packaged hazardous contract to test instant in-RAM forensic detection.',
  'Paste your unexecuted contract draft into the buffer above or upload a document (.docx, .pdf, .txt) to execute instant in-RAM forensic detection.'
);

fs.writeFileSync(demoPath, demoCode, 'utf8');

// =========================================================================
// 4. ContractCompare.jsx: Remove Sample buttons
// =========================================================================
const comparePath = path.resolve('src/pages/ContractCompare.jsx');
let compareCode = fs.readFileSync(comparePath, 'utf8').replace(/\r\n/g, '\n');

// 4a. Single document header sample button
const compareSingleBtn = `<button
                type="button"
                onClick={() => handleLoadSample('single')}
                className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/35 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles size={13} className="text-emerald-400" />
                ⚡ Load Sample Hazardous M&A Draft
              </button>`;

if (compareCode.includes(compareSingleBtn.replace(/\r\n/g, '\n'))) {
  compareCode = compareCode.replace(compareSingleBtn.replace(/\r\n/g, '\n'), '');
  console.log('ContractCompare: single header sample button removed.');
} else {
  console.log('ContractCompare: compareSingleBtn not found directly.');
}

// 4b. Floating banner
const compareFloatingBanner = `          {!text.trim() && (
            <div className="absolute inset-x-0 bottom-14 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
                <span className="text-xs text-zinc-300">Need an immediate test draft with real-world drafting defects?</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('single')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  <Sparkles size={13} />
                  ⚡ Load Sample Hazardous Draft
                </button>
              </div>
            </div>
          )}`;

if (compareCode.includes(compareFloatingBanner.replace(/\r\n/g, '\n'))) {
  compareCode = compareCode.replace(compareFloatingBanner.replace(/\r\n/g, '\n'), '');
  console.log('ContractCompare: floating banner removed.');
} else {
  console.log('ContractCompare: compareFloatingBanner not found directly.');
}

// 4c. Comparative mode pair button
const comparePairBtn = `<button
                  type="button"
                  onClick={() => handleLoadSample('comparative')}
                  className="bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/35 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.15)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={12} className="text-cyan-400" />
                  ⚡ Load Sample Pair
                </button>`;

if (compareCode.includes(comparePairBtn.replace(/\r\n/g, '\n'))) {
  compareCode = compareCode.replace(comparePairBtn.replace(/\r\n/g, '\n'), '');
  console.log('ContractCompare: comparative pair button removed.');
} else {
  console.log('ContractCompare: comparePairBtn not found directly.');
}

fs.writeFileSync(comparePath, compareCode, 'utf8');
console.log('ALL SAMPLE BUTTONS PURGED CLEANLY.');
