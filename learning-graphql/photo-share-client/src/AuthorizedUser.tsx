import React, { useEffect, useState, VFC } from 'react';
import { useHistory } from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import { ROOT_QUERY } from './App';
import { useAllUsersQuery, useGithubAuthMutation } from './types/graphql';

gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

type MeProps = {
  signingIn: boolean;
  requestCode: () => void;
  logout: () => void;
};
const Me: VFC<MeProps> = ({ signingIn, requestCode, logout }) => {
  const { loading, data } = useAllUsersQuery({ fetchPolicy: 'cache-only' });
  if (loading || !data) return <p>Loading...</p>;
  if (data.me) return <CurrentUser {...data.me} logout={logout} />;

  return (
    <button onClick={requestCode} disabled={signingIn}>
      Sign in With Github
    </button>
  );
};

type CurrentUserProps = NonNullable<
  ReturnType<typeof useAllUsersQuery>['data']
>['me'] &
  Pick<MeProps, 'logout'>;
const CurrentUser: VFC<CurrentUserProps> = ({ name, avatar, logout }) => (
  <div>
    {avatar && <img src={avatar} alt="" />}
    {name && <h1>{name}</h1>}
    <button onClick={logout}>logout</button>
  </div>
);

const AuthorizedUser: VFC = () => {
  const [signingIn, setSigningIn] = useState(false);
  const client = useApolloClient();
  const history = useHistory();
  const [githubAuthMutation] = useGithubAuthMutation({
    update: (cache, { data }) => {
      localStorage.setItem('token', data!.githubAuth.token);
      setSigningIn(false);
      history.replace('/');
    },
    refetchQueries: [{ query: ROOT_QUERY }]
  });

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace('?code=', '');
      githubAuthMutation({ variables: { code } });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    const data = {
      ...client.readQuery({ query: ROOT_QUERY }),
      me: null
    };
    client.writeQuery({ query: ROOT_QUERY, data });
  };

  const requestCode = () => {
    const clientId = 'xxxxxxxxxxxxxxxxxx';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  };

  return <Me signingIn={signingIn} requestCode={requestCode} logout={logout} />;
};

export default AuthorizedUser;
