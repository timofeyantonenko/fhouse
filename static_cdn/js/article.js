var is_load_more_needed = true,
    section_name,
    articles = {},
    arrMonth = ['Янв', 'Фев', 'Марта', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(document).ready(function() {

    add_effect(0);

    $('#list').masonry({
        itemSelector: '.item',
        transitionDuration: 0
    });

    ajaxPage(0, 1);

    //tab click
    $("#navAjax").children("li").click(function(e) {
        if ($(this).hasClass('activeRecords')) return;
        $("#list").empty().css({"height":"0px"});
        add_effect(0);

        $(".tab ul li").removeClass('activeRecords');
        $(this).addClass('activeRecords');
        section_name = +$(this).attr("section-id");
        var $moreArticle = $("#progress").find(".more_article");
        if (!articles.hasOwnProperty(section_name)) {
          ajaxPage(section_name, 1);
          $moreArticle.attr("data-page", 2);
          $moreArticle.attr("data-section", section_name);
        } else {
            $("#list").html(articles[section_name]["html"]);
            $moreArticle.attr("data-page", articles[section_name]["page"] + 1);
            $moreArticle.attr("data-section", section_name);
            $("#list").find(".containerImgNews").children("img").imagesLoaded(function() {
                $("#list").masonry('reloadItems');
                $("#list").masonry('layout');
            }).done(function() {
                var lenArt = $("#list").children().length,
                    $artItem = $("#list").children().children("a");
                for (var i = 0; i < lenArt; i++) {
                    $artItem.eq(i).addClass("donaMassonry").addClass("opacityEffect");
                }
            })
        }
        if ( articles[section_name]["countPage"] == $moreArticle.attr("data-page") ) {
          $moreArticle.addClass("finish_more");
        } else {
          $moreArticle.removeClass("finish_more");
        }
    });

    $(".more_article").click(function(e) {
        add_effect(1);
        $(this).addClass("moreLoading");
        var newPage = (+$(this).attr("data-page")) + 1,
            sectionCurrent = +$(this).attr("data-section");
        $(this).attr("data-page", newPage);
        articles[sectionCurrent]["page"] = newPage;
        ajaxPage(sectionCurrent, newPage);
    });

    // $(window).scroll(function() {
    //     if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //         add_effect(1);
    //         $(".more_article").addClass("moreLoading");
    //         ajaxPage(true);
    //     }
    // });

});

function ajaxPage(section, page) {
    var $moreArt = $("#progress").children("button");
    $moreArt.removeClass("more_active").removeClass("finish_more").addClass("loading");
    var ajax_data = { "section": section, "page": page },
        content = $('.flex_container'),
        state = "",
        $moreArt = $(".more_article");
    if (section == "0") delete ajax_data.section;
    if (page == 1) delete ajax_data.page
    $.ajax({
        url: 'get_section_articles',
        data: ajax_data,
        dataType: "json",
        success: function(data) {
            console.log(data)
            var arcticle_html = "",
                lenData = data.list.length;
            for (var i = 0; i < lenData; i++) {
                var currentArt = data.list[i];
                arcticle_html += `
                    <div class="one_read_article item">
                        <a href="` + currentArt['section_slug'] + `/` + currentArt['slug'] + `/" class="articleSrc">
                            <div class="one_read_article_img containerImgNews">
                                <img src="` + currentArt['image'] + `" class="imgUser" alt="">
                            </div>
                            <div class="relative_article">
                                <div class="author_img containerImgUser">
                                    <img src="` + currentArt['user']['avatar'] + `" alt="FH" class="imgUser">
                                </div>
                                <p>` + currentArt['user']['first_name']  + ` ` +  currentArt['user']['last_name'] + `</p>
                            </div>
                            <div class="info_time_article">
                                <div class="before_date"></div>
                                <span class="date_aritle">` + get_date(currentArt['timestamp']) + `</span>
                            </div>
                            <div class="one_read_article_info">
                                <h3>` + currentArt['article_title'] + `</h3>
                                <p>
                                    ` + currentArt['article_description'] + `
                                </p>
                            </div>
                        </a>
                    </div>
                `
            }
            if (articles.hasOwnProperty(section)) {
                articles[section]["html"] += arcticle_html
                $("#list").append(arcticle_html);
            } else {
                articles[section] = {};
                articles[section]["html"] = arcticle_html;
                articles[section]["page"] = page++;
                $("#list").html(arcticle_html);
                articles[section]["countPage"] = Math.ceil(data.amount / 3);
            }
            massonryReload();
            var countPage = articles[section]["countPage"],
                currentPage = $moreArt.attr("data-page");
            $moreArt.removeClass("moreLoading");
            if ( countPage == currentPage ) $moreArt.addClass("finish_more");

        },
        error: function(xhr, status, error) {}
    });

}

function add_effect(a) {
    var styleHtml = `
        #list .donaMassonry {
            -webkit-transition-duration: ` + a + `s;
            -moz-transition-duration: ` + a + `s;
            -o-transition-duration: ` + a + `s;
            transition-duration: ` + a + `s;
        }
    `
    $("#mainStyle").html(styleHtml);
}

function massonryReload() {
    $("#list").find(".containerImgNews").children("img").imagesLoaded(function() {
        $("#list").masonry('reloadItems');
        $("#list").masonry('layout');
    }).done(function(instance) {
        var newlength = instance['progressedCount'],
            lengthItem = $("#list").children(".item").length;
        for (var i = lengthItem - newlength; i < lengthItem; i++) {
            $("#list").children(".item").eq(i).children("a").addClass("donaMassonry");
        };
        $("#progress").children("button").removeClass("loading").addClass("more_active")
    });
}


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
