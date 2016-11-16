$(document).ready(function() {

    $(".thumbnails:nth-child(3n)").css("margin-right", "0");
    $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");

    var width_thumb = $('.statsCard .thumbnails:nth-child(1)').css("margin-right");
    $('.statsCard .thumbnails').css('margin-bottom', width_thumb);

    var width_parent_statinfo = $(".statsHero .statInfo").parent().width() - 120;
    $(".statsHero .statInfo").css("max-width", width_parent_statinfo);

    $(".nav_ul li:first-child a").addClass("active_nav_ul");

    $(".nav_ul li a").click(function(e) {
        e.preventDefault();
        $(".nav_ul li a").removeClass('active_nav_ul');
        $(this).addClass('active_nav_ul');
    });

    var width_parent_statinfo = $(".statsHero .statInfo").parent().width()-150;    
    $(".statsHero .statInfo").css("max-width", width_parent_statinfo);

});
