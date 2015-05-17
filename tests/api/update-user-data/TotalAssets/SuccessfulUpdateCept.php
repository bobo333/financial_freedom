<?php 
    $new_assets = 999;

    $update_vals = [
        'total_assets' => $new_assets
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update total_assets with negative decimal');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->assertEquals($response['success'], TRUE);
    $I->assertEquals($response['errors'], []);
    $I->seeInDatabase('users', array('email' => 'test1@test.com', 'total_assets' => $new_assets));
?>