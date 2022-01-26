import React, { useEffect, useState}from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../utils/MyPopup';

function LikeButton({ user,post: { id, likeCounts,likes} }) {
	const [liked, setLiked] = useState(false);
	useEffect(() => {
		if(user && likes.find(like => like.username === user.username)){
			setLiked(true);
		}else setLiked(false);
 	},[user,likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },

	});
	const likeButton = user ? (
		liked ? (
			<Button color='teal' >
				<Icon name='heart' />
			</Button>
		) : (
			<Button color='teal' basic>
				<Icon name='heart' />
			</Button>
		)
	):(
		<Button as={Link} to={`/login`} color='teal' basic>
			<Icon name='heart' />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likePost}>
			<MyPopup content={liked ? 'Unlike' : 'Like'}>
				{likeButton}
			</MyPopup>
			<Label basic color='teal' pointing='left'>
				{likeCounts}
			</Label>
		</Button>
	); 
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!){
		likePost(postId: $postId){
			id
			likes{
				id
				username
			}
			likeCounts
		}
	}
`;

export default LikeButton;