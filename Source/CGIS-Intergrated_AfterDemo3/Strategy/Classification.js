// document.write('<script type="text/javascript" src="Strategy/EqualInterval.js"></script>');
document.write('<script type="text/javascript" src="Strategy/NaturalBreaks.js"></script>');
document.write('<script type="text/javascript" src="Strategy/Quantile.js"></script>');


var Classification = function() {
    this.method = "";
};
 
Classification.prototype = {
    setMethod: function(method) {
        console.log(method+"set successfully!");
        this.method = method;
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

    execute: function(vectorSource, featureToDisplay, numberOfClasses) {
        return this.method.execute(vectorSource, featureToDisplay, numberOfClasses);
    },
 
    output: function() {
        return this.method.output();
    }
};






/*

function run() {
 
    // the 3 classification methods
    
    
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

  //  classification.addMethod('testing');
    var testing = new Testing();
    classification.setMethod(testing);

    alert("testing classification method: " + classification.output());
 
}*/

//run();

/*
function newClassification() {
    var classification = new Classification();
    classification.addMethod('testing');
}
*/