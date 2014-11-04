var RetirementCalculatorModule = angular.module('RetirementCalculatorModule', []);

RetirementCalculatorModule.service('RetirementCalculatorService', function() {
	var WITHDRAWAL_RATE = .04;
	var INFLATION_RATE = .035;
	var INCOME_INCREASE_RATE = .1;
	var GROWTH_RATE = .075;
	
	this.calculateYearsToRetirement = function(net_worth, annual_expenses, annual_salary) {
		var years = 0;
		
		while (!checkIfCanRetire(net_worth, annual_expenses)) {
			net_worth = updateNetWorth(net_worth, annual_expenses, annual_salary);
			annual_salary = updateAnnualSalary(annual_salary);
			annual_expenses = updateAnnualExpenses(annual_expenses);
			years++;
			
			if (years > 9999) {
				break;
			}
		}
		
		return years;
	};
	
	var checkIfCanRetire = function(investment_amount, expenses) {
		return WITHDRAWAL_RATE * investment_amount >= expenses;
	};
	
	var updateNetWorth = function(net_worth, annual_expenses, annual_salary) {
		return net_worth + net_worth * GROWTH_RATE + annual_salary - annual_expenses;
	};
	
	var updateAnnualSalary = function(annual_salary) {
		return annual_salary + annual_salary * INCOME_INCREASE_RATE;
	};
	
	var updateAnnualExpenses = function(annual_expenses) {
		return annual_expenses + annual_expenses * INFLATION_RATE;
	};
	
});	