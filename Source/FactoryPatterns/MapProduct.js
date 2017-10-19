/**
 * A abstract class to be used for different map types.
 *
 * @class      MapProduct
 */
var MapProduct = function() {
    if (this.constructor === MapProduct) {
        throw new Error("Can't instantiate abstract class!, type must be specified");
    }
};