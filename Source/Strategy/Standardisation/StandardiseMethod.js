 /**
 * Concrete class for standardisation methods
 *
 * @class      Classification (Classification)
 */
function StandardiseMethod() {
    //Call parent constructor explicitly
    Standardise.call(this);
    console.log("StandardiseMethod constructor");
    //Now we ensure that the methods from the parent class are available to the child class.
    //Should maybe be outside constructor
    //this.Standardise = [] //Array with the new standardised values
}

StandardiseMethod.prototype = Object.create(Standardise.prototype);
StandardiseMethod.prototype.constructor = StandardiseMethod;

/**
 * Executes area based standardisation method
 * 
 * @param      {array}      vectorSource    The vector source
 * @param      {array}      wardsSource     The ward source
 * @param      {string}     keyName         The iname of the key
 * @param      {number}     index           The index value
 */
StandardiseMethod.prototype.areaBasedStandardisation = function(vectorSource, wardsSource, keyName, index) {
   // console.log("Area - AreaPerNumOccurences");
    var pointFeatures = vectorSource.getFeatures();
    var boundriesGeometry = wardsSource.getFeatures();
    var area = 0;
    var featureCount = 0;
    var key = "AreaPerNumOccurences" + index;
    keyName[index] = key;

    for (var i = 0; i < boundriesGeometry.length; i++) {
        featureCount = 0;
        for (var j = 0; j < pointFeatures.length; j++) {
            if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                featureCount++;
            }
        }

        area = boundriesGeometry[i].getGeometry().getArea();

        //boundriesGeometry[i].set(key+'',(area/numHouseholds)); //AreaPerNumHouseholds
        if (featureCount == 0) {
            (wardsSource.getFeatures())[i].set(key, 0);
        } else {
            (wardsSource.getFeatures())[i].set(key, (area / featureCount));
        }
        /////////////////////////////////////////////////
        //////
        /////////////////////////////////////////////////
        /////////////////////////////////////////////////
        // console.log((wardsSource.getFeatures())[i].get(keyName[index]));
    }

    // console.log((wardsSource.getFeatures())[i].get(keyName[index]));
   // console.log("KEY: " + key);
   // console.log("getStandardValue");
    return wardsSource;
};


// StandardiseMethod.prototype.ratioBasedStandardisation = function(vectorSource, wardsSource, keyName, index) {
//     console.log("ratio"); //Currently busy on it

//     var pointFeatures = vectorSource.getFeatures();
//     var boundriesGeometry = wardsSource.getFeatures();
//     var countOfClassPerWard;
//     var countPerWard = [];
//     var maxClassCountOfWard = -1;
//     var minClassCountOfWard = Number.POSITIVE_INFINITY;
//     console.log("number of boundry features" + boundriesGeometry.length + " number of point features" + pointFeatures.length);
//     for (var i = 0; i < boundriesGeometry.length; i++) {
//         countOfClassPerWard = 0;
//         for (var j = 0; j < pointFeatures.length; j++) {

//             if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
//                 if ((pointFeatures[j].get(featureToDisplay)).localeCompare(selectedValue) == 0) {
//                     countOfClassPerWard = countOfClassPerWard + 1;
//                 }
//             }
//         }
//         countPerWard[i] = countOfClassPerWard;
//         console.log(" Number of elements per ward" + countPerWard[i]);

//     }
//    // console.log("KEY: "+key);
//     return countPerWard;
// };

// StandardiseMethod.prototype.rateBasedStandardisation = function(vectorSource, wardsSource, keyName, index) {
//     console.log("rate");
// };

/**
 * Executes density based standardisation method
 * 
 * @param      {array}      vectorSource    The vector source
 * @param      {array}      wardsSource     The ward source
 * @param      {string}     keyName         The name of the key
 * @param      {number}     index           The index value
 */
StandardiseMethod.prototype.densityBasedStandardisation = function(vectorSource, wardsSource, keyName, index) {
    console.log("Density - featureCountPerArea");
    var pointFeatures = vectorSource.getFeatures();
    var boundriesGeometry = wardsSource.getFeatures();
    householdsPerArea = [];
    var featureCount = 0;
    var area = 0;
    var key = "featureCountPerArea" + index;
    keyName[index] = key;

    for (var i = 0; i < boundriesGeometry.length; i++) {
        featureCount = 0;
        for (var j = 0; j < pointFeatures.length; j++) {
            if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                featureCount++;
            }
        }

        area = boundriesGeometry[i].getGeometry().getArea();

        //boundriesGeometry[i].set(key+'',(numHouseholds/area)); //numHouseholdsPerArea
        if (area == 0) {
            (wardsSource.getFeatures())[i].set(key, 0);
        } else {
            (wardsSource.getFeatures())[i].set(key, (featureCount / area));
        }
    }
   // console.log("KEY: " + key);
    return wardsSource;
};

/**
 * Executes area default standardisation method
 * 
 * @param      {array}      vectorSource    The vector source
 * @param      {array}      wardsSource     The ward source
 * @param      {string}     keyName         The name of the key
 * @param      {number}     index           The index value
 */
StandardiseMethod.prototype.defaultStandardisation = function(vectorSource, wardsSource, keyName, index) {
    var pointFeatures = vectorSource.getFeatures();
    var boundriesGeometry = wardsSource.getFeatures();
    var key = "unstandard" + index;
    for (var i = 0; i < boundriesGeometry.length; i++) {
        var sum = 0;
        for (var j = 0; j < pointFeatures.length; j++) {
            if (ol.extent.intersects(pointFeatures[j].getGeometry().getExtent(), boundriesGeometry[i].getGeometry().getExtent())) { // Cite:B
                sum += pointFeatures[j].get(key);
            }
        }
        (wardsSource.getFeatures())[i].set(key, (sum));
    }

    keyName[index] = key;
    return wardsSource;
};