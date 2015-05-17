<?php 
    $I = new ApiTester($scenario);

    $initial_user_count = $I->dbCount('users');

    $I->wantTo('Sign up with no email');
    $I->sendPOST('/signup.php', array("password" => "1234"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $final_user_count = $I->dbCount('users');

    $expected_response = [
        "success" => FALSE,
        "errors" => ["email required."]
    ];

    $I->seeJsonResponseContains($expected_response);
    $I->assertEquals($initial_user_count, $final_user_count);
?>