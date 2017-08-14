//Concrete Creator
function chloroplethCreator(){
	console.log("choropleth Creator");
};

chloroplethCreator.prototype = Object.create(MapCreator.prototype);
chloroplethCreator.prototype.constructor = chloroplethCreator;

chloroplethCreator.prototype.createMap = function(){
	console.log("Executing chloropleth Mapcreation");
	chloroplethDesign();
};

function chloroplethDesign(){
	MapDesign.call();
  console.log("chloroplethDesign constructor");
	//this.StuffLater = /*mapInformation*/;

	/*Geoserver code to make map*/
	/*openlayers code*/
	/*convert map to image*/
};

chloroplethDesign.prototype = Object.create(MapDesign.prototype);
chloroplethDesign.prototype.constructor = chloroplethDesign;