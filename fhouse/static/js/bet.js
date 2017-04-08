function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
$(document).ready(function() {

    //    $(".make_bet").on("click", function(){
    //    $('#week_bets_top').modal('show');
    //        show_modal('#week_bets_top');
    //    });

    var $windowWidth;
    imgNavBet();

    $(window).resize(function() {
        imgNavBet();
        imgRightColumnBet();
    })

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
    
    var length_li_tour;
    var index_current_tour = 13;
    var width_li_nav;
    var new_margin;
    var load_champ = 6;

    chose_tour(load_champ);

    

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

        chose_tour(load_champ);
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

    // Выбор топ матча 
    $(".li_img__top_match").click(function() {
        $(".li_img__top_match").children("figure").hide();
        $(".li_img__top_match").children(".team_nav, .preview_math_nav_background").show();
        $(this).children("figure").show();
        $(this).children(".team_nav, .preview_math_nav_background").hide();
    });

});

$(window).load(function() {
    $(".make_bet").on("click", function() {
        show_modal('#week_bets_top');
    });
});

var first_open = true;

function show_modal(modal_id) {
    if (first_open) {
        load_bet_info();
        first_open = false;
    }
    $(modal_id).modal();
}

    function load_bet_info() {
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
            var stage_id = json_stage_matches["id"];
            console.log("DATA IS: " + data);
            for (var i = 1; i < 4; i++) {
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
            content.attr("stage_id", stage_id);
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

// User make bet
$(document).on("click", ".btn_success_bet", function() {
    var content = $('.mathes_can_bet');
    stage_id = content.attr("stage_id");
    first_match = content.children()[0];
    first_result = get_match_bet_result(first_match);

    second_match = content.children()[1];
    second_result = get_match_bet_result(second_match);

    third_match = content.children()[2];
    third_result = get_match_bet_result(third_match);

    propose_bet(stage_id, first_result, second_result, third_result);

});

function get_match_bet_result(match_div) {
    var bet = -1;
    var result_cans = $(match_div).children();
    for (var i = 0; i < 3; i++) {
        if ($(result_cans[i + 1]).hasClass("active_choice_bet")) {
            bet = i;
            break;
        }
    }
    return bet;
}

function propose_bet(stage_id, match_1, match_2, match_3) {
    $.ajax({
        url: 'make_bet/',
        data: {
            stage_id: stage_id,
            first_match: match_1,
            second_match: match_2,
            third_match: match_3,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            alert("POST sent!");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Exist!")
            }
            //            console.log(error, status, xhr);
        }
    });
}

$(document).on("click", ".one_division_nav", function(e) {
        $.ajax({
        url: 'get_rating/',
        data: {
            period: $(this).attr("id"),
        },
        method: "GET",
        success: function(data, textStatus, xhr) {
            console.log(data[0]['user__avatar']);
            for ( var i = 0; i < data.length; i++) {
                console.log( data[i])
            }
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
});

function imgNavBet() {
    $windowWidth = $(window).width();
    console.log($windowWidth)
        // Background position nav all bets
    for (var i = 0; i < $(".change_champ").length; i++) {
        if ($windowWidth > 969) {
            $(".change_champ").eq(i).css({
                "background-position-x": ((-80 * i) - 10)
            });
        } else {
            $(".change_champ").eq(i).css({
                "background-position-x": ((-60 * i) - 7.5)
            });
        }
        $(".change_champ").eq(i).show();

    };
}

function chose_tour(load_championat) {
    length_li_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li").length;
    index_current_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li.current_tour").index();
    for (var i = 0; i < length_li_tour; i++) {
        var load_tour = (length_li_tour - i - 1);
        var nuber_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li").eq(load_tour).text();
        var content_tour_active = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu active_menu"></div></li>';
        var content_tour = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu"></div></li>';
        if ((length_li_tour - i - 1) == index_current_tour) {
            $('#tour_other').prepend(content_tour_active);
        } else {
            $('#tour_other').prepend(content_tour);
        }
    };
    $windowWidth = $(".container_tour").width();
    width_li_nav = $("#tour_other").find("li").eq(0).width();
    var maxMarginTour = Math.floor((Math.floor($windowWidth/width_li_nav) - 1) / 2);
    if (index_current_tour < maxMarginTour) {
        $(".nav_ul_tour").css({ "margin-left": "0" })
    } else {
        new_margin = (-(index_current_tour - maxMarginTour) * width_li_nav);
        $(".nav_ul_tour").css({ "margin-left": new_margin })
    }
}
