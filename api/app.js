const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const generatedGraphql = require('./graphql');
const isAuth = require('./middleware/is-auth');

// Database
const models = require('./models');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', generatedGraphql);

function start(port) {
  return models.sequelize
    .authenticate()
    .then(() => {
      const msg = `${chalk.magenta(
        '[Database]'
      )} Connection has been established.`;
      console.log(msg);
      return app.listen(port, () => {
        const msg = `${chalk.magenta(
          '[Eligere ]'
        )} Server started on port:${chalk.magenta(process.env.PORT)}`;
        console.log(msg);
      });
    })
    .catch(err => {
      console.error('[Database] Unable to connect to the database:', err);
    });
}

module.exports = { start };
