<?php
	require("connectDB.php");

	$sql = "DELETE FROM consigneManuelle";
	$result = $link->query($sql)
		or die(mysql_error());

	mysqli_close($link);
//DATE_ADD(NOW(), INTERVAL ".$duree." HOUR)
	//echo $valeur;
/*
$fp = fopen('/tmp/sql.log', 'w');
fwrite($fp, $sql);
fclose($fp);
*/

?>