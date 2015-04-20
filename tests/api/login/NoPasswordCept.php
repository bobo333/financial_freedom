<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login with no password');
    $I->sendGET('/login.php', array('email' => 'test1@test.com'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["password required."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>