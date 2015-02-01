FinancialFreedom.service('InterestService', function() {
    this.addInterest = function(original_total, interest_rate) {
        return original_total * (1 + interest_rate);
    };

    this.calculatePeriodInterestRate = function(overall_rate, number_of_periods) {
        base = overall_rate + 1;
        exponent = 1 / number_of_periods;
        return Math.pow((base), (exponent)) - 1;
    };
});