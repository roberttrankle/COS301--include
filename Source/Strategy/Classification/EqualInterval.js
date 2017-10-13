/**
 * Equal interval classification method concrete class
 *
 */
function EqualInterval() {
	//Call parent constructor explicitly
	Classification.call(this);
	console.log("EqualInterval constructor");	
	//Now we ensure that the methods from the parent class are available to the child class.
	//Should maybe be outside constructor
}
	EqualInterval.prototype = Object.create(Classification.prototype);
	EqualInterval.prototype.constructor = EqualInterval;

	/**
	 * Executes equal interval classification method
	 *
	 * @param      {array}    	vectorSource		The vector source
	 * @param      {string}  	attributeTitle  	The title of the attribute selected
	 * @param      {number}  	numberOfClasses  	The number of classes
	 */
    EqualInterval.prototype.EqualIntervalExecute = function(vectorSource, attributeTitle, numberOfClasses) {
    	console.log(" Inside EqualIntervalExecute");
        var minimum = 0;
	    var maximum = 0;
	    var interval = 0;
	   // console.log("vectorSource "+vectorSource + " attributeTitle " + attributeTitle + " numberOfClasses " + numberOfClasses);
	    var tempVectorLayerClasses = [];
	    vectorSource.forEachFeature(function(feature) {
	       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
	            tempVectorLayerClasses.push(feature.get(attributeTitle));
	           // console.log(tempVectorLayerClasses.indexOf(feature.get(attributeTitle)));
	        }
	         //console.log(tempVectorLayerClasses.indexOf(feature.get(attributeTitle)));
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

	  //  console.log("minimum: "+minimum);
	  //  console.log("maximum: "+maximum);

	    interval = (maximum - minimum) / numberOfClasses;

	    tempVectorLayerClasses = [];
	    var j = 0;
	    for(var i = 0; i < numberOfClasses; i++){
	        j = j + interval;
	        tempVectorLayerClasses[i] = j;
	       // console.log("class "+i+": "+tempVectorLayerClasses[i] );
	    }
	    console.log("What is returned by interval " +tempVectorLayerClasses);
    	return tempVectorLayerClasses;
    }

    /**
	 * Executes equal interval classification method for wards
	 *
	 * @param      {array}    	wardsSource			The ward source
	 * @param      {string}  	keyName  			The name of rhe key
	 * @param      {number}  	index  				The index value
	 * @param      {number}  	numberOfClasses  	The number of classes
	 */

     EqualInterval.prototype.EqualIntervalExecuteWards = function( wardsSource, keyName, index , numberOfClasses) {
     	console.log(" Inside EqualIntervalExecuteWards");
        var minimum = 0;
	    var maximum = 0;
	    var interval = 0;
	    var tempVectorLayerClasses = [];
	    var boundriesGeometry = wardsSource.getFeatures();
		var area = 0;
		var featureCount = 0;
		var key = "AreaPerNumOccurences" + index;
		keyName[index] = key;
  
    

   
	    if (wardsSource) {
	    var boundriesGeometry = wardsSource.getFeatures();
        for (var i = 0; i < boundriesGeometry.length; i++) {
            featureCount++;
            tempVectorLayerClasses.push((wardsSource.getFeatures())[i].get(keyName[index]));
            console.log(tempVectorLayerClasses[i] + " record at index " + (i + 1));
        }

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

	     interval = (maximum - minimum) / numberOfClasses;

	    var classifyArray = [];
	    var j = 0;
	    for(var i = 0; i < numberOfClasses; i++){
	        j = j + interval;
	        classifyArray[i] = j;
	       // console.log("class "+i+": "+tempVectorLayerClasses[i] );
	    }
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
                        console.log("Executing EqualInterval + "+final[i] + " has been changed");
                    }
                }
        }
        console.log("What is returned by interval " +final);
        return final;
    }

 };
	    
//EqualInterval.prototype = Object.create(Classification.prototype);
//EqualInterval.prototype.constructor = EqualInterval;