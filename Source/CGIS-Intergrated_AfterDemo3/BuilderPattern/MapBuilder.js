function MapBuilder() {
	//verander
	// if(type == "HeatMap"){
	// 	console.log("HeatMap builder");
	// 	this.__proto__ = HeatMapCreator.prototype;
	// }
	console.log("MapBuilder");
	if (this.constructor === MapBuilder) {
		throw new Error("Can't instantiate abstract class!, type must be specified");
	}
};

//Pure Virtual
MapBuilder.prototype.buildMapHeading = function() {};
MapBuilder.prototype.buildMapLegend = function() {};
MapBuilder.prototype.buildMapScale = function() {};
MapBuilder.prototype.buildMapNorthArrow = function() {};
MapBuilder.prototype.buildMapMetaData = function() {};