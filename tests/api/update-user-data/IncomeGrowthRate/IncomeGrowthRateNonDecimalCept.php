<?php 
    $update_vals = [
        'income_growth_rate' => -0.03
    ];

    $expected_response = [
        'success' => FALSE,
        'errors' => ['income_growth_rate must be non-negative decimal']
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update income_growth_rage with non-decimal');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'income_growth_rate' => -0.03));
?>