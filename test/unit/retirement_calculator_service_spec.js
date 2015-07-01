describe('Unit: RetirementCalculatorService', function() {
    var RetirementCalculatorService;
    var mockUserDataCache;
    var mockUserDataCacheSvc;

    beforeEach(module('FinancialFreedom'));

    beforeEach(inject(function(_RetirementCalculatorService_, _UserDataCache_) {

        RetirementCalculatorService = _RetirementCalculatorService_;
        UserDataCache = _UserDataCache_;

    }));

    beforeEach(module(function($provide) {
        
        var userData = {
            total_assets: null,
            monthly_income: null,
            monthly_expenses: null,
            monthly_inflation_rate: 0.002870898719076642,
            monthly_growth_rate: 0.006044919024291717,
            monthly_expenses_increase_rate: 0.002870898719076642,
            income_increase_rate: 0.05,
            expenses_increase_rate: 0.035,
            growth_rate: 0.075
        };
        
        mockUserDataCacheSvc = {

            getUserData: function() {
                return userData;
            },

            setUserData: function(monthly_income, total_assets, monthly_expenses) {

                userData.monthly_income = monthly_income;
                userData.total_assets = total_assets;
                userData.monthly_expenses = monthly_expenses;
            }

        };

        $provide.value('UserDataCache', mockUserDataCacheSvc);

    }));

        

    // beforeEach(function($provide) {
    //     // fakeRetirementData = {
    //     //     months: 0,
    //     //     graph_points: [],
    //     //     total_assets: null,
    //     //     monthly_income: null,
    //     //     monthly_expenses: null,
    //     //     can_retire: false,
    //     //     monthly_inflation_rate: 0.002870898719076642,
    //     //     monthly_growth_rate: 0.006044919024291717,
    //     //     monthly_expenses_increase_rate: 0.002870898719076642,
    //     //     income_increase_rate: 0.05,
    //     //     expenses_increase_rate: 0.035,
    //     //     growth_rate: 0.075
    //     // };

    // });
    
    // calculateRetirementInfo
    it('should have calculateRetirementInfo function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateRetirementInfo)).toBe(true);
    });
    
    it('should return 1200 months for zero net worth and zero income from calculatMonthsToRetirement', function() {


        mockUserDataCacheSvc.setUserData(0, 0, 5000);

        // fakeRetirementData.total_assets = 0;
        // fakeRetirementData.monthly_income = 0;
        // fakeRetirementData.monthly_expenses = 5000;

        // spyOn(RetirementCalculatorService,'initialRetirementData').and.returnValue(fakeRetirementData);

        var val = RetirementCalculatorService.calculateRetirementInfo();

        expect(val.months).toBe(1200);

    });

    // it('should decrease months to retirement when income increase rate increases', function() {

    //     fakeRetirementData.total_assets = 250000;
    //     fakeRetirementData.monthly_income = 6000;
    //     fakeRetirementData.monthly_expenses = 1500;
    //     fakeRetirementData.income_increase_rate = 0.05;

    //     var i = 0;

    //     spyOn(RetirementCalculatorService,'initialRetirementData').and.callFake(function() {

    //         i++;

    //         if (i == 2) {
    //             fakeRetirementData.income_increase_rate *= 1.2;
    //         }

    //         return fakeRetirementData;
    //     });

    //     var old_val = RetirementCalculatorService.calculateRetirementInfo();

    //     var new_val = RetirementCalculatorService.calculateRetirementInfo();

    //     expect(new_val.months).toBeLessThan(old_val.months);
    // });

    // it('should increase months to retirement when expenses increase rate increases', function() {
    //     RetirementCalculatorService.setTotalAssets(250000);
    //     RetirementCalculatorService.setMonthlyIncome(6000);
    //     RetirementCalculatorService.setMonthlyExpenses(1500);
    //     var expenses_increase = RetirementCalculatorService.getExpensesIncreaseRate();
    //     var old_val = RetirementCalculatorService.calculateRetirementInfo();

    //     RetirementCalculatorService.setExpensesIncreaseRate(expenses_increase*1.5);
    //     var new_val = RetirementCalculatorService.calculateRetirementInfo();

    //     expect(new_val.months).toBeGreaterThan(old_val.months);
    // });

    // it('should decrease months to retirement when growth rate increases', function() {
    //     RetirementCalculatorService.setTotalAssets(250000);
    //     RetirementCalculatorService.setMonthlyIncome(6000);
    //     RetirementCalculatorService.setMonthlyExpenses(1500);
    //     var growth_rate = RetirementCalculatorService.getGrowthRate();
    //     var old_val = RetirementCalculatorService.calculateRetirementInfo();

    //     RetirementCalculatorService.setGrowthRate(growth_rate*1.5);
    //     var new_val = RetirementCalculatorService.calculateRetirementInfo();

    //     expect(new_val.months).toBeLessThan(old_val.months);
    // });
    
    // it('should return 0 months for someone with no expenses and positive net worth from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(50000);
    //     RetirementCalculatorService.setMonthlyIncome(0);
    //     RetirementCalculatorService.setMonthlyExpenses(0);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.months).toBe(0);
    // });
    
    // it('should return 0 months for someone with no expenses and positive take home pay from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(0);
    //     RetirementCalculatorService.setMonthlyIncome(1000);
    //     RetirementCalculatorService.setMonthlyExpenses(0);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.months).toBe(0);
    // });
    
    // it('should return within a reasonable range of months for someone who has normal expenses, salary, and net worth from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
    
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.months).toBeLessThan(300);
    //     expect(val.months).toBeGreaterThan(12);
    // });
    
    // it('should return can_retire false for zero net worth and zero income from calculatMonthsToRetirement', function() {
    //     RetirementCalculatorService.setTotalAssets(0);
    //     RetirementCalculatorService.setMonthlyIncome(0);
    //     RetirementCalculatorService.setMonthlyExpenses(5000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.can_retire).toBe(false);
    // });
    
    // it('should return can_retire_immediately true for someone with no expenses and positive net worth from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(50000);
    //     RetirementCalculatorService.setMonthlyIncome(0);
    //     RetirementCalculatorService.setMonthlyExpenses(0);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.can_retire_immediately).toBe(true);
    // });
    
    // it('should return can_retire_immediately true for someone with no expenses and positive take home pay from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(0);
    //     RetirementCalculatorService.setMonthlyIncome(1000);
    //     RetirementCalculatorService.setMonthlyExpenses(0);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.can_retire_immediately).toBe(true);
    // });
    
    // it('should return can_retire true for someone who has normal expenses, salary, and net worth from calculateRetirementInfo', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
    
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     expect(val.can_retire).toBe(true);
    // });

    // it('should have the date of the first point to graph be the same month and year as now for someone who can not retire immediately', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     var first_date = val.graph_points[0].date;
    //     var now = new Date();
        
    //     expect(first_date.getMonth()).toBe(now.getMonth());
    //     expect(first_date.getYear()).toBe(now.getYear());
    // });
    
    // it('should have the date of the last point to graph be in the future by the x months where x is the number of points to graph minus 1', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     var number_of_points = val.graph_points.length - 1;
    //     var last_date = val.graph_points[number_of_points].date;
    //     var future_date = new Date();
    //     future_date.setMonth(future_date.getMonth() + number_of_points);
        
    //     expect(last_date.getMonth()).toBe(future_date.getMonth());
    //     expect(last_date.getYear()).toBe(future_date.getYear());
    // });
    
    // it('should have an intersection point for reasonable data', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
        
    //     expect(val.intersection_point).not.toBe(undefined);
    // });
    
    // it('should have intersection date value less than current date + months to retirement', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     var retirement_date = new Date();
    //     retirement_date.setMonth(retirement_date.getMonth() + val.months);
        
    //     expect(val.intersection_point.x).toBeLessThan(retirement_date);
    // });
    
    // it('should have intersection date value greater than current date + months to retirement - 1', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var val = RetirementCalculatorService.calculateRetirementInfo();
    //     var retirement_date = new Date();
    //     retirement_date.setMonth(retirement_date.getMonth() + val.months - 1);
        
    //     expect(val.intersection_point.x).toBeGreaterThan(retirement_date);
    // });

    // it('should have intersection dollar value less than current date + months to retirement value', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var retire_data = RetirementCalculatorService.calculateRetirementInfo();
    //     var months = retire_data.months;
    //     var retirement_dollars = retire_data.graph_points[months].withdraw_limit;
    //     var intersection_dollars = retire_data.intersection_point.y;
        
    //     expect(intersection_dollars).toBeLessThan(retirement_dollars);
    // });

    // it('should have intersection dollar value greater than current date + months - 1 to retirement value', function() {
    //     RetirementCalculatorService.setTotalAssets(52000);
    //     RetirementCalculatorService.setMonthlyIncome(5000);
    //     RetirementCalculatorService.setMonthlyExpenses(2000);
        
    //     var retire_data = RetirementCalculatorService.calculateRetirementInfo();
    //     var before_months = retire_data.months - 1;
    //     var before_retirement_dollars = retire_data.graph_points[before_months].withdraw_limit;
    //     var intersection_dollars = retire_data.intersection_point.y;
        
    //     expect(intersection_dollars).toBeGreaterThan(before_retirement_dollars);
    // });
    
    function objectIndexOf(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            var cur_obj = arr[i];
            if (cur_obj.expenses == obj.expenses && cur_obj.withdraw_limit == obj.withdraw_limit) {
                return i;
            }
        }
        
        return -1;
    }
    
});