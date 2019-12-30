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
const models = require('./sequelize');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST,OPTIONS,GET');
    return res.status(200).send('');
  }
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', generatedGraphql);

async function start() {
  await models.sequelize.authenticate();
  dbConnected();

  app.listen(port, appListening);
}

start();
