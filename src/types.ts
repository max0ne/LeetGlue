
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
  requestHeaders: any;
  responseBody: any;
  responseHeaders: string;
  postData: any;
}

export const fileExtensions = {
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
