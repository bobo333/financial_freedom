<?php
namespace Codeception\Module;

// here you can define custom actions
// all public methods declared in helper class will be available in $I

class ApiHelper extends \Codeception\Module
{
    public function seeJsonResponseContains($variable) {
        $this->getModule('REST')->seeResponseContains(json_encode($variable, JSON_NUMERIC_CHECK));
    }

    public function assertEquals($value, $expected_value) {
        \PHPUnit_Framework_Assert::assertEquals($value, $expected_value);
    }
}
