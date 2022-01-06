import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import expressPlayground from 'graphql-playground-middleware-express';
import { PubSub } from 'graphql-subscriptions';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import { MongoClient } from 'mongodb';
import resolvers from './resolvers';
import path from 'path';
require('dotenv').config();

const schema = loadSchemaSync('./schema.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const startServer = () => {
  const MONGO_DB = process.env.DB_HOST!;
  const client = new MongoClient(MONGO_DB);
  client.connect(async () => {
    const db = client.db();
    const pubsub = new PubSub();
    const app = express();
    const httpServer = createServer(app);
    httpServer.timeout = 5000;

    const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
    const subscriptionServer = SubscriptionServer.create(
      {
        schema: schemaWithResolvers,
        execute,
        subscribe,
        onConnect: async (connectionParams: { authorization?: string }) => {
          if (connectionParams.authorization) {
            const githubToken = connectionParams.authorization;
            const currentUser = await db
              .collection('users')
              .findOne({ githubToken });
            return { db, currentUser, pubsub };
          }
          throw new Error('Missing auth token!');
        }
      },
      {
        server: httpServer,
        path: '/graphql'
      }
    );

    const server = new ApolloServer({
      schema: schemaWithResolvers,
      context: async ({ req }) => {
        const githubToken = req.headers.authorization;
        const currentUser = await db
          .collection('users')
          .findOne({ githubToken });
        return { db, currentUser, pubsub, timestamp: performance.now() };
      },
      validationRules: [
        depthLimit(5),
        createComplexityLimitRule(1000, {
          onCost: cost => console.log('query cost: ', cost)
        })
      ],
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                subscriptionServer.close();
              }
            };
          }
        }
      ]
    });
    await server.start();
    server.applyMiddleware({ app });

    app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
    app.get(
      '/playground',
      expressPlayground({
        endpoint: '/graphql',
        subscriptionEndpoint: '/graphql'
      })
    );
    app.use(
      '/img/photos',
      express.static(path.join(__dirname, 'assets', 'photos'))
    );
    httpServer.listen({ port: 4000 }, () =>
      console.log(`GraphQL Service running on ${server.graphqlPath}`)
    );
  });
};

startServer();
