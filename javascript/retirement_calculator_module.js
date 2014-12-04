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

    this.calculateMonthsToRetirement = function() {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        
        var retirement_data = {
            months: 0,
            data_to_graph: [],
            total_assets: total_assets,
            monthly_income: monthly_income,
            monthly_expenses: monthly_expenses,
            can_retire: false,
            monthly_inflation_rate: MONTHLY_INFLATION_RATE,
            monthly_growth_rate: MONTHLY_GROWTH_RATE
        };
        
        calculateRetirementTrajectory(retirement_data);
        
        if (retirement_data.can_retire) {
            padGraphData(retirement_data);
        }
                
        return retirement_data;
    };
    
    this.calculatePeriodInterestRate = function(overall_rate, number_of_periods) {
        base = overall_rate + 1;
        exponent = 1 / number_of_periods;
        return Math.pow((base), (exponent)) - 1;
    };
    
    var calculateRetirementTrajectory = function(retirement_data) {
        var MONTHLY_INFLATION_RATE = retirement_data.monthly_inflation_rate;
        var MONTHLY_GROWTH_RATE = retirement_data.monthly_growth_rate;
        
        while (!checkIfCanRetire(retirement_data.total_assets, retirement_data.monthly_expenses * 12) && retirement_data.months < MONTH_MAX) {            
            var monthly_withdrawal_limit = monthlyWithdrawalLimit(retirement_data.total_assets);
            var graph_data = formatGraphData(retirement_data.monthly_expenses, monthly_withdrawal_limit);
            retirement_data.data_to_graph.push(graph_data);
            
            retirement_data.total_assets = updateTotalAssets(retirement_data.total_assets, retirement_data.monthly_income, retirement_data.monthly_expenses, MONTHLY_GROWTH_RATE);
            retirement_data.monthly_expenses = addInterest(retirement_data.monthly_expenses, MONTHLY_INFLATION_RATE);
            retirement_data.months++;
            
            if (newYear(retirement_data.months)) {
                retirement_data.monthly_income = addInterest(retirement_data.monthly_income, INCOME_INCREASE_RATE);
            }
        }
        
        if (retirement_data.months < MONTH_MAX) {
            retirement_data.can_retire = true;
        }
    };
    
    var padGraphData = function(retirement_data) {
        var MONTHLY_INFLATION_RATE = retirement_data.monthly_inflation_rate;
        var MONTHLY_GROWTH_RATE = retirement_data.monthly_growth_rate;
        var points_to_add = retirement_data.data_to_graph.length / 2;
    
        for (i=0; i < points_to_add; i++) {
            var monthly_withdrawal_limit = monthlyWithdrawalLimit(retirement_data.total_assets);
            var graph_data = formatGraphData(retirement_data.monthly_expenses, monthly_withdrawal_limit);
            retirement_data.data_to_graph.push(graph_data);
            
            retirement_data.total_assets = updateTotalAssets(retirement_data.total_assets, retirement_data.monthly_income, retirement_data.monthly_expenses, MONTHLY_GROWTH_RATE);
            retirement_data.monthly_expenses = addInterest(retirement_data.monthly_expenses, MONTHLY_INFLATION_RATE);
            retirement_data.months++;
            
            if (newYear(retirement_data.months)) {
                retirement_data.monthly_income = addInterest(retirement_data.monthly_income, INCOME_INCREASE_RATE);
            }
        }
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
    
    var newYear = function(months) {
        return months % 12 === 0;
    };
    
});    