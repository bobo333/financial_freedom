<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login with wrong password');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '1234'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["Incorrect password."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>