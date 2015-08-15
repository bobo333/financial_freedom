<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login case insenstive email');
    $I->sendPOST('/login.php', array('email' => 'TeSt1@tEsT.COm', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => TRUE,
        "errors" => []
    ];

    $I->seeJsonResponseContains($expected_response);
?>