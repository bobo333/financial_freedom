<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login successfully');
    $I->sendGET('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeResponseContains('{"success":true,"errors":[]}');
?>