describe('Unit: DollarsToTimeService', function() {
    var DollarsToTimeService;
    var userData;

    beforeEach(module('FinancialFreedom', function($provide) {

        userData = {
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
            userData: {
                getUserData: function() {
                    return userData;
                }
            }
        };

        $provide.value('UserDataCache', mockUserDataCacheSvc);
    }));

    beforeEach(inject(function(_DollarsToTimeService_) {
        DollarsToTimeService = _DollarsToTimeService_;
    }));

    it('should have calculateDollarsToTime function', function() {
        expect(angular.isFunction(DollarsToTimeService.calculateDollarsToTime)).toBe(true);
    });

    it('should return 0 years, 0 months, and 0 days for 0 recurring expense', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 0;
        expense = true;
        recurring = true;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(0);
        expect(result.difference.months).toBe(0);
        expect(result.difference.days).toBe(0);
    });

    it('should return 0 years, 0 months, and 0 days for 0 single expense', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 0;
        expense = true;
        recurring = false;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(0);
        expect(result.difference.months).toBe(0);
        expect(result.difference.days).toBe(0);
    });

    it('should return 0 years, 0 months, and 0 days for 0 recurring income', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 0;
        expense = false;
        recurring = true;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(0);
        expect(result.difference.months).toBe(0);
        expect(result.difference.days).toBe(0);
    });

    it('should return 0 years, 0 months, and 0 days for 0 single income', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 0;
        expense = false;
        recurring = false;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(0);
        expect(result.difference.months).toBe(0);
        expect(result.difference.days).toBe(0);
    });

    it('should return greater time for recurring expense than income of equal amount', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 500;
        expense = true;
        recurring = true;

        var expense_result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);
        expense = false;
        var income_result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        var expense_time = 365 * expense_result.difference.years + 30 * expense_result.difference.months + expense_result.difference.days;
        var income_time = 365 * income_result.difference.years + 30 * income_result.difference.months + income_result.difference.days;

        expect(expense_time).toBeGreaterThan(income_time);
    });

    it('should return 1 year, 1 month, and 28 days for 500 recurring income', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 500;
        expense = false;
        recurring = true;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(1);
        expect(result.difference.months).toBe(1);
        expect(result.difference.days).toBe(28);
    });

    it('should return 3 years, 4 months, and 9 days for 500 recurring expense', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 500;
        expense = true;
        recurring = true;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(3);
        expect(result.difference.months).toBe(4);
        expect(result.difference.days).toBe(9);
    });

    it('should return 2 years, 0 months, and 23 days for 100,000 single income', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 100000;
        expense = false;
        recurring = false;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(2);
        expect(result.difference.months).toBe(0);
        expect(result.difference.days).toBe(23);
    });

    it('should return 2 years, 2 months, and 0 days for 100,000 single expense', function() {
        userData.total_assets = 95000;
        userData.monthly_income = 5500;
        userData.monthly_expenses = 2500;

        amount = 100000;
        expense = true;
        recurring = false;

        var result = DollarsToTimeService.calculateDollarsToTime(amount, expense, recurring);

        expect(result.difference.years).toBe(2);
        expect(result.difference.months).toBe(2);
        expect(result.difference.days).toBe(0);
    });
});