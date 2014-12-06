var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
    var WITHDRAWAL_RATE = .04;
    var INFLATION_RATE = .035;
    var INCOME_INCREASE_RATE = .05;
    var GROWTH_RATE = .075;
    var MAX_YEARS = 100;
    var MAX_MONTHS = MAX_YEARS * 12;
    
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

    this.calculateRetirementInfo = function() {
        var retirement_data = this.initialRetirementData();
        calculateRetirementTrajectory(retirement_data);
        
        if (retirement_data.can_retire) {
            addPointsForIntersection(retirement_data);
            addIntersectionPoint(retirement_data);
            padGraphData(retirement_data);
        }
                
        return retirement_data;
    };
    
    var calculateRetirementTrajectory = function(retirement_data) {
        if (canRetire(retirement_data)) {
            return setImmediateRetirement(retirement_data);
        };
    
        while (retirement_data.months < MAX_MONTHS) {
            addNextGraphPoint(retirement_data);
            incrementMonthCount(retirement_data);
            
            if (canRetire(retirement_data)) {
                addNextGraphPoint(retirement_data);
                retirement_data.can_retire = true;
                break;
            };
        }
    };
    
    var addPointsForIntersection = function(retirement_data) {
        var points_for_intersection = retirement_data.graph_points.slice(-2);
        retirement_data.points_for_intersection = points_for_intersection;
    };
    
    var padGraphData = function(retirement_data) {
        var points_to_add = retirement_data.graph_points.length / 2;
    
        for (i=0; i < points_to_add; i++) {
            addNextGraphPoint(retirement_data);
        }
    };
    
    var addIntersectionPoint = function(retirement_data) {
        var points_for_intersection = retirement_data.points_for_intersection;
        var first_withdraw_value = points_for_intersection[0].withdraw_limit;
        var second_withdraw_value = points_for_intersection[1].withdraw_limit;
        var first_expense_value = points_for_intersection[0].expenses;
        var second_expense_value = points_for_intersection[1].expenses;
        var before_date = points_for_intersection[0].date;
        var after_date = points_for_intersection[1].date;
        
        // calculate intersection point
        var days_between = calculateDaysBetween(before_date, after_date);
        var expense_slope = calculateSlope(first_expense_value, second_expense_value, days_between);
        var withdraw_slope = calculateSlope(first_withdraw_value, second_withdraw_value, days_between);
        var expense_line_data = formatLineData(days_between, second_expense_value, expense_slope);
        var withdraw_line_data = formatLineData(days_between, second_withdraw_value, withdraw_slope);
        var x_intersection = calculateXIntersection(expense_line_data, withdraw_line_data);
        var y_intersection = calculateYIntersection(expense_line_data, withdraw_line_data);
        var intersection_date = getIntersectionDate(before_date, x_intersection);
        var intersection_point = formatIntersectionPoint(intersection_date, y_intersection);
        
        retirement_data.intersection_point = intersection_point;
    };
    
    var canRetire = function(retirement_data) {
        var investment_amount = retirement_data.total_assets;
        var annual_expenses = retirement_data.monthly_expenses * 12;
        
        return WITHDRAWAL_RATE * investment_amount >= annual_expenses;
    };
    
    var setImmediateRetirement = function(retirement_data) {
        retirement_data.can_retire_immediately = true;
    };
    
    var addNextGraphPoint = function(retirement_data) {
        var month_date = getNextMonthDate(retirement_data);
        var monthly_withdrawal_limit = calculateMonthlyWithdrawalLimit(retirement_data.total_assets);
        var graph_point = formatGraphData(month_date, retirement_data.monthly_expenses, monthly_withdrawal_limit);
        retirement_data.graph_points.push(graph_point);
        
        updateTotalAssets(retirement_data);
        updateMonthlyExpenses(retirement_data);
        
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
        var expenses = retirement_data.monthly_expenses;
        var inflation_rate = retirement_data.monthly_inflation_rate;
        
        retirement_data.monthly_expenses = addInterest(expenses, inflation_rate);
    };
    
    var updateMonthlyIncome = function(retirement_data) {
        var monthly_income = retirement_data.monthly_income;
    
        retirement_data.monthly_income = addInterest(monthly_income, INCOME_INCREASE_RATE);
    };
    
    var addInterest = function(original_total, interest_rate) {
        return original_total * (1 + interest_rate);
    };
    
    var formatGraphData = function(date, expenses, withdraw_limit) {
        return {
            date: date,
            expenses: expenses,
            withdraw_limit: withdraw_limit
        }
    };
    
    var formatIntersectionPoint = function(intersection_date, y_intersection) {
        return {
            x: intersection_date,
            y: y_intersection
        };
    };
    
    var formatLineData = function(x, y, m) {
        return {
            x: x,
            y: y,
            m: m
        };
    };
    
    var incrementMonthCount = function(retirement_data) {
        retirement_data.months++;
    };
    
    var getNextMonthDate = function(retirement_data) {
        date = new Date();
        months_in_future = retirement_data.graph_points.length;
        date.setMonth(date.getMonth() + months_in_future);
        
        return date;
    };
    
    var getIntersectionDate = function(start_date, x_intersection) {
        var intersection_date = start_date;
        var days_to_add = Math.round(x_intersection);
        
        addDaysToDate(intersection_date, days_to_add);
        
        return intersection_date;
    };
    
    var calculateMonthlyWithdrawalLimit = function(total_assets) {
        return WITHDRAWAL_RATE * total_assets / 12;
    };
    
    var newYear = function(months) {
        return months % 12 === 0;
    };
    
    var calculateXIntersection = function(line1, line2) {
        return (line1.m * line1.x - line2.m * line2.x + line2.y - line1.y) / (line1.m - line2.m);
    };
    
    var calculateYIntersection = function(line1, line2) {
        return (line1.m * line2.m * (line2.x - line1.x) + line1.y * line2.m - line2.y * line1.m) / (line2.m - line1.m)
    };
    
    var calculateSlope = function(y1, y2, dx) {
        return (y2 - y1) / dx;
    };
    
    var calculateDaysBetween = function(date1, date2) {
        var one_day=1000*60*60*24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        var difference_ms = date2_ms - date1_ms;

        return Math.round(difference_ms/one_day); 
    };
    
    var addDaysToDate = function(date, days) {
        date.setDate(date.getDate() + days);
    };
    
    this.initialRetirementData = function() {
        var MONTHLY_INFLATION_RATE = this.calculatePeriodInterestRate(INFLATION_RATE, 12);
        var MONTHLY_GROWTH_RATE = this.calculatePeriodInterestRate(GROWTH_RATE, 12);
        
        return {
            months: 0,
            graph_points: [],
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