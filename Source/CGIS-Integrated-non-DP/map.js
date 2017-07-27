var map;
var tileLayer;
var wardsVectorLayer;
var wardPrevLoaded = 0;
var vectorSource;
var wardsSource;
var featureLayer;
var tC = 0;

function loadTMap(displayValue){
    map.removeLayer(wardsVectorLayer);
    map.removeLayer(featureLayer);
    loadMap(displayValue);
    wardPrevLoaded = 1;
}

function loadMap(val){
    document.getElementById("op1").innerHTML = "Household Dataset";
    document.getElementById("mapKey").innerHTML = "";
    console.log("LoadMap : " + val);
    var mapDisplayType = val; // 0=markers(dotdensity), 1=heatmap 2=chloropleth
    var isLayerDiscrete = [];
    var vectorLayerClasses = [];
    var colorPerClass = [];

    isLayerDiscrete.push(true);
    var featureToDisplay = 'ha_dwellin';
    //TODO store features in session/dom storage for performance
    vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:households&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=200&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
    featureLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
    wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:wards&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
    wardsVectorLayer = new ol.layer.Vector({
        source: wardsSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.05)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 1
            }),
            image: new ol.style.Circle({
                radius: 20,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,0.9)',
                    width: 4
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 0, 0.6)'
                })
            })
        })
    });
    if(mapDisplayType == -1)
    {
        map = new ol.Map({
        layers: [],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [28.5, -25.69], //map.getView().getCenter()
            zoom: 10
        })
    });

    tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
    map.addLayer(tileLayer);
    }
    // Waits till features are ready
    vectorSource.on('change', function(evt) {
        var source = evt.target;
        if (source.getState() === 'ready') {
            var pointFeatures = vectorSource.getFeatures();
            var boundriesGeometry = wardsSource.getFeatures();

            if (isLayerDiscrete[0] == true) {
                // Add all unique classes of attribute to vectorLayerClasses array:
                vectorSource.forEachFeature(function(feature) {
                    if (vectorLayerClasses.indexOf(feature.get(featureToDisplay)) == -1) {
                        vectorLayerClasses.push(feature.get(featureToDisplay));
                    }
                });

                // Choose hue for each corresponding items of vectorLayerClasses
                var vectorClassCount = vectorLayerClasses.length;
                console.log("Classes within attribute: " + vectorClassCount);
                for (var i = 0; i < vectorClassCount; i++) {
                    colorPerClass.push((i / vectorClassCount) * 360);
                }
            } else {
                // If attribute is not discrete then covert to classes here
            }

            if (mapDisplayType == 0) {
                
                var vectorStyleFunction = function(feature, resolution) {
                    var hue = 0;
                    if (vectorLayerClasses.indexOf(feature.get(featureToDisplay)) != -1) {
                        hue = colorPerClass[vectorLayerClasses.indexOf(feature.get(featureToDisplay))];
                    }

                    if(tC == 0)
                    {
                        for(var i = 0; i < colorPerClass.length; i++)
                        {
                            document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                                "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"hsla(" + colorPerClass[i] + ", 100%, 47%, 0.6)\" />"
                                + "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + vectorLayerClasses[i] + "</text> </svg><hr>";
                        }
                        tC++;
                    }

                    var fill = new ol.style.Fill({
                        color: 'hsla(' + hue + ', 100%, 47%, 0.6)'
                    });
                    
                    return [new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: fill,
                            radius: 5
                        })
                    })];
                };

                featureLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: vectorStyleFunction
                });
                map.addLayer(featureLayer);   
            } else if (mapDisplayType == 1) {
                featureLayer = new ol.layer.Heatmap({
                    source: vectorSource,
                    opacity: 0.85
                });
                map.addLayer(featureLayer);
                document.getElementById("mapKey").innerHTML = "<svg height=\"50\" width=\"200\">" +
                                "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"#ff0\" stroke-width=\"3\" fill=\"#f00\" />"
                                + "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + "Heat Distribution" + "</text> </svg><hr>";   
            } else if (mapDisplayType == 2) {
                featureLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: new ol.style.Style({
                        visible: false
                    })
                });

                var selectedClass = "Well Maintained";
                //This is the amount of class ranges for the count of the features win a ward. 
                var amountOfColorClasses = 5; // This is specified by the user or AI

                if (isLayerDiscrete[0] == true) {
                    var pointFeatures = vectorSource.getFeatures();
                    var boundriesGeometry = wardsSource.getFeatures();
                    console.log(boundriesGeometry[0]);
                    console.log(boundriesGeometry[0].getGeometry().getExtent());
                    // console.log("WardFeatureCount= " + boundriesGeometry.length + ", PFCount= " + pointFeatures.length);
                    var countOfClassPerWard;
                    var countPerWard = [];
                    var colorsPerWard = []; //hue per ward that determines color. Range 0-360
                    for (var k = 0; k < vectorLayerClasses.length; k++) {
                        colorsPerWard.push(0);
                        countPerWard.push(0);
                    }

                    var maxClassCountOfWard = -1;
                    var minClassCountOfWard = Number.POSITIVE_INFINITY;
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        countOfClassPerWard = 0;
                        for (var j = 0; j < pointFeatures.length; j++) {
                            // if(boundriesGeometry[i].getGeometry().intersects(pointFeatures[j].getGeometry())){
                            if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                                if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedClass) == 0) {
                                    ++countOfClassPerWard;
                                }
                            }
                        }
                        if (countOfClassPerWard < minClassCountOfWard) {
                            minClassCountOfWard = countOfClassPerWard;
                        }
                        if (countOfClassPerWard > maxClassCountOfWard) {
                            maxClassCountOfWard = countOfClassPerWard;
                        }
                        countPerWard[i] = countOfClassPerWard;
                    }
                }
                if (maxClassCountOfWard > 0) {
                    var currentColorFraction = 0;

                    //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
                    var classRangeMax = [];
                    var currentHue = 0;
                    for (var i = 0; i < amountOfColorClasses; i++) {
                        classRangeMax.push(minClassCountOfWard + (currentColorFraction * (maxClassCountOfWard - minClassCountOfWard)));
                        currentColorFraction += 1 / amountOfColorClasses;
                        colorsPerWard[i] = i / amountOfColorClasses * 360;
                        //Key for map
                        document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                                "<rect x=\"0\" y=\"25\" width=\"25\" height=\"25\" fill=\"hsla(" + colorsPerWard[i] + ", 100%, 47%, 0.6)\" />"
                                + "<text x=\"35\" y=\"40\" fill=\"black\" font-size=\"14\">" + "Class #" + i + " 's max is " + classRangeMax[i]  + "</text> </svg><hr>";   
                        //console.log("Class #" + i + " 's max is " + classRangeMax[i] + " hue = " + colorsPerWard[i]);
                    }
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        // See within which class the ward is:
                        for (var j = 0; j < amountOfColorClasses; j++) {
                            if (countPerWard[i] <= classRangeMax[j]) {
                                // colorsPerWard[i] = j / amountOfColorClasses * 360;
                                console.log("Ward #" + i + " count= " + countPerWard[i] + " class#=" + j + " 's color is " + colorsPerWard[j]);
                                var wardFill = new ol.style.Fill({
                                    color: 'hsla(' + colorsPerWard[j] + ', 100%, 47%, 0.6)'
                                });
                                var wardStyle = new ol.style.Style({
                                    fill: wardFill,
                                    visible: true,
                                    stroke: new ol.style.Stroke({
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        width: 1
                                    })
                                });
                                boundriesGeometry[i].setStyle(wardStyle);
                                break;
                                // wardsVectorLayer.drawFeature(boundriesGeometry[i]);
                            }
                        }
                        //rerender

                        // classRangeMax.push(min + (currentColorFraction * maxClassCountOfWard)  
                    }
                    map.removeLayer(featureLayer);
                    map.removeLayer(wardsVectorLayer);
                    map.addLayer(wardsVectorLayer);
                } else {
                    // show snackbar Error , maybe user spelt classValue wrong
                }

            } else if(mapDisplayType == 3){
                console.log("TM3");

                // http://thematicmapping.org/playground/javascript/openlayers_propsymbols_geojson.js 
                var lon = 65;
                var lat = 15;
                var zoom = 3;
                var symbol = new ol.geom.Geometry('circle', 10, 1312978855);

                //GetDropDownValueOfSelectedClassValue. The dropdown set visible and populated with vectorLayerClasses[]
                //The user has to select the value for this option

                // Credit: 
                var selectedClass = "Well Maintained";
                //This is the amount of classes ranges in which the count of the selected feature is displayed. 
                var amountOfColorClasses = 5; // This is specified by the user or AI

                if (isLayerDiscrete[0] == true) {
                    var pointFeatures = vectorSource.getFeatures();
                    var boundriesGeometry = wardsSource.getFeatures();
                    console.log(boundriesGeometry[0].getGeometry().getExtent());
                    // console.log("WardFeatureCount= " + boundriesGeometry.length + ", PFCount= " + pointFeatures.length);
                    var countOfClassPerWard;
                    var countPerWard = [];
                    var colorsPerWard = []; //hue per ward that determines color. Range 0-360
                    for (var k = 0; k < vectorLayerClasses.length; k++) {
                        colorsPerWard.push(0);
                        countPerWard.push(0);
                    }

                    var maxClassCountOfWard = -1;
                    var minClassCountOfWard = Number.POSITIVE_INFINITY;
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        countOfClassPerWard = 0;
                        for (var j = 0; j < pointFeatures.length; j++) {
                            if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) {
                                if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedClass) == 0) {
                                    ++countOfClassPerWard;
                                }
                            }
                        }
                        if (countOfClassPerWard < minClassCountOfWard) {
                            minClassCountOfWard = countOfClassPerWard;
                        }
                        if (countOfClassPerWard > maxClassCountOfWard) {
                            maxClassCountOfWard = countOfClassPerWard;
                        }
                        countPerWard[i] = countOfClassPerWard;
                    }
                }
                if (maxClassCountOfWard > 0) {
                    var symbolStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(27, 104, 51, 0.7)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(27, 104, 51, 1)',
                            width: 1
                        }),
                        visible: true
                    });
                    var symbolSource = new ol.source.Vector({});
                    var symbolLayer = new ol.layer.Vector({
                        source: symbolSource,
                        style: symbolStyle
                    });

                    var currentColorFraction = 0;
                    //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
                    var classRangeMax = [];
                    var currentHue = 0;
                    for (var i = 0; i < amountOfColorClasses; i++) {
                        classRangeMax.push(minClassCountOfWard + (currentColorFraction * (maxClassCountOfWard - minClassCountOfWard)));
                        currentColorFraction += 1 / amountOfColorClasses;
                        colorsPerWard[i] = i / amountOfColorClasses * 360;
                        // console.log("Class #" + i + " 's max is " + classRangeMax[i] + " size = " + colorsPerWard[i]);
                    }
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        var curExtent = boundriesGeometry[i].getGeometry().getExtent();
                        var center = ol.extent.getCenter(curExtent);
                        var normalisationVariable = ol.extent.getArea(curExtent);
                        var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, ((countPerWard[i] / maxClassCountOfWard /** (maxClassCountOfWard - minClassCountOfWard)) + minClassCountOfWard )*/ * 0.00002 / normalisationVariable))))
                        symbolSource.addFeature(newSymbolFeature); // Cite A 
                        newSymbolFeature.setStyle(symbolStyle);
                    }
                    map.addLayer(symbolLayer);
                    map.removeLayer(wardsVectorLayer);
                    map.addLayer(wardsVectorLayer);
                    console.log("Done");
                } else {
                    // show snackbar Error
                }
            }
        }
    });

    
    if(mapDisplayType >= 0)
    {
        map.addLayer(wardsVectorLayer);
        map.addLayer(featureLayer);     
    }   

    //add http://plnkr.co/edit/GvdVNE?p=preview
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
                console.log(val);
                document.getElementById("tablebody").innerHTML += "<tr><td><input type=\"checkbox\" value=\"" + val + "\"" + "></td><td>"
                + val + 
                "</td></tr>";
            }
        }
    }
}

function getColors(hue){

}
/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
  B: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
*/
