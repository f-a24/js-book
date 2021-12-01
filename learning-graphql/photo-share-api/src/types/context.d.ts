import { Db } from 'mongodb';
import { User } from './generated/graphql';

export type Context = {
  db: Db;
  currentUser: User;
};
