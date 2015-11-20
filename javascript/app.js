var FinancialFreedom = angular.module('FinancialFreedom', ['ng-currency','ngAnimate','ui.bootstrap', 'ui.router']);

FinancialFreedom.run(function($rootScope, $state, $stateParams, UserDataCache) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if (toState.data.requiredForAccess === 'hasData' && !UserDataCache.userData.hasData() ) {
                event.preventDefault();
                if (fromState.name === 'intro') {
                    $state.go('income');
                    return false;
                }
                else {
                    $state.go('intro');
                    return false;
                }
            }
            else if (toState.data.requiredForAccess === 'hasIncome' && !UserDataCache.userData.monthly_income ) {
                event.preventDefault();
                $state.go('income');
                return false;
            }
            else if (toState.data.requiredForAccess === 'hasIncomeAndAssets' && !UserDataCache.userData.total_assets ) {
                event.preventDefault();
                $state.go('assets');
                return false;
            }
    });
});

FinancialFreedom.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('intro', {
            url: '/',
            templateUrl: 'partials/intro.html',
            data: { requiredForAccess: null }
        })
        .state('income', {
            url: '/income',
            templateUrl: 'partials/income_input.html',
            controller: 'InputController',
            data: { requiredForAccess: null }
        })
        .state('assets', {
            url: '/assets',
            templateUrl: 'partials/assets_input.html',
            controller: 'InputController',
            data: { requiredForAccess: "hasIncome" }
        })
        .state('expenses', {
            url: '/expenses',
            templateUrl: 'partials/expenses_input.html',
            controller: 'InputController',
            data: { requiredForAccess: "hasIncomeAndAssets" }
        })
        .state('time-to-retirement', {
            url: '/time-to-retirement',
            templateUrl: 'partials/time_to_retirement.html',
            controller: 'TimeToRetirementController',
            data: { requiredForAccess: "hasData" }
        })
        .state('about', {
            url: '/about',
            templateUrl: 'partials/about.html',
            data: { requiredForAccess: null }
        })
        .state('privacy', {
            url: '/privacy',
            templateUrl: 'partials/legal/privacy_policy.html',
            data: { requiredForAccess: null }
        })
        .state('terms-of-service', {
            url: '/terms-of-service',
            templateUrl: 'partials/legal/terms_of_service.html',
            data: { requiredForAccess: null }

            })
        .state('dollars-to-time', {
            url: '/dollars-to-time?:amount&:expense&:recurring&:useCustomVals',
            templateUrl: 'partials/dollars_to_time.html',
            controller: 'DollarsToTimeController',
            data: { requiredForAccess: null }
        });
});

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

FinancialFreedom.controller('bodyController', function($scope, $rootScope, $window, GoogleAnalyticsService, AuthService, Session, UserDataCache, modalService) {

    $rootScope.data = Session.data;
    $rootScope.currentUser = Session.data.currentUser;
    $rootScope.email = Session.data.email;

    if ($rootScope.currentUser) {
        UserDataCache.userData.fetchUserData();
    }

    $scope.openFeedbackModal = function() {
        modalService.showModal({}, 'feedbackModalOptions');
    };

});

FinancialFreedom.controller('DollarsToTimeController', function($scope, $state, $stateParams, DollarsToTimeService, UserDataCache) {
    var dates;
    var params = $stateParams;
    var customVals = null;
    $scope.input_error_message = {};

    $scope.dates = {
        years: '-',
        months: '-',
        days: '-'
    };

    function processParams(params) {

        var processedParams = {};

        angular.forEach(params, function(value, key) {

            var newVal;

            if (key === 'amount') {

                if  (value === undefined) {
                    processedParams[key] = null;
                }
                else {
                    processedParams[key] = value;
                }
            }
            else if ((key === 'useCustomVals') && (value === 'false')) {
                if (!UserDataCache.userData.hasData()) {
                    processedParams[key] = true;
                }
            }
            else {
                newVal = (value === "true");
                processedParams[key] = newVal;
            }
        });

        return processedParams;
    }

    var default_calc_values = {
        amount: null,
        expense: true,
        recurring: true,
        useCustomVals: true
    };

    if (UserDataCache.userData.hasData()) {
        default_calc_values.useCustomVals = false;
    }

    if (params.expense !== undefined) {
        var processedParams = processParams(params);
        $scope.calc_values = processedParams;
    }
    else {
        $scope.calc_values = default_calc_values;
    }

    $scope.convert = function() {

        var amount = parseInt($scope.calc_values.amount);

        if ($scope.calc_values.amount === '' || isNaN($scope.calc_values.amount) || isNaN(amount)) {
            clearOutput();
            return;
        }

        $scope.preconvert = false;

        if ($scope.calc_values.useCustomVals) {

            customVals = {
                monthly_income: 4328.25,
                total_assets: 0,
                monthly_expenses: 4111.84,
                income_increase_rate: 0.03,
                growth_rate: 0.085,
                expenses_increase_rate: 0.03
            };
        }
        else {
            customVals = null;
        }

        var newParams = {
            amount: amount,
            expense: $scope.calc_values.expense,
            recurring: $scope.calc_values.recurring,
            useCustomVals: $scope.calc_values.useCustomVals
        };

        var stateOptions = {
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false
        };

        $state.transitionTo('dollars-to-time', newParams, stateOptions);
        updateTimeOutput(amount, customVals, newParams);
    };

    function clearOutput() {
        amount = 0;
        $scope.preconvert = true;

        angular.forEach($scope.dates, function(value, key) {
            value = '-';
            $scope.dates[key] = value;
        });
    }

    function updateTimeOutput(amount, customVals, newParams) {

        dates = DollarsToTimeService.calculateDollarsToTime(amount, $scope.calc_values.expense, $scope.calc_values.recurring, customVals);

        $scope.dates.more_years_to_retirement = dates.more_years_to_retirement ? dates.more_years_to_retirement : 0;
        $scope.dates.fewer_years_to_retirement = dates.fewer_years_to_retirement ? dates.fewer_years_to_retirement : 0;
        $scope.dates.more_months_to_retirement = dates.more_months_to_retirement ? dates.more_months_to_retirement : 0;
        $scope.dates.fewer_months_to_retirement = dates.fewer_months_to_retirement ? dates.fewer_months_to_retirement : 0;

        if (dates.difference) {
            $scope.dates.years = dates.difference.years;
            $scope.dates.months = dates.difference.months;
            $scope.dates.days = dates.difference.days;
        }

        if (dates.more_years_to_retirement >= 100) {
            clearOutput();
            $scope.input_error_message = {
                    alreadyRetired: false,
                    messageCopy: "The number you entered results in never reaching financial independence. Lower it to get a conversion."
            };
        }

        else if (dates.fewer_years_to_retirement === 0 && dates.fewer_months_to_retirement <= 1){
            clearOutput();
            $scope.input_error_message = {
                    alreadyRetired: true,
                    messageCopy: "The number you entered results in financial independence already being reached."
            };
        }
        else {
            $scope.input_error_message = {};
        }
    }

    $scope.showUsersValues = function() {
        if (!UserDataCache.userData.hasData()) {
            $state.go('income');
            DollarsToTimeService.redirectToConverter = true;
        }
        else {
            $scope.switchInputVals('you');
        }
    };

    $scope.switchInputVals = function(sourceElement) {
        if ((sourceElement === 'you') && ($scope.calc_values.useCustomVals === true)) {
            $scope.calc_values.useCustomVals = false;
        }

        if ((sourceElement === 'american') && ($scope.calc_values.useCustomVals === false)) {
            $scope.calc_values.useCustomVals = true;
        }
    };

    $scope.$watch('calc_values', function(new_value, old_value) {
        $scope.convert();
    }, true);
});

FinancialFreedom.controller('HeaderController', function($scope, $rootScope, $state, AuthService, Session, UserDataCache, modalService, DollarsToTimeService) {

    $scope.isCollapsed = true;

    $scope.showCountdownNavItem = function() {
        return UserDataCache.userData.hasData();
    };

    $scope.openLoginModal = function() {
        modalService.showModal({}, 'loginModalOptions');
    };

    $scope.openSignUpModal = function() {
        modalService.showModal({}, 'signUpModalOptions');
    };

    $scope.openAccountModal = function() {
        modalService.showModal({}, 'accountModalOptions');
    };

    $scope.logout = function() {
        AuthService.data.logout();
        $state.go('intro', {} );
    };

});

FinancialFreedom.controller('LoginModalInstanceCtrl', function ($scope, $rootScope, $timeout, AuthService, Session, UserDataCache, $modalInstance, modalService) {

    $scope.showSignUp = modalService.showSignUp;

    $scope.loginFailureMessage = '';
    $scope.signUpFailureMessage = '';

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
                    $state.go('time-to-retirement');
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

FinancialFreedom.controller('InputController', function($scope, $state, UserDataCache, DollarsToTimeService) {

    $scope.inputVal = {};

    $scope.inputVal.income = UserDataCache.userData.monthly_income;
    $scope.inputVal.assets = UserDataCache.userData.total_assets;
    $scope.inputVal.expenses = UserDataCache.userData.monthly_expenses;

    $scope.$watchGroup(['inputVal.income','inputVal.assets','inputVal.expenses'], function(new_values) {
        UserDataCache.userData.monthly_income = new_values[0];
        UserDataCache.userData.total_assets = new_values[1];
        UserDataCache.userData.monthly_expenses = new_values[2];
    });

    $scope.nextSetupStep = function() {
        if ($state.current.name === 'income') {
            $state.go('assets');
        }

        else if ($state.current.name === 'assets') {
            $state.go('expenses');
        }

        else if ($state.current.name === 'expenses') {
            if (DollarsToTimeService.redirectToConverter) {
                $state.go('dollars-to-time');
            }
            else {
                $state.go('time-to-retirement');
            }
        }
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

}]);


FinancialFreedom.controller('TimeToRetirementController', function($scope, RetirementCalculatorService, CreateRetirementGraphService, AuthService, UserDataCache, modalService) {

    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();

    $scope.showSteps = false;
    $scope.editCollapsed = true;

    $scope.openLoginModal = function() {
        modalService.showModal({}, 'signUpModalOptions').then(function (result) {});
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
        var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
        $scope.refreshOutput(retirement_data);
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
        if (m !== null)
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

FinancialFreedom.controller('FeedbackCtrl', function ($scope, $window, modalService, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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

    userData.hasData = function() {
        return userData.monthly_income && userData.total_assets && userData.monthly_expenses;
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

function aboundFooter () {
    return {
        restrict: 'E',
        templateUrl: 'partials/footer.html'
    };
}

function aboundHeader () {
    return {
        restrict: 'E',
        templateUrl: 'partials/header.html'
    };
}

function stepHeader () {
    return {
        restrict: 'E',
        templateUrl: 'partials/step_header.html'
    };
}

function feedbackBox () {
    return {
        restrict: 'E',
        templateUrl: 'partials/feedback_box.html'
    };
}

FinancialFreedom.directive("aboundFooter", aboundFooter);
FinancialFreedom.directive("aboundHeader", aboundHeader);
FinancialFreedom.directive("feedbackBox", feedbackBox);
FinancialFreedom.directive("compareTo", compareTo);
FinancialFreedom.directive("stepHeader", stepHeader);
FinancialFreedom.constant('INITIAL_CALCULATOR_CONSTANTS',INITIAL_CALCULATOR_CONSTANTS);
FinancialFreedom.factory("UserDataCache",UserDataCache);
