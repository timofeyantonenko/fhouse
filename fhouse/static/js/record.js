var section_name;

$(document).ready(function() {

    massonryEffect(0);

    $('#list').masonry({
        itemSelector: '.item',
        transitionDuration: 0
    });

    var group = getUrlParameter('group');

    if (typeof group != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .tab_active');
        previous_active_tab.removeClass('tab_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    } else {
        section_name = $("#recordTab").children("li").eq(0).text().trim();
        ajaxPage(false);
    }

    //tab click
    $("#recordTab").children("li").click(function(e) {
        massonryEffect(0);
        if ($(this).hasClass('tab_active')) return;
        $("#recordTab li").removeClass('tab_active');
        $(this).addClass("tab_active");
        section_name = $(this).text().trim();
        ajaxPage(false);
    });

    $(".more_records").click(function(e) {
        massonryEffect(1);
        $(this).addClass("moreLoading");
        ajaxPage(true);
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            massonryEffect(1)
            $(".more_records").addClass("moreLoading");
            ajaxPage(true);
        }
    });

    set_type_table();
});

function set_type_table() {
    alert();
    var $trTable = $(".tableRecord").children("tr").eq(1).children("th");
    for (var i = 2; i < 4; i++) {
        var indexTh = $(this).eq(i).index()
        if (!$trTable.find("img").attr('src')) {
            if (i == 2) {
                $(".tableRecord").addClass("noClub")
                $(".headTable").addClass("noClub")
            } else {
                $(".tableRecord").addClass("noNational")
                $(".headTable").addClass("noNational")
            }
        }
    }

    if ($(".headTable").hasClass("noClub") && !$(".headTable").hasClass("noNational")) {
        $(".headTable").children("tr").children("th").eq(1).html("Клуб")
    } else if ($(".headTable").hasClass("noClub") && $(".headTable").hasClass("noNational")) {
        $(".headTable").children("tr").children("th").eq(1).html("Страна")
    } else {
        $(".headTable").children("tr").children("th").eq(1).html("Имя Фамилия")
    }
}

function ajaxPage(pageCount) {
    var page = parseInt($(".more_records").attr("data-page"));
    var f = function() {
        var ajax_url = 'table_list',
            ajax_data = { "group": section_name },
            content = $('.flex_container'),
            state = "",
            $moreArt = $(".more_records");
        pageCount ? page += 1 : page = 2;
        if (section_name == 'Все') ajax_data = {};
        if (pageCount) ajax_data["page"] = page;
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            cache: true,
            success: function(data) { //parametr:lastPage - true/false
                // if (lastPage) {
                console.log(data);
                pageCount ? content.append(data) : content.html(data);
                $moreArt.attr("data-page", page);
                $("#list").masonry('reloadItems');
                $("#list").masonry('layout');
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

function massonryEffect(a) {
    $("#styleArticle").empty().html(
        `
        .thumbnails {
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
