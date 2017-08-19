/*function loadTMap(displayValue){
    map.removeLayer(symbolLayer);
    map.removeLayer(wardsVectorLayer);
    map.removeLayer(featureLayer);
    loadMap(displayValue);
    wardPrevLoaded = 1;
}*/
var mapDesign;
function loadMap(mapType){ 
  if(mapDesign == undefined)
  {
    mapDesign = new MapDesign();
    console.log("DEFINE MAPDESIGN");
  }
  mapDesign.removeLayers();
  mapDesign.isSourceReady(mapType);
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
          'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1', changeAttributes);
    }
}

function changeAttributes(feat){
    var obj = feat.responseText.substring(feat.responseText.indexOf("[{\"name\""),feat.responseText.lastIndexOf("}]}"));
    var arr = JSON.parse(obj);
    for(var i = 1; i < arr.length; i++)
    {
        for(key in arr[i])
        {
            if(key == 'name')
            {
                var val = arr[i][key];
                console.log(val);
                document.getElementById("tablebody").innerHTML += "<tr><td><input type=\"checkbox\" value=\"" + val + "\"" + "></td><td>"
                + val + 
                "</td></tr>";
            }
        }
    }
}

// Receive the getCapabilities request
function receiveDataSets(url, callback){
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

// Request capabilities which contain the names of datasets
function requestCapabilities(){
    receiveDataSets('http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetCapabilities&outputFormat=application/json',
        listDataSets);
}

//This uses jQuery which is to be added in the html :  
function listDataSets(response){
    var obj = response.responseText;
    var featureDatabases = []
    var xmlDoc = $.parseXML(obj);
    var $xml = $(xmlDoc);
    var $featureDB = $xml.find("FeatureType");
    $featureDB.each(function(){
        featureDatabases.push($(this).find("Name").text());
    });
    console.log(featureDatabases);
    return featureDatabases;
}


/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
  B: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
*/
