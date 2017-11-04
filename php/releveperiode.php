<?php
define("SECONDESPARHEURE", 3600);
define("SECONDESPARMINUTE", 60);
//define("HOST", "89.89.151.88");
define("HOST", "localhost");
$dateDebut = '20170610';
$dateFin = '20170610';
$intervalEnMinute = 60;
if (isset($_GET['dateDebut'])) {
        $dateDebut = $_GET['dateDebut'];
        //echo $dateDebut;
        $dateFin = $_GET['dateFin'];
        $intervalEnMinute = $_GET['intervalEnMinute'];
    }else{
        // Fallback behaviour goes here
    }

	require("connectDB.php");
    
//$intervalEnHeure = 1;
//$seconde = 3600; // 1 heure
//$secondes = SECONDESPARHEURE * $intervalEnHeure; 
$secondes = SECONDESPARMINUTE * $intervalEnMinute;
$sql = "
SELECT 
FROM_UNIXTIME(FLOOR( UNIX_TIMESTAMP(dateCreation)/$secondes ) * $secondes) AS dateCreation
, AVG(valeur) AS valeur
, AVG(exterieur) AS exterieur
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

/*
$fp = fopen('c:\sql.log', 'w');
fwrite($fp, $sql);
fclose($fp);
*/
?>

