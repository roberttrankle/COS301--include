  /**
 * Abstact class for standardisation methods
 *
 * @class      Classification (Classification)
 */
function Standardise() {
	
	console.log("Standardise");
	if (this.constructor === Standardise) {
		throw new Error("Can't instantiate abstract class!, type must be specified");
	}
};

//Pure Virtual
Standardise.prototype.areaBasedStandardisation = function( vectorSource, wardsSource, keyName, index) {};
Standardise.prototype.ratioBasedStandardisation = function( vectorSource, wardsSource, keyName, index) {};
Standardise.prototype.rateBasedStandardisation = function( vectorSource, wardsSource, keyName, index) {};
Standardise.prototype.densityBasedStandardisation = function( vectorSource, wardsSource, keyName, index) {};
Standardise.prototype.defaultStandardisation = function(vectorSource, wardsSource, keyName, index) {};