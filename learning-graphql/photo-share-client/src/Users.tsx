import React, { VFC } from 'react';
import { gql } from '@apollo/client';
import {
  AllUsersQuery,
  useAddFakeUsersMutation,
  useAllUsersQuery
} from './types/graphql';
import { ROOT_QUERY } from './App';

gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const Users: VFC = () => {
  const { loading, error, data, refetch } = useAllUsersQuery({
    fetchPolicy: 'cache-and-network'
  });
  if (loading || !data) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <UserList {...data} refetchUsers={refetch} />;
};

type UserListProps = AllUsersQuery & {
  refetchUsers: ReturnType<typeof useAllUsersQuery>['refetch'];
};
const UserList: VFC<UserListProps> = ({
  totalUsers,
  allUsers,
  refetchUsers
}) => {
  const [addFakeUsers] = useAddFakeUsersMutation({
    variables: { count: 1 }
  });

  return (
    <div>
      <p>{totalUsers} Users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button onClick={() => addFakeUsers()}>Add Fake Users</button>
      <ul>
        {allUsers.map(user => (
          <UserListItem key={user.githubLogin} {...user} />
        ))}
      </ul>
    </div>
  );
};

const UserListItem: VFC<AllUsersQuery['allUsers'][number]> = ({
  name,
  avatar
}) => (
  <li>
    {avatar && <img src={avatar} width={48} height={48} alt="" />}
    {name || ''}
  </li>
);

export default Users;
