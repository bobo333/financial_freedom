FinancialFreedom.service('DollarsToTimeService', function(RetirementCalculatorService, DateService) {
     
    this.calculateDollarsToTime = function(amount, expense, recurring, customData) {

        var data = {};
        var spendy_data = RetirementCalculatorService.initialRetirementData(customData);
        var thrifty_data = RetirementCalculatorService.initialRetirementData(customData);

        if (expense) {
            if (recurring) {
                spendy_data.monthly_expenses += amount;

            } else {
                spendy_data.total_assets -= amount;
            }
            
        } else {
            if (recurring) {
                thrifty_data.monthly_income += amount;
            } else {
                thrifty_data.total_assets += amount;
            }
        }

        var spendy_retirement_data = RetirementCalculatorService.calculateRetirementInfo(spendy_data);
        var thrifty_retirement_data = RetirementCalculatorService.calculateRetirementInfo(thrifty_data);

        var spendy_months_to_retirement = spendy_retirement_data.months;
        var thrifty_months_to_retirement = thrifty_retirement_data.months;

        if (spendy_months_to_retirement > thrifty_months_to_retirement) {
            data.more_years_to_retirement = Math.floor(spendy_months_to_retirement / 12);
            data.more_months_to_retirement = spendy_months_to_retirement % 12;
            data.fewer_years_to_retirement = Math.floor(thrifty_months_to_retirement / 12);
            data.fewer_months_to_retirement = thrifty_months_to_retirement % 12;
        }
        else {
            data.fewer_months_to_retirement = Math.floor(spendy_months_to_retirement / 12);
            data.fewer_months_to_retirement = spendy_months_to_retirement % 12;
            data.more_months_to_retirement = Math.floor(thrifty_months_to_retirement / 12);
            data.more_months_to_retirement = thrifty_months_to_retirement % 12;
        }

        if (spendy_data.can_retire && thrifty_data.can_retire) {
            difference = DateService.calculateDateDifference(thrifty_data.intersection_point.x, spendy_data.intersection_point.x);
            data.difference = difference;
        }

        return data;
    };

    this.redirectToConverter = false;

});