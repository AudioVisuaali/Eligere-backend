const axios = require('axios');
const { JSDOM } = require('jsdom');

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

async function getImdbMovie(id) {
  const url = `https://www.imdb.com/title/${id}/`;
  try {
    const { data } = await axios.get(url, {
      // TODO maybe get client header and insert it here???
      headers: { 'accept-language': 'en-US,en;q=0.9' },
    });

    const dom = new JSDOM(data);
    const { document } = dom.window;
    const imdbEl = document.getElementsByClassName('ratingValue')[0];
    const imdb =
      imdbEl && imdbEl.firstElementChild.firstElementChild.textContent;

    const metacriticEl = document.getElementsByClassName('metacriticScore')[0];
    const metacritic =
      metacriticEl && metacriticEl.firstElementChild.textContent;

    const titleElement = document.getElementsByClassName('title_wrapper')[0];
    const title = titleElement.firstElementChild.textContent;
    const releasedEl = titleElement.firstElementChild.children['titleYear'];
    const released = releasedEl && releasedEl.children[0].textContent;

    const description = document.getElementsByClassName('summary_text')[0]
      .textContent;

    const thumbnail = document.getElementsByClassName('poster')[0]
      .firstElementChild.firstElementChild.src;

    const durationEl = document.getElementsByTagName('TIME')[1];
    const duration = durationEl && durationEl.textContent;

    const genresNodesEl = document.getElementById('titleStoryLine')
      .childNodes[19];
    const genresNodes =
      (genresNodesEl && genresNodesEl.getElementsByTagName('A')) || [];
    const genres = [];
    for (let genre of genresNodes) {
      genres.push(genre.textContent.toLowerCase().trim());
    }

    return {
      title: title.trim(),
      description: description.trim(),
      thumbnail,
      released: released && parseInt(released, 10),
      duration: duration && parseInt(duration.split(' ')[0], 10),
      genres,
      imdb: imdb && parseFloat(imdb, 10) * 10,
      metacritic: metacritic && parseInt(metacritic, 10),
    };
  } catch (e) {
    console.log(e);
    return;
  }
}

async function getImdb(query) {
  try {
    const imdb = await axios.get(imdbSearchAddr(query));
    const movies = imdb.data.d;
    return movies.map(movie => {
      return {
        id: movie.id,
        title: movie.l,
        year: movie.y,
        image:
          movie.i && movie.i.imageUrl.replace('.jpg', 'UX75_CR0,1,75,111_.jpg'),
        stars: movie.s,
      };
    });
  } catch (e) {
    return;
  }
}

module.exports = {
  getImdb,
  getImdbMovie,
};
