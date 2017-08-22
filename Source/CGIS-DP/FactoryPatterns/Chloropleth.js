//Concrete Creator
function chloroplethCreator() {
    console.log("choropleth Creator");
};

chloroplethCreator.prototype = Object.create(MapCreator.prototype);
chloroplethCreator.prototype.constructor = chloroplethCreator;

chloroplethCreator.prototype.createMap = function(map, vectorSource, wardsSource, colorPerClass, amountOfColorClasses, featureToDisplay, wardsVectorLayer, featureLayer) {
	if (wardsSource.getFeatures().length <= 0) {
		console.log("WardsSource not ready");
		return;
	}

    wardsVectorLayer.layer = new ol.layer.Vector({
        source: wardsSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.05)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 1
            }),
            visible: true
        })
    });

 //   map.addLayer(wardsLayer.layer);


    featureLayer.layer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            visible: true
        })
    });
    map.addLayer(featureLayer.layer);

    var selectedClass = "Well Maintained";
    //This is the amount of class ranges for the count of the features win a ward. 
    var amountOfColorClasses = 5; // This is specified by the user or AI

    if (true) {
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
        console.log("bg_l" + boundriesGeometry.length + " , pf_l" + pointFeatures.length);
        for (var i = 0; i < boundriesGeometry.length; i++) {
            countOfClassPerWard = 0;
            for (var j = 0; j < pointFeatures.length; j++) {
                // if(boundriesGeometry[i].getGeometry().intersects(pointFeatures[j].getGeometry())){
                if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                    if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedClass) == 0) {
                        countOfClassPerWard = countOfClassPerWard + 1;
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
    	console.log("ENETER");
        var currentColorFraction = 0;

        //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
        var classRangeMax = [];
        var currentHue = 0;
        for (var i = 0; i < amountOfColorClasses; i++) {
            classRangeMax.push(minClassCountOfWard + (currentColorFraction * (maxClassCountOfWard - minClassCountOfWard)));
            currentColorFraction += 1 / amountOfColorClasses;
            colorsPerWard[i] = i / amountOfColorClasses * 360;
            //Key for map
            // document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
            //     "<rect x=\"0\" y=\"25\" width=\"25\" height=\"25\" fill=\"hsla(" + colorsPerWard[i] + ", 100%, 47%, 0.6)\" />" +
            //     "<text x=\"35\" y=\"40\" fill=\"black\" font-size=\"14\">" + "Class #" + i + " 's max is " + classRangeMax[i] + "</text> </svg><hr>";
            //console.log("Class #" + i + " 's max is " + classRangeMax[i] + " hue = " + colorsPerWard[i]);
        }
        for (var i = 0; i < boundriesGeometry.length; i++) {
            // See within which class the ward is:
            for (var j = 0; j < amountOfColorClasses; j++) {
                if (countPerWard[i] <= classRangeMax[j]) {
                    // colorsPerWard[i] = j / amountOfColorClasses * 360;
                    // console.log("Ward #" + i + " count= " + countPerWard[i] + " class#=" + j + " 's color is " + colorsPerWard[j]);
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
        }
    } else {
        console.log("No classes found");
    }
};

function chloroplethDesign(map) {
    this.map = new ol.Map({
        layers: map.getLayers(),
        target: '',
        controls: [],
        interactions: ol.interaction.defaults({
            doubleClickZoom :false,
            dragAndDrop: false,
            keyboardPan: false,
            keyboardZoom: false,
            mouseWheelZoom: false,
            pointer: false,
            select: false,
            dragPan: false

        }),
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [28.5, -25.6], //map.getView().getCenter()
            zoom: 8
        })
    });
};

chloroplethDesign.prototype = Object.create(MapDesign.prototype);
chloroplethDesign.prototype.constructor = chloroplethDesign;
