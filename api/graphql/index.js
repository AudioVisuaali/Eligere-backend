const graphqlHTTP = require('express-graphql');

const resolvers = require('./resolvers');

module.exports = graphqlHTTP({
  typeDefs: './graphql/schema.graphql',
  rootValue: resolvers,
  graphiql: true,
});
