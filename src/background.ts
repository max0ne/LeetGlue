import { InjectedRequest } from './util/types';
import * as submission_handlers from './controller/HandleSubmission';
import ImportSubmissionsController from './controller/ImportSubmissions';

console.log('backgddd');

chrome.runtime.onMessageExternal.addListener((injectedRequest: InjectedRequest) => {
  const checkMatch = submission_handlers.checkPattern.match(injectedRequest.url);
  const submitMatch = submission_handlers.submissionPattern.match(injectedRequest.url);
  if (checkMatch && checkMatch.subid) {
    submission_handlers.handleCheck(injectedRequest, checkMatch.subid);
  } else if (submitMatch) {
    submission_handlers.handleSubmission(injectedRequest, submitMatch.probname);
  }
});

chrome.notifications.onClicked.addListener((noteID) => {
  chrome.tabs.create({ url: `https://github.com/max0ne/test/commit/${noteID}` });
});

setTimeout(() => {
  chrome.storage.sync.set({
    github_token: '= =',
    github_owner: 'max0ne',
    github_repo: 'leetcode',
    language_prefs: ['python3', 'python', 'mysql'],
  });

  (new ImportSubmissionsController()).doImport(['python3', 'python', 'mysql']);
}, 1000);
