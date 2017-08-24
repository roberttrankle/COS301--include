document.write('<script type="text/javascript" src="equalInterval.js"></script>');
document.write('<script type="text/javascript" src="naturalBreaks.js"></script>');
document.write('<script type="text/javascript" src="quantile.js"></script>');


var Classification = function() {
    this.method = "";
    this.numberOfClasses = "";
    this.vectorSource = [];
};
 
Classification.prototype = {
    setMethod: function(method, vectorSource) {
        this.method = method;
        this.vectorSource = vectorSource;

        console.log(method+" set successfully");
    },

    addMethod: function(method){
        var script = document.createElement('script');
        script.src = method+'.js';
       // script.onload = function () {
            //do stuff with the script
        //};

        document.head.appendChild(script); 

    alert(method+' has been successfully added');
    },

    get: function(method, vectorSource, attributeTitle, numberOfClasses){
        if(method == "equalInterval"){
            console.log("Inside get"+method);
            var equal_Interval = new EqualInterval();
            var array = equal_Interval.output(vectorSource, attributeTitle, numberOfClasses);
            return array;
        }
    },
 
    output: function() {
        return this.method.output();
    }
};


/* 
var EqualInterval = function() {
    this.output = function() {
        // calculations...
        return "I am Equal Interval";
    }
};
 
var NaturalBreaks = function() {
    this.output = function() {
        // calculations...
        return "I am Natural Breaks";
    }
};
 
var Quantile = function() {
    this.output = function() {
        // calculations...
        return "I an Quantile";
    }
};

*/

function run() {
 
    // the 3 classification methods
    
  /*
  			adding new classification methods to a list
  */
    
    var equal_Interval = new EqualInterval();
    var natural_Breaks = new NaturalBreaks();
    var quantile = new Quantile();
     
    var classification = new Classification();
 
    classification.setMethod(equal_Interval);
    alert("equal_Interval classification method: " + classification.output());
    console.log("outputting: "+quantile.output());
    
    classification.setMethod(natural_Breaks);
   alert("natural_Breaks classification method: " + classification.output());
   
    classification.setMethod(quantile);
    alert("Quantile classification method: " + classification.output());

  //  classification.addMethod('testing');
    var testing = new Testing();
    classification.setMethod(testing);

    alert("testing classification method: " + classification.output());
 
}

//run();


function newClassification() {
    var classification = new Classification();
    classification.addMethod('testing');
}