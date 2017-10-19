// <!--Javascript for sidemenu-->


/**
 * Opens a navigation.
 */
function openNav() {
    document.getElementById("sideMenu").style.width = "80%";
}

/**
 * Closes a navigation.
 */
function closeNav() {
    document.getElementById("sideMenu").style.width = "0";
}

/**
 * Opens a navigation 2.
 */
function openNav2() {
  document.getElementById("sideMenu2").style.width = "25%";
}

/**
 * Closes a navigation 2.
 */
function closeNav2() {
    console.log("closeNav2");
  document.getElementById("sideMenu2").style.width = "0";
 // $('.panel-collapse').collapse();
}

/**
 * Shows the navigation 2.
 */
function showNav2() {
  document.getElementById("menubutton2").style.display = "inline-block";
  document.getElementById("sideMenu2").style.width = "25%";

   /*document.getElementById("legend").style.right = "28%" ;*/
}


/**
 * Hides the navigation 2.
 */
function hideNav2() {
  document.getElementById("menubutton2").style.display = "none";
  document.getElementById("sideMenu2").style.width = "0%";
}


/**
 * Shows the map key.
 */
function showMapKey() {
  document.getElementById("sideMenu2").style.width = "0%";
  $('.panel-collapse').collapse("show");
  //$('.panel').collapse();
}


/**
 * Shows the meta data.
 */
function showMetaData(){
    document.getElementById("metaData").style.display = "inline-block";
}


/**
 * Hides the meta data.
 */
function hideMetaData(){
    document.getElementById("metaData").style.display = "none";
}


/**
 * Downloads a map.
 */
function downloadMap() {
    console.log("inside download");
    document.getElementById("sideMenu2").style.width = "0";
    $('.panel-collapse').collapse("show");
    document.getElementById("metaData").style.opacity = 1;
    convertToImage();
}


/**
 * Convert map to image
 */
function convertToImage() {
    html2canvas(document.getElementById("mapArea"), {
    onrendered: function(canvas) {
        return Canvas2Image.saveAsPNG(canvas);
        Canvas2Image.saveAsPNG(canvas);
        var image = Canvas2Image.convertToPNG(canvas);
        var image_data = $(image).attr('src');

        $.ajax({
            url: '../images',
            data: { image: image_data },
            success: function() {

            }
        });
    }
});
}


/**
 * Sets the number classes.
 */
function setNumClasses() {
    sessionStorage.setItem('numClasses', document.getElementById('numClasses').value);
}

/**
 * Sets the standard method.
 */
function setStdMethod() {
    sessionStorage.setItem('stdMethod', document.getElementById('standardization').value);
}


/**
 * Sets the map title.
 */
function setMapTitle() {
    sessionStorage.setItem('mapTitle', document.getElementById('mapTitle').value);
}




/**
 *	If discrete data then a few things have to be hidden on the appropriate pages 
 */
function checkDiscrete() {
    if (document.getElementById('discrete').checked) {
        $('#selectAttributeValues').css("display", "block");
        sessionStorage.setItem('isDiscrete', 'true');

    } else {
        $('#selectAttributeValues').css("display", "none");
        sessionStorage.setItem('isDiscrete', 'false');
    }
}


/**
 * If discrete data then a few things have to be hidden on p3
 */
function checkDiscrete_p3() {

    if (sessionStorage.getItem('isDiscrete') == 'true') {

        $('#standardization_select').css("display", "none");
        $('#numClasses_select').css("display", "none");

    } else if (sessionStorage.getItem('isDiscrete') == 'false') {

        $('#standardization_select').css("display", "block");
        $('#numClasses_select').css("display", "block");
    }

}


/**
 * If heat or choropleth map then a few things have to be hidden on the appropriate pages
 */
function checkHeatOrPropSym() {
    if (sessionStorage.getItem('mapTypeSelected') == '2') {
        //hide std, numClasses, classif
        $('#standardization_select').css("display", "none");
        $('#numClasses_select').css("display", "none");

    } else if (sessionStorage.getItem('mapTypeSelected') == '4') {
        //hide numClasses, classif
        $('#numClasses_select').css("display", "none");
    }
    else if ((sessionStorage.getItem('mapTypeSelected') != '2') && (sessionStorage.getItem('mapTypeSelected') != '4') && (sessionStorage.getItem('isDiscrete') == 'false')) {
        //unhide
        $('#standardization_select').css("display", "block");
        $('#numClasses_select').css("display", "block");
    }
}


/**
 * If discrete data then a few things have to be hidden on p4
 */
function checkDiscrete_p4() {
    document.getElementById("dynamicClassSelected").innerHTML = " " + sessionStorage.getItem('numClasses') + " Classes";
    if (sessionStorage.getItem('isDiscrete') == 'true') {
        $('#hiddenIfDiscrete1').css("display", "none");
        $('#hiddenIfDiscrete2').css("display", "none");
        $('#hiddenIfDiscrete3').css("display", "none");
        $('#hiddenIfDiscrete4').css("display", "none");

    } else if (sessionStorage.getItem('isDiscrete') == 'false') { //thus classification and numclasses should be shown/used
        
        if (sessionStorage.getItem('mapTypeSelected') == '2') {
            //hide classif
            $('#hiddenIfDiscrete1').css("display", "none");
            $('#hiddenIfDiscrete2').css("display", "none");
            $('#hiddenIfDiscrete3').css("display", "none");
            $('#hiddenIfDiscrete4').css("display", "none");

        } else if (sessionStorage.getItem('mapTypeSelected') == '4') {
            //hide classif
            $('#hiddenIfDiscrete1').css("display", "none");
            $('#hiddenIfDiscrete2').css("display", "none");
            $('#hiddenIfDiscrete3').css("display", "none");
            $('#hiddenIfDiscrete4').css("display", "none");
        }
        else if ((sessionStorage.getItem('mapTypeSelected') != '2') && (sessionStorage.getItem('mapTypeSelected') != '4') && (sessionStorage.getItem('isDiscrete') == 'false')) {
            //unhide
            $('#hiddenIfDiscrete1').css("display", "block");
            $('#hiddenIfDiscrete2').css("display", "block");
            $('#hiddenIfDiscrete3').css("display", "block");
            $('#hiddenIfDiscrete4').css("display", "block");
        }   
    }
}


/**
 * unhides meta data
 */
function unHideMeta() {
    document.getElementById("metaData").style.display = "block";
    document.getElementById("restartButton").style.display = "block";
}

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

/**
 * go next when click on next button
 */
$(".next").click(function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({ opacity: 0 }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')',
                'position': 'absolute'
            });
            next_fs.css({ 'left': left, 'opacity': opacity });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});


// $(".previous").click(function() {
//     if (animating) return false;
//     animating = true;

//     current_fs = $(this).parent();
//     previous_fs = $(this).parent().prev();

//     //de-activate current step on progressbar
//     $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

//     //show the previous fieldset
//     previous_fs.show();
//     //hide the current fieldset with style
//     current_fs.animate({ opacity: 0 }, {
//         step: function(now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale previous_fs from 80% to 100%
//             scale = 0.8 + (1 - now) * 0.2;
//             //2. take current_fs to the right(50%) - from 0%
//             left = ((1 - now) * 50) + "%";
//             //3. increase opacity of previous_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({ 'left': left });
//             previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
//         },
//         duration: 800,
//         complete: function() {
//             current_fs.hide();
//             animating = false;
//         },
//         //this comes from the custom easing plugin
//         easing: 'easeInOutBack'
//     });
// });

/**
 * submit button
 */
$(".submit").click(function() {
    return false;
})

/*
*   Used if a map is selected on the page 2 of the side menu.
*/
$('.images_list li').click(function() {
    $('.images_list .selected').removeClass('selected');
    $(this).toggleClass('selected');
    var currentID = $(this).attr('title');
    if ((currentID != 'HeatMap') && (currentID != 'ProportionalSymbol')) {
        document.getElementById("hiddenIfHeatOrProp1").style.visibility = "visible";
        document.getElementById("hiddenIfHeatOrProp1").style.display = "block";
        document.getElementById("hiddenIfHeatOrProp2").style.visibility = "visible";
        document.getElementById("hiddenIfHeatOrProp2").style.display = "block";
    }
    
    if (currentID == 'DotDensity') {
        sessionStorage.setItem('mapTypeSelected', "1");
    }
    if (currentID == 'HeatMap') {
        sessionStorage.setItem('mapTypeSelected', "2");
        document.getElementById("hiddenIfHeatOrProp1").style.visibility = "hidden";
        document.getElementById("hiddenIfHeatOrProp1").style.display = "none";
        document.getElementById("hiddenIfHeatOrProp2").style.visibility = "hidden";
        document.getElementById("hiddenIfHeatOrProp2").style.display = "none";
    }
    if (currentID == 'Choropleth') {
        sessionStorage.setItem('mapTypeSelected', "3");
    }
    if (currentID == 'ProportionalSymbol') {
        sessionStorage.setItem('mapTypeSelected', "4");
        document.getElementById("hiddenIfHeatOrProp1").style.visibility = "hidden";
        document.getElementById("hiddenIfHeatOrProp1").style.display = "none";
        document.getElementById("hiddenIfHeatOrProp2").style.visibility = "hidden";
        document.getElementById("hiddenIfHeatOrProp2").style.display = "none";
    }
    var clicked = $(this).attr('title');
    $("#" + clicked).removeClass("hidden").siblings().addClass("hidden");
});

/*
*   Used if a map is selected on the page 3 of the side menu.
*/
$('.images_list2 li').click(function() {
    $('.images_list2 .selected').removeClass('selected');
    $(this).toggleClass('selected');
    var currentID = $(this).attr('id');
    if (currentID == 'cs1') {
        sessionStorage.setItem("colorMap", "cs1");
        sessionStorage.setItem('colorSchemeSelected', "0");
    }
    if (currentID == 'cs2') {
        sessionStorage.setItem("colorMap", "cs2");
        sessionStorage.setItem('colorSchemeSelected', "1");
    }
    if (currentID == 'cs3') {
        sessionStorage.setItem("colorMap", "cs3");
        sessionStorage.setItem('colorSchemeSelected', "2");
    }
    if (currentID == 'cs4') {
        sessionStorage.setItem("colorMap", "cs4");
        sessionStorage.setItem('colorSchemeSelected', "3");
    }
    if (currentID == 'cs5') {
        sessionStorage.setItem("colorMap", "cs5");
        sessionStorage.setItem('colorSchemeSelected', "4");
    }
    if (currentID == 'cs6') {
        sessionStorage.setItem("colorMap", "cs6");
        sessionStorage.setItem('colorSchemeSelected', "5");
    }
    var clicked = $(this).attr('id');
    $("#" + clicked).removeClass("hidden").siblings().addClass("hidden");
});

/*
*   Used if a map is selected on the page 4 of the side menu.
*/
$('.images_list3 li').click(function() {
    $('.images_list3 .selected').removeClass('selected');
    $(this).toggleClass('selected');
    var currentID = $(this).attr('id');
    if (currentID == 'cc1') {
        sessionStorage.setItem('classificationAndClassSelected', "0");
        sessionStorage.setItem('finalMapNumberOfClasses', sessionStorage.getItem('numClasses'));
        sessionStorage.setItem('classification', "EQUALINTERVAL");
    }
    if (currentID == 'cc2') {
        sessionStorage.setItem('classificationAndClassSelected', "1");
        sessionStorage.setItem('finalMapNumberOfClasses', "5");
        sessionStorage.setItem('classification', "EQUALINTERVAL");
    }
    if (currentID == 'cc3') {
        sessionStorage.setItem('classificationAndClassSelected', "2");
        sessionStorage.setItem('finalMapNumberOfClasses', "7");
        sessionStorage.setItem('classification', "EQUALINTERVAL");
    }
    if (currentID == 'cc4') {
        sessionStorage.setItem('classificationAndClassSelected', "3");
        sessionStorage.setItem('finalMapNumberOfClasses', sessionStorage.getItem('numClasses'));
        sessionStorage.setItem('classification', "QUANTILE");
    }
    if (currentID == 'cc5') {
        sessionStorage.setItem('classificationAndClassSelected', "4");
        sessionStorage.setItem('finalMapNumberOfClasses', "5");
        sessionStorage.setItem('classification', "QUANTILE");
    }
    if (currentID == 'cc6') {
        sessionStorage.setItem('classificationAndClassSelected', "5");
        sessionStorage.setItem('finalMapNumberOfClasses', "7");
        sessionStorage.setItem('classification', "QUANTILE");
    }
    if (currentID == 'cc7') {
        sessionStorage.setItem('classificationAndClassSelected', "6");
        sessionStorage.setItem('finalMapNumberOfClasses', sessionStorage.getItem('numClasses'));
        sessionStorage.setItem('classification', "NATURALBREAKS");
    }
    if (currentID == 'cc8') {
        sessionStorage.setItem('classificationAndClassSelected', "7");
        sessionStorage.setItem('finalMapNumberOfClasses', "5");
        sessionStorage.setItem('classification', "NATURALBREAKS");
    }
    if (currentID == 'cc9') {
        sessionStorage.setItem('classificationAndClassSelected', "8");
        sessionStorage.setItem('finalMapNumberOfClasses', "7");
        sessionStorage.setItem('classification', "NATURALBREAKS");
    }
    var clicked = $(this).attr('id');
    $("#" + clicked).removeClass("hidden").siblings().addClass("hidden");
});

/**
 * fieldset1 enable next button when appropriate
 */
$(document).ready(function(){
   $("#fieldset1").change(function(e) {
    
    var selectedAttr = $('#attr').find(":selected").val();
    var selectedAttrValue = $('#attrValue').find(":selected").val();
    var selectedBoundary = $('#boundary').find(":selected").val();

    console.log("selectedAttrValue = " + selectedAttrValue);

    if ((document.getElementById("discrete").checked) && (selectedAttrValue == "1")){
        $("#next1").attr("disabled", true);  
    }
    if ((document.getElementById("discrete").checked == false) && (document.getElementById("continuous").checked ==  false) || (selectedAttr == "1") || (selectedBoundary == "1")) { 
      $("#next1").attr("disabled", true);       
    } else if ((selectedAttr != "1") && (document.getElementById("continuous").checked) && (selectedBoundary != "1")) {
      $("#next1").removeAttr("disabled");
    } else if ((selectedBoundary != "1") && (selectedAttrValue != "1")) {
      $("#next1").removeAttr("disabled");
   }
  });
})


/**
 * check if attribute value has been chosen then enable next button
 */
function checkAttValue() {
    var selectedAttrValue = $('#attrValue').find(":selected").val();
    var selectedBoundary = $('#boundary').find(":selected").val();
    console.log("checkAttValue selectedAttrValue = " + selectedAttrValue);
    if (selectedBoundary != "1") {
        if (selectedAttrValue != "1") {
            $("#next1").removeAttr("disabled");
        }
    }
}


/**
 * fieldset2 enable next button where appropriate
 */
$(document).ready(function(){
   $(".images_list li").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.value == "1" || this.value == "2" || this.value == "3" || this.value == "4"){
      $('#next2').removeAttr('disabled');
    };
  });
})

/**
 * fieldset3 enable next button where appropriate
 */
$(document).ready(function(){
   $(".images_list2 li").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.value == "1" || this.value == "2" || this.value == "3" || this.value == "4" || this.value == "5" || this.value == "6"){
      $('#next3').removeAttr('disabled');
    };
  });
})

/**
 * fieldset4 enable next button where appropriate
 */
$(document).ready(function(){
   $(".images_list3 li").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.value == "1" || this.value == "2" || this.value == "3" || this.value == "4" || this.value == "5" || this.value == "6" || this.value == "7" || this.value == "8" || this.value == "9"){
      $('#generateMap').removeAttr('disabled');
    };
  });
})