document.write('<script type="text/javascript" src="classification.js"></script>');

var MapDesign = function() {
    this.featureToDisplay = "ha_dwell_5"; //must set with UI
    this.vectorSource;
    this.wardsSource;
    this.symbolSource;
    this.tileLayer;
    //Layers are made object (not primitives) to pass as reference to other classes
    this.wardsVectorLayer = { layer: 'value' };
    this.featureLayer = { layer: 'value' };
    this.symbolLayer = { layer: 'value' };
    this.map;
    this.mapDisplayType;
    this.defaultMap;
    this.dotDensity;
    this.chloro;
    this.heatmap;
    this.vectorLayerClasses = [];
    this.colorPerClass = [];
    this.propsymbol;
    this.loadSources();
};

MapDesign.prototype.standardise = function() {
    //Code to call strategy method
};

/*MapDesign.prototype.classify = function() {
    //Code to classify the data
};*/

MapDesign.prototype.classify = function(method, vectorSource, featureToDisplay, numberOfClasses) {
    console.log("Executing classify()");
    var classification = new Classification();

    if(method == "equal interval"){
        var equal_Interval = new EqualInterval();
         
        classification.setMethod(equal_Interval);
    //    console.log(classification.output());
        classification.execute(vectorSource, featureToDisplay, numberOfClasses);
    }else if(method == "natural breaks"){
        var natural_Breaks = new NaturalBreaks();
         
        classification.setMethod(natural_Breaks);
       // console.log(classification.output());
        classification.execute(vectorSource, featureToDisplay, numberOfClasses);
    }else if(method == "quantile"){
        var quantile = new Quantile();
         
        classification.setMethod(quantile);
       // console.log(classification.output());
        classification.execute(vectorSource, featureToDisplay, numberOfClasses);
    }
}

MapDesign.prototype.render = function() {
    //render code
};

MapDesign.prototype.getVectorSource = function() {
    return this.vectorSource;
};

MapDesign.prototype.getWardsSource = function() {
    return this.wardsSource;
};

MapDesign.prototype.setVectorSource = function(source) {
    this.vectorSource = source;
};

MapDesign.prototype.setWardsSource = function(source) {
    this.wardsSource = source;
};

MapDesign.prototype.loadSources = function() {
	this.initializeMap();
    if (this.vectorSource == undefined) {
        this.createVectorSource(); //Put in the data set as param, using default for now.
    }
    if (this.wardsSource == undefined) {
        this.creatwardsSource();
    }
    this.createWardLayer();
    this.createFeatureLayer();
    //this.createTileLayer();
    //this.map.addLayer(this.wardsVectorLayer);
    //this.map.addLayer(this.featureLayer);
    if (this.vectorSource.getState() != 'ready') {
        this.vectorSource.on('change', function(evt) {
            var source = evt.target;
            var mapToCreate;
            if (source.getState() == 'ready') {
                this.defaultMap = new defaultMapCreator();
                this.dotDensity = new DotDensityCreator();
                this.chloro = new chloroplethCreator();
                this.heatmap = new HeatMapCreator();
                this.propsymbol = new PropSymbolCreator();
            }
        });
    } else {
        if (this.defaultMap == undefined) {
            this.defaultMap = new defaultMapCreator();
            this.dotDensity = new DotDensityCreator();
            this.chloro = new chloroplethCreator();
            this.heatmap = new HeatMapCreator();
            this.propsymbol = new PropSymbolCreator();
        }

    }
};

MapDesign.prototype.isSourceReady = function(mapType) {
    if (this.vectorSource.getState() == 'ready') {
        this.createWardLayer();
        this.removeLayers();
        // if not default map loadWards:
        if (mapType != 0) {
        	this.loadWards();
        	// this.createWardLayer();
        	this.createVectorSource();
        	this.createFeatureLayer();
         }
        this.recursiveCreate(mapType);
        return true;
    } else {
        console.log("Source was not ready, map creation needs to wait.");
        return false;
    }
};

//Waits till features ready before creating
MapDesign.prototype.recursiveCreate = function(mapType) {
	if (mapType != 0 && (this.wardsSource == undefined || this.vectorSource == undefined || this.wardsSource.getFeatures().length <= 0 || this.vectorSource.getFeatures().length <= 0)) {
		// console.log("A source is not ready, waiting 1s and retrying");
		// console.log("WSc=" + this.wardsSource.getFeatures().length +  "VSc=" + this.vectorSource.getFeatures().length);
		var that = this;
		setTimeout(function() { 
			that.recursiveCreate(mapType);
		}, 1000);
		return;
	}
	if (mapType == 1 || mapType == 3 || mapType == 4){
		this.getUniqueDiscreteValues(this.featureToDisplay);
        //this.naturalBreaks(this.featureToDisplay, 2);
       this.classify("equal interval", this.vectorSource, this.featureToDisplay, 5);


        
     //   classification.setMethod(this.object, this.vectorSource);

	    this.calculateColorClass(this.vectorLayerClasses);
	}
    switch (mapType) {
        case 0:
            this.defaultMap.createMap(this.map);
            break;
        case 1:
            this.dotDensity.createMap(this.map, this.vectorSource, this.colorPerClass, this.featureToDisplay, this.featureLayer);
            break;
        case 2:
            this.heatmap.createMap(this.map, this.vectorSource, this.featureLayer);
            break;
        case 3:
            this.chloro.createMap(this.map, this.vectorSource, this.wardsSource, this.colorPerClass, 5, this.featureToDisplay, this.wardsVectorLayer, this.featureLayer);
            break;
        case 4:
            // Recursively run test function
            this.propsymbol.createMap(this.map, this.vectorSource, this.wardsSource, this.symbolSource, this.colorPerClass, this.featureToDisplay, this, this.symbolLayer);
            break;
    }
    this.map.addLayer(this.wardsVectorLayer.layer);
}

MapDesign.prototype.removeLayers = function() {
    if (this.wardsSource != undefined) {
        // console.log("removing Style");
        var boundriesFeatures = this.wardsSource.getFeatures();
        for (var i = 0; i < boundriesFeatures.length; i++) {
            boundriesFeatures[i].setStyle();
        }
    }
    if (this.symbolSource != undefined) {
        //TODO clear features
        var symbolFeatures = this.symbolSource.getFeatures();
           for (var i = 0; i < symbolFeatures.length; i++) {
               symbolFeatures[i].setStyle();
           }
       symbolSource.clear();
    }
    this.map.removeLayer(this.symbolLayer.layer);
    this.map.removeLayer(this.featureLayer.layer);
    this.map.removeLayer(this.wardsVectorLayer.layer);
};

MapDesign.prototype.createVectorSource = function() {
    this.vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=CGIS:households&' +
                'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=1000&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

MapDesign.prototype.creatwardsSource = function() {
    this.wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
            return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=CGIS:wards&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });
};

MapDesign.prototype.loadWards = function() {
    this.wardsVectorLayer.layer = new ol.layer.Vector({
        source: this.wardsSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0.05)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 1
            }),
            image: new ol.style.Circle({
                radius: 20,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,0.9)',
                    width: 4
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 0, 0.6)'
                })
            })
        })
    });
}

MapDesign.prototype.createFeatureLayer = function() {
    this.featureLayer.layer = new ol.layer.Vector({
        source: this.vectorSource,
        style: new ol.style.Style({
            visible: false
        })
    });
    this.map.addLayer(this.featureLayer.layer);
};

MapDesign.prototype.createWardLayer = function() {
    this.wardsVectorLayer.layer = new ol.layer.Vector({
        source: this.wardsSource,
        style: new ol.style.Style({
            visible: false
        })
    });
};

//MapDesign.prototype.createTileLayer = function() {
//	this.tileLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
//	this.map.addLayer(this.tileLayer);
//};

MapDesign.prototype.createSymbolLayer = function() {
    var symbolSource = new ol.source.Vector({});
    this.symbolLayer.layer = new ol.layer.Vector({
        source: symbolSource
    });
};

MapDesign.prototype.initializeMap = function() {
    this.map = new ol.Map({
        layers: [],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [28.5, -25.69], //map.getView().getCenter()
            zoom: 10
        })
    });
};

MapDesign.prototype.setMapDisplayType = function(mapType) {
    this.mapDisplayType = mapType;
};

MapDesign.prototype.getMap = function() {
    return this.map;
}

MapDesign.prototype.getVectorClasses = function() {
    return this.vectorLayerClasses;
}

//	Creates an array of unique values for a attribute which's name is passed
MapDesign.prototype.getUniqueDiscreteValues = function(attributeTitle) {
	var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
        }
    });
    this.vectorLayerClasses = tempVectorLayerClasses;
    return tempVectorLayerClasses;
}

/*

MapDesign.prototype.equalInterval = function(attributeTitle, numberOfClasses) {

    var minimum = 0;
    var maximum = 0;
    var interval = 0;

    var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
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

MapDesign.prototype.quantile = function(attributeTitle, numberOfClasses) {

    var minimum = 0;
    var maximum = 0;
    var featPerClass = 0;

    var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
           // console.log("class: "+feature.get(attributeTitle));
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

    console.log("numberOfClasses: "+tempVectorLayerClasses.length);



   featPerClass = tempVectorLayerClasses.length / numberOfClasses;





   

    return featPerClass;

}


MapDesign.prototype.naturalBreaks = function(attributeTitle, numberOfClasses) {


    var tempVectorLayerClasses = [];
    this.vectorSource.forEachFeature(function(feature) {
       if (tempVectorLayerClasses.indexOf(feature.get(attributeTitle)) == -1) {
            tempVectorLayerClasses.push(feature.get(attributeTitle));
           // console.log("class: "+feature.get(attributeTitle));
        }
    });
    this.jenks(tempVectorLayerClasses, numberOfClasses);
}




// Compute the matrices required for Jenks breaks. These matrices
    // can be used for any classing of data with `classes <= numberOfClasses`
MapDesign.prototype.jenksMatrices = function(tempVectorLayerClasses, numberOfClasses) {

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

    MapDesign.prototype.jenks = function(tempVectorLayerClasses, numberOfClasses) {

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

        console.log("kclass "+ kclass[0]);
        console.log("kclass "+ kclass[1]);
        console.log("kclass "+ kclass[2]);
        console.log("kclass "+ kclass[3]);
        console.log("kclass "+ kclass[4]);
        console.log("kclass "+ kclass[5]);

        return kclass;
    };

*/



MapDesign.prototype.calculateColorClass = function(vectorLayerClasses) {
    if(vectorLayerClasses == undefined) {
    	console.log("VectorlayerClasses is undefined, necessary in MD.calculateColorClass");
    	return;
    }
    if(vectorLayerClasses.length <= 0) {
    	console.log("VectorlayerClasses is empty, necessary in MD.calculateColorClass");
    	return;
    }
    var tempColorClasses = [];
    var classCount = vectorLayerClasses.length;
    for (var i = 0; i < classCount; i++) {
        tempColorClasses.push((i / classCount) * 360);
    }
    this.colorPerClass = tempColorClasses;
    return tempColorClasses;
}
