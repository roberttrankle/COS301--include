var MapCreator = function() {
	if (this.constructor === MapCreator) {
		throw new Error("Can't instantiate abstract class!, type must be specified");
	}
};

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




 /*   var Animal = function() {
        if (this.constructor === Animal) {
          throw new Error("Can't instantiate abstract class!");
        }
    };

    Animal.prototype.say = function() {
        throw new Error("Abstract method!");
    }

    var Cat = function() {
        Animal.apply(this, arguments);
    };
    Cat.prototype = Object.create(Animal.prototype);
    Cat.prototype.constructor = Cat;

    Cat.prototype.say = function() {
        console.log('meow');
    }

    var Dog = function() {
        Animal.apply(this, arguments);
    };
    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;

    Dog.prototype.say = function() {
        console.log('bark');
    }

    var cat = new Cat();
    var dog = new Dog();

    cat.say();
    dog.say();*/
