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

export interface GithubUserResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
  total_private_repos: number;
  owned_private_repos: number;
  private_gists: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
}


export interface RepoResponse {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string;
  hooks_url: string;
  svn_url: string;
  homepage: string;
  language?: any;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  pushed_at: Date;
  created_at: Date;
  updated_at: Date;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  allow_rebase_merge: boolean;
  allow_squash_merge: boolean;
  allow_merge_commit: boolean;
  subscribers_count: number;
  network_count: number;
};
