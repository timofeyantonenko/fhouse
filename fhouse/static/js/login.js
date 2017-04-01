$(document).ready(function() {
    // Custom label login
    $("#div_id_username").find("label").html("Email").css({ "opacity": "1" });
    $("#div_id_password").find("label").html("Пароль").css({ "opacity": "1" });

    // Download photo
    $("#dowPhoto").change(function() {
        $(".avatarChoose").fadeIn()
        loadAvatar(this);
        avatarUser();
    });

    $(".closeImg").on("click", function() {
        $("#newSrcPhoto").val("");
        $(".avatarChoose").fadeOut();
        $("#imgAva").attr("src", "")
    })

    $("#newSrcPhoto").keyup(function() {
        if ($(this).val() != "") {
            $("#imgAva").on("load", function() {
                $(".avatarChoose").show();
            })
            $(".avatarChoose").hide();
        }
        imgNewSrc = $(this).val();
        $("#imgAva").attr("src", imgNewSrc);
        avatarUser();
    });

    // maxlength
    $("#id_first_name[maxlength], #id_last_name[maxlength], #id_city[maxlength]").bind('input propertychange', function() {
        var maxLength = $(this).attr('maxlength');
        if ($(this).val().length > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
    })

    $("#id_last_name").attr("maxlength", "12");

    $("#id_last_name").keyup(function() {
        if (this.value.length > 12) {}
    });

    // Проверка валидности регистрация
    var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
    var triggerError = true;
    $("#registerBtn").on("click", function(event) {
        if (triggerError == false) {
            $(this).click();
            return;
        }
        event.preventDefault();
        if ($('#id_first_name').val().length > 0 &&
            $('#id_last_name').val().length > 0 &&
            $('#id_password').val().length > 7 &&
            $('#id_email').val() != '' &&
            pattern.test($('#id_email').val())) {
            $('#messageEror').html("");
            if (triggerError) {
                triggerError = false;
            }
            // $(this).unbind('submit').submit()
            // Успешная регистрация
        } else {
            $(".forPlaceholder").find("p").each(function() {
                $(this).hide();
            })
            $('#messageEror').html("Ошибка регистрации. Проверьте правильность заполнения данных");
            // Проверка имени
            if ($('#id_first_name').val().length <= 0) {
                $('#id_first_name').css({ 'border': '1px solid #e62117' });
                $('#id_first_name').parent().find("p").show().text('Это поле необходимо заполнить');
            } else {
                $('#id_first_name').css({ 'border': '1px solid #cccccc' });
            };
            // Проверка фамилии
            if ($('#id_last_name').val().length <= 0) {
                $('#id_last_name').css({ 'border': '1px solid #e62117' });
                $('#id_last_name').parent().find("p").show().text('Это поле необходимо заполнить');
            } else {
                $('#id_last_name').css({ 'border': '1px solid #cccccc' });
            };
            // Проверка пароля
            if ($('#id_password').val().length <= 7) {
                $('#id_password').css({ 'border': '1px solid #e62117' });
                $('#id_password').parent().find("p").show().text('Минимальное количество символов 8');
            } else {
                $('#id_password').css({ 'border': '1px solid #cccccc' });
            };
            // Проверка Эмейла
            if ($('#id_email').val() != '') {
                if (pattern.test($('#id_email').val())) {
                    $('#id_email').css({ 'border': '1px solid #cccccc' });

                } else {
                    $('#id_email').css({ 'border': '1px solid #e62117' });
                    $('#id_email').parent().find("p").show().text('Введите корректный E-mail');
                }
            } else {
                $('#id_email').css({ 'border': '1px solid #e62117' });
                $('#id_email').parent().find("p").show().text('Поле email не должно быть пустым');
            };
        }
    })

    // Check login
    var pError1 = `
        <p class="erorLogin">Введите Email</p>
    `;
    var pError2 = `
        <p class="erorLogin">Введите пароль</p>
    `;
    var pError3 = `
        <p class="erorLogin">Пожалуйста, проверьте правильность написания логина и пароля</p>
    `;

    var triggerErrorLogin = true;
    $(".btnLogin").on("click", function(event) {
        if (triggerErrorLogin == false) {
            $(this).click();
            return;
        }
        event.preventDefault();
        var areaName = $("#id_username").val();
        var areaPas = $("#id_password").val();
        $("#id_password").css({ 'border': '1px solid #cccccc' });
        $("#id_username").css({ 'border': '1px solid #cccccc' });
        $("#loginWarning").find(".erorLogin").remove();
        $("#div_id_password").find(".erorLogin").remove();
        $("#div_id_username").find(".erorLogin").remove();
        if (areaName.length > 0 &&
            areaPas.length > 0) {
            // Проверка правильности пароля и Эмейла 
            // if () {
                if (triggerErrorLogin) {
                    triggerErrorLogin = false;
                }
            // } else {
            // Error login message
            // $("#loginWarning").append(pError3);
            // }
        } else if (areaName.length < 1 &&
            areaPas.length < 1) {
            $("#div_id_password").append(pError2);
            $("#div_id_username").append(pError1);
            $("#id_password").css({ 'border': '1px solid #e62117' });
            $("#id_username").css({ 'border': '1px solid #e62117' });
        } else if (areaName.length > 0 &&
            areaPas.length < 1) {
            $("#div_id_password").append(pError2);
            $("#id_password").css({ 'border': '1px solid #e62117' });
            $("#id_username").css({ 'border': '1px solid #cccccc' });
        } else {
            $("#div_id_username").append(pError1);
            $("#id_password").css({ 'border': '1px solid #cccccc' });
            $("#id_username").css({ 'border': '1px solid #e62117' });
        }
    });

    // Дата рождения
    dateBirth();

    $('#BirthdayMonth').on('change', function(e) {
        dateBirth();
    });

});

function dateBirth() {
    $('#BirthdayDay').children("option").eq(0).prop('selected', true);
    if (($("#BirthdayMonth").val() == '1' ||
            $("#BirthdayMonth").val() == '3' ||
            $("#BirthdayMonth").val() == '5' ||
            $("#BirthdayMonth").val() == '7' ||
            $("#BirthdayMonth").val() == '8' ||
            $("#BirthdayMonth").val() == '10' ||
            $("#BirthdayMonth").val() == '12')) {
        $("#BirthdayDay").children("option").each(function() {
            $(this).show();
        });
    } else if ($("#BirthdayMonth").val() == '2') {
        $("#BirthdayDay").children("option").each(function() {
            if ($(this).index() > 28) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else {
        $("#BirthdayDay").children("option").each(function() {
            if ($(this).index() > 29) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    }
}

function loadAvatar(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imgAva').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
    $("#newSrcPhoto").val("");
}

function avatarUser() {
    $(".flexImg").children("img").each(function() {
        $(this).parent().removeClass("bigWidth");
        $(this).on("load", function() {
            if ($(this).height() < $(this).parent().height()) {
                $(this).parent().addClass("bigWidth");
            } 
        })
    });
}
