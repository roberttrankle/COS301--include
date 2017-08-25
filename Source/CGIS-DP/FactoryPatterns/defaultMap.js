//Concrete Creator
function defaultMapCreator() {
	// console.log("default Map being created.");
};

defaultMapCreator.prototype = Object.create(MapCreator.prototype);
defaultMapCreator.prototype.constructor = defaultMapCreator;

defaultMapCreator.prototype.createMap = function(map) {
    // console.log("DisplayDEFAULTMAP");
    this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
    map.addLayer(this.tileLayer);
};

function defaultMapDesign() {
	//JPEG PRODUCT YO
};

defaultMapDesign.prototype = Object.create(MapDesign.prototype);
defaultMapDesign.prototype.constructor = defaultMapDesign;