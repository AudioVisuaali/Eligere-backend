const graphqlHTTP = require('express-graphql');
const { importSchema } = require('graphql-import');
const { makeExecutableSchema } = require('graphql-tools');

const resolvers = require('./resolvers');

const typeDefs = importSchema('api/graphql/schema.graphql');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = graphqlHTTP({
  schema,
  graphiql: true,
});
