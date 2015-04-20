<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login when already logged in');
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["User already logged in."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>