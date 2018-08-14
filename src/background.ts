import { InjectedRequest } from './types';
import * as submission_handlers from './submission_handlers';
import ImportSubmissionsController from './ImportSubmissionsController';

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
  (new ImportSubmissionsController()).doImport();
}, 1000);
