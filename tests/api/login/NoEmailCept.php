<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Login with no email');
    $I->sendGET('/login.php', array('password' => '1234'));
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeResponseContains('{"success":false,"errors":["email required."]}');
?>