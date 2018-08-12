import * as handleRequests from './handle_requests';

console.log('backgddd');

chrome.runtime.onMessageExternal.addListener(handleRequests.onRequest);

chrome.notifications.onClicked.addListener((noteID) => {
  chrome.tabs.create({ url: `https://github.com/max0ne/test/commit/${noteID}` });
});
