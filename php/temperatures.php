<?php
	require("connectDB.php");
    

$sql = "SELECT id, menu, couleur, valeur, libelle FROM temperature";

$result = $link->query($sql);
$rows = array();
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

print json_encode($rows);

?>