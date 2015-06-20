<?php 
    $update_vals = [
        'total_assets' => 'haha; DROP TABLE *;'
    ];

    $expected_response = [
        'success' => FALSE,
        'errors' => ['total_assets must be non-negative integer']
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update total_assets with string');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'total_assets' => "haha; DROP TABLE *;"));
?>