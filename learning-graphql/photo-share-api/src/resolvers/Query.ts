import { ObjectId } from 'mongodb';
import { Photo, QueryResolvers, User } from '../types/generated/graphql';

const Query: QueryResolvers = {
  me: (parent, args, { currentUser }) => currentUser,
  totalPhotos: (parent, args, { db }) =>
    db.collection('photos').estimatedDocumentCount(),
  allPhotos: (parent, args, { db }) =>
    db.collection<Photo>('photos').find().toArray(),
  Photo: (parent, args, { db }) =>
    db
      .collection<Photo>('photos')
      .findOne({ _id: ObjectId.createFromHexString(args.id) }),
  totalUsers: (parent, args, { db }) =>
    db.collection('users').estimatedDocumentCount(),
  allUsers: (parent, args, { db }) =>
    db.collection<User>('users').find().toArray(),
  User: (parent, args, { db }) =>
    db.collection<User>('users').findOne({ githubLogin: args.login })
};

export default Query;
