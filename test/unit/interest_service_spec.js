describe('Unit: InterestService', function() {
    var InterestService;

    beforeEach(module('FinancialFreedom'));

    beforeEach(inject(function(_InterestService_) {
        InterestService = _InterestService_
    }));

    // addInterest
    it('should have addInterest function', function() {
        expect(angular.isFunction(InterestService.addInterest)).toBe(true);
    });

    it('should add nothing if rate is 0', function() {
        var total = 10;
        var new_total = InterestService.addInterest(total, 0);
        expect(new_total).toBe(total);
    });

    it('should double if the rate is 1', function() {
        var total = 10;
        var new_total = InterestService.addInterest(total, 1);
        expect(new_total).toBe(2 * total);
    });

    it('should be 1.5 times if rate is .5', function() {
        var total = 10;
        var new_total = InterestService.addInterest(total, .5);
        expect(new_total).toBe(1.5 * total);
    });

    it('should be half if rate is -.5', function() {
        var total = 10;
        var new_total = InterestService.addInterest(total, -0.5);
        expect(new_total).toBe(0.5 * total);
    });

    // calculatePeriodInterestRate
    it('should have calculatePeriodInterestRate function', function() {
        expect(angular.isFunction(InterestService.calculatePeriodInterestRate)).toBe(true);
    });
    
    it('should convert 10% annual to .797% monthly from calculatePeriodInterestRate', function() {
        var val = InterestService.calculatePeriodInterestRate(.10, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00797);
    });
    
    it('should convert 6% annual to .487% monthly from calculatePeriodInterestRate', function() {
        var val = InterestService.calculatePeriodInterestRate(.06, 12);
        rounded = Math.round(val * 100000) / 100000;
        expect(rounded).toBe(.00487);
    });
});