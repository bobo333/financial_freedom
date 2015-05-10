<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Update only allow POST');

    $update_vals = [
        'expenses_growth_rate' => 0.616
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update expenses_growth_rate with negative decimal');
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '123'));

    $I->sendGET('/update-user-data.php', $update_vals);
    $I->seeResponseCodeIs(403);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'expenses_growth_rate' => 0.616));
?>