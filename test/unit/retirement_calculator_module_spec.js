describe('Unit: RetirementCalculatorModule', function() {
    var RetirementCalculatorService;

    beforeEach(module('RetirementCalculatorModule'));
    
    beforeEach(inject(function(_RetirementCalculatorService_) {
        RetirementCalculatorService = _RetirementCalculatorService_;
    }));
    
    it('should have a calculateYearsToRetirement function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculateYearsToRetirement)).toBe(true);
    });
    
    it('should return 10000 for zero net worth and zero income', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(0, 0, 5000)).toBe(10000);
    });
    
    it('should return 0 for someone who has no expenses and positive income', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(0, 5000, 0)).toBe(0);
    });
    
    it('should return 0 for someone who has no expenses and positive net worth', function() {
        expect(RetirementCalculatorService.calculateYearsToRetirement(5000, 0, 0)).toBe(0);
    });
    
    it('should return a reasonable range for someone who has normal expenses, salary, and net worth', function() {
        var timeToRetire = RetirementCalculatorService.calculateYearsToRetirement(50000, 70000, 40000);
        expect(timeToRetire).toBeGreaterThan(0);
        expect(timeToRetire).toBeLessThan(100);
    });
    
    it('should have calculatePeriodInterestRate function', function() {
        expect(angular.isFunction(RetirementCalculatorService.calculatePeriodInterestRate)).toBe(true);
    });
    
    it('should convert 10% annual to .797% monthly', function() {
        val = RetirementCalculatorService.calculatePeriodInterestRate(.10, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00797);
    });
    
    it('should convert 6% annual to .487% monthly', function() {
    val = RetirementCalculatorService.calculatePeriodInterestRate(.06, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00487);
    });
    
    
    
});