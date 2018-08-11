import axios, { AxiosInstance } from 'axios';
import { Base64 } from 'js-base64';

export default class GithubAPI {
  client: AxiosInstance;

  constructor(token) {
    this.client = axios.create({
      headers: {
        Authorization: `token ${token}`,
      },
      baseURL: 'https://api.github.com',
    });
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
}
