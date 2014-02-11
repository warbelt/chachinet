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

var canciones;  //Numero total de canciones incluidas en el json
var pagina = 0; //Set de elementos a cargar. Cada página tiene 9 elementos
var ytbActivado = false; //boolean, 0 si no se ha activado aun el reproductor flash
var player; //referencia al reproductor, inicializado en onYouTubePlayerReady()
/**********************************************************/
/**********************************************************/
//  Carga elementos de la tabla desde archivo JSON

$.getJSON(jsonfile, function(data){
    var i;
    var w_height = $(document).height();
    var w_width = $(document).width();
    canciones = data.visible;
    /* Estas variables definen la posición de las esferas */
    height_ref = 0.15*w_height;
    width_ref = 0.55*w_width;
    /*******************************************************/

    for (i = 0; i < 9; i++){                       //Añade celda
        $("body").append("<div class='sng borde boton esfera' id='borde"+i+"'> <img class='boton esfera' id='img"+i+"' src='"+data.songs[i].img+"' data-videoID="+data.songs[i].src+"> </div>");
        $("#borde"+i).css({'top': (~~(i/3)*160+height_ref)+'px', 'left': ((i%3)*150+width_ref)+'px'});
        $("#borde"+i).css('border-color', data.songs[i].color)   //cambia color del borde
        $("#img"+i).attr('onclick', 'if ( $(this).parent().hasClass("activo") != 1 ) { activarVideo($(this).attr("data-videoID"), $(this).parent().attr("id")) }'); //añade cambio de video al clicar
    }
});

/**********************************************************/
/**********************************************************/
// Al clicar cada imagen se queda resaltada y se cambia el video

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

function anterior() {
    if (pagina == 0) {return;}
    pagina--;
    cargaPagina();
}

function siguiente() {
    pagina ++;
    cargaPagina();
}

function cargaPagina() {
    var inicio = pagina*9;
    var cargadas = loadSpheres(inicio, 9, jsonfile);
    
    if (cargadas==(0)){
        pagina-=1;
        return;
    }
    
    setSpheres(cargadas);
}

function loadSpheres(start, quantity, url) {
    var cargadas = 0;
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            if (start >= data.visible){
                console.log("index "+start+" does not exist");
                return;
            }

            for (var i = start;  (i < data.visible) && (cargadas < 9) ; i++){
                $("body").append("<div class='sng borde boton esfera oculto' id='temp_borde"+cargadas+"'> <img class='boton esfera' id='temp_img"+cargadas+"' src='"+data.songs[i].img+"' data-videoID="+data.songs[i].src+"> </div>");
                $("#temp_borde"+cargadas).css({"border-color": data.songs[i].color, "visibility": "hidden"})   //cambia color del borde
                $("#temp_img"+cargadas).attr('onclick', 'if ( $(this).parent().hasClass("activo") != 1 ) { activarVideo($(this).attr("data-videoID"), $(this).parent().attr("id")) }'); //añade cambio de video al clicar
                cargadas++;
            }
        }
    });
    return (cargadas);
}

function setSpheres(cargadas) {
    for (var spheresSet=0; spheresSet < cargadas; spheresSet++) {
            $("#temp_borde"+spheresSet).css({"top": $("#borde"+spheresSet).css("top"), "left": $("#borde"+spheresSet).css("left")});
            $("#borde"+spheresSet).addClass("basura").attr("id", "basura"+spheresSet);
            $("#temp_borde"+spheresSet).attr("id", "borde"+spheresSet);
            $("#temp_img"+spheresSet).attr("id", "img"+spheresSet);
            $("#borde"+spheresSet).css("visibility", "visible").removeClass("oculto");
        }
    setTimeout(function(){$(".basura").each(function(){$(this).remove()})}, 400);
}

/**********************************************************/
/**********************************************************/
// Controles de reproductor

function activarYtb(videoID) {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytbplayer" };
    swfobject.embedSWF("http://www.youtube.com/v/"+videoID+"?enablejsapi=1&playerapiid=ytbplayer&autoplay=1&rel=0", "ytbfrm", "420", "315", "8", null, null, params, atts);
}

function onYouTubePlayerReady(playerId) {
    player = document.getElementById("ytbplayer");
    player.addEventListener("onStateChange", "ytbCambioEstado");
    ytbActivado=true;
    console.log("activado reproductor");
}

function ytbCambioEstado(estado) {
    //finaliza video -> repetir
    if ((estado == 0) && ($("#repetir").hasClass("on"))) {
        player.playVideo();
    }
    
    if ((estado == 0) && ($("#aleatorio").hasClass("on"))) {
        playRandom();
    }
}

function activarVideo(src, id) {
    if (ytbActivado == false) {
        activarYtb(src);
    }
    else {
        player.loadVideoById(src);
    }
    
    $(".sng").removeClass('activo');
    $("#"+id).addClass('activo');
}

function repetir() {
    $("#repetir").toggleClass("on");
    $("#aleatorio").removeClass("on");
}
function aleatorio() {
    $("#aleatorio").toggleClass("on");
    $("#repetir").removeClass("on");
}

function playRandom() {
    //elige una cancion al azar que no este activa
    var aleatorio; 
    do {
        aleatorio = Math.floor(Math.random() * canciones);
    } while ($("#borde"+aleatorio).hasClass("activo"))
    console.log(aleatorio);
    var paginaAleatorio = Math.floor(aleatorio/9);
    if (paginaAleatorio != pagina)
    {
        pagina = paginaAleatorio;
        cargaPagina();
        console.log("y carga pagina"+pagina)
    }
    
    numID = aleatorio-(pagina*9)
    console.log(numID);
    setTimeout(function(){
        console.log($("#img"+numID).attr("data-videoID"));
        console.log("borde"+numID);
        activarVideo($("#img"+numID).attr("data-videoID"), "borde"+numID);
    }, 2000);
}