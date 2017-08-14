var MapDesign = function()
{
	console.log("MapDesign Shit");
	this.featureToDisplay = 'ha_dwellin';//must set with UI
	this.vectorSource;
	this.wardSource;
	this.tileLayer;
	this.wardsVectorLayer;
	this.featureLayer;
	this.symbolLayer;
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

MapDesign.prototype.getVectorSource = function(){
	return this.vectorSource;
};

MapDesign.prototype.getWardsSource = function(){
	return this.wardsSource;
};

MapDesign.prototype.setVectorSource = function(source){
	this.vectorSource = source;
};

MapDesign.prototype.setWardsSource = function(source){
	this.wardsSource = source;
};

MapDesign.prototype.loadSources= function() {
	if(this.vectorSource == undefined)
	{
		console.log("creating vectorSource");
		this.createVectorSource();//Put in the data set as param, using default for now.
	}
	if(this.wardSource == undefined)
	{
		this.creatWardSource();
	}
	this.createWardLayer();
	this.createFeatureLayer();
	this.initializeMap();
	//this.createTileLayer();
	//this.map.addLayer(this.wardsVectorLayer);
	//this.map.addLayer(this.featureLayer);
	console.log(this.vectorSource.getState())
	if (this.vectorSource.getState() != 'ready'){
		this.vectorSource.on('change', function(evt) {
	        var source = evt.target;
	        var mapToCreate;
	        console.log(source.getState());
	        if (source.getState() == 'ready') {
				this.defaultMap = new defaultMapCreator();
				this.dotDensity = new DotDensityCreator();
				this.chloro = new chloroplethCreator();
				this.heatmap = new HeatMapCreator();
				this.propsymbol = new PropSymbolCreator();
	        }
	    });
	} else {
		if(this.defaultMap == undefined) {
			this.defaultMap = new defaultMapCreator();
			this.dotDensity = new DotDensityCreator();
			this.chloro = new chloroplethCreator();
			this.heatmap = new HeatMapCreator();
			this.propsymbol = new PropSymbolCreator();
		}
		
	}
};

MapDesign.prototype.isSourceReady= function(val) {
	if (this.vectorSource.getState() == 'ready') {
		console.log(this.vectorSource.getFeatures());
		this.map.removeLayer(this.featureLayer);
    	this.map.removeLayer(this.wardsVectorLayer);
		this.calculateVectorClasses();
		this.calculateColorClass();
		switch (val) {
	    case 0:
	        this.defaultMap.createMap(this.map);
	        break;
	    case 1:
	    	this.loadWards();
	    	console.log(this.colorPerClass);
	        this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay);
	        break;
	    case 2:
	        this.chloro.createMap();
	        break;
	    case 3:
	        this.heatmap.createMap();
	        break;
	    case 4:
	        this.propsymbol.createMap();
	        break;
	    }

	    this.map.addLayer(this.wardsVectorLayer);
        this.map.addLayer(this.featureLayer);   
	    return true;
    } else{
    	console.log("Source was not ready, map creation needs to wait.");
    	return false;
    }
};

MapDesign.prototype.createVectorSource = function(){
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

MapDesign.prototype.creatWardSource = function() {
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
};

MapDesign.prototype.loadWards = function(){
	this.wardsVectorLayer = new ol.layer.Vector({
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
	this.featureLayer = new ol.layer.Vector({
        source: this.vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
};

MapDesign.prototype.createWardLayer = function() {
	this.wardsVectorLayer = new ol.layer.Vector({
        source: this.vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
};

//MapDesign.prototype.createTileLayer = function() {
//	this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
//	this.map.addLayer(this.tileLayer);
//};

MapDesign.prototype.createSymbolLayer = function(){
	var symbolSource = new ol.source.Vector({});
    this.symbolLayer = new ol.layer.Vector({
        source: symbolSource
    });
};

MapDesign.prototype.initializeMap = function(){
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

MapDesign.prototype.setMapDisplayType= function(val) {
	this.mapDisplayType = val;
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