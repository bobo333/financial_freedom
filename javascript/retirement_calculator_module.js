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
        var retirement_data = this.initialRetirementData();
        calculateRetirementTrajectory(retirement_data);
        
        if (retirement_data.can_retire) {
            padGraphData(retirement_data);
        }
                
        return retirement_data;
    };
    
    var calculateRetirementTrajectory = function(retirement_data) {        
        while (!checkIfCanRetire(retirement_data) && retirement_data.months < MONTH_MAX) {            
            addNextGraphPoint(retirement_data);
        }
        
        if (retirement_data.months < MONTH_MAX) {
            retirement_data.can_retire = true;
        }
    };
    
    var padGraphData = function(retirement_data) {
        var points_to_add = retirement_data.data_to_graph.length / 2;
    
        for (i=0; i < points_to_add; i++) {
            addNextGraphPoint(retirement_data);
        }
    };
    
    var checkIfCanRetire = function(retirement_data) {
        var investment_amount = retirement_data.total_assets;
        var annual_expenses = retirement_data.monthly_expenses * 12;
        
        return WITHDRAWAL_RATE * investment_amount >= annual_expenses;
    };
    
    var addNextGraphPoint = function(retirement_data) {
        var monthly_withdrawal_limit = calculateMonthlyWithdrawalLimit(retirement_data.total_assets);
        var graph_data = formatGraphData(retirement_data.monthly_expenses, monthly_withdrawal_limit);
        retirement_data.data_to_graph.push(graph_data);
        
        updateTotalAssets(retirement_data);
        updateMonthlyExpenses(retirement_data);
        retirement_data.months++;
        
        if (newYear(retirement_data.months)) {
            updateMonthlyIncome(retirement_data);
        }
    };
    
    var updateTotalAssets = function(retirement_data) {
        var total_assets = retirement_data.total_assets;
        var pay = retirement_data.monthly_income;
        var expenses = retirement_data.monthly_expenses;
        var interest_rate = retirement_data.monthly_growth_rate;
        
        retirement_data.total_assets = addInterest(total_assets, interest_rate) + pay - expenses;
    };
    
    var updateMonthlyExpenses = function(retirement_data) {
        var monthly_expenses = retirement_data.monthly_expenses;
        var monthly_inflation_rate = retirement_data.monthly_inflation_rate;
        
        retirement_data.monthly_expenses = addInterest(monthly_expenses, monthly_inflation_rate);
    };
    
    var updateMonthlyIncome = function(retirement_data) {
        var monthly_income = retirement_data.monthly_income;
    
        retirement_data.monthly_income = addInterest(monthly_income, INCOME_INCREASE_RATE);
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
    
    var calculateMonthlyWithdrawalLimit = function(total_assets) {
        return WITHDRAWAL_RATE * total_assets / 12;
    };
    
    var newYear = function(months) {
        return months % 12 === 0;
    };
    
    this.initialRetirementData = function() {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        
        return {
            months: 0,
            data_to_graph: [],
            total_assets: total_assets,
            monthly_income: monthly_income,
            monthly_expenses: monthly_expenses,
            can_retire: false,
            monthly_inflation_rate: MONTHLY_INFLATION_RATE,
            monthly_growth_rate: MONTHLY_GROWTH_RATE
        };
    };
    
    this.calculatePeriodInterestRate = function(overall_rate, number_of_periods) {
        base = overall_rate + 1;
        exponent = 1 / number_of_periods;
        return Math.pow((base), (exponent)) - 1;
    };
    
});    