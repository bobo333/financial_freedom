<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Sign up with no email');
    $I->sendPOST('/signup.php', array("password" => "1234"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["email required."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>