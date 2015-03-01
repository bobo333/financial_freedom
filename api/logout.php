<?php

    $output = array(
        'success' => True
    );
    
    echo json_encode($output);

    session_start();
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']) {
        echo '<br><br>WAS LOGGED IN';
        session_destroy();
    } else {
        echo '<br><br>ALREADY LOGGED OUT';
    }