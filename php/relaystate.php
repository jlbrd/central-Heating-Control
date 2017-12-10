<?php
	require("connectDB.php");
    
    $dateDebut = '20170610';
    $dateFin = '20170610';
    if (isset($_GET['dateDebut'])) {
        $dateDebut = $_GET['dateDebut'];
        //echo $dateDebut;
        $dateFin = $_GET['dateFin'];
    } else{
        // Fallback behaviour goes here
    }
    
$sql = "
SELECT relai, count(*) AS nbre
FROM releve 
where DATE(dateCreation) BETWEEN '$dateDebut' AND '$dateFin'
group by relai
";

$result = $link->query($sql);
$rows = array();
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
echo json_encode($rows);

?>