var dataGalley = {};

$(document).ready(function() {
    loadSections();
});

$(document).on("change", "#selectSection", function() {
  var indexSection = $(this).children("option:selected").attr("value");
  createAlbumsSelect(indexSection)
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
            console.log(dataGalley)
            $("#selectSection").html(sections);
            $("#selectSectiomModal").html(sections);
            createAlbumsSelect(0);
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
}

function addPhoto(album_id, photo_title, photo_url){
    $.ajax({
        url: '/gallery/photo/add/',
        data: {
            "title": photo_title,
            "album_id": album_id,
            "i_url": photo_url,
            "csrfmiddlewaretoken": getCookie('csrftoken'),
        },
        type: "POST",
        success: function(data, textStatus, xhr) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
            console.log("pizdec")
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
            // console.log(error, status, xhr);
            console.log("pizdec")
        }
    });
}


$(document).on("click", "#add-album-btn", function(){
    var section_id = parseInt($("#selectSectiomModal").children("option:selected").attr("data-id")),
        title = $.trim($("#album-title-input").val()),
        imageUrl = $.trim($("#album-photo-input").val());
        alert(section_id + title + imageUrl)
    return addAlbum(section_id, title, imageUrl);
});

$(document).on("click", "#add-photo-button", function(){
    var albumId = parseInt($("#albumsGallery").children("option:selected").attr("data-id")),
        title = $.trim($("#photo_title").val()),
        imageUrl = $.trim($("#photo_url").val());
    return addPhoto(albumId, title, imageUrl);
});
