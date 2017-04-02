function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
$(document).ready(function() {

    // Flex img
    // flexImg()

    $(document).mouseup(function(e) {
        var div = $("#top_profile_menu");
        var div_parent = $(".user_profile");
        if (!div.is(e.target) && div.has(e.target).length === 0 && !div_parent.is(e.target) && div_parent.has(e.target).length === 0) {
            div.hide();
            div_parent.removeClass("active_top_profile_menu");
        }
    });

    // Рейтинг посмотреть
    $(".users_progress").children("section").on("click", function() {
        var slideToogleElement = $(this).find(".contentRating");
        if ( $(this).hasClass("closedAkardion") ) {
            slideToogleElement.slideDown();
            $(this).removeClass("closedAkardion").addClass("openingAkardion");
            $(this).siblings().removeClass("openingAkardion").addClass("closedAkardion");
            $(this).siblings().children(".contentRating").slideUp(200)
        } else {
            slideToogleElement.slideUp();
            $(this).addClass("closedAkardion").removeClass("openingAkardion");
        }
    })

    // Close modal

    $(".close_modal").on("click touchstart", function() {
        $('#week_bets_top').modal('hide')
    });

    $('.relativeModal').on('click touchstart', function(e) {
        if (e.target !== this)
            return;

        $('#week_bets_top').modal('hide');
    });

    // $(window).resize(function() {
    //     flexImg();
    // });

    // Class users avatar
    $(".flexImg").children("img").each(function() {
        $(this).on("load", function() {
            if ($(this).height() < $(this).parent().height()) {
                $(this).parent().addClass("bigWidth")
            }
        })
    });

    // Offer article
    $(".linkImgArticle").keyup(function() {
        // downloadLinkTosrc();
        var srcNew = $(this).val();
        $('.imgOfferArticle').attr('src', srcNew);
        console.log("Privet")
    })

    // Download photo
    $("#offerArticleImgDownload").change(function() {
        readURLoffer(this);
    });



    $("nav li a").each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("activeNav");
        }
    });

    // Current link
    if ((location.pathname.split("/")[1]) !== "") {
        $('#mainNav a[href^="/' + location.pathname.split("/")[1] + '"]').parent().addClass('currentLink');
    }

    $('.modal-body').change(function() {
        console.log("sadasd");
    });

    $("body").css({ "padding-right": "0px" });


    $(".user_profile").click(function() {
        $("#top_profile_menu").slideToggle("fast", function() {
            if ($(".user_profile").hasClass("active_top_profile_menu")) {
                $(".user_profile").removeClass("active_top_profile_menu");
            } else {
                $(".user_profile").addClass("active_top_profile_menu");
            };
        });
    });

    // Make bet

    // Показать достижения пользователя

    $("#open_user_results").on("click", function() {
        $(".drop_down_users_results").slideToggle("slow");
    });

    // Выбор медали в достижениях юзера

    $(".place_result").each(function(i) {
        var place_user = $(this).find("span").text();
        if (place_user == "1") {
            $(this).addClass("gold_vedal");
        } else if (place_user == "2") {
            $(this).addClass("sliver_medal");
        } else if (place_user == "3") {
            $(this).addClass("bronze_medal");
        } else {
            console.log("pizdos")
        }
    })

    // Background position for img column right
    for (var i = 0; i < $(".bets_one_championship").length; i++) {
        $(".bets_one_championship").eq(i).css({
            "background-position-y": (-60 * i)
        });
    };

    // Background position nav all bets
    for (var i = 0; i < $(".change_champ").length; i++) {
        $(".change_champ").eq(i).css({
            "background-position-x": ((-83 * i) - 25)
        });
    };

    // Стрелки для просмотра туров которые не поместились в основной блок

    function left_tour() {
        var width_li_tour = $(".nav_ul_tour li").width();
        var margin_left_ul = parseInt($(".nav_ul_tour").css('margin-left'));

        if (margin_left_ul < 0) {
            $(this).unbind('click');
            $(".nav_ul_tour").animate({ 'margin-left': '+=' + width_li_tour }, 300, function() {
                $('#arrow_left_tour').bind('click', left_tour);
            });
        } else {
            return;
        };
    }

    function right_tour() {
        var width_li_tour = $(".nav_ul_tour li").width();
        var li_lenght = $(".nav_ul_tour li").length;
        var margin_left_ul = parseInt($(".nav_ul_tour").css('margin-left'));
        var width_ul = $(".nav_ul_tour").width();
        if ((li_lenght * width_li_tour) <= width_ul) {
            return;
        } else {
            var max_click_right = ((li_lenght * width_li_tour) - width_ul - width_li_tour);
            if ((margin_left_ul - max_click_right) == 0) {
                return;
            } else {
                $(this).unbind('click');
                $(".nav_ul_tour").animate({ 'margin-left': '-=' + width_li_tour }, 300, function() {
                    $('#arrow_right_tour').bind('click', right_tour);
                });
            }
        }
        return;
    }

    $("#arrow_left_tour").bind('click', left_tour);

    $("#arrow_right_tour").bind('click', right_tour);

    // Выбор недели в модальном окне
    $(".body_user_choice").children(".history_bet").eq(0).show();
    $(".body_user_choice").children(".history_bet").eq(0).children(".your_result_after").hide();
    var length_history_bet = $(".body_user_choice").children(".history_bet").length;
    for (var i = 1; i < length_history_bet; i++) {
        $(".body_user_choice").children(".history_bet").eq(i).find(".total_kof").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".delete_this_this_choice").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".success_bet").hide();
        $(".body_user_choice").children(".history_bet").eq(i).find(".not_results").hide();
    }

    $(".next_week_bet").bind('click', prev_week);

    $(".prev_week_bet").bind('click', next_week);

    arraySum(arr);

});



// Menu toggle

$("#menuBtn").on("click", function() {
    $(this).toggleClass("openNav");
    // $(this).toggleClass("closeNav");

    $("#mainNav").slideToggle();
    $("#menu").toggleClass("openMenu");
    $("body").toggleClass("menu_open");

});

// For modal
$(".headerAllnews .btn").on("click", function() {
    $("#offerNewsModal").modal('show')
})

// Модальное окно предложить артикл

// Download photo
function readURLoffer(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.imgOfferArticle').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    $(".linkImgArticle").val("");
}

function downloadLinkTosrc() {
    var srcNew = $(this).val();
    $('.imgOfferArticle').attr('src', srcNew);
}


// function flexImg() {
//     $(".flexImg").children("img").each(function() {
//         $(this).parent().removeClass("bigWidth");
//         $(this).on("load", function() {
//             if ($(this).height() < $(this).parent().height()) {
//                 $(this).parent().addClass("bigWidth");
//             }
//         })
//     });
// }
