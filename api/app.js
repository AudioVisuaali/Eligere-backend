const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const generatedGraphql = require('./graphql');
const isAuth = require('./middleware/is-auth');

// Variables
const port = process.env.PORT || 3000;
const dbConnected = () =>
  console.log(
    `${chalk.magenta('[Database]')} Connection has been established.`
  );
const appListening = () =>
  console.log(
    `${chalk.magenta('[Eligere ]')} Server started on port: ${chalk.magenta(
      process.env.PORT
    )}`
  );

// Database
const models = require('./models');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', generatedGraphql);

async function start() {
  await models.sequelize.authenticate();
  dbConnected();

  app.listen(port, appListening);
}

start();
