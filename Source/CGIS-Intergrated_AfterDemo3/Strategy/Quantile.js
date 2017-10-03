var Quantile = function() {
    this.output = function() {
        return "I an Quantile";
    }

    this.execute = function(vectorSource, attributeTitle, numberOfClasses) {
        var tempVectorLayerClasses = [];
        var k = 0;
        console.log(this.featureToDisplay + " feature to display");
        if (vectorSource) {
            this.vectorSource = vectorSource;
            this.vectorSource.forEachFeature(function(feature) {
                tempVectorLayerClasses.push(feature.get(attributeTitle));
                k++;
            });
            console.log("TVLC:");
            console.log(tempVectorLayerClasses);

            this.reclassify = new Array(tempVectorLayerClasses.length);
            k = 0;
            for (k; k < this.reclassify.length; k++) {
                this.reclassify[k] = tempVectorLayerClasses[k];
            }
            var boundaryPerClass = k / numberOfClasses;
            k = 0;
            var temp = new Array(numberOfClasses);
            for (k; k < numberOfClasses; k++) {
                temp[k] = k;
            }
            k = 0;
            var index = 0;
            while (index < temp.length) {
                k = 0;
                for (k; k < boundaryPerClass; k++) {
                    this.reclassify[k] = index;
                    console.log(this.reclassify[k] + " reclassified ");
                }
                console.log(" about to reclassify");
                index++;
            }
        } else {
            console.log(" Cannot find vectorSource");
        }
        return this.reclassify;
    };
};