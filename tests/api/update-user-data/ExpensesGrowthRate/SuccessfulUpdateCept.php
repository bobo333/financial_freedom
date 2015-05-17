<?php 
    $new_growth_rate = .99;

    $update_vals = [
        'expenses_growth_rate' => $new_growth_rate
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update expenses_growth_rate with negative decimal');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->assertEquals($response['success'], TRUE);
    $I->assertEquals($response['errors'], []);
    $I->assertEquals($response['user_data']['expenses_growth_rate'], $new_growth_rate);
    $I->seeInDatabase('users', array('email' => 'test1@test.com', 'expenses_growth_rate' => $new_growth_rate));
?>