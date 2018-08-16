import * as _ from 'lodash';

import * as types from '../util/types';
import * as util from '../util/util';
import LeetCodeAPI from '../util/leetcode_api';

/**
 * test credentials by hitting `all problems` api and check if user name is returned in it
 * return the response object of `all problems` if valid b/c itll be useful for other parts
 * return `undefined` if credentails not valid
 */
const testCredentials = async (cookies: chrome.cookies.Cookie[]) => {
  try {
    const api = new LeetCodeAPI(cookies);
    const resp = await api.getAllProblems();
    if (!_.isEmpty(resp.user_name)) {
      return [api, resp] as [LeetCodeAPI, types.AllProblemResponse];
    }
  } catch {
    return undefined;
  }
};

const aquireLeetCodeCredential = async () => (new Promise((resolve) => {

  let leetCodeTokenStealerTabID = undefined;

  // 1. launch a Leetcode page to steal at least one request with cookie set
  chrome.tabs.create({ url: `https://leetcode.com/accounts/login/` }, (tab => {
    leetCodeTokenStealerTabID = tab.id;
  }));

  // 2. wait for cookie is useable
  const intervalToken = setInterval(async () => {
    const cookies = await util.getAllCookie('https://leetcode.com');
    
    const resp = await testCredentials(cookies);
    if (_.isNil(resp)) {
      return;
    }

    resolve(resp);
    // close the page
    chrome.tabs.remove(leetCodeTokenStealerTabID);

    // stop refreshing
    clearInterval(intervalToken);
  }, 3000);

})) as Promise<[LeetCodeAPI, types.AllProblemResponse]>;

export default aquireLeetCodeCredential;
