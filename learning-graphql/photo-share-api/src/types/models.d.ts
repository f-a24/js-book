import { PhotoCategory } from './generated/graphql';

export type UserModel = {
  name: string;
  githubLogin: string;
  githubToken: string;
  avatar: string;
};

export type PhotoModel = {
  category?: PhotoCategory;
  description?: string | null;
  name: string;
  userID: string;
  created: string;
};

export type TagModel = {
  githubLogin: string;
  photoID: string;
};
