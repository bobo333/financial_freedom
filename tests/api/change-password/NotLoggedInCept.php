<?php 
    function hash_password($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    $update_vals = [
        'old_password' => "123",
        'new_password' => '123456'
    ];

    $expected_response = [
        "success" => FALSE,
        "errors" => ["No user logged in."]
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Change password without being logged in');
    $I->sendPOST('/change-password.php', $update_vals);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeJsonResponseContains($expected_response);
    $I->seeInDatabase('users', array('email' => 'test1@test.com', 'password_and_salt' => '$2y$10$Z7txCQXh6LRAxnpMnV.xTevdYWRQ3P7MPTn8hLgS/DcvE6bBiKOM2'));
?>