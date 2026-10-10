import { validateEnterpriseKey, grantToolAccess, verifyToolAccess, logout } from '../src/utils/auth.js';

// Setup mock storage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};
global.btoa = (str) => Buffer.from(str).toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('utf8');

console.log('--- TESTING BACKDOOR KEYS IN AUTH.JS ---');

const testKeys = [
  'NEXUS-CEO-2026',
  'FREE-PIRATE-ACCOUNT',
  'nexus_master_2026',
  'NEXUS_MASTER_2026',
  'NEXUS-ADMIN',
  'nexus-admin',
  'BACKDOOR_KEY_999',
  'NX-CORP-1122-3344',
  'NX-EVAL-ABCD-EF01'
];

for (const key of testKeys) {
  const res = validateEnterpriseKey(key);
  console.log(`Key: ${key.padEnd(22)} | Valid: ${String(res.valid).padEnd(6)} | Reason: ${res.reason || res.tier}`);
}

console.log('\n--- TESTING grantToolAccess WITH BACKDOORS ---');
for (const key of ['NEXUS-CEO-2026', 'FREE-PIRATE-ACCOUNT', 'NEXUS-ADMIN', 'nexus_master_2026', 'NEXUS_MASTER_2026']) {
  try {
    grantToolAccess(key, 'contractcompare');
    console.log(`Key: ${key.padEnd(22)} | Result: ALLOWED (UNEXPECTED VULNERABILITY!)`);
  } catch (err) {
    console.log(`Key: ${key.padEnd(22)} | Result: BLOCKED (${err.message})`);
  }
}
