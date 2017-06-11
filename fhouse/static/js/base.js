$(document).ready(function() {

    var documentWidth = parseInt(document.documentElement.clientWidth),
        windowsWidth = parseInt(window.innerWidth),
        scrollbarWidth = windowsWidth - documentWidth,
        paddingLeft1 = 575 + scrollbarWidth/2,
        paddingRight1 = 575 - scrollbarWidth/2,
        paddingLittle = scrollbarWidth / 2,
        styleHtml = `
            @media screen and (min-width: 1170px) {
                body.modal-open #menu {
                    padding-left: calc(50% - ` + paddingLeft1 + `px) !important;
                    padding-right: calc(50% - ` + paddingRight1 + `px) !important;
                }
            }

            @media screen and (min-width: 970px) and (max-width: 1169px) {
                body.modal-open #menu {
                    padding-right: calc(2.5% + ` + scrollbarWidth + `px) !important;
                }
            }
        `;

    $("#mainStyle").html(styleHtml);

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
        if ($(this).hasClass("closedAkardion")) {
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
        if (this.href == window.location.href) $(this).addClass("activeNav");
    });

    // Current link
    if ((location.pathname.split("/")[1]) !== "") {
        $('#mainNav a[href^="/' + location.pathname.split("/")[1] + '"]').parent().addClass('currentLink');
    }

    $('.modal-body').change(function() {

    });

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
    });

    // Выбор недели в модальном окне
    $(".body_user_choice").children(".history_bet").eq(0).show();
    $(".body_user_choice").children(".history_bet").eq(0).children(".your_result_after").hide();
    var length_history_bet = $(".body_user_choice").children(".history_bet").length;
    for (var i = 1; i < length_history_bet; i++) {
        var $userChoise = $(".body_user_choice").children(".history_bet").eq(i);
        $userChoise.find(".total_kof").hide();
        $userChoise.find(".delete_this_this_choice").hide();
        $userChoise.find(".success_bet").hide();
        $userChoise.find(".not_results").hide();
    }

    $(".next_week_bet").bind('click', prev_week);
    $(".prev_week_bet").bind('click', next_week);

    arraySum(arr);

});


// Menu toggle

$("#menuBtn").on("click", function() {
    $(this).toggleClass("openNav");
    $("#mainNav").slideToggle();
    $("#menu").toggleClass("openMenu");
    $("body").toggleClass("menu_open");

});

// For modal
$(".headerAllnews .btn").on("click", function() {
    $("#offerNewsModal").modal('show')
});

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
