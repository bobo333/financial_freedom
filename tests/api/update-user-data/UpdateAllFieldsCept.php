<?php 
    $new_expenses_growth_rate = .11;
    $new_income_growth_rate = .22;
    $new_investment_growth_rate = .33;
    $new_monthly_expenses = 11;
    $new_monthly_income = 22;
    $new_total_assets = 33;

    $update_vals = [
        'expenses_growth_rate' => $new_expenses_growth_rate,
        'income_growth_rate' => $new_income_growth_rate,
        'investment_growth_rate' => $new_investment_growth_rate,
        'monthly_expenses' => $new_monthly_expenses,
        'monthly_income' => $new_monthly_income,
        'total_assets' => $new_total_assets
    ];

    $I = new ApiTester($scenario);
    $I->wantTo('Update all values');
    $I->sendPOST('/login.php', array('email' => 'test1@test.com', 'password' => '123'));
    $I->sendPOST('/update-user-data.php', $update_vals);

    $response = json_decode($I->grabResponse(), TRUE);

    $I->seeResponseCodeIs(200);
    $I->seeResponseIsJson();
    $I->assertEquals($response['success'], TRUE);
    $I->assertEquals($response['errors'], []);
    $I->assertEquals($response['user_data']['expenses_growth_rate'], $new_expenses_growth_rate);
    $I->assertEquals($response['user_data']['income_growth_rate'], $new_income_growth_rate);
    $I->assertEquals($response['user_data']['investment_growth_rate'], $new_investment_growth_rate);
    $I->assertEquals($response['user_data']['monthly_expenses'], $new_monthly_expenses);
    $I->assertEquals($response['user_data']['monthly_income'], $new_monthly_income);
    $I->assertEquals($response['user_data']['total_assets'], $new_total_assets);
?>