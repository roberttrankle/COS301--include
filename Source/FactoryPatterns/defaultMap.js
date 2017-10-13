//Concrete Creator
function defaultMapCreator() {
};

defaultMapCreator.prototype = Object.create(MapCreator.prototype);
defaultMapCreator.prototype.constructor = defaultMapCreator;

/**
 * Creates and adds a tile layer.
 *
 * @param      {ol.map}  map     The map
 */
defaultMapCreator.prototype.createMap = function(map) {
    this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
    map.addLayer(this.tileLayer);
};

function defaultMapDesign() {
};

defaultMapDesign.prototype = Object.create(MapDesign.prototype);
defaultMapDesign.prototype.constructor = defaultMapDesign;