//Concrete Creator
function PropSymbolCreator() {
    console.log("PropSymbol Creator");
};

PropSymbolCreator.prototype = Object.create(MapCreator.prototype);
PropSymbolCreator.prototype.constructor = PropSymbolCreator;

PropSymbolCreator.prototype.createMap = function(map, vectorSource, wardsSource, symbolSource, colorsPerClass, featureToDisplay, selectedValue, MD, symbolLayer) {
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

    if (true) {
        var pointFeatures = vectorSource.getFeatures();
        var boundriesGeometry = wardsSource.getFeatures();
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
                    if ((pointFeatures[j].get(featureToDisplay)).localeCompare($("#attrValue option:selected").html()) == 0) {
                        ++countOfClassPerWard;
                    } else {

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
            var newSymbolFeature = new ol.Feature(new ol.geom.Circle(center, ((countPerWard[i] / maxClassCountOfWard /** (maxClassCountOfWard - minClassCountOfWard)) + minClassCountOfWard )*/ * 0.00002 / normalisationVariable))))
            symbolSource.addFeature(newSymbolFeature); // Cite A 
            newSymbolFeature.setStyle(symbolStyle);
        }
        map.addLayer(symbolLayer.layer);
    } else {
        console.log("PPS:No classes");
    }
    // map.removeLayer(featureLayer);
};

function PropSymbolDesign(map) {
    this.map = map;
};

PropSymbolDesign.prototype = Object.create(MapDesign.prototype);
PropSymbolDesign.prototype.constructor = PropSymbolDesign;