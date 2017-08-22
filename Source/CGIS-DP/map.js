/*function loadTMap(displayValue){
    map.removeLayer(symbolLayer);
    map.removeLayer(wardsVectorLayer);
    map.removeLayer(featureLayer);
    loadMap(displayValue);
    wardPrevLoaded = 1;
}*/
var mapDesign;
function loadMap(val){ 
    if(mapDesign == undefined)
    {
    mapDesign = new MapDesign();
    
    }
    mapDesign.removeLayers();
    while (mapDesign.isSourceReady(val) == false) {}
}

//function to load thematic maps for UI wizard
function loadMapTypes() {
    loadMap(1);
    loadMap(2);
    loadMap(3);
    loadMap(4);
    setTimeout(function () {
        mapDesign.concreteMapArray[0].map.setTarget("mapType_DotDensity");
        mapDesign.concreteMapArray[1].map.setTarget("mapType_Heatmap");
        mapDesign.concreteMapArray[2].map.setTarget("mapType_Choropleth");
        mapDesign.concreteMapArray[3].map.setTarget("mapType_PropSymbol");
    }, 8000);
    // setTimeout(function () {
    //     loadMap(4);
    // }, 6800);
    // setTimeout(function () {
    //     loadMap(3);
    // }, 10000);
    // setTimeout(function () {
    // }, 14000);
}





function loadDataset(url, callback){
    var feat;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(this);
        }
    };
    xmlHttp.open("GET", url,true);
    xmlHttp.send(null);
}

function changeDataset(val){
    if(val.value == 1)
    {
        loadDataset('http://localhost:8080/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=DescribeFeatureType&typename=GIS:households&' +
          'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1', changeAtt);
    }
}

function changeAtt(feat){
    var obj = feat.responseText.substring(feat.responseText.indexOf("[{\"name\""),feat.responseText.lastIndexOf("}]}"));
    var arr = JSON.parse(obj);

  for(var i = 1; i < arr.length; i++)
    {
        for(key in arr[i])
        {
            if(key == 'name')
            {
                var val = arr[i][key];
                document.getElementById("attr").innerHTML += " <option>" + val + "</option><br>";
            }
        }
    }
}
/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
  B: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
*/

$(document).ready(function(){
   $("#attr").change(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var button = $("#attrNext").next("button");
    console.log("this.value: " + this.value);
    if (this.value == "1") {
      button.prop("disabled", true);   
      console.log("disabled");    
    } else {
      button.prop("disabled", false)
      console.log("enabled");
      $('#attrNext').removeAttr('disabled');
    };
  });
})
