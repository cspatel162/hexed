$.fn.hexed = function() {	// Begin defining main body of game
	var n_tries = 10;
	var diff = 5;
	rand = getColors();
	initPlugin(this, initPlugin);
}

function getColors(){		// Generates random rgb values and returns them in an array
	var green = Math.floor(Math.random()*255);
	var blue = Math.floor(Math.random()*255);
	var red = Math.floor(Math.random()*255);
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

function initPlugin(object, callback) {
	title = "Hexxed";
	message =  "Guess the Color!";
	gameHTML =  "<section id='hexxed_plugin'>";
	gameHTML += "<h1 id='hexxed_title'>" + title + "</h1>";
	gameHTML += "<div id='hexxed_message'>" + message + "</div>";
	gameHTML += "<div id = \"#hexxed_guess\"></div>";
	gameHTML += "<div id = \"#hexxed_mystery\"></div>";	
	gameHTML += "<div id = \"hexxed_slider1\"></div>";
	gameHTML += "<div id = \"amount1\"></div>";
	gameHTML += "<div id = \"hexxed_slider2\"></div>";
	gameHTML += "<div id = \"amount2\"></div>";
	gameHTML += "<div id = \"hexxed_slider3\"></div>";
	gameHTML += "<div id = \"amount3\"></div>";
	gameHTML += "<link rel=\"stylesheet\" type=\"text/css\" href=\"5-a2.css\"></style>";
	//gameHTML += "<div id=";
	//gameHTML += "<label for='diff'>Difficulty: </label>";
	//gameHTML += "<input type=";
	gameHTML += "</section>";
	$(object).html(gameHTML);

	//Horizontal Slider Function
	$( "#hexxed_slider1, #hexxed_slider2, #hexxed_slider3" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 255,
      value: 60,
      slide: updateGuess,
      change: updateGuess
    });
    // Set amounts in their own divs for each slider
    $( "#amount1" ).val( $( "#hexxed_slider1" ).slider( "value" ) );
    $( "#amount3" ).val( $( "#hexxed_slider3" ).slider( "value" ) );
    $( "#amount2" ).val( $( "#hexxed_slider2" ).slider( "value" ) );

	$('#hexxed_mystery').css(
		'background-color:rgb('+rand[0]+','+rand[1]+','+rand[2]+')');
}

function updateGuess( event, ui ) {
	red = $("#hexxed_slider1").slider( "value" );
	green = $("#hexxed_slider2").slider( "value" );
	blue = $("#hexxed_slider3").slider( "value" );
    $('hexxed_guess').css('background-color:rgb('+red+green+blue+')');
}