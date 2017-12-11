<?php
    require("connectDB.php");
    
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    
    $values = '';
    foreach($request as $planning) {
        $jour = $planning->options->jour;
        $heureDebut = convertToHoursMins($planning->minValue) . ':00';
        $heureFin = convertToHoursMins($planning->maxValue-1) . ':59';
        $values .= ", (NULL, ". $jour . ", '" . $heureDebut . "', '" . $heureFin . "', " . $planning->options->temperature_id . ")";   
    }
    $values = substr($values, 2);
    $sql = "INSERT INTO planning (id, jour, heureDebut, heureFin, temperature_id) VALUES ";
    $sql .= $values;
    $result = $link->query("DELETE FROM planning where jour = " . $jour) 
        or die(mysql_error());

    $result = $link->query($sql) or die(mysql_error());

    mysqli_close($link);
    
    function convertToHoursMins($time, $format = '%02d:%02d') {
        if ($time < 1) {
            return '00:00';
        }
        $hours = floor($time / 60);
        $minutes = ($time % 60);
        return sprintf($format, $hours, $minutes);
    }

?>