function loadMap(){
  // Detect or let user specify whether requested feature to display is continuous or discrete

//SHould the client receive all the features (to quickly display different feature layers) or select ones and only receive those.
//  For the latter : https://openlayers.org/en/latest/examples/vector-wfs-getfeature.html
    var mapDisplayType = 2; // 0=markers(dotdensity), 1=heatmap 2=
    var isLayerDiscrete = [];
    var vectorLayerClasses = [];
    var colorPerClass = [];


    isLayerDiscrete.push(true);
    var featureToDisplay =  'ha_dwellin';
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: function(extent) {
        return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
            'version=1.1.0&request=GetFeature&typename=Given:copc_households&' +
            'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=100&' +
            'bbox=' + extent.join(',') + ',EPSG:4326';
      },
      strategy: ol.loadingstrategy.bbox
    });
    if(isLayerDiscrete[0] == true) {
      vectorSource.on('change', function(evt){
        var source = evt.target;
        if (source.getState() === 'ready') {
          vectorSource.forEachFeature(function(feature) {
            if(vectorLayerClasses.indexOf(feature.get(featureToDisplay)) == -1) {
              vectorLayerClasses.push(feature.get(featureToDisplay));
            }
            
          });

          var vectorClassCount = vectorLayerClasses.length;
          console.log(vectorClassCount);
          for (var i = 0; i < vectorClassCount; i++) {
            colorPerClass.push((i / vectorClassCount) * 360); 
          }

          // for (var i = 0; i < vectorClassCount; i++) {
            // console.log("Class:" +  vectorLayerClasses[i] + " hue: " + colorPerClass[i]  ); //'hsla('+hue+', 100%, 47%, 1)'
          // }

        }
      });         
    }

        var wardsSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
          return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
              'version=1.1.0&request=GetFeature&typename=Given:electoralwardsfortsh&' +
              'outputFormat=application/json&srsname=EPSG:4326&' +
              'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });


    var wardsVectorLayer = new ol.layer.Vector({
      source: wardsSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({//////////////////////////////////////////////////////
                        color: 'rgba(0, 0, 0, 0.05)'
                    }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.6)',
          width: 1
        })
      })
    });

    if(mapDisplayType == 0) {
      var vectorStyleFunction = function(feature, resolution) {
        // var fontSize = '18';
        if(resolution>=39134) {
            // fontSize = '10';
        } else if(resolution>=9782) {
            // fontSize = '14';
        } else if(resolution>=2444) {
            // fontSize = '16';
        }
        var hue = 0;
        if(vectorLayerClasses.indexOf(feature.get(featureToDisplay)) != -1) {
          hue = colorPerClass[vectorLayerClasses.indexOf(feature.get(featureToDisplay))];
        }
        var fill = new ol.style.Fill({
          color: 'hsla('+hue+', 100%, 47%, 0.6)'
        });

        return [new ol.style.Style({
           image: new ol.style.Circle({
           fill: fill,
           radius: 5
          })
        })];
      }; 

       
      var featureLayer = new ol.layer.Vector({
        source: vectorSource,
        style: vectorStyleFunction
      });
    } else if (mapDisplayType == 1) {
        //currently only instance based, not variable based
        var featureLayer = new ol.layer.Heatmap({
          source: vectorSource,
          opacity: 0.85
        });

      } else if(mapDisplayType == 2) {/////////////////////////////////////////////
 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[INSERT ONCHANGE TO WAIT TILL FEATURES ARE LOADED]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
        var featureLayer = new ol.layer.Vector({
          source: vectorSource,
            style: new ol.style.Style({
              visible: false
            })
        }); //TODO: set visible = false


        //GetDropDownValueOfSelectedClassValue. The dropdown set visible and populated with vectorLayerClasses[]
        //The user has to select the value for this option




        // Credit: https://stackoverflow.com/questions/25924762/is-it-possible-to-identify-all-the-feature-layer-inside-of-other-layer
        //Find pointfeatues which intersect with geometric boundries
        var selectedClass = "Well Maintained";
        //This is the amount of classes ranges in which the count of the selected deature is displayed. 
        var amountOfColorClasses = 5; // This is specified by the user or AI
        if (isLayerDiscrete == true) {
          var pointFeatures = featureLayer.features;
          var boundriesGeometry = wardsVectorLayer.features;


          console.log("WardFeatureCount=" + boundriesGeometry.length);
          var countOfClassPerWard;
          var countPerWard = [];
          var colorsPerWard = []; //hue that determines color. Range 0-360
          for (var k = 0; k < vectorLayerClasses.length; k++) {
            colorsPerWard.push(0);
            countPerWard.push(0);
          }



          var maxClassCountOfWard = -1;
          var minClassCountOfWard = Number.POSITIVE_INFINITY;
          for (var i=0; i < boundriesGeometry.length; i++){
            countOfClassPerWard = 0;
            for (var j=0; j < pointFeatures.length; j++){
              if(boundriesGeometry.feature[i].geometry.intersects(pointFeatures.feature[j].geometry)){
                if ( (feature[j].get(featureToDisplay) ).localeCompare(selectedClass) == 0) {
                  ++countOfClassPerWard;   
                }
              }
            }
            if (countOfClassPerWard < minClassCountOfWard) {
              minClassCountOfWard = countOfClassPerWard;
            }
            if (countOfClassPerWard > maxClassCountOfWard) {
              maxClassCountOfWard = countOfClassPerWard;
            }
            countPerWard[i] = countOfClassPerWard; 
          }
        }
        if (maxClassCountOfWard > 0) {
          var currentColorFraction = 0;

          //Upper limit for each class, where class 0's minimum = minClassCountOfWard;
          var classRangeMax = [];
          var currentHue = 0;
          for (var i = 0; i < amountOfColorClasses; i++) {
            classRangeMax.push( min + (currentColorFraction * maxClassCountOfWard - min));  
            currentColorFraction += 1 / amountOfColorClasses;
          }
          for (var i = 0; i < boundriesGeometry.length; i++) {
            for (var j = 0; j < amountOfColorClasses; j++) {
              if(countPerWard[i] <= classRangeMax[j]) {
                colorPerWard[i] = j /amountOfColorClasses * 360;
                var wardFill = new ol.style.Fill({
                  color: 'hsla('+hue+', 100%, 47%, 0.6)'
                });
                var wardStyle = new ol.style.Style({
                   fill: wardFill,
                   visible: true
                });
                boundriesGeometry.feature[i].setStyle(wardStyle);


                wardsVectorLayer.drawFeature(boundriesGeometry.feature[i]);
              }
            }
           //rerender
            // classRangeMax.push(min + (currentColorFraction * maxClassCountOfWard)  
          }
        } else { 
          //snackbarError , maybe user spelt classValue wrong
        }        

        


      } else {
           var customStyleFunction = function(feature, resolution) {
                  var fontSize = '18';
                  if(resolution>=39134) {
                      fontSize = '10';
                  } else if(resolution>=9782) {
                      fontSize = '14';
                  } else if(resolution>=2444) {
                      fontSize = '16';
                  }
                  var hue = 0;
                  if(vectorLayerClasses.indexOf(feature.get(featureToDisplay)) != -1) {
                      hue = colorPerClass[vectorLayerClasses.indexOf(feature.get(featureToDisplay))];
                  }
                  return [new ol.style.Style({
                      text: new ol.style.Text({
                          font: fontSize + 'px sans-serif,helvetica',
                          text: feature.get(featureToDisplay),
                          fill: new ol.style.Fill({
                              color: 'hsla('+hue+', 100%, 47%, 0.6)'
                          })
                      })
                  })];
              };  

               var featureLayer = new ol.layer.Vector({
                source: vectorSource,
                style: customStyleFunction
            });
    }


  var map = new ol.Map({
        layers: [],
        target: 'map',
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }),
        view: new ol.View({
          projection: 'EPSG:4326',
          center: [28.5, -25.69],
          zoom: 10
        })
      });

        map.addLayer(new ol.layer.Tile({source: new ol.source.OSM()}));
        map.addLayer(wardsVectorLayer);
        map.addLayer(featureLayer);     

        //add http://plnkr.co/edit/GvdVNE?p=preview

      document.getElementById('zoom-out').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom - 1);
      };

      document.getElementById('zoom-in').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
      };
}
