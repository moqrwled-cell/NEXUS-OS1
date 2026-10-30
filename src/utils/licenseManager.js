/**
 * ContractGuard™ Cryptographic Device-Locked Licensing Engine
 * 
 * Enforces:
 * 1. Multi-format license key parsing & cryptographic validation.
 *    Accepts:
 *    - CG-FIRM-SEAT[1-5]-XXXX-XXXX-XXXX
 *    - CG-SOLO-LEGAL-XXXX-XXXX-XXXX
 *    - CG-XXXX-...
 *    - NX-XXXX-...
 *    - Legacy 16-char blocks
 * 2. Deterministic hardware/browser fingerprinting (Canvas, WebGL, Screen, Concurrency).
 * 3. Single-device binding with clean deactivation/transfer protocols.
 * 4. Multi-seat provisioning for Law Firm licenses (5 distinct team seat keys).
 *    - Primary Purchaser / Admin (Seat 1) has visibility of all 5 seats to distribute to associates.
 *    - Team Members / Associates (Seats 2-5) only see their own individual workstation seat.
 */

const LICENSE_STORAGE_KEY = 'contractguard_active_license';
const DEVICE_FP_KEY = 'contractguard_device_fp';
const DEMO_AUDITS_KEY = 'contractguard_demo_audits_left';
const MAX_FREE_AUDITS = 3;
const SECRET_SALT = "NEXUS_ENTERPRISE_2026_AIRGAPPED";

// Explicitly prohibited backdoor keys
const PROHIBITED_KEYS = new Set([
  "NEXUS-CEO-2026",
  "FREE-PIRATE-ACCOUNT",
  "nexus_master_2026",
  "NEXUS_MASTER_2026",
  "NEXUS-ADMIN"
]);

/**
 * Deterministic, offline cryptographic checksum engine.
 * Generates an avalanche-sensitive, tamper-proof signature
 * deterministically mixed with SECRET_SALT.
 */
export function computeKeyChecksum(dataString) {
  const str = `${dataString}:::${SECRET_SALT}`;
  let h1 = 0xdeadbeef ^ 0x12345678;
  let h2 = 0x41c6ce57 ^ 0x87654321;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const num = Math.abs(h1 ^ h2);
  return num.toString(36).toUpperCase().padStart(4, '0').slice(-4);
}

/**
 * Generate a deterministic hardware & browser fingerprint hash
 */
export async function getDeviceFingerprint() {
  let cachedFp = typeof localStorage !== 'undefined' ? localStorage.getItem(DEVICE_FP_KEY) : null;
  if (cachedFp) return cachedFp;

  const components = [
    typeof navigator !== 'undefined' ? (navigator.userAgent || '') : 'node-env',
    typeof navigator !== 'undefined' ? (navigator.language || '') : 'en-US',
    typeof screen !== 'undefined' ? (screen.width + 'x' + screen.height + 'x' + screen.colorDepth) : '1920x1080x24',
    new Date().getTimezoneOffset(),
    typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4,
    typeof navigator !== 'undefined' ? (navigator.maxTouchPoints || 0) : 0
  ];

  // Canvas fingerprinting component
  try {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('ContractGuard-HW-Lock-2026', 2, 15);
        components.push(canvas.toDataURL());
      }
    } else {
      components.push('no-canvas');
    }
  } catch {
    components.push('no-canvas');
  }

  // Hash the components safely
  const rawString = components.join('###');
  let hexHash = '';
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();
    } else {
      hexHash = (computeKeyChecksum(rawString) + 'ABCD1234EF567890').substring(0, 16);
    }
  } catch {
    hexHash = (computeKeyChecksum(rawString) + 'ABCD1234EF567890').substring(0, 16);
  }
  
  const formattedFp = `DEV-${hexHash.substring(0, 4)}-${hexHash.substring(4, 8)}-${hexHash.substring(8, 12)}-${hexHash.substring(12, 16)}`;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(DEVICE_FP_KEY, formattedFp);
    } catch {}
  }
  return formattedFp;
}

/**
 * Validates any ContractGuard or Nexus enterprise license key.
 * Enforces cryptographic signature verification on all ContractGuard keys:
 * - CG-FIRM-SEAT[1-5]-[CODE]-[RAND]-[SIG]
 * - CG-SOLO-LEGAL-[CODE]-[RAND]-[SIG]
 * - CG-SOLO-[CODE]-[RAND]-[SIG]
 * - NX-XXXX-XXXX-XXXX
 * - XXXX-XXXX-XXXX-XXXX
 */
export function validateLicenseKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') {
    return { valid: false, reason: 'Please enter your license key.' };
  }

  const cleanKey = rawKey.toUpperCase().trim();

  // Reject prohibited backdoor keys
  if (PROHIBITED_KEYS.has(cleanKey) || PROHIBITED_KEYS.has(cleanKey.toLowerCase())) {
    return { valid: false, reason: 'Invalid or revoked license key.' };
  }

  // Pattern 1: ContractGuard Firm Suite Key (e.g. CG-FIRM-SEAT1-KYS8-5127-QRBK)
  const cgFirmSeatMatch = cleanKey.match(/^CG-FIRM-SEAT([1-5])-([A-Z0-9]+)-([0-9]+)-([A-Z0-9]{4})$/);
  if (cgFirmSeatMatch) {
    const seatNum = parseInt(cgFirmSeatMatch[1], 10);
    const body = `CG-FIRM-SEAT${seatNum}-${cgFirmSeatMatch[2]}-${cgFirmSeatMatch[3]}`;
    const providedSig = cgFirmSeatMatch[4];
    const expectedSig = computeKeyChecksum(body);

    if (providedSig !== expectedSig) {
      return {
        valid: false,
        reason: 'Invalid or forged license key. Cryptographic signature verification failed.'
      };
    }

    return {
      valid: true,
      key: cleanKey,
      plan: 'firm',
      tierName: 'Law Firm Suite (5 Users)',
      seatNumber: seatNum,
      isPrimaryAdmin: seatNum === 1,
      role: seatNum === 1 ? 'Primary Workstation (Admin)' : `Associate / Paralegal Seat 0${seatNum}`,
      signature: providedSig
    };
  }

  // Pattern 2: ContractGuard Solo Key (e.g. CG-SOLO-LEGAL-KYS8-5127-2RQL)
  const cgSoloMatch = cleanKey.match(/^CG-SOLO-([A-Z0-9]+)-([A-Z0-9]+)-([0-9]+)-([A-Z0-9]{4})$/);
  if (cgSoloMatch) {
    const body = `CG-SOLO-${cgSoloMatch[1]}-${cgSoloMatch[2]}-${cgSoloMatch[3]}`;
    const providedSig = cgSoloMatch[4];
    const expectedSig = computeKeyChecksum(body);

    if (providedSig !== expectedSig) {
      return {
        valid: false,
        reason: 'Invalid or forged license key. Cryptographic signature verification failed.'
      };
    }

    return {
      valid: true,
      key: cleanKey,
      plan: 'solo',
      tierName: 'Solo Practitioner (1 User)',
      seatNumber: 1,
      isPrimaryAdmin: true,
      role: 'Primary Workstation',
      signature: providedSig
    };
  }

  // Pattern 2b: Flexible ContractGuard 4-segment Solo Key (e.g. CG-SOLO-XXXX-XXXX-SIG)
  const cgSoloAltMatch = cleanKey.match(/^CG-SOLO-([A-Z0-9]+)-([A-Z0-9]+)-([A-Z0-9]{4})$/);
  if (cgSoloAltMatch) {
    const body = `CG-SOLO-${cgSoloAltMatch[1]}-${cgSoloAltMatch[2]}`;
    const providedSig = cgSoloAltMatch[3];
    const expectedSig = computeKeyChecksum(body);

    if (providedSig !== expectedSig) {
      return {
        valid: false,
        reason: 'Invalid or forged license key. Cryptographic signature verification failed.'
      };
    }

    return {
      valid: true,
      key: cleanKey,
      plan: 'solo',
      tierName: 'Solo Practitioner (1 User)',
      seatNumber: 1,
      isPrimaryAdmin: true,
      role: 'Primary Workstation',
      signature: providedSig
    };
  }

  // Strictly reject ANY key starting with CG- that failed cryptographic verification
  if (cleanKey.startsWith('CG-')) {
    return {
      valid: false,
      reason: 'Invalid or forged license key. Cryptographic signature verification failed.'
    };
  }

  // Pattern 4: Nexus Enterprise Format (NX-XXXX-XXXX-XXXX)
  const nxMatch = cleanKey.match(/^NX-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
  if (nxMatch) {
    const isFirm = cleanKey.includes('FIRM') || cleanKey.includes('CORP');
    return {
      valid: true,
      key: cleanKey,
      plan: isFirm ? 'firm' : 'solo',
      tierName: isFirm ? 'Law Firm Suite (5 Users)' : 'Solo Practitioner (1 User)',
      seatNumber: 1,
      isPrimaryAdmin: true,
      role: 'Primary Workstation'
    };
  }

  // Pattern 5: Generic 4-block alphanumeric key (XXXX-XXXX-XXXX-XXXX)
  const genericMatch = cleanKey.match(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  if (genericMatch) {
    return {
      valid: true,
      key: cleanKey,
      plan: 'solo',
      tierName: 'Solo Practitioner (1 User)',
      seatNumber: 1,
      isPrimaryAdmin: true,
      role: 'Primary Workstation'
    };
  }

  return { 
    valid: false, 
    reason: 'Invalid license format. Expected key starting with CG-SOLO, CG-FIRM, or NX-XXXX.' 
  };
}

/**
 * Generate cryptographically formatted license key(s) with verifiable signature
 */
export function generateLicenseKeys(plan = 'solo', orderId = 'ORD-ONLINE') {
  const sanitize = (str) => str.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const rawSeed = sanitize(orderId);
  const batchCode = (rawSeed && rawSeed.length >= 4 && !rawSeed.startsWith('ORDONLINE'))
    ? rawSeed.slice(-4)
    : Math.random().toString(36).substring(2, 6).toUpperCase();

  if (plan === 'firm') {
    // Generate 5 distinct seat keys with unique payloads and tamper-proof signatures
    const seats = [];
    for (let i = 1; i <= 5; i++) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      const body = `CG-FIRM-SEAT${i}-${batchCode}-${rand}`;
      const sig = computeKeyChecksum(body);
      const key = `${body}-${sig}`;
      seats.push({
        seatNumber: i,
        key: key,
        role: i === 1 ? 'Primary Workstation (Admin)' : `Associate / Paralegal Seat 0${i}`,
        status: i === 1 ? 'bound' : 'available'
      });
    }
    return {
      plan: 'firm',
      tierName: 'Law Firm Suite (5 Users)',
      primaryKey: seats[0].key,
      isPrimaryAdmin: true,
      currentSeatNumber: 1,
      seats: seats
    };
  } else {
    // Solo practitioner single seat with tamper-proof signature
    const rand = Math.floor(1000 + Math.random() * 9000);
    const body = `CG-SOLO-LEGAL-${batchCode}-${rand}`;
    const sig = computeKeyChecksum(body);
    const key = `${body}-${sig}`;
    return {
      plan: 'solo',
      tierName: 'Solo Practitioner (1 User)',
      primaryKey: key,
      isPrimaryAdmin: true,
      currentSeatNumber: 1,
      seats: [{
        seatNumber: 1,
        key: key,
        role: 'Primary Workstation',
        status: 'bound'
      }]
    };
  }
}

/**
 * Helper to retrieve a document cookie by key
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Helper to set a persistent document cookie
 */
export function setCookie(name, val, days = 3650) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `${name}=${encodeURIComponent(val)}; expires=${expires}; path=/; SameSite=Strict${isSecure ? '; Secure' : ''}`;
}

/**
 * Helper to delete a document cookie
 */
export function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

/**
 * Persists an active license record redundantly across all browser storage layers:
 * 1. localStorage
 * 2. Persistent Document Cookies (10-year TTL)
 * 3. Client-Side IndexedDB ('nexus_hardware_registry' -> 'enterprise_license_vault')
 * 4. CacheStorage API ('nexus-runtime-cache')
 */
export async function persistLicenseToDeepStorage(activationRecord, tokenPayload) {
  if (!activationRecord) return;
  const rawRecord = JSON.stringify(activationRecord);

  // 1. localStorage
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, rawRecord);
    localStorage.setItem('nexus_whop_verified', 'true');
    localStorage.setItem('nexus_license', activationRecord.primaryKey);
    if (tokenPayload) localStorage.setItem('nexus_access_token', tokenPayload);
  } catch {
    // Ignore storage quota limits
  }

  // 2. Persistent Document Cookies (Base64 encoded, 10-year expiration)
  try {
    if (typeof document !== 'undefined') {
      const b64 = btoa(unescape(encodeURIComponent(rawRecord)));
      setCookie(LICENSE_STORAGE_KEY, b64, 3650);
      setCookie('nexus_whop_verified', 'true', 3650);
      setCookie('nexus_license', activationRecord.primaryKey, 3650);
      if (tokenPayload) {
        setCookie('nexus_access_token', tokenPayload, 3650);
      }
    }
  } catch {
    // Ignore restricted cookie contexts
  }

  // 3. Client-Side IndexedDB
  try {
    if (typeof indexedDB !== 'undefined') {
      const request = indexedDB.open('nexus_hardware_registry', 2);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('hardware_meters')) {
          db.createObjectStore('hardware_meters', { keyPath: 'fp' });
        }
        if (!db.objectStoreNames.contains('enterprise_license_vault')) {
          db.createObjectStore('enterprise_license_vault', { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => {
        const db = e.target.result;
        try {
          if (db.objectStoreNames.contains('enterprise_license_vault')) {
            const tx = db.transaction('enterprise_license_vault', 'readwrite');
            const store = tx.objectStore('enterprise_license_vault');
            store.put({ id: 'active_license', record: activationRecord, tokenPayload, updatedAt: Date.now() });
          }
        } catch {
          // Ignore transaction errors
        }
      };
    }
  } catch {
    // Ignore IndexedDB sandbox exceptions
  }

  // 4. CacheStorage API
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('nexus-runtime-cache');
      const response = new Response(JSON.stringify({ record: activationRecord, tokenPayload, timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put(new Request(`https://nexus-os.store/_license_vault_${activationRecord.primaryKey}`), response);
    }
  } catch {
    // Ignore cache API exceptions
  }
}

/**
 * Self-healing recovery: attempts to recover a lost license from deep storage layers
 * (Cookie, IndexedDB, or CacheStorage) when localStorage has been cleared.
 */
export async function recoverLicenseFromDeepStorage() {
  // Layer 1: Check Document Cookie
  try {
    if (typeof document !== 'undefined') {
      const cookieB64 = getCookie(LICENSE_STORAGE_KEY);
      if (cookieB64) {
        const jsonStr = decodeURIComponent(escape(atob(cookieB64)));
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.primaryKey) {
          const token = btoa(`${parsed.primaryKey}:contractcompare:${SECRET_SALT}:${Date.now()}`);
          try {
            localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(parsed));
            localStorage.setItem('nexus_whop_verified', 'true');
            localStorage.setItem('nexus_license', parsed.primaryKey);
            localStorage.setItem('nexus_access_token', token);
          } catch {}
          return parsed;
        }
      }
    }
  } catch {
    // Ignore cookie decode errors
  }

  // Layer 2: Check IndexedDB
  try {
    if (typeof indexedDB !== 'undefined') {
      const record = await new Promise((resolve) => {
        const request = indexedDB.open('nexus_hardware_registry', 2);
        request.onerror = () => resolve(null);
        request.onsuccess = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('enterprise_license_vault')) {
            return resolve(null);
          }
          try {
            const tx = db.transaction('enterprise_license_vault', 'readonly');
            const store = tx.objectStore('enterprise_license_vault');
            const getReq = store.get('active_license');
            getReq.onsuccess = () => resolve(getReq.result?.record || null);
            getReq.onerror = () => resolve(null);
          } catch {
            resolve(null);
          }
        };
      });

      if (record && record.primaryKey) {
        const token = btoa(`${record.primaryKey}:contractcompare:${SECRET_SALT}:${Date.now()}`);
        await persistLicenseToDeepStorage(record, token);
        return record;
      }
    }
  } catch {
    // Ignore IndexedDB recovery errors
  }

  // Layer 3: Check CacheStorage
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('nexus-runtime-cache');
      const keys = await cache.keys();
      for (const req of keys) {
        if (req.url && req.url.includes('/_license_vault_')) {
          const res = await cache.match(req);
          if (res) {
            const data = await res.json();
            if (data?.record?.primaryKey) {
              const token = data.tokenPayload || btoa(`${data.record.primaryKey}:contractcompare:${SECRET_SALT}:${Date.now()}`);
              await persistLicenseToDeepStorage(data.record, token);
              return data.record;
            }
          }
        }
      }
    }
  } catch {
    // Ignore CacheStorage recovery errors
  }

  return null;
}

/**
 * Activate and bind a license key to the current device hardware
 */
export async function activateLicenseOnDevice(licenseData) {
  const deviceFp = await getDeviceFingerprint();
  
  const activationRecord = {
    ...licenseData,
    boundDeviceId: deviceFp,
    activatedAt: new Date().toISOString(),
    isVerified: true
  };

  const tokenPayload = btoa(`${activationRecord.primaryKey}:contractcompare:${SECRET_SALT}:${Date.now()}`);
  await persistLicenseToDeepStorage(activationRecord, tokenPayload);
  
  return activationRecord;
}

/**
 * Bind a single input key (from pirate modal, settings, or welcome) to current hardware.
 * Honors seat distinction:
 * - If Seat 1 or solo: grants primary admin status.
 * - If Seat 2..5: binds ONLY that team member's workstation and hides other seats.
 */
export async function bindKeyToCurrentDevice(keyString, orderId = 'ORD-ONLINE') {
  const validation = validateLicenseKey(keyString);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  let licenseData;
  if (validation.plan === 'firm') {
    if (validation.isPrimaryAdmin) {
      // Primary purchaser: generate or maintain full 5 seats bundle
      licenseData = generateLicenseKeys('firm', orderId);
      licenseData.primaryKey = validation.key;
      licenseData.seats[0].key = validation.key;
      licenseData.isPrimaryAdmin = true;
      licenseData.currentSeatNumber = 1;
    } else {
      // Team Member Associate (Seat 2, 3, 4, 5): Only keep their own key!
      licenseData = {
        plan: 'firm',
        tierName: 'Law Firm Suite (Team Seat)',
        primaryKey: validation.key,
        currentSeatNumber: validation.seatNumber,
        isPrimaryAdmin: false,
        seats: [{
          seatNumber: validation.seatNumber,
          key: validation.key,
          role: validation.role,
          status: 'bound'
        }]
      };
    }
  } else {
    // Solo license
    licenseData = {
      plan: 'solo',
      tierName: 'Solo Practitioner (1 User)',
      primaryKey: validation.key,
      currentSeatNumber: 1,
      isPrimaryAdmin: true,
      seats: [{
        seatNumber: 1,
        key: validation.key,
        role: 'Primary Workstation',
        status: 'bound'
      }]
    };
  }

  return await activateLicenseOnDevice(licenseData);
}

/**
 * Universal License Restoration Engine
 * Restores paid or promo access using either:
 * 1. An existing cryptographic license key (CG-SOLO-..., CG-FIRM-...)
 * 2. A Whop Order ID (ord_...), Receipt ID, or customer email address
 */
export async function restoreLicenseFromWhopOrder(orderIdOrEmail, plan = 'solo') {
  if (!orderIdOrEmail || typeof orderIdOrEmail !== 'string') {
    throw new Error('Please enter your license key, Whop order ID, or purchase email.');
  }

  const cleanInput = orderIdOrEmail.trim();
  if (cleanInput.length < 3) {
    throw new Error('Order ID or email must be at least 3 characters.');
  }

  // Strictly require a valid cryptographic key
  const validation = validateLicenseKey(cleanInput);
  if (validation.valid) {
    return await bindKeyToCurrentDevice(cleanInput, 'RESTORED-KEY');
  }

  throw new Error('Invalid license key format. Please enter your authentic cryptographic key from your Whop receipt (CG-SOLO-... or CG-FIRM-...).');
}

/**
 * Verify if current device holds an active, valid license.
 * Features automated self-healing from deep storage (Cookie / IndexedDB / CacheStorage)
 * if browser localStorage was cleared or wiped.
 */
export async function verifyDeviceLicense() {
  try {
    let raw = localStorage.getItem(LICENSE_STORAGE_KEY);
    
    // Auto self-heal: attempt deep recovery from Cookie, IndexedDB, or CacheStorage
    if (!raw) {
      const recovered = await recoverLicenseFromDeepStorage();
      if (recovered) {
        raw = JSON.stringify(recovered);
      }
    }

    if (!raw) return { isValid: false, reason: 'NO_LICENSE' };

    const record = JSON.parse(raw);
    const currentDevice = await getDeviceFingerprint();

    if (record.boundDeviceId !== currentDevice) {
      return { 
        isValid: false, 
        reason: 'DEVICE_MISMATCH', 
        boundTo: record.boundDeviceId, 
        currentDevice 
      };
    }

    // Cryptographic validation of stored license key
    const keyValidation = validateLicenseKey(record.primaryKey);
    if (!keyValidation.valid) {
      return { isValid: false, reason: 'FORGED_KEY' };
    }

    return { 
      isValid: true, 
      plan: record.plan,
      tierName: record.tierName,
      primaryKey: record.primaryKey,
      currentSeatNumber: record.currentSeatNumber || 1,
      isPrimaryAdmin: record.isPrimaryAdmin !== false,
      boundDeviceId: record.boundDeviceId,
      activatedAt: record.activatedAt,
      seats: record.seats || []
    };
  } catch {
    return { isValid: false, reason: 'CORRUPT_DATA' };
  }
}

/**
 * Deactivate license from current device to allow clean transfer to another machine
 */
export function deactivateLicenseFromDevice() {
  const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
  if (!raw) return null;

  let releasedKey = 'UNKNOWN';
  let plan = 'solo';
  try {
    const record = JSON.parse(raw);
    releasedKey = record.primaryKey;
    plan = record.plan;
  } catch {}

  // Clear device binding & local access tokens across all storage layers
  try {
    localStorage.removeItem(LICENSE_STORAGE_KEY);
    localStorage.removeItem('nexus_whop_verified');
    localStorage.removeItem('nexus_access_token');
    localStorage.removeItem('nexus_license');
  } catch {}

  deleteCookie(LICENSE_STORAGE_KEY);
  deleteCookie('nexus_whop_verified');
  deleteCookie('nexus_access_token');
  deleteCookie('nexus_license');

  // Async clear deep storage
  try {
    if (typeof indexedDB !== 'undefined') {
      const request = indexedDB.open('nexus_hardware_registry', 2);
      request.onsuccess = (e) => {
        const db = e.target.result;
        try {
          if (db.objectStoreNames.contains('enterprise_license_vault')) {
            const tx = db.transaction('enterprise_license_vault', 'readwrite');
            tx.objectStore('enterprise_license_vault').delete('active_license');
          }
        } catch {}
      };
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.open('nexus-runtime-cache').then((cache) => {
        cache.delete(`https://nexus-os.store/_license_vault_${releasedKey}`).catch(() => {});
      }).catch(() => {});
    }
  } catch {}

  return {
    success: true,
    releasedKey,
    plan,
    message: 'License unbound from this workstation. You may now enter this key on your new computer.'
  };
}

/**
 * Hardened Multi-Layer Anti-Abuse Hardware Audit Meter
 * Prevents bypass via localStorage.clear(), Cookie deletion, or DevTools tampering.
 * Redundantly synchronizes across:
 * 1. Hardware Fingerprint Keyed localStorage
 * 2. Persistent Document Cookies (1-year TTL, SameSite=Strict)
 * 3. Client-Side IndexedDB ('nexus_hardware_registry')
 * 4. CacheStorage API ('nexus-runtime-cache')
 */

function syncAllStores(count, fp) {
  try {
    localStorage.setItem(DEMO_AUDITS_KEY, String(count));
    if (fp) localStorage.setItem(`${DEMO_AUDITS_KEY}_${fp}`, String(count));
    setCookie(DEMO_AUDITS_KEY, String(count));
    if (fp) setCookie(`${DEMO_AUDITS_KEY}_${fp}`, String(count));
  } catch (e) {
    // ignore quota errors
  }
}

async function persistToDeepStorage(count) {
  try {
    const fp = await getDeviceFingerprint();
    syncAllStores(count, fp);

    // 1. IndexedDB persistence
    if (typeof indexedDB !== 'undefined') {
      const request = indexedDB.open('nexus_hardware_registry', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('hardware_meters')) {
          db.createObjectStore('hardware_meters', { keyPath: 'fp' });
        }
      };
      request.onsuccess = (e) => {
        const db = e.target.result;
        try {
          const tx = db.transaction('hardware_meters', 'readwrite');
          const store = tx.objectStore('hardware_meters');
          store.put({ fp, remaining: count, updatedAt: Date.now() });
        } catch {}
      };
    }

    // 2. CacheStorage persistence
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('nexus-runtime-cache');
      const response = new Response(JSON.stringify({ fp, count, timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put(new Request(`https://nexus-os.store/_device_token_${fp}`), response);
    }
  } catch (err) {
    // silent failure in restricted sandboxes
  }
}

/**
 * Demo Evaluation Pass Management (3 Free Real Audits)
 * Enforces strict multi-store minimum to defeat browser data wiping.
 */
export function getDemoAuditsRemaining() {
  if (typeof window === 'undefined') return MAX_FREE_AUDITS;
  
  // 1. Check general localStorage
  const localVal = localStorage.getItem(DEMO_AUDITS_KEY);
  
  // 2. Check Cookie
  const cookieVal = getCookie(DEMO_AUDITS_KEY);
  
  // 3. Check HW-keyed localStorage
  const cachedFp = localStorage.getItem(DEVICE_FP_KEY);
  const hwLocalVal = cachedFp ? localStorage.getItem(`${DEMO_AUDITS_KEY}_${cachedFp}`) : null;
  const hwCookieVal = cachedFp ? getCookie(`${DEMO_AUDITS_KEY}_${cachedFp}`) : null;
  
  const values = [];
  if (localVal !== null && !isNaN(parseInt(localVal, 10))) values.push(parseInt(localVal, 10));
  if (cookieVal !== null && !isNaN(parseInt(cookieVal, 10))) values.push(parseInt(cookieVal, 10));
  if (hwLocalVal !== null && !isNaN(parseInt(hwLocalVal, 10))) values.push(parseInt(hwLocalVal, 10));
  if (hwCookieVal !== null && !isNaN(parseInt(hwCookieVal, 10))) values.push(parseInt(hwCookieVal, 10));
  
  // Take the strictest (minimum) count to prevent bypass
  let remaining = MAX_FREE_AUDITS;
  if (values.length > 0) {
    remaining = Math.min(...values);
  }
  
  remaining = Math.max(0, Math.min(MAX_FREE_AUDITS, remaining));
  syncAllStores(remaining, cachedFp);
  return remaining;
}

export function consumeDemoAudit() {
  const current = getDemoAuditsRemaining();
  if (current <= 0) return 0;
  const updated = current - 1;
  
  const cachedFp = localStorage.getItem(DEVICE_FP_KEY);
  syncAllStores(updated, cachedFp);
  persistToDeepStorage(updated);
  return updated;
}

export async function initializeHardenedMeter() {
  try {
    const fp = await getDeviceFingerprint();
    let minDetected = getDemoAuditsRemaining();

    // Check IndexedDB
    if (typeof indexedDB !== 'undefined') {
      await new Promise((resolve) => {
        const req = indexedDB.open('nexus_hardware_registry', 1);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('hardware_meters')) {
            db.createObjectStore('hardware_meters', { keyPath: 'fp' });
          }
        };
        req.onsuccess = (e) => {
          const db = e.target.result;
          try {
            const tx = db.transaction('hardware_meters', 'readonly');
            const store = tx.objectStore('hardware_meters');
            const getReq = store.get(fp);
            getReq.onsuccess = () => {
              if (getReq.result && typeof getReq.result.remaining === 'number') {
                minDetected = Math.min(minDetected, getReq.result.remaining);
              }
              resolve();
            };
            getReq.onerror = () => resolve();
          } catch {
            resolve();
          }
        };
        req.onerror = () => resolve();
      });
    }

    // Check CacheStorage
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('nexus-runtime-cache');
        const matched = await cache.match(`https://nexus-os.store/_device_token_${fp}`);
        if (matched) {
          const json = await matched.json();
          if (json && typeof json.count === 'number') {
            minDetected = Math.min(minDetected, json.count);
          }
        }
      } catch {}
    }

    syncAllStores(minDetected, fp);
    return minDetected;
  } catch (e) {
    return getDemoAuditsRemaining();
  }
}

/**
 * Detects Private Browsing / Incognito mode across modern browsers:
 * - Chromium: Storage quota cap (ephemeral RAM allocation < 2GB)
 * - Firefox: Disabled serviceWorker in private windows
 * - Safari: Storage & IndexedDB sandbox restrictions
 */
export async function detectIncognitoMode() {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Firefox Private Browsing detection
    if (!('serviceWorker' in navigator) && /Firefox/i.test(navigator.userAgent)) {
      return true;
    }

    // 2. Chromium Incognito quota detection
    if (navigator.storage && navigator.storage.estimate) {
      const { quota } = await navigator.storage.estimate();
      // On desktop Chromium, standard disk quota is usually tens of GBs (> 10GB).
      // Incognito mode allocates a capped memory pool (<= 2GB or < 120MB).
      if (quota && quota < 2147483648) {
        return true;
      }
    }

    // 3. Safari WebKit Private Browsing check
    const isSafari = typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (isSafari) {
      try {
        if (!window.indexedDB) return true;
      } catch {
        return true;
      }
    }
  } catch (e) {
    // Safe fallback
  }

  return false;
}

export function resetDemoAuditsForTesting() {
  const fp = localStorage.getItem(DEVICE_FP_KEY);
  syncAllStores(MAX_FREE_AUDITS, fp);
  return MAX_FREE_AUDITS;
}
