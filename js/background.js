/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3

/**********************************************************/
/**********************************************************/
// Efecto de fundido al entrar y cambiar de estación

var layoutHidden;

function flash(color, time) {
    $('#overlay').css({
        'visibility': 'visible',
        'opacity': '0.0',
        'background-color': color,
        'transition': 'opacity '+time/1000+'s ease-in-out'
    });

    layoutHidden = setTimeout(function(){
        $('#overlay').css({
            'visibility': 'hidden',
            'opacity': '1.0'
        })}, time + 200)
}

$(window).load(function () {
    flash('#1c0920', 1500);
});

function contacto() {
    clearTimeout(layoutHidden);
    
    $('#overlay').stop().css({
        'visibility': 'visible',
        'opacity': '0.7',
        'background-color': 'black',
        'transition': 'all 0s',
        'z-index': '40'
    }).attr("onclick", "cerrarContacto()");
    
    $("#popContacto").css("visibility", "visible").animate({"height":"250px"}, 500).animate({"width":"400px"}, 500);
    setTimeout(function() {
        $("#tablaContacto").animate({"opacity": "1"}, 200);
    }, 1000);
}

function cerrarContacto() {
    $("#tablaContacto").animate({"opacity": "0"}, 200);
    setTimeout(function() {
        $("#popContacto").animate({"width": "30px"}, 300).animate({"height": "0px"}, 300);
    }, 200);
    setTimeout(function() {
        $("#popContacto").css("visibility","hidden");
        $('#overlay').stop().css('visibility', 'hidden').attr("onclick", "");
    }, 800);
}

function bgManager() {
    clearTimeout(layoutHidden);
    
    $('#overlay').stop().css({
        'visibility': 'visible',
        'opacity': '0.7',
        'background-color': 'black',
        'transition': 'all 0s',
        'z-index': '40'
    }).attr("onclick", "cerrarbgManager()");
    
    $("#popFondos").css("visibility", "visible").animate({"height":"308px"}, 500).animate({"width":"608px"}, 500);
    setTimeout(function() {
        cargarFondos(jsonfileBGs);
    }, 1000);
}

function cargarFondos(url) {
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            $("#popFondos").append("<table id='tablaFondos'><tr id='fr1'></tr></table>");
            row = 1;
            console.log(data.visible);
            for (var loaded = 0; loaded < data.visible; loaded++) {
                $("#fr"+row).append("<td id='fc"+loaded+"'></td>");
                $("#fc"+loaded).append("<img src='"+data.bgs[loaded].url+"_thumb.jpg'><p>"+data.bgs[loaded].name+"</p>");
                $("#fc"+loaded).attr("onclick", "cambiaFondo('"+data.bgs[loaded].url+"', '"+data.bgs[loaded].color+"')");
                
                if (((loaded+1)%4)==0) {
                    row++;
                    $("#tablaFondos > tbody").append("<tr id='fr"+row+"'></tr>");
                }
            }
        }
    });
    $("#tablaFondos").animate({"opacity": "1"}, 500);
}

function cambiaFondo(urlImagen, color) {
    cerrarbgManager()
    setTimeout(function() {
        $("body").css("background-image", "url('"+urlImagen+".jpg')");
        flash(color, 300);
    }, 1000);
    
}

function cerrarbgManager() {
    $("#tablaFondos").animate({"opacity": "0"}, 200);
    setTimeout(function() {
        $("#popFondos").animate({"width": "30px"}, 300).animate({"height": "0px"}, 300);
    }, 200);
    setTimeout(function() {
        $("#popFondos").css("visibility","hidden");
        $("#tablaFondos").remove();
        $('#overlay').stop().css('visibility', 'hidden').attr("onclick", "");
    }, 800);
}
