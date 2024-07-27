const fetchRows = require("../api/fetchRows");

const query_photos = `SELECT Photo_ID, Photo FROM Photos;`;

async function dataFetchPhotos() {
  let photosData = [];
  try {
    photosData = await fetchRows(() => query_photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
  }
  return photosData;
}

module.exports = dataFetchPhotos;
