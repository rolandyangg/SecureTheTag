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

function getHashtags(keyword) { // Takes in a String keyword and returns an array of hashtag objects based on that keyword
  return new Promise((resolve, reject) => {
    var unirest = require("unirest");
    var req = unirest("GET", "https://hashtagy-generate-hashtags.p.rapidapi.com/v1/insta/tags");

    req.query({
      "keyword": keyword,
      "include_tags_info": "true"
    });

    req.headers({
      "x-rapidapi-key": "7a019b335emsh66b8f02af9fc26cp16e3a3jsn91c60616aa8f",
      "x-rapidapi-host": "hashtagy-generate-hashtags.p.rapidapi.com",
      "useQueryString": true
    });

    req.end(function (res) {
      if (res.error) {
        return reject(res.error);
      }
      if ('data' in res.body) {
        var hashtags = res.body.data.hashtags;
        trim(hashtags);
        hashtags.sort(compare);
        return resolve(hashtags);
      } else {
        var hashtags = [];
        return resolve(hashtags);
      }
    });
  });
}

function compare(a, b) { // Compares objects in hashtag arrays based on posts per hour
  const post1 = a.posts_per_hour;
  const post2 = b.posts_per_hour;

  let comparison = 0;
  if (post1 > post2) {
    comparison = 1;
  } else if (post1 < post2) {
    comparison = -1;
  }
  return comparison * -1;
}

function trim(hashtags) { // Trims hashtag objects with no data from hashtag array
  for (i = hashtags.length - 1; i >= 0; i--) {
    if (!('posts_per_hour' in hashtags[i])) {
      hashtags.splice(i, 1);
    }
  }
}

function mergeTwo(arr1, arr2) { // Merges two sorted hashtag arrays together
  try {
    let idx1 = 0;
    let idx2 = 0;
    let result = [];
    while (idx1 < arr1.length && idx2 < arr2.length) {
      if (arr1[idx1].posts_per_hour === arr2[idx2].posts_per_hour) {
        result.push(arr1[idx1]);
        idx1++;
        idx2++;
      }
      else if (arr1[idx1].posts_per_hour > arr2[idx2].posts_per_hour) {
        result.push(arr1[idx1])
        idx1++;
      }
      else {
        result.push(arr2[idx2])
        idx2++;
      }
    }
    while (idx1 < arr1.length) {
      result.push(arr1[idx1])
      idx1++;
    }
    while (idx2 < arr2.length) {
      result.push(arr2[idx2])
      idx2++;
    }

    return result;
  }
  catch (e) {
    console.log(e);
  }
}

async function getHashtagsFromImage(imageBytes) { // Used for Image Query
  var labels = await getLabels(imageBytes);
  console.log(labels);
  var hashtags = (await getHashtags(labels[0].toLowerCase())).slice(0, 30);
  for (var i = 1; i < 5; i++) {
    if (labels[i].split(' ').length <= 2) {
      var newHashtags = (await getHashtags(labels[i].toLowerCase())).slice(0, 30);
      hashtags = mergeTwo(hashtags, newHashtags);
    }
  }
  console.log("Sending results");
  return hashtags.slice(0, 30);
}

async function getHashtagsFromWord(word) { // Used for Keyword Query
  var hashtags = (await getHashtags(word.toLowerCase())).slice(0, 30);
  return hashtags;
}
