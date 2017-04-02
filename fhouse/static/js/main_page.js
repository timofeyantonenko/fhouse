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
    $(window).resize(function() {
        $(".imgAlbumCover").each(function() {
            $(this).parent().removeClass("bigWidth");
            if ($(this).height() < $(this).parent().height()) {
                $(this).parent().addClass("bigWidth");
            }
        })
    });
});


function load_ajax_list(url, container_name) {
    $.ajax({
        url: url,
        //            data: ajax_data,
        dataType: "html",
        success: function(data) {
            var content = $(container_name);
            content.html(data);
            $(".imgAlbumCover").each(function() {
                $(this).on("load", function() {
                    console.log($(this).height())
                    $(this).parent().removeClass("bigWidth");
                    if ($(this).height() < $(this).parent().height()) {
                        $(this).parent().addClass("bigWidth");
                    }
                });
            })
        },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}
