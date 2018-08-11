import * as UrlPattern from 'url-pattern';
import * as _ from 'lodash';
import GithubAPI from './github_api';

const checkPattern = new UrlPattern('*/submissions/detail/:subid/check*');
const submissionPattern = new UrlPattern('*/problems/:probname/submit*');

export const onRequest = (injectedRequest: InjectedRequest) => {
  const checkMatch = checkPattern.match(injectedRequest.url);
  const submitMatch = submissionPattern.match(injectedRequest.url);
  if (checkMatch && checkMatch.subid) {
    handleCheck(injectedRequest, checkMatch.subid);
  } else if (submitMatch) {
    handleSubmission(injectedRequest, submitMatch.probname);
  }
}

/**
 * list of pending submission requests
 */
const pendingSubmissions = [] as InjectedRequest[];

const handleSubmission = (injectedRequest: InjectedRequest, probname: string) => {
  pendingSubmissions.push(injectedRequest);
}

const handleCheck = async (injectedRequest: InjectedRequest, subid: string) => {
  const resp = injectedRequest.responseBody as CheckResponse;
  if (resp.state !== 'SUCCESS') {
    return;
  }
  if (resp.status_code != 10) {
    return;
  }

  const submission = pendingSubmissions.find((sub) => ((sub.responseBody as SubmissionResponse).submission_id || '').toString() == subid);
  // submission request not found - unexpected, should toast some error
  if (!submission) {
    // TODO: toast err
    console.error('!submission', { submission });
    return;
  }
  _.pull(pendingSubmissions, submission);

  const { typed_code } = submission.requestHeaders;
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
  console.log('done', await api.putFileContent(user, repo, filename, msg, typed_code, githubFile.sha));
}

const fileExtensions = {
  python: 'py',
  python3: 'py',
  c: 'c:',
  cpp: 'cpp',
  csharp: 'cs',
  java: 'java',
  javascript: 'js',
  ruby: 'rb',
  golang: 'go',
  swift: 'swift',
  scala: 'scala',
  kotlin: 'kt',
  bash: 'sh',
  mysql: 'sql',
  mssql: 'sql',
  oraclesql: 'sql',
};

export interface RequestHeaders {
  [key: string]: string;
}

export interface CheckResponse {
  status_code: number;
  code_output: string;
  std_output: string;
  compare_result: string;
  status_runtime: string;
  display_runtime: string;
  question_id: string;
  user_id: number;
  lang: string;
  judge_type: string;
  run_success: boolean;
  total_correct: number;
  total_testcases: number;
  status_msg: string;
  state: string;
}

export interface SubmissionResponse {
  submission_id: number;
}

export interface InjectedRequest {
  url: string;
  requestHeaders: RequestHeaders;
  responseBody: any;
  responseHeaders: string;
}
