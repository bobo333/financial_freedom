var FinancialFreedom = angular.module('FinancialFreedom', ['ngRoute', 'RetirementCalculatorModule', 'CreateRetirementGraphModule', 'ng-currency','ngAnimate']);

FinancialFreedom.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/income', {
        templateUrl: 'partials/income_input.html',
        controller: 'IncomeInputController'
    })
    .when('/assets', {
        templateUrl: 'partials/assets_input.html',
        controller: 'AssetsInputController'
    })
    .when('/expenses', {
        templateUrl: 'partials/expenses_input.html',
        controller: 'ExpensesInputController'
    })
    .when('/time-to-retirement', {
        templateUrl: 'partials/time_to_retirement.html',
        controller: 'TimeToRetirementController'
    })
    .when('/about', {
        templateUrl: 'partials/about.html',
        controller: ''
    })
    .otherwise({
        redirectTo: '/income'
    });
}]);

FinancialFreedom.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);

FinancialFreedom.controller('bodyController', ['$location',  function($location) {
    $location.path("/");
}]);

FinancialFreedom.controller('HeaderController', ['$scope', '$location',  function($scope, $location) {
    $scope.isActive = function(route) {
        return route == $location.path();
    };
    
    $scope.goToRoute = function(route) {
        $location.path(route);
    };

    $scope.tabsAreVisible = function() {
        if ($location.path() == '/about' || $location.path() == '/time-to-retirement') {
            return false;
        }
        else {
            return true;
        }
    };
}]);

FinancialFreedom.controller('IncomeInputController', ['$scope', '$location', 'RetirementCalculatorService', function($scope, $location, RetirementCalculatorService) {
    $scope.income = {};
    $scope.income.value = RetirementCalculatorService.getMonthlyIncome();
    
    $scope.submitForm = function() {
        if ($scope.incomeForm.$valid) {
            RetirementCalculatorService.setMonthlyIncome($scope.income.value);
            $location.path('/assets');
        }  
    };

}]);

FinancialFreedom.controller('AssetsInputController', ['$scope', '$location', 'RetirementCalculatorService', function($scope, $location, RetirementCalculatorService) {
    $scope.assets = {};
    $scope.assets.value = RetirementCalculatorService.getTotalAssets();

    $scope.submitForm = function() {
        if ($scope.assetsForm.$valid) {
            RetirementCalculatorService.setTotalAssets($scope.assets.value);
            $location.path('/expenses');
        }  
    };

}]);

FinancialFreedom.controller('ExpensesInputController', ['$scope', '$location', 'RetirementCalculatorService', function($scope, $location, RetirementCalculatorService) {
    $scope.expenses = {};
    $scope.expenses.value = RetirementCalculatorService.getMonthlyExpenses();

    $scope.submitForm = function() {
        if ($scope.expensesForm.$valid) {
            RetirementCalculatorService.setMonthlyExpenses($scope.expenses.value);
            $location.path('/time-to-retirement');
        }  
    };
}]);

FinancialFreedom.directive("btnOutputControl", function($filter){
    return {
        scope: {},
        restrict: 'E',
        templateUrl: 'partials/output_control.html'
    }
});

FinancialFreedom.controller('TimeToRetirementController', ['$scope', 'RetirementCalculatorService', 'CreateRetirementGraphService', function($scope, RetirementCalculatorService, CreateRetirementGraphService) {
    
    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();

    $(function () {
        $('[data-toggle="popover"]').popover();
    });

    $scope.showSteps = false;
    $scope.penClicked = false;

    $scope.incrementOutputValue = function(output_value, increment) {
        if (output_value == 'expenses') {
            $scope.expenses = $scope.expenses + increment;
        }
        if (output_value == 'income') {
            $scope.income = $scope.income + increment;
        }
        if (output_value == 'assets') {
            $scope.assets = $scope.assets + increment;
        }
        if (output_value == 'incomeincrease') {
            $scope.incomeincrease = $scope.incomeincrease + increment;
        }
        if (output_value == 'expensesincrease') {
            $scope.expensesincrease = $scope.expensesincrease + increment;
        }
        if (output_value == 'growth') {
            $scope.growth = $scope.growth + increment;
        }
    }

    $scope.refreshOutput = function(retirement_data) {

        $scope.retirement = {};
        var months_to_retirement = retirement_data['months'];
        $scope.retirement.years_to_retirement = Math.floor(months_to_retirement / 12);
        $scope.retirement.months_to_retirement = months_to_retirement % 12;
        $scope.retirement.graph_shown = retirement_data.can_retire && !retirement_data.can_retire_immediately;
        $scope.retirement.never_retire_shown = !retirement_data.can_retire && !retirement_data.can_retire_immediately;
        $scope.retirement.already_retired_shown = retirement_data.can_retire_immediately;
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    }
    
    $(window).resize(function() {
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    });

    $scope.income = RetirementCalculatorService.getMonthlyIncome();
    $scope.assets = RetirementCalculatorService.getTotalAssets();
    $scope.expenses = RetirementCalculatorService.getMonthlyExpenses();
    $scope.inflation = RetirementCalculatorService.getInflationRate();
    $scope.incomeincrease = RetirementCalculatorService.getIncomeIncreaseRate();
    $scope.expensesincrease = RetirementCalculatorService.getExpensesIncreaseRate();
    $scope.growth = RetirementCalculatorService.getGrowthRate();

    $scope.$watchGroup(['expenses','income','assets','inflation','incomeincrease','expensesincrease','growth'], function(new_values) {

        RetirementCalculatorService.setMonthlyExpenses(new_values[0]);
        RetirementCalculatorService.setMonthlyIncome(new_values[1]);
        RetirementCalculatorService.setTotalAssets(new_values[2]);
        RetirementCalculatorService.setInflationRate(new_values[3]);
        RetirementCalculatorService.setIncomeIncreaseRate(new_values[4]);
        RetirementCalculatorService.setExpensesIncreaseRate(new_values[5]);
        RetirementCalculatorService.setGrowthRate(new_values[6]);

        var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
        $scope.refreshOutput(retirement_data);
    });
    
}]);

FinancialFreedom.directive("percent", function($filter){
    var p = function(viewValue){ // format model value
        var m = viewValue.match(/^(\d+)\/(\d+)/);
        if (m != null)
          return $filter('number')(parseInt(m[1])/parseInt(m[2]), 1);
        return $filter('number')(parseFloat(viewValue)/100, 1);
    };

    var f = function(modelValue){ // format display value
        return $filter('number')(parseFloat(modelValue)*100, 2) + '%';
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p);
            ctrl.$formatters.unshift(f);
        }
    };
});