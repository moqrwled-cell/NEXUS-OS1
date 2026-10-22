import fs from 'fs';
import path from 'path';

// 1. ContractCompare.jsx
const comparePath = path.resolve('src/pages/ContractCompare.jsx');
let compareCode = fs.readFileSync(comparePath, 'utf8').replace(/\r\n/g, '\n');

compareCode = compareCode.replace(
  '  Settings, Key, Laptop, Copy, Mail, LogOut,\n  BookOpen, FileDown, ArrowRight, Sparkles',
  '  Settings, Key, Laptop, Copy, Mail, LogOut,\n  BookOpen, FileDown'
);

// Comment or remove handleLoadSample definition
const handleLoadSampleCompare = `  const handleLoadSample = (modeToUse = analysisMode) => {
    setText(HAZARDOUS_SAMPLE_CONTRACT);
    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
    setDocumentTitle('Hazardous M&A Asset Purchase Agreement');
    setClientParty('Acme Holdings LLC');
    setCounterparty('Globex International Corp');
    handleExecuteAudit({
      text: HAZARDOUS_SAMPLE_CONTRACT,
      baselineText: HAZARDOUS_BASELINE_CONTRACT,
      mode: modeToUse,
      title: 'Hazardous M&A Asset Purchase Agreement',
      clientParty: 'Acme Holdings LLC',
      counterparty: 'Globex International Corp'
    });
  };`;

if (compareCode.includes(handleLoadSampleCompare)) {
  compareCode = compareCode.replace(handleLoadSampleCompare, '');
  console.log('ContractCompare: handleLoadSample removed.');
}

fs.writeFileSync(comparePath, compareCode, 'utf8');

// 2. ContractGuardDemo.jsx
const demoPath = path.resolve('src/pages/ContractGuardDemo.jsx');
let demoCode = fs.readFileSync(demoPath, 'utf8').replace(/\r\n/g, '\n');

// Clean up unused imports in demo
demoCode = demoCode.replace(
  '  ChevronRight, Clock, FileCode, FileSpreadsheet, Eye, Play, Volume2, VolumeX,\n  Copy',
  '  ChevronRight, Clock, FileCode, FileSpreadsheet, Eye, Play,\n  Copy'
);

demoCode = demoCode.replace(
  '  consumeDemoAudit, \n  resetDemoAuditsForTesting, \n  verifyDeviceLicense,',
  '  consumeDemoAudit, \n  verifyDeviceLicense,'
);

// Remove handleLoadSample from demo
const handleLoadSampleDemo = `  // Reset to sample contract
  const handleLoadSample = () => {
    setContractText(HAZARDOUS_SAMPLE_CONTRACT);
    setBaselineText(HAZARDOUS_BASELINE_CONTRACT);
    setDocumentTitle('Hazardous M&A Asset Purchase Agreement');
    setClientParty('Acme Holdings LLC');
    setCounterparty('Globex International Corp');
    handleRunAudit({
      text: HAZARDOUS_SAMPLE_CONTRACT,
      baselineText: HAZARDOUS_BASELINE_CONTRACT,
      mode: analysisMode,
      clientParty: 'Acme Holdings LLC',
      counterparty: 'Globex International Corp'
    });
  };`;

if (demoCode.includes(handleLoadSampleDemo)) {
  demoCode = demoCode.replace(handleLoadSampleDemo, '');
  console.log('ContractGuardDemo: handleLoadSample removed.');
}

fs.writeFileSync(demoPath, demoCode, 'utf8');
console.log('Unused sample functions and imports cleaned up successfully.');
