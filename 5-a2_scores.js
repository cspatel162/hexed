// jQuery call when the check colors button is clicked
$(document).ready(function() {
  if(localStorage.hexed) {
    // load the data
    var jsonData = JSON.parse(localStorage.hexed);

    // sort the data based on score and timeStamp
    jsonData.sort(function(item1, item2) {
      console.log(item1.score);
      console.log(item2.score);
      if(item1.score > item2.score) {
        return -1;
      } else if (item1.score < item2.score) {
        return 1;
      } else {
        if(item1.timeStamp > item2.timeStamp) {
          return -1;
        } else {
          return 1;
        }
      }
    });

    // create the html to insert into the table
    var htmlData = "";
    jsonData.forEach(function(entry) {
      htmlData += "<tr>";
      htmlData += "<td>" + entry.name + "</td>";
      htmlData += "<td>" + entry.difficult + "</td>";
      htmlData += "<td>" + entry.turns + "</td>";
      htmlData += "<td>" + entry.score + "</td>";
      htmlData += "<td>" + entry.timeStamp + "</td>";
      htmlData += "</tr>";
    });

    // add the built HTML into the table
    $("#scoreData tbody").html(htmlData);
  }
});