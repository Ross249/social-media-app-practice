import React, { useContext,  useRef,  useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Grid, Image, Label, Icon, Form} from 'semantic-ui-react';
import moment from 'moment';
import { useParams, useNavigate} from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../utils/MyPopup';

function SinglePost() {
  	// const postId = props.match.params.postId;
	const { postId } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const commentInputRef = useRef(null);
	const [comment, setComment] = useState('');
	
  	const { data: {getPost} = {}} = useQuery(FETCH_POST_QUERY, {
	      	variables: {
		      	postId
	      	}
	})  
	
	const [ submitComment ] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update(){
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment
		}
	});

	function deletePostCallback(){
		navigate('/');
	}

	let postMarkup;
	if(!getPost){
		postMarkup = <p>Loading post...</p>
	}else {
		const { id, body, createdAt, username, comments, likes, likeCounts, commentCounts} = getPost;
		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image 
						size='small'
						float='right'
						src='https://tva1.sinaimg.cn/large/8847b9d3gy1gynva7xo5dj20g00g0q3m.jpg' />
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr/>
							<Card.Content extra>
								<LikeButton user={user} post={{ id, likeCounts, likes}}/>
								<MyPopup content='Comment on post'>
									<Button as="div" labelPosition="right" onClick={() => console.log('Comment')}>
										<Button basic color='blue'>
											<Icon name='comments' />
										</Button>
										<Label basic color='blue' pointing='left'>
											{commentCounts}
										</Label>
									</Button>
								</MyPopup>
								{user && user.username === username &&(
									<DeleteButton postId={id} callback={deletePostCallback}/>
								)}
							</Card.Content>
						</Card>
						{user && (<Card fluid>
							<Card.Content>
								<p>Post a comment</p>
								<Form>
									<div className='ui action input fluid'>
										<input 
											type="text"
											placeholder="Comment.."
											name="comment"
											value={comment}
											onChange={(e) => setComment(e.target.value)}
											ref={commentInputRef}

										/>
										<button 
											type='submit'
											className='ui button teal'
											disabled={comment.trim() === ''}
											onClick={submitComment}
											>
												Submit
										</button>
									</div>
								</Form>
							</Card.Content>
						</Card>)}
						{comments.map(comment => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;


}

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: String!,$body: String!){
		createComment(postId: $postId,body: $body){
			id
			comments{
				id
				body
				createdAt
				username
			}
			commentCounts
		}
	}
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
	  getPost(postId: $postId) {
		  id
		  body
		  username
		  createdAt
		  likeCounts
		  likes{
			username
		  }
		  commentCounts
		  comments{
			id
			username
			body
			createdAt
		  }
	  }
  }
`;

export default SinglePost;
