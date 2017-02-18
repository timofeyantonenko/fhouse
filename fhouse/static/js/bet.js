$(document).ready(function() {

//    $(".make_bet").on("click", function(){
//    $('#week_bets_top').modal('show');
//        show_modal('#week_bets_top');
//    });

    // Выбор топ матча
    $(".read_prev").eq(0).hide();
    $(".line_hover_active").eq(0).css({ "opacity": "1" });
    $(".top_match").eq(0).show();
    $(".read_prev").on("click", function() {
        var index_read = $(this).parent().index();
        console.log(index_read)
        $(".line_hover_active").css({ "opacity": "0" })
        $(this).parent().find(".line_hover_active").css({ "opacity": "1" })
        $(".read_prev").show();
        $(this).fadeOut();
        
        $(".top_match").hide();
        $(".top_match").eq(index_read).show();
    });

    // Выбор тура
    // В переменную "load_tour" при переходе с "bet_main.html" попадает индекс выбранного чемпионата
    var load_champ = 6;
    //
    var length_li_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li").length;
    var index_current_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li.current_tour").index();

    function chose_tour() {
        for (var i = 0; i < length_li_tour; i++) {
            var load_tour = (length_li_tour - i - 1);
            var nuber_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li").eq(load_tour).text();
            var content_tour_active = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu active_menu"></div></li>';
            var content_tour = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu"></div></li>';
            if ((length_li_tour - i - 1) == index_current_tour) {
                $('#tour_other').prepend(content_tour_active);
            } else {
                $('#tour_other').prepend(content_tour);
            }
        };
        if (index_current_tour < 7) {
            $(".nav_ul_tour").css({ "margin-left": "0" })
        } else {
            var width_li_nav = $("#tour_other").find("li").eq(0).width();
            var new_margin = (-(index_current_tour - 7) * width_li_nav);
            $(".nav_ul_tour").css({ "margin-left": new_margin })
        }
    }
    chose_tour();

    // Выбор лиги
    $("#all_bets_nav .change_champ").eq(load_champ).addClass("active_champ");
    $(".championat").eq(load_champ).children(".tours").eq(index_current_tour).show();
    $(".championat").eq(load_champ).eq(0).show();
    var name_championship = $(".championat").eq(load_champ).find(".title_hide").text();
    $(".champ").html(name_championship);
    $("#all_bets_nav").children(".change_champ").on("click", function() {
        $(".championat").children(".tours").hide();
        $(".change_champ").removeClass("active_champ");
        $(this).addClass("active_champ");
        var index_menu_li = $(this).index();
        load_champ = $(this).index();
        var index_current_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li.current_tour").index();
        $(".championat").eq(index_menu_li).children(".tours").eq(index_current_tour).show();
        var name_championship = $(".championat").eq(index_menu_li).find(".title_hide").text();
        $(".champ").html(name_championship);
        // Подгрузка туров
        $("#tour_other").empty();

        length_li_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li").length;
        for (var i = 0; i < length_li_tour; i++) {
            var nuber_tour = $("#id_list_tour").children("ul").eq(load_champ).children("li").eq(length_li_tour - i - 1).text();
            var content_tour_active = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu active_menu"></div></li>';
            var content_tour = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu"></div></li>';
            if ((length_li_tour - i - 1) == index_current_tour) {
                $('#tour_other').prepend(content_tour_active);
            } else {
                $('#tour_other').prepend(content_tour);
            }
        };
        if (index_current_tour < 7) {
            $(".nav_ul_tour").css({ "margin-left": "0" })
        } else {
            var width_li_nav = $("#tour_other").find("li").eq(0).width();
            var new_margin = (-(index_current_tour - 7) * width_li_nav);
            $(".nav_ul_tour").css({ "margin-left": new_margin })
        }
    });

    // Выбор тура

    $('#tour_other').delegate('li', 'click', function() {
        $(".nav_ul_tour li div").removeClass('active_menu');
        $(this).children("div").addClass('active_menu');
        $(".championat").children(".tours").hide();
        var inde_menu_tour = $(this).index();
        $(".championat").eq(load_champ).children(".tours").eq(inde_menu_tour).show();
    });

    // Таблицы
    $(".time_rating").eq(0).show()
    $(".nav_table").children(".one_division_nav").eq(0).addClass("active_tab_section");

    // Выбор временного интервала в рейтинге прогнозистов
    $("#table_rat_forcas").find(".one_division_nav").on("click", function() {
        $(this).parent().children().removeClass("active_tab_section");
        $(this).addClass("active_tab_section");
        $("#table_rat_forcas").find(".time_rating").hide();
        var inde_nav_time = $(this).index();
        $("#table_rat_forcas").find(".time_rating").eq(inde_nav_time).show();

    });

    // Турнирные таблицы 
    // Выбор турниров (между чемпионатами, сборными, еврокубками)

    $(".select_table").eq(0).show();
    $(".section_tournament").eq(0).children("span").eq(0).show();

    $("#table_other_champs").find(".one_division_nav").on("click", function() {
        $(this).parent().children().removeClass("active_tab_section");
        $(this).addClass("active_tab_section");
        $(".select_table").each(function(i) {
            $(this).hide();
        });
        var inde_nav_time = $(this).index();
        $(".select_table").eq(inde_nav_time).show();

        if (inde_nav_time == 0) {
            $(".section_tournament").eq(1).children(".type_euro_champ").children("span").hide();
            $(".section_tournament").eq(2).children(".continent_sel").children("span").hide();
            $(".section_tournament").eq(inde_nav_time).children("span").eq(0).show();
        } else if (inde_nav_time == 1) {
            $(".section_tournament").eq(2).children(".continent_sel").children("span").hide();
            $(".section_tournament").eq(0).children("span").hide();
            $(".section_tournament").eq(inde_nav_time).children(".type_euro_champ").eq(0).children("span").eq(0).show();
            $("#select_group_LC").show();
            $("#select_group_LE").hide();
        } else if (inde_nav_time == 2) {
            $(".section_tournament").eq(0).children("span").hide();
            $(".section_tournament").eq(1).children(".type_euro_champ").children("span").hide();
            $(".section_tournament").eq(inde_nav_time).children(".continent_sel").eq(0).children("span").eq(0).show();
            $("#select_group_CM").show();
        };
        $("#select_group_CM").prop('selectedIndex', 0);
        $("#select_continent").prop('selectedIndex', 0);
        $("#select_nation_tournament").prop('selectedIndex', 0);
        $("#select_group_LE").prop('selectedIndex', 0);
        $("#select_group_LC").prop('selectedIndex', 0);
        $("#select_championship").prop('selectedIndex', 0);
        $("#select_championship_euro").prop('selectedIndex', 0);
    });

    // Изменения в селектах
    // Выбор страны чемпионата
    $('#select_championship').change(function() {
        $(".section_tournament").eq(0).children("span").hide();
        var val_select = parseInt($(this).val());
        $(".section_tournament").eq(0).children("span").eq(val_select).show();
    });

    // Выбор еврокубкам
    $("#select_group_LE").hide();
    $('#select_championship_euro').change(function() {
        var val_select = parseInt($(this).val());
        if ($(this).val() == '0') {
            $("#select_group_LE").hide();
            $("#select_group_LC").show();
            $(".section_tournament").eq(1).children(".type_euro_champ").eq(1).children("span").hide();
            $(".section_tournament").eq(1).children(".type_euro_champ").eq(0).children("span").eq(0).show();

        } else if ($(this).val() == '1') {
            $("#select_group_LE").show();
            $("#select_group_LC").hide();
            $(".section_tournament").eq(1).children(".type_euro_champ").eq(0).children("span").hide();
            $(".section_tournament").eq(1).children(".type_euro_champ").eq(1).children("span").eq(0).show();
        }
    });

    // Выбор группы в лиге чемпионов
    $('#select_group_LC').change(function() {
        $(".section_tournament").eq(1).children(".type_euro_champ").eq(0).children("span").hide();
        var val_select = parseInt($(this).val())
        $(".section_tournament").eq(1).children(".type_euro_champ").eq(0).children("span").eq(val_select).show();
    });

    // Выбор группы в лиге европы
    $('#select_group_LE').change(function() {
        $(".section_tournament").eq(1).children(".type_euro_champ").eq(1).children("span").hide();
        var val_select = parseInt($(this).val());
        $(".section_tournament").eq(1).children(".type_euro_champ").eq(1).children("span").eq(val_select).show();
    });

    // Выбор континента отбор ЧМ
    $('#select_continent').change(function() {
        var val_select = parseInt($(this).val())
        if ($(this).val() == '0') {
            $("#select_group_CM").show();
            $(".section_tournament").eq(2).children(".continent_sel").eq(1).children("span").hide();
            $(".section_tournament").eq(2).children(".continent_sel").eq(0).children("span").eq(0).show();
        } else if ($(this).val() == '1') {
            $("#select_group_CM").hide();
            $(".section_tournament").eq(2).children(".continent_sel").eq(0).children("span").hide();
            $(".section_tournament").eq(2).children(".continent_sel").eq(1).children("span").show();
        }
    });

    // Выбор группы ЧМ Европа
    $('#select_group_CM').change(function() {
        $(".section_tournament").eq(2).children(".continent_sel").eq(0).children("span").hide();
        var val_select = parseInt($(this).val());
        $(".section_tournament").eq(2).children(".continent_sel").eq(0).children("span").eq(val_select).show();
    });

    // $(function max_height_block_comment() {
    //     var height_block_preview = $(".preview_one_championship").height();
    //     $(".block_comments_for_one_champ").css({ "height": height_block_preview });
    // });

    // $(function max_height_all_comments() {
    //     var height_title_comment = $(".title_comments").height();
    //     var height_add_com = $(".add_comment_prev").height()
    //     var height_parent_all_comments = $(".block_comments_for_one_champ").height();
    //     $(".block_comments_preview").css({
    //         "height": (height_parent_all_comments - height_add_com - height_title_comment - 20)
    //     })
    // });

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

    // Показать достижения пользователя

    $("#open_user_results").on("click", function() {
        $(".drop_down_users_results").slideToggle("slow");
    });

    // Выбор медали в достижениях юзера

    $(".place_result").each(function(i) {
        var place_user = $(this).find("span").text();
        if (place_user == "1") {
            $(this).addClass("gold_vedal");
        } else if (place_user == "2") {
            $(this).addClass("sliver_medal");
        } else if (place_user == "3") {
            $(this).addClass("bronze_medal");
        } else {
            console.log("pizdos")
        }
    })

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
    $(".body_user_choice").children(".history_bet").eq(0).show();
    $(".body_user_choice").children(".history_bet").eq(0).children(".your_result_after").hide();
    var length_history_bet = $(".body_user_choice").children(".history_bet").length;
    for (var i = 1; i < length_history_bet; i++) {
        $(".body_user_choice").children(".history_bet").eq(i).find(".total_kof").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".delete_this_this_choice").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".success_bet").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".not_results").hide();
    }




    $(".next_week_bet").bind('click', prev_week);

    $(".prev_week_bet").bind('click', next_week);

    arraySum(arr);



});

$(window).load(function() {

    $(".make_bet").on("click", function(){
            show_modal('#week_bets_top');
        });

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

// Фиксация блока меньшей высоты

var first_open = true;

function show_modal(modal_id){
if (first_open){
      load_bet_info();
      first_open = false;
      }
      $(modal_id).modal();
}

function load_bet_info(){
var ajax_url = 'get_bet_stage_info';
//    var ajax_data = { "section": section_name }
    var state = ""
    $.ajax({
        url: ajax_url,
//        data: ajax_data,
        dataType: "json",
        success: function(data) {
//        console.log(data["stage_bet"]["match_1"]);
            var content = $('.mathes_can_bet');
            var insert_data = "";
            //          console.log(data);
            //          json_data = JSON.parse(data);
            var json_stage_matches = data['stage_bet'];
            for (var i = 1; i < 4; i++){
                match_i = "match_" + i;
                match_json = json_stage_matches[match_i];
                console.log(match_json);

                home_team_name = match_json["home_team"]["team_name"];
                home_team_coef = match_json["coefficient"]["home_coef"];

                guest_team_name = match_json["guest_team"]["team_name"];
                guest_team_coef = match_json["coefficient"]["guest_coef"];

                draw_coef = match_json["coefficient"]["draw_coef"];

                insert_data +=
                "<div class=\"one_math_can_bet\"><div class=\"data_time_can\">02.01 - 22:30</div>" +
                "<div class=\"result_can teams_can\">" +
                            "<div class=\"team_can\">" + home_team_name + "</div>" +
                            "<div class=\"kof_can\">" + home_team_coef + "</div></div>" +
                        "<div class=\"result_can draw_can\"><div class=\"team_can\">" +
                                "<i class=\"fa fa-times\" aria-hidden=\"true\"></i></div>" +
                            "<div class=\"kof_can\">" + draw_coef + "</div></div>" +
                        "<div class=\"result_can teams_can\"><div class=\"team_can\">" +
                                guest_team_name +
                            "</div><div class=\"kof_can\">" + guest_team_coef +
                            "</div></div></div>";
            }
            content.html(insert_data);
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
}


var week_show = 0;

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
            week_show--;
        }
        $(".body_user_choice").children(".history_bet").hide();
        $(".body_user_choice").children(".history_bet").eq(week_show).show();
        if (week_show != 0) {
            $(".footer_user_choice").hide();
        } else {
            $(".footer_user_choice").show();
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
            week_show++;
        }
        $(".body_user_choice").children(".history_bet").hide();
        $(".body_user_choice").children(".history_bet").eq(week_show).show();
        if (week_show != 0) {
            $(".footer_user_choice").hide();
        } else {
            $(".footer_user_choice").show();
        }
    }

// Общий Коэффициент
var arr = [];
for (var i = 0; i < $(".history_bet").eq(0).children(".one_user_choice").length; i++) {
    var sum = $(".history_bet").eq(0).find(".kof_this_match").eq(i).text();
    arr.push(sum++);
};


    var quantity_chosen_math = 0;

    // Переменная кол-во выбранных матчей

function arraySum(arr) {
        var umno = 1;
        for (var i = 0; i < arr.length; i++) {
            umno *= arr[i];
        }
        $(".history_bet").eq(0).find(".total_kof_these_matches").text(umno);
        var text_kof = +$(".history_bet").eq(0).find(".total_kof_these_matches").text();
        var text_kof = text_kof.toFixed(2);
        $(".history_bet").eq(0).find(".total_kof_these_matches").text(text_kof);

    }


// Выбор результата матча
$(document).on("click", ".result_can", function(e) {
    $(this).parents(".one_math_can_bet").children().removeClass("active_choice_bet");
    $(this).addClass("active_choice_bet");
    var match = $(this).parents(".one_math_can_bet").find(".teams_can").eq(0).find(".team_can").text() +
        " " + "-" + " " + $(this).parents(".one_math_can_bet").find(".teams_can").eq(1).find(".team_can").text();
    var kof_result = $(this).children(".kof_can").text();
    // var draw_or_win =
    var team_won = $(this).children(".team_can").text();
    if ($(this).parents(".one_math_can_bet").index() == 0) {
        var choisce_result_thum = $(".history_bet").eq(0).find(".one_user_choice").eq(0);
    } else if ($(this).parents(".one_math_can_bet").index() == 1) {
        var choisce_result_thum = $(".history_bet").eq(0).find(".one_user_choice").eq(1);
    } else {
        var choisce_result_thum = $(".history_bet").eq(0).find(".one_user_choice").eq(2);
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
    for (var i = 0; i < $(".history_bet").eq(0).find(".one_user_choice").length; i++) {
        var sum = +$(".history_bet").eq(0).find(".kof_this_match").eq(i).text();
        arr.push(sum++);
    };

    console.log(arr)

    function arraySum(arr) {
        var umno = 1;
        for (var i = 0; i < arr.length; i++) {
            umno *= arr[i];
        }
        $(".history_bet").eq(0).find(".total_kof_these_matches").text(umno);
        var text_kof = +$(".total_kof_these_matches").text();
        var text_kof = text_kof.toFixed(2);
        $(".history_bet").eq(0).find(".total_kof_these_matches").text(text_kof);

    }
    arraySum(arr);

    quantity_chosen_math = $(".mathes_can_bet").find(".active_choice_bet").length;

    if (quantity_chosen_math < 1) {
        $(".history_bet").eq(0).find(".not_results").show()
        $(".history_bet").eq(0).find(".total_kof").hide()
    } else {
        $(".history_bet").eq(0).find(".not_results").hide()
        $(".history_bet").eq(0).find(".total_kof").show()
    }

});

// Удаление выбранного матча
$(document).on("click", ".delete_this_this_choice i", function() {
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
        for (var i = 0; i < $(".history_bet").eq(0).find(".one_user_choice").length; i++) {
            var sum = $(".history_bet").eq(0).find(".kof_this_match").eq(i).text();
            arr.push(sum++);
        };

        function arraySum(arr) {
            var umno = 1;
            for (var i = 0; i < arr.length; i++) {
                umno *= arr[i];
            }
            $(".history_bet").eq(0).find(".total_kof_these_matches").text(umno);
            var text_kof = +$(".history_bet").eq(0).find(".total_kof_these_matches").text();
            var text_kof = text_kof.toFixed(2);
            $(".history_bet").eq(0).find(".total_kof_these_matches").text(text_kof);

        }
        arraySum(arr);
        quantity_chosen_math = $(".mathes_can_bet").find(".active_choice_bet").length;
        if (quantity_chosen_math < 1) {
            $(".history_bet").eq(0).find(".not_results").show()
            $(".history_bet").eq(0).find(".total_kof").hide()
        } else {
            $(".history_bet").eq(0).find(".not_results").hide()
            $(".history_bet").eq(0).find(".total_kof").show()
        }

    });