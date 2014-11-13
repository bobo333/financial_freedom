describe('Unit: RetirementCalculatorModule', function() {
    var RetirementCalculatorService;

    beforeEach(module('RetirementCalculatorModule'));
    
    beforeEach(inject(function(_RetirementCalculatorService_) {
        RetirementCalculatorService = _RetirementCalculatorService_;
    }));
    
    // calculateYearsToRetirement
    it('should have a calculateYearsToRetirement function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateYearsToRetirement)).toBe(true);
    });
    
    it('should return 10000 for zero net worth and zero income from calculateYearsToRetirement', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(0, 0, 5000)).toBe(10000);
    });
    
    it('should return 0 for someone who has no expenses and positive income from calculateYearsToRetirement', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(0, 5000, 0)).toBe(0);
    });
    
    it('should return 0 for someone who has no expenses and positive net worth from calculateYearsToRetirement', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(5000, 0, 0)).toBe(0);
    });
    
    it('should return within a reasonable range for someone who has normal expenses, salary, and net worth from calculateYearsToRetirement', function() {
        var timeToRetire = RetirementCalculatorService.calculateYearsToRetirement(50000, 70000, 40000);
        expect(timeToRetire).toBeGreaterThan(0);
        expect(timeToRetire).toBeLessThan(100);
    });
    
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
        var val = RetirementCalculatorService.calculateMonthsToRetirement(0, 0, 5000);
        expect(val).toBe(1200);
    });
    
    it('should return 0 for someone with no expenses and positive net worth from calculateMOnthsToRetirement', function() {
        var val = RetirementCalculatorService.calculateMonthsToRetirement(50000, 0, 0);
        expect(val).toBe(0);
    });
    
    it('should return 0 for someone with no expenses and positive take home pay from calculateMOnthsToRetirement', function() {
        var val = RetirementCalculatorService.calculateMonthsToRetirement(0, 1000, 0);
        expect(val).toBe(0);
    });
    
    it('should return within a reasonable range for someone who has normal expenses, salary, and net worth from calculateMonthsToRetirement', function() {
        var val = RetirementCalculatorService.calculateMonthsToRetirement(52000, 5000, 2000);
        expect(val).toBeLessThan(300);
        expect(val).toBeGreaterThan(12);

    });
    
});