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
    $location.path("/")
}]);

FinancialFreedom.controller('HeaderController', ['$scope', '$location',  function($scope, $location) {
    $scope.isActive = function(route) {
        return route == $location.path();
    };
    
    $scope.goToRoute = function(route) {
        $location.path(route);
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

FinancialFreedom.controller('TimeToRetirementController', ['$scope', 'RetirementCalculatorService', 'CreateRetirementGraphService', function($scope, RetirementCalculatorService, CreateRetirementGraphService) {
    $scope.retirement = {};
    var tooltip_selector;
    
    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
    console.log(retirement_data);
    var months_to_retirement = retirement_data['months'];
    $scope.retirement.years_to_retirement = Math.floor(months_to_retirement / 12);
    $scope.retirement.months_to_retirement = months_to_retirement % 12;
    $scope.retirement.graph_shown = retirement_data.can_retire && !retirement_data.can_retire_immediately;
    $scope.retirement.never_retire_shown = !retirement_data.can_retire && !retirement_data.can_retire_immediately;
    $scope.retirement.already_retired_shown = retirement_data.can_retire_immediately;
    
    CreateRetirementGraphService.createRetirementGraph(retirement_data);
    
    $(window).resize(function() {
        if ($(".tooltip").length > 0) {
            $(tooltip_selector).tooltip('destroy');
        }
        
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    });
    
}]);

FinancialFreedom.controller('OutputSettingsController', ['$scope', 'RetirementCalculatorService', 'CreateRetirementGraphService', function($scope, RetirementCalculatorService, CreateRetirementGraphService) {

    $scope.income = RetirementCalculatorService.getMonthlyIncome();
    $scope.assets = RetirementCalculatorService.getTotalAssets();
    $scope.expenses = RetirementCalculatorService.getMonthlyExpenses();
    $scope.inflation = RetirementCalculatorService.getInflationRate();
    $scope.incomeincrease = RetirementCalculatorService.getIncomeIncreaseRate();
    $scope.growth = RetirementCalculatorService.getGrowthRate();

    $scope.$watch('expenses', function(new_value) {
        RetirementCalculatorService.setMonthlyExpenses(new_value);
        var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
        if ($(".tooltip").length > 0) {
            $(tooltip_selector).tooltip('destroy');
        }
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    });

}]);

FinancialFreedom.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);
