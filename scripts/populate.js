// Database
const dotenv = require('dotenv');

// Set environment

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'default';

const { error } = dotenv.config({ path: `environment.${environment}.env` });
if (error) throw error;

const bcrypt = require('bcryptjs');
const models = require('../api/sequelize');

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
  title: 'Movie night banter IT support crew #15',
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  userRequired: false,
  createdAt: new Date(),
  opensAt: null,
  closesAt: null,
  totalVotes: 1,
  allowComments: false,
  allowMovieSuggestions: false,
};

const exampleMovie = {
  title: 'Avengers: Endgame',
  thumbnail:
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQA_-tL18_rj9zEcjN6n41NEaJm-kRNF9UeOtvksZ4z_OW6jRA9',
  description:
    'Avengers: Endgame is a 2019 American superhero film based on the Marvel Comics superhero team the Avengers, produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures. ',
  released: new Date(),
  duration: 181,
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
    thumbnailURL: 'https://i.ytimg.com/vi/qku_cEgr39A/hqdefault.jpg',
    title: 'Marvel Studios’ Avengers: Endgame | “To the End”',
  },
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=hA6hldpSTF8',
    slug: 'hA6hldpSTF8',
    thumbnailURL: 'https://i.ytimg.com/vi/qku_cEgr39A/hqdefault.jpg',
    title: 'Marvel Studios’ Avengers: Endgame | “To the End”',
  },
  {
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=0jNvJU52LvU',
    slug: '0jNvJU52LvU',
    thumbnailURL: 'https://i.ytimg.com/vi/qku_cEgr39A/hqdefault.jpg',
    title: 'Marvel Studios’ Avengers: Endgame | “To the End”',
  },
];

const exampleCommunity = {
  title: 'Banterbury',
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
};

function generateGenres() {
  return genres.map(genre => ({ value: genre }));
}

async function script() {
  await models.sequelize.sync({ force: true });

  const genres = await models.Genre.bulkCreate(generateGenres());

  const password = await bcrypt.hash(exampleUser.password, 12);

  const user = await models.User.create({ ...exampleUser, password });

  const poll = await models.Poll.create(examplePoll);

  const community = await models.Community.create(exampleCommunity);

  await user.addCommunity(community.id);

  await community.addPoll(poll.id);

  await user.addPoll(poll.id);

  const movie = await models.Movie.create(exampleMovie);

  const movie2 = await models.Movie.create(exampleMovie);

  await poll.addMovie(movie.id);

  await poll.addMovie(movie2.id);

  const trailers = await models.Trailer.bulkCreate(exampleTrailers);

  const trailers2 = await models.Trailer.bulkCreate(exampleTrailers);

  await movie.addTrailers(trailers);

  await movie2.addTrailers(trailers2);

  await movie.addGenres([genres[0], genres[2], genres[4]]);

  console.log(`
Created Data:
[User]: id: ${user.id} | identifier: ${user.identifier}
[Poll]: id: ${poll.id} | identifier: ${poll.identifier}
  `);

  await models.sequelize.connectionManager.close();
}

script();
