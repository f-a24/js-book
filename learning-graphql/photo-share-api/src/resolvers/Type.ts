import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId, WithId } from 'mongodb';
import { Photo, Resolvers, User } from '../types/generated/graphql';
import { PhotoModel, TagModel } from '../types/models';

const Type: Resolvers = {
  Photo: {
    id: parent =>
      parent.id || (parent as unknown as WithId<PhotoModel>)._id.toString(),
    url: parent =>
      `https://yoursite.com/img/${
        parent.id || (parent as unknown as WithId<PhotoModel>)._id.toString()
      }.jpg`,
    postedBy: async (parent, args, { db }) => {
      const user = await db.collection<User>('users').findOne({
        githubLogin: (parent as unknown as WithId<PhotoModel>).userID!
      });
      return user!;
    },
    taggedUsers: async (parent, args, { db }) => {
      const tags = await db.collection<TagModel>('tags').find().toArray();
      const { _id } = parent as unknown as WithId<PhotoModel>;
      const logins = tags
        .filter(t => t.photoID === _id.toString())
        .map(t => t.githubLogin);

      return db
        .collection<User>('users')
        .find({ githubLogin: { $in: logins } })
        .toArray();
    }
  },
  User: {
    postedPhotos: (parent, args, { db }) =>
      db
        .collection<Photo>('photos')
        .find({ userID: parent.githubLogin })
        .toArray(),
    inPhotos: async (parent, args, { db }) => {
      const tags = await db.collection<TagModel>('tags').find().toArray();
      const photoIDs = tags
        .filter(t => t.githubLogin === parent.githubLogin)
        .map(t => ObjectId.createFromHexString(t.photoID));

      return db
        .collection<Photo>('photos')
        .find({ _id: { $in: photoIDs } })
        .toArray();
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: value => (typeof value === 'string' ? new Date(value) : null),
    serialize: value =>
      typeof value === 'string'
        ? new Date(value).toISOString()
        : new Date().toISOString(),
    parseLiteral: ast => (ast.kind === Kind.STRING ? new Date(ast.value) : null)
  })
};

export default Type;
