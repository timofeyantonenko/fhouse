$(document).ready(function() {

    loadAdditionalPosts(additional_posts);
    makeComments(article_id, 1);

});

function loadAdditionalPosts(additional_list){
    $asideBlock = $(".next_article_container");
    var htmlToInsert = "";
    additional_list.forEach(function(item, i, additional_list) {
        var urlArticle = prefix + item.slug;
        htmlToInsert += '\
        <div class="one_read_article">\
            <a href="' + urlArticle + '" class="linkArticle">\
            <div class="one_read_article_img">\
               <img src="' + item.image + '" alt="">\
            </div>\
            <div class="infoAricleDate">\
                <div class="before_date"></div>\
                <span class="date_aritle">' + get_date(item.date) + '</span>\
             </div>\
            <div class="one_read_article_info">\
                    <h3>' + item.title + '</h3>\
                    <p>\
                        ' + item.description + '\
                    </p>\
                </div>\
            </a>\
        </div>';
    });
    $asideBlock.html(htmlToInsert);
}

$(document).on('click', '.btnFhouse', function(e){
      e.preventDefault();
      var inputText = $("#id_content"),
          content = inputText.val(),
          dateComment = get_date(new Date());
    $.ajax({
        url: '/articles/comment/',
        data: {
            id: article_id,
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
});


function makeComments(id, page) {
    var $moreCom = $("#load_coments");
    $moreCom.attr("data-page", 1);
    $.ajax({
        url: '/articles/get_comments/',
        data: { "id": id, "p": page },
        dataType: "json",
        cache: false,
        success: function(data) {
            console.log(data);
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
