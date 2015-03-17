<?php
    function only_allow_post() {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            http_response_code(403);
            exit();
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

    function check_logged_in() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']) {
            $errors = ['User already logged in.'];
            send_fail_response($errors);
        }
    }

    function check_valid_email($email) {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors = ['Invalid email.'];
            send_fail_response($errors);
        }
    }

    function check_email_used($email) {
        if (check_email_in_db($email)) {
            $errors = ['Email already in use.'];
            send_fail_response($errors);
        }
    }

    function check_email_in_db($email) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT COUNT(id)
            FROM `users`
            WHERE email=?";

        if ($statement = $db->prepare($query)) {
            $statement->bind_param("s", $email);
            $statement->execute();
            $statement->bind_result($count);
            $statement->fetch();
            $statement->close();

            if (intval($count) > 0) {
                return TRUE;
            } else {
                return FALSE;
            }
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

    function create_new_account($email, $hashed_pw) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            INSERT INTO `users`
            (email, password_and_salt) VALUES (?, ?)";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("ss", $email, $hashed_pw);
            $statement->execute();
            $statement->close();
        }
    }

    function get_account_id($email) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT id
            FROM `users`
            WHERE email=?";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("s", $email);
            $statement->bind_result($id);
            $statement->execute();
            $statement->fetch();
            $statement->close();
            return $id;
        }
    }

    function login($account_id) {
        $_SESSION['logged_in'] = TRUE;
        $_SESSION['user_id'] = $account_id;
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
        exit(json_encode($response_data));
    }

    session_start();
    only_allow_post();
    check_logged_in();
    
    $signup_params = ['email', 'password'];
    check_params($_POST, $signup_params);

    $email = $_POST['email'];
    check_valid_email($email);
    check_email_used($email);

    $password = $_POST['password'];
    check_password_length($password);
    $hashed_pw = hash_password($password);

    create_new_account($email, $hashed_pw);
    $account_id = get_account_id($email);
    login($account_id);
    send_success_response();