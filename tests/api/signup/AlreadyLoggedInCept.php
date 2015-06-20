<?php 
    $I = new ApiTester($scenario);

    $initial_user_count = $I->dbCount('users');

    $I->wantTo('Sign up when already logged in');
    $I->sendPOST('/login.php', ["email" => "test1@test.com", "password" => "123"]);
    $I->sendPOST('/signup.php', ["email" => "new_sign_up@signup.com", "password" => '123456']);
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $final_user_count = $I->dbCount('users');

    $expected_response = [
        "success" => FALSE,
        "errors" => ["User already logged in."]
    ];

    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', ['email' => 'new_sign_up@signup.com']);
    $I->assertEquals($initial_user_count, $final_user_count);
?>