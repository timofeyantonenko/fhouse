$(document).ready(function() {

    $(".user_profile").click(function() {
        if ($("#top_profile_menu").is(":hidden")) {

            $("#top_profile_menu").slideDown("fust");
            $(".user_profile").addClass("active_top_profile_menu ");

        } else {

            $("#top_profile_menu").slideUp("fust");
            $(".user_profile").removeClass("active_top_profile_menu ");

        }
        return false;
    });

    $(document).mouseup(function(e) { 
        var div = $("#top_profile_menu"); 
        var div_parent = $(".user_profile");
        if (!div.is(e.target) 
            && div.has(e.target).length === 0 
            && !div_parent.is(e.target) 
            && div_parent.has(e.target).length === 0) { 
            div.hide();
            div_parent.removeClass("active_top_profile_menu");
        }
    });


});
