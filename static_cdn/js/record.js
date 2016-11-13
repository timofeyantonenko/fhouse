$(document).ready(function() {
    $('.statsCard .thumbnail:first-child, .statsCard .thumbnail:nth-child(2), .statsCard .thumbnail:nth-child(3)').show();
    $(".thumbnail:nth-child(3n)").css("margin-right", "0");
    $(".statsCard .statsList .statsRow:last-child").css("border-bottom", "3px solid #e8e8e8");

    $("body").on("click", ".more_records", function() {
        $('.statsCard .thumbnail:nth-child(4), .statsCard .thumbnail:nth-child(5), .statsCard .thumbnail:nth-child(6)').show();
    });


    var width_thumb = $('.statsCard .thumbnail:nth-child(1)').css("margin-right");
    $('.statsCard .thumbnail').css('margin-bottom', width_thumb);

});
