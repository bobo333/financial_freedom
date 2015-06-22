FinancialFreedom.service('DateService', function() {
    this.calculateDaysBetween = function(date1, date2) {
        var one_day = 1000*60*60*24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        var difference_ms = date2_ms - date1_ms;

        return Math.round(difference_ms/one_day);
    };

    this.addDaysToDate = function(date, days) {
        date.setDate(date.getDate() + days);
    };

    this.calculateYearsBetween = function(date1, date2) {
        var date1_yr = date1.getFullYear();
        var date2_yr = date2.getFullYear();

        return date2_yr - date1_yr;
    };

    this.calculateDateDifference = function(dateFrom, dateTo) {
        var from = {
            d: dateFrom.getDate(),
            m: dateFrom.getMonth() + 1,
            y: dateFrom.getFullYear()
        };

        var to = {
            d: dateTo.getDate(),
            m: dateTo.getMonth() + 1,
            y: dateTo.getFullYear()
        };

        var daysFebruary = to.y % 4 != 0 || (to.y % 100 == 0 && to.y % 400 != 0)? 28 : 29;
        var daysInMonths = [0, 31, daysFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (to.d < from.d) {
            to.d   += daysInMonths[parseInt(to.m)];
            from.m += 1;
        }
        if (to.m < from.m) {
            to.m   += 12;
            from.y += 1;
        }

        return {
            days:   to.d - from.d,
            months: to.m - from.m,
            years:  to.y - from.y
        };
    };
});