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
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
var is_load_more_needed = true;
$(document).ready(function() {

    var section = getUrlParameter('section');
    if (typeof section != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    } else {
        section = $(".nav_ul li:first-child a");
        section_name = section.text();
        // Active section of menu
        section.addClass("active_nav_ul");
        var ajax_url = 'article_list';
        var ajax_data = {}
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.flex_container');
                content.html(data);
                $("#list").imagesLoaded(function() {
                    $('#list').masonry({
                        itemSelector: '.item',
                        transitionDuration: 0 
                    });
                });
            },
            error: function(xhr, status, error) {
            }
        });
    }


    //tab click
    $(".nav_ul li a").click(function(e) {
        $(".tab ul li").removeClass('activeRecords');
        $(this).parent().addClass('activeRecords');

        massonryEffect(0)
        $(".more_article").removeClass("moreLoading").removeClass("endMore");
        if ($(this).hasClass('active_nav_ul')) {
            return;
        }
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        section = $(this);
        section_name = section.text().trim();
        // Active section of menu
        section.addClass("active_nav_ul");
        var ajax_url = 'article_list';
        var ajax_data = { "section": section_name }
        if (section_name == 'Все') {
            var ajax_data = {}
        }
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                var content = $('.flex_container');
                content.html(data);
                var a_block = $('.more_article');
                $(a_block).prop('href', 3);
                massonryReload();
            },
            error: function(xhr, status, error) {
            }
        });

    });
    $(".more_article").click(function(e) {
        massonryEffect(1)
        $(this).addClass("moreLoading");
        var a_block = $(this);
        var page = $(this).attr('href');
        if (page == -1) {
            return;
        }
        var ajax_url = 'article_list';
        var ajax_data = { "section": section_name }
        if (section_name == 'Все') {
            var ajax_data = {}
        }
        if (page != null) {
            console.log('HERE PAGE IS: ' + page);
            ajax_data["page"] = page
        }
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                page = +page + 1;
                a_block.attr('href', page);
                var content = $('.flex_container');
                content.append(data);
                massonryReload()
                $(".more_article").removeClass("moreLoading");
            },
            error: function(xhr, status, error) {
                console.log("pixdos")
                $(this).addClass("endMore").removeClass("moreLoading");
                if (status = 404) {
                    a_block.prop('href', -1);
                }
            }
        });

    });
});

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
