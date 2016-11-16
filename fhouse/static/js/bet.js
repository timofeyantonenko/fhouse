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

    $(".nav_ul li:first-child a").addClass("active_nav_ul");

    $(".nav_ul li a").click(function(e) {
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
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







});

// Фиксация блока меньшей высоты



$(window).load(function() {



    var height = $(".colum:nth-child(2)").height();
    $(".colum").each(function(i) {

        if ($(this).height() < height) {
            height = $(this).height()
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
            if ($(this).scrollTop() > (height - document.documentElement.clientHeight + $(".navbar").height())) {
                $(min_height_block).addClass("fixed_col");
                $(min_height_block).css("left", left_col);

            } else {
                $(min_height_block).removeClass("fixed_col");
                $(min_height_block).css("left", "0px");
            }
        });

});
