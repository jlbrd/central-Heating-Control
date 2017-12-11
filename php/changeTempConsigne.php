<?php
    require("connectDB.php");
    
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

foreach($request as $temp) {
    $sql = "UPDATE temperature SET valeur = " . $temp->valeur . " where id = " . $temp->id;
    $result = $link->query($sql)
        or die(mysql_error());        
}
mysqli_close($link);

?>