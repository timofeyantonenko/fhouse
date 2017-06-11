var likes = [];

$(document).ready(function() {

    // set class likes
    $(".article_detail_content").find(".mark_info").addClass(function() {
      console.log(objectPostCondition.state)
      return setStatusLikes( objectPostCondition.state );
    });

    likes.push(objectPostCondition);

    loadAdditionalPosts(additional_posts);

    makeComments(objectPostCondition.id, 1);

});

$(document).on('click', '#comment .btnFhouse', function(e){
      e.preventDefault();
      var inputText = $("#id_content"),
          content = inputText.val(),
          dateComment = get_date(new Date());
    $.ajax({
        url: '/posts/comment/',
        data: {
            id: objectPostCondition.id,
            content: content,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
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
                      <p>` + content + `</p>
                  </div>

              </div>
          `;
          $("#comment").find(".comments").prepend(commentsHtml);
          inputText.val("");
        },
        error: function(xhr, status, error) {
            if (xhr.status === 409) {
                alert("Error in comment adding!")
            }
        }
    });
})


function loadAdditionalPosts(additional_list){
    $asideBlock = $(".next_news_container");
    var htmlToInsert = "";
    additional_list.forEach(function(item, i, additional_list) {
        var urlPost = prefix + item.slug;
        htmlToInsert += '\
        <a href="' + urlPost + '" class="next_news">\
          <div class="img_next_news containerImgNews">\
            <img src="' + item.image + '" class="imgUser">\
          </div>\
          <h3 class="title_next_news">' + item.title + '</h3>\
          <time class="date_next_news">' + get_date(item.date) + '</time>\
        </a>';
    });
    $asideBlock.html(htmlToInsert);
}

$(document).on("click", ".mark_btn", function(event) {
  var _this = $(this),
      typeEv = 0;
  _this.parent(".mark_info").addClass("stopEvent");
  if ( _this.hasClass("block_dislike") ) typeEv = 1
  postLike(0, typeEv);
})

function postLike(indexPost, typeEvent) {
  var slug = likes[indexPost]['slug'],
      currentState = likes[indexPost]['state'];
  $.ajax({
      url: "/likes/post/modify",
      data: { 'slug': slug, 'type': typeEvent },
      dataType: "json",
      success: function(data, textStatus, xhr) {
        console.log(likes[indexPost]);
        if ( typeEvent === 1 && currentState === false) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] - 1;
          likes[indexPost]['state'] = null;
        } else if ( typeEvent === 1 && currentState === true ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] + 1;
          likes[indexPost]["likes"] = likes[indexPost]["likes"] - 1;
          likes[indexPost]['state'] = false;
        }  else if ( typeEvent === 1 && currentState === null ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] + 1;
          likes[indexPost]['state'] = false;
        }  else if ( typeEvent === 0 && currentState === false ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] - 1;
          likes[indexPost]["likes"] = likes[indexPost]["likes"] + 1;
          likes[indexPost]['state'] = true;
        }  else if ( typeEvent === 0 && currentState === true) {
          likes[indexPost]["likes"] = likes[indexPost]["likes"] - 1;
          likes[indexPost]['state'] = null;
        }  else if ( typeEvent === 0 && currentState === null ) {
          likes[indexPost]["likes"] = likes[indexPost]["likes"] + 1;
          likes[indexPost]['state'] = true;
        };
        var $thisPost = $(".article_detail_content");
        $thisPost.find(".mark_info").removeClass("disLikeAcive").removeClass("nothingAcive").removeClass("likeAcive");
        return {
          setLikes: $thisPost.find(".block_like").find(".votes").html(likes[indexPost]["likes"]),
          setDislikes: $thisPost.find(".block_dislike").find(".votes").html(likes[indexPost]["dislikes"]),
          setClassContainer: $thisPost.find(".mark_info").addClass( function() {
            return setStatusLikes(likes[indexPost]['state'])
          }),
          parentAllowEvent: $thisPost.find(".mark_info").removeClass("stopEvent")
        }
      },
      error: function(xhr, status, error) {
          console.log(error, status, xhr);
      }
  });
};

function setStatusLikes ( status ) {
  var thisClass;
  if ( status === true ) {
    thisClass = "likeAcive";
  } else if ( status === false ) {
    thisClass = "disLikeAcive";
  } else {
    thisClass = "nothingAcive";
  }
  return thisClass
};

function get_date(date) {
    var dateToString = "" + date,
        dateDate = new Date(dateToString),
        today = new Date(),
        arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
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

$(document).on('click', '#load_coments', function(e) {
    e.preventDefault();
    $(this).removeClass("finish_more").removeClass("more_active").addClass("loading");
    var pageCommentCounter = +$(this).attr("data-page"),
        pagePost = pageCommentCounter + 1;
        idPost = objectPostCondition.id;
    pageCommentCounter++;
    makeComments(idPost, pagePost);
    $(this).attr("data-page", pagePost);
})

function makeComments(id, page) {
    var $moreCom = $("#load_coments");
    $moreCom.attr("data-page", 1);
    $.ajax({
        url: '/posts/get_comments/',
        data: { "id": id, "p": page },
        dataType: "json",
        cache: false,
        success: function(data) {
            var commentsHtml = "";
            var $blComments = $("#comment").find(".comments");
            for (var i = 0; i < data.length; i++) {
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
            $blComments.append(commentsHtml);

            // if ($moreCom.attr("data-page") >= Math.ceil(ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj'] / 10)) {
            //     return $moreCom.addClass("finish_more");
            // }
            $moreCom.removeClass("loading").removeClass("finish_more").addClass("more_active");
        },
        error: function(xhr, status, error) {
            // console.log(error, status, xhr);
        }
    });
};

// $(document).on('click', '.btnFhouse', function(e) {
//     e.preventDefault();
//     var $inputText = $("#id_content"),
//         commentText = $inputText.val();
//     photo_id = objSlider[1]["idImg"];
//     $.ajax({
//         url: '/gallery/photo/comment/',
//         data: {
//             id: photo_id,
//             content: commentText,
//             csrfmiddlewaretoken: getCookie('csrftoken')
//         },
//         method: "POST",
//         success: function(data, textStatus, xhr) {
//             dateComment = get_date(new Date());
//             var commentsHtml = `
//                     <div class="blockquote commentBody">
//                         <div class="coments_author containerImgUser">
//                             <img src="` + avatar_user + `" alt="" class="imgUser">
//                         </div>
//                         <div class="coment_author_time">
//                             <h5>
//                                 ` + first_name + ` ` + last_name + `
//                             </h5>
//                             <time>` + dateComment + `</time>
//                             <p>` + commentText + `</p>
//                         </div>
//
//                     </div>
//                 `;
//             $("#comment_slider_slider").find(".comments_modal").prepend(commentsHtml);
//             focusInput();
//             $inputText.val("");
//             ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj']++;
//             var newLengthComment = ListPhotos[objSlider[1]['currentPage']][objSlider[1]['currentIndexImg']]['lengthComObj'];
//             // Updating comments
//             $("#slider_modal").find(".commes_photo_slider").html(newLengthComment);
//             if (objSlider[0]['currentPage'] == objSlider[1]['currentPage']
//                 && objSlider[0]['currentIndexImg'] == objSlider[1]['currentIndexImg']) {
//                 $("#slider_slider").find(".commes_photo_slider").html(newLengthComment);
//             }
//         },
//         error: function(xhr, status, error) {
//             if (xhr.status === 409) {
//                 alert("Error in comment adding!")
//             }
//         }
//     });
// });
