const inpFile = document.getElementById("imageInput");
const form = document.getElementById("submission-form");

form.onsubmit = function(event) {
    const file = inpFile.files[0];
  
    event.preventDefault() // stops page from refreshing
  
    console.log("Clicked Submit");
  
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
  
    for (const file of inpFile.files) {
      formData.append("myFiles[]", file);
    }
  
    console.log(formData);
  
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
        var jsondata = JSON.parse(data);
        console.log("Received");
        console.log(jsondata);
      }
    });
    console.log("Data Sent");
  }