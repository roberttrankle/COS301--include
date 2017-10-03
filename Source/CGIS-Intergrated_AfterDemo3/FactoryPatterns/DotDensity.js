//Concrete Creator
function DotDensityCreator() {
    this.vectorClasses = [];
};

DotDensityCreator.prototype = Object.create(MapCreator.prototype);
DotDensityCreator.prototype.constructor = DotDensityCreator;

DotDensityCreator.prototype.createMap = function(map, vectorSource, colorPerClass, featureToDisplay, featureLayer, selectedValue, isDiscrete, numberOfClasses) {
    if (isDiscrete) {
        var VC = [];
        var vectorStyleFunction = function(feature, resolution) {
            var hue = 0;
            if (VC != undefined) {
                if (VC.indexOf(feature.get(featureToDisplay)) != -1) {
                    hue = colorPerClass[VC.indexOf(feature.get(featureToDisplay))];
                } else {
                    VC.push(feature.get(featureToDisplay));
                }

            } else {
                VC.push(feature.get(featureToDisplay));
            }
            /* if(tC == 0)
             {
                 for(var i = 0; i < colorPerClass.length; i++)//This is for the legend.
                 {
                     document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                         "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"hsla(" + colorPerClass[i] + ", 100%, 47%, 0.6)\" />"
                         + "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + vectorLayerClasses[i] + "</text> </svg><hr>";
                 }
                 tC++;`
             }*/
            if (selectedValue == "none" || feature.get(featureToDisplay) == $("#attrValue option:selected").html()) {
                var fill = new ol.style.Fill({
                    color: 'hsla(' + 0 + ', 100%, 47%, 0.6)'
                });

                return [new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: fill,
                        radius: 5
                    })
                })];
            } else {
                // return [new ol.style.Style({})];
            }
        };

        featureLayer.layer = new ol.layer.Vector({
            source: vectorSource,
            style: vectorStyleFunction
        });
        map.addLayer(featureLayer.layer);
    } else {
        var pointFeatures = vectorSource.getFeatures();
        var pointFeaturesLength = pointFeatures.length;

        featureCount = pointFeatures.length;
        for (var i = 0; i < featureCount; i++) {
            pointFeatures[i].set('index', i);
        };

        //this array is populised by the classification method.
        var classArray = [];
        // for (var i = 0; i < pointFeaturesLength; i++) {
        //     classArray.push(3);
        // }

        var inputType = 0;
        // ^ This is the index of the type of classication object's return value data stype
        // 0 = Array with a class index per feature
        // 1 = Lower boundaries of classes

        var classification = new Classification();
        var classificationMethodIndex = 0;
        // index of the classification method to use
        switch (classificationMethodIndex) {
            case 0:
                var equal_Interval = new EqualInterval();
                classification.setMethod(equal_Interval);
                inputType = 0;
                break;
            case 1:
                var quantile = new Quantile();
                classification.setMethod(quantile);
                inputType = 0;
                break;
            case 2:
                var natural_breaks = new NaturalBreaks();
                classification.setMethod(natural_breaks);
                inputType = 0;
                break;
        }

        // classification.output();
        classArray = classification.execute(vectorSource, featureToDisplay, numberOfClasses);
        if (classArray == undefined || classArray.length != pointFeatures.length) {
            console.log("classArray undefined or badly formed");
            // return;
        }
        console.log(classArray);
        console.log(inputType);
        switch (inputType) {
            case 0:
                console.log("Receiving classified features as a array of each class index per index of pointFeatures");

                function style1(feature) {
                    console.log("DDC00");
                    var fill = new ol.style.Fill({
                        color: 'hsla(' + colorPerClass[classArray[feature.get('index')]] + ', 100%, 47%, 0.6)'
                    });
                    var style = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: fill,
                            radius: 5
                        })
                    });
                    return [style];
                }

                featureLayer.layer = new ol.layer.Vector({
                    source: vectorSource,
                    style: style1
                });

                break;
            case 1:
                // TO TEST
                console.log("Receiving an array of the lower bound value of pointFeatures per class");

                function style2(feature) {
                    console.log("DDC1");
                    var classIndex = 0;
                    while (classIndex != numberOfClasses - 1 && (feature.get(featureToDisplay) > classArray[classIndex] && feature.get(featureToDisplay) < classArray[classIndex + 1])) {
                        classIndex++;
                    };
                    var fill = new ol.style.Fill({
                        color: 'hsla(' + colorPerClass[classIndex] + ', 100%, 47%, 0.6)'
                    });
                    var style = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: fill,
                            radius: 5
                        })
                    });
                    return [style];
                }

                featureLayer.layer = new ol.layer.Vector({
                    source: vectorSource,
                    style: style2
                });

                break;
        }
        // featureLayer.layer.setZIndex(map.getLayers().getArray().length -1   )
        map.addLayer(featureLayer.layer);
    }
};

function DotDensityDesign(map) {
    this.map = map;
};

DotDensityDesign.prototype = Object.create(MapDesign.prototype);
DotDensityDesign.prototype.constructor = DotDensityDesign;