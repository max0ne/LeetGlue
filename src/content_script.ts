/**
 * code in contentscript.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */
var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.js');
s.onload = function() {
  this.remove();
};

(document.head || document.documentElement).appendChild(s);
