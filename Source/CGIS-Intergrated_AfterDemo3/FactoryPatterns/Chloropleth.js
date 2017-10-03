//Concrete Creator
function chloroplethCreator() {
    console.log("choropleth Creator");
};

chloroplethCreator.prototype = Object.create(MapCreator.prototype);
chloroplethCreator.prototype.constructor = chloroplethCreator;

chloroplethCreator.prototype.createMap = function(map, vectorSource, wardsSource, colorPerClass, amountOfColorClasses, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {
    if (wardsSource.getFeatures().length <= 0) {
        console.log("WardsSource not ready");
        return;
    }

    console.log("ChoroInside");
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
        // console.log("bg_l" + boundriesGeometry.length + " , pf_l" + pointFeatures.length);
        for (var i = 0; i < boundriesGeometry.length; i++) {
            countOfClassPerWard = 0;
            for (var j = 0; j < pointFeatures.length; j++) {
                // if(boundriesGeometry[i].getGeometry().intersects(pointFeatures[j].getGeometry())){
                if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                    if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedValue) == 0) {//////////////////////////////
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
                // document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                //     "<rect x=\"0\" y=\"25\" width=\"25\" height=\"25\" fill=\"hsla(" + colorsPerWard[i] + ", 100%, 47%, 0.6)\" />" +
                //     "<text x=\"35\" y=\"40\" fill=\"black\" font-size=\"14\">" + "Class #" + i + " 's max is " + classRangeMax[i] + "</text> </svg><hr>";
                //console.log("Class #" + i + " 's max is " + classRangeMax[i] + " hue = " + colorsPerWard[i]);
            }
            // for (var i = 0; i < boundriesGeometry.length; i++) {
            //     // See within which class the ward is:
            //     for (var j = 0; j < amountOfColorClasses; j++) {
            //         if (countPerWard[i] <= classRangeMax[j]) {
            //             // colorsPerWard[i] = j / amountOfColorClasses * 360;
            //             console.log("Ward #" + i + " count= " + countPerWard[i] + " class#=" + j + " 's color is " + colorsPerWard[j]);
            //             var wardFill = new ol.style.Fill({
            //                 color: 'hsla(' + 255 + ', 100%, 47%, 0.6)' //0.6
            //                 // color: 'hsla(' + colorsPerWard[j] + ', 100%, 47%, 0.6)' //0.6
            //             });
            //             var wardStyle = new ol.style.Style({
            //                 fill: wardFill,
            //                 visible: true,
            //                 stroke: new ol.style.Stroke({
            //                     // color: 'rgba(255, 255, 255, 0.5)',
            //                     color: 'hsla(' + 255 + ', 100%, 47%, 1)', //0.6
            //                     width: 1
            //                 })
            //             });

            //             // boundriesGeometry[i].setStyle(new ol.style.Style({
            //             //     fill: new ol.style.Fill({
            //             //         color: 'hsla(' + 255 + ', 100%, 47%, 0.6)' //0.6
            //             //         // color: 'hsla(' + colorsPerWard[j] + ', 100%, 47%, 0.6)' //0.6
            //             //     }),
            //             //     visible: true,
            //             //     stroke: new ol.style.Stroke({
            //             //         // color: 'rgba(255, 255, 255, 0.5)',
            //             //         color: 'hsla(' + 255 + ', 100%, 47%, 1)', //0.6
            //             //         width: 1
            //             //     })
            //             // }));


            //             // boundriesGeometry[i].setStyle(function style(feature, resolution) {
            //             //     return new ol.style.Style({
            //             //         fill: new ol.style.Fill({
            //             //             color: 'hsla(' + 30 + ', 100%, 47%, 1)' //0.6
            //             //             // color: 'hsla(' + colorsPerWard[j] + ', 100%, 47%, 0.6)' //0.6
            //             //         }),
            //             //         visible: true,
            //             //         stroke: new ol.style.Stroke({
            //             //             // color: 'rgba(255, 255, 255, 0.5)',
            //             //             color: 'hsla(' + 30 + ', 100%, 47%, 1)', //0.6
            //             //             width: 1
            //             //         })
            //             //     });
            //             // });



            //             // boundriesGeometry[i].setStyle(new ol.style.Style({
            //             //     fill: new ol.style.Fill({
            //             //         color: 'rgba(0, 0, 150, 1)'
            //             //     }),
            //             //     stroke: new ol.style.Stroke({
            //             //         color: 'rgba(0, 0, 0, 0.6)',
            //             //         width: 1
            //             //     }),
            //             //     visible: true
            //             // }));



            //             //TRY SETTING STYLE FUNCTION
            //             // console.log(boundriesGeometry[i].style); console.log(boundriesGeometry[i]);
            //             // wardsVectorLayer.layer.drawFeature(boundriesGeometry[i]);
            //             break;
            //         }
            //     }
            // }

            //set index in wardsSource
            featureCount = boundriesGeometry.length;
            for (var i = 0; i < featureCount; i++) {
                boundriesGeometry[i].set('index', i);
            };
            console.log(boundriesGeometry[0].get('index'));
            console.log(boundriesGeometry[1].get('index'));


            //temp
            // colorPerClass = colorsPerWard;

            function wardStyleF(feature) {
                var index = feature.get('index');

                var fill = new ol.style.Fill({
                    color: 'hsla(' + 50 + ', 100%, 47%, 0.6)'
                });
                var style = new ol.style.Style({
                    fill: fill
                });
                return [style];
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
        //quantile 
        var classificationMethodIndex = 0;
        // ^ This is the index of the type of classication object's return value data stype
        // 0 = Array with a class index per feature
        // 1 = Lower boundaries of classes
        switch (classificationMethodIndex) {
            case 0:

                break;
            case 1:
                break;
            case 2:
                break;
        }
    }
};

function chloroplethDesign(map) {
    this.map = map;
};

chloroplethDesign.prototype = Object.create(MapDesign.prototype);
chloroplethDesign.prototype.constructor = chloroplethDesign;