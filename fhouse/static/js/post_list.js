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
                url: '/tabs',
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
});

