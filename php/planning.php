<?php
    require("connectDB.php");
    

$sql = "SELECT id, jour, heureDebut, heureFin, temperature_id FROM planning order by jour, heureDebut";

$result = $link->query($sql);
$rows = array();
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}
echo json_encode($rows);

?>