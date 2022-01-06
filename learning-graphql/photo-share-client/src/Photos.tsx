import React, { VFC } from 'react';
import { useAllUsersQuery } from './types/graphql';

const Photos: VFC = () => {
  const { loading, data } = useAllUsersQuery();
  if (loading || !data) return <p>Loading...</p>;
  return (
    <>
      {data.allPhotos.map(({ id, url, name }) => (
        <img key={id} src={url} alt={name} width={350} />
      ))}
    </>
  );
};

export default Photos;
