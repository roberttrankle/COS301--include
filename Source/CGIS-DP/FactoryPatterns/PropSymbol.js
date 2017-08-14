//Concrete Creator
function PropSymbolCreator(){
	console.log("PropSymbol Creator");
};

PropSymbolCreator.prototype = Object.create(MapCreator.prototype);
PropSymbolCreator.prototype.constructor = PropSymbolCreator;

PropSymbolCreator.prototype.createMap = function(){
	console.log("Executing PropSymbol Mapcreation");
	PropSymbolDesign();
};

function PropSymbolDesign(){
	//MapDesign.call();
  	//console.log("PropSymbol constructor");
	//this.StuffLater = /*mapInformation*/;

	/*Geoserver code to make map*/
	/*openlayers code*/
	/*convert map to image*/
};

PropSymbolDesign.prototype = Object.create(MapDesign.prototype);
PropSymbolDesign.prototype.constructor = PropSymbolDesign;

