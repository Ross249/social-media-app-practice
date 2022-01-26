const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
	Post: {
		likeCounts: (parent) => parent.likes.length,
		commentCounts: (parent) => parent.comments.length
	},
	Query: {
		...postsResolvers.Query,
	},
	Mutation: {
		...usersResolvers.Mutation,
		...postsResolvers.Mutation,
		...commentsResolvers.Mutation
	},
	Subscription: {
		...postsResolvers.Subscription
	}
};