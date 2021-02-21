const inpFile = document.getElementById("imageInput");
const form = document.getElementById("image-form");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-preview__image");

inpFile.addEventListener("change", function () {
  const file = inpFile.files[0];

  if (file) {
    const reader = new FileReader();

    previewImage.style.display = "block";

    reader.addEventListener("load", function () {
      previewImage.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(file);
  }
});

form.onsubmit = function(event) {
  event.preventDefault() 
    const file = inpFile.files[0];
  
    event.preventDefault() // stops page from refreshing
  
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
        var jsondata = JSON.parse(data);
        useData(jsondata);
      }
    });
    console.log("Data Sent");
  }

  function useData(data) {
    /*
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].hashtag);
    }*/
    $('#results-container').html("<li>apple</li>");
    /*
    <li data-aos="fade-up" data-aos-delay="200">
                            <i></i> <a data-toggle="collapse" href="#faq-list-2" class="collapsed">#Example <i
                                    class="bx bx-chevron-down icon-show"></i><i
                                    class="bx bx-chevron-up icon-close"></i></a>
                            <div id="faq-list-2" class="collapse" data-parent=".faq-list">
                                <p>
                                    Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum
                                    velit laoreet id
                                    donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est
                                    pellentesque elit
                                    ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                </p>
                            </div>
                        </li>*/
  }