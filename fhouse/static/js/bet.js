$(document).ready(function() {
    $('.img_one_main_match img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });
    $('.img_one_main_match img').each(function(i) {
        if ($(this).css("width") < $(this).parent().css("width")) {
            $(this).css({ "width": "100%", "align-self": "center", "height": "auto", "margin-top": "-15%" });
            $(this).parent().css({ "display": "block", });
        }
    });

    $(".navigation_between_preview .nav_ul li:first-child a").addClass("active_nav_ul");

    $(".navigation_between_preview .nav_ul li a").click(function(e) {
        e.preventDefault();
        $(".navigation_between_preview .nav_ul li a").removeClass('active_nav_ul');
        $(this).addClass('active_nav_ul');
    });

    $(".div_for_championships_all_prognosis").children().css("margin-bottom", "20px");
    $(".one_championship").last().css("margin-bottom", "0px");

    $(".match_stats li:first-child a").addClass("active_stat");

    $(".match_stats li a").click(function(e) {
        e.preventDefault();
        $(".match_stats li a").removeClass('active_stat');
        $(this).addClass('active_stat');
    });

    // Draw, victory or defeat

    $('.last_result tr td:nth-child(3)').each(function(i) {
        if ($(this).hasClass("this_club")) {
            $(this).parent().find("td:nth-child(5) span:nth-child(1)").addClass("this_club_result");
            $(this).parent().find("td:nth-child(5) span:nth-child(2)").addClass("competitor_result");
        } else {
            $(this).parent().find("td:nth-child(5) span:nth-child(2)").addClass("this_club_result");
            $(this).parent().find("td:nth-child(5) span:nth-child(1)").addClass("competitor_result");
        }
    });


    $('.last_result tr td:nth-child(5)').each(function(i) {
        var this_club_result = $(this).children(".this_club_result").text();
        var competitor_result = $(this).children(".competitor_result").text();
        if (Number(this_club_result) > Number(competitor_result)) {
            $(this).parent().find("td:nth-child(6) .victory").show();

        } else if (Number(this_club_result) < Number(competitor_result)) {
            $(this).parent().find("td:nth-child(6) .defeat").show();
        } else {
            $(this).parent().find("td:nth-child(6) .draw").show();
        }
    });

    // Таблица с лучшими прогнозистами 
    $(".table_top_forecasters tbody tr:first-child td").css("border-top", "0px solid #fafafa !important");

    // Превью ко всем топ чемпионатам 
    $(".nav_ul_tour li:first-child div").addClass("active_menu");

    $(".nav_ul_tour li ").click(function(e) {
        e.preventDefault();
        $(".nav_ul_tour li div").removeClass('active_menu');
        $(this).children("div").addClass('active_menu');
    });

    $(".navigation_between_championships .nav_ul li:first-child").addClass("active_champ");

    $(".navigation_between_championships .nav_ul li").click(function(e) {
        e.preventDefault();
        $(".navigation_between_championships .nav_ul li").removeClass('active_champ');
        $(this).addClass('active_champ');
    });

    // 1) Всплывают при наведении курсора:
    $('.navigation_between_championships li').tooltip({
        trigger: "hover",
        selector: "a[data-toggle=tooltip]"
    });
    // 1) Всплывают при получении фокуса:     
    $('.navigation_between_championships li').tooltip({
        trigger: "focus",
        selector: "a[data-toggle=tooltip]"
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

});
