<?php
 session_start();
  if(!(isset($_SESSION['username']))){ header("location: proto-SideMenu.html");}
  $name= $_SESSION['username'];
?>


<!DOCTYPE html>
<html>
	<head>
	<meta charset="UTF-8">
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<link rel="stylesheet" type="text/css" href="proto.css">
	<!--<script src="reload.js"></script>  -->
	
		<link rel="stylesheet" href="https://openlayers.org/en/v4.2.0/css/ol.css" type="text/css">
		<!-- The line below is only needed for old environments like Internet Explorer and Android 4.x -->
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
		<script src="https://openlayers.org/en/v4.2.0/build/ol.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js"></script>
		<link rel="stylesheet" href="style.css"></script>
		<script src="map.js"></script>
		<!-- cite: https://www.gaiaresources.com.au/json-with-geoserver-and-leaflet/ -->
	<title>CGIS Map Production</title>
	</head>
<body>
	<div class="container-fluid">
	  <div class="row" style="border-bottom:1px solid white;">
		<div class="col-md-8"><h1>CGIS Map Production</h1></div>
		<div class="col-md-4" style="padding-top:20px;">
			<form class="form-inline" method="GET" action="logout.php">
				<div class="input-group">
				  <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
				
				</div>
				<div <div class="input-group">
				<p>
					 
					 <h3 style="color:black;">Logged in as : <b>   <?php echo "    ".$name."    " ;  ?>  </b> </h3>
				 </p>
				</div>
				<button type="submit" class="btn btn-default">log out</button>
			</form>
		</div>
	  </div>
	  </div>
	  <!--Side Menu-->
		<button id="menubutton" class="btn btn-default" onclick="openNav()"><span class="glyphicon glyphicon-menu-right" style="floa:left"></button>
		<div class="container-fluid">
			<div id="sideMenu" class="menu">
				<div class="title">
					<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
					<h2>Map Specifications</h2>
				</div>
				<div class="container-fluid">
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
							  <label for="dataset"><h3>Dataset:</h3></label>
							  <select class="form-control" id="dataset" onchange="changeDataset(this)">
								<option style="display:none" disabled selected value>Select a Dataset</option>
								<option id="op1" value="1"></option>
								<option>Dataset #2</option>
								<option>Dataset #3</option>
								<option>Dataset #4</option>
							  </select>
							</div>
							
							<form>
								<h3>Attribute Selection:</h3>
								<table class="table table">
									<thead class="tablehead">
										<th width="10px">Selected</th>
										<th>Attribute</th>
									</thead>
									<tbody id="tablebody">
									</tbody>
								</table>
								<button type="button" class="btn btn-success" onclick="getAtt()" style="float: right">Generate Maps</button>
								<br>
								<hr>
								<h3 id="blah">Thematic Map:</h3>
								<div class="btn-group">
								  <button id="b1" type="button" class="btn btn-info" style="width:150px" onclick="loadTMap(0)">Map#1</button>
								  <button id="b2" type="button" class="btn btn-info" style="width:150px" onclick="loadTMap(1)">Map#2</button>
								  <button id="b3" type="button" class="btn btn-info" style="width:150px" onclick="loadTMap(2)">Map#3</button>
								  <button id="b4" type="button" class="btn btn-info" style="width:150px" onclick="loadTMap(3)">Map#4</button>
								</div>
								<br>
								<br>
								<br>

								<h3>Download Map</h3>
								<button id="downloadbutton" type="button" class="btn btn-primary" style="width:150px" onclick="download()"><h3><span class="glyphicon glyphicon-download"></h3></a>
							</form>
							
						</div>
					</div>
				</div>
			</div>
			
			<div id="mapArea" class="col-md-12">
				<a class="skiplink" href="#map">Go to map</a>
				<div id="map" class="map" tabindex="0"></div>
				<script>
				  loadMap(-1);
				</script>
			</div>
			 <div id="legend">
        <img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=cite:censustractsum&STYLE=basicstyle9">
 </div>
			<br>
			<!--Javascript for sidemenu-->
			<script>
			function openNav() {
				document.getElementById("sideMenu").style.width = "750px";
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
			</script>
		</div>
	</body>
</html>