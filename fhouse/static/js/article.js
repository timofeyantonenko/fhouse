$(document).ready(function() {
    $(".one_read_article:nth-child(3n+1)").css("margin-left", "0");

    $(".nav_ul li:first-child a").addClass("active_nav_ul");

    $(".nav_ul li a").click(function(e) {
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        $(this).addClass('active_nav_ul');
    });

    $('.one_read_article_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });
    $('.one_read_article_img img').each(function(i) {
        if ($(this).css("width") < $(this).parent().css("width")) {
            $(this).css({ "width": "100%", "align-self": "center" });
            $(this).parent().css({ "display": "block", });
        }
    });
});
