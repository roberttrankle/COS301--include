function NaturalBreaks() {
    //Call parent constructor explicitly
    Classification.call(this);
    console.log("NaturalBreaks constructor");   
    //Now we ensure that the methods from the parent class are available to the child class.
    //Should maybe be outside constructor
    
   
}

    NaturalBreaks.prototype = Object.create(Classification.prototype);
    NaturalBreaks.prototype.constructor = NaturalBreaks;

    
   NaturalBreaks.prototype.NaturalBreaksExecute = function(vectorSource, attributeTitle, numberOfClasses) {
        var tempVectorLayerClasses = [];
        console.log(vectorSource.getFeatures());
        vectorSource.forEachFeature(function(feature) {
           if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
                tempVectorLayerClasses.push(feature.get(attributeTitle));
               // console.log("class: "+feature.get(attributeTitle));
            }
        });
        console.log(tempVectorLayerClasses.length);

        return jenks(tempVectorLayerClasses, numberOfClasses);
    }

     NaturalBreaks.prototype.NaturalBreaksExecuteWards = function(wardsSource, keyName, index, numberOfClasses) {
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
        

        var classifyArray= jenks(tempVectorLayerClasses, numberOfClasses);
        var setVectorLayerClasses = new Array(tempVectorLayerClasses.length);
        for (var i = 0; i < tempVectorLayerClasses.length; i++) {
            setVectorLayerClasses[i]=false;
            console.log(" index :" + i + " setVectorLayerClasses value = " +setVectorLayerClasses[i]);
           // console.log(tempVectorLayerClasses[i] + " record at index " + (i + 1));
        }
       // console.log("What is returned by interval " +tempVectorLayerClasses);
        var final = [];
         for (var i = 0; i < tempVectorLayerClasses.length; i++) {
                for (var k = 0; k < classifyArray.length; k++) {
                    if (tempVectorLayerClasses[i] <= classifyArray[k] && setVectorLayerClasses[i] == false) {
                        final[i] = k;
                        setVectorLayerClasses[i] = true;
                        console.log("Executing NaturalBreaks + "+final[i] + " has been changed");
                    }
                }
        }
        console.log("What is returned by NaturalBreaks " +final);
        return final;
    }
 }


    // Compute the matrices required for Jenks breaks. These matrices
    // can be used for any classing of data with `classes <= numberOfClasses`
    var jenksMatrices = function(tempVectorLayerClasses, numberOfClasses) {

        // in the original implementation, these matrices are referred to
        // as `LC` and `OP`
        //
        // * lower_class_limits (LC): optimal lower class limits
        // * variance_combinations (OP): optimal variance combinations for all classes
        var lower_class_limits = [],
            variance_combinations = [],
            // loop counters
            i, j,
            // the variance, as computed at each step in the calculation
            variance = 0;

        // Initialize and fill each matrix with zeroes
        console.log(tempVectorLayerClasses.length);
        console.log(numberOfClasses);
        for (i = 0; i < tempVectorLayerClasses.length + 1; i++) {
            var tmp1 = [], tmp2 = [];
            for (j = 0; j < numberOfClasses + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
            }
            lower_class_limits.push(tmp1);
            variance_combinations.push(tmp2);
        }

        for (i = 1; i < numberOfClasses + 1; i++) {
            lower_class_limits[1][i] = 1;
            variance_combinations[1][i] = 0;
            // in the original implementation, 9999999 is used but
            // since Javascript has `Infinity`, we use that.
            for (j = 2; j < tempVectorLayerClasses.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
            }
        }

        for (var l = 2; l < tempVectorLayerClasses.length + 1; l++) {

            // `SZ` originally. this is the sum of the values seen thus
            // far when calculating variance.
            var sum = 0, 
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of 
                w = 0,
                // `IV` originally
                i4 = 0;

            // in several instances, you could say `Math.pow(x, 2)`
            // instead of `x * x`, but this is slower in some browsers
            // introduces an unnecessary concept.
            for (var m = 1; m < l + 1; m++) {

                // `III` originally
                var lower_class_limit = l - m + 1,
                    val = tempVectorLayerClasses[lower_class_limit - 1];

                // here we're estimating variance for each potential classing
                // of the tempVectorLayerClasses, for each potential number of classes. `w`
                // is the number of tempVectorLayerClasses points considered so far.
                w++;

                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;

                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;

                i4 = lower_class_limit - 1;

                if (i4 !== 0) {
                    for (j = 2; j < numberOfClasses + 1; j++) {
                        if (variance_combinations[l][j] >=
                            (variance + variance_combinations[i4][j - 1])) {
                            lower_class_limits[l][j] = lower_class_limit;
                            variance_combinations[l][j] = variance +
                                variance_combinations[i4][j - 1];
                        }
                    }
                }
            }

            lower_class_limits[l][1] = 1;
            variance_combinations[l][1] = variance;
        }

        return {
            lower_class_limits: lower_class_limits,
            variance_combinations: variance_combinations
        };
    };

    // # [Jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
    //
    // Implementations: [1](http://danieljlewis.org/files/2010/06/Jenks.pdf) (python),
    // [2](https://github.com/vvoovv/djeo-jenks/blob/master/main.js) (buggy),
    // [3](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L407) (works)

    var jenks = function(tempVectorLayerClasses, numberOfClasses) {

        // sort tempVectorLayerClasses in numerical order
        tempVectorLayerClasses = tempVectorLayerClasses.slice().sort(function (a, b) { return a - b; });

        // get our basic matrices
        var matrices = this.jenksMatrices(tempVectorLayerClasses, numberOfClasses),
            // we only need lower class limits here
            lower_class_limits = matrices.lower_class_limits,
            k = tempVectorLayerClasses.length - 1,
            kclass = [],
            countNum = numberOfClasses;

        // the calculation of classes will never include the upper and
        // lower bounds, so we need to explicitly set them
        kclass[numberOfClasses] = tempVectorLayerClasses[tempVectorLayerClasses.length - 1];
        kclass[0] = tempVectorLayerClasses[0];

        // the lower_class_limits matrix is used as indexes into itself
        // here: the `k` variable is reused in each iteration.
        while (countNum > 1) {
            kclass[countNum - 1] = tempVectorLayerClasses[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }

        return kclass;
    };

