var arr = [{"robertAdmin":"geoserver123"}, {"cianAdmin":"pineapples12"}];
function validateAdmin(){
	var aUsrme = document.forms["loginForm"]["adminUsername"].value;
	var aPass = document.forms["loginForm"]["adminPassword"].value;
	var count = 0;

	for(var i = 0; i < arr.length; i++)
	{
		for(key in arr[i])
		{
			if(key == aUsrme)
			{
				count++;
				var val = arr[i][key];
				if(val == aPass)
				{
					document.getElementById("login").style.display = "none";
				}
				else
				{

				}
			}
		}
	}
	if(count == 0)
	{
		
	}
}

