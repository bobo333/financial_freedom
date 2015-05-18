<?php 
    $update_vals = [
        'expenses_growth_rate' => -0.03,
        'total_assets' => 50000,
        'investment_growth_rate' => 50
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update with multiple errors');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->assertEquals($response['success'], FALSE);
    $I->assertTrue(in_array('expenses_growth_rate must be non-negative decimal', $response['errors']));
    $I->assertTrue(in_array('investment_growth_rate must be non-negative decimal', $response['errors']));
    $I->assertFalse(in_array('total_assets must be non-negative integer', $response['errors']));
?>