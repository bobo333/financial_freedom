var FinancialFreedom = angular.module('FinancialFreedom', ['ngRoute', 'ng-currency','ngAnimate','ui.bootstrap']);

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
    .when('/', {
        templateUrl: 'partials/intro.html',
        controller: 'IntroController'
    })
    .otherwise({
        redirectTo: '/'
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

FinancialFreedom.controller('bodyController', ['$scope', '$location', '$window', 'GoogleAnalyticsService', 'AuthService', 'Session', function($scope, $location, $window, GoogleAnalyticsService, AuthService, Session) {
    
    $location.path("/");

    $scope.isActive = function(route) {
        return route == $location.path();
    };

    $scope.currentUser = $window.sessionStorage["userInfo"];

    $scope.$watch(Session.checkSessionStatus, function(updatedUser) {
        $scope.currentUser = updatedUser;
    });

}]);

FinancialFreedom.controller('IntroController', ['$scope', '$location',  function($scope, $location) {

    $scope.submitForm = function() {
        $location.path('/income');
    };

}]);

FinancialFreedom.controller('HeaderController', ['$scope', '$rootScope', '$location', '$modal', 'AuthService', 'Session', function($scope, $rootScope, $location, $modal, AuthService, Session) {

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
        return route == $location.path();
    };
    
    $scope.goToRoute = function(route) {
        $location.path(route);
    };

    $scope.tabsAreVisible = function() {

        non_visible_pages = [
            '/about',
            '/time-to-retirement',
            '/'
        ];

        return non_visible_pages.indexOf($location.path() ) == -1;
    };

    $scope.openLoginModal = function(size, userStatus) {

        AuthService.data.updateShowSignUp(userStatus);

        var modalInstance = $modal.open({
            templateUrl: 'partials/login_modal.html',
            controller: 'LoginModalInstanceCtrl',
            size: size,
            backdrop: true,
        });
    };

    $scope.openAccountModal = function(size) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/account_modal.html',
            controller: 'AccountModalInstanceCtrl',
            size: size,
            backdrop: true,
        });
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.logout = function() {

        AuthService.data.logout();
        $rootScope.setCurrentUser(null);

    };

    // $scope.showLogoutMessage = Session.showLogoutMessage;

    // $scope.addAlert('success', 'You\'ve been successfully logged out');

}]);


FinancialFreedom.controller('LoginModalInstanceCtrl', ['$scope', '$rootScope', '$modalInstance', '$location', 'AuthService', function ($scope, $rootScope, $modalInstance, $location, AuthService) {    

    $scope.createAccount = function (credentials) {
        AuthService.data.createAccount(credentials);

        if (this.data.success) {
                $rootScope.setCurrentUser(user);
            }

            else {
                console.log(this.data.errors[0]);

                return this.data.errors[0];
            }

    }

    self.login = function (credentials) {

        console.log("thing");

        AuthService.data.login(credentials).then(function (user)  {

            if (this.data.success) {

                Session.create(credentials.email);
                $rootScope.setCurrentUser(user);
            }

            else {
                console.log(this.data.errors[0]);


                return angular.forEach(this.data.errors, function(key, value) {
                    console.log(key);
                    return key;
                });
            }

        }, function () {
            console.log("Login failed")
        });
    };

    $scope.data = AuthService.data;
        $scope.showSignUp = AuthService.data.showSignUp;

}]);

FinancialFreedom.controller('AccountModalInstanceCtrl', ['$scope', '$modalInstance', 'AuthService', function ($scope, $modalInstance, AuthService) {    

    $scope.ok = function() {
        $modalInstance.close();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.passwordResetFormCollapsed = true;

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

FinancialFreedom.controller('AboutController', ['$scope', function($scope) {
    $scope.templates =
    [ { name: 'Privacy Policy', url: 'partials/legal/privacy_policy.html'},
      { name: 'Terms of Service', url: 'partials/legal/terms_of_service.html'} ];
    
    $scope.privacy_is_active = false;
    $scope.privacy_is_toc = false;

    var hideTemplate = function() {
        $scope.template = null;
    };

    $scope.revealLegalDoc = function(doc) {
        if (doc == 'privacy-policy') {
            
            if ($scope.privacy_is_active == true) {
                hideTemplate();
            } else {
                $scope.template = $scope.templates[0];
                $scope.toc_is_active = false;
            }
            $scope.privacy_is_active = !$scope.privacy_is_active;

        }
        else if (doc == 'toc') {
            
            if ($scope.toc_is_active == true) {
                hideTemplate();
            } else {
                $scope.template = $scope.templates[1];
                $scope.privacy_is_active = false;
            }
            $scope.toc_is_active = !$scope.toc_is_active;
        }
    };

}]);


FinancialFreedom.controller('TimeToRetirementController', ['$scope', '$modal', 'RetirementCalculatorService', 'CreateRetirementGraphService', 'AuthService', function($scope, $modal, RetirementCalculatorService, CreateRetirementGraphService, AuthService) {

    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();

    $scope.showSteps = false;
    $scope.editCollapsed = true;

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

        $scope.contributionAmount = RetirementCalculatorService.getMonthlyIncome() - RetirementCalculatorService.getMonthlyExpenses();
        $scope.savingsRate = ((RetirementCalculatorService.getMonthlyIncome() - RetirementCalculatorService.getMonthlyExpenses()) / RetirementCalculatorService.getMonthlyIncome())*100;
    });
    
}]);

FinancialFreedom.directive("percent", function($filter){
    var p = function(viewValue){ // format model value
        var m = viewValue.match(/^(\d+)\/(\d+)/);
        if (m != null)
          return $filter('number')(parseInt(m[1])/parseInt(m[2]), 2);
        return $filter('number')(parseFloat(viewValue)/100, 2);
    };

    var f = function(modelValue){ // format display value
        return $filter('number')(parseFloat(modelValue)*100, 1) + '%';
    };
    
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(p);
            ctrl.$formatters.unshift(f);
        }
    };
});