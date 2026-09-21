import type { Session } from "./workout";

const DB_NAME = "forearm-lab";
const DB_VERSION = 1;
const STORE = "sessions";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Impossible d'ouvrir la base locale."));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readAll<T>(storeName: string): Promise<T[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as T[]);
  });
}

export async function getSessions() {
  if (typeof window === "undefined" || !window.indexedDB) return [];
  return (await readAll<Session>(STORE)).sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveSession(session: Session) {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(session);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function saveSessions(sessions: Session[]) {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    const store = transaction.objectStore(STORE);
    sessions.forEach((session) => store.put(session));
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}
