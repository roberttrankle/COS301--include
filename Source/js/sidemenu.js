// <!--Javascript for sidemenu-->

/**
 * Shows the login.
 */
function showLogin(){
    document.getElementById("adminLogin").style.display = "none";
    document.getElementById("login").style.visibility = "visible";
  }
   
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
 * download map to PNG
 */
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