var dataGalley = {};
var IMG_UPLOAD = {
  image: "",
  type: null,
};

$(document).ready(function() {
    loadSections();
    $("#imgLoad").on("change", function() {
      uploadFile();
    });
});

$(document).on("change", "#selectSection", function() {
  var indexSection = $(this).children("option:selected").attr("value");
  createAlbumsSelect(indexSection);
})

function createAlbumsSelect(index) {
  var albums = dataGalley[index].albums,
      albumsHtml = '';
  albums.forEach( function(album, index) {
    albumsHtml += `
      <option value="` + index +  `" class="section_"` + album.id + `" data-id="` + album.id + `">
        ` + album.album_title + `
      </option>
    `
  });
  return $("#albumsGallery").html(albumsHtml);
}

function loadSections () {
    $.ajax({
        url: "/gallery/sections/",
        dataType: "json",
        success: function(data) {
            dataGalley = data.results;
            var sections = "";
            dataGalley.forEach( function(section, index) {
              sections += `
                <option value="` + index +  `" class="section_` + section.id + `" data-id="` + section.id + `">
                  ` + section.section_title + `
                </option>
              `;
            });
            $("#selectSection").html(sections);
            $("#selectSectiomModal").html(sections);
            createAlbumsSelect(0);
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
}

function addPhoto(album_id, photo_title, image, type_img){
    var data = new FormData();
    data.append("title", photo_title);
    data.append("album_id", album_id),
    data.append("csrfmiddlewaretoken", getCookie('csrftoken'));
    if (type_img === 0) {
      data.append("i_url", image)
    } else {
      data.append("i_file",image.get("img"));
    };
    $.ajax({
        url: '/gallery/photo/add/',
        data: data, //ajaxData.i_file,
        type: "POST",
//        cache: false,
        processData: false,
        contentType: false,
        success: function(data, textStatus, xhr) {
            console.log(data);
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
}

function addAlbum(section_id, section_title, photo_url){
    $.ajax({
        url: '/gallery/album/add/',
        data: {
            "title": section_title,
            "section": section_id,
            "i_url": photo_url,
            "csrfmiddlewaretoken": getCookie('csrftoken'),
        },
        type: "POST",
        success: function(data, textStatus, xhr) {
            console.log(data);
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
}

$('.add_album').on('click', function(e) {
    e.preventDefault();
    $('#add-album').show();
});

$(document).on("click", "#add-album-btn", function(){
    var section_id = parseInt($("#selectSectiomModal").children("option:selected").attr("data-id")),
        title = $.trim($("#album-title-input").val()),
        imageUrl = $.trim($("#album-photo-input").val());
        alert(section_id + title + imageUrl)
    return addAlbum(section_id, title, imageUrl);
});

$(document).on("click", "#add-photo-button", function(e) {
    e.preventDefault();
    title = $("#photo_title").val();
    var albumId = parseInt($("#albumsGallery").children("option:selected").attr("data-id")),
        title = $.trim(title);
    return addPhoto(albumId, title, IMG_UPLOAD.image, IMG_UPLOAD.type);
});

// Line to image on change
$(document).on("change", "#photo_url", function() {
  var imageUrl = $.trim($(this).val());
  IMG_UPLOAD.image = imageUrl;
  IMG_UPLOAD.type = 0;
})

// Upload file
function uploadFile() {
    $("#photo_url").val("");
    var inputFile = document.getElementById("imgLoad");
    var reader = new FileReader();
    var fileImg = inputFile.files[0];
    var fd = new FormData();
    fd.append('img', fileImg);
    IMG_UPLOAD.image = fd;
    IMG_UPLOAD.type = 1;
}
