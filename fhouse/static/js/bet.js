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

    // Выбор топ матча 
    $(".li_img__top_match").click(function() {
        $(".li_img__top_match").children("figure").hide();
        $(".li_img__top_match").children(".team_nav, .preview_math_nav_background").show();
        $(this).children("figure").show();
        $(this).children(".team_nav, .preview_math_nav_background").hide();
    });

    $(function() {
        $('#type_comment').on('keyup paste', function() {

            var height_area = $("#type_comment").height()
            var $el = $(this),
                offset = $el.innerHeight() - $el.height();
            if ($el.innerHeight < this.scrollHeight) {
                $el.height(this.scrollHeight - offset);
            } else {

                $el.height(1);
                $el.height(this.scrollHeight - offset);
            }

            $(function max_height_all_comments() {
                var height_title_comment = $(".title_comments").height();
                var height_add_com = $(".add_comment_prev").height()
                var height_parent_all_comments = $(".block_comments_for_one_champ").height();
                $(".block_comments_preview").css({
                    "height": (height_parent_all_comments - height_add_com - height_title_comment - 30)
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



    // Превью ко всем топ чемпионатам 
    $(".nav_ul_tour li:first-child div").addClass("active_menu");


    $(".nav_ul_tour li ").click(function() {
        $(".nav_ul_tour li div").removeClass('active_menu');
        $(this).children("div").addClass('active_menu');
    });


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

    // Выбор недели в модальном окне
    function prev_week() {
        var quantity_week = $(".one_week_bet").length;
        var height_week = $(".one_week_bet").height();
        var margin_top = parseInt($("#all_weeks").css('margin-top'));
        if (margin_top == 0) {
            return;
        } else {
            $(this).unbind('click');
            $("#all_weeks").animate({ 'margin-top': '+=' + height_week }, 300, function() {
                $('.next_week_bet').bind('click', prev_week);
            });
        }
    }

    function next_week() {
        var quantity_week = $(".one_week_bet").length;
        var height_week = $(".one_week_bet").height();
        var margin_top = parseInt($("#all_weeks").css('margin-top'));
        if (margin_top < (-(quantity_week - 2) * height_week)) {
            return;
        } else {
            $(this).unbind('click');
            $("#all_weeks").animate({ 'margin-top': '-=' + height_week }, 300, function() {
                $('.prev_week_bet').bind('click', next_week);
            });
        }
    }

    $(".next_week_bet").bind('click', prev_week);

    $(".prev_week_bet").bind('click', next_week);

    // Общий Коэффициент


    var arr = [];
    for (var i = 0; i < $(".one_user_choice").length; i++) {
        var sum = $(".kof_this_match").eq(i).text();
        arr.push(sum++);
    };

    function arraySum(arr) {
        var umno = 1;
        for (var i = 0; i < arr.length; i++) {
            umno *= arr[i];
        }
        $(".total_kof_these_matches").text(umno);
        var text_kof = +$(".total_kof_these_matches").text();
        var text_kof = text_kof.toFixed(2);
        $(".total_kof_these_matches").text(text_kof);

    }
    arraySum(arr);


    // Выбор результата матча
    $(".result_can").on("click", function() {
        $(this).parents(".one_math_can_bet").children().removeClass("active_choice_bet");
        $(this).addClass("active_choice_bet");
        var match = $(this).parents(".one_math_can_bet").find(".teams_can").eq(0).find(".team_can").text() +
            " " + "-" + " " + $(this).parents(".one_math_can_bet").find(".teams_can").eq(1).find(".team_can").text();
        var kof_result = $(this).children(".kof_can").text();
        // var draw_or_win = 
        var team_won = $(this).children(".team_can").text();

        if ($(this).parents(".one_math_can_bet").index() == 0) {
            var choisce_result_thum = $(".one_user_choice").eq(0);
        } else if ($(this).parents(".one_math_can_bet").index() == 1) {
            var choisce_result_thum = $(".one_user_choice").eq(1);
        } else {
            var choisce_result_thum = $(".one_user_choice").eq(2);
        };

        if ($(this).hasClass("teams_can")) {
            choisce_result_thum.fadeIn();
            var win = "Победа";
            choisce_result_thum.find(".win_or_draw").html(win);
            choisce_result_thum.find(".your_choice_team").html(team_won);
            choisce_result_thum.find(".kof_this_match").html(kof_result);
            choisce_result_thum.find(".marth_choice_this").html(match);
        } else {
            choisce_result_thum.fadeIn();
            var draw = "Ничья";
            choisce_result_thum.find(".win_or_draw").html(draw);
            var this_draw = " ";
            choisce_result_thum.find(".your_choice_team").html(this_draw);
            choisce_result_thum.find(".kof_this_match").html(kof_result);
            choisce_result_thum.find(".marth_choice_this").html(match);
        };

        var arr = [];
        for (var i = 0; i < $(".one_user_choice").length; i++) {
            var sum = +$(".kof_this_match").eq(i).text();
            arr.push(sum++);
        };

        console.log(arr)

        function arraySum(arr) {
            var umno = 1;
            for (var i = 0; i < arr.length; i++) {
                umno *= arr[i];
            }
            $(".total_kof_these_matches").text(umno);
            var text_kof = +$(".total_kof_these_matches").text();
            var text_kof = text_kof.toFixed(2);
            $(".total_kof_these_matches").text(text_kof);

        }
        arraySum(arr);
    });

    // Удаление выбранного матча
    $(".delete_this_this_choice i").click(function() {
        console.log("sdadas")
        $(this).parents(".one_user_choice").fadeOut();
        if ($(this).parents(".one_user_choice").index() == 0) {
            var one_result = $(".one_math_can_bet").eq(0);
        } else if ($(this).parents(".one_user_choice").index() == 1) {
            var one_result = $(".one_math_can_bet").eq(1);
        } else {
            var one_result = $(".one_math_can_bet").eq(2);
        };

        one_result.children().removeClass("active_choice_bet");
        var kof_one = 1;
        $(this).parents(".one_user_choice").find(".kof_this_match").html(kof_one);

        var arr = [];
        for (var i = 0; i < $(".one_user_choice").length; i++) {
            var sum = $(".kof_this_match").eq(i).text();
            arr.push(sum++);
        };

        function arraySum(arr) {
            var umno = 1;
            for (var i = 0; i < arr.length; i++) {
                umno *= arr[i];
            }
            $(".total_kof_these_matches").text(umno);
            var text_kof = +$(".total_kof_these_matches").text();
            var text_kof = text_kof.toFixed(2);
            $(".total_kof_these_matches").text(text_kof);

        }
        arraySum(arr);
    });

    // Выбор секции в турнирной таблицы 
    $(".nav_table").each(function(i) {
        $(this).find(".one_division_nav").eq(0).addClass("active_tab_section");
    });

    $(".one_division_nav").on("click", function() {
        $(this).parent().children().removeClass("active_tab_section");
        $(this).addClass("active_tab_section");
    });

    $(window).load(function() {

        // Для картинок в меню топ матчи 

        var width_nav_li = $(".li_img__top_match").width();

        $(".img_top_math img").each(function(i) {
            var img_height = $(this).height();
            var img_width = $(this).width();
            var new_width = (img_width / img_height) * 200;

            var margin_left_li = (width_nav_li - new_width) / 2;
            if ($(this).height() < $(this).parent().height()) {
                $(this).css({ "height": "100%", "width": new_width, "margin-left": margin_left_li })
            } else {
                return;
            }
        });

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


});

// Фиксация блока меньшей высоты
