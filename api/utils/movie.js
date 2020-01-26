const axios = require('axios');

function slugify(string) {
  // Replace ' ' with '-'
  // Remove duplicate '--' => '-'
  // Check for word characters [a-zA-Z0-9_]
  return string
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[-]+/g, '_')
    .replace(/[^\w-]+/g, '');
}

const imdbSearchAddr = query => {
  const formattedQuery = slugify(query);
  return `https://v2.sg.media-imdb.com/suggestion/titles/${formattedQuery[0]}/${formattedQuery}.json`;
};

async function getImdb(query) {
  try {
    const imdb = await axios.get(imdbSearchAddr(query));
    const movies = imdb.data.d;
    return movies.map(movie => ({
      id: movie.id,
      title: movie.l,
      year: movie.y,
      image: movie.i.imageUrl.replace('.jpg', 'UX75_CR0,1,75,111_.jpg'),
      stars: movie.s,
    }));
  } catch (e) {
    return;
  }
}

module.exports = {
  getImdb,
};
