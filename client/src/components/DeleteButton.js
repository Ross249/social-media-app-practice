import React,{ useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Confirm, Icon} from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utils/graphql';
import MyPopup from '../utils/MyPopup';

function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
	
	
	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);
			// update cache
			if(!commentId){
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY
				});
				const newData = data.getPosts.filter(post => post.id !== postId);
				proxy.writeQuery({ 
					query: FETCH_POSTS_QUERY, 
					data: { getPosts: newData }
				});
			}
			if(callback) callback();
		},
		variables: { 
			postId,
			commentId
		}
	});

	return (
		<>
			<MyPopup content={ commentId ? 'Delete comment' : 'Delete post'} >
				<Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
					<Icon name="trash" style={{ margin: 0}}/>
				</Button>
			</MyPopup>
			<Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrMutation} content="Are you sure you want to delete this post?" />
		</>
	);
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
	deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: String!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCounts
    }
  }
`;

export default DeleteButton;
