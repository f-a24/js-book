import React, { useEffect, useRef, VFC } from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';
import { Subscription } from 'zen-observable-ts';
import { AllUsersQuery } from './types/graphql';
import Photos from './Photos';
import PostPhoto from './PostPhoto';

export const ROOT_QUERY = gql`
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
  const location = useLocation();
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
        client.writeQuery({ query: ROOT_QUERY, data: newData });
      });

    return () => {
      listenForUsers.current!.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={() => (
            <>
              <AuthorizedUser />
              <Users />
              <Photos />
            </>
          )}
        />
        <Route path="/newPhoto" component={PostPhoto} />
        <Route component={({}) => <h1>"{location.pathname}" not found</h1>} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
