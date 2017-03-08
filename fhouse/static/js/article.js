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

    // Active menu
    $(".tab ul li").click(function() {
        $(".tab ul li").removeClass('activeRecords');
        $(this).addClass('activeRecords');
    });

    $(".linkImg").keyup(function() {
        // downloadLinkTosrc();
        var srcNew = $(this).val();
        $('.imgOfferNews').attr('src', srcNew);
        console.log("Privet")
    })

    // Download photo
    $("#offerImgDownload").change(function() {
        readURLoffer(this);
    });

    // К-во элементов для подгрузки
    var dowloadItem;
    itemDownload();
    $(window).resize(function() {
        itemDownload();
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
        section = $(".nav_ul li:first-child a");
        section_name = section.text();
        console.log(section_name);
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
                $(".flex_container").find(".one_read_article_img img").on("load", function() {
                    $('#list').masonry({
                        itemSelector: '.item'
                    });
                });
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    }


    //tab click
    $(".nav_ul li a").click(function(e) {
        if ($(this).hasClass('active_nav_ul')) {
            return;
        }
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        section = $(this);
        section_name = section.text().trim();
        console.log(section_name);
        // Active section of menu
        section.addClass("active_nav_ul");
        var ajax_url = 'article_list';
        var ajax_data = { "section": section_name }
        if (section_name == 'Все') {
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
                var a_block = $('.more_article a');
                $(a_block).prop('href', 3);
                $(".flex_container").find(".one_read_article_img img").on("load", function() {
                    $("#list").masonry('reloadItems');
                    $("#list").masonry('layout');
                });

                //            window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });

    });
    $(".more_article a").click(function(e) {
        $(this).html("Загрузка...")
        e.preventDefault();
        var a_block = this;
        var page = $(this).attr('href');
        if (page == -1) {
            return;
        }
        var ajax_url = 'article_list';
        var ajax_data = { "section": section_name }
        if (section_name == 'Все') {
            console.log('ВСЕ');
            var ajax_data = {}
        }
        if (page != null) {
            console.log('HERE PAGE IS: ' + page);
            ajax_data["page"] = page
        }
        console.log("AJAX DATA: " + ajax_data['page'] + ' ' + ajax_data['section']);
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
                $(".flex_container").find(".one_read_article_img img").on("load", function() {
                    $("#list").masonry('reloadItems');
                    $("#list").masonry('layout');
                });
                $(".more_article a").html("ПОСМОТРЕТЬ БОЛЬШЕ");
                //            window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error) {
                $(".more_article a").html("Конец");
                console.log(error, status, xhr);
                if (status = 404) {
                    $(a_block).prop('href', -1);
                }   
            }
        });

    });


    //    function renderGrid() {
    //        var blocks = document.getElementById("grid_container").children;
    //        var pad = 10,
    //            cols = 3,
    //            newleft, newtop;
    //        for (var i = 1; i < blocks.length; i++) {
    //            if (i % cols == 0) {
    //                newtop = (blocks[i - cols].offsetTop + blocks[i - cols].offsetHeight) + pad;
    //                blocks[i].style.top = newtop + "px";
    //            } else {
    //                if (blocks[i - cols]) {
    //                    newtop = (blocks[i - cols].offsetTop + blocks[i - cols].offsetHeight) + pad;
    //                    blocks[i].style.top = newtop + "px";
    //                }
    //                newleft = (blocks[i - 1].offsetLeft + blocks[i - 1].offsetWidth) + pad;
    //                blocks[i].style.left = newleft + "px";
    //            }
    //        }
    //    }
    //    window.addEventListener("load", renderGrid, false);
    //    window.addEventListener("resize", renderGrid, false);

});

$(window).load(function() {

    // $('#list').masonry({ itemSelector: '.item' });

    // $(window).scroll(function() {
    //     if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //         load_more_articles();
    //     }
    // });

})

function load_more_articles() {
    var a_block = $(".more_article a");
    //        alert($(a_block).attr('href'));
    var page = $(a_block).attr('href');
    if (page == -1) {
        return;
    }
    var ajax_url = 'article_list';
    var ajax_data = { "section": section_name }
    if (section_name == 'Все') {
        console.log('ВСЕ');
        var ajax_data = {}
    }
    if (page != null) {
        console.log('HERE PAGE IS: ' + page);
        ajax_data["page"] = page
    }
    console.log("AJAX DATA: " + ajax_data['page'] + ' ' + ajax_data['section']);
    var state = ""
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "html",
        success: function(data) {
            page = parseInt(page) + 1;
            $(a_block).prop('href', page);
            //                alert(page);
            var content = $('.flex_container');
            content.append(data).masonry('appended', data, true);
            $(".flex_container").find(".one_read_article_img img").on("load", function() {
                $("#list").masonry('reloadItems');
                $("#list").masonry('layout');
            });
            //         function (html) {
            //     if (html.length > 0) {
            //         var el = jQuery(html);
            //         jQuery("#content").append(el).masonry( 'appended', el, true );
            //     }
            //      });
            //            window.history.pushState("object or string", "Title", state);
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
            if (status = 404) {
                $(a_block).prop('href', -1);
            }
        }
    });
}

// К-во элементов для подгрузки

var dowloadItem;

function itemDownload() {

    if ($(window).width() >= 970) {
        dowloadItem = 3;
    } else if ($(window).width() >= 570 && $(window).width() < 1170) {
        dowloadItem = 2;
    } else {
        dowloadItem = 1;
    }
    $(".more_records a").attr("href", dowloadItem);
}

// Download photo
function readURLoffer(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.imgOfferNews').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    $(".linkImg").val("");
}

function downloadLinkTosrc() {
    var srcNew = $(this).val();
    $('.imgOfferNews').attr('src', srcNew);
}
