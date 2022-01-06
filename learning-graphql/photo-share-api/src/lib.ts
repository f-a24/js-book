import fs, { ReadStream } from 'fs';
import fetch from 'node-fetch';

type Credentials = {
  client_id: string;
  client_secret: string;
  code: string;
};
const requestGithubToken = (credentials: Credentials) =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error));
    });

const requestGithubUserAccount = (token: string) =>
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`
    }
  })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error));
    });

export const authorizeWithGithub = async (credentials: Credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
};

export const uploadStream = (stream: ReadStream, path: string) =>
  new Promise((resolve, reject) => {
    stream
      .on('error', error => {
        if ((stream as any).truncated) fs.unlinkSync(path);
        reject(error);
      })
      .on('end', resolve)
      .pipe(fs.createWriteStream(path));
  });
