<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Sign up when already logged in');
    $I->sendPOST('/login.php', ["email" => "test1@test.com", "password" => "123"]);
    $I->sendPOST('/signup.php', array("email" => "new_sign_up@signup.com"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["User already logged in."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>