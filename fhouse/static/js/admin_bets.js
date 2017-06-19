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
$("#update_results").on("click", function(){
    $.ajax({
            url: 'update_results/',
            data: {
                stage_id: 6,
                csrfmiddlewaretoken: getCookie('csrftoken')
            },
            method: "POST",
            success: function(data, textStatus, xhr) {
                console.log(textStatus);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
});

$(document).ready(function() {
    addTour(6, "2017-06-20", "2017-06-22", "1 tour", true)
});

function addTour(stage_season, start_date, end_date, stage_name, is_current){
    $.ajax({
            url: '/bets/add_season_stage/',
            data: {
                stage_season: stage_season,
                start_date: start_date,
                end_date: end_date,
                stage_name: stage_name,
                is_current: is_current,
                csrfmiddlewaretoken: getCookie('csrftoken')
            },
            method: "POST",
            success: function(data, textStatus, xhr) {
                console.log(textStatus);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
}