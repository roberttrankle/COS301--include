var MapCreator = function(type) {
    if (this.constructor === MapCreator) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
};

MapCreator.prototype.createMap = function(){
    console.log("MapCreator Abstract class");
};

//Concrete Creator
function DotDensityCreator(){
    console.log("Density Creator");
    
};

DotDensityCreator.prototype = Object.create(MapCreator.prototype);
DotDensityCreator.prototype.constructor = DotDensityCreator;

DotDensityCreator.prototype.createMap = function(){
    console.log("Executing DD Mapcreation");
    DotDensityDesign();
};

var MapDesign = function(){
    console.log("Constructing");
};

function DotDensityDesign(){
    MapDesign.call();
  console.log("DD constructor");
    //this.StuffLater = /*mapInformation*/;

    /*Geoserver code to make map*/
    /*openlayers code*/
    /*convert map to image*/
};

DotDensityDesign.prototype = Object.create(MapDesign.prototype);
DotDensityDesign.prototype.constructor = DotDensityDesign;

var TESTMAP = new DotDensityCreator();
TESTMAP.createMap();