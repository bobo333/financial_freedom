<?php 
    $I = new ApiTester($scenario);

    $I->wantTo('Change password with no old_password');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseContains('{"success":true,"errors":[]}');
    $I->sendPOST('/change-password.php', array("old_password" => "123", "new_password" => "1234678"));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => TRUE,
        "errors" => []
    ];

    $I->seeJsonResponseContains($expected_response);
    $I->dontSeeInDatabase('users', array('email' => 'test1@test.com', 'password_and_salt' => '$2y$10$Z7txCQXh6LRAxnpMnV.xTevdYWRQ3P7MPTn8hLgS/DcvE6bBiKOM2'));
    $I->seeInDatabase('users', array('email' => 'test1@test.com'));
?>