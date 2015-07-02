<?php
    require('config.php');

    function only_allow_post() {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            http_response_code(403);
            exit();
        }
    }

    function check_logged_in() {
        if ( (!(isset($_SESSION['logged_in']))) || !$_SESSION['logged_in']) {
            $errors = ['No user logged in.'];
            send_fail_response($errors);
        }
    }

    function check_params($required_params) {
        foreach($required_params as $required_param) {
            if (!isset($_POST[$required_param])) {
                $errors = [$required_param . ' required.'];
                send_fail_response($errors);
            }
        }
    }

    function check_old_password($old_password) {
        global $config;

        $id = $_SESSION['user_id'];

        $db = new mysqli('localhost', 'root', '', $config['db_name']);
        if ($db->connect_errno > 0) {
            die('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT password_and_salt
            FROM `users`
            WHERE id=?";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("i", $id);
            $statement->execute();
            $statement->bind_result($result_pw_and_salt);
            $statement->fetch();
            $statement->close();
        } else {
            die('There was an error running the query [' . $db->error . ']');
        }

        if (!password_verify($old_password, $result_pw_and_salt)) {
            $errors = ["Incorrect password."];
            send_fail_response($errors);
        }
    }

    function check_password_length($password) {
        if (strlen($password) < 6) {
            $errors = ['Password must be at least 6 characters long.'];
            send_fail_response($errors);
        }
    }

    function hash_password($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    function set_new_password($hashed_password) {
        global $config;

        $query = "UPDATE `users` SET password_and_salt=? WHERE id=?";
        $user_id = $_SESSION['user_id'];

        $data_types = 'si';
        $data_vals = [$hashed_password, $user_id];

        array_unshift($data_vals, $data_types);

        $db = new mysqli('localhost', 'root', '', $config['db_name']);
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        if ($statement = $db->prepare($query)) {
            call_user_func_array(array($statement, 'bind_param'), convert_to_reference($data_vals));
            $statement->execute();
            $statement->close();
        }
    }

    function convert_to_reference($array) {
        $refs = [];

        foreach($array as $key => $value) {
            $refs[$key] = &$array[$key];
        }

        return $refs;
    }

    function send_fail_response($errors) {
        $data = [
            'success' => FALSE, 
            'errors' => $errors
        ];
        send_json_response($data);
    }

    function send_success_response() {
        $data = [
            'success' => TRUE, 
            'errors' => []
        ];
        send_json_response($data);
    }

    function send_json_response($response_data) {
        header('Content-Type: application/json');
        exit(json_encode($response_data, JSON_NUMERIC_CHECK));
    }

    only_allow_post();
    session_start();
    check_logged_in();
    check_params(['new_password', 'old_password'], $_POST);

    $old_password = $_POST['old_password'];
    $new_password = $_POST['new_password'];

    check_old_password($old_password);
    check_password_length($new_password);
    $hashed_password = hash_password($new_password);
    set_new_password($hashed_password);

    send_success_response();