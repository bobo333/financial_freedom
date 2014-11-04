var FinancialFreedom = angular.module('FinancialFreedom', ['RetirementCalculatorModule']);

FinancialFreedom.controller('SandboxController', ['$scope', 'RetirementCalculatorService', function($scope, RetirementCalculatorService) {
	$scope.time_to_retire = RetirementCalculatorService.calculateYearsToRetirement(70000, 40000, 100000);
}]);