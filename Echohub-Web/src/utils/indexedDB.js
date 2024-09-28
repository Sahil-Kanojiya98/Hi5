const dbName = "EchohubDB";
const storeName = "refreshTokens";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const setRefreshToken = async (token) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(token);
    request.onsuccess = () => {
      resolve(true);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const getRefreshToken = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const removeRefreshToken = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => {
      resolve(true);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
