var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
    var WITHDRAWAL_RATE = .04;
    var INFLATION_RATE = .035;
    var INCOME_INCREASE_RATE = .05;
    var GROWTH_RATE = .075;
    
    this.calculateYearsToRetirement = function(net_worth, annual_salary, annual_expenses) {
        var years = 0;
        
        while (!checkIfCanRetire(net_worth, annual_expenses)) {
            net_worth = updateNetWorth(net_worth, annual_expenses, annual_salary);
            annual_salary = updateAnnualSalary(annual_salary);
            annual_expenses = updateAnnualExpenses(annual_expenses);
            years++;
            
            if (years > 9999) {
                break;
            }
        }
        
        return years;
    };
    
    this.calculatePeriodInterestRate = function(annual_rate, number_of_periods) {
        base = annual_rate + 1;
        console.log(base);
        exponent = 1 / number_of_periods;
        console.log(exponent);
        return Math.pow((base), (exponent)) - 1;
    };
    
    var checkIfCanRetire = function(investment_amount, expenses) {
        return WITHDRAWAL_RATE * investment_amount >= expenses;
    };
    
    var updateNetWorth = function(net_worth, annual_expenses, annual_salary) {
        return net_worth + net_worth * GROWTH_RATE + annual_salary - annual_expenses;
    };
    
    var updateAnnualSalary = function(annual_salary) {
        return annual_salary + annual_salary * INCOME_INCREASE_RATE;
    };
    
    var updateAnnualExpenses = function(annual_expenses) {
        return annual_expenses + annual_expenses * INFLATION_RATE;
    };
    
});    