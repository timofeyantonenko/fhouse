$(document).ready(function() {

    loadAdditionalPosts(additional_posts);

});

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
