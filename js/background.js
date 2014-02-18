/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3

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

function contacto() {
    $('#overlay').stop().css({
        'visibility': 'visible',
        'opacity': '0.5',
        'background-color': 'black',
        'transition': 'all 0s',
        'z-index': '9'
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
