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

    $(".thumbnail:nth-child(3n)").css("margin-right", "0");
    $(".statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");

    var width_parent_statinfo = $(".statsHero .statInfo").parent().width()-120;    
    $(".statsHero .statInfo").css("max-width", width_parent_statinfo);

});
