import axios from 'axios';
import * as _ from 'lodash';

import * as types from '../util/types';
import { modifyRequest } from '../util/modify_request';

export default class LeetCodeAPI {
  cookies: chrome.cookies.Cookie[];

  /**
   * @param cookies list of cookies aquired from leetcode.com used as credentials
   */
  constructor(cookies: chrome.cookies.Cookie[]) {
    this.cookies = cookies;
  }

  _withRequestModifier = async (func: () => Promise<any>) => {

    // setup request intercept to work around leetcode's anti csrf stuff
    const requestModifier = modifyRequest({
      cookie: this.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; '),
      origin: 'https://leetcode.com',
      referer: 'https://leetcode.com',
      'x-csrftoken': this.cookies.find((cookie) => cookie.name === 'csrftoken').value,
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
    let res: any;
    let err: Error;
    try {
      res = await func();
    } catch (err) {
      err = err;
    }
    chrome.webRequest.onBeforeSendHeaders.removeListener(requestModifier);

    if (!_.isNil(err)) {
      throw err;
    }
    return res;
  };

  getAllProblems = async () => {
    let res: types.AllProblemResponse;
    await this._withRequestModifier(async () => {
      res = (await axios.get('https://leetcode.com/api/problems/all/')).data;
    })
    return res;
  };

  getLatestSubmission = async (qid: string, lang: string) => {
    let res: types.LatestSubmissionResponse;
    await this._withRequestModifier(async () => {
      const param = { qid, lang };
      res = (await axios.post('https://leetcode.com/submissions/latest/', param)).data;
    })
    return res;
  };

}