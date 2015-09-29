FinancialFreedom.service('RetirementCalculatorService', function(InterestService, GeometryService, DateService, UserDataCache, INITIAL_CALCULATOR_CONSTANTS) {
    
    var withdrawal_rate = INITIAL_CALCULATOR_CONSTANTS.withdrawal_rate;
    var inflation_rate = INITIAL_CALCULATOR_CONSTANTS.inflation_rate;
    var MAX_YEARS = 100;
    var MAX_MONTHS = MAX_YEARS * 12;

    var getUserData = function() {
        return UserDataCache.userData.getUserData();
    };

    this.initialRetirementData = function(customData) {

        var userData = getUserData();
        var initialVals = angular.extend({}, userData);
        
        if (customData) { initialVals = angular.extend(initialVals, customData); }

        var monthly_inflation_rate = InterestService.calculatePeriodInterestRate(inflation_rate, 12);
        var monthly_growth_rate = InterestService.calculatePeriodInterestRate(initialVals.growth_rate, 12);
        var monthly_expenses_increase_rate = InterestService.calculatePeriodInterestRate(initialVals.expenses_increase_rate, 12);
        
        return {
            months: 0,
            graph_points: [],
            total_assets: initialVals.total_assets,
            monthly_income: initialVals.monthly_income,
            monthly_expenses: initialVals.monthly_expenses,
            can_retire: false,
            monthly_inflation_rate: monthly_inflation_rate,
            monthly_growth_rate: monthly_growth_rate,
            monthly_expenses_increase_rate: monthly_expenses_increase_rate,
            income_increase_rate: initialVals.income_increase_rate,
            expenses_increase_rate: initialVals.expenses_increase_rate,
            growth_rate: initialVals.growth_rate
        };
    };

    this.calculateRetirementInfo = function(retirement_data) {
        if (retirement_data === undefined) {
            retirement_data = this.initialRetirementData();
        }
        calculateRetirementTrajectory(retirement_data);
        
        if (retirement_data.can_retire) {
            addIntersectionPoint(retirement_data);
            padGraphData(retirement_data);
        }

        return retirement_data;
    };
    
    var calculateRetirementTrajectory = function(retirement_data) {
        if (canRetire(retirement_data)) {
            return setImmediateRetirement(retirement_data);
        }
    
        while (retirement_data.months < MAX_MONTHS) {
            addNextGraphPoint(retirement_data);
            incrementMonthCount(retirement_data);
            
            if (canRetire(retirement_data)) {
                addNextGraphPoint(retirement_data);
                retirement_data.can_retire = true;
                break;
            }
        }
    };
    
    var addIntersectionPoint = function(retirement_data) {
        var points_for_intersection = retirement_data.graph_points.slice(-2);
        retirement_data.intersection_point = calculateIntersectionPoint(points_for_intersection);
    };

    var padGraphData = function(retirement_data) {
        var points_to_add = retirement_data.graph_points.length / 6;
    
        for (i=0; i < points_to_add; i++) {
            addNextGraphPoint(retirement_data);
        }
    };
    
    var calculateIntersectionPoint = function(points_for_intersection) {
        var before_values = points_for_intersection[0];
        var after_values = points_for_intersection[1];
        
        var days_between = DateService.calculateDaysBetween(before_values.date, after_values.date);
        var expense_slope = GeometryService.calculateSlope(before_values.expenses, after_values.expenses, days_between);
        var withdraw_slope = GeometryService.calculateSlope(before_values.withdraw_limit, after_values.withdraw_limit, days_between);
        var expense_line_data = GeometryService.formatLineData(days_between, after_values.expenses, expense_slope);
        var withdraw_line_data = GeometryService.formatLineData(days_between, after_values.withdraw_limit, withdraw_slope);
        var intersection_point = GeometryService.calculateIntersection(expense_line_data, withdraw_line_data);
        
        var intersection_date = getIntersectionDate(before_values.date, intersection_point.x);
        
        return GeometryService.formatPoint(intersection_date, intersection_point.y);
    };
    
    var canRetire = function(retirement_data) {
        var investment_amount = retirement_data.total_assets;
        var annual_expenses = retirement_data.monthly_expenses * 12;
        
        return withdrawal_rate * investment_amount >= annual_expenses;
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
        
        if (retirement_data.months > 0 && newYear(retirement_data.months)) {
            updateMonthlyIncome(retirement_data);
        }
    };
    
    var updateTotalAssets = function(retirement_data) {
        var total_assets = retirement_data.total_assets;
        var pay = retirement_data.monthly_income;
        var expenses = retirement_data.monthly_expenses;
        var interest_rate = retirement_data.monthly_growth_rate;
        
        retirement_data.total_assets = InterestService.addInterest(total_assets, interest_rate) + pay - expenses;
    };
    
    var updateMonthlyExpenses = function(retirement_data) {
        var expenses = retirement_data.monthly_expenses;

        retirement_data.monthly_expenses = InterestService.addInterest(expenses, retirement_data.monthly_expenses_increase_rate);
    };
    
    var updateMonthlyIncome = function(retirement_data) {
        var monthly_income = retirement_data.monthly_income;
    
        retirement_data.monthly_income = InterestService.addInterest(monthly_income, retirement_data.income_increase_rate);
    };
    
    var formatGraphData = function(date, expenses, withdraw_limit) {
        return {
            date: date,
            expenses: expenses,
            withdraw_limit: withdraw_limit
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
        var intersection_date = new Date(start_date.getTime());
        var days_to_add = Math.round(x_intersection);
        
        DateService.addDaysToDate(intersection_date, days_to_add);
        
        return intersection_date;
    };
    
    var calculateMonthlyWithdrawalLimit = function(total_assets) {
        return withdrawal_rate * total_assets / 12;
    };
    
    var newYear = function(months) {
        return months % 12 === 0;
    };
    
    
});