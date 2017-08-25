// function loadMapTypes() {
//     loadMap(1);
//     loadMap(2);
//     loadMap(3);
//     loadMap(4);
//     setTimeout(function () {
//         mapDesign.concreteMapArray[0].map.setTarget("mapType_DotDensity");
//         mapDesign.concreteMapArray[1].map.setTarget("mapType_Heatmap");
//         mapDesign.concreteMapArray[2].map.setTarget("mapType_Choropleth");
//         mapDesign.concreteMapArray[3].map.setTarget("mapType_PropSymbol");
//     }, 8000);
//     // setTimeout(function () {
//     //     loadMap(4);
//     // }, 6800);
//     // setTimeout(function () {
//     //     loadMap(3);
//     // }, 10000);
//     // setTimeout(function () {
//     // }, 14000);
// }



var MapDesign = function() {
    this.featureToDisplay = 'ha_dwellin'; //must set with UI
    this.vectorSource;
    this.wardsSource;
    this.symbolSource;
    this.WizardwardsSource;
    this.WizardsymbolSource;
    this.tileLayer;
    //Layers are made object (not primitives) to pass as reference to other classes
    this.wardsVectorLayer = { layer: 'value' };
    this.featureLayer = { layer: 'value' };
    this.symbolLayer = { layer: 'value' };
    this.map;
    this.mapTypeWizard1;
    this.mapTypeWizard2;
    this.mapTypeWizard3;
    this.mapTypeWizard4;
    this.mapDisplayType;
    this.defaultMap;
    this.dotDensity;
    this.chloro;
    this.heatmap;
    this.vectorLayerClasses = [];
    this.colorPerClass = [];
    this.propsymbol;
    this.concreteMapArray = []; //Array to hold concrete products.
    this.loadSources();
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
    if (this.vectorSource == undefined) {
        this.createVectorSource(); //Put in the data set as param, using default for now.
    }
    if (this.wardsSource == undefined) {
        this.creatwardsSource();
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

MapDesign.prototype.isSourceReady = function(mapType) {
    if (this.vectorSource.getState() == 'ready') {
        this.createWardLayer();
        this.removeLayers();
        this.calculateVectorClasses();
        this.calculateColorClass();
        // if not default map loadWards
        if (mapType != 0) {
        	this.loadWards();
        	// this.createWardLayer();
        	this.createVectorSource();
        	this.createFeatureLayer();
         }
        // if wardsSource || vectorSource not complete :
        // recursiveCreate(mapType);
        this.recursiveCreate(mapType);
        // switch (mapType) {
        //     case 0:
        //         this.defaultMap.createMap(this.map);
        //         break;
        //     case 1:
        //         this.loadWards();
        //         this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer);
        //         break;
        //     case 2:
        //         this.loadWards();
        //         this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
        //         break;
        //     case 3:
        //         this.loadWards();
        //         this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.wardsVectorLayer, this.featureLayer);
        //         break;
        //     case 4:
        //         this.loadWards();
        //         // Recursively run test function
        //         this.propsymbol.createMap(this.map, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this);
        //         break;
        // }

        // this.map.addLayer(this.wardsVectorLayer.layer);

        return true;
    } else {
        console.log("Source was not ready, map creation needs to wait.");
        return false;
    }
};

//Waits till features ready before creating
MapDesign.prototype.recursiveCreate = function(mapType) {
	if (mapType != 0 && (this.wardsSource == undefined || this.vectorSource == undefined || this.wardsSource.getFeatures().length <= 0 || this.vectorSource.getFeatures().length <= 0)) {
		// console.log("A source is not ready, waiting 1s and retrying");
		// console.log("WSc=" + this.wardsSource.getFeatures().length +  "VSc=" + this.vectorSource.getFeatures().length);
		var that = this;
		setTimeout(function() { 
			that.recursiveCreate(mapType);
		}, 1000);
		return;
	}
    switch (mapType) {
        case 0:
            this.defaultMap.createMap(this.map);
            this.defaultMap.createMap(this.mapTypeWizard1);
            this.defaultMap.createMap(this.mapTypeWizard2);
            this.defaultMap.createMap(this.mapTypeWizard3);
            this.defaultMap.createMap(this.mapTypeWizard4);
            break;
        case 1:
            this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer);
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
            this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.wardsVectorLayer, this.featureLayer);
            //this.chloro.createMap(this.map, this.vectorSource, this.WizardwardsSource, this.colorPerClass, 5, this.featureToDisplay, this.wardsVectorLayer, this.featureLayer);
            //this.mapTypeWizard2.addLayer(this.featureLayer.layer);
            this.mapTypeWizard3.addLayer(this.wardsVectorLayer.layer);
            //this.removeLayers();
            break;
        case 4:
            // Recursively run test function
            this.propsymbol.createMap(this.map, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this, this.symbolLayer);
            this.propsymbol.createMap(this.mapTypeWizard4, this.vectorSource, this.wardsSource, this.WizardsymbolSource, this.colorPerClass, this.featureToDisplay, this, this.symbolLayer);
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

MapDesign.prototype.removeLayers = function() {
    if (this.wardsSource != undefined) {
        // console.log("removing Style");
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

MapDesign.prototype.createVectorSource = function() {
    this.vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:households&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1000&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

MapDesign.prototype.creatwardsSource = function() {
    this.wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=GIS:wards&' +
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
}

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
//	this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
//	this.map.addLayer(this.tileLayer);
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
            center: [28.5, -25.69], //map.getView().getCenter()
            zoom: 10
        })
    });

    this.mapTypeWizard1 = new ol.Map({
        layers: [],
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

    this.mapTypeWizard2 = new ol.Map({
        layers: [],
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

    this.mapTypeWizard3 = new ol.Map({
        layers: [],
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

    this.mapTypeWizard4 = new ol.Map({
        layers: [],
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

MapDesign.prototype.calculateVectorClasses = function() {
    // this.vectorSource.forEachFeature(function(feature) {
    //    if (this.vectorLayerClasses.indexOf(feature.get(this.featureToDisplay)) == -1) {
    //         this.vectorLayerClasses.push(feature.get(this.featureToDisplay));
    //     }
    // });
}

MapDesign.prototype.calculateColorClass = function() {
    // for (var i = 0; i < this.vectorLayerClasses.length; i++) {
    //     this.colorPerClass.push((i / vectorClassCount) * 360);
    // }
    this.colorPerClass.push(0);
    this.colorPerClass.push(90);
    this.colorPerClass.push(180);
    this.colorPerClass.push(270);
    this.colorPerClass.push(330);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
    this.colorPerClass.push(10);
}

