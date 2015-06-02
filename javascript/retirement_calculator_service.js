FinancialFreedom.service('RetirementCalculatorService', function(InterestService, GeometryService, DateService, UserDataService) {
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

    this.getMonthlyIncome = function() {
        return monthly_income;
    };

    this.setMonthlyIncome = function(new_monthly_income) {
        monthly_income = new_monthly_income;
        saveMonthlyIncome(monthly_income);     
    };

    var saveMonthlyIncome = function(monthly_income) {

        var new_monthly_income = {
            'monthly_income': monthly_income
        }

        UserDataService.data.updateUserData(new_monthly_income);
    }
    
    this.getTotalAssets = function() {
        return total_assets;
    };
    
    this.setTotalAssets = function(new_total_assets) {
        total_assets = new_total_assets;
        saveTotalAssets(total_assets);  
    };

    var saveTotalAssets = function(total_assets) {

        var new_total_assets = {
            'total_assets': total_assets
        }
        
        UserDataService.data.updateUserData(new_total_assets);
    }
    
    this.getMonthlyExpenses = function() {
        return monthly_expenses;
    };

    
    this.setMonthlyExpenses = function(new_monthly_expenses) {
        monthly_expenses = new_monthly_expenses;
        saveMonthlyExpenses(monthly_expenses);
    };

    var saveMonthlyExpenses = function(monthly_expenses) {

        var new_monthly_expenses = {
            'monthly_expenses': monthly_expenses
        }
        
        UserDataService.data.updateUserData(new_monthly_expenses);
    }

    this.getInflationRate = function() {
        return inflation_rate;
    };

    this.setInflationRate = function(new_inflation_rate) {
        inflation_rate = new_inflation_rate;
    };

    this.getIncomeIncreaseRate = function() {
        return income_increase_rate;
    };

    this.setIncomeIncreaseRate = function(new_income_increase_rate) {
        income_increase_rate = new_income_increase_rate;
        saveIncomeIncreaseRate(income_increase_rate);
    };

    var saveIncomeIncreaseRate = function(income_increase_rate) {

        var new_income_increase_rate = {
            'income_growth_rate': income_increase_rate
        }
        
        UserDataService.data.updateUserData(new_income_increase_rate);
    }

    this.getExpensesIncreaseRate = function() {
        return expenses_increase_rate;
    };

    this.setExpensesIncreaseRate = function(new_expenses_increase_rate) {
        expenses_increase_rate = new_expenses_increase_rate;
        saveExpensesIncreaseRate(expenses_increase_rate);
    };

    var saveExpensesIncreaseRate = function(expenses_increase_rate) {

        var new_expenses_increase_rate = {
            'expenses_growth_rate' : expenses_increase_rate
        }
        
        UserDataService.data.updateUserData(new_expenses_increase_rate );
    }

    this.getGrowthRate = function() {
        return growth_rate;
    };

    this.setGrowthRate = function(new_growth_rate) {
        growth_rate = new_growth_rate;
        saveGrowthRate(growth_rate);
    };

    var saveGrowthRate = function(growth_rate) {

        var new_growth_rate = {
            'investment_growth_rate' : growth_rate
        }

        UserDataService.data.updateUserData(new_growth_rate);

    }

    this.saveInitialContants = function() {

        var initial_constants = {
            'income_growth_rate': income_increase_rate,
            'expenses_growth_rate' : expenses_increase_rate,
            'investment_growth_rate' : growth_rate
        }

        UserDataService.data.updateUserData(initial_constants);
    }

    this.calculateRetirementInfo = function() {
        var retirement_data = this.initialRetirementData();
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
    
        retirement_data.monthly_income = InterestService.addInterest(monthly_income, income_increase_rate);
    };
    
    var formatGraphData = function(date, expenses, withdraw_limit) {
        return {
            date: date,
            expenses: expenses,
            withdraw_limit: withdraw_limit
        }
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
    
});