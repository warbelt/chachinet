/***     Mario A. Durántez    ***/
/***   mdurantezs@gmail.com   ***/

// Scripts para www.chachinet.tk
// Usando jQuery 2.0.3

// Layout es el posicionamiento de los objetos en la pantalla
// Este archivo contiene: 
    // una variable 'cantidadLayouts' que contiene el numero total de vistas
    // una funcion 'cargaLayouts' que se invoca al cagar el DOM y crea los botones para cambiar de vista
    // una funcion 'layoutX' que posiciona las esferas y el frame de youtube de una manera determinada
                    // animate: boolean, con valor true, las esferas se colocan con una animación, 
                                        //con valor false se posicionan directamente con css

var cantidadLayouts = 4     //Número total de vistas posibles

$(function cargaLayouts() {
    for (var cargados = 0; cargados < cantidadLayouts; cargados++) {
        $("#vistas").append("<li onclick='layout"+cargados+"(true)'>"+(cargados+1)+"</li>");
    }
});

/**********************************************************/
/**********************************************************/
// Scripts de posicionamiento de los objetos

function layout0(animate) {        //Normal
    var height_ref = 0.15*w_height;
    var width_ref = 0.55*w_width;
    
    j = 0;
    if (animate == true) {
        $("#ytbcnt").stop().animate({'top': '50%', 'left': '12%'}, 1000);
        $(".sng").each(function(){
            $(this).stop().delay(j*100).animate({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref)+'px'}, 1000);
            j++;
        });
    }
    else {
        $("#ytbcnt").css({'top': '50%', 'left': '12%'}, 1000);
        $(".sng").each(function(){
            $(this).css({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref)+'px'}, 1000);
            j++;
        });
    }
}

function layout1(animate) {        //Invertido
    var w_height = $(document).height();
    var w_width = $(document).width();
    var height_ref = 0.15*w_height;
    var width_ref = 0.55*w_width;

    var j = 0;
    if (animate == true) {
        $("#ytbcnt").stop().animate({'top': '50%', 'left': '60%'}, 1000);
        $(".sng").each(function(){
            $(this).stop().delay(j*100).animate({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref-600)+'px'}, 1000);
            j++;
        });  
    }
    else {
        $("#ytbcnt").css({'top': '50%', 'left': '60%'}, 1000);
        $(".sng").each(function(){
            $(this).css({'top': (~~(j/3)*160+height_ref)+'px', 'left': ((j%3)*150+width_ref-600)+'px'}, 1000);
            j++;
        });         
    }

}

function layout2(animate) {        //Arriba y abajo
    var j = 0; 
    if (animate == true) {
        $("#ytbcnt").stop().animate({'top': '70%', 'left': '35%'}, 1000);
        $(".sng").each(function(){
            $(this).stop().delay(j*100).animate({"left": (200+j*100)+'px', 'top': ((j%2)*100+50)+'px'}, 1000);
            j++;
        });
    }
    else {
        $("#ytbcnt").css({'top': '70%', 'left': '35%'}, 1000);
        $(".sng").each(function(){
            $(this).css({"left": (200+j*100)+'px', 'top': ((j%2)*100+50)+'px'}, 1000);
            j++;
        });
    }
}

function layout3(animate) {        //Elipse
    var w_height = $(document).height();
    var w_width = $(document).width();
    var ejemenor=250;
    var ejemayor=350;
    
    var j = 0;
    if (animate == true) {
        $("#ytbcnt").stop().animate({'top': ((w_height/2))+'px', 'left': ((w_width/2)-210)+'px'}, 1000);
        $(".sng").each(function(){
            var y = (w_height/2)-60+ejemenor*Math.sin(j*2*Math.PI/9);
            var x = (w_width/2)-80+ejemayor*Math.cos(j*2*Math.PI/9);
            $(this).stop().delay(j*100).animate({"left": x+'px', 'top': y+'px'}, 1000);
            j++;
        });
    }
    else {
        $("#ytbcnt").css({'top': ((w_height/2))+'px', 'left': ((w_width/2)-210)+'px'}, 1000);
        $(".sng").each(function(){
            var y = (w_height/2)-60+ejemenor*Math.sin(j*2*Math.PI/9);
            var x = (w_width/2)-80+ejemayor*Math.cos(j*2*Math.PI/9);
            $(this).css({"left": x+'px', 'top': y+'px'}, 1000);
            j++;
        });
    }   
}
