var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
    var WITHDRAWAL_RATE = .04;
    var INFLATION_RATE = .035;
    var INCOME_INCREASE_RATE = .05;
    var GROWTH_RATE = .075;
    var YEAR_MAX = 100;
    var MONTH_MAX = YEAR_MAX * 12;
    
    var total_assets;
    var monthly_income;
    var monthly_expenses;

    this.calculateMonthsToRetirement = function() {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        var months = 0;
        var data_to_graph = [];
        var local_total_assets = total_assets;
        var local_monthly_income = monthly_income;
        var local_monthly_expenses = monthly_expenses;

        while (!checkIfCanRetire(local_total_assets, local_monthly_expenses * 12) && months < MONTH_MAX) {
            var monthly_withdrawal_limit = monthlyWithdrawalLimit(local_total_assets);
            var graph_data = formatGraphData(local_monthly_expenses, monthly_withdrawal_limit);
            data_to_graph.push(graph_data);
            
            local_total_assets = updateTotalAssets(local_total_assets, local_monthly_income, local_monthly_expenses, MONTHLY_GROWTH_RATE);
            local_monthly_expenses = addInterest(local_monthly_expenses, MONTHLY_INFLATION_RATE);
            months++;
            
            if (months % 12 === 0) {
                local_monthly_income = addInterest(local_monthly_income, INCOME_INCREASE_RATE);
            }
        }
        
        var points_to_add = data_to_graph.length / 2;
        
        for (i=0; i < points_to_add; i++) {
        
            if (months >= MONTH_MAX) {
                break;
            }
            
            var monthly_withdrawal_limit = monthlyWithdrawalLimit(local_total_assets);
            var graph_data = formatGraphData(local_monthly_expenses, monthly_withdrawal_limit);
            data_to_graph.push(graph_data);
            
            local_total_assets = updateTotalAssets(local_total_assets, local_monthly_income, local_monthly_expenses, MONTHLY_GROWTH_RATE);
            local_monthly_expenses = addInterest(local_monthly_expenses, MONTHLY_INFLATION_RATE);
            months++;
            
            if (months % 12 === 0) {
                local_monthly_income = addInterest(local_monthly_income, INCOME_INCREASE_RATE);
            }
        }
        
        var monthly_withdrawal_limit = monthlyWithdrawalLimit(local_total_assets);
        var graph_data = formatGraphData(local_monthly_expenses, monthly_withdrawal_limit);
        data_to_graph.push(graph_data);
        
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
    
    var formatGraphData = function(expenses, withdraw_limit) {
        return {
            expenses: expenses,
            withdraw_limit: withdraw_limit
        }
    };
    
    var monthlyWithdrawalLimit = function(total_assets) {
        return WITHDRAWAL_RATE * total_assets / 12;
    };
    
    this.getMonthlyIncome = function() {
        return monthly_income;
    };
    
    this.setMonthlyIncome = function(new_monthly_income) {
        monthly_income = new_monthly_income;
    };
    
    this.getTotalAssets = function() {
        return total_assets;
    };
    
    this.setTotalAssets = function(new_total_assets) {
        total_assets = new_total_assets;
    };
    
    this.getMonthlyExpenses = function() {
        return monthly_expenses;
    };
    
    this.setMonthlyExpenses = function(new_monthly_expenses) {
        monthly_expenses = new_monthly_expenses;
    };
    
});    