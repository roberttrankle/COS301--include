var MapDesign = function() {
    this.featureToDisplay = "ha_dwell_2"; //must set with UI
    this.vectorSource;
    this.wardsSource;
    this.symbolSource;
    this.tileLayer;
    //Layers are made object (not primitives) to pass as reference to other classes
    this.wardsVectorLayer = { layer: 'value' };
    this.featureLayer = { layer: 'value' };
    this.symbolLayer = { layer: 'value' };
    this.map;
    this.mapDisplayType;
    this.defaultMap;
    this.dotDensity;
    this.chloro;
    this.heatmap;
    this.vectorLayerClasses = [];
    this.colorPerClass = [];
    this.propsymbol;
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
	this.initializeMap();
    if (this.vectorSource == undefined) {
        this.createVectorSource(); //Put in the data set as param, using default for now.
    }
    if (this.wardsSource == undefined) {
        this.creatwardsSource();
    }
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
        // if not default map loadWards:
        if (mapType != 0) {
        	this.loadWards();
        	// this.createWardLayer();
        	this.createVectorSource();
        	this.createFeatureLayer();
         }
        this.recursiveCreate(mapType);
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
	if (mapType == 1 || mapType == 3 || mapType == 4){
		this.getUniqueDiscreteValues(this.featureToDisplay);
	    this.calculateColorClass(this.vectorLayerClasses);
	}
    switch (mapType) {
        case 0:
            this.defaultMap.createMap(this.map);
            break;
        case 1:
            this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer);
            break;
        case 2:
            this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
            break;
        case 3:
            this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.wardsVectorLayer, this.featureLayer);
            break;
        case 4:
            // Recursively run test function
            this.propsymbol.createMap(this.map, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this, this.symbolLayer);
            break;
    }
    this.map.addLayer(this.wardsVectorLayer.layer);
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
                'version=1.1.0&request=GetFeature&typename=Given:copc_households&' +
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
                'version=1.1.0&request=GetFeature&typename=Given:electoralwardsfortsh&' +
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
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [28.5, -25.69], //map.getView().getCenter()
            zoom: 10
        })
    });
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

//	Creates an array of unique values for a attribute which's name is passed
MapDesign.prototype.getUniqueDiscreteValues = function(attributeTitle) {
	var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
        }
    });
    this.vectorLayerClasses = tempVectorLayerClasses;
    return tempVectorLayerClasses;
}
MapDesign.prototype.calculateColorClass = function(vectorLayerClasses) {
    if(vectorLayerClasses == undefined) {
    	console.log("VectorlayerClasses is undefined, necessary in MD.calculateColorClass");
    	return;
    }
    if(vectorLayerClasses.length <= 0) {
    	console.log("VectorlayerClasses is empty, necessary in MD.calculateColorClass");
    	return;
    }
    var tempColorClasses = [];
    var classCount = vectorLayerClasses.length;
    for (var i = 0; i < classCount; i++) {
        tempColorClasses.push((i / classCount) * 360);
    }
    this.colorPerClass = tempColorClasses;
    return tempColorClasses;
}
