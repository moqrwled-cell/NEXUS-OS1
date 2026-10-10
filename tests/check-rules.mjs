import { LEGAL_RISK_RULES } from '../src/utils/legalRiskRules.js';

const mismatched = [];
LEGAL_RISK_RULES.forEach(r => {
  const reg = new RegExp(r.regex.source, 'i');
  if (!reg.test(r.phrase)) {
    mismatched.push({ id: r.id, phrase: r.phrase, regex: r.regex.source });
  }
});

console.log(`Total rules: ${LEGAL_RISK_RULES.length}`);
console.log(`Rules where phrase does NOT match its own regex: ${mismatched.length}`);
mismatched.forEach(m => {
  console.log(`- [${m.id}] Phrase: "${m.phrase}" | Regex: /${m.regex}/i`);
});
