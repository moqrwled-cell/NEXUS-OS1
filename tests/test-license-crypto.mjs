import { validateLicenseKey, generateLicenseKeys, restoreLicenseFromWhopOrder } from '../src/utils/licenseManager.js';
import { validateEnterpriseKey } from '../src/utils/auth.js';

console.log('========================================================');
console.log('NEXUS CONTRACTGUARD — CRYPTOGRAPHIC LICENSE SUITE');
console.log('========================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failCount++;
  }
}

// 1. Generation & Validation of Law Firm Suite (5 distinct seats)
console.log('[TEST GROUP 1] Law Firm Suite Key Generation & Validation');
const firmBundle = generateLicenseKeys('firm', 'ORD-IPEX-2026');
assert(firmBundle.plan === 'firm', 'Firm bundle plan is firm');
assert(firmBundle.seats.length === 5, 'Firm bundle generates 5 distinct seat keys');

firmBundle.seats.forEach((seat) => {
  const res = validateLicenseKey(seat.key);
  assert(res.valid === true, `Seat ${seat.seatNumber} key is cryptographically valid`);
  assert(res.seatNumber === seat.seatNumber, `Seat ${seat.seatNumber} preserves exact seat number`);
  assert(res.isPrimaryAdmin === (seat.seatNumber === 1), `Seat ${seat.seatNumber} has correct admin flag`);
});

// 2. Solo Practitioner Generation & Validation
console.log('\n[TEST GROUP 2] Solo Practitioner Key Generation & Validation');
const soloBundle = generateLicenseKeys('solo', 'ORD-SOLO-9912');
assert(soloBundle.plan === 'solo', 'Solo bundle plan is solo');
const soloRes = validateLicenseKey(soloBundle.primaryKey);
assert(soloRes.valid === true, 'Solo practitioner key is cryptographically valid');
assert(soloRes.seatNumber === 1, 'Solo seat number is 1');
assert(soloRes.isPrimaryAdmin === true, 'Solo user is primary admin');

// 3. User Reported Vulnerability (Tampering Attacks)
console.log('\n[TEST GROUP 3] Adversarial Tampering Attacks & Rejections');
const seat2Key = firmBundle.seats[1].key; // e.g. CG-FIRM-SEAT2-2026-XXXX-SIG
const parts = seat2Key.split('-');
const prefix = parts.slice(0, -1).join('-');
const originalSig = parts[parts.length - 1];

// Attack 3.1: Change last digit of random block (User exact scenario: 3857 -> 3855)
const tamperedRand = parts.slice(0, -2).join('-') + '-9999-' + originalSig;
const resAttack1 = validateLicenseKey(tamperedRand);
assert(resAttack1.valid === false, 'Attack 1: Modifying random block digit is BLOCKED');
assert(resAttack1.reason.includes('signature verification failed'), 'Attack 1: Returns cryptographic signature failure message');

// Attack 3.2: Tamper Seat Number (SEAT2 -> SEAT1) to steal Admin privileges
const tamperedSeat = seat2Key.replace('SEAT2', 'SEAT1');
const resAttack2 = validateLicenseKey(tamperedSeat);
assert(resAttack2.valid === false, 'Attack 2: Changing SEAT2 to SEAT1 is BLOCKED');
assert(resAttack2.reason.includes('signature verification failed'), 'Attack 2: Cryptographic signature mismatch detected');

// Attack 3.3: Tamper Signature (replace signature with 0955)
const userForgedKey = prefix + '-0955';
const resAttack3 = validateLicenseKey(userForgedKey);
assert(resAttack3.valid === false, 'Attack 3: User reported forged key with 0955 is BLOCKED');

// Attack 3.4: Validate through auth.js validateEnterpriseKey
const resAuth = validateEnterpriseKey(userForgedKey);
assert(resAuth.valid === false, 'Attack 4: auth.js validateEnterpriseKey strictly rejects forged key');

// Attack 3.5: Arbitrary prefix attack (CG-FIRM-UNAUTHORIZED)
const resAttack5 = validateLicenseKey('CG-FIRM-UNAUTHORIZED-RANDOM');
assert(resAttack5.valid === false, 'Attack 5: Arbitrary CG- prefix string is BLOCKED');

// Attack 3.6: Single character bit-flip in body
const charToFlip = parts[3] || '2026';
const flippedChar = charToFlip[0] === 'A' ? 'B' : 'A';
const tamperedBodyKey = parts.slice(0, 3).join('-') + '-' + flippedChar + charToFlip.slice(1) + '-' + parts.slice(4).join('-');
const resAttack6 = validateLicenseKey(tamperedBodyKey);
assert(resAttack6.valid === false, 'Attack 6: Single character bit-flip in body is BLOCKED');

// 4. Authenticated License Key Restoration & Fake Email Block
console.log('\n[TEST GROUP 4] Authenticated Key Restoration & Fake Email Immunity');

let emailAttackBlocked = false;
try {
  await restoreLicenseFromWhopOrder('fake_pirate@test.com', 'firm');
} catch {
  emailAttackBlocked = true;
}
assert(emailAttackBlocked === true, 'Attack 7: Arbitrary email bypass is strictly BLOCKED');

let arbitraryOrderBlocked = false;
try {
  await restoreLicenseFromWhopOrder('fake_order_123', 'solo');
} catch {
  arbitraryOrderBlocked = true;
}
assert(arbitraryOrderBlocked === true, 'Attack 8: Arbitrary order string bypass is strictly BLOCKED');

const restoredByKey = await restoreLicenseFromWhopOrder(soloBundle.primaryKey, 'solo');
assert(restoredByKey && restoredByKey.primaryKey === soloBundle.primaryKey, 'Restoration via authentic cryptographic key rebinds correctly');

console.log('\n========================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('[SUCCESS] ALL CRYPTOGRAPHIC LICENSE SECURITY TESTS PASSED 100%!');
}
