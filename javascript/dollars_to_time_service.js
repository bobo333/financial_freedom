FinancialFreedom.service('DollarsToTimeService', function(RetirementCalculatorService, DateService) {
     
     this.calculateDollarsToTime = function(amount, expense, recurring) {
        var spendy_data = RetirementCalculatorService.initialRetirementData();
        var thrifty_data = RetirementCalculatorService.initialRetirementData();

        if (expense) {
            if (recurring) {
                spendy_data.monthly_expenses = spendy_data.monthly_expenses + amount;
            } else {
                spendy_data.total_assets = spendy_data.total_assets - amount;
            }
        } else {
            if (recurring) {
                thrifty_data.monthly_income = thrifty_data.monthly_income + amount;
            } else {
                thrifty_data.total_assets = spendy_data.total_assets + amount;
            }
        }

        RetirementCalculatorService.calculateRetirementInfo(spendy_data);
        RetirementCalculatorService.calculateRetirementInfo(thrifty_data);

        var data = {
            spendy: spendy_data,
            thrifty: thrifty_data
        };

        if (spendy_data.can_retire && thrifty_data.can_retire) {
            difference = DateService.calculateDateDifference(thrifty_data.intersection_point.x, spendy_data.intersection_point.x);
            data.difference = difference;
        }

        return data;
    };

});