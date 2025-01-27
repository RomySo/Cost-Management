export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GrushIODB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("CostManagement")) {
        db.createObjectStore("CostManagement", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const addData = (db, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("CostManagement", "readwrite");
    const store = transaction.objectStore("CostManagement");
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const removeData = (db, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("CostManagement", "readwrite");
    const store = transaction.objectStore("CostManagement");
    const request = store.delete(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const getData = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("CostManagement", "readonly");
    const store = transaction.objectStore("CostManagement");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};
