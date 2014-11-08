var FinancialFreedom = angular.module('FinancialFreedom', ['RetirementCalculatorModule']);

FinancialFreedom.controller('RetirementCalculatorController', 
    ['$scope', 'RetirementCalculatorService',  function($scope, RetirementCalculatorService) {
    $scope.retirement = {
        net_worth: '',
        annual_expenses: '',
        annual_salary: '',
        years_to_retirement: '???'
    };
    
    $scope.calculateYearsToRetirement = function() {
        net_worth = parseInt($scope.retirement.net_worth);
        annual_expenses = parseInt($scope.retirement.annual_expenses);
        annual_salary = parseInt($scope.retirement.annual_salary);
    
        years = RetirementCalculatorService.calculateYearsToRetirement(net_worth, annual_salary, annual_expenses);
        $scope.retirement.years_to_retirement = years;
    };

}]);