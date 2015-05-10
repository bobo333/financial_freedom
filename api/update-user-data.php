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

    function validate_integer($name) {
        $filtered_input = filter_input(INPUT_POST, $name, FILTER_VALIDATE_INT);

        return (is_int($filtered_input) && intval($filtered_input) >= 0);
    }

    function validate_decimal($name) {
        $filtered_input = filter_input(INPUT_POST, $name, FILTER_VALIDATE_FLOAT);
        $float_val = floatval($filtered_input);

        return (is_float($filtered_input) && $float_val >= 0 && $float_val < 1);
    }

    function build_update_query() {
        $update_query = "UPDATE `users` SET";
        $field_set = FALSE;
        $valid_data = TRUE;
        $error_messages = [];
        $data_values = [];
        $data_types = '';

        if (isset($_POST['monthly_income'])) {

            if (!validate_integer('monthly_income')) {
                $valid_data = FALSE;
                $error_messages[] = 'monthly_income must be non-negative integer';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' monthly_income = ?';
                $field_set = TRUE;
                $data_values[] = intval($_POST['monthly_income']);
                $data_types = $data_types . 'i';
            }
        }

        if (isset($_POST['total_assets'])) {

            if (!validate_integer('total_assets')) {
                $valid_data = FALSE;
                $error_messages[] = 'total_assets must be non-negative integer';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' total_assets = ?';
                $field_set = TRUE;
                $data_values[] = intval($_POST['total_assets']);
                $data_types = $data_types . 'i';
            }
        }

        if (isset($_POST['monthly_expenses'])) {

            if (!validate_integer('monthly_expenses')) {
                $valid_data = FALSE;
                $error_messages[] = 'monthly_expenses must be non-negative integer';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' monthly_expenses = ?';
                $field_set = TRUE;
                $data_values[] = intval($_POST['monthly_expenses']);
                $data_types = $data_types . 'i';
            }
        }

        if (isset($_POST['income_growth_rate'])) {

            if (!validate_decimal('income_growth_rate')) {
                $valid_data = FALSE;
                $error_messages[] = 'income_growth_rate must be non-negative decimal';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' income_growth_rate = ?';
                $field_set = TRUE;
                $data_values[] = floatval($_POST['income_growth_rate']);
                $data_types = $data_types . 'd';
            }
        }

        if (isset($_POST['investment_growth_rate'])) {

            if (!validate_decimal('investment_growth_rate')) {
                $valid_data = FALSE;
                $error_messages[] = 'investment_growth_rate must be non-negative decimal';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' investment_growth_rate = ?';
                $field_set = TRUE;
                $data_values[] = floatval($_POST['investment_growth_rate']);
                $data_types = $data_types . 'd';
            }
        }

        if (isset($_POST['expenses_growth_rate'])) {

            if (!validate_decimal('expenses_growth_rate')) {
                $valid_data = FALSE;
                $error_messages[] = 'expenses_growth_rate must be non-negative decimal';
            } else {
                if ($field_set) {
                    $update_query = $update_query . ", ";
                }
                $update_query = $update_query . ' expenses_growth_rate = ?';
                $field_set = TRUE;
                $data_values[] = floatval($_POST['expenses_growth_rate']);
                $data_types = $data_types . 'd';
            }
        }

        if ($field_set && $valid_data) {
            $update_query = $update_query . " WHERE id = ?";
            return [
                'valid_data' => $valid_data,
                'query' => $update_query,
                'data_values' => $data_values,
                'data_types' => $data_types
            ];
        } else {
            return [
                'valid_data' => $valid_data,
                'errors' => $error_messages
            ];
        }
    }


    function convert_to_reference($array) {
        $refs = [];

        foreach($array as $key => $value) {
            $refs[$key] = &$array[$key];
        }

        return $refs;
    }


    function set_user_data($query, $data_types, $data_vals) {
        global $config;

        $user_id = $_SESSION['user_id'];

        $data_types .= 's';
        $data_vals[] = $user_id;

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






    function get_user_data() {
        global $config;

        $user_id = $_SESSION['user_id'];

        $db = new mysqli('localhost', 'root', '', $config['db_name']);
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
        exit(json_encode($response_data, JSON_NUMERIC_CHECK));
    }

    only_allow_post();
    session_start();
    check_logged_in();


    $update_query_result = build_update_query();

    if ($update_query_result['valid_data']) {
        set_user_data($update_query_result['query'], $update_query_result['data_types'], $update_query_result['data_values']);

        $user_data = get_user_data();
        send_success_response($user_data);
    } else {
        $errors = $update_query_result['errors'];
        send_fail_response($errors);
    }
