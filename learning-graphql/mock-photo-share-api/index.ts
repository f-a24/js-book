import { ApolloServer } from 'apollo-server';
import * as casual from 'casual';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

const schema = loadSchemaSync('./schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});
const resolvers = {};
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

const mocks = {
  Query: () => ({
    totalPhotos: () => 42,
    allPhotos: () => [...new Array(casual.integer(5, 10))],
    Photo: () => ({
      name: 'sample photo',
      description: null
    })
  })
};

const server = new ApolloServer({
  schema: schemaWithResolvers,
  mocks
});

server.listen({ port: 4000 }, () =>
  console.log(
    `Mock Photo Share GraphQL Service running on http://localhost:4000`
  )
);
