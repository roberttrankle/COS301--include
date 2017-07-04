function loadMap(){
 // http://localhost:8080/geoserver
      // var geoJsonUrl = 'http://localhost:8080/geoserver/cite/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:wards&outputFormat=text/javascript&format_options=callback:processJSON';



        // $.ajax(geoJsonUrl,
        // { dataType: “json” }
        // ).done(function ( data ) {
        // });

        //       function processJSON(data) {
        // }

    //  var vectorLayer = new ol.layer.Vector({
    //   title: 'wards',
    //   source: new ol.source.Vector({
    //      projection : 'EPSG:4326',
    //     url: 'http://127.0.0.1:8887/wards.geojson',
    //     format: new ol.format.GeoJSON()
    //   })
    // });

    //    var hh = new ol.layer.Vector({
    //   title: 'hh',
    //   source: new ol.source.Vector({
    //      projection : 'EPSG:4326',
    //     url: 'http://127.0.0.1:8887/households.geojson',
    //     format: new ol.format.GeoJSON()
    //   })
    //    ,style: new ol.style.Style({
    //     image: new ol.style.Icon(({
    //         anchor: [0.5, 40],
    //         anchorXUnits: 'fraction',
    //         anchorYUnits: 'pixels',
    //         src: 'marker-icon.png'
    //     }))
    // })
    // })
    
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


    var vector = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 40],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'marker-icon.png'
        })),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2
        })
      })
    });

    var vectorSource2 = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
          return 'http://localhost:8080/geoserver/wfs?service=WFS&' +
              'version=1.1.0&request=GetFeature&typename=Given:electoralwardsfortsh&' +
              'outputFormat=application/json&srsname=EPSG:4326&' +
              'bbox=' + extent.join(',') + ',EPSG:4326';
        },
        strategy: ol.loadingstrategy.bbox
    });


    var vector2 = new ol.layer.Vector({
      source: vectorSource2,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2
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
          center: [25.74, -28.22],
          zoom: 5
        })
      });

        map.addLayer(new ol.layer.Tile({source: new ol.source.OSM()}));
        map.addLayer(vector);
        map.addLayer(vector2);

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