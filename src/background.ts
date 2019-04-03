import { InjectedRequest } from './util/types';
import * as submission_handlers from './controller/HandleSubmission';
import * as util from './util/util';

console.log('backgddd');

chrome.runtime.onMessageExternal.addListener((injectedRequest: InjectedRequest) => {
  console.log('received msg', injectedRequest);
  const checkMatch = submission_handlers.checkPattern.match(injectedRequest.url);
  const submitMatch = submission_handlers.submissionPattern.match(injectedRequest.url);
  if (checkMatch && checkMatch.subid) {
    submission_handlers.handleCheck(injectedRequest, checkMatch.subid);
  } else if (submitMatch) {
    submission_handlers.handleSubmission(injectedRequest, submitMatch.probname);
  }
});

chrome.notifications.onClicked.addListener(async noteID => {
  console.log('received notification click', noteID);

  const repoIdentifier = await util.getStorage('github_repo_identifier');
  chrome.tabs.create({
    url: `https://github.com/${repoIdentifier}/commit/${noteID}`,
  });
});

setTimeout(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('import.html'),
  });
}, 1000);
