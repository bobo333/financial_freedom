<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login successfully');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => TRUE,
        "errors" => []
    ];

    $I->seeJsonResponseContains($expected_response);
?>