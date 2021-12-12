import React, { useEffect, useRef, VFC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';
import { Subscription } from 'zen-observable-ts';
import { AllUsersQuery } from './types/graphql';

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`;

const App: VFC = () => {
  const client = useApolloClient();
  const listenForUsers = useRef<Subscription | null>(null);

  useEffect(() => {
    listenForUsers.current = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        const newData: AllUsersQuery = {
          ...data,
          totalUsers: data.totalUsers + 1,
          allUsers: [...data.allUsers, newUser]
        };
        client.writeQuery({ query: ROOT_QUERY, data: newData })
      });

      return () => {
        listenForUsers.current!.unsubscribe()
      }
  }, []);
  return (
    <BrowserRouter>
      <div>
        <AuthorizedUser />
        <Users />
      </div>
    </BrowserRouter>
  );
};

export default App;
