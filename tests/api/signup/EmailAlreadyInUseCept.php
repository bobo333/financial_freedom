<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Sign up with existing email');
    $I->sendPOST('/signup.php', array("email" => "test1@test.com", "password" => "123"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["Email already in use."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>