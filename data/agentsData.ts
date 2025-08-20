import type { Registry } from '../types';

export const registryData: Registry = {
  "TEMPLATES": {
    "REACT": { "path": "./react-vite", "tags": ["spa", "frontend", "vite"] },
    "VUE": { "path": "./vue", "tags": ["spa", "frontend"] },
    "VITE": { "path": "./vite", "tags": ["build", "bundler"] },
    "TYPESCRIPT": { "path": "./typescript", "tags": ["typed", "frontend"] },
    "VANILLA": { "path": "./vanilla", "tags": ["basic", "javascript"] }
  },
  "UI": {
    "SHADCN": { "path": "./shadcn-ui", "tags": ["ui", "components"] },
    "TAILWIND": { "path": "./tailwind-css", "tags": ["styles", "utility-css"] }
  },
  "DATASTORE": {
    "IndexedDB": { "path": "./datastore/indexeddb", "tags": ["local", "browser-db"] },
    "JSONStore": { "path": "./datastore/json-store", "tags": ["file", "object-store"] }
  }
};
