//Concrete Creator
function HeatMapCreator(){
};

HeatMapCreator.prototype = Object.create(MapCreator.prototype);
HeatMapCreator.prototype.constructor = HeatMapCreator;

HeatMapCreator.prototype.createMap = function(map, vectorSource, featureLayer){
	featureLayer.layer = new ol.layer.Heatmap({
                    source: vectorSource,
                    opacity: 0.85
                });
    map.addLayer(featureLayer.layer);
	//HeatMapDesign();
};

function HeatMapDesign(map){
	this.map = map;
};

HeatMapDesign.prototype = Object.create(MapDesign.prototype);
HeatMapDesign.prototype.constructor = HeatMapDesign;