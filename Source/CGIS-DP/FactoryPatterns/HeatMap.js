//Concrete Creator
function HeatMapCreator(){
	console.log("HeatMap Creator");
};

HeatMapCreator.prototype = Object.create(MapCreator.prototype);
HeatMapCreator.prototype.constructor = HeatMapCreator;

HeatMapCreator.prototype.createMap = function(){
	//HeatMapDesign();
};

function HeatMapDesign(){
	//MapDesign.call();
  	//console.log("HeatMap constructor");
	//this.StuffLater = /*mapInformation*/;

	/*Geoserver code to make map*/
	/*openlayers code*/
	/*convert map to image*/
};

HeatMapDesign.prototype = Object.create(MapDesign.prototype);
HeatMapDesign.prototype.constructor = HeatMapDesign;
