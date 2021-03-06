/**
 * A class to create heat maps.
 *
 * @class      HeatMapCreator (HeatMapCreator)
 */

function HeatMapCreator(){
};

HeatMapCreator.prototype = Object.create(MapCreator.prototype);
HeatMapCreator.prototype.constructor = HeatMapCreator;

/**
 * Creates a heatmap layer of the features and adds it to the map.
 *
 * @param      {ol.map}  map           The map to which the layer should added
 * @param      {ol.source}  vectorSource  The vector source
 * @param      {ol.layer}  featureLayer  The feature layer
 */
HeatMapCreator.prototype.createMap = function(map, vectorSource, featureLayer){
	featureLayer.layer = new ol.layer.Heatmap({
                    source: vectorSource,
                    opacity: 0.85
                });
    map.addLayer(featureLayer.layer);
};

/**
 * A concrete product of a heat map creator.
 *
 * @class      HeatMapConcrete
 */
function HeatMapConcrete(map){
	this.map = map;
};

HeatMapConcrete.prototype = Object.create(MapProduct.prototype);
HeatMapConcrete.prototype.constructor = HeatMapConcrete;