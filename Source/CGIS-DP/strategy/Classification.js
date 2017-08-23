

console.log(" In Classification");
var Classification = function() {
    this.reclassify
    this.numberOfClasses;
    this.feature;
    this.vectorSource;
console.log(" In constructor");
};

 
 Classification.prototype.setNumberOfClasses = function( numberOfClasses) {
        this.numberOfClasses = numberOfClasses;
    };


    Classification.prototype.setFeature =function( feature) {
        this.feature = feature;
    };

    Classification.prototype.addMethod =function(method){
        var script = document.createElement('script');
        script.src = method+'.js';
       // script.onload = function () {
            //do stuff with the script
        //};

        document.head.appendChild(script); 

    alert(method+' has been successfully added');
    };
 
    Classification.prototype.output= function() {
        return this.method.output();
    };

    Classification.prototype.classify= function(method ,attributeTitle , vectorSource ,numberOfClasses) {
        //switch
        var quantile = "quantile";
        var naturalBreak = "naturalBreak";
        var equalInterval = "equalInterval";

        console.log(" About to conduct switch");
         switch (method) {
        case quantile:
           // this.quantile(attributeTitle,vectorSource,numberOfClasses);
            console.log(" Executing " +quantile);
            break;
        case naturalBreak:
            //this.quantile(attributeTitle,vectorSource ,numberOfClasses);
            console.log(" Executing " + naturalBreak);
            break;
        case equalInterval:
            //this.quantile(attributeTitle,vectorSource ,numberOfClasses);
            console.log(" Executing " + equalInterval);
            break;
    }
        console.log(" done classifying");
    };

    Classification.prototype.quantile = function(attributeTitle , vectorSource ,numberOfClasses) {
    //Code to classify the data
    var tempVectorLayerClasses = [];
    var k =0;
    console.log(this.featureToDisplay+" feature to display");
    if ( vectorSource){
            this.vectorSource = vectorSource;
            this.vectorSource.forEachFeature(function(feature) {
        
            tempVectorLayerClasses.push(feature.get(attributeTitle));
           // console.log(tempVectorLayerClasses.indexOf(feature.get(attributeTitle)));
            k++;
    });
    
   

    
    this.reclassify = new Array(tempVectorLayerClasses.length);
    k=0;
    for (k; k < this.reclassify.length ; k++ ){
        this.reclassify[k] = tempVectorLayerClasses[k];
       // console.log(" feature :"+this.reclassify[k]);
       // console.log(" counter "+k);
    }
        var boundaryPerClass = k / numberOfClasses;
       // console.log(boundaryPerClass);

        k=0;
        var temp = new Array(numberOfClasses);
        for ( k ; k < numberOfClasses ; k++){
            temp[k] = k;
           // console.log(temp[k]);
        }
        k=0;
        var index=0;
        while ( index < temp.length){
            k=0;
            for (k;k <boundaryPerClass;k++){
                this.reclassify[k]=index;
            console.log(this.reclassify[k] + " reclassified ");
            }
            console.log(" about to reclassify");
            index++;
        }
    }
    else {
        console.log( " Cannot find vectorSource");
    }
    return this.reclassify;

};

