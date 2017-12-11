<?php
define("SECONDESPARHEURE", 3600);
define("SECONDESPARMINUTE", 60);
define("HOST", "localhost");
$dateDebut = '20170610';
$dateFin = '20170610';
$intervalEnMinute = 60;
if (isset($_GET['dateDebut'])) {
        $dateDebut = $_GET['dateDebut'];
        $dateFin = $_GET['dateFin'];
        $intervalEnMinute = $_GET['intervalEnMinute'];
    }else{
        // Fallback behaviour goes here
    }

    require("connectDB.php");
    
$secondes = SECONDESPARMINUTE * $intervalEnMinute;
$sql = "
SELECT 
FROM_UNIXTIME(FLOOR( UNIX_TIMESTAMP(dateCreation)/$secondes ) * $secondes) AS dateCreation
, AVG(valeur) AS valeur
, AVG(exterieur) AS exterieur
, AVG(wunderground) AS wunderground
, AVG(openweathermap) AS openweathermap
, AVG(relai) AS relai
, AVG(consigne) AS consigne
FROM releve 
where DATE(dateCreation) BETWEEN '$dateDebut' AND '$dateFin'
GROUP BY FROM_UNIXTIME(FLOOR( UNIX_TIMESTAMP(dateCreation)/$secondes ) * $secondes)
";

$result = $link->query($sql);
$rows = array();
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
echo json_encode($rows);

?>    

