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
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
$(document).ready(function() {
    $(document).on('click', '.like_all', function(e) {
        e.preventDefault();
        var like_url = "/likes/post/modify";
        var a_block = $(this);
        var like_slug = a_block.attr("href");
        var pos_likes_count = a_block.text();
        count_block = $(this).find('div.quantity_like');
        pos_likes_count = parseInt(pos_likes_count);
        var parent_div_tab = $(this).parent();
        $.ajax({
            url: like_url,
            data: { 'slug': like_slug, 'type': 0 },
            dataType: "json",
            success: function(data, textStatus, xhr) {
                var check_list = data['add_result']
                for (var i = 0; i < check_list.length; i++) {
                    var operation_result = check_list[i];
                    if (operation_result == 0) { // add positive
                        pos_likes_count = pos_likes_count + 1;
                    } else if (operation_result == 2) { // remove positive
                        pos_likes_count = pos_likes_count - 1;
                    } else if (operation_result == 3) { // remove negative
                        neg_like_block = $(parent_div_tab).find('a.dislike_all');
                        neg_count_block = $(neg_like_block).find('div.quantity_dislike');
                        var neg_likes_count = parseInt(neg_like_block.text());
                        neg_likes_count = neg_likes_count - 1;
                        neg_count_block.html(neg_likes_count.toString());
                    }
                }
                count_block.html(pos_likes_count.toString());
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });
    $(document).on('click', '.dislike_all', function(e) {
        e.preventDefault();
        var like_url = "/likes/post/modify";
        var a_block = $(this);
        var like_slug = a_block.attr("href");
        var neg_likes_count = a_block.text();
        count_block = $(this).find('div.quantity_dislike');
        neg_likes_count = parseInt(neg_likes_count);
        var parent_div_tab = $(this).parent();
        $.ajax({
            url: like_url,
            data: { 'slug': like_slug, 'type': 1 },
            dataType: "json",
            success: function(data, textStatus, xhr) {
                var check_list = data['add_result']
                for (var i = 0; i < check_list.length; i++) {
                    var operation_result = check_list[i];
                    if (operation_result == 1) { // add negative
                        neg_likes_count = neg_likes_count + 1;
                    } else if (operation_result == 3) { // remove negative
                        neg_likes_count = neg_likes_count - 1;
                    } else if (operation_result == 2) { // remove positive
                        pos_like_block = $(parent_div_tab).find('a.like_all');
                        pos_count_block = $(pos_like_block).find('div.quantity_like');
                        var pos_likes_count = parseInt(pos_like_block.text());
                        pos_likes_count = pos_likes_count - 1;
                        pos_count_block.html(pos_likes_count.toString());
                    }
                }
                count_block.html(neg_likes_count.toString());
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
    });


    // Фиксация блока меньшей высоты
    $(window).load(function() {

        var height = $(".colum").height();
        var biggest_col;
        $(".colum").each(function(i) {

            if ($(this).height() < height) {
                height = $(this).height()
            } else {
                biggest_col = $(this);
            };

        });

        var min_height_block;

        $(".colum").each(function(i) {

            if ($(this).height() == height) {
                min_height_block = $(this);
            };

        });

        var width_min_height_block = $(min_height_block).width();
        var height_min_height_block = $(min_height_block).height();
        $(min_height_block).css({ "width": width_min_height_block, "height": height_min_height_block });
        $(min_height_block).children().css({ "width": width_min_height_block });

        var left_col = $(min_height_block).offset().left;

        if (min_height_block.height() + 70 < document.documentElement.clientHeight) {
            $(min_height_block).addClass("fixed_col_top");
            $(min_height_block).css("bottom", (document.documentElement.clientHeight - min_height_block.height() - 70));
            $(min_height_block).css("left", left_col);

            $(window).scroll(function() {
                if ($(this).scrollTop() > ((document.documentElement.clientHeight - (min_height_block.height() + 50)) + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                    $('.fixed_col_top').css('top', 'inherit');
                    $(min_height_block).css("bottom", bottom_scroll);


                } else {
                    $('.fixed_col_top').css('top', '70px');
                    $('.fixed_col_top').css('bottom', 'inherit');
                };
            })

        } else {
            $(window).scroll(function() {
                if ($(this).scrollTop() > (45 + height - document.documentElement.clientHeight + $(".navbar").height()) && $(this).scrollTop() <= (50 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    $(min_height_block).addClass("fixed_col");
                    $(min_height_block).css("left", left_col);
                    $(min_height_block).css("bottom", "25px")

                } else if ($(this).scrollTop() > (45 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height())) {
                    var bottom_scroll = ($(this).scrollTop() - (20 + biggest_col.height() - document.documentElement.clientHeight + $(".navbar").height()));
                    $(min_height_block).css("bottom", bottom_scroll);
                } else {


                    $(min_height_block).removeClass("fixed_col");
                    $(min_height_block).css({ "left": "0px", "bottom": "0px" });
                }
            });
        }



    });

    // End dimas script
});

$(document).on('click', '.btnFhouse', function(e){
        e.preventDefault();
        alert(getCookie('csrftoken'));
        input = $(this).parent().parent().find("#id_content");
        parent = input.attr("parent_id");
        content = input.val();
    $.ajax({
        url: '/posts/comment/',
        data: {
            id: parent,
            content: content,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            alert("Comment added!");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
            //            console.log(error, status, xhr);
        }
    });
})

$(document).on('click', '.btn-default', function(e){
        e.preventDefault();
        input = $(this).parent().find(".reply-input");
        parent = input.attr("parent_id");
        content = input.val();
    $.ajax({
        url: '/comments/comment/',
        data: {
            parent_id: parent,
            content: content,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            alert("Comment added!");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
            //            console.log(error, status, xhr);
        }
    });
})


// Script author: Dima
$(document).ready(function() {


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


});


// End dimas script
