import * as UrlPattern from 'url-pattern';
import * as _ from 'lodash';
import GithubAPI from './github_api';
import {
  CheckResponse,
  SubmissionResponse,
  InjectedRequest,
  fileExtensions,
} from './types';

export const checkPattern = new UrlPattern('*/submissions/detail/:subid/check*');
export const submissionPattern = new UrlPattern('*/problems/:probname/submit*');

/**
 * list of pending submission requests
 */
const pendingSubmissions = [] as InjectedRequest[];

export const handleSubmission = (injectedRequest: InjectedRequest, probname: string) => {
  pendingSubmissions.push(injectedRequest);
}

export const handleCheck = async (injectedRequest: InjectedRequest, subid: string) => {
  const resp = injectedRequest.responseBody as CheckResponse;
  if (resp.state !== 'SUCCESS') {
    return;
  }
  if (resp.status_code != 10) {
    return;
  }

  const submission = pendingSubmissions.find((sub) => (
    (sub.responseBody as SubmissionResponse).submission_id || '').toString() == subid);
  // submission request not found - unexpected, should toast some error
  if (!submission) {
    // TODO: toast err
    console.error('!submission', { submission });
    return;
  }
  _.pull(pendingSubmissions, submission);

  const { typed_code } = submission.postData;
  const { probname } = submissionPattern.match(submission.url);
  if (!typed_code || !probname) {
    // TODO: toast err
    console.error(`!typed_code || !probname`, { typed_code, probname, submission });
    return;
  }
  
  const filename = `${probname}.${fileExtensions[resp.lang] || resp.lang}`;
  // TODO: add storage for these
  const token = '= =';
  const user = 'max0ne';
  const repo = 'test';
  const msg = 'auto created commit by LeetGlue';
  const api = new GithubAPI(token);
  const githubFile = (await api.getFile(user, repo, filename).catch(() => { })) || { };
  const putFileResponse = await api.putFileContent(user, repo, filename, msg, typed_code, githubFile.sha);
  chrome.notifications.create(putFileResponse.commit.sha, {
    type: 'basic',
    title: 'LeetGlue',
    message: `💪 <${filename}> Pushed to your Github`,
    iconUrl: chrome.runtime.getURL('Octocat.png'),
  });
}
