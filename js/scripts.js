/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3



/**********************************************************/
/**********************************************************/
//  Carga elementos de la tabla desde archivo JSON

var jsonfile = "items.json";     //Fichero de origen
/* Estructura: {visible, 
                songs[{name, 
                       id, 
                       src, 
                       img, 
                       color
                }]}
*/

$.getJSON(jsonfile, function(data){
    var i;
    var w_height = $(document).height();
    var w_width = $(document).width();

    /* Estas variables definen la posición de los circulos */
    height_ref = 0.15*w_height;
    width_ref = 0.55*w_width;
    /*******************************************************/

    for (i = 0; i < data.visible; i++){                       //Añade celda
        $("body").append("<div class='sng borde circulo' id='"+data.songs[i].id+"'> <img class='boton circulo' id='i"+data.songs[i].id+"' src='"+data.songs[i].img+"'> </div>");
        $("#"+data.songs[i].id).css({'top': (~~(i/3)*160+height_ref)+'px', 'left': ((i%3)*150+width_ref)+'px'});
        $("#"+data.songs[i].id).css('border-color', data.songs[i].color)   //cambia color del borde
        $("#i"+data.songs[i].id).attr('onclick', 'if ( $(this).parent().hasClass("activo") != 1 ) { activarVideo("'+data.songs[i].src+'", $(this).parent().attr("id")) }'); //añade cambio de video al clicar
    }

    $("#tabla > tbody").append("</tr>");            //cierra la ultima fila
});

/**********************************************************/
/**********************************************************/
// Al clicar cada imagen se queda resaltada y se cambia el video
function activarVideo(src, id) {
    $("#ytbfrm").attr("src",  "//www.youtube.com/embed/"+src+"?rel=0&autoplay=1");
    $(".sng").removeClass('activo');
    $("#"+id).addClass('activo');
}

/**********************************************************/
/**********************************************************/
// Rotación entre los fondos

function rotarFondo(){
    if ($("#liFondo").text()=="Solecillo") {
        $("#liFondo").text("Noche");
        flash('#1d7471', 1000);
        $("body").toggleClass("lluvia");
        $("body").toggleClass("sol");
    }
    else if ($("#liFondo").text()=="Noche") {
        $("#liFondo").text("Lluvia");
        flash('#a76c1d', 1000);
        $("body").toggleClass("sol");
        $("body").toggleClass("noche");
    }
    else if ($("#liFondo").text()=="Lluvia") {
        $("#liFondo").text("Solecillo");
        flash('#1c0920', 1000);
        $("body").toggleClass("noche");
        $("body").toggleClass("lluvia");
    }
}

/**********************************************************/
/**********************************************************/
// Efecto de fundido al entrar y cambiar de estación

function flash(color, time) {
    var opacidad = 'opacity '+time/1000+'s ease-in-out'
    $('#overlay').css({
        'visibility': 'visible',
        'opacity': '0.0',
        'background-color': color,
        'transition': opacidad
    });

    setTimeout(function(){
        $('#overlay').css({
            'visibility': 'hidden',
            'opacity': '1.0'
        })}, time)
}

$(window).load(function () {
    flash('#1c0920', 2000);
});

/**********************************************************/
/**********************************************************/
// Cambio de layout 1

function layout0() {        //Normal
    j = 0;
    $("#ytbcnt").animate({'top': '50%', 'left': '12%'}, 1000);
    var w_height = $(document).height();
    var w_width = $(document).width();
    var height_ref = 0.15*w_height;
    var width_ref = 0.55*w_width;
    $(".sng").each(function(){
        $(this).delay(j*100).animate({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref)+'px'}, 1000);
        j++;
    });
}

function layout1() {        //Invertido
    var j = 0;
    $("#ytbcnt").animate({'top': '50%', 'left': '60%'}, 1000);
    var w_height = $(document).height();
    var w_width = $(document).width();
    var height_ref = 0.15*w_height;
    var width_ref = 0.55*w_width;
    $(".sng").each(function(){
        $(this).delay(j*100).animate({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref-600)+'px'}, 1000);
        j++;
    });  
}

function layout2() {        //Arriba y abajo
    var j = 0;
    $("#ytbcnt").animate({'top': '70%', 'left': '35%'}, 1000);
    $(".sng").each(function(){
        $(this).delay(j*100).animate({"left": (200+j*100)+'px', 'top': ((j%2)*100+50)+'px'}, 1000);
        j++;
    });
}

function layout3() {        //Elipse
    var w_height = $(document).height();
    var w_width = $(document).width();
    $("#ytbcnt").animate({'top': ((w_height/2))+'px', 'left': ((w_width/2)-210)+'px'}, 1000);
    var ejemenor=250;
    var ejemayor=350;
    var j = 0;
    $(".sng").each(function(){
        var y = (w_height/2)-60+ejemenor*Math.sin(j*2*Math.PI/9);
        var x = (w_width/2)-80+ejemayor*Math.cos(j*2*Math.PI/9);
        $(this).delay(j*100).animate({"left": x+'px', 'top': y+'px'}, 1000);
        j++;
    });
}