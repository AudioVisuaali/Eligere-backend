const express = require('express');
const bodyParser = require('body-parser');
const generatedGraphql = require('./graphql');

// Database
const models = require('./models');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', generatedGraphql);

app.listen(3000);
models.User.create({
  username: 'Kappa123',
  displayName: 'Kappa123',
  password: 'asdasdasd',
  createdAt: new Date(),
});

let user = null;
// return models.sequelize.sync({ force: true });

models.User.create({
  username: 'asdasdasdasd',
  displayName: 'asdasdasdasd',
  password: 'asdasdasdasd',
})
  .then(user_ => {
    user = user_;
    return models.Poll.create({
      title: 'title',
      description: 'descriptoipn',
      userRequired: false,
      createdAt: new Date(),
      opensAt: null,
      closesAt: null,
    });
  })
  .then(poll => {
    return user.addPoll(poll.id);
  })
  .then(() => {
    return models.Poll.findOne({
      include: [
        {
          model: models.User,
          required: false,
          as: 'user',
        },
      ],
      where: { user_id: user.id },
    }).then(res => console.log(res));
  })
  .catch(err => console.log(err));
