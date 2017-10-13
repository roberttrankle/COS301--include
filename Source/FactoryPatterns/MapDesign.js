/**
 * A class to mediate between the different patterns and handle their objects.
 *
 * @class      MapDesign (MapDesign)
 */
var MapDesign = function() {
    this.featureToDisplay = "ha_dwellin"; //must set with UI
    this.selectedValue; //toAdd
    this.vectorSourceTypeName = "CGIS:households";
    this.wardSourceTypeName = "CGIS:wards";
    this.vectorSource;
    this.wardsSource;
    this.symbolSource;
    this.tileLayer;
    //Layers are made object (not primitives) to pass as reference to other classes
    this.wardsVectorLayer = { layer: 'value' };
    this.featureLayer = { layer: 'value' };
    this.symbolLayer = { layer: 'value' };
    this.numClasses = 5;
    this.readyLayerCount = 0;
    this.map;
    this.mapDisplayType;
    this.defaultMap;
    this.dotDensity;
    this.chloro;
    this.heatmap;
    this.uniqueAttributeValues = [];
    this.vectorLayerClasses = [];
    this.colorPerClass = [];
    this.propsymbol;
    this.wizardMapArray = []; //Array to hold concrete products.
    this.colorSchemeArray = [];
    this.colorSchemeIterationCounter = 0;
    this.ccMapArray = [];
    this.classAndClassficationIterationCounter = 0;
    this.loadSources();
    this.concreteMapBuilder;
    this.classifyArray = [];
    this.equal_Interval;
    this.quantile;
    this.naturalBreaks;
    this.classifiedArray = [];
    this.numberOfClasses = 5;
    this.mapValuesKeyNames = [];
    this.currentMapIndex = 0;
    this.currentClassificationMethod = "QUANTILE";
    this.currentStandardisationMethod = "area";
    this.standardisationObject;
};

/**
 * Standardises numerical data
 *
 * @param      {string}      method         The standardisation method to be used
 */
MapDesign.prototype.standardise = function(method) {
    //Code to call strategy method
    this.standardisationObject = new StandardiseMethod();
    var ratio = "ratio";
    var rate = "rate";
    var density = "density";
    var area = "area";
    switch (method) {
        case ratio:
            // standardisation.ratioBasedStandardisation(this.vectorSource, this.wardsSource, this.keyName, );
            break;
        case rate:
            // standardisation.rateBasedStandardisation(this.vectorSource, this.wardsSource, this.keyName, );
            break;
        case density:
            this.standardisationObject.densityBasedStandardisation(this.vectorSource, this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex);
            break;
        case area:
            this.standardisationObject.areaBasedStandardisation(this.vectorSource, this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex);
            break;
        default:
            this.standardisationObject.defaultStandardisation(this.vectorSource, this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex);
            break;
    }
};

//  Creates an array of unique values for a attribute which's name is passed
MapDesign.prototype.getContinousValues = function(attributeTitle) {
    var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {

        tempVectorLayerClasses.push(feature.get(attributeTitle));
    });
    if (tempVectorLayerClasses.length <= 0) {
        console.log("No attribute values found");
    }
    return tempVectorLayerClasses;
}

/**
 * Classifies numerical data
 *
 * @param      {ol.source}      source              Specifies the source
 * @param      {string}         propertyKeyName     Specifies the name of the property key name
 * @param      {string}         method              Specifies the method to be used
 * @param      {number}         numberOfClasses     Specifies the number of classes
 * @param      {number}         mapType             Specifies the type of map
 */
MapDesign.prototype.classify = function(source, propertyKeyName, method, numberOfClasses, mapType) {
    //Code to classify the data
    var method1 = "EQUALINTERVAL";
    var method2 = "QUANTILE";
    var method3 = "NATURALBREAKS";
    var boundary = true; //true if classification refers to boundary , false if classification refers to index
    //getting the bounds of each classification method;
    switch (method.toUpperCase()) {
        case method1:
            if (mapType == 1) {
                this.equal_Interval = new EqualInterval();
                this.classifyArray = this.equal_Interval.EqualIntervalExecute(source, propertyKeyName, numberOfClasses);
                boundary = true;
            } else {
                this.equal_Interval = new EqualInterval(); /* this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, sessionStorage.getItem('numClasses')*/
                this.classifiedArray = this.equal_Interval.EqualIntervalExecuteWards(this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex, numberOfClasses);
                return;
            }
            break;
        case method2:
            if (mapType == 1) {
                this.quantile = new Quantile();
                this.classifyArray = this.quantile.QuantileExecute(source, propertyKeyName, numberOfClasses);
                boundary = false;
            } else {
                this.quantile = new Quantile(); /* this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, sessionStorage.getItem('numClasses')*/
                this.classifyArray = this.quantile.QuantileExecuteWards(this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex, numberOfClasses);
                boundary = false;
                var count = this.classifyArray[0];
                var counter = 0;
                this.classifiedArray = [];
                for (var k = 0; k < this.classifyArray.length; k++) {
                    count = parseInt(this.classifyArray[k]);
                    for (counter; counter < count; counter++) {
                        this.classifiedArray.push(k);
                        //setVectorLayerClasses[counter] = true;
                    }
                    counter = count;
                }
                return;
            }
            break;
        case method3:
            if (mapType == 1) {
                this.naturalBreaks = new NaturalBreaks();
                this.classifiedArray = this.naturalBreaks.NaturalBreaksExecute(source, propertyKeyName, numberOfClasses);
            } else {
                this.naturalBreaks = new NaturalBreaks();
                this.classifiedArray = this.naturalBreaks.NaturalBreaksExecuteWards(this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex, numberOfClasses);
                return;
            }
            break;
        default:
            /* this.equal_Interval = new EqualInterval();
             this.classifyArray = this.equal_Interval.EqualIntervalExecute(source, propertyKeyName, numberOfClasses);
             console.log("default " + this.classifyArray);
             boundary = true;*/
            this.quantile = new Quantile(); /* this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, sessionStorage.getItem('numClasses')*/
            this.classifyArray = this.quantile.QuantileExecuteWards(this.wardsSource, this.mapValuesKeyNames, this.currentMapIndex, numberOfClasses);
            boundary = false;
            var count = this.classifyArray[0];
            var counter = 0;
            this.classifiedArray = [];
            for (var k = 0; k < this.classifyArray.length; k++) {
                count = parseInt(this.classifyArray[k]);
                for (counter; counter < count; counter++) {
                    this.classifiedArray.push(k);
                    //setVectorLayerClasses[counter] = true;
                }
                counter = count;
            }
            break;
    }

    var tempVectorLayerClasses = [];
    tempVectorLayerClasses = this.getContinousValues(this.featureToDisplay);
    var setVectorLayerClasses = new Array(tempVectorLayerClasses.length);
    for (var k = 0; k < setVectorLayerClasses.length; k++) {
        setVectorLayerClasses[k] = false;
    }
    if (tempVectorLayerClasses.length != this.classifyArray.length) { // classify array returned is either bounded or index and needs to be manipulated.
        if (boundary) {
            for (var i = 0; i < tempVectorLayerClasses.length; i++) {
                for (var k = 0; k < this.classifyArray.length; k++) {
                    if (tempVectorLayerClasses[i] <= this.classifyArray[k] && setVectorLayerClasses[i] == false) {
                        setVectorLayerClasses[i] = true;
                        var old = tempVectorLayerClasses[i];
                        tempVectorLayerClasses[i] = k;
                    }
                }
            }
        } else { //classify array uses indexes 
            var count = this.classifyArray[0];
            var counter = 0;
            for (var k = 0; k < this.classifyArray.length; k++) {
                count = parseInt(this.classifyArray[k]);
                for (counter; counter < count; counter++) {
                    tempVectorLayerClasses[counter] = k;
                    //setVectorLayerClasses[counter] = true;
                }
                counter = count;
            }
        }
        this.classifiedArray = [];
        this.classifiedArray = tempVectorLayerClasses;
        var oldArray = this.getContinousValues(this.featureToDisplay);
        return tempVectorLayerClasses;
    }
    return tempVectorLayerClasses;

};


MapDesign.prototype.render = function() {
    //render code
};

/**
 * Gets the vector source.
 *
 * @return     {ol.source}  The vector source.
 */
MapDesign.prototype.getVectorSource = function() {
    return this.vectorSource;
};

/**
 * Gets the wards source.
 *
 * @return     {ol.source}  The wards source.
 */
MapDesign.prototype.getWardsSource = function() {
    return this.wardsSource;
};

/**
 * Sets the vector source.
 *
 * @param      {ol.source}  source  The source
 */
MapDesign.prototype.setVectorSource = function(source) {
    this.vectorSource = source;
};

/**
 * Sets the ward source.
 *
 * @param      {ol.source}  source  The source
 */
MapDesign.prototype.setWardsSource = function(source) {
    this.wardsSource = source;
};


/**
 * Loads the sources from the dataset linked to GeoServer.
 */
MapDesign.prototype.loadSources = function() {
    if (this.vectorSource == undefined) {
        this.createVectorSource(this.vectorSourceTypeName); //Put in the data set as param, using default for now.
    }
    if (this.wardsSource == undefined) {
        this.creatwardsSource(this.wardSourceTypeName);
    }
    this.initializeMap();
    this.createWardLayer();
    this.createFeatureLayer();
    //this.createTileLayer();
    //this.map.addLayer(this.wardsVectorLayer);
    //this.map.addLayer(this.featureLayer);
    if (this.vectorSource.getState() != 'ready') {
        this.vectorSource.on('change', function(evt) {
            var source = evt.target;
            var mapToCreate;
            if (source.getState() == 'ready') {
                this.defaultMap = new defaultMapCreator();
                this.dotDensity = new DotDensityCreator();
                this.chloro = new chloroplethCreator();
                this.heatmap = new HeatMapCreator();
                this.propsymbol = new PropSymbolCreator();
            }
        });
    } else {
        if (this.defaultMap == undefined) {
            this.defaultMap = new defaultMapCreator();
            this.dotDensity = new DotDensityCreator();
            this.chloro = new chloroplethCreator();
            this.heatmap = new HeatMapCreator();
            this.propsymbol = new PropSymbolCreator();
        }

    }
};

/**
 * Determines if source's are ready, and has been fully loaded on the user side.
 *
 * @param      {number}    mapType     The map type
 * @param      {number}    pageToLoad  The page to load
 * @param      {Function}  callback    The callback
 * @return     {boolean}   True if source ready, False otherwise.
 */
MapDesign.prototype.isSourceReady = function(mapType, pageToLoad, callback) {
    this.removeLayers();
    if (this.vectorSource != undefined && this.vectorSource.getState() == 'ready') {
        this.createWardLayer();
        //this.calculateColorClass(5); //Get classcount from DOM / local (implies writing set function)
        // if not default map loadWards:
        if (mapType != 0) {
            this.loadWards();
            // this.createWardLayer();
            this.createVectorSource(this.vectorSourceTypeName);
            this.createFeatureLayer();
        }
        this.recursiveCreate(mapType, pageToLoad, callback);
        return true;
    } else {
        return false;
    }
};


/**
 *  Waits till features ready before creating the map. It uses the factory design patterns as well as stratergy patterns to classify the map
 *
 * @param      {number}    mapType     The map type
 * @param      {number}    pageToLoad  The page to load
 * @param      {Function}  callback    The callback
 */
MapDesign.prototype.recursiveCreate = function(mapType, pageToLoad, callback) {
    if (mapType != 0 && (this.wardsSource == undefined || this.vectorSource == undefined || this.wardsSource.getFeatures().length <= 0 || this.vectorSource.getFeatures().length <= 0)) {
        // console.log("A source is not ready, waiting 1s and retrying");
        // console.log("WSc=" + this.wardsSource.getFeatures().length +  "VSc=" + this.vectorSource.getFeatures().length);
        var that = this;
        setTimeout(function() {
            that.recursiveCreate(mapType, pageToLoad, callback);
        }, 1000);
        return;
    }
    if (mapType == 1 || mapType == 3 || mapType == 4) {
        this.getUniqueDiscreteValues(this.featureToDisplay);
        //this.calculateColorClass(this.numberOfClasses);
    }
    this.mapValuesKeyNames.push("");
    if (mapType != 0) {
        this.currentMapIndex = this.currentMapIndex + 1;
    }
    var currMap;
    var mapZoomFactor = 1.3;
    if (pageToLoad == 5) { //final map to be generated
        if (sessionStorage.getItem('isDiscrete') == 'true') {
            isDiscrete = true;
        } else {
            isDiscrete = false;
        }

        if (isDiscrete == false) {
            if (sessionStorage.getItem('classificationAndClassSelected') == "0" || sessionStorage.getItem('classificationAndClassSelected') == "1" ||
                sessionStorage.getItem('classificationAndClassSelected') == "2") {
                this.currentClassificationMethod = "EQUALINTERVAL";
            } else if (sessionStorage.getItem('classificationAndClassSelected') == "3" || sessionStorage.getItem('classificationAndClassSelected') == "4" || sessionStorage.getItem('classificationAndClassSelected') == "5") {
                this.currentClassificationMethod = "QUANTILE";
            } else if (sessionStorage.getItem('classificationAndClassSelected') == "6" || sessionStorage.getItem('classificationAndClassSelected') == "7" || sessionStorage.getItem('classificationAndClassSelected') == "8") {
                this.currentClassificationMethod = "NATURALBREAKS";
            }

            if (sessionStorage.getItem('classificationAndClassSelected') == "0" || sessionStorage.getItem('classificationAndClassSelected') == "3" || sessionStorage.getItem('classificationAndClassSelected') == "6") {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.generateColorSchemes(sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('colorSchemeSelected')));
            } else if (sessionStorage.getItem('classificationAndClassSelected') == "1" || sessionStorage.getItem('classificationAndClassSelected') == "4" || sessionStorage.getItem('classificationAndClassSelected') == "7") {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, 5, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, 5, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.generateColorSchemes(5, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            } else if (sessionStorage.getItem('classificationAndClassSelected') == "2" || sessionStorage.getItem('classificationAndClassSelected') == "5" || sessionStorage.getItem('classificationAndClassSelected') == "8") {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, 7, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, 7, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.generateColorSchemes(7, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            }
        } else {
            this.generateColorSchemes(5, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            this.numberOfClasses = 5;
        }
        if (isDiscrete == true && mapType == 1) {
            var mouseWheelInt = new ol.interaction.MouseWheelZoom();
            var dragPanInt = new ol.interaction.DragPan();
            this.colorSchemeArray[parseInt(sessionStorage.getItem("colorSchemeSelected"))].addInteraction(mouseWheelInt);
            this.colorSchemeArray[parseInt(sessionStorage.getItem("colorSchemeSelected"))].addInteraction(dragPanInt);
            mouseWheelInt.setActive(true);
            dragPanInt.setActive(true);
            
            this.map.setTarget("");
            this.colorSchemeArray[parseInt(sessionStorage.getItem("colorSchemeSelected"))].setTarget("map");
            this.generateColorSchemes(5, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            currMap = this.colorSchemeArray[parseInt(sessionStorage.getItem("colorSchemeSelected"))];
            if (currMap != undefined && currMap.getView().getZoom() == 3) {
                var extent = this.wardsSource.getExtent();
                currMap.getView().fit(extent, currMap.getSize());
                currMap.getView().setZoom(currMap.getView().getZoom() * 1.015);
            }
        } else {
            switch (parseInt(mapType)) {
                case 1:
                    this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue, isDiscrete, this.numberOfClasses, this.classifiedArray);
                    this.map.addLayer(this.wardsVectorLayer.layer);
                    break;
                case 2:
                    this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
                    this.map.addLayer(this.wardsVectorLayer.layer);
                    break;
                case 3:
                    this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, this.numberOfClasses, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer, this.classifiedArray, this.mapValuesKeyNames[this.currentMapIndex], isDiscrete);
                    break;
                case 4:
                    this.propsymbol.createMap(this.map, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer, isDiscrete, this.mapValuesKeyNames[this.currentMapIndex]);
                    this.map.addLayer(this.wardsVectorLayer.layer);
                    break;
            }
            currMap = this.map;
            if (currMap != undefined && currMap.getView().getZoom() == 3) {
                var extent = this.wardsSource.getExtent();
                currMap.getView().fit(extent, currMap.getSize());
                currMap.getView().setZoom(currMap.getView().getZoom() * 1.015);
            }
        }
    }
    if (pageToLoad == 4) {
        if (sessionStorage.getItem('isDiscrete') == 'true') {
            isDiscrete = true;
        } else {
            isDiscrete = false;
        }
        //this.generateColorSchemes(this.numberOfClasses, parseInt(sessionStorage.getItem('colorSchemeSelected')));
        if (isDiscrete == false) {
            if (this.classAndClassficationIterationCounter == 0 || this.classAndClassficationIterationCounter == 1 || this.classAndClassficationIterationCounter == 2) {
                this.currentClassificationMethod = "EQUALINTERVAL";
            } else if (this.classAndClassficationIterationCounter == 3 || this.classAndClassficationIterationCounter == 4 || this.classAndClassficationIterationCounter == 5) {
                this.currentClassificationMethod = "QUANTILE";
            } else if (this.classAndClassficationIterationCounter == 6 || this.classAndClassficationIterationCounter == 7 || this.classAndClassficationIterationCounter == 8) {
                this.currentClassificationMethod = "NATURALBREAKS";
            }
            if (this.classAndClassficationIterationCounter == 0 || this.classAndClassficationIterationCounter == 3 || this.classAndClassficationIterationCounter == 6) {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.numberOfClasses = parseInt(sessionStorage.getItem('numClasses'));
                this.generateColorSchemes(sessionStorage.getItem('numClasses'), parseInt(sessionStorage.getItem('colorSchemeSelected')));
            } else if (this.classAndClassficationIterationCounter == 1 || this.classAndClassficationIterationCounter == 4 || this.classAndClassficationIterationCounter == 7) {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, 5, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, 5, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.numberOfClasses = 5;
                this.generateColorSchemes(this.numberOfClasses, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            } else if (this.classAndClassficationIterationCounter == 2 || this.classAndClassficationIterationCounter == 5 || this.classAndClassficationIterationCounter == 8) {
                var doStandardise = true;
                if (doStandardise && mapType != 1 && mapType != 2) {
                    this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                    if (!isDiscrete) {
                        this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, 7, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    }
                } else {
                    if (mapType == 1) {
                        this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, 7, parseInt(sessionStorage.getItem('mapTypeSelected')));
                    };
                }
                this.numberOfClasses = 7;
                this.generateColorSchemes(this.numberOfClasses, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            }
        } else {
            this.generateColorSchemes(5, parseInt(sessionStorage.getItem('colorSchemeSelected')));
            this.numberOfClasses = 5;
        }
        switch (parseInt(mapType)) {
            case 1:
                this.dotDensity.createMap(this.ccMapArray[this.classAndClassficationIterationCounter], this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue, isDiscrete, this.numberOfClasses, this.classifiedArray);
                this.ccMapArray[this.classAndClassficationIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
            case 2:
                this.heatmap.createMap(this.ccMapArray[this.classAndClassficationIterationCounter], this.vectorSource, this.featureLayer);
                this.ccMapArray[this.classAndClassficationIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
            case 3:
                this.chloro.createMap(this.ccMapArray[this.classAndClassficationIterationCounter], this.vectorSource, this.wardsSource, this.colorPerClass, this.numberOfClasses, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer, this.classifiedArray, this.mapValuesKeyNames[this.currentMapIndex], isDiscrete);
                break;
            case 4:
                this.propsymbol.createMap(this.ccMapArray[this.classAndClassficationIterationCounter], this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer, isDiscrete, this.mapValuesKeyNames[this.currentMapIndex]);
                this.ccMapArray[this.classAndClassficationIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
        }
        currMap = this.ccMapArray[this.classAndClassficationIterationCounter];
        if (currMap != undefined  && currMap.getView().getZoom() == 8) {
            var extent = this.wardsSource.getExtent();
            currMap.getView().fit(extent, currMap.getSize());
            currMap.getView().setZoom(currMap.getView().getZoom() * mapZoomFactor);
        }

        ++this.classAndClassficationIterationCounter;
        if (callback)
            callback();

    }
    if (pageToLoad == 3) {
        if (sessionStorage.getItem('isDiscrete') == 'true') {
            isDiscrete = true;
        } else {
            isDiscrete = false;
        }
        if (isDiscrete == false) {
            var doStandardise = true;
            if (doStandardise && mapType != 1 && mapType != 2) {
                this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                if (!isDiscrete) {
                    this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, this.numberOfClasses, parseInt(sessionStorage.getItem('mapTypeSelected')));
                }
            } else {
                if (mapType == 1) {
                    this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, this.numberOfClasses, parseInt(sessionStorage.getItem('mapTypeSelected')));
                };
            }
        }

        this.generateColorSchemes(this.numberOfClasses, this.colorSchemeIterationCounter);
        switch (parseInt(mapType)) {
            case 1:
                this.dotDensity.createMap(this.colorSchemeArray[this.colorSchemeIterationCounter], this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue, isDiscrete, this.numberOfClasses, this.classifiedArray);
                this.colorSchemeArray[this.colorSchemeIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
            case 2:
                this.heatmap.createMap(this.colorSchemeArray[this.colorSchemeIterationCounter], this.vectorSource, this.featureLayer);
                this.colorSchemeArray[this.colorSchemeIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
            case 3:
                this.chloro.createMap(this.colorSchemeArray[this.colorSchemeIterationCounter], this.vectorSource, this.wardsSource, this.colorPerClass, this.numberOfClasses, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer, this.classifiedArray, this.mapValuesKeyNames[this.currentMapIndex], isDiscrete);
                break;
            case 4:
                this.propsymbol.createMap(this.colorSchemeArray[this.colorSchemeIterationCounter], this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer, isDiscrete, this.mapValuesKeyNames[this.currentMapIndex]);
                this.colorSchemeArray[this.colorSchemeIterationCounter].addLayer(this.wardsVectorLayer.layer);
                break;
        }
        currMap = this.colorSchemeArray[this.classAndClassficationIterationCounter];
        if (currMap != undefined && currMap.getView().getZoom() == 8) {
            var extent = this.wardsSource.getExtent();
            currMap.getView().fit(extent, currMap.getSize());
            currMap.getView().setZoom(currMap.getView().getZoom() * mapZoomFactor);
        }

        ++this.colorSchemeIterationCounter;
        if (callback)
            callback();
    }
    if (pageToLoad == 2) {
        if (sessionStorage.getItem('isDiscrete') == 'true') {
            isDiscrete = true;
        } else {
            isDiscrete = false;
        }
        if (isDiscrete == false) {
            var doStandardise = true;
            if (doStandardise && mapType != 1 && mapType != 2) {
                this.standardise(this.currentStandardisationMethod); //GET FROM DOM
                if (!isDiscrete) {
                    this.classify(this.wardsSource, this.mapValuesKeyNames[this.currentMapIndex], this.currentClassificationMethod, this.numberOfClasses, mapType);
                }
            } else {
                if (mapType == 1) {
                    this.classify(this.vectorSource, this.featureToDisplay, this.currentClassificationMethod, this.numberOfClasses, mapType);
                };
            }
        }
        this.generateColorSchemes(this.numberOfClasses, 1);
        switch (mapType) {
            case 1:
                this.dotDensity.createMap(this.wizardMapArray[0], this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue, isDiscrete, this.numberOfClasses, this.classifiedArray);
                this.wizardMapArray[0].addLayer(this.wardsVectorLayer.layer);
                currMap = this.wizardMapArray[0];
                break;
            case 2:
                this.heatmap.createMap(this.wizardMapArray[1], this.vectorSource, this.featureLayer);
                this.wizardMapArray[1].addLayer(this.wardsVectorLayer.layer);
                currMap = this.wizardMapArray[1];
                break;
            case 3:
                this.chloro.createMap(this.wizardMapArray[2], this.vectorSource, this.wardsSource, this.colorPerClass, this.numberOfClasses, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer, this.classifiedArray, this.mapValuesKeyNames[this.currentMapIndex], isDiscrete);
                currMap = this.wizardMapArray[2];
                break;
            case 4:
                this.propsymbol.createMap(this.wizardMapArray[3], this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer, isDiscrete, this.mapValuesKeyNames[this.currentMapIndex]);
                this.wizardMapArray[3].addLayer(this.wardsVectorLayer.layer);
                currMap = this.wizardMapArray[3];
                break;
        }
        if (currMap != undefined && currMap.getView().getZoom() == 8) {
            var extent = this.wardsSource.getExtent();
            currMap.getView().fit(extent, currMap.getSize());
            currMap.getView().setZoom(currMap.getView().getZoom() * mapZoomFactor);
        }

        var temp = mapType + 1;
        if (callback)
            callback(temp);
    } else if (pageToLoad == 1) {
        this.generateColorSchemes(5, 0);
        var doStandardise = true;
        if (doStandardise) {
            // this.standardise(this.currentStandardisationMethod); //GET FROM DOM
        }
        var isDiscrete = false;
        if (!isDiscrete) {}


        switch (mapType) {
            case 0:
                this.defaultMap.createMap(this.map);
                for (var i = 0; i < 4; i++) {
                    this.defaultMap.createMap(this.wizardMapArray[i]);
                }
                for (var i = 0; i < 6; i++) {
                    this.defaultMap.createMap(this.colorSchemeArray[i]);
                }
                for (var i = 0; i < 9; i++) {
                    this.defaultMap.createMap(this.ccMapArray[i]);
                }
                break;
            case 1:
                this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue);
                this.removeLayers();
                this.mapTypeWizard1.addLayer(this.featureLayer.layer);
                this.mapTypeWizard1.addLayer(this.wardsVectorLayer.layer);
                break;
            case 2:
                this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
                this.mapTypeWizard2.addLayer(this.featureLayer.layer);
                this.mapTypeWizard2.addLayer(this.wardsVectorLayer.layer);
                this.removeLayers();
                break;
            case 3:
                this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer);
                this.removeLayers();
                break;
            case 4:
                this.propsymbol.createMap(this.mapTypeWizard4, this.vectorSource, this.wardsSource, this.WizardwardsSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer);
                this.mapTypeWizard4.addLayer(this.wardsVectorLayer.layer);
                this.removeLayers();
                break;
        }
        this.map.addLayer(this.wardsVectorLayer.layer);
    }
}

/**
 * Removes the layers of a map.
 */
MapDesign.prototype.removeLayers = function() {
    if (this.wardsSource != undefined) {
        var boundriesFeatures = this.wardsSource.getFeatures();
        for (var i = 0; i < boundriesFeatures.length; i++) {
            boundriesFeatures[i].setStyle();
        }
    }
    if (this.symbolSource != undefined) {
        //TODO clear features
        var symbolFeatures = this.symbolSource.getFeatures();
        for (var i = 0; i < symbolFeatures.length; i++) {
            symbolFeatures[i].setStyle();
        }
        symbolSource.clear();
    }
    this.map.removeLayer(this.symbolLayer.layer);
    this.map.removeLayer(this.featureLayer.layer);
    this.map.removeLayer(this.wardsVectorLayer.layer);
};

/**
 * Requests a geojson feature object from geoserver and creates a point vector source.
 *
 * @param      {string}  typeName  The type name
 */
MapDesign.prototype.createVectorSource = function(typeName) {
    this.vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + typeName + '&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=3000&EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

// Requests a geojson feature object from geoserver and creates a wards vector source.
//
// @param      {string}  typeName  The type name
//
MapDesign.prototype.creatwardsSource = function(typeName) {
    this.wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + typeName + '&' +
                'outputFormat=application/json&srsname=EPSG:4326&EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });

    this.WizardwardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:wards&' +
                'outputFormat=application/json&srsname=EPSG:4326&EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

/**
 * Loads boundaries with styles
 */
MapDesign.prototype.loadWards = function() {
    this.wardsVectorLayer.layer = new ol.layer.Vector({
        source: this.wardsSource,
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
};

/**
 * Creates a point feature layer and adds it to the page 2 maps
 */
MapDesign.prototype.createFeatureLayer = function() {
    this.featureLayer.layer = new ol.layer.Vector({
        source: this.vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
    this.map.addLayer(this.featureLayer.layer);
    this.wizardMapArray[0].addLayer(this.featureLayer.layer);
    this.wizardMapArray[1].addLayer(this.featureLayer.layer);
    this.wizardMapArray[2].addLayer(this.featureLayer.layer);
    this.wizardMapArray[3].addLayer(this.featureLayer.layer);
};

/**
 * Creates a boundaries layer.
 */
MapDesign.prototype.createWardLayer = function() {
    this.wardsVectorLayer.layer = new ol.layer.Vector({
        source: this.wardsSource,
        style: new ol.style.Style({
            visible: false
        })
    });
};

/**
 * Creates a symbol layer.
 */
MapDesign.prototype.createSymbolLayer = function() {
    var symbolSource = new ol.source.Vector({});
    this.symbolLayer.layer = new ol.layer.Vector({
        source: symbolSource
    });
};


/**
 * Creates map with default interaction properties
 */
MapDesign.prototype.initializeMap = function() {
    this.map = new ol.Map({
        layers: [],
        target: 'map',
        controls: [],
        interactions: ol.interaction.defaults({
            doubleClickZoom: true,
            dragAndDrop: false,
            keyboardPan: false,
            keyboardZoom: false,
            mouseWheelZoom: true,
            pointer: false,
            select: false,
            dragPan: true

        }),
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [10, 0], //map.getView().getCenter()
            zoom: 3
        })
    });

    for (var i = 0; i < (19); i++) {
        if (i < 4) {
            this.wizardMapArray.push(new ol.Map({
                layers: [],
                target: '',
                controls: [],
                interactions: ol.interaction.defaults({
                    doubleClickZoom: false,
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
            }));
        } else if (i >= 4 && i < 10) {
            this.colorSchemeArray.push(new ol.Map({
                layers: [],
                target: '',
                controls: [],
                interactions: ol.interaction.defaults({
                    doubleClickZoom: false,
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
            }));
        } else if (i >= 10 && i < 19) {
            this.ccMapArray.push(new ol.Map({
                layers: [],
                target: '',
                controls: [],
                interactions: ol.interaction.defaults({
                    doubleClickZoom: false,
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
            }));
        }
    }
};

/**
 * Sets the map display type.
 *
 * @param      {<type>}  mapType  The map type
 */
MapDesign.prototype.setMapDisplayType = function(mapType) {
    this.mapDisplayType = mapType;
};


/**
 * Gets the map.
 *
 * @return     {<type>}  The map.
 */
MapDesign.prototype.getMap = function() {
    return this.map;
}


/**
 * Gets the vector classes.
 *
 * @return     {<type>}  The vector classes.
 */
MapDesign.prototype.getVectorClasses = function() {
    return this.vectorLayerClasses;
}

//
// Creates an array of unique values for a attribute which's name is passed
//
// @param      {string}          attributeTitle  The attribute title
// @return     {string[]}  The unique discrete values.
//
MapDesign.prototype.getUniqueDiscreteValues = function(attributeTitle) {
    var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
        if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
        }
    });
    if (tempVectorLayerClasses.length <= 0) {
        console.log("No attribute values found");
    }
    this.vectorLayerClasses = tempVectorLayerClasses;
    return tempVectorLayerClasses;
}

/**
 * Creates map elements by utilising the builder pattern. Elements created include map heading, map legend, and meta data.
 */
MapDesign.prototype.createMapElements = function() {
    if (this.concreteMapBuilder == undefined) {
        this.concreteMapBuilder = new ConcreteMapBuilder();
    }
    this.concreteMapBuilder.buildMapHeading();
    this.concreteMapBuilder.buildMapLegend(this.numberOfClasses, this.colorPerClass, this.vectorLayerClasses, this.selectedValue);
    // this.concreteMapBuilder.buildMapScale();
    this.concreteMapBuilder.buildMapNorthArrow();
    this.concreteMapBuilder.buildMapMetaData();
}


/**
 * Adds sources to be able to list unique attribute values and calls the list function
 */
MapDesign.prototype.listUniqueAttributeValues = function() {
    if (this.vectorSource == undefined) {
        this.createVectorSource(this.vectorSourceTypeName);
        this.createFeatureLayer();
        this.loadSources();
    } else {
        if (this.vectorSource.getFeatures().length <= 0) {
            this.createFeatureLayer();
        }
    }
    if (this.vectorSource.getState() != 'ready') {
        this.vectorSource.on('change', function(evt) {
            var source = evt.target;
            if (source.getState() == 'ready') {
                this.recursiveWaitAndList();
            }
        });
    } else {
        this.recursiveWaitAndList();
    }
}

/**
 * Waits till point source is ready and adds a list of unique values to the html dropdown element
 */
MapDesign.prototype.recursiveWaitAndList = function() {
    if (this.vectorSource == undefined || this.vectorSource.getFeatures().length <= 0) {
        var that = this;
        setTimeout(function() {
            that.recursiveWaitAndList();

        }, 500);
        return;
    } else {
        // set featureToDsiplay
        this.uniqueAttributeValues = this.getUniqueDiscreteValues($("#attr option:selected").html());

        this.setAttribute();

        //populate attribute values in select
        document.getElementById("attrValue").innerHTML = "";
        document.getElementById("attrValue").innerHTML = " <option style = \"display:none\" disabled selected value = \"1\">Select an Attribute</option><br>";

        for (var i = 0; i < this.uniqueAttributeValues.length; i++) {
            // check if value not null
            if (this.uniqueAttributeValues[i] != undefined && this.uniqueAttributeValues[i].trim()) {
                document.getElementById("attrValue").innerHTML += "<option value = \"" + i + 1 + "\" >" + this.uniqueAttributeValues[i] + "</option><br>";
            }
        }

        //store specifications in DOM - session storage
        var attributeValuesObject = this.toObject(this.uniqueAttributeValues);
        sessionStorage.setItem('attributeValues', JSON.stringify(attributeValuesObject));
        // this.vectorSource.clear();
        // this.vectorSource = undefined;
    }
}

/**
 * Generates different color schemes based on the paramaters
 *
 * @param      {number}  classCount        The number of classes to seperate the selected spectrum
 * @param      {number}  schemeToGenerate  The color scheme to generate
 */
MapDesign.prototype.generateColorSchemes = function(classCount, schemeToGenerate) {
    if (classCount <= 0) {
        console.log("Color classes not specified");
        return;
    }
    this.colorPerClass = [];
    switch (schemeToGenerate) {
        case 0: //Single hue progression
            var split = 100 / classCount;
            for (var i = 0; i < classCount; i++) {
                var temp = [0, 100, (i * split)];
                this.colorPerClass.push(temp);
            }
            break;
        case 1: //full spectural color progression
            var split = 360 / classCount;
            for (var i = 0; i < classCount; i++) {
                var temp = [(i * split), 100, 50];
                this.colorPerClass.push(temp);
            }
            break;
        case 2: //Bi-polor(red v green) color progression
            if (classCount % 2 == 0) {
                var split = 50 / classCount;
                for (var i = classCount; i > 0; i--) {
                    var temp = [0, 100, 50 + (i * split)];
                    var temp2 = [240, 100, 50 + (i * split)];
                    this.colorPerClass.unshift(temp);
                    this.colorPerClass.push(temp2);
                }
            } else {
                this.colorPerClass.push([240, 100, 100]);
                var split = 50 / classCount;
                for (var i = classCount - 1; i > 0; i--) {
                    var temp = [0, 100, 50 + (i * split)];
                    var temp2 = [240, 100, 50 + (i * split)];
                    this.colorPerClass.unshift(temp);
                    this.colorPerClass.push(temp2);
                }
            }
            break;
        case 3:
            var split = 100 / classCount;
            for (var i = 0; i < classCount; i++) {
                var temp = [0, 0, (i * split)];
                this.colorPerClass.push(temp);
            }
            break;
        case 4:
            var split = 180 / classCount;
            for (var i = 0; i < classCount; i++) {
                var temp = [(i * split), 100, 50];
                this.colorPerClass.push(temp);
            }
            break;
        case 5:
            var split = 180 / classCount;
            for (var i = 0; i < classCount; i++) {
                var temp = [180 + (i * split), 100, 50];
                this.colorPerClass.push(temp);
            }
            break;
    }
};
// Cite: https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage/10109307#10109307

MapDesign.prototype.toObject = function(arr) {
    var object = {};
    for (var i = 0; i < arr.length; ++i)
        object[i] = arr[i];
    return object;
}

/**
 * Sets the dataset.
 */
MapDesign.prototype.setDataset = function() {
    this.vectorSourceTypeName = $("#dataset option:selected").html();
}

/**
 * Sets the boundaries.
 */
MapDesign.prototype.setBoundaries = function() {
    this.wardSourceTypeName = $("#boundary option:selected").html();
}

/**
 * Sets the attribute.
 */
MapDesign.prototype.setAttribute = function() {
    this.featureToDisplay = $("#attr option:selected").html();
}

/**
 * Sets the attribute value.
 */
MapDesign.prototype.setAttrValue = function() {
    this.selectedValue = $("#attrValue option:selected").html();
}


/**
 * Logs map layers.
 */
MapDesign.prototype.logMapLayers = function() {
    console.log(this.map.getLayers());
}

/**
 * resets the map counter
 */
MapDesign.prototype.resetMapCounter = function() {
    this.currentMapIndex = 0;
}

/**
 * Loads a map legend.
 */
MapDesign.prototype.loadMapLegend = function() {
    this.createMapElements();
}
