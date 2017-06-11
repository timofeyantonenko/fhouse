if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

var objSlider = [{
        // 'commentsContainer':
        'currentPage': 1,
        'currentIndexImg': 0
    }, {
        // 'commentsContainer':
        'currentPage': 1,
        'currentIndexImg': 0
    }, { 'globalSlider': 0 }],
    tile_info_obj = {},
    htmlObj,
    ListPhotos = {},
    ajax_data = {},
    ajax_url = { 'url': 'slider_photo_list' },
    arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

$(document).ready(function() {

    var defaultSection = $("#nav_section").children("ul").children("li").eq(0).text().trim();
    ajax_data['section'] = defaultSection
    objSlider[0].sliderType = $("#slider_slider");
    objSlider[1].sliderType = $("#slider_modal");

    objSlider[0].html = htmlObj;
    objSlider[1].html = htmlObj;

    ajaxGallery(ajax_data, ajax_url['url'], 0, objSlider[0].currentPage);

    $(".carousel").on("click", function(event) {
        var $thisArea = $(this),
            counter = +$thisArea.attr('data-count'),
            container = +$thisArea.attr('data-obj'),
            reset = +$thisArea.attr('data-reset');
        objSlider['globalSlider'] = container;
        sliderEvent(counter, reset, container);
    });

    $(document).keydown(function(eventObject) {
        if ($('#slider_modal').parents().hasClass('in')) {
            if (eventObject.which == 37) {
                return $('#carousel_slider_modal_left').click();
            } else if (eventObject.which == 39) {
                return $('#carousel_slider_modal_right').click();
            };
        }
    });

    $('#tile_img').masonry({
        itemSelector: '.item',
        transitionDuration: 0
    });

    $('#id_content').focusin(function() {
        focusInput();
    });

    // Секции
    var $sectionLi = $("#nav_section").find("li");
    $sectionLi.eq(0).addClass('active_nav_ul');
    $sectionLi.click(function(e) {
        if ($(this).hasClass('active_nav_ul')) return;
        $("#loadTile").removeClass("more_active").removeClass("finish_more").addClass("loading");
        $(".active_nav_ul").removeClass('active_nav_ul');
        $(this).addClass("active_nav_ul");
        objSlider[0]['currentPage'] = 1;
        objSlider[0]['currentIndexImg'] = 0;
        ajax_data["section"] = $(this).text().trim();
        delete ajax_data['album_id'];
        delete ajax_data['page'];
        ajax_url['url'] = 'slider_photo_list';
        ListPhotos = {};
        ajaxGallery(ajax_data, ajax_url['url'], 0, objSlider[0].currentPage);
    });

    // Альбомы
    $("#albumsContainer").on("click", ".album_previews", function(e) {
        $(".active_selected_album").removeClass("active_selected_album");
        $("#loadTile").removeClass("more_active").removeClass("finish_more").addClass("loading");
        $(this).addClass("active_selected_album");
        var long_id = $(this).attr("id").split("album_id_"),
            urlReq = 'album_photo_list';
        tile_info_obj['last_date'] = $(this).find("time").text();
        tile_info_obj['name_album'] = $(this).find(".title_album_preview").text();
        ListPhotos = {};
        ajax_url['url'] = 'album_photo_list';
        ajax_data['album_id'] = long_id[1];
        objSlider[0]['currentPage'] = 1;
        objSlider[0]['currentIndexImg'] = 0;
        objSlider[0]["quantityFoto"] = objSlider[1]["quantityFoto"] = +$(this).attr("data-photo");
        objSlider[0]["quantityPagination"] = objSlider[1]["quantityPagination"] = +$(this).attr("data-pagination");
        delete ajax_data['section'];
        delete ajax_data['page'];
        ajaxGallery(ajax_data, ajax_url['url'], 0, 1);
        if ($(window).width() <= 969) $("#albums_right").slideUp();
    });

    // Новые фото
    $(document).on("click", "#loadTile", function(e) {
        $("#loadTile").removeClass("more_active").addClass("loading");
        scrollPagination($(this))
    });

    // $(window).scroll(function() {
    //     if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //         scrollPagination($("#loadTile"))
    //     }
    // });

    // Mobile section albums

    $(".mobileEventAlbums").on("click", function() {
        show_menu_mobile(970, $("#album_mobile"), $(this))
    });

    $(".mobileEvent").on("click", function() {
        show_menu_mobile(750, $("#section_mobile"), $(this))
    })

});

function show_menu_mobile(widthWindow, spanId, thisToogle) {
    var windowWidth = $(window).width();
    if (windowWidth >= widthWindow) return
    thisToogle.toggleClass("showAll");
    var $spanIcon = spanId;
    if (thisToogle.hasClass("showAll")) {
        $spanIcon.removeClass("glyphicon-menu-hamburger").addClass("glyphicon-remove");
    } else {
        $spanIcon.removeClass("glyphicon-remove").addClass("glyphicon-menu-hamburger");
    }
}

function ajaxGallery(ajxData, ajaxUrl, method, page) { //method 0: make all, method 1: get pagination tile, method 3: get pagination slider
    if (method == 1) {
        $("#loadTile").removeClass("more_active").addClass("loading");
    }
    $.ajax({
        url: ajaxUrl,
        data: ajxData,
        dataType: "json",
        success: function(data) {
            console.log(data)
            var json_request_photos = data['photo_list'],
                arr = [],
                indexObj = 0;
            $.each(json_request_photos, function(idx, obj) {
                arr.push({
                    "urlObj": obj.image,
                    "idObj": obj.id,
                    "likeObj": obj.positive_likes_count,
                    "dislikeObj": obj.negative_likes_count,
                    "pageObj": obj.data_page,
                    "lengthComObj": obj.comments_count,
                    "albumObj": obj.album_title,
                    "indexObj": indexObj,
                    "date": get_date(obj.timestamp),
                    "title": obj.photo_title,
                    "likeState": obj.user_like
                });
                indexObj++;
            });
            ListPhotos[page] = arr;
            ajax_url["tile_date"] = json_request_photos[0]['updated'];
            if (method == 0) {
                try {
                    var json_request_albums = data['albums'],
                        insert_data = "",
                        albums_count_block = $('#albums_section'),
                        albums_container = $('#albumsContainer'),
                        numberOfPagination = 0;
                    $.each(json_request_albums, function(idx, obj) {
                        var paginnationPage = Math.ceil(obj.photos_count / 9),
                            dateNeed = get_date(obj["updated"]);
                        numberOfPagination += obj.photos_count;
                        insert_data += `
                            <div class="album_previews" id="album_id_` + obj.id + `" data-pagination="` + paginnationPage + `" data-photo="` + obj.photos_count + `">
                                <section class="album_previews_img">
                                    <img src="` + obj.image + `" class='imgAlbumCover imgUser' alt="" />
                                </section>
                                <section class="infoAlbum">
                                    <h3 class="title_album_preview">` + obj.album_title + `</h3>
                                    <div class="quantityAlbum">
                                        <figure>
                                            <i class="fa fa-camera" aria-hidden="true"></i>
                                            <figcaption>
                                                ` + obj.photos_count + `
                                            </figcaption>
                                        </figure>
                                        <figure>
                                            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            <figcaption>
                                                ` + obj.positive_likes_count + `
                                            </figcaption>
                                        </figure>
                                    </div>
                                    <time>
                                        ` + dateNeed + `
                                    </time>
                                </section>
                            </div>
                    `
                    });
                    albums_count_block.html(json_request_albums.length);
                    objSlider[0]["quantityFoto"] = objSlider[1]["quantityFoto"] = numberOfPagination;
                    objSlider[0]["quantityPagination"] = objSlider[1]["quantityPagination"] = Math.ceil(numberOfPagination / 9);
                    albums_container.html(insert_data);
                    tile_info_obj['last_date'] = get_date(data['albums'][0]['updated']);

                } finally {
                    var section_albums = ajax_data['section'] || tile_info_obj['name_album'],
                        $tileInfo = $(".tile_albums_foto").children("header");
                    $tileInfo.children("h2").html(section_albums);
                    $tileInfo.children("time").html(tile_info_obj['last_date']);
                    objSlider[0].html();
                    makeTile(false, 1);
                    if (objSlider[1]["quantityPagination"] == 1) {
                        $("#loadTile").addClass("finish_more");
                    }
                }
            } else if (method == 1) {
                var pageTile = +$("#loadTile").attr("data-page");
                makeTile(true, pageTile);
            } else {
                objSlider[objSlider['globalSlider']].html();
            }
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
}

function makeTile(append, page) {
    var foto_tile = "",
        $content = $('#tile_img'),
        $clickMore = $("#loadTile");
    lengthPagination = ListPhotos[page].length;
    for (var i = 0; i < lengthPagination; i++) {
        var urlTile = ListPhotos[page][i].urlObj,
            idTile = ListPhotos[page][i].idObj,
            data_index = ListPhotos[page][i].indexObj,
            dataPage = ListPhotos[page][i]["data_page_comments"];
        foto_tile += `
            <div class="photo_row item">
                <img src="` + urlTile + `" alt="" class="imgTile"
                data-id="` + idTile + `" data-page="` + page + `"
                data-index="` + data_index + `"
                data-toggle="modal" data-target="#slaider_modal">
            </div>
        `;
    }

    if (append) {
        $content.append(foto_tile);
    } else {
        $content.html(foto_tile);
        data_page_tile = 1;
        $clickMore.attr("data-page", 1)
    }
    return {
        1: $("#tile_img").imagesLoaded(function() {
            $("#tile_img").masonry('reloadItems');
            $("#tile_img").masonry('layout');
        }).done(function(instance) {
            var newlength = instance['progressedCount'],
                lengthItem = $("#tile_img").children(".item").length;
            for (var i = lengthItem - newlength; i < lengthItem; i++) {
                $("#tile_img").children(".item").eq(i).addClass("donaMassonry");
            };
            if (page == objSlider[1]["quantityPagination"]) $("#progress").children("button").addClass("finish_more");
            $("#progress").children("button").removeClass("loading").addClass("more_active");
        }),
        2: $clickMore.removeClass("moreLoading")
    }
}

function scrollPagination(eventObj) {
    var nextPage = +eventObj.attr("data-page");
    eventObj.addClass("moreLoading");
    nextPage++;
    ajax_data['page'] = nextPage;
    eventObj.attr("data-page", nextPage);
    if (!ListPhotos.hasOwnProperty(nextPage)) return ajaxGallery(ajax_data, ajax_url['url'], 1, nextPage);
    return makeTile(true, nextPage);
}

function sliderEvent(counter, reset, container) {
    var containerSlider = objSlider[container],
        imgIndex = containerSlider['currentIndexImg'],
        pageCounter = containerSlider['currentPage'];
    imgIndex += counter;
    if (imgIndex + (pageCounter - 1) * 9 == containerSlider["quantityFoto"]) {
        pageCounter = 1;
        imgIndex = 0;
        ajax_data['page'] = pageCounter;
    } else if (imgIndex == -1 && pageCounter == 1) {
        pageCounter = containerSlider["quantityPagination"];
        imgIndex = (containerSlider["quantityFoto"] % 9) - 1;
        if (!ListPhotos.hasOwnProperty(pageCounter)) {
            return {
                1: containerSlider['currentIndexImg'] = imgIndex,
                2: ajax_data['page'] = pageCounter,
                3: containerSlider['currentPage'] = pageCounter,
                4: ajaxGallery(ajax_data, ajax_url['url'], 2, pageCounter)
            }
        };
    } else if (imgIndex === reset) {
        pageCounter += counter;
        imgIndex = 8 - (Math.abs(reset) - 1);
        if (!ListPhotos.hasOwnProperty(pageCounter)) {
            return {
                1: containerSlider['currentIndexImg'] = imgIndex,
                2: ajax_data['page'] = pageCounter,
                3: containerSlider['currentPage'] = pageCounter,
                4: ajaxGallery(ajax_data, ajax_url['url'], 2, pageCounter)
            }
        };
    }
    return {
        1: containerSlider['currentIndexImg'] = imgIndex % 9,
        2: containerSlider['currentPage'] = pageCounter,
        3: objSlider[container].html()
    }
}


function htmlObj() {
    var pageThis = this.currentPage,
        indexThis = this.currentIndexImg,
        objectImg = ListPhotos[pageThis][indexThis],
        urlImg = objectImg["urlObj"],
        id_img = objectImg["idObj"],
        like = objectImg["likeObj"],
        dislike = objectImg["dislikeObj"],
        length_comment = objectImg["lengthComObj"],
        data_page_comments = Math.ceil(objectImg["lengthComObj"] / 10),
        album_title = objectImg["albumObj"],
        data_reset = objectImg["resetObj"],
        quantityImg = objSlider[1]["quantityFoto"],
        dateImg = objectImg["date"],
        titleImg = objectImg["title"];
    indexImg = (pageThis - 1) * 9 + indexThis + 1;
    objSlider[1]["idImg"] = id_img;
    objSlider[1]["data_page_comments"] = data_page_comments;
    var $loderComment = $("#load_coments");
    $loderComment.removeClass('moreLoading').removeClass("endMore");
    if (length_comment < 11) {
        $loderComment.addClass('noMore')
    } else {
        $loderComment.removeClass('noMore')
    }
    var $sliderCurrent = this.sliderType;
    setActiveClassLike(objectImg["likeState"]);
    return {
        1: this.sliderType.find(".img_slider").children("img").attr({
            "src": urlImg,
            "data-page": data_page_comments,
            "data-id": id_img,
            "data-reset": data_reset,
            "alt": titleImg
        }).parent().addClass("notDone").imagesLoaded(function() {
            $sliderCurrent.find(".img_slider").removeClass("notDone");
            // .find(".img_slider").removeClass("notDone");
        }),
        2: this.sliderType.find(".block_like").attr("data-id", id_img).children(".votes").html(like),
        3: this.sliderType.find(".block_dislike").attr("data-id", id_img).children(".votes").html(dislike),
        4: this.sliderType.find(".index_photo").children("li").eq(0).html(indexImg),
        5: this.sliderType.find(".index_photo").children("li").eq(2).html(quantityImg),
        6: this.sliderType.find(".commes_photo_slider").html(length_comment),
        7: this.sliderType.find(".photo_info").children("h3").html(album_title),
        8: this.sliderType.find("aside").find(".time_add_photo").html(dateImg),
        9: this.sliderType.find("aside").find(".discription_photo").html(titleImg),
        10: makeComments(id_img, 1, false)
    }
}

function changeObjInfoLikes( index, eventElement ) {
  var currentList = ListPhotos[objSlider[index]['currentPage']][objSlider[index]['currentIndexImg']];
  var $parentElem = eventElement.parent(".mark_info");
  var newState,
      newLikes = currentList["likeObj"],
      newDislikes = currentList["dislikeObj"];
  if ( eventElement.hasClass("block_like") && $parentElem.hasClass("likeAcive")) {
      newState = null
      newLikes = currentList["likeObj"] - 1;
  } else if ( eventElement.hasClass("block_like") && $parentElem.hasClass("nothingAcive")) {
    newState = true;
    newLikes = currentList["likeObj"] + 1;
  } else if ( eventElement.hasClass("block_like") && $parentElem.hasClass("disLikeAcive") ) {
    newState = true;
    newLikes = currentList["likeObj"] + 1;
    newDislikes = currentList["dislikeObj"] - 1;
  } else if ( eventElement.hasClass("block_dislike") && $parentElem.hasClass("likeAcive")  ) {
    newState = false;
    newLikes = currentList["likeObj"] - 1;
    newDislikes = currentList["dislikeObj"] + 1;
  } else if (eventElement.hasClass("block_dislike") && $parentElem.hasClass("nothingAcive")) {
    newState = false;
    newDislikes = currentList["dislikeObj"] + 1;
  } else if ( eventElement.hasClass("block_dislike") && $parentElem.hasClass("disLikeAcive")) {
    newState = null;
    newDislikes = currentList["dislikeObj"] - 1;
  }
  setActiveClassLike( newState );
  currentList["likeState"] = newState;
  currentList["likeObj"] = newLikes;
  currentList["dislikeObj"] = newDislikes;
  if (objSlider[0]['currentPage'] == objSlider[1]['currentPage']
      && objSlider[0]['currentIndexImg'] == objSlider[1]['currentIndexImg']) {
      $("#slider_slider").find(".block_like").children(".votes").html(newLikes);
      $("#slider_slider").find(".block_dislike").children(".votes").html(newDislikes);
  }
};

function setActiveClassLike( state ) {
  var $likesContainer = $(".mark_info");
  if (state === false) {
    $likesContainer.removeClass("likeAcive");
    $likesContainer.removeClass("nothingAcive");
    $likesContainer.addClass("disLikeAcive");
  } else if ( state === true ) {
    $likesContainer.removeClass("disLikeAcive");
    $likesContainer.removeClass("nothingAcive");
    $likesContainer.addClass("likeAcive");
  } else {
    $likesContainer.removeClass("disLikeAcive");
    $likesContainer.removeClass("likeAcive");
    $likesContainer.addClass("nothingAcive");
  }
}

function makeComments(id_img, page, append) {
    var $moreCom = $("#load_coments");
    $moreCom.attr("data-page", 1);
    $.ajax({
        url: '/gallery/photo/comments/',
        data: { "id_img": id_img, "p": page },
        dataType: "json",
        cache: false,
        success: function(data) {
            var commentsHtml = "";
            var $blComments = $("#comment_slider_slider").find(".comments_modal");
            for (var i = data.length - 1; i >= 0; i--) {
                dateComment = get_date(data[i]["timestamp"]);
                commentsHtml += `
                    <div class="blockquote commentBody">
                        <div class="coments_author containerImgUser">
                            <img src="` + data[i]["user"]["avatar"] + `" alt="" class="imgUser">
                        </div>
                        <div class="coment_author_time">
                            <h5>
                                ` + data[i]["user"]["first_name"] + ` ` + data[i]["user"]["last_name"] +
                    `
                            </h5>
                            <time>` + dateComment + `</time>
                            <p>` + data[i]["content"] + `</p>
                        </div>

                    </div>
                `
            };
            if (append) {
                $blComments.prepend(commentsHtml);
            } else {
                $blComments.html(commentsHtml);
            };
            $moreCom.removeClass("finish_more");
            if ($moreCom.attr("data-page") >= Math.ceil(ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj'] / 10)) {
                $moreCom.addClass("finish_more");
            }
            $moreCom.removeClass("loading").addClass("more_active");
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
};

function get_date(date) {
    var dateToString = "" + date,
        dateDate = new Date(dateToString),
        today = new Date();
    timeLong = (today - dateDate) / (60000 * 24);
    minuteAgo = Math.round((today - dateDate) / 60000);
    if (timeLong > 1 && timeLong < 24) {
        makeDate = "Сегодня в " + ("0" + dateDate.getHours()).slice(-2) + ":" + ("0" + dateDate.getMonth()).slice(-2);
    } else if (timeLong < 1) {
        makeDate = minuteAgo + " мин. назад"
    } else {
        makeDate = ("0" + dateDate.getDate()).slice(-2) + " " + arrMonth[dateDate.getMonth()] + " " + dateDate.getFullYear();
    }
    return makeDate;
}

function focusInput() {
    var div = $('#comment_slider_slider');
    div.scrollTop(div.prop('scrollHeight'));
}

$(document).on('click', '#load_coments', function() {
    var pageCommentCounter = $(this).attr("data-page");
    if (pageCommentCounter == objSlider[1]["data_page_comments"]) {
        return {
            1: $(this).attr("data-page", 1),
            2: $(this).addClass("endMore")
        }
    };
    $(this).removeClass("finish_more").removeClass("more_active").addClass("loading");
    var albumId = objSlider[1]["idImg"];
    pageCommentCounter++;
    makeComments(albumId, pageCommentCounter, true);
    $(this).attr("data-page", pageCommentCounter);
})

$(document).on("click", ".photo_row ", function() {
    var $thisRowImg = $(this).find("img"),
        id_lbums = +$thisRowImg.attr("data-id"),
        data_page = +$thisRowImg.attr("data-page"),
        data_index = +$thisRowImg.attr("data-index");
    objSlider[1]["currentIndexImg"] = data_index;
    objSlider[1]["currentPage"] = data_page;
    objSlider[1]["idImg"] = id_lbums;
    objSlider[1].html();
});

$(document).on("click", "#slider_slider .open_modal ", function() {
    objSlider[1]["currentIndexImg"] = objSlider[0]["currentIndexImg"];
    objSlider[1]["currentPage"] = objSlider[0]["currentPage"];
    objSlider[1]["idImg"] = objSlider[0]["idImg"];
    objSlider[1].html();
});

$(document).on('click', '.mark_btn', function() {
    var _this = $(this);
    var photo_id = $(this).attr("data-id"),
        type = $(this).attr("data-like"),
        $positiveLikesBlock = $(this).parent().find(".block_like").find(".votes"),
        positiveCount = parseInt($positiveLikesBlock.html()),
        $negativeLikesBlock = $(this).parent().find(".block_dislike").find(".votes"),
        negativeCount = parseInt($negativeLikesBlock.html());
    _this.parent(".mark_info").addClass("stopEvent");
    if ( $("#slaider_modal").hasClass("in")) {
      indexCurrentSlider = 1;
    } else {
      indexCurrentSlider = 0;
    }
    changeObjInfoLikes( indexCurrentSlider, _this );
    $.ajax({
        url: '/likes/photo/modify/',
        data: {
            photo_id: photo_id,
            type: type,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            $.each(data["add_result"], function(idx, obj) {
                switch (obj) {
                    case 0:
                        $positiveLikesBlock.html(positiveCount += 1);
                        break;
                    case 1:
                        $negativeLikesBlock.html(negativeCount += 1);
                        break;
                    case 2:
                        $positiveLikesBlock.html(positiveCount -= 1);
                        break;
                    case 3:
                        $negativeLikesBlock.html(negativeCount -= 1);
                        break;
                }
            });
            _this.parent(".mark_info").removeClass("stopEvent");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
});

$(document).on('click', '.btnFhouse', function(e) {
    e.preventDefault();
    var $inputText = $("#id_content"),
        commentText = $inputText.val();
    photo_id = objSlider[1]["idImg"];
    $.ajax({
        url: '/gallery/photo/comment/',
        data: {
            id: photo_id,
            content: commentText,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
            dateComment = get_date(new Date());
            var commentsHtml = `
                    <div class="blockquote commentBody">
                        <div class="coments_author containerImgUser">
                            <img src="` + avatar_user + `" alt="" class="imgUser">
                        </div>
                        <div class="coment_author_time">
                            <h5>
                                ` + first_name + ` ` + last_name + `
                            </h5>
                            <time>` + dateComment + `</time>
                            <p>` + commentText + `</p>
                        </div>

                    </div>
                `;
            $("#comment_slider_slider").find(".comments_modal").append(commentsHtml);
            focusInput();
            $inputText.val("");
            ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj']++;
            var newLengthComment = ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj'];
            // Updating comments
            $("#slider_modal").find(".commes_photo_slider").html(newLengthComment);
            if (objSlider[0]['currentPage'] == objSlider[1]['currentPage']
                && objSlider[0]['currentIndexImg'] == objSlider[1]['currentIndexImg']) {
                $("#slider_slider").find(".commes_photo_slider").html(newLengthComment);
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
});

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
};
