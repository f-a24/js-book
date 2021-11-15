import { ApolloServer } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import {
  Photo,
  PhotoCategory,
  Resolvers,
  User
} from './types/generated/graphql';

// sample data
const users: User[] = [
  {
    githubLogin: 'mHattrup',
    name: 'Mike Hattrup',
    postedPhotos: [],
    inPhotos: []
  },
  { githubLogin: 'gPlake', name: 'Glen Plake', postedPhotos: [], inPhotos: [] },
  {
    githubLogin: 'sSchmidt',
    name: 'Scot Schmidt',
    postedPhotos: [],
    inPhotos: []
  }
];

const photos: Photo[] = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: PhotoCategory.Action,
    url: '',
    postedBy: {
      githubLogin: 'gPlake',
      name: 'Glen Plake',
      postedPhotos: [],
      inPhotos: []
    },
    githubUser: 'gPlake',
    taggedUsers: [],
    created: '3-28-1977'
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: PhotoCategory.Selfie,
    url: '',
    postedBy: {
      githubLogin: 'sSchmidt',
      name: 'Scot Schmidt',
      postedPhotos: [],
      inPhotos: []
    },
    githubUser: 'sSchmidt',
    taggedUsers: [],
    created: '1-2-1985'
  },
  {
    id: '3',
    name: 'Gunbarrel 25',
    description: '25 laps on gunbarrel today',
    category: PhotoCategory.Landscape,
    url: '',
    postedBy: {
      githubLogin: 'sSchmidt',
      name: 'Scot Schmidt',
      postedPhotos: [],
      inPhotos: []
    },
    githubUser: 'sSchmidt',
    taggedUsers: [],
    created: '2018-04-15T19:09:57.308Z'
  }
];

const tags = [
  { photoID: '1', userID: 'gPlake' },
  { photoID: '2', userID: 'sSchmidt' },
  { photoID: '2', userID: 'mHattrup' },
  { photoID: '2', userID: 'gPlake' }
];

const schema = loadSchemaSync('./schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

let _id = 0;

const resolvers: Resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => photos
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto: Photo = {
        id: `${_id++}`,
        url: '',
        postedBy: {
          githubLogin: 'mHattrup',
          name: 'Mike Hattrup',
          postedPhotos: [],
          inPhotos: []
        },
        taggedUsers: [],
        ...args.input,
        category: args.input.category || PhotoCategory.Portrait,
        created: new Date()
      };
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: parent => `https://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubLogin === parent.githubUser)!,
    taggedUsers: parent =>
      tags
        .filter(tag => tag.photoID === parent.id)
        .map(tag => tag.userID)
        .map(userID => users.find(u => u.githubLogin === userID)!)
  },
  User: {
    postedPhotos: parent =>
      photos.filter(p => p.githubUser === parent.githubLogin),
    inPhotos: parent =>
      tags
        .filter(tag => tag.userID === parent.githubLogin)
        .map(tag => tag.photoID)
        .map(photoID => photos.find(p => p.id === photoID)!)
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: value => (typeof value === 'string' ? new Date(value) : null),
    serialize: value =>
      typeof value === 'string' ? new Date(value).toISOString() : null,
    parseLiteral: ast => (ast.kind === Kind.STRING ? new Date(ast.value) : null)
  })
};

const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

const server = new ApolloServer({ schema: schemaWithResolvers });

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`));
