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
var itemsUnlocked = false; 
var player; //referencia al reproductor, inicializado en onYouTubePlayerReady()
var randomQueue = [];
var randomQueueMaxSize = 10;
var w_height = $(document).height();
var w_width = $(document).width();
/**********************************************************/
/**********************************************************/
//  Carga elementos de la tabla desde archivo JSON

$(document).ready(function() {
    var cargadas = loadSpheres(0, 9, jsonfile);
    setSpheres(cargadas);
    layout0(false);
});

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
    $('#overlay').css({
        'visibility': 'visible',
        'opacity': '0.0',
        'background-color': color,
        'transition': 'opacity '+time/1000+'s ease-in-out'
    });

    setTimeout(function(){
        $('#overlay').css({
            'visibility': 'hidden',
            'opacity': '1.0'
        })}, time + 200)
}

$(window).load(function () {
    flash('#1c0920', 1500);
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
    
    if (itemsUnlocked == true) { unlock(); }
}

function loadSpheres(start, quantity, url) {
    var cargadas = 0;
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            canciones = data.visible;
            
            if (start >= canciones){
                console.log("index "+start+" does not exist");
                return;
            }

            for (var i = start;  (i < canciones) && (cargadas < 9) ; i++){
                $("body").append("<div class='sng borde boton esfera oculto' id='temp_borde"+cargadas+"'  data-videoID="+data.songs[i].src+"> <img class='boton esfera' id='temp_img"+cargadas+"' src='"+data.songs[i].img+"'> </div>");
                $("#temp_borde"+cargadas).css({"border-color": data.songs[i].color, "visibility": "hidden"})   //cambia color del borde
                $("#temp_borde"+cargadas).attr('onclick', 'if ( $(this).hasClass("activo") != 1 ) { activarVideo($(this).attr("data-videoID"), $(this).attr("id")) }'); //añade cambio de video al clicar
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
    //elige una cancion al azar que no este activa ni en la lista de recientes
    var aleatorio; 
    do {
        aleatorio = Math.floor(Math.random() * canciones);
    } while ($("#borde"+aleatorio).hasClass("activo") || (randomQueue.indexOf(aleatorio) != -1));
    
    randomQueue.push(aleatorio);
    if (randomQueue.length > randomQueueMaxSize) {
        randomQueue.shift();
    }
    
    var paginaAleatorio = Math.floor(aleatorio/9);
    if (paginaAleatorio != pagina)
    {
        pagina = paginaAleatorio;
        cargaPagina();
        console.log("y carga pagina"+pagina)
    }
    
    numID = aleatorio-(pagina*9)
    setTimeout(function(){
        activarVideo($("#borde"+numID).attr("data-videoID"), "borde"+numID);
    }, 2000);
}



function unlock() {
    $("#dragLock > img").attr("src", "media/unlocked20x20.png");
    $("#dragLock").attr("onclick", "lock()").addClass("on");
    
    $(".sng").each(function() {
        $(this).attr("onclick", "").addClass("unlocked").draggable({disabled: false}).draggable({containment: "document"});
        $("#ytbplayer").draggable({disabled: false}).draggable({containment: "document"});
        $("#ytbcnt").draggable({disabled: false}).css("z-index", "-1");
    });
    
    itemsUnlocked = true;
}

function lock() {
    $("#dragLock > img").attr("src", "media/locked20x20.png");
    $("#dragLock").attr("onclick", "unlock()").removeClass("on");
    
    $(".sng").each(function() {
        $(this).attr("onclick", "if ( $(this).hasClass('activo') != 1 ) { activarVideo($(this).attr('data-videoID'), $(this).attr('id')) }").removeClass("unlocked").draggable({ disabled: true });
        $("#ytbplayer").draggable({ disabled: true });
        $("#ytbcnt").draggable({ disabled: true }).css("z-index", "auto");
    });
    
    itemsUnlocked = false;
}
