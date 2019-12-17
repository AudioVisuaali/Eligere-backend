const graphqlHTTP = require('express-graphql');

const resolvers = require('./resolvers');

module.exports = graphqlHTTP({
  typeDefs: './api/graphql/schema.graphql',
  rootValue: resolvers,
  context: req => ({
    ...req,
  }),
  graphiql: true,
});
