import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../utils/MyPopup";

function PostCard({ post : {body, createdAt, id, username, likeCounts, commentCounts, likes}}) {
	
	const { user } = useContext(AuthContext);
	return (
		<Card fluid>
			<Card.Content>
				<Image floated='right' size='mini' src='https://tva1.sinaimg.cn/large/8847b9d3gy1gynva7xo5dj20g00g0q3m.jpg' />
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={{id,likes ,likeCounts}} />
				<MyPopup content='Comment on post'>
					<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
						<Button basic color='blue'>
							<Icon name='comments' />
						</Button>
						<Label basic color='blue' pointing='left'>
							{commentCounts}
						</Label>
					</Button>
				</MyPopup>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	)
}

export default PostCard;