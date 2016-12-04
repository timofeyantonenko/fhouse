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

    // Новый слайдер 


    // Конец кода для нового слайдера

    $(".nav_ul").click(function() {
        $('.img_slaider img').each(function(i) {
            if ($(this).is(":visible")) {
                // $(this).hide();
                // $(this).next().show();
                console.log(this.width());
            };
        });

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

    });


    // Конец фиксации

    $(".img_slaider img:first-child").show();

    $('.img_slaider img').each(function(i) {
        var height_slaider = $(".img_slaider").height();
        var width_slaider = $(".img_slaider").width();
        var relationship_width_height = (width_slaider / height_slaider);
        var width_img = $(this).width();
        var height_img = $(this).height();
        var relationship_foto = (width_img / height_img);
        if (relationship_foto > relationship_width_height) {}

        if ((width_img / height_img) > relationship_width_height) {
            $(this).css({ "width": "100%", "height": "auto" });
        } else if ((width_img / height_img) < relationship_width_height) {
            $(this).css({ "width": "auto", "height": "100%" });
        } else if ((width_img / height_img) == relationship_width_height) {
            $(this).css({ "width": "100%", "height": "100%" });
        };

    });

    if ($('.img_slaider img:first-child').is(":visible")) {
        $(".foto_left").hide();
    } else {
        $(".foto_left").show();
    };

    if ($('.img_slaider img:last-child').is(":visible")) {
        $(".foto_left").hide();
    } else {
        $(".foto_left").show();
    };

    $(document).ajaxComplete(function() {
        $(".img_slaider img:first-child").show();

        $('.img_slaider img').each(function(i) {
            var height_slaider = $(".img_slaider").height();
            var width_slaider = $(".img_slaider").width();
            var relationship_width_height = (width_slaider / height_slaider);
            var width_img = $(this).width();
            var height_img = $(this).height();
            var relationship_foto = (width_img / height_img);

            if ((width_img / height_img) > relationship_width_height) {
                $(this).css({ "width": "100%", "height": "auto" });
            } else if ((width_img / height_img) < relationship_width_height) {
                $(this).css({ "width": "auto", "height": "100%" });
            } else if ((width_img / height_img) == relationship_width_height) {
                $(this).css({ "width": "100%", "height": "100%" });
            };
        });

        if ($('.img_slaider img:first-child').is(":visible")) {
            $(".foto_left").hide();
        } else {
            $(".foto_left").show();
        };

        if ($('.img_slaider img:last-child').is(":visible")) {
            $(".foto_left").hide();
        } else {
            $(".foto_left").show();
        };



    });
});







$(".foto_right").on("click", function() {

// if ($(".img_slaider img").is(":visible")) {
$('.img_slaider img').hide();
// $(this).next().show();
// }
});

});
