var datasets;
var mapDesign;


/**
 * Loads a map. Specified with the paramaters
 *
 * @param      {number}    mapType     The map type to create. 1 = Dotdensity, 2 = choropleth, 3 = Heatmap, 4 = Proportional Symbol
 * @param      {number}    pageToLoad  The page to execute for in the wizard.
 * @param      {Function}  callback    The callback function used to iterate through the number of maps needed to create.
 */
function loadMap(mapType, pageToLoad, callback) {
    if (mapDesign == undefined) {
        mapDesign = new MapDesign();
    }
    if (pageToLoad == 2) {
        mapDesign.isSourceReady(mapType, pageToLoad, loadWizardMaps);
    } else if (pageToLoad == 3) {
        mapDesign.isSourceReady(mapType, pageToLoad, loadColorSchemes);
    } else if (pageToLoad == 4) {
        mapDesign.isSourceReady(mapType, pageToLoad, loadClassificationAndClasses);
    } else {
        mapDesign.isSourceReady(mapType, pageToLoad);
    }
}

/**
 * Loads wizard map types.
 *
 * @param      {number}  mapToLoad  The map type to create.
 */
function loadWizardMaps(mapToLoad) {
    if (mapToLoad < 5) {
        loadMap(mapToLoad, 2);
    }
    if (mapToLoad == 5) {
        mapDesign.wizardMapArray[0].setTarget("mapType_DotDensity");
        mapDesign.wizardMapArray[1].setTarget("mapType_Heatmap");
        mapDesign.wizardMapArray[2].setTarget("mapType_Choropleth");
        mapDesign.wizardMapArray[3].setTarget("mapType_PropSymbol");
        document.getElementById("loadingIcon1").style.display = "none";
    }
}

/**
 * Calls loadMap function to create the map type selected with different colors.
 */
function loadColorSchemes() {
  //If heatMap is chosen no color schemes should be used
  if (sessionStorage.getItem("mapTypeSelected") != "2") {
      if (mapDesign.colorSchemeIterationCounter < 6) {
          loadMap(sessionStorage.getItem('mapTypeSelected'), 3);
      }
      if (mapDesign.colorSchemeIterationCounter == 6) {
          mapDesign.colorSchemeArray[0].setTarget('cs1');
          mapDesign.colorSchemeArray[1].setTarget('cs2');
          mapDesign.colorSchemeArray[2].setTarget('cs3');
          mapDesign.colorSchemeArray[3].setTarget('cs4');
          mapDesign.colorSchemeArray[4].setTarget('cs5');
          mapDesign.colorSchemeArray[5].setTarget('cs6');
          document.getElementById("loadingIcon2").style.display = "none";
      }
  } else if ((sessionStorage.getItem("mapTypeSelected") == "2") || (sessionStorage.getItem("mapTypeSelected") == "3")) {
        if (mapDesign.colorSchemeIterationCounter < 1) {
          loadMap(sessionStorage.getItem('mapTypeSelected'), 3);
        }
      
      else if (mapDesign.colorSchemeIterationCounter == 1){
        mapDesign.colorSchemeArray[0].setTarget('cs1');
        document.getElementById("loadingIcon2").style.display = "none";
        }
  }
}

/**
 * Calls loadMap function to create the map type selected with different classification and classes.
 */
function loadClassificationAndClasses() {
    if (sessionStorage.getItem('isDiscrete') == 'false')
    { 
        if (mapDesign.classAndClassficationIterationCounter < 9) {
            loadMap(sessionStorage.getItem('mapTypeSelected'), 4);
        }
        else if (mapDesign.classAndClassficationIterationCounter == 9) {
            mapDesign.ccMapArray[0].setTarget('cc1');
            mapDesign.ccMapArray[1].setTarget('cc2');
            mapDesign.ccMapArray[2].setTarget('cc3');
            mapDesign.ccMapArray[3].setTarget('cc4');
            mapDesign.ccMapArray[4].setTarget('cc5');
            mapDesign.ccMapArray[5].setTarget('cc6');
            mapDesign.ccMapArray[6].setTarget('cc7');
            mapDesign.ccMapArray[7].setTarget('cc8');
            mapDesign.ccMapArray[8].setTarget('cc9');
            document.getElementById("loadingIcon3").style.display = "none";
        }
    } else if (sessionStorage.getItem('isDiscrete') == 'true') {
        if (mapDesign.classAndClassficationIterationCounter < 1) {
            loadMap(sessionStorage.getItem('mapTypeSelected'), 4);
        }
        else if (mapDesign.classAndClassficationIterationCounter == 1) {
            mapDesign.ccMapArray[0].setTarget('cc1');
            document.getElementById("loadingIcon3").style.display = "none";
        }
    }
}

/**
 * Loads the final map.
 */
function loadFinalMap() {
    loadMap(sessionStorage.getItem('mapTypeSelected'), 5);
}


/**
 * Loads a dataset.
 *
 * @param      {<type>}    url       The url of a feature to load
 * @param      {Function}  callback  The callback function, used for the XML Request.
 */
function loadDataset(url, callback) {
    var feat;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(this);
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

/**
 * Populates the attributes of the data set selected.
 *
 * @param      {<type>}  val    the value selected by the dropdown menu.
 */
function populateAtt(val) {
    for (var i = 0; i < datasets.length; i++) {
        if (val.value == i) {
            loadDataset('http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=DescribeFeatureType&typename=' + datasets[i] + '&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1', changeAtt);
        }
    }
}


/**
 * Changes the innerHTML of the attribute dropdown, with the reponse from the AJAX request.
 *
 * @param      {<type>}  feat    The feat
 */
function changeAtt(feat) {
    var obj = feat.responseText.substring(feat.responseText.indexOf("[{\"name\""), feat.responseText.lastIndexOf("}]}"));
    var arr = JSON.parse(obj);

    document.getElementById("attr").innerHTML = "";
    document.getElementById("attr").innerHTML += "<option style = \"display:none\" disabled selected value = \"1\">Select an Attribute</option><br>";
    for (var i = 1; i < arr.length; i++) {
        for (key in arr[i]) {
            if (key == 'name') {
                var val = arr[i][key];
                document.getElementById("attr").innerHTML += " <option value = \"" + i+1 + "\"" + ">" + val + "</option><br>";
            }
        }
    }
}

// Receive the getCapabilities request
function receiveDataSets(url, callback) {
    var feat;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(this);
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

/**
 * Request capabilities which contain the names of datasets
 */
function requestCapabilities() {
    receiveDataSets('http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetCapabilities&outputFormat=application/json',
        changeAtt);
}


/**
 * insert datasets into list html element
 *
 * @param      {<type>}  response  The response
 */
function listDataSets(response) {
    var obj = response.responseText;
    var featureDatabases = [];
    var xmlDoc = $.parseXML(obj);
    var $xml = $(xmlDoc);
    var $featureDB = $xml.find("FeatureType");
    $featureDB.each(function() {
        featureDatabases.push($(this).find("Name").text());
    });
    for (var i = 0; i < featureDatabases.length; i++) {
        document.getElementById("dataset").innerHTML += "<option value = \"" + i + "\" >" + featureDatabases[i] + "</option><br>";
        document.getElementById("boundary").innerHTML += "<option value = \"" + i + "\" >" + featureDatabases[i] + "</option><br>";
    }
    datasets = featureDatabases;
}


/**
 * populateattribute values
 */
function populateAttValues() {
    if (mapDesign == undefined) {
        mapDesign = new MapDesign();
        mapDesign.listUniqueAttributeValues();
        mapDesign = undefined;
    } else {
        mapDesign.listUniqueAttributeValues();
    }
}

/**
 * receiveDataSets
 */
$(document).ready(function() {
    receiveDataSets('http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetCapabilities&outputFormat=application/json',
        listDataSets);
})

/**
 * receiveDataSets
 */
$(document).ready(function() {
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


/**
 * Sets the attribute value.
 */
function setAttrValue() {
    mapDesign.setAttrValue();
}

/**
 * Sets the dataset.
 */
function setDataset() {
    mapDesign.setDataset();
}

/**
 * Sets the boundaries.
 */
function setBoundaries() {
    mapDesign.setBoundaries();
}

/**
 * Sets the standard method.
 */
function setStdMethod() {
    
}

/**
 * Used to call to a function to load the maps legend.
 */
function generateBuilderAndFinalMap() {
    // loadMap(sessionStorage.getItem('mapTypeSelected'), 5);
    mapDesign.loadMapLegend();
}

/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
  B: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
*/