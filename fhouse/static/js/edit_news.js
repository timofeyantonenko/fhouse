$(document).ready(function() {
  //Init suggesting news
  initSuggestinNews(
    $(".listPosts").children().eq(0).find(".imgConteinerSuggestion").children("img").attr("src"),
    $(".listPosts").children().eq(0).find(".text_suggesting_news").text(),
    $(".listPosts").children().eq(0).attr("data-post-id")
  );

});

// Variebles
var imgNewSrc;

// More text
$(".more_read").on("click", function() {
    $(this).hide();
    $(this).parents(".one_suggestion_news")
          .find(".text_suggesting_news")
          .css({ "-webkit-line-clamp": "1000000", "max-height": "10000px" });
});

// Delete news
$(".deleteNewsBtn").on("click", function() {
    $(this).parents(".one_suggestion_news").addClass("forDelete");
    $(this).parents(".one_suggestion_news").clone().appendTo('#delteNews .modal-body');
});

$(document).mouseup(function(e) {
    if (e.which === 1) {
        var container = $(".modal-dialog");
        if (container.has(e.target).length === 0) {
            $(".forDelete").removeClass("forDelete");
            $("#delteNews .modal-body").empty();
        }
    }
});

// Close modal

$('#delteNews').on('hidden.bs.modal', function() {
    $(".forDelete").removeClass("forDelete");
    $(this).find(".modal-body").empty();
})

// Search tegs

$("#seachTags").on("keyup", function() {
  var _this = $(this);
      $tagsContainer = $("#tagsList"),
      title = $.trim(_this.val().toLowerCase());
  if ( title.length < 1 ) {
    $tagsContainer.html("").slideUp();
    return false
  };
  $tagsContainer.slideDown('fast');
  setTimeout( function() {
    $.ajax({
      url: "/posts/search/tags/",
      data: {
        q: title,
      },
      dataType: "json",
      success: function(data) {
        if ( data.length < 1 ) {
          $tagsContainer.html('<div class="errorSearch">Нет тегов с таким именем</div>');
          return false
        };
        if ( $.trim(_this.val().toLowerCase()) < 1 ) {
          $tagsContainer.html('').slideUp('fast');
        };
        var items = "";
        data.forEach( function(obj) {
          items += `
          <li class="itemTag" data-id="` + obj.id + `">
              <p>` + obj.name  + `</p><span>(` + obj.posts_count + `)</span>
              <button class="btn btn-primary add_tags" role="button">Добавить <span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
          </li>
          `
        });
        $tagsContainer.html(items);
      },
      error: function(xhr, status, error) {
           console.log(error, status, xhr);
      }
    });
  }, 1000);
});

// Add tags
$(".addNewTag").find(".btn").on("click", function() {
    var newTagName = $(".addNewTag").find("textarea").val();
        $.ajax({
        url: "/posts/create/tag/",
        data: {
            name: newTagName,
            csrfmiddlewaretoken: getCookie('csrftoken')
        },
        type: "POST",
        dataType: "json",
        success: function(data) {
            var tagId = "21321";
            var htmlTag = `
              <div class="oneTeg" data-id="` + tagId + `">
                <div class="nameTeg">` + newTagName + `</div>
                <div class="removeTeg">
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </div>
              </div>
            `;
            $(".tegs_area").append(htmlTag)
            $(".addNewTag").find("textarea").val("");
        },
        error: function(xhr, status, error) {
             console.log(error, status, xhr);
        }
    });
})

// Add tag from search
$(document).on("click", ".add_tags", function() {
    var newTagName = $(this).parents(".itemTag").find("p").text(),
        dataId = $(this).parents(".itemTag").attr("data-id");
    var htmlTag = `
      <div class="oneTeg" data-id="` + dataId + `">
        <div class="nameTeg">` + newTagName + `</div>
        <div class="removeTeg">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
      </div>
    `;
    $(".tegs_area").append(htmlTag)
    $(".list_tegs").slideUp('fast');
    $("#seachTags").val("");
})

// Delete tags

$(".tegs_area").delegate(".removeTeg", "click", function() {
    $(this).parents(".oneTeg").remove();
});

// Change img

$("#newPhotoAdd").on("click", function() {
    var imgNewSrc = $("#newSrcPhoto").val();
    $("#img-suggesting-news").attr("src", imgNewSrc);
});

// Add news to editor

$(".editNewsBtn").on("click", function() {
    $("body,html").animate({ scrollTop: 0 }, 200);
    var imgNews = $(this).parents(".one_suggestion_news").find(".imgConteinerSuggestion").children("img").attr("src"),
        textNews = $(this).parents(".one_suggestion_news").find(".text_suggesting_news").text(),
        idNews = $(this).parents(".one_suggestion_news").attr("data-post-id");
    initSuggestinNews (imgNews, textNews, idNews);
});

// Delete news modal
$('body').on("click", "#confirmDel", function() {
  var idPost = parseInt($(this).attr("data-post-id"));
  removePost(idPost);
});

function removePost (idPost) {
  $(".forDelete").fadeOut("normal", function() {
      $(this).remove();
      // $.ajax({
      //     url: "someUrl",
      //     data: { id: idPost },
      //     dataType: "json",
      //     type: "POST",
      //     success: function(data) {
      //     },
      //     error: function(xhr, status, error) {
      //     }
      // });
  });
}

// Publish post

$(document).on("click", "#approve_news", function() {
  var typePost, urlPOst;
  if ( $(".listPosts").hasClass("list_article") ) {
    typePost = "ARTICLE";
    urlPOst = "someUrl";
  } else {
    typePost = "POST";
    urlPOst = "someUrl";
  }
  var ajaxData =  publishPost(typePost);
  $.ajax({
      url: urlPOst,
      data: ajaxData,
      dataType: "json",
      success: function(data) {
        alert("Новость опубликованно");
        removePost(ajaxData.id);
        initSuggestinNews(
          $(".listPosts").children().eq(0).find(".imgConteinerSuggestion").children("img").attr("src"),
          $(".listPosts").children().eq(0).find(".text_suggesting_news").text(),
          $(".listPosts").children().eq(0).attr("data-post-id")
        );
      },
      error: function(xhr, status, error) {
      }
  });
})

function getTags() {
  var arrTags = [];
  $("#tags-suggesting-news").children("div").each( function() {
    console.log($(this));
    arrTags.push(parseInt($(this).attr("data-id")));
  });
  return arrTags;
}

function publishPost(type) {
    var ajaxData = {
      image: $("#img-suggesting-news").attr("src"),
      title: $("#title-suggesting-news").text(),
      text: $("#text-suggesting-news").text(),
      id: parseInt($("#approve_news").attr("data-post-id"))
    }
    if ( type !== "ARTICLE" ) ajaxData.tags = getTags();
    return ajaxData
}

// Confirm delete tour
$(document).on("click", "#approve_news", function() {
    input_title = $("#title-suggesting-news").val();
    input_text = $("#text-suggesting-news").val();
});

// Confirm delete tour
$(document).on("click", "#approve_article", function() {
    input_title = $("#title-suggesting-news").val();
    input_text = $("#text-suggesting-news").val();
});

// Init
function initSuggestinNews (imgNews, textNews, id) {
    $("#img-suggesting-news").attr("src", imgNews);
    $("#text-suggesting-news").text(textNews);
    $("#title-suggesting-news").html("");
    $("#approve_news").attr("data-post-id", id )
    $("#newSrcPhoto").val("");
    $(".tegs_area").html("")
}
