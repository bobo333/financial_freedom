<?php 
    $I = new ApiTester($scenario);

    $initial_user_count = $I->dbCount('users');

    $I->wantTo('Sign up successfully');
    $I->sendPOST('/signup.php', array("email" => "new_sign_up@signup.com", "password" => "123456"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $final_user_count = $I->dbCount('users');

    $expected_response = [
        "success" => TRUE,
        "errors" => []
    ];

    $I->seeJsonResponseContains($expected_response);

    $I->sendGET('/get-user-data.php');
    $I->seeResponseCodeIs(200);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->assertEquals($response['success'], TRUE);
    $I->assertEquals($response["user_data"]["email"], "new_sign_up@signup.com");
    $I->assertEquals($response["user_data"]["total_assets"], NULL);
    $I->assertEquals($initial_user_count + 1, $final_user_count);
?>