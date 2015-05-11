<?php 
    $update_vals = [
        'expenses_growth_rate' => 'haha; DROP TABLE *;'
    ];

    $expected_response = [
        'success' => FALSE,
        'errors' => ['expenses_growth_rate must be non-negative decimal']
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update expenses_growth_rate with string');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'expenses_growth_rate' => "haha; DROP TABLE *;"));
?>