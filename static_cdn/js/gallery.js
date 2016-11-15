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
$(document).ready(function(){
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
        var ajax_url = 'slider_photo_list';
        var ajax_data = {}
        var state = ""
        $.ajax({
            url: ajax_url,
            data: ajax_data,
            dataType: "html",
            success: function(data){
                var content = $('.slider_photo_list');
                content.html(data);
//                window.history.pushState("object or string", "Title", state);
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
    }

// Активный раздел меню
//$(".nav_ul li:first-child a").addClass("active_nav_ul");

$(".nav_ul li a").click(function(e) {
    e.preventDefault();
    $(".nav_ul li a").removeClass('active_nav_ul');
    section =  $(this);
    section_name = section.text().trim();
    // Active section of menu
    section.addClass("active_nav_ul");
    var ajax_url = 'slider_photo_list';
    var ajax_data = {"section": section_name}
    var state = ""
    $.ajax({
        url: ajax_url,
        data: ajax_data,
        dataType: "html",
        success: function(data){
            var content = $('.slider_photo_list');
            content.html(data);
//            window.history.pushState("object or string", "Title", state);
        },
        error: function(xhr, status, error){
            console.log(error, status, xhr);
        }
    });
});


$(document).on('click', '.foto_left', function(){
//$('.foto_left').click(function() {
    $('.left_right_foto').animate({ left: '+=798.656' });
});

$(document).on('click', '.foto_right', function(){
//$('.foto_right').click(function() {
    console.log('RIIIGHT');
    $('.left_right_foto').css('left', '-=798.656');
});


if ($(".left_right_foto:nth-child(1)").css("left") == "0px") {
    $(".foto_left").hide();
} else {

    $(".foto_left").show();
};

$(document).on('click', '.foto_right', function(){
//$(".foto_right").on('click', function() {
    console.log('RIIIGHT2');
    $(".foto_left").show();
});

$(document).on('click', '.foto_left', function(){
//$(".foto_left").on('click', function() {
    $(".foto_right").show();
});

$(document).on('click', '.foto_left', function(){
//$(".foto_left").on('click', function() {
	if($(".album_foto .left_right_foto:nth-child(2)").css("left") == "0px") {
		$(".foto_left").hide();
	} else $(".foto_left").show(); 
});

$(document).on('click', '.foto_right', function(){
//$(".foto_right").on('click', function() {

    console.log('RIIIGHT3');
	if($(".album_foto .left_right_foto:nth-last-child(2)").css("left") == "0px") {
		$(".foto_right").hide();
	} else $(".foto_right").show(); 
});



//$(".nav_ul li").on('click', function() {
//    if ($(this).is(":first-child")) {
//        $(".album_foto:nth-child(1)").show();
//        $(".album_foto:nth-child(5)").hide();
//        $(".album_foto:nth-child(2)").hide();
//        $(".album_foto:nth-child(3)").hide();
//        $(".album_foto:nth-child(4)").hide();
//
//    } else if ($(this).is(":nth-child(2)")) {
//        $(".album_foto:nth-child(2)").show();
//        $(".album_foto:nth-child(1)").hide();
//        $(".album_foto:nth-child(5)").hide();
//        $(".album_foto:nth-child(3)").hide();
//        $(".album_foto:nth-child(4)").hide();
//
//    } else if ($(this).is(":nth-child(3)")) {
//        $(".album_foto:nth-child(3)").show();
//        $(".album_foto:nth-child(1)").hide();
//        $(".album_foto:nth-child(2)").hide();
//        $(".album_foto:nth-child(5)").hide();
//        $(".album_foto:nth-child(4)").hide();
//
//    } else if ($(this).is(":nth-child(4)")) {
//        $(".album_foto:nth-child(4)").show();
//        $(".album_foto:nth-child(1)").hide();
//        $(".album_foto:nth-child(2)").hide();
//        $(".album_foto:nth-child(3)").hide();
//        $(".album_foto:nth-child(5)").hide();
//
//    } else {
//        $(".album_foto:nth-child(5)").show();
//        $(".album_foto:nth-child(1)").hide();
//        $(".album_foto:nth-child(2)").hide();
//        $(".album_foto:nth-child(3)").hide();
//        $(".album_foto:nth-child(4)").hide();
//
//    }
//});

$('.main_foto_albub img').each(function(i) {
    if ($(this).css("height") < $(this).parent().css("height")) {
        $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
        $(this).parent().css({ "display": "flex", "justify-content": "center" });
    }
});

});