var likes = [];

$(document).ready(function() {

    // set class likes
    $(".article_detail_content").find(".mark_info").addClass(function() {
      return setStatusLikes ( additional_posts.status );
    })

    likes.push(objectPostCondition);

    loadAdditionalPosts(additional_posts);

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
  console.log(slug, currentState)
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
