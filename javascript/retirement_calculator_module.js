var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
    var WITHDRAWAL_RATE = .04;
    var INFLATION_RATE = .035;
    var INCOME_INCREASE_RATE = .05;
    var GROWTH_RATE = .075;
    
    var total_assets = 0;
    var monthly_pay = 0;
    var monthly_expenses = 0;

    this.calculateMonthsToRetirement = function() {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        var months = 0;
        var data_to_graph = [];

        while (!checkIfCanRetire(total_assets, monthly_expenses * 12)) {
            data_to_graph.push(
                {
                    expenses: monthly_expenses, 
                    withdraw_limit: .04 * total_assets / 12
                }
            );
            total_assets = updateTotalAssets(total_assets, monthly_pay, monthly_expenses, MONTHLY_GROWTH_RATE);
            monthly_expenses = addInterest(monthly_expenses, MONTHLY_INFLATION_RATE);
            months++;
            
            if (months % 12 === 0) {
                monthly_pay = addInterest(monthly_pay, INCOME_INCREASE_RATE);
            }
            
            if (months >= 1200) {
                break;
            }
        }
        
        var points_to_add = data_to_graph.length / 2;
        
        for (i=0; i < points_to_add; i++) {
        
            if (months >= 1200) {
                break;
            }
        
            data_to_graph.push(
                {
                    expenses: monthly_expenses, 
                    withdraw_limit: .04 * total_assets / 12
                }
            );
            total_assets = updateTotalAssets(total_assets, monthly_pay, monthly_expenses, MONTHLY_GROWTH_RATE);
            monthly_expenses = addInterest(monthly_expenses, MONTHLY_INFLATION_RATE);
            months++;
            
            if (months % 12 === 0) {
                monthly_pay = addInterest(monthly_pay, INCOME_INCREASE_RATE);
            }
        }
        
        data_to_graph.push(
            {
                expenses: monthly_expenses, 
                withdraw_limit: .04 * total_assets / 12
            }
        );
        
        return_value = {
            months: months,
            data_to_graph: data_to_graph
        };
        
        return return_value;
    };
    
    this.calculatePeriodInterestRate = function(overall_rate, number_of_periods) {
        base = overall_rate + 1;
        exponent = 1 / number_of_periods;
        return Math.pow((base), (exponent)) - 1;
    };
    
    var checkIfCanRetire = function(investment_amount, expenses) {
        return WITHDRAWAL_RATE * investment_amount >= expenses;
    };
    
    var updateTotalAssets = function(total_assets, pay, expenses, interest_rate) {
        return addInterest(total_assets, interest_rate) + pay - expenses;
    };
    
    var addInterest = function(original_total, interest_rate) {
        return original_total * (1 + interest_rate);
    };
    
    this.setTotalAssets = function(new_total_assets) {
        total_assets = new_total_assets;
    };
    
    this.setMonthlyPay = function(new_monthly_pay) {
        monthly_pay = new_monthly_pay;
    };
    
    this.setMonthlyExpenses = function(new_monthly_expenses) {
        monthly_expenses = new_monthly_expenses;
    };
    
});    