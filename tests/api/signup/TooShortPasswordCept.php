<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Sign up with too short password');
    $I->sendPOST('/signup.php', array("email" => "new_sign_up@signup.com", "password" => "123"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["Password must be at least 6 characters long."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>