// <!--Javascript for sidemenu-->
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
  map.once('postcompose', function(event) {
    var canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
     navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function(blob) {
        saveAs(blob, 'map.png');
      });
    }
  });
  map.renderSync();
}