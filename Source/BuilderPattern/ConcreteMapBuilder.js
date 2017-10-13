/**
 * concrete class for the Builder method 
 *
 */
function ConcreteMapBuilder() {
    //var ConcreteMapBuilder = function(){
    //Call parent constructor explicitly


    MapBuilder.call(this);
    console.log("ConcreteMapBuilder constructor");


    //Now we ensure that the methods from the parent class are available to the child class.
    //Should maybe be outside constructor


    ConcreteMapBuilder.prototype = Object.create(MapBuilder.prototype);
    ConcreteMapBuilder.prototype.constructor = ConcreteMapBuilder;

}

/**
 * Builds the heading for the map
 *
 */
ConcreteMapBuilder.prototype.buildMapHeading = function() {
    // var heading = document.getElementById("mapTitle").value;
    var heading = sessionStorage.getItem('mapTitle');
    document.getElementById("heading").innerHTML = heading;
    document.getElementById("meta_title").innerHTML = heading;
    /*  document.getElementById("meta_titleMap").innerHTML = "Title: "+heading;*/

    return heading;
};

/**
 * Builds the map legend
 * 
 * @param      {number}     numberOfClasses    The number of classes
 * @param      {array}      colorPerClass     The colors per class
 * @param      {array}     vectorLayerClasses       The vector layer classes
 * @param      {number}     selectedValue           The selected value
 */
ConcreteMapBuilder.prototype.buildMapLegend = function(numberOfClasses, colorPerClass, vectorLayerClasses, selectedValue) {
    document.getElementById("mapKey").innerHTML = "";
    if (sessionStorage.getItem('isDiscrete') == 'true') {
        for (var p = 0; p < numberOfClasses; p++) {
            hue = colorPerClass[p];
            console.log(hue);
            if (vectorLayerClasses[p] == selectedValue) {
                console.log(hue);
                document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                    "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"hsla(" + hue[0] + ", " + hue[1] + "%," + hue[2] + "%, 0.6)\" />" +
                    "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + vectorLayerClasses[p] + "</text> </svg><hr>";
            }

        }
    } else {
        for (var p = 0; p < numberOfClasses; p++) {
            hue = colorPerClass[p];
            document.getElementById("mapKey").innerHTML += "<svg height=\"50\" width=\"200\">" +
                "<circle cx=\"25\" cy=\"25\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"hsla(" + hue[0] + ", " + hue[1] + "%," + hue[2] + "%, 0.6)\" />" +
                "<text x=\"60\" y=\"30\" fill=\"black\" font-size=\"14\">" + vectorLayerClasses[p] + "</text> </svg><hr>";
        }
    }

};

/**
 * Creates the map scale
 * 
 */
// ConcreteMapBuilder.prototype.buildMapScale = function(map) {
//     console.log("buildMapScale");

//     //var scaleline = new ol.control.ScaleLine();
//     //map.addControl(scaleline);

// };

/**
 * Builds the north arrow
 * 
 * @param      {number}     numberOfClasses    The number of classes
 * @param      {array}      colorPerClass     The colors per class
 * @param      {array}     vectorLayerClasses       The vector layer classes
 * @param      {number}     selectedValue           The selected value
 */

ConcreteMapBuilder.prototype.buildMapNorthArrow = function() {
    console.log("buildMapNorthArrow");

    var img = document.createElement("img");
    img.src = "BuilderPattern/north_image.jpg";
    img.style.width = 15 + "%";
    img.style.height = 15 + "%";

    var arrowDiv = document.getElementById("imageDiv");
    document.getElementById("imageDiv").innerHTML = "";
    arrowDiv.appendChild(img);

};

/**
 * Builds the meta data
 * 
 */
ConcreteMapBuilder.prototype.buildMapMetaData = function() {
    console.log("buildMapMetaData");

    var date = new Date().toDateString();

    var d = new Date(),
        h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
        m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var time = h + ':' + m;

    var author = "CGIS";
    var coordinateSystem = "CGS WGS 1984";
    // var datum = "WGS 1984";
    var units = "Degree";

    var metaData = { date: date, time: time, author: "CGIS", coordinateSystem: "CGS WGS 1984", datum: "WGS 1984", units: "Degree" };

    document.getElementById("meta_date").innerHTML = "<span class='glyphicon glyphicon-calendar ' style='color:white'></span> Date - " + metaData.date;
    document.getElementById("meta_time").innerHTML = "<span class='glyphicon glyphicon-time ' style='color:white'></span> Time - " + metaData.time;
    document.getElementById("meta_author").innerHTML = "<span class='glyphicon glyphicon-user ' style='color:white'></span> Author - " + metaData.author;
    document.getElementById("meta_coordinate_sys").innerHTML = "<span class='glyphicon glyphicon-map-marker ' style='color:white'></span> Coordinate System - " + metaData.coordinateSystem;
    document.getElementById("meta_datum").innerHTML = "<span class='glyphicon glyphicon-globe ' style='color:white'></span> Datum - " + metaData.datum;
    document.getElementById("meta_units").innerHTML = "<span class='glyphicon glyphicon-scale ' style='color:white'></span> Units - " + metaData.units;

    document.getElementById("meta_dateMap").innerHTML = "Date - " + metaData.date;
    document.getElementById("meta_timeMap").innerHTML = "Time - " + metaData.time;
    document.getElementById("meta_authorMap").innerHTML = "Author - " + metaData.author;
    document.getElementById("meta_coordinate_sysMap").innerHTML = "Coordinate System - " + metaData.coordinateSystem;
    document.getElementById("meta_datumMap").innerHTML = "Datum - " + metaData.datum;
    document.getElementById("meta_unitsMap").innerHTML = "Units - " + metaData.units;

    return metaData;
};