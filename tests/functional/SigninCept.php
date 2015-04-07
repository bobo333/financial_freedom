<?php 
$I = new FunctionalTester($scenario);
$I->wantTo('perform actions and see result');

$I->seeInDatabase('users', array('email' => 'test1@test.com'));

?>