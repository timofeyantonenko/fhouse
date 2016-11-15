$(document).ready(function() {
    $('.one_news_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });

    $('one_news_img img').each(function(i) {
        if ($(this).css("width") < $(this).parent().css("width")) {
            $(this).css({ "width": "100%", "align-self": "center" });
            $(this).parent().css({ "display": "block", });
        }
    });
});
