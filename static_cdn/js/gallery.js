// Активный раздел меню 
$(".nav_ul li:first-child a").addClass("active_nav_ul"); 

$(".nav_ul li a").click(function(e) {
    e.preventDefault();
    $(".nav_ul li a").removeClass('active_nav_ul');
    $(this).addClass('active_nav_ul');
});



$('.foto_left').click(function() {
    $('.left_right_foto').animate({ left: '+=798.656' });
});

$('.foto_right').click(function() {
    $('.left_right_foto').css('left', '-=798.656');
});


if ($(".left_right_foto:nth-child(1)").css("left") == "0px") {
    $(".foto_left").hide();
} else {

    $(".foto_left").show();
};

$(".foto_right").on('click', function() {
    $(".foto_left").show();
});

$(".foto_left").on('click', function() {
    $(".foto_right").show();
});

$(".foto_left").on('click', function() {
	if($(".album_foto .left_right_foto:nth-child(2)").css("left") == "0px") {
		$(".foto_left").hide();
	} else $(".foto_left").show(); 
});

$(".foto_right").on('click', function() {
	if($(".album_foto .left_right_foto:nth-last-child(2)").css("left") == "0px") {
		$(".foto_right").hide();
	} else $(".foto_right").show(); 
});



$(".nav_ul li").on('click', function() {
    if ($(this).is(":first-child")) {
        $(".album_foto:nth-child(1)").show();
        $(".album_foto:nth-child(5)").hide();
        $(".album_foto:nth-child(2)").hide();
        $(".album_foto:nth-child(3)").hide();
        $(".album_foto:nth-child(4)").hide();

    } else if ($(this).is(":nth-child(2)")) {
        $(".album_foto:nth-child(2)").show();
        $(".album_foto:nth-child(1)").hide();
        $(".album_foto:nth-child(5)").hide();
        $(".album_foto:nth-child(3)").hide();
        $(".album_foto:nth-child(4)").hide();

    } else if ($(this).is(":nth-child(3)")) {
        $(".album_foto:nth-child(3)").show();
        $(".album_foto:nth-child(1)").hide();
        $(".album_foto:nth-child(2)").hide();
        $(".album_foto:nth-child(5)").hide();
        $(".album_foto:nth-child(4)").hide();

    } else if ($(this).is(":nth-child(4)")) {
        $(".album_foto:nth-child(4)").show();
        $(".album_foto:nth-child(1)").hide();
        $(".album_foto:nth-child(2)").hide();
        $(".album_foto:nth-child(3)").hide();
        $(".album_foto:nth-child(5)").hide();

    } else {
        $(".album_foto:nth-child(5)").show();
        $(".album_foto:nth-child(1)").hide();
        $(".album_foto:nth-child(2)").hide();
        $(".album_foto:nth-child(3)").hide();
        $(".album_foto:nth-child(4)").hide();

    }
});
