if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}



var ListPhotos = {},
    ajax_data = {},
    ajax_url = {
        'url': 'slider_photo_list',
        'pageSlider': 1,
        'pageModal': 1,
    },
    currentPhotoSlider = 1,
    currentPhotoModal,
    data_page_tile = 1,
    arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

$(document).ready(function() {

    var defaultSection = $("#sectionGallery").children("li").eq(0).text().trim();
    ajax_data["section"] = defaultSection;
    ajax_url["tile_title"] = defaultSection;
    ajaxGallery(ajax_data, ajax_url['url'], 0, 1);

    $("#area_for_right_arrow_slaider").on("click", function(event) {

    });

    $(window).resize(function() {
        if ($(window).width() >= 970) {
            $("#albums_right").show();
        }
    });

    // Показать альбомы
    $("#mobileAlnbumShow").on("click", function() {
        $("#comments_photo_slider").hide();
        $(".head_comment_slider").hide();
        $("#albums_right").show();
        $(".album_previews_img img").each(function() {
            if ($(this).height() < $(this).parent().height()) {
                $(this).parent().addClass("bigWidth");
            }
            $(this).css({ "opacity": "1" })
        });
    });

    // Скрыть альбомы
    $(".arrow-right").on("click", function() {
        $("#albums_right").hide();
    });
    // Показать секции
    $("#sectionMobile").on("click", function() {
        if ($(".nav_ul").is(":visible")) {
            $(this).children("span").addClass("glyphicon-triangle-bottom");
            $(this).children("span").removeClass("glyphicon-triangle-top");
            $(".nav_ul").hide();
        } else {
            $(this).children("span").removeClass("glyphicon-triangle-bottom");
            $(this).children("span").addClass("glyphicon-triangle-top");
            $(".nav_ul").slideDown();
        }
    });

    // Close modal
    $("#closeModalDialog").on("click", function() {
        $('#slaider_modal').modal('hide');
    });


    $("#list").imagesLoaded(function() {
        $('#list').masonry({
            itemSelector: '.item',
            transitionDuration: 0
        });
    });

    // Секции
    var $sectionLi = $("#sectionGallery").children("li");
    $sectionLi.eq(0).addClass('active_nav_ul');
    $sectionLi.click(function(e) {
        if ($(this).hasClass('active_nav_ul')) return;
        $(".more_photo").removeClass("endMore");
        $(".active_nav_ul").removeClass('active_nav_ul');
        $(this).addClass("active_nav_ul");
        page = 1;
        currentPhoto = 0;
        ajax_data["section"] = $(this).text().trim();
        delete ajax_data['album_id'];
        delete ajax_data['page'];
        ajax_url['url'] = 'slider_photo_list';
        ListPhotos = {};
        ajax_url["tile_title"] = ajax_data["section"];
        ajaxGallery(ajax_data, ajax_url['url'], 0, 1);
    });

    // Альбомы
    $(document).on("click", ".list_albums .album_previews", function(e) {
        $(".active_selected_album").removeClass("active_selected_album");
        $(this).addClass("active_selected_album");
        var long_id = $(this).attr("id").split("album_id_"),
            urlReq = 'album_photo_list';
        ListPhotos = {};
        ajax_url['url'] = 'album_photo_list';
        ajax_data['album_id'] = long_id[1];
        ajax_url["tile_title"] = $(this).find(".title_album_preview").text();
        delete ajax_data['section'];
        delete ajax_data['page'];
        ajaxGallery(ajax_data, ajax_url['url'], 0, 1);
        if ($(window).width() <= 969) $("#albums_right").slideUp();
    });

    // Новые фото
    $(document).on("click", "#loadTile", function(e) {
        $(this).addClass("moreLoading");
        var page = $(this).attr("data-page");
        ajax_data['page'] = page;
        if (!ListPhotos.hasOwnProperty(page)) {
            ajaxGallery(ajax_data, ajax_url['url'], 1, page);
        } else {
            makeTile(true, page)
        }
    });


    // Комментарии в слайдере 
    $(".footer_slaider .button_show_comments").on("click", function() {
        if ($(window).width() >= 970) {
            $("#comments_photo_slider").slideDown();
            $(".head_comment_slider").show();
        } else {
            $("#comments_photo_slider").show();
            $(".head_comment_slider").show();
            $("#albums_right").slideDown();
        }
    });

    $(".head_comment_slider i").on("click", function() {
        if ($(window).width() >= 970) {
            $("#comments_photo_slider").slideUp();
            $(this).parent().hide();
        } else {
            $("#albums_right").hide();
        }
    });

});

function ajaxGallery(ajxData, ajaxUrl, method, page) { //method 0: make all, method 1: get pagination tile, method 3: get pagination slider
    $.ajax({
        url: ajaxUrl,
        data: ajxData,
        dataType: "json",
        success: function(data) {
            var json_request_photos = data['photo_list'],
                arr = [];
            $.each(json_request_photos, function(idx, obj) {
                arr.push({
                    "urlObj": obj.image,
                    "idObj": obj.id,
                    "likeObj": obj.positive_likes,
                    "dislikeObj": obj.negative_likes.length,
                    "pageObj": obj.data_page,
                    "lengthComObj": 123,
                    "albumObj": obj.album_title
                })
            });
            ListPhotos[page] = arr;
            ajax_url["tile_date"] = json_request_photos[0]['updated'];
            if (method == 0) {
                makeSlider(page, 0);
                makeTile(false, 1);
                var json_request_albums = data['albums'],
                    albums_count_block = $('.quantity_album'),
                    albums_container = $('.list_albums'),
                    insert_data = "";
                try {
                    albums_count_block.html(json_request_albums.length + " альбомов");
                    $("#albumsMobile").html("(" + json_request_albums.length + ")");
                    $.each(json_request_albums, function(idx, obj) {
                        var dateNeed = get_date(obj["updated"]);

                        insert_data += `
                        <div class="album_previews" id="album_id_` + obj.id + `">
                            <section class="album_previews_img">
                                <img src="` + obj.image + `" class='imgAlbumCover imgUser' alt="" />
                            </section>
                            <section class="infoAlbum">
                                <h3 class="title_album_preview">` + obj.album_title + `</h3>
                                <div class="quantityAlbum">
                                    <figure>
                                        <i class="fa fa-camera" aria-hidden="true"></i>
                                        <figcaption>
                                            ` + obj.album_photo_count + `
                                        </figcaption>
                                    </figure>
                                    <figure>
                                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                        <figcaption>
                                            ` + obj.album_total_likes + `
                                        </figcaption>
                                    </figure>
                                </div>
                                <time>
                                    ` + dateNeed + `
                                </time>
                            </section>
                        </div>
                    `
                    });
                    albums_container.html(insert_data);
                    $("#lastTimeFoto").html(dateNeed);
                } catch (e) {
                    $("#lastTimeFoto").html(function() {
                        return get_date(ajax_url["tile_date"])
                    });
                }
                $("#maneAlbumSelect").html(ajax_url["tile_title"]);

            } else if (method == 1) {
                try {
                    makeTile(true, page);
                } catch (e) {
                    alert("Ошибочка")
                }

            } else {

            }
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });

}

function makeTile(append, page) {
    var foto_tile = "",
        $content = $('#list');
    lengthPagination = ListPhotos[page].length;
    for (var i = 0; i < lengthPagination; i++) {
        var urlTile = ListPhotos[page][i].urlObj,
            idTile = ListPhotos[page][i].urlObj,
            dataPage = ListPhotos[page][i].urlObj;
        foto_tile += `
            <div class="photo_row item">
                <img src="` + urlTile + `" alt="" class="imgTile" 
                data-id="` + idTile + `" data-page="` + dataPage + `"
                data-toggle="modal" data-target="#slaider_modal">
            </div>
        `;
    }
    if (append) {
        $content.append(foto_tile);
        data_page_tile += 1;
    } else {
        $content.html(foto_tile);
        data_page_tile = 2;
    }
    $("#loadTile").attr("data-page", data_page_tile);
    $("#list").imagesLoaded(function() {
        $("#list").masonry('reloadItems');
        $("#list").masonry('layout');
    });
    $("#loadTile").removeClass("moreLoading");
    // $("#loadTile").removeClass("moreLoading").addClass("endMore");
}

function sliderEvent(counterPage, resetIndexPhoto, indexPhoto, deadline) {
    indexPhoto++;
    if (indexPhoto > 8) {
        counterPage += counterPage;
        if (counterPage < 1 || counterPage > 5) counterPage = deadline;
        indexPhoto = resetIndexPhoto;
        var section_name = $("#sectionGallery").children("li").eq(0).text().trim();
        var urlReq = 'slider_photo_list';
        if (!ListPhotos.hasOwnProperty(counterPage)) {
            ajaxGallery(section_name, undefined, undefined, counterPage, false, false, urlReq);
        }
        return makeSlider(counterPage, indexPhoto)
    } else {
        return makeSlider(counterPage, indexPhoto)
    }
}

function makeSlider(page, currentPhoto) {
    var objectImg = ListPhotos[page][currentPhoto],
        urlImg = objectImg["urlObj"],
        id_img = objectImg["idObj"],
        like = objectImg["likeObj"],
        dislike = objectImg["dislikeObj"],
        length_comment = objectImg["lengthComObj"],
        numberFoto = (page - 1) * 9 + currentPhoto + 1,
        $img = $("#imgSlider");

    $img.attr({
        "src": urlImg,
        "data-page": page,
        "data-id": id_img
    });
    $img.attr("href", urlImg)
    $("#indexCount").html(numberFoto)
    $("#likeSlider").children(".votes").html(like);
    $("#dislikeSlider").children(".votes").html(dislike);
    $("#sumCommentSlider").html(length_comment);
    makeComments(id_img, 1, false);
}

function makeComments(albumId, page, append) {
    $.ajax({
        url: '/gallery/photo/comments/',
        data: { "id_img": albumId, "p": page },
        dataType: "json",
        success: function(data) {
            var commentsHtml = "";
            var $blComments = $("#comments_photo_slider").find(".not_comments"),
                $blWithoutCom = $("#comments_photo_slider").find(".user_comment");
            if (data.length < 0) {
                $blComments.css({ "display": "flex" });
                $blWithoutCom.hide()
            } else {
                $blComments.css({ "display": "none" });
                $blWithoutCom.show();
            }
            for (var i = data.length - 1; i >= 0; i--) {
                dateComment = get_date(data[i]["timestamp"]);
                commentsHtml += `
                    <div class="blockquote commentBody">
                        <div class="coments_author containerImgUser">
                            <img src="` + data[i]["user"]["avatar"] + `" alt="" class="imgUser">
                        </div>
                        <div class="coment_author_time">
                            <h5>
                                ` + data[i]["user"]["first_name"] + ` ` + data[i]["user"]["last_name"] +
                                `
                            </h5>
                            <time>` + dateComment + `</time>
                            <p>` + data[i]["content"] + `</p>
                        </div>
                        
                    </div>
                `
            }
            if (append) {
                $("#all_comment_slider").prepend(commentsHtml);
            } else {
                $("#all_comment_slider").html(commentsHtml); 
            }
            
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
};

function get_date(date) {
    var dateToString = "" + date,
        dateDate = new Date(dateToString),
        today = new Date();
    timeLong = (today - dateDate) / (60000 * 24);
    minuteAgo = Math.round((today - dateDate) / 60000);
    if (timeLong > 1 && timeLong < 24) {
        makeDate = "Сегодня в " +  ("0"+dateDate.getHours()).slice(-2) + ":" + ("0"+dateDate.getMonth()).slice(-2);
    } else if (timeLong < 1) {
        makeDate = minuteAgo + " мин. назад"
    } else {
        makeDate = ("0"+dateDate.getDate()).slice(-2) + " " + arrMonth[dateDate.getMonth()] + " " + dateDate.getFullYear();
    }
    return makeDate;
}

$(document).on('click', '#loadCommentsSlider', function() {
    var page = pageCommentCounter = $(this).attr("data-page");
    var albumId = 97;
    makeComments(albumId, page, true);
    pageCommentCounter++;
    $(this).attr("data-page", pageCommentCounter);
})

$(document).on('click', '.block_like', function() {
    input = $(this).parent().parent().find("#id_content");
    photo_id = 1; //input.attr("parent_id");
    type = 0;
    $.ajax({
        url: '/likes/photo/modify/',
        data: {
            photo_id: photo_id,
            type: type,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            alert("Like added!");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
})

$(document).on('click', '.btnFhouse', function(e) {
    e.preventDefault();
    var $inputText = $("#id_content"),
        commentText = $inputText.val();
    photo_id = 97;
    $.ajax({
        url: '/gallery/photo/comment/',
        data: {
            id: photo_id,
            content: commentText,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            dateComment = get_date(new Date());
            
            var commentsHtml = `
                <div class="blockquote">
                    <div class="coments_author containerImgUser">
                        <img src="" alt="" class="imgUser">
                    </div>
                    <div class="coment_author_time">
                        <h5>` + first_name + `</h5>
                        <p>` + commentText + `</p>
                    </div>
                    <time>` + dateComment + `</time>
                </div>
            `;
            $("#all_comment_slider").append(commentsHtml);
            $inputText.val("");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
});


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
