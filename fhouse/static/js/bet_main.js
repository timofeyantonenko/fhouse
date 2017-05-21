$(document).on("ready", function() {

	var $conteinerArt = $("#article_top_match");

	for ( var i = 0; i < matches_time.length; i++) {
		var matTime = matches_time[i];
		console.log(matTime)
		var $time_1_Cont = $conteinerArt.children("section").eq(i).find(".timeKiev"),
			$time_2_Cont = $conteinerArt.children("section").eq(i).find(".timeMoscow");
		var newTime1 = matTime.toLocaleString('ru-Ru', { timeZone: 'Europe/Moscow' });
    		newTime1 = dateChange( newTime1 );
    	var newTime2 = matTime.toLocaleString('ru-Ru', { timeZone: 'Europe/Kiev' });
    		newTime2 = dateChange( newTime2 );
    		// newTime2 = newTime2.split(", ").slice(1).join("").split(":").slice(0, 2).join(":");
    	$time_1_Cont.html(newTime1);
    	$time_2_Cont.html(newTime2);
	}

});


function dateChange( date ) {
	return ( 
		date.split(", ").map( function(e, i) {
			if ( i === 0) {
				return ( 
					e.split(".").slice(0, 2).map(function(e, i) {
						if ( i === 0) return e;
						if (e < 10 ) {
							var month = e.slice(-1) - 1;
							return month_convert(month)
						} else {
							return month_convert(e)
						}
					}).join(" ")
				)
			} 
			return e.split(":").slice(0, 2).join(":")
		}).join(", ")
	)
} 


function month_convert(month) {
    var arrMonth = ['Янв', 'Фев', 'Март', 'Апр', 'Мая', 'Июня', 'Июля', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return arrMonth[month]
}