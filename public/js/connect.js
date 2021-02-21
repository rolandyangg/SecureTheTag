const inpFile = document.getElementById("imageInput");
const textInput = document.getElementById("keywordInput");
const form = document.getElementById("image-form");
const form2 = document.getElementById("keyword-form");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-preview__image");

inpFile.addEventListener("change", function () {
  const file = inpFile.files[0];

  if (file) {
    const reader = new FileReader();
    $('#custom-file-label').html(inpFile.value.substring(inpFile.value.lastIndexOf("\\") + 1));

    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      previewImage.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(file);
  }
});

/**
 * For files
 * @param {*} event 
 */
form.onsubmit = function (event) {

  const file = inpFile.files[0];

  event.preventDefault() // stops page from refreshing

  $('#upperfaqlistcontainer').html("<row class='row d-flex justify-content-center'><div class='loader'></div></row>");

  console.log("Clicked Submit");

  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  for (const file of inpFile.files) {
    formData.append("myFiles[]", file);
  }

  console.log(formData);
  // console.log("Sent");

  jQuery.ajax({
    url: '/getImageHashtags',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function (data) {
      // Where the magic happens
      console.log("Data Received");
      var jsondata = JSON.parse(data);
      console.log(jsondata);
      useData(jsondata);
    }
  });
  console.log("Data Sent");
}

/**
 * For keywords
 * @param {*} event 
 */
form2.onsubmit = function (event) {

  event.preventDefault() // stops page from refreshing

  $('#upperfaqlistcontainer').html("<row class='row d-flex justify-content-center'><div class='loader'></div></row>");

  console.log("Clicked Submit");

  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append("Keyword", textInput.value);

  console.log(formData);
  // console.log("Sent");

  jQuery.ajax({
    url: '/getKeywordHashtags',
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function (data) {
      // Where the magic happens
      console.log("Data Received");
      var jsondata = JSON.parse(data);
      console.log(jsondata);
      useData(jsondata);
    }
  });
  console.log("Data Sent");
}

/**
 * Interprets data and displays results on the webpage
 * @param {*} data 
 */
function useData(data) {
  var htmlData = "";
  for (let i = 0; i < data.length; i++) {
    htmlData +=
      "<ul id='results-container'><li data-aos='fade-up' data-aos-delay='200'><i></i> <a data-toggle='collapse' href='#faq-list-" + String(i + 1) + "' class='collapsed'>" +
      data[i].hashtag +
      "<i class='bx bx-chevron-down icon-show'></i><i class='bx bx-chevron-up icon-close'></i></a>" +
      "<div id='faq-list-" + String(i + 1) + "' class='collapse' data-parent='.faq-list'>" +
      "<p>Posts per Hour: " + data[i].posts_per_hour + "</p>" +
      "<p>Total Posts: " + data[i].total_posts + "</p>" +
      "<p>Average Likes: " + data[i].average_likes + "</p>" +
      "</div></li></ul?"
  }
  $('#upperfaqlistcontainer').html(htmlData);
}