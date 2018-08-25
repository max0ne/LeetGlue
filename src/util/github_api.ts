import axios, { AxiosInstance } from 'axios';
import { Base64 } from 'js-base64';
import * as types from './types';

export default class GithubAPI {
  client: AxiosInstance;

  constructor(token) {
    const authHeader = token ? {
      Authorization: `token ${token}`,
    } : { };
    this.client = axios.create({
      headers: {
        ...authHeader
      },
      baseURL: 'https://api.github.com',
    });
  }

  /**
   * get currently signed in user
   * useful for testing api token valid
   */
  getUser = async () => {
    return (await this.client.get(`/user`)).data as types.GithubUserResponse;
  }

  /**
   * get repo detail
   * useful for checking if current user has `push` permission to this repo
   * use (await api.getRepo(repoIdentifier)).permissions.push to check for having push permission
   */
  getRepo = async (repoIdentifier) => {
    return (await this.client.get(`/repos/${repoIdentifier}`)).data as types.RepoResponse;
  }

  /**
   * query a file object on github
   */
  getFile = async (owner: string, repo: string, path: string) => {
    return (await this.client.get(`/repos/${owner}/${repo}/contents/${path}`)).data;
  }

  /**
   * create new file if `sha` is undefined
   * update file if `sha` is defined
   */
  putFileContent = async (
    owner: string, repo: string,
    path: string, message: string, content: string,
    sha: string | undefined) => {
    const body = {
      message,
      content: Base64.encode(content),
    };
    if (sha) {
      body['sha'] = sha;
    }
    return (await this.client.put(`/repos/${owner}/${repo}/contents/${path}`, body)).data;
  }

  /**
   * create new file if doenst exists
   * update file if exists
   */
  createOrUpdateFileContent = async (
    owner: string, repo: string,
    path: string, message: string, content: string) => {
    const sha = (await this.getFile(owner, repo, path).catch(() => ({}))).sha;
    return this.putFileContent(owner, repo, path, message, content, sha);
  }
}
