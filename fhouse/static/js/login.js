$(document).ready(function() {
    // $("#cropBttn").on("click", function() {
    //     $("#croppedImage").show();
    //     console.log("tratata")
    // });

    // Download photo
    $("#dowPhoto").change(function() {
        $(".avatarChoose").fadeIn()
        loadAvatar(this);
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

    // Минимальное к-во символов пароль
    // $('#id_password').blur(function() {
    //     if ($(this).val().length > 7) {
    //         $(this).parent().find("p").text('');
    //         $(this).css({ 'border': '1px solid #cccccc' });
    //     } else {
    //         $(this).css({ 'border': '1px solid #e62117' });
    //         $(this).parent().find("p").text('Минимальное количество символов 8');
    //     }
    // });

    // Валидность E-mail
    // $('#id_email').blur(function() {
    //     if ($(this).val() != '') {
    //         var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
    //         if (pattern.test($(this).val())) {
    //             $(this).parent().find("p").text('');
    //             $(this).css({ 'border': '1px solid #cccccc' });
    //         } else {
    //             $(this).css({ 'border': '1px solid #e62117' });
    //             $(this).parent().find("p").text('Введите корректный E-mail');
    //         }
    //     } else {
    //         $(this).css({ 'border': '1px solid #e62117' });
    //         $(this).parent().find("p").text('Поле email не должно быть пустым');
    //     }
    // });

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
            $('#messageEror').html("Ошибка регистрации. Проверьте правильность заполнения данных");
            // Проверка имени
            if ($('#id_first_name').val().length <= 0) {
                $('#id_first_name').css({ 'border': '1px solid #e62117' });
                $('#id_first_name').parent().find("p").text('Это поле необходимо заполнить');
            } else {
                $('#id_first_name').parent().find("p").text('');
                $('#id_first_name').css({ 'border': '1px solid #cccccc' });
            }
            // Проверка фамилии
            if ($('#id_last_name').val().length <= 0) {
                $('#id_last_name').css({ 'border': '1px solid #e62117' });
                $('#id_last_name').parent().find("p").text('Это поле необходимо заполнить');
            } else {
                $('#id_last_name').parent().find("p").text('');
                $('#id_last_name').css({ 'border': '1px solid #cccccc' });
            }
            // Проверка пароля
            if ($('#id_password').val().length <= 7) {
                $('#id_password').css({ 'border': '1px solid #e62117' });
                $('#id_password').parent().find("p").text('Минимальное количество символов 8');
            } else {
                $('#id_password').parent().find("p").text('');
                $('#id_password').css({ 'border': '1px solid #cccccc' });
            }
            // Проверка Эмейла
            if ($('#id_email').val() != '') {
                if (pattern.test($(this).val())) {
                    $('#id_email').parent().find("p").text('');
                    $('#id_email').css({ 'border': '1px solid #cccccc' });
                } else {
                    $('#id_email').css({ 'border': '1px solid #e62117' });
                    $('#id_email').parent().find("p").text('Введите корректный E-mail');
                }
            } else {
                $('#id_email').css({ 'border': '1px solid #e62117' });
                $('#id_email').parent().find("p").text('Поле email не должно быть пустым');
            }
        }
    })

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

// function downloadLinkTosrc() {
//     var srcNew = $(this).val();
//     $('.imgOfferArticle').attr('src', srcNew);
// }

// function loadAvatar(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             imgNewSrc = e.target.result
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }

// var newHeight;
// var newWidth;
// var y1;
// var y2;
// var x1;
// var x2;
// var canvasElement;
// var reletionship = 1;

// $(window).load(function() {

//     $("#dowPhoto").change(function() {
//         readURLoffer(this);
//         console.log("Привет пидары " + imgNewSrc)
//         imageCropper.init();
//     });

//     var parentcanvasWidth = $(".canvasParent").width();
//     var imageUploader;
//     var imgNewSrc = 'https://pp.userapi.com/c836630/v836630082/2af97/sEC9fj7ZOmU.jpg';
//     imageCropper = {

//         ctx: null,

//         image: null,

//         click: false,

//         downPointX: 0,

//         downPointY: 0,

//         lastPointX: 0,

//         lastPointY: 0,

//         hoverBoxSize: 5,

//         cropedFile: null,

//         resize: false,

//         canvasBackgroundColor: "#222",


//         init: function() {
//             this.ctx = document.getElementById("panel").getContext("2d");
//             canvasElement = document.getElementById("panel").getContext("2d");
//             var imageUploader = document.getElementById('imageLoader');
//             this.initCanvas();
//             document.getElementById("cropBttn").onclick = this.cropImage.bind(this);
//         },

//         initCanvas: function(image) {
//             this.image = new Image();
//             this.image.setAttribute('crossOrigin', 'anonymous'); //optional,  it is needed only if your image is not avalible on same domain.
//             this.image.src = imgNewSrc;
//             this.image.onload = function() {

//                 var canvas = document.getElementById("panel");
//                 var maxWidtCanvas = $(".canvasParent").width();
//                 if (this.image.width > maxWidtCanvas) {
//                     reletionship = maxWidtCanvas / this.image.width;
//                     this.image.height *= maxWidtCanvas / this.image.width;
//                     this.image.width = maxWidtCanvas;

//                 }
//                 var ctx = canvas.getContext("2d");
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//                 this.ctx.canvas.width = this.image.width;
//                 this.ctx.canvas.height = this.image.height;
//                 this.reDrawCanvas();
//                 this.initEventsOnCanvas();
//             }.bind(this);
//         },

//         /**
//          * Initlize mousedown and mouseup event, third brother of this type of event, onmousemove, will be set little letter.
//          *
//          */
//         initEventsOnCanvas: function() {
//             this.ctx.canvas.onmousedown = this.onMouseDown.bind(this);
//             this.ctx.canvas.onmouseup = this.onMouseUp.bind(this);
//         },

//         /**
//          * This event is bit tricky!
//          * Normal task of this method is to pin point the starting point, from where we will  strat making the selectin box.
//          * However, it work diffrently if user is hover over the resize boxes
//          *
//          */
//         onMouseDown: function(e) {
//             $("#croppedImage").hide();
//             var loc = this.windowToCanvas(e.clientX, e.clientY);
//             e.preventDefault();
//             this.click = true;
//             if (!this.resize) {
//                 this.ctx.canvas.onmousemove = this.onMouseMove.bind(this);
//                 this.downPointX = loc.x;
//                 this.downPointY = loc.y;
//                 this.lastPointX = loc.x;
//                 this.lastPointY = loc.y;
//             }

//         },

//         /**
//          * register normal movement, with click but no re-size.
//          */
//         onMouseMove: function(e) {
//             e.preventDefault();
//             if (this.click) {
//                 var loc = this.windowToCanvas(e.clientX, e.clientY);
//                 this.lastPointX = loc.x;
//                 x1 = this.downPointX;
//                 x2 = this.lastPointX;
//                 y1 = this.downPointY;
//                 if (x1 <= x2 && y1 <= loc.y) {
//                     this.lastPointY = ((x2 - x1) + y1);
//                 } else if (x1 <= x2 && y1 > loc.y) {
//                     this.lastPointY = (y1 - (x2 - x1));
//                 } else if (x1 > x2 && y1 <= loc.y) {
//                     this.lastPointY = ((x1 - x2) + y1);
//                 } else if (x1 > x2 && y1 > loc.y) {
//                     this.lastPointY = (y1 - ((x1 - x2)));

//                 }
//                 y2 = this.lastPointY;
//                 imageCropper.sizeNewImg();

//                 this.reDrawCanvas();

//             }
//         },

//         sizeNewImg: function() {
//             if (x1 > x2) {
//                 newWidth = (x1 - x2);
//                 $("#croppedImage").css({ "width": newWidth })
//             } else {
//                 newWidth = (x2 - x1);
//                 $("#croppedImage").css({ "width": newWidth })
//             }

//             if (y1 > y2) {
//                 newHeight = (y1 - y2);
//                 $("#croppedImage").css({ "height": newHeight })
//             } else {
//                 newHeight = (y2 - y1);
//                 $("#croppedImage").css({ "height": newHeight })
//             }
//         },

//         onMouseUp: function(e) {
//             e.preventDefault();
//             this.ctx.canvas.onmousemove = this.onImageResize.bind(this);
//             this.click = false;
//         },

//         reDrawCanvas: function() {
//             this.clearCanvas();
//             this.drawImage();
//             this.drawSelRect();
//             this.drawResizerBox();
//         },

//         clearCanvas: function() {
//             this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
//             this.ctx.fillStyle = this.canvasBackgroundColor;
//             this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
//         },

//         /**
//          * Draw image on canvas.
//          */
//         drawImage: function() {
//             this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
//         },

//         /**
//          * Draw selection box on canvas
//          */
//         drawSelRect: function() {
//             this.ctx.strokeStyle = '#000000';
//             this.ctx.lineWidth = 1;
//             this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY));
//         },

//         /**
//          * This method take care of resizeing the selection box.
//          * It does so by looking on (click == true and hover on resize box == true)
//          * if both are true, it adjust the resize.
//          *
//          * @param  {[type]} e [description]
//          * @return {[type]}   [description]
//          */
//         onImageResize: function(e) {
//             var centerPointX = (this.lastPointX + this.downPointX) / 2;
//             var centerPointY = (this.lastPointY + this.downPointY) / 2;
//             var loc = this.windowToCanvas(e.clientX, e.clientY);
//             this.ctx.fillStyle = '#FF0000';
//             this.ctx.lineWidth = 2;

//             if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
//                 if (this.click) {
//                     this.downPointY = loc.y;
//                     this.reDrawCanvas();
//                     x2 = this.lastPointX;
//                     y2 = this.lastPointY;
//                     y1 = this.downPointY;
//                     if (y1 <= y2 && x2 <= loc.x) {
//                         this.downPointX = x2 + (y2 - y1);
//                     } else if (y1 <= y2 && x2 > loc.x) {
//                         this.downPointX = x2 - (y2 - y1);
//                     } else if (y1 > y2 && x2 <= loc.x) {
//                         this.downPointX = x2 + (y1 - y2);
//                     } else if (y1 > y2 && x2 > loc.x) {
//                         this.downPointX = x2 - (y1 - y2);

//                     }
//                     x1 = this.downPointX;

//                     imageCropper.resizeProportion();
//                     imageCropper.sizeNewImg();
//                 }

//             } else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
//                 if (this.click) {
//                     this.lastPointX = loc.x;
//                     this.reDrawCanvas();
//                     x1 = this.downPointX;
//                     x2 = this.lastPointX;
//                     y1 = this.downPointY;
//                     if (x1 <= x2 && y1 <= loc.y) {
//                         this.lastPointY = ((x2 - x1) + y1);
//                     } else if (x1 <= x2 && y1 > loc.y) {
//                         this.lastPointY = (y1 - (x2 - x1));
//                     } else if (x1 > x2 && y1 <= loc.y) {
//                         this.lastPointY = ((x1 - x2) + y1);
//                     } else if (x1 > x2 && y1 > loc.y) {
//                         this.lastPointY = (y1 - (x1 - x2));

//                     }
//                     y2 = this.lastPointY;
//                     imageCropper.sizeNewImg();
//                 }
//             } else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
//                 if (this.click) {
//                     this.lastPointY = loc.y;
//                     this.reDrawCanvas();
//                     x1 = this.downPointX;
//                     y2 = this.lastPointY;
//                     y1 = this.downPointY;
//                     if (y1 <= y2 && x1 <= loc.x) {
//                         this.lastPointX = x1 + (y2 - y1);
//                     } else if (y1 <= y2 && x1 > loc.x) {
//                         this.lastPointX = x1 - ((y2 - y1));
//                     } else if (y1 > y2 && x1 <= loc.x) {
//                         this.lastPointX = x1 + (y1 - y2);
//                     } else if (y1 > y2 && x1 > loc.x) {
//                         this.lastPointX = x1 - (y1 - y2);

//                     }
//                     x2 = this.lastPointX;
//                     imageCropper.sizeNewImg();
//                 }
//             } else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
//                 if (this.click) {
//                     this.downPointX = loc.x;
//                     this.reDrawCanvas();
//                     x1 = this.downPointX;
//                     x2 = this.lastPointX;
//                     y2 = this.lastPointY;
//                     if (x1 <= x2 && y2 <= loc.y) {
//                         this.downPointY = ((x2 - x1) + y2);
//                     } else if (x1 <= x2 && y2 > loc.y) {
//                         this.downPointY = (y2 - (x2 - x1));
//                     } else if (x1 > x2 && y2 <= loc.y) {
//                         this.downPointY = ((x1 - x2) + y2);
//                     } else if (x1 > x2 && y2 > loc.y) {
//                         this.downPointY = (y2 - ((x1 - x2)));
//                     }
//                     y1 = this.downPointY;
//                     imageCropper.sizeNewImg();
//                 }
//             } else {
//                 this.resize = false;
//                 this.reDrawCanvas();
//             }
//         },

//         resizeProportion: function() {
//             console.log(this.lastPointY);
//         },

//         /**
//          * Detect the mousehover on given axis
//          */
//         isResizeBoxHover: function(loc, xPoint, yPoint) {
//             var hoverMargin = 3;
//             if (loc.x > (xPoint - this.hoverBoxSize - hoverMargin) && loc.x < (xPoint + this.hoverBoxSize + hoverMargin) && loc.y > (yPoint - this.hoverBoxSize - hoverMargin) && loc.y < (yPoint + 5 + hoverMargin)) {
//                 this.ctx.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
//                 this.resize = true;
//                 return true;
//             }
//             return false;
//         },

//         /**
//          * Draw 4 resize box of 10 x 10
//          * @return {[type]} [description]
//          */
//         drawResizerBox: function() {
//             var centerPointX = (this.lastPointX + this.downPointX) / 2;
//             var centerPointY = (this.lastPointY + this.downPointY) / 2;
//             this.ctx.fillStyle = '#000000';
//             this.ctx.lineWidth = 1;
//             this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.downPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
//             this.ctx.fillRect(this.lastPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
//             this.ctx.fillRect(centerPointX - this.hoverBoxSize, this.lastPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
//             this.ctx.fillRect(this.downPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2);
//         },

//         /**
//          * Translate to HTML coardinates to Canvas coardinates.
//          */
//         windowToCanvas: function(x, y) {
//             var canvas = this.ctx.canvas,
//                 bbox = canvas.getBoundingClientRect();
//             return {
//                 x: x - bbox.left * (canvas.width / bbox.width),
//                 y: y - bbox.top * (canvas.height / bbox.height)
//             };
//         },

//         /**
//          * Get the canavs, remove cutout, create image elemnet on UI.
//          * @return {[type]}
//          */
//         cropImage: function() {
//             var tempCtx = document.createElement('canvas').getContext('2d');
//             tempCtx.canvas.width = newWidth;
//             tempCtx.canvas.height = newHeight;
//             tempCtx.drawImage(this.image, this.downPointX / reletionship, this.downPointY / reletionship, ((this.lastPointX - this.downPointX) / reletionship), ((this.lastPointY - this.downPointY) / reletionship), 0, 0, newWidth, newHeight);
//             var imageData = tempCtx.canvas.toDataURL();
//             document.getElementById('croppedImage').src = imageData;
//         },

//         imgToEdit: function() {
//             var text_news = $(".one_suggestion_news").eq(0).find(".text_suggesting_news").text();
//             $("#text-suggesting-news").val(text_news);
//             if ($(".one_suggestion_news").eq(0).hasClass("article")) {
//                 $(".tegs").hide();
//             } else {
//                 $(".tegs").show();
//             }
//         }
//     }
//     imageCropper.init();
//     imageCropper.imgToEdit();

//     $(".editNewsBtn").on("click", function() {
//         $("#croppedImage").hide();
//         $("body,html").animate({ scrollTop: 0 }, 200);
//         imgNewSrc = $(this).parents(".one_suggestion_news").find(".imgConteinerSuggestion").children("img").attr("src")
//         var text_news = $(this).parents(".one_suggestion_news").find(".text_suggesting_news").text();
//         if ($(this).parents(".one_suggestion_news").hasClass("article")) {
//             $(".tegs").hide();
//         } else {
//             $(".tegs").show();
//         }
//         $("#text-suggesting-news").val(text_news)
//         $(".tegs_area").empty();
//         $("#seachTags").val("");
//         $(".addNewTag").find("textarea").val("");
//         $(".list_tegs").slideUp('fast');
//         imageCropper.init();
//     });

//     // Delete news modal
//     $('body').on("click", "#confirmDel", function() {
//         $("#croppedImage").hide();
//         var src_delete_photo = $(".forDelete").find(".imgConteinerSuggestion").find("img").attr("src");
//         console.log(src_delete_photo + " " + imgNewSrc)
//         $(".forDelete").fadeOut("normal", function() {
//             $(this).remove();
//             if (src_delete_photo == imgNewSrc &&
//                 $(".all_suggesting_news .one_suggestion_news").length > 0) {
//                 imgNewSrc = $(".one_suggestion_news").eq(0).find(".imgConteinerSuggestion").children("img").attr("src");
//                 imageCropper.imgToEdit();
//             } else if ($(".all_suggesting_news .one_suggestion_news").length == 0) {
//                 imgNewSrc = 'https://pp.vk.me/c638716/v638716438/22852/s-613WAij5o.jpg';
//                 $("#text-suggesting-news").val("");
//             }

//             imageCropper.init();

//         });
//     });

//     // Add new photo to news if user add bad or not add 

//     $("#newSrcPhoto").keyup(function() {
//         imgNewSrc = $("#newSrcPhoto").val();
//         console.log(imgNewSrc)
//         imageCropper.init();
//     });
// });
