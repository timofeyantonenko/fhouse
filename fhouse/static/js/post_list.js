if (!String.format) {
    String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

// Constants
var MAIN_FLOW = 'MAIN_FLOW',
    SERCH_FLOW = 'SERCH_FLOW';

// Data
var postObj = {
      MAIN_FLOW: {
        posts: [],
        currentPage: 1,
        currentTab: undefined,
      },
      SERCH_FLOW: {
        posts: [],
        currentPage: 1,
        title: '',
      },
      isCurrent: MAIN_FLOW,
    };

var likes = [];

$(document).ready(function() {
    var tab = getUrlParameter('tab')
    if (typeof tab != 'undefined') {
        var search_tab = (tab == 'all' || typeof tab == 'undefined') ? 'Все' : tab;
        var previous_active_tab = $('div .menu_individualNews_active');
        previous_active_tab.removeClass('menu_individualNews_active');
        var str_to_find = String.format("div.changeNews:contains('{0}')", search_tab);
        var new_active_tab = $(str_to_find);
        new_active_tab.addClass('menu_individualNews_active');
    }

    $('.tab').click(function(e) {
        $('.more_article ').removeClass('endMore')
        var parent_div_tab = $(this).parent();
        var previous_active_tab = $('div .menu_individualNews_active');

        previous_active_tab.removeClass('menu_individualNews_active');
        previous_active_tab.find('li').removeAttr('id');
        parent_div_tab.addClass('menu_individualNews_active');

        var dataId = +$(this).attr("data-id");
        postObj.isCurrent = MAIN_FLOW;
        postObj.MAIN_FLOW.currentPage = 1;
        postObj.MAIN_FLOW.currentTab = dataId || undefined;
        get_posts(dataId, 1);
    });

    // Модальное окно

    $(".one_tag_for_choose").on("click", function() {
        $(this).children(".flex_right").find(".choose_tag_success").toggleClass("success_tag");
        if ($(this).children(".flex_right").find(".choose_tag_success").hasClass("success_tag")) {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();
            $(".for_tag").append('<a href="#" class="tegArticle modalTag"><span class="tag_chosen"></span><span class="additional_tag"></span><span class="close_tag"><i class="fa fa-times" aria-hidden="true"></i></span></a>');
            $(".for_tag a:last-child .additional_tag").text(htmlString);
        } else {
            var htmlString = $(this).children(".this_tag").find(".simple_tag").text();

            $('.tegArticle').each(function(i) {
                var tag = $(this).children('.additional_tag').text()
                if (tag == htmlString) {
                    $(this).remove();
                };
            });
        };
    });

    $(".modal_save").on("click", function() {
        var old_tags = []
        var new_tags = []
        $(".tab").each(function(i) {
            var tab = $(this).find('div').text();
            if (tab != "Все") {
                old_tags.push(tab);
            }
        });
        $(".additional_tag").each(function(i) {
            var tab = $(this).text(); //.attr("class");
            new_tags.push(tab);
        });
        var tags_to_delete = old_tags.filter(function(x) {
            return new_tags.indexOf(x) < 0
        })
        var tags_to_add = new_tags.filter(function(x) {
            return old_tags.indexOf(x) < 0
        })
        var add = false;
        var remove = false;
        $.ajax({
            url: 'change_user_tags/',
            data: {
                tags_delete: tags_to_delete,
                tags_add: tags_to_add,
                csrfmiddlewaretoken: getCookie('csrftoken')
            },
            method: "POST",
            success: function(data, textStatus, xhr) {
                location.reload();
            },
            error: function(xhr, status, error) {

            }
        });
    });

    $(".for_tag").on("click", ".close_tag", function() {
        $(this).parent().remove();
        var close_tag_text = $(this).parent().children(".additional_tag").text();
        $('.simple_tag').each(function(i) {
            if ($(this).text() == close_tag_text) {
                $(this).parent().parent().children(".flex_right").find(".choose_tag_success").removeClass("success_tag");
            };
        });
    });

    // Init Page
    initPage(+(window.location.href.split("=").slice(-1).join("")))

    // Load more posts
    $(document).on("click", "#loadTile", function() {
      switch (postObj.isCurrent) {

        case MAIN_FLOW:
          postObj.MAIN_FLOW.currentPage++;
          return get_posts(postObj.MAIN_FLOW.currentTab);

        case SERCH_FLOW:
          postObj.SERCH_FLOW.currentPage++;
          return serchPosts (postObj.SERCH_FLOW.title, postObj.SERCH_FLOW.currentPage);

        default:
          return false
      }
    });

    // Serch POST
    $("#find_news").on("submit", function(e) {
        e.preventDefault();
        var text = $.trim($("#post_search").val());

        if ( text === "" ) {
          return false;
        };

        $("#loadTile").removeClass("more_active").addClass("loading");

        postObj.isCurrent = SERCH_FLOW;
        postObj.SERCH_FLOW.currentPage = 1;
        postObj.SERCH_FLOW.title = text;

        serchPosts(text, 1);

        $("#post_search").val('');
    });

});

function initPage(tagLoad) {
  postObj.MAIN_FLOW.currentTab = tagLoad;
  get_posts(tagLoad, 1);
  setActiveTab(tagLoad);
}

$(document).on("click", "#resetSearch", function() {
  postObj.isCurrent = MAIN_FLOW;
  $("#postList").html(function() {
    return renderPosts(postObj.MAIN_FLOW.posts);
  });
});

function serchPosts (text, page) {
  $.ajax({
      url: '/posts/search/',
      data: {
        q: text,
        p: page,
      },
      dataType: "json",
      cache: true,
      success: function(data) {
        if (postObj.SERCH_FLOW.currentPage < 2 ) {
          postObj.SERCH_FLOW.posts = [];
        };

        postObj.SERCH_FLOW.posts = postObj.SERCH_FLOW.posts.concat(data);
        var POSTS = renderPosts(postObj.SERCH_FLOW.posts);

        $("#searchTag")
          .removeClass("hiddenItem")
          .addClass("visibilityItem")
          .find("strong")
          .html("#" + text);

        console.log($("#searchTag"))

        $("#postList").html(POSTS);
        $("#loadTile").removeClass("loading").addClass("more_active");
      },
      error: function(xhr, status, error) {
          postObj.SERCH_FLOW.currentPage--;
      }
  });
}

function setActiveTab(tag) {
  if ( isNaN(tag)) return $("#postTags").children("div").eq(0).addClass("menu_individualNews_active");
  var $activTag = $("#postTags").find("li[data-id='" + tag + "']");
  $activTag.parent(".changeNews ").addClass("menu_individualNews_active");
}


function get_posts(tag) {
    if ( !tag ) {
      var ajaxData = { p: postObj.MAIN_FLOW.currentPage };
    } else {
      var ajaxData = { tag: tag, p: MAIN_FLOW.currentPage };
    };
    var $postsContainer = $("#postList");
    $.ajax({
        url: '/posts/api_get_posts/',
        data: ajaxData,
        dataType: "json",
        success: function(data) {
          if (postObj.MAIN_FLOW.currentPage < 2 ) {
            postObj.MAIN_FLOW.posts = [];
          };
          postObj.MAIN_FLOW.posts = postObj.MAIN_FLOW.posts.concat(data);
          var POSTS = renderPosts(postObj.MAIN_FLOW.posts);
          window.history.pushState("object or string", "Title", '/posts/tabs?tab=' + tag);
          $postsContainer.html(POSTS);
          $("#loadTile").removeClass("loading").addClass("more_active");
        },
        error: function(xhr, status, error) {
          postObj.MAIN_FLOW.currentPage--;
        }
    });
}

// Render posts

function renderPosts(data) {
  if ( data.length < 1) {
    var htmlNull = `
      <h2>Нет постов с таким ключевым словом</h2>
    `;
    return htmlNull
  };
  var htmlPosts = "";
      likes = [];
  for (var i = 0; i < data.length; i++ ) {
    // Tags
    var tags = "";
    data[i].tag.forEach( function(e) {
      tags += `
          <div class="tags__item js-tags-item">
              <span>` + e.name + `</span>
          </div>
      `;
    });
    // Likes
    likes.push({
      likes: data[i]['positive_likes_count'],
      dislikes: data[i]['negative_likes_count'],
      status: data[i]['user_like'],
      index: i,
      slug: data[i]["slug"],
    });
    timePost = get_date(data[i]["timestamp"]);
    var classLikes = setStatusLikes(data[i]['user_like']);
    htmlPosts += `
        <a href="` + data[i]["slug"] + `" class="oneArticle">
            <section class="goNews imgContainer containerImgNews">
                <img src="` + data[i]["image"] + `" class="imgUser" alt="">
            </section>
            <section class="infoNews">
                <header>
                  <h3>` + data[i]["title"] + `</h3>
                  <time>` + timePost + `</time>
                  <p class="textNews">
                      ` + data[i]["content"] + `
                  </p>
                </header>
                <footer class="footerNews">
                    <div class="dataCommentsLikes">
                        ` + tags + `
                    </div>
                    <section class="mark_info ` + classLikes + `">
                      <div class="commentContainer">
                          <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
                          <span class="commes_photo_slider">` + data[i]["comments_count"] + `</span>
                      </div>
                      <div class="mark_btn block_like" data-like="-1" data-index="` + i + `">
                          <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                          <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                          <span class="votes">` + data[i]["positive_likes_count"] + `</span>
                      </div>
                      <div class="mark_btn block_dislike" data-like="1" data-index="` + i + `">
                          <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                          <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                          <span class="votes">` + data[i]["negative_likes_count"] + `</span>
                      </div>
                  </section>
                </footer>
            </section>
        </a>
    `;
  };

  if ( postObj.isCurrent == MAIN_FLOW ) {
    $("#searchTag")
      .removeClass("visibilityItem")
      .addClass("hiddenItem");
  };

  return htmlPosts;
}

// Download photo
function readURLoffer(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('.imgOfferNews').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    $(".linkImg").val("");
}

function downloadLinkTosrc() {
    var srcNew = $(this).val();
    $('.imgOfferNews').attr('src', srcNew);
}

// Script author: Dima
function page_settings() {
  $(".linkImg").keyup(function() {
      var srcNew = $(this).val();
      $('.imgOfferNews').attr('src', srcNew);
  });
  $("#offerImgDownload").change(function() {
      readURLoffer(this);
  });
}

function show_modal(modal_id) {
  $(modal_id).modal('toggle');
}

$(document).on("click", ".btn-ok", function(e) {
    var input_text = $('.textOfferNews').find('textarea').val();
    var input_image_url = $('.linkImg').val();
    propose_post(input_text, input_image_url);
    show_modal('#offerNewsModal');
});

function propose_post(text, image) {
    $.ajax({
        url: 'create/',
        data: {
            content: text,
            image_url: image,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        method: "POST",
        success: function(data, textStatus, xhr) {
        },
        error: function(xhr, status, error) {
        }
    });
}

var url = window.location.href;


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

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

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

$(document).on("click", ".footerNews", function(event) {
  event.preventDefault();
});

$(document).on("click", ".mark_btn", function(event) {
  event.preventDefault();

  var _this = $(this),
      ind = +(_this.attr("data-index")),
      typeEv = 0;

  _this.parent(".mark_info").addClass("stopEvent");
  if ( _this.hasClass("block_dislike") ) {
    typeEv = 1;
  };

  console.log(ind, typeEv)

  postLike(ind, typeEv);
})

function postLike(indexPost, typeEvent) {
  var slug = likes[indexPost]['slug'],
      currentState = likes[indexPost]['status'];
  $.ajax({
      url: "/likes/post/modify",
      data: { 'slug': slug, 'type': typeEvent },
      dataType: "json",
      success: function(data, textStatus, xhr) {
        // Set status
        if ( typeEvent === 1 && currentState === false) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] - 1;
          likes[indexPost]['status'] = null;
        } else if ( typeEvent === 1 && currentState === true ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] + 1;
          likes[indexPost]["likes"] = likes[indexPost]["likes"] - 1;
          likes[indexPost]['status'] = false;
        }  else if ( typeEvent === 1 && currentState === null ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] + 1;
          likes[indexPost]['status'] = false;
        }  else if ( typeEvent === 0 && currentState === false ) {
          likes[indexPost]["dislikes"] = likes[indexPost]["dislikes"] - 1;
          likes[indexPost]["likes"] = likes[indexPost]["likes"] + 1;
          likes[indexPost]['status'] = true;
        }  else if ( typeEvent === 0 && currentState === true) {
          likes[indexPost]["likes"] = likes[indexPost]["likes"] - 1;
          likes[indexPost]['status'] = null;
        }  else if ( typeEvent === 0 && currentState === null ) {
          likes[indexPost]["likes"] = likes[indexPost]["likes"] + 1;
          likes[indexPost]['status'] = true;
        };

        // Change Main Data
        postObj[postObj.isCurrent].posts[indexPost].negative_likes_count = likes[indexPost]["dislikes"];
        postObj[postObj.isCurrent].posts[indexPost].positive_likes_count = likes[indexPost]["likes"];
        postObj[postObj.isCurrent].posts[indexPost].user_like = likes[indexPost]['status'];

        // Change state in DOM
        var $thisPost = $(".oneArticle").eq(indexPost);
        $thisPost.find(".mark_info").removeClass("disLikeAcive").removeClass("nothingAcive").removeClass("likeAcive");

        return {
          setLikes: $thisPost.find(".block_like").find(".votes").html(likes[indexPost]["likes"]),
          setDislikes: $thisPost.find(".block_dislike").find(".votes").html(likes[indexPost]["dislikes"]),
          setClassContainer: $thisPost.find(".mark_info").addClass( function() {
            return setStatusLikes(likes[indexPost]['status'])
          }),
          parentAllowEvent: $thisPost.find(".mark_info").removeClass("stopEvent"),
        };
      },
      error: function(xhr, status, error) {
          console.log(error, status, xhr);
      }
  });
};
