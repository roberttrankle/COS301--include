function loadMap(){
 // http://localhost:8080/geoserver
      // var geoJsonUrl = 'http://localhost:8080/geoserver/cite/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=cite:wards&outputFormat=text/javascript&format_options=callback:processJSON';



        // $.ajax(geoJsonUrl,
        // { dataType: “json” }
        // ).done(function ( data ) {
        // });

        //       function processJSON(data) {
        // }

     var vectorLayer = new ol.layer.Vector({
      title: 'wards',
      source: new ol.source.Vector({
         projection : 'EPSG:4326',
        url: 'http://127.0.0.1:8887/wardsGJ.geojson',
        format: new ol.format.GeoJSON()
      })
    });

       var hh = new ol.layer.Vector({
      title: 'hh',
      source: new ol.source.Vector({
         projection : 'EPSG:4326',
        url: 'http://127.0.0.1:8887/hhSampleGJ.geojson',
        format: new ol.format.GeoJSON()
      })
       ,style: new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [0.5, 40],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'marker-icon.png'
        }))
    })
    })

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
          center: [25.74, 28.22],
          zoom: 5
        })
      });

        map.addLayer(new ol.layer.Tile({source: new ol.source.OSM()}))
        map.addLayer(vectorLayer);
        map.addLayer(hh);

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