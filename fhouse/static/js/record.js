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


// К-во элементов для подгрузки

var dowloadItem;

function itemDownload() {
  if ($(window).width() >= 1170) {
        dowloadItem = 3;

    } else if ($(window).width() >= 590 && $(window).width() < 1170) {
        dowloadItem = 2;
    } else {
        dowloadItem = 1;
    }
    $(".more_records").attr("href", dowloadItem); 
    console.log(dowloadItem) 
}

$(document).ready(function() {

    // Уникальные таблицы
    $("#loaderTable").css({"display":"flex"});

    var $trTable = $(".tableRecord").children("tr").eq(1).children("th");
    for ( var i = 2; i < 4; i++) {
        var indexTh = $(this).eq(i).index() 
        if ( $trTable.find("img").attr('src') == ""  ) {
            if ( i == 2) {
                $(".tableRecord").addClass("noClub")
                $(".headTable").addClass("noClub")
            } else {
                $(".tableRecord").addClass("noNational")
                $(".headTable").addClass("noNational")
            }
        }
    }

    if ( $(".headTable").hasClass("noClub") && !$(".headTable").hasClass("noNational") ) {
        $(".headTable").children("tr").children("th").eq(1).html("Клуб")
    } else if ( $(".headTable").hasClass("noClub") && $(".headTable").hasClass("noNational") ) {
        $(".headTable").children("tr").children("th").eq(1).html("Страна")
    } else {
        $(".headTable").children("tr").children("th").eq(1).html("Имя Фамилия") 
    }

    // $("#loaderTable").hide();
    $(".hiddenTable").removeClass("hiddenTable");

    var dowloadItem;
    itemDownload();

    $(window).resize(function() {
        itemDownload();
    });

    var group = getUrlParameter('group');
    if (typeof group != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .tab_active');
        alert(previous_active_tab.text())
        previous_active_tab.removeClass('tab_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    } else {
        group = $(".table_nav_records .tab ul li a");
        group_name = group.text();
        console.log(group_name);
        // Active group of menu
        group.addClass("active_nav_ul");
        var ajax_url = 'table_list';
        var ajax_data = {}
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.statsCard .flex_container');
                content.html(data);
                $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");
                $('#list').masonry({ itemSelector: '.item' });
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    }

    //tab click
    $(".table_nav_records .tab ul li").click(function(e) {
        $(".more_records").html("Посмотреть больше");
        if ($(this).hasClass('tab_active')) {
            return;
        }
        e.preventDefault();
        $(".table_nav_records .tab ul li").removeClass('tab_active');
        group = $(this);
        group_name = group.text().trim();
        // Active group of menu
        group.addClass("tab_active");
        var ajax_url = 'table_list';
        var ajax_data = { "group": group_name }
        if (group_name == 'Все') {
            console.log('ВСЕ');
            var ajax_data = {}
        }

        console.log(ajax_data);
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.flex_container');
                content.html(data);

                $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");
                var a_block = $('.more_records');
                $(a_block).prop('href', 3);
                $("#list").masonry('reloadItems');
                $("#list").masonry('layout');
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });
    $(".more_records").click(function(e) {
        if ( $(".more_records").text() != "Конец") {
          $(this).html("Загрузка...");  
        }
        e.preventDefault();
        var a_block = this;
        var page = $(this).attr('href');
        var ajax_url = 'table_list';
        var ajax_data = { "group": group_name }
        if (group_name == 'Все') {
            console.log('ВСЕ');
            var ajax_data = {}
        }
        if (page != null) {
            console.log('HERE PAGE IS: ' + page);
            ajax_data["page"] = page
        }
        console.log("AJAX DATA: " + ajax_data['page'] + ' ' + ajax_data['group']);
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                page = parseInt(page) + 1;
                $(a_block).prop('href', page);
                var content = $('.flex_container');
                content.append(data);

                $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");
                //            window.history.pushState("object or string", "Title", state);
                $("#list").masonry('reloadItems');
                $("#list").masonry('layout');
                $(".more_records").html("Посмотреть больше");
            },
            error: function(xhr, status, error) {
                $(".more_records").html("Конец");
                console.log(error, status, xhr);
            }
        });
    });



    $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");

    var width_parent_statinfo = $(".statsHero .statInfo").parent().width() - 120;
    $(".statsHero .statInfo").css("max-width", width_parent_statinfo);

    $(".nav_ul li a").click(function() {
        $(".nav_ul li a").removeClass('active_nav_ul');
        $(this).addClass('active_nav_ul');
    });

    var width_parent_statinfo = $(".statsHero .statInfo").parent().width() - 150;
    $(".statsHero .statInfo").css("max-width", width_parent_statinfo);

    $(".table_nav_records .tab ul li:first-child").addClass("tab_active");

    $(".tab ul li").click(function() {
        $(".tab ul li").removeClass('activeRecords');
        $(this).addClass('activeRecords');
    });

});
