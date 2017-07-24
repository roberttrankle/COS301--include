function loadMap() {
    var mapDisplayType = 3; // 0=markers(dotdensity), 1=heatmap 2=chloropleth
    var isLayerDiscrete = [];
    var vectorLayerClasses = [];
    var colorPerClass = [];

    isLayerDiscrete.push(true);
    var featureToDisplay = 'ha_dwellin';
    //TODO store features in session/dom storage for performance
    var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=Given:copc_households&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=10000&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });

    var featureLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });

    var wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=Given:electoralwardsfortsh&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });

    var wardsVectorLayer = new ol.layer.Vector({
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

                // for (var i = 0; i < vectorClassCount; i++) {
                // console.log("Class:" +  vectorLayerClasses[i] + " hue: " + colorPerClass[i]  ); //'hsla('+hue+', 100%, 47%, 1)'
                // }
            } else {
                // If attribute is not discrete then covert to classes here
            }

            if (mapDisplayType == 0) {
                var vectorStyleFunction = function(feature, resolution) {
                    var hue = 0;
                    if (vectorLayerClasses.indexOf(feature.get(featureToDisplay)) != -1) {
                        hue = colorPerClass[vectorLayerClasses.indexOf(feature.get(featureToDisplay))];
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


                var featureLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: vectorStyleFunction
                });
            } else if (mapDisplayType == 1) {
                //currently only instance based, not variable based
                var featureLayer = new ol.layer.Heatmap({
                    source: vectorSource,
                    opacity: 0.85
                });

            } else if (mapDisplayType == 2) {
                var featureLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: new ol.style.Style({
                        visible: false
                    })
                });

                //GetDropDownValueOfSelectedClassValue. The dropdown set visible and populated with vectorLayerClasses[]
                //The user has to select the value for this option

                // Credit: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer

                //Find pointFeatues which intersect with geometric boundries
                var selectedClass = "Well Maintained";
                //This is the amount of classes ranges in which the count of the selected deature is displayed. 
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
                            // if(boundriesGeometry[i].getGeometry().intersects(pointFeatures[j].getGeometry())){
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
                    var currentColorFraction = 0;

                    //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
                    var classRangeMax = [];
                    var currentHue = 0;
                    for (var i = 0; i < amountOfColorClasses; i++) {
                        classRangeMax.push(minClassCountOfWard + (currentColorFraction * (maxClassCountOfWard - minClassCountOfWard)));
                        currentColorFraction += 1 / amountOfColorClasses;
                        colorsPerWard[i] = i / amountOfColorClasses * 360;
                        console.log("Class #" + i + " 's max is " + classRangeMax[i] + " hue = " + colorsPerWard[i]);
                    }
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        // See within which class the ward is:
                        for (var j = 0; j < amountOfColorClasses; j++) {
                            if (countPerWard[i] <= classRangeMax[j]) {
                                // colorsPerWard[i] = j / amountOfColorClasses * 360;
                                console.log("Ward #" + i + " count= " + countPerWard[i] + " class#=" + j + " 's color is " + colorsPerWard[j]);
                                var wardFill = new ol.style.Fill({
                                    color: 'hsla(' + colorsPerWard[i] + ', 100%, 47%, 0.6)'
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

            } else {
                console.log("TM3");

                // http://thematicmapping.org/playground/javascript/openlayers_propsymbols_geojson.js 
                var lon = 65;
                var lat = 15;
                var zoom = 3;
                var symbol = new ol.geom.Geometry('circle', 10, 1312978855);

                var context = {
                    getSize: function(feature) {
                        return symbol.getSize(feature.attributes["value"]) * Math.pow(2, map.getZoom() - 1);
                    }
                };

                var template = {
                    fillOpacity: 0.9,
                    strokeColor: "#555555",
                    strokeWidth: 1,
                    pointRadius: "${getSize}", // using context.getSize(feature)
                    fillColor: "#fae318"
                };

                //GetDropDownValueOfSelectedClassValue. The dropdown set visible and populated with vectorLayerClasses[]
                //The user has to select the value for this option

                // Credit: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer

                //Find pointFeatues which intersect with geometric boundries
                var selectedClass = "Well Maintained";
                //This is the amount of classes ranges in which the count of the selected deature is displayed. 
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
                            // if(boundriesGeometry[i].getGeometry().intersects(pointFeatures[j].getGeometry())){
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
                    var currentColorFraction = 0;

                    //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
                    var classRangeMax = [];
                    var currentHue = 0;
                    for (var i = 0; i < amountOfColorClasses; i++) {
                        classRangeMax.push(minClassCountOfWard + (currentColorFraction * (maxClassCountOfWard - minClassCountOfWard)));
                        currentColorFraction += 1 / amountOfColorClasses;
                        colorsPerWard[i] = i / amountOfColorClasses * 360;
                        console.log("Class #" + i + " 's max is " + classRangeMax[i] + " size = " + colorsPerWard[i]);
                    }
                    for (var i = 0; i < boundriesGeometry.length; i++) {
                        var curExtent = boundriesGeometry[i].getGeometry().getExtent();
                        var center = ol.extent.getCenter(curExtent);
                        var normalisationVariable = ol.extent.getArea(curExtent);
                        wardsSource.addFeature(new ol.Feature(new ol.geom.Circle(center, ((countPerWard[i] / maxClassCountOfWard  /** (maxClassCountOfWard - minClassCountOfWard)) + minClassCountOfWard )*/ * 0.00002 / normalisationVariable  ))))); // Cite A
                    // });
                        // console.log(boundriesGeometry[i].getGeometry().getCenter());

                        // See within which class the ward is:

                        // colorsPerWard[i] = j / amountOfColorClasses * 360;
                        // console.log("Ward #" + i + " count= " + countPerWard[i] + " class#=" + j + " 's color is " + colorsPerWard[j]);

                  // var icon = new ol.style.Icon({ src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png' });

                        // var wardFill = new ol.style.Fill({
                        //     color: 'hsla(100, 100%, 47%, 0.3)'
                        // });
                        // var wardStyle = new ol.style.Style({
                        //     // fill: wardFill,
                        //     icon: icon,
                        //     visible: true,
                        //     stroke: new ol.style.Stroke({
                        //         color: 'rgba(255, 255, 255, 0.5)',
                        //         width: 1
                        //     }),
                        //     image: new ol.style.Circle({
                        //         radius: 600,
                        //         stroke: new ol.style.Stroke({
                        //             color: 'rgba(0,0,0,0.9)'
                        //             // width: 10
                        //         }),
                        //         fill: new ol.style.Fill({
                        //             color: 'rgba(0,0,0,0.9)'
                        //         })
                        //     })
                        // });

                        // var symbolStyle = new ol.style.Style({
                        //     // fill: wardFill,
                        //     icon: icon,
                        //     visible: true,
                        //     image: new ol.style.Circle({
                        //         radius: 600,
                        //         stroke: new ol.style.Stroke({
                        //             color: 'rgba(0,0,0,0.9)',
                        //             width: 10
                        //         }),
                        //         fill: new ol.style.Fill({
                        //             color: 'rgba(211,0,0,0.9)'
                        //         })
                        //     })
                        // });

                        // var combinedStyles = [wardStyle, symbolStyle];

                        // boundriesGeometry[i].setStyle(combinedStyles);


                        // wardsVectorLayer.drawFeature(boundriesGeometry[i]);
                        //rerender

                        // classRangeMax.push(min + (currentColorFraction * maxClassCountOfWard)  
                    }


                    // map.removeLayer(featureLayer);
                    map.removeLayer(wardsVectorLayer);
                    map.addLayer(wardsVectorLayer);
                    console.log("Done");
                } else {
                    // show snackbar Error , maybe user spelt classValue wrong
                }
            }

            map.removeLayer(featureLayer);
            // map.addLayer(featureLayer);

        }
    });


    var map = new ol.Map({
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

    map.addLayer(new ol.layer.Tile({ source: new ol.source.OSM() }));
    map.addLayer(wardsVectorLayer);
    map.addLayer(featureLayer);

    //add http://plnkr.co/edit/GvdVNE?p=preview

    document.getElementById('zoom-out').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom - 1);
    };

    document.getElementById('zoom-in').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
    };
}

/* Citations
  A: https://gis.stackexchange.com/questions/167112/how-to-create-a-circle-in-openlayers-3
*/