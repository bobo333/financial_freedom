var FinancialFreedom = angular.module('FinancialFreedom', ['ngRoute', 'ng-currency','ngAnimate','ui.bootstrap']);

FinancialFreedom.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/income', {
        templateUrl: 'partials/income_input.html',
        controller: 'IncomeInputController',
        controllerAs: 'income_ctrl'
    })
    .when('/assets', {
        templateUrl: 'partials/assets_input.html',
        controller: 'AssetsInputController',
        controllerAs: 'assets_ctrl'
    })
    .when('/expenses', {
        templateUrl: 'partials/expenses_input.html',
        controller: 'ExpensesInputController',
        controllerAs: 'expenses_ctrl'
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
    .when('/dollars-to-time', {
        templateUrl: 'partials/dollars_to_time.html',
        controller: 'DollarsToTimeController'
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
  };
}]);

FinancialFreedom.controller('bodyController', function($scope, $rootScope, $location, $window, GoogleAnalyticsService, AuthService, Session, UserDataCache) {
    
    $location.path("/");

    $scope.isActive = function(route) {
        return route == $location.path();
    };

    $rootScope.data = Session.data;
        $rootScope.currentUser = Session.data.currentUser;
        $rootScope.email = Session.data.email;

    if ($rootScope.currentUser) {
        UserDataCache.userData.fetchUserData();
    }

});

FinancialFreedom.controller('IntroController', function($scope, $location) {

    $scope.submitForm = function() {
        $location.path('/income');
    };

});

FinancialFreedom.controller('DollarsToTimeController', function($scope, $location, DollarsToTimeService) {

    var dates = DollarsToTimeService.calculateDollarsToTime(0, false, false);

    $scope.dates = {
        years: 0,
        months: 0,
        days: 0
    };

    $scope.calc_values = {
        amount: null,
        expense: true,
        recurring: false
    };

    $scope.$watch('calc_values', function(new_value, old_value) {
        var amount = parseInt($scope.calc_values.amount);

        if ($scope.calc_values.amount === '' || $scope.calc_values.amount === NaN || isNaN(amount)) {
            amount = 0;
        }

        dates = DollarsToTimeService.calculateDollarsToTime(amount, $scope.calc_values.expense, $scope.calc_values.recurring);

        $scope.dates.years = dates.difference.years;
        $scope.dates.months = dates.difference.months;
        $scope.dates.days = dates.difference.days;
    }, true);

});

FinancialFreedom.controller('HeaderController', function($scope, $rootScope, $location, $modal, AuthService, Session) {

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
        return route == $location.path();
    };
    
    $scope.goToRoute = function(route) {
        $location.path(route);
    };

    $scope.tabsAreVisible = function() {

        non_visible_pages = [
            '/dollars-to-time',
            '/about',
            '/time-to-retirement',
            '/'
        ];

        return non_visible_pages.indexOf($location.path() ) == -1;
    };

    $scope.openLoginModal = function(size, showSignUp) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/login_modal.html',
            controller: 'LoginModalInstanceCtrl',
            size: size,
            backdrop: true,
            resolve: {
                showSignUp: function() {
                    return showSignUp;
                }
            }
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
        $scope.goToRoute('/');
    };

});

FinancialFreedom.controller('LoginModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, $location, $timeout, AuthService, Session, UserDataCache, showSignUp) {    

    $scope.loginFailureMessage = '';
    $scope.signUpFailureMessage = '';

    $scope.goToRoute = function(route) {
        $location.path(route);
    };

    $scope.createAccount = function (credentials) {

        AuthService.data.createAccount(credentials).then(function(user) {

            if (this.data.success) {
                Session.data.create(credentials.email);
                $modalInstance.close();
            }

            else {
                $scope.signUpFailureMessage = "Email already in use. Either sign in or try a different one.";

                return angular.forEach(this.data.errors, function(key, value) {
                    return key;
                });
            } 
        });
    };

    $scope.login = function (credentials) {

        AuthService.data.login(credentials).then(function (user)  {

            if (this.data.success) {

                Session.data.create(credentials.email);
                UserDataCache.userData.fetchUserData();
                $modalInstance.close();
                $timeout(function() {
                    $scope.goToRoute('/time-to-retirement');
                },500);
            }

            else {

                $scope.loginFailureMessage = "Your email or password was incorrect. Please try again.";

                return angular.forEach(this.data.errors, function(key, value) {
                    return key;
                });
            }

        }, function () {
            $scope.loginFailureMessage = "Login attempt failed. Check your internet connection and try again.";
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.showSignUp = showSignUp;

});

FinancialFreedom.controller('AccountModalInstanceCtrl', function ($scope, $modalInstance, UserDataCache, AuthService) {    

    $scope.ok = function() {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.passwordResetFormCollapsed = true;

    $scope.userEmail = UserDataCache.userData.email;
    $scope.userCreatedAt = UserDataCache.userData.created_at;

    $scope.setPassword = function (credentials) {

        AuthService.data.resetPassword(credentials).then(function ()  {

            if (!this.data.success) {
                
                $scope.resetPasswordFailureMessage = "Your attempt to reset your password failed.";

                return angular.forEach(this.data.errors, function(key, value) {
                    return key;
                });
            }

            else {
                $scope.passwordResetFormCollapsed = true;
            }

        }, function () {
            $scope.loginFailureMessage = "Login attempt failed. Check your internet connection and try again.";
        });
    };


});

FinancialFreedom.controller('IncomeInputController', function($scope, $location, UserDataCache) {
    
    var vm = this;
    vm.income = UserDataCache.userData.monthly_income;
    
    vm.submitForm = function() {

        UserDataCache.userData.monthly_income = vm.income;
        $location.path('/assets');

    };

});

FinancialFreedom.controller('AssetsInputController', function($scope, $location, UserDataCache) {

    var vm = this;
    vm.assets = UserDataCache.userData.total_assets;

    vm.submitForm = function() {
        UserDataCache.userData.total_assets = vm.assets;
        $location.path('/expenses');
    };

});

FinancialFreedom.controller('ExpensesInputController', function($scope, $location, UserDataCache) {

    var vm = this;
    vm.expenses = UserDataCache.userData.monthly_expenses;

    vm.submitForm = function() {
        UserDataCache.userData.monthly_expenses = vm.expenses;
        $location.path('/time-to-retirement');
    };

});

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


FinancialFreedom.controller('TimeToRetirementController', function($scope, $modal, RetirementCalculatorService, CreateRetirementGraphService, AuthService, UserDataCache) {

    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();

    $scope.showSteps = false;
    $scope.editCollapsed = true;

    $scope.openLoginModal = function(size, showSignUp) {

        var modalInstance = $modal.open({
            templateUrl: 'partials/login_modal.html',
            controller: 'LoginModalInstanceCtrl',
            size: size,
            backdrop: true,
            resolve: {
                showSignUp: function() {
                    return showSignUp;
                }
            }
        });
    };

    $scope.incrementOutputValue = function(output_value, increment) {
        if (output_value == 'expenses') {
            $scope.userData.expenses += increment;
        }
        if (output_value == 'income') {
            $scope.userData.income += increment;
        }
        if (output_value == 'assets') {
            $scope.userData.assets += increment;
        }
        if (output_value == 'incomeincrease') {
            $scope.userData.incomeincrease += increment;
        }
        if (output_value == 'expensesincrease') {
            $scope.userData.expensesincrease += increment;
        }
        if (output_value == 'growth') {
            $scope.userData.growth += increment;
        }
    };

    $scope.refreshOutput = function(retirement_data) {

        $scope.retirement = {};
        var months_to_retirement = retirement_data.months;
        $scope.retirement.years_to_retirement = Math.floor(months_to_retirement / 12);
        $scope.retirement.months_to_retirement = months_to_retirement % 12;
        $scope.retirement.graph_shown = retirement_data.can_retire && !retirement_data.can_retire_immediately;
        $scope.retirement.never_retire_shown = !retirement_data.can_retire && !retirement_data.can_retire_immediately;
        $scope.retirement.already_retired_shown = retirement_data.can_retire_immediately;
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    };
    
    $(window).resize(function() {
        CreateRetirementGraphService.createRetirementGraph(retirement_data);
    });

    $scope.loadData = function() {
        $scope.userData = UserDataCache.userData;
        
        $scope.userData.expenses = UserDataCache.userData.monthly_expenses;
        $scope.userData.income = UserDataCache.userData.monthly_income;
        $scope.userData.assets = UserDataCache.userData.total_assets;
        $scope.userData.incomeincrease = UserDataCache.userData.income_increase_rate;
        $scope.userData.expensesincrease = UserDataCache.userData.expenses_increase_rate;
        $scope.userData.growth = UserDataCache.userData.growth_rate;
    };

    $scope.$watch(AuthService.data.isAuthenticated, function() {
        $scope.loadData();
    });

    $scope.$watchGroup(['userData.expenses','userData.income','userData.assets','userData.incomeincrease','userData.expensesincrease','userData.growth'], function(new_values) {

        UserDataCache.userData.setMonthlyExpenses(new_values[0]);
        UserDataCache.userData.setMonthlyIncome(new_values[1]);
        UserDataCache.userData.setTotalAssets(new_values[2]);
        UserDataCache.userData.setIncomeIncreaseRate(new_values[3]);
        UserDataCache.userData.setExpensesIncreaseRate(new_values[4]);
        UserDataCache.userData.setGrowthRate(new_values[5]);

        var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
        $scope.refreshOutput(retirement_data);

        $scope.contributionAmount = UserDataCache.userData.monthly_income - UserDataCache.userData.monthly_expenses;
        $scope.savingsRate = ((UserDataCache.userData.monthly_income - UserDataCache.userData.monthly_expenses) / UserDataCache.userData.monthly_income)*100;
    });
    
});

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

var INITIAL_CALCULATOR_CONSTANTS = {
    
        "withdrawal_rate" : 0.04,
        "inflation_rate" : 0.035,
        "income_increase_rate" : 0.05,
        "growth_rate" : 0.075
};

function UserDataCache(INITIAL_CALCULATOR_CONSTANTS, UserDataService) {

    var userData = {};

    userData.email = '';
    userData.created_at = null;
    userData.monthly_income  = null;
    userData.total_assets  = null;
    userData.monthly_expenses  = null;
    userData.income_increase_rate = INITIAL_CALCULATOR_CONSTANTS.income_increase_rate;
    userData.expenses_increase_rate = INITIAL_CALCULATOR_CONSTANTS.inflation_rate;
    userData.growth_rate = INITIAL_CALCULATOR_CONSTANTS.growth_rate;

    userData.getUserData = function() {
        return userData;
    };

    userData.fetchUserData = function() {

        UserDataService.data.getUserData().then(function(data) {

            fetched_user_data = data.data.user_data;

            userData.email = fetched_user_data.email;
            userData.created_at = fetched_user_data.created_at;
            userData.monthly_income  = fetched_user_data.monthly_income;
            userData.total_assets  = fetched_user_data.total_assets;
            userData.monthly_expenses  = fetched_user_data.monthly_expenses;
            userData.income_increase_rate = fetched_user_data.income_growth_rate;
            userData.expenses_increase_rate = fetched_user_data.expenses_growth_rate;
            userData.growth_rate = fetched_user_data.investment_growth_rate;

        });
    };

    userData.resetUserData = function() {

        userData.email = '';
        userData.created_at = null;
        userData.monthly_income = null;
        userData.total_assets  = null;
        userData.monthly_expenses  = null;
        userData.income_increase_rate = INITIAL_CALCULATOR_CONSTANTS.income_increase_rate;
        userData.expenses_increase_rate = INITIAL_CALCULATOR_CONSTANTS.inflation_rate;
        userData.growth_rate = INITIAL_CALCULATOR_CONSTANTS.growth_rate;
    };

    userData.setMonthlyIncome = function(monthly_income) {

        userData.monthly_income = monthly_income;

        var new_monthly_income = {
            'monthly_income': monthly_income
        };

        UserDataService.data.updateUserData(new_monthly_income);
    };

    userData.setTotalAssets = function(total_assets) {

        userData.total_assets = total_assets;
        var new_total_assets = {
            'total_assets': total_assets
        };
        
        UserDataService.data.updateUserData(new_total_assets);
    };
    
    userData.setMonthlyExpenses = function(monthly_expenses) {

        userData.monthly_expenses = monthly_expenses;
        var new_monthly_expenses = {
            'monthly_expenses': monthly_expenses
        };
        
        UserDataService.data.updateUserData(new_monthly_expenses);
    };

    userData.setIncomeIncreaseRate = function(income_increase_rate) {

        userData.income_increase_rate = income_increase_rate;
        var new_income_increase_rate = {
            'income_growth_rate': income_increase_rate
        };
        
        UserDataService.data.updateUserData(new_income_increase_rate);
    };

    userData.setExpensesIncreaseRate = function(expenses_increase_rate) {

        userData.expenses_increase_rate = expenses_increase_rate;
        var new_expenses_increase_rate = {
            'expenses_growth_rate' : expenses_increase_rate
        };
        
        UserDataService.data.updateUserData(new_expenses_increase_rate );
    };

    userData.setGrowthRate = function(growth_rate) {

        userData.growth_rate = growth_rate;
        var new_growth_rate = {
            'investment_growth_rate' : growth_rate
        };

        UserDataService.data.updateUserData(new_growth_rate);

    };

    return {
        userData : userData
    };

}

function compareTo () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
}

FinancialFreedom.directive("compareTo", compareTo);
FinancialFreedom.constant('INITIAL_CALCULATOR_CONSTANTS',INITIAL_CALCULATOR_CONSTANTS);
FinancialFreedom.factory("UserDataCache",UserDataCache);
