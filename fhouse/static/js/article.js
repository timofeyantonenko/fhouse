var is_load_more_needed = true,
    section_name;

if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(document).ready(function() {
    massonryEffect(0);
    $("#list").imagesLoaded(function() {
        $('#list').masonry({
            itemSelector: '.item',
            transitionDuration: 0
        });
    });
    var section = getUrlParameter('section');
    if (typeof section != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    } else {
        section_name = $("#navAjax").children("li").eq(0).text().trim();
        ajaxPage(false);
    }


    //tab click
    $("#navAjax").children("li").click(function(e) {
        massonryEffect(0)
        $(".more_article").removeClass("moreLoading").removeClass("endMore");
        if ($(this).hasClass('active_nav_ul')) return;
        $(".tab ul li").removeClass('activeRecords');
        $(this).addClass('activeRecords');
        section_name = $(this).text().trim();
        ajaxPage(false);
    });

    $(".more_article").click(function(e) {
        massonryEffect(1)
        $(this).addClass("moreLoading");
        ajaxPage(true);
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            massonryEffect(1)
            $(".more_article").addClass("moreLoading");
            ajaxPage(true);
        }
    });

});

function ajaxPage(pageCount) {
    var page = parseInt($(".more_article").attr("data-page"));
    var f = function() {
        var ajax_url = 'article_list',
            ajax_data = { "section": section_name },
            content = $('.flex_container'),
            state = "",
            $moreArt = $(".more_article");
        pageCount ? page += 1 : page = 2;
        if (section_name == 'Все') ajax_data = {};
        if (pageCount) ajax_data["page"] = page;
        console.log(section_name)
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            cache: true,
            success: function(data) { //parametr:lastPage - true/false
                // if (lastPage) {
                pageCount ? content.append(data) : content.html(data);
                $moreArt.attr("data-page", page);
                massonryReload()
                $moreArt.removeClass("moreLoading");
                // } else {
                //     return $moreArt.addClass("endMore").removeClass("moreLoading");
                // }
            },
            error: function(xhr, status, error) {}
        });
    }
    return f();
}



function massonryReload() {
    $("#list").imagesLoaded(function() {
        $("#list").masonry('reloadItems');
        $("#list").masonry('layout');
    });
}

function massonryEffect(a) {
    $("#styleArticle").empty().html(
        `
        .one_read_article {
            -webkit-animation: fadein ` + a + `s ease forwards; 
       -moz-animation: fadein ` + a + `s ease forwards;
        -ms-animation: fadein ` + a + `s ease forwards; 
         -o-animation: fadein ` + a + `s ease forwards; 
            animation: fadein ` + a + `s ease forwards;
        }
        `
    )
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
