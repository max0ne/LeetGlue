import {
  StorageKeys
} from './types';

export const getStorage = (key: StorageKeys) => (new Promise((resolve) => {
  chrome.storage.sync.get(key, (obj) => resolve(obj[key]));
}));
