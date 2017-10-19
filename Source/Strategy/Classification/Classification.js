   /**
 * Abstact class for the strategy method(classification)
 *
 * @class      Classification (Classification)
 */
var Classification = function() {
    if (this.constructor === Classification) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
};
 

Classification.prototype.EqualIntervalExecute = function(vectorSource, attributeTitle, numberOfClasses) {};
Classification.prototype.NaturalBreaksExecute = function(vectorSource, attributeTitle, numberOfClasses) {};
Classification.prototype.QuantileExecute = function(vectorSource, attributeTitle, numberOfClasses) {};




//Classification.prototype. = function(  vectorSource, wardsSource, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {};
/*

Classification.prototype = {
    setMethod: function(method) {
        console.log(method+" set successfully!");
        this.method = method;
    },

    addMethod: function(method){
        var script = document.createElement('script');
        script.src = method+'.js';
       // script.onload = function () {
            //do stuff with the script
        //};

        document.head.appendChild(script); 

    alert(method+' has been successfully added');
    },

    execute: function(vectorSource, featureToDisplay, numberOfClasses) {
        return this.method.execute(vectorSource, featureToDisplay, numberOfClasses);
    },
 
    output: function() {
        return this.method.output();
    }
};

function Standardise() {
    
    console.log("Standardise");
    if (this.constructor === Standardise) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
};

//Pure Virtual
Standardise.prototype.area = function( vectorSource, wardsSource, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {};
Standardise.prototype.ratio = function( vectorSource, wardsSource, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {};
Standardise.prototype.rate = function( vectorSource, wardsSource, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {};
Standardise.prototype.density = function(  vectorSource, wardsSource, featureToDisplay, selectedValue, wardsVectorLayer, featureLayer) {};


*/
