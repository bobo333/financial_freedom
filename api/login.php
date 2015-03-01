<?php

    $response_obj = array();

    function check_logged_in() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']) {
            $response_obj = array('errors' => ['Already logged in.']);
            exit(json_encode($response_obj));
        }
    }

    function check_params($request, $required_params) {
        $errors = [];
        foreach ($required_params as $param) {
            if (!isset($request[$param])) {
                $error_message = $param . " required.";
                array_push($errors, $error_message);
            }
        }
        if (count($errors) > 0) {
            $response_obj = array('errors' => $errors);
            exit(json_encode($response_obj));
        }
    }

    function query_db($query) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die('Unable to connect to database [' . $db->connect_error . ']');
        }
        if (!$result = $db->query($query)) {
            die('There was an error running the query [' . $db->error . ']');
        }
        $db->close();
        
        return $result;
    }

    function check_no_match($result) {
        if ($result->num_rows == 0) {
            $result->free();
            $response_obj = array('errors' => ["No account with that email found."]);
            exit(json_encode($response_obj));
        }
    }

    function check_login_credentials($provided_password, $password_and_salt) {
        if (password_verify($provided_password, $password_and_salt)) {
            $_SESSION['logged_in'] = true;
            $success_obj = array('success' => true);
            echo(json_encode($success_obj));
        } else {
            $fail_obj = array('errors' => ["Incorrect password."]);
            echo(json_encode($fail_obj));
        }
    }

    session_start();
    check_logged_in();
    $login_params = ['email', 'password'];
    check_params($_GET, $login_params);
    $password = $_GET['password'];
    $email = $_GET['email'];
    $query = "
        SELECT email, password_and_salt
        FROM `users`
        WHERE email='" . $email . "'";

    $result = query_db($query);
    check_no_match($result);
    $user_pw_hash = $result->fetch_assoc()['password_and_salt'];
    check_login_credentials($password, $user_pw_hash);
    $result->free();