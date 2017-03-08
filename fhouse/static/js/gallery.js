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

    // Показать альбомы
    $("#mobileAlnbumShow").on("click", function() {
        $("#comments_photo_slider").hide();
        $(".head_comment_slider").hide();
        $("#albums_right").show();
    });
    // Скрыть альбомы
    $(".arrow-right").on("click", function() {
        $("#albums_right").hide();
    });

    var dowloadItem;
    itemDownload();

    $(window).resize(function() {
        itemDownload();
        resizeWindowModal();
        resizeWindowSlider();
        if ($(window).width() >= 970) {
            $("#albums_right").show();
        }
    });

    section = $(".nav_ul li:first-child a");
    section_name = section.text().trim();
    console.log(section_name);
    // Active section of menu
    section.addClass("active_nav_ul");
    load_section_info(section_name, undefined);

    // Активный раздел меню
    //$(".nav_ul li:first-child a").addClass("active_nav_ul");

    $(".nav_ul li a").click(function(e) {
        $(".photo_row").remove();
        $('.container_photo_in_modal img').hide();
        $("#beforeLoadModal").show();
        if ($(this).hasClass('active_nav_ul')) {
            return;
        }
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        section = $(this);
        section_name = section.text().trim();
        // Active section of menu
        section.addClass("active_nav_ul");
        load_section_info(section_name, undefined);

        // $('#list').masonry({ itemSelector: '.item' });
        $(".flex_container_albums img").on("load", function() {
            console.log("privet moy svet")
        });
        $.when($.ajax(size_img_slider())).then(function() {
            loadedModal();
        });
    });

    $.when($.ajax(size_img_slaider())).then(function() {
        loaded();
    });

    // After resize window img size_img_slaider
    function resizeWindowModal() {
        var height_container_photo = $('#flex_container_img_modal').height();
        var width_container_photo = $('#flex_container_img_modal').width();
        var relationship_w_h_container = (width_container_photo / height_container_photo);

        var thisElement = $(".container_photo_in_modal img");

        $(thisElement).css({ "width": "inherit", "height": "inherit" });
        if (($(thisElement).width() > width_container_photo) && ($(thisElement).height() > height_container_photo)) {
            var width_height_img = ($(thisElement).width() / $(thisElement).height());
            if (relationship_w_h_container > width_height_img) {
                // alert("w>h")                  
                $(thisElement).css({ "width": height_container_photo * width_height_img, "height": height_container_photo })
            } else if (relationship_w_h_container < width_height_img) {
                // alert("w<h")

                $(thisElement).css({ "width": width_container_photo, "height": width_container_photo / width_height_img })
            };
            // alert("width and height >")
        } else if (($(thisElement).width() > width_container_photo) && ($(thisElement).height() < height_container_photo)) {
            $(thisElement).css({ "width": width_container_photo, "height": "auto" });
            // alert("width >")
        } else if (($(thisElement).width() < width_container_photo) && ($(thisElement).height() > height_container_photo)) {
            $(thisElement).css({ "height": height_container_photo, "width": "auto", "margin": "0 auto" });
            // alert("height >");
        } else if (($(thisElement).width() < width_container_photo) && ($(thisElement).height() < height_container_photo)) {
            // alert("width and height <");
            var width_img = $(thisElement).width();
            var height_img = $(thisElement).height();
            $(thisElement).css({ "height": "auto", "width": "auto" });
        } else {
            // alert("Пиздец")
        }

    }

    function resizeWindowSlider() {
        var height_container_photo = $('#flex_container_img_slaider').height();
        var width_container_photo = $('#flex_container_img_slaider').width();
        var relationship_w_h_container = (width_container_photo / height_container_photo);

        var thisElement = $("#container_img_in_slaider img");

        $(thisElement).css({ "width": "inherit", "height": "inherit" });
        var width_height_img = ($(thisElement).width() / $(thisElement).height());
        if (($(thisElement).width() > width_container_photo) && ($(thisElement).height() > height_container_photo) && (relationship_w_h_container > width_height_img)) {
            //                console.log("w>h")
            $(thisElement).css({ "width": height_container_photo * width_height_img, "height": height_container_photo, "margin": "0 auto" })
            $(thisElement).show();
            return true;
        } else if (($(thisElement).width() > width_container_photo) && ($(thisElement).height() > height_container_photo) && (relationship_w_h_container < width_height_img)) {
            //                console.log("w<h")
            $(thisElement).css({ "width": width_container_photo, "height": width_container_photo / width_height_img, "margin": "0 auto" })
            $(thisElement).show();
            return true;
        } else if (($(thisElement).width() > width_container_photo) && ($(thisElement).height() < height_container_photo)) {
            $(thisElement).css({ "width": width_container_photo, "height": "auto", "margin": "0 auto" });
            //                console.log("width >")
            $(thisElement).show();
            return true;
        } else if (($(thisElement).width() < width_container_photo) && ($(thisElement).height() > height_container_photo)) {
            $(thisElement).css({ "height": height_container_photo, "width": "auto", "margin": "0 auto" });
            //                console.log("height >");
            $(thisElement).show();
            return true;
        } else if (($(thisElement).width() < width_container_photo) && ($(thisElement).height() < height_container_photo)) {
            //                console.log("width and height <");
            var width_img = $(thisElement).width();
            var height_img = $(thisElement).height();
            $(thisElement).css({ "height": "auto", "width": "auto", "margin": "0 auto" });
            $(thisElement).show();
            return true;
        } else {
            console.log("Пиздец")
        }
    }

    function loaded() {
        $("#beforeSliderLoading").hide();
        $('#container_img_in_slaider img').show();
    };


    // Размер фото 
    function size_img_slaider() {

        $('#container_img_in_slaider img').hide();
        $("#beforeSliderLoading").show();

        var height_container_photo = $('#flex_container_img_slaider').height();
        var width_container_photo = $('#flex_container_img_slaider').width();
        var relationship_w_h_container = (width_container_photo / height_container_photo);

        $('#container_img_in_slaider img').on('load', function() {

            $(this).css({ "width": "", "height": "" });
            var width_height_img = ($(this).width() / $(this).height());
            if (($(this).width() > width_container_photo) && ($(this).height() > height_container_photo) && (relationship_w_h_container > width_height_img)) {
                //                console.log("w>h")
                $(this).css({ "width": height_container_photo * width_height_img, "height": height_container_photo, "margin": "0 auto" })
                return true;
            } else if (($(this).width() > width_container_photo) && ($(this).height() > height_container_photo) && (relationship_w_h_container < width_height_img)) {
                //                console.log("w<h")
                $(this).css({ "width": width_container_photo, "height": width_container_photo / width_height_img, "margin": "0 auto" })
                return true;
            } else if (($(this).width() > width_container_photo) && ($(this).height() < height_container_photo)) {
                $(this).css({ "width": width_container_photo, "height": "auto", "margin": "0 auto" });
                //                console.log("width >")
                return true;
            } else if (($(this).width() < width_container_photo) && ($(this).height() > height_container_photo)) {
                $(this).css({ "height": height_container_photo, "width": "auto", "margin": "0 auto" });
                //                console.log("height >");
                return true;
            } else if (($(this).width() < width_container_photo) && ($(this).height() < height_container_photo)) {
                //                console.log("width and height <");
                var width_img = $(this).width();
                var height_img = $(this).height();
                $(this).css({ "height": "auto", "width": "auto", "margin": "0 auto" });
                return true;
            } else {
                console.log("Пиздец")
            }
        });
    }

    function loadedModal() {
        $("#beforeLoadModal").hide();
        $('.container_photo_in_modal img').show();
    }

    function size_img_modal() {
        $('.container_photo_in_modal img').hide();
        $("#beforeLoadModal").show();
        var height_container_photo = $('#flex_container_img_modal').height();
        var width_container_photo = $('#flex_container_img_modal').width();
        var relationship_w_h_container = (width_container_photo / height_container_photo);

        $('.container_photo_in_modal img').on('load', function() {
            $(this).css({ "width": "inherit", "height": "inherit" });
            if (($(this).width() > width_container_photo) && ($(this).height() > height_container_photo)) {
                var width_height_img = ($(this).width() / $(this).height());
                if (relationship_w_h_container > width_height_img) {
                    // alert("w>h")                  
                    $(this).css({ "width": height_container_photo * width_height_img, "height": height_container_photo })
                } else if (relationship_w_h_container < width_height_img) {
                    // alert("w<h")

                    $(this).css({ "width": width_container_photo, "height": width_container_photo / width_height_img })
                };
                // alert("width and height >")
            } else if (($(this).width() > width_container_photo) && ($(this).height() < height_container_photo)) {
                $(this).css({ "width": width_container_photo, "height": "auto" });
                // alert("width >")
            } else if (($(this).width() < width_container_photo) && ($(this).height() > height_container_photo)) {
                $(this).css({ "height": height_container_photo, "width": "auto", "margin": "0 auto" });
                // alert("height >");
            } else if (($(this).width() < width_container_photo) && ($(this).height() < height_container_photo)) {
                // alert("width and height <");
                var width_img = $(this).width();
                var height_img = $(this).height();
                $(this).css({ "height": "auto", "width": "auto" });
            } else {
                // alert("Пиздец")
            }
        });
    }

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
        var new_src = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_url").text()
        var new_count_comments = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".count_of_comments").text()
        var new_album_title = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_album_title").text()
        var new_posit_like = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list .list_src_slaider li").eq(index_photo_slaider).children(".photo_negative_likes").text()
        $("#slaider_and_albums").find('#container_img_in_slaider img').attr("src", new_src);
        $("#slaider_and_albums").find('.block_like div.votes').text(new_posit_like);
        $("#slaider_and_albums").find('.block_dislike div.votes').text(new_negat_like);
        $("#slaider_and_albums").find('.button_show_comments').text("Комметарии " + new_count_comments);
        $("#slaider_and_albums").find('.album_slaider').text(new_album_title);
        $.when($.ajax(size_img_slaider())).then(function() {
            loaded();
        });
        return false;
    });

    // При отрытии модального окна
    // Слайдер в модальном окне
    // $('.relative_container').on('click', function(evt) {

    // });

    var index_photo_modal = 0;
    var body_width = $('#slaider_modal .modal-dialog').width();



    $('.flex_container_albums').delegate('.photo_row', 'click', function(evt) {

        $.when($.ajax(size_img_modal())).then(function() {
            loadedModal();
        });
        index_photo_modal = $(this).index() - 1;
        make_modal_slider();

        $('#slaider_modal').on('shown.bs.modal', function() {
            $.when($.ajax(size_img_modal())).then(function() {
                loadedModal();
            });
        })
    });

    // Преключения между фотками в модальном окне

    $(".modal_slider_click").on("click", function(evt) {
        var click_element_id = event.target.id;
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
        make_modal_slider();
        $.when($.ajax(size_img_modal())).then(function() {
            loadedModal();
        });
        return false;
    });

    $('html').keydown(function(eventObject) {
        if ($('#slaider_modal').hasClass('in')) {
            var click_element_id = event.target.id;
            var quantity_foto_li = $(".url_list .list_src_slaider li").length;
            var id_left = "modal_left";
            var id_right = "modal_right";
            var id_icon_left = "modal_left_icon";
            var id_icon_right = "modal_right_icon";
            if (event.keyCode == 37) {
                index_photo_modal--;
                if (index_photo_modal == -1) {
                    index_photo_modal = (quantity_foto_li - 1);
                }
            } else if (event.keyCode == 39) {
                index_photo_modal++;
                if (index_photo_modal == quantity_foto_li) {
                    index_photo_modal = 0;
                }
            }
            make_modal_slider();
            $.when($.ajax(size_img_modal())).then(function() {
                loadedModal();
            });
        }
    });

    function make_modal_slider() {
        var new_src = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_url").text()
        var new_count_comments = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".count_of_comments").text()
        var new_album_title = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_album_title").text()
        var new_posit_like = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_positive_likes").text()
        var new_negat_like = $(".url_list .list_src_slaider li").eq(index_photo_modal).children(".photo_negative_likes").text()
        $("#slaider_modal").find('.container_photo_in_modal img').attr("src", new_src);
        $("#slaider_modal").find('.block_like div.votes').text(new_posit_like);
        $("#slaider_modal").find('.block_dislike div.votes').text(new_negat_like);
        $("#slaider_modal").find('.button_show_comments').text("Комметарии " + new_count_comments);
        $("#slaider_modal").find('.album_slaider').text(new_album_title);
    }

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
    var long_id = $(this).attr("id");
    //    var name_album = $(this).find(".title_album_preview").text();
    values = long_id.split("album_id_");
    short_id = values[1];
    $(".list_albums .album_previews").removeClass('active_selected_album');
    $(this).addClass('active_selected_album');
    var name_album = $(this).children(".discription_previewws_album").children(".title_album_preview").text();
    $('.album_slaider').html(name_album);
    load_album_photos(short_id, 1); // load first part of album photos
    if ($(window).width() <= 969) {
        $("#albums_right").slideUp();
    } 
    $(".more_photo").attr("href", 2);
    return false;

});

$(document).on("click", ".more_photo", function(e) {
    page = $(this).attr("href");
    section_name = $(".active_nav_ul");
    console.log(section_name);
    section_name = section_name.text().trim();
//    album_name = find(".active_selected_album");
    album = $(".active_selected_album");

    if (album.length) {
        album_id = album.attr("id");
        values = album_id.split("album_id_");
        short_id = values[1];
    }
    else {
        short_id = "all";
    }
    console.log($(".list_src_slaider").find("li").length)
    morePhoto();
    load_tile_photos(section_name, short_id, page);
    
});

$(window).load(function() {

    $('#list').masonry({ itemSelector: '.item' });
});

function load_tile_photos(section_name, album_id, page){
    var ajax_url = 'album_photo_list';
    var ajax_data = { "section": section_name, "page": page }
    if (album_id != "all"){
        ajax_data["album_id"] = album_id;
    }
    console.log(ajax_data);
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
        },
        error: function(xhr, status, error) {
            $(".more_photo").html("Конец фотограий");
            // console.log(error, status, xhr);
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
            var albums_container = $('.list_albums');
            insert_data = ""
            $.each(json_request_albums, function(idx, obj) {
                insert_data += "<div class=\"album_previews\" id=\"album_id_" + obj.id + "\">" +
                    "<div class=\"album_previews_img\">" +
                    "<img src=\"" + obj.image + "\" alt=\"\" class='imgAlbumCover'> </div>" +
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
            // Обложка альбома
            $(".imgAlbumCover").each(function() {
                var $imgCover = $(this);
                var $parentIMg = $(this).parent();
                $(this).on("load", function() {
                    var parent_width = $parentIMg.width();
                    var parent_height = $parentIMg.height();
                    var this_width = $imgCover.width();
                    var this_height = $imgCover.height();
                    var kofRel_w_h = parent_height / this_height;
                    if (this_height < parent_height) {
                        $imgCover.css({ "height": parent_height, "width": (parent_width * kofRel_w_h) });
                    } else {
                        console.log($parentImgAlbumCover)
                    }
                });
            })
            $(".more_photo").attr("href", 2);
        },
        error: function(xhr, status, error) {
        alert("ERROR");
            $(".more_photo").html("Конец фотограий");
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

var firstFoto = 0;
var lastFoto = 9;

function morePhoto() {
    $(".more_photo").html("Загрузка...")
    var lengthLi = $(".list_src_slaider").find("li").length;
    firstFoto += 9;
    lastFoto += 9;
    if (lengthLi <= lastFoto) {
        lastFoto = lengthLi;

    } else {
        for (var lim = firstFoto; lim < lastFoto; lim++) {
            var order = lim;
            var url_img = $(".list_src_slaider").find("li").eq(order).find(".photo_url").text();
            var piece_html = '<div class="photo_row item"><img  src="' + url_img + '"alt="" class="imgTile" data-toggle="modal" data-target="#slaider_modal"></div>';
            $('.flex_container_albums').append(piece_html);
        };
        $(".flex_container_albums").find(".imgTile").on("load", function() {
            $("#list").masonry('reloadItems');
            $("#list").masonry('layout');
        });
    }
    $(".more_photo").html("ПОСМОТРЕТЬ БОЛЬШЕ")
}


function tile_fot() {
    ul_list_length = $(".list_src_slaider").find("li").length;
    lastFoto = ul_list_length;
    firstFoto = lastFoto - 9;
    if (firstFoto <= 0) {
        firstFoto = 0;
    }
    // $(".photo_row").css({ "display": "none" });
    // $(".photo_row").remove();
    for (var lim = firstFoto; lim < lastFoto; lim++) {
        var order = lim;
        var url_img = $(".list_src_slaider").find("li").eq(order).find(".photo_url").text();
        var piece_html = '<div class="photo_row item"><img src="' + url_img + '"alt="" class="imgTile" data-toggle="modal" data-target="#slaider_modal"></div>';
        $('.flex_container_albums').append(piece_html);
    };
    $(".flex_container_albums").find(".imgTile").on("load", function() {
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
    //    alert($('.list_src_slaider li:first-child span.count_of_comments').text());
    var photo_image_url = $('.list_src_slaider li:first-child span.photo_url').text();
    var count_of_comments = $('.list_src_slaider li:first-child span.count_of_comments').text();
    var count_of_pos_likes = $('.list_src_slaider li:first-child span.photo_positive_likes').text();
    var count_of_neg_likes = $('.list_src_slaider li:first-child span.photo_negative_likes').text();
    var photo_album_title = $('.list_src_slaider li:first-child span.photo_album_title').text();

    //    var src_first_li_section = $('.list_src_slaider li:first-child span.photo_url').text()

    $("#slaider_and_albums").find('#container_img_in_slaider img').attr("src", photo_image_url);
    $("#slaider_and_albums").find('.block_like div.votes').text(count_of_pos_likes);
    $("#slaider_and_albums").find('.block_dislike div.votes').text(count_of_neg_likes);
    $("#slaider_and_albums").find('.button_show_comments').text("Комметарии " + count_of_comments);
    $("#slaider_and_albums").find('.album_slaider').text(photo_album_title);
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
