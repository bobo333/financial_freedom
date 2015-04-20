<?php 
    $I = new ApiTester($scenario);
    $I->wantTo("Login with wrong email");
    $I->sendGET('/login.php', array('email' => 'test_WRONG_EMAIL@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["No account with that email found."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>