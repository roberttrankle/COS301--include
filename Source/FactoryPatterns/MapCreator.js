/**
 * A class to be used as an virtual class for different map types.
 *
 * @class      MapCreator (MapCreator)
 */
var MapCreator = function() {
    if (this.constructor === MapCreator) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
    this.tileLayer;
};