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
var videoIdActivo = "";
var randomQueue = [];
var randomQueueMaxSize = 10;
var w_height = $(document).height();
var w_width = $(document).width();
/**********************************************************/
/**********************************************************/
// Carga inicial desde JSON

$(document).ready(function() {
    var loaded = loadSpheres(0, 9, jsonfile);
    setSpheres(loaded);
    layout0(false);
});

/**********************************************************/
/**********************************************************/
// Navegación entre items del .json

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

/**********************************************************/
/**********************************************************/
// Carga y manipulación de esferas

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
                $("body").append("<div class='sng borde boton esfera oculto' id='temp_borde"+cargadas+"' data-videoID="+data.songs[i].src+"> <img class='boton esfera' id='temp_img"+cargadas+"' src='"+data.songs[i].img+"'> </div>");
                $("#temp_borde"+cargadas).css({"border-color": data.songs[i].color, "visibility": "hidden"})   //cambia color del borde
                $("#temp_borde"+cargadas).attr('onclick', 'if ( $(this).hasClass("activo") != 1 ) { activarVideo($(this).attr("data-videoID"), $(this).attr("id")) }'); //añade cambio de video al clicar
                if ($("#temp_borde"+cargadas).attr("data-videoID") == videoIdActivo) {
                    $("#temp_borde"+cargadas).addClass("activo");
                }
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
