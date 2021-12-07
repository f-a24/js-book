import React, { VFC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { gql } from '@apollo/client';
import './App.css';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';

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

const App: VFC = () => (
  <BrowserRouter>
    <div>
      <AuthorizedUser />
      <Users />
    </div>
  </BrowserRouter>
);

export default App;
