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

    var section = getUrlParameter('section');
    if (typeof section != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    } else {
        section = $(".nav_ul li:first-child a");
        section_name = section.text().trim();
        console.log(section_name);
        // Active section of menu
        section.addClass("active_nav_ul");
        var ajax_url = 'slider_photo_list';
        var ajax_data = { "section": section_name }
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.slider_photo_list');
                content.html(data);
                //                window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    }

    // Активный раздел меню
    //$(".nav_ul li:first-child a").addClass("active_nav_ul");

    $(".nav_ul li a").click(function(e) {
        if ($(this).hasClass('active_nav_ul')) {
            return;
        }
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        section = $(this);
        section_name = section.text().trim();
        // Active section of menu
        section.addClass("active_nav_ul");
        var ajax_url = 'slider_photo_list';
        var ajax_data = { "section": section_name }
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.slider_photo_list');
                content.html(data);
                //            window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });

    // Выбор альбома 
    $(".list_albums .album_previews").click(function() {
        $(".list_albums .album_previews").removeClass('active_selected_album');
        $(this).addClass('active_selected_album');
        var name_album = $(this).children(".discription_previewws_album").children(".title_album_preview").text();
        $("div.quantity_album").html(name_album);
        return false;
    });

    size_img_slaider();


    // Размер фото 
    function size_img_slaider() {

        var height_container_photo = $('#flex_container_img_slaider').height();
        var width_container_photo = $('#flex_container_img_slaider').width();
        var relationship_w_h_container = (width_container_photo / height_container_photo);

        $('#container_img_in_slaider img').on('load', function() {

            $(this).css({ "width": "inherit", "height": "inherit" });
            var width_height_img = ($(this).width() / $(this).height());
            if (($(this).width() > width_container_photo) && ($(this).height() > height_container_photo) && (relationship_w_h_container > width_height_img)) {
                console.log("w>h")
                $(this).css({ "width": height_container_photo * width_height_img, "height": height_container_photo, "margin": "0 auto" })
                $(this).show();
                return success;
            } else if (($(this).width() > width_container_photo) && ($(this).height() > height_container_photo) && (relationship_w_h_container < width_height_img)) {
                console.log("w<h")
                $(this).css({ "width": width_container_photo, "height": width_container_photo / width_height_img, "margin": "0 auto" })
                $(this).show();
                return success;
            } else if (($(this).width() > width_container_photo) && ($(this).height() < height_container_photo)) {
                $(this).css({ "width": width_container_photo, "height": "auto", "margin": "0 auto" });
                console.log("width >")
                $(this).show();
                return success;
            } else if (($(this).width() < width_container_photo) && ($(this).height() > height_container_photo)) {
                $(this).css({ "height": height_container_photo, "width": "auto", "margin": "0 auto" });
                console.log("height >");
                $(this).show();
                return success;
            } else if (($(this).width() < width_container_photo) && ($(this).height() < height_container_photo)) {
                console.log("width and height <");
                var width_img = $(this).width();
                var height_img = $(this).height();
                $(this).css({ "height": "auto", "width": "auto", "margin": "0 auto" });
                $(this).show();
                return success;
            } else {
                console.log("Пиздец")
            }

        });
    }

    function size_img_modal() {
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
                // alet("Пиздец")
            }
        });
    }

    // Номер фотографии
    var quantity_foto_albums = ($(".list_src_slaider li").length);
    $("#quantity_photo_in_album").html(quantity_foto_albums);

    // Номер фото модальное окно 
    var quantity_foto_modal = ($("#list_src_foto_modal li").length);
    $("#quantity_photo_in_album_modal").html(quantity_foto_modal);

    // Новый слайдер 

    // При переходе в галерею подгружается список ссылок с первой секции и src последней фото добавляется в img 
    var src_first_li_section = $('.list_src_slaider li:first-child').text()
    $('#container_img_in_slaider img').attr("src", src_first_li_section);


    // Преключения между фотками в слайдере

    $('.area_for_right_arrow_slaider').on("click", function() {
        var now_src_slaider = $('#container_img_in_slaider img').attr('src');
        var this_src_in_list = $(".list_src_slaider li").find().text(now_src_slaider);
        var length_li_slaider = $('.list_src_slaider li').length;

        $('.list_src_slaider li').each(function(i) {


            if ($(this).text() == now_src_slaider) {
                // Number foto 
                var index_photo = ($(this).index());
                $("#number_photo").html(index_photo);
                console.log(index_photo)
                if ($(this).index() == (length_li_slaider - 1)) {
                    var first_child_list_src = $(".list_src_slaider li:first-child").text();
                    $('#container_img_in_slaider img').attr("src", first_child_list_src);
                } else {
                    var next_src_slaider = $(this).next().text();
                    $('#container_img_in_slaider img').attr("src", next_src_slaider);
                };
            };
        });
        size_img_slaider();
        return false;
    });

    // end height-width photo


    $('.area_for_left_arrow_slaider').on("click", function() {
        var now_src_slaider = $('#container_img_in_slaider img').attr('src');
        var this_src_in_list = $(".list_src_slaider li").find().text(now_src_slaider);

        $('.list_src_slaider li').each(function(i) {

            if ($(this).text() == now_src_slaider) {
                if ($(this).index() == 0) {
                    var last_child_slaider = $(".list_src_slaider li:last-child").text();
                    $('#container_img_in_slaider img').attr("src", last_child_slaider);
                } else {
                    var next_src_slaider = $(this).prev().text();
                    $('#container_img_in_slaider img').attr("src", next_src_slaider);
                };
            };
        });
        size_img_slaider();

        return false;
    });

    // Принцип формирования списков с src: -"li first-child" - last foto.
    // Конец кода для нового слайдера


    // Слайдер в модальном окне

    var body_width = $('#slaider_modal .modal-dialog').width();


    // При отрытии модального окна
    $('.photo_row img').on("click", function() {

        var link_photo = $(this).attr('src');
        $('.container_photo_in_modal img').attr("src", link_photo);
        // var open_poto = $("#list_src_foto_modal").find("li").text(link_photo);
        var index_photo = $(open_poto).index();
        $("#number_photo_modal").html(index_photo);
        console.log(height_container_photo);
        console.log(width_container_photo);
        size_img_modal();
        return false;

    });
    // Преключения между фотками в модальном окне

    $('.area_for_right_arrow').on("click", function() {

        var this_href = $('.container_photo_in_modal img').attr('src');
        var this_src = $("#list_src_foto_modal li").find().text(this_href);
        var length_li = $('#list_src_foto_modal li').length;

        $('#list_src_foto_modal li').each(function(i) {

            if ($(this).text() == this_href) {

                // Number foto 
                var index_photo = $(this).index();
                $("#number_photo_modal").html(index_photo);

                if ($(this).index() == (length_li - 1)) {
                    var first_child = $("#list_src_foto_modal li:first-child").text();
                    $('.container_photo_in_modal img').attr("src", first_child);
                } else {
                    var next_src = $(this).next().text();
                    $('.container_photo_in_modal img').attr("src", next_src);
                };

            };
        });

        size_img_modal();
        return false;

    });

    $('.area_for_left_arrow').on("click", function() {
        var this_href = $('.container_photo_in_modal img').attr('src');
        var this_src = $("#list_src_foto_modal li").find().text(this_href);

        $('#list_src_foto_modal li').each(function(i) {

            if ($(this).text() == this_href) {
                if ($(this).index() == 0) {
                    var last_child = $("#list_src_foto_modal li:last-child").text();
                    $('.container_photo_in_modal img').attr("src", last_child);
                } else {
                    var next_src = $(this).prev().text();
                    $('.container_photo_in_modal img').attr("src", next_src);
                };
            };
        });

        size_img_modal();
        return false;
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
        $("#comments_photo_slider").slideToggle();

        if ($(".head_comment_slider").hasClass("head_comment_slider_open")) {
            $(".head_comment_slider").removeClass("head_comment_slider_open");
        } else {
            $(".head_comment_slider").addClass("head_comment_slider_open");
        }

    });

    $(".head_comment_slider").on("click", function() {
        $("#comments_photo_slider").slideToggle();
        $(this).delay(1000).removeClass("head_comment_slider_open");
    });

    // Фиксация блока меньшей высоты

    $(window).load(function() {

        var height = $(".colum").height();
        var biggest_col;
        $(".colum").each(function(i) {

            if ($(this).height() < height) {
                height = $(this).height()
            } else {
                biggest_col = $(this);
            };

        });

        var min_height_block;

        $(".colum").each(function(i) {

            if ($(this).height() == height) {
                min_height_block = $(this);
            };

        });

        var width_min_height_block = $(min_height_block).width();
        var height_min_height_block = $(min_height_block).height();
        $(min_height_block).css({ "width": width_min_height_block, "height": height_min_height_block });
        $(min_height_block).children().css({ "width": width_min_height_block });

        var left_col = $(min_height_block).offset().left;

        if (min_height_block.height() + 70 < document.documentElement.clientHeight) {
            $(min_height_block).addClass("fixed_col_top");
            $(min_height_block).css("bottom", (document.documentElement.clientHeight - min_height_block.height() - 70));
            $(min_height_block).css("left", left_col);

            $(window).scroll(function() {
                if ($(this).scrollTop() > ((document.documentElement.clientHeight - (min_height_block.height() + 50)) + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                    $('.fixed_col_top').css('top', 'inherit');
                    $(min_height_block).css("bottom", bottom_scroll);


                } else {
                    $('.fixed_col_top').css('top', '70px');
                    $('.fixed_col_top').css('bottom', 'inherit');
                };
            })

        } else {
            $(window).scroll(function() {
                if ($(this).scrollTop() > (45 + height - document.documentElement.clientHeight + $(".navbar").height()) && $(this).scrollTop() <= (50 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    $(min_height_block).addClass("fixed_col");
                    $(min_height_block).css("left", left_col);
                    $(min_height_block).css("bottom", "25px")

                } else if ($(this).scrollTop() > (45 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                    $(min_height_block).css("bottom", bottom_scroll);
                } else {


                    $(min_height_block).removeClass("fixed_col");
                    $(min_height_block).css({ "left": "0px", "bottom": "0px" });
                }
            });
        }

        // Margin-right for foto in column
        // $(".photo_row:not(:nth-child(3n+3))").css("padding-right", "10px");


    });


    // Конец фиксации


});
