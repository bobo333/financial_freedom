describe('Unit: DateService', function() {
    var DateService;

    beforeEach(module('FinancialFreedom'));

    beforeEach(inject(function(_DateService_) {
        DateService = _DateService_
    }));

    // calculateDaysBetween
    it('should return 0 for two dates of the same day', function() {
        var date1 = new Date();
        var date2 = new Date();

        var days_between = DateService.calculateDaysBetween(date1, date2);

        expect(days_between).toBe(0);
    });

    it('should return 3 for days between January 1st and 4th', function() {
        var date1 = new Date(2014, 0, 1);
        var date2 = new Date(2014, 0, 4);

        var days_between = DateService.calculateDaysBetween(date1, date2);

        expect(days_between).toBe(3);
    });

    it('should return 31 for days between January 1st and February 1st', function() {
        var date1 = new Date(2014, 0, 1);
        var date2 = new Date(2014, 1, 1);

        var days_between = DateService.calculateDaysBetween(date1, date2);

        expect(days_between).toBe(31);
    });

    it('should return 365 for days between January 1st, 2013 and January 1st, 2014', function() {
        var date1 = new Date(2013, 0, 1);
        var date2 = new Date(2014, 0, 1);

        var days_between = DateService.calculateDaysBetween(date1, date2);

        expect(days_between).toBe(365);
    });

    // addDaysToDate
    it('should return the same date for 0 days', function() {
        var date1 = new Date();
        var date2 = new Date();

        DateService.addDaysToDate(date1, 0);

        expect(date1.getTime()).toBe(date2.getTime());
    });

    it('should return the next day 1 days', function() {
        var date1 = new Date(2013, 0, 1);
        var date2 = new Date(2013, 0, 2);

        DateService.addDaysToDate(date1, 1);

        expect(date1.getTime()).toBe(date2.getTime());
    });

    it('should return February 1st for 31 days added to January 1st', function() {
        var date1 = new Date(2013, 0, 1);
        var date2 = new Date(2013, 1, 1);

        DateService.addDaysToDate(date1, 31);

        expect(date1.getTime()).toBe(date2.getTime());
    });

    it('should return the next year for 365 days', function() {
        var date1 = new Date(2013, 0, 1);
        var date2 = new Date(2014, 0, 1);

        DateService.addDaysToDate(date1, 365);

        expect(date1.getTime()).toBe(date2.getTime());
    });
});