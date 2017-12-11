<?php
    require("connectDB.php");

    $sql = "DELETE FROM consigneManuelle";
    $result = $link->query($sql)
        or die(mysql_error());
    
    mysqli_close($link);

?>