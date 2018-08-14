/**
 * copy pasta code from https://stackoverflow.com/a/48134114
 * intercept http requests
 */
(function (xhr) {  
  const tryParse = (str) => {
    try { return JSON.parse(str); }
    catch { }
  }
  
  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function (postData) {

    this.addEventListener('load', function () {
      var endTime = (new Date()).toISOString();

      var myUrl = this._url ? this._url.toLowerCase() : this._url;
      if (myUrl) {

        if (postData) {
          if (typeof postData === 'string') {
            try {
              // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
              this._postData = postData;
            } catch (err) {
              console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
              console.log(err);
            }
          } else if (typeof postData === 'object' || (typeof postData as string) === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
            console.log({postData});
          }
        }

        // here you get the RESPONSE HEADERS
        var responseHeaders = this.getAllResponseHeaders();

        if (this.responseType === 'blob' || !this.responseText) {
          return;
        }

        try {
          const injectedRequest = {
            url: this._url,
            postData: tryParse(this._postData) || this._postData,
            requestHeaders: this._requestHeaders,
            responseBody: tryParse(this.responseText) || this.responseText,
            responseHeaders,
          };
          chrome.runtime.sendMessage('fggchiinmngbohjgbmdfmjolgealcaji', injectedRequest);
        }
        catch (err) {
          console.error('LeetGlue Failure', err);
        }
      }
    });

    return send.apply(this, arguments);
  };

})(XMLHttpRequest);
