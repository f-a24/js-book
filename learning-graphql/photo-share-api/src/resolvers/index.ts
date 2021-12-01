import Query from './Query';
import Mutation from './Mutation';
import Type from './Type';
import { Resolvers } from '../types/generated/graphql';

const resolvers: Resolvers = {
  Query,
  Mutation,
  ...Type
};

export default resolvers;
