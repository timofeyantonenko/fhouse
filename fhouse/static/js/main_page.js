$(document).ready(function() {
    var post_list_ajax_url = 'posts/ajax_post_list/';
    var gallery_list_container = '.main_news_container';
    load_ajax_list(post_list_ajax_url, gallery_list_container);

    var post_list_ajax_url = 'gallery/last_section_photo_list/';
    var gallery_list_container = '.main_gallery_container';
    load_ajax_list(post_list_ajax_url, gallery_list_container);

    var post_list_ajax_url = 'articles/main_article_list/';
    var gallery_list_container = '.articles_list';
    load_ajax_list(post_list_ajax_url, gallery_list_container);

    var record_list_url = 'records/get_main_page_record_list';
    var gallery_list_container = '.records_list';
    load_ajax_list(record_list_url, gallery_list_container);


    $('.one_news_img img').each(function(i) {
        if ($(this).css("height") < $(this).parent().css("height")) {
            $(this).css({ "height": "100%", "width": "auto", "align-self": "center" });
            $(this).parent().css({ "display": "flex", "justify-content": "center" });
        }
    });
    $('one_news_img img').each(function(i) {
        if ($(this).css("width") < $(this).parent().css("width")) {
            $(this).css({ "width": "100%", "align-self": "center" });
            $(this).parent().css({ "display": "block", });
        }
    });
});

function load_ajax_list(url, container_name) {
    $.ajax({
            url: url,
//            data: ajax_data,
            dataType: "html",
            success: function(data){
                var content = $(container_name);
                content.html(data);
            },
            error: function(xhr, status, error){
                console.log(error, status, xhr);
            }
        });
}