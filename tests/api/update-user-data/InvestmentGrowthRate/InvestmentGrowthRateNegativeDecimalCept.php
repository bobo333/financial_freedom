<?php 
    $update_vals = [
        'investment_growth_rate' => -0.05
    ];

    $expected_response = [
        'success' => FALSE,
        'errors' => ['investment_growth_rate must be non-negative decimal']
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update investment_growth_rate with negative decimal');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'investment_growth_rate' => -0.05));
?>