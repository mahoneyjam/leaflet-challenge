var myMap;


// URL to all earthquake data in the past 7 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


  d3.json(url, function(data) {
    console.log(data);

    function createCircleMarker(feature, latlng) {
      var options = {
        radius: feature.properties.mag * 3,
        fillColor: earthquakeColors(feature.properties.mag),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
      return L.circleMarker(latlng, options);
    }


// Add popups with additional info about earthquakes
    var earthquakes = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Location:" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag + "<br> Time: " + new Date(feature.properties.time));
      },
      pointToLayer: createCircleMarker
    });

    createMap(earthquakes);

  });


function createMap(earthquakes) {

  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });


  // Create  map
  var myMap = L.map("map", {
    center: [
      34.0522, -118.2437
    ],
    zoom: 4,
    layers: [light, earthquakes]
  });


  var legendKey = L.control({
    position: "bottomleft"
  });


  legendKey.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    return div;
  }

  legendKey.addTo(myMap);

  document.querySelector(".legend").innerHTML = displayLegend();

}


function earthquakeColors(mag) {
  switch (true) {
    case (mag < 1):
      return "lime";
    case (mag < 2):
      return "mediumSeaGreen";
    case (mag < 3):
      return "yellow";
    case (mag < 4):
      return "darkOrange";
    case (mag < 5):
      return "peru";
    case (mag >= 5):
      return "red";
  };
}

function displayLegend() {
  var legendInputs = [{
    limit: "Mag: 0-1",
    color: "lime"
  }, {
    limit: "Mag: 1-2",
    color: "mediumSeaGreen"
  }, {
    limit: "Mag: 2-3",
    color: "yellow"
  }, {
    limit: "Mag: 3-4",
    color: "DarkOrange"
  }, {
    limit: "Mag:4-5",
    color: "peru"
  }, {
    limit: "Mag: 5+",
    color: "red"
  }];

  var strng = "";

  for (i = 0; i < legendInputs.length; i++) {
    strng += "<p style = \"background-color: " + legendInputs[i].color + "\">" + legendInputs[i].limit + "</p> ";
  }

  return strng;

}

