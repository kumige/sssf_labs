// indexedDB stuff
let indexedDB;

if (self.indexedDB) {
  indexedDB = self.indexedDB;
} else {
  indexedDB = window.indexedDB;
}

const request = indexedDB.open("greetings", 1);
let db;

request.onupgradeneeded = (e) => {
  console.log("onupgradeneeded");
  const db = request.result;
  const outB = db.createObjectStore("outbox", { autoIncrement: true });
  const inB = db.createObjectStore("inbox", { autoIncrement: true });
};

request.onerror = (e) => {
  console.log("Error while opening indexedDB");
};

request.onsuccess = () => {
  console.log("open successful");
  db = request.result;

  db.onerror = (e) => {
    console.error("Database error: ", e.target.errorCode);
  };
};

const saveData = (name, data) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, "readwrite");
    const store = tx.objectStore(name);
    store.put(data);

    tx.oncomplete = () => {
      console.log("transaction successful");
      resolve(true);
    };
    tx.onerror = (e) => {
      console.log("tx error");
      reject("tx error");
    };
  });
};

const loadData = (name) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, "readwrite");
    const store = tx.objectStore(name);
    const query = store.getAll();

    tx.oncomplete = () => {
      console.log("query successful", query.result);
      resolve(query.result);
    };
    tx.onerror = (e) => {
      console.log("query error");
      reject("query error");
    };
  });
};

const clearData = (name) => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, "readwrite");
    const store = tx.objectStore(name);
    store.clear();

    tx.oncomplete = () => {
      console.log("clear successful");
      resolve(true);
    };
    tx.onerror = (e) => {
      console.log("clear error");
      reject("clear error");
    };
  });
};
