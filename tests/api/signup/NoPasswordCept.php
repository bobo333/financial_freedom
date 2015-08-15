<?php 
    $I = new ApiTester($scenario);

    $initial_user_count = $I->dbCount('users');

    $I->wantTo('Sign up with no password');
    $I->sendPOST('/signup.php', array("email" => "new_sign_up@signup.com"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $final_user_count = $I->dbCount('users');

    $expected_response = [
        "success" => FALSE,
        "errors" => ["password required."]
    ];

    $I->seeJsonResponseContains($expected_response);
    $I->assertEquals($initial_user_count, $final_user_count);
?>