const axios = require('axios');

const youtubeAddr = url =>
  `https://www.youtube.com/oembed?url=${url}&format=json`;

async function getPlatform(url) {
  const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/;

  if (!url) {
    return;
  }

  const canPlay = MATCH_URL.test(url);
  if (!canPlay) {
    return;
  }

  const slug = url.match(MATCH_URL)[1];
  try {
    const video = await axios.get(youtubeAddr(url));
    return {
      platform: 'youtube',
      url,
      slug,
      thumbnailURL: video.data.thumbnail_url,
      title: video.data.title,
    };
  } catch (e) {
    return;
  }
}

module.exports = {
  getPlatform,
};
