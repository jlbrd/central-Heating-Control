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
//DATE_ADD(NOW(), INTERVAL ".$duree." HOUR)
	//echo $valeur;
/*
$fp = fopen('c:\sql.log', 'w');
fwrite($fp, $sql);
fclose($fp);
*/

?>