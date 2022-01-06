import React, { useState, VFC } from 'react';
import { useHistory } from 'react-router';
import { gql } from '@apollo/client';
import { PhotoCategory, usePostPhotoMutation } from './types/graphql';

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      id
      name
      url
    }
  }
`;

const PostPhoto: VFC = () => {
  const history = useHistory();
  const [postPhotoMutation] = usePostPhotoMutation();
  const [state, setState] = useState<{
    name: string;
    description: string;
    category: PhotoCategory;
    file: File | string;
  }>({
    name: '',
    description: '',
    category: PhotoCategory.Portrait,
    file: ''
  });
  const postPhoto = async () => {
    await postPhotoMutation({ variables: { input: state } }).catch(console.error);
    history.replace('/');
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <h1>Post a Photo</h1>
      <input
        type="text"
        style={{ margin: '10px' }}
        placeholder="photo name..."
        value={state.name}
        onChange={({ target }) => setState({ ...state, name: target.value })}
      />

      <textarea
        style={{ margin: '10px' }}
        placeholder="photo description..."
        value={state.description}
        onChange={({ target: { value } }) =>
          setState({ ...state, description: value })
        }
      />

      <select
        value={state.category}
        style={{ margin: '10px' }}
        onChange={({ target: { value } }) =>
          setState({ ...state, category: (value as PhotoCategory) })
        }
      >
        <option value="PORTRAIT">PORTRAIT</option>
        <option value="LANDSCAPE">LANDSCAPE</option>
        <option value="ACTION">ACTION</option>
        <option value="GRAPHIC">GRAPHIC</option>
      </select>
      <input
        type="file"
        style={{ margin: '10px' }}
        accept="image/jpeg"
        onChange={({ target }) =>
          setState({
            ...state,
            file: target.files && target.files.length ? target.files[0] : ''
          })
        }
      />

      <div style={{ margin: '10px' }}>
        <button onClick={postPhoto}>Post Photo</button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </div>
    </form>
  );
};

export default PostPhoto;
