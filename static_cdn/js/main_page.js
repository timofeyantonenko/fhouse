$(document).ready(function() {
    $('.one_news_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });

    $('one_news_img img').each(function(i) {
        if ($(this).css("width") < $(this).parent().css("width")) {
            $(this).css({ "width": "100%", "align-self": "center" });
            $(this).parent().css({ "display": "block", });
        }
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

    $(min_height_block).css("width", width_min_height_block);

    var left_col = $(min_height_block).offset().left;



    if (min_height_block.height() + 70 < document.documentElement.clientHeight) {
        $(min_height_block).addClass("fixed_col_top");
        $(min_height_block).css("bottom", (document.documentElement.clientHeight - min_height_block.height() - 70));
        $(min_height_block).css("left", left_col);

        $(window).scroll(function() {
            if ($(this).scrollTop() > (( document.documentElement.clientHeight - (min_height_block.height() + 50)) + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
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
