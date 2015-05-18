<?php 
    # using /userinfo.php route to check that user is in fact logged out

    $I = new ApiTester($scenario);
    $I->wantTo('Logout when already logged out');
    $I->sendGET('/logout.php');
    $I->sendGET('/get-user-data.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["No user logged in."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>