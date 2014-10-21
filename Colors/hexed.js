$.fn.hexed = function(options) {	// Begin defining main body of game
  var randomColors = null;
  var tries = 0;
  var startTime = null;
  var endTime = null;
  var jsonData = [];

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

  // combine default settings with the options argument
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

    // add circles to the item
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

    // add link to saved scores page
    var link = $('<a target="_blank" href="scores.html">View Saved Scores</a>').appendTo(item);

    // add check colors button
    var button = $('<input type="button" />').attr({"id": "checking", "value": "Check Colors"}).appendTo(item);

    // add next color button
    var next_button = $('<input type="button" />').attr({"id":"next", "value": "Next Color"}).appendTo(item);

    // add scores section using the CSS to hide this on first load
    var scores = $("<section />").attr("id", "scores").appendTo(item);
    $('<p />').attr("id", "triesCounter").appendTo(scores);
    $('<p />').attr("id", "averageScore").appendTo(scores);
    $('<p />').attr("id", "redScore").appendTo(scores);
    $('<p />').attr("id", "greenScore").appendTo(scores);
    $('<p />').attr("id", "blueScore").appendTo(scores);

    // list of all scores previously achieved
    $('<ol />').attr("id", "allScores").appendTo(scores);

    assignColors();

    // assign startTime;
    startTime = new Date();
  };

  // color the circles based on the settings and randomColors generated from before
  function assignColors() {
    randomColors = calculateRandomColors();
    colorCircle("randomCircle", randomColors[0], randomColors[1], randomColors[2]);
    colorCircle("userCircle", settings.sliderValue, settings.sliderValue, settings.sliderValue);
  }

  // game over so let's notify the user and reset the values
  function resetGame(finalScore, timeStamp, full_reset) {
    if (full_reset){
      var colors = getUserColors();
      var red = "Your red color: " + colors[0] + "  Correct Color: " + randomColors[0];
      var green = "Your green color: " + colors[1] + "  Correct Color: " + randomColors[1];
      var blue = "Your blue color: " + colors[2] + "  Correct Color: " + randomColors[2];
      alert("GAME OVER\n" + red + "\n" + green + "\n" + blue);

      // get data needed for the JSON
      var name = prompt("Enter Your Name to Save Your High Score");
      if (name === "") {
        name = "None"
      }
      item = {}
      item.name = name;
      item.difficult = settings.difficult;
      item.turns = tries;
      item.score = finalScore;
      item.timeStamp = timeStamp;

      // add the new json to our jsonData
      jsonData.push(item);
      saveJSON();
    }
    // reset variables for a new game
    assignColors();
    $("#scores").hide();
    tries = 0;
    $("#allScores").empty();

    $("#red").slider("value", 127);
    $("#green").slider("value", 127);
    $("#blue").slider("value", 127);
  }

  // load the JSON from local storage if it exist
  function loadJSON() {
    if(localStorage.hexed) {
      jsonData = JSON.parse(localStorage.hexed);
    } else {
      jsonData = [];
    }
  }

  // save the JSON to local storage
  function saveJSON() {
    var data = JSON.stringify(jsonData);
    localStorage.hexed = data;
  }

  // ************** MAIN *****************
  // function to call to build plugin HTML
  // and initialize the game
  initHTML(this);

  // load JSON from local storage
  loadJSON();

  // jQuery call when the check colors button or the next color button is clicked
  $(document).ready(function() {
    $("#checking").on("click", function() {
      endTime = new Date();

      // determine the error percentages for each color
      var real = getUserColors();
      var percentages = [3];
      var average = 0;
      for (i = 0; i < 3; i++){
        percentages[i] = (Math.abs(real[i]-randomColors[i])/255)*100;
        average += percentages[i];
      }
      average = average/3;

      // calculate the number of milliseconds between each clicking of the button
      var milliseconds = (endTime.getTime() - startTime.getTime())/1000;
      var scoringFormula = ((15 - settings.difficult - average)/(15-settings.difficult))*(15000-milliseconds);
      if(scoringFormula < 0) {
        scoringFormula = 0;
      }
      
      tries += 1;

      // update score labels
      $("#triesCounter").text("Number of tries: \t" + tries.toFixed(2));
      $("#averageScore").text("Average error: \t" + average.toFixed(2));
      $("#redScore").text("Red error: \t" + percentages[0].toFixed(2));
      $("#greenScore").text("Green error: \t" + percentages[1].toFixed(2));
      $("#blueScore").text("Blue error: \t" + percentages[2].toFixed(2));

      // add score to list of past scores
      $("<li>" + scoringFormula.toFixed(2) + "</li>" ).appendTo("#allScores");

      // set the scores section to visible
      $("#scores").show();

      // set start time as the end time so we can calculate the milliseconds again
      startTime = endTime;

      if (tries == settings.tries || (percentages[0] == 0 && percentages[1] == 0 && percentages[2] == 0)) {
        resetGame(scoringFormula, endTime, true);
      }
    });
    $('#next').on('click',function() {
      resetGame(0,0,false);
    }); 
  });
}