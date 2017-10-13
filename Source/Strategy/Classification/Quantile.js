/**
 * Quantile classification method concrete class
 *
 */

function Quantile() {
    //Call parent constructor explicitly
    Classification.call(this);
    console.log("Quantile constructor");
    //Now we ensure that the methods from the parent class are available to the child class.
    //Should maybe be outside constructor


}

Quantile.prototype = Object.create(Classification.prototype);
Quantile.prototype.constructor = Quantile;

/**
 * Checks if param is an int
 *
 * @param   {<type>}        n        The value to be checked
 */
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

/**
 * Checks if param is a float
 *
 * @param   {<type>}        n        The value to be checked
 */
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

/**
     * Executes quantile classification method
     *
     * @param      {array}      vectorSource        The vector source
     * @param      {string}     attributeTitle      The title of the attribute selected
     * @param      {number}     numberOfClasses     The number of classes
     */
Quantile.prototype.QuantileExecute = function(vectorSource, attributeTitle, numberOfClasses) {
    // console.log(" Inside QuantileExecute");
    var tempVectorLayerClasses = [];
    var classes = []; //returned quantile index classes

    if (vectorSource) {
        var numberOfElements = 0;

        vectorSource.forEachFeature(function(feature) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
            numberOfElements++;

        });

        var boundary = numberOfElements / numberOfClasses;

        var temp = 0;
        for (var i = 0; i < numberOfClasses; i++) {
            temp += (boundary);
            classes.push(temp);
            // console.log("temp" + temp );

        }

    } else {
        console.log(" Cannot find vectorSource");
    }

    return classes;
};

/**
 * Executes quantlie classification method for wards
 *
 * @param      {array}      wardsSource         The ward source
 * @param      {string}     keyName             The name of rhe key
 * @param      {number}     index               The index value
 * @param      {number}     numberOfClasses     The number of classes
 */
Quantile.prototype.QuantileExecuteWards = function(wardsSource, keyName, index, numberOfClasses) {
    var boundriesGeometry = wardsSource.getFeatures();
    var area = 0;
    var featureCount = 0;
    var key = "AreaPerNumOccurences" + index;
    keyName[index] = key;
    var tempVectorLayerClasses = [];
    var classes = []; //returned quantile index classes

    if (wardsSource) {
        for (var i = 0; i < boundriesGeometry.length; i++) {
            featureCount++;
            tempVectorLayerClasses.push((wardsSource.getFeatures())[i].get(keyName[index]));
           // console.log(tempVectorLayerClasses[i] + " record at index " + (i + 1));
        }

       // console.log("Array inside quantile wards classification " + tempVectorLayerClasses);
        var boundary = featureCount / numberOfClasses;

        var temp = 0;
        for (var i = 0; i < numberOfClasses; i++) {
            temp += (boundary);
            classes.push(temp);
            // console.log("temp" + temp );

        }

    } else {
        console.log(" Cannot find vectorSource");
    }
    console.log(classes + "returned by quantilewards");
    return classes;

};