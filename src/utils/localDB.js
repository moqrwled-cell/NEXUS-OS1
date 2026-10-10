/**
 * Nexus ContractGuard Enterprise — Air-Gapped Local Workspace Persistence (IndexedDB)
 * 100% In-Browser Private Database. Ensures zero data loss across browser reloads or tab closures.
 * 0 Server Calls, 0 Cloud Storage.
 */

const DB_NAME = 'NexusContractGuardDB';
const DB_VERSION = 1;

const STORES = {
  DIFF_SESSIONS: 'diff_sessions',
  REDACTION_LOGS: 'redaction_logs',
  BATES_JOBS: 'bates_jobs'
};

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORES.DIFF_SESSIONS)) {
        const store = db.createObjectStore(STORES.DIFF_SESSIONS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.REDACTION_LOGS)) {
        const store = db.createObjectStore(STORES.REDACTION_LOGS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.BATES_JOBS)) {
        const store = db.createObjectStore(STORES.BATES_JOBS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction(storeName, mode, callback) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const result = callback(store);

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    });
  });
}

// ==========================================
// 1. DIFF SESSIONS REPOSITORY
// ==========================================

export async function saveDiffSession(session) {
  const item = {
    id: session.id || `diff_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: session.title || 'Untitled Contract Audit',
    originalText: session.originalText || '',
    modifiedText: session.modifiedText || '',
    stats: session.stats || null,
    risksCount: session.risksCount || 0,
    createdAt: session.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await runTransaction(STORES.DIFF_SESSIONS, 'readwrite', (store) => {
    store.put(item);
  });
  return item;
}

export async function getAllDiffSessions() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.DIFF_SESSIONS, 'readonly');
    const store = tx.objectStore(STORES.DIFF_SESSIONS);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getDiffSession(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.DIFF_SESSIONS, 'readonly');
    const store = tx.objectStore(STORES.DIFF_SESSIONS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDiffSession(id) {
  await runTransaction(STORES.DIFF_SESSIONS, 'readwrite', (store) => {
    store.delete(id);
  });
  return true;
}

// ==========================================
// 2. REDACTION AUDIT LOGS REPOSITORY
// ==========================================

export async function saveRedactionLog(log) {
  const item = {
    id: log.id || `redact_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: log.title || 'Sanitized Document',
    totalRedactions: log.totalRedactions || 0,
    ruleCounts: log.ruleCounts || {},
    detectedEntities: log.detectedEntities || [],
    createdAt: log.createdAt || new Date().toISOString()
  };

  await runTransaction(STORES.REDACTION_LOGS, 'readwrite', (store) => {
    store.put(item);
  });
  return item;
}

export async function getAllRedactionLogs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.REDACTION_LOGS, 'readonly');
    const store = tx.objectStore(STORES.REDACTION_LOGS);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteRedactionLog(id) {
  await runTransaction(STORES.REDACTION_LOGS, 'readwrite', (store) => {
    store.delete(id);
  });
  return true;
}

// ==========================================
// 3. BATES STAMPING JOBS REPOSITORY
// ==========================================

export async function saveBatesJob(job) {
  const item = {
    id: job.id || `bates_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    prefix: job.prefix || 'EX-',
    startNum: job.startNum || 1,
    totalPages: job.totalPages || 0,
    batesRange: job.batesRange || '',
    manifest: job.manifest || [],
    createdAt: job.createdAt || new Date().toISOString()
  };

  await runTransaction(STORES.BATES_JOBS, 'readwrite', (store) => {
    store.put(item);
  });
  return item;
}

export async function getAllBatesJobs() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.BATES_JOBS, 'readonly');
    const store = tx.objectStore(STORES.BATES_JOBS);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteBatesJob(id) {
  await runTransaction(STORES.BATES_JOBS, 'readwrite', (store) => {
    store.delete(id);
  });
  return true;
}

export async function clearAllLocalData() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORES.DIFF_SESSIONS, STORES.REDACTION_LOGS, STORES.BATES_JOBS], 'readwrite');
    tx.objectStore(STORES.DIFF_SESSIONS).clear();
    tx.objectStore(STORES.REDACTION_LOGS).clear();
    tx.objectStore(STORES.BATES_JOBS).clear();

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
