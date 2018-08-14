import * as _ from 'lodash';

/**
 * return a blocking request modifier function
 * that modifies every header field to given `headers` values
 */
export const modifyRequest = (headers: any) => {
  return (details: chrome.webRequest.WebRequestHeadersDetails) => {
    // do a deep copy of this object b/c we modifies it
    headers = JSON.parse(JSON.stringify(headers));

    // turn all header names to lower case for matching
    _.keys(headers).forEach((key) => {
      const val = headers[key];
      delete headers[key];
      headers[key.toLowerCase()] = val;
    });

    // map all existing ones to new value
    const modifiedHeaders = details.requestHeaders.map((header) => {
      const name = header.name.toLowerCase();
      if (!_.has(headers, name)) {
        return header;
      }
      // if this is a header to be modified
      // pop this header from input
      const value = headers[name];
      delete headers[name];

      // update it's value in to be returned value
      return {
        name: name,
        value,
      };
    });

    // push non existing ones to to-be-returned headers
    const leftoverHeaders = _.map(headers, (value, name) => ({
      name, value,
    }));

    const requestHeaders = [...modifiedHeaders, ...leftoverHeaders];
    return { requestHeaders };
  };
}
