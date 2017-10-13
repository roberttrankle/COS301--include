//Concrete Creator
function PropSymbolCreator() {
};

PropSymbolCreator.prototype = Object.create(MapCreator.prototype);
PropSymbolCreator.prototype.constructor = PropSymbolCreator;

//
// Creates a proportional symbol ol.source, adds circle features,
// creates a layer and adds it to the map.
// "With 2D proportional symbols like circles and squares (see example below), it is the area of the symbols that encodes the data, not their height or length."https://gis.stackexchange.com/questions/165101/when-is-it-best-to-use-a-proportional-symbol-map-or-a-graduated-symbol-map
//
// @param      {ol.map}   map                      The map
// @param      {ol.source}   vectorSource             The vector source
// @param      {ol.source}   wardsSource              The boundaries source
// @param      {ol.source}       symbolSource             The proportional symbol source
// @param      {number[]}   colorsPerClass           The colors per class
// @param      {string}   featureToDisplay         The feature to display
// @param      {string}   selectedValue            The selected value
// @param      {MapDesign}   MD                    MapDesign reference
// @param      {ol.layer}   symbolLayer              The symbol layer
// @param      {boolean}  isDiscrete               Indicates if discrete
// @param      {string}   standardizationProperty  The standardization property key of each feature
//
PropSymbolCreator.prototype.createMap = function(map, vectorSource, wardsSource, symbolSource, colorsPerClass, featureToDisplay, selectedValue, MD, symbolLayer, isDiscrete, standardizationProperty) {
    if (wardsSource.getFeatures().length <= 0) {
        return;
    }
    if (vectorSource.getFeatures().length <= 0) {

        return;
    }

    PropSymbolDesign();

    // http://thematicmapping.org/playground/javascript/openlayers_propsymbols_geojson.js 
    var symbol = new ol.geom.Geometry('circle', 10, 1312978855);

    //GetDropDownValueOfSelectedClassValue. The dropdown set visible and populated with vectorLayerClasses[]
    //The user has to select the value for this option
    //This is the amount of classes ranges in which the count of the selected feature is displayed. 
    var amountOfColorClasses = colorsPerClass.length; // This is specified by the user or AI
    var pointFeatures = vectorSource.getFeatures();
    var boundriesGeometry = wardsSource.getFeatures();
    // var isDiscrete = false;
    if (isDiscrete) {
         console.log("PPS:Discr");
        // console.log(boundriesGeometry[0].getGeometry().getExtent());
        // console.log("WardFeatureCount= " + boundriesGeometry.length + ", PFCount= " + pointFeatures.length);
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
                if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) {
                    if(pointFeatures[j].get(featureToDisplay) != null)
                    {
                        if ((pointFeatures[j].get(featureToDisplay)).localeCompare($("#attrValue option:selected").html()) == 0) {
                            ++countOfClassPerWard;
                        } else {

                        }
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
            symbolSource = new ol.source.Vector({});
            symbolLayer.layer = new ol.layer.Vector({
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
                var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, ((countPerWard[i] / maxClassCountOfWard /** (maxClassCountOfWard - minClassCountOfWard)) + minClassCountOfWard )*/ * 0.0002 / normalisationVariable))))
                symbolSource.addFeature(newSymbolFeature); // Cite A 
            }
            map.addLayer(symbolLayer.layer);
        } else {
            console.log("PPS:No classes");
        }
        // map.removeLayer(featureLayer);
    } else {
        console.log("PPS:Cont");
        // var countOfClassPerWard;
        // var countPerWard = [];
        // var sumPerWard = [];
        // for (var i = 0; i < boundriesGeometry.length; i++) {
        //     countOfClassPerWard = 0;
        //     sumPerWard.push(0);
        //     for (var j = 0; j < pointFeatures.length; j++) {
        //         if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) {
        //             sumPerWard[i] += pointFeatures[j].get(featureToDisplay);
        //             countOfClassPerWard++;
        //         }
        //     }
        //     countPerWard[i] = countOfClassPerWard;
        // }

        var symbolStyle = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(27, 104, 51, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(27, 104, 51, 1)',
                width: 1
            }),
            visible: true
        });
        symbolSource = new ol.source.Vector({});
        symbolLayer.layer = new ol.layer.Vector({
            source: symbolSource,
            style: symbolStyle
        });

        var targetMin = 0.001;
        var targetMax = 0.1;
        var min = boundriesGeometry[0].get(standardizationProperty);
        var max = boundriesGeometry[0].get(standardizationProperty);
        var current;
        var wardsSourceCount = boundriesGeometry.length;
        for (var i = 0; i < wardsSourceCount; i++) {
            current = boundriesGeometry[i].get(standardizationProperty);
            if (current < min) {
                min = current;
            }
            if (current > max) {
                max = current;
            }
        };
        console.log("data min " +min);
        console.log("data max " +max);

        var boundriesGeometry = wardsSource.getFeatures();
        var wardsSourceCount = boundriesGeometry.length;
        console.log("SDP" + standardizationProperty);
        console.log(boundriesGeometry[0].get(standardizationProperty));
        for (var i = 0; i < wardsSourceCount; i++) {


            // //temp
            // if (i == 1) {
            //     var curExtent = boundriesGeometry[i].getGeometry().getExtent();
            //     var center = ol.extent.getCenter(curExtent);
            //     var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, 0.1));
            //     symbolSource.addFeature(newSymbolFeature); // Cite A
            // }

            // var radius = boundriesGeometry[i].get(standardizationProperty) * 1000;
            var beforeNormalisation = boundriesGeometry[i].get(standardizationProperty);
            // console.log("BFN" + beforeNormalisation);
            var radius = (((targetMax - targetMin) * (beforeNormalisation - min)) / (max - min)) + targetMin;
            // console.log("Radius " + radius);
            if (radius > 0) {
                var curExtent = boundriesGeometry[i].getGeometry().getExtent();
                var center = ol.extent.getCenter(curExtent);
                var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, radius));
                symbolSource.addFeature(newSymbolFeature); // Cite A 
            } else {
                console.log("standardised ward value 0, didnt create feature");
            }
        };

        map.addLayer(symbolLayer.layer);

        // var currentColorFraction = 0;
        // //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
        // var classRangeMax = [];
        // var currentHue = 0;
        // for (var i = 0; i < boundriesGeometry.length; i++) {
        //     if (sumPerWard[i] > 0) {
        //         var curExtent = boundriesGeometry[i].getGeometry().getExtent();
        //         var center = ol.extent.getCenter(curExtent);
        //         // var normalisationVariable = ol.extent.getArea(curExtent); 
        //         var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, sumPerWard[i]));
        //         newSymbolFeature.set()

        //         newSymbolFeature.setStyle(symbolStyle);
        //         ////////////////////////////MAKE VESCTORSTYLE
        //     }
        // }
    }
};

function PropSymbolDesign(map) {
    this.map = map;
};

// PropSymbolDesign.prototype = Object.create(MapDesign.prototype);
// PropSymbolDesign.prototype.constructor = PropSymbolDesign;