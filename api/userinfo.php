<?php
    function check_logged_in() {
        if ( (!(isset($_SESSION['logged_in']))) || !$_SESSION['logged_in']) {
            $errors = ['No user logged in.'];
            send_fail_response($errors);
        }
    }

    function get_user_data() {
        $user_id = $_SESSION['user_id'];

        $db = new mysqli('localhost', 'root', '', 'financial_freedom');
        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT *
            FROM `users`
            WHERE id=?";
        if ($statement = $db->prepare($query)) {
            $statement->bind_param("s", $user_id);
            $statement->bind_result($id, $email, $pw, $monthly_income, $total_assets, $monthly_expenses, $income_growth_rate, $investment_growth_rate, $expenses_growth_rate, $inflation_rate, $created_at);
            $statement->execute();
            $statement->fetch();
            $statement->close();
            return [
                'id' => $id,
                'email' => $email,
                'monthly_income' => $monthly_income,
                'total_assets' => $total_assets,
                'monthly_expenses' => $monthly_expenses,
                'income_growth_rate' => $income_growth_rate,
                'investment_growth_rate' => $investment_growth_rate,
                'expenses_growth_rate' => $expenses_growth_rate,
                'created_at' => $created_at
            ];
        }
    }

    function send_fail_response($errors) {
        $data = [
            'success' => FALSE, 
            'errors' => $errors
        ];
        send_json_response($data);
    }

    function send_success_response($user_data) {
        $data = [
            'success' => TRUE, 
            'errors' => [],
            'user_data' => $user_data
        ];
        send_json_response($data);
    }

    function send_json_response($response_data) {
        header('Content-Type: application/json');
        exit(json_encode($response_data));
    }

    session_start();
    check_logged_in();
    $user_data = get_user_data();
    send_success_response($user_data);