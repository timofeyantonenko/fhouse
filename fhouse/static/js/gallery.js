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

    $('#container_img_in_slaider').children('img').on('load', function() {
            // size_img_slaider(sliderPar)
            $(this).parent().removeClass('load');
        })
        .on('error', function() {
            // do stuff on smth wrong (error 404, etc.)
        })
        .each(function() {
            if (this.complete) {
                $(this).parent().addClass('load');
            }
        });

    $('#flex_container_img_modal').children('img').on('load', function() {
        // size_img_slaider(modalPar)
        $(this).parent().removeClass('load');
    }).on('error', function() {

    }).each(function() {
        if (this.complete) {
            $(this).parent().addClass('load');
        }
    });

    $(window).resize(function() {
        itemDownload();
        // size_img_slaider(sliderPar);
        // size_img_slaider(modalPar);
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

    // Index and name album or section 

    // Нужно передать к-во фото в данном альбоме или секции
    $("#sumCount").html("1000");
    // Name album
    var nameAlbumSection = $(".nav_ul").children("li").eq(0).children("a").text();
    $("#maneAlbumSelect").html(nameAlbumSection);
    // Нужно предать дату последней фотографии в альбоме
    $("#lastTimeFoto").html();

    var dowloadItem;
    itemDownload();

    section = $(".nav_ul li:first-child a");
    section_name = section.text().trim();
    console.log(section_name);
    // Active section of menu
    section.addClass("active_nav_ul");
    load_section_info(section_name, undefined);

    $("#list").imagesLoaded(function() {
        $('#list').masonry({
            itemSelector: '.item',
            transitionDuration: 0
        });
    });

    // Активный раздел меню
    $(".nav_ul li a").click(function(e) {
        // Reset var start foto 
        $(".more_photo").removeClass("endMore");
        resetFirstLi();
        $(".nav_ul").hide();
        $(".photo_row").remove();
        if ($(this).hasClass('active_nav_ul')) {
            return;
        } else {
            $("#indexCount").html("1");
            // Нужно передать к-во фото в данном альбоме или секции
            $("#sumCount").html();
            // Name album
            var nameSection = $(this).text()
            $("#maneAlbumSelect").html(nameSection);
            // Нужно предать дату последней фотографии в альбоме
            $("#lastTimeFoto").html();
        }
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        section = $(this);
        section_name = section.text().trim();
        // Active section of menu
        section.addClass("active_nav_ul");
        load_section_info(section_name, undefined);
        loadSlider();
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
        var quantity_foto_li = $(".url_list .list_src_slaider li").length;
        var id_left = "area_for_left_arrow_slaider";
        var id_right = "area_for_right_arrow_slaider";
        var id_icon_left = "icon_left";
        var id_icon_right = "icon_right";
        loadSlider()
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
        var new_src = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_url").text()
        var new_count_comments = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".count_of_comments").text()
        var new_album_title = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_album_title").text()
        var new_posit_like = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_negative_likes").text()
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
        $('#slaider_modal').on('shown.bs.modal', function() {
            // size_img_slaider(modalPar)
            // loadModal();
        })
    });

    function make_modal_slider() {
        var new_src = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_url").text()
        var new_count_comments = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".count_of_comments").text();
        var new_album_title = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_album_title").text()
        var new_posit_like = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_negative_likes").text()
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
        var quantity_foto_li = $(".url_list .list_src_slaider li").length;
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
            var quantity_foto_li = $(".url_list .list_src_slaider li").length;
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

// выбор альбома
$(document).on("click", ".list_albums .album_previews", function(e) {
    $(".photo_row").remove();
    $(".more_photo").removeClass("endMore");
    var long_id = $(this).attr("id");
    //    var name_album = $(this).find(".title_album_preview").text();
    values = long_id.split("album_id_");
    short_id = values[1];
    if ($(this).hasClass("active_selected_album")) {
        return;
    } else {
        firstFoto = -9;
        $("#indexCount").html("1");
        // Нужно передать к-во фото в данном альбоме или секции
        $("#sumCount").html("1");
        $(".list_albums .album_previews").removeClass('active_selected_album');
        $(this).addClass('active_selected_album');
        // Name album
        var nameAlbum = $(this).find(".title_album_preview").text();
        $("#maneAlbumSelect").html(nameAlbum);
        // Нужно предать дату последней фотографии в альбоме
        $("#lastTimeFoto").html();
    }

    var name_album = $(this).children(".discription_previewws_album").children(".title_album_preview").text();
    $('.album_slaider').html(name_album);
    load_album_photos(short_id, 1); // load first part of album photos
    loadSlider();
    if ($(window).width() <= 969) {
        $("#albums_right").slideUp();
    }
    $(".more_photo").attr("href", 2);
    return false;
});

$(document).on("click", ".more_photo", function(e) {
    $(this).addClass("moreLoading");
    page = $(this).attr("href");
    section_name = $(".active_nav_ul");
    section_name = section_name.text().trim();
    //    album_name = find(".active_selected_album");
    album = $(".active_selected_album");

    if (album.length) {
        album_id = album.attr("id");
        values = album_id.split("album_id_");
        short_id = values[1];
    } else {
        short_id = "all";
    }
    load_tile_photos(section_name, short_id, page);
});

function load_tile_photos(section_name, album_id, page) {
    var ajax_url = 'album_photo_list';
    var ajax_data = { "section": section_name, "page": page }
    if (album_id != "all") {
        ajax_data["album_id"] = album_id;
    }
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "json",
        success: function(data) {
            var content = $('.list_src_slaider');
            var insert_data = "";
            var json_request_photos = data['photo_list'];
            $.each(json_request_photos, function(idx, obj) {
                obj_comments = obj.comments;
                // console.log(obj_comments.length);
                insert_data += "<li>" + "<span class=\"photo_url\">" + obj.image + "</span>" + " <span class=\"count_of_comments\">" + obj_comments.length + "</span>" + " <span class=\"photo_album_title\">" + obj.album_title + "</span>" + " <span class=\"photo_positive_likes\">" + obj.positive_likes.length + "</span>" + " <span class=\"photo_negative_likes\">" + obj.negative_likes.length + "</span>" + "</li>";
                try {
                    //                    console.log("comments: " + JSON.parse(obj.comments)[0]["fields"]["content"]);
                } catch (err) {}
            });
            content.append(insert_data);
            make_slider();
            more_button = $(".more_photo");
            more_button.attr("href", parseInt(more_button.attr("href")) + 1);
            $(".more_photo").removeClass("moreLoading");
        },
        error: function(xhr, status, error) {
            $(".more_photo").removeClass("moreLoading").addClass("endMore");
        }
    });
}

function load_section_info(section_name, album_name) {
    var ajax_url = 'slider_photo_list';
    var ajax_data = { "section": section_name }
    var state = ""
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "json",
        success: function(data) {
            // var $parentImgAlbumCover = $(".list_albums");
            var content = $('.list_src_slaider');
            var insert_data = "";
            //          console.log(data);
            //          json_data = JSON.parse(data);
            var json_request_photos = data['photo_list'];
            $.each(json_request_photos, function(idx, obj) {
                //              insert_data += "<li>" + obj.image + " </li>";
                // console.log('obj: ' + obj.image);
                obj_comments = obj.comments;
                // console.log(obj_comments.length);
                insert_data += "<li>" + "<span class=\"photo_url\">" + obj.image + "</span>" + " <span class=\"count_of_comments\">" + obj_comments.length + "</span>" + " <span class=\"photo_album_title\">" + obj.album_title + "</span>" + " <span class=\"photo_positive_likes\">" + obj.positive_likes.length + "</span>" + " <span class=\"photo_negative_likes\">" + obj.negative_likes.length + "</span>" + "</li>";
                try {
                    //                    console.log("comments: " + JSON.parse(obj.comments)[0]["fields"]["content"]);
                } catch (err) {}
            });
            content.html(insert_data);
            make_slider();
            var json_request_albums = data['albums'];
            var albums_count_block = $('.quantity_album');
            albums_count_block.html(json_request_albums.length + " альбомов");
            $("#albumsMobile").html("(" + json_request_albums.length + ")");
            var albums_container = $('.list_albums');
            insert_data = ""
            $.each(json_request_albums, function(idx, obj) {
                insert_data += "<div class=\"album_previews\" id=\"album_id_" + obj.id + "\">" +
                    "<div class=\"album_previews_img\">" +
                    "<img src=\"" + obj.image + "\" alt=\"\" class='imgAlbumCover imgUser'> </div>" +
                    " <div class=\"discription_previewws_album\">" +
                    " <div class=\"title_album_preview\"> " + obj.album_title + " </div>" +
                    " <div class=\"info_preview_album\"> <span><i class=\"fa fa-camera\" aria-hidden=\"true\"></i>" +
                    " 48 &nbsp;<i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i> 456</span>" +
                    " <span class=\"date_album_preview\">28 october 2010</span>" +
                    " </div> </div> </div>"
                    //                insert_data += "<div class=\"album_previews\"><div class=\"album_previews_img\">" +
                    //                "<img src=\"https://photo.championat.com/18/18040/full/762888-artjom-rebrov-denis-davydov-i-denis-glushakov.jpg\""  +
                    //                "alt=\"\"></div><div class=\"discription_previewws_album\"><div class=\"title_album_preview\">Лучшие стадины Украины</div>" +
                    //                                   +  "<div class=\"info_preview_album\"><span><i class=\"fa fa-camera\" aria-hidden=\"true\">" +
                    //                                   "</i> 48 &nbsp;<i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i> 456</span>" +
                    //                                   "<span class=\"date_album_preview\">28 october 2010</span></div></div></div>"
                    //                    insert_data += "<li>" + MEDIA_URL + obj.fields.image + " </li>"
            });
            albums_container.html(insert_data);
            $('.album_slaider').html(section_name);
            $(".more_photo").attr("href", 2);
        },
        error: function(xhr, status, error) {
            alert("ERROR");
        }

    });
}

function load_album_photos(album_id, page) {
    var ajax_url = 'album_photo_list';
    var ajax_data = { "album_id": album_id, "page": page }
    var state = ""
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "json",
        success: function(data) {
            var content = $('.list_src_slaider');
            var insert_data = "";
            //          console.log(data);
            //          json_data = JSON.parse(data);
            var json_request_photos = data['photo_list'];
            $.each(json_request_photos, function(idx, obj) {
                //              insert_data += "<li>" + obj.image + " </li>";
                // console.log('obj: ' + obj.image);
                obj_comments = obj.comments;
                // console.log(obj_comments.length);
                insert_data += "<li>" + "<span class=\"photo_url\">" + obj.image + "</span>" + " <span class=\"count_of_comments\">" + obj_comments.length + "</span>" + " <span class=\"photo_album_title\">" + obj.album_title + "</span>" + " <span class=\"photo_positive_likes\">" + obj.positive_likes.length + "</span>" + " <span class=\"photo_negative_likes\">" + obj.negative_likes.length + "</span>" + "</li>";
                try {
                    //                    console.log("comments: " + JSON.parse(obj.comments)[0]["fields"]["content"]);
                } catch (err) {}
            });
            content.html(insert_data);
            make_slider();
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
}

// Плитка фотографий
function massonryShow() {
    $(".photo_row").css({ "display": "flex" });
}

function resetFirstLi() {
    firstFoto = -9;
}

var firstFoto = -9,
    lastFoto = 9;


function tile_fot() {
    ul_list_length = $(".list_src_slaider").find("li").length;
    lastFoto = ul_list_length;
    firstFoto += 9;
    if (firstFoto <= 0) {
        firstFoto = 0;
    }
    var $listUrl = $(".list_src_slaider").find("li"),
        url_img,
        htmlImg = "";
    for (var lim = firstFoto; lim < lastFoto; lim++) {
        url_img = $listUrl.eq(lim).find(".photo_url").text();
        htmlImg += `
            <div class="photo_row item">
                <img src="` + url_img + `" alt="" class="imgTile" data-toggle="modal" data-target="#slaider_modal">
            </div>
        `;
    };
    $('.flex_container_albums').append(htmlImg);
    $("#list").imagesLoaded(function() {
        $("#list").masonry('reloadItems');
        $("#list").masonry('layout');
    });

}

function make_slider() {
    // Номер фотографии
    var quantity_foto_albums = ($(".list_src_slaider").length);
    $("#quantity_photo_in_album").html(quantity_foto_albums);

    // Номер фото модальное окно
    var quantity_foto_modal = ($("#list_src_foto_modal li").length);
    $("#quantity_photo_in_album_modal").html(quantity_foto_modal);

    // Новый слайдер

    // При переходе в галерею подгружается список ссылок с первой секции и src последней фото добавляется в img
    var photo_image_url = $('.list_src_slaider li:first-child span.photo_url').text(),
        count_of_comments = $('.list_src_slaider li:first-child span.count_of_comments').text(),
        count_of_pos_likes = $('.list_src_slaider li:first-child span.photo_positive_likes').text(),
        count_of_neg_likes = $('.list_src_slaider li:first-child span.photo_negative_likes').text(),
        photo_album_title = $('.list_src_slaider li:first-child span.photo_album_title').text();

    //    var src_first_li_section = $('.list_src_slaider li:first-child span.photo_url').text()

    $("#slaider_and_albums").find('#container_img_in_slaider img').attr("src", photo_image_url);
    $("#slaider_and_albums").find('.block_like div.votes').text(count_of_pos_likes);
    $("#slaider_and_albums").find('.block_dislike div.votes').text(count_of_neg_likes);
    // $("#slaider_and_albums").find('.button_show_comments').children("span").text(new_count_comments);
    $("#slaider_and_albums").find('.album_slaider').text(photo_album_title);
    $("#sumCommentSlider").html(count_of_comments);
    $("#sumCommentSliderRight").html(count_of_comments);
    if (count_of_comments == 0) {
        $("#comments_photo_slider").find(".not_comments").css({ "display": "flex" });
        $("#comments_photo_slider").find(".user_comment").hide()
    } else {
        $("#comments_photo_slider").find(".not_comments").css({ "display": "none" });
        $("#comments_photo_slider").find(".user_comment").show();
    }
    $.when($.ajax(tile_fot())).then(function() {
        massonryShow();
    });
}

// К-во элементов для подгрузки

var dowloadItem;

function itemDownload() {
    if ($(window).width() >= 970) {
        dowloadItem = 3;
    } else if ($(window).width() >= 570 && $(window).width() < 1170) {
        dowloadItem = 2;
    } else {
        dowloadItem = 1;
    }
    $(".more_records a").attr("href", dowloadItem);
}

// Loading img

function loadSlider() {
    $('#container_img_in_slaider').children('img')
        .each(function() {
            if (this.complete) {
                $(this).parent().addClass('load');
            }
        });
}

function loadModal() {
    $('#flex_container_img_modal').children('img')
        .each(function() {
            if (this.complete) {
                $(this).parent().addClass('load');
            }
        });
}
