var currentPageLi = 1,
    lengthPagination,
    locationLink = window.location.pathname,
    tableLength = 10,
    indexSection = 0,
    arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

$(document).ready(function() {

    load_bet_info(); 

    var leftNav,
        center,
        rightNav;
    $(".navTopMatches").on("click", function() {
        if ($(this).hasClass("prevMatch")) {
            leftNav = 1;
            center = 2;
            rightNav = 3;
        } else {
            leftNav = 2;
            center = 3;
            rightNav = 1;
        }
        chooseCurrent(leftNav, center, rightNav);
    });

    // Table rating locationLink
    if (locationLink.indexOf("all_bet_rating") > 0) {
        tableLength = 20;
    }

    ajaxRating(tableLength, 1, indexSection);

    $(".one_division_nav").on("click", function(e) {
        indexSection = $(this).index();
        ajaxRating(tableLength, 1, indexSection);
    });

    $("body").on("click", "#paginationTable li ", function() {
        var thisLi = $(this).text();
        goPagination(thisLi, lengthPagination, currentPageLi);
    });


    // Выбор тура

    var length_li_tour;
    var index_current_tour = 13;
    var width_li_nav;
    var new_margin;
    var load_champ = 6;

    // chose_tour(load_champ);
});

$(window).load(function() {
    $(".makeBetModal").on("click", function() {
        show_modal('#week_bets_top');
    });
});


function show_modal(modal_id) {
    $(modal_id).modal();
}

function load_bet_info() {
    var ajax_url = '/bets/get_bet_stage_info';
    var state = ""
    $.ajax({
        url: ajax_url,
        dataType: "json",
        success: function(data) {
            topMatchRight(data);
            var content = $('.mathes_can_bet');
            var insert_data = "";
            var json_stage_matches = data['stage_bet'];
            var stage_id = json_stage_matches["id"];
            for (var i = 1; i < 4; i++) {
                match_i = "match_" + i;
                match_json = json_stage_matches[match_i];

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

function topMatchRight(objectMatches) {
    var objMatch = objectMatches['stage_bet'],
        htmlMatch = "",
        startWeek = new Date(objMatch["start_date"]),
        endWeek = new Date(objMatch["check_date"]),
        timeStartWeek = startWeek.getDate() + " " + month_convert(startWeek.getMonth()) + " " + startWeek.getFullYear(),
        timeFinishWeek = endWeek.getDate() + " " + month_convert(endWeek.getMonth()) + " " + endWeek.getFullYear(),
        htmlWeekName = timeStartWeek + " - " + timeFinishWeek;
    $("#weekName").html(htmlWeekName);
    for (var i = 1; i < 4; i++) {
        var matchNumber = "match_" + i,
            thisMatch = objMatch[matchNumber],
            times = new Date(thisMatch["match_time"]),
            minuteMatch = "0" + times.getMinutes(),
            minute =  minuteMatch.slice(-2),
            timeMatch = times.getHours() + ":" + minute,
            dayOfWeek = getWeekDay(times.getDay()),
            team1 = thisMatch["home_team"]["team_short_name"] || thisMatch["home_team"]["team_name"],
            team2 = thisMatch["guest_team"]["team_short_name"] || thisMatch["guest_team"]["team_name"];
        htmlMatch += `
            <div class="one_top_match_right">
                <div class="day_one_top_match_right">` + dayOfWeek +`</div>
                <div class="team_one_top_match_right">
                    <div class="logo_one_top_match_right">
                        <img src="` + thisMatch["home_team"]["image"] + `" alt="">
                    </div>
                    <div class="name_team_one_top_match_right">` + team1 + `</div>
                </div>
                <div class="time_one_top_match_right">` + timeMatch +`</div>
                <div class="team_one_top_match_right">
                    <div class="logo_one_top_match_right">
                        <img src="` + thisMatch["guest_team"]["image"] + `" alt="">
                    </div>
                    <div class="name_team_one_top_match_right">` + team2 + `</div>
                </div>
            </div>
            
        `;
    };
    $("#topMathRight").html(htmlMatch);
}

function getWeekDay (numDay) {
    var daysOfweek = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return daysOfweek[numDay];
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
        url: '/bets/make_bet/',
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

function sort(first, second) {
    return second - first
}

function ajaxRating(locationLinkHref, page, section) {
    var $loaderTable = $("#tableLoadForecasters"),
        contentTable = $('#listForecasters');
    contentTable.empty();
    $loaderTable.show();
    $.ajax({
        url: '/bets/get_rating/',
        data: {
            period: section, //section 0 - все время, 1 - месяц, 2 -сезон
            pagePaginationTable: page,
        },
        method: "GET",
        success: function(data, textStatus, xhr) {
            lengthPagination = 123 // Нужно еще передать количество пагинаций
            var htmlBet = "";
            for (var i = 0; i < data.length && i < locationLinkHref; i++) {
                var place = i + 1,
                    imgSrc = '/media/' + data[i]['user__avatar'],
                    firstName = data[i]['user__first_name'],
                    lastName = data[i]['user__last_name'],
                    pointUser = data[i]['score'];
                htmlBet +=
                    `<div class="one_position">
                        <div class="position">` + place + `</div>
                        <div class="forecasters_name">
                            <div class="userAvaTable containerImgUser">
                                <img src="` + imgSrc + `" alt="" class="imgUser">
                            </div>
                            <div class="team_table">
                                ` + firstName + ` ` + lastName +
                    `
                            </div>
                        </div>
                        <div class="forecasters_pts">` + pointUser + `</div>
                    </div>
                    `;

            }
            $loaderTable.hide();
            contentTable.html(htmlBet);
            makePagination(lengthPagination, currentPageLi);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

// Пагинация таблицы прогнозистов Ajax

function makePagination(pageCount, currentPage) {
    if (pageCount - 1) {
        $("#prevPagination").show();
        $("#nextPagination").show();
    } else {
        $("#prevPagination").hide();
        $("#nextPagination").hide();
    }
    $("#prevPagination").nextAll("li.numberLi").remove();
    var htmlLiConteiner = "",
        htmlLi,
        $li = $("#paginationTable").children("ul").children("li"),
        lastPrev = currentPage - 3,
        lastNext = currentPage + 3;
    for (var i = 1; i <= pageCount; i++) {
        if ($li.eq(lastPrev).text() != "-" && $li.eq(lastPrev).text() != 1) {

        }
        if ($li.eq(lastNext).text() != "+" && $li.eq(lastNext).text() != pageCount) {

        }
        if (i > lastPrev && i < lastNext && i != currentPage) {
            htmlLi = `
            <li class="numberLi">` + i + ` </li>
            `;
        } else if (i == lastPrev && i != "-" && i != 1 ||
            i == lastNext && i != "+" && i != pageCount) {
            htmlLi = `
                <li class="numberLi">...</li>
                `;
        } else if (i == currentPage) {
            htmlLi = `
            <li class="currentPagination numberLi">` + i + ` </li>
            `;
        } else {
            htmlLi = `
            <li class="newLi numberLi">` + i + ` </li>
            `;
        }
        htmlLiConteiner += htmlLi;
    }
    $("#prevPagination").after(htmlLiConteiner);
}


function goPagination(page, sumPage, curPage) {
    var numberPage = +page;
    if ($.isNumeric(numberPage)) {
        currentPageLi = numberPage;
    } else {
        if (page == "...") {
            return;
        } else if (page == "+") {
            if (curPage + 1 > sumPage) {
                currentPageLi = 1;
            } else {
                currentPageLi = curPage + 1
            }
        } else if (page == "-") {
            if (curPage - 1 < 1) {
                currentPageLi = sumPage;
            } else {
                currentPageLi = curPage - 1;
            }
        }
    }
    return ajaxRating(tableLength, currentPageLi, indexSection);
}

// function chose_tour(load_championat) {
//     length_li_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li").length;
//     index_current_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li.current_tour").index();
//     for (var i = 0; i < length_li_tour; i++) {
//         var load_tour = (length_li_tour - i - 1);
//         var nuber_tour = $("#id_list_tour").children("ul").eq(load_championat).children("li").eq(load_tour).text();
//         var content_tour_active = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu active_menu"></div></li>';
//         var content_tour = '<li><a href="# ">' + nuber_tour + '</a><div class="hover_menu"></div></li>';
//         if ((length_li_tour - i - 1) == index_current_tour) {
//             $('#tour_other').prepend(content_tour_active);
//         } else {
//             $('#tour_other').prepend(content_tour);
//         }
//     };
//     $windowWidth = $(".container_tour").width();
//     width_li_nav = $("#tour_other").find("li").eq(0).width();
//     var maxMarginTour = Math.floor((Math.floor($windowWidth / width_li_nav) - 1) / 2);
//     if (index_current_tour < maxMarginTour) {
//         $(".nav_ul_tour").css({ "margin-left": "0" })
//     } else {
//         new_margin = (-(index_current_tour - maxMarginTour) * width_li_nav);
//         $(".nav_ul_tour").css({ "margin-left": new_margin })
//     }
// }

function chooseCurrent(a, b, c) {
    var $first = $('.order1TopMatch'),
        $second = $('.order2TopMatch'),
        $thirt = $('.order3TopMatch');
    $first.removeClass('order1TopMatch').addClass('order' + b + 'TopMatch');
    $second.removeClass('order2TopMatch').addClass('order' + c + 'TopMatch');
    $thirt.removeClass('order3TopMatch').addClass('order' + a + 'TopMatch');
}

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

function month_convert(month) {
    var arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return arrMonth[month]
}
