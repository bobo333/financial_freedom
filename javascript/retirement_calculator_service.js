FinancialFreedom.service('RetirementCalculatorService', ['InterestService', function(InterestService) {
    var withdrawal_rate = .04;
    var inflation_rate = .035;
    var income_increase_rate = .05;
    var expenses_increase_rate = inflation_rate;
    var growth_rate = .075;
    var MAX_YEARS = 100;
    var MAX_MONTHS = MAX_YEARS * 12;
    
    var total_assets;
    var monthly_income;
    var monthly_expenses;
    
    // retirement
    this.getMonthlyIncome = function() {
        return monthly_income;
    };

    // retirement
    this.setMonthlyIncome = function(new_monthly_income) {
        monthly_income = new_monthly_income;
    };
    
    // retirement
    this.getTotalAssets = function() {
        return total_assets;
    };
    
    // retirement
    this.setTotalAssets = function(new_total_assets) {
        total_assets = new_total_assets;
    };
    
    // retirement
    this.getMonthlyExpenses = function() {
        return monthly_expenses;
    };
    
    // retirement
    this.setMonthlyExpenses = function(new_monthly_expenses) {
        monthly_expenses = new_monthly_expenses;
    };

    // retirement
    this.getInflationRate = function() {
        return inflation_rate;
    };

    // retirement
    this.setInflationRate = function(new_inflation_rate) {
        inflation_rate = new_inflation_rate;
    };

    // retirement
    this.getIncomeIncreaseRate = function() {
        return income_increase_rate;
    };

    // retirement
    this.setIncomeIncreaseRate = function(new_income_increase_rate) {
        income_increase_rate = new_income_increase_rate;
    };

    // retirement
    this.getExpensesIncreaseRate = function() {
        return expenses_increase_rate;
    };

    // retirement
    this.setExpensesIncreaseRate = function(new_expenses_increase_rate) {
        expenses_increase_rate = new_expenses_increase_rate;
    };

    // retirement
    this.getGrowthRate = function() {
        return growth_rate;
    };

    // retirement
    this.setGrowthRate = function(new_growth_rate) {
        growth_rate = new_growth_rate;
    };
    
    // retirement
    this.getInflationRate = function() {
        return inflation_rate;
    };

    // retirement
    this.setInflationRate = function(new_inflation_rate) {
        inflation_rate = new_inflation_rate;
    };

    // retirement
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
    
    // retirement
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
    
    // retirement
    var addPointsForIntersection = function(retirement_data) {
        var points_for_intersection = retirement_data.graph_points.slice(-2);
        retirement_data.points_for_intersection = points_for_intersection;
    };
    
    // retirement
    var padGraphData = function(retirement_data) {
        var points_to_add = retirement_data.graph_points.length / 6;
    
        for (i=0; i < points_to_add; i++) {
            addNextGraphPoint(retirement_data);
        }
    };
    
    // retirement?
    var addIntersectionPoint = function(retirement_data) {
        var points_for_intersection = retirement_data.points_for_intersection;
        var intersection_point = calculateIntersectionPoint(points_for_intersection);
        
        retirement_data.intersection_point = intersection_point;
    };
    
    // geometry?
    var calculateIntersectionPoint = function(points_for_intersection) {
        var before_values = points_for_intersection[0];
        var after_values = points_for_intersection[1];
        
        var days_between = calculateDaysBetween(before_values.date, after_values.date);
        var expense_slope = calculateSlope(before_values.expenses, after_values.expenses, days_between);
        var withdraw_slope = calculateSlope(before_values.withdraw_limit, after_values.withdraw_limit, days_between);
        var expense_line_data = formatLineData(days_between, after_values.expenses, expense_slope);
        var withdraw_line_data = formatLineData(days_between, after_values.withdraw_limit, withdraw_slope);
        var x_intersection = calculateXIntersection(expense_line_data, withdraw_line_data);
        var y_intersection = calculateYIntersection(expense_line_data, withdraw_line_data);
        var intersection_date = getIntersectionDate(before_values.date, x_intersection);
        
        return formatIntersectionPoint(intersection_date, y_intersection);
    };
    
    // retirement
    var canRetire = function(retirement_data) {
        var investment_amount = retirement_data.total_assets;
        var annual_expenses = retirement_data.monthly_expenses * 12;
        
        return withdrawal_rate * investment_amount >= annual_expenses;
    };
    
    // retirement
    var setImmediateRetirement = function(retirement_data) {
        retirement_data.can_retire_immediately = true;
    };
    
    // retirement
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
    
    // retirement
    var updateTotalAssets = function(retirement_data) {
        var total_assets = retirement_data.total_assets;
        var pay = retirement_data.monthly_income;
        var expenses = retirement_data.monthly_expenses;
        var interest_rate = retirement_data.monthly_growth_rate;
        
        retirement_data.total_assets = InterestService.addInterest(total_assets, interest_rate) + pay - expenses;
    };
    
    // retirement
    var updateMonthlyExpenses = function(retirement_data) {
        var expenses = retirement_data.monthly_expenses;

        retirement_data.monthly_expenses = InterestService.addInterest(expenses, retirement_data.monthly_expenses_increase_rate);
    };
    
    // retirement
    var updateMonthlyIncome = function(retirement_data) {
        var monthly_income = retirement_data.monthly_income;
    
        retirement_data.monthly_income = InterestService.addInterest(monthly_income, income_increase_rate);
    };
    
    // retirement
    var formatGraphData = function(date, expenses, withdraw_limit) {
        return {
            date: date,
            expenses: expenses,
            withdraw_limit: withdraw_limit
        }
    };
    
    // geometry
    var formatIntersectionPoint = function(intersection_date, y_intersection) {
        return {
            x: intersection_date,
            y: y_intersection
        };
    };
    
    // geometry
    var formatLineData = function(x, y, m) {
        return {
            x: x,
            y: y,
            m: m
        };
    };
    
    // retirement
    var incrementMonthCount = function(retirement_data) {
        retirement_data.months++;
    };
    
    // retirement?
    var getNextMonthDate = function(retirement_data) {
        date = new Date();
        months_in_future = retirement_data.graph_points.length;
        date.setMonth(date.getMonth() + months_in_future);
        
        return date;
    };
    
    // retirement?
    var getIntersectionDate = function(start_date, x_intersection) {
        var intersection_date = new Date(start_date.getTime());
        var days_to_add = Math.round(x_intersection);
        
        addDaysToDate(intersection_date, days_to_add);
        
        return intersection_date;
    };
    
    // retirement
    var calculateMonthlyWithdrawalLimit = function(total_assets) {
        return withdrawal_rate * total_assets / 12;
    };
    
    // retirement?
    var newYear = function(months) {
        return months % 12 === 0;
    };
    
    // geometry
    var calculateXIntersection = function(line1, line2) {
        return (line1.m * line1.x - line2.m * line2.x + line2.y - line1.y) / (line1.m - line2.m);
    };
    
    // geometry
    var calculateYIntersection = function(line1, line2) {
        return (line1.m * line2.m * (line2.x - line1.x) + line1.y * line2.m - line2.y * line1.m) / (line2.m - line1.m)
    };
    
    // geometry
    var calculateSlope = function(y1, y2, dx) {
        return (y2 - y1) / dx;
    };
    
    // retirement?
    var calculateDaysBetween = function(date1, date2) {
        var one_day=1000*60*60*24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        var difference_ms = date2_ms - date1_ms;

        return Math.round(difference_ms/one_day); 
    };
    
    // retirement?
    var addDaysToDate = function(date, days) {
        date.setDate(date.getDate() + days);
    };
    
    // retirement
    this.initialRetirementData = function() {
        var monthly_inflation_rate = InterestService.calculatePeriodInterestRate(inflation_rate, 12);
        var monthly_growth_rate = InterestService.calculatePeriodInterestRate(growth_rate, 12);
        var monthly_expenses_increase_rate = InterestService.calculatePeriodInterestRate(expenses_increase_rate, 12);
        
        return {
            months: 0,
            graph_points: [],
            total_assets: total_assets,
            monthly_income: monthly_income,
            monthly_expenses: monthly_expenses,
            can_retire: false,
            monthly_inflation_rate: monthly_inflation_rate,
            monthly_growth_rate: monthly_growth_rate,
            monthly_expenses_increase_rate: monthly_expenses_increase_rate
        };
    };
    
}]);