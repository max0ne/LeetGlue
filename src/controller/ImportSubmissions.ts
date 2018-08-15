import axios from 'axios';
import * as _ from 'lodash';

import {
  AllProblemResponse,
  StatStatusPair,
} from '../util/types';
import * as util from '../util/util';
import GithubAPI from '../util/github_api';

import { modifyRequest } from '../util/modify_request';

export default class ImportSubmissionsController {
  doImport = async () => {
    let leetCodeTokenStealerTabID = undefined;

    // 1. launch a Leetcode page to steal at least one request with cookie set
    chrome.tabs.create({ url: `https://leetcode.com/accounts/login/` }, (tab => {
      leetCodeTokenStealerTabID = tab.id;
    }));

    // 2. wait for first request that has leetcode cookie set
    const intervalToken = setInterval(async () => {
      const cookies = await util.getAllCookie('https://leetcode.com');
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
    try {
      await this._syncAllToGithub();
    } catch (err) {
      console.log({ err });
    }
    chrome.webRequest.onBeforeSendHeaders.removeListener(requestModifier);
  }

  _syncAllToGithub = async () => {
    // 1. get all problems
    const allProblems = (await axios.get('https://leetcode.com/api/problems/all/')).data as AllProblemResponse;

    // 2. filter out all accepted problems
    const acStats = allProblems.stat_status_pairs
      .filter((ss) => ss.status === 'ac');
    console.log(`${acStats.length} problems status === 'ac'`, acStats);

    // 3. post to github with every submission
    const github = new GithubAPI(await util.getStorage('github_token'));
    const langPref = await util.getStorage('language_prefs') as string[];

    // 4. fire a bunch of workers to do submissions together
    // wait for all of them to finish
    while (!_.isEmpty(acStats)) {
      const stat = acStats.pop();
      console.log(`sync stuff`, stat.stat.question__title, await this._syncToGithub(stat, langPref, github));
    }
  }

  _syncToGithub = async (statStatus: StatStatusPair, langPref: string[], githubAPI: GithubAPI) => {
    try {
      const submission = await this._queryQuestion(statStatus.stat.question_id, langPref);
      if (!submission) {
        return false;
      }
      const [codeContent, lang] = submission;
      await githubAPI.createOrUpdateFileContent(
        await util.getStorage('github_owner') as string,
        await util.getStorage('github_repo') as string,
        util.fileName(statStatus.stat.question__title_slug, lang),
        'auto created commit by LeetGlue',
        codeContent,
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * query submission of a problem of a certain language preference
   * return undefined if unable to query submission
   */
  _queryQuestion = async (qid: number, langPref: string[]) => {
    for (const lang of langPref) {
      const param = { qid: qid.toString(), lang };
      const resp = await axios.post('https://leetcode.com/submissions/latest/', param).catch(() => undefined);
      if (resp && resp.data && resp.data.code) {
        return [resp.data.code as string, lang];
      }
    }
    return undefined;
  };
}
