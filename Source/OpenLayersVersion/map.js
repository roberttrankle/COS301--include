function loadMap(){
    var mapDisplayType = 2; // 0=markers(dotdensity), 1=heatmap 2=
    var featureToDisplay =  'ha_dwellin';
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: function(extent) {
        return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
            'version=1.1.0&request=GetFeature&typename=Given:copc_households&' +
            'outputFormat=application/json&srsname=EPSG:4326&maxFeatures=200&' +
            'bbox=' + extent.join(',') + ',EPSG:4326';
      },
      strategy: ol.loadingstrategy.bbox
    });
    console.log(vectorSource);
    if(mapDisplayType == 0) {
       var fill = new ol.style.Fill({
         color: 'rgb(15,35,68),1)'
       });
       var stroke = new ol.style.Stroke({
         color: '#0f2344',
         width: 1.25
       });
      var featureLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
         image: new ol.style.Circle({
           fill: fill,
           stroke: stroke,
           radius: 5
         }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 1.0)',
            width: 2
          })
        })
      });
    } else if (mapDisplayType == 1) {
        //currently only instance based, not variable based
        var featureLayer = new ol.layer.Heatmap({
          source: vectorSource,
          opacity: 0.85
        });
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
                  return [new ol.style.Style({
                      text: new ol.style.Text({
                          font: fontSize + 'px sans-serif,helvetica',
                          text: feature.get(featureToDisplay),
                          fill: new ol.style.Fill({
                              color: '#'+Math.floor(Math.random()*16777215).toString(16)
                          })
                      })
                  })];
              };  

               var featureLayer = new ol.layer.Vector({
                source: vectorSource,
                style: customStyleFunction
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
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.6)',
          width: 1
        })
      })
    });

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
        // map.addLayer(canvasLayer);
        

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
