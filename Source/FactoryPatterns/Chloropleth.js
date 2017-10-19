/**
 * A class to create choropleth maps.
 *
 * @class      choroplethCreator (choroplethCreator)
 */

function chloroplethCreator() {
};

//UPDATED and not synced

chloroplethCreator.prototype = Object.create(MapCreator.prototype);
chloroplethCreator.prototype.constructor = chloroplethCreator;

/**
 * Creates a choropleth layer and adds it to the map
 *
 * @param      {ol.map}           map                     The map
 * @param      {ol.source}           vectorSource            The vector source
 * @param      {ol.source}           wardsSource             The wards source
 * @param      {string}           colorPerClass           The color per class
 * @param      {number}  amountOfColorClasses    The amount of color classes
 * @param      {string}           featureToDisplay        The feature to display
 * @param      {string}           selectedValue           The selected value
 * @param      {ol.layer}           wardsVectorLayer        The wards vector layer
 * @param      {ol.layer}           featureLayer            The feature layer
 * @param      {number[]}           classArray              The class of each feature
 * @param      {string}           featurePropertyKeyName  The feature property key name
 * @param      {boolean}          isDiscrete              Indicates if discrete
 */
chloroplethCreator.prototype.createMap = function(map, vectorSource, wardsSource, colorPerClass, amountOfColorClasses, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer, classArray, featurePropertyKeyName, isDiscrete) {
    if (wardsSource.getFeatures().length <= 0) {
        console.log("WardsSource not ready");
        return;
    }

    wardsVectorLayer.layer = new ol.layer.Vector({
        source: wardsSource,
        style: new ol.style.Style({
            // fill: new ol.style.Fill({
            //     color: 'rgba(0, 0, 150, 1)'
            // }),
            // stroke: new ol.style.Stroke({
            //     color: 'rgba(0, 0, 0, 0.6)',
            //     width: 1
            // }),
            visible: true
        })
    });

    // map.addLayer(wardsVectorLayer.layer);
    // wardsVectorLayer.layer = new ol.layer.Vector({
    //     source: wardsSource
    // });

    // map.addLayer(wardsVectorLayer.layer)

    featureLayer.layer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            visible: true
        })
    });
    map.addLayer(featureLayer.layer);
    //This is the amount of class ranges for the count of the features win a ward. 
    var amountOfColorClasses = colorPerClass.length; // This is specified by the user or AI
    if (isDiscrete) {
        var pointFeatures = vectorSource.getFeatures();
        var boundriesGeometry = wardsSource.getFeatures();
        var countOfClassPerWard;
        var countPerWard = [];
        var colorsPerWard = []; //hue per ward that determines color. Range 0-360
        for (var k = 0; k < amountOfColorClasses; k++) {
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
                    // console.log("featureToDisplay" + featureToDisplay);
                    // console.log((pointFeatures[j].get(featureToDisplay)));
                    // console.log("selectedValue" + selectedValue);
                    if (pointFeatures[j].get(featureToDisplay) != null) {
                        if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedValue) == 0) { //////////////////////////////
                            countOfClassPerWard = countOfClassPerWard + 1;
                        }
                    } else {
                        console.log("Undefined pointfeature, in choropleth");
                    }
                }
            }
            // console.log("ward " + i + " " + countOfClassPerWard);
            if (countOfClassPerWard < minClassCountOfWard) {
                minClassCountOfWard = countOfClassPerWard;
            }
            if (countOfClassPerWard > maxClassCountOfWard) {
                maxClassCountOfWard = countOfClassPerWard;
            }
            countPerWard[i] = countOfClassPerWard;
        }
        if (maxClassCountOfWard > 0) {
            var currentColorFraction = 0;

            //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
            var classRangeMax = [];
            var currentHue = 0;
            for (var i = 0; i < amountOfColorClasses; i++) {
                //
                classRangeMax.push(minClassCountOfWard + ((i + 1) / amountOfColorClasses * (maxClassCountOfWard - minClassCountOfWard)));
                // currentColorFraction += 1 / amountOfColorClasses;
                // colorsPerWard[i] = i / amountOfColorClasses * 360;
                //Key for map
                // document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                //     "<rect x=\"0\" y=\"25\" width=\"25\" height=\"25\" fill=\"hsla(" + colorsPerWard[i] + ", 100%, 47%, 0.6)\" />" +
                //     "<text x=\"35\" y=\"40\" fill=\"black\" font-size=\"14\">" + "Class #" + i + " 's max is " + classRangeMax[i] + "</text> </svg><hr>";
                // console.log("Class #" + i + " 's max is " + classRangeMax[i]);
            }


            var choroIndex = 0; // Number of current choropleth, to distinguish from others 
            var sourceProperty = sourceProperty + choroIndex; // This needs to differ to display various choropleths at the same time.
            var isClassified = false;
            for (var i = 0; i < boundriesGeometry.length; i++) {
                // See within which class the ward is:
                isClassified = false;
                for (var j = 0; j < amountOfColorClasses; j++) {
                    if (isClassified == false && countPerWard[i] <= classRangeMax[j]) {
                        // console.log(countPerWard[i] + "<=" + classRangeMax[j] + "::class " + j);
                        boundriesGeometry[i].set(sourceProperty, j); // test value j
                        isClassified = true;
                    }
                }
            }

            function wardStyleF(feature) {
                // var index = feature.get('index');
                if (feature.get(sourceProperty) != null && feature.get(sourceProperty) != undefined && colorPerClass[feature.get(sourceProperty)]
                    &&  colorPerClass[feature.get(sourceProperty)][0] != undefined) {
                    // console.log("SP=" + feature.get(sourceProperty));
                    var fill = new ol.style.Fill({
                        color: 'hsla(' + colorPerClass[feature.get(sourceProperty)][0] + ', ' + colorPerClass[feature.get(sourceProperty)][1] +
                            '%, ' + colorPerClass[feature.get(sourceProperty)][2] + '%, 0.6)'
                    });
                    var style = new ol.style.Style({
                        fill: fill
                    });
                    return [style];
                } else {
                    var style = new ol.style.Style({});
                    return [style];
                }
            }


            boundriesGeometry[0].changed(); // explicitly dispatches change event to re-render layer with changed source
            wardsVectorLayer.layer = new ol.layer.Vector({
                source: wardsSource,
                style: wardStyleF
            });
            map.addLayer(wardsVectorLayer.layer);
        } else {
            console.log("No classes found");
        }
    } else {
        var boundriesGeometry = wardsSource.getFeatures();
        var featureCount = boundriesGeometry.length;
        for (var i = 0; i < featureCount; i++) {
            boundriesGeometry[i].set('index', i);
        };
        // var featureClassProperty = ""; // coming from parameter, here for testing

        
        console.log("CLASSES : " + amountOfColorClasses);
        if(amountOfColorClasses == 7)
        {
            console.log(classArray);
        }

        function wardStyleF2(feature) {
            // var index = feature.get('index');
            // console.log("Choro func fpkn " + featurePropertyKeyName);
            // console.log("Choro func feature value " + feature.get(featurePropertyKeyName));
            //TODO
            // console.log(feature.get("index") + " Class=" + classArray[feature.get("index")]);
            // console.log("Value=" +  feature.get(featurePropertyKeyName));


            if (colorPerClass[classArray[feature.get('index')]] == undefined) {
                var style = new ol.style.Style({});
                return [style];
            } else {
                var fill = new ol.style.Fill({
                    color: 'hsla(' + colorPerClass[classArray[feature.get('index')]][0] + ', ' + colorPerClass[classArray[feature.get('index')]][1] +
                        '%, ' + colorPerClass[classArray[feature.get('index')]][2] + '%, 0.6)'
                });
                var style = new ol.style.Style({
                    fill: fill
                });
                return [style];
            }
        }
        wardsVectorLayer.layer = new ol.layer.Vector({
            source: wardsSource,
            style: wardStyleF2
        });
        map.addLayer(wardsVectorLayer.layer);
    }
};

/**
 * A concrete product of a choropleth map creator.
 *
 * @class      choroplethConcrete
 */
function choroplethConcrete(map) {
    this.map = map;
};

choroplethConcrete.prototype = Object.create(MapProduct.prototype);
choroplethConcrete.prototype.constructor = choroplethConcrete;