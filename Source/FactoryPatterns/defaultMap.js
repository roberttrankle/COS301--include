/**
 * A class to create default maps.
 *
 * @class      MapCreator (defaultMapCreator)
 */

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

/**
 * A concrete product of a default map creator.
 *
 * @class      defaultMapDesign
 */
function defaultMapDesign(map) {
	this.map = map;
};

defaultMapDesign.prototype = Object.create(MapProduct.prototype);
defaultMapDesign.prototype.constructor = defaultMapDesign;