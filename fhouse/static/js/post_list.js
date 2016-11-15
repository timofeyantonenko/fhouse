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
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
$(document).ready(function() {
    var tab = getUrlParameter('tab')
    if (typeof tab != 'undefined'){
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
        if (typeof tab != 'undefined'){
            ajax_data['tab'] = tab;
            state += 'tab=' + tab;
        }
        var page = getUrlParameter('page')
        if (typeof page != 'undefined'){
            console.log('1');
            state += 'page=' + page;
            ajax_data['page'] = page;
        }
        if (!isEmpty(ajax_data)){
            state = '?' + state;
            ajax_url += '/tabs';
        }
        else {
            ajax_url = '/tabs';
            ajax_data = {'tab': 'all'}
        }
            $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data){
                var content = $('.articles_list');
                content.html(data);
//                window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
    });

  }
$(document).on('click', '.tab', function(){
        var url = '/posts/tabs';
        var parent_div_tab = $(this).parent();
        var tab = $(this).find('div').text();
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        previous_active_tab.find('li').removeAttr('id');
        parent_div_tab.addClass('menu_individualNews_active');

         if (tab === 'Все'){
            tab = 'all';
            $.ajax({
                url: url,
                data: {'tab': tab},
                dataType: "html",
                success: function(data){
                    var content = $('.articles_list');
                    content.html(data);
                    window.history.pushState("object or string", "Title", '?tab=' + tab);
                },
                error: function(xhr, status, error){
                    console.log(error, status, xhr);
                }
        });
        }
        else {
//            tab = tab;

        $.ajax({
            url: url,
            data: {'tab': tab},
            dataType: "html",
            success: function(data){
                var content = $('.articles_list');
                content.html(data);
                window.history.pushState("object or string", "Title", '?tab=' + tab);
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
        }
    });

$(document).on('click', '.pagination_page', function(){
        if (!$(this).hasClass('active')) {
            if ($(this).hasClass('pag_page')){
                var need_page_number = parseInt($.trim($(this).text()))
            }
            else if ($(this).hasClass('prev_pag_page')){
                var active_page_number = $.trim($('.active').text())
                var need_page_number = parseInt(active_page_number) - 1
            }
            else if ($(this).hasClass('next_pag_page')){
                var active_page_number = $.trim($('.active').text())
                var need_page_number = parseInt(active_page_number) + 1
            }
        }
        else {
            return;
        }
        var tab = $('div .menu_individualNews_active').find('div').text();
        if (tab === 'Все'){
            tab = 'all';
        }
        $.ajax({
            url: '/posts/tabs',
            data: {'tab': tab, 'page': need_page_number},
            dataType: "html",
            success: function(data){
                var content = $('.articles_list');
                content.html(data);
                window.history.pushState("object or string", "Title", '?tab=' + tab + '&page=' + need_page_number);
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
    });
$(document).on('click', '.positive_like', function(e){
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
    data: {'slug': like_slug, 'type': 0},
    dataType: "json",
    success: function(data, textStatus, xhr){
    var check_list = data['add_result']
    for (var i = 0; i < check_list.length; i++) {
        var operation_result = check_list[i];
        if (operation_result == 0){ // add positive
            pos_likes_count = pos_likes_count + 1;
        }
        else if (operation_result == 2){ // remove positive
            pos_likes_count = pos_likes_count - 1;
        }
        else if (operation_result == 3){ // remove negative
            neg_like_block = $(parent_div_tab).find('a.negative_like');
            neg_count_block = $(neg_like_block).find('span.likes_count');
            var neg_likes_count = parseInt(neg_like_block.text());
            neg_likes_count = neg_likes_count - 1;
            neg_count_block.html(neg_likes_count.toString());
        }
    }
        count_block.html(pos_likes_count.toString());
    },
    error: function(xhr, status, error){
        console.log(error, status, xhr);
    }
        });
});
$(document).on('click', '.negative_like', function(e){
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
    data: {'slug': like_slug, 'type': 1},
    dataType: "json",
    success: function(data, textStatus, xhr){
    var check_list = data['add_result']
    for (var i = 0; i < check_list.length; i++) {
        var operation_result = check_list[i];
        if (operation_result == 1){ // add negative
            neg_likes_count = neg_likes_count + 1;
        }
        else if (operation_result == 3){ // remove negative
            neg_likes_count = neg_likes_count - 1;
        }
        else if (operation_result == 2){ // remove positive
            pos_like_block = $(parent_div_tab).find('a.positive_like');
            pos_count_block = $(pos_like_block).find('span.likes_count');
            var pos_likes_count = parseInt(pos_like_block.text());
            pos_likes_count = pos_likes_count - 1;
            pos_count_block.html(pos_likes_count.toString());
        }
    }
        count_block.html(neg_likes_count.toString());
    },
    error: function(xhr, status, error){
        console.log(error, status, xhr);
    }
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

    $(document).ajaxComplete(function() {
        $('.IMGoneArticle img').each(function(i) {
            if ($(this).css("height") < $(this).parent().css("height")) {
                $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
                $(this).parent().css({ "display": "flex", "justify-content": "center" });
            } else {
                var par_width = $(this).parent().css("width")
                $(this).css({ "height": " ", "width": par_width });
                $(this).parent().css({ "display": "block", });
            }
        });
    })

    $('.IMGoneArticle img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        } else {
            var par_width = $(this).parent().css("width")
            $(this).css({ "height": " ", "width": par_width });
            $(this).parent().css({ "display": "block", });
        }
    });
});

// End dimas script