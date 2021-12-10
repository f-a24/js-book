import { SubscriptionResolvers } from '../types/generated/graphql';

const Subscription: SubscriptionResolvers = {
  newPhoto: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator(['PHOTO_ADDED'])
  },
  newUser: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator(['USER_ADDED'])
  }
};

export default Subscription;
