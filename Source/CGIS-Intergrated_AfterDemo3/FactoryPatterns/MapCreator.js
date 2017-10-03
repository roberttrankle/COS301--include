var MapCreator = function() {
    if (this.constructor === MapCreator) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
    this.tileLayer;
};