<?php 
    $new_income = 999;

    $update_vals = [
        'monthly_income' => $new_income
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update monthly_income with negative decimal');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->assertEquals($response['success'], TRUE);
    $I->assertEquals($response['errors'], []);
    $I->assertEquals($response['user_data']['monthly_income'], $new_income);
    $I->seeInDatabase('users', array('email' => 'test1@test.com', 'monthly_income' => $new_income));
?>