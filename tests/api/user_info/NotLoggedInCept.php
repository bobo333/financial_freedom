<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('User info when not logged in');
    $I->sendGET('/userinfo.php');
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->seeResponseContains('{"success":false,"errors":["No user logged in."]}');
?>