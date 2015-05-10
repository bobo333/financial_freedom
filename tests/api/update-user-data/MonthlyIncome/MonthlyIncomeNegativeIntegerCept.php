<?php 
    $update_vals = [
        'monthly_income' => -500
    ];

    $expected_response = [
        'success' => FALSE,
        'errors' => ['monthly_income must be non-negative integer']
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update monthly_expenses with negative integer');
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'monthly_income' => -500));
?>