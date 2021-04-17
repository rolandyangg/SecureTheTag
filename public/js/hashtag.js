const {
  get
} = require('jquery');

// Module Exports
module.exports.getHashtagsFromImage = getHashtagsFromImage;
module.exports.getHashtagsFromWord = getHashtagsFromWord;

async function getLabels(imageBytes) { // Takes in imageBytes as parameter and returns array of labels
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  const projectId = 'revolution-uc-1613701762691';
  const keyFilename = 'revolution-uc-942ca6c58780.json';

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    projectId,
    keyFilename
  });

  // Performs label detection on the image
  const [result] = await client.labelDetection(imageBytes);
  const labels = result.labelAnnotations;
  const labelNames = [];

  labels.forEach(label => labelNames.push(label.description));
  return labelNames;
}

function getHashtags(keyword) { // Takes in keyword as parameter and returns array of hashtags
  return new Promise((resolve, reject) => {
    var axios = require('axios');
    axios.get(`https://www.instagram.com/web/search/topsearch?context=hashtag&query=${keyword}`)
      .then((res) => {
        var hashtags = res.data.hashtags;
        var result = [];
        hashtags.forEach(hash => result.push({
          name: hash.hashtag.name,
          media_count: hash.hashtag.media_count,
          search_result_subtitle: hash.hashtag.search_result_subtitle
        }))
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
  })
}

function compare(a, b) { // Compares objects in hashtag arrays based on posts per hour
  const post1 = a.media_count;
  const post2 = b.media_count;

  let comparison = 0;
  if (post1 > post2) {
    comparison = 1;
  } else if (post1 < post2) {
    comparison = -1;
  }
  return comparison * -1;
}

async function getHashtagsFromImage(imageBytes) { // Used for Image Query
  var labels = await getLabels(imageBytes);
  console.log(labels);
  var hashtags = (await getHashtags(labels[0].toLowerCase())).slice(0, 30);
  for (var i = 1; i < labels.length; i++) {
    var newHashtags = (await getHashtags(labels[i].toLowerCase())).slice(0, 30);
    hashtags = hashtags.concat(newHashtags);
  }

  hashtags.sort(compare);
  hashtags = hashtags.slice(0, 30);
  return hashtags;
}

async function getHashtagsFromWord(word) { // Used for Keyword Query
  var hashtags = (await getHashtags(word.toLowerCase())).slice(0, 30);
  return hashtags;
}