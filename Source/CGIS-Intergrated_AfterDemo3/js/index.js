// <!--Javascript for sidemenu-->

window.onload=function() {
	document.getElementById("login").style.visibility = "hidden";
}

function showLogin(){
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("login").style.visibility = "visible";
  }
      
function openNav() {
  document.getElementById("sideMenu").style.width = "80%";
}

function closeNav() {
  document.getElementById("sideMenu").style.width = "0";
}

function download(){
	
}

function convertToImage(mapValue){
	html2canvas(document.getElementById("mapArea"), {
		onrendered: function(canvas) {
			var image = Canvas2Image.convertToPNG(canvas);
			var image_data = $(image).attr('src');
			sessionStorage.setItem('wizardMap1', image_data);
			//document.getElementById('legend').innerHTML = '<img src="'+ image_data +'" />'; 
			//       $.ajax({
			// url: '../images',
			// data:{ image: image_data},
			// success: function(){

			// }
		}
	});
}

function showPic() {
  //document.getElementById('legend').innerHTML = '<img src=\"' + localStorage.getItem('test') +" style="width:100px; height:100px;" />'; 
}

//------------------------------------------------------------------------------------

function checkDiscrete() {
		console.log("checkDiscrete() outside if");
	if (document.getElementById('discrete').checked) {
		console.log("checkDiscrete() .check = true");
		$('#selectAttributeValues').css("visibility", "visible");
		

		// document.getElementById('selectAttributeValues').visibility = 'visible';
		// "<h2 class = \"fs-title\">Select Attribute Value</h2> <select class = \"form-control\" id = \"attrValue\" <option style = \"display:none\" disabled selected value = \"1\">Select the Attribute Value</option><br>\"</select>"
   	} else {
   		$('#selectAttributeValues').css("visibility", "hidden");
   	}
}

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({
        'transform': 'scale('+scale+')',
        'position': 'absolute'
      });
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	return false;
})

$('.images_list li').click(function() {
	$('.images_list .selected').removeClass('selected');
	$(this).toggleClass('selected');
	var clicked = $(this).attr('title');
	$("#"+clicked).removeClass("hidden").siblings().addClass("hidden");
});