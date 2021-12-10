import Query from './Query';
import Mutation from './Mutation';
import Type from './Type';
import { Resolvers } from '../types/generated/graphql';
import Subscription from './Subscription';

const resolvers: Resolvers = {
  Query,
  Mutation,
  Subscription,
  ...Type
};

export default resolvers;
