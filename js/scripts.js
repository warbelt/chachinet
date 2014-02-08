/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3

/**********************************************************/
/**********************************************************/
//  Parametros de configuracion de la página

var jsonfile = "items.json";     
// Fichero json de origen
// Estructura: {visible, 
//              songs[{name, 
//                     id, 
//                     src, 
//                     img, 
//                     color
//              }]}




/**********************************************************/
/**********************************************************/
//  Carga elementos de la tabla desde archivo JSON

$.getJSON(jsonfile, function(data){
    var i;
    var w_height = $(document).height();
    var w_width = $(document).width();

    /* Estas variables definen la posición de las esferas */
    height_ref = 0.15*w_height;
    width_ref = 0.55*w_width;
    /*******************************************************/

    for (i = 0; i < 9; i++){                       //Añade celda
        $("body").append("<div class='sng borde boton esfera' id='borde"+i+"'> <img class='boton esfera' id='img"+i+"' src='"+data.songs[i].img+"'> </div>");
        $("#borde"+i).css({'top': (~~(i/3)*160+height_ref)+'px', 'left': ((i%3)*150+width_ref)+'px'});
        $("#borde"+i).css('border-color', data.songs[i].color)   //cambia color del borde
        $("#img"+i).attr('onclick', 'if ( $(this).parent().hasClass("activo") != 1 ) { activarVideo("'+data.songs[i].src+'", $(this).parent().attr("id")) }'); //añade cambio de video al clicar
    }
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
// Navegación entre canciones

var pagina = 0; //Set de elementos a cargar. Cada página tiene 9 elementos

function anterior() {
    if (pagina == 0) {return;}
    pagina--;
    cargaJSON();
}

function siguiente() {
    pagina ++;
    cargaJSON();
}

function cargaJSON() {
    $.getJSON(jsonfile, function(data){
        var inicio = pagina*9;
        if (inicio >= data.visible) {
            pagina--;
            console.log(inicio);
            console.log(data.visible);
            console.log("error");
            return;
        }
        
        var cargadas = 0;
        for (var i = inicio;  (i < data.visible) && (cargadas < 9) ; i++){                       //Añade celda
            $("body").append("<div class='sng borde boton esfera oculto' id='temp_borde"+cargadas+"'> <img class='boton esfera' id='temp_img"+cargadas+"' src='"+data.songs[i].img+"'> </div>");
            $("#temp_borde"+cargadas).css('border-color', data.songs[i].color)   //cambia color del borde
            $("#temp_img"+cargadas).attr('onclick', 'if ( $(this).parent().hasClass("activo") != 1 ) { activarVideo("'+data.songs[i].src+'", $(this).parent().attr("id")) }'); //añade cambio de video al clicar
            
            $("#temp_borde"+cargadas).css({"top": $("#borde"+cargadas).css("top"), "left": $("#borde"+cargadas).css("left"), "visibility": "hidden"});
            cargadas++;
        }
        
        for (var animadas=0; animadas < cargadas; animadas++) {
            $("#borde"+animadas).addClass("oculto").attr("id", "basura"+animadas);
            setTimeout($("#basura"+animadas).remove(), 400);
            $("#temp_borde"+animadas).attr("id", "borde"+animadas);
            $("#temp_img"+animadas).attr("id", "img"+animadas);
            $("#borde"+animadas).css("visibility", "visible").removeClass("oculto"); 
        }
    });
}

function repetir() {
    $("#repetir").toggleClass("activo");
}
function aleatorio() {
    $("#aleatorio").toggleClass("activo");
}