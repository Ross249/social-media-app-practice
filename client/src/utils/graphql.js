import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
	query {
		getPosts {
			id
			body
			createdAt
			username
			likeCounts
			likes{
				username
			}
			commentCounts
			comments{
				id
				username
				createdAt
				body
			}
		}
	}
`;