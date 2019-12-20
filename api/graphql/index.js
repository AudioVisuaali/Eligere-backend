const chalk = require('chalk');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const { importSchema } = require('graphql-import');

const resolvers = require('./resolvers');

const schema = importSchema('api/graphql/schema.graphql');

console.log(
  `${chalk.magenta('[Graphql ]')} Schema length: ${
    schema.split('\n').length
  } rows`
);
console.log(
  `${chalk.magenta('[Graphql ]')} Resolvers: ${Object.keys(resolvers).length}`
);

module.exports = graphqlHTTP({
  schema: buildSchema(schema),
  rootValue: resolvers,
  graphiql: true,
});
