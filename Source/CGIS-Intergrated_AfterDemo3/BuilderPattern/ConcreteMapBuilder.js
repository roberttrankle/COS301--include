
function ConcreteMapBuilder() {
	//Call parent constructor explicitly
	MapBuilder.call(this);
	console.log("ConcreteMapBuilder constructor");	
	//Now we ensure that the methods from the parent class are available to the child class.
	//Should maybe be outside constructor
	ConcreteMapBuilder.prototype = Object.create(MapBuilder.prototype);
	ConcreteMapBuilder.prototype.constructor = ConcreteMapBuilder;
}

//Implements parent's pure virtual functions
ConcreteMapBuilder.prototype.buildMapHeading = function() {
	console.log("buildMapHeading");	
};

ConcreteMapBuilder.prototype.buildMapLegend = function(colorClasses, classNames, mapType) {
	console.log("buildMapLegend");
	// //double check mapType number
	// if ((mapType != 1) && (colorClasses == null || classNames == null)) {

	// 	console.log("colorClasses or classNames is NULL");

	// } else if (mapType == 0) {
			

	// } else if (mapType == 1) {

	// 	console.log("buildMapLegend mapType = 1");
	// }
};

ConcreteMapBuilder.prototype.buildMapScale = function() {
	console.log("buildMapScale");	
};

ConcreteMapBuilder.prototype.buildMapNorthArrow = function() {
	console.log("buildMapNorthArrow");
};

ConcreteMapBuilder.prototype.buildMapMetaData = function() {
	console.log("buildMapMetaData");
};