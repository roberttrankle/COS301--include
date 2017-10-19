 /**
 * Quantile classification method concrete class
 *
 * @class      DotDensityCreator (DotDensityCreator)
 */

function DotDensityCreator() {
    this.vectorClasses = [];
};

DotDensityCreator.prototype = Object.create(MapCreator.prototype);
DotDensityCreator.prototype.constructor = DotDensityCreator;

/**
 * Creates a dot density map layer and adds it to the map.
 *
 * @param      {ol.map}           map               The map
 * @param      {ol.source}           vectorSource      The vector source
 * @param      {number[][]}  colorPerClass     The color per class (hue,saturation,luminosity)
 * @param      {string}           featureToDisplay  The feature to display
 * @param      {ol.layer}           featureLayer      The feature layer
 * @param      {string}           selectedValue     The selected value
 * @param      {boolean}          isDiscrete        Indicates if discrete
 * @param      {int}           numberOfClasses   The number of classes
 * @param      {number[]}   classArray        The class of each feature, corresponding by index
 */
DotDensityCreator.prototype.createMap = function(map, vectorSource, colorPerClass, featureToDisplay, featureLayer, selectedValue, isDiscrete, numberOfClasses, classArray) {
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
            var selectedFeature = $("#attrValue option:selected").html();
            if (hue != 0 && (selectedValue == "none" || feature.get(featureToDisplay) == selectedFeature)) {
                var fill = new ol.style.Fill({
                    color: 'hsla(' + hue[0] + ',' + hue[1] + '%,'+ hue[2] + '%, 0.6)'
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
        function style1(feature) {
            if (classArray == undefined || classArray[feature.get('index')] == undefined || colorPerClass[classArray[feature.get('index')]] == undefined) {
                console.log("Undefined feature value in dot density creator");
                var style = new ol.style.Style({});
                return [style];
            } else {
                var fill = new ol.style.Fill({
                    color: 'hsla(' + colorPerClass[classArray[feature.get('index')]][0] + ', ' + colorPerClass[classArray[feature.get('index')]][1] +
                        '%, ' + colorPerClass[classArray[feature.get('index')]][2] + '%, 0.6)'
                });
                var style = new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: fill,
                        radius: 5
                    })
                });
                return [style];
            }
        }

        featureLayer.layer = new ol.layer.Vector({
            source: vectorSource,
            style: style1
        });

    map.addLayer(featureLayer.layer);
    }
};

/**
 * A concrete product of a dot density map creator.
 *
 * @class      DotDensityConcrete
 */
function DotDensityConcrete(map) {
    this.map = map;
};
DotDensityConcrete.prototype = Object.create(MapProduct.prototype);
DotDensityConcrete.prototype.constructor = DotDensityConcrete;