//Concrete Creator
function DotDensityCreator(){
    this.vectorClasses = [];
};

DotDensityCreator.prototype = Object.create(MapCreator.prototype);
DotDensityCreator.prototype.constructor = DotDensityCreator;

DotDensityCreator.prototype.createMap = function(map, vectorSource, colorPerClass, featureToDisplay, featureLayer){
    var VC = [];
	var vectorStyleFunction = function(feature, resolution) {
        var hue = 0;
        if (VC != undefined)
        {
            if (VC.indexOf(feature.get(featureToDisplay)) != -1) {
                hue = colorPerClass[VC.indexOf(feature.get(featureToDisplay))];
            }
            else {
                VC.push(feature.get(featureToDisplay));
            }

        }
        else {
                VC.push(feature.get(featureToDisplay));
        }
       
       /* if(tC == 0)
        {
            for(var i = 0; i < colorPerClass.length; i++)//This is for the legend.
            {
                document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                    "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"hsla(" + colorPerClass[i] + ", 100%, 47%, 0.6)\" />"
                    + "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + vectorLayerClasses[i] + "</text> </svg><hr>";
            }
            tC++;
        }*/

        var fill = new ol.style.Fill({
            color: 'hsla(' + hue + ', 100%, 47%, 0.6)'
        });
        
        return [new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                radius: 5
            })
        })];
    };

    featureLayer.layer = new ol.layer.Vector({
        source: vectorSource,
        style: vectorStyleFunction
    });
    
    map.addLayer(featureLayer.layer);
};

function DotDensityDesign(map) {
	this.map = map;
};

DotDensityDesign.prototype = Object.create(MapDesign.prototype);
DotDensityDesign.prototype.constructor = DotDensityDesign;
