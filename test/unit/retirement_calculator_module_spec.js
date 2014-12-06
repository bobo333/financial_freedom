describe('Unit: RetirementCalculatorModule', function() {
    var RetirementCalculatorService;

    beforeEach(module('RetirementCalculatorModule'));
    
    beforeEach(inject(function(_RetirementCalculatorService_) {
        RetirementCalculatorService = _RetirementCalculatorService_;
    }));
    
    // calculatePeriodInterestRate
    it('should have calculatePeriodInterestRate function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculatePeriodInterestRate)).toBe(true);
    });
    
    it('should convert 10% annual to .797% monthly from calculatePeriodInterestRate', function() {
        var val = RetirementCalculatorService.calculatePeriodInterestRate(.10, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00797);
    });
    
    it('should convert 6% annual to .487% monthly from calculatePeriodInterestRate', function() {
        var val = RetirementCalculatorService.calculatePeriodInterestRate(.06, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00487);
    });
    
    // calculateRetirementInfo
    it('should have calculateRetirementInfo function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateRetirementInfo)).toBe(true);
    });
    
    it('should return 1200 months for zero net worth and zero income from calculatMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(5000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.months).toBe(1200);
    });
    
    it('should return 0 months for someone with no expenses and positive net worth from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(50000);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.months).toBe(0);
    });
    
    it('should return 0 months for someone with no expenses and positive take home pay from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(1000);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.months).toBe(0);
    });
    
    it('should return within a reasonable range of months for someone who has normal expenses, salary, and net worth from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.months).toBeLessThan(300);
        expect(val.months).toBeGreaterThan(12);
    });
    
    it('should return can_retire false for zero net worth and zero income from calculatMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(5000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.can_retire).toBe(false);
    });
    
    it('should return can_retire_immediately true for someone with no expenses and positive net worth from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(50000);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.can_retire_immediately).toBe(true);
    });
    
    it('should return can_retire_immediately true for someone with no expenses and positive take home pay from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(1000);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.can_retire_immediately).toBe(true);
    });
    
    it('should return can_retire true for someone who has normal expenses, salary, and net worth from calculateRetirementInfo', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.can_retire).toBe(true);
    });
    
    it('should return points_for_intersection for someone with reasonable financial values', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        expect(val.points_for_intersection).not.toBe(undefined);
    });
    
    it('should have points_for_intersection that are right at the point where withdrawal limit just exceeds expenses for someone with reasonable financial values', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var first_point = val.points_for_intersection[0];
        var second_point = val.points_for_intersection[1];
        
        expect(first_point.expenses).toBeGreaterThan(first_point.withdraw_limit);
        expect(second_point.expenses).toBeLessThan(second_point.withdraw_limit);
    });
    
    // This makes sense because the number of months starts at 0, so it is essentially 0 indexed
    // just like the list of data points to graph. Therefore the number of months to retirement
    // should be exactly the same as the index of the second point for intersection, which is 
    // the first point where safe withdraw amount exceeds expenses.
    it('should have index of second intersection point equal to number of months to retirement', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var second_point = val.points_for_intersection[1];
        var second_point_index = objectIndexOf(val.graph_points, second_point);
        
        expect(second_point_index).toBe(val.months);
    });
    
    it('should have month and year of second intersection point equal to date with number of months to retirement in the future', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var retirement_date = new Date();
        var second_point = val.points_for_intersection[1];
        var second_point_date = second_point.date;
        retirement_date.setMonth(retirement_date.getMonth() + val.months);
        
        expect(second_point_date.getYear()).toBe(retirement_date.getYear());
        expect(second_point_date.getMonth()).toBe(retirement_date.getMonth());
    });

    it('should have the date of the first point to graph be the same month and year as now for someone who can not retire immediately', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var first_date = val.graph_points[0].date;
        var now = new Date();
        
        expect(first_date.getMonth()).toBe(now.getMonth());
        expect(first_date.getYear()).toBe(now.getYear());
    });
    
    it('should have the date of the last point to graph be in the future by the x months where x is the number of points to graph minus 1', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var number_of_points = val.graph_points.length - 1;
        var last_date = val.graph_points[number_of_points].date;
        var future_date = new Date();
        future_date.setMonth(future_date.getMonth() + number_of_points);
        
        expect(last_date.getMonth()).toBe(future_date.getMonth());
        expect(last_date.getYear()).toBe(future_date.getYear());
    });
    
    it('should have an intersection point for reasonable data', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        
        expect(val.intersection_point).not.toBe(undefined);
    });
    
    it('should have intersection date value less than current date + months to retirement', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var retirement_date = new Date();
        retirement_date.setMonth(retirement_date.getMonth() + val.months);
        
        expect(val.intersection_point.x).toBeLessThan(retirement_date);
    });
    
    it('should have intersection date value greater than current date + months to retirement - 1', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var retirement_date = new Date();
        retirement_date.setMonth(retirement_date.getMonth() + val.months - 1);
        
        expect(val.intersection_point.x).toBeGreaterThan(retirement_date);
    });
    
    it('should have intersection y value less than values of second intersection point', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var y_intersection = val.intersection_point.y;
        var second_expense_value = val.points_for_intersection[1].expenses
        var second_withdraw_limit_value = val.points_for_intersection[1].withdraw_limit;
        
        expect(y_intersection).toBeLessThan(second_expense_value);
        expect(y_intersection).toBeLessThan(second_withdraw_limit_value);
    });
    
    it('should have intersection y value greater than values of first intersection point', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
        
        var val = RetirementCalculatorService.calculateRetirementInfo();
        var y_intersection = val.intersection_point.y;
        var first_expense_value = val.points_for_intersection[0].expenses
        var first_withdraw_limit_value = val.points_for_intersection[0].withdraw_limit;
        
        expect(y_intersection).toBeGreaterThan(first_expense_value);
        expect(y_intersection).toBeGreaterThan(first_withdraw_limit_value);
    });
    
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