if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

$(document).ready(function() {
    var tab = getUrlParameter('tab')
    if (typeof tab != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    }
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function() {

            var url = window.location.href;
            tab = getUrlParameter('tab');

            var ajax_url = '/posts';
            var ajax_data = {};
            var state = "";

            var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
            var previous_active_tab = $('div .menu_individualNews_active');
            previous_active_tab.removeClass('menu_individualNews_active');
            var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
            var new_active_tab = $(str_to_find);
            new_active_tab.addClass('menu_individualNews_active');
            if (typeof tab != 'undefined') {
                ajax_data['tab'] = tab;
                state += 'tab=' + tab;
            }
            var page = getUrlParameter('page')
            if (typeof page != 'undefined') {
                state += 'page=' + page;
                ajax_data['page'] = page;
            }
            if (!isEmpty(ajax_data)) {
                state = '?' + state;
                ajax_url += '/tabs';
            } else {
                ajax_url = '/tabs';
                ajax_data = { 'tab': 'all' }
            }
            $.ajax({
                url: ajax_url,
                data: ajax_data,
                dataType: "html",
                success: function(data) {
                    var content = $('.articles_list');
                    content.html(data);
                    //                window.history.pushState("object or string", "Title", state);
                },
                error: function(xhr, status, error) {}
            });
        });

    }

    load_posts('/posts/tabs', 'all', 1);


    $(document).on('click', '.pagination_page', function() {
        if (!$(this).hasClass('active')) {
            if ($(this).hasClass('pag_page')) {
                var need_page_number = parseInt($.trim($(this).text()))
            } else if ($(this).hasClass('prev_pag_page')) {
                var active_page_number = $.trim($('.active').text())
                var need_page_number = parseInt(active_page_number) - 1
            } else if ($(this).hasClass('next_pag_page')) {
                var active_page_number = $.trim($('.active').text())
                var need_page_number = parseInt(active_page_number) + 1
            }
        } else {
            return;
        }
        var tab = $('div .menu_individualNews_active').find('div').text();
        if (tab === 'Все') {
            tab = 'all';
        }
        $.ajax({
            url: '/posts/tabs',
            data: { 'tab': tab, 'page': need_page_number },
            dataType: "html",
            success: function(data) {
                var content = $('.articles_list');
                content.html(data);
                //                window.history.pushState("object or string", "Title", '?tab=' + tab + '&page=' + need_page_number);
            },
            error: function(xhr, status, error) {}
        });
    });

    $(document).on('click', '.positive_like', function(e) {
        e.preventDefault();
        var like_url = "/likes/post/modify";
        var a_block = $(this);
        var like_slug = a_block.attr("href");
        var pos_likes_count = a_block.text();
        count_block = $(this).find('span.likes_count');
        pos_likes_count = parseInt(pos_likes_count);
        var parent_div_tab = $(this).parent();
        $.ajax({
            url: like_url,
            data: { 'slug': like_slug, 'type': 0 },
            dataType: "json",
            success: function(data, textStatus, xhr) {
                console.log(data)
                var check_list = data['add_result']
                for (var i = 0; i < check_list.length; i++) {
                    var operation_result = check_list[i];
                    if (operation_result == 0) { // add positive
                        pos_likes_count = pos_likes_count + 1;
                    } else if (operation_result == 2) { // remove positive
                        pos_likes_count = pos_likes_count - 1;
                    } else if (operation_result == 3) { // remove negative
                        neg_like_block = $(parent_div_tab).find('a.negative_like');
                        neg_count_block = $(neg_like_block).find('span.likes_count');
                        var neg_likes_count = parseInt(neg_like_block.text());
                        neg_likes_count = neg_likes_count - 1;
                        neg_count_block.html(neg_likes_count.toString());
                    }
                }
                count_block.html(pos_likes_count.toString());
            },
            error: function(xhr, status, error) {}
        });
    });
    $(document).on('click', '.negative_like', function(e) {
        e.preventDefault();
        var like_url = "/likes/post/modify";
        var a_block = $(this);
        var like_slug = a_block.attr("href");
        var neg_likes_count = a_block.text();
        count_block = $(this).find('span.likes_count');
        neg_likes_count = parseInt(neg_likes_count);
        var parent_div_tab = $(this).parent();
        $.ajax({
            url: like_url,
            data: { 'slug': like_slug, 'type': 1 },
            dataType: "json",
            success: function(data, textStatus, xhr) {
                var check_list = data['add_result']
                for (var i = 0; i < check_list.length; i++) {
                    var operation_result = check_list[i];
                    if (operation_result == 1) { // add negative
                        neg_likes_count = neg_likes_count + 1;
                    } else if (operation_result == 3) { // remove negative
                        neg_likes_count = neg_likes_count - 1;
                    } else if (operation_result == 2) { // remove positive
                        pos_like_block = $(parent_div_tab).find('a.positive_like');
                        pos_count_block = $(pos_like_block).find('span.likes_count');
                        var pos_likes_count = parseInt(pos_like_block.text());
                        pos_likes_count = pos_likes_count - 1;
                        pos_count_block.html(pos_likes_count.toString());
                    }
                }
                count_block.html(neg_likes_count.toString());
            },
            error: function(xhr, status, error) {}
        });
    });

    $(".more_article").click(function(e) {
        $(this).addClass("moreLoading");
        ajaxPage(true)
    });

    $('.tab').click( function(e) {
        $('.more_article ').removeClass('endMore')
        var parent_div_tab = $(this).parent();
        var tab = $(this).text().trim();
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        previous_active_tab.find('li').removeAttr('id');
        parent_div_tab.addClass('menu_individualNews_active');
        if (tab === 'Все') {
            tab = 'all';
        }
        load_posts(url, tab, 2);
    });

    // Модальное окно 

    $(".one_tag_for_choose").on("click", function() {
        $(this).children(".flex_right").find(".choose_tag_success").toggleClass("success_tag");
        if ($(this).children(".flex_right").find(".choose_tag_success").hasClass("success_tag")) {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();
            $(".for_tag").append('<a href="#" class="tegArticle modalTag"><span class="tag_chosen"></span><span class="additional_tag"></span><span class="close_tag"><i class="fa fa-times" aria-hidden="true"></i></span></a>');
            $(".for_tag a:last-child .additional_tag").text(htmlString);
        } else {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();

            $('.tegArticle').each(function(i) {
                var tag = $(this).children('.additional_tag').text()
                if (tag == htmlString) {
                    $(this).remove();
                };
            });
        };
    });

    $(".modal_save").on("click", function() {
        var old_tags = []
        var new_tags = []
        $(".tab").each(function(i) {
            var tab = $(this).find('div').text();
            if (tab != "Все") {
                old_tags.push(tab);
            }
        });
        $(".additional_tag").each(function(i) {
            var tab = $(this).text(); //.attr("class");
            new_tags.push(tab);
        });
        var tags_to_delete = old_tags.filter(function(x) {
            return new_tags.indexOf(x) < 0
        })
        var tags_to_add = new_tags.filter(function(x) {
            return old_tags.indexOf(x) < 0
        })
        var add = false;
        var remove = false;
        $.ajax({
            url: 'change_user_tags/',
            data: {
                tags_delete: tags_to_delete,
                tags_add: tags_to_add,
                csrfmiddlewaretoken: getCookie('csrftoken')
            },
            method: "POST",
            success: function(data, textStatus, xhr) {
                location.reload();
            },
            error: function(xhr, status, error) {

            }
        });
    });

    $(".for_tag").on("click", ".close_tag", function() {
        $(this).parent().remove();
        var close_tag_text = $(this).parent().children(".additional_tag").text();
        $('.simple_tag').each(function(i) {
            if ($(this).text() == close_tag_text) {
                $(this).parent().parent().children(".flex_right").find(".choose_tag_success").removeClass("success_tag");
            };
        });
    });

    page_settings();

});

function ajaxPage(pageCount) {
    var page = parseInt($(".more_article").attr("data-page"));
    var tab = 'Все';
    var f = function() {
        var ajax_data = { "tab": tab },
            content = $('.news_stream'),
            state = "",
            $moreArt = $(".more_article");
        pageCount ? page += 1 : page = 2;
        if (tab === 'Все') tab = 'all';
        if (pageCount) ajax_data["page"] = page;

        $.ajax({
            url: '/posts/tabs',
            data: ajax_data,
            dataType: "html",
            cache: true,
            success: function(data) { //parametr:lastPage - true/false
                // if (lastPage) {
                pageCount ? content.append(data) : content.html(data);
                $moreArt.attr("data-page", page);
                $moreArt.removeClass("moreLoading");
                // } else {
                //     return $moreArt.addClass("endMore").removeClass("moreLoading");
                // }
                alert("Ura")
            },
            error: function(xhr, status, error) {
                alert("Error")
            }
        });
    }
    return f();
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

// Script author: Dima
function page_settings() {

    $(".linkImg").keyup(function() {
        // downloadLinkTosrc();
        var srcNew = $(this).val();
        $('.imgOfferNews').attr('src', srcNew);
    })

    // Download photo
    $("#offerImgDownload").change(function() {

        readURLoffer(this);
    });

    if ($('*').is('.content_coment')) {
        $(".comments_base2").show();
    } else {
        $(".comments_base2").hide();
    };

    if ($(".blockquote").length < 6) {
        $(".show_all_coment").hide();
        $(".blockquote").css("padding-bottom", "3%")
    } else {
        $(".show_all_coment").show();
    };

    $("body").on("click", ".pagination_page a, .pagination_page span", function() {
        $('html, body').animate({ scrollTop: 0 }, '0');

    });
}


function show_modal(modal_id) {
    $(modal_id).modal('toggle');
}

$(document).on("click", ".btn-ok", function(e) {
    var input_text = $('.textOfferNews').find('textarea').val();
    var input_image_url = $('.linkImg').val();
    propose_post(input_text, input_image_url);
    show_modal('#offerNewsModal');
});

function propose_post(text, image) {
    $.ajax({
        url: 'create/',
        data: {
            content: text,
            image_url: image,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {

        },
        error: function(xhr, status, error) {

        }
    });
}

var url = window.location.href;

function load_posts(url, tab, page) {
    $.ajax({
        url: url,
        data: { 'tab': tab },
        dataType: "html",
        success: function(data) {
            var content = $('.news_stream');
            content.html(data);
            $(".more_article").attr('data-page', 2);
            window.history.pushState("object or string", "Title", '/posts/tabs?tab=' + tab);
        },
        error: function(xhr, status, error) {}
    });
}


$(document).on("keyup", "#post_search", function(e){
    var page = parseInt($(".more_article").attr("data-page"));
    var $activeTab = $('div .menu_individualNews_active');
    var tabName = $activeTab.find(".tab_name").html();
    var searchTab = (tabName == 'Все' || typeof tabName == 'undefined') ? 'all' : tab;
    var query = $(this).val();
    var ajax_data = { "tab": searchTab, "q": query };
    $.ajax({
        url: '/posts/search/',
        data: ajax_data,
        dataType: "json",
        cache: true,
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.log("Error");
        }
    });
});

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
}

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
