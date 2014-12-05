describe('Unit: TimeToRetirementController', function() {

	beforeEach(module('FinancialFreedom'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	describe('months_to_retirement', function() {
		it('is retrieved successfully', function() {
			var $scope = {};
			var controller = $controller('TimeToRetirementController', { $scope: $scope });
			$scope.retirement.can_be_reached = false;
			expect($scope.retirement.can_be_reached).toBeFalsy();
		});
	});
});