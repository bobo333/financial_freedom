<?php
    # only allow post
    function only_allow_post() {
        if ($_SERVER['REQUEST_METHOD'] != 'POST') {
            http_response_code(403);
            exit();
        }
    }

    # check if logged in
    function check_logged_in() {
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']) {
            $errors = ['User already logged in.'];
            send_fail_response($errors);
        }
    }

    function check_email_used($email) {
        if (check_email_in_db($email)) {
            $errors = ['Email already in use.'];
            send_fail_response($errors);
        }
    }

    # check if email in db
    function check_email_in_db($email) {
        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT email
            FROM `users`
            WHERE email=?";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("s", $email);
            $statement->execute();
            $statement->store_result();

            if ($statement->num_rows > 0) {
                return TRUE;
            } else {
                return FALSE;
            }
        }
    }

    # check if password meets requirements
    # check other params are present
        # monthly income
        # total assets
        # monthly expenses
        # income growth rate
        # investment growth rate
        # expense growth rate

    # create account and log user in
    # return success true




    function send_fail_response($errors) {
        $data = [
            'success' => FALSE, 
            'errors' => $errors
        ];
        send_json_response($data);
    }

    function send_json_response($response_data) {
        header('Content-Type: application/json');
        exit(json_encode($response_data));
    }

    only_allow_post();

    $email = $_POST['email'];
    $email_used = check_email_used($email);