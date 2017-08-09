document.write('<script type="text/javascript" src="equalInterval.js"></script>');
document.write('<script type="text/javascript" src="naturalBreaks.js"></script>');
document.write('<script type="text/javascript" src="Quantile.js"></script>');

var Classification = function() {
    this.method = "";
};
 
Classification.prototype = {
    setMethod: function(method) {
        this.method = method;
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
    
    classification.setMethod(natural_Breaks);
   alert("natural_Breaks classification method: " + classification.output());
   
    classification.setMethod(quantile);
    alert("Quantile classification method: " + classification.output());
 
    log.show();
}

//run();
