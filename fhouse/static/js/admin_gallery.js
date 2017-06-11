$(document).ready(function() {
    loadSections();
    // Add option to select
    for (var i = 0; i < $("#listAlumms").find('ul').eq(0).children("li").length; i++) {
        var text_li = $("#listAlumms").find('ul').eq(0).children("li").eq(i).text();
        var html_option = '<option value="' + i + '" class="StadiumAlbums">' + text_li + '</option>';
        $(".albumSelect").append(html_option);
    }
});


function loadSections(){
    $.ajax({
        url: "/gallery/sections/",
        dataType: "json",
        success: function(data) {
            console.log(data);
            totalSectionsList = "";
            totalAlbumsList = "";
            data["results"].forEach(function(item, index){
                totalSectionsList += "<option value=\"" + index + "\" class=\"" + "section_"
                + item.id + "\">" + item.section_title + "</option>";

                totalAlbumsForSection = "<ul class=\"" + "section_" + item.id + "\">";
                albums = item.albums;
                albums.forEach(function (album_item, album_index){
                    totalAlbumsForSection += "<li album-id=\"" + album_item.id + "\">" + album_item.album_title + "</li>";
                });
                totalAlbumsForSection += "</ul>";
                totalAlbumsList += totalAlbumsForSection;

            });
            $("#selectSection").html(totalSectionsList);
            $("#listAlumms").html(totalAlbumsList);
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
            title: photo_title,
            album_id: album_id,
            i_url: photo_url,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

$(document).on("click", "#add-photo-button", function(){
    title = $("#photo_title").val();
    imageUrl = $("#photo_url").val();
    albumId = $( ".albumSelect option:selected" ).attr("album-id");
    console.log(title + " " + imageUrl + " " + albumId);
    addPhoto(albumId, title, imageUrl);
});

