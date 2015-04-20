<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Sign up with no password');
    $I->sendPOST('/signup.php', array("email" => "new_sign_up@signup.com"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["password required."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>