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
    
    // calculateMonthsToRetirement
    it('should have calculateMonthsToRetirement function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateMonthsToRetirement)).toBe(true);
    });
    
    it('should return 1200 for zero net worth and zero income from calculatMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(5000);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(1200);
    });
    
    it('should return 0 for someone with no expenses and positive net worth from calculateMOnthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(50000);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(0);
    });
    
    it('should return 0 for someone with no expenses and positive take home pay from calculateMOnthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(0);
        RetirementCalculatorService.setMonthlyIncome(1000);
        RetirementCalculatorService.setMonthlyExpenses(0);
        
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBe(0);
    });
    
    it('should return within a reasonable range for someone who has normal expenses, salary, and net worth from calculateMonthsToRetirement', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months).toBeLessThan(300);
        expect(val.months).toBeGreaterThan(12);
    });
    
    it('should return the same number of data points to graph as number of months for 0 months', function() {
        RetirementCalculatorService.setTotalAssets(520);
        RetirementCalculatorService.setMonthlyIncome(0);
        RetirementCalculatorService.setMonthlyExpenses(0);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement();
        expect(val.months + 1).toBe(val.data_to_graph.length);
    });
    
    it('should return the same number of data points to graph as number of months for more than 0 months', function() {
        RetirementCalculatorService.setTotalAssets(52000);
        RetirementCalculatorService.setMonthlyIncome(5000);
        RetirementCalculatorService.setMonthlyExpenses(2000);
    
        var val = RetirementCalculatorService.calculateMonthsToRetirement(52000, 5000, 2000);
        expect(val.months + 1).toBe(val.data_to_graph.length);
    });
    
});