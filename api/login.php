<?php
    function check_logged_in() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']) {
            $errors = ['User already logged in.'];
            send_fail_response($errors);
        }
    }

    function check_params($request, $required_params) {
        $errors = [];
        foreach ($required_params as $param) {
            if (!isset($request[$param])) {
                $error_message = $param . " required.";
                $errors[] = $error_message;
            }
        }
        if (count($errors) > 0) {
            send_fail_response($errors);
        }
    }

    function login_query_db($email) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT email, password_and_salt
            from `users`
            WHERE email=?";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("s", $email);
            $statement->execute();
            $statement->bind_result($result_email, $result_pw_and_salt);
            $statement->fetch();
            $statement->close();
        } else {
            die('There was an error running the query [' . $db->error . ']');
        }
        
        return [
            'email' => $result_email,
            'pw_and_salt' => $result_pw_and_salt
        ];
    }

    function check_no_match($result) {
        if (is_null($result['email'])) {
            $errors = ["No account with that email found."];
            send_fail_response($errors);
        }
    }

    function check_login_credentials($provided_password, $password_and_salt) {
        if (password_verify($provided_password, $password_and_salt)) {
            $_SESSION['logged_in'] = true;
            send_success_response();
        } else {
            $errors = ["Incorrect password."];
            send_fail_response($errors);
        }
    }

    function send_success_response() {
        $data = [
            'success' => true, 
            'errors' => []
        ];
        send_json_response($data);
    }

    function send_fail_response($errors) {
        $data = [
            'success' => false, 
            'errors' => $errors
        ];
        send_json_response($data);
    }

    function send_json_response($response_data) {
        exit(json_encode($response_data));
    }

    session_start();
    check_logged_in();
    $login_params = ['email', 'password'];
    check_params($_GET, $login_params);
    $password = $_GET['password'];
    $email = $_GET['email'];

    $result = login_query_db($email);
    check_no_match($result);
    $user_pw_hash = $result['pw_and_salt'];
    check_login_credentials($password, $user_pw_hash);