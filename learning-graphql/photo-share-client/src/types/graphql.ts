import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Upload: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFakeUsers: Array<User>;
  fakeUserAuth: AuthPayload;
  githubAuth: AuthPayload;
  postPhoto: Photo;
  tagPhoto: Photo;
};


export type MutationAddFakeUsersArgs = {
  count?: InputMaybe<Scalars['Int']>;
};


export type MutationFakeUserAuthArgs = {
  githubLogin: Scalars['ID'];
};


export type MutationGithubAuthArgs = {
  code: Scalars['String'];
};


export type MutationPostPhotoArgs = {
  input: PostPhotoInput;
};


export type MutationTagPhotoArgs = {
  githubLogin: Scalars['ID'];
  photoID: Scalars['ID'];
};

export type Photo = {
  __typename?: 'Photo';
  category: PhotoCategory;
  created: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  githubUser?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  postedBy: User;
  taggedUsers: Array<User>;
  url: Scalars['String'];
};

export enum PhotoCategory {
  Action = 'ACTION',
  Graphic = 'GRAPHIC',
  Landscape = 'LANDSCAPE',
  Portrait = 'PORTRAIT',
  Selfie = 'SELFIE'
}

export type PostPhotoInput = {
  category?: InputMaybe<PhotoCategory>;
  description?: InputMaybe<Scalars['String']>;
  file: Scalars['Upload'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  Photo?: Maybe<Photo>;
  User?: Maybe<User>;
  allPhotos: Array<Photo>;
  allUsers: Array<User>;
  me?: Maybe<User>;
  totalPhotos: Scalars['Int'];
  totalUsers: Scalars['Int'];
};


export type QueryPhotoArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  login: Scalars['ID'];
};


export type QueryAllPhotosArgs = {
  after?: InputMaybe<Scalars['DateTime']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newPhoto: Photo;
  newUser: User;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  githubLogin: Scalars['ID'];
  inPhotos: Array<Photo>;
  name?: Maybe<Scalars['String']>;
  postedPhotos: Array<Photo>;
};

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', totalUsers: number, totalPhotos: number, allUsers: Array<{ __typename?: 'User', githubLogin: string, name?: string | null | undefined, avatar?: string | null | undefined }>, me?: { __typename?: 'User', githubLogin: string, name?: string | null | undefined, avatar?: string | null | undefined } | null | undefined, allPhotos: Array<{ __typename?: 'Photo', id: string, name: string, url: string }> };

export type UserInfoFragment = { __typename?: 'User', githubLogin: string, name?: string | null | undefined, avatar?: string | null | undefined };

export type Unnamed_1_SubscriptionVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Subscription = { __typename?: 'Subscription', newUser: { __typename?: 'User', githubLogin: string, name?: string | null | undefined, avatar?: string | null | undefined } };

export type GithubAuthMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GithubAuthMutation = { __typename?: 'Mutation', githubAuth: { __typename?: 'AuthPayload', token: string } };

export type PostPhotoMutationVariables = Exact<{
  input: PostPhotoInput;
}>;


export type PostPhotoMutation = { __typename?: 'Mutation', postPhoto: { __typename?: 'Photo', id: string, name: string, url: string } };

export type AddFakeUsersMutationVariables = Exact<{
  count: Scalars['Int'];
}>;


export type AddFakeUsersMutation = { __typename?: 'Mutation', addFakeUsers: Array<{ __typename?: 'User', githubLogin: string, name?: string | null | undefined, avatar?: string | null | undefined }> };

export const UserInfoFragmentDoc = gql`
    fragment userInfo on User {
  githubLogin
  name
  avatar
}
    `;
export const AllUsersDocument = gql`
    query allUsers {
  totalUsers
  totalPhotos
  allUsers {
    ...userInfo
  }
  me {
    ...userInfo
  }
  allPhotos {
    id
    name
    url
  }
}
    ${UserInfoFragmentDoc}`;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const Document = gql`
    subscription {
  newUser {
    githubLogin
    name
    avatar
  }
}
    `;

/**
 * __useSubscription__
 *
 * To run a query within a React component, call `useSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscription(baseOptions?: Apollo.SubscriptionHookOptions<Subscription, SubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<Subscription, SubscriptionVariables>(Document, options);
      }
export type SubscriptionHookResult = ReturnType<typeof useSubscription>;
export type SubscriptionResult = Apollo.SubscriptionResult<Subscription>;
export const GithubAuthDocument = gql`
    mutation githubAuth($code: String!) {
  githubAuth(code: $code) {
    token
  }
}
    `;
export type GithubAuthMutationFn = Apollo.MutationFunction<GithubAuthMutation, GithubAuthMutationVariables>;

/**
 * __useGithubAuthMutation__
 *
 * To run a mutation, you first call `useGithubAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGithubAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [githubAuthMutation, { data, loading, error }] = useGithubAuthMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGithubAuthMutation(baseOptions?: Apollo.MutationHookOptions<GithubAuthMutation, GithubAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GithubAuthMutation, GithubAuthMutationVariables>(GithubAuthDocument, options);
      }
export type GithubAuthMutationHookResult = ReturnType<typeof useGithubAuthMutation>;
export type GithubAuthMutationResult = Apollo.MutationResult<GithubAuthMutation>;
export type GithubAuthMutationOptions = Apollo.BaseMutationOptions<GithubAuthMutation, GithubAuthMutationVariables>;
export const PostPhotoDocument = gql`
    mutation postPhoto($input: PostPhotoInput!) {
  postPhoto(input: $input) {
    id
    name
    url
  }
}
    `;
export type PostPhotoMutationFn = Apollo.MutationFunction<PostPhotoMutation, PostPhotoMutationVariables>;

/**
 * __usePostPhotoMutation__
 *
 * To run a mutation, you first call `usePostPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postPhotoMutation, { data, loading, error }] = usePostPhotoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePostPhotoMutation(baseOptions?: Apollo.MutationHookOptions<PostPhotoMutation, PostPhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostPhotoMutation, PostPhotoMutationVariables>(PostPhotoDocument, options);
      }
export type PostPhotoMutationHookResult = ReturnType<typeof usePostPhotoMutation>;
export type PostPhotoMutationResult = Apollo.MutationResult<PostPhotoMutation>;
export type PostPhotoMutationOptions = Apollo.BaseMutationOptions<PostPhotoMutation, PostPhotoMutationVariables>;
export const AddFakeUsersDocument = gql`
    mutation addFakeUsers($count: Int!) {
  addFakeUsers(count: $count) {
    githubLogin
    name
    avatar
  }
}
    `;
export type AddFakeUsersMutationFn = Apollo.MutationFunction<AddFakeUsersMutation, AddFakeUsersMutationVariables>;

/**
 * __useAddFakeUsersMutation__
 *
 * To run a mutation, you first call `useAddFakeUsersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFakeUsersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFakeUsersMutation, { data, loading, error }] = useAddFakeUsersMutation({
 *   variables: {
 *      count: // value for 'count'
 *   },
 * });
 */
export function useAddFakeUsersMutation(baseOptions?: Apollo.MutationHookOptions<AddFakeUsersMutation, AddFakeUsersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFakeUsersMutation, AddFakeUsersMutationVariables>(AddFakeUsersDocument, options);
      }
export type AddFakeUsersMutationHookResult = ReturnType<typeof useAddFakeUsersMutation>;
export type AddFakeUsersMutationResult = Apollo.MutationResult<AddFakeUsersMutation>;
export type AddFakeUsersMutationOptions = Apollo.BaseMutationOptions<AddFakeUsersMutation, AddFakeUsersMutationVariables>;