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
        //    window.history.pushState({}, '', window.history.state);
        $(window).on('popstate', function() {
            //    alert('test');

            var url = window.location.href;
            console.log('before' + url);
            //    window.history.pushState({}, '', url);
            var ajax_url = '/posts'
            var ajax_data = {}
            var state = ""
            var tab = getUrlParameter('tab')
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
                console.log('1');
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
                error: function(xhr, status, error) {
                    console.log(error, status, xhr);
                }
            });
        });

    }
    $(document).on('click', '.tab', function() {
        var url = '/posts/tabs';
        var parent_div_tab = $(this).parent();
        var tab = $(this).find('div').text();
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        previous_active_tab.find('li').removeAttr('id');
        parent_div_tab.addClass('menu_individualNews_active');

        if (tab === 'Все') {
            tab = 'all';
            $.ajax({
                url: url,
                data: { 'tab': tab },
                dataType: "html",
                success: function(data) {
                    var content = $('.articles_list');
                    content.html(data);
                    window.history.pushState("object or string", "Title", '?tab=' + tab);
                },
                error: function(xhr, status, error) {
                    console.log(error, status, xhr);
                }
            });
        } else {
            //            tab = tab;

            $.ajax({
                url: url,
                data: { 'tab': tab },
                dataType: "html",
                success: function(data) {
                    var content = $('.articles_list');
                    content.html(data);
                    window.history.pushState("object or string", "Title", '?tab=' + tab);
                },
                error: function(xhr, status, error) {
                    console.log(error, status, xhr);
                }
            });
        }
    });

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
                img_norm_size();
                window.history.pushState("object or string", "Title", '?tab=' + tab + '&page=' + need_page_number);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
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
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
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
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });

    $(".more_article a").click(function(e) {
        e.preventDefault();
        var a_block = this;
        var page = $(this).attr('href');
        if (page == -1){
            return;
        }
        var state = ""
        var tab = $('div .menu_individualNews_active').find('div').text();
        if (tab === 'Все') {
            tab = 'all';
        }
        var ajax_data = { "tab": tab }
        if (page != null) {
            console.log('HERE PAGE IS: ' + page);
            ajax_data["page"] = page
        }
        console.log("AJAX DATA: " + ajax_data['page'] + ' ' + ajax_data['section']);
        $.ajax({
            url: '/posts/tabs',
            data: ajax_data,
            dataType: "html",
            success: function(data) {
                page = parseInt(page) + 1;
                $(a_block).prop('href', page);
                var content = $('.articles_list');
                content.append(data);
                img_norm_size();
//                window.history.pushState("object or string", "Title", '?tab=' + tab + '&page=' + need_page_number);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
                if (status = 404){
                    $(a_block).prop('href', -1);
                }
            }
        });
    });

    // Модальное окно 

    $(".one_tag_for_choose").on("click", function() {
        $(this).children(".flex_right").find(".choose_tag_success").toggleClass("success_tag");
        if ($(this).children(".flex_right").find(".choose_tag_success").hasClass("success_tag")) {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();
            $(".for_tag").append('<a href="#" class="tegArticle"><span class="tag_chosen"></span><span class="additional_tag"></span><span class="close_tag"><i class="fa fa-times" aria-hidden="true"></i></span></a>');
            $(".for_tag a:last-child .additional_tag").text(htmlString);
        } else {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();

            $('.tegArticle').each(function(i) {
                var tag = $(this).children('.tag_chosen').text()
                    // alert(tag)
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
            console.log("USER TAB: " + tab);
            if (tab != "Все") {
                old_tags.push(tab);
            }
        });
        $(".additional_tag").each(function(i) {
            var tab = $(this).text(); //.attr("class");
            console.log("ALL TAB: " + tab);
            new_tags.push(tab);
        });
        //        console.log(old_tags);
        //        console.log(new_tags);
        var tags_to_delete = old_tags.filter(function(x) {
            return new_tags.indexOf(x) < 0 })
        console.log("to delete: " + tags_to_delete);
        var tags_to_add = new_tags.filter(function(x) {
            return old_tags.indexOf(x) < 0 })
        console.log("to add: " + tags_to_add);
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
                console.log(error, status, xhr);
            }
        });
        //        $.ajax({
        //            url: 'delete_user_tag/',
        //            data: {'tag_name': tags_to_delete[0],
        //            csrfmiddlewaretoken: getCookie('csrftoken')},
        ////            dataType: "json",
        //            method: "POST",
        //            success: function(data, textStatus, xhr) {
        //                remove = true;
        //            console.log('OOO1' + remove);
        //            },
        //            error: function(xhr, status, error) {
        //                console.log(error, status, xhr);
        //            }
        //        });
        //        $.ajax({
        //            url: 'add_user_tag/',
        //            data: {'tag_name': tags_to_add[0],
        //            csrfmiddlewaretoken: getCookie('csrftoken')},
        ////            dataType: "json",
        //            method: "POST",
        //            success: function(data, textStatus, xhr) {
        //                add = true;
        //                console.log('OOO' + add);
        //            },
        //            error: function(xhr, status, error) {
        //                console.log(error, status, xhr);
        //            }
        //        });
        //        console.log(add + ' ' + remove)
        //        if (add || remove){
        //
        //            console.log('true');
        //            location.reload();
        //        }
        //        else{
        //            console.log('false');
        //        }
    });



    $(".for_tag").on("click", ".close_tag", function() {
        $(this).parent().remove();
        var close_tag_text = $(this).parent().children(".tag_chosen").text();

        $('.simple_tag').each(function(i) {
            // alert(close_tag_text)
            if ($(this).text() == close_tag_text) {
                // console.log($(this).text() + "закрывающего тега");
                // console.log(close_tag_text + "где нужно убрать класс");
                $(this).parent().parent().children(".flex_right").find(".choose_tag_success").removeClass("success_tag");
                // alert($(this).text())
            };

        });


    });

});

// Script author: Dima
$(document).ready(function() {


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





});

// Правильный код для картинок 

var img_norm_size = function() {
    $('.IMGoneArticle img').each(function(i) {
        $(this).load(function() {
            console.log($(this).height() + " child");
            console.log($(this).parent().height() + " parent]");
            if ($(this).css("height") < $(this).parent().css("height")) {
                $(this).parent().css({ "display": "flex", "justify-content": "center" });
                $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            };

        });

    });
};

// $(window).load(function() {


//     $(document).ajaxComplete(function() {

//         $('.IMGoneArticle img').each(function(i) {
//             if ($(this).css("height") < $(this).parent().css("height")) {
//                 console.log($(this).attr('src') + ' | ' + $(this).height());
//                 $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
//                 $(this).parent().css({ "display": "flex", "justify-content": "center" });
//             }
//         });
//     });

//     $('.IMGoneArticle img').each(function(i) {
//         if ($(this).css("height") < $(this).parent().css("height")) {
//             console.log($(this).attr('src') + ' | ' + $(this).height());
//             $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
//             $(this).parent().css({ "display": "flex", "justify-content": "center" });
//         }
//     });


// });

// Фиксация блока меньшей высоты
$(window).load(function() {

    var height = $(".colum").height();
    var biggest_col;
    $(".colum").each(function(i) {

        if ($(this).height() < height) {
            height = $(this).height()
        } else {
            biggest_col = $(this);
        };

    });

    var min_height_block;

    $(".colum").each(function(i) {

        if ($(this).height() == height) {
            min_height_block = $(this);
        };

    });

    var width_min_height_block = $(min_height_block).width();
    var height_min_height_block = $(min_height_block).height();
    $(min_height_block).css({ "width": width_min_height_block, "height": height_min_height_block });
    $(min_height_block).children().css({ "width": width_min_height_block });

    var left_col = $(min_height_block).offset().left;

    if (min_height_block.height() + 70 < document.documentElement.clientHeight) {
        $(min_height_block).addClass("fixed_col_top");
        $(min_height_block).css("bottom", (document.documentElement.clientHeight - min_height_block.height() - 70));
        $(min_height_block).css("left", left_col);

        $(window).scroll(function() {
            if ($(this).scrollTop() > ((document.documentElement.clientHeight - (min_height_block.height() + 50)) + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                $('.fixed_col_top').css('top', 'inherit');
                $(min_height_block).css("bottom", bottom_scroll);


            } else {
                $('.fixed_col_top').css('top', '70px');
                $('.fixed_col_top').css('bottom', 'inherit');
            };
        })

    } else {
        $(window).scroll(function() {
            if ($(this).scrollTop() > (45 + height - document.documentElement.clientHeight + $(".navbar").height()) && $(this).scrollTop() <= (50 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                $(min_height_block).addClass("fixed_col");
                $(min_height_block).css("left", left_col);
                $(min_height_block).css("bottom", "25px")

            } else if ($(this).scrollTop() > (45 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                $(min_height_block).css("bottom", bottom_scroll);
            } else {


                $(min_height_block).removeClass("fixed_col");
                $(min_height_block).css({ "left": "0px", "bottom": "0px" });
            }
        });
    }



});
