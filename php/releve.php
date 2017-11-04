<?php
	require("connectDB.php");
    

$sql = "SELECT dateCreation, valeur, exterieur, relai FROM releve ORDER BY dateCreation DESC LIMIT 1";

$result = $link->query($sql);
$row = mysqli_fetch_assoc($result);

mysqli_close($link);

$arr = array(
    'dateCreation' => $row['dateCreation']
    , 'valeur' => $row['valeur']
    , 'exterieur' => $row['exterieur']
    , 'relai' => $row['relai']
);
echo json_encode($arr);

?>