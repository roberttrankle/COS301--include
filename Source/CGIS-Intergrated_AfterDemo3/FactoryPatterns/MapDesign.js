// Possible solution to clone vectorSource
// https://gis.stackexchange.com/questions/166182/feature-source-gets-overwritten-openlayers-3

var MapDesign = function() {
    this.featureToDisplay = "ha_dwellin"; //must set with UI
    this.selectedValue; //toAdd
    this.vectorSourceTypeName = "Given:copc_households"; //NB test
    this.wardSourceTypeName = "Given:electoralwardsfortsh"; //NB test
    this.vectorSource;
    this.wardsSource;
    this.choroWards; ///////////// make array
    this.symbolSource;
    this.tileLayer;
    //Layers are made object (not primitives) to pass as reference to other classes
    this.wardsVectorLayer = { layer: 'value' };
    this.featureLayer = { layer: 'value' };
    this.symbolLayer = { layer: 'value' };
    this.readyLayerCount = 0;
    this.map;
    this.mapTypeWizard1;
    this.mapTypeWizard2;
    this.mapTypeWizard3;
    this.mapTypeWizard4;
    this.WizardwardsSource;
    this.mapDisplayType;
    this.defaultMap;
    this.dotDensity;
    this.chloro;
    this.heatmap;
    this.uniqueAttributeValues = [];
    this.vectorLayerClasses = [];
    this.colorPerClass = [];
    this.propsymbol;
    this.concreteMapArray = []; //Array to hold concrete products.
    console.log("MAPDESIGN CONSTRUCTOR");
    this.loadSources();
    this.concreteMapBuilder;

    // var date = new Date();
    // this.createTime = date.getSeconds();
    // console.log(thiscreateTime);
};

MapDesign.prototype.standardise = function() {
    //Code to call strategy method
};

MapDesign.prototype.classify = function() {
    //Code to classify the data
};

MapDesign.prototype.render = function() {
    //render code
};

MapDesign.prototype.getVectorSource = function() {
    return this.vectorSource;
};

MapDesign.prototype.getWardsSource = function() {
    return this.wardsSource;
};

MapDesign.prototype.setVectorSource = function(source) {
    this.vectorSource = source;
};

MapDesign.prototype.setWardsSource = function(source) {
    this.wardsSource = source;
};

MapDesign.prototype.loadSources = function() {
    console.log("LS: " + this.createTime);

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

MapDesign.prototype.isSourceReady = function(mapType, pageToLoad, callback) {
    this.removeLayers();
    if (this.vectorSource != undefined && this.vectorSource.getState() == 'ready') {
        this.createWardLayer();
        this.calculateColorClass(5); //Get classcount from DOM / local (implies writing set function)
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
        // this.loadSources(); // temp
        console.log("Source was not ready, map creation needs to wait.");
        return false;
    }
};

//Waits till features ready before creating
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
        this.calculateColorClass(5);
    }
    if (pageToLoad == 2) {
        switch (mapType) {
            case 1:
                // break;
                this.dotDensity.createMap(this.mapTypeWizard1, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue, false);
                this.mapTypeWizard1.addLayer(this.wardsVectorLayer.layer);
                break;
            case 2:

            // break;
                this.heatmap.createMap(this.mapTypeWizard2, this.vectorSource, this.featureLayer);
                this.mapTypeWizard2.addLayer(this.wardsVectorLayer.layer);
                break;
            case 3:
            // break;
                console.log("choroCall1");
                //needs separate wardsource because style needs to be reset for other maps but needs to be preserved for this one.
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // this.choroWards = jQuery.extend(true, {}, this.wardsSource); //MAKE GLOBAL SCOPE to prevent deleting!!!!!!!!!!!!!!!!!!!!!! // if generating more than 1 at a time there needs to be array of chorowards (to be overwritten to be regenrated)
                this.choroWards = new ol.source.Vector({
                        format: new ol.format.GeoJSON()
                    // ,
                    // strategy: ol.loadingstrategy.bbox
                });
                var wardFeatures = this.wardsSource.getFeatures();
                var wardCount = wardFeatures.length;
                for (var i = 0; i < wardCount; i++) {
                    this.choroWards.addFeature(wardFeatures[i]);
                };
        this.chloro.createMap(this.mapTypeWizard3, this.vectorSource, this.choroWards, this.colorPerClass, 5, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer);
        // this.mapTypeWizard3.addLayer(this.wardsVectorLayer.layer);
        // this.wardsVectorLayer.layer.setZIndex(10);
        console.log(this.mapTypeWizard3.getLayers());
        break;
        case 4:
            // break;
            // Recursively run test function
            this.propsymbol.createMap(this.mapTypeWizard4, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer);
            this.mapTypeWizard4.addLayer(this.wardsVectorLayer.layer);
            break;
    }
    switch (mapType) {
        case 1:
            this.concreteMapArray.push(new DotDensityDesign(this.mapTypeWizard1));
            break;
        case 2:
            this.concreteMapArray.push(new HeatMapDesign(this.mapTypeWizard2));
            break;
        case 3:
            this.concreteMapArray.push(new chloroplethDesign(this.mapTypeWizard3));
            break;
        case 4:
            this.concreteMapArray.push(new PropSymbolDesign(this.mapTypeWizard4));
            break;
    }
    var temp = mapType + 1;
    if (callback)
        callback(temp);
} else {
    switch (mapType) {
        case 0:
            this.defaultMap.createMap(this.map);
            this.defaultMap.createMap(this.mapTypeWizard1);
            this.defaultMap.createMap(this.mapTypeWizard2);
            this.defaultMap.createMap(this.mapTypeWizard3);
            this.defaultMap.createMap(this.mapTypeWizard4);
            break;
        case 1:
            console.log("Colorperclass");
            console.log(this.colorPerClass);
            this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer, this.selectedValue);
            this.removeLayers();
            this.mapTypeWizard1.addLayer(this.featureLayer.layer);
            this.mapTypeWizard1.addLayer(this.wardsVectorLayer.layer);
            console.log("adding layer for DD wizard");
            break;
        case 2:
            this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
            this.mapTypeWizard2.addLayer(this.featureLayer.layer);
            this.mapTypeWizard2.addLayer(this.wardsVectorLayer.layer);
            this.removeLayers();
            break;
        case 3:
            console.log("choroCall1");
            this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.selectedValue, this.wardsVectorLayer, this.featureLayer);
            //this.mapTypeWizard2.addLayer(this.featureLayer.layer);
            // this.mapTypeWizard3.addLayer(this.wardsVectorLayer.layer);
            this.removeLayers();
            break;
        case 4:
            // Recursively run test function
            this.propsymbol.createMap(this.mapTypeWizard4, this.vectorSource, this.wardsSource, this.WizardwardsSource, this.colorPerClass, this.featureToDisplay, this.selectedValue, this, this.symbolLayer);
            this.mapTypeWizard4.addLayer(this.wardsVectorLayer.layer);
            this.removeLayers();
            break;
    }
    this.map.addLayer(this.wardsVectorLayer.layer);
    //this.map.addLayer(this.featureLayer.layer);
    //cpA.add( { new cp(this.map )});
    console.log("before switch");
    switch (mapType) {
        case 1:
            this.concreteMapArray.push(new DotDensityDesign(this.mapTypeWizard1));
            break;
        case 2:
            this.concreteMapArray.push(new HeatMapDesign(this.mapTypeWizard2));
            break;
        case 3:
            this.concreteMapArray.push(new chloroplethDesign(this.mapTypeWizard3));
            break;
        case 4:
            this.concreteMapArray.push(new PropSymbolDesign(this.mapTypeWizard4));
            break;
    }
}
//this.createMapElements();
}

MapDesign.prototype.removeLayers = function(val) {
    if (this.wardsSource != undefined) {
        // commented for temporary testing
        // var boundriesFeatures = this.wardsSource.getFeatures();
        // for (var i = 0; i < boundriesFeatures.length; i++) {
        //     boundriesFeatures[i].setStyle();
        // }
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

MapDesign.prototype.createVectorSource = function(typeName) {
    this.vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + typeName + '&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=100&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};
// 
MapDesign.prototype.creatwardsSource = function(typeName) {
    this.wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=' + typeName + '&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });

    this.WizardwardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:wards&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

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

MapDesign.prototype.createFeatureLayer = function() {
    this.featureLayer.layer = new ol.layer.Vector({
        source: this.vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
    this.map.addLayer(this.featureLayer.layer);
    this.mapTypeWizard1.addLayer(this.featureLayer.layer);
    this.mapTypeWizard2.addLayer(this.featureLayer.layer);
    this.mapTypeWizard3.addLayer(this.featureLayer.layer);
    this.mapTypeWizard4.addLayer(this.featureLayer.layer);
};

MapDesign.prototype.createWardLayer = function() {
    this.wardsVectorLayer.layer = new ol.layer.Vector({
        source: this.wardsSource,
        style: new ol.style.Style({
            visible: false
        })
    });
};

//MapDesign.prototype.createTileLayer = function() {
//  this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
//  this.map.addLayer(this.tileLayer);
//};

MapDesign.prototype.createSymbolLayer = function() {
    var symbolSource = new ol.source.Vector({});
    this.symbolLayer.layer = new ol.layer.Vector({
        source: symbolSource
    });
};

MapDesign.prototype.initializeMap = function() {
    this.map = new ol.Map({
        layers: [],
        target: 'map',
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
            center: [28.5, -25.69], //map.getView().getCenter()
            zoom: 10
        })
    });

    this.mapTypeWizard1 = new ol.Map({
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
    });

    this.mapTypeWizard2 = new ol.Map({
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
    });

    this.mapTypeWizard3 = new ol.Map({
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
    });

    this.mapTypeWizard4 = new ol.Map({
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
    });
    console.log("map initialization done");
};

MapDesign.prototype.setMapDisplayType = function(mapType) {
    this.mapDisplayType = mapType;
};

MapDesign.prototype.getMap = function() {
    return this.map;
}

MapDesign.prototype.getVectorClasses = function() {
    return this.vectorLayerClasses;
}

//  Creates an array of unique values for a attribute which's name is passed
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

// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MapDesign.prototype.calculateColorClass = function(classCount, colourThemeIndex) {
    if (classCount <= 0) {
        console.log("Too low classCount");
        return;
    }
    // console.log("Creating color classes");
    var colorClasses = [];
    for (var i = 0; i < classCount; i++) {
        colorClasses.push((i / classCount) * 360);
    }
    this.colorPerClass = colorClasses;
    // console.log(colorClasses);
    // return colorClasses;
}
// \\MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

MapDesign.prototype.createMapElements = function() {
    if (this.concreteMapBuilder == undefined) {
        this.concreteMapBuilder = new ConcreteMapBuilder();
    }
    this.concreteMapBuilder.buildMapHeading();
    this.concreteMapBuilder.buildMapLegend();
    this.concreteMapBuilder.buildMapScale();
    this.concreteMapBuilder.buildMapNorthArrow();
    this.concreteMapBuilder.buildMapMetaData();
}

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

MapDesign.prototype.recursiveWaitAndList = function() {
    if (this.vectorSource == undefined || this.vectorSource.getFeatures().length <= 0) {
        // console.log("Waiting for VS: VSc=" + this.vectorSource.getFeatures().length);
        var that = this;
        setTimeout(function() {
            that.recursiveWaitAndList();

        }, 500);
        return;
    } else {
        // console.log("Features ready:");
        // console.log(this.vectorSource.getFeatures());

        // set featureToDsiplay
        this.uniqueAttributeValues = this.getUniqueDiscreteValues($("#attr option:selected").html());
        // console.log('this.featureToDisplay = ' +  $("#attr option:selected").html());
        // console.log("uniqueAttributeValues = " + this.uniqueAttributeValues);

        this.setAttribute();
        // console.log("this.featureToDisplay after setting : " + this.featureToDisplay )

        //populate attribute values in select
        document.getElementById("attrValue").innerHTML = "";
        document.getElementById("attrValue").innerHTML = " <option style = \"display:none\" disabled selected value = \"1\">Select an Attribute</option><br>";

        for (var i = 0; i < this.uniqueAttributeValues.length; i++) {
            // check if value not null
            if (this.uniqueAttributeValues[i] != undefined && this.uniqueAttributeValues[i].trim()) {
                document.getElementById("attrValue").innerHTML += "<option value = \"" + i + "\" >" + this.uniqueAttributeValues[i] + "</option><br>";
            }
        }

        //store specifications in DOM - session storage
        var attributeValuesObject = this.toObject(this.uniqueAttributeValues);
        sessionStorage.setItem('attributeValues', JSON.stringify(attributeValuesObject));
        console.log("attributeValuesObject = " + sessionStorage.attributeValues);
        // this.vectorSource.clear();
        // this.vectorSource = undefined;
    }
}

// Cite: https://stackoverflow.com/questions/3357553/how-do-i-store-an-array-in-localstorage/10109307#10109307

MapDesign.prototype.toObject = function(arr) {
    var object = {};
    for (var i = 0; i < arr.length; ++i)
        object[i] = arr[i];
    return object;
}

MapDesign.prototype.setDataset = function() {
    console.log("SET VS MD creationt ime:" + this.createTime);
    this.vectorSourceTypeName = $("#dataset option:selected").html();
    console.log("vectorSourceTypeName = " + this.vectorSourceTypeName);
}

MapDesign.prototype.setBoundaries = function() {
    this.wardSourceTypeName = $("#boundary option:selected").html();
    console.log("wardSourceTypeName = " + this.wardSourceTypeName);
}

MapDesign.prototype.setAttribute = function() {
    this.featureToDisplay = $("#attr option:selected").html();
    console.log("featureToDisplay = " + this.featureToDisplay);
}

MapDesign.prototype.setAttrValue = function() {
    this.selectedValue = $("#attrValue option:selected").html();
    console.log("selectedValue = " + this.selectedValue);
}

MapDesign.prototype.logMapLayers = function() {
    console.log(this.map.getLayers());
}

