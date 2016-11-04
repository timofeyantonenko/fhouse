$(document).ready(function() {
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
                url: '/tabs',
                data: { 'tab': tab },
                dataType: "html",
                success: function(data) {
                    var content = $('.articles');
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
                    var content = $('.articles');
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
        var className = $(this).attr('class');
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
        }
        var tab = $('div .menu_individualNews_active').find('div').text();
        if (tab === 'Все') {
            tab = 'all';
        }
        $.ajax({
            url: '/tabs',
            data: { 'tab': tab, 'page': need_page_number },
            dataType: "html",
            success: function(data) {
                var content = $('.articles');
                content.html(data);
                window.history.pushState("object or string", "Title", '?tab=' + tab + '&page=' + need_page_number);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });
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

$(document).ajaxComplete(function(){
    $('.IMGoneArticle img').each(function(i) {
    if ($(this).css("height") < $(this).parent().css("height")) {
        $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
        $(this).parent().css({ "display": "flex", "justify-content": "center" });
    }
});
})

$('.IMGoneArticle img').each(function(i) {
    if ($(this).css("height") < $(this).parent().css("height")) {
        $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
        $(this).parent().css({ "display": "flex", "justify-content": "center" });
    }
});
