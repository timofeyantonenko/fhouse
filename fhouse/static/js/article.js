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
    var section = getUrlParameter('section');
    if (typeof section != 'undefined'){
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    }
    else {
        section =  $(".nav_ul li:first-child a");
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
            success: function(data){
                var content = $('.flex_container');
                content.html(data);
                $(".one_read_article:nth-child(3n+1)").css("margin-left", "0");
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
    }


//tab click
$(".nav_ul li a").click(function(e) {
    if($(this).hasClass('active_nav_ul')){
        return;
    }
    e.preventDefault();
    $(".nav_ul li a").removeClass('active_nav_ul');
    section =  $(this);
    section_name = section.text().trim();
    console.log(section_name);
    // Active section of menu
    section.addClass("active_nav_ul");
    var ajax_url = 'article_list';
    var ajax_data = {"section": section_name}
    if (section_name == 'Все'){
    console.log('ВСЕ');
    var ajax_data = {}
    }

    console.log(ajax_data);
    var state = ""
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "html",
        success: function(data){
            var content = $('.flex_container');
            content.html(data);
            $(".one_read_article:nth-child(3n+1)").css("margin-left", "0");
//            window.history.pushState("object or string", "Title", state);
        },
        error: function(xhr, status, error){
            console.log(error, status, xhr);
        }
    });
});


    $(".one_read_article:nth-child(3n+1)").css("margin-left", "0");

});

$(window).load(function(){
$(document).ajaxComplete(function() {
    $('.one_read_article_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            console.log('main: ' + $(this).attr('src') + ' || ' + $(this).height());
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });
    });
        $('.one_read_article_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            console.log($(this).attr('src'));
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });
})
