<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Logout when already logged out');
    $I->sendGET('/logout.php');
    $I->sendGET('/userinfo.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeResponseContains('{"success":false,"errors":["No user logged in."]}');
?>