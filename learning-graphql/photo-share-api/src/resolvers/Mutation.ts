import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import { authorizeWithGithub } from '../lib';
import {
  MutationResolvers,
  Photo,
  PhotoCategory
} from '../types/generated/graphql';
import { TagModel, UserModel } from '../types/models';

const Mutation: MutationResolvers = {
  async postPhoto(parent, args, { db, currentUser }) {
    if (!currentUser)
      throw new Error('only an authorized user can post a photo');

    const data = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date().toISOString()
    };

    const { insertedId } = await db.collection('photos').insertOne(data);

    return {
      id: insertedId.toString(),
      ...args.input,
      category: args.input.category || PhotoCategory.Portrait,
      url: '',
      githubUser: currentUser.githubLogin,
      postedBy: currentUser,
      taggedUsers: [],
      created: new Date()
    };
  },
  async tagPhoto(parent, args, { db }) {
    await db
      .collection<TagModel>('tags')
      .replaceOne(args, args, { upsert: true });

    const photo = await db
      .collection<Photo>('photos')
      .findOne({ _id: ObjectId.createFromHexString(args.photoID) });

    return photo!;
  },
  async githubAuth(parent, { code }, { db }) {
    const { CLIENT_ID, CLIENT_SECRET } = process.env;
    const { message, access_token, avatar_url, login, name } =
      await authorizeWithGithub({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        code
      });
    if (message) throw new Error(message);

    const data = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };

    await db
      .collection('users')
      .replaceOne({ githubLogin: login }, data, { upsert: true });

    return {
      user: {
        githubLogin: login,
        name,
        avatar: avatar_url,
        postedPhotos: [],
        inPhotos: []
      },
      token: access_token
    };
  },
  async addFakeUsers(parent, { count }, { db }) {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;
    type ResRandomUserApi = {
      login: {
        username: string;
        sha1: string;
      };
      name: {
        first: string;
        last: string;
      };
      picture: {
        thumbnail: string;
      };
    }[];
    const { results }: { results: ResRandomUserApi } = await fetch(
      randomUserApi
    ).then(res => res.json());

    const data = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }));

    await db.collection('users').insertMany(data);

    const users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      postedPhotos: [],
      inPhotos: []
    }));

    return users;
  },
  async fakeUserAuth(parent, { githubLogin }, { db }) {
    const user = await db
      .collection<UserModel>('users')
      .findOne({ githubLogin });

    if (!user)
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`);

    const { name, avatar, githubToken } = user;
    return {
      token: githubToken,
      user: {
        githubLogin: user.githubLogin,
        name,
        avatar,
        postedPhotos: [],
        inPhotos: []
      }
    };
  }
};

export default Mutation;
