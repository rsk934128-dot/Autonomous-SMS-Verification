export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  total_private_repos?: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export interface GitHubFileEntry {
  path: string;
  content: string;
  isCustom?: boolean;
}

export interface GitHubPushRequest {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  commitMessage: string;
  files: GitHubFileEntry[];
  createNewRepo?: boolean;
  repoDescription?: string;
  isPrivate?: boolean;
}

export interface GitHubPushResponse {
  success: boolean;
  repoUrl: string;
  commitSha: string;
  commitUrl: string;
  branch: string;
  totalFilesPushed: number;
  message?: string;
  error?: string;
}

export interface SavedGitHubPushRecord {
  id: string;
  repoName: string;
  repoUrl: string;
  commitSha: string;
  commitUrl: string;
  branch: string;
  commitMessage: string;
  filesCount: number;
  createdAt: string;
  projectTitle: string;
  authorLogin: string;
}
