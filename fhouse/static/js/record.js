$('.statsCard .thumbnail:first-child, .statsCard .thumbnail:nth-child(2), .statsCard .thumbnail:nth-child(3)').show();
$(".thumbnail:nth-child(3n)").css("margin-right", "0");
$(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");

$("body").on("click", ".more_records", function() {
    $('.statsCard .thumbnail:nth-child(4), .statsCard .thumbnail:nth-child(5), .statsCard .thumbnail:nth-child(6)').show();
});


var width_thumb = $('.statsCard .thumbnail:nth-child(1)').css("margin-right");
$('.statsCard .thumbnail').css('margin-bottom', width_thumb);

// js for post_list

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
