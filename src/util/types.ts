export type StorageKeys = (
  'github_token' |
  'github_owner' |
  'github_repo' |
  'language_prefs'
);

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

export interface Stat {
  question_id: number;
  question__article__live?: boolean;
  question__article__slug: string;
  question__title: string;
  question__title_slug: string;
  question__hide: boolean;
  total_acs: number;
  total_submitted: number;
  frontend_question_id: number;
  is_new_question: boolean;
}

export interface Difficulty {
  level: number;
}

export interface StatStatusPair {
  stat: Stat;
  status: string;
  difficulty: Difficulty;
  paid_only: boolean;
  is_favor: boolean;
  frequency: number;
  progress: number;
}

export interface AllProblemResponse {
  user_name: string;
  num_solved: number;
  num_total: number;
  ac_easy: number;
  ac_medium: number;
  ac_hard: number;
  stat_status_pairs: StatStatusPair[];
  frequency_high: number;
  frequency_mid: number;
  category_slug: string;
}

export interface LatestSubmissionResponse {
  code: string;
}