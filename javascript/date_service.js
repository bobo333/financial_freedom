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

        var difference_yr = date2_yr - date1_yr;
        
        return this.isNewDifference(difference_yr) ? difference_yr : null;
    };

    this.isNewDifference = function(difference_yr) {

        if (typeof last_diff == 'undefined') {
            last_diff = difference_yr
        }

        if (difference_yr == last_diff) {
            return false;
        }
        else {
            last_diff = difference_yr
            return true;
        }
    };
});