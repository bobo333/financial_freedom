<?php
namespace Codeception\Module;
require('api/config.php');
global $config;
\codecept_debug('hi');
\codecept_debug($config['db_name']);

// here you can define custom actions
// all public methods declared in helper class will be available in $I

class ApiHelper extends \Codeception\Module
{
    public function __construct() {
        parent::__construct();
        \codecept_debug('constructing');
        global $config;
        \codecept_debug($config['db_name']);
        // $this->db_name = $config['db_name'];
        $this->db_name = 'financial_freedom_test';
        \codecept_debug($this->db_name);
    }

    public function seeJsonResponseContains($variable) {
        $this->getModule('REST')->seeResponseContains(json_encode($variable, JSON_NUMERIC_CHECK));
    }

    public function assertEquals($value, $expected_value) {
        \PHPUnit_Framework_Assert::assertEquals($value, $expected_value);
    }

    public function dbCount($table) {
        $db = new \mysqli('localhost', 'root', '', $this->db_name);
        // $db = new \mysqli('localhost', 'root', '', 'financial_freedom_test');

        if ($db->connect_errno > 0) {
            die ('Unable to connect to database [' . $db->connect_error . ']');
        }

        $query = "
            SELECT COUNT(*) FROM `" . $table . "`";
        if ($statement = $db->prepare($query)) {
            $statement->bind_result($count);
            $statement->execute();
            $statement->fetch();
            $statement->close();
            return $count;
        }
    }
}
