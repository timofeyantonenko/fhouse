if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(document).ready(function() {

    // Size img in slider

    var sliderPar = '#container_img_in_slaider';
    var modalPar = '#flex_container_img_modal';

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

    load_section_info(section_name, undefined);

    $("#list").imagesLoaded(function() {
        $('#list').masonry({
            itemSelector: '.item',
            transitionDuration: 0
        });
    });

    // Секции
    $("#sectionGallery").children("li").click(function(e) {
        if ($(this).hasClass('active_nav_ul')) return;
        $(".more_photo").removeClass("endMore");
        $(".active_nav_ul").removeClass('active_nav_ul');
        $(this).addClass("active_nav_ul");
        section_name = section.text().trim();
        ajaxGallery(section_name, undefined, 1, true, true)
    });

    // Альбомы
    $(document).on("click", ".list_albums .album_previews", function(e) {
        var long_id = $(this).attr("id");
        values = long_id.split("album_id_");
        short_id = values[1];
        ajaxGallery(section_name, short_id, 1, true, false);
        if ($(window).width() <= 969) $("#albums_right").slideUp();
    });

    // Новые фото
    $(document).on("click", ".more_photo", function(e) {
        $(this).addClass("moreLoading");
        data_page = $(this).attr("data-page");
        ajaxGallery(section_name, short_id, data_page, false, false);
    });

    // Преключения между фотками в слайдере
    var index_photo_slaider = 0;

    $(".reset_variable").on("click", function() {
        index_photo_slaider = 0;
        index_photo_modal = 0;
    });

    $('.list_albums').delegate('.album_previews ', 'click', function() {
        index_photo_slaider = 0;
        index_photo_modal = 0;
    });

    index_photo_slaider = index_photo_slaider;


    $(".slider_click").on("click", function(event) {
        var click_element_id = event.target.id;
        var quantity_foto_li = $(".url_list #list_src_slaider li").length;
        var id_left = "area_for_left_arrow_slaider";
        var id_right = "area_for_right_arrow_slaider";
        var id_icon_left = "icon_left";
        var id_icon_right = "icon_right";
        if (click_element_id == id_left || click_element_id == id_icon_left) {
            index_photo_slaider--;
            if (index_photo_slaider == -1) {
                index_photo_slaider = (quantity_foto_li - 1);
            }
        } else if (click_element_id == id_right || click_element_id == id_icon_right) {
            index_photo_slaider++;
            if (index_photo_slaider == quantity_foto_li) {
                index_photo_slaider = 0;
            }
        }
        var indexFoto = index_photo_slaider + 1;
        $("#indexCount").html(indexFoto);
        // Нужно передать к-во фото в данном альбоме или секции
        $("#sumCount").html();
        var new_src = $(".url_list #list_src_slaider li").eq(index_photo_slaider).children(".photo_url").text()
        var new_count_comments = $(".url_list #list_src_slaider li").eq(index_photo_slaider).children(".count_of_comments").text()
        var new_album_title = $(".url_list #list_src_slaider li").eq(index_photo_slaider).children(".photo_album_title").text()
        var new_posit_like = $(".url_list #list_src_slaider li").eq(index_photo_slaider).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list #list_src_slaider li").eq(index_photo_slaider).children(".photo_negative_likes").text()
        $("#slaider_and_albums").find('#container_img_in_slaider img').attr("src", new_src);
        $("#slaider_and_albums").find('.block_like div.votes').text(new_posit_like);
        $("#slaider_and_albums").find('.block_dislike div.votes').text(new_negat_like);
        // $("#slaider_and_albums").find('.button_show_comments').children("span").text(new_count_comments);
        $("#slaider_and_albums").find('.album_slaider').text(new_album_title);
        return false;
    });

    // При отрытии модального окна

    var body_width = $('#slaider_modal .modal-dialog').width();
    var index_photo_modal;

    $('.flex_container_albums').delegate('.photo_row', 'click', function(evt) {
        index_photo_modal = $(this).index();
        make_modal_slider();
        var indexModalPhoto = index_photo_modal + 1;
        $("#indexCountModal").html(indexModalPhoto);
        // Нужно передать к-во фото в данном альбоме или секции
        $("#sumCountModal").html("100");
    });

    function make_modal_slider() {
        var new_src = $(".url_list #list_src_slaider li").eq(index_photo_modal).children(".photo_url").text()
        var new_count_comments = $(".url_list #list_src_slaider li").eq(index_photo_modal).children(".count_of_comments").text();
        var new_album_title = $(".url_list #list_src_slaider li").eq(index_photo_modal).children(".photo_album_title").text()
        var new_posit_like = $(".url_list #list_src_slaider li").eq(index_photo_modal).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list #list_src_slaider li").eq(index_photo_modal).children(".photo_negative_likes").text()
        $("#slaider_modal").find('#flex_container_img_modal img').attr("src", new_src);
        $("#slaider_modal").find('.block_like div.votes').text(new_posit_like);
        $("#slaider_modal").find('.block_dislike div.votes').text(new_negat_like);
        $("#modalCountComment").text(new_count_comments);
        if (new_count_comments == 0) {
            $("#comments_photo_modal").find(".not_comments").css({ "display": "flex" });
            $("#comments_photo_modal").find(".user_comment").hide()
        } else {
            $("#comments_photo_modal").find(".not_comments").css({ "display": "none" });
            $("#comments_photo_modal").find(".user_comment").show();
        }
        $("#slaider_modal").find('.album_slaider').text(new_album_title);
    }

    // Преключения между фотками в модальном окне

    $(".modal_slider_click").on("click", function(evt) {
        loadModal()
        var click_element_id = evt.target.id;
        var quantity_foto_li = $(".url_list #list_src_slaider li").length;
        var id_left = "modal_left";
        var id_right = "modal_right";
        var id_icon_left = "modal_left_icon";
        var id_icon_right = "modal_right_icon";
        if (click_element_id == id_left || click_element_id == id_icon_left) {
            index_photo_modal--;
            if (index_photo_modal == -1) {
                index_photo_modal = (quantity_foto_li - 1);
            }
        } else if (click_element_id == id_right || click_element_id == id_icon_right) {
            index_photo_modal++;
            if (index_photo_modal == quantity_foto_li) {
                index_photo_modal = 0;
            }
        }
        var indexModalPhoto = index_photo_modal + 1;
        $("#indexCountModal").html(indexModalPhoto);
        make_modal_slider();
        return false;
    });

    $('html').keydown(function(eventObject) {
        loadModal()
        if ($('#slaider_modal').hasClass('in')) {
            var click_element_id = eventObject.target.id;
            var quantity_foto_li = $(".url_list #list_src_slaider li").length;
            var id_left = "modal_left";
            var id_right = "modal_right";
            var id_icon_left = "modal_left_icon";
            var id_icon_right = "modal_right_icon";
            if (eventObject.keyCode == 37) {
                index_photo_modal--;
                if (index_photo_modal == -1) {
                    index_photo_modal = (quantity_foto_li - 1);
                }
            } else if (eventObject.keyCode == 39) {
                index_photo_modal++;
                if (index_photo_modal == quantity_foto_li) {
                    index_photo_modal = 0;
                }
            }
            var indexModalPhoto = index_photo_modal + 1;
            $("#indexCountModal").html(indexModalPhoto);
            make_modal_slider();
        }
    });

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

function ajaxGallery(section, album, page, newUl, newAlbum, newFoto) {
    var f = function() {
        var ajax_url = 'album_photo_list',
            ajax_data,
            state = "";

        if (!album && !page) {
            ajax_data = { "section": section_name };
        } else if (!section && !page) {
            ajax_data = { "album_id": album_id };
        } else if (!section && page && album) {
            ajax_data = { "album_id": album_id, "page": page };
        } else if (section && page && !album) {
            ajax_data = { "section": section_name, "page": page };
        }

        if (album_id != "all") ajax_data = ["album_id"] = album_id;

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
                                    ` + obj.photos_time + `
                                </time>
                            </section>
                        </div>
                    `
                    });
                    albums_container.html(insert_data);
                }
                var content = $('#list_src_slaider'),
                    insert_data = foto_tile = "",
                    json_request_photos = data['photo_list'];

                $.each(json_request_photos, function(idx, obj) {
                    obj_comments = obj.comments;
                    list_li += `
                        <li>
                            <span class="photo_url">` + obj.image + `</span>
                            <span class="count_of_comments">` + obj_comments.length + `</span>
                            <span class="photo_album_title">` + obj.album_title + `</span>
                            <span class="photo_positive_likes">` + obj.positive_likes.length + `</span>
                            <span class="photo_negative_likes">` + obj.negative_likes.length + `</span>
                            <span class="photo_id">` + obj.data_id + `</span>
                            <span class="photo_page">` + obj.data_page + `</span>
                         </li>
                     `;

                    if (newFoto) {
                        foto_tile += `
                        <div class="photo_row item">
                            <img src="` + obj.image + `" alt="" class="imgTile" 
                            data-id="` + obj.data_id + `" data-page="` + obj.data_page + `"
                            data-toggle="modal" data-target="#slaider_modal">
                        </div>
                    `;
                    }

                });
                if (newUl) {
                    content.html(insert_data);
                } else {
                    content.html(insert_data);
                }

                make_slider();
            },
            error: function(xhr, status, error) {
                // console.log(error, status, xhr);
            }
        });
    }
    return f()
}

$("#list").imagesLoaded(function() {
    $("#list").masonry('reloadItems');
    $("#list").masonry('layout');
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

var ListPhotos = {
    
}


function slider(counterPage, resetIndexPhoto) {
    try {
        ListPhotos[page][n]
        indexPhoto++
    } catch (e) {
        page += counterPage;
        n = resetIndexPhoto;
        if (!ListPhotos.hasOwnProperty(prop)) ajaxGallery(section, album, page, newUl, false, false);
        return slider(counterPage, resetIndexPhoto)
    }
}

function makeSlider(page, n) {
    var objectImg = ListPhotos[page][n],
        urlImg = objectImg["urlObj"],
        id_img = objectImg["idObj"],
        like = objectImg["likeObj"],
        dislike = objectImg["dislikeObj"],
        pageImg = objectImg["pageObj"],
        length_comment = "";
        number = (pageImg - 1) * 9 + n + 1;
    var $img = $("#imgSlider");
    $img.attr({
        href: urlImg,
        data - page: pageImg,
        data - id: id_img
    });
    $("#indexCount").html(number)
    $("#likeSlider").children(".votes").html(like);
    $("#dislikeSlider").children(".votes").html(dislike);
    makeComments(id_img, 0);
    
    var $blComments = $("#comments_photo_slider").find(".not_comments"),
        $blWithoutCom = $("#comments_photo_slider").find(".user_comment");
    if (lengthComment) {
        $blComments.css({ "display": "flex" });
        $blWithoutCom.hide()
    } else {
        $blComments.css({ "display": "none" });
        $blWithoutCom.show();
    }
}

function makeComments(albumId, page) {
    $.ajax({
        url: '/gallery/photo/comments',
        data: { "id_img": albumId, "p": page },
        dataType: "json",
        success: function(data) {
            length_comment = data.length - 1;
            var commentsHtml = "";
            for ( var i = commentsHtml ; i <= 0; i++ ) {
                commetId = data[i];
                dateComment = "" + getDate(commetId["timestamp"]) + " " + getMonth(commetId["timestamp"]) + " " + getFullYear(commetId["timestamp"]);
                comments += `
                    <div class="blockquote">
                        <a href="#">
                            <div class="coments_author containerImgUser">
                                <img src="` + commetId["user"]["avatar"] + `" alt="" class="imgUser">
                            </div>
                        </a>
                        <div class="coment_author_time">
                            <a href="#">
                                ` + commetId["user"]["first_name"]  + ` ` + commetId["user"]["last_name"]  `
                            </a>
                            <p>` + dateComment + `</p>
                        </div>
                        <p>` + commetId["content"] + `</p>
                    </div>
                    
                `
            }

        }
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
}

$(document).on('click', '.block_like', function(){
        input = $(this).parent().parent().find("#id_content");
        photo_id = 1;//input.attr("parent_id");
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
            //            console.log(error, status, xhr);
        }
    });
})
