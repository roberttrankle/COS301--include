<?php
	if(isset($_SESSION['username'])){
		session_destroy();
		echo "logging out";
		header("location: proto-SideMenu.html");
	}
	header("location: proto-SideMenu.html");
?>