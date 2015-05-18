<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('Send a GET request');
    $I->sendGET('/signup.php', array("password" => "1234"));
    $I->seeResponseCodeIs(403);
?>