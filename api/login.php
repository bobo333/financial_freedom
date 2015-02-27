<?php

    $output = array(
        'success' => True
    );
    
    echo json_encode($output);

    $hash = password_hash('hi', PASSWORD_BCRYPT);
    echo $hash;

    var_dump(password_verify('hi', $hash));

    $query = "
        SELECT *
        FROM `users`
    ";

    echo $query;

    $db = new mysqli('localhost', 'root', '', 'financial_freedom');

    if ($db->connect_errno > 0) {
        die('Unable to connect to database [' . $db->connect_error . ']');
    }

    if (!$result = $db->query($query)) {
        die('There was an error running the query [' . $db->error . ']');
    }


    echo $result->num_rows;

    var_dump($result);
    print_r($result);

    while ($row = $result->fetch_assoc()) {
        var_dump($row);
        print_r($row);
        echo "<br>" . $row['email'];
        echo "<br>" . $row['password_and_salt'];
    }

    $result->free();
    $db->close();

    echo "<br><br>";

    session_start();
    var_dump($_SESSION);
    var_dump($_COOKIE);
    echo session_id();