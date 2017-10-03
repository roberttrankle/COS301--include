var datasets;
var mapDesign;
// function loadMap(mapType, pageToLoad){ 
//   if(mapDesign == undefined)
//   {
//     mapDesign = new MapDesign();
//     console.log("DEFINE MAPDESIGN");
//   }
//   mapDesign.removeLayers();
//   mapDesign.isSourceReady(mapType, pageToLoad);
// }

function loadMap(mapType, pageToLoad, callback) { 
  le = 0;
  if(mapDesign == undefined)
  {
    mapDesign = new MapDesign();
    console.log("DEFINE MAPDESIGN");
  }
  mapDesign.isSourceReady(mapType, pageToLoad, loadWizardMaps);
}

function loadWizardMaps(val) {
  // for testing:
    // loadMap(val, 2);
    // mapDesign.concreteMapArray[0].map.setTarget("mapType_DotDensity");

    if(val < 5){
      loadMap(val, 2);
    }
    if(val == 5){
      mapDesign.concreteMapArray[0].map.setTarget("mapType_DotDensity");
      mapDesign.concreteMapArray[1].map.setTarget("mapType_Heatmap");
      mapDesign.concreteMapArray[2].map.setTarget("mapType_Choropleth");
      mapDesign.concreteMapArray[3].map.setTarget("mapType_PropSymbol");
    }

    // setTimeout(function () {
    //     mapDesign.concreteMapArray[0].map.setTarget("mapType_DotDensity");
    //     mapDesign.concreteMapArray[1].map.setTarget("mapType_Heatmap");
    //     mapDesign.concreteMapArray[2].map.setTarget("mapType_Choropleth");
    //     mapDesign.concreteMapArray[3].map.setTarget("mapType_PropSymbol");
    // }, 10000);
}

function loadSelectedMap() {
  console.log(sessionStorage.getItem('mapTypeSelected'));
  mapDesign.map.setTarget('');
  mapDesign.concreteMapArray[1].map.getView().setZoom(10);
  mapDesign.concreteMapArray[1].map.setTarget('map');
}
// MapDesign.prototype.recursiveCreate = function(mapType, pageToLoad) {
//     if (mapType != 0 && (this.wardsSource == undefined || this.vectorSource == undefined || this.wardsSource.getFeatures().length <= 0 || this.vectorSource.getFeatures().length <= 0)) {
//         // console.log("A source is not ready, waiting 1s and retrying");
//         // console.log("WSc=" + this.wardsSource.getFeatures().length +  "VSc=" + this.vectorSource.getFeatures().length);
//         var that = this;
//         setTimeout(function() { 
//             that.recursiveCreate(mapType);
//         }, 1000);
//         return;
//     }
//---------------------------------------------------------------------------------------------------------
function loadDataset(url, callback) {
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

//change when databases
function populateAtt(val){
    for(var i = 0; i < datasets.length; i++)
    {
    	if(val.value == i)
    	{
    		loadDataset('http://localhost:8080/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=DescribeFeatureType&typename=' + datasets[i] + '&' +
          'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1', changeAtt);
    	}
    }
}


function changeAtt(feat){
  var obj = feat.responseText.substring(feat.responseText.indexOf("[{\"name\""),feat.responseText.lastIndexOf("}]}"));
  var arr = JSON.parse(obj);

  document.getElementById("attr").innerHTML = "";
  document.getElementById("attr").innerHTML += "<option style = \"display:none\" disabled selected value = \"1\">Select an Attribute</option><br>";
  for(var i = 1; i < arr.length; i++)
    {
        for(key in arr[i])
        {
            if(key == 'name')
            {
                var val = arr[i][key];
                //console.log(val);
                document.getElementById("attr").innerHTML += " <option>" + val + "</option><br>";
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
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

// Request capabilities which contain the names of datasets
function requestCapabilities(){
    receiveDataSets('http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetCapabilities&outputFormat=application/json',
        changeAtt);
}

function listDataSets(response){
  var obj = response.responseText;
  var featureDatabases = [];
  var xmlDoc = $.parseXML(obj);
  var $xml = $(xmlDoc);
  var $featureDB = $xml.find("FeatureType");
  $featureDB.each(function(){
      featureDatabases.push($(this).find("Name").text());
  });
  console.log(featureDatabases);
  for (var i = 0; i < featureDatabases.length; i++) {
    document.getElementById("dataset").innerHTML += "<option value = \"" + i + "\" >" + featureDatabases[i] + "</option><br>";
    document.getElementById("boundary").innerHTML += "<option value = \"" + i + "\" >" + featureDatabases[i] + "</option><br>";
  }
  datasets = featureDatabases;
}

//still incomplete
//optimise by only requesting relevant column
function populateAttValues() {
  if (mapDesign == undefined){
      console.log("Creating MD temp");
      mapDesign = new MapDesign();
      console.log("Listing unique values:");
      mapDesign.listUniqueAttributeValues();
      mapDesign = undefined;
  } else {
      console.log("Listing unique values:");
      mapDesign.listUniqueAttributeValues();
  }

}

$(document).ready(function(){
   receiveDataSets('http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetCapabilities&outputFormat=application/json',
        listDataSets);
})

$(document).ready(function(){
   $("#attrValue").change(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var button = $("#next1").next("button");
    if (this.value == "1") {
      button.prop("disabled", true);       
    } else {
      button.prop("disabled", false)
      $('#attrNext').removeAttr('disabled');
    };
  });
})


$(document).ready(function(){
   $(".images_list").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var button = $("#next2").next("button");
    var clicked = e.target;
    var currentID = clicked.id;
    console.log("this.value = "+ currentID);
    if(currentID == 'mapType_DotDensity')
    {
      sessionStorage.setItem('mapTypeSelected', 0);
    }
    if(currentID == 'mapType_Heatmap')
    {
      sessionStorage.setItem('mapTypeSelected', 1);
      console.log("AWE");
    }
    if(currentID == 'mapType_Choropleth')
    {
      sessionStorage.setItem('mapTypeSelected', 2);
    }
    if(currentID == 'mapType_PropSymbol')
    {
      sessionStorage.setItem('mapTypeSelected', 3);
    }
  });
})

function setAttrValue() {
  mapDesign.setAttrValue();
}

function setDataset() {
  mapDesign.setDataset();
}

function setBoundaries() {
  mapDesign.setBoundaries();
}

/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
  B: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
*/
