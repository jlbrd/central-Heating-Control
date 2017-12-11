<?php
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $type = $request->type;
    $valeur = $request->valeur;
    $duree = $request->duree; 

    require("connectDB.php");
    
    $sql = "INSERT INTO consigneManuelle (id, type, valeur, duree, debutEffet) 
    VALUES(1, '" . $type . "', ". $valeur . ", ". $duree . ", NOW())
    ON DUPLICATE KEY UPDATE id = VALUES(id), type = VALUES(type), valeur = VALUES(valeur), duree = VALUES(duree), debutEffet = VALUES(debutEffet)";
    
    $result = $link->query($sql)
        || die(mysql_error());

    mysqli_close($link);

?>