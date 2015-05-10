<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('User info when not logged in');
    $I->sendGET('/get-user-data.php');
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => FALSE,
        "errors" => ["No user logged in."]
    ];

    $I->seeJsonResponseContains($expected_response);
?>