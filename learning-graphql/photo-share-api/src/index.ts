import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { MongoClient } from 'mongodb';
import resolvers from './resolvers';
require('dotenv').config();

const schema = loadSchemaSync('./schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const startServer = () => {
  const MONGO_DB = process.env.DB_HOST!;
  const client = new MongoClient(MONGO_DB);
  client.connect(async () => {
    const db = client.db();

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
    const app = express();
    const server = new ApolloServer({
      schema: schemaWithResolvers,
      context: async ({ req }) => {
        const githubToken = req.headers.authorization;
        const currentUser = await db
          .collection('users')
          .findOne({ githubToken });
        return { db, currentUser };
      }
    });
    await server.start();
    server.applyMiddleware({ app });

    app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
    app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
    app.listen({ port: 4000 }, () =>
      console.log(`GraphQL Service running on ${server.graphqlPath}`)
    );
  });
};

startServer();
