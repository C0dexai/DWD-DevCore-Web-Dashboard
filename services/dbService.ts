import { ChatMessage, Container } from '../types';

const DB_NAME = 'cortex-ai-db';
const DB_VERSION = 2; // Incremented version for schema change
const CHAT_MESSAGES_STORE = 'chatMessages';
const CONTAINERS_STORE = 'containers';

let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
        console.error("This browser doesn't support IndexedDB");
        reject(new Error("IndexedDB not supported"));
        return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(new Error('IndexedDB error'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(CHAT_MESSAGES_STORE)) {
        db.createObjectStore(CHAT_MESSAGES_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(CONTAINERS_STORE)) {
        db.createObjectStore(CONTAINERS_STORE, { keyPath: 'id' });
      }
    };
  });
  return dbPromise;
};

// --- Chat Message Functions ---

export const addChatMessage = async (message: ChatMessage): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(CHAT_MESSAGES_STORE, 'readwrite');
  const store = tx.objectStore(CHAT_MESSAGES_STORE);
  store.add(message);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const updateChatMessage = async (message: ChatMessage): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(CHAT_MESSAGES_STORE, 'readwrite');
  const store = tx.objectStore(CHAT_MESSAGES_STORE);
  store.put(message); // Use put to add or update
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};


export const getAllChatMessages = async (): Promise<ChatMessage[]> => {
  const db = await initDB();
  const tx = db.transaction(CHAT_MESSAGES_STORE, 'readonly');
  const store = tx.objectStore(CHAT_MESSAGES_STORE);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const messages = request.result.sort((a, b) => {
        const timeA = parseInt(a.id.split('-')[1], 10);
        const timeB = parseInt(b.id.split('-')[1], 10);
        return timeA - timeB;
      });
      resolve(messages);
    };
    request.onerror = () => {
      console.error('Error fetching messages:', request.error);
      reject(request.error);
    };
  });
};


// --- Container Functions ---

export const saveContainer = async (container: Container): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(CONTAINERS_STORE, 'readwrite');
  const store = tx.objectStore(CONTAINERS_STORE);
  store.put(container); // `put` will add or update
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllContainers = async (): Promise<Container[]> => {
  const db = await initDB();
  const tx = db.transaction(CONTAINERS_STORE, 'readonly');
  const store = tx.objectStore(CONTAINERS_STORE);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const containers = request.result.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      resolve(containers);
    };
    request.onerror = () => {
      console.error('Error fetching containers:', request.error);
      reject(request.error);
    };
  });
};

export const getContainer = async (id: string): Promise<Container | undefined> => {
    const db = await initDB();
    const tx = db.transaction(CONTAINERS_STORE, 'readonly');
    const store = tx.objectStore(CONTAINERS_STORE);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            console.error(`Error fetching container ${id}:`, request.error);
            reject(request.error);
        };
    });
};

export const deleteContainer = async (id: string): Promise<void> => {
    const db = await initDB();
    const tx = db.transaction(CONTAINERS_STORE, 'readwrite');
    const store = tx.objectStore(CONTAINERS_STORE);
    store.delete(id);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};
