<?php 
    $I = new ApiTester($scenario);
    $I->wantTo('User info when not logged in');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendGET('/get-user-data.php');
    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();

    $expected_response = [
        "success" => TRUE,
        "errors" => [],
        "user_data" => [
            "id" => 1,
            "email" => "test1@test.com",
            "monthly_income" => 5500,
            "total_assets" => 80000,
            "monthly_expenses" => 2500,
            "income_growth_rate" => 0.04,
            "investment_growth_rate" => 0.075,
            "expenses_growth_rate" => 0.03,
            "created_at" => "2015-04-06 23:19:40"
        ]
    ];

    $I->seeJsonResponseContains($expected_response);
?>