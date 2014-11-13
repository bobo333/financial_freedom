var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
    var WITHDRAWAL_RATE = .04;
    var INFLATION_RATE = .035;
    var INCOME_INCREASE_RATE = .05;
    var GROWTH_RATE = .075;
    
    this.calculateYearsToRetirement = function(net_worth, annual_pay, annual_expenses) {
        var years = 0;
        
        while (!checkIfCanRetire(net_worth, annual_expenses)) {
            net_worth = updateNetWorth(net_worth, annual_pay, annual_expenses, GROWTH_RATE);
            annual_pay = addInterest(annual_pay, INCOME_INCREASE_RATE);
            annual_expenses = addInterest(annual_expenses, INFLATION_RATE);
            years++;
            
            if (years > 9999) {
                break;
            }
        }
        
        return years;
    };

    this.calculateMonthsToRetirement = function(net_worth, monthly_pay, monthly_expenses) {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        var months = 0;

        while (!checkIfCanRetire(net_worth, monthly_expenses * 12)) {
            net_worth = updateNetWorth(net_worth, monthly_pay, monthly_expenses, MONTHLY_GROWTH_RATE);
            monthly_expenses = addInterest(monthly_expenses, MONTHLY_INFLATION_RATE);
            months++;
            
            if (months % 12 === 0) {
                monthly_pay = addInterest(monthly_pay, INCOME_INCREASE_RATE);
            }
            
            if (months >= 1200) {
                break;
            }
        }
        
        return months;
    };
    
    this.calculatePeriodInterestRate = function(overall_rate, number_of_periods) {
        base = overall_rate + 1;
        exponent = 1 / number_of_periods;
        return Math.pow((base), (exponent)) - 1;
    };
    
    var checkIfCanRetire = function(investment_amount, expenses) {
        return WITHDRAWAL_RATE * investment_amount >= expenses;
    };
    
    var updateNetWorth = function(net_worth, pay, expenses, interest_rate) {
        return addInterest(net_worth, interest_rate) + pay - expenses;
    };
    
    var addInterest = function(original_total, interest_rate) {
        return original_total * (1 + interest_rate);
    };
    
});    