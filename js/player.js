/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3

/**********************************************************/
/**********************************************************/
// Controles de reproducción de videos

function activarYtb(videoID) {
    var params = { allowScriptAccess: "always", wmode: "opaque" };
    var atts = { id: "ytbplayer" };
    swfobject.embedSWF("http://www.youtube.com/v/"+videoID+"?enablejsapi=1&playerapiid=ytbplayer&autoplay=1&rel=0", "ytbfrm", "420", "315", "8", null, null, params, atts);
}

function onYouTubePlayerReady(playerId) {
    player = document.getElementById("ytbplayer");
    player.addEventListener("onStateChange", "ytbCambioEstado");
    ytbActivado=true;
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

function activarVideo(videoId, esferaId) {
    if (ytbActivado == false) {
        activarYtb(videoId);
    }
    else {
        player.loadVideoById(videoId);
    }
    
    videoIdActivo = videoId;
    $(".sng").removeClass('activo');
    $("#"+esferaId).addClass('activo');
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
    }
    
    numID = aleatorio-(pagina*9)
    setTimeout(function(){
        activarVideo($("#borde"+numID).attr("data-videoID"), "borde"+numID);
    }, 2000);
}

function repetir() {
    $("#repetir").toggleClass("on");
    $("#aleatorio").removeClass("on");
}
function aleatorio() {
    $("#aleatorio").toggleClass("on");
    $("#repetir").removeClass("on");
}
