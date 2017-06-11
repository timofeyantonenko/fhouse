$(document).ready(function() {

    // make top bets
    var readyMake = 0;
    makeTopMatchClubList();
    makeSeasonsTop();
    makeTopMatchTours();

    loadWeeks();

    loadSeason();
    loadInfoChampionatTours();

    // For delete tour block
    updateSeason();
    updateTour();



    // Add option to select
    for (var i = 0; i < $("#listAlumms").find('ul').eq(0).children("li").length; i++) {
        var text_li = $("#listAlumms").find('ul').eq(0).children("li").eq(i).text();
        var html_option = '<option value="' + i + '" class="StadiumAlbums">' + text_li + '</option>';
        $(".albumSelect").append(html_option);
    }

    // Active menu
    for (var i = 0; i < $(".navEventAdmin").children("li").length; i++) {
        var menu_href = $(".navEventAdmin").children("li").eq(i).children("a").attr('href');
        if (window.location.href.indexOf(menu_href) > -1) {
            $(".navEventAdmin").children("li").eq(i).addClass("active");
        }
    }

});


// Menu 
$(".nav").children("li").on("click", function() {
    $(this).parent().find("li").removeClass("active");
    $(this).addClass("active");
});

// add photo

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imgToThis').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function readURLalbum(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imgAlbumToThis').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#newImg").change(function() {
    readURL(this);
});

$("#newImgAlbum").change(function() {
    readURLalbum(this);
});

// Photo bet adding
var $parent_input;

function readURLbetPhoto(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $parent_input.find('.imgBet').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(".betPhoto").change(function() {
    $parent_input = $(this).parent();
    readURLbetPhoto(this);
});



// Option to select
$('#selectSection').on('change', function() {
    $(".albumSelect").empty();
    var class_selected_section = parseInt($("#selectSection").val());
    for (var i = 0; i < $("#listAlumms").find('ul').eq(class_selected_section).children("li").length; i++) {
        var text_li = $("#listAlumms").find('ul').eq(class_selected_section).children("li").eq(i).text();
        var idLi = $("#listAlumms").find('ul').eq(class_selected_section).children("li").eq(i).attr("album-id")
        var html_option = '<option value="' + i + '" class="StadiumAlbums" album-id="' + idLi + '">' + text_li + '</option>';
        $(".albumSelect").append(html_option);
    }
});

// Add week

$(".addWeekToSelect").on("click", function() {
    var valueWeekInfo;
    var htmlweekInfo;
    addWeek();
});

function addWeek() {
    valueWeekInfo = $("#weekTopMatchesForBet").val();
    htmlweekInfo = '<li>' + valueWeekInfo + '</li>';
    $(".listWeeks").append(htmlweekInfo);
    loadWeeks();
    $("#weekTopMatchesForBet").val("");
}

// Del week

$(".delWeek").on("click", function() {
    var indexSelectedOption = $(".selectWeek").children(".weekChose").children("option:selected").index();
    $(this).parents(".selectWeek").find("select").clone().appendTo('#delteWeek .modal-body');
    $("#delteWeek select").addClass("selectWeekInModal");
    $("#delteWeek select").children("option").eq(indexSelectedOption).prop('selected', true);
})

$('body').on("click", "#confirmDelWeek", function() {
    var lengthSelectOption = $(".selectWeekInModal option").length;
    var indexSelectOptionModal = $(".selectWeekInModal option:selected").index();
    var choosenOptionIndex = (lengthSelectOption - indexSelectOptionModal - 1);
    $(".listWeeks").children().eq(choosenOptionIndex).remove();
    $('#delteWeek .modal-body').empty();
    loadWeeks();
});

$('#delteWeek').on('hidden.bs.modal', function() {
    $(this).find(".modal-body").empty();
})

// Load weeks 

function loadWeeks() {
    $(".weekChose").empty();
    for (var i = 0; i < $(".listWeeks").children().length; i++) {
        var textWeek = $(".listWeeks").children().eq(i).text();
        var htmlOptionWeek = `
            <option value="0">
                <p>` + textWeek + `</p>
            </option>
        `
        $(".weekChose").prepend(htmlOptionWeek);
    }
    $(".selectWeek").children('.weekChose').children("option").eq(0).prop('selected', true);
}

// Add remove one bet 

$(".addMatchBetForm").on("click", function() {
    var checkedChampionat = $(".allMatchesBet").find(".leagueSelect option:selected").text();
    var checkedTour = $(".allMatchesBet").find(".listTour option:selected").text();
    var htmlBetForm = `
        <form class="makeMatch thumbnail">
            <span class="glyphicon glyphicon-remove removeMatchBetForm" aria-hidden="true"></span>
            <h2>
            <span class="championatTitle">` + checkedChampionat + `</span>,
            <span class="tourTitle">` + checkedTour + `</span>    
        </h2>
            <div class="choseTeams">
                <h4>Первая команда</h4>
                <select class="selectFirstTeam"></select>
                <h4>Вторая команда</h4>
                <select class="selectNextTeam"></select>
            </div>
            <div class="choseTime">
                <h3>Выбор времени начала матча</h3>
                <textarea placeholder="День (29 октября)" class="dayMatch"></textarea>
                <textarea placeholder="Время Москва (22:45)" class="moscowTimeStartMatch"></textarea>
                <textarea placeholder="Время Киев (21:45)" class="kievTimeStartMatch"></textarea>
            </div>
            <div class="koffMatch">
                <h3>Коэффициенты на матч</h3>
                <textarea class="winFirst" placeholder="Победа 1 (1.12)"></textarea>
                <textarea class="winSecond" placeholder="Победа 2 (6.12)"></textarea>
                <textarea class="draw" placeholder="Ничья (2.12)"></textarea>
            </div>
            <div class="adminBet">
                <h3>Прогноз админа</h3>
                <textarea class="goalFirstTeam" placeholder="1 команда (голы)"></textarea>
                <textarea class="goalFirstTeam" placeholder="2 команда (голы)"></textarea>
            </div>
            <div class="discriptionMatch">
                <h3>Текст</h3>
                <textarea class="discriptionBig" placeholder="Описание матча..."></textarea>
            </div>
        </form>
    `
    $(".areaMatches").append(htmlBetForm);
    loadInfoChampionatTeams();
})

$(".areaMatches").delegate(".removeMatchBetForm", "click", function() {
    $(this).parents(".makeMatch").remove();
});

// Load info matches

var indexChampionat = 0;
var indexSeason = 0;

function loadSeason() {
    var $currentListSeasons = $(".listOtherTeam").children("li").eq(indexChampionat).find(".seasonList").children("li");
    for (var i = 0; i < $currentListSeasons.length; i++) {
        var textSeasons = $currentListSeasons.eq(i).children("h2").text();
        var htmlLoadSeason = `
        <option>
            <p>` + textSeasons + `</p>
        </option>
        `;
        $("#seasonSelect").append(htmlLoadSeason);
    }

}

function loadInfoChampionatTeams() {
    var $currentList = $(".listOtherTeam").children("li").eq(indexChampionat).find(".seasonList").children().eq(indexSeason);
    // teams
    for (i = 0; i < $currentList.children(".listClub").children("li").length; i++) {
        var nameTeam = $currentList.children(".listClub").children("li").eq(i).text();
        var htmlSelectorClub = `
        <option>
            <p>` + nameTeam + `</p>
        </option>
        `;
        $(".makeMatch").last().find(".selectNextTeam, .selectFirstTeam").append(htmlSelectorClub);
    }
};

function loadInfoChampionatTours() {
    var $currentList = $(".listOtherTeam").children("li").eq(indexChampionat).find(".seasonList").children().eq(indexSeason);
    // tour 
    for (i = 0; i < $currentList.children(".list-tour").children("li").length; i++) {
        var nameTour = $currentList.children(".list-tour").children("li").eq(i).text();
        var htmlSelectorTour = `
        <option>
            <p>` + nameTour + `</p>
        </option>
        `;
        $(".allMatchesBet").find(".listTour").append(htmlSelectorTour);
    }
}

// Select choose championat 

var seasonNow = 0;
var $currentSeasonAll;
var $currentSeasonForTours;
$(".allMatchesBet").find(".leagueSelect").on("change", function() {
    indexSeason = 0;
    indexChampionat = $(this).children("option:selected").index();
    makeSelectSeasons();
    makeToursAll();
});

$("#seasonSelect").on("change", function() {
    indexSeason = $(this).children("option:checked").index();
    makeToursAll();
})

// Make select seasons all match
function makeSelectSeasons() {
    $currentSeasonAll = $(".listOtherTeam").children("li").eq(indexChampionat).children(".seasonList").children("li");
    $("#seasonSelect").empty();
    for (var i = 0; i < $currentSeasonAll.length; i++) {
        var seasonNamesAll = $currentSeasonAll.eq(i).children("h2").text();
        var optionHtmlSeasonsAll = `
        <option>
            <p>` + seasonNamesAll + `</p>
        </option>
        `;
        $("#seasonSelect").append(optionHtmlSeasonsAll);
    }
}

// Make tours for all bets 
function makeToursAll() {
    $(".allMatchesBet").find(".listTour").empty();
    // tours 
    $currentSeasonForTours = $(".listOtherTeam").children("li").eq(indexChampionat).children(".seasonList").children("li").eq(indexSeason);
    for (var i = 0; i < $currentSeasonForTours.children(".list-tour").children("li").length; i++) {
        var toursNameAll = $currentSeasonForTours.children(".list-tour").children("li").eq(i).text();
        var optionHtmlToursAll = `
        <option>
            <p>` + toursNameAll + `</p>
        </option>
        `;
        $(".allMatchesBet").find(".listTour").append(optionHtmlToursAll);
    }
}

// Make top match form 
var indexSeasonTopMatch = 0;
var indexChampionatTopMatch = 0;
var readyMake = 0;
var $parentSelectChange;
var $currentSeason;

// Add season
function makeSeasonsTop() {
    $currentSeason = $(".listOtherTeam").children("li").eq(indexChampionatTopMatch).children(".seasonList").children("li");
    // seasons
    for (var i = 0; i < $currentSeason.length; i++) {
        var seasonNames = $currentSeason.eq(i).children("h2").text();
        var optionHtmlSeasons = `
        <option>
            <p>` + seasonNames + `</p>
        </option>
        `;
        if (readyMake === 0) {
            for (var ii = 0; ii < $(".topMatchesBet").find(".topMatchThumb").length; ii++) {
                $(".topMatchesBet").find(".topMatchThumb").eq(ii).find(".seasonSelectTopMatch").append(optionHtmlSeasons);
            }
        } else {
            $parentSelectChange.find(".seasonSelectTopMatch").append(optionHtmlSeasons);
        }
    }
}

// Add team to select and tour
function makeTopMatchClubList() {
    $currentSeason = $(".listOtherTeam").children("li").eq(indexChampionatTopMatch).children(".seasonList").children("li");
    // clubs
    for (var i = 0; i < $currentSeason.eq(indexSeasonTopMatch).children(".listClub").children("li").length; i++) {
        var teamsName = $currentSeason.eq(indexSeasonTopMatch).children(".listClub").children("li").eq(i).text();
        var optionHtmlTeams = `
        <option>
            <p>` + teamsName + `</p>
        </option>
        `;
        if (readyMake === 0) {
            for (var ii = 0; ii < $(".topMatchesBet").find(".topMatchThumb").length; ii++) {
                $(".topMatchesBet").find(".topMatchThumb").eq(ii).find(".selectTopTeamFirst").append(optionHtmlTeams);
                $(".topMatchesBet").find(".topMatchThumb").eq(ii).find(".selectTopTeamSecond").append(optionHtmlTeams);
            }
        } else {
            $parentSelectChange.find(".selectTopTeamSecond").append(optionHtmlTeams);
            $parentSelectChange.find(".selectTopTeamFirst").append(optionHtmlTeams);
        }
    }

}

// Add tours 
function makeTopMatchTours() {
    // tours 
    for (var i = 0; i < $currentSeason.eq(indexSeasonTopMatch).children(".list-tour").children("li").length; i++) {
        var toursName = $currentSeason.eq(indexSeasonTopMatch).children(".list-tour").children("li").eq(i).text();
        var optionHtmlTours = `
        <option>
            <p>` + toursName + `</p>
        </option>
        `;
        if (readyMake === 0) {
            for (var ii = 0; ii < $(".topMatchesBet").find(".topMatchThumb").length; ii++) {
                $(".topMatchesBet").find(".topMatchThumb").eq(ii).find(".listTour").append(optionHtmlTours);
            }
        } else {
            $parentSelectChange.find(".listTour").append(optionHtmlTours);
        }
    }
}

// Change championat Top match
$(".topMatchThumb").find('.leagueSelect').on('change', function(e) {
    indexChampionatTopMatch = 0;
    indexSeasonTopMatch = 0;
    $parentSelectChange = $(this).parents(".topMatchThumb");
    readyMake = 1;
    indexChampionatTopMatch = $("option:selected", this).index();
    $parentSelectChange.find(".listTour, .selectTopTeamSecond, .selectTopTeamFirst, .seasonSelectTopMatch").empty();
    makeSeasonsTop();
    makeTopMatchTours();
    makeTopMatchClubList();
});

// Change season top match 
$(".topMatchThumb").find('.seasonSelectTopMatch').on('change', function(e) {
    $parentSelectChange = $(this).parents(".topMatchThumb");
    readyMake = 1;
    indexChampionatTopMatch = $(this).parents(".topMatchThumb").find('.leagueSelect').children("option:selected").index();
    indexSeasonTopMatch = $("option:selected", this).index();
    $parentSelectChange.find(".listTour, .selectTopTeamSecond, .selectTopTeamFirst").empty();
    makeTopMatchTours();
    makeTopMatchClubList();
});

// Delete tour or add tour 
// add tour event
var iDelChamp = 0;
var iDelseason = 0;
var iDelTour = 0;

$("#addTour").on("click", function() {
    var newTourName = $("#addTourTextarea").val();
    if ($("#addTourTextarea").val().length > 0) {
        $("#warningAdding").hide();
        var htmlNewTour = `
            <li>` + newTourName + `</li>
        `
        $(".listOtherTeam").children("li").eq(iDelChamp).children(".seasonList").children("li").eq(iDelseason).find(".list-tour").prepend(htmlNewTour);
        updateTour();
        $("#addTourTextarea").val("");
    } else {
        $("#warningAdding").show();
    }
});

function updateSeason() {
    $("#selectSeasonDeleteTour").empty();
    var delInfo = $(".listOtherTeam").children("li").eq(iDelChamp).children(".seasonList").children("li");
    for (var i = 0; i < delInfo.length; i++) {
        var textLi = delInfo.eq(i).children("h2").text();
        var htmlTextLi = `
        <option>
            <p>` + textLi + `</p>
        </option>
        `;
        $("#selectSeasonDeleteTour").append(htmlTextLi);
    }
}

function updateTour() {
    $("#listTourDelete").empty();
    var delInfo = $(".listOtherTeam").children("li").eq(iDelChamp).children(".seasonList").children("li").eq(iDelseason).children(".list-tour").children("li");
    for (var i = 0; i < delInfo.length; i++) {
        var textLi = delInfo.eq(i).text();
        var htmlTextLi = `
        <option>
            <p>` + textLi + `</p>
        </option>
        `;
        $("#listTourDelete").append(htmlTextLi);
    }
}

// Select champ delete 

$("#championatDeleteTour").on("change", function() {
    iDelChamp = $(this).children("option:checked").index();
    iDelseason = 0;
    iDelTour = 0;
    updateSeason();
    updateTour();
});

$("#selectSeasonDeleteTour").on("change", function() {
    iDelseason = $(this).children("option:checked").index();
    iDelTour = 0;
    updateTour();
});

$("#listTourDelete").on("change", function() {
    iDelTour = $(this).children("option:checked").index();
});

// Modal delete open, event after

$("#deleteTour").on("click", function() {
    $("#deleteTourModal").find(".selectTourForDelete").children("h2").empty();
    var champDelText = $("#championatDeleteTour").children("option:checked").text();
    var seasonDelText = $("#selectSeasonDeleteTour").children("option:checked").text();
    var tourDelText = $("#listTourDelete").children("option:checked").text();
    $("#deleteTourModal").find(".selectTourForDelete").children("h2").text(champDelText + ", " + seasonDelText + ", " + tourDelText);
});

// Confirm delete tour
$('body').on("click", "#confirmDelTour", function() {
    $(".listOtherTeam").children("li").eq(iDelChamp).children(".seasonList").children("li").eq(iDelseason).children(".list-tour").children("li").eq(iDelTour).remove();
    updateTour();
});



