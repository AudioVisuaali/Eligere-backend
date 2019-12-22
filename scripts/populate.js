// Database
const dotenv = require('dotenv');

// Set environment

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'default';

const { error } = dotenv.config({ path: `environment.${environment}.env` });
if (error) throw error;

const bcrypt = require('bcryptjs');
const models = require('../api/models');

const genres = [
  'action',
  'adventure',
  'animation',
  'comedy',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'horror',
  'romantic',
  'thriller',
];

const exampleUser = {
  username: 'root',
  displayName: 'Admin',
  password: 'toor',
};

const examplePoll = {
  title: 'Example poll',
  description: 'This is an example poll',
  userRequired: false,
  createdAt: new Date(),
  opensAt: null,
  closesAt: null,
};

const exampleMovie = {
  title: 'Avengers: Endgame',
  thumbnail:
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQA_-tL18_rj9zEcjN6n41NEaJm-kRNF9UeOtvksZ4z_OW6jRA9',
  description:
    'Avengers: Endgame is a 2019 American superhero film based on the Marvel Comics superhero team the Avengers, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. ',
  released: new Date(),
  length: 181,
  imdb: 85,
  rottenTomatoes: 94,
  metacritic: 78,
  googleUsers: 95,
  createdAt: new Date(),
};

const exampleTrailers = [
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    slug: 'TcMBFSGVi1c',
  },
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=hA6hldpSTF8',
    slug: 'hA6hldpSTF8',
  },
];

function generateGenres() {
  return genres.map(genre => ({ value: genre }));
}

async function script() {
  await models.sequelize.sync({ force: true });

  const genres = await models.Genre.bulkCreate(generateGenres());

  const password = await bcrypt.hash(exampleUser.password, 12);

  const user = await models.User.create({ ...exampleUser, password });

  const poll = await models.Poll.create(examplePoll);

  await user.addPoll(poll.id);

  const movie = await models.Movie.create(exampleMovie);

  await poll.addMovie(movie.id);

  const trailers = await models.Trailer.bulkCreate(exampleTrailers);

  await movie.addTrailers(trailers);

  await movie.addGenres([genres[0], genres[2], genres[4]]);

  console.log(`
Created Data:
[User]: id: ${user.id} | identifier: ${user.identifier}
[Poll]: id: ${poll.id} | identifier: ${poll.identifier}
  `);

  await models.sequelize.connectionManager.close();
}

script();
