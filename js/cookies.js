function savePositions() {
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    
    var posiciones = guardaPosiciones();
    posiciones.unshift([$("#ytbcnt").css("top"), $("#ytbcnt").css("left")]);
    
    document.cookie = "posiciones=" + posiciones + "; " + expires;
}

function saveBackground() {
    var d = new Date();
    d.setTime(d.getTime()+(365*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    
    document.cookie = "background=" + $("body").css("background-image") + "; " + expires;
}

function getPositions()
{
    var name = "posiciones=";
    var listaCookies = document.cookie.split(";");
    for(var i=0; i<listaCookies.length; i++) {
        var cookie = listaCookies[i].trim();
        if (cookie.indexOf(name)==0) {
            var cadena = cookie.substring(name.length,cookie.length);
            cadena = cadena.split(",");
            return cadena;
        }   
    }
    return "";
}

function getBackground()
{
    var name = "background=";
    var listaCookies = document.cookie.split(";");
    for(var i=0; i<listaCookies.length; i++) {
        var cookie = listaCookies[i].trim();
        if (cookie.indexOf(name)==0) {
            var cadena = cookie.substring(name.length,cookie.length);
            return cadena;
        }   
    }
    return "";
}

function unwrapCookies()
{
    var bg = getBackground();
    if (bg == "") { bg == "url(imgs/bgs/lluvia.jpg)" }
    $("body").css("background-image", bg);
    
    var positions = getPositions();
    
    if (positions == "") {
        layout0(0);
    }
    else {
        $("#ytbcnt").css({"top": positions[0], "left": positions[1]});
        positions.unshift(); 
        positions.unshift();
        
        positioned = 0;
        $(".sng").each(function() {
            $(this).css({"top":positions[positioned*2], "left":positions[positioned*2+1]});
            positioned++;
        });
    }
}