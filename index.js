const { ApolloServer , PubSub } = require('apollo-server');
const mongoose = require('mongoose');


const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const {MONGODB} = require('./config');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	context:({req})=>({req, pubsub})
});

mongoose.connect(MONGODB, { useNewUrlParser: true})
	.then(() => {
		console.log('Connected to MongoDB');
		return server.listen({port: PORT});
	}).then(res => {
	console.log(`Server is running on http://localhost:${res.port}`);
});