var jugar = 0;
var acertadas = 0;
var pierdeJuego;
var posicionesAlmacenadas = [];
var idVideoAlmacenada;

function popupJuego() {
    clearTimeout(layoutHidden);
    $('#overlay').stop().css({
        'visibility': 'visible',
        'opacity': '0.7',
        'background-color': 'black',
        'transition': 'all 0s',
        'z-index': '40'
    });
    
    $("body").append("<div id='popJuego' class='popUp'></div>");
    $("#popJuego").css("visibility", "visible").animate({"height":"200px"}, 500).animate({"width":"400px"}, 500);
    $("#popJuego").html("<table id='tablaJuego'><tr><td colspan='2'></td></tr><tr><td></td><td></td></tr></table>");
    $("#popJuego td:eq(0)").html("<p class='textoJuego'> Vas a iniciar un minijuego: Tienes un minuto para colocar cada imagen en su posicion.<br> Esto detendrá el video actual y modificará temporalmente la posición de los elementos.<br> ¿Quieres continuar?</p>");
    $("#popJuego td:eq(1)").html("<span style='background: grey; display: block' onclick='inicializaJuego();'><p class='textoJuego'> Si</p></span>");
    $("#popJuego td:eq(2)").html("<span style='background: grey; display: block' onclick='cierraPopupJuego();'><p class='textoJuego'> No</p></span>");
    
    setTimeout(function() {
        $("#tablaJuego").animate({"opacity": "1"}, 200);
    }, 1000);
}

function cierraPopupJuego() {
    $("#tablaJuego").animate({"opacity": "0"}, 200);
    setTimeout(function() {
        $("#popJuego").animate({"width": "30px"}, 300).animate({"height": "0px"}, 300);
    }, 200);
    setTimeout(function() {
        $("#popJuego").remove();
        $('#overlay').stop().css('visibility', 'hidden').attr("onclick", "");
    }, 800);
    
}

function inicializaJuego () {
    lock();
    
    $("#popJuego").remove();
    $('#overlay').stop().css({
        'visibility': 'visible',
        'opacity': '0.7',
        'background-color': 'burlywood',
        'transition': 'all 0s',
        'z-index': '13'
    });
    $("#header").css("z-index", "0");
    $("#footer").css("z-index", "0");
    
    acertadas = 0;
    idVideoAlmacenada = videoIdActivo;
    posicionesAlmacenadas = guardaPosiciones();
    
    activarVideo('f327T53lEmM', -1);
    $("#ytbcnt").animate({"opacity": '0'}, 500);
    
    setTimeout(function() {creaDraggablesYDroppables();}, 2000);
    pierdeJuego = setTimeout(function () { cierraJuego(0) }, 30*1000);
}

function guardaPosiciones () {
    var posiciones = [];
    
    $(".sng").each(function () {
        posiciones.push([$(this).css("top"), $(this).css("left")]);
    });
    
    return posiciones;
}

function creaDraggablesYDroppables() {
    var slots = 0;
    $(".sng").each(function() {
        $(this).attr("onclick", "").addClass("unlocked").draggable({disabled: false}).draggable({containment: "document"});
        $(this).animate({"top": randomNumber(w_height-200), "left": randomNumber(w_width-200)}, randomNumber(1500))
                .animate({"top": randomNumber(w_height-200), "left": randomNumber(w_width-200)}, randomNumber(1500))
                .animate({"top": randomNumber(w_height-200), "left": randomNumber(w_width-200)}, randomNumber(1500));
        
        $("body").append("<div id='drop"+slots+"' class='sng esfera boton droppableJuego'></div>");
        $("#drop"+slots).css({"top": randomNumber(w_height-200), "left": randomNumber(w_width-200)});
        $("#drop"+slots).droppable({accept: "#borde"+slots, tolerance: "intersect", containment: "document" });
        $("#drop"+slots).on("drop", function(event, ui) {dropped($(this).css("top"), $(this).css("left"),ui)});
        $("#drop"+slots).html("<p class='textoJuego'>"+$("#borde"+slots).attr("data-songName")+"</p>");
        slots++;
    });
}

function dropped(top, left, ui) {
    ui.draggable.css({"top": top,"left": left}).draggable( "destroy" ).removeClass("unlocked");
    acertadas++;

    if (acertadas == 9) {
      cierraJuego(1);
    }
}

function cierraJuego(exito) {
    creaTablaCerrarJuego(exito);
    $(".droppableJuego").each(function () {$(this).remove()});
    
    player.stopVideo();
    if ((idVideoAlmacenada != "") && (idVideoAlmacenada != "f327T53lEmM")){ activarVideo(idVideoAlmacenada); }
    $("#header").css("z-index", "");
    $("#footer").css("z-index", "");
    $("#ytbcnt").animate({"opacity": "1"}, 500);
    
    var restablecidos = 0;
    setTimeout(function() {
        $(".sng").each(function() {
            $(this).attr("onclick", "if ( $(this).hasClass('activo') != 1 ) { activarVideo($(this).attr('data-videoID'), $(this).attr('id')) }");
            $(this).animate({"top":posicionesAlmacenadas[restablecidos][0], "left":posicionesAlmacenadas[restablecidos][1]}, randomNumber(1500));
            restablecidos++;
            if ($(this).attr("data-videoID") == videoIdActivo) {
                $(this).addClass("activo");
            }
        });
    }, 50);
}

function creaTablaCerrarJuego(exito) {
    $("body").append("<div id='popJuego' class='popUp'></div>");
    $("#popJuego").css("visibility", "visible").animate({"height":"200px"}, 500).animate({"width":"200px"}, 500);
    $("#popJuego").html("<table id='tablaJuego'><tr><td colspan='2'></td></tr><tr><td colspan='2'></td></tr></table>");
    
    if (exito == 1) {
        $("#popJuego td:eq(0)").html("<p class='textoJuego'> Has ganado! :] </p>");
        $("#popJuego td:eq(1)").html("<span style='background: grey; display: block' onclick='cierraPopupJuego()'><p class='textoJuego'> Ok</p></span>");
        clearTimeout(pierdeJuego);
    }
    else {
        $("#popJuego td:eq(0)").html("<p class='textoJuego'> Has perdido... intentalo otra vez :@ </p>");
        $("#popJuego td:eq(1)").html("<span style='background: grey; display: block' onclick='cierraPopupJuego()'><p class='textoJuego'> Ok</p></span>");
    }
    
    setTimeout(function() {
        $("#tablaJuego").animate({"opacity": "1"}, 200);
    }, 1000);
}
