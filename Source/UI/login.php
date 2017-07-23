 <?php
 session_start();
      $localhost = "localhost"; //$localhost = "localhost"; // 
      $username = "root"; //$username = "root"; // 
      $password = ""; //$password = ""; //
      $db = "CGIS_db";  //$db = "dbUser";

      $connection = mysqli_connect($localhost , $username,$password,$db);

        if(!$connection){
        die("Connection failed: ". mysqli_connect_error());
      }

              if ($_POST){
                $username = $_POST["username"];
                $pass = $_POST["password"]; 
                $LoginQ = "SELECT * FROM tbl_users WHERE username = '$username' AND password ='$pass'"; 
                
                if($login = mysqli_query($connection,$LoginQ))
                {
                  if(mysqli_num_rows($login) > 0)
                  {
                    if($row = mysqli_fetch_assoc($login))
                    {
                      $_SESSION['username'] = $row['username'];                     
                      header("location: proto-SideMenu2.php");
                    }
                  }
                  else
                  {
                    $query = "INSERT INTO tbl_users VALUES ('','$username' ,'$pass')";
                    $register = mysqli_query($connection,$query);
                    if ($register){
                      echo "successfully added";
                      $_SESSION['username'] = $username;
                      header("location: proto-SideMenu2.php");

                    }
                    else {
                      echo "unsuccessfully added";
                      header("location: proto-SideMenu.html");
                    }
                  }
              }
            }
                mysqli_close($connection);
?>