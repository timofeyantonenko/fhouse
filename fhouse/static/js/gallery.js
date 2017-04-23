if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
var ListPhotos = {};

$(document).ready(function() {
    var sliderPar = '#container_img_in_slaider';
    var modalPar = '#flex_container_img_modal';
    var urlReq = 'slider_photo_list';
    var section_name = $("#sectionGallery").children("li").eq(0).text().trim();
    var start_foto = -1;

    ajaxGallery(section_name, undefined, undefined, 1, true, true, urlReq)
    slider(1, 0, start_foto, 1);

    $("#area_for_right_arrow_slaider").on("click", function(event) {
        slider(1, 0, start_foto, 1);
        start_foto++;
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
        section_name = $(this).text().trim();
        urlReq = 'slider_photo_list'
        ListPhotos = {};
        ajaxGallery(section_name, undefined, 1, true, true, true, urlReq);
        slider(1, 0, start_foto, 1);
        console.log(ListPhotos);
    });

    // Альбомы
    $(document).on("click", ".list_albums .album_previews", function(e) {
        $(".active_selected_album").removeClass("active_selected_album");
        $(this).addClass("active_selected_album");
        var long_id = $(this).attr("id"),
            values = long_id.split("album_id_"),
            short_id = values[1],
            urlReq = 'album_photo_list';
            ListPhotos = {};
        ajaxGallery(section_name, short_id, 1, true, true, false, urlReq);
        console.log(ListPhotos)
        if ($(window).width() <= 969) $("#albums_right").slideUp();
    });

    // Новые фото
    $(document).on("click", ".more_photo", function(e) {
        $(this).addClass("moreLoading");
        data_page = $(this).attr("data-page");
        ajaxGallery(section_name, short_id, data_page, false, false, urlReq);
    });


    // Преключения между фотками в модальном окне

    // $(".modal_slider_click").on("click", function(evt) {
    //     var click_element_id = evt.target.id;
    //     var quantity_foto_li = $(".url_list #list_src_slaider li").length;
    //     var id_left = "modal_left";
    //     var id_right = "modal_right";
    //     var id_icon_left = "modal_left_icon";
    //     var id_icon_right = "modal_right_icon";
    //     if (click_element_id == id_left || click_element_id == id_icon_left) {
    //         index_photo_modal--;
    //         if (index_photo_modal == -1) {
    //             index_photo_modal = (quantity_foto_li - 1);
    //         }
    //     } else if (click_element_id == id_right || click_element_id == id_icon_right) {
    //         index_photo_modal++;
    //         if (index_photo_modal == quantity_foto_li) {
    //             index_photo_modal = 0;
    //         }
    //     }
    //     $("#indexCountModal").html(indexModalPhoto);
    // });

    // $('html').keydown(function(eventObject) {
    //     loadModal()
    //     if ($('#slaider_modal').hasClass('in')) {
    //         var click_element_id = eventObject.target.id;
    //         var quantity_foto_li = $(".url_list #list_src_slaider li").length;
    //         var id_left = "modal_left";
    //         var id_right = "modal_right";
    //         var id_icon_left = "modal_left_icon";
    //         var id_icon_right = "modal_right_icon";
    //         if (eventObject.keyCode == 37) {
    //             index_photo_modal--;
    //             if (index_photo_modal == -1) {
    //                 index_photo_modal = (quantity_foto_li - 1);
    //             }
    //         } else if (eventObject.keyCode == 39) {
    //             index_photo_modal++;
    //             if (index_photo_modal == quantity_foto_li) {
    //                 index_photo_modal = 0;
    //             }
    //         }
    //         var indexModalPhoto = index_photo_modal + 1;
    //         $("#indexCountModal").html(indexModalPhoto);
    //         make_modal_slider();
    //     }
    // });

    // Лайк-Дислйк
    $(".modal_photo_like>div").on("click", function() {
        if ($(this).hasClass("active_like")) {
            $(".modal_photo_like>div").removeClass('active_like');
            $(this).children(".votes").removeClass("active_votes");
        } else {
            $(".modal_photo_like>div").removeClass('active_like');
            $(".modal_photo_like>div").children(".votes").removeClass("active_votes");
            $(this).addClass('active_like');
            $(this).children(".votes").addClass("active_votes");
        }
    });

    $(".slaider_photo_like>div").on("click", function() {
        if ($(this).hasClass("active_like")) {
            $(".slaider_photo_like>div").removeClass('active_like');
            $(this).children(".votes").removeClass("active_votes");
        } else {
            $(".slaider_photo_like>div").removeClass('active_like');
            $(".slaider_photo_like>div").children(".votes").removeClass("active_votes");
            $(this).addClass('active_like');
            $(this).children(".votes").addClass("active_votes");
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

function ajaxGallery(section, album, page, newUl, newAlbum, newFoto, urlRequest) {
    var ajax_url = urlRequest,
        ajax_data,
        state = "";

    if (!album && !page) {
        ajax_data = { "section": section };
    } else if (!section && !page) {
        ajax_data = { "album_id": album };
    } else if (!section && page && album) {
        ajax_data = { "album_id": album, "page": page };
    } else if (section && page && !album) {
        ajax_data = { "section": section, "page": page };
    }

    // if (album_id != "all") ajax_data = {["album_id"] = album_id};

    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "json",
        success: function(data) {
            if (newAlbum) {
                var json_request_albums = data['albums'];
                var albums_count_block = $('.quantity_album');
                albums_count_block.html(json_request_albums.length + " альбомов");
                $("#albumsMobile").html("(" + json_request_albums.length + ")");
                var albums_container = $('.list_albums');
                insert_data = ""
                $.each(json_request_albums, function(idx, obj) {
                    var lastDate = 212;
                    // "" + getDate(obj["updated"]) + " " + getMonth(obj["updated"]) + " " + getFullYear(obj["updated"]);
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
                                    ` + lastDate + `
                                </time>
                            </section>
                        </div>
                    `
                });
                albums_container.html(insert_data);
            }
            var json_request_photos = data['photo_list'];
            if (!ListPhotos.hasOwnProperty(newUl)) {
                var arr = [];
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
            }

            ListPhotos[newUl] = arr;

            if (newFoto) {
                var foto_tile = "",
                    $content = $('#list');
                for (var i = 0; i < 9; i++) {
                    var urlTile = ListPhotos[newUl][i].urlObj,
                        idTile = ListPhotos[newUl][i].urlObj,
                        dataPage = ListPhotos[newUl][i].urlObj;
                    foto_tile += `
                                <div class="photo_row item">
                                    <img src="` + urlTile + `" alt="" class="imgTile" 
                                    data-id="` + idTile + `" data-page="` + dataPage + `"
                                    data-toggle="modal" data-target="#slaider_modal">
                                </div>
                            `;
                }
                $content.append(foto_tile);
                $("#list").imagesLoaded(function() {
                    $("#list").masonry('reloadItems');
                    $("#list").masonry('layout');
                });
            }
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });

}



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

function slider(counterPage, resetIndexPhoto, indexPhoto, deadline) {
    indexPhoto++;
    console.log(indexPhoto)
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

function makeSlider(page, n) {
    try {
        var objectImg = ListPhotos[page][n],
            urlImg = objectImg["urlObj"],
            id_img = objectImg["idObj"],
            like = objectImg["likeObj"],
            dislike = objectImg["dislikeObj"],
            pageImg = page,
            length_comment = objectImg["lengthComObj"],
            numberFoto = (pageImg - 1) * 9 + parseInt(n) + 1,
            $img = $("#imgSlider");
        $img.attr({
            "src": urlImg,
            "data-page": pageImg,
            "data-id": id_img
        });
        $img.attr("href", urlImg)
        var $blComments = $("#comments_photo_slider").find(".not_comments"),
            $blWithoutCom = $("#comments_photo_slider").find(".user_comment");
        if (length_comment) {
            $blComments.css({ "display": "flex" });
            $blWithoutCom.hide()
        } else {
            $blComments.css({ "display": "none" });
            $blWithoutCom.show();
        }
        $("#indexCount").html(numberFoto)
        $("#likeSlider").children(".votes").html(like);
        $("#dislikeSlider").children(".votes").html(dislike);
        $("#sumCommentSlider").html(length_comment);
        // makeComments(id_img, 0);
    } catch (e) {
        $(document).ajaxStop(function() {
            return makeSlider(page, n);
        });
    }
}

// function makeComments(albumId, page) {
//     $.ajax({
//         url: '/gallery/photo/comment',
//         data: { "id_img": albumId, "p": page },
//         dataType: "json",
//         success: function(data) {
//             length_comment = data.length - 1;
//             var commentsHtml = "";
//             for (var i = commentsHtml; i <= 0; i++) {
//                 commetId = data[i];
//                 dateComment = "" + getDate(commetId["timestamp"]) + " " + getMonth(commetId["timestamp"]) + " " + getFullYear(commetId["timestamp"]);
//                 comments += `
//                     <div class="blockquote">
//                         <a href="#">
//                             <div class="coments_author containerImgUser">
//                                 <img src="` + commetId["user"]["avatar"] + `" alt="" class="imgUser">
//                             </div>
//                         </a>
//                         <div class="coment_author_time">
//                             <a href="#">
//                                 ` + commetId["user"]["first_name"] + ` ` + commetId["user"]["last_name"]
//                 `
//                             </a>
//                             <p>` + dateComment + `</p>
//                         </div>
//                         <p>` + commetId["content"] + `</p>
//                     </div>
//                 `
//                 $(".all_comment_for_photo").append(comments)
//             }

//         }
//         error: function(xhr, status, error) {
//             // console.log(error, status, xhr);
//         }
//     });
// }

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
});
