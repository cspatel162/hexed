$.fn.hexed = function(options) {	// Begin defining main body of game
  var randomColors = null;
  var tries = 0;

  // default settings for how the game works
  var defaultSettings = {
    "tries": 10,
    "difficult": 5,
    "sliderValue": 127
  };

  // default settings for each slider
  var sliderSettings = {
    orientation: "horizontal",
    range: "min",
    max: 255,
    value: defaultSettings.sliderValue,
    slide: refreshlabel,
    change: refreshlabel,
  };

  var settings = $.extend( {}, defaultSettings, options );

  // generates random RGB values and returns them in an array
  function calculateRandomColors() {
    var green = Math.floor(Math.random()*255);
    var blue = Math.floor(Math.random()*255);
    var red = Math.floor(Math.random()*255);
    return [red,green,blue];
  };

  // return an array of colors
  function getUserColors() {
    var red = $("#red").slider("value");
    var green = $("#green").slider("value");
    var blue = $("#blue").slider("value");

    return [red,green,blue];
  }

  // changes the labels to the right of the sliders
  function refreshlabel() {
    // get current colors from the sliders
    var colors = getUserColors();
    var red = colors[0], green = colors[1], blue = colors[2];

    // assign the values to the input fields
    $("#redValue").val(red);
    $("#greenValue").val(green);
    $("#blueValue").val(blue);

    // now color the circle with the new values
    colorCircle("userCircle", red, green, blue);
  };

  // changes the CSS for the specified object id
  function colorCircle(objectId, red, green, blue) {
    $("#" + objectId).css("background-color", "rgb(" + red + "," + green + "," + blue + ")");
  }

  // creates all the HTMl elements to the element named "item". All HTMl elements
  // get added to the specified item
  function initHTML(item) {
    // clear inner HTMl
    $(item).empty();

    // add circles to the 
    var circles = $("<section />").attr("id", "circles").appendTo(item);
    $("<div />").attr("id", "randomCircle").addClass("circle").appendTo(circles);
    $("<div />").attr("id", "userCircle").addClass("circle").appendTo(circles);

    // add sliders and their labels
    var red = $( "<div />").attr("id", "red").appendTo(item).slider(sliderSettings);
    var redLabel = $("<input readonly />").attr({"id": 'redValue', "value": defaultSettings.sliderValue}).appendTo(item);
    var green = $( "<div />").attr("id", "green").appendTo(item).slider(sliderSettings);
    var greenLabel = $("<input readonly />").attr({"id": 'greenValue', "value": defaultSettings.sliderValue}).appendTo(item);
    var blue = $( "<div />").attr("id", "blue").appendTo(item).slider(sliderSettings);
    var blueLabel = $("<input readonly />").attr({"id": 'blueValue', "value": defaultSettings.sliderValue}).appendTo(item);

    // add check colors button
    var button = $('<input type="button" />').attr({"id": "checking", "value": "Check Colors"}).appendTo(item);

    // add scores section using the CSS to hide this on first load
    var scores = $("<section />").attr("id", "scores").appendTo(item);
    $('<p />').attr("id", "triesCounter").appendTo(scores);
    $('<p />').attr("id", "redScore").appendTo(scores);
    $('<p />').attr("id", "greenScore").appendTo(scores);
    $('<p />').attr("id", "blueScore").appendTo(scores);

    assignColors();
  };

  // color the circles based on the settings and randomColors generated from before
  function assignColors() {
    randomColors = calculateRandomColors();
    colorCircle("randomCircle", randomColors[0], randomColors[1], randomColors[2]);
    colorCircle("userCircle", settings.sliderValue, settings.sliderValue, settings.sliderValue);
  }

  // game over so let's notify the user and reset the values
  function resetGame() {
    var colors = getUserColors();
    var red = "Your red color: " + colors[0] + "  Correct Color: " + randomColors[0];
    var green = "Your green color: " + colors[1] + "  Correct Color: " + randomColors[1];
    var blue = "Your blue color: " + colors[2] + "  Correct Color: " + randomColors[2];
    alert("GAME OVER\n" + red + "\n" + green + "\n" + blue);

    assignColors();
    $("#scores").hide();
    tries = 0;

    $("#red").slider("value", 127);
    $("#green").slider("value", 127);
    $("#blue").slider("value", 127);
  }

  initHTML(this);

  // jQuery call when the check colors button is clicked
  $(document).ready(function() {
    $("#checking").on("click", function() {
      var real = getUserColors();
      var percentages = [3];
      for (i = 0; i < 3; i++){
        percentages[i] = (Math.abs(real[i]-randomColors[i])/255)*100;
      }
      
      tries += 1;
      $("#triesCounter").text("Number of tries: " + tries);
      $("#redScore").text("Red error: " + percentages[0]);
      $("#greenScore").text("Green error: " + percentages[1]);
      $("#blueScore").text("Blue error: " + percentages[2]);
      $("#scores").show();

      if (tries == settings.tries) {
        resetGame();
      }
    });
  });
}