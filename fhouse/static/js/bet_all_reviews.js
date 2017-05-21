var objBets = {};

$(document).ready(function() {

    objBets.currentLeague = first_season;
    get_tours(first_season);

    get_table(1);

    $("#arrow_left_tour").bind('click', left_tour);

    $("#arrow_right_tour").bind('click', right_tour);

    // Active first league_table
    $("#all_bets_nav").children("div").eq(0).addClass("active_champ");

    $(document).on("click", "#all_bets_nav .change_champ", function(e) {
        if ($(this).hasClass('active_champ')) return;
        $('.active_champ').removeClass('active_champ');
        $(this).addClass('active_champ');
        var idSeason = +$(this).attr("data-id");
        objBets.currentLeague = idSeason;
        get_tours(idSeason);
    })

    $(document).on("click", "#tour_other li", function() {
        var $lineHover = $(this).find('.hover_menu')
        if ($lineHover.hasClass('active_menu')) return;
        $('.active_menu').removeClass('active_menu');
        $lineHover.addClass('active_menu');
        var idTour = +$(this).attr("id");
        objBets.currentTour = idTour;
        make_preview(idTour);
    })


});

// Get tours

function get_tours(idSeason) {
    var $container = $('#tour_other');
    $.ajax({
        url: '/bets/get_season_tours/',
        data: { 'season_id': idSeason },
        method: "GET",
        success: function(data, textStatus, xhr) {
        	console.log(data);
            var htmlTour = "",
                content;
            for (var i = data.length - 1; i >= 0 ; i--) {
                var nameTour = data[i]['stage_name'],
                    id_tour = data[i]['id'];
                if (data[i]['is_current']) {
                    make_preview(id_tour);
                    objBets.currentTour = id_tour;
                    htmlTour += `
                        <li id="` + id_tour + `">
                            <span>` + nameTour + `</span>
                            <div class="hover_menu active_menu"></div>
                        </li>
                    `
                } else {
                    htmlTour += `
                        <li id="` + id_tour + `">
                            <span>` + nameTour + `</span>
                            <div class="hover_menu"></div>
                        </li>
                    `
                }
            }
            $container.html(htmlTour);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

// Превью к матчам

function make_preview(idTour) {
    var $loader = $("#loaderMatches"),
        $containerMatches = $("#container_preview_match");
    $loader.show();
    $containerMatches.hide();
    $("#loadTile").attr("data-count-page", 1);
    $.ajax({
        url: '/bets/get_stage_matches/',
        data: { 'tour_id': idTour },
        method: "GET",
        success: function(data, textStatus, xhr) {
            var htmlMatches = "",
                arrMatches = data['matches'],
                lengthMatches = arrMatches.length;
            $("#countComments").html(data['comments_count']);
            objBets.countPage = Math.ceil(data['comments_count'] / 10);
            $("#loadTile").attr("data-page", objBets.countPage);
            for (var i = 0; i < lengthMatches; i++) {
                var match = arrMatches[i],
                    dateMatch = new Date(match.match_time),
                    dayMatch = dateMatch.getDate() + ' ' + month_convert(dateMatch.getMonth()),
                    minuteMatch = "0" + dateMatch.getMinutes(),
                    minute = minuteMatch.slice(-2),
                    time1 = dateMatch.getHours() + ':' + minute;
                var time2 = toTimeZone(match.match_time);
                htmlMatches += `
                    <article class="preview_one_match">
                        <section class="teams_logo_s_time">
                            <div class="teams_img">
                                <div class="img_logo_one_team">
                                    <img src="` + match['home_team']['image'] + `" alt="">
                                </div>
                                <div class="img_logo_one_team">
                                    <img src="` + match['guest_team']['image'] + `" alt="">
                                </div>
                            </div>
                            <div class="dateMatchBet">
                                <time class="match_date">` + dayMatch + `</time>
                                <time class="match_time">Москва: ` + time2 + `</time>
                                <time class="match_time">Киев: ` + time1 + `</time>
                            </div>
                        </section>
                        <section class="match_discription">
                            <h3>` + match['home_team']['team_name'] + ` - ` + match['guest_team']['team_name'] + `</h3>
                            <div class="bet_match">
                                <div class="evnt_bet">
                                    П1 (` + match['coefficient']['home_coef'] + `) Х (` + match['coefficient']['draw_coef'] + `) П2 (` + match['coefficient']['guest_coef'] + `)
                                </div>
                                <div class="admin_bets_one_match">Наш прогноз: ` + match['home_goals'] + `:` + match['guest_goals'] + ` </div>
                            </div>
                            <p class="match_preview_discription">
                                ` + match['preview'] + `
                            </p>
                        </section>
                    </article>
                `
            };
            make_comments(objBets.currentTour, 1);
            $loader.hide();
            $containerMatches.show();
            $containerMatches.html(htmlMatches);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

function make_comments(idTour, page) {
    var $blComments = $("#comments_tour");
    $("#loadTile").removeClass("finish_more");
    $.ajax({
        url: '/bets/get_stage_comments',
        data: { "stage_id": idTour, "p": page },
        dataType: "json",
        success: function(data) {
            var commentsHtml = "";
            for (var i = 0; i < data.length; i++) {
                dateComment = get_date(data[i]["timestamp"]);
                commentsHtml += `
                    <div class="blockquote commentBody">
                        <div class="coments_author containerImgUser">
                            <img src="` + data[i]["user"]["avatar"] + `" alt="" class="imgUser">
                        </div>
                        <div class="coment_author_time">
                            <h5>
                                ` + data[i]["user"]["first_name"] + ` ` + data[i]["user"]["last_name"] + `
                            </h5>
                            <time>` + dateComment + `</time>
                            <p>` + data[i]["content"] + `</p>
                        </div>

                    </div>
                `
            };
            if (page != 1) {
                $blComments.append(commentsHtml);
            } else {
                $blComments.html(commentsHtml);
            };
            if (page == objBets.countPage || objBets.countPage === 0) {
                $("#loadTile").addClass("finish_more");
            } else {
                $("#loadTile").removeClass("loading").addClass("more_active");
            }
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
};

// More comments
$(document).on('click', '#loadTile', function(e) {
    e.preventDefault();
    $(this).addClass("loading")
    var count = +$(this).attr("data-count-page");
    count++;
    make_comments(objBets.currentTour, count)
    $(this).attr("data-count-page", count)
});

// Send comments

$(document).on('click', '.btnFhouse', function(e) {
    e.preventDefault();
    var $inputText = $("#id_content"),
        commentText = $inputText.val();
    $.ajax({
        url: '/bets/add_stage_comment/',
        data: {
            id: objBets.currentTour,
            content: commentText,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            dateComment = get_date(new Date());
            var commentsHtml = `
                    <div class="blockquote commentBody">
                        <div class="coments_author containerImgUser">
                            <img src="` + avatar_user + `" alt="" class="imgUser">
                        </div>
                        <div class="coment_author_time">
                            <h5>
                                ` + first_name + ` ` + last_name + `
                            </h5>
                            <time>` + dateComment + `</time>
                            <p>` + commentText + `</p>
                        </div>

                    </div>
                `;
            $("#comments_tour").prepend(commentsHtml);
            $inputText.val("");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
});

function get_date(date) {
    var dateToString = "" + date,
        dateDate = new Date(dateToString),
        today = new Date();
    timeLong = (today - dateDate) / (60000 * 24);
    minuteAgo = Math.round((today - dateDate) / 60000);
    if (timeLong > 1 && timeLong < 24) {
        makeDate = "Сегодня в " + ("0" + dateDate.getHours()).slice(-2) + ":" + ("0" + dateDate.getMonth()).slice(-2);
    } else if (timeLong < 1) {
        makeDate = minuteAgo + " мин. назад"
    } else {
        makeDate = ("0" + dateDate.getDate()).slice(-2) + " " + arrMonth[dateDate.getMonth()] + " " + dateDate.getFullYear();
    }
    return makeDate;
}


function toTimeZone(time) {
    var timeZ = new Date(time);
    var newTime = timeZ.toLocaleString('ru-Ru', { timeZone: 'Europe/Moscow' });
    var newTime2 = newTime.split(", ").slice(1).join("").split(":").slice(0, 2).join(":");
    return newTime2;
}

// Таблицы результатов

function sort(first, second) {
    return second - first
}

function get_table(ajax_data) {
    var $loaderTable = $("#tableLoad"),
        $tableINherit = $("#table_rating");
    $tableINherit.empty();
    $loaderTable.show();
    $.ajax({
        url: '/bets/get_league_status/',
        data: ajax_data,
        method: "GET",
        success: function(data, textStatus, xhr) {
            var newData = data.league_table;
            lengthArray = newData.length;
            for (var i = 0; i < lengthArray; i++) {
                newData[i].valueOf = function() {
                    return this.points
                }
            };
            var newDataSort = newData.sort(sort);
            htmlTable = "";
            for (var i = 0; i < lengthArray; i++) {
                var position = i + 1,
                    team = newDataSort[i],
                    img = team['team']['image'],
                    name = team['team']['team_name'],
                    games = team['games'],
                    goals = team['goals'],
                    points = team['points'];
                htmlTable += `
                    <div class="one_position">
                        <div class="position">` + position + `</div>
                        <div class="team_name">
                            <div class="team_img containerImgNews">
                                <img src="` + img + `" alt="` + name + `" class="coverImg">
                            </div>
                            <div class="team_table">
                                ` + name + `
                            </div>
                        </div>
                        <div class="team_games">` + games + `</div>
                        <div class="team_goals">` + goals + `</div>
                        <div class="team_pts">` + points + `</div>
                    </div>
                `
            }
            $loaderTable.hide();
            $tableINherit.html(htmlTable);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

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

function month_convert(month) {
    var arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return arrMonth[month]
}
