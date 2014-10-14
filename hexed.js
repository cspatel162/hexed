function getColors(){		// Generates random rgb values and returns them in an array
	var green = floor(Math.random()*255);
	var blue = floor(Math.random()*255);
	var red = floor(Math.random()*255);
	return [red,green,blue];
}

function percentError(real, player){// Takes in 
	var percentages;
	var total = 0;
	for (i = 0; i < 3; i++){
		percentages[i] = (Math.abs(real[i]-player[i])/255)*100;
		total+=percentages[i];
	}
	percentages[3] = total/3;
	return percentages;
}

$.fn.hexed = function() {	// Begin defining main body of game
	var n_tries = 10;
	var diff = 5;

	/* //Vert Slider Function
	    $( "#slider-vertical" ).slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
    });
    $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
 	*/
}