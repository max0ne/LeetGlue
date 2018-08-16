import * as _ from 'lodash';

import {
  StatStatusPair,
} from '../util/types';

import * as types from '../util/types';
import * as util from '../util/util';
import GithubAPI from '../util/github_api';
import LeetCodeAPI from '../util/leetcode_api';
import aquireLeetCodeCredential from './aquireLeetCodeCredential';

interface ImportErr {
  desc: string;
  type: 'leetcode' | 'github';
  err?: Error;
}

export default class ImportSubmissionsController {

  doImport = async (langPref: string[]) => {
    // 1. aquire credentials
    console.log('aquiring credentials');
    const [leetCodeAPI, allProblemsResponse] = await aquireLeetCodeCredential();
    console.log('aquired credentials');
    const allAcceptedProblems = allProblemsResponse.stat_status_pairs.filter((pair) => pair.status === 'ac');
    console.log(`queried total ${allProblemsResponse.stat_status_pairs.length} problems, importing ${allAcceptedProblems.length} accepted problems`);

    // 2. continue app logic
    this._importProblems(
      leetCodeAPI,
      new GithubAPI(await util.getStorage('github_token')),
      langPref,
      allAcceptedProblems,
      (err, problem, index, total) => {
        const progress = `[${index}/${total}]`;
        if (err) {
          console.error(`${progress} unable to import problem ${problem.stat.question__title}, err ${err}`);
        } else {
          console.log(`${progress} problem imported ${problem.stat.question__title}`)
        }
      },
    );
  };

  _importProblems = async (
    leetCodeAPI: LeetCodeAPI,
    githubAPI: GithubAPI,
    langPref: string[],
    allAcceptedProblems: types.StatStatusPair[],
    onProblemImportFinish: (importErr: ImportErr, problem: StatStatusPair, index: number, total: number) => void,
  ) => {
    // 3. post to github with every submission
    for (const idx of _.range(allAcceptedProblems.length)) {
      const stat = allAcceptedProblems[idx];
      const err = await this._syncToGithub(leetCodeAPI, githubAPI, stat, langPref);
      onProblemImportFinish(err, stat, idx, allAcceptedProblems.length);
    }
  }

  _syncToGithub = async (leetCodeAPI: LeetCodeAPI, githubAPI: GithubAPI, statStatus: StatStatusPair, langPref: string[]) => {
    try {
      const submission = await this._queryQuestion(leetCodeAPI, statStatus.stat.question_id, langPref);
      if (!submission) {
        return {
          type: 'leetcode',
          desc: 'Unable to query latest submission from leetcode',
        } as ImportErr;
      }
      const [codeContent, lang] = submission;
      await githubAPI.createOrUpdateFileContent(
        await util.getStorage('github_owner') as string,
        await util.getStorage('github_repo') as string,
        util.fileName(statStatus.stat.question__title_slug, lang),
        'auto created commit by LeetGlue',
        codeContent,
      );
      return undefined;
    } catch (err) {
      return {
        type: 'leetcode',
        desc: `unable to push submission to Github ${err && err.toString()}`,
        err,
      } as ImportErr;
    }
  }

  /**
   * query submission of a problem of a certain language preference
   * return undefined if unable to query submission
   */
  _queryQuestion = async (leetCodeAPI: LeetCodeAPI, qid: number, langPref: string[]) => {
    // merge user provided langPref with all possible ones
    langPref = [
      ...langPref, 
      ..._.keys(types.fileExtensions).filter((lang) => !_.includes(langPref, lang))
    ];

    for (const lang of langPref) {
      const res = await leetCodeAPI.getLatestSubmission(qid.toString(), lang).catch(() => undefined);
      if (res && res.code) {
        return [res.code as string, lang];
      }
    }
    return undefined;
  };
}
