import * as types from './types';

export const getStorage = (key: types.StorageKeys) => (new Promise((resolve) => {
  chrome.storage.sync.get(key, (obj) => resolve(obj[key]));
}));

export const getAllCookie: ((url: string) => Promise<chrome.cookies.Cookie[]>) =
  (url: string) => (new Promise((resolve) => {
    chrome.cookies.getAll({ url }, resolve);
  }));

export const fileName = (slugName: string, lang: string) => {
  const extension = types.fileExtensions[lang];
  return extension ? `${slugName}.${extension}` : slugName;
};
