<?php
	require("connectDB.php");
	
$sql = "
	select temperature.valeur, TIME(heureFin) AS heureFin, 0 AS duree, temperature.libelle AS mode
	from planning 
	INNER JOIN temperature on temperature.id = planning.temperature_id
	where now() >= heureDebut and now() <= heureFin
	AND jour = DAYOFWEEK(NOW())
	AND NOT EXISTS (
		select valeur from consigneManuelle 
		WHERE DATE_ADD(debutEffet, INTERVAL duree HOUR) >= NOW() OR type IN('ABSENT', 'HORSGEL')
	)
UNION
	select COALESCE(temperature.valeur, consigneManuelle.valeur), TIME(DATE_ADD(debutEffet, INTERVAL duree HOUR)) AS heureFin, duree, type as mode
	from consigneManuelle 
	LEFT JOIN temperature ON temperature.cle = consigneManuelle.type
	WHERE ( DATE_ADD(debutEffet, INTERVAL duree HOUR) >= NOW()
 		OR type IN('ABSENT', 'HORSGEL')
    )
";
$result = $link->query($sql);
$row = mysqli_fetch_assoc($result);

mysqli_close($link);

$arr = array(
	  'valeur' => $row['valeur']
	, 'heureFin' => $row['heureFin']
	, 'duree' => $row['duree']
	, 'mode' => $row['mode']
);
echo json_encode($arr);

?>