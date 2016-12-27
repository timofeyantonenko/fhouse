$(document).ready(function() {

    $(function max_height_block_comment() {
        var height_block_preview = $(".preview_one_championship").height();
        $(".block_comments_for_one_champ").css({ "height": height_block_preview });
    });

    $(function max_height_all_comments() {
        var height_title_comment = $(".title_comments").height();
        var height_add_com = $(".add_comment_prev").height()
        var height_parent_all_comments = $(".block_comments_for_one_champ").height();
        $(".block_comments_preview").css({
            "height": (height_parent_all_comments - height_add_com - height_title_comment - 20)
        })
    });

    $(function() {
        $('#type_comment').on('keyup paste', function() {

            var height_area = $("#type_comment").height()
            var $el = $(this),
                offset = $el.innerHeight() - $el.height();
            if ($el.innerHeight < this.scrollHeight) {
                $el.height(this.scrollHeight - offset);
            } else {
                console.log($(this).height());
                $el.height(1);
                $el.height(this.scrollHeight - offset);
            }

            $(function max_height_all_comments() {
                var height_title_comment = $(".title_comments").height();
                var height_add_com = $(".add_comment_prev").height()
                var height_parent_all_comments = $(".block_comments_for_one_champ").height();
                $(".block_comments_preview").css({
                    "height": (height_parent_all_comments - height_add_com - height_title_comment - 20)
                })
            });

        });
    });


    // Background position for img column right
    for (var i = 0; i < $(".bets_one_championship").length; i++) {
        $(".bets_one_championship").eq(i).css({
            "background-position-y": (-60 * i)
        });
    };

    // Background position nav all bets
    for (var i = 0; i < $(".change_champ").length; i++) {
        $(".change_champ").eq(i).css({
            "background-position-x": ((-83 * i) - 25)
        });
    };

    // Active champ in nav all bets
    $("#all_bets_nav .change_champ").eq(0).addClass("active_champ");

    $(".change_champ").on("click", function() {
        $(".change_champ").removeClass("active_champ");
        $(this).addClass("active_champ");
    });



    $(".navigation_between_preview .nav_ul li:first-child a").addClass("active_nav_ul");

    $(".navigation_between_preview .nav_ul li a").click(function(e) {
        e.preventDefault();
        $(".navigation_between_preview .nav_ul li a").removeClass('active_nav_ul');
        $(this).addClass('active_nav_ul');
    });

    $(".match_stats li:first-child a").addClass("active_stat");

    $(".match_stats li a").click(function(e) {
        e.preventDefault();
        $(".match_stats li a").removeClass('active_stat');
        $(this).addClass('active_stat');
    });

    // Навигация между топ-прогнозистами
    $(".table_nav_forecasters .tab ul li:first-child").addClass("tab_active");

    $(".table_nav_forecasters .tab ul li").click(function(e) {
        e.preventDefault();
        $(".table_nav_forecasters .tab ul li").removeClass('tab_active');
        $(this).addClass('tab_active');
    });

    // Навигация по прогнозам
    $(".table_nav_prognossis .tab ul li:first-child").addClass("tab_active");

    $(".table_nav_prognossis .tab ul li").click(function(e) {
        e.preventDefault();
        $(".table_nav_prognossis .tab ul li").removeClass('tab_active');
        $(this).addClass('tab_active');
    });

    // Выбор результата 

    $(".choose_result > div").click(function(e) {
        e.preventDefault();
        $(this).parent().find("div").removeClass('choose_result_active');
        $(this).addClass('choose_result_active');
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


    $(".nav_ul_tour li ").click(function() {
        $(".nav_ul_tour li div").removeClass('active_menu');
        $(this).children("div").addClass('active_menu');
    });

    // alert(parseInt($(".nav_ul_tour li ").css('margin-left')) * 10)

    // Стрелки для просмотра туров которые не поместились в основной блок

    function left_tour() {
        var width_li_tour = $(".nav_ul_tour li").width();
        var margin_left_ul = parseInt($(".nav_ul_tour").css('margin-left'));

        if (margin_left_ul < 0) {
            $(this).unbind('click');
            $(".nav_ul_tour").animate({ 'margin-left': '+=' + width_li_tour }, 300, function() {
                $('#arrow_left_tour').bind('click', left_tour);
            });
        } else {
            return;
        };
    }

    function right_tour() {
        var width_li_tour = $(".nav_ul_tour li").width();
        var li_lenght = $(".nav_ul_tour li").length;
        var margin_left_ul = parseInt($(".nav_ul_tour").css('margin-left'));
        var width_ul = $(".nav_ul_tour").width();
        if ((li_lenght * width_li_tour) <= width_ul) {
            return;
        } else {
            var max_click_right = ((li_lenght * width_li_tour) - width_ul - width_li_tour);
            if ((margin_left_ul - max_click_right) == 0) {
                return;
            } else {
                $(this).unbind('click');
                $(".nav_ul_tour").animate({ 'margin-left': '-=' + width_li_tour }, 300, function() {
                    $('#arrow_right_tour').bind('click', right_tour);
                });
            }
        }
        return;
    }

    $("#arrow_left_tour").bind('click', left_tour);

    $("#arrow_right_tour").bind('click', right_tour);

    // Выбор секции в турнирной таблицы 
    $(".one_division_nav:first-child").addClass("active_tab_section");

    $(".one_division_nav").on("click", function() {
        $(".one_division_nav").removeClass("active_tab_section");
        $(this).addClass("active_tab_section");
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
