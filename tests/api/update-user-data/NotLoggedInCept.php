<?php 
    $update_vals = [
        'expenses_growth_rate' => 0.616
    ];

    $expected_response = [
        "success" => FALSE,
        "errors" => ["No user logged in."]
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update without being logged in');
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'expenses_growth_rate' => 0.616));
?>