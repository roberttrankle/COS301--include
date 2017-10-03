var EqualInterval = function() {
	this.output = function() {
        return "I am Equal Interval";
    }

    this.execute = function(vectorSource, attributeTitle, numberOfClasses) {
        var minimum = 0;
	    var maximum = 0;
	    var interval = 0;

	    var tempVectorLayerClasses = [];
	    vectorSource.forEachFeature(function(feature) {
	       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
	            tempVectorLayerClasses.push(feature.get(attributeTitle));
	        }
	    });
	    
	    minimum = tempVectorLayerClasses[0];
	    maximum = tempVectorLayerClasses[0];
	    for(var i = 0; i<tempVectorLayerClasses.length; i++ ){
	        if(tempVectorLayerClasses[i] < minimum){
	            minimum = tempVectorLayerClasses[i] ;
	        }

	        if(tempVectorLayerClasses[i] > maximum){
	            maximum = tempVectorLayerClasses[i];
	        }
	    }

	    console.log("minimum: "+minimum);
	    console.log("maximum: "+maximum);

	    interval = (maximum - minimum) / numberOfClasses;

	    tempVectorLayerClasses = [];
	    var j = 0;
	    for(var i = 0; i < numberOfClasses; i++){
	        j = j + interval;
	        tempVectorLayerClasses[i] = j;
	        console.log("class "+i+": "+tempVectorLayerClasses[i] );
	    }
    	return tempVectorLayerClasses;
    }
	    
};