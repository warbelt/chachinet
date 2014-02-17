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
