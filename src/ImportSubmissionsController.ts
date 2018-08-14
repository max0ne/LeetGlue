import axios from 'axios';
import * as _ from 'lodash';

import { modifyRequest } from './util/modify_request';

const getAllCookie: ((url: string) => Promise<chrome.cookies.Cookie[]>) = 
  (url: string) => (new Promise((resolve) => {
  chrome.cookies.getAll({ url }, resolve);
}));

export default class ImportSubmissionsController {
  doImport = async () => {
    let leetCodeTokenStealerTabID = undefined;

    // 1. launch a Leetcode page to steal at least one request with cookie set
    chrome.tabs.create({ url: `https://leetcode.com/accounts/login/` }, (tab => {
      leetCodeTokenStealerTabID = tab.id;
    }));

    // 2. wait for first request that has leetcode cookie set
    const intervalToken = setInterval(async () => {
      const cookies = await getAllCookie('https://leetcode.com');
      // use `csrftoken` in cookie as signal that user had successfully logged in
      // since can't really get any callback, just do a setInterval thing
      if (_.isEmpty(cookies.find((cookie) => cookie.name === 'csrftoken'))) {
        return;
      }

      // close the page
      chrome.tabs.remove(leetCodeTokenStealerTabID);

      // stop refreshing
      clearInterval(intervalToken);

      // continue app logic
      this.didReceivedLeetcodeLogin(cookies);
    }, 1000);
  };

  didReceivedLeetcodeLogin = async (cookies: chrome.cookies.Cookie[]) => {
    console.log('did receive csrf token', cookies);
    
    // TODO: update ui here

    // setup request intercept to work around leetcode's anti csrf stuff
    const requestModifier = modifyRequest({
      cookie: cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; '),
      origin: 'https://leetcode.com',
      referer: 'https://leetcode.com',
      'x-csrftoken': cookies.find((cookie) => cookie.name === 'csrftoken').value,
      'x-requested-with': 'XMLHttpRequest',
    });

    chrome.webRequest.onBeforeSendHeaders.addListener(requestModifier, {
        urls: [
          'https://leetcode.com/api/problems/all/',
          'https://leetcode.com/submissions/latest/',
          'http://*/*',
        ],
      }, [
        'requestHeaders',
        'blocking'
      ]);

    // query for `all problems` api
    let allProblems = [];
    try {
      const allProblems = (await axios.get('https://leetcode.com/api/problems/all/')).data;
      console.log((await axios.post('https://leetcode.com/submissions/latest/', { "qid": "175", "lang": "mysql" })).data);
    } catch (err) {
      console.log({ err });
    }
    chrome.webRequest.onBeforeSendHeaders.removeListener(requestModifier);
  }
}
